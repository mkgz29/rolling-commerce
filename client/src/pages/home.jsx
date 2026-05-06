import HeroSection from "../components/HeroSection";
import CategoriesSection from "../components/CategoriesSection";
import FeaturedProductsSection from "../components/FeaturedProductsSection";
import PromoBanner from "../components/PromoBanner";
import NewsletterSection from "../components/NewsletterSection";
import "../styles/home.css";

function Home() {
  return (
    <main className="home-page">
      <HeroSection />
      <CategoriesSection />
      <FeaturedProductsSection />
      <PromoBanner />
      <NewsletterSection />
    </main>
  );
}

export default Home;