import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar d-flex justify-content-between">
      <h3 className="gradient-text">PC Store</h3>

      <div className="d-flex gap-3">
        <Link className="link" to="/">Inicio</Link>
        <Link className="link" to="/productos">Productos</Link>
        <Link className="link" to="/cart">Carrito</Link>

        {user ? (
          <>
            <Link className="link" to="/profile">Perfil</Link>
            <button className="btn-primary" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <Link className="btn-primary" to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;