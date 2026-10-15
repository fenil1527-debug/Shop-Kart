import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function Orders() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    let ignore = false;
    const fetchOrders = async () => {
      try {
        const userRes = await api.get("/customers/me");
        if (!ignore) setUser(userRes.data.customer);

        const res = await api.get("/orders");
        if (!ignore) setOrders(res.data.orders || []);
      } catch (err) {
        if (!ignore) {
          if (err.response?.status === 401) {
            navigate("/login");
          } else {
            setError(err.response?.data?.message || "Failed to load orders");
          }
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchOrders();
    return () => {
      ignore = true;
    };
  }, [navigate, refreshIndex]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setRefreshIndex((prev) => prev + 1);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PLACED":
      case "DELIVERED":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "CONFIRMED":
      case "SHIPPED":
        return "bg-stone-100 text-[#191716] border-stone-300";
      case "PENDING_PAYMENT":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "FAILED":
        return "bg-red-50 text-red-800 border-red-200";
      default:
        return "bg-[#f4efe6] text-stone-700 border-[#e8e2d7]";
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] flex flex-col text-[#191716]">
      <Navbar user={user} />

      <div className="bg-[#f4efe6] border-b border-[#e8e2d7] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs uppercase tracking-widest font-bold text-[#c25e36]">
            Order Archive
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#191716] mt-2">
            Order History
          </h1>
          <p className="text-stone-600 text-sm sm:text-base mt-2 font-sans">
            Track and review your previous acquisitions and fulfillment statuses
          </p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        {loading ? (
          <div className="text-center py-20">
            <svg
              className="w-10 h-10 animate-spin text-[#191716] mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-stone-500 font-medium text-xs uppercase tracking-widest">
              Consulting archives...
            </p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto text-center bg-white p-8 rounded-2xl border border-red-200 shadow-xs mt-8">
            <div className="text-3xl mb-3">⚠️</div>
            <h2 className="font-serif text-xl font-bold text-[#191716] mb-2">
              Unable to Retrieve Orders
            </h2>
            <p className="text-stone-500 mb-6 text-xs">{error}</p>
            <button
              onClick={handleRetry}
              className="btn-primary text-white text-xs uppercase tracking-widest font-bold px-6 py-3 rounded-full"
            >
              Retry
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="max-w-md mx-auto text-center bg-white p-12 rounded-2xl border border-[#e8e2d7] shadow-xs mt-8 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-[#f4efe6] text-stone-400 mx-auto flex items-center justify-center text-3xl mb-4">
              📦
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#191716] mb-2">
              No Previous Orders Found
            </h2>
            <p className="text-stone-500 text-xs leading-relaxed mb-6">
              When you purchase pieces from the ShopKart atelier, tracking and invoices will appear here.
            </p>
            <Link
              to="/products"
              className="btn-primary inline-block text-white text-xs uppercase tracking-widest font-bold px-8 py-3.5 rounded-full"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            {orders.map((order) => {
              const formattedDate = new Date(order.createdAt).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }
              );

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl border border-[#e8e2d7] shadow-xs overflow-hidden hover:border-stone-400 transition-colors"
                >
                  <div className="bg-[#fbf9f5] px-6 py-4 border-b border-[#e8e2d7] flex flex-wrap items-center justify-between gap-4 text-xs font-sans">
                    <div className="space-y-0.5">
                      <span className="text-stone-400 text-[10px] uppercase tracking-wider font-bold">Order ID</span>
                      <p className="font-mono font-bold text-[#191716] text-xs">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-stone-400 text-[10px] uppercase tracking-wider font-bold">Placed On</span>
                      <p className="text-stone-700 font-medium text-xs">{formattedDate}</p>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-stone-400 text-[10px] uppercase tracking-wider font-bold">Total Amount</span>
                      <p className="font-serif font-bold text-[#191716] text-sm">
                        ₹{order.totalAmount?.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#f4efe6] text-stone-600 border border-[#e8e2d7]">
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="space-y-3">
                      {order.items?.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-4 text-xs pb-3 border-b border-stone-100 last:border-none last:pb-0"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 object-cover rounded-lg border border-[#e8e2d7] shrink-0 bg-[#f4efe6]"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-sans font-semibold text-[#191716] truncate text-xs">
                              {item.name}
                            </h4>
                            <p className="text-[11px] text-stone-400 mt-0.5">
                              Quantity: {item.quantity} × ₹{item.price?.toLocaleString("en-IN")}
                            </p>
                          </div>
                          <span className="font-serif font-bold text-[#191716] text-sm shrink-0">
                            ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <p className="text-stone-500">
                        Dispatch Destination:{" "}
                        <strong className="text-[#191716]">
                          {order.shippingAddress?.fullName},{" "}
                          {order.shippingAddress?.city}
                        </strong>
                      </p>
                      <Link
                        to={`/orders/${order._id}`}
                        className="btn-primary text-white font-bold text-[11px] uppercase tracking-wider px-5 py-2.5 rounded-full inline-flex items-center gap-1.5 shadow-xs"
                      >
                        View Order Details →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-[#e8e2d7] py-6 text-center text-xs text-stone-400 mt-auto">
        <p>&copy; {new Date().getFullYear()} ShopKart. Nordic Minimalist Storefront.</p>
      </footer>
    </div>
  );
}
