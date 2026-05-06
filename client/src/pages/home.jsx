import { useEffect, useState } from "react";
import { getProductsService } from "../services/product.service";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

function Home() {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    getProductsService()
      .then(setProducts)
      .catch(console.error);
  }, []);

  if (!products) return <Loader />;

  return (
    <div className="container mt-5 pt-5">
      <h1 className="gradient-text mb-4">Productos</h1>

      <div className="row g-4">
        {products.slice(0, 6).map((p) => (
          <div className="col-md-4" key={p._id}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;