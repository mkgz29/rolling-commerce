import { Link } from 'react-router-dom';
import {
  Box,
  CircuitBoard,
  Cpu,
  HardDrive,
  MemoryStick,
  PlugZap,
} from 'lucide-react';

const categories = [
  {
    id: 'processors',
    label: 'Procesadores',
    description: 'CPUs para gaming, creación y equipos de alto rendimiento.',
    icon: Cpu,
    categoryKey: 'processors',
    accent: 'cyan',
  },
  {
    id: 'graphics-cards',
    label: 'Placas de video',
    description: 'GPUs preparadas para juegos exigentes, render y streaming.',
    icon: CircuitBoard,
    categoryKey: 'graphics-cards',
    accent: 'violet',
  },
  {
    id: 'ram',
    label: 'Memoria RAM',
    description: 'Módulos veloces para multitarea fluida y builds estables.',
    icon: MemoryStick,
    categoryKey: 'ram',
    accent: 'blue',
  },
  {
    id: 'storage',
    label: 'Almacenamiento',
    description: 'SSD, NVMe y discos para cargar juegos y proyectos más rápido.',
    icon: HardDrive,
    categoryKey: 'storage',
    accent: 'magenta',
  },
  {
    id: 'power-supplies',
    label: 'Fuentes',
    description: 'Energía confiable para sostener componentes actuales y futuros.',
    icon: PlugZap,
    categoryKey: 'power-supplies',
    accent: 'cyan',
  },
  {
    id: 'cases',
    label: 'Gabinetes',
    description: 'Chasis con flujo de aire, espacio y estética para cerrar tu equipo.',
    icon: Box,
    categoryKey: 'cases',
    accent: 'violet',
  },
].map((category) => ({
  ...category,
  to: `/products?category=${encodeURIComponent(category.categoryKey)}`,
}));

function CategoriesSection() {
  return (
    <section className="categories-section py-5">
      <div className="container">
        <div className="category-section-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end mb-4 gap-3">
          <div className="section-heading">
            <h2 className="split-heading">
              <span className="title-accent">Componentes clave</span>
              <span className="title-main">para tu próxima PC</span>
            </h2>
            <p className="text-muted">Explorá el catálogo por piezas compatibles con armados gaming y estaciones de trabajo.</p>
          </div>
          <Link to="/products" className="category-action">
            Ver catálogo completo
          </Link>
        </div>

        <div className="category-grid">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                className={`category-card-link category-${category.accent}`}
                to={category.to}
                key={category.id}
              >
                <article className="category-card">
                  <div className="category-card-top">
                    <span className="category-icon" aria-hidden="true">
                      <Icon size={30} strokeWidth={2.1} />
                    </span>
                    <span className="category-arrow">&gt;</span>
                  </div>
                  <div className="category-card-copy">
                    <span className="category-kicker">Armá tu PC</span>
                    <h3>{category.label}</h3>
                    <p>{category.description}</p>
                  </div>
                  <span className="category-cta">Explorar categoría</span>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default CategoriesSection;
