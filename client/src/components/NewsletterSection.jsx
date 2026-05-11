function NewsletterSection() {
  return (
    <section className="newsletter py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-7">
            <div className="text-center mb-4 newsletter-copy">
              <h2 className="split-heading">
                <span className="title-accent">Mantenete</span>
                <span className="title-main">al día</span>
              </h2>
              <p className="text-muted mb-0">Recibí novedades, ofertas y nuevos productos para tu PC.</p>
            </div>

            <form className="row g-2 g-sm-3 justify-content-center">
              <div className="col-12 col-md-8">
                <input type="email" className="form-control form-control-lg" placeholder="Ingresá tu email" />
              </div>
              <div className="col-12 col-md-auto">
                <button type="submit" className="btn btn-primary btn-lg w-100">
                  Suscribirme
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NewsletterSection;
