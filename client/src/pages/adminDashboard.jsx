import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import AdminSidebar from '../components/AdminSidebar';
import AdminStatCard from '../components/AdminStatCard';
import AdminProductsTable from '../components/AdminProductsTable';
import ProductFormModal from '../components/ProductFormModal';
import AdminRecentActivity from '../components/AdminRecentActivity';
import AdminRecentMessages from '../components/AdminRecentMessages';
import { apiRequest } from '../routes/api';
import { getAdminStatsRequest } from '../routes/adminService';
import '../styles/admin.css';

const AdminSalesPage = lazy(() => import('./admin/AdminSalesPage'));
const AdminContactPage = lazy(() => import('./admin/AdminContactPage'));
const AdminDashboardMiniChart = lazy(() => import('../components/AdminDashboardMiniChart'));

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value);

const emptyStats = {
  totalSales: 0,
  totalProducts: 0,
  pendingOrders: 0,
  pendingMessages: 0,
  recentOrders: [],
  recentMessages: [],
  salesLast7Days: [],
  recentActivity: [],
};

const getAttentionTone = (value) => {
  const count = Number(value || 0);
  if (count === 0) return 'healthy';
  if (count <= 3) return 'warning';
  return 'danger';
};

const getAttentionBadge = (value) => {
  const count = Number(value || 0);
  if (count === 0) return 'Saludable';
  if (count <= 3) return 'Revisar';
  return 'Atencion';
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardStats, setDashboardStats] = useState(emptyStats);
  const [products, setProducts] = useState([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState('');
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
      setProductsLoaded(true);
    }
  }, []);

  const fetchDashboardStats = useCallback(async () => {
    try {
      setDashboardLoading(true);
      setDashboardError('');
      const data = await getAdminStatsRequest();
      setDashboardStats({ ...emptyStats, ...data });
    } catch (err) {
      console.error('Error fetching admin dashboard stats:', err);
      setDashboardStats(emptyStats);
      setDashboardError(err.message || 'No se pudo cargar el resumen admin.');
    } finally {
      setDashboardLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      fetchDashboardStats();
    });
  }, [fetchDashboardStats]);

  useEffect(() => {
    if (activeTab !== 'products' || productsLoaded || loading) return;
    queueMicrotask(() => {
      fetchProducts();
    });
  }, [activeTab, fetchProducts, loading, productsLoaded]);

  const statCards = useMemo(() => {
    const pendingOrderTone = getAttentionTone(dashboardStats.pendingOrders);
    const pendingMessageTone = getAttentionTone(dashboardStats.pendingMessages);

    return [
      {
        label: 'Ventas totales',
        value: formatCurrency(dashboardStats.totalSales),
        icon: 'bi-currency-dollar',
        color: '#42c4ff',
        loading: dashboardLoading,
        hint: dashboardError || 'Ordenes pagadas',
        tone: 'healthy',
        badge: 'Activo',
      },
      {
        label: 'Productos',
        value: dashboardStats.totalProducts,
        icon: 'bi-box',
        color: '#8d5cff',
        loading: dashboardLoading,
        hint: 'Activos en catalogo',
        tone: 'neutral',
        badge: 'Catalogo',
      },
      {
        label: 'Ordenes pendientes',
        value: dashboardStats.pendingOrders,
        icon: 'bi-clock-history',
        color: '#ffc107',
        loading: dashboardLoading,
        hint: dashboardError || 'Estado pendiente',
        tone: pendingOrderTone,
        badge: getAttentionBadge(dashboardStats.pendingOrders),
      },
      {
        label: 'Consultas pendientes',
        value: dashboardStats.pendingMessages,
        icon: 'bi-chat-left-text',
        color: '#53e8a8',
        loading: dashboardLoading,
        hint: 'Mensajes por responder',
        tone: pendingMessageTone,
        badge: getAttentionBadge(dashboardStats.pendingMessages),
      },
    ];
  }, [dashboardError, dashboardLoading, dashboardStats]);

  const isProductsView = activeTab === 'products';
  const pageTitle = {
    dashboard: 'Tablero admin',
    products: 'Gestion de productos',
    sales: 'Gestion de ventas',
    contacts: 'Gestion de consultas',
  }[activeTab] || 'Panel admin';

  const handleEdit = (product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (product) => {
    const result = await Swal.fire({
      title: 'Confirmar desactivacion',
      text: `El producto "${product.name}" pasara a estar inactivo.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#42c4ff',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, desactivar',
      cancelButtonText: 'Cancelar',
      background: '#1a1d21',
      color: '#fff',
    });

    if (!result.isConfirmed) return;

    try {
      await apiRequest(`/products/${product._id || product.id}`, { method: 'DELETE' });
      await fetchProducts();
      await fetchDashboardStats();
      Swal.fire({
        title: 'Producto desactivado',
        text: 'Ya no aparecera en el catalogo publico.',
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
        text: err.message || 'El servidor rechazo la operacion.',
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
    await fetchDashboardStats();

    Swal.fire({
      title: action === 'updated' ? 'Producto actualizado' : 'Producto creado',
      text: action === 'updated'
        ? 'Los cambios ya se reflejan en el catalogo.'
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
          <h1 className="h3 mb-0">{pageTitle}</h1>
          {isProductsView && (
            <button className="btn btn-primary-gradient" onClick={handleOpenCreateModal}>
              <i className="bi bi-plus-lg me-2" />
              Nuevo producto
            </button>
          )}
        </header>

        <div className="row g-4 mb-4">
          {statCards.map((stat) => (
            <AdminStatCard key={stat.label} stat={stat} />
          ))}
        </div>

        {activeTab === 'dashboard' ? (
          <motion.section
            className="admin-dashboard-overview"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32 }}
          >
            {dashboardError && (
              <div className="alert alert-warning admin-dashboard-alert">
                {dashboardError}
              </div>
            )}

            <div className="admin-dashboard-grid">
              <Suspense
                fallback={
                  <section className="admin-dashboard-panel admin-mini-chart-panel">
                    <div className="admin-panel-header">
                      <div>
                        <span className="admin-panel-eyebrow">Ventas</span>
                        <h2>Ultimos 7 dias</h2>
                      </div>
                    </div>
                    <div className="admin-chart-skeleton placeholder-glow">
                      <span className="placeholder col-12" />
                      <span className="placeholder col-10" />
                      <span className="placeholder col-8" />
                    </div>
                  </section>
                }
              >
                <AdminDashboardMiniChart data={dashboardStats.salesLast7Days} loading={dashboardLoading} />
              </Suspense>
              <AdminRecentActivity items={dashboardStats.recentActivity} loading={dashboardLoading} />
            </div>

            <div className="admin-dashboard-grid admin-dashboard-grid-secondary">
              <AdminRecentMessages messages={dashboardStats.recentMessages} loading={dashboardLoading} />
              <section className="admin-dashboard-panel admin-dashboard-summary p-4">
                <div className="admin-panel-header">
                  <div>
                    <span className="admin-panel-eyebrow">Centro rapido</span>
                    <h2>Resumen ejecutivo</h2>
                  </div>
                </div>
                <p className="admin-page-subtitle mb-0">
                  Usa este tablero para detectar pendientes y actividad reciente. La analitica detallada queda en Ventas.
                </p>
              </section>
            </div>
          </motion.section>
        ) : activeTab === 'sales' ? (
          <Suspense fallback={<div className="table-container admin-table-state">Cargando ventas...</div>}>
            <AdminSalesPage onOrdersChanged={fetchDashboardStats} />
          </Suspense>
        ) : activeTab === 'contacts' ? (
          <Suspense fallback={<div className="table-container admin-table-state">Cargando consultas...</div>}>
            <AdminContactPage onMessagesChanged={fetchDashboardStats} />
          </Suspense>
        ) : error ? (
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

      {isProductsView && (
        <ProductFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setProductToEdit(null);
          }}
          productToEdit={productToEdit}
          onProductCreated={handleProductSaved}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
