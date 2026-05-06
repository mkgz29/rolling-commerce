import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import Home from '../pages/home';
import Products from '../pages/products';
import ProductDetail from '../pages/productDetail';
import Cart from '../pages/cart';
import Login from '../pages/login';
import Register from '../pages/register';
import AdminDashboard from '../pages/adminDashboard';
import NotFound from '../pages/not found404';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'products',
        element: <Products />,
      },
      {
        path: 'products/:id',
        element: <ProductDetail />,
      },
      {
        path: 'cart',
        element: <Cart />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'admin',
        element: <AdminDashboard />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
function AppRoutes() {
  return <RouterProvider router={router} />;
}

export default AppRoutes;