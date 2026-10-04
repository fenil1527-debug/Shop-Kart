import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import CartItem from "../components/CartItem";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { cartItems, cartLoading, cartError, cartCount, subtotal, fetchCart } = useCart();

  // Auth check + initial cart load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/customers/me");
        setUser(res.data.customer);
        fetchCart();
      } catch {
        navigate("/login");
      }
    };
    checkAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <Navbar user={user} />

      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 animate-fade-in">
            My Cart
          </h1>
          <p className="text-amber-100 text-lg max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "100ms" }}>
            {cartItems.length > 0
              ? `${cartCount} item${cartCount !== 1 ? "s" : ""} in your cart`
              : "Your cart is waiting to be filled"}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Loading state */}
        {cartLoading ? (
          <div className="text-center py-20">
            <svg className="w-10 h-10 animate-spin text-amber-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-stone-500 font-medium">Loading your cart...</p>
          </div>
        ) : cartError ? (
          /* Error state */
          <div className="max-w-md mx-auto text-center bg-white p-8 rounded-2xl border border-stone-200/80 shadow-sm mt-8">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-stone-900 mb-2">Unable to load your cart.</h2>
            <p className="text-stone-500 mb-6">{cartError}</p>
            <button
              onClick={fetchCart}
              className="btn-primary text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all"
            >
              Try Again
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          /* Empty state */
          <div className="max-w-md mx-auto text-center bg-white p-10 rounded-2xl border border-stone-200/80 shadow-sm mt-8 animate-fade-in">
            <div className="text-6xl mb-5">🛒</div>
            <h2 className="text-xl font-bold text-stone-900 mb-2">Your cart is empty</h2>
            <p className="text-stone-500 mb-6">Looks like you haven{"'"}t added anything yet.</p>
            <Link
              to="/products"
              className="inline-block btn-primary text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          /* Cart contents */
          <div className="flex flex-col lg:flex-row gap-8 animate-fade-in">
            {/* Cart items list */}
            <div className="flex-1 flex flex-col gap-4">
              {cartItems.filter((item) => item.product).map((item) => (
                <CartItem key={item.product._id} item={item} />
              ))}
            </div>

            {/* Order Summary sidebar */}
            <div className="lg:w-80 shrink-0">
              <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-bold text-stone-900 mb-5 pb-4 border-b border-stone-100">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm text-stone-600">
                    <span>Items ({cartCount} unit{cartCount !== 1 ? "s" : ""})</span>
                    <span className="font-semibold text-stone-900">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm text-stone-600">
                    <span>Delivery</span>
                    <span className="text-emerald-600 font-semibold">Free</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex justify-between mb-6">
                  <span className="text-base font-bold text-stone-900">Subtotal</span>
                  <span className="text-xl font-extrabold text-amber-700">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <button
                  id="proceed-to-checkout"
                  className="w-full btn-primary text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Proceed to Checkout
                </button>

                <Link
                  to="/products"
                  className="mt-3 block text-center text-sm text-stone-500 hover:text-amber-700 transition-colors duration-200"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
