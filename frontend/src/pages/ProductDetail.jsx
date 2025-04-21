import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import useAlert from '../hooks/useAlert';
import QuantityControl from '../components/QuantityControl';
import './ProductDetail.css';


const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [tempQty, setTempQty] = useState('');
  const { cart, addToCart, updateQuantity, removeFromCart } = useContext(CartContext);
  const alert = useAlert();
  const getQuantity = (productId) => {
    const found = cart.find(item => item.id === productId);
    return found ? found.quantity : 0;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct({ ...res.data, id: res.data._id });
      } catch (err) {
        console.error('❌ 获取产品详情失败：', err.message);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      const currentQty = getQuantity(product.id);
      setTempQty(currentQty.toString());
    }
  }, [cart, product]);

  if (!product) {
    return <p>Loading...</p>;
  }

  const quantity = getQuantity(product.id);
  const renderCartButtons = () => {
    const isAdmin = JSON.parse(localStorage.getItem('user'))?.role === 'admin';
  
    return (
      <div className="cart-button-row">
        {quantity === 0 ? (
          <button className="btn" onClick={() => addToCart(product)}>
            Add to Cart
          </button>
        ) : (
          <QuantityControl
            product={product}
            quantity={quantity}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            setQuantity={(id, qty) => {
              const diff = qty - getQuantity(id);
              updateQuantity(id, diff);
            }}
            alert={alert}
          />
        )}
  
        {isAdmin && (
          <button className="btn edit-btn" onClick={() => navigate(`/products/${product._id}/edit`)}>
            Edit
          </button>
        )}
      </div>
    );
  };
  
  return (
    <div className="product-detail-container">
      <button 
    onClick={() => navigate('/products')}
  >
    ← Back to Products
  </button>
      <h2>Product Detail</h2>
      <div className="product-detail-content">
        <div className="product-detail-image">
          <img src={product.imageUrl} alt={product.name} />
        </div>

        <div className="product-detail-info">
          <p><strong>Category:</strong> {product.category}</p>
          <h3>{product.name}</h3>
          <p><strong>Price:</strong> ${product.price}</p>
          <p><strong>Description:</strong></p>
          <p>{product.description}</p>
          <div className="product-detail-cart">
  {renderCartButtons()}
</div>

          
  

  
        </div>
      </div>
    </div>
);
};

export default ProductDetail;
