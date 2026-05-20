import ContactMessage from "../models/contactMessage.js";
import Order from "../models/order.js";
import Product from "../models/products.js";

const PAID_STATUSES = ["paid", "delivered", "approved"];
const DAY_IN_MS = 24 * 60 * 60 * 1000;

const startOfLocalDay = (date) => {
  const nextDate = new Date(date);
  nextDate.setHours(0, 0, 0, 0);
  return nextDate;
};

const formatDayKey = (date) => date.toISOString().slice(0, 10);

const getCustomerName = (order) =>
  order?.customer?.fullName || order?.userId?.name || order?.customer?.email || "Cliente";

const mapOrderSummary = (order) => ({
  id: order._id,
  status: order.status,
  total: order.total,
  customerName: getCustomerName(order),
  customerEmail: order?.customer?.email || order?.userId?.email || "",
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
});

const mapMessageSummary = (message) => ({
  id: message._id,
  name: message.name,
  email: message.email,
  subject: message.subject,
  status: message.status,
  createdAt: message.createdAt,
  updatedAt: message.updatedAt,
});

const buildSalesLast7Days = async () => {
  const todayStart = startOfLocalDay(new Date());
  const from = new Date(todayStart.getTime() - 6 * DAY_IN_MS);
  const rawSales = await Order.aggregate([
    {
      $match: {
        status: { $in: PAID_STATUSES },
        createdAt: { $gte: from },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
          },
        },
        total: { $sum: "$total" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const salesByDay = new Map(rawSales.map((day) => [day._id, day]));

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(from.getTime() + index * DAY_IN_MS);
    const key = formatDayKey(date);
    const day = salesByDay.get(key);

    return {
      date: key,
      label: new Intl.DateTimeFormat("es-AR", { weekday: "short" }).format(date),
      total: Number(day?.total || 0),
      orders: Number(day?.orders || 0),
    };
  });
};

const buildRecentActivity = ({ recentOrders, recentMessages, recentProducts }) => {
  const orderCreated = recentOrders.map((order) => ({
    id: `order-created-${order._id}`,
    type: "order_created",
    title: "Nueva orden creada",
    description: `${getCustomerName(order)} genero una orden`,
    status: order.status,
    createdAt: order.createdAt,
  }));

  const approvedOrders = recentOrders
    .filter((order) => PAID_STATUSES.includes(order.status))
    .map((order) => ({
      id: `order-approved-${order._id}`,
      type: "order_approved",
      title: "Orden aprobada",
      description: `${getCustomerName(order)} confirmo una compra`,
      status: order.status,
      createdAt: order.updatedAt || order.createdAt,
    }));

  const messages = recentMessages.map((message) => ({
    id: `message-${message._id}`,
    type: "message_received",
    title: "Consulta recibida",
    description: `${message.name}: ${message.subject}`,
    status: message.status,
    createdAt: message.createdAt,
  }));

  const products = recentProducts.map((product) => ({
    id: `product-${product._id}`,
    type: "product_updated",
    title: "Producto actualizado",
    description: product.name,
    status: product.isActive === false ? "inactive" : "active",
    createdAt: product.updatedAt || product.createdAt,
  }));

  return [...orderCreated, ...approvedOrders, ...messages, ...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);
};

export const getAdminStats = async () => {
  const [
    totalSalesResult,
    totalProducts,
    pendingOrders,
    pendingMessages,
    recentOrders,
    recentMessages,
    recentProducts,
    salesLast7Days,
  ] = await Promise.all([
    Order.aggregate([
      { $match: { status: { $in: PAID_STATUSES } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]),
    Product.countDocuments({ isActive: { $ne: false } }),
    Order.countDocuments({ status: "pending" }),
    ContactMessage.countDocuments({ status: "pending" }),
    Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "name email")
      .lean(),
    ContactMessage.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
    Product.find({})
      .sort({ updatedAt: -1 })
      .limit(5)
      .select("name isActive createdAt updatedAt")
      .lean(),
    buildSalesLast7Days(),
  ]);

  const totalSales = Number(totalSalesResult[0]?.total || 0);

  return {
    totalSales,
    totalProducts,
    pendingOrders,
    pendingMessages,
    recentOrders: recentOrders.map(mapOrderSummary),
    recentMessages: recentMessages.map(mapMessageSummary),
    salesLast7Days,
    recentActivity: buildRecentActivity({ recentOrders, recentMessages, recentProducts }),
  };
};
