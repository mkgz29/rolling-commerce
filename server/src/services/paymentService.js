import { MercadoPagoComfig, Preference } from "mercadopago";
import mongoose from "mongoose";
import Product from "../models/products.js";


const client = new MercadoPagoComfig({
  access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

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

const createMercadoPagoPreference = async ({ items = [], checkoutData = {} }) => {
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

  const preference = new Preference(client);

const response = await preference.create({
  body: {
    items: preferenceItems.map((item) => ({
      title: item.title,
      quantity: item.quantity,
      unit_price: Number(item.unitPrice),
      currency_id: "ARS",
    })),

    payer: {
      name: sanitizedCheckoutData.fullName,
      email: sanitizedCheckoutData.email,
    },

    back_urls: {
      success: "http://localhost:5173/payment-success",
      failure: "http://localhost:5173/payment-failure",
      pending: "http://localhost:5173/payment-pending",
    },

    auto_return: "Aprobado",
  },
});

return {
  checkoutUrl: response.init_point,
};
};

export { createMercadoPagoPreference };
