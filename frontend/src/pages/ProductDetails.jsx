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
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("details");
  const { addToCart, cartItems } = useCart();

  const inCart = cartItems.some((item) => item.product?._id === id);

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

  useEffect(() => {
    let ignore = false;
    api.get(`/products/${id}`)
      .then((res) => {
        if (!ignore) {
          setProduct(res.data.product);
          setError("");
        }
      })
      .catch((err) => {
        if (!ignore) {
          if (err.response?.status === 404) {
            setError("Product not found");
          } else if (err.response?.status === 400) {
            setError("Invalid product ID");
          } else {
            setError(err.response?.data?.message || "Failed to load product");
          }
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [id]);

  const inStock = product?.stock > 0;
  const lowStock = product?.stock > 0 && product?.stock <= 5;

  const handleAddToCart = async () => {
    if (isAddingToCart || !inStock) return;
    setIsAddingToCart(true);
    try {
      await addToCart(id, true);
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
    <div className="min-h-screen bg-[#fbf9f5] flex flex-col text-[#191716]">
      <Navbar user={user} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <nav className="flex items-center gap-2 text-xs uppercase tracking-wider text-stone-500 mb-6">
          <Link to="/home" className="hover:text-[#191716]">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-[#191716]">Catalog</Link>
          <span>/</span>
          <span className="text-[#191716] font-semibold truncate max-w-[200px]">
            {product?.name || "Product"}
          </span>
        </nav>

        {loading && (
          <div className="bg-white rounded-2xl border border-[#e8e2d7] shadow-xs overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <Skeleton className="aspect-square !rounded-none min-h-[350px] md:min-h-[520px]" />
              <div className="p-8 sm:p-12 space-y-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-8 w-32 mt-6" />
                <Skeleton className="h-12 w-full mt-8" />
              </div>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="bg-white rounded-2xl border border-red-200 p-12 text-center max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 mx-auto flex items-center justify-center mb-4 text-2xl">
              ⚠️
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#191716] mb-2">{error}</h2>
            <p className="text-stone-500 text-sm mb-6">
              The item you are searching for might have retired or is currently unavailable.
            </p>
            <Link
              to="/products"
              className="btn-primary inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold px-7 py-3 rounded-full"
            >
              Browse Complete Catalog
            </Link>
          </div>
        )}

        {!loading && !error && product && (
          <div className="bg-white rounded-2xl border border-[#e8e2d7] shadow-xs overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">

              <div className="relative bg-[#f4efe6] overflow-hidden aspect-4/5 md:aspect-auto flex items-center justify-center border-b md:border-b-0 md:border-r border-[#e8e2d7]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center max-h-[620px]"
                />
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#191716] text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-sm shadow-xs border border-[#e8e2d7]">
                  {product.category}
                </span>
              </div>

              <div className="p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <span className="text-xs uppercase tracking-widest font-bold text-[#c25e36]">
                      Nordic Atelier Edition
                    </span>
                    {inStock ? (
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${lowStock ? "bg-amber-50 text-amber-800 border border-amber-200" : "bg-emerald-50 text-emerald-800 border border-emerald-200"}`}>
                        {lowStock ? `Only ${product.stock} items remaining` : `In Stock (${product.stock} units)`}
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-500">
                        Out of stock
                      </span>
                    )}
                  </div>

                  <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#191716] leading-tight mb-4">
                    {product.name}
                  </h1>

                  <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-[#e8e2d7]">
                    <span className="font-serif text-3xl font-bold text-[#191716]">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs text-stone-400">All local taxes included</span>
                  </div>

                  <p className="text-stone-600 text-sm leading-relaxed mb-6 font-sans">
                    {product.description}
                  </p>

                  {inStock && (
                    <div className="mb-6 flex items-center gap-4">
                      <span className="text-xs uppercase tracking-wider font-semibold text-stone-600">
                        Quantity:
                      </span>
                      <div className="flex items-center border border-[#e8e2d7] rounded-lg bg-[#fbf9f5] text-xs">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          disabled={quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center text-stone-600 hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed text-base font-bold"
                        >
                          −
                        </button>
                        <span className="w-10 text-center font-bold text-[#191716]">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                          disabled={quantity >= product.stock}
                          className="w-8 h-8 flex items-center justify-center text-stone-600 hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed text-base font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      id={`add-to-cart-detail-${id}`}
                      onClick={handleAddToCart}
                      disabled={!inStock || isAddingToCart}
                      className={`flex-1 py-3.5 px-6 rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm transition-all
                        ${!inStock
                          ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                          : inCart
                          ? "bg-[#191716] text-white hover:bg-stone-800"
                          : "btn-primary"
                        }
                        ${isAddingToCart ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                      {isAddingToCart ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                          </svg>
                          Adding to Bag...
                        </>
                      ) : inCart ? (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          In Bag • Add Another
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          {inStock ? "Add to Shopping Bag" : "Currently Out of Stock"}
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleWishlistToggle}
                      disabled={wishlistSaving}
                      className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-xs uppercase tracking-wider border transition-colors
                        ${wishlisted
                          ? "bg-[#191716] text-white border-[#191716]"
                          : "bg-white text-stone-700 border-[#e8e2d7] hover:border-stone-400"
                        }
                        ${wishlistSaving ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                      {wishlisted ? "♥ In Wishlist" : "♡ Save to Wishlist"}
                    </button>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[#e8e2d7]">
                  <div className="flex gap-4 border-b border-[#e8e2d7] text-xs font-bold uppercase tracking-wider pb-2">
                    <button
                      onClick={() => setActiveTab("details")}
                      className={`pb-1 transition-colors ${activeTab === "details" ? "text-[#191716] border-b-2 border-[#191716]" : "text-stone-400 hover:text-stone-700"}`}
                    >
                      Details &amp; Materials
                    </button>
                    <button
                      onClick={() => setActiveTab("shipping")}
                      className={`pb-1 transition-colors ${activeTab === "shipping" ? "text-[#191716] border-b-2 border-[#191716]" : "text-stone-400 hover:text-stone-700"}`}
                    >
                      Shipping &amp; Care
                    </button>
                  </div>

                  <div className="pt-3 text-xs text-stone-600 leading-relaxed font-sans">
                    {activeTab === "details" ? (
                      <ul className="space-y-1.5 list-disc list-inside">
                        <li>Consciously curated with rigorous standards of durability.</li>
                        <li>Certified non-toxic, sustainable and ethically manufactured.</li>
                        <li>Archival item SKU: #{id.slice(-6).toUpperCase()}</li>
                      </ul>
                    ) : (
                      <div className="space-y-1.5">
                        <p>📦 <strong>Complimentary Express Delivery</strong> on orders over ₹499.</p>
                        <p>🔄 <strong>7-Day Effortless Returns:</strong> Keep original packaging for door-to-door pickup.</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-[#e8e2d7] py-6 text-center text-xs text-stone-400">
        <p>&copy; {new Date().getFullYear()} ShopKart. Nordic Minimalist Storefront.</p>
      </footer>
    </div>
  );
}
