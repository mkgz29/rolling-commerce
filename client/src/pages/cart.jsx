import useCart from "../hooks/useCart";
import Loader from "../components/Loader";
import formatPrice from "../utils/formatPrice";

function Cart() {
  const { cart, removeItem } = useCart();

  if (!cart) return <Loader />;

  return (
    <div className="container mt-5 pt-5">
      <h2>Carrito</h2>

      {cart.items.length === 0 && <p>Carrito vacío</p>}

      {cart.items.map((item) => (
        <div key={item.product._id} className="card mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <span>{item.product.name}</span>
            <span>{formatPrice(item.price)}</span>

            <button
              onClick={() => removeItem(item.product._id)}
            >
              ❌
            </button>
          </div>
        </div>
      ))}

      <h3>Total: {formatPrice(cart.total)}</h3>
    </div>
  );
}

export default Cart;