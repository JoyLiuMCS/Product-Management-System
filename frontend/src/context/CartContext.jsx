// src/context/CartContext.jsx
import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]); // ✅ 初始设置为空数组

  // ✅ 页面挂载后，再从 localStorage 加载 cart
  useEffect(() => {
    const rawUser = localStorage.getItem('user');
    console.log('📦 读取 user：', rawUser);
    if (rawUser) {
      const user = JSON.parse(rawUser);
      const saved = localStorage.getItem(`cart-${user.username}`);
      const parsed = saved ? JSON.parse(saved) : [];

      const cartWithId = parsed.map(item => ({
        ...item,
        id: item.id || item._id,
      }));

      console.log('🛒 加载购物车：', cartWithId);
      setCart(cartWithId);
    }
  }, []);

  // ✅ 每次购物车更新时保存到 localStorage
  useEffect(() => {
    const rawUser = localStorage.getItem('user');
    if (!rawUser) return;
  
    const user = JSON.parse(rawUser);
  
    // 👇 加个保护条件：只有 cart 有内容时才存！
    if (cart.length > 0) {
      console.log('💾 保存购物车到 localStorage ✅');
      localStorage.setItem(`cart-${user.username}`, JSON.stringify(cart));
    } else {
      console.log('🚫 不保存空购物车 ❌');
    }
  }, [cart]);
  

  // ✅ 公共方法
  const getId = (item) => item.id || item._id;

  const addToCart = (product) => {
    const productId = getId(product);
    if (!product || !productId) return;

    setCart((prev) => {
      const existing = prev.find((item) => getId(item) === productId);
      if (existing) {
        return prev.map((item) =>
          getId(item) === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (id, delta) => {
    if (!id || typeof delta !== 'number') return;
    setCart((prev) =>
      prev
        .map((item) =>
          getId(item) === id
            ? { ...item, quantity: Math.max(item.quantity + delta, 1) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const setQuantity = (id, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id);
    } else {
      setCart((prev) =>
        prev.map((item) =>
          getId(item) === id ? { ...item, quantity: newQty } : item
        )
      );
    }
  };

  const removeFromCart = (id) => {
    if (!id) return;
    setCart((prev) => prev.filter((item) => getId(item) !== id));
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQuantity, removeFromCart, setQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};

