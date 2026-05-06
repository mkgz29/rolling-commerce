import { useEffect, useState } from "react";
import { getProductsService } from "../services/product.service";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

function Productos() {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    getProductsService()
      .then(setProducts)
      .catch(console.error);
  }, []);

  if (!products) return <Loader />;

  return (
    <div className="container mt-5 pt-5">
      <h2>Todos los productos</h2>

      <div className="row g-4 mt-3">
        {products.map((p) => (
          <div className="col-md-3" key={p._id}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Productos;