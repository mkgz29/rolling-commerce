const ProductBuildCard = ({ product }) => {
  return (
    <div className="col-12 col-md-6 col-xl-4">
      <div className="product-build-card p-3">
        <div className="product-img-placeholder mb-3">
          <i className="bi bi-image text-secondary opacity-25 fs-1"></i>
        </div>
        <h6 className="fw-bold mb-1">{product.name}</h6>
        <p className="text-secondary extra-small mb-3">{product.desc}</p>
        
        {/* Sección inferior */}
        <div className="mt-auto pt-3 border-top border-secondary border-opacity-10">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="text-secondary small">PRECIO</span>
            <span className="fs-5 fw-bold text-white">${product.price.toLocaleString()}</span>
          </div>
          <button 
            className="btn btn-primary-gradient w-100 py-2 fw-bold text-uppercase" 
            style={{ fontSize: '0.8rem' }}
          >
            Agregar al ensamble
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductBuildCard;
