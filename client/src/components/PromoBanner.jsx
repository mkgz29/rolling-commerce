import { Link } from 'react-router-dom';

function PromoBanner() {
  return (
    <section className="promo-banner py-5">
      <div className="container">
        <div className="row align-items-center gx-4 gy-3">
          <div className="col-lg-8">
            <h2 className="text-white">Upgrade your setup today</h2>
            <p className="text-white-50 mb-0">
              Exclusive deals on selected tech products. Save more on premium gear before the offer ends.
            </p>
          </div>
          <div className="col-lg-4 text-lg-end">
            <Link to="/products" className="btn btn-light btn-lg">
              Explore Deals
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PromoBanner;
