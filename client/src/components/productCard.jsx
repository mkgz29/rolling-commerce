const products = [
  { id: 1, name: "Wireless Headphones", price: "$89.99" },
  { id: 2, name: "Smart Watch", price: "$129.99" },
  { id: 3, name: "Gaming Keyboard", price: "$74.99" },
  { id: 4, name: "Portable Speaker", price: "$59.99" },
];

function FeaturedProductsSection() {
  return (
    <section className="home-section">
      <div className="section-header">
        <div>
          <h2>Featured Products</h2>
          <p>Selected products for this week.</p>
        </div>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <article className="product-card" key={product.id}>
            <div className="product-image"></div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p>{product.price}</p>
              <button>Add to cart</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default FeaturedProductsSection;