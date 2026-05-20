const AdminStatCard = ({ stat }) => {
  const tone = stat.tone || 'neutral';

  return (
    <div className="col-xl-3 col-md-6">
      <div className={`stat-card admin-stat-card admin-stat-${tone} p-4 h-100`}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <p className="text-secondary small mb-1">{stat.label}</p>
            <h3 className="mb-0 fw-bold">
              {stat.loading ? (
                <span className="placeholder-glow">
                  <span className="placeholder col-6 rounded" />
                </span>
              ) : (
                stat.value
              )}
            </h3>
            {stat.hint && <span className="stat-hint">{stat.hint}</span>}
            {stat.badge && !stat.loading && <span className={`stat-health-badge stat-health-${tone}`}>{stat.badge}</span>}
          </div>
          <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
            <i className={`bi ${stat.icon}`}></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatCard;
