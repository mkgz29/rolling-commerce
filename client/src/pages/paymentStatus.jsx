import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useCart } from '../hooks/useCart';

const statusConfig = {
  '/success': {
    icon: CheckCircle2,
    title: 'Pago aprobado',
    message: 'Recibimos la confirmacion de Mercado Pago. Ya estamos preparando tu compra.',
    tone: '#22c55e',
  },
  '/failure': {
    icon: XCircle,
    title: 'Pago no completado',
    message: 'Mercado Pago no pudo completar la operacion. Podes volver al checkout e intentarlo nuevamente.',
    tone: '#fb7185',
  },
  '/pending': {
    icon: Clock,
    title: 'Pago pendiente',
    message: 'Tu pago esta pendiente de confirmacion. Te avisaremos cuando Mercado Pago actualice el estado.',
    tone: '#facc15',
  },
};

let successCartClearInFlight = false;

export default function PaymentStatus() {
  const { pathname } = useLocation();
  const { clearCartAfterApprovedPayment } = useCart();
  const config = statusConfig[pathname] || statusConfig['/pending'];
  const Icon = config.icon;
  const isSuccess = pathname === '/success';

  useEffect(() => {
    if (!isSuccess) return;
    if (successCartClearInFlight) return;

    successCartClearInFlight = true;
    clearCartAfterApprovedPayment().catch((error) => {
      console.error('No se pudo limpiar el carrito despues del pago aprobado:', error);
    }).finally(() => {
      successCartClearInFlight = false;
    });
  }, [clearCartAfterApprovedPayment, isSuccess]);

  return (
    <section style={styles.page}>
      <article style={styles.card}>
        <div style={{ ...styles.icon, color: config.tone, borderColor: `${config.tone}55` }}>
          <Icon size={42} strokeWidth={2.1} aria-hidden="true" />
        </div>
        <h1 style={styles.title}>{config.title}</h1>
        <p style={styles.message}>{config.message}</p>
        <div style={styles.actions}>
          <Link to="/products" style={styles.primaryLink}>Seguir comprando</Link>
          <Link to="/cart" style={styles.secondaryLink}>Ver carrito</Link>
        </div>
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
    background: 'radial-gradient(circle at top, rgba(66,196,255,0.14), transparent 34%), #060b16',
    boxSizing: 'border-box',
  },
  card: {
    width: '100%',
    maxWidth: '520px',
    padding: '40px',
    textAlign: 'center',
    background: 'rgba(10, 17, 31, 0.92)',
    border: '1px solid rgba(131,216,255,0.18)',
    borderRadius: '16px',
    boxShadow: '0 25px 60px rgba(0,0,0,0.42)',
  },
  icon: {
    width: '76px',
    height: '76px',
    margin: '0 auto 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid',
    borderRadius: '18px',
    background: 'rgba(255,255,255,0.045)',
  },
  title: {
    color: '#fff',
    fontSize: 'clamp(28px, 5vw, 38px)',
    margin: '0 0 12px',
    fontWeight: 800,
  },
  message: {
    color: '#cbd5e1',
    fontSize: '16px',
    lineHeight: 1.7,
    margin: '0 0 28px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  primaryLink: {
    color: '#fff',
    background: '#0d6efd',
    border: '1px solid #0d6efd',
    borderRadius: '12px',
    padding: '12px 18px',
    textDecoration: 'none',
    fontWeight: 700,
  },
  secondaryLink: {
    color: '#dff6ff',
    background: 'transparent',
    border: '1px solid rgba(131,216,255,0.28)',
    borderRadius: '12px',
    padding: '12px 18px',
    textDecoration: 'none',
    fontWeight: 700,
  },
};
