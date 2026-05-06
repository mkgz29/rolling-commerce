import { Link } from "react-router-dom";

function NotFound404() {
  return (
    <div className="container mt-5 pt-5 text-center">
      <h1 className="gradient-text">404</h1>
      <p>Página no encontrada</p>

      <Link to="/" className="btn-primary mt-3">
        Volver
      </Link>
    </div>
  );
}

export default NotFound404;