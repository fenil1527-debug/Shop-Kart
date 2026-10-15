import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import WishlistCard from "../components/WishlistCard";

export default function Wishlist() {
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await api.get("/wishlist");
      setWishlist(response.data.wishlist || []);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/customers/me");
        setUser(response.data.customer);
        fetchWishlist();
      } catch {
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleRemove = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`);
      setWishlist((prev) => prev.filter((item) => item && item._id !== productId));
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (err) {
      console.error("Error removing from wishlist", err);
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] flex flex-col text-[#191716]">
      <Navbar user={user} />

      <div className="bg-[#f4efe6] border-b border-[#e8e2d7] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs uppercase tracking-widest font-bold text-[#c25e36]">
            Personal Archive
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#191716] mt-2">
            Your Wishlist
          </h1>
          <p className="text-stone-600 text-sm sm:text-base mt-2 font-sans">
            {wishlist.length > 0
              ? `${wishlist.length} curated piece${wishlist.length !== 1 ? "s" : ""} saved for later`
              : "Save your favorite silhouettes and objects here"}
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        {loading ? (
          <div>
            <p className="text-stone-500 mb-6 font-medium text-xs uppercase tracking-widest">
              Consulting saved items...
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-[#e8e2d7] shadow-xs overflow-hidden flex flex-col h-[350px]">
                  <div className="shimmer aspect-4/5 bg-stone-100" />
                  <div className="p-4 flex flex-col flex-1 gap-2.5">
                    <div className="shimmer h-4 w-3/4 rounded-md" />
                    <div className="shimmer h-3 w-full rounded-md" />
                    <div className="mt-auto flex justify-between items-end">
                      <div className="shimmer h-5 w-1/3 rounded-md" />
                      <div className="shimmer h-4 w-1/4 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto text-center bg-white p-8 rounded-2xl border border-red-200 shadow-xs mt-8">
            <div className="text-3xl mb-3">⚠️</div>
            <h2 className="font-serif text-xl font-bold text-[#191716] mb-2">Notice</h2>
            <p className="text-stone-500 text-xs mb-6">We could not load your saved wishlist right now.</p>
            <button
              onClick={fetchWishlist}
              className="btn-primary text-white text-xs uppercase tracking-widest font-bold px-6 py-3 rounded-full"
            >
              Retry
            </button>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="max-w-md mx-auto text-center bg-white p-12 rounded-2xl border border-[#e8e2d7] shadow-xs mt-8 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-[#f4efe6] text-stone-400 mx-auto flex items-center justify-center text-2xl mb-4">
              ♡
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#191716] mb-2">Your Wishlist is Empty</h2>
            <p className="text-stone-500 text-xs leading-relaxed mb-6">
              Click the heart on any product in our collection to save it to your private list.
            </p>
            <Link
              to="/products"
              className="btn-primary inline-block text-white text-xs uppercase tracking-widest font-bold px-8 py-3.5 rounded-full"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 animate-fade-in">
            {wishlist.filter(Boolean).map((product) => (
              <WishlistCard
                key={product._id}
                product={product}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-[#e8e2d7] py-6 text-center text-xs text-stone-400 mt-auto">
        <p>&copy; {new Date().getFullYear()} ShopKart. Nordic Minimalist Storefront.</p>
      </footer>
    </div>
  );
}
