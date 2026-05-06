import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <div className="card">
      <h3>{product.name}</h3>
      <p>${product.price}</p>

      <button
        className="btn-primary"
        onClick={() => addItem(product._id)}
      >
        Agregar
      </button>
    </div>
  );
}

export default ProductCard;