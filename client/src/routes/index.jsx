import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import Home from '../pages/home';
import Products from '../pages/products';
import ProductDetail from '../pages/productDetail';
import Cart from '../pages/cart';
import Login from '../pages/login';
import Register from '../pages/register';
import AdminDashboard from '../pages/adminDashboard';
import NotFound from '../pages/not-found-404';
import ProtectedRoute from '../components/protectedRoute';
import BuildYourPc from '../pages/build-your-pc';
import Checkout from '../pages/checkout';
import PaymentStatus from '../pages/paymentStatus';
import StaticInfo from '../pages/staticInfo';

const router = createBrowserRouter([
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
        element: (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        ),
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
        element: (
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'build-your-pc',
        element: <BuildYourPc />,
      },
      {
        path: 'checkout',
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        ),
      },
      {
        path: 'success',
        element: <PaymentStatus />,
      },
      {
        path: 'failure',
        element: <PaymentStatus />,
      },
      {
        path: 'pending',
        element: <PaymentStatus />,
      },
      {
        path: 'about',
        element: <StaticInfo />,
      },
      {
        path: 'contact',
        element: <StaticInfo />,
      },
      {
        path: 'support',
        element: <StaticInfo />,
      },
      {
        path: 'privacy',
        element: <StaticInfo />,
      },
      {
        path: 'terms',
        element: <StaticInfo />,
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
