import { Outlet } from 'react-router-dom';
import Navbar from './navbar';
import Footer from './footer';
import ScrollToTop from './ScrollToTop';
import '../styles/layout.css';

export default function MainLayout() {
  return (
    <div className="main-layout">
      <ScrollToTop />
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
