import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import AdminSidebar from '../components/AdminSidebar';
import AdminStatCard from '../components/AdminStatCard';
import AdminProductsTable from '../components/AdminProductsTable';
import ProductFormModal from '../components/ProductFormModal';
import AdminCategoriesPanel from '../components/AdminCategoriesPanel';
import AdminRecentActivity from '../components/AdminRecentActivity';
import AdminRecentMessages from '../components/AdminRecentMessages';
import { apiRequest } from '../routes/api';
import { getAdminStatsRequest } from '../routes/adminService';
import { getCategoriesRequest } from '../routes/categoryService';
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
  inactiveProducts: 0,
  pendingOrders: 0,
  pendingMessages: 0,
  recentOrders: [],
  recentMessages: [],
  recentProducts: [],
  latestOrder: null,
  latestPaidOrder: null,
  latestProduct: null,
  latestPendingOrder: null,
  updatedAt: null,
  salesLast7Days: [],
  recentActivity: [],
};

const formatDateTime = (value) => {
  if (!value) return 'Sin datos';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Sin datos';

  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const getOrderSummary = (order) => {
  if (!order) return '';
  const customer = order.customerName || order.customerEmail || 'Cliente';
  return `${customer} · ${formatCurrency(order.total)}`;
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
  const [categories, setCategories] = useState([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
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

  const fetchCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      const data = await getCategoriesRequest();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message || 'Error al cargar las categorias.');
    } finally {
      setCategoriesLoading(false);
      setCategoriesLoaded(true);
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

  useEffect(() => {
    if (activeTab !== 'products' || categoriesLoaded || categoriesLoading) return;
    queueMicrotask(() => {
      fetchCategories();
    });
  }, [activeTab, categoriesLoaded, categoriesLoading, fetchCategories]);

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

  const executiveSummaryItems = useMemo(() => {
    const latestSale = dashboardStats.latestPaidOrder || dashboardStats.latestOrder;
    const items = [
      {
        label: dashboardStats.latestPaidOrder ? 'Ultima venta registrada' : 'Ultima orden registrada',
        value: latestSale ? getOrderSummary(latestSale) : '',
        meta: latestSale ? formatDateTime(latestSale.createdAt) : '',
        icon: 'bi-receipt',
        tone: latestSale?.status || 'neutral',
      },
      {
        label: 'Ultimo producto creado',
        value: dashboardStats.latestProduct?.name || '',
        meta: dashboardStats.latestProduct ? formatDateTime(dashboardStats.latestProduct.createdAt) : '',
        icon: 'bi-box-seam',
        tone: dashboardStats.latestProduct?.isActive === false ? 'inactive' : 'active',
      },
      {
        label: 'Productos inactivos',
        value: Number(dashboardStats.inactiveProducts || 0).toLocaleString('es-AR'),
        meta: 'Fuera del catalogo publico',
        icon: 'bi-eye-slash',
        tone: Number(dashboardStats.inactiveProducts || 0) > 0 ? 'warning' : 'healthy',
      },
      {
        label: 'Consultas pendientes',
        value: Number(dashboardStats.pendingMessages || 0).toLocaleString('es-AR'),
        meta: Number(dashboardStats.pendingMessages || 0) === 1 ? 'Mensaje por responder' : 'Mensajes por responder',
        icon: 'bi-chat-left-text',
        tone: Number(dashboardStats.pendingMessages || 0) > 0 ? 'warning' : 'healthy',
      },
      {
        label: 'Orden pendiente mas reciente',
        value: dashboardStats.latestPendingOrder ? getOrderSummary(dashboardStats.latestPendingOrder) : '',
        meta: dashboardStats.latestPendingOrder ? formatDateTime(dashboardStats.latestPendingOrder.createdAt) : '',
        icon: 'bi-clock-history',
        tone: 'pending',
      },
      {
        label: 'Ultima actualizacion',
        value: dashboardStats.updatedAt ? formatDateTime(dashboardStats.updatedAt) : '',
        meta: dashboardError || 'Datos sincronizados del backend',
        icon: 'bi-arrow-repeat',
        tone: dashboardError ? 'danger' : 'neutral',
      },
    ];

    return items;
  }, [dashboardError, dashboardStats]);

  const hasExecutiveData = executiveSummaryItems.some((item) => item.value && item.value !== '0');

  const isProductsView = activeTab === 'products';
  const categoryLabels = useMemo(() => {
    const labels = {};
    categories.forEach((category) => {
      const value = category.slug || category.value || category.name || category.title || category._id;
      const label = category.label || category.name || category.title || value;
      if (value) labels[value] = label;
    });
    return labels;
  }, [categories]);
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
  const handleActivate = async (product) => {
try {
 await apiRequest(`/products/${product._id || product.id}`, {
  method: 'PATCH',
  body: {
    name: product.name,
    price: product.price,
    description: product.description,
    image: product.image,
    imageUrl: product.imageUrl,
    publicId: product.publicId,
    images: product.images,
    category: product.category,
    brand: product.brand,
    specs: product.specs,
    stock: product.stock,
    isActive: true,
  },
});

  await fetchProducts();

  Swal.fire({
    title: 'Producto activado',
    text: 'El producto volvió a estar visible en el catálogo.',
    icon: 'success',
    background: '#1a1d21',
    color: '#fff',
    timer: 2200,
    showConfirmButton: false,
  });
} catch (err) {
  console.error('Error activating product:', err);

  Swal.fire({
    title: 'No se pudo activar',
    text: err.message || 'El servidor rechazó la operación.',
    icon: 'error',
    background: '#1a1d21',
    color: '#fff',
  });
}
};
  const handlePermanentDelete = async (product) => {
    const result = await Swal.fire({
      title: '¿Borrar producto definitivamente?',
      text: `El producto "${product.name}" será eliminado permanentemente de MongoDB.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar',
      background: '#1a1d21',
      color: '#fff',
    });

    if (!result.isConfirmed) return;

    try {
      await apiRequest(`/products/${product._id || product.id}/permanent`, {
        method: 'DELETE',
      });

      await fetchProducts();

      Swal.fire({
        title: 'Producto eliminado',
        text: 'El producto fue eliminado definitivamente.',
        icon: 'success',
        background: '#1a1d21',
        color: '#fff',
        timer: 2200,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error('Error permanently deleting product:', err);

      Swal.fire({
        title: 'No se pudo borrar',
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
                <AdminDashboardMiniChart
                  data={dashboardStats.salesLast7Days}
                  loading={dashboardLoading}
                  totalSales={dashboardStats.totalSales}
                />
              </Suspense>
              <AdminRecentActivity items={dashboardStats.recentActivity} loading={dashboardLoading} />
            </div>

            <div className="admin-dashboard-grid admin-dashboard-grid-secondary">
              <AdminRecentMessages messages={dashboardStats.recentMessages} loading={dashboardLoading} />
              <section className="admin-dashboard-panel admin-dashboard-summary p-4">
                <div className="admin-panel-header">
                  <div>
                    <span className="admin-panel-eyebrow">Centro operativo</span>
                    <h2>Resumen ejecutivo</h2>
                  </div>
                </div>
                {dashboardLoading ? (
                  <div className="admin-executive-list placeholder-glow">
                    <span className="placeholder col-12" />
                    <span className="placeholder col-10" />
                    <span className="placeholder col-11" />
                  </div>
                ) : hasExecutiveData ? (
                  <div className="admin-executive-list">
                    {executiveSummaryItems.map((item) => (
                      <article className={`admin-executive-item admin-executive-${item.tone}`} key={item.label}>
                        <i className={`bi ${item.icon}`} aria-hidden="true" />
                        <div>
                          <span>{item.label}</span>
                          <strong>{item.value || 'Sin registros'}</strong>
                          {item.meta && <small>{item.meta}</small>}
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="admin-empty-compact">
                    <i className="bi bi-clipboard-data" aria-hidden="true" />
                    <p>No hay actividad suficiente para armar el resumen.</p>
                  </div>
                )}
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
          <>
            <AdminCategoriesPanel
              categories={categories}
              loading={categoriesLoading}
              onCategoryCreated={fetchCategories}
            />
            <AdminProductsTable
              products={products}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onActivate={handleActivate}
              onPermanentDelete={handlePermanentDelete}
              categoryLabels={categoryLabels}
            />
          </>
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
          categories={categories}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
