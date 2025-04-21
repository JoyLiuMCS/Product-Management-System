import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import './Navbar.css';

const Navbar = ({ onSearch }) => {
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSignOut = () => {
    localStorage.removeItem('user');
    navigate('/signin');
    window.location.reload();
  };

  return (
    <div className="navbar">
      {/* Logo */}
      <div className="navbar-logo" onClick={() => navigate('/products')}>
        Chuwa
      </div>

      {/* Search */}
      <div className="navbar-center">
        <SearchBar onSearch={onSearch} />
      </div>

      {/* Sign out + Cart */}
      <div className="navbar-right">
        <span onClick={handleSignOut}>👤 Sign Out</span>
        <span onClick={() => navigate('/cart')}>🛒 ${total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default Navbar;
