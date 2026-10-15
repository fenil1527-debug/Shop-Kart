import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartDrawer() {
  const {
    isDrawerOpen,
    closeDrawer,
    cartItems,
    cartCount,
    subtotal,
    updateQuantity,
    removeFromCart,
  } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isDrawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  const freeShippingThreshold = 499;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#fbf9f5] border-l border-[#e8e2d7] shadow-2xl flex flex-col animate-slide-in">
          <div className="px-6 py-5 border-b border-[#e8e2d7] flex items-center justify-between bg-white/60">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#191716] tracking-tight">
                Shopping Bag
              </h2>
              <p className="text-xs text-stone-500 font-sans mt-0.5">
                {cartCount} {cartCount === 1 ? "item" : "items"} selected
              </p>
            </div>
            <button
              onClick={closeDrawer}
              className="p-2 rounded-full hover:bg-stone-200/60 text-stone-600 transition-colors"
              aria-label="Close cart"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="px-6 py-3.5 bg-[#f4efe6] border-b border-[#e8e2d7] text-xs text-stone-700">
            {remainingForFreeShipping === 0 ? (
              <div className="flex items-center gap-1.5 font-medium text-emerald-800">
                <span>✨</span>
                <span>You qualify for <strong>Complimentary Express Delivery</strong>!</span>
              </div>
            ) : (
              <div>
                <p className="mb-1.5">
                  Add <strong className="text-[#191716]">₹{remainingForFreeShipping.toLocaleString("en-IN")}</strong> more for Complimentary Delivery
                </p>
                <div className="w-full bg-stone-200/80 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#191716] h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#f4efe6] border border-[#e8e2d7] flex items-center justify-center text-stone-400 mb-4 text-2xl">
                  🛍️
                </div>
                <h3 className="font-serif text-lg font-semibold text-stone-800 mb-1">
                  Your bag is empty
                </h3>
                <p className="text-stone-500 text-xs max-w-xs mb-6">
                  Explore our curated seasonal collections and find something exceptional.
                </p>
                <button
                  onClick={() => {
                    closeDrawer();
                    navigate("/products");
                  }}
                  className="btn-primary text-xs font-semibold px-6 py-3 rounded-full uppercase tracking-wider"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cartItems.filter((item) => item.product).map((item) => {
                const { product, quantity } = item;
                return (
                  <div
                    key={product._id}
                    className="flex gap-4 p-3 bg-white rounded-xl border border-[#e8e2d7]/80 shadow-xs transition-all hover:border-stone-300"
                  >
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-semibold text-stone-900 line-clamp-1">
                            {product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(product._id)}
                            className="text-stone-400 hover:text-rose-600 transition-colors p-0.5"
                            title="Remove item"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <p className="text-[11px] text-stone-400 capitalize mt-0.5">
                          {product.category}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100">
                        <div className="flex items-center border border-stone-200 rounded-md bg-stone-50 text-xs">
                          <button
                            onClick={() => updateQuantity(product._id, quantity - 1)}
                            disabled={quantity <= 1}
                            className="w-6 h-6 flex items-center justify-center text-stone-600 hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            −
                          </button>
                          <span className="w-7 text-center font-medium text-stone-800">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product._id, quantity + 1)}
                            disabled={quantity >= product.stock}
                            className="w-6 h-6 flex items-center justify-center text-stone-600 hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-xs font-bold text-stone-900">
                          ₹{(product.price * quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="p-6 bg-white border-t border-[#e8e2d7] space-y-4">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Delivery</span>
                  <span>{remainingForFreeShipping === 0 ? "Complimentary" : "₹49"}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-100">
                  <span className="font-serif text-base">Estimated Total</span>
                  <span className="font-sans">
                    ₹{(subtotal + (remainingForFreeShipping === 0 ? 0 : 49)).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    closeDrawer();
                    navigate("/checkout");
                  }}
                  className="w-full btn-primary py-3 rounded-full text-xs font-bold tracking-widest uppercase shadow-sm"
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={() => {
                    closeDrawer();
                    navigate("/cart");
                  }}
                  className="w-full py-2.5 text-center text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
                >
                  View Full Shopping Bag →
                </button>
              </div>

              <p className="text-[11px] text-center text-stone-400">
                🔒 Safe & encrypted checkout • 7-day effortless return policy
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
