import { Link, useLocation } from 'react-router-dom';

const pageCopy = {
  '/about': {
    title: 'Nosotros',
    body: 'Rolling Commerce conecta a usuarios con hardware, componentes y perifericos para armar equipos confiables.',
  },
  '/contact': {
    title: 'Contacto',
    body: 'Para consultas comerciales o soporte de compras, escribinos a support@techcore.com.',
  },
  '/support': {
    title: 'Soporte',
    body: 'Nuestro equipo acompana consultas sobre productos, pedidos, pagos y armado de PC.',
  },
  '/privacy': {
    title: 'Privacidad',
    body: 'Protegemos los datos de tu cuenta y los usamos solo para operar compras, pagos y soporte.',
  },
  '/terms': {
    title: 'Terminos y condiciones',
    body: 'Las compras estan sujetas a disponibilidad, validacion de pago y condiciones vigentes del comercio.',
  },
};

export default function StaticInfo() {
  const { pathname } = useLocation();
  const copy = pageCopy[pathname] || pageCopy['/about'];

  return (
    <section style={styles.page}>
      <article style={styles.card}>
        <span style={styles.eyebrow}>Tech Core</span>
        <h1 style={styles.title}>{copy.title}</h1>
        <p style={styles.body}>{copy.body}</p>
        <Link to="/products" style={styles.link}>Ver productos</Link>
      </article>
    </section>
  );
}

const styles = {
  page: {
    minHeight: 'calc(100vh - 92px)',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 20px',
    background: '#060b16',
    boxSizing: 'border-box',
  },
  card: {
    maxWidth: '720px',
    width: '100%',
    padding: '40px',
    borderRadius: '16px',
    border: '1px solid rgba(131,216,255,0.16)',
    background: 'rgba(10, 17, 31, 0.9)',
  },
  eyebrow: {
    color: '#8ec5ff',
    fontSize: '13px',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  title: {
    color: '#fff',
    fontSize: 'clamp(30px, 5vw, 44px)',
    margin: '12px 0 16px',
    fontWeight: 850,
  },
  body: {
    color: '#cbd5e1',
    fontSize: '17px',
    lineHeight: 1.7,
    margin: '0 0 28px',
  },
  link: {
    display: 'inline-flex',
    color: '#fff',
    background: '#0d6efd',
    borderRadius: '12px',
    padding: '12px 18px',
    textDecoration: 'none',
    fontWeight: 700,
  },
};
