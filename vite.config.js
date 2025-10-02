import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 3001,
    proxy: {
      // "/api": "http://localhost:8081",
    },
  },
  build: {
    sourcemap: true, // ✅ Enables source maps in production
  },
});
