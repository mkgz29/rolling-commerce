import { Link } from 'react-router-dom';

function PromoBanner() {
  return (
    <section className="promo-banner">
      <div className="container">
        <div className="promo-panel">
          <div className="promo-content">
            <span className="promo-kicker">Limited Tech Core drops</span>
            <h2>Upgrade your setup with premium gear built for daily performance.</h2>
            <p>
              Explore selected devices, accessories and gaming essentials with a faster path from discovery to checkout.
            </p>
          </div>
          <div className="promo-actions">
            <Link to="/products" className="btn promo-primary">
              Explore Deals
            </Link>
            <span>Secure checkout. Fast delivery.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PromoBanner;
