import { memo } from 'react';
import { motion } from 'framer-motion';

const ACTIVITY_ICONS = {
  order_created: 'bi-bag-check',
  order_approved: 'bi-check2-circle',
  message_received: 'bi-chat-left-text',
  product_updated: 'bi-pencil-square',
};

const getRelativeTime = (value) => {
  if (!value) return 'Sin fecha';

  const diffMs = Date.now() - new Date(value).getTime();
  const diffMinutes = Math.max(Math.floor(diffMs / 60000), 0);

  if (diffMinutes < 1) return 'Ahora';
  if (diffMinutes < 60) return `Hace ${diffMinutes} min`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `Hace ${diffHours} h`;

  const diffDays = Math.floor(diffHours / 24);
  return `Hace ${diffDays} d`;
};

function AdminRecentActivity({ items = [], loading = false }) {
  return (
    <section className="admin-dashboard-panel">
      <div className="admin-panel-header">
        <div>
          <span className="admin-panel-eyebrow">Operaciones</span>
          <h2>Actividad reciente</h2>
        </div>
      </div>

      {loading ? (
        <div className="admin-activity-list placeholder-glow">
          {[0, 1, 2, 3].map((item) => (
            <div className="admin-activity-item" key={item}>
              <span className="admin-activity-icon placeholder" />
              <div className="flex-grow-1">
                <span className="placeholder col-7" />
                <span className="placeholder col-4" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length ? (
        <div className="admin-activity-list">
          {items.slice(0, 6).map((item, index) => (
            <motion.article
              className="admin-activity-item"
              key={item.id || `${item.type}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: index * 0.035 }}
            >
              <span className={`admin-activity-icon admin-activity-${item.type}`}>
                <i className={`bi ${ACTIVITY_ICONS[item.type] || 'bi-activity'}`} aria-hidden="true" />
              </span>
              <span className="admin-activity-copy">
                <strong>{item.title}</strong>
                <small>{item.description}</small>
              </span>
              <time>{getRelativeTime(item.createdAt)}</time>
            </motion.article>
          ))}
        </div>
      ) : (
        <div className="admin-empty-compact">
          <i className="bi bi-activity" aria-hidden="true" />
          <p>No hay actividad reciente.</p>
        </div>
      )}
    </section>
  );
}

export default memo(AdminRecentActivity);
