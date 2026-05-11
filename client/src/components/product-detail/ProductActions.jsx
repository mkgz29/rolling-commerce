import './ProductInfo.css';

export default function ProductActions({ disabled, onAddToCart, onBuyNow, feedback, isAuthenticated }) {
  return (
    <div className="product-actions-card">
      <div className="purchase-protection">
        <span>Compra segura</span>
        <p>Flujo rápido con validación de stock antes de pagar.</p>
      </div>
      <div className="product-actions">
        <button className="product-action-primary" type="button" disabled={disabled} onClick={onAddToCart}>
          Agregar al carrito
        </button>
        <button className="product-action-secondary" type="button" disabled={disabled} onClick={onBuyNow}>
          Comprar ahora
        </button>
      </div>
      {!isAuthenticated ? <p className="product-action-note">Iniciá sesión para agregar este producto al carrito.</p> : null}
      {feedback ? <p className="product-action-feedback">{feedback}</p> : null}
    </div>
  );
}
