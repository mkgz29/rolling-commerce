import { MercadoPagoConfig, Preference } from "mercadopago";
import mongoose from "mongoose";
import Product from "../models/products.js";
import Order from "../models/order.js";
import { getMercadoPagoAccessToken, getMercadoPagoAccessTokenInfo } from "../config/mercadoPago.js";

const sanitizeText = (value = "", maxLength = 120) =>
  String(value)
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/[<>$`{}]/g, "")
    .trim()
    .slice(0, maxLength);

const sanitizeEmail = (value = "") => sanitizeText(value, 160).toLowerCase();

const validateCheckoutData = (checkoutData = {}) => {
  const sanitized = {
    fullName: sanitizeText(checkoutData.fullName, 100),
    email: sanitizeEmail(checkoutData.email),
    phone: sanitizeText(checkoutData.phone, 40),
    country: sanitizeText(checkoutData.country, 80),
    state: sanitizeText(checkoutData.state, 80),
    city: sanitizeText(checkoutData.city, 80),
    zip: sanitizeText(checkoutData.zip, 20),
    address: sanitizeText(checkoutData.address, 160),
    delivery: sanitizeText(checkoutData.delivery, 20),
  };

  const requiredFields = ["fullName", "email", "phone", "country", "state", "city", "zip", "address", "delivery"];
  const missingFields = requiredFields.filter((field) => !sanitized[field]);

  if (missingFields.length > 0) {
    throw new Error(`Missing checkout fields: ${missingFields.join(", ")}`);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitized.email)) {
    throw new Error("Invalid email format");
  }

  if (!/^[\d\s()+-]{7,25}$/.test(sanitized.phone)) {
    throw new Error("Invalid phone format");
  }

  if (!/^[a-zA-Z0-9\s-]{3,20}$/.test(sanitized.zip)) {
    throw new Error("Invalid zip format");
  }

  if (!["delivery", "pickup"].includes(sanitized.delivery)) {
    throw new Error("Invalid delivery method");
  }

  return sanitized;
};

const normalizeRequestedItems = (items = []) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Payment preference requires at least one item");
  }

  return items.map((item) => {
    const productId = String(item.productId || item.id || "").trim();
    const quantity = Number(item.quantity);

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error("Invalid product ID format");
    }

    if (!Number.isInteger(quantity) || quantity <= 0 || quantity > 99) {
      throw new Error("Invalid item quantity");
    }

    return { productId, quantity };
  });
};

const getClientUrl = () =>
  (process.env.CLIENT_URL || process.env.PUBLIC_SITE_URL || process.env.FRONTEND_URL || "http://localhost:5173").trim().replace(/\/+$/, "");

const getBackendUrl = () => (process.env.BACKEND_URL || process.env.PUBLIC_API_URL || "").trim().replace(/\/+$/, "");

const isPublicUrl = (value) => {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) && !["localhost", "127.0.0.1", "::1"].includes(url.hostname);
  } catch {
    return false;
  }
};

const createMercadoPagoClient = () =>
  new MercadoPagoConfig({
    accessToken: getMercadoPagoAccessToken(),
  });

const getCheckoutUrl = (response) => {
  const tokenInfo = getMercadoPagoAccessTokenInfo();

  if (tokenInfo.prefix === "TEST-") {
    return response.sandbox_init_point || response.init_point;
  }

  return response.init_point || response.sandbox_init_point;
};

const getSafePreferencePayloadForLog = (body) => ({
  ...body,
  payer: body.payer
    ? {
        ...body.payer,
        email: body.payer.email ? "[redacted-email]" : undefined,
      }
    : undefined,
});

const buildPreferenceBody = ({ preferenceItems, sanitizedCheckoutData, order }) => {
  const clientUrl = getClientUrl();
  const backendUrl = getBackendUrl();
  const body = {
    items: preferenceItems.map((item) => ({
      id: item.productId,
      title: item.title,
      quantity: Number(item.quantity),
      unit_price: Number(item.unitPrice),
      currency_id: "ARS",
    })),

    payer: {
      name: sanitizedCheckoutData.fullName,
      email: sanitizedCheckoutData.email,
    },

    back_urls: {
      success: `${clientUrl}/success`,
      failure: `${clientUrl}/failure`,
      pending: `${clientUrl}/pending`,
    },

    external_reference: order._id.toString(),

    ...(isPublicUrl(clientUrl) && {
      auto_return: "approved",
    }),
  };

  if (backendUrl && isPublicUrl(backendUrl)) {
    body.notification_url = `${backendUrl}/api/webhooks/webhook`;
  }

  return body;
};

const createMercadoPagoPreference = async ({
  items = [],
  checkoutData = {},
  userId,
}) => {
  const sanitizedCheckoutData = validateCheckoutData(checkoutData);
  const requestedItems = normalizeRequestedItems(items);
  const productIds = requestedItems.map((item) => item.productId);
  const products = await Product.find({
    _id: { $in: productIds },
    isActive: { $ne: false },
  }).select("name price stock isActive");

  const productsById = new Map(products.map((product) => [String(product._id), product]));

  const preferenceItems = requestedItems.map((item) => {
    const product = productsById.get(String(item.productId));

    if (!product) {
      throw new Error("Product not found or inactive");
    }

    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for product "${product.name}"`);
    }

    return {
      productId: String(product._id),
      title: product.name,
      quantity: item.quantity,
      unitPrice: product.price,
      subtotal: Number((product.price * item.quantity).toFixed(2)),
    };
  });

  const total = Number(preferenceItems.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2));

  const order = await Order.create({
    userId,

    items: preferenceItems.map((item) => ({
      productId: item.productId,
      name: item.title,
      price: item.unitPrice,
      quantity: item.quantity,
    })),

    total,

    status: "pending",
  });

  const preferenceBody = buildPreferenceBody({ preferenceItems, sanitizedCheckoutData, order });

  console.info("[MercadoPago] Creating preference", {
    orderId: order._id.toString(),
    userId: String(userId),
    token: getMercadoPagoAccessTokenInfo(),
    itemCount: preferenceBody.items.length,
    total,
    clientUrl: getClientUrl(),
    backendUrl: getBackendUrl() || null,
    backUrls: preferenceBody.back_urls,
    autoReturn: preferenceBody.auto_return || null,
    hasNotificationUrl: Boolean(preferenceBody.notification_url),
    items: preferenceBody.items,
  });

  const preference = new Preference(createMercadoPagoClient());
  let response;

  try {
    response = await preference.create({ body: preferenceBody });
  } catch (error) {
    error.mercadoPagoPayload = getSafePreferencePayloadForLog(preferenceBody);
    throw error;
  }

  console.info("[MercadoPago] Preference created", {
    orderId: order._id.toString(),
    preferenceId: response.id,
    hasInitPoint: Boolean(response.init_point),
    hasSandboxInitPoint: Boolean(response.sandbox_init_point),
    checkoutUrlType:
      getMercadoPagoAccessTokenInfo().prefix === "TEST-" && response.sandbox_init_point
        ? "sandbox_init_point"
        : "init_point",
  });

  return {
    preferenceId: response.id,
    checkoutUrl: getCheckoutUrl(response),
  };
};

export { createMercadoPagoPreference };
