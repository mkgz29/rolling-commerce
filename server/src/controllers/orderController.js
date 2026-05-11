// Controllers disponibles y sus rutas:
// createOrder       → POST   /api/orders
// getOrders         → GET    /api/orders
// getOrderById      → GET    /api/orders/:id
// updateOrderStatus → PUT    /api/orders/:id/status/
// El carrito se vacía automáticamente al crear una orden exitosa.
// Los precios se copian del carrito al momento de la compra — son históricos.
// Para integrar pagos: updateOrderStatus recibe { status: "paid" } desde el webhook.

import mongoose from "mongoose";
import Cart from "../models/cart.js";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUserId,
  updateOrderStatus,
} from "../services/orderService.js";

// Crea una orden a partir del carrito del usuario logueado.
// Copia los items y precios del carrito, calcula el total y vacía el carrito.
export const createOrderController = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const order = await createOrder(req.user._id, cart);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

// Lista todas las órdenes del usuario logueado, de más reciente a más antigua.
export const getOrdersController = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const orders = req.user.role === "admin"
      ? await getAllOrders({ sortBy: "-createdAt" })
      : await getOrdersByUserId(req.user._id);

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

// Devuelve el detalle de una orden por ID.
// Acceso permitido: el dueño de la orden o un admin.
export const getOrderByIdController = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID format" });
    }

    const order = await getOrderById(id, req.user.role === "admin" ? null : req.user._id);
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

// Actualiza el estado de una orden. Solo accesible por admin.
// Estados válidos: pending, paid, cancelled, delivered.
// Para integrar pagos: llamar a este endpoint desde el webhook de MercadoPago con status "paid".
export const updateOrderStatusController = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID format" });
    }

    const validStatuses = ["pending", "paid", "cancelled", "delivered"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Status must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const order = await updateOrderStatus(id, status);
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

export {
  createOrderController as createOrder,
  getOrdersController as getOrders,
  getOrderByIdController as getOrderById,
  updateOrderStatusController as updateOrderStatus,
};
