import { formatPrice } from '../../utils/formatPrice';
import './ProductInfo.css';

export default function ProductPrice({ price, oldPrice, discount }) {
  return (
    <div className="product-price-block">
      <div className="product-price-row">
        <strong>{formatPrice(price)}</strong>
        {discount ? <span>{discount}% OFF</span> : null}
      </div>
      {oldPrice ? <del>{formatPrice(oldPrice)}</del> : null}
    </div>
  );
}
