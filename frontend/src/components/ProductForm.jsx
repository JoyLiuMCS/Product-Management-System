import api from '../api/axios';
import { useNavigate } from 'react-router-dom'; 
import React, { useState } from 'react';

function ProductForm() {
  // 设置初始表单状态
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: ''
  });


  const navigate = useNavigate(); // 初始化导航器

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/products', formData);
      console.log('✅ 创建成功：', response.data);
      // 跳转回产品列表页
      navigate('/products');
    } catch (error) {
      console.error('❌ 创建失败：', error.message);
    }
  };


  // 每次输入时更新对应字段
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Product</h2>
      <div>
        <label>Product Name:</label>
        <input name="name" value={formData.name} onChange={handleChange} required />
      </div>

      <div>
        <label>Price:</label>
        <input name="price" value={formData.price} onChange={handleChange} type="number" required />
      </div>

      <div>
        <label>Description:</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required />
      </div>

      <button type="submit">Create</button>
    </form>
  );
}

export default ProductForm;
