import AppRoutes from "./routes";
import { AuthProvider } from "./context/authContext";
import { CartProvider } from "./context/cartContext";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
