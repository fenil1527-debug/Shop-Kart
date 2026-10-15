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
  }, [navigate, fetchCart]);

  const freeShippingThreshold = 499;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="min-h-screen bg-[#fbf9f5] flex flex-col text-[#191716]">
      <Navbar user={user} />

      <div className="bg-[#f4efe6] border-b border-[#e8e2d7] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs uppercase tracking-widest font-bold text-[#c25e36]">
            Review Selections
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#191716] mt-2">
            Your Shopping Bag
          </h1>
          <p className="text-stone-600 text-sm sm:text-base mt-2 font-sans">
            {cartItems.length > 0
              ? `${cartCount} curated item${cartCount !== 1 ? "s" : ""} selected for checkout`
              : "Your shopping bag is currently waiting to be filled"}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        {cartLoading ? (
          <div className="text-center py-20">
            <svg className="w-10 h-10 animate-spin text-[#191716] mx-auto mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-stone-500 font-medium text-xs uppercase tracking-widest">
              Consulting your atelier bag...
            </p>
          </div>
        ) : cartError ? (
          
          <div className="max-w-md mx-auto text-center bg-white p-8 rounded-2xl border border-red-200 shadow-xs mt-8">
            <div className="text-3xl mb-3">⚠️</div>
            <h2 className="font-serif text-xl font-bold text-[#191716] mb-2">Unable to Load Bag</h2>
            <p className="text-stone-500 text-xs mb-6 leading-relaxed">{cartError}</p>
            <button
              onClick={fetchCart}
              className="btn-primary text-white text-xs uppercase tracking-widest font-bold px-6 py-3 rounded-full"
            >
              Retry
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          
          <div className="max-w-md mx-auto text-center bg-white p-12 rounded-2xl border border-[#e8e2d7] shadow-xs mt-8 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-[#f4efe6] text-stone-400 mx-auto flex items-center justify-center text-3xl mb-4">
              🛍️
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#191716] mb-2">Your Bag is Empty</h2>
            <p className="text-stone-500 text-xs leading-relaxed mb-6">
              Browse our seasonal collections to find handpicked clothing, electronics, and lifestyle pieces.
            </p>
            <Link
              to="/products"
              className="btn-primary inline-block text-white text-xs uppercase tracking-widest font-bold px-8 py-3.5 rounded-full"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          
          <div className="flex flex-col lg:flex-row gap-8 animate-fade-in">
            <div className="flex-1 flex flex-col gap-4">
              {cartItems.filter((item) => item.product).map((item) => (
                <CartItem key={item.product._id} item={item} />
              ))}
            </div>

            <div className="lg:w-96 shrink-0">
              <div className="bg-white rounded-2xl border border-[#e8e2d7] shadow-xs p-6 sm:p-7 sticky top-28">
                <h2 className="font-serif text-xl font-bold text-[#191716] mb-5 pb-4 border-b border-[#e8e2d7]">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6 text-xs text-stone-600 font-sans">
                  <div className="flex justify-between">
                    <span>Items Subtotal ({cartCount} {cartCount === 1 ? "unit" : "units"})</span>
                    <span className="font-bold text-[#191716]">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Express Shipping</span>
                    <span>{remainingForFreeShipping === 0 ? (
                      <span className="text-emerald-700 font-semibold">Complimentary</span>
                    ) : (
                      "₹49"
                    )}</span>
                  </div>

                  {remainingForFreeShipping > 0 && (
                    <div className="p-2.5 rounded-lg bg-[#f4efe6] text-[11px] text-stone-600 mt-2">
                      💡 Add <strong>₹{remainingForFreeShipping.toLocaleString("en-IN")}</strong> more to unlock complimentary delivery.
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-[#e8e2d7] flex justify-between items-baseline mb-6">
                  <span className="font-serif text-lg font-bold text-[#191716]">Total</span>
                  <span className="font-serif text-2xl font-bold text-[#191716]">
                    ₹{(subtotal + (remainingForFreeShipping === 0 ? 0 : 49)).toLocaleString("en-IN")}
                  </span>
                </div>

                <button
                  id="proceed-to-checkout"
                  onClick={() => navigate("/checkout")}
                  className="w-full btn-primary text-white font-bold py-3.5 rounded-full text-xs uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>

                <Link
                  to="/products"
                  className="mt-4 block text-center text-xs uppercase tracking-wider font-semibold text-stone-500 hover:text-[#191716] transition-colors"
                >
                  ← Continue Shopping
                </Link>

                <div className="mt-6 pt-5 border-t border-[#f4efe6] text-center text-[11px] text-stone-400 space-y-1">
                  <p>🔒 256-bit SSL encrypted checkout</p>
                  <p>Guaranteed authentic Nordic curation</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="bg-white border-t border-[#e8e2d7] py-6 text-center text-xs text-stone-400 mt-auto">
        <p>&copy; {new Date().getFullYear()} ShopKart. Nordic Minimalist Storefront.</p>
      </footer>
    </div>
  );
}
