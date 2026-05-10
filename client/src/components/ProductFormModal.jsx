import { useState, useEffect } from 'react';
import { apiRequest } from '../routes/api';

const ProductFormModal = ({ isOpen, onClose, onProductCreated, productToEdit = null }) => {
  const isEditing = !!productToEdit;
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    stock: '',
    description: '',
    isActive: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (isEditing && productToEdit) {
        setFormData({
          name: productToEdit.name || '',
          price: productToEdit.price || '',
          category: productToEdit.category || '',
          stock: productToEdit.stock || '',
          description: productToEdit.description || '',
          isActive: productToEdit.isActive !== undefined ? productToEdit.isActive : true,
        });
      } else {
        setFormData({ name: '', price: '', category: '', stock: '', description: '', isActive: true });
      }
      setImageFile(null);
      setError(null);
    }
  }, [isOpen, isEditing, productToEdit]);

  useEffect(() => {
    if (isOpen) {
      const fetchCategories = async () => {
        try {
          setLoadingCategories(true);
          const data = await apiRequest('/categories');
          setCategoriesList(data);
        } catch (err) {
          console.error('Error fetching categories:', err);
        } finally {
          setLoadingCategories(false);
        }
      };
      fetchCategories();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('price', formData.price);
      data.append('category', formData.category);
      data.append('stock', formData.stock);
      data.append('description', formData.description);
      
      if (imageFile) {
        data.append('image', imageFile);
      }
      
      if (isEditing) {
        data.append('isActive', formData.isActive);
      }

      const endpoint = isEditing ? `/products/${productToEdit._id || productToEdit.id}` : '/products';
      const method = isEditing ? 'PUT' : 'POST';

      await apiRequest(endpoint, {
        method,
        body: data,
      });

      // Limpiar formulario y cerrar
      setFormData({ name: '', price: '', category: '', stock: '', description: '', isActive: true });
      setImageFile(null);
      onProductCreated();
    } catch (err) {
      console.error('Error creating product:', err);
      setError(err.message || 'Error al crear el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>
      <div className="modal fade show d-block" tabIndex="-1" style={{ zIndex: 1050 }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-dark text-light border-secondary">
            <div className="modal-header border-secondary">
              <h5 className="modal-title">{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</h5>
              <button 
                type="button" 
                className="btn-close btn-close-white" 
                onClick={onClose}
                disabled={loading}
              ></button>
            </div>
            
            <div className="modal-body">
              {error && <div className="alert alert-danger py-2">{error}</div>}
              
              <form onSubmit={handleSubmit} id="productForm">
                <div className="mb-3">
                  <label className="form-label">Nombre del Producto *</label>
                  <input 
                    type="text" 
                    className="form-control bg-dark text-light border-secondary" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required 
                  />
                </div>
                
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Precio ($) *</label>
                    <input 
                      type="number" 
                      className="form-control bg-dark text-light border-secondary" 
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      required 
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Stock *</label>
                    <input 
                      type="number" 
                      className="form-control bg-dark text-light border-secondary" 
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      min="0"
                      required 
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Categoría *</label>
                  <select 
                    className="form-select bg-dark text-light border-secondary" 
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required 
                    disabled={loadingCategories}
                  >
                    <option value="" disabled>
                      {loadingCategories ? 'Cargando categorías...' : 'Selecciona una categoría'}
                    </option>
                    {categoriesList.map((cat) => (
                      <option key={cat._id || cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Descripción *</label>
                  <textarea 
                    className="form-control bg-dark text-light border-secondary" 
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    required
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label">Imagen {isEditing ? '(Opcional si no se desea cambiar)' : '*'}</label>
                  <input 
                    type="file" 
                    className="form-control bg-dark text-light border-secondary" 
                    accept="image/*"
                    onChange={handleFileChange}
                    required={!isEditing} 
                  />
                </div>

                {isEditing && (
                  <div className="mb-3 form-check form-switch">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      role="switch" 
                      id="isActiveSwitch"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    />
                    <label className="form-check-label" htmlFor="isActiveSwitch">Producto Activo</label>
                  </div>
                )}
              </form>
            </div>
            
            <div className="modal-footer border-secondary">
              <button 
                type="button" 
                className="btn btn-outline-secondary" 
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                form="productForm" 
                className="btn btn-primary-gradient"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Guardando...
                  </>
                ) : (
                  isEditing ? 'Actualizar Producto' : 'Guardar Producto'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductFormModal;
