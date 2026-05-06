import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  addCartItemRequest,
  clearCartRequest,
  getCartRequest,
  removeCartItemRequest,
  updateCartItemRequest,
} from '../routes/cartService';

const emptyCart = {
  items: [],
  total: 0,
};

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [cart, setCart] = useState(emptyCart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const syncCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(emptyCart);
      return emptyCart;
    }

    try {
      setLoading(true);
      setError(null);
      const nextCart = await getCartRequest();
      setCart(nextCart);
      return nextCart;
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!authLoading) {
      syncCart().catch(() => {});
    }
  }, [authLoading, syncCart]);

  const addItem = useCallback(async (productId, quantity = 1) => {
    const nextCart = await addCartItemRequest(productId, quantity);
    setCart(nextCart);
    return nextCart;
  }, []);

  const updateItem = useCallback(async (productId, quantity) => {
    const nextCart = await updateCartItemRequest(productId, quantity);
    setCart(nextCart);
    return nextCart;
  }, []);

  const removeItem = useCallback(async (productId) => {
    const nextCart = await removeCartItemRequest(productId);
    setCart(nextCart);
    return nextCart;
  }, []);

  const clearCart = useCallback(async () => {
    const nextCart = await clearCartRequest();
    setCart(nextCart);
    return nextCart;
  }, []);

  const value = useMemo(
    () => ({
      cart,
      items: cart.items || [],
      total: cart.total || 0,
      itemCount: (cart.items || []).reduce((count, item) => count + item.quantity, 0),
      loading,
      error,
      syncCart,
      addItem,
      updateItem,
      removeItem,
      clearCart,
    }),
    [cart, loading, error, syncCart, addItem, updateItem, removeItem, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
