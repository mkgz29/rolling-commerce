import { useState } from 'react';
import { createCategoryRequest } from '../routes/categoryService';

const AdminCategoriesPanel = ({ categories, loading = false, onCategoryCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Ingresa un nombre de categoria.');
      return;
    }

    try {
      setSaving(true);
      await createCategoryRequest({
        name: trimmedName,
        description: description.trim(),
      });
      setName('');
      setDescription('');
      await onCategoryCreated?.();
    } catch (requestError) {
      setError(requestError.message || 'No se pudo crear la categoria.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="table-container admin-categories-panel p-4 mb-4">
      <div className="admin-products-section-header">
        <div>
          <span className="admin-panel-eyebrow">Categorias</span>
          <h2>Gestion rapida</h2>
        </div>
        <span className="admin-products-count">{categories.length}</span>
      </div>

      <form className="admin-category-form" onSubmit={handleSubmit}>
        <div>
          <label className="form-label" htmlFor="admin-category-name">Nombre</label>
          <input
            id="admin-category-name"
            className="form-control admin-form-control"
            value={name}
            maxLength={80}
            placeholder="Ej: Monitores"
            onChange={(event) => setName(event.target.value)}
            disabled={saving}
          />
        </div>
        <div>
          <label className="form-label" htmlFor="admin-category-description">Descripcion</label>
          <input
            id="admin-category-description"
            className="form-control admin-form-control"
            value={description}
            maxLength={220}
            placeholder="Uso interno opcional"
            onChange={(event) => setDescription(event.target.value)}
            disabled={saving}
          />
        </div>
        <button type="submit" className="btn btn-primary-gradient" disabled={saving || loading}>
          {saving ? 'Creando...' : 'Crear categoria'}
        </button>
      </form>

      {error && <div className="alert alert-danger admin-form-alert mt-3">{error}</div>}

      <div className="admin-category-list">
        {loading ? (
          <span className="admin-category-muted">Cargando categorias...</span>
        ) : categories.length ? (
          categories.map((category) => {
            const id = category._id || category.name;
            return (
              <span className="admin-product-category-badge" key={id}>
                {category.name || category.label || category.value || id}
              </span>
            );
          })
        ) : (
          <span className="admin-category-muted">No hay categorias cargadas.</span>
        )}
      </div>
    </section>
  );
};

export default AdminCategoriesPanel;
