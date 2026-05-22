const STATUS_LABELS = {
  pending: 'Pendiente',
  paid: 'Aprobada',
  cancelled: 'Rechazada',
  delivered: 'Entregada',
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatDate = (value) => {
  if (!value) return 'Sin datos';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Sin datos';

  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
};

const getOrderId = (order) => order?._id || order?.id || '';

const isValidOrderId = (id) => /^[0-9a-fA-F]{24}$/.test(String(id || ''));

const getShortId = (order) => {
  const id = getOrderId(order);
  return id ? `${id.slice(0, 8)}...` : 'Sin ID';
};

const getCustomerName = (order) =>
  order?.customer?.fullName || order?.userId?.name || 'Sin datos';

const getCustomerEmail = (order) =>
  order?.customer?.email || order?.userId?.email || 'Sin datos';

const getItemsCount = (order) =>
  (order?.items || []).reduce((total, item) => total + Number(item.quantity || 0), 0);

export {
  STATUS_LABELS,
  formatCurrency,
  formatDate,
  getCustomerEmail,
  getCustomerName,
  getItemsCount,
  getOrderId,
  isValidOrderId,
  getShortId,
};
