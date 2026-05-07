import {useCart} from "../hooks/useCart";
import Loader from "../components/Loader";
import {formatPrice} from "../utils/formatPrice";


function Cart() {
  const { cart, removeItem } = useCart();

  if (!cart) return <Loader />;

  return (
    <div className="container py-5 mt-5">

      <h1 className="fw-bold mb-4">Mi carrito</h1>

      <div className="row g-4">

        {/* PRODUCTOS */}
        <div className="col-lg-8">

          {cart.items.length === 0 ? (
            <div className="cart-card">
              <h4>Carrito vacío</h4>
            </div>
          ) : (
            cart.items.map((item) => (
              <div className="cart-card mb-4" key={item.product._id}>

                <div className="d-flex align-items-center gap-4">

                  {/* IMAGEN */}
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="cart-image"
                  />

                  {/* INFO */}
                  <div className="flex-grow-1">

                    <h5 className="mb-2">
                      {item.product.name}
                    </h5>

                    <p className="text-muted mb-3">
                      {item.product.description}
                    </p>

                    {/* CONTROLES */}
                    <div className="d-flex align-items-center gap-3">

                      <button
                        className="quantity-btn"
                        onClick={() => removeItem(item.product._id)}
                      >
                        🗑️
                      </button>

                      <div className="quantity-box">
                        <button>-</button>
                        <span>{item.quantity}</span>
                        <button>+</button>
                      </div>

                    </div>

                  </div>

                  {/* PRECIO */}
                  <div>
                    <h4 className="fw-bold">
                      {formatPrice(item.price)}
                    </h4>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>

        {/* RESUMEN */}
        <div className="col-lg-4">

          <div className="summary-card">

            <h4 className="mb-4">Resumen</h4>

            <div className="d-flex justify-content-between mb-3">
              <span>Productos</span>
              <strong>{cart.items.length}</strong>
            </div>

            <hr />

            <div className="d-flex justify-content-between mb-4">
              <h5>Total</h5>
              <h4 className="fw-bold gradient-text">
                {formatPrice(cart.total)}
              </h4>
            </div>

            <button className="btn-primary w-100 mb-3">
              Iniciar compra
            </button>

            <button className="btn-outline-custom w-100">
              Ver más productos
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Cart;