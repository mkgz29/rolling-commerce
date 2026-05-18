// Guarda una copia exacta del carrito al momento de la compra.
// Los precios son históricos — no se ven afectados por cambios futuros en los productos.
// Estados posibles: pending → paid → delivered / cancelled
// Para integrar pagos en el futuro: el campo status se actualiza desde el webhook de pago.

import mongoose from "mongoose";
import { ORDER_STATUSES } from "../constants/orderStatuses.js";

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "pending",
    },
    customer: {
      fullName: { type: String, trim: true },
      email: { type: String, trim: true, lowercase: true },
      phone: { type: String, trim: true },
    },
    shipping: {
      country: { type: String, trim: true },
      state: { type: String, trim: true },
      city: { type: String, trim: true },
      zip: { type: String, trim: true },
      address: { type: String, trim: true },
      delivery: {
        type: String,
        enum: ["delivery", "pickup", ""],
        default: "",
      },
    },
    payment: {
      provider: { type: String, trim: true },
      preferenceId: { type: String, trim: true },
      paymentId: { type: String, trim: true },
      status: { type: String, trim: true },
      statusDetail: { type: String, trim: true },
    },
    paidAt: { type: Date },
    deliveredAt: { type: Date },
    cancelledAt: { type: Date },
    stockReducedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ "customer.email": 1, createdAt: -1 });
orderSchema.index({ userId: 1, createdAt: -1 });

const Order = mongoose.model("Order", orderSchema);

export default Order;
