import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      "/customers": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/products": {
        target: "http://localhost:8000",
        changeOrigin: true,
        bypass: (req) => {
          if (req.headers.accept && req.headers.accept.includes("text/html")) {
            return "/index.html";
          }
        },
      },
      "/wishlist": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/cart": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/orders": {
        target: "http://localhost:8000",
        changeOrigin: true,
        bypass: (req) => {
          if (req.headers.accept && req.headers.accept.includes("text/html")) {
            return "/index.html";
          }
        },
      },
    },
  },
});
