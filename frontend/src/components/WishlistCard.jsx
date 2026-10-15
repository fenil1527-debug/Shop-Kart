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
    <div className="card-hover group bg-white rounded-xl border border-[#e8e2d7] shadow-xs overflow-hidden flex flex-col">
      <Link to={`/products/${product._id}`} className="relative aspect-4/5 overflow-hidden bg-[#f4efe6] block">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <span className="absolute top-3 left-3 bg-[#fbf9f5]/90 backdrop-blur-md text-[#191716] text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm shadow-xs border border-[#e8e2d7]">
          {product.category}
        </span>
      </Link>

      <div className="flex flex-col flex-1 p-4 sm:p-5">
        <Link to={`/products/${product._id}`} className="block">
          <h3 className="font-sans text-sm font-semibold text-[#191716] leading-snug line-clamp-1 mb-1 hover:text-[#c25e36] transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-stone-500 line-clamp-2 mb-3 leading-relaxed">
          {product.description}
        </p>

        <div className="mt-auto flex items-end justify-between mb-4 pt-3 border-t border-[#f4efe6]">
          <span className="font-serif text-base font-bold text-[#191716]">₹{displayPrice}</span>
          {inStock ? (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${lowStock ? "bg-amber-50 text-amber-800 border border-amber-200" : "bg-[#f4efe6] text-stone-600"}`}>
              {lowStock ? `Only ${product.stock} left` : "In stock"}
            </span>
          ) : (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-400">Sold out</span>
          )}
        </div>

        <div className="pt-2 flex gap-2">
          <Link
            to={`/products/${product._id}`}
            className="flex-1 text-center bg-[#191716] hover:bg-[#2e2b28] text-white text-xs font-semibold uppercase tracking-wider py-2.5 rounded-lg transition-colors shadow-xs"
          >
            View Item
          </Link>
          <button
            onClick={handleRemove}
            disabled={isRemoving}
            className="px-3 text-center bg-[#f4efe6] hover:bg-stone-200 text-stone-600 disabled:opacity-50 text-xs font-semibold py-2.5 rounded-lg transition-colors border border-[#e8e2d7]"
            title="Remove from wishlist"
          >
            {isRemoving ? "..." : "✕"}
          </button>
        </div>
      </div>
    </div>
  );
}
