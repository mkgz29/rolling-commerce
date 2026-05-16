import { useState } from 'react';
import FormCharacterCounter from './FormCharacterCounter';
import { VALIDATION_LIMITS } from '../constants/validationLimits';

function NewsletterSection() {
  const [email, setEmail] = useState('');

  return (
    <section className="newsletter py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-7">
            <div className="text-center mb-4 newsletter-copy">
              <h2 className="split-heading">
                <span className="title-accent">Mantenete</span>
                <span className="title-main">al dia</span>
              </h2>
              <p className="text-muted mb-0">Recibi novedades, ofertas y nuevos productos para tu PC.</p>
            </div>

            <form className="row g-2 g-sm-3 justify-content-center">
              <div className="col-12 col-md-8">
                <input
                  type="email"
                  className="form-control form-control-lg"
                  maxLength={VALIDATION_LIMITS.email}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}
                  placeholder="Ingresa tu email"
                />
                <FormCharacterCounter value={email} max={VALIDATION_LIMITS.email} />
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
