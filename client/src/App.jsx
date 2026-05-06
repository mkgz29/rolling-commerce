import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

/* CONTEXT */
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

/* COMPONENTS */
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

/* PAGES */
import Home from "./pages/Home";
import Cart from "./pages/Cart";

function App() {
  const [count, setCount] = useState(0);

  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />

          <Routes>

            {/* HOME CON TU HERO ORIGINAL */}
            <Route
              path="/"
              element={
                <>
                  <Home />
                </>
              }
            />

            {/* CART PROTEGIDO */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />

          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;