import React, { useState, useEffect } from 'react';

const mockCart = [
  { id: 1, name: 'Meta Quest2 VR', price: 299, quantity: 1 },
  { id: 2, name: 'iWatch', price: 100, quantity: 2 },
];

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [code, setCode] = useState('');

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    setCartItems(savedCart ? JSON.parse(savedCart) : mockCart);
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleQuantity = (id, delta) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(item.quantity + delta, 1) }
          : item
      )
    );
  };

  const handleRemove = id => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleApplyCode = () => {
    if (code === '20 DOLLAR OFF') {
      setDiscount(20);
    } else {
      alert('Invalid Code');
      setDiscount(0);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = parseFloat((subtotal * 0.1).toFixed(2));
  const total = parseFloat((subtotal + tax - discount).toFixed(2));

  return (
    <div className="cart">
      <h2>Cart</h2>
      {cartItems.map(item => (
        <div key={item.id} style={{ marginBottom: '1rem' }}>
          <p>{item.name} - ${item.price} x {item.quantity}</p>
          <button onClick={() => handleQuantity(item.id, -1)}>-</button>
          <button onClick={() => handleQuantity(item.id, 1)}>+</button>
          <button onClick={() => handleRemove(item.id)}>Remove</button>
        </div>
      ))}
      <input
        placeholder="Enter promo code"
        value={code}
        onChange={e => setCode(e.target.value)}
      />
      <button onClick={handleApplyCode}>Apply</button>
      <div>
        <p>Subtotal: ${subtotal}</p>
        <p>Tax: ${tax}</p>
        <p>Discount: -${discount}</p>
        <p><strong>Estimated Total: ${total}</strong></p>
      </div>
    </div>
  );
};

export default Cart;
