import { useCallback, useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import {
  deleteAdminContactMessageRequest,
  getAdminContactMessagesRequest,
  updateAdminContactMessageStatusRequest,
} from '../../routes/contactService';

const CONTACT_STATUSES = ['pending', 'answered', 'archived'];

const STATUS_LABELS = {
  pending: 'Pendiente',
  answered: 'Respondida',
  archived: 'Archivada',
};

const STATUS_CLASSES = {
  pending: 'admin-status-badge admin-status-pending',
  answered: 'admin-status-badge admin-status-paid',
  archived: 'admin-status-badge admin-status-archived',
};

const initialFilters = {
  status: '',
  search: '',
};

const unwrapMessages = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.messages)) return data.messages;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const getContactId = (message) => String(message?._id || message?.id || '');

const getShortId = (message) => {
  const id = getContactId(message);
  return id ? `${id.slice(0, 8)}...` : 'Sin ID';
};

const formatDate = (value) => {
  if (!value) return 'Sin fecha';

  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
};

const buildParams = (filters) => ({
  status: filters.status || undefined,
  search: filters.search?.trim().slice(0, 80) || undefined,
  page: 1,
  sortBy: '-createdAt',
  limit: 50,
});

export default function AdminContactPage({ onMessagesChanged }) {
  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [messages, setMessages] = useState([]);
  const [total, setTotal] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingMessageId, setUpdatingMessageId] = useState('');

  const params = useMemo(() => buildParams(appliedFilters), [appliedFilters]);

  const statusSummary = useMemo(() => {
    const summary = CONTACT_STATUSES.reduce((acc, status) => ({ ...acc, [status]: 0 }), {});

    messages.forEach((message) => {
      const status = String(message?.status || 'pending').toLowerCase();
      if (summary[status] !== undefined) summary[status] += 1;
    });

    return summary;
  }, [messages]);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAdminContactMessagesRequest(params);
      const nextMessages = unwrapMessages(data);

      setMessages(nextMessages);
      setTotal(Number(data?.total ?? nextMessages.length));
      setPendingCount(Number(data?.pending ?? nextMessages.filter((item) => item.status === 'pending').length));
    } catch (requestError) {
      console.error('Error fetching contact messages:', requestError);
      setMessages([]);
      setTotal(0);
      setPendingCount(0);
      setError(requestError.message || 'No se pudieron cargar las consultas.');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    queueMicrotask(() => {
      fetchMessages();
    });
  }, [fetchMessages]);

  const handleSubmitFilters = (event) => {
    event.preventDefault();
    setAppliedFilters(filters);
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
  };

  const handleStatusChange = async (message, status) => {
    const messageId = getContactId(message);
    if (!messageId || status === message.status) return;
    const previousStatus = String(message?.status || 'pending').toLowerCase();

    try {
      setUpdatingMessageId(messageId);
      const updatedMessage = await updateAdminContactMessageStatusRequest(messageId, status);

      setMessages((currentMessages) =>
        currentMessages.map((currentMessage) =>
          getContactId(currentMessage) === messageId ? { ...currentMessage, ...updatedMessage } : currentMessage,
        ),
      );
      setPendingCount((currentCount) => {
        if (previousStatus === 'pending' && status !== 'pending') return Math.max(currentCount - 1, 0);
        if (previousStatus !== 'pending' && status === 'pending') return currentCount + 1;
        return currentCount;
      });

      onMessagesChanged?.();

      Swal.fire({
        title: 'Estado actualizado',
        text: 'La consulta fue actualizada correctamente.',
        icon: 'success',
        background: '#1a1d21',
        color: '#fff',
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (requestError) {
      console.error('Error updating contact message:', requestError);
      Swal.fire({
        title: 'No se pudo actualizar',
        text: requestError.message || 'El servidor rechazo el cambio de estado.',
        icon: 'error',
        background: '#1a1d21',
        color: '#fff',
      });
    } finally {
      setUpdatingMessageId('');
    }
  };

  const handleDeleteMessage = async (message) => {
    const messageId = getContactId(message);
    if (!messageId) return;

    const confirmation = await Swal.fire({
      title: 'Eliminar consulta',
      text: 'Esta accion quitara la consulta del panel administrativo.',
      icon: 'warning',
      background: '#1a1d21',
      color: '#fff',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
    });

    if (!confirmation.isConfirmed) return;

    try {
      setUpdatingMessageId(messageId);
      await deleteAdminContactMessageRequest(messageId);

      setMessages((currentMessages) => currentMessages.filter((currentMessage) => getContactId(currentMessage) !== messageId));
      setTotal((currentTotal) => Math.max(Number(currentTotal || 0) - 1, 0));
      if (String(message?.status || '').toLowerCase() === 'pending') {
        setPendingCount((currentCount) => Math.max(currentCount - 1, 0));
      }
      onMessagesChanged?.();

      Swal.fire({
        title: 'Consulta eliminada',
        text: 'La consulta fue removida correctamente.',
        icon: 'success',
        background: '#1a1d21',
        color: '#fff',
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (requestError) {
      console.error('Error deleting contact message:', requestError);
      Swal.fire({
        title: 'No se pudo eliminar',
        text: requestError.message || 'El servidor rechazo la eliminacion.',
        icon: 'error',
        background: '#1a1d21',
        color: '#fff',
      });
    } finally {
      setUpdatingMessageId('');
    }
  };

  return (
    <section className="admin-contact-page">
      <div className="d-flex justify-content-between align-items-start gap-3 mb-4 flex-wrap">
        <div>
          <h2 className="h4 mb-1">Consultas</h2>
          <p className="admin-page-subtitle mb-0">
            {loading ? 'Consultando mensajes...' : `${total} consulta${total === 1 ? '' : 's'} encontradas`}
          </p>
        </div>
        <button type="button" className="btn btn-outline-light" onClick={fetchMessages} disabled={loading}>
          {loading ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>

      <form className="table-container admin-contact-filters p-4 mb-4" onSubmit={handleSubmitFilters}>
        <div className="row g-3 align-items-end">
          <div className="col-lg-4">
            <label className="form-label" htmlFor="contact-status-filter">Estado</label>
            <select
              id="contact-status-filter"
              className="form-select admin-form-control"
              value={filters.status}
              onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}
            >
              <option value="">Todos</option>
              {CONTACT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </div>
          <div className="col-lg-5">
            <label className="form-label" htmlFor="contact-search-filter">Buscar</label>
            <input
              id="contact-search-filter"
              className="form-control admin-form-control"
              value={filters.search}
              maxLength={80}
              placeholder="Nombre, email, asunto o mensaje"
              onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
            />
          </div>
          <div className="col-lg-3 d-flex gap-2">
            <button type="submit" className="btn btn-primary-gradient flex-fill" disabled={loading}>
              Filtrar
            </button>
            <button type="button" className="btn btn-outline-light flex-fill" onClick={handleResetFilters} disabled={loading}>
              Limpiar
            </button>
          </div>
        </div>
      </form>

      <div className="row g-4 mb-4">
        {[
          { label: 'Pendientes', value: pendingCount, status: 'pending' },
          { label: 'Respondidas', value: statusSummary.answered, status: 'answered' },
          { label: 'Archivadas', value: statusSummary.archived, status: 'archived' },
        ].map((metric) => (
          <div className="col-xl-4 col-md-6" key={metric.label}>
            <div className={`admin-sales-metric admin-contact-metric-${metric.status}`}>
              <span>{metric.label}</span>
              <strong>{loading ? '...' : metric.value}</strong>
            </div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="table-container admin-table-state">
          <div className="spinner-border text-info" role="status">
            <span className="visually-hidden">Cargando consultas...</span>
          </div>
          <p>Cargando consultas...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : !messages.length ? (
        <div className="table-container admin-table-state">
          <i className="bi bi-chat-left-text" aria-hidden="true" />
          <h3>No hay consultas para mostrar</h3>
          <p>Cuando un usuario escriba desde Contacto, aparecera en este panel.</p>
        </div>
      ) : (
        <div className="table-container p-4">
          <div className="table-responsive admin-sales-table-scroll">
            <table className="table table-dark table-hover align-middle mb-0 admin-contact-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Contacto</th>
                  <th>Asunto</th>
                  <th>Mensaje</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((message) => {
                  const messageId = getContactId(message);
                  const status = String(message?.status || 'pending').toLowerCase();
                  const isUpdating = updatingMessageId === messageId;

                  return (
                    <tr key={messageId}>
                      <td className="text-secondary">{getShortId(message)}</td>
                      <td>
                        <strong className="d-block">{message.name}</strong>
                        <span className="admin-contact-muted">{message.email}</span>
                        {message.phone && <span className="admin-contact-muted d-block">{message.phone}</span>}
                      </td>
                      <td className="fw-semibold">{message.subject}</td>
                      <td className="admin-contact-message-cell">{message.message}</td>
                      <td>{formatDate(message.createdAt)}</td>
                      <td>
                        <span className={STATUS_CLASSES[status] || 'admin-status-badge'}>
                          {STATUS_LABELS[status] || status}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="d-inline-flex gap-2 align-items-center">
                          <select
                            className="form-select form-select-sm admin-status-select"
                            value={status}
                            disabled={isUpdating}
                            aria-label={`Cambiar estado de consulta ${getShortId(message)}`}
                            onChange={(event) => handleStatusChange(message, event.target.value)}
                          >
                            {CONTACT_STATUSES.map((nextStatus) => (
                              <option key={nextStatus} value={nextStatus}>
                                {STATUS_LABELS[nextStatus]}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            disabled={isUpdating}
                            onClick={() => handleDeleteMessage(message)}
                          >
                            Eliminar
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
      )}
    </section>
  );
}
