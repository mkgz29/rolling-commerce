import { Link } from 'react-router-dom';

function PromoBanner() {
  return (
    <section className="promo-banner py-5">
      <div className="container">
        <div className="row align-items-center gx-4 gy-3">
          <div className="col-lg-8 promo-content">
            <h2 className="text-white split-heading">
              <span className="title-accent">Mejorá</span>
              <span className="title-main">tu PC hoy</span>
            </h2>
            <p className="text-white-50 mb-0">
              Ofertas especiales en hardware seleccionado. Aprovechá componentes premium antes de que termine la promo.
            </p>
          </div>
          <div className="col-lg-4 text-lg-end">
            <Link to="/products" className="btn btn-light btn-lg">
              Ver ofertas
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PromoBanner;
