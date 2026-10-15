import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";

function Skeleton({ className }) {
  return <div className={`shimmer rounded-xl ${className}`} />;
}

const COLLECTIONS = [
  {
    label: "Apparel",
    sub: "Effortless silhouettes & organic textures",
    category: "Fashion",
    img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80&auto=format&fit=crop",
  },
  {
    label: "Living & Objects",
    sub: "Ceramics, warm textiles & timeless pieces",
    category: "Home & Living",
    img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80&auto=format&fit=crop",
  },
  {
    label: "Essential Tech",
    sub: "Precision engineered everyday audio & gear",
    category: "Electronics",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80&auto=format&fit=crop",
  },
  {
    label: "Botanical Beauty",
    sub: "Gentle formulations & clean rituals",
    category: "Beauty",
    img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80&auto=format&fit=crop",
  },
];

const ETHOS = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: "Conscious Craftsmanship",
    desc: "Carefully selected materials built to last seasons.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V11" />
      </svg>
    ),
    title: "Complimentary Delivery",
    desc: "Carbon-neutral express shipping on orders over ₹499.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: "7-Day Effortless Returns",
    desc: "Seamless exchanges and guaranteed full refunds.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Guaranteed Security",
    desc: "Bank-grade encrypted payments and buyer assurance.",
  },
];

