import { Payment } from "mercadopago";
import { createMercadoPagoClient } from "../config/mercadoPago.js";
import { markOrderPaidFromPayment } from "../services/orderService.js";

export const mercadoPagoWebhook = async (req, res) => {
  try {
    const paymentId = req.query["data.id"] || req.body?.data?.id || req.body?.id;

    console.info("[MercadoPago] Webhook received", {
      type: req.query.type || req.body?.type || null,
      action: req.body?.action || null,
      hasPaymentId: Boolean(paymentId),
    });

    if (!paymentId) {
      return res.status(200).send("ok");
    }

    const payment = new Payment(createMercadoPagoClient());

    const paymentData = await payment.get({
      id: paymentId,
    });

    if (paymentData.status !== "approved") {
      return res.status(200).send("payment not approved");
    }

    const orderId = paymentData.external_reference;

    if (!orderId) {
      return res.status(200).send("missing order reference");
    }

    await markOrderPaidFromPayment({
      orderId,
      paymentId,
      paymentStatus: paymentData.status,
      statusDetail: paymentData.status_detail || "",
    });

    return res.status(200).send("success");
  } catch (error) {
    console.error(error);

    return res.status(error.statusCode || 500).send(error.statusCode === 404 ? "order not found" : "webhook error");
  }
};
