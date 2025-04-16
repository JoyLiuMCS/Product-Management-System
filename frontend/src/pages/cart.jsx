import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart } = useContext(CartContext);
  const [discountCode, setDiscountCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();

  const applyDiscount = () => {
    if (discountCode.trim().toUpperCase() === '20 DOLLAR OFF') {
      setDiscount(20);
    } else {
      alert('Invalid promo code');
      setDiscount(0);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = +(subtotal * 0.1).toFixed(2); // 10% tax
  const total = +(subtotal + tax - discount).toFixed(2);

  if (cart.length === 0) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Your cart is empty.</h2>
        <button onClick={() => navigate('/products')}>Browse Products</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Shopping Cart</h2>
      {cart.map(item => (
        <div key={item.id} style={{ borderBottom: '1px solid #ccc', marginBottom: '1rem', paddingBottom: '1rem' }}>
          <h3>{item.name}</h3>
          <p>Price: ${item.price} x {item.quantity}</p>
          <button onClick={() => updateQuantity(item.id, -1)}>-</button>
          <button onClick={() => updateQuantity(item.id, 1)}>+</button>
          <button onClick={() => removeFromCart(item.id)}>Remove</button>
        </div>
      ))}

      <div style={{ marginTop: '2rem' }}>
        <input
          placeholder="Enter promo code"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
        />
        <button onClick={applyDiscount}>Apply</button>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <p>Subtotal: ${subtotal}</p>
        <p>Tax: ${tax}</p>
        <p>Discount: -${discount}</p>
        <h3>Total: ${total}</h3>
      </div>

      <button onClick={() => alert('Checkout not implemented')} style={{ marginTop: '1rem' }}>
        Continue to Checkout
      </button>
    </div>
  );
};

export default Cart;
