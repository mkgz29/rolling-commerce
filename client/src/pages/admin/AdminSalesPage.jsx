import { useCallback, useEffect, useMemo, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import Swal from 'sweetalert2';
import AdminSaleDetailModal from '../../components/AdminSaleDetailModal';
import AdminSalesFilters from '../../components/AdminSalesFilters';
import AdminSalesTable from '../../components/AdminSalesTable';
import { STATUS_LABELS, getOrderId, isValidOrderId } from '../../components/adminSalesUtils';
import {
  getAdminOrderByIdRequest,
  getAdminOrdersRequest,
  updateAdminOrderStatusRequest,
} from '../../routes/orderService';

const initialFilters = {
  status: '',
  from: '',
  to: '',
  customer: '',
};

const unwrapOrders = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.orders)) return data.orders;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

const buildParams = (filters) => ({
  status: filters.status || undefined,
  from: filters.from || undefined,
  to: filters.to ? `${filters.to}T23:59:59.999` : undefined,
  customer: filters.customer?.trim().slice(0, 80) || undefined,
  page: 1,
  sortBy: '-createdAt',
  limit: 50,
});

const STATUS_COLORS = {
  pending: '#facc15',
  paid: '#22c55e',
  cancelled: '#f87171',
  delivered: '#42c4ff',
};

const ORDER_STATUSES = ['pending', 'paid', 'cancelled', 'delivered'];

const mergeOrderUpdate = (currentOrder, updatedOrder) => ({
  ...currentOrder,
  ...updatedOrder,
  userId:
    updatedOrder?.userId && typeof updatedOrder.userId === 'object'
      ? updatedOrder.userId
      : currentOrder?.userId,
});

