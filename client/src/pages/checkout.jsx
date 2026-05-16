import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, ShieldCheck, Truck } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { createMercadoPagoPreferenceRequest } from "../routes/paymentService";
import { VALIDATION_LIMITS } from "../constants/validationLimits";
import Loader from "../components/loader";
import { formatPrice } from "../utils/formatPrice";
import { getProductImage, getProductImageFallback } from "../utils/productImage";
import "../styles/checkout.css";

const initialForm = {
  delivery: "delivery",
  fullName: "",
  email: "",
  phone: "",
  country: "Argentina",
  state: "",
  city: "",
  zip: "",
  address: "",
  agreeTerms: false,
};

const sanitizeText = (value = "", maxLength = 120) =>
  String(value)
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/[<>$`{}]/g, "")
    .trim()
    .slice(0, maxLength);

const sanitizeCheckoutForm = (form) => ({
  delivery: sanitizeText(form.delivery, 20),
  fullName: sanitizeText(form.fullName, VALIDATION_LIMITS.fullName),
  email: sanitizeText(form.email, VALIDATION_LIMITS.email).toLowerCase(),
  phone: sanitizeText(form.phone, VALIDATION_LIMITS.phone),
  country: sanitizeText(form.country, VALIDATION_LIMITS.country),
  state: sanitizeText(form.state, VALIDATION_LIMITS.province),
  city: sanitizeText(form.city, VALIDATION_LIMITS.city),
  zip: sanitizeText(form.zip, 20),
  address: sanitizeText(form.address, VALIDATION_LIMITS.address),
  agreeTerms: Boolean(form.agreeTerms),
});

const getCartItemProductId = (item) => item.productId || item.product?._id || item.product?.id || "";

const validateCheckoutForm = (form) => {
  const errors = {};
  const dangerousTextPattern = /[<>$`{}]/;
  const requiredFields = ["fullName", "email", "phone", "country", "state", "city", "zip", "address"];

  requiredFields.forEach((field) => {
    if (!form[field]) errors[field] = "Campo obligatorio.";
  });

  if (form.fullName && (form.fullName.length < 3 || dangerousTextPattern.test(form.fullName))) {
    errors.fullName = "Ingresá un nombre válido.";
  }

  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Ingresá un email válido.";
  }

  if (form.phone && !/^[\d\s()+-]{7,20}$/.test(form.phone)) {
    errors.phone = "Ingresá un teléfono válido.";
  }

  if (form.zip && !/^[a-zA-Z0-9\s-]{3,20}$/.test(form.zip)) {
    errors.zip = "Usá solo letras, números, espacios o guiones.";
  }

  ["country", "state", "city", "address"].forEach((field) => {
    if (form[field] && dangerousTextPattern.test(form[field])) {
      errors[field] = "El campo contiene caracteres no permitidos.";
    }
  });

  if (!["delivery", "pickup"].includes(form.delivery)) {
    errors.delivery = "Seleccioná un método de entrega válido.";
  }

  if (!form.agreeTerms) {
    errors.agreeTerms = "Debés aceptar los términos para continuar.";
  }

  return errors;
};

