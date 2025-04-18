// src/pages/ProductList.jsx
import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';

import { CartContext } from '../context/CartContext';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false); // ✨ 加上 loading
  const navigate = useNavigate();
  const { cart, addToCart, updateQuantity, removeFromCart, setQuantity } = useContext(CartContext);

  
  const getQuantity = (productId) => {
    const found = cart.find(item => item.id === productId);
    return found ? found.quantity : 0;
  };
  const [inputCache, setInputCache] = useState({}); // 用于缓冲用户输入
  const [tempQty, setTempQty] = useState('');
  const getInputQty = (id) => {
    return inputCache[id] !== undefined
      ? inputCache[id]
      : getQuantity(id).toString();
  };
  
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // 👈 开始加载
      try {
        const res = await axios.get(`/products?page=${currentPage}&limit=10&sort=${sortOrder}`);
        const mapped = res.data.products.map(p => ({ ...p, id: p._id }));
        setProducts(mapped);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error('❌ 获取产品失败：', err.message);
      } finally {
        setLoading(false); // 👈 加载完成
      }
    };
    fetchProducts();
  }, [currentPage]);
  
    

  const sortedProducts = [...products].sort((a, b) => {
    if (sortOrder === 'asc') return a.price - b.price;
    if (sortOrder === 'desc') return b.price - a.price;
    if (sortOrder === 'latest') return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });

  return (
    <div style={{ padding: '2rem' }}>
      {/* 标题 + 筛选 + 添加 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Products</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="asc">Price: low to high</option>
            <option value="desc">Price: high to low</option>
            <option value="latest">Last Added</option>
          </select>
          <button onClick={() => navigate('/add-product')}>Add Product</button>
        </div>
      </div>

      {/* 加载中状态 */}
      {loading ? (
        <p style={{ marginTop: '2rem' }}>加载中...</p>
      ) : (
        <>
          {/* 产品列表 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '1rem',
              marginTop: '2rem',
            }}
          >
            {sortedProducts.map((product) => (
              <div
                key={product._id}
                style={{
                  border: '1px solid #ddd',
                  padding: '1rem',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                }}
                onClick={() => navigate(`/products/${product._id}`)}
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                />
                <h4 style={{ margin: '0.5rem 0' }}>{product.name}</h4>
                <p>$ {product.price}</p>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {(() => {
  const quantity = getQuantity(product.id);

  if (quantity === 0) {
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          addToCart(product);
        }}
      >
        ➕ Add
      </button>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          updateQuantity(product.id, -1);
        }}
      >
        ➖
      </button>

      <input
  type="text"
  value={getInputQty(product.id)}
  onClick={(e) => e.stopPropagation()}
  onChange={(e) => {
    const val = e.target.value;
    setInputCache(prev => ({ ...prev, [product.id]: val }));

    if (val === '') return; // 用户还在输入，先不处理

    const num = parseInt(val);
    if (isNaN(num)) return;

    if (num > product.quantity) {
      alert('⚠️ 超出库存');
      return;
    }

setQuantity(product.id, num); // ✅ 用新方法直接设置数量

  if (num <= 0) {
    setInputCache(prev => {
      const copy = { ...prev };
      delete copy[product.id];
      return copy;
    });
  }
  }}
  onBlur={() => {
    // 输入结束后，清除缓存
    setInputCache(prev => {
      const copy = { ...prev };
      delete copy[product.id];
      return copy;
    });
  }}
  style={{ width: '50px', textAlign: 'center' }}
/>


      <button
        onClick={(e) => {
          e.stopPropagation();
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


                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/products/${product._id}/edit`);
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 分页按钮 */}
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                style={{
                  margin: '0 5px',
                  padding: '5px 10px',
                  backgroundColor: currentPage === i + 1 ? '#333' : '#eee',
                  color: currentPage === i + 1 ? '#fff' : '#000',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;
