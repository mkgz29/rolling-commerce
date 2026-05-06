import './ProductInfo.css';

export default function ProductSpecs({ specs = [] }) {
  if (!specs.length) {
    return null;
  }

  return (
    <section className="product-specs">
      <h2>Key features</h2>
      <ul>
        {specs.map((spec) => (
          <li key={spec}>{spec}</li>
        ))}
      </ul>
    </section>
  );
}
