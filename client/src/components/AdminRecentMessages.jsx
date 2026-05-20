import { memo } from 'react';

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

const formatDate = (value) => {
  if (!value) return 'Sin fecha';

  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
};

function AdminRecentMessages({ messages = [], loading = false }) {
  return (
    <section className="admin-dashboard-panel">
      <div className="admin-panel-header">
        <div>
          <span className="admin-panel-eyebrow">Contacto</span>
          <h2>Consultas recientes</h2>
        </div>
        <span className="admin-panel-chip">{messages.length > 0 ? `${messages.length} ultimas` : 'Sin datos'}</span>
      </div>

      {loading ? (
        <div className="admin-message-list placeholder-glow">
          {[0, 1, 2].map((item) => (
            <div className="admin-message-item" key={item}>
              <span className="placeholder col-5" />
              <span className="placeholder col-8" />
              <span className="placeholder col-3" />
            </div>
          ))}
        </div>
      ) : messages.length ? (
        <div className="admin-message-list">
          {messages.slice(0, 5).map((message) => {
            const status = String(message.status || 'pending').toLowerCase();

            return (
              <article className="admin-message-item" key={message.id || message._id}>
                <div>
                  <strong>{message.name}</strong>
                  <span>{message.subject}</span>
                </div>
                <span className={STATUS_CLASSES[status] || 'admin-status-badge'}>
                  {STATUS_LABELS[status] || status}
                </span>
                <time>{formatDate(message.createdAt)}</time>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="admin-empty-compact">
          <i className="bi bi-chat-left-text" aria-hidden="true" />
          <p>No hay consultas recientes.</p>
        </div>
      )}
    </section>
  );
}

export default memo(AdminRecentMessages);
