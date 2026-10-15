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
      await addToCart(product._id, true);
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
    <div className="group bg-white rounded-xl border border-[#e8e2d7] shadow-xs overflow-hidden flex flex-col card-hover">
      <Link to={`/products/${product._id}`} className="relative aspect-4/5 overflow-hidden bg-[#f4efe6] block">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        <span className="absolute top-3 left-3 bg-[#fbf9f5]/90 backdrop-blur-md text-[#191716] text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm shadow-xs border border-[#e8e2d7]/60">
          {product.category}
        </span>

        <button
          onClick={handleWishlistClick}
          disabled={isSaving}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-xs backdrop-blur-md transition-all duration-200 z-10
            ${wishlisted
              ? "bg-[#191716] text-white"
              : "bg-white/85 text-stone-500 hover:text-[#c25e36] hover:bg-white"
            }
            ${isSaving ? "opacity-70 cursor-not-allowed" : "hover:scale-105"}`}
          title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isSaving ? (
            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
          ) : wishlisted ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )}
        </button>

        <div className="absolute inset-x-3 bottom-3 hidden sm:block opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart || !inStock}
            className="w-full bg-[#191716]/95 hover:bg-[#191716] text-white py-2.5 px-4 rounded-lg text-xs font-semibold tracking-wider uppercase backdrop-blur-md shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAddingToCart ? "Adding..." : !inStock ? "Out of Stock" : inCart ? "Added • Add Another" : "Quick Add +"}
          </button>
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <Link to={`/products/${product._id}`} className="block">
          <h3 className="font-sans text-sm font-semibold text-[#191716] leading-snug line-clamp-1 group-hover:text-[#c25e36] transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
          {product.description}
        </p>

        <div className="mt-auto pt-3 flex items-center justify-between border-t border-[#f4efe6]">
          <span className="font-serif text-base font-bold text-[#191716]">
            ₹{product.price.toLocaleString("en-IN")}
          </span>

          {inStock ? (
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                lowStock
                  ? "bg-amber-50 text-amber-800 border border-amber-200"
                  : "bg-[#f4efe6] text-stone-600"
              }`}
            >
              {lowStock ? `Only ${product.stock} left` : "In Stock"}
            </span>
          ) : (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-400">
              Sold out
            </span>
          )}
        </div>

        <div className="mt-3 sm:hidden">
          <button
            id={`add-to-cart-${product._id}`}
            onClick={handleAddToCart}
            disabled={isAddingToCart || !inStock}
            className={`w-full py-2 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all
              ${!inStock
                ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                : inCart
                ? "bg-[#f4efe6] text-[#191716] border border-[#e8e2d7]"
                : "bg-[#191716] text-white"
              }`}
          >
            {isAddingToCart ? "Adding..." : inCart ? "Add Another" : "Quick Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
