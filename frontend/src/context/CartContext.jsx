import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const saved = user ? localStorage.getItem(`cart-${user.username}`) : null;
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error('❌ Failed to load cart from localStorage:', err);
      return [];
    }
  });

  // ✅ 每次购物车更新后保存到 localStorage（与登录用户关联）
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        localStorage.setItem(`cart-${user.username}`, JSON.stringify(cart));
      }
    } catch (err) {
      console.error('❌ Failed to save cart to localStorage:', err);
    }
  }, [cart]);

  // ✅ 通用获取 ID（支持 id 或 _id）
  const getId = (item) => item.id || item._id;

  const addToCart = (product) => {
    const productId = getId(product);
    if (!product || !productId) {
      console.warn('⚠️ Invalid product:', product);
      return;
    }

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
    if (!id || typeof delta !== 'number') {
      console.warn('⚠️ Invalid quantity update:', { id, delta });
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        getId(item) === id
          ? { ...item, quantity: Math.max(item.quantity + delta, 1) }
          : item
      )
    );
  };

  const removeFromCart = (id) => {
    if (!id) {
      console.warn('⚠️ Invalid remove id:', id);
      return;
    }

    setCart((prev) => prev.filter((item) => getId(item) !== id));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
