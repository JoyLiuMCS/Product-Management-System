import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // 统一获取 id
  const getId = (item) => item.id || item._id;

  // 自动根据当前 user.email 加载购物车（监听变化）
  useEffect(() => {
    let currentEmail = null;

    const loadCart = () => {
      const rawUser = localStorage.getItem('user');
      const user = rawUser ? JSON.parse(rawUser) : null;
      const email = user?.email;

      if (!email || email === currentEmail) return;

      currentEmail = email;

      const saved = localStorage.getItem(`cart-${email}`);
      const parsed = saved ? JSON.parse(saved) : [];

      const cartWithId = parsed.map(item => ({
        ...item,
        id: item.id || item._id,
      }));

      console.log('🛒 重新加载购物车：', cartWithId);
      setCart(cartWithId);
    };

    loadCart(); // 首次加载
    const interval = setInterval(loadCart, 1000); // 每秒轮询一次 user.email 变化

    return () => clearInterval(interval);
  }, []);

  // 每次购物车变化时保存到 localStorage
  useEffect(() => {
    const rawUser = localStorage.getItem('user');
    if (!rawUser) return;

    const user = JSON.parse(rawUser);
    const email = user?.email;

    if (email && cart.length > 0) {
      localStorage.setItem(`cart-${email}`, JSON.stringify(cart));
      console.log(`💾 已保存 cart-${email} 到 localStorage`);
    } else {
      console.log('🧹 空购物车或用户未登录，不保存');
    }
  }, [cart]);

  // 添加商品
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

  // 更新商品数量
  const updateQuantity = (id, delta) => {
    if (!id || typeof delta !== 'number') return;

    setCart((prev) =>
      prev
        .map((item) =>
          getId(item) === id
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0) // 删除为 0 的商品
    );
  };

  // 设置商品指定数量（如直接输入数字）
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

  // 移除商品
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
