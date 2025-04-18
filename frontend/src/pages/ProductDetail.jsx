import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const { cart, addToCart, updateQuantity, removeFromCart } = useContext(CartContext);
  const getQuantity = (productId) => {
    const found = cart.find(item => item.id === productId);
    return found ? found.quantity : 0;
  };
  const [tempQty, setTempQty] = useState('');

  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct({
          ...res.data,
          id: res.data._id  // 💥 关键补丁！
        });
        console.log('🧾 当前详情页产品：', res.data);

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

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Product Detail</h2>
      <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
        {/* 左边大图 */}
        <div style={{ flex: 1 }}>
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
          />
        </div>

        {/* 右边详情信息 */}
        <div style={{ flex: 1 }}>
          <p><strong>Category:</strong> {product.category}</p>
          <h3>{product.name}</h3>
          <p><strong>Price:</strong> {product.price} 元</p>
          <p><strong>Description:</strong></p>
          <p>{product.description}</p>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          {(() => {
  const quantity = getQuantity(product.id);

  if (quantity === 0) {
    return (
      <button
        onClick={() => addToCart(product)}
        style={{ marginTop: '1rem' }}
      >
        ➕ Add to Cart
      </button>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
      <button onClick={() => updateQuantity(product.id, -1)}>➖</button>

      <input
  type="number"
  min="0"
  max={product.quantity}
  value={tempQty}
  onClick={(e) => e.stopPropagation()}
  onChange={(e) => setTempQty(e.target.value)} // 🧠 不再直接更新 cart
  onBlur={() => {
    const newQty = parseInt(tempQty);
    if (tempQty === '' || newQty <= 0) {
      removeFromCart(product.id);
    } else if (isNaN(newQty)) {
      setTempQty(getQuantity(product.id).toString()); // 还原原值
    } else if (newQty > product.quantity) {
      alert('⚠️ 超出库存');
      setTempQty(getQuantity(product.id).toString());
    } else {
      updateQuantity(product.id, newQty - getQuantity(product.id));
    }
  }}
  style={{ width: '50px', textAlign: 'center' }}
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
  );
})()}

            <button onClick={() => navigate(`/products/${product._id}/edit`)}> Edit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
