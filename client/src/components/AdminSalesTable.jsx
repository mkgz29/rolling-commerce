import {
  STATUS_LABELS,
  formatCurrency,
  formatDate,
  getCustomerEmail,
  getCustomerName,
  getItemsCount,
  getOrderId,
  getShortId,
} from './adminSalesUtils';

const STATUS_CLASSES = {
  pending: 'admin-status-badge admin-status-pending',
  paid: 'admin-status-badge admin-status-paid',
  cancelled: 'admin-status-badge admin-status-cancelled',
  delivered: 'admin-status-badge admin-status-delivered',
};

const AdminSalesTable = ({ orders, loading = false, onViewDetail, onStatusChange, updatingOrderId = '' }) => {
  if (loading) {
    return (
      <div className="table-container admin-table-state">
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Cargando ventas...</span>
        </div>
        <p>Cargando ventas...</p>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="table-container admin-table-state">
        <i className="bi bi-receipt" aria-hidden="true" />
        <h3>No hay ventas para mostrar</h3>
        <p>Ajusta los filtros o espera a que ingresen nuevas ordenes.</p>
      </div>
    );
  }

  return (
    <div className="table-container p-4">
      <div className="table-responsive">
        <table className="table table-dark table-hover align-middle mb-0 admin-sales-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Email</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Items</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const orderId = getOrderId(order);
              const status = String(order?.status || 'pending').toLowerCase();
              const isUpdating = updatingOrderId === orderId;

              return (
                <tr key={orderId}>
                  <td className="text-secondary">{getShortId(order)}</td>
                  <td className="fw-semibold">{getCustomerName(order)}</td>
                  <td className="text-secondary">{getCustomerEmail(order)}</td>
                  <td>{formatDate(order?.createdAt)}</td>
                  <td className="text-info fw-semibold">{formatCurrency(order?.total)}</td>
                  <td>
                    <span className={STATUS_CLASSES[status] || 'admin-status-badge'}>
                      {STATUS_LABELS[status] || status || 'Sin datos'}
                    </span>
                  </td>
                  <td>{getItemsCount(order)}</td>
                  <td className="text-end">
                    <div className="d-inline-flex gap-2 align-items-center">
                      <select
                        className="form-select form-select-sm admin-status-select"
                        value={status}
                        onChange={(event) => onStatusChange(order, event.target.value)}
                        disabled={isUpdating}
                        aria-label={`Cambiar estado de venta ${getShortId(order)}`}
                      >
                        {Object.entries(STATUS_LABELS).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className="btn btn-sm btn-action text-info"
                        onClick={() => onViewDetail(order)}
                        aria-label={`Ver detalle de venta ${getShortId(order)}`}
                        title="Ver detalle"
                      >
                        <i className="bi bi-eye" />
                        <span className="admin-action-text">Ver</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSalesTable;
