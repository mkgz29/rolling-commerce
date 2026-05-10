import { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminStatCard from '../components/AdminStatCard';
import AdminProductsTable from '../components/AdminProductsTable';
import ProductFormModal from '../components/ProductFormModal';
import { apiRequest } from '../routes/api';
import Swal from 'sweetalert2';
import '../styles/admin.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/products', { params: { includeInactive: true } });
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const totalProducts = products.filter(p => p.isActive !== false).length;

  const handleEdit = (product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (product) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `El producto "${product.name}" pasará a estar inactivo.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#42c4ff',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar',
      background: '#1a1d21',
      color: '#fff'
    });

    if (result.isConfirmed) {
      try {
        await apiRequest(`/products/${product._id || product.id}`, { method: 'DELETE' });
        Swal.fire({
          title: 'Desactivado',
          text: 'El producto ha sido marcado como inactivo.',
          icon: 'success',
          background: '#1a1d21',
          color: '#fff'
        });
        fetchProducts();
      } catch (err) {
        console.error('Error deleting product:', err);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo desactivar el producto.',
          icon: 'error',
          background: '#1a1d21',
          color: '#fff'
        });
      }
    }
  };

  const handleOpenCreateModal = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  return (
    <div className="admin-layout d-flex">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="admin-content p-4 flex-grow-1">
        <header className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3 mb-0">Gestión de Inventario</h1>
          <button className="btn btn-primary-gradient" onClick={handleOpenCreateModal}>
            <i className="bi bi-plus-lg me-2"></i> Nuevo Producto
          </button>
        </header>

        {/* Stats Grid */}
        <div className="row g-4 mb-4">
          {[
            { label: 'Ventas Totales', value: '$45.200', icon: 'bi-currency-dollar', color: '#42c4ff' },
            { label: 'Productos', value: totalProducts, icon: 'bi-box', color: '#8d5cff' },
            { label: 'Órdenes Pendientes', value: '18', icon: 'bi-clock-history', color: '#ffc107' }
          ].map((stat, idx) => (
            <AdminStatCard key={idx} stat={stat} />
          ))}
        </div>

        {/* Table Section */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <AdminProductsTable 
            products={products} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        )}
      </main>

      <ProductFormModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setProductToEdit(null);
        }} 
        productToEdit={productToEdit}
        onProductCreated={() => {
          setIsModalOpen(false);
          setProductToEdit(null);
          fetchProducts();
        }} 
      />
    </div>
  );
};

export default AdminDashboard;
