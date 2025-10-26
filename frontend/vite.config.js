import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    outDir: "dist",
  },
  server: {
    port: 3000, // Optional, ensures local dev server runs on port 3000
  },
  preview: {
    port: 5000, // Optional, for previewing the build
  }
});
