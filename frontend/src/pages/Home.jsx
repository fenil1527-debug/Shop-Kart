import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

/* ─── Skeleton ─── */
function Skeleton({ className }) {
  return <div className={`shimmer rounded-xl ${className}`} />;
}

/* ─── Category cards with real Unsplash images ─── */
const CATEGORIES = [
  {
    label: "Fashion",
    sub: "Clothing & Accessories",
    img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80&auto=format&fit=crop",
    color: "from-rose-600/70 to-rose-900/60",
  },
  {
    label: "Electronics",
    sub: "Gadgets & Devices",
    img: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&q=80&auto=format&fit=crop",
    color: "from-slate-700/70 to-slate-900/70",
  },
  {
    label: "Home & Living",
    sub: "Furniture & Décor",
    img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80&auto=format&fit=crop",
    color: "from-amber-700/60 to-amber-900/60",
  },
  {
    label: "Beauty",
    sub: "Skincare & Wellness",
    img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80&auto=format&fit=crop",
    color: "from-pink-600/60 to-pink-900/60",
  },
];

/* ─── Offer banners ─── */
const BANNERS = [
  {
    label: "New Arrivals",
    desc: "Fresh styles just dropped. Be the first to shop.",
    img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=900&q=80&auto=format&fit=crop",
    badge: "NEW",
    badgeColor: "bg-amber-500",
    cta: "Shop Now",
  },
  {
    label: "Weekend Sale",
    desc: "Up to 50% off on selected items this weekend only.",
    img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=80&auto=format&fit=crop",
    badge: "SALE",
    badgeColor: "bg-red-500",
    cta: "Grab Deals",
  },
];

