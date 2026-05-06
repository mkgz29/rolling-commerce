import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function useCart() {
  const context = useContext(CartContext);

  const { cart } = useCart();
  const totalItems = cart?.items?.length || 0;

  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }

  return context;
}

export default useCart;