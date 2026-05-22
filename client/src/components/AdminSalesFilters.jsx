const ORDER_STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'paid', label: 'Aprobada' },
  { value: 'cancelled', label: 'Rechazada' },
  { value: 'delivered', label: 'Entregada' },
];

const AdminSalesFilters = ({ filters, onChange, onSubmit, onReset, loading = false }) => {
  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextValue = name === 'customer' ? value.slice(0, 80) : value;
    onChange({ ...filters, [name]: nextValue });
  };

  return (
    <form className="admin-sales-filters table-container p-3 mb-4" onSubmit={onSubmit}>
      <div className="row g-3 align-items-end">
        <div className="col-lg-3 col-md-6">
          <label className="form-label" htmlFor="sales-customer">Cliente o email</label>
          <input
            id="sales-customer"
            name="customer"
            type="search"
            className="form-control admin-form-control"
            value={filters.customer}
            onChange={handleChange}
            placeholder="Buscar cliente"
            maxLength={80}
          />
        </div>

        <div className="col-lg-2 col-md-6">
          <label className="form-label" htmlFor="sales-status">Estado</label>
          <select
            id="sales-status"
            name="status"
            className="form-select admin-form-control"
            value={filters.status}
            onChange={handleChange}
          >
            {ORDER_STATUS_OPTIONS.map((option) => (
              <option key={option.value || 'all'} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="col-lg-2 col-md-6">
          <label className="form-label" htmlFor="sales-from">Desde</label>
          <input
            id="sales-from"
            name="from"
            type="date"
            className="form-control admin-form-control"
            value={filters.from}
            onChange={handleChange}
          />
        </div>

        <div className="col-lg-2 col-md-6">
          <label className="form-label" htmlFor="sales-to">Hasta</label>
          <input
            id="sales-to"
            name="to"
            type="date"
            className="form-control admin-form-control"
            value={filters.to}
            onChange={handleChange}
          />
        </div>

        <div className="col-lg-3 d-flex gap-2">
          <button type="submit" className="btn btn-primary-gradient flex-grow-1" disabled={loading}>
            {loading ? 'Filtrando...' : 'Aplicar filtros'}
          </button>
          <button type="button" className="btn btn-outline-light" onClick={onReset} disabled={loading}>
            Limpiar
          </button>
        </div>
      </div>
    </form>
  );
};

export { ORDER_STATUS_OPTIONS };
export default AdminSalesFilters;
