import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { CartProvider } from './context/CartContext'; // 👈 引入 CartProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartProvider>   {/* 👈 包裹 App */}
      <App />
    </CartProvider>
  </React.StrictMode>
);
