import { useEffect, useMemo, useState } from 'react';
import FormCharacterCounter from './FormCharacterCounter';
import { NUMBER_LIMITS, VALIDATION_LIMITS } from '../constants/validationLimits';
import { apiRequest } from '../routes/api';
import { getProductImage } from '../utils/productImage';

const ADMIN_PRODUCT_CATEGORIES = [
  { value: 'processors', label: 'Procesadores' },
  { value: 'graphics-cards', label: 'Placas de video' },
  { value: 'ram', label: 'Memoria RAM' },
  { value: 'storage', label: 'Almacenamiento' },
  { value: 'power-supplies', label: 'Fuentes' },
  { value: 'cases', label: 'Gabinetes' },
];

const CATEGORY_ALIASES = new Map([
  ['procesador', 'processors'],
  ['procesadores', 'processors'],
  ['cpu', 'processors'],
  ['processor', 'processors'],
  ['processors', 'processors'],
  ['placa de video', 'graphics-cards'],
  ['placas de video', 'graphics-cards'],
  ['gpu', 'graphics-cards'],
  ['tarjeta grafica', 'graphics-cards'],
  ['tarjetas graficas', 'graphics-cards'],
  ['graphics card', 'graphics-cards'],
  ['graphics-cards', 'graphics-cards'],
  ['ram', 'ram'],
  ['memoria ram', 'ram'],
  ['memory', 'ram'],
  ['disco', 'storage'],
  ['ssd', 'storage'],
  ['hdd', 'storage'],
  ['almacenamiento', 'storage'],
  ['storage', 'storage'],
  ['nvme', 'storage'],
  ['fuente', 'power-supplies'],
  ['fuentes', 'power-supplies'],
  ['psu', 'power-supplies'],
  ['power supply', 'power-supplies'],
  ['power-supplies', 'power-supplies'],
  ['gabinete', 'cases'],
  ['gabinetes', 'cases'],
  ['case', 'cases'],
  ['cases', 'cases'],
  ['chasis', 'cases'],
  ['chassis', 'cases'],
]);

const initialFormData = {
  name: '',
  price: '',
  category: '',
  stock: '',
  description: '',
  isActive: true,
};

