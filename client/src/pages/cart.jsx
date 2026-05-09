import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import Loader from "../components/Loader";
import { formatPrice } from "../utils/formatPrice";
import { PRODUCT_IMAGE_FALLBACK, getProductImage } from "../utils/productImage";
import "../styles/cart.css";

function Cart() {
  const { cart, loading, error, removeItem, updateItem, clearCart } = useCart();
  const navigate = useNavigate();
  const [pendingActions, setPendingActions] = useState({});

  const cartItems = cart?.items || [];
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const isReady = !loading && cart;

  const setPending = (key, value) => {
    setPendingActions((prev) => {
      const next = { ...prev };
      if (value) next[key] = true;
      else delete next[key];
      return next;
    });
  };

  const isPending = (key) => !!pendingActions[key];

  const handleQuantityChange = async (productId, quantity) => {
    setPending(`qty-${productId}`, true);

    try {
      if (quantity <= 0) {
        await removeItem(productId);
      } else {
        await updateItem(productId, quantity);
      }
    } catch (err) {
      console.error("Cart update failed:", err);
    } finally {
      setPending(`qty-${productId}`, false);
    }
  };

  const handleRemoveItem = async (productId) => {
    setPending(`remove-${productId}`, true);

    try {
      await removeItem(productId);
    } catch (err) {
      console.error("Remove item failed:", err);
    } finally {
      setPending(`remove-${productId}`, false);
    }
  };

  const handleClearCart = async () => {
    setPending("clear", true);

    try {
      await clearCart();
    } catch (err) {
      console.error("Clear cart failed:", err);
    } finally {
      setPending("clear", false);
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const handleBrowseProducts = () => {
    navigate("/products");
  };

  if (!isReady) return <Loader />;

  return (
    <div className="container py-5 mt-5 cart-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold cart-title">Mi carrito</h1>
          <p className="text-muted mb-0">
            Resumen de tus componentes gaming y accesorios seleccionados.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-outline-danger clear-cart-btn"
          onClick={handleClearCart}
          disabled={cartItems.length === 0 || isPending("clear")}
        >
          {isPending("clear") ? "Limpiando..." : "Vaciar carrito"}
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-8">
          {cartItems.length === 0 ? (
            <div className="cart-card empty-cart-card text-center py-5">
              <h4 className="mb-3">Tu carrito está vacío</h4>
              <p className="text-muted mb-4">
                Agrega componentes o consolas para empezar tu compra.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleBrowseProducts}
              >
                Ver productos
              </button>
            </div>
          ) : (
            cartItems.map((item) => {
              const product = item.product || {
                _id: item.productId,
                image: item.image,
                name: item.name,
                description: item.description || "",
              };

              const itemImage = product.image
                ? product.image
                : getProductImage(product);
              const lineTotal = item.price * item.quantity;
              const itemId = product._id || item.productId;

              return (
                <div className="cart-card mb-4" key={itemId}>
                  <div className="row g-3 align-items-center">
                    <div className="col-12 col-md-3 text-center">
                      <img
                        src={itemImage || PRODUCT_IMAGE_FALLBACK}
                        alt={product.name}
                        className="cart-image img-fluid"
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <h5 className="mb-2">{product.name}</h5>
                      <p className="text-muted cart-item-description">
                        {product.description || "Hardware y accesorios gaming."}
                      </p>

                      <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-3">
                        <div className="quantity-box">
                          <button
                            type="button"
                            className="quantity-control-btn"
                            onClick={() =>
                              handleQuantityChange(itemId, item.quantity - 1)
                            }
                            disabled={isPending(`qty-${itemId}`)}
                          >
                            −
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            className="quantity-control-btn"
                            onClick={() =>
                              handleQuantityChange(itemId, item.quantity + 1)
                            }
                            disabled={isPending(`qty-${itemId}`)}
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm remove-item-btn"
                          onClick={() => handleRemoveItem(itemId)}
                          disabled={isPending(`remove-${itemId}`)}
                        >
                          {isPending(`remove-${itemId}`) ? "Quitando..." : "Eliminar"}
                        </button>
                      </div>
                    </div>

                    <div className="col-12 col-md-3 text-md-end">
                      <div className="cart-price-info">
                        <span className="text-muted d-block mb-1">
                          Unidad {formatPrice(item.price)}
                        </span>
                        <h4 className="fw-bold mb-0">
                          {formatPrice(lineTotal)}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="col-lg-4">
          <div className="summary-card cart-summary-card">
            <h4 className="mb-4">Resumen de compra</h4>

            <div className="d-flex justify-content-between mb-2">
              <span>Productos</span>
              <strong>{cartItems.length}</strong>
            </div>

            <div className="d-flex justify-content-between mb-4">
              <span>Cantidad total</span>
              <strong>{totalQuantity}</strong>
            </div>

            <hr />

            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <p className="text-muted mb-1">Total estimado</p>
                <h3 className="cart-total">{formatPrice(cart.total)}</h3>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary w-100 mb-3"
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
            >
              Iniciar compra
            </button>

            <button
              type="button"
              className="btn btn-outline-light w-100"
              onClick={handleBrowseProducts}
            >
              Ver más productos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;