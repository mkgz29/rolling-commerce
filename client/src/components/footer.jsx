import { ArrowUp, BriefcaseBusiness, Camera, GitBranch, Mail, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import './footer.css';

const productLinks = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Build Your PC', to: '/build-your-pc' },
  { label: 'Cart', to: '/cart' },
];

const companyLinks = [
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
  { label: 'Support', href: '#support' },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '#privacy' },
  { label: 'Terms of Service', href: '#terms' },
];

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com', icon: GitBranch },
  { label: 'Instagram', href: 'https://instagram.com', icon: Camera },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: BriefcaseBusiness },
  { label: 'YouTube', href: 'https://youtube.com', icon: Play },
];

export default function Footer() {
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-glow" aria-hidden="true" />
      <div className="container footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo" aria-label="Tech Core home">
              <span className="footer-logo-mark">TC</span>
              <span>
                <span className="footer-brand-name">Tech Core</span>
                <span className="footer-brand-tagline">Tech commerce redefined</span>
              </span>
            </Link>
            <p>
              Hardware, gaming gear and custom PC essentials with a checkout experience built for speed.
            </p>
            <a className="footer-email" href="mailto:support@techcore.com">
              <Mail size={17} aria-hidden="true" />
              support@techcore.com
            </a>
          </div>

          <div className="footer-column">
            <h3>Producto</h3>
            <ul className="footer-links">
              {productLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-column">
            <h3>Compañía</h3>
            <ul className="footer-links">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-column">
            <h3>Legal</h3>
            <ul className="footer-links">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-column footer-social-column">
            <h3>Redes</h3>
            <div className="footer-socials" aria-label="Social links">
              {socialLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <a key={link.label} href={link.href} target="_blank" rel="noreferrer" aria-label={link.label}>
                    <Icon size={18} strokeWidth={2} aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <small>&copy; {year} Tech Core. All rights reserved.</small>
          <button className="footer-back-top" type="button" onClick={scrollToTop} aria-label="Back to top">
            <ArrowUp size={18} strokeWidth={2.2} aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}
