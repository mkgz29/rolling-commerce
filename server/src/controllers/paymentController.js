import { createMercadoPagoPreference } from "../services/paymentService.js";
import { getMercadoPagoAccessTokenInfo } from "../config/mercadoPago.js";

const getSafeCheckoutLog = (checkoutData = {}) => ({
  hasFullName: Boolean(checkoutData.fullName),
  hasEmail: Boolean(checkoutData.email),
  hasPhone: Boolean(checkoutData.phone),
  country: checkoutData.country,
  state: checkoutData.state,
  city: checkoutData.city,
  zip: checkoutData.zip,
  delivery: checkoutData.delivery,
});

export const createMercadoPagoPreferenceController = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.info("[MercadoPago] Preference request received", {
      userId: req.user.id,
      token: getMercadoPagoAccessTokenInfo(),
      itemCount: Array.isArray(req.body?.items) ? req.body.items.length : 0,
      items: Array.isArray(req.body?.items)
        ? req.body.items.map((item) => ({
            productId: item.productId || item.id || null,
            quantity: item.quantity,
          }))
        : [],
      checkoutData: getSafeCheckoutLog(req.body?.checkoutData),
    });

    const preferenceData = await createMercadoPagoPreference({
      items: req.body?.items,
      checkoutData: req.body?.checkoutData,
      userId: req.user.id,
    });

    return res.status(200).json(preferenceData);
  } catch (error) {
    const validationMessages = [
      "Missing checkout fields",
      "Invalid email format",
      "Invalid phone format",
      "Invalid zip format",
      "Invalid delivery method",
      "Payment preference requires",
      "Invalid product ID format",
      "Invalid item quantity",
      "Product not found",
      "Insufficient stock",
      "Missing MERCADOPAGO_ACCESS_TOKEN",
    ];
    const isValidationError =
      error.statusCode === 400 || validationMessages.some((message) => error.message.includes(message));
    const statusCode = error.message.includes("Missing MERCADOPAGO_ACCESS_TOKEN") ? 500 : isValidationError ? 400 : 500;

    console.error(error);
    console.error("[MercadoPago] Preference creation failed", {
      statusCode,
      message: error.message,
      cause: error.cause,
      mercadoPagoStatus: error.status,
      mercadoPagoCause: error.cause,
      mercadoPagoPayload: error.mercadoPagoPayload,
      userId: req.user?.id,
      itemCount: Array.isArray(req.body?.items) ? req.body.items.length : 0,
    });

    return res.status(statusCode).json({
      message: isValidationError && statusCode === 400 ? error.message : "Error creating Mercado Pago preference",
    });
  }
};
