import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product, wishlisted = false, onWishlistToggle }) {
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const inStock = product.stock > 0;
  const lowStock = product.stock > 0 && product.stock <= 5;
  const inCart = cartItems.some((item) => item.product?._id === product._id);

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSaving) return;

    setIsSaving(true);
    try {
      if (wishlisted) {
        await api.delete(`/wishlist/${product._id}`);
        onWishlistToggle && onWishlistToggle(product._id, false);
      } else {
        await api.post(`/wishlist/${product._id}`);
        onWishlistToggle && onWishlistToggle(product._id, true);
      }
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      } else if (err.response?.status === 409) {
        onWishlistToggle && onWishlistToggle(product._id, true);
      } else {
        console.error("Wishlist error:", err);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAddingToCart || !inStock) return;
    setIsAddingToCart(true);
    try {
      await addToCart(product._id);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        console.error("Add to cart error:", err);
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden flex flex-col relative">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-stone-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Category badge */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-stone-700 text-xs font-semibold px-2.5 py-1 rounded-lg shadow-sm">
          {product.category}
        </span>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          disabled={isSaving}
          className={`absolute top-3 right-3 p-2 rounded-full shadow-sm backdrop-blur-md transition-all duration-200 z-10 
            ${wishlisted ? "bg-red-50/90 text-red-500" : "bg-white/90 text-stone-400 hover:text-red-500 hover:bg-red-50/90"}
            ${isSaving ? "opacity-70 cursor-not-allowed" : "hover:scale-110"}`}
        >
          {isSaving ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : wishlisted ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )}
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="text-sm font-bold text-stone-900 leading-snug line-clamp-2 mb-1.5 group-hover:text-amber-700 transition-colors duration-200">
          {product.name}
        </h3>

        <p className="text-xs text-stone-400 line-clamp-2 mb-3 leading-relaxed">
          {product.description}
        </p>

        {/* Price + Stock */}
        <div className="mt-auto flex items-end justify-between">
          <span className="text-lg font-bold text-stone-900">
            ₹{product.price.toLocaleString("en-IN")}
          </span>

          {inStock ? (
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                lowStock
                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
              }`}
            >
              {lowStock ? `Only ${product.stock} left` : `${product.stock} in stock`}
            </span>
          ) : (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
              Out of stock
            </span>
          )}
        </div>

        {/* Add to Cart + View Details */}
        <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <button
            id={`add-to-cart-${product._id}`}
            onClick={handleAddToCart}
            disabled={isAddingToCart || !inStock}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all duration-200
              ${!inStock
                ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                : inCart
                ? "bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200"
                : "bg-amber-500 text-white hover:bg-amber-600 shadow-sm hover:shadow-md"
              }
              ${isAddingToCart ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {isAddingToCart ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Adding...
              </>
            ) : inCart ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Add Another
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9m-9-4h4" />
                </svg>
                Add to Cart
              </>
            )}
          </button>
          <Link
            to={`/products/${product._id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors duration-200 shrink-0"
          >
            Details
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
