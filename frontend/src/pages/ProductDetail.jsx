import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const { cart, addToCart, updateQuantity } = useContext(CartContext);
  const getQuantity = (productId) => {
    const found = cart.find(item => item.id === productId);
    return found ? found.quantity : 0;
  };
  
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
          {getQuantity(product.id) === 0 ? (
  <button onClick={() => addToCart(product)}>➕ Add</button>
) : (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
    <button onClick={() => updateQuantity(product.id, -1)}>➖</button>
    <span>{getQuantity(product.id)}</span>
    <button onClick={() => addToCart(product)}>➕</button>
  </div>
)}
            <button onClick={() => navigate(`/products/${product._id}/edit`)}> Edit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
