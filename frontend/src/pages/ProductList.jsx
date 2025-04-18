// frontend/src/pages/ProductList.jsx
import React, { useEffect, useState } from 'react';
import axios from '../api/axios'; // 使用你配置的 axios 实例

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // 页面加载时拉取数据
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

  return (
    <div>
      <h2>🛍️ 所有产品列表</h2>
      {products.length === 0 ? (
        <p>暂无产品。</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product._id}>
              <h3>{product.name}</h3>
              <p>💵 价格：{product.price}</p>
              <p>📝 描述：{product.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductList;
