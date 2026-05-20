import { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import AdminSidebar from '../components/AdminSidebar';
import AdminStatCard from '../components/AdminStatCard';
import AdminProductsTable from '../components/AdminProductsTable';
import ProductFormModal from '../components/ProductFormModal';
import { apiRequest } from '../routes/api';
import { getOrdersRequest } from '../routes/orderService';
import '../styles/admin.css';

const unwrapOrders = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.orders)) return data.orders;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value);

const isPaidOrder = (order) => ['paid', 'delivered', 'approved'].includes(String(order?.status || '').toLowerCase());

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [metricsError, setMetricsError] = useState('');
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/products', { params: { includeInactive: true } });
      setProducts(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Error al cargar los productos.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      setMetricsLoading(true);
      setMetricsError('');
      const data = await getOrdersRequest();
      setOrders(unwrapOrders(data));
    } catch (err) {
      console.error('Error fetching orders for admin metrics:', err);
      setOrders([]);
      setMetricsError('Órdenes no disponibles');
    } finally {
      setMetricsLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      fetchProducts();
      fetchOrders();
    });
  }, [fetchProducts, fetchOrders]);

  const totalProducts = products.filter((product) => product.isActive !== false).length;
  const pendingOrders = orders.filter((order) => String(order?.status || '').toLowerCase() === 'pending').length;
  const totalSales = orders
    .filter(isPaidOrder)
    .reduce((total, order) => total + Number(order.total || order.totalAmount || 0), 0);

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
      color: '#fff',
    });

    if (!result.isConfirmed) return;

    try {
      await apiRequest(`/products/${product._id || product.id}`, { method: 'DELETE' });
      await fetchProducts();
      Swal.fire({
        title: 'Producto desactivado',
        text: 'Ya no aparecerá en el catálogo público.',
        icon: 'success',
        background: '#1a1d21',
        color: '#fff',
        timer: 2200,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error('Error deleting product:', err);
      Swal.fire({
        title: 'No se pudo desactivar',
        text: err.message || 'El servidor rechazó la operación.',
        icon: 'error',
        background: '#1a1d21',
        color: '#fff',
      });
    }
  };

  const handleOpenCreateModal = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const handleProductSaved = async ({ action } = {}) => {
    setIsModalOpen(false);
    setProductToEdit(null);
    await fetchProducts();

    Swal.fire({
      title: action === 'updated' ? 'Producto actualizado' : 'Producto creado',
      text: action === 'updated'
        ? 'Los cambios ya se reflejan en el catálogo.'
        : 'El producto fue guardado y ya puede aparecer en Productos.',
      icon: 'success',
      background: '#1a1d21',
      color: '#fff',
      timer: 2200,
      showConfirmButton: false,
    });
  };

  return (
    <div className="admin-layout d-flex">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="admin-content p-4 flex-grow-1">
        <header className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3 mb-0">Gestión de inventario</h1>
          <button className="btn btn-primary-gradient" onClick={handleOpenCreateModal}>
            <i className="bi bi-plus-lg me-2" />
            Nuevo producto
          </button>
        </header>

        <div className="row g-4 mb-4">
          {[
            {
              label: 'Ventas totales',
              value: formatCurrency(totalSales),
              icon: 'bi-currency-dollar',
              color: '#42c4ff',
              loading: metricsLoading,
              hint: metricsError || 'Órdenes pagadas',
            },
            {
              label: 'Productos',
              value: totalProducts,
              icon: 'bi-box',
              color: '#8d5cff',
              loading,
              hint: 'Activos en catálogo',
            },
            {
              label: 'Órdenes pendientes',
              value: pendingOrders,
              icon: 'bi-clock-history',
              color: '#ffc107',
              loading: metricsLoading,
              hint: metricsError || 'Estado pendiente',
            },
          ].map((stat) => (
            <AdminStatCard key={stat.label} stat={stat} />
          ))}
        </div>

        {error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <AdminProductsTable
            products={products}
            loading={loading}
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
        onProductCreated={handleProductSaved}
      />
    </div>
  );
};

export default AdminDashboard;
