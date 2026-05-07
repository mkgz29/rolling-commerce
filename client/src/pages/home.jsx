import { useEffect, useState } from 'react';
import HeroSection from '../components/HeroSection';
import CategoriesSection from '../components/CategoriesSection';
import FeaturedProductsSection from '../components/FeaturedProductsSection';
import PromoBanner from '../components/PromoBanner';
import NewsletterSection from '../components/NewsletterSection';
import { getProductsRequest } from '../routes/productService';
import '../styles/home.css';

function Home() {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      try {
        setProductsLoading(true);
        setProductsError(null);
        const data = await getProductsRequest();
        if (active) {
          setProducts(Array.isArray(data) ? data : []);
        }
      } catch (requestError) {
        if (active) {
          setProducts([]);
          setProductsError(requestError.message || 'Products could not be loaded.');
        }
      } finally {
        if (active) {
          setProductsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="home-page">
      <HeroSection products={products} loading={productsLoading} error={productsError} />
      <CategoriesSection />
      <FeaturedProductsSection products={products.slice(0, 4)} loading={productsLoading} error={productsError} />
      <PromoBanner />
      <NewsletterSection />
    </main>
  );
}

export default Home;
