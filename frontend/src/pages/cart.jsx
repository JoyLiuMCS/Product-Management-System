import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import './Cart.css'; //

const Cart = () => {
  const { cart, updateQuantity, removeFromCart } = useContext(CartContext);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = +(subtotal * 0.1).toFixed(2); // 10% tax
  const total = +(subtotal + tax - discount).toFixed(2);

  const handleApplyPromo = () => {
    const trimmed = promoCode.trim().toUpperCase();
    if (!trimmed) {
      setDiscount(0);
      setPromoError('Please enter a promo code.');
    } else if (trimmed === '20 DOLLAR OFF') {
      setDiscount(20);
      setPromoError('');
    } else {
      setDiscount(0);
      setPromoError('❌ Invalid promo code');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <h2>Shopping Cart</h2>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Cart <span className="cart-count">({cart.length})</span></h2>

      {cart.map((item) => {
        const id = item.id || item._id;
        return (
          <div key={id} className="cart-item">
            <img src={item.imageUrl} alt={item.name} className="cart-item-img" />
            <div className="cart-item-info">
              <h4>{item.name}</h4>
              <p>${item.price.toFixed(2)}</p>
              <div className="cart-actions">
                <button onClick={() => updateQuantity(id, -1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(id, 1)}>+</button>
                <button onClick={() => removeFromCart(id)} className="remove-btn">Remove</button>
              </div>
            </div>
          </div>
        );
      })}

      <div className="promo-section">
        <input
          type="text"
          placeholder="Enter promo code"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
        />
        <button onClick={handleApplyPromo}>Apply</button>
        {promoError && <p className="error-text">{promoError}</p>}
      </div>

      <div className="cart-summary">
        <p>Subtotal: <strong>${subtotal.toFixed(2)}</strong></p>
        <p>Tax: <strong>${tax.toFixed(2)}</strong></p>
        <p>Discount: <strong>-${discount.toFixed(2)}</strong></p>
        <h3>Total: ${total.toFixed(2)}</h3>
      </div>

      <button className="checkout-btn" onClick={() => alert('✅ Proceeding to checkout...')}>
        Continue to Checkout
      </button>
    </div>
  );
};

export default Cart;
