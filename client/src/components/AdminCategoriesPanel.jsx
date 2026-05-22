import { useState } from 'react';
import Swal from 'sweetalert2';
import {
  createCategoryRequest,
  deleteCategoryRequest,
  isValidCategoryId,
  updateCategoryRequest,
} from '../routes/categoryService';

const CATEGORY_ID_ERROR = 'Esta categoria no tiene un identificador valido. Actualiza la lista antes de editar o eliminar.';

const getCategoryId = (category) => {
  const id = category?._id;
  return isValidCategoryId(id) ? id : '';
};

const AdminCategoriesPanel = ({ categories, loading = false, onCategoryCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [saving, setSaving] = useState(false);
  const [updatingCategoryId, setUpdatingCategoryId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isEditing = Boolean(editingCategory);

  const resetForm = () => {
    setName('');
    setDescription('');
    setEditingCategory(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Ingresa un nombre de categoria.');
      return;
    }

    try {
      setSaving(true);
      if (isEditing) {
        const categoryId = getCategoryId(editingCategory);

        if (!categoryId) {
          setError(CATEGORY_ID_ERROR);
          return;
        }

        await updateCategoryRequest(categoryId, {
          name: trimmedName,
          description: description.trim(),
        });
        setSuccess('Categoria actualizada correctamente.');
      } else {
        await createCategoryRequest({
          name: trimmedName,
          description: description.trim(),
        });
        setSuccess('Categoria creada correctamente.');
      }

      resetForm();
      await onCategoryCreated?.();
    } catch (requestError) {
      setError(requestError.message || `No se pudo ${isEditing ? 'actualizar' : 'crear'} la categoria.`);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (category) => {
    setError('');
    setSuccess('');

    if (!getCategoryId(category)) {
      setError(CATEGORY_ID_ERROR);
      return;
    }

    setEditingCategory(category);
    setName(category.name || category.label || category.value || '');
    setDescription(category.description || '');
  };

  const handleDelete = async (category) => {
    const categoryId = getCategoryId(category);
    const categoryName = category.name || category.label || category.value || categoryId;

    if (!categoryId) {
      setError(CATEGORY_ID_ERROR);
      return;
    }

    const confirmation = await Swal.fire({
      title: 'Eliminar categoria',
      text: `La categoria "${categoryName}" se eliminara solo si no tiene productos asociados.`,
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
      setError('');
      setSuccess('');
      setUpdatingCategoryId(categoryId);
      await deleteCategoryRequest(categoryId);

      if (editingCategory?._id === categoryId) {
        resetForm();
      }

      await onCategoryCreated?.();
      setSuccess('Categoria eliminada correctamente.');

      Swal.fire({
        title: 'Categoria eliminada',
        text: 'La categoria fue removida del panel.',
        icon: 'success',
        background: '#1a1d21',
        color: '#fff',
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (requestError) {
      const message = requestError.message || 'No se pudo eliminar la categoria.';
      setError(message);

      Swal.fire({
        title: 'No se pudo eliminar',
        text: message,
        icon: 'error',
        background: '#1a1d21',
        color: '#fff',
      });
    } finally {
      setUpdatingCategoryId('');
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
          {saving ? 'Guardando...' : isEditing ? 'Guardar categoria' : 'Crear categoria'}
        </button>
        {isEditing && (
          <button type="button" className="btn btn-outline-light" onClick={resetForm} disabled={saving}>
            Cancelar
          </button>
        )}
      </form>

      {error && <div className="alert alert-danger admin-form-alert mt-3">{error}</div>}
      {success && <div className="alert alert-success admin-form-alert mt-3">{success}</div>}

      <div className="admin-category-list">
        {loading ? (
          <span className="admin-category-muted">Cargando categorias...</span>
        ) : categories.length ? (
          categories.map((category) => {
            const id = getCategoryId(category);
            const key = id || category.name || category.label || category.value;
            const categoryName = category.name || category.label || category.value || id;
            const isUpdating = updatingCategoryId === id;
            const canManageCategory = Boolean(id);

            return (
              <article className="admin-category-item" key={key}>
                <div>
                  <span className="admin-product-category-badge">{categoryName}</span>
                  {category.description && <small>{category.description}</small>}
                  {!canManageCategory && <small>No disponible para editar o eliminar.</small>}
                </div>
                <div className="admin-category-actions">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light"
                    onClick={() => handleEdit(category)}
                    disabled={saving || isUpdating || !canManageCategory}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(category)}
                    disabled={saving || isUpdating || !canManageCategory}
                  >
                    {isUpdating ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </div>
              </article>
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
