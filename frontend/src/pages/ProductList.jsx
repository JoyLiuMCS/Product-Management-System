// src/pages/ProductList.jsx
import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc'); // asc / desc
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/products');
        setProducts(res.data);
      } catch (err) {
        console.error('❌ 获取产品失败：', err.message);
      }
    };
    fetchProducts();
  }, []);

  // 排序逻辑
  const sortedProducts = [...products].sort((a, b) => {
    return sortOrder === 'asc'
      ? a.price - b.price
      : b.price - a.price;
  });

  return (
    <div style={{ padding: '2rem' }}>
      {/* 标题 + 筛选 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2> Products</h2>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">价格从低到高</option>
          <option value="desc">价格从高到低</option>
        </select>
      </div>

      {/* 产品卡片区域 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '1rem',
          marginTop: '2rem',
        }}
      >
        {sortedProducts.slice(0, 10).map((product) => (
        <div
          key={product._id}
          style={{
            border: '1px solid #ddd',
            padding: '1rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            cursor: 'pointer',
          }}
          onClick={() => navigate(`/products/${product._id}`)} // 👈 新增这一行
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{ width: '100%', height: '150px', objectFit: 'cover' }}
          />
            <h4 style={{ margin: '0.5rem 0' }}>{product.name}</h4>
            <p>{product.price} $$</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto' }}>
              <button
                onClick={() => console.log('Add to cart:', product.name)}
              >
                ➕ Add
              </button>
              <button
                onClick={() => navigate(`/products/${product._id}/edit`)}
              >
                ✏️ Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;