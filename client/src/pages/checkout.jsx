import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { createOrderRequest } from "../routes/orderService";
import Loader from "../components/Loader";
import { formatPrice } from "../utils/formatPrice";
import { PRODUCT_IMAGE_FALLBACK } from "../utils/productImage";
import "../styles/checkout.css";

const initialForm = {
  delivery: "delivery",
  fullName: "",
  email: "",
  phone: "",
  country: "Argentina",
  city: "",
  state: "",
  zip: "",
  agreeTerms: false,
};

function Checkout() {
  const { cart, clearCart, loading: cartLoading, error: cartError } = useCart();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackError, setFeedbackError] = useState("");
  const navigate = useNavigate();

  const cartItems = cart?.items || [];
  const subtotal = cart?.total || 0;
  const shippingCost = 0;
  const total = subtotal + shippingCost;

  const handleInput = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback("");
    setFeedbackError("");

    if (cartItems.length === 0) {
      setFeedbackError("Tu carrito está vacío.");
      return;
    }

    if (
      !form.fullName ||
      !form.email ||
      !form.phone ||
      !form.city ||
      !form.state ||
      !form.zip
    ) {
      setFeedbackError("Completa todos los campos requeridos.");
      return;
    }

    if (!form.agreeTerms) {
      setFeedbackError("Debes aceptar los términos y condiciones.");
      return;
    }

    setSubmitting(true);

    try {
      await createOrderRequest();
      await clearCart();
      setFeedback("Compra realizada con éxito. Gracias por tu pedido.");
      setForm(initialForm);
    } catch (err) {
      setFeedbackError(err?.message || "Error al procesar la compra.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToShop = () => {
    navigate("/products");
  };

  if (cartLoading) return <Loader />;

  return (
    <div className="container py-5 mt-5 checkout-page">
      <div className="checkout-top mb-4">
        <h1 className="fw-bold mb-2">Checkout</h1>
        <p className="text-muted">
          Completa tus datos y revisa tu pedido antes de finalizar.
        </p>
      </div>

      <div className="checkout-steps mb-4">
        <div className="step active">
          <span>1</span>
          <p>Carrito</p>
        </div>
        <div className="step active">
          <span>2</span>
          <p>Revisión</p>
        </div>
        <div className="step">
          <span>3</span>
          <p>Pago</p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-xl-7">
          <div className="checkout-card">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h4 className="mb-1">Información de envío</h4>
                <p className="text-muted mb-0">
                  Ingresa los datos para procesar tu orden.
                </p>
              </div>
            </div>

            {(feedbackError || feedback) && (
              <div
                className={
                  feedbackError ? "alert alert-danger" : "alert alert-success"
                }
                role="alert"
              >
                {feedbackError || feedback}
              </div>
            )}

            <form className="checkout-form" onSubmit={handleSubmit}>
              <div className="mb-4 shipping-method">
                <label className="form-label mb-2">Método de entrega</label>
                <div className="d-flex gap-3 flex-wrap">
                  <button
                    type="button"
                    className={`btn ${
                      form.delivery === "delivery"
                        ? "btn-primary"
                        : "btn-outline-secondary"
                    } shipping-option`}
                    onClick={() =>
                      setForm((prev) => ({ ...prev, delivery: "delivery" }))
                    }
                  >
                    Delivery
                  </button>
                  <button
                    type="button"
                    className={`btn ${
                      form.delivery === "pickup"
                        ? "btn-primary"
                        : "btn-outline-secondary"
                    } shipping-option`}
                    onClick={() =>
                      setForm((prev) => ({ ...prev, delivery: "pickup" }))
                    }
                  >
                    Pick up
                  </button>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nombre completo *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleInput}
                    className="form-control"
                    placeholder="Brandon Johnson"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleInput}
                    className="form-control"
                    placeholder="brandon@example.com"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Teléfono *</label>
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleInput}
                    className="form-control"
                    placeholder="+54 9 11 1234 5678"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">País *</label>
                  <select
                    name="country"
                    value={form.country}
                    onChange={handleInput}
                    className="form-select"
                  >
                    <option>Argentina</option>
                    <option>Chile</option>
                    <option>Uruguay</option>
                    <option>Paraguay</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Ciudad *</label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleInput}
                    className="form-control"
                    placeholder="Buenos Aires"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Provincia *</label>
                  <input
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={handleInput}
                    className="form-control"
                    placeholder="Buenos Aires"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Código postal *</label>
                  <input
                    type="text"
                    name="zip"
                    value={form.zip}
                    onChange={handleInput}
                    className="form-control"
                    placeholder="65159"
                  />
                </div>
              </div>

              <div className="form-check form-switch mt-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={form.agreeTerms}
                  onChange={handleInput}
                />
                <label className="form-check-label" htmlFor="agreeTerms">
                  Acepto los términos y condiciones.
                </label>
              </div>
            </form>
          </div>
        </div>

        <div className="col-xl-5">
          <div className="checkout-card review-card">
            <h4 className="mb-4">Revisa tu carrito</h4>

            {cartItems.length === 0 ? (
              <div className="alert alert-secondary">
                No hay productos para revisar.
              </div>
            ) : (
              cartItems.map((item) => {
                const product = item.product || {
                  name: item.name,
                  image: item.image,
                };

                return (
                  <div
                    className="review-item d-flex align-items-center gap-3 mb-3"
                    key={item.productId}
                  >
                    <img
                      src={product.image || PRODUCT_IMAGE_FALLBACK}
                      alt={product.name}
                      className="review-item-image"
                    />
                    <div className="flex-grow-1">
                      <h6 className="mb-1">{product.name}</h6>
                      <p className="text-muted mb-1">Cantidad: {item.quantity}</p>
                      <strong>{formatPrice(item.price)}</strong>
                    </div>
                    <div className="text-end">
                      <span className="review-item-total">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}

            <div className="checkout-summary mt-4">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Envío</span>
                <strong>{shippingCost === 0 ? "Gratis" : formatPrice(shippingCost)}</strong>
              </div>
              <hr />
              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="fw-bold">Total</span>
                <span className="fs-4 fw-bold">{formatPrice(total)}</span>
              </div>

              <button
                type="button"
                className="btn btn-primary w-100 mb-3"
                onClick={handleSubmit}
                disabled={submitting || cartItems.length === 0}
              >
                {submitting ? "Procesando..." : "Pagar ahora"}
              </button>

              <button
                type="button"
                className="btn btn-outline-light w-100"
                onClick={handleBackToShop}
              >
                Seguir comprando
              </button>
            </div>

            <div className="secure-note mt-4">
              <span className="me-2">🔒</span>
              <small className="text-muted">
                Pago seguro - SSL encriptado
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;