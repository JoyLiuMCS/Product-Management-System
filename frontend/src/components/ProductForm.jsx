import api from '../api/axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import './ProductForm.css'; 

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
  const user = JSON.parse(localStorage.getItem('user') || '{}');
const isAdmin = user.role === 'admin';


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
          console.error('Fail to loading products：', err.message);
        }
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await api.put(`/products/${id}`, formData);
        console.log('Product updated');
      } else {
        await api.post('/products', formData);
        console.log('Product created');
      }
      navigate('/products');
    } catch (err) {
      console.error('Failed to submit', err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      reverseButtons: true, 
    });
  
    if (result.isConfirmed) {
      try {
        await api.delete(`/products/${id}`);
        Swal.fire('Deleted!', 'The product has been removed.', 'success');
        navigate('/products');
      } catch (err) {
        Swal.fire('Error', 'Failed to delete the product.', 'error');
      }
    }
  };


  return (

<form onSubmit={handleSubmit} className="form-container">
  <h2>{id ? 'Edit Product' : 'Create Product'}</h2>

  <div className="form-grid">
    <div className="form-left">
      <div className="form-group">
        <label>Product Name:</label>
        <input name="name" value={formData.name} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Description:</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required />
      </div>

      <div className="form-group">
  <label htmlFor="category">Category:</label>
  <select
    name="category"
    id="category"
    value={formData.category}
    onChange={handleChange}
    required
  >
    <option value="">Select Category</option>
    <option value="food">Food</option>
    <option value="electronics">Electronics</option>
    <option value="clothing">Clothing</option>
  </select>
</div>


      <div className="form-group">
        <label>Price:</label>
        <input name="price" type="number" value={formData.price} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>In Stock Quantity:</label>
        <input name="quantity" type="number" value={formData.quantity} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Image Link:</label>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
          <button type="button" className="btn" onClick={() => setPreviewUrl(formData.imageUrl)}>Update</button>
        </div>
      </div>
    </div>

    <div className="form-right">
      <h4>Image Preview</h4>
      {previewUrl ? (
        <img src={previewUrl} alt="Preview" className="image-preview" />
      ) : (
        <p>No image preview available.</p>
      )}
    </div>
  </div>

  <div className="form-buttons">
    <button type="submit" className="btn btn-primary">
      {id ? 'Update Product' : 'Add Product'}
    </button>
    {id && isAdmin && (
      <button type="button" className="btn btn-danger" onClick={handleDelete}>
        Delete Product
      </button>
    )}
  </div>
</form>

  );
}

export default ProductForm;
