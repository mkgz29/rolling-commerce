import Order from "../models/order.js";
import Cart from "../models/cart.js";
import Product from "../models/products.js";
import User from "../models/users.js";
import mongoose from "mongoose";
import { ORDER_STATUSES } from "../constants/orderStatuses.js";
import { sanitizeLimitedString } from "../utils/validators.js";

const ORDER_SORT_FIELDS = new Set(["createdAt", "total"]);

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildCheckoutSnapshot = (checkoutData = {}) => ({
  customer: {
    fullName: checkoutData.fullName || "",
    email: checkoutData.email || "",
    phone: checkoutData.phone || "",
  },
  shipping: {
    country: checkoutData.country || "",
    state: checkoutData.state || "",
    city: checkoutData.city || "",
    zip: checkoutData.zip || "",
    address: checkoutData.address || "",
    delivery: checkoutData.delivery || "",
  },
});

const getStatusTimestampPatch = (status) => {
  if (status === "paid") return { paidAt: new Date() };
  if (status === "delivered") return { deliveredAt: new Date() };
  if (status === "cancelled") return { cancelledAt: new Date() };
  return {};
};

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

    order.stockReducedAt = new Date();
    await order.save({ session });

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

const createPendingPaymentOrder = async ({
  userId,
  requestedItems = [],
  checkoutData = {},
  paymentProvider = "mercadopago",
} = {}) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID format");
  }

  if (!Array.isArray(requestedItems) || requestedItems.length === 0) {
    throw new Error("Order items cannot be empty");
  }

  const productIds = requestedItems.map((item) => item.productId);
  const products = await Product.find({
    _id: { $in: productIds },
    isActive: { $ne: false },
  }).select("name price stock isActive");

  const productsById = new Map(products.map((product) => [String(product._id), product]));

  const preferenceItems = requestedItems.map((item) => {
    if (!mongoose.Types.ObjectId.isValid(item.productId)) {
      throw new Error("Invalid product ID format in order items");
    }

    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new Error("Item quantity must be a positive integer");
    }

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

  const total = calculateOrderTotal(
    preferenceItems.map((item) => ({
      price: item.unitPrice,
      quantity: item.quantity,
    }))
  );

  const { customer, shipping } = buildCheckoutSnapshot(checkoutData);
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
    customer,
    shipping,
    payment: {
      provider: paymentProvider,
      status: "pending",
    },
  });

  return { order, preferenceItems, total };
};

const getOrderById = async (orderId, userId = null, { populateUser = false } = {}) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new Error("Invalid order ID format");
  }

  let query = Order.findById(orderId);

  if (populateUser) {
    query = query.populate("userId", "name email role");
  }

  const order = await query;

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

const getAllOrders = async ({
  status = null,
  sortBy = "-createdAt",
  from = null,
  to = null,
  customer = null,
  page = 1,
  limit = 50,
  populateUser = false,
} = {}) => {
  const filter = {};

  if (status) {
    if (!ORDER_STATUSES.includes(status)) {
      throw new Error(
        `Invalid status. Must be one of: ${ORDER_STATUSES.join(", ")}`
      );
    }
    filter.status = status;
  }

  if (from || to) {
    filter.createdAt = {};

    if (from) {
      const fromDate = new Date(from);
      if (Number.isNaN(fromDate.getTime())) {
        throw new Error("Invalid from date");
      }
      filter.createdAt.$gte = fromDate;
    }

    if (to) {
      const toDate = new Date(to);
      if (Number.isNaN(toDate.getTime())) {
        throw new Error("Invalid to date");
      }
      filter.createdAt.$lte = toDate;
    }
  }

  if (customer && customer.trim()) {
    const sanitizedCustomer = sanitizeLimitedString(customer, "customer", 120);
    const customerRegex = new RegExp(escapeRegex(sanitizedCustomer), "i");
    const matchingUsers = await User.find({
      $or: [{ name: customerRegex }, { email: customerRegex }],
    }).select("_id");

    filter.$or = [
      { "customer.fullName": customerRegex },
      { "customer.email": customerRegex },
      { "customer.phone": customerRegex },
      { userId: { $in: matchingUsers.map((user) => user._id) } },
    ];
  }

  const normalizedSort = String(sortBy || "-createdAt");
  const sortDirection = normalizedSort.startsWith("-") ? -1 : 1;
  const sortField = normalizedSort.replace(/^-/, "");
  const sortOptions = ORDER_SORT_FIELDS.has(sortField)
    ? { [sortField]: sortDirection }
    : { createdAt: -1 };

  const parsedPage = Math.max(Number.parseInt(page, 10) || 1, 1);
  const parsedLimit = Math.min(Math.max(Number.parseInt(limit, 10) || 50, 1), 100);
  const skip = (parsedPage - 1) * parsedLimit;

  let query = Order.find(filter).sort(sortOptions).skip(skip).limit(parsedLimit);

  if (populateUser) {
    query = query.populate("userId", "name email role");
  }

  const [orders, total] = await Promise.all([
    query,
    Order.countDocuments(filter),
  ]);

  return {
    total,
    page: parsedPage,
    limit: parsedLimit,
    orders,
  };
};

const updateOrderStatus = async (orderId, newStatus) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new Error("Invalid order ID format");
  }

  if (!newStatus || !ORDER_STATUSES.includes(newStatus)) {
    throw new Error(
      `Invalid status. Must be one of: ${ORDER_STATUSES.join(", ")}`
    );
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  order.status = newStatus;
  Object.assign(order, getStatusTimestampPatch(newStatus));
  await order.save();

  return order;
};

const attachPaymentPreference = async (orderId, preferenceId) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new Error("Invalid order ID format");
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  order.payment = {
    ...(order.payment?.toObject?.() || order.payment || {}),
    provider: order.payment?.provider || "mercadopago",
    preferenceId,
    status: order.payment?.status || "pending",
  };

  await order.save();

  return order;
};

const markOrderPaidFromPayment = async ({
  orderId,
  paymentId,
  paymentStatus = "approved",
  statusDetail = "",
} = {}) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new Error("Invalid order ID format");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findById(orderId).session(session);

    if (!order) {
      const error = new Error("Order not found");
      error.statusCode = 404;
      throw error;
    }

    const shouldReduceStock = order.status !== "paid" && !order.stockReducedAt;

    if (shouldReduceStock) {
      for (const item of order.items) {
        const updatedProduct = await Product.findOneAndUpdate(
          { _id: item.productId, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
          { new: true, session }
        );

        if (!updatedProduct) {
          throw new Error(`Insufficient stock for product "${item.productId}" during payment confirmation`);
        }
      }

      order.stockReducedAt = new Date();
    } else if (order.status === "paid" && !order.stockReducedAt) {
      order.stockReducedAt = new Date();
    }

    order.status = "paid";
    order.paidAt = order.paidAt || new Date();
    order.payment = {
      ...(order.payment?.toObject?.() || order.payment || {}),
      provider: order.payment?.provider || "mercadopago",
      paymentId: paymentId ? String(paymentId) : order.payment?.paymentId,
      status: paymentStatus,
      statusDetail,
    };

    await order.save({ session });
    await session.commitTransaction();
    session.endSession();

    return order;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
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
  createPendingPaymentOrder,
  getOrderById,
  getOrdersByUserId,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  attachPaymentPreference,
  markOrderPaidFromPayment,
  calculateOrderTotal,
  validateOrderItems,
};
