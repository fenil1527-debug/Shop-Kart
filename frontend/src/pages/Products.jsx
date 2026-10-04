import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";

function Skeleton({ className }) {
  return <div className={`shimmer rounded-xl ${className}`} />;
}

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
      <Skeleton className="aspect-square !rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex justify-between pt-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}

export default function Products() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [wishlistedIds, setWishlistedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const { fetchCart } = useCart();

  // Initialize category from URL query param if present
  const [category, setCategory] = useState(() => searchParams.get("category") || "");

  // Optional auth check to display user chip in Navbar (non-blocking)
  useEffect(() => {
    api.get("/customers/me")
      .then((res) => {
        setUser(res.data.customer);
        fetchCart();
        return api.get("/wishlist");
      })
      .then((res) => {
        if (res?.data?.wishlist) {
          setWishlistedIds(new Set(res.data.wishlist.map((p) => typeof p === "string" ? p : p._id)));
        }
      })
      .catch(() => {
        setUser(null);
        setWishlistedIds(new Set());
      });
  }, []);

  const handleWishlistToggle = (productId, isWishlisted) => {
    setWishlistedIds((prev) => {
      const next = new Set(prev);
      if (typeof isWishlisted === "boolean") {
        if (isWishlisted) next.add(productId);
        else next.delete(productId);
      } else {
        if (next.has(productId)) next.delete(productId);
        else next.add(productId);
      }
      return next;
    });
  };

  useEffect(() => {
    const handleSync = () => {
      api.get("/wishlist")
        .then((res) => {
          if (res?.data?.wishlist) {
            setWishlistedIds(new Set(res.data.wishlist.filter(Boolean).map((p) => typeof p === "string" ? p : p._id)));
          }
        })
        .catch(() => {});
    };
    window.addEventListener("wishlistUpdated", handleSync);
    return () => window.removeEventListener("wishlistUpdated", handleSync);
  }, []);

  // Fetch products whenever filters change
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      if (sort) params.set("sort", sort);

      const queryString = params.toString();
      const url = `/products${queryString ? `?${queryString}` : ""}`;

      const res = await api.get(url);
      setProducts(res.data.products || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [search, category, sort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    const newParams = new URLSearchParams();
    if (newCat) newParams.set("category", newCat);
    setSearchParams(newParams, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <Navbar user={user} />

      {/* Page Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Our Products
          </h1>
          <p className="text-amber-100 text-sm sm:text-base mt-2 max-w-xl">
            Browse our curated collection — search, filter, and find what you love.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 pb-16 space-y-6">
        {/* Search & Filter Bar */}
        <SearchBar
          onSearch={(q) => setSearch(q)}
          onCategoryChange={handleCategoryChange}
          onSortChange={(s) => setSort(s)}
        />

        {/* Results count */}
        {!loading && !error && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-stone-500">
              {products.length === 0
                ? "No products found"
                : `Showing ${products.length} product${products.length !== 1 ? "s" : ""}`}
            </span>
            {(search || category || sort) && (
              <button
                onClick={() => {
                  setSearch("");
                  handleCategoryChange("");
                  setSort("");
                }}
                className="text-xs text-amber-600 hover:text-amber-700 font-semibold underline underline-offset-2"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* ── Loading State ── */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {[...Array(8)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        )}

        {/* ── Error State ── */}
        {!loading && error && (
          <div className="bg-white rounded-2xl border border-red-200 p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-50 mx-auto flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-1">Something went wrong</h3>
            <p className="text-stone-500 text-sm mb-5">{error}</p>
            <button
              onClick={fetchProducts}
              className="btn-primary text-white text-sm font-semibold px-6 py-2.5 rounded-xl"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ── Empty State ── */}
        {!loading && !error && products.length === 0 && (
          <div className="bg-white rounded-2xl border border-stone-200/80 p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 mx-auto flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V11" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-1">No products found</h3>
            <p className="text-stone-500 text-sm">
              {search || category
                ? "Try changing your search or filter criteria."
                : "Products will appear here once they are added."}
            </p>
          </div>
        )}

        {/* ── Product Grid ── */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {products.map((product) => (
              <ProductCard 
                key={product._id} 
                product={product} 
                wishlisted={wishlistedIds.has(product._id)}
                onWishlistToggle={handleWishlistToggle}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
