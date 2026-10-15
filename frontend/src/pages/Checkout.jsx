import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Checkout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { cartItems, cartCount, subtotal, clearCart, fetchCart, cartLoading } =
    useCart();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [testModalData, setTestModalData] = useState(null); 

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/customers/me");
        setUser(res.data.customer);
        if (res.data.customer) {
          setFormData((prev) => ({
            ...prev,
            fullName: prev.fullName || res.data.customer.fullName || "",
            phone: prev.phone || res.data.customer.phone || "",
          }));
        }
        await fetchCart();
      } catch {
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate, fetchCart]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone.trim().replace(/[\s-]/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    if (!formData.addressLine1.trim())
      newErrors.addressLine1 = "Address line is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode.trim())) {
      newErrors.pincode = "Pincode must contain exactly 6 digits";
    }
    return newErrors;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setApiError("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (cartItems.length === 0) {
      setApiError("Your cart is empty. Please add items before checking out.");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/orders/create-payment-order", {
        shippingAddress: formData,
      });

      const { shopKartOrderId, razorpayOrderId, amount, currency, key } =
        res.data;

      const scriptLoaded = await loadRazorpayScript();

      if (
        scriptLoaded &&
        window.Razorpay &&
        key &&
        !key.includes("shopkart_testkey")
      ) {
        const options = {
          key,
          amount,
          currency,
          name: "ShopKart",
          description: "ShopKart Order Payment",
          order_id: razorpayOrderId,
          handler: async function (response) {
            try {
              const verifyRes = await api.post("/orders/verify-payment", {
                shopKartOrderId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              if (verifyRes.data.success) {
                clearCart();
                navigate(`/order-success/${shopKartOrderId}`);
              }
            } catch (err) {
              setApiError(
                err.response?.data?.message ||
                  "Payment signature verification failed."
              );
            }
          },
          prefill: {
            name: formData.fullName,
            contact: formData.phone,
            email: user?.email || "",
          },
          theme: {
            color: "#d97706",
          },
        };

        const razorpayInstance = new window.Razorpay(options);

        razorpayInstance.on("payment.failed", function (response) {
          setApiError(
            `Payment failed: ${response.error?.description || "Transaction was rejected"}. Your cart has not been cleared.`
          );
        });

        razorpayInstance.open();
        setLoading(false);
      } else {
        setTestModalData({
          shopKartOrderId,
          razorpayOrderId,
          amount,
        });
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      setApiError(
        err.response?.data?.message || "Failed to initiate order checkout."
      );
    }
  };

  const handleSimulatePayment = async (simulateSuccess) => {
    if (!testModalData) return;
    setLoading(true);
    setApiError("");

    if (!simulateSuccess) {
      setApiError(
        "Payment simulation failed. Your cart has not been cleared. Please try again."
      );
      setTestModalData(null);
      setLoading(false);
      return;
    }

    try {
      const fakePaymentId = `pay_test_${Date.now()}`;
      
      let sig = "";
      
      const testSecret = "test_secret_shopkart_987654";
      const enc = new TextEncoder();
      const keyData = enc.encode(testSecret);
      const msgData = enc.encode(`${testModalData.razorpayOrderId}|${fakePaymentId}`);
      const cryptoKey = await window.crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      const signatureBuffer = await window.crypto.subtle.sign("HMAC", cryptoKey, msgData);
      const hashArray = Array.from(new Uint8Array(signatureBuffer));
      sig = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

      const verifyRes = await api.post("/orders/verify-payment", {
        shopKartOrderId: testModalData.shopKartOrderId,
        razorpay_order_id: testModalData.razorpayOrderId,
        razorpay_payment_id: fakePaymentId,
        razorpay_signature: sig,
      });

      if (verifyRes.data.success) {
        clearCart();
        setTestModalData(null);
        navigate(`/order-success/${testModalData.shopKartOrderId}`);
      }
    } catch (err) {
      setApiError(
        err.response?.data?.message || "Payment verification failed."
      );
      setTestModalData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] flex flex-col text-[#191716]">
      <Navbar user={user} />

      <div className="bg-[#f4efe6] border-b border-[#e8e2d7] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs uppercase tracking-widest font-bold text-[#c25e36]">
            Secure Settlement
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#191716] mt-2">
            Checkout &amp; Delivery
          </h1>
          <p className="text-stone-600 text-sm sm:text-base mt-2 font-sans">
            Provide your dispatch address to conclude your order with bank-grade encryption.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {apiError && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3 shadow-sm">
            <svg
              className="w-5 h-5 text-red-500 shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1 text-sm font-medium">{apiError}</div>
            <button
              onClick={() => setApiError("")}
              className="text-red-400 hover:text-red-600 text-sm font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {cartLoading ? (
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
            <p className="text-stone-500 font-medium">Loading checkout...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="max-w-md mx-auto text-center bg-white p-10 rounded-2xl border border-stone-200 shadow-sm mt-8">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-xl font-bold text-stone-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-stone-500 mb-6">
              You must add items to your cart before proceeding to checkout.
            </p>
            <Link
              to="/products"
              className="btn-primary inline-block text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-md"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-stone-900">
                      Shipping Details
                    </h2>
                    <p className="text-xs text-stone-400">
                      Where should we deliver your order?
                    </p>
                  </div>
                </div>

                <form onSubmit={handlePlaceOrder} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <input
                      id="shipping-fullName"
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Aarav Sharma"
                      className={`w-full px-4 py-2.5 rounded-xl text-sm border bg-stone-50/50 focus:bg-white focus:outline-none transition-all ${
                        errors.fullName
                          ? "border-red-400 ring-2 ring-red-100"
                          : "border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      id="shipping-phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. 9876543210"
                      className={`w-full px-4 py-2.5 rounded-xl text-sm border bg-stone-50/50 focus:bg-white focus:outline-none transition-all ${
                        errors.phone
                          ? "border-red-400 ring-2 ring-red-100"
                          : "border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      Address (House, Street, Area) *
                    </label>
                    <input
                      id="shipping-addressLine1"
                      type="text"
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleChange}
                      placeholder="e.g. 22 MG Road, Indiranagar"
                      className={`w-full px-4 py-2.5 rounded-xl text-sm border bg-stone-50/50 focus:bg-white focus:outline-none transition-all ${
                        errors.addressLine1
                          ? "border-red-400 ring-2 ring-red-100"
                          : "border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                      }`}
                    />
                    {errors.addressLine1 && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.addressLine1}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                        City *
                      </label>
                      <input
                        id="shipping-city"
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="e.g. Bengaluru"
                        className={`w-full px-4 py-2.5 rounded-xl text-sm border bg-stone-50/50 focus:bg-white focus:outline-none transition-all ${
                          errors.city
                            ? "border-red-400 ring-2 ring-red-100"
                            : "border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                        }`}
                      />
                      {errors.city && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.city}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                        State *
                      </label>
                      <input
                        id="shipping-state"
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="e.g. Karnataka"
                        className={`w-full px-4 py-2.5 rounded-xl text-sm border bg-stone-50/50 focus:bg-white focus:outline-none transition-all ${
                          errors.state
                            ? "border-red-400 ring-2 ring-red-100"
                            : "border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                        }`}
                      />
                      {errors.state && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.state}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                        Pincode *
                      </label>
                      <input
                        id="shipping-pincode"
                        type="text"
                        name="pincode"
                        maxLength={6}
                        value={formData.pincode}
                        onChange={handleChange}
                        placeholder="e.g. 560001"
                        className={`w-full px-4 py-2.5 rounded-xl text-sm border bg-stone-50/50 focus:bg-white focus:outline-none transition-all ${
                          errors.pincode
                            ? "border-red-400 ring-2 ring-red-100"
                            : "border-stone-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                        }`}
                      />
                      {errors.pincode && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.pincode}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      id="place-order-button"
                      type="submit"
                      disabled={loading}
                      className="w-full btn-primary text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <svg
                            className="w-4 h-4 animate-spin"
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
                          Processing Order...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                          Pay ₹{subtotal.toLocaleString("en-IN")} via Razorpay
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-6 sticky top-24 space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                  <h2 className="text-lg font-bold text-stone-900">
                    Order Summary
                  </h2>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full">
                    {cartCount} item{cartCount !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
                  {cartItems
                    .filter((item) => item.product)
                    .map((item) => (
                      <div
                        key={item.product._id}
                        className="flex items-center gap-3 text-sm py-1 border-b border-stone-50 last:border-none"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded-lg border border-stone-100"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-stone-900 truncate text-xs">
                            {item.product.name}
                          </p>
                          <p className="text-stone-400 text-xs">
                            ₹{item.product.price.toLocaleString("en-IN")} × {item.quantity}
                          </p>
                        </div>
                        <span className="font-bold text-stone-900 text-xs shrink-0">
                          ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                </div>

                <div className="space-y-2 pt-3 border-t border-stone-100 text-sm">
                  <div className="flex justify-between text-stone-600">
                    <span>Items Subtotal</span>
                    <span className="font-semibold text-stone-900">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Shipping / Delivery</span>
                    <span className="text-emerald-600 font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Payment Mode</span>
                    <span className="text-stone-800 font-medium">Razorpay (Test)</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                  <span className="text-base font-bold text-stone-900">
                    Total Amount
                  </span>
                  <span className="text-2xl font-extrabold text-amber-700">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="bg-amber-50/70 rounded-xl p-3 text-xs text-amber-800 border border-amber-200/50 flex items-center gap-2">
                  <span className="text-base">🔒</span>
                  <span>
                    Secured by 256-bit Razorpay Sandbox encryption.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {testModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center text-2xl font-bold">
              💳
            </div>
            <h3 className="text-xl font-bold text-stone-900">
              Razorpay Test Checkout
            </h3>
            <p className="text-xs text-stone-500">
              Razorpay Order: <span className="font-mono text-stone-700 font-semibold">{testModalData.razorpayOrderId}</span>
            </p>
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-left space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">ShopKart Order ID:</span>
                <span className="font-mono font-medium">{testModalData.shopKartOrderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Amount:</span>
                <span className="font-bold text-amber-700">₹{(testModalData.amount / 100).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Test Mode:</span>
                <span className="text-emerald-700 font-semibold">Active (No Real Money)</span>
              </div>
            </div>

            <p className="text-xs text-stone-400">
              Simulate customer payment response to trigger backend HMAC signature verification:
            </p>

            <div className="space-y-2 pt-2">
              <button
                id="simulate-success-btn"
                onClick={() => handleSimulatePayment(true)}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md"
              >
                ✅ Simulate Successful Payment
              </button>
              <button
                id="simulate-fail-btn"
                onClick={() => handleSimulatePayment(false)}
                disabled={loading}
                className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold py-2.5 rounded-xl text-sm transition-all"
              >
                ❌ Simulate Failed Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
