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
      } catch (error) {
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
    <div className="min-h-screen bg-[#faf9f7]">
      <Navbar user={user} />
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-500 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 animate-fade-in">
            My Wishlist
          </h1>
          <p className="text-rose-100 text-lg max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '100ms' }}>
            {wishlist.length > 0 ? `${wishlist.length} product${wishlist.length !== 1 ? "s" : ""} saved` : "Save products you love"}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div>
            <p className="text-stone-500 mb-6 font-medium">Loading your wishlist...</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden flex flex-col h-[350px]">
                  <div className="shimmer aspect-square bg-stone-100" />
                  <div className="p-4 flex flex-col flex-1 gap-3">
                    <div className="shimmer h-4 w-3/4 rounded-md bg-stone-100" />
                    <div className="shimmer h-3 w-full rounded-md bg-stone-100" />
                    <div className="shimmer h-3 w-5/6 rounded-md bg-stone-100" />
                    <div className="mt-auto flex justify-between items-end">
                      <div className="shimmer h-6 w-1/3 rounded-md bg-stone-100" />
                      <div className="shimmer h-4 w-1/4 rounded-full bg-stone-100" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto text-center bg-white p-8 rounded-2xl border border-stone-200/80 shadow-sm mt-8">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-stone-900 mb-2">Something went wrong</h2>
            <p className="text-stone-500 mb-6">We couldn't load your wishlist.</p>
            <button
              onClick={fetchWishlist}
              className="btn-primary text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all"
            >
              Try Again
            </button>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="max-w-md mx-auto text-center bg-white p-8 rounded-2xl border border-stone-200/80 shadow-sm mt-8 animate-fade-in">
            <div className="text-4xl mb-4">❤️</div>
            <h2 className="text-xl font-bold text-stone-900 mb-2">Your wishlist is empty</h2>
            <p className="text-stone-500 mb-6">Save products you love and find them here later.</p>
            <Link
              to="/products"
              className="inline-block btn-primary text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 animate-fade-in">
            {wishlist.filter(Boolean).map((product) => (
              <WishlistCard
                key={product._id}
                product={product}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