/* ─── Feature pills ─── */
const FEATURES = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V11" />
      </svg>
    ),
    title: "Free Delivery",
    sub: "On orders above ₹499",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 2 2 2-2 2 2 2-2 4 2z" />
      </svg>
    ),
    title: "Easy Returns",
    sub: "7-day hassle-free return",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Secure Payments",
    sub: "100% safe & encrypted",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: "24/7 Support",
    sub: "We're always here for you",
  },
];

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/customers/me")
      .then((res) => setUser(res.data.customer))
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, [navigate]);

  const firstName = user?.fullName?.split(" ")[0] || "there";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <Navbar user={user} />

      {/* ══════════════════════════════════════
          HERO — full-width image background
      ══════════════════════════════════════ */}
      <section className="relative h-[520px] sm:h-[600px] overflow-hidden">
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=85&auto=format&fit=crop"
          alt="ShopKart store"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Warm gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 via-stone-900/50 to-transparent" />

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-xl animate-fade-in">
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-5 w-40 bg-white/20" />
                <Skeleton className="h-12 w-80 bg-white/20" />
                <Skeleton className="h-5 w-64 bg-white/20" />
              </div>
            ) : (
              <>
                <span className="inline-block text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">
                  {greeting}, {firstName} 👋
                </span>
                <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
                  Discover What <br />
                  <span className="text-amber-400">You Love</span>
                </h1>
                <p className="text-white/70 text-lg mb-8 leading-relaxed">
                  Curated collections, unbeatable prices, and a shopping
                  experience made just for you.
                </p>
              </>
            )}
            <div className="flex flex-wrap gap-3">
              <Link
                to="/products"
                className="btn-primary px-6 py-3 rounded-xl text-white font-semibold text-sm shadow-lg inline-flex items-center"
              >
                Shop Collections →
              </Link>
              <Link
                to="/profile"
                className="px-6 py-3 rounded-xl text-white font-semibold text-sm border border-white/30 hover:bg-white/10 transition-colors duration-200"
              >
                My Account
              </Link>
            </div>
          </div>
        </div>

        {/* Subtle bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#faf9f7] to-transparent" />
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-14 -mt-2">

        {/* ══════════════════════════════════════
            FEATURE STRIP
        ══════════════════════════════════════ */}
        <section>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map(({ icon, title, sub }) => (
              <div
                key={title}
                className="bg-white rounded-2xl px-4 py-5 flex items-start gap-3 border border-stone-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                  {icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-800">{title}</p>
                  <p className="text-xs text-stone-400 mt-0.5 leading-snug">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════
            SHOP BY CATEGORY
        ══════════════════════════════════════ */}
        <section>
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-stone-900">Shop by Category</h2>
              <p className="text-stone-400 text-sm mt-1">Find exactly what you're looking for</p>
            </div>
            <Link to="/products" className="text-amber-600 text-sm font-semibold hover:text-amber-700 flex items-center gap-1">
              View all
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.map(({ label, sub, img, color }) => (
              <Link
                key={label}
                to={`/products?category=${encodeURIComponent(label)}`}
                className="card-hover relative group rounded-2xl overflow-hidden aspect-[3/4] text-left block"
              >
                {/* Photo */}
                <img
                  src={img}
                  alt={label}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${color}`} />
                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                  <p className="text-white font-bold text-base leading-tight">{label}</p>
                  <p className="text-white/70 text-xs mt-0.5">{sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════
            OFFER BANNERS (2-col)
        ══════════════════════════════════════ */}
        <section>
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-stone-900">Today's Highlights</h2>
              <p className="text-stone-400 text-sm mt-1">Don't miss these handpicked deals</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {BANNERS.map(({ label, desc, img, badge, badgeColor, cta }) => (
              <div
                key={label}
                className="card-hover relative group rounded-2xl overflow-hidden h-56 sm:h-64 cursor-pointer"
              >
                <img
                  src={img}
                  alt={label}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-stone-900/75 to-stone-900/20" />
                <div className="absolute inset-0 flex flex-col justify-center p-7 z-10">
                  <span className={`inline-block self-start text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md mb-3 ${badgeColor}`}>
                    {badge}
                  </span>
                  <h3 className="text-white text-2xl font-bold leading-tight mb-2">{label}</h3>
                  <p className="text-white/70 text-sm mb-5 leading-relaxed max-w-xs">{desc}</p>
                  <Link to="/products" className="self-start btn-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg">
                    {cta} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════
            LIFESTYLE FULL-WIDTH BANNER
        ══════════════════════════════════════ */}
        <section className="relative rounded-3xl overflow-hidden h-72">
          <img
            src="https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1400&q=85&auto=format&fit=crop"
            alt="Lifestyle"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/80 via-amber-800/50 to-transparent" />
          <div className="relative z-10 h-full flex items-center px-10">
            <div className="max-w-md">
              <p className="text-amber-300 text-sm font-semibold uppercase tracking-widest mb-2">
                Exclusive Members Offer
              </p>
              <h2 className="text-3xl font-bold text-white mb-3 leading-snug">
                Style that fits your <span className="text-amber-300">life</span>
              </h2>
              <p className="text-white/65 mb-6">
                Premium quality products curated for the modern adult lifestyle.
              </p>
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 bg-white text-amber-800 font-bold text-sm px-6 py-3 rounded-xl hover:bg-amber-50 transition-colors duration-200 shadow-lg"
              >
                View My Account
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            QUICK ACTIONS — minimal & clean
        ══════════════════════════════════════ */}
        <section>
          <h2 className="text-2xl font-bold text-stone-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                to: "/profile",
                icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
                label: "My Profile",
                sub: "View account details",
                bg: "bg-amber-50 border-amber-100",
                iconBg: "bg-amber-100 text-amber-700",
              },
              {
                icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
                label: "My Orders",
                sub: "Track deliveries",
                bg: "bg-blue-50 border-blue-100",
                iconBg: "bg-blue-100 text-blue-700",
              },
              {
                to: "/wishlist",
                icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
                label: "Wishlist",
                sub: "Saved for later",
                bg: "bg-rose-50 border-rose-100",
                iconBg: "bg-rose-100 text-rose-600",
              },
            ].map(({ to, icon, label, sub, bg, iconBg }) => (
              <Link
                key={label}
                to={to || "#"}
                className={`card-hover group flex items-center gap-4 p-5 rounded-2xl border ${bg} shadow-sm hover:shadow-md transition-all duration-200`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg} group-hover:scale-110 transition-transform duration-200`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-stone-800 text-sm">{label}</p>
                  <p className="text-stone-400 text-xs mt-0.5">{sub}</p>
                </div>
                <svg className="w-4 h-4 text-stone-300 ml-auto group-hover:text-amber-500 group-hover:translate-x-1 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#d97706,#ea580c)" }}>
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-gradient">ShopKart</span>
          </div>
          <p className="text-xs text-stone-400">
            &copy; {new Date().getFullYear()} ShopKart. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-stone-400">
            <a href="#" className="hover:text-amber-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-amber-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-amber-600 transition-colors">Help</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
