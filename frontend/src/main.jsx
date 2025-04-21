import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { CartProvider } from './context/CartContext';

function AppWithUserReady() {
  const [userReady, setUserReady] = useState(false);

  useEffect(() => {
    const rawUser = localStorage.getItem('user');
    console.log('Get user from localStorage:', rawUser);
    setUserReady(true);
  }, []);

  if (!userReady) return <p>Loading user info...</p>;

  return (
    <CartProvider>
        <App />
    </CartProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppWithUserReady />
  </React.StrictMode>
);

