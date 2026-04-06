import { createContext, useContext, useEffect, useState } from "react";
import { addToCart, getCart, removeCartItem, updateCartItem } from "../api/cartApi";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const refreshCart = async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }
    setLoading(true);
    try {
      const response = await getCart();
      setCart(response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [isAuthenticated]);

  const addItem = async (productId, quantity) => {
    setLoading(true);
    try {
      const response = await addToCart({ productId, quantity });
      setCart(response);
      return response;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (itemId, quantity) => {
    const response = await updateCartItem(itemId, { quantity });
    setCart(response);
  };

  const removeItem = async (itemId) => {
    const response = await removeCartItem(itemId);
    setCart(response);
  };

  return (
    <CartContext.Provider value={{ cart, loading, refreshCart, addItem, updateItem, removeItem }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
