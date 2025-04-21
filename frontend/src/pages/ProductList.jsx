// src/pages/ProductList.jsx
import React, { useEffect, useState } from 'react';
import './ProductList.css';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import useAlert from '../hooks/useAlert';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';



const ProductList = () => {
  const alert = useAlert();
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false); // ✨ 加上 loading
  const navigate = useNavigate();
  const { cart, addToCart, updateQuantity, removeFromCart, setQuantity } = useContext(CartContext);
  const [searchTerm, setSearchTerm] = useState('');

  
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
  let user = {};
try {
  user = JSON.parse(localStorage.getItem('user')) || {};
} catch (e) {
  console.warn('⚠️ 用户信息无法解析');
}
const isAdmin = user.role === 'admin';


useEffect(() => {
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/products`, {
        params: {
          page: currentPage,
          limit: 10,
          sort: sortOrder,
          search: searchTerm || undefined,
        }
      });
      const mapped = res.data.products.map(p => ({ ...p, id: p._id }));
      setProducts(mapped);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('❌ 获取产品失败：', err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchProducts();
}, [currentPage, sortOrder, searchTerm]);

  
    

  const sortedProducts = [...products].sort((a, b) => {
    if (sortOrder === 'asc') return a.price - b.price;
    if (sortOrder === 'desc') return b.price - a.price;
    if (sortOrder === 'latest') return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });

  return (
    
    <div style={{ padding: '2rem', maxWidth: '1200px',
        margin: '0 auto' }}>
      {/* 标题 + 筛选 + 添加 */}
      <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
        <h2>Products</h2>
        <div style={{  display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem'}}>
        
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="asc">Price: low to high</option>
            <option value="desc">Price: high to low</option>
            <option value="latest">Last Added</option>
          </select>
          {isAdmin && (
  <button onClick={() => navigate('/add-product')}>➕ Add Product</button>
)}
        </div>
      </div>

      {/* 加载中状态 */}
      {loading ? (
  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
    <div className="spinner"></div>
  </div>
) : (
        <>
          {/* 产品列表 */}
          <div  className="product-grid">{sortedProducts.map((product) => (
    <ProductCard
      key={product._id}
      product={product}
      isAdmin={isAdmin}
    />
  ))}
          </div>

          {/* Pagination*/}
          <Pagination
  totalPages={totalPages}
  currentPage={currentPage}
  onPageChange={(page) => setCurrentPage(page)}
/>

        </>
      )}
    </div>
);
};

export default ProductList;
