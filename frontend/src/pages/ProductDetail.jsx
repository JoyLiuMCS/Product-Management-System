import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
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
            <button onClick={() => console.log('Add to cart:', product.name)}>➕ Add</button>
            <button onClick={() => navigate(`/products/${product._id}/edit`)}>✏️ Edit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
