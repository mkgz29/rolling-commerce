import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import './navbar.css';

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/products', label: 'Products' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();

  const visibleLinks = [
    ...navLinks,
    { to: '/cart', label: itemCount ? `Cart (${itemCount})` : 'Cart' },
    ...(isAuthenticated ? [] : [
      { to: '/login', label: 'Login' },
      { to: '/register', label: 'Register' },
    ]),
    ...(isAdmin ? [{ to: '/admin', label: 'Admin' }] : []),
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark main-navbar">
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center gap-3">
          <img src={logo} alt="Tech Core" className="brand-logo" />
          <div className="brand-copy">
            <span className="brand-name">Tech Core</span>
            <span className="brand-tagline d-none d-lg-inline">Tech commerce redefined</span>
          </div>
        </Link>

        <button
          className="navbar-toggler custom-toggler"
          type="button"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto align-items-lg-center navbar-menu">
            {visibleLinks.map((item) => (
              <li className="nav-item" key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `nav-link custom-link ${isActive ? 'active-link' : 'text-light-muted'}`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            {isAuthenticated && (
              <li className="nav-item">
                <button
                  className="nav-link custom-link text-light-muted border-0 bg-transparent"
                  type="button"
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
