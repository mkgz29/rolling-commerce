import { useState } from 'react';
import ProductBuildCard from '../components/ProductBuildCard';
import BuildSidebar from '../components/BuildSidebar';
import BuildHeader from '../components/BuildHeader';
import '../styles/build.css';

const categories = [
  { id: 'cpu', label: 'PROCESADORES', icon: 'bi-cpu' },
  { id: 'gpu', label: 'PLACAS DE VIDEO', icon: 'bi-gpu-card' },
  { id: 'ram', label: 'MEMORIA RAM', icon: 'bi-memory' },
  { id: 'storage', label: 'ALMACENAMIENTO', icon: 'bi-device-ssd' },
  { id: 'psu', label: 'FUENTES', icon: 'bi-plug' },
  { id: 'case', label: 'GABINETES', icon: 'bi-pc-display' },
];

const BuildYourPc = () => {
  const [activeCat, setActiveCat] = useState('cpu');

  // Mock de productos para la visualización
  const products = [
    { id: 1, name: 'AMD RYZEN 9 7950X', desc: 'AM5 • 16 CORES • 5.7GHZ', price: 685000 },
    { id: 2, name: 'AMD RYZEN 7 7800X3D', desc: 'AM5 • 8 CORES • 5.0GHZ', price: 520000 },
    { id: 3, name: 'AMD RYZEN 5 7600X', desc: 'AM5 • 6 CORES • 5.3GHZ', price: 310000 },
    { id: 4, name: 'INTEL CORE I9-14900K', desc: 'LGA1700 • 24 CORES • 6.0GHZ', price: 710000 },
    { id: 5, name: 'INTEL CORE I7-14700K', desc: 'LGA1700 • 20 CORES • 5.6GHZ', price: 545000 },
    { id: 6, name: 'AMD RYZEN 5 5600X', desc: 'AM4 • 6 CORES • 4.6GHZ', price: 210000 },
  ];

  return (
    <div className="ensambly-layout d-flex">
      {/* Sidebar de Categorías (Refactorizado) */}
      <BuildSidebar 
        categories={categories} 
        activeCat={activeCat} 
        setActiveCat={setActiveCat} 
      />

      {/* Área Principal de Productos */}
      <main className="ensambly-content flex-grow-1 p-4">
        <BuildHeader categories={categories} activeCat={activeCat} />

        {/* Grilla de Productos */}
        <div className="row g-4">
          {products.map(product => (
            <ProductBuildCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-5 mb-5">
          <button className="btn btn-outline-secondary px-5 py-2">CARGAR MÁS PRODUCTOS</button>
        </div>
      </main>
    </div>
  );
};

export default BuildYourPc;
