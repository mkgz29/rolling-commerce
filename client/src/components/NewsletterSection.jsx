function NewsletterSection() {
  return (
    <section className="newsletter">
      <div className="container">
        <div className="newsletter-panel">
          <div className="newsletter-copy">
            <span className="newsletter-kicker">Tech Core signal</span>
            <h2>Stay ahead of new arrivals and private offers.</h2>
            <p>Receive curated product drops, setup ideas and limited promotions without the noise.</p>
          </div>

          <form className="newsletter-form">
            <label className="visually-hidden" htmlFor="newsletter-email">Email address</label>
            <input id="newsletter-email" type="email" placeholder="Enter your email" />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default NewsletterSection;
