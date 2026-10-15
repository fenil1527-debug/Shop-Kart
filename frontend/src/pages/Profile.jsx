import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Skeleton({ className }) {
  return <div className={`shimmer rounded-xl ${className}`} />;
}

function InfoRow({ label, value, icon, mono }) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-[#f4efe6] last:border-0">
      <div className="w-10 h-10 rounded-xl bg-[#f4efe6] flex items-center justify-center shrink-0 text-[#191716] mt-0.5 border border-[#e8e2d7]">
        {icon}
      </div>
      <div className="flex-1 min-w-0 text-left">
        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className={`text-sm font-medium text-[#191716] break-all ${mono ? "font-mono" : ""}`}>
          {value || <span className="text-stone-300 italic">Not set</span>}
        </p>
      </div>
    </div>
  );
}

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [pwData, setPwData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  useEffect(() => {
    api.get("/customers/me")
      .then((res) => setUser(res.data.customer))
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, [navigate]);

  const initials = user?.fullName
    ? user.fullName
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .filter(Boolean)
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"
    : "U";

  let joinedDate = null;
  if (user?.createdAt) {
    try {
      const d = new Date(user.createdAt);
      if (!isNaN(d.getTime())) {
        joinedDate = d.toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }
    } catch (err) {
      console.warn("Date parse error", err.message);
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");

    if (!pwData.oldPassword || !pwData.newPassword) {
      setPwError("Current and new password are required");
      return;
    }
    if (pwData.newPassword.length < 6) {
      setPwError("New password must be at least 6 characters");
      return;
    }
    if (pwData.newPassword !== pwData.confirmPassword) {
      setPwError("New passwords do not match");
      return;
    }

    setPwLoading(true);
    try {
      const res = await api.patch("/customers/change-password", {
        oldPassword: pwData.oldPassword,
        newPassword: pwData.newPassword,
      });
      setPwSuccess(res.data?.message || "Password changed successfully!");
      setPwData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => {
        setShowChangePassword(false);
        setPwSuccess("");
      }, 2000);
    } catch (err) {
      setPwError(err.response?.data?.message || "Failed to change password. Check your current password.");
    } finally {
      setPwLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/customers/logout");
    } catch (err) {
      console.warn("Logout error:", err.message);
    }
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] flex flex-col text-[#191716]">
      <Navbar user={user} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 flex-1 w-full">
        <div className="flex items-center justify-between pb-4 border-b border-[#e8e2d7]">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-[#c25e36]">
              Client Dossier
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#191716] tracking-tight mt-1">
              Account Overview
            </h1>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-stone-600 hover:text-[#191716] px-4 py-2 rounded-full border border-[#e8e2d7] bg-white transition-all shadow-xs"
          >
            ← Storefront
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-[#e8e2d7] shadow-xs overflow-hidden">
          <div className="relative h-40 sm:h-48 overflow-hidden bg-[#f4efe6]">
            <img
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80&auto=format&fit=crop"
              alt="Profile cover"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950/60 via-stone-900/30 to-transparent" />
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-[#191716] text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-sm shadow-xs border border-[#e8e2d7]">
              Atelier Member
            </div>
          </div>

          <div className="relative z-10 px-6 sm:px-8 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12 sm:-mt-14 mb-6">
              {loading ? (
                <Skeleton className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl" />
              ) : (
                <div className="relative z-20 w-24 h-24 rounded-2xl border-4 border-white shadow-xl flex items-center justify-center text-3xl font-serif font-bold text-white shrink-0 bg-[#191716]">
                  {initials}
                </div>
              )}

              <div className="flex items-center gap-2 sm:mb-2">
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full px-3 py-1 text-xs font-semibold shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Verified Member
                </span>
                <span className="inline-flex items-center gap-1.5 bg-[#f4efe6] text-stone-700 border border-[#e8e2d7] rounded-full px-3 py-1 text-xs font-semibold shadow-xs">
                  ShopKart Client
                </span>
              </div>
            </div>

            {loading ? (
              <div className="space-y-2 mb-6">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-4 w-36" />
              </div>
            ) : (
              <div className="mb-6 text-left">
                <h2 className="font-serif text-2xl font-bold text-[#191716]">{user?.fullName}</h2>
                {joinedDate && (
                  <p className="text-xs text-stone-500 mt-1 flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Patron since {joinedDate}
                  </p>
                )}
              </div>
            )}

            <div className="h-px bg-[#f4efe6] mb-4" />

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-14" />
                ))}
              </div>
            ) : (
              <div className="divide-y divide-[#f4efe6]">
                <InfoRow
                  label="Full Name"
                  value={user?.fullName}
                  icon={
                    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  }
                />
                <InfoRow
                  label="Email Address"
                  value={user?.email}
                  mono
                  icon={
                    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  }
                />
                <InfoRow
                  label="Phone Number"
                  value={user?.phone}
                  icon={
                    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  }
                />
                {joinedDate && (
                  <InfoRow
                    label="Account Created"
                    value={joinedDate}
                    icon={
                      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    }
                  />
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#e8e2d7] shadow-xs p-6 sm:p-8 text-left">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg font-bold text-[#191716] flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#f4efe6] text-[#191716] flex items-center justify-center">
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              Security &amp; Credentials
            </h3>

            {!showChangePassword && (
              <button
                onClick={() => setShowChangePassword(true)}
                className="text-xs font-bold uppercase tracking-wider text-[#191716] hover:text-[#c25e36] border border-[#e8e2d7] bg-[#fbf9f5] px-3.5 py-1.5 rounded-full transition-all"
              >
                Change Password
              </button>
            )}
          </div>

          {showChangePassword && (
            <div className="mb-6 p-5 bg-[#fbf9f5] border border-[#e8e2d7] rounded-xl animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#191716]">Update Credentials</h4>
                <button
                  type="button"
                  onClick={() => {
                    setShowChangePassword(false);
                    setPwError("");
                    setPwSuccess("");
                  }}
                  className="text-xs text-stone-400 hover:text-stone-700"
                >
                  Cancel ✕
                </button>
              </div>

              {pwSuccess && (
                <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl p-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {pwSuccess}
                </div>
              )}

              {pwError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {pwError}
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Current Password</label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    value={pwData.oldPassword}
                    onChange={(e) => setPwData({ ...pwData, oldPassword: e.target.value })}
                    className="w-full bg-white border border-[#e8e2d7] rounded-xl py-2 px-3 text-sm text-[#191716] placeholder-stone-400 input-focus-ring"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">New Password</label>
                  <input
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={pwData.newPassword}
                    onChange={(e) => setPwData({ ...pwData, newPassword: e.target.value })}
                    className="w-full bg-white border border-[#e8e2d7] rounded-xl py-2 px-3 text-sm text-[#191716] placeholder-stone-400 input-focus-ring"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Repeat new password"
                    value={pwData.confirmPassword}
                    onChange={(e) => setPwData({ ...pwData, confirmPassword: e.target.value })}
                    className="w-full bg-white border border-[#e8e2d7] rounded-xl py-2 px-3 text-sm text-[#191716] placeholder-stone-400 input-focus-ring"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowChangePassword(false)}
                    className="px-4 py-2 rounded-full text-xs font-semibold text-stone-600 hover:bg-stone-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={pwLoading}
                    className="btn-primary text-white text-xs uppercase tracking-wider font-bold px-5 py-2 rounded-full shadow-xs"
                  >
                    {pwLoading ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="divide-y divide-[#f4efe6]">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#f4efe6] flex items-center justify-center text-[#191716]">
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#191716]">Password Security</p>
                  <p className="text-xs text-stone-400">Encrypted with bcrypt salted hash</p>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#f4efe6] text-stone-700 rounded-full px-3 py-1 border border-[#e8e2d7]">
                Protected
              </span>
            </div>

            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#f4efe6] flex items-center justify-center text-[#191716]">
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#191716]">Session Tokens</p>
                  <p className="text-xs text-stone-400">HttpOnly token (XSS-proof)</p>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full px-3 py-1">
                Active Session
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs uppercase tracking-wider font-bold text-red-700 border border-red-200 bg-red-50 hover:bg-red-100 transition-all shadow-xs"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out of ShopKart
          </button>
        </div>
      </main>

      <footer className="bg-white border-t border-[#e8e2d7] py-6 text-center text-xs text-stone-400 mt-auto">
        <p>&copy; {new Date().getFullYear()} ShopKart. Nordic Minimalist Storefront.</p>
      </footer>
    </div>
  );
}