const AdminSalesPage = ({ onOrdersChanged }) => {
  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState('');

  const params = useMemo(() => buildParams(appliedFilters), [appliedFilters]);
  const salesSummary = useMemo(() => {
    const counts = ORDER_STATUSES.reduce((summary, status) => ({ ...summary, [status]: 0 }), {});

    orders.forEach((order) => {
      const status = String(order?.status || '').toLowerCase();
      if (counts[status] !== undefined) counts[status] += 1;
    });

    return counts;
  }, [orders]);
  const chartData = useMemo(() => {
    const baseData = ORDER_STATUSES.map((status) => ({
        status,
        name: STATUS_LABELS[status],
        value: salesSummary[status],
      }));
    const hasRealValues = baseData.some((entry) => entry.value > 0);

    return baseData.map((entry) => ({
      ...entry,
      chartValue: hasRealValues ? entry.value : 1,
    }));
  }, [salesSummary]);

  const fetchSales = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAdminOrdersRequest(params);
      const nextOrders = unwrapOrders(data);
      setOrders(nextOrders);
      setTotal(Number(data?.total ?? nextOrders.length));
    } catch (requestError) {
      console.error('Error fetching admin sales:', requestError);
      setOrders([]);
      setTotal(0);
      setError(requestError.message || 'No se pudieron cargar las ventas.');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    queueMicrotask(() => {
      fetchSales();
    });
  }, [fetchSales]);

  const handleSubmitFilters = (event) => {
    event.preventDefault();
    setAppliedFilters(filters);
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
  };

  const handleViewDetail = async (order) => {
    const orderId = getOrderId(order);
    if (!isValidOrderId(orderId)) return;

    try {
      setDetailLoading(true);
      const detail = await getAdminOrderByIdRequest(orderId);
      setSelectedOrder(detail);
    } catch (requestError) {
      console.error('Error fetching sale detail:', requestError);
      Swal.fire({
        title: 'No se pudo cargar la venta',
        text: requestError.message || 'El servidor rechazo la consulta.',
        icon: 'error',
        background: '#1a1d21',
        color: '#fff',
      });
    } finally {
      setDetailLoading(false);
    }
  };

  const handleStatusChange = async (order, status) => {
    const orderId = getOrderId(order);
    if (!isValidOrderId(orderId) || status === order.status) return;

    try {
      setUpdatingOrderId(orderId);
      const updatedOrder = await updateAdminOrderStatusRequest(orderId, status);

      setOrders((currentOrders) =>
        currentOrders.map((currentOrder) =>
          getOrderId(currentOrder) === orderId ? mergeOrderUpdate(currentOrder, updatedOrder) : currentOrder,
        ),
      );

      setSelectedOrder((currentOrder) =>
        currentOrder && getOrderId(currentOrder) === orderId
          ? mergeOrderUpdate(currentOrder, updatedOrder)
          : currentOrder,
      );

      onOrdersChanged?.();

      Swal.fire({
        title: 'Estado actualizado',
        text: 'La venta fue actualizada correctamente.',
        icon: 'success',
        background: '#1a1d21',
        color: '#fff',
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (requestError) {
      console.error('Error updating sale status:', requestError);
      Swal.fire({
        title: 'No se pudo actualizar',
        text: requestError.message || 'El servidor rechazo el cambio de estado.',
        icon: 'error',
        background: '#1a1d21',
        color: '#fff',
      });
    } finally {
      setUpdatingOrderId('');
    }
  };

  return (
    <section className="admin-sales-page">
      <div className="d-flex justify-content-between align-items-start gap-3 mb-4 flex-wrap">
        <div>
          <h2 className="h4 mb-1">Ventas</h2>
          <p className="admin-page-subtitle mb-0">
            {loading ? 'Consultando ordenes...' : `${total} venta${total === 1 ? '' : 's'} encontradas`}
          </p>
        </div>
        <button type="button" className="btn btn-outline-light" onClick={fetchSales} disabled={loading}>
          {loading ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>

      <AdminSalesFilters
        filters={filters}
        onChange={setFilters}
        onSubmit={handleSubmitFilters}
        onReset={handleResetFilters}
        loading={loading}
      />

      <div className="row g-4 mb-4">
        {[
          { label: 'Ventas totales', value: total, status: 'total' },
          { label: 'Pendientes', value: salesSummary.pending, status: 'pending' },
          { label: 'Aprobadas', value: salesSummary.paid, status: 'paid' },
          { label: 'Rechazadas', value: salesSummary.cancelled, status: 'cancelled' },
        ].map((metric) => (
          <div className="col-xl-3 col-md-6" key={metric.label}>
            <div className={`admin-sales-metric admin-sales-metric-${metric.status}`}>
              <span>{metric.label}</span>
              <strong>{loading ? '...' : metric.value}</strong>
            </div>
          </div>
        ))}
      </div>

      <section className="table-container admin-sales-chart p-4 mb-4">
        <div className="d-flex justify-content-between align-items-start gap-3 mb-3 flex-wrap">
          <div>
            <h3 className="h5 mb-1">Ventas por estado</h3>
            <p className="admin-page-subtitle mb-0">Distribucion de las ordenes listadas.</p>
          </div>
        </div>
        <div className="admin-chart-frame">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="chartValue"
                nameKey="name"
                innerRadius={62}
                outerRadius={92}
                paddingAngle={3}
                stroke="#081123"
                strokeWidth={2}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#0b1220',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '10px',
                  color: '#f4f7ff',
                }}
                itemStyle={{ color: '#f4f7ff' }}
                formatter={(_, name, item) => [item?.payload?.value ?? 0, name]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="admin-chart-legend">
            {chartData.map((entry) => (
              <span key={entry.status}>
                <i style={{ backgroundColor: STATUS_COLORS[entry.status] }} />
                {entry.name}: {entry.value}
              </span>
            ))}
          </div>
        </div>
        {orders.length === 0 && !loading && (
          <p className="admin-chart-note mb-0">Aun no hay ventas registradas.</p>
        )}
      </section>

      {error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <AdminSalesTable
          orders={orders}
          loading={loading}
          onViewDetail={handleViewDetail}
          onStatusChange={handleStatusChange}
          updatingOrderId={updatingOrderId}
        />
      )}

      {detailLoading && (
        <div className="admin-detail-loading table-container">
          <div className="spinner-border text-info" role="status">
            <span className="visually-hidden">Cargando detalle...</span>
          </div>
        </div>
      )}

      <AdminSaleDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </section>
  );
};

export default AdminSalesPage;
