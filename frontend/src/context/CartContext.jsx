import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const getId = (item) => item.id || item._id;

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

      console.log('Reloading cart: ', cartWithId);
      setCart(cartWithId);
    };

    loadCart(); 
    const interval = setInterval(loadCart, 1000); 

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const rawUser = localStorage.getItem('user');
    if (!rawUser) return;

    const user = JSON.parse(rawUser);
    const email = user?.email;

    if (email && cart.length > 0) {
      localStorage.setItem(`cart-${email}`, JSON.stringify(cart));
      console.log(`Save cart-${email} to localStorage`);
    } else {
      console.log('Cart empty or not logged in');
    }
  }, [cart]);

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
            ? { ...item, quantity: item.quantity + delta }
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
