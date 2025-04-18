import api from '../api/axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function ProductForm() {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    quantity: '',
    imageUrl: 'http://',
  });
  const [previewUrl, setPreviewUrl] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  // ✅ 编辑模式时，预填数据
  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          const res = await api.get(`/products/${id}`);
          setFormData({
            name: res.data.name,
            price: res.data.price,
            description: res.data.description,
            category: res.data.category || '',
            quantity: res.data.quantity || '',
            imageUrl: res.data.imageUrl || 'http://',
          });
          setPreviewUrl(res.data.imageUrl || '');
        } catch (err) {
          console.error('❌ 加载产品失败：', err.message);
        }
      }
    };

    fetchProduct();
  }, [id]);

  // ✅ 提交逻辑
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await api.put(`/products/${id}`, formData);
        console.log('✅ 产品已更新');
      } else {
        await api.post('/products', formData);
        console.log('✅ 创建成功');
      }
      navigate('/products');
    } catch (err) {
      console.error('❌ 提交失败：', err.message);
    }
  };

  // ✅ 输入同步逻辑
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{id ? 'Edit Product' : 'Create Product'}</h2>

      <div style={{ display: 'flex', gap: '2rem' }}>
        <div style={{ flex: 1 }}>
          <div>
            <label>Product Name:</label>
            <input name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div>
            <label>Description:</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required />
          </div>

          <div>
            <label>Category:</label>
            <div>
              <label>
                <input type="radio" name="category" value="food" checked={formData.category === 'food'} onChange={handleChange} />
                Food
              </label>
              <label>
                <input type="radio" name="category" value="electronics" checked={formData.category === 'electronics'} onChange={handleChange} />
                Electronics
              </label>
              <label>
                <input type="radio" name="category" value="clothing" checked={formData.category === 'clothing'} onChange={handleChange} />
                Clothing
              </label>
            </div>
          </div>

          <div>
            <label>Price:</label>
            <input name="price" type="number" value={formData.price} onChange={handleChange} required />
          </div>

          <div>
            <label>In Stock Quantity:</label>
            <input name="quantity" type="number" value={formData.quantity} onChange={handleChange} />
          </div>

          <div>
            <label>Image Link:</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
              <button type="button" onClick={() => setPreviewUrl(formData.imageUrl)}>Update</button>
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <h4>Image Preview</h4>
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%' }} />
          ) : (
            <p>暂无预览图</p>
          )}
        </div>
      </div>

      <button type="submit" style={{ marginTop: '1rem' }}>
        {id ? 'Update Product' : 'Add Product'}
      </button>
    </form>
  );
}

export default ProductForm;
