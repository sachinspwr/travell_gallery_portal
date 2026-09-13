import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        // target: "http://localhost:8080",

        target: "http://192.168.1.47:8080",
        changeOrigin: true,
        rewrite: (path) => path,
      },
    },
  },
  preview: {
    port: 5173,
  },
});
