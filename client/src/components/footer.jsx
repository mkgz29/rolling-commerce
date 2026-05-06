function Footer() {
  return (
    <footer className="mt-5 p-4 text-center">
      <div className="card">
        <h3 className="gradient-text">PC Store</h3>
        <p>Componentes y builds personalizados</p>

        <div className="d-flex justify-content-center gap-4 mt-3">
          <a className="link" href="#">Términos</a>
          <a className="link" href="#">Privacidad</a>
          <a className="link" href="#">Contacto</a>
        </div>

        <p className="mt-3" style={{ fontSize: "0.8rem" }}>
          © 2026 PC Store
        </p>
      </div>
    </footer>
  );
}

export default Footer;