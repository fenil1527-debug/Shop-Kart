import { createContext, useContext, useState, useCallback } from "react";
import api from "../services/api";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState(null);

  // Derived values
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Fetch cart from backend
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

  // Clear cart (on logout)
  const clearCart = useCallback(() => {
    setCartItems([]);
    setCartError(null);
  }, []);

  // Add a product to cart (or increment quantity)
  const addToCart = useCallback(async (productId) => {
    const res = await api.post(`/cart/${productId}`);
    setCartItems(res.data.cart || []);
    return res.data;
  }, []);

  // Update a cart item's quantity
  const updateQuantity = useCallback(async (productId, quantity) => {
    const res = await api.patch(`/cart/${productId}`, { quantity });
    setCartItems(res.data.cart || []);
    return res.data;
  }, []);

  // Remove a product from cart
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

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
