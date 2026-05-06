import './ProductInfo.css';

export default function ProductActions({ disabled, onAddToCart, onBuyNow, feedback, isAuthenticated }) {
  return (
    <div className="product-actions-card">
      <div className="purchase-protection">
        <span>Secure checkout</span>
        <p>Fast purchase flow with stock validation before checkout.</p>
      </div>
      <div className="product-actions">
        <button className="product-action-primary" type="button" disabled={disabled} onClick={onAddToCart}>
          Add to cart
        </button>
        <button className="product-action-secondary" type="button" disabled={disabled} onClick={onBuyNow}>
          Buy now
        </button>
      </div>
      {!isAuthenticated ? <p className="product-action-note">Log in to add this product to your cart.</p> : null}
      {feedback ? <p className="product-action-feedback">{feedback}</p> : null}
    </div>
  );
}
