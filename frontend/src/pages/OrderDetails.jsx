import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const userRes = await api.get("/customers/me");
        if (!ignore) setUser(userRes.data.customer);

        const res = await api.get(`/orders/${id}`);
        if (!ignore) setOrder(res.data.order);
      } catch (err) {
        if (!ignore) {
          if (err.response?.status === 401) {
            navigate("/login");
          } else {
            setError(
              err.response?.data?.message ||
                "Unable to load this order or you do not have permission."
            );
          }
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, [id, navigate]);

  const handleAdvanceStatus = async (nextStatus) => {
    setUpdatingStatus(true);
    try {
      const res = await api.patch(`/orders/${id}/status`, { status: nextStatus });
      if (res.data.success) {
        setOrder(res.data.order);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const steps = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];
  const currentStepIndex = steps.indexOf(order?.status);

  return (
    <div className="min-h-screen bg-[#fbf9f5] flex flex-col text-[#191716]">
      <Navbar user={user} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <Link
          to="/orders"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-stone-600 hover:text-[#191716] mb-6 group"
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
          Back to My Orders
        </Link>

        {loading ? (
          <div className="text-center py-20">
            <svg
              className="w-10 h-10 animate-spin text-amber-500 mx-auto mb-4"
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
            <p className="text-stone-500 font-medium">Loading order details...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-3xl border border-red-200 p-10 text-center max-w-md mx-auto shadow-sm">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-stone-900 mb-2">Error</h2>
            <p className="text-stone-500 text-sm mb-6">{error}</p>
            <Link
              to="/orders"
              className="btn-primary inline-block text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-md"
            >
              Back to My Orders
            </Link>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-100">
                <div>
                  <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                    Order Details
                  </span>
                  <h1 className="text-2xl font-extrabold text-stone-900 mt-0.5">
                    Order #{order._id}
                  </h1>
                  <p className="text-xs text-stone-500 mt-1">
                    Placed on{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {order.status}
                  </span>
                  <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200">
                    Payment: {order.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="py-6">
                <h3 className="text-xs font-bold text-stone-600 uppercase tracking-wider mb-4">
                  Delivery Status Progression
                </h3>
                <div className="grid grid-cols-4 gap-2 relative">
                  {steps.map((st, i) => {
                    const isDone = currentStepIndex >= i && currentStepIndex !== -1;
                    const isCurrent = currentStepIndex === i;

                    return (
                      <div key={st} className="flex flex-col items-center text-center">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                            isDone
                              ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                              : "bg-stone-100 text-stone-400"
                          }`}
                        >
                          {isDone ? "✓" : i + 1}
                        </div>
                        <span
                          className={`text-xs mt-2 font-semibold ${
                            isCurrent
                              ? "text-emerald-700 font-bold"
                              : isDone
                              ? "text-stone-800"
                              : "text-stone-400"
                          }`}
                        >
                          {st}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="text-stone-400 italic">
                    💡 Bonus Feature: Simulate delivery progression:
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {steps.map((st) => (
                      <button
                        key={st}
                        onClick={() => handleAdvanceStatus(st)}
                        disabled={updatingStatus || order.status === st}
                        className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                          order.status === st
                            ? "bg-amber-100 text-amber-800 font-bold"
                            : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-7 bg-white rounded-3xl border border-stone-200/80 shadow-sm p-6 space-y-4">
                <h3 className="text-base font-bold text-stone-900 pb-3 border-b border-stone-100">
                  Items Snapshot ({order.items?.length})
                </h3>
                <div className="space-y-4">
                  {order.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 text-xs pb-3 border-b border-stone-50 last:border-none last:pb-0"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-xl border border-stone-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-stone-900 text-sm truncate">
                          {item.name}
                        </h4>
                        <p className="text-stone-400 mt-0.5">
                          Purchase Price: ₹{item.price?.toLocaleString("en-IN")} × {item.quantity}
                        </p>
                      </div>
                      <span className="font-extrabold text-stone-900 text-sm shrink-0">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-stone-100 flex justify-between items-center text-sm font-bold">
                  <span className="text-stone-600">Total Billed:</span>
                  <span className="text-xl font-extrabold text-amber-700">
                    ₹{order.totalAmount?.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="md:col-span-5 space-y-6">
                <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-6 space-y-3">
                  <h3 className="text-base font-bold text-stone-900 pb-2 border-b border-stone-100">
                    Shipping Address
                  </h3>
                  <div className="text-xs text-stone-600 space-y-1 leading-relaxed">
                    <p className="font-bold text-stone-900 text-sm">
                      {order.shippingAddress?.fullName}
                    </p>
                    <p>{order.shippingAddress?.addressLine1}</p>
                    <p>
                      {order.shippingAddress?.city}, {order.shippingAddress?.state} -{" "}
                      {order.shippingAddress?.pincode}
                    </p>
                    <p className="pt-1 text-stone-500">
                      📞 {order.shippingAddress?.phone}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-6 space-y-3 text-xs">
                  <h3 className="text-base font-bold text-stone-900 pb-2 border-b border-stone-100">
                    Payment Summary
                  </h3>
                  <div className="space-y-2 text-stone-600">
                    <div className="flex justify-between">
                      <span>Method:</span>
                      <span className="font-semibold text-stone-800">Razorpay Standard</span>
                    </div>
                    {order.razorpayOrderId && (
                      <div className="flex justify-between">
                        <span>Razorpay Order:</span>
                        <span className="font-mono text-stone-800 truncate max-w-[150px]">
                          {order.razorpayOrderId}
                        </span>
                      </div>
                    )}
                    {order.razorpayPaymentId && (
                      <div className="flex justify-between">
                        <span>Payment ID:</span>
                        <span className="font-mono text-stone-800 truncate max-w-[150px]">
                          {order.razorpayPaymentId}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-stone-100">
                      <span>Payment Status:</span>
                      <span className="font-bold text-emerald-700">
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
