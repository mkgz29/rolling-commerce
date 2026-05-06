import './footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container py-5">
        <div className="row gy-4">
          <div className="col-md-4">
            <h5>Tech Core</h5>
            <p>
              Premium technology, curated products and a cleaner path from upgrade to checkout.
            </p>
          </div>

          <div className="col-md-4">
            <h6>Quick Links</h6>
            <ul className="footer-links list-unstyled">
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div className="col-md-4">
            <h6>Need Help?</h6>
            <p className="mb-1">support@techcore.com</p>
            <p>+1 (555) 123-4567</p>
          </div>
        </div>

        <div className="footer-bottom pt-4 mt-4 text-center">
          <small>&copy; {year} Tech Core. All rights reserved.</small>
        </div>
      </div>
    </footer>
  );
}
