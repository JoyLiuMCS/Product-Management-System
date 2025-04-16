import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      padding: '1rem',
      backgroundColor: '#0a0a23',
      color: 'white',
      fontSize: '16px'
    }}>
      <span style={{ marginRight: '20px', cursor: 'pointer' }} onClick={() => navigate('/profile')}>
        👤 Sign Out
      </span>
      <span style={{ cursor: 'pointer' }} onClick={() => navigate('/cart')}>
        🛒 ${total.toFixed(2)}
      </span>
    </div>
  );
};

export default Navbar;
