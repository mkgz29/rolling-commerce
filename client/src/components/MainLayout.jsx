import { Outlet } from 'react-router-dom';
import Navbar from './navbar';
import Footer from './footer';
import '../styles/layout.css';

export default function MainLayout() {
  return (
    <div className="main-layout">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
