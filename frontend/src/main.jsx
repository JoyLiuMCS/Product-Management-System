import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { CartProvider } from './context/CartContext';
import { Provider } from 'react-redux';
import store from './redux/store';

// ✅ 延迟加载 CartProvider 直到 user 准备好
function AppWithUserReady() {
  const [userReady, setUserReady] = useState(false);

  useEffect(() => {
    const rawUser = localStorage.getItem('user');
    console.log('📦 读取 user from localStorage:', rawUser);
    setUserReady(true);
  }, []);

  if (!userReady) return <p>⏳ 正在加载用户信息...</p>;

  return (
    <CartProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </CartProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppWithUserReady />
  </React.StrictMode>
);

