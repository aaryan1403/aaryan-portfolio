import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { imagetools } from "vite-imagetools";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    imagetools({
      // Every bare PNG/JPEG import ships as a ≤1800px WebP; originals stay untouched in src/assets.
      defaultDirectives: (url) =>
        url.searchParams.size === 0 && /\.(png|jpe?g)$/i.test(url.pathname)
          ? new URLSearchParams({ w: "1800", withoutEnlargement: "", format: "webp", quality: "82" })
          : new URLSearchParams(),
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
