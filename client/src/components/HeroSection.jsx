import { Link } from 'react-router-dom';
import heroImage from '../assets/hero.png';

function HeroSection() {
  return (
    <section className="hero-section position-relative overflow-hidden">
      <div className="hero-backdrop" />
      <div className="container position-relative">
        <div className="row align-items-center hero-row">
          <div className="col-lg-6 hero-copy-column">
            <div className="hero-copy">
              <span className="hero-badge d-inline-flex align-items-center mb-3">
                Premium tech, fast delivery
              </span>
              <h1 className="fw-bold text-white mb-4">
                Elevate your setup with curated technology built for modern life.
              </h1>
              <p className="hero-subtitle mb-4">
                Tech Core delivers the latest devices, trusted accessories and seamless checkout for professionals,
                creators and anyone who demands premium performance.
              </p>

              <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-3 mb-4 hero-action-group">
                <Link to="/products" className="btn btn-primary btn-lg px-4 py-3">
                  Shop Products
                </Link>
                <Link to="/products" className="btn btn-outline-light btn-lg px-4 py-3">
                  Explore Deals
                </Link>
              </div>

              <div className="d-flex flex-wrap gap-2 hero-benefits">
                <span className="benefit-pill">Fast delivery</span>
                <span className="benefit-pill">Secure checkout</span>
                <span className="benefit-pill">Premium tech</span>
              </div>
            </div>
          </div>

          <div className="col-lg-6 hero-showcase-column">
            <div className="hero-showcase card border-0 rounded-4 shadow-lg overflow-hidden">
              <div className="hero-showcase-top d-flex justify-content-between align-items-center px-4 pt-4">
                <span className="badge hero-pill bg-gradient-primary text-white">Top pick</span>
                <span className="text-white-50 small">4.9 · 320 reviews</span>
              </div>

              <div className="product-visual position-relative overflow-hidden rounded-4 mx-4 mt-4">
                <img src={heroImage} alt="Tech Core product showcase" className="img-fluid w-100" />
                <div className="product-glow" />
              </div>

              <div className="card-body px-4 pb-4 pt-3">
                <div className="hero-product-summary d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h3 className="h4 text-white mb-1">EchoX Wireless Headset</h3>
                    <p className="mb-0">Immersive audio, adaptive noise cancellation and premium comfort.</p>
                  </div>
                  <div className="text-end">
                    <div className="text-muted small">From</div>
                    <div className="h4 text-white fw-semibold mb-0">$129</div>
                  </div>
                </div>

                <div className="d-flex flex-wrap gap-2 mb-4 hero-attributes">
                  <span className="attribute-pill">Bluetooth 5.3</span>
                  <span className="attribute-pill">30h battery</span>
                  <span className="attribute-pill">Fast charge</span>
                </div>

                <div className="d-flex gap-3 flex-column flex-sm-row">
                  <Link to="/products" className="btn btn-outline-light flex-grow-1 py-3">View catalog</Link>
                  <Link to="/products" className="btn btn-primary flex-grow-1 py-3">Start shopping</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
