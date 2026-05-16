import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { CartContext } from './cartContextValue';
import {
  addCartItemRequest,
  clearCartRequest,
  getCartRequest,
  removeCartItemRequest,
  updateCartItemRequest,
} from '../routes/cartService';
import {
  clearPaymentSuccessCartClearPending,
  clearPersistedCartStorage,
  hasPaymentSuccessCartClearPending,
  markPaymentSuccessCartClearPending,
} from '../utils/cartPersistence';

const emptyCart = {
  items: [],
  total: 0,
};

export function CartProvider({ children }) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [cart, setCart] = useState(emptyCart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const syncCart = useCallback(async () => {
    if (!isAuthenticated) {
      clearPersistedCartStorage();
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
      queueMicrotask(() => {
        if (isAuthenticated && hasPaymentSuccessCartClearPending()) {
          clearPersistedCartStorage();
          clearCartRequest()
            .then((nextCart) => {
              setCart(nextCart);
              clearPaymentSuccessCartClearPending();
            })
            .catch(() => {
              setCart(emptyCart);
            });
          return;
        }

        syncCart().catch(() => {});
      });
    }
  }, [authLoading, isAuthenticated, syncCart]);

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
    clearPersistedCartStorage();
    const nextCart = await clearCartRequest();
    setCart(nextCart);
    return nextCart;
  }, []);

  const clearCartAfterApprovedPayment = useCallback(async () => {
    markPaymentSuccessCartClearPending();
    clearPersistedCartStorage();
    setCart(emptyCart);

    if (!isAuthenticated) {
      return emptyCart;
    }

    const nextCart = await clearCartRequest();
    setCart(nextCart);
    clearPaymentSuccessCartClearPending();
    return nextCart;
  }, [isAuthenticated]);

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
      clearCartAfterApprovedPayment,
    }),
    [cart, loading, error, syncCart, addItem, updateItem, removeItem, clearCart, clearCartAfterApprovedPayment],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
