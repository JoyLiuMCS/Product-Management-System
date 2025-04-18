import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { CartProvider } from './context/CartContext'; // 👈 引入 CartProvider
import { Provider } from 'react-redux';
import store from './redux/store'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartProvider>   {/* 👈 包裹 App */}
    <Provider store={store}>
      <App />
    </Provider>
    </CartProvider>
  </React.StrictMode>
);
