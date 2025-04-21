import { createContext, useState, useEffect, useRef } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const currentEmailRef = useRef(null); // 使用 useRef 保持 email

  // 公共方法用于取 ID
  const getId = (item) => item.id || item._id;

  // 加载购物车
  const loadCart = () => {
    const rawUser = localStorage.getItem('user');
    const user = rawUser ? JSON.parse(rawUser) : null;
    const email = user?.email;

    if (!email || email === currentEmailRef.current) return;
    currentEmailRef.current = email;

    const saved = localStorage.getItem(`cart-${email}`);
    const parsed = saved ? JSON.parse(saved) : [];

    const cartWithId = parsed.map(item => ({
      ...item,
      id: item.id || item._id,
    }));

    console.log('🛒 重新加载购物车：', cartWithId);
    setCart(cartWithId);
  };

  // 初始化 & 每秒轮询 user 变化
  useEffect(() => {
    loadCart();
    const interval = setInterval(loadCart, 1000);
    return () => clearInterval(interval);
  }, []);

  // 保存购物车到 localStorage
  useEffect(() => {
    const rawUser = localStorage.getItem('user');
    if (!rawUser) return;

    const user = JSON.parse(rawUser);
    const email = user?.email;

    if (email) {
      localStorage.setItem(`cart-${email}`, JSON.stringify(cart));
      console.log(`💾 已保存 cart-${email}:`, cart);
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

  // 更新数量
  const updateQuantity = (id, delta) => {
    if (!id || typeof delta !== 'number') return;
    setCart((prev) =>
      prev
        .map((item) =>
          getId(item) === id
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // 设置固定数量
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

  // 删除商品
  const removeFromCart = (id) => {
    if (!id) return;
    setCart((prev) => prev.filter((item) => getId(item) !== id));
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        setQuantity
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
