import Order from "../models/order.js";
import Cart from "../models/cart.js";
import Product from "../models/products.js";
import mongoose from "mongoose";

const validateOrderItems = async (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Order items cannot be empty");
  }

  for (const item of items) {
    if (!mongoose.Types.ObjectId.isValid(item.productId)) {
      throw new Error("Invalid product ID format in order items");
    }

    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new Error("Item quantity must be a positive integer");
    }

    if (item.price === undefined || item.price < 0 || isNaN(item.price)) {
      throw new Error("Item price must be a valid non-negative number");
    }

    const product = await Product.findById(item.productId);

    if (!product) {
      throw new Error(`Product ${item.productId} not found`);
    }

    if (product.stock < item.quantity) {
      throw new Error(
        `Insufficient stock for product "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`
      );
    }
  }
};

const calculateOrderTotal = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    return 0;
  }

  const total = items.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  return parseFloat(total.toFixed(2));
};

const createOrder = async (userId, cartData = null) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID format");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let cart = cartData;

    if (!cart) {
      cart = await Cart.findOne({ userId }).session(session);

      if (!cart || cart.items.length === 0) {
        throw new Error("Cart is empty. Cannot create order");
      }
    }

    const items = [];

    for (const item of cart.items) {
      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        throw new Error("Invalid product ID format in cart item");
      }

      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw new Error("Item quantity must be a positive integer");
      }

      const product = await Product.findById(item.productId).session(session);

      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      if (product.stock < item.quantity) {
        throw new Error(
          `Insufficient stock for product "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`
        );
      }

      items.push({
        productId: item.productId,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });
    }

    await validateOrderItems(items);

    const total = calculateOrderTotal(items);

    const order = new Order({
      userId,
      items,
      total,
      status: "pending",
    });

    await order.save({ session });

    for (const item of items) {
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: item.productId, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true, session }
      );

      if (!updatedProduct) {
        throw new Error(
          `Insufficient stock for product "${item.productId}" during update`
        );
      }
    }

    if (cartData) {
      cartData.items = [];
      await cartData.save({ session });
    } else {
      cart.items = [];
      await cart.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    return order;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getOrderById = async (orderId, userId = null) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new Error("Invalid order ID format");
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  // Si se proporciona userId y el usuario no es admin, verificar que sea el propietario
  if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID format");
  }

  if (userId && String(order.userId) !== String(userId)) {
    throw new Error("Access denied. This order does not belong to you");
  }

  return order;
};

const getOrdersByUserId = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID format");
  }

  const orders = await Order.find({ userId })
    .sort({ createdAt: -1 });

  return {
    total: orders.length,
    orders,
  };
};

const getAllOrders = async ({ status = null, sortBy = "createdAt" } = {}) => {
  const filter = {};

  if (status) {
    const validStatuses = ["pending", "paid", "cancelled", "delivered"];
    if (!validStatuses.includes(status)) {
      throw new Error(
        `Invalid status. Must be one of: ${validStatuses.join(", ")}`
      );
    }
    filter.status = status;
  }

  const sortOptions = {};
  if (sortBy === "createdAt" || sortBy === "-createdAt") {
    sortOptions.createdAt = sortBy === "-createdAt" ? -1 : 1;
  } else if (sortBy === "total" || sortBy === "-total") {
    sortOptions.total = sortBy === "-total" ? -1 : 1;
  }

  const orders = await Order.find(filter)
    .sort(sortOptions);

  return {
    total: orders.length,
    orders,
  };
};

const updateOrderStatus = async (orderId, newStatus) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new Error("Invalid order ID format");
  }

  const validStatuses = ["pending", "paid", "cancelled", "delivered"];

  if (!newStatus || !validStatuses.includes(newStatus)) {
    throw new Error(
      `Invalid status. Must be one of: ${validStatuses.join(", ")}`
    );
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  order.status = newStatus;
  await order.save();

  return order;
};

const cancelOrder = async (orderId, userId = null) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new Error("Invalid order ID format");
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  // Si se proporciona userId, verificar que sea el propietario
  if (userId && String(order.userId) !== String(userId)) {
    throw new Error("Access denied. Cannot cancel this order");
  }

  // No permitir cancelar órdenes ya pagadas o entregadas
  if (order.status === "paid" || order.status === "delivered") {
    throw new Error(
      `Cannot cancel order with status "${order.status}"`
    );
  }

  order.status = "cancelled";
  await order.save();

  return order;
};

export {
  createOrder,
  getOrderById,
  getOrdersByUserId,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  calculateOrderTotal,
  validateOrderItems,
};