export default function Home() {
  const [user, setUser] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [wishlistedIds, setWishlistedIds] = useState(new Set());
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  useEffect(() => {
    api.get("/customers/me")
      .then((res) => {
        setUser(res.data.customer);
        return api.get("/wishlist");
      })
      .then((res) => {
        if (res?.data?.wishlist) {
          setWishlistedIds(new Set(res.data.wishlist.filter(Boolean).map((p) => typeof p === "string" ? p : p._id)));
        }
      })
      .catch(() => {
      });

    api.get("/products")
      .then((res) => {
        if (res.data?.products) {
          setFeaturedProducts(res.data.products.slice(0, 8));
        }
      })
      .catch((err) => console.error("Error loading products:", err));
  }, []);

  const handleWishlistToggle = (productId, isWishlisted) => {
    setWishlistedIds((prev) => {
      const next = new Set(prev);
      if (isWishlisted) next.add(productId);
      else next.delete(productId);
      return next;
    });
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setNewsletterEmail("");
    }
  };

  const firstName = user?.fullName?.split(" ")[0] || "Guest";

  return (
    <div className="min-h-screen bg-[#fbf9f5] flex flex-col text-[#191716]">
      <Navbar user={user} />

      <section className="relative overflow-hidden bg-[#f4efe6] border-b border-[#e8e2d7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#e8e2d7] text-stone-600 text-xs font-semibold uppercase tracking-widest">
                <span>✦</span>
                <span>The Spring &amp; Summer Edit 2026</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#191716] leading-[1.12]">
                Elevated Living.<br />
                <span className="italic font-normal text-[#c25e36]">Timeless</span> Designs.
              </h1>

              <p className="font-sans text-stone-600 text-base sm:text-lg max-w-xl leading-relaxed">
                Welcome back{user ? `, ${firstName}` : ""}. Explore our curated selection of conscious apparel, handcrafted ceramics, and precision essentials designed for intentional living.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/products"
                  className="btn-primary px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2 shadow-sm"
                >
                  Shop New Arrivals
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>

                <a
                  href="#collections"
                  className="px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest border border-stone-300 hover:border-[#191716] text-[#191716] transition-colors"
                >
                  Explore Collections
                </a>
              </div>

              <div className="pt-6 grid grid-cols-3 gap-6 border-t border-[#e8e2d7]/80 max-w-md">
                <div>
                  <p className="font-serif text-xl sm:text-2xl font-bold text-[#191716]">100%</p>
                  <p className="text-[11px] text-stone-500 uppercase tracking-wider">Quality Verified</p>
                </div>
                <div>
                  <p className="font-serif text-xl sm:text-2xl font-bold text-[#191716]">₹499+</p>
                  <p className="text-[11px] text-stone-500 uppercase tracking-wider">Free Delivery</p>
                </div>
                <div>
                  <p className="font-serif text-xl sm:text-2xl font-bold text-[#191716]">4.9★</p>
                  <p className="text-[11px] text-stone-500 uppercase tracking-wider">Customer Rating</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md aspect-4/5 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&q=85&auto=format&fit=crop"
                  alt="Editorial Spring Collection"
                  className="w-full h-full object-cover object-top hover:scale-104 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="text-[10px] tracking-widest font-semibold uppercase bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-sm">
                    Featured Lookbook
                  </span>
                  <h3 className="font-serif text-xl font-bold mt-2">Organic Linen &amp; Daily Silhouettes</h3>
                  <p className="text-xs text-white/80 mt-0.5">Understated elegance for any occasion.</p>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-[#e8e2d7] shadow-xl max-w-[200px]">
                <p className="font-serif text-xs font-semibold text-[#191716]">Editorial Choice</p>
                <p className="text-[11px] text-stone-500 mt-0.5">Complimentary gift wrapping on all seasonal orders.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="bg-white border-b border-[#e8e2d7] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {ETHOS.map(({ icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#f4efe6] text-[#191716] flex items-center justify-center shrink-0">
                  {icon}
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#191716]">
                    {title}
                  </h4>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="collections" className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-[#e8e2d7]">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#c25e36]">
              Browse by Department
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#191716] mt-1">
              Curated Collections
            </h2>
          </div>
          <Link
            to="/products"
            className="mt-4 md:mt-0 text-xs font-bold uppercase tracking-widest text-[#191716] hover:text-[#c25e36] inline-flex items-center gap-1 transition-colors"
          >
            View Complete Catalog →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {COLLECTIONS.map(({ label, sub, category, img }) => (
            <Link
              key={label}
              to={`/products?category=${encodeURIComponent(category)}`}
              className="group relative rounded-xl overflow-hidden aspect-3/4 bg-[#f4efe6] block border border-[#e8e2d7] shadow-xs hover:shadow-lg transition-all"
            >
              <img
                src={img}
                alt={label}
                className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                <p className="font-serif text-xl font-bold leading-tight group-hover:translate-x-1 transition-transform">
                  {label}
                </p>
                <p className="text-xs text-stone-200 mt-1 leading-snug">
                  {sub}
                </p>
                <span className="inline-block mt-3 text-[10px] uppercase font-bold tracking-widest border-b border-white/60 pb-0.5">
                  Explore Collection
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white py-16 md:py-20 border-y border-[#e8e2d7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-[#e8e2d7]">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#c25e36]">
                Handpicked Selection
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#191716] mt-1">
                New Arrivals &amp; Favorites
              </h2>
            </div>
            <Link
              to="/products"
              className="mt-4 md:mt-0 text-xs font-bold uppercase tracking-widest text-[#191716] hover:text-[#c25e36] inline-flex items-center gap-1 transition-colors"
            >
              See All Items ({featuredProducts.length}+) →
            </Link>
          </div>

          {featuredProducts.length === 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-4/5 w-full !rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  wishlisted={wishlistedIds.has(product._id)}
                  onWishlistToggle={handleWishlistToggle}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden bg-[#191716] text-[#fbf9f5] min-h-[380px] flex items-center border border-[#e8e2d7]">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80&auto=format&fit=crop"
            alt="Atelier"
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
          <div className="relative z-10 p-8 sm:p-14 max-w-xl">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#c25e36]">
              Atelier Notes
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-2 mb-4 leading-tight">
              Designed with purpose.<br />Constructed for longevity.
            </h2>
            <p className="text-stone-300 text-sm leading-relaxed mb-8">
              We believe in fewer, better objects. Every product in the ShopKart catalog is evaluated for architectural beauty, premium materials, and tactile comfort.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="bg-white text-[#191716] hover:bg-[#f4efe6] px-7 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-colors"
              >
                Discover The Range
              </Link>
              <Link
                to="/orders"
                className="border border-white/40 hover:border-white text-white px-7 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-colors"
              >
                Track Previous Orders
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f4efe6] border-t border-[#e8e2d7] py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#c25e36]">
            The ShopKart Journal
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#191716] mt-2 mb-3">
            Join Our Private Circle
          </h2>
          <p className="text-stone-600 text-sm max-w-md mx-auto mb-6 leading-relaxed">
            Receive exclusive seasonal previews, archival releases, and enjoy 10% privilege on your opening order.
          </p>

          {newsletterSubscribed ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-semibold max-w-md mx-auto">
              ✓ Welcome to the ShopKart Journal. Check your inbox shortly.
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-full bg-white border border-[#e8e2d7] text-sm text-[#191716] placeholder-stone-400 input-focus-ring"
              />
              <button
                type="submit"
                className="btn-primary px-7 py-3 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      <footer className="bg-white border-t border-[#e8e2d7] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#e8e2d7]">
            <div className="space-y-3">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#191716]">
                ShopKart<span className="text-[#c25e36]">.</span>
              </span>
              <p className="text-xs text-stone-500 leading-relaxed max-w-xs">
                A modern boutique destination celebrating minimalist aesthetics, durable materials, and thoughtful craft.
              </p>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#191716] mb-3">
                Navigation
              </h5>
              <ul className="space-y-2 text-xs text-stone-600">
                <li><Link to="/home" className="hover:text-[#191716]">Home</Link></li>
                <li><Link to="/products" className="hover:text-[#191716]">Full Catalog</Link></li>
                <li><Link to="/wishlist" className="hover:text-[#191716]">Wishlist</Link></li>
                <li><Link to="/cart" className="hover:text-[#191716]">Shopping Bag</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#191716] mb-3">
                Client Care
              </h5>
              <ul className="space-y-2 text-xs text-stone-600">
                <li><Link to="/orders" className="hover:text-[#191716]">Order Tracking</Link></li>
                <li><Link to="/profile" className="hover:text-[#191716]">Account Overview</Link></li>
                <li><span className="text-stone-400">Complimentary Shipping Policy</span></li>
                <li><span className="text-stone-400">7-Day Effortless Returns</span></li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#191716] mb-3">
                Assurance
              </h5>
              <p className="text-xs text-stone-500 leading-relaxed mb-3">
                Protected by 256-bit SSL encryption. All major payment methods and cash on delivery supported.
              </p>
              <div className="flex gap-2 text-stone-400 text-xs font-semibold">
                <span>VISA</span> • <span>MASTERCARD</span> • <span>UPI</span> • <span>RAZORPAY</span>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-3">
            <p>&copy; {new Date().getFullYear()} ShopKart Inc. Crafted with Nordic simplicity.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-stone-700">Privacy Policy</a>
              <a href="#" className="hover:text-stone-700">Terms of Service</a>
              <a href="#" className="hover:text-stone-700">Sustainability</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
