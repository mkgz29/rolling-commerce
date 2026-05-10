import { createMercadoPagoPreference } from "../services/paymentService.js";

export const createMercadoPagoPreferenceController = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const preferenceData = await createMercadoPagoPreference({
      items: req.body?.items,
      checkoutData: req.body?.checkoutData,
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
    ];
    const isValidationError = validationMessages.some((message) => error.message.includes(message));

    return res.status(isValidationError ? 400 : 500).json({
      message: isValidationError ? error.message : "Error creating Mercado Pago preference",
    });
  }
};
