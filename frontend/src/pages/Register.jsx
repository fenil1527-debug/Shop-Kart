import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import AuthBackground from "../components/AuthBackground";
import InputField from "../components/InputField";

const UserIcon = () => (
  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const MailIcon = () => (
  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

function PasswordStrength({ password }) {
  const getStrength = () => {
    if (!password) return { level: 0, label: "", color: "" };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 1) return { level: 1, label: "Weak", color: "bg-red-400 text-red-600" };
    if (score <= 3) return { level: 2, label: "Fair", color: "bg-amber-400 text-amber-600" };
    if (score <= 4) return { level: 3, label: "Good", color: "bg-emerald-400 text-emerald-600" };
    return { level: 4, label: "Strong", color: "bg-emerald-500 text-emerald-700" };
  };
  const { level, label, color } = getStrength();
  if (!password) return null;
  const barBg = color.split(" ")[0];
  const textColor = color.split(" ")[1];

  return (
    <div className="mt-2 space-y-1 text-left">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i <= level ? barBg : "bg-stone-200"
            }`}
          />
        ))}
      </div>
      <p className={`text-[11px] font-medium ${textColor}`}>{label} security score</p>
    </div>
  );
}

export default function Register() {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const set = (field) => (e) => setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = "Full name is required";
    else if (formData.fullName.trim().length < 2) errs.fullName = "Name must be at least 2 characters";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Enter a valid email";
    if (!formData.password) errs.password = "Password is required";
    else if (formData.password.length < 6) errs.password = "At least 6 characters required";
    if (!formData.phone.trim()) errs.phone = "Phone number is required";
    else if (!/^\+?[\d\s\-()]{7,15}$/.test(formData.phone)) errs.phone = "Enter a valid phone number";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setApiError("");
    setLoading(true);
    try {
      await api.post("/customers/register", formData);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setApiError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthBackground>
      <div className="w-full max-w-md animate-fade-in my-6">
        <div className="text-center mb-6">
          <Link to="/home" className="inline-flex items-center gap-2 mb-2 group">
            <span className="font-serif text-3xl font-extrabold tracking-tight text-[#191716] group-hover:text-[#c25e36] transition-colors">
              ShopKart<span className="text-[#c25e36]">.</span>
            </span>
          </Link>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#191716] tracking-tight">
            Create an Account
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-1 font-sans">
            Join the ShopKart community for thoughtful commerce
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-7 sm:p-9 shadow-lg shadow-stone-200/40 border border-[#e8e2d7]">
          {success && (
            <div className="mb-5 flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3.5 text-xs animate-fade-in">
              <svg className="w-4 h-4 shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Account created successfully! Preparing your access…</span>
            </div>
          )}

          {apiError && (
            <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3.5 text-xs">
              <svg className="w-4 h-4 shrink-0 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{apiError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <InputField
              label="Full Name"
              type="text"
              placeholder="e.g. Maya Jenkins"
              value={formData.fullName}
              onChange={set("fullName")}
              icon={<UserIcon />}
              error={errors.fullName}
              autoComplete="name"
            />

            <InputField
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={set("email")}
              icon={<MailIcon />}
              error={errors.email}
              autoComplete="email"
            />

            <div>
              <InputField
                label="Password"
                type="password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={set("password")}
                icon={<LockIcon />}
                error={errors.password}
                autoComplete="new-password"
              />
              <PasswordStrength password={formData.password} />
            </div>

            <InputField
              label="Phone Number"
              type="tel"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={set("phone")}
              icon={<PhoneIcon />}
              error={errors.phone}
              autoComplete="tel"
            />

            <button
              type="submit"
              disabled={loading || success}
              className="btn-primary w-full py-3.5 rounded-full text-white font-bold text-xs uppercase tracking-widest mt-2 flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account…
                </>
              ) : (
                "Complete Registration"
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#e8e2d7]" />
            <span className="text-stone-400 text-[10px] uppercase tracking-widest font-bold">Already a member?</span>
            <div className="flex-1 h-px bg-[#e8e2d7]" />
          </div>

          <Link
            to="/login"
            className="block w-full text-center py-3 rounded-full border border-[#e8e2d7] bg-[#fbf9f5] hover:bg-[#f4efe6] text-stone-700 text-xs uppercase tracking-widest font-bold transition-all duration-200"
          >
            Sign in to Existing Account
          </Link>
        </div>

        <p className="text-center text-stone-400 text-xs mt-6">
          &copy; {new Date().getFullYear()} ShopKart. Nordic simplicity &amp; thoughtful commerce.
        </p>
      </div>
    </AuthBackground>
  );
}
