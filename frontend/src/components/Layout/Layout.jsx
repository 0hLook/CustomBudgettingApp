import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';
import SideMenu from './SideMenu';

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  const handleMenuItemClick = (type) => {
    // This will be handled by the AppContext
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      <Header
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        onLogout={handleLogout}
        currentPath={location.pathname}
      />

      <SideMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onMenuItemClick={handleMenuItemClick}
      />

      <Outlet />
    </div>
  );
}