// src/components/QuantityControl.jsx
import React, { useState, useEffect } from 'react';
import './QuantityControl.css';

const QuantityControl = ({
  product,
  quantity,
  addToCart,
  removeFromCart,
  updateQuantity,
  setQuantity,
  alert
}) => {
  const [tempQty, setTempQty] = useState(quantity.toString());

  useEffect(() => {
    setTempQty(quantity.toString());
  }, [quantity]);

  const handleBlur = () => {
    const num = parseInt(tempQty);
    if (tempQty === '' || isNaN(num)) return setTempQty(quantity.toString());
    if (num <= 0) return removeFromCart(product.id);
    if (num > product.quantity) {
      alert.outOfStock();
      return setTempQty(quantity.toString());
    }
    setQuantity(product.id, num);
  };

  return (
    <div className="cart-quantity-group">
      <button onClick={() => updateQuantity(product.id, -1)}>➖</button>
      <input
        type="text"
        value={tempQty}
        onChange={(e) => setTempQty(e.target.value)}
        onBlur={handleBlur}
      />
      <button
        onClick={() => {
          if (quantity >= product.quantity) return alert.outOfStock();
          addToCart(product);
        }}
      >
        ➕
      </button>
    </div>
  );
};

export default QuantityControl;
