import { Payment } from "mercadopago";
import Order from "../models/order.js";
import Product from "../models/products.js";
import { createMercadoPagoClient } from "../config/mercadoPago.js";

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

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).send("order not found");
    }

    if (order.status === "paid") {
      return res.status(200).send("already processed");
    }

    order.status = "paid";

    await order.save();

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: {
          stock: -item.quantity,
        },
      });
    }

    return res.status(200).send("success");
  } catch (error) {
    console.error(error);

    return res.status(500).send("webhook error");
  }
};
