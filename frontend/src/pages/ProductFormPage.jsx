// frontend/src/pages/ProductFormPage.jsx

import React from 'react';
import ProductForm from '../components/ProductForm';

const ProductFormPage = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Create or Edit a Product</h2>
      <ProductForm />
    </div>
  );
};

export default ProductFormPage;
