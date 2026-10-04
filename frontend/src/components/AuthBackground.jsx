export default function AuthBackground({ children }) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#faf9f7] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background lifestyle shopping image with warm gentle overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80&auto=format&fit=crop"
          alt="Shop background"
          className="w-full h-full object-cover object-center filter blur-[2px] opacity-15 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#faf9f7]/95 via-[#f5f1ea]/90 to-[#ede5d8]/85" />
      </div>

      {/* Warm ambient glow circles */}
      <div
        className="absolute w-96 h-96 rounded-full opacity-30 pointer-events-none -top-20 -left-20"
        style={{
          background: "radial-gradient(circle, rgba(217,119,6,0.25) 0%, rgba(234,88,12,0) 70%)",
        }}
      />
      <div
        className="absolute w-96 h-96 rounded-full opacity-25 pointer-events-none -bottom-20 -right-20"
        style={{
          background: "radial-gradient(circle, rgba(245,158,11,0.2) 0%, rgba(217,119,6,0) 70%)",
        }}
      />

      {/* Foreground Content */}
      <div className="relative z-10 w-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
