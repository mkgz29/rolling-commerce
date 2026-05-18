import {
  STATUS_LABELS,
  formatCurrency,
  formatDate,
  getCustomerEmail,
  getCustomerName,
  getItemsCount,
  getShortId,
} from './adminSalesUtils';

const getValue = (value) => value || 'Sin datos';

const getSubtotal = (item) => Number(item?.price || 0) * Number(item?.quantity || 0);

const AdminSaleDetailModal = ({ order, onClose }) => {
  if (!order) return null;

  const status = String(order?.status || '').toLowerCase();
  const payment = order?.payment || {};
  const shipping = order?.shipping || {};
  const items = order?.items || [];

  return (
    <>
      <div className="modal-backdrop fade show admin-modal-backdrop" />
      <div className="modal fade show d-block admin-product-modal" tabIndex="-1" role="dialog" aria-modal="true">
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content admin-modal-content">
            <div className="modal-header admin-modal-header">
              <div>
                <h5 className="modal-title">Venta {getShortId(order)}</h5>
                <p>
                  {STATUS_LABELS[status] || status || 'Sin estado'} - {formatDate(order.createdAt)}
                </p>
              </div>
              <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Cerrar" />
            </div>

            <div className="modal-body admin-modal-body admin-sale-detail">
              <section className="admin-form-section">
                <div className="admin-form-section-heading">
                  <span>01</span>
                  <div>
                    <h6>Cliente</h6>
                    <p>Datos disponibles en la orden o en el usuario asociado.</p>
                  </div>
                </div>
                <div className="admin-detail-grid">
                  <div>
                    <span>Nombre</span>
                    <strong>{getCustomerName(order)}</strong>
                  </div>
                  <div>
                    <span>Email</span>
                    <strong>{getCustomerEmail(order)}</strong>
                  </div>
                  <div>
                    <span>Telefono</span>
                    <strong>{getValue(order?.customer?.phone)}</strong>
                  </div>
                </div>
              </section>

              <section className="admin-form-section">
                <div className="admin-form-section-heading">
                  <span>02</span>
                  <div>
                    <h6>Envio</h6>
                    <p>Las ordenes antiguas pueden no tener esta informacion.</p>
                  </div>
                </div>
                <div className="admin-detail-grid">
                  <div>
                    <span>Metodo</span>
                    <strong>{getValue(shipping.delivery)}</strong>
                  </div>
                  <div>
                    <span>Pais</span>
                    <strong>{getValue(shipping.country)}</strong>
                  </div>
                  <div>
                    <span>Provincia</span>
                    <strong>{getValue(shipping.state)}</strong>
                  </div>
                  <div>
                    <span>Ciudad</span>
                    <strong>{getValue(shipping.city)}</strong>
                  </div>
                  <div>
                    <span>Codigo postal</span>
                    <strong>{getValue(shipping.zip)}</strong>
                  </div>
                  <div>
                    <span>Direccion</span>
                    <strong>{getValue(shipping.address)}</strong>
                  </div>
                </div>
              </section>

              <section className="admin-form-section">
                <div className="admin-form-section-heading">
                  <span>03</span>
                  <div>
                    <h6>Productos</h6>
                    <p>{getItemsCount(order)} unidades compradas.</p>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table table-dark table-hover align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio unitario</th>
                        <th className="text-end">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr key={`${item.productId || item.name}-${index}`}>
                          <td>{getValue(item.name)}</td>
                          <td>{Number(item.quantity || 0)}</td>
                          <td>{formatCurrency(item.price)}</td>
                          <td className="text-end">{formatCurrency(getSubtotal(item))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="admin-sale-total">
                  <span>Total</span>
                  <strong>{formatCurrency(order.total)}</strong>
                </div>
              </section>

              <section className="admin-form-section">
                <div className="admin-form-section-heading">
                  <span>04</span>
                  <div>
                    <h6>Pago y fechas</h6>
                    <p>Datos tecnicos para conciliacion.</p>
                  </div>
                </div>
                <div className="admin-detail-grid">
                  <div>
                    <span>Provider</span>
                    <strong>{getValue(payment.provider)}</strong>
                  </div>
                  <div>
                    <span>Payment ID</span>
                    <strong>{getValue(payment.paymentId)}</strong>
                  </div>
                  <div>
                    <span>Preference ID</span>
                    <strong>{getValue(payment.preferenceId)}</strong>
                  </div>
                  <div>
                    <span>Estado pago</span>
                    <strong>{getValue(payment.status)}</strong>
                  </div>
                  <div>
                    <span>Creada</span>
                    <strong>{formatDate(order.createdAt)}</strong>
                  </div>
                  <div>
                    <span>Pagada</span>
                    <strong>{formatDate(order.paidAt)}</strong>
                  </div>
                  <div>
                    <span>Entregada</span>
                    <strong>{formatDate(order.deliveredAt)}</strong>
                  </div>
                  <div>
                    <span>Cancelada</span>
                    <strong>{formatDate(order.cancelledAt)}</strong>
                  </div>
                </div>
              </section>
            </div>

            <div className="modal-footer admin-modal-footer">
              <button type="button" className="btn btn-outline-light" onClick={onClose}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSaleDetailModal;
