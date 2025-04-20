// frontend/src/pages/ProductFormPage.jsx
import React from 'react';
import ProductForm from '../components/ProductForm';
import useAdminGuard from '../hooks/useAdminGuard';

const ProductFormPage = () => {
  useAdminGuard(); // 💥 这里就是调用你刚刚写的自定义 hook！

  return (
    <div style={{ padding: '20px' }}>
      <h2>Create or Edit a Product</h2>
      <ProductForm />
    </div>
  );
};

export default ProductFormPage;
