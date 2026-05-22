import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import './navbar.css';

const publicNavLinks = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/products', label: 'Productos' },
  { to: '/about', label: 'Nosotros' },
  { to: '/contact', label: 'Contacto' },
  { to: '/build-your-pc', label: 'Armá tu PC' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();

  const navLinks = [
    ...publicNavLinks,
    ...(isAuthenticated ? [{ to: '/cart', label: `Carrito${itemCount ? ` (${itemCount})` : ''}` }] : []),
    ...(isAdmin ? [{ to: '/admin', label: 'Administración' }] : []),
    ...(!isAuthenticated
      ? [
          { to: '/login', label: 'Ingresar' },
          { to: '/register', label: 'Registrarse' },
        ]
      : []),
  ];

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark main-navbar">
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center gap-3">
          <img src={logo} alt="Tech Core" className="brand-logo" />
          <div className="brand-copy">
            <span className="brand-name">Tech Core</span>
            <span className="brand-tagline d-none d-xl-inline">Hardware premium para tu PC</span>
          </div>
        </Link>

        <button
          className="navbar-toggler custom-toggler"
          type="button"
          aria-expanded={menuOpen}
          aria-label="Abrir navegación"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto align-items-lg-center navbar-menu">
            {navLinks.map((item) => (
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
                <button type="button" className="nav-link custom-link logout-link" onClick={handleLogout}>
                  Salir
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
