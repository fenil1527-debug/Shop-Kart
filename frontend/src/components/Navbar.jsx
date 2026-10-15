import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";

export default function Navbar({ user }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [wishlistCount, setWishlistCount] = useState(0);
  const { cartCount, clearCart, openDrawer } = useCart();

  useEffect(() => {
    let isMounted = true;
    const fetchCount = async () => {
      if (!user) {
        if (isMounted) setWishlistCount(0);
        return;
      }
      try {
        const res = await api.get("/wishlist");
        if (isMounted && res.data?.wishlist) {
          setWishlistCount(res.data.wishlist.filter(Boolean).length);
        }
      } catch (err) {
        if (isMounted) setWishlistCount(0);
        console.warn("Wishlist count unavailable:", err.message);
      }
    };

    fetchCount();

    const onUpdate = () => {
      fetchCount();
    };

    window.addEventListener("wishlistUpdated", onUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener("wishlistUpdated", onUpdate);
    };
  }, [user]);

  const handleLogout = async () => {
    try {
      await api.post("/customers/logout");
    } catch (err) {
      console.warn("Logout error:", err.message);
    }
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
    { to: "/home", label: "Home" },
    { to: "/products", label: "Catalog" },
    { to: "/wishlist", label: wishlistCount > 0 ? `Wishlist (${wishlistCount})` : "Wishlist" },
    { to: "/orders", label: "Orders" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="bg-[#191716] text-[#e8e2d7] text-[11px] font-sans tracking-widest uppercase py-1.5 px-4 text-center">
        Complimentary Express Shipping on Orders Over ₹499 &nbsp;•&nbsp; Curated Nordic Design &amp; Living
      </div>

      <div className="bg-[#fbf9f5]/90 backdrop-blur-md border-b border-[#e8e2d7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">

            <div className="flex items-center gap-8">
              <Link to="/home" className="flex items-center gap-2 group">
                <span className="font-serif text-2xl md:text-3xl font-extrabold tracking-tight text-[#191716] group-hover:text-[#c25e36] transition-colors">
                  ShopKart<span className="text-[#c25e36]">.</span>
                </span>
              </Link>

              <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
                {navLinks.map(({ to, label }) => {
                  const active = (to === "/products" || to === "/wishlist" || to === "/orders")
                    ? pathname.startsWith(to)
                    : pathname === to;
                  return (
                    <Link
                      key={to}
                      to={to}
                      className={`px-3.5 py-1.5 text-xs uppercase tracking-widest font-semibold transition-all relative
                        ${active
                          ? "text-[#191716] after:content-[''] after:absolute after:bottom-0 after:left-3.5 after:right-3.5 after:h-0.5 after:bg-[#191716]"
                          : "text-stone-500 hover:text-[#191716]"
                        }`}
                    >
                      {label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                to="/products"
                className="p-2 text-stone-600 hover:text-[#191716] rounded-full hover:bg-[#f4efe6] transition-colors"
                title="Search Products"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                </svg>
              </Link>

              <Link
                to="/wishlist"
                className="relative p-2 text-stone-600 hover:text-[#191716] rounded-full hover:bg-[#f4efe6] transition-colors"
                title="Wishlist"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#c25e36] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </Link>

              <button
                onClick={openDrawer}
                className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#191716] text-[#ffffff] hover:bg-[#2b2725] transition-all shadow-xs"
                title="View Bag"
              >
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="text-xs font-semibold tracking-wider uppercase">Bag</span>
                {cartCount > 0 && (
                  <span className="bg-white text-[#191716] text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center leading-none">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </button>

              {user ? (
                <div className="flex items-center gap-2 pl-2 border-l border-[#e8e2d7]">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-2.5 py-1 rounded-full hover:bg-[#f4efe6] transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#e8e2d7] text-[#191716] text-xs font-bold flex items-center justify-center">
                      {initials}
                    </div>
                    <span className="hidden lg:inline text-xs font-medium text-stone-800 max-w-[100px] truncate">
                      {user.fullName}
                    </span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="p-1.5 text-stone-400 hover:text-stone-700 transition-colors"
                    title="Logout"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="text-xs font-bold uppercase tracking-wider text-[#191716] hover:text-[#c25e36] px-3 py-1.5 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>

          </div>

          <div className="flex md:hidden items-center justify-around py-2 border-t border-[#e8e2d7] text-stone-600">
            {navLinks.map(({ to, label }) => {
              const active = (to === "/products" || to === "/wishlist" || to === "/orders")
                ? pathname.startsWith(to)
                : pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`text-[11px] font-semibold uppercase tracking-wider py-1 px-2
                    ${active ? "text-[#191716] border-b-2 border-[#191716]" : "text-stone-500"}`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

        </div>
      </div>
    </header>
  );
}
