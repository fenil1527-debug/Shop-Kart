import { useState } from "react";
import { Link } from "react-router-dom";

export default function WishlistCard({ product, onRemove }) {
  const [isRemoving, setIsRemoving] = useState(false);

  if (!product) return null;

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await onRemove(product._id);
    } catch (error) {
      console.error("Failed to remove from wishlist", error);
      setIsRemoving(false);
    }
  };

  const inStock = product.stock > 0;
  const lowStock = product.stock > 0 && product.stock <= 5;
  const displayPrice = product.price != null ? product.price.toLocaleString("en-IN") : "0";

  return (
    <div className="card-hover group bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-stone-100">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
          loading="lazy" 
        />
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-stone-700 text-xs font-semibold px-2.5 py-1 rounded-lg shadow-sm">
          {product.category}
        </span>
      </div>
      <div className="flex flex-col flex-1 p-4">
        <h3 className="text-sm font-bold text-stone-900 leading-snug line-clamp-2 mb-1.5">{product.name}</h3>
        <p className="text-xs text-stone-400 line-clamp-2 mb-3 leading-relaxed">{product.description}</p>
        <div className="mt-auto flex items-end justify-between mb-4">
          <span className="text-lg font-bold text-stone-900">₹{displayPrice}</span>
          {inStock ? (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${lowStock ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}>
              {lowStock ? `Only ${product.stock} left` : `${product.stock} in stock`}
            </span>
          ) : (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">Out of stock</span>
          )}
        </div>
        <div className="pt-3 border-t border-stone-100 flex gap-2">
          <Link
            to={`/products/${product._id}`}
            className="flex-1 text-center bg-stone-100 hover:bg-stone-200 text-stone-900 text-sm font-semibold px-2 py-2.5 rounded-xl transition-colors"
          >
            View Details
          </Link>
          <button
            onClick={handleRemove}
            disabled={isRemoving}
            className="flex-1 text-center bg-rose-50 hover:bg-rose-100 text-rose-600 disabled:opacity-50 text-sm font-semibold px-2 py-2.5 rounded-xl transition-colors border border-rose-200"
          >
            {isRemoving ? "Removing..." : "Remove ♥"}
          </button>
        </div>
      </div>
    </div>
  );
}
