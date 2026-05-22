import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../styles/about.css';

const projectFeatures = [
  { icon: 'bi-grid-3x3-gap', title: 'Catalogo premium', text: 'Productos de hardware organizados para explorar, comparar y comprar con una experiencia clara.' },
  { icon: 'bi-cart-check', title: 'Compra completa', text: 'Carrito, checkout, autenticacion y pagos digitales integrados en un flujo ecommerce realista.' },
  { icon: 'bi-speedometer2', title: 'Gestion admin', text: 'Panel administrativo con CRUD de productos, ordenes, ventas y metricas operativas.' },
  { icon: 'bi-phone', title: 'Responsive design', text: 'Interfaz adaptable para mobile, tablet y desktop sin perder identidad gamer/tech.' },
];

const techGroups = [
  {
    title: 'Frontend',
    icon: 'bi-window-stack',
    items: ['React', 'React Router', 'Bootstrap', 'Vite'],
  },
  {
    title: 'Backend',
    icon: 'bi-server',
    items: ['Node.js', 'Express', 'MongoDB', 'Mongoose'],
  },
  {
    title: 'Servicios',
    icon: 'bi-cloud-arrow-up',
    items: ['Mercado Pago', 'Cloudinary', 'Render', 'Vercel'],
  },
];

const teamMembers = [
  {
    name: 'Miguel Gomez',
    role: 'Scrum Master & Full Stack Developer',
    description: 'Lidero la organizacion del proyecto, arquitectura general y desarrollo frontend/backend.',
    initials: 'MG',
  },
  {
    name: 'Facundo',
    role: 'Full Stack Developer',
    description: 'Participo en el desarrollo de funcionalidades y mejoras del sistema.',
    initials: 'FA',
  },
  {
    name: 'Luciano',
    role: 'Frontend & Backend Collaborator',
    description: 'Colaboro en distintas funcionalidades visuales y logicas del ecommerce.',
    initials: 'LU',
  },
  {
    name: 'Alexis',
    role: 'Frontend & Backend Collaborator',
    description: 'Participo en tareas de desarrollo y soporte del proyecto.',
    initials: 'AX',
  },
];

const workflowSteps = [
  {
    number: '01',
    title: 'Planificacion agil',
    text: 'Organizamos prioridades, tareas y entregas con foco en avanzar por funcionalidades completas.',
  },
  {
    number: '02',
    title: 'Desarrollo por features',
    text: 'Trabajamos con Git/GitHub, ramas por modulo y revisiones constantes para mantener trazabilidad.',
  },
  {
    number: '03',
    title: 'Feedback y mejoras',
    text: 'Aplicamos correcciones basadas en devoluciones, reforzando UX/UI, seguridad y consistencia visual.',
  },
  {
    number: '04',
    title: 'Enfoque escalable',
    text: 'Separamos frontend, backend, servicios y middlewares para sostener una arquitectura clara.',
  },
];

export default function AboutUs() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="container about-hero-grid">
          <div className="about-hero-copy">
            <span className="about-kicker">Rolling Commerce</span>
            <h1>Sobre Tech Core</h1>
            <p className="about-hero-lead">Un e-commerce full stack creado con enfoque profesional.</p>
            <p>
              Tech Core nace como un proyecto academico orientado a simular una experiencia real de comercio
              electronico, integrando frontend, backend, autenticacion, panel administrativo y pagos digitales.
            </p>
            <div className="about-actions">
              <Link to="/products" className="about-primary-action">Ver productos</Link>
              <Link to="/" className="about-secondary-action">Ir al inicio</Link>
            </div>
          </div>

          <div className="about-hero-visual" aria-label="Identidad visual Tech Core">
            <div className="about-tech-frame">
              <img src={logo} alt="Logo de Tech Core" />
              <div>
                <span>Full Stack</span>
                <strong>Ecommerce Lab</strong>
              </div>
            </div>
            <div className="about-hero-stats" aria-label="Modulos principales del proyecto">
              <span>Auth</span>
              <span>Cart</span>
              <span>Admin</span>
              <span>Payments</span>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="container">
          <div className="about-section-heading">
            <span className="about-kicker">Nuestro proyecto</span>
            <h2>Una simulacion ecommerce con arquitectura realista</h2>
            <p>
              El objetivo fue construir una tienda de hardware premium con experiencia de compra completa,
              panel de administracion y una base tecnica cercana a un entorno profesional.
            </p>
          </div>

          <div className="about-feature-grid">
            {projectFeatures.map((feature) => (
              <article className="about-card about-feature-card" key={feature.title}>
                <i className={`bi ${feature.icon}`} aria-hidden="true" />
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section about-section-alt">
        <div className="container">
          <div className="about-section-heading">
            <span className="about-kicker">Tecnologias</span>
            <h2>Stack moderno para frontend, backend y despliegue</h2>
          </div>

          <div className="about-tech-grid">
            {techGroups.map((group) => (
              <article className="about-card about-tech-card" key={group.title}>
                <div className="about-card-title">
                  <i className={`bi ${group.icon}`} aria-hidden="true" />
                  <h3>{group.title}</h3>
                </div>
                <div className="about-badge-list">
                  {group.items.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="container">
          <div className="about-section-heading">
            <span className="about-kicker">Equipo</span>
            <h2>Roles claros, colaboracion constante</h2>
          </div>

          <div className="about-team-grid">
            {teamMembers.map((member) => (
              <article className="about-card about-team-card" key={member.name}>
                <div className="about-avatar" aria-hidden="true">{member.initials}</div>
                <h3>{member.name}</h3>
                <span>{member.role}</span>
                <p>{member.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section about-section-alt">
        <div className="container">
          <div className="about-section-heading">
            <span className="about-kicker">Como trabajamos</span>
            <h2>Proceso iterativo con foco en calidad</h2>
          </div>

          <div className="about-workflow">
            {workflowSteps.map((step) => (
              <article className="about-workflow-step" key={step.number}>
                <span>{step.number}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-cta">
        <div className="container">
          <div className="about-cta-panel">
            <div>
              <span className="about-kicker">Tech Core</span>
              <h2>Explora Tech Core y descubri nuestra experiencia ecommerce.</h2>
            </div>
            <div className="about-actions">
              <Link to="/products" className="about-primary-action">Ver catalogo</Link>
              <Link to="/" className="about-secondary-action">Volver al inicio</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
