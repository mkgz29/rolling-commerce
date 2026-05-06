import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductByIdService } from "../services/product.service";
import useCart from "../hooks/useCart";
import Loader from "../components/Loader";
import formatPrice from "../utils/formatPrice";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addItem } = useCart();

  useEffect(() => {
    getProductByIdService(id)
      .then(setProduct)
      .catch(console.error);
  }, [id]);

  if (!product) return <Loader />;

  return (
    <div className="container mt-5 pt-5">
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <h3>{formatPrice(product.price)}</h3>

      <button
        className="btn-primary mt-3"
        onClick={() => addItem(product._id)}
      >
        Agregar al carrito
      </button>
    </div>
  );
}

export default ProductDetail;