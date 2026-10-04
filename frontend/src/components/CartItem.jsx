import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();
  const [loadingQty, setLoadingQty] = useState(false);
  const [loadingRemove, setLoadingRemove] = useState(false);
  const [error, setError] = useState(null);

  const { product, quantity } = item;
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
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-4 flex gap-4 items-start transition-all duration-200 hover:shadow-md">
      {/* Product image */}
      <div className="w-24 h-24 rounded-xl overflow-hidden bg-stone-100 shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-stone-900 leading-snug line-clamp-2 mb-0.5">
          {product.name}
        </h3>
        <p className="text-xs text-stone-400 mb-2 capitalize">{product.category}</p>

        <p className="text-base font-bold text-stone-900 mb-3">
          ₹{product.price.toLocaleString("en-IN")}
        </p>

        {/* Quantity controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-stone-100 rounded-xl p-0.5">
            <button
              id={`qty-dec-${product._id}`}
              onClick={() => handleQuantity(quantity - 1)}
              disabled={loadingQty || quantity <= 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-600 hover:bg-white hover:shadow-sm transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-lg"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-bold text-stone-800">
              {loadingQty ? (
                <svg className="w-3.5 h-3.5 animate-spin mx-auto" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              ) : quantity}
            </span>
            <button
              id={`qty-inc-${product._id}`}
              onClick={() => handleQuantity(quantity + 1)}
              disabled={loadingQty || quantity >= product.stock}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-600 hover:bg-white hover:shadow-sm transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-lg"
            >
              +
            </button>
          </div>

          {quantity >= product.stock && (
            <span className="text-xs text-amber-600 font-medium">Max stock</span>
          )}
        </div>

        {error && (
          <p className="text-xs text-red-500 mt-1.5">{error}</p>
        )}
      </div>

      {/* Right: line total + remove */}
      <div className="flex flex-col items-end gap-3 shrink-0">
        <span className="text-base font-bold text-stone-900">
          ₹{lineTotal.toLocaleString("en-IN")}
        </span>
        <button
          id={`remove-${product._id}`}
          onClick={handleRemove}
          disabled={loadingRemove}
          className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium transition-colors duration-200 disabled:opacity-50"
        >
          {loadingRemove ? (
            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          )}
          Remove
        </button>
      </div>
    </div>
  );
}
