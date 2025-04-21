// src/components/ProductCard.jsx
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import useAlert from '../hooks/useAlert';
import QuantityControl from './QuantityControl';

const ProductCard = ({ product, isAdmin }) => {
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart, updateQuantity, setQuantity } = useContext(CartContext);
  const alert = useAlert();

  const getQuantity = (productId) => {
    const found = cart.find((item) => item.id === productId);
    return found ? found.quantity : 0;
  };

  const quantity = getQuantity(product.id);
  const [tempQty, setTempQty] = useState(quantity.toString());

  return (
    <div className="product-card" onClick={() => navigate(`/products/${product._id}`)}>
      <img src={product.imageUrl} alt={product.name} className="product-img" />
      <h4>{product.name}</h4>
      <p>${product.price}</p>

      <div className="product-actions" onClick={(e) => e.stopPropagation()}>
      {quantity === 0 ? (
  <button className="btn" onClick={() => addToCart(product)}>
     Add
  </button>
) : (
  <QuantityControl
    product={product}
    quantity={quantity}
    addToCart={addToCart}
    removeFromCart={removeFromCart}
    updateQuantity={updateQuantity}
    setQuantity={setQuantity}
    alert={alert}
  />
)}

        {isAdmin && (
          <button
            className="btn edit-btn"
            onClick={() => navigate(`/products/${product._id}/edit`)}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
