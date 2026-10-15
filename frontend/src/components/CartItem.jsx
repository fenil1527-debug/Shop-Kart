import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();
  const [loadingQty, setLoadingQty] = useState(false);
  const [loadingRemove, setLoadingRemove] = useState(false);
  const [error, setError] = useState(null);

  const { product, quantity } = item;
  if (!product) return null;

  const lineTotal = product.price * quantity;

  const handleQuantity = async (newQty) => {
    if (loadingQty || newQty < 1) return;
    setLoadingQty(true);
    setError(null);
    try {
      await updateQuantity(product._id, newQty);
    } catch (err) {
      setError(err.response?.data?.message || "Could not update quantity");
    } finally {
      setLoadingQty(false);
    }
  };

  const handleRemove = async () => {
    if (loadingRemove) return;
    setLoadingRemove(true);
    setError(null);
    try {
      await removeFromCart(product._id);
    } catch (err) {
      setError(err.response?.data?.message || "Could not remove item");
      setLoadingRemove(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#e8e2d7] shadow-xs p-4 sm:p-5 flex gap-4 sm:gap-6 items-center transition-all duration-200 hover:border-stone-400">
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-[#f4efe6] shrink-0 border border-[#e8e2d7]/60">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <span className="text-[10px] uppercase tracking-widest font-bold text-stone-400">
          {product.category}
        </span>
        <h3 className="font-sans text-sm font-semibold text-[#191716] leading-snug line-clamp-1 mt-0.5">
          {product.name}
        </h3>

        <p className="font-serif text-sm font-bold text-[#191716] mt-1 sm:hidden">
          ₹{product.price.toLocaleString("en-IN")}
        </p>

        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center border border-[#e8e2d7] rounded-md bg-[#fbf9f5]">
            <button
              id={`qty-dec-${product._id}`}
              onClick={() => handleQuantity(quantity - 1)}
              disabled={loadingQty || quantity <= 1}
              className="w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-stone-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed font-bold"
            >
              −
            </button>
            <span className="w-8 text-center text-xs font-bold text-[#191716]">
              {loadingQty ? (
                <svg className="w-3 h-3 animate-spin mx-auto text-stone-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              ) : quantity}
            </span>
            <button
              id={`qty-inc-${product._id}`}
              onClick={() => handleQuantity(quantity + 1)}
              disabled={loadingQty || quantity >= product.stock}
              className="w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-stone-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed font-bold"
            >
              +
            </button>
          </div>

          {quantity >= product.stock && (
            <span className="text-[11px] text-[#c25e36] font-medium">Max atelier stock</span>
          )}
        </div>

        {error && (
          <p className="text-[11px] text-red-500 mt-1.5">{error}</p>
        )}
      </div>

      <div className="flex flex-col items-end justify-between self-stretch shrink-0">
        <span className="font-serif text-base sm:text-lg font-bold text-[#191716]">
          ₹{lineTotal.toLocaleString("en-IN")}
        </span>

        <button
          id={`remove-${product._id}`}
          onClick={handleRemove}
          disabled={loadingRemove}
          className="text-xs uppercase tracking-wider font-semibold text-stone-400 hover:text-rose-600 transition-colors disabled:opacity-50 flex items-center gap-1"
        >
          {loadingRemove ? "Removing..." : "Remove ✕"}
        </button>
      </div>
    </div>
  );
}
