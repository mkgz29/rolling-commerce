import { createOrderService } from "../services/order.service";
import useCart from "../hooks/useCart";

function Checkout() {
  const { clear } = useCart();

  const handleCheckout = async () => {
    try {
      await createOrderService();
      clear();
      alert("Compra realizada con éxito");
    } catch (err) {
      console.error(err);
      alert("Error en la compra");
    }
  };

  return (
    <div className="container mt-5 pt-5">
      <h2>Checkout</h2>

      <button className="btn-primary" onClick={handleCheckout}>
        Finalizar compra
      </button>
    </div>
  );
}

export default Checkout;