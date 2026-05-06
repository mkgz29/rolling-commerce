import { createContext, useContext, useState, useEffect } from "react";
import {
  getCart,
  addToCart,
  removeCartItem,
  clearCart,
} from "../services/cart.service";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);

  const loadCart = async () => {
    const data = await getCart();
    setCart(data);
  };

  const addItem = async (id) => {
    await addToCart(id);
    loadCart();
  };

  const removeItem = async (id) => {
    await removeCartItem(id);
    loadCart();
  };

  const clear = async () => {
    await clearCart();
    loadCart();
  };

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export const CartContext = createContext();