function Checkout() {
  const { cart, loading: cartLoading, error: cartError } = useCart();
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
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
    const nextValue = type === "checkbox" ? checked : value;

    setForm((prev) => ({
      ...prev,
      [name]: nextValue,
    }));

    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const handleDeliveryChange = (delivery) => {
    setForm((prev) => ({ ...prev, delivery }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.delivery;
      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback("");
    setFeedbackError("");

    if (cartItems.length === 0) {
      setFeedbackError("Tu carrito está vacío. Agregá productos antes de pagar.");
      return;
    }

    const sanitizedForm = sanitizeCheckoutForm(form);
    const validationErrors = validateCheckoutForm(sanitizedForm);

    if (Object.keys(validationErrors).length > 0) {
      setForm(sanitizedForm);
      setFieldErrors(validationErrors);
      setFeedbackError("Revisá los campos marcados antes de continuar.");
      return;
    }

    const items = cartItems.map((item) => ({
      productId: getCartItemProductId(item),
      quantity: Number(item.quantity || 1),
    }));

    if (items.some((item) => !item.productId)) {
      setFeedbackError("Hay productos del carrito sin ID válido.");
      return;
    }

    setSubmitting(true);
    setFieldErrors({});
    setForm(sanitizedForm);

    try {
      const preference = await createMercadoPagoPreferenceRequest({
        items,
        checkoutData: sanitizedForm,
      });

      if (preference?.checkoutUrl) {
        window.location.href = preference.checkoutUrl;
        return;
      }

      setFeedback(preference?.message || "La pasarela de pago todavía no está configurada.");
    } catch (err) {
      setFeedbackError(err?.message || "Error al preparar el pago.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToShop = () => {
    navigate("/products");
  };

  const handleBuildPc = () => {
    navigate("/build-your-pc");
  };

  if (cartLoading) return <Loader />;

  return (
    <div className="container py-5 mt-5 checkout-page">
      <div className="checkout-top mb-4">
        <span className="checkout-eyebrow">
          <ShieldCheck size={16} aria-hidden="true" />
          Compra segura
        </span>
        <h1 className="fw-bold mb-2">Finalizá tu compra</h1>
        <p>Confirmá tus datos de contacto y prepará el pago de forma segura.</p>
      </div>

      <div className="checkout-steps mb-4">
        <div className="step active">
          <span>1</span>
          <p>Carrito</p>
        </div>
        <div className="step active">
          <span>2</span>
          <p>Datos</p>
        </div>
        <div className="step">
          <span>3</span>
          <p>Mercado Pago</p>
        </div>
      </div>

      {cartItems.length === 0 && (
        <div className="checkout-card checkout-empty mb-4">
          <h2>Tu carrito está vacío</h2>
          <p>Agregá productos o armá una PC antes de finalizar la compra.</p>
          <div className="d-flex flex-wrap gap-2">
            <button type="button" className="btn btn-primary" onClick={handleBackToShop}>
              Explorar productos
            </button>
            <button type="button" className="btn btn-outline-light" onClick={handleBuildPc}>
              Armar mi PC
            </button>
          </div>
        </div>
      )}

      <div className="row g-4">
        <div className="col-xl-7">
          <div className="checkout-card">
            <div className="checkout-section-heading">
              <div>
                <h4>Información de envío</h4>
                <p>Usaremos estos datos para preparar tu preferencia de pago y coordinar la entrega.</p>
              </div>
              <Truck size={24} aria-hidden="true" />
            </div>

            {(cartError || feedbackError || feedback) && (
              <div className={cartError || feedbackError ? "alert alert-danger" : "alert alert-info"} role="alert">
                {cartError || feedbackError || feedback}
              </div>
            )}

            <form className="checkout-form" onSubmit={handleSubmit} noValidate>
              <div className="mb-4 shipping-method">
                <label className="form-label mb-2">Método de entrega *</label>
                <div className="d-flex gap-3 flex-wrap">
                  <button
                    type="button"
                    className={`btn ${form.delivery === "delivery" ? "btn-primary" : "btn-outline-secondary"} shipping-option`}
                    onClick={() => handleDeliveryChange("delivery")}
                  >
                    Envío a domicilio
                  </button>
                  <button
                    type="button"
                    className={`btn ${form.delivery === "pickup" ? "btn-primary" : "btn-outline-secondary"} shipping-option`}
                    onClick={() => handleDeliveryChange("pickup")}
                  >
                    Retiro en tienda
                  </button>
                </div>
                {fieldErrors.delivery && <p className="field-error">{fieldErrors.delivery}</p>}
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nombre completo *</label>
                  <input type="text" name="fullName" value={form.fullName} onChange={handleInput} maxLength={VALIDATION_LIMITS.fullName} className={`form-control ${fieldErrors.fullName ? "is-invalid" : ""}`} placeholder="Brandon Johnson" />
                  {fieldErrors.fullName && <p className="field-error">{fieldErrors.fullName}</p>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Correo electrónico *</label>
                  <input type="email" name="email" value={form.email} onChange={handleInput} maxLength={VALIDATION_LIMITS.email} className={`form-control ${fieldErrors.email ? "is-invalid" : ""}`} placeholder="brandon@example.com" />
                  {fieldErrors.email && <p className="field-error">{fieldErrors.email}</p>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Teléfono *</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleInput} maxLength={VALIDATION_LIMITS.phone} className={`form-control ${fieldErrors.phone ? "is-invalid" : ""}`} placeholder="+54 9 11 1234 5678" />
                  {fieldErrors.phone && <p className="field-error">{fieldErrors.phone}</p>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">País *</label>
                  <select name="country" value={form.country} onChange={handleInput} className={`form-select ${fieldErrors.country ? "is-invalid" : ""}`}>
                    <option>Argentina</option>
                    <option>Chile</option>
                    <option>Uruguay</option>
                    <option>Paraguay</option>
                  </select>
                  {fieldErrors.country && <p className="field-error">{fieldErrors.country}</p>}
                </div>
                <div className="col-md-4">
                  <label className="form-label">Provincia *</label>
                  <input type="text" name="state" value={form.state} onChange={handleInput} maxLength={VALIDATION_LIMITS.province} className={`form-control ${fieldErrors.state ? "is-invalid" : ""}`} placeholder="Buenos Aires" />
                  {fieldErrors.state && <p className="field-error">{fieldErrors.state}</p>}
                </div>
                <div className="col-md-4">
                  <label className="form-label">Ciudad *</label>
                  <input type="text" name="city" value={form.city} onChange={handleInput} maxLength={VALIDATION_LIMITS.city} className={`form-control ${fieldErrors.city ? "is-invalid" : ""}`} placeholder="Buenos Aires" />
                  {fieldErrors.city && <p className="field-error">{fieldErrors.city}</p>}
                </div>
                <div className="col-md-4">
                  <label className="form-label">Código postal *</label>
                  <input type="text" name="zip" value={form.zip} onChange={handleInput} maxLength={VALIDATION_LIMITS.zip} className={`form-control ${fieldErrors.zip ? "is-invalid" : ""}`} placeholder="C1000" />
                  {fieldErrors.zip && <p className="field-error">{fieldErrors.zip}</p>}
                </div>
                <div className="col-12">
                  <label className="form-label">Dirección *</label>
                  <input type="text" name="address" value={form.address} onChange={handleInput} maxLength={VALIDATION_LIMITS.address} className={`form-control ${fieldErrors.address ? "is-invalid" : ""}`} placeholder="Av. Corrientes 1234, piso/depto" />
                  {fieldErrors.address && <p className="field-error">{fieldErrors.address}</p>}
                </div>
              </div>

              <div className="form-check form-switch mt-4">
                <input className={`form-check-input ${fieldErrors.agreeTerms ? "is-invalid" : ""}`} type="checkbox" id="agreeTerms" name="agreeTerms" checked={form.agreeTerms} onChange={handleInput} />
                <label className="form-check-label" htmlFor="agreeTerms">
                  Acepto los términos y condiciones.
                </label>
                {fieldErrors.agreeTerms && <p className="field-error">{fieldErrors.agreeTerms}</p>}
              </div>
            </form>
          </div>
        </div>

        <div className="col-xl-5">
          <div className="checkout-card review-card">
            <div className="checkout-section-heading">
              <div>
                <h4>Revisá tu carrito</h4>
                <p>El servidor recalcula precios y stock antes de generar la preferencia.</p>
              </div>
              <CreditCard size={24} aria-hidden="true" />
            </div>

            {cartItems.length === 0 ? (
              <div className="alert alert-secondary">No hay productos para revisar.</div>
            ) : (
              cartItems.map((item) => {
                const product = item.product || {
                  name: item.name,
                  image: item.image,
                };

                return (
                  <div className="review-item d-flex align-items-center gap-3 mb-3" key={getCartItemProductId(item)}>
                    <img
                      src={getProductImage(product)}
                      alt={product.name}
                      className="review-item-image"
                      onError={(event) => {
                        const fallbackImage = getProductImageFallback(product);
                        if (event.currentTarget.src !== fallbackImage) {
                          event.currentTarget.src = fallbackImage;
                        }
                      }}
                    />
                    <div className="flex-grow-1">
                      <h6 className="mb-1">{product.name}</h6>
                      <p className="mb-1">Cantidad: {item.quantity}</p>
                      <strong>{formatPrice(item.price)}</strong>
                    </div>
                    <div className="text-end">
                      <span className="review-item-total">{formatPrice(item.price * item.quantity)}</span>
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
                <span className="fw-bold">Total estimado</span>
                <span className="fs-4 fw-bold">{formatPrice(total)}</span>
              </div>

              <button type="button" className="btn btn-primary w-100 mb-3" onClick={handleSubmit} disabled={submitting || cartItems.length === 0}>
                {submitting ? "Preparando pago..." : "Pagar con Mercado Pago"}
              </button>

              <button type="button" className="btn btn-outline-light w-100" onClick={handleBackToShop}>
                Seguir comprando
              </button>
            </div>

            <div className="secure-note mt-4">
              <ShieldCheck size={17} aria-hidden="true" />
              <small>Pago seguro. Tokens de Mercado Pago solo en servidor.</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
