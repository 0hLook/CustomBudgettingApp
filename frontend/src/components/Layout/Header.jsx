import React from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Header({ menuOpen, setMenuOpen, onLogout }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h1 className="text-xl font-bold text-gray-800">Budget Tracker</h1>
        <button onClick={onLogout} className="p-2 hover:bg-gray-100 rounded-lg">
          <LogOut size={20} />
        </button>
      </div>
      
      <nav className="flex border-t border-gray-200">
        <Link
          to="/dashboard"
          className={`flex-1 px-4 py-3 text-center font-medium transition ${
            isActive('/dashboard')
              ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          Dashboard
        </Link>
        <Link
          to="/transactions"
          className={`flex-1 px-4 py-3 text-center font-medium transition ${
            isActive('/transactions')
              ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          Transactions
        </Link>
        <Link
          to="/account"
          className={`flex-1 px-4 py-3 text-center font-medium transition ${
            isActive('/account')
              ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          Account
        </Link>
      </nav>
    </header>
  );
}