import { useCallback, useEffect, useState } from "react";
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
    <div className="bg-white rounded-xl border border-[#e8e2d7] shadow-xs overflow-hidden">
      <Skeleton className="aspect-4/5 !rounded-none" />
      <div className="p-4 space-y-2.5">
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

  const [category, setCategory] = useState(() => searchParams.get("category") || "");

  useEffect(() => {
    api.get("/customers/me")
      .then((res) => {
        setUser(res.data.customer);
        fetchCart();
        return api.get("/wishlist");
      })
      .then((res) => {
        if (res?.data?.wishlist) {
          setWishlistedIds(new Set(res.data.wishlist.filter(Boolean).map((p) => typeof p === "string" ? p : p._id)));
        }
      })
      .catch(() => {
        setUser(null);
        setWishlistedIds(new Set());
      });
  }, [fetchCart]);

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
    let ignore = false;
    const run = async () => {
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (category) params.set("category", category);
        if (sort) params.set("sort", sort);

        const queryString = params.toString();
        const url = `/products${queryString ? `?${queryString}` : ""}`;

        const res = await api.get(url);
        if (!ignore) {
          setProducts(res.data.products || []);
          setError("");
        }
      } catch (err) {
        if (!ignore) {
          setError(err.response?.data?.message || "Failed to load products. Please try again.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    run();
    return () => {
      ignore = true;
    };
  }, [search, category, sort]);

  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    const newParams = new URLSearchParams();
    if (newCat) newParams.set("category", newCat);
    setSearchParams(newParams, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] flex flex-col text-[#191716]">
      <Navbar user={user} />

      <div className="bg-[#f4efe6] border-b border-[#e8e2d7] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-widest font-bold text-[#c25e36]">
              {category ? `Category / ${category}` : "Curated Storefront"}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#191716] mt-2">
              {category || "The Complete Catalog"}
            </h1>
            <p className="text-stone-600 text-sm sm:text-base mt-2.5 leading-relaxed font-sans">
              Discover enduring essentials crafted with fine details and enduring materials.
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 flex-1 w-full">
        <SearchBar
          activeCategory={category}
          onSearch={(q) => setSearch(q)}
          onCategoryChange={handleCategoryChange}
          onSortChange={(s) => setSort(s)}
        />

        {!loading && !error && (
          <div className="flex items-center justify-between text-xs text-stone-500 pb-2 border-b border-[#e8e2d7]">
            <span>
              {products.length === 0
                ? "No items match your criteria"
                : `Displaying ${products.length} curated item${products.length !== 1 ? "s" : ""}`}
            </span>
            {(search || category || sort) && (
              <button
                onClick={() => {
                  setSearch("");
                  handleCategoryChange("");
                  setSort("");
                }}
                className="text-[#c25e36] hover:text-[#191716] font-semibold uppercase tracking-wider text-[11px]"
              >
                Reset All Filters ✕
              </button>
            )}
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="bg-white rounded-2xl border border-red-200 p-10 text-center max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 mx-auto flex items-center justify-center mb-4 text-xl">
              ⚠️
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">Catalog Notice</h3>
            <p className="text-stone-500 text-xs mb-5">{error}</p>
            <button
              onClick={fetchProducts}
              className="btn-primary text-white text-xs uppercase tracking-wider font-semibold px-6 py-2.5 rounded-full"
            >
              Retry Connection
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="bg-white rounded-2xl border border-[#e8e2d7] p-12 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#f4efe6] text-stone-400 mx-auto flex items-center justify-center mb-4 text-2xl">
              🔍
            </div>
            <h3 className="font-serif text-lg font-bold text-[#191716] mb-1">No Matching Items</h3>
            <p className="text-stone-500 text-xs leading-relaxed mb-6">
              We couldn't find items matching your search or category selection.
            </p>
            <button
              onClick={() => {
                setSearch("");
                handleCategoryChange("");
                setSort("");
              }}
              className="btn-primary text-xs uppercase tracking-widest font-bold px-6 py-3 rounded-full"
            >
              View All Products
            </button>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
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

      <footer className="bg-white border-t border-[#e8e2d7] mt-16 py-8 text-center text-xs text-stone-400">
        <p>&copy; {new Date().getFullYear()} ShopKart. Nordic Minimalist Storefront.</p>
      </footer>
    </div>
  );
}
