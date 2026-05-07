const AdminStatCard = ({ stat }) => {
  return (
    <div className="col-md-4">
      <div className="stat-card p-4 h-100">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <p className="text-secondary small mb-1">{stat.label}</p>
            <h3 className="mb-0 fw-bold">{stat.value}</h3>
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
