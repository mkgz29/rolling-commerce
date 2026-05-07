import { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminStatCard from '../components/AdminStatCard';
import AdminProductsTable from '../components/AdminProductsTable';
import '../styles/admin.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');

  // Datos de ejemplo para la tabla
  const products = [
    { id: 1, name: 'GeForce RTX 4090', category: 'GPUs', price: '$1.999', stock: 5 },
    { id: 2, name: 'Intel Core i9-14900K', category: 'CPUs', price: '$589', stock: 12 },
    { id: 3, name: 'ASUS ROG Maximus Z790', category: 'Motherboards', price: '$629', stock: 8 },
    { id: 4, name: 'Corsair Dominator 32GB', category: 'RAM', price: '$210', stock: 25 },
  ];

  return (
    <div className="admin-layout d-flex">
      {/* Sidebar (Refactorizado) */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="admin-content p-4 flex-grow-1">
        <header className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3 mb-0">Gestión de Inventario</h1>
          <button className="btn btn-primary-gradient">
            <i className="bi bi-plus-lg me-2"></i> Nuevo Producto
          </button>
        </header>

        {/* Stats Grid */}
        <div className="row g-4 mb-4">
          {[
            { label: 'Ventas Totales', value: '$45.200', icon: 'bi-currency-dollar', color: '#42c4ff' },
            { label: 'Productos', value: '124', icon: 'bi-box', color: '#8d5cff' },
            { label: 'Órdenes Pendientes', value: '18', icon: 'bi-clock-history', color: '#ffc107' }
          ].map((stat, idx) => (
            <AdminStatCard key={idx} stat={stat} />
          ))}
        </div>

        {/* Table Section */}
        <AdminProductsTable products={products} />
      </main>
    </div>
  );
};

export default AdminDashboard;
