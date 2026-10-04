import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

function Skeleton({ className }) {
  return <div className={`shimmer rounded-xl ${className}`} />;
}

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistSaving, setWishlistSaving] = useState(false);
  const { addToCart, cartItems } = useCart();

  const inCart = cartItems.some((item) => item.product?._id === id);

  // Optional auth check for Navbar (non-blocking) and Wishlist fetch
  useEffect(() => {
    api.get("/customers/me")
      .then((res) => {
        setUser(res.data.customer);
        return api.get("/wishlist");
      })
      .then((res) => {
        if (res?.data?.wishlist) {
          const isWishlisted = res.data.wishlist.some(p => {
             const pid = typeof p === "string" ? p : p._id;
             return pid === id;
          });
          setWishlisted(isWishlisted);
        }
      })
      .catch(() => setUser(null));
  }, [id]);

  // Fetch product immediately on mount or when id changes
  useEffect(() => {
    setLoading(true);
    setError("");
    api.get(`/products/${id}`)
      .then((res) => setProduct(res.data.product))
      .catch((err) => {
        if (err.response?.status === 404) {
          setError("Product not found");
        } else if (err.response?.status === 400) {
          setError("Invalid product ID");
        } else {
          setError(err.response?.data?.message || "Failed to load product");
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const inStock = product?.stock > 0;
  const lowStock = product?.stock > 0 && product?.stock <= 5;

  const handleAddToCart = async () => {
    if (isAddingToCart || !inStock) return;
    setIsAddingToCart(true);
    try {
      await addToCart(id);
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

  const handleWishlistToggle = async () => {
    if (wishlistSaving) return;
    setWishlistSaving(true);
    try {
      if (wishlisted) {
        await api.delete(`/wishlist/${id}`);
        setWishlisted(false);
      } else {
        await api.post(`/wishlist/${id}`);
        setWishlisted(true);
      }
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      } else if (err.response?.status === 409) {
        setWishlisted(true);
      } else {
        console.error("Wishlist error:", err);
      }
    } finally {
      setWishlistSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <Navbar user={user} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back link */}
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 hover:text-amber-800 mb-6 group"
        >
          <svg
            className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </Link>

        {/* ── Loading State ── */}
        {loading && (
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <Skeleton className="aspect-square !rounded-none min-h-[300px] md:min-h-[450px]" />
              <div className="p-8 space-y-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-10 w-32 mt-4" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-12 w-full mt-6" />
              </div>
            </div>
          </div>
        )}

        {/* ── Error State ── */}
        {!loading && error && (
          <div className="bg-white rounded-3xl border border-red-200 p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-50 mx-auto flex items-center justify-center mb-5">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-2">{error}</h3>
            <p className="text-stone-500 text-sm mb-6">The product you're looking for might have been removed or doesn't exist.</p>
            <Link
              to="/products"
              className="btn-primary inline-flex items-center gap-2 text-white text-sm font-semibold px-6 py-3 rounded-xl"
            >
              Browse Products
            </Link>
          </div>
        )}

        {/* ── Product Detail ── */}
        {!loading && !error && product && (
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden animate-fade-in">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image */}
              <div className="relative bg-stone-100 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center min-h-[300px] md:min-h-[500px]"
                />
              </div>

              {/* Info */}
              <div className="p-6 sm:p-8 lg:p-10 flex flex-col">
                {/* Category */}
                <span className="inline-block self-start bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold px-3 py-1 rounded-lg mb-3">
                  {product.category}
                </span>

                {/* Name */}
                <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 leading-tight mb-3">
                  {product.name}
                </h1>

                {/* Description */}
                <p className="text-stone-500 text-sm leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Price */}
                <div className="mb-4">
                  <span className="text-3xl font-bold text-stone-900">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-stone-400 ml-2">Inclusive of all taxes</span>
                </div>

                {/* Stock status */}
                <div className="flex items-center gap-2 mb-6">
                  {inStock ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span
                        className={`text-sm font-medium ${
                          lowStock ? "text-amber-700" : "text-emerald-700"
                        }`}
                      >
                        {lowStock
                          ? `Hurry! Only ${product.stock} left in stock`
                          : `${product.stock} units available`}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-sm font-medium text-red-600">Out of stock</span>
                    </>
                  )}
                </div>

                {/* Divider */}
                <div className="h-px bg-stone-100 mb-6" />

                {/* Actions */}
                <div className="mt-auto space-y-3">
                  <div className="flex items-center gap-3">
                    <button
                      id={`add-to-cart-detail-${id}`}
                      onClick={handleAddToCart}
                      disabled={!inStock || isAddingToCart}
                      className={`flex-1 py-3.5 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-all duration-200 ${
                        !inStock
                          ? "bg-stone-300 cursor-not-allowed"
                          : inCart
                          ? "bg-amber-600 hover:bg-amber-700"
                          : "btn-primary"
                      } ${isAddingToCart ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                    {isAddingToCart ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        Adding...
                      </>
                    ) : inCart ? (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Add Another
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                        </svg>
                        {inStock ? "Add to Cart" : "Out of Stock"}
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleWishlistToggle}
                    disabled={wishlistSaving}
                    className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm border shadow-sm transition-all duration-200 ${
                      wishlisted
                        ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                        : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                    } ${wishlistSaving ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {wishlistSaving ? (
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : wishlisted ? (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        In Wishlist
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Add to Wishlist
                      </>
                    )}
                  </button>
                </div>

                <p className="text-center text-xs text-stone-400 mt-3">
                  🚚 Free delivery on orders above ₹499
                </p>
              </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
