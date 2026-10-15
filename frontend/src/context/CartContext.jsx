import { createContext, useContext, useState, useCallback } from "react";
import api from "../services/api";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const fetchCart = useCallback(async () => {
    setCartLoading(true);
    setCartError(null);
    try {
      const res = await api.get("/cart");
      setCartItems(res.data.cart || []);
    } catch (err) {
      setCartError("Unable to load your cart.");
      console.error("Cart fetch error:", err);
    } finally {
      setCartLoading(false);
    }
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setCartError(null);
    setIsDrawerOpen(false);
  }, []);

  const addToCart = useCallback(async (productId, shouldOpenDrawer = true) => {
    const res = await api.post(`/cart/${productId}`);
    setCartItems(res.data.cart || []);
    if (shouldOpenDrawer) {
      setIsDrawerOpen(true);
    }
    return res.data;
  }, []);

  const updateQuantity = useCallback(async (productId, quantity) => {
    const res = await api.patch(`/cart/${productId}`, { quantity });
    setCartItems(res.data.cart || []);
    return res.data;
  }, []);

  const removeFromCart = useCallback(async (productId) => {
    const res = await api.delete(`/cart/${productId}`);
    setCartItems(res.data.cart || []);
    return res.data;
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartLoading,
        cartError,
        cartCount,
        subtotal,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        fetchCart,
        clearCart,
        addToCart,
        updateQuantity,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
