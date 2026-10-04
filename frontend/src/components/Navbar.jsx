import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";

export default function Navbar({ user }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [wishlistCount, setWishlistCount] = useState(0);
  const { cartCount, clearCart } = useCart();

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await api.get("/wishlist");
        if (res.data?.wishlist) {
          setWishlistCount(res.data.wishlist.filter(Boolean).length);
        }
      } catch (_) {
        setWishlistCount(0);
      }
    };

    if (user) {
      fetchCount();
    } else {
      setWishlistCount(0);
    }

    const onUpdate = () => {
      if (user) fetchCount();
    };

    window.addEventListener("wishlistUpdated", onUpdate);
    return () => window.removeEventListener("wishlistUpdated", onUpdate);
  }, [user]);

  const handleLogout = async () => {
    try { await api.post("/customers/logout"); } catch (_) {}
    clearCart();
    navigate("/login");
  };

  const initials = user?.fullName
    ? user.fullName
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .filter(Boolean)
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"
    : "?";

  const navLinks = [
    {
      to: "/home",
      label: "Home",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      to: "/products",
      label: "Products",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    {
      to: "/wishlist",
      label: wishlistCount > 0 ? `Wishlist (${wishlistCount})` : "Wishlist",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      to: "/cart",
      label: cartCount > 0 ? `Cart (${cartCount})` : "Cart",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9m-9-4h4" />
        </svg>
      ),
    },
    {
      to: "/profile",
      label: "Profile",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#faf9f7]/90 backdrop-blur-xl border-b border-amber-100/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2.5 group shrink-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200"
              style={{ background: "linear-gradient(135deg, #d97706, #ea580c)" }}
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gradient">ShopKart</span>
          </Link>

          {/* Nav links */}
          <nav className="hidden sm:flex items-center gap-1">
            {navLinks.map(({ to, label, icon }) => {
              const active = (to === "/products" || to === "/wishlist" || to === "/cart")
                ? pathname.startsWith(to)
                : pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                    ${active
                      ? "text-amber-700 bg-amber-50 border border-amber-200"
                      : "text-stone-500 hover:text-stone-800 hover:bg-stone-100"
                    }`}
                >
                  {icon}
                  {label}
                  {to === "/cart" && cartCount > 0 && (
                    <span className="ml-0.5 bg-amber-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center leading-none">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: avatar chip + logout */}
          <div className="flex items-center gap-3">
            {user && (
              <Link
                to="/profile"
                className="hidden md:flex items-center gap-2.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5 hover:bg-amber-100 hover:border-amber-300 transition-all duration-200"
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
                  style={{ background: "linear-gradient(135deg, #d97706, #ea580c)" }}
                >
                  {initials}
                </div>
                <span className="text-sm font-medium text-amber-900 max-w-[120px] truncate">
                  {user.fullName}
                </span>
              </Link>
            )}

            {/* Mobile icon nav */}
            <div className="flex sm:hidden items-center gap-1">
              {navLinks.map(({ to, icon }) => {
                const active = (to === "/products" || to === "/wishlist" || to === "/cart")
                  ? pathname.startsWith(to)
                  : pathname === to;
                return (
                  <Link key={to} to={to}
                    className={`p-2 rounded-xl transition-all duration-200 relative
                      ${active ? "text-amber-700 bg-amber-50" : "text-stone-400 hover:text-stone-700 hover:bg-stone-100"}`}
                  >
                    {icon}
                    {to === "/cart" && cartCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-amber-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                        {cartCount > 9 ? "9+" : cartCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-600 border border-red-100 bg-red-50 hover:bg-red-100 hover:border-red-200 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="btn-primary flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-sm"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
