import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../utils/formatPrice';

export default function Cart() {
  const { items, total, loading, error, updateItem, removeItem, clearCart } = useCart();

  return (
    <div className="page cart-page">
      <h1>Shopping Cart</h1>
      {loading && <p>Loading cart...</p>}
      {error && <p className="text-danger">{error}</p>}
      {!loading && items.length === 0 && (
        <p>
          Your cart is empty. <Link to="/products">Browse products</Link>
        </p>
      )}
      {items.length > 0 && (
        <>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.productId}>
                    <td>{item.name}</td>
                    <td>{formatPrice(item.price)}</td>
                    <td>
                      <input
                        className="form-control"
                        type="number"
                        min="0"
                        value={item.quantity}
                        onChange={(event) => updateItem(item.productId, Number(event.target.value))}
                        style={{ maxWidth: 90 }}
                      />
                    </td>
                    <td>{formatPrice(item.price * item.quantity)}</td>
                    <td className="text-end">
                      <button className="btn btn-outline-danger btn-sm" type="button" onClick={() => removeItem(item.productId)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <button className="btn btn-outline-secondary" type="button" onClick={clearCart}>
              Clear cart
            </button>
            <strong>Total: {formatPrice(total)}</strong>
          </div>
        </>
      )}
    </div>
  );
}
