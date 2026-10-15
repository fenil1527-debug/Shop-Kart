export default function AuthBackground({ children }) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#fbf9f5] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80&auto=format&fit=crop"
          alt="Nordic Atelier background"
          className="w-full h-full object-cover object-center filter blur-[3px] opacity-10 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#fbf9f5]/95 via-[#f4efe6]/90 to-[#ebe5db]/85" />
      </div>

      <div
        className="absolute w-96 h-96 rounded-full opacity-30 pointer-events-none -top-20 -left-20"
        style={{
          background: "radial-gradient(circle, rgba(194,94,54,0.15) 0%, rgba(251,249,245,0) 70%)",
        }}
      />
      <div
        className="absolute w-96 h-96 rounded-full opacity-20 pointer-events-none -bottom-20 -right-20"
        style={{
          background: "radial-gradient(circle, rgba(25,23,22,0.1) 0%, rgba(251,249,245,0) 70%)",
        }}
      />

      <div className="relative z-10 w-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
