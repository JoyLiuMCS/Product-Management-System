// frontend/src/pages/ProductFormPage.jsx
import React from 'react';
import ProductForm from '../components/ProductForm';
import useAdminGuard from '../hooks/useAdminGuard';

const ProductFormPage = () => {
  useAdminGuard();

  return (
    <div style={{ padding: '2rem' }}>
      <ProductForm />
    </div>
  );
};

export default ProductFormPage;
