import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function OrderSuccess() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const userRes = await api.get("/customers/me");
        setUser(userRes.data.customer);

        const orderRes = await api.get(`/orders/${id}`);
        setOrder(orderRes.data.order);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          setError(err.response?.data?.message || "Failed to load order details");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate]);

  return (
    <div className="min-h-screen bg-[#fbf9f5] flex flex-col text-[#191716]">
      <Navbar user={user} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
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
              Confirming transaction...
            </p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl border border-red-200 p-8 text-center max-w-md mx-auto shadow-xs">
            <div className="text-3xl mb-3">⚠️</div>
            <h2 className="font-serif text-xl font-bold text-[#191716] mb-2">Notice</h2>
            <p className="text-stone-500 mb-6 text-xs">{error}</p>
            <Link
              to="/orders"
              className="btn-primary inline-block text-white text-xs uppercase tracking-widest font-bold px-6 py-3 rounded-full"
            >
              Go to Order Archive
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#e8e2d7] shadow-xs p-6 sm:p-10 text-center animate-fade-in space-y-8">
            <div className="w-18 h-18 rounded-full bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center border-2 border-emerald-200 shadow-xs">
              <svg
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
                Payment Verified • {order.paymentStatus}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#191716] mb-2">
                Order Confirmed
              </h1>
              <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                Thank you for your acquisition. Our dispatch atelier is preparing your package for express delivery.
              </p>
            </div>

            <div className="bg-[#fbf9f5] rounded-xl border border-[#e8e2d7] p-5 text-left text-xs space-y-3 font-sans">
              <div className="flex flex-col sm:flex-row sm:justify-between border-b border-[#e8e2d7] pb-2.5">
                <span className="text-stone-400 font-bold uppercase tracking-wider text-[10px]">Order ID:</span>
                <span className="font-mono font-bold text-[#191716] break-all">{order._id}</span>
              </div>
              {order.razorpayPaymentId && (
                <div className="flex flex-col sm:flex-row sm:justify-between border-b border-[#e8e2d7] pb-2.5">
                  <span className="text-stone-400 font-bold uppercase tracking-wider text-[10px]">Payment Reference:</span>
                  <span className="font-mono text-stone-700">{order.razorpayPaymentId}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-[#e8e2d7] pb-2.5">
                <span className="text-stone-400 font-bold uppercase tracking-wider text-[10px]">Status:</span>
                <span className="font-bold text-emerald-800 uppercase tracking-wider">{order.status}</span>
              </div>
              <div className="flex justify-between border-b border-[#e8e2d7] pb-2.5">
                <span className="text-stone-400 font-bold uppercase tracking-wider text-[10px]">Destination:</span>
                <span className="font-medium text-[#191716] text-right">
                  {order.shippingAddress.fullName}, {order.shippingAddress.city} - {order.shippingAddress.pincode}
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="font-bold text-[#191716]">Total Settled:</span>
                <span className="font-serif text-lg font-bold text-[#191716]">
                  ₹{order.totalAmount?.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="text-left space-y-2">
              <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                Acquired Items ({order.items?.length})
              </h3>
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {order.items?.map((item) => (
                  <div
                    key={item._id || item.product}
                    className="flex items-center gap-3 p-3 bg-[#fbf9f5] rounded-xl border border-[#e8e2d7] text-xs"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg shrink-0 border border-[#e8e2d7]"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#191716] truncate">{item.name}</p>
                      <p className="text-[11px] text-stone-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-serif font-bold text-[#191716] shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/orders"
                className="w-full sm:w-auto btn-primary text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-full shadow-xs text-center"
              >
                View Order Archive
              </Link>
              <Link
                to="/products"
                className="w-full sm:w-auto px-7 py-3 rounded-full text-xs uppercase tracking-widest font-bold text-[#191716] border border-[#e8e2d7] hover:border-stone-400 transition-colors text-center"
              >
                Continue Browsing
              </Link>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-[#e8e2d7] py-6 text-center text-xs text-stone-400 mt-auto">
        <p>&copy; {new Date().getFullYear()} ShopKart. Nordic Minimalist Storefront.</p>
      </footer>
    </div>
  );
}
