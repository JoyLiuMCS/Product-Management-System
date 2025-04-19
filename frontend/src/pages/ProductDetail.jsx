import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [tempQty, setTempQty] = useState('');
  const { cart, addToCart, updateQuantity, removeFromCart } = useContext(CartContext);

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

  return (
    <div className="product-detail-container">
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
            {quantity === 0 ? (
              <button className="btn" onClick={() => addToCart(product)}>
                ➕ Add to Cart
              </button>
            ) : (
              <div className="cart-quantity-group">
                <button onClick={() => updateQuantity(product.id, -1)}>➖</button>
                <input
                  type="number"
                  value={tempQty}
                  min="0"
                  max={product.quantity}
                  onChange={(e) => setTempQty(e.target.value)}
                  onBlur={() => {
                    const newQty = parseInt(tempQty);
                    if (tempQty === '' || newQty <= 0) {
                      removeFromCart(product.id);
                    } else if (isNaN(newQty)) {
                      setTempQty(getQuantity(product.id).toString());
                    } else if (newQty > product.quantity) {
                      alert('⚠️ 超出库存');
                      setTempQty(getQuantity(product.id).toString());
                    } else {
                      updateQuantity(product.id, newQty - getQuantity(product.id));
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (quantity >= product.quantity) {
                      alert('⚠️ 超出库存，Out of Stock!');
                      return;
                    }
                    addToCart(product);
                  }}
                >
                  ➕
                </button>
              </div>
            )}
            <button className="btn edit-btn" onClick={() => navigate(`/products/${product._id}/edit`)}>
              ✏️ Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