const safeTextInputStyle = {
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const normalizeCategoryValue = (category = '') => {
  const normalized = String(category)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

  return CATEGORY_ALIASES.get(normalized) || category;
};

const validateForm = ({ formData, imageFile, isEditing }) => {
  const errors = {};
  const productNameTooLong = formData.name.trim().length > VALIDATION_LIMITS.productName;
  const productDescriptionTooLong =
    formData.description.trim().length > VALIDATION_LIMITS.productDescription;

  if (!formData.name.trim()) errors.name = 'Ingresá el nombre del producto.';
  if (!formData.description.trim()) errors.description = 'Ingresá una descripción breve.';
  if (!formData.category) errors.category = 'Seleccioná una categoría.';

  if (productNameTooLong) errors.name = 'El nombre es demasiado largo.';
  if (productDescriptionTooLong) errors.description = 'La descripcion es demasiado larga.';

  if (
    formData.price === '' ||
    !/^\d+(\.\d{1,2})?$/.test(String(formData.price)) ||
    Number(formData.price) < NUMBER_LIMITS.price.min ||
    Number(formData.price) > NUMBER_LIMITS.price.max
  ) {
    errors.price = 'Ingresá un precio válido.';
  }

  if (
    formData.stock === '' ||
    !/^\d+$/.test(String(formData.stock)) ||
    Number(formData.stock) < NUMBER_LIMITS.stock.min ||
    Number(formData.stock) > NUMBER_LIMITS.stock.max
  ) {
    errors.stock = 'Ingresá un stock entero válido.';
  }

  if (!isEditing && !imageFile) {
    errors.image = 'Seleccioná una imagen para crear el producto.';
  }

  return errors;
};

const getCategoryValue = (category) => {
  if (typeof category === 'object' && category !== null) {
    return category.slug || category.value || category.name || category.title || category._id || '';
  }

  return String(category || '');
};

const getCategoryLabel = (category) => {
  if (typeof category === 'object' && category !== null) {
    return category.label || category.name || category.title || category.slug || category._id || '';
  }

  return CATEGORY_ALIASES.get(normalizeCategoryValue(category)) || category;
};

const ProductFormModal = ({
  isOpen,
  onClose,
  onProductCreated,
  productToEdit = null,
  categories = ADMIN_PRODUCT_CATEGORIES,
}) => {
  const isEditing = Boolean(productToEdit);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const currentImageUrl = useMemo(
    () => (isEditing && productToEdit ? getProductImage(productToEdit) : ''),
    [isEditing, productToEdit],
  );

  const visibleImageUrl = imagePreviewUrl || currentImageUrl;
  const categoryOptions = useMemo(() => {
    const options = [...ADMIN_PRODUCT_CATEGORIES];
    const seenValues = new Set(options.map((item) => item.value));

    categories.forEach((category) => {
      const value = normalizeCategoryValue(getCategoryValue(category));
      const label = getCategoryLabel(category);

      if (!value || seenValues.has(value)) return;
      options.push({ value, label: label || value });
      seenValues.add(value);
    });

    return options;
  }, [categories]);

  useEffect(() => {
    if (!isOpen) return undefined;

    queueMicrotask(() => {
      if (isEditing && productToEdit) {
        setFormData({
          name: productToEdit.name || '',
          price: productToEdit.price ?? '',
          category: normalizeCategoryValue(productToEdit.category),
          stock: productToEdit.stock ?? '',
          description: productToEdit.description || '',
          isActive: productToEdit.isActive !== undefined ? productToEdit.isActive : true,
        });
      } else {
        setFormData(initialFormData);
      }

      setImageFile(null);
      setImagePreviewUrl('');
      setError(null);
      setFieldErrors({});
    });

    return undefined;
  }, [isOpen, isEditing, productToEdit]);

  useEffect(() => {
    if (!imageFile) {
      queueMicrotask(() => {
        setImagePreviewUrl('');
      });
      return undefined;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    queueMicrotask(() => {
      setImagePreviewUrl(objectUrl);
    });

    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  if (!isOpen) return null;

  const modalTitle = isEditing ? 'Editar producto' : 'Crear nuevo producto';
  const modalSubtitle = isEditing
    ? 'Actualizá la información del catálogo. La imagen actual se conserva si no elegís otra.'
    : 'Completá los datos para publicar un producto nuevo en el catálogo.';

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'price' && value && !/^\d*\.?\d{0,2}$/.test(value)) return;
    if (name === 'stock' && value && !/^\d*$/.test(value)) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0] || null;
    setImageFile(selectedFile);
    setFieldErrors((prev) => ({ ...prev, image: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const nextFieldErrors = validateForm({ formData, imageFile, isEditing });
    setFieldErrors(nextFieldErrors);

    if (Object.values(nextFieldErrors).some(Boolean)) {
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name.trim());
      data.append('price', formData.price);
      data.append('category', formData.category);
      data.append('stock', formData.stock);
      data.append('description', formData.description.trim());

      if (imageFile) data.append('image', imageFile);
      if (isEditing) data.append('isActive', formData.isActive);

      const endpoint = isEditing ? `/products/${productToEdit._id || productToEdit.id}` : '/products';
      const method = isEditing ? 'PUT' : 'POST';

      await apiRequest(endpoint, { method, body: data });

      setFormData(initialFormData);
      setImageFile(null);
      onProductCreated?.({ action: isEditing ? 'updated' : 'created' });
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err.message || 'No se pudo guardar el producto. Revisá los datos e intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (fieldName) =>
    `form-control admin-form-control ${fieldErrors[fieldName] ? 'is-invalid' : ''}`;
  const selectClass = `form-select admin-form-control ${fieldErrors.category ? 'is-invalid' : ''}`;

  return (
    <>
      <div className="modal-backdrop fade show admin-modal-backdrop" />
      <div className="modal fade show d-block admin-product-modal" tabIndex="-1" role="dialog" aria-modal="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content admin-modal-content">
            <div className="modal-header admin-modal-header">
              <div>
                <h5 className="modal-title">{modalTitle}</h5>
                <p>{modalSubtitle}</p>
              </div>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
                disabled={loading}
                aria-label="Cerrar"
              />
            </div>

            <form onSubmit={handleSubmit} id="productForm">
              <div className="modal-body admin-modal-body">
                {error && <div className="alert alert-danger admin-form-alert">{error}</div>}

                <section className="admin-form-section">
                  <div className="admin-form-section-heading">
                    <span>01</span>
                    <div>
                      <h6>Información básica</h6>
                      <p>Nombre visible y descripción para el catálogo público.</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label" htmlFor="product-name">Nombre del producto *</label>
                    <input
                      id="product-name"
                      type="text"
                      className={inputClass('name')}
                      name="name"
                      maxLength={VALIDATION_LIMITS.productName}
                      value={formData.name}
                      onChange={handleChange}
                      style={safeTextInputStyle}
                      placeholder="Ej: AMD Ryzen 7 7800X3D"
                      disabled={loading}
                    />
                    <FormCharacterCounter value={formData.name} max={VALIDATION_LIMITS.productName} />
                    {fieldErrors.name && <div className="invalid-feedback">{fieldErrors.name}</div>}
                  </div>

                  <div>
                    <label className="form-label" htmlFor="product-description">Descripción *</label>
                    <textarea
                      id="product-description"
                      className={inputClass('description')}
                      name="description"
                      maxLength={VALIDATION_LIMITS.productDescription}
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                      style={{ ...safeTextInputStyle, resize: 'vertical' }}
                      placeholder="Resumen corto con compatibilidad, uso recomendado o características principales."
                      disabled={loading}
                    />
                    <FormCharacterCounter value={formData.description} max={VALIDATION_LIMITS.productDescription} />
                    {fieldErrors.description && <div className="invalid-feedback">{fieldErrors.description}</div>}
                  </div>
                </section>

                <section className="admin-form-section">
                  <div className="admin-form-section-heading">
                    <span>02</span>
                    <div>
                      <h6>Precio y stock</h6>
                      <p>Datos operativos usados por catálogo, carrito y finalización de compra.</p>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3 mb-md-0">
                      <label className="form-label" htmlFor="product-price">Precio *</label>
                      <input
                        id="product-price"
                        type="number"
                        className={inputClass('price')}
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min="0"
                        max={NUMBER_LIMITS.price.max}
                        step="0.01"
                        inputMode="decimal"
                        placeholder="159999.99"
                        disabled={loading}
                      />
                      {fieldErrors.price && <div className="invalid-feedback">{fieldErrors.price}</div>}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label" htmlFor="product-stock">Stock disponible *</label>
                      <input
                        id="product-stock"
                        type="number"
                        className={inputClass('stock')}
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        min="0"
                        max={NUMBER_LIMITS.stock.max}
                        step="1"
                        inputMode="numeric"
                        placeholder="12"
                        disabled={loading}
                      />
                      {fieldErrors.stock && <div className="invalid-feedback">{fieldErrors.stock}</div>}
                    </div>
                  </div>
                </section>

                <section className="admin-form-section">
                  <div className="admin-form-section-heading">
                    <span>03</span>
                    <div>
                      <h6>Categoría</h6>
                      <p>Usá categorías compatibles con Armá tu PC.</p>
                    </div>
                  </div>

                  <label className="form-label" htmlFor="product-category">Categoría *</label>
                  <select
                    id="product-category"
                    className={selectClass}
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="" disabled>Seleccioná una categoría</option>
                    {categoryOptions.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.category && <div className="invalid-feedback d-block">{fieldErrors.category}</div>}
                </section>

                <section className="admin-form-section">
                  <div className="admin-form-section-heading">
                    <span>04</span>
                    <div>
                      <h6>Imagen</h6>
                      <p>Formatos permitidos: JPG, PNG o WEBP. Tamaño máximo configurado: 5 MB.</p>
                    </div>
                  </div>

                  <div className="admin-image-field">
                    <div className="admin-image-preview">
                      {visibleImageUrl ? (
                        <img src={visibleImageUrl} alt="Vista previa del producto" />
                      ) : (
                        <div>
                          <i className="bi bi-image" aria-hidden="true" />
                          <span>Sin imagen</span>
                        </div>
                      )}
                    </div>

                    <div className="admin-image-controls">
                      <label className="form-label" htmlFor="product-image">
                        {isEditing ? 'Reemplazar imagen' : 'Imagen del producto *'}
                      </label>
                      <input
                        id="product-image"
                        type="file"
                        className={inputClass('image')}
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileChange}
                        disabled={loading}
                      />
                      <p className="admin-help-text">
                        {imageFile
                          ? `Archivo elegido: ${imageFile.name}`
                          : isEditing
                            ? 'Si no elegís un archivo, se conserva la imagen actual.'
                            : 'Elegí una imagen clara del producto.'}
                      </p>
                      {fieldErrors.image && <div className="invalid-feedback d-block">{fieldErrors.image}</div>}
                    </div>
                  </div>
                </section>

                {isEditing && (
                  <section className="admin-form-section admin-form-section-compact">
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="isActiveSwitch"
                        name="isActive"
                        checked={formData.isActive}
                        disabled={loading}
                        onChange={(event) =>
                          setFormData((prev) => ({ ...prev, isActive: event.target.checked }))
                        }
                      />
                      <label className="form-check-label" htmlFor="isActiveSwitch">Producto activo</label>
                    </div>
                  </section>
                )}
              </div>

              <div className="modal-footer admin-modal-footer">
                <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={loading}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary-gradient" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                      Guardando...
                    </>
                  ) : (
                    isEditing ? 'Guardar cambios' : 'Crear producto'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductFormModal;
