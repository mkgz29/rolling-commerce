import './footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer bg-dark text-light">
      <div className="container py-5">
        <div className="row gy-4">
          <div className="col-md-4">
            <h5 className="text-white">Rolling Commerce</h5>
            <p className="text-muted">
              Discover smart shopping with fast delivery, secure checkout and inspired deals for every budget.
            </p>
          </div>

          <div className="col-md-4">
            <h6 className="text-white">Quick Links</h6>
            <ul className="footer-links list-unstyled">
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div className="col-md-4">
            <h6 className="text-white">Need Help?</h6>
            <p className="text-muted mb-1">support@rollingcommerce.com</p>
            <p className="text-muted">+1 (555) 123-4567</p>
          </div>
        </div>

        <div className="border-top border-secondary pt-4 mt-4 text-center">
          <small>&copy; {year} Rolling Commerce. All rights reserved.</small>
        </div>
      </div>
    </footer>
  );
}
