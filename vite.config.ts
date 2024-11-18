import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5173,
    host: true,
  },
  publicDir: "public",
  build: {
    outDir: "dist",
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifestFilename: "manifest.json",
      includeAssets: ["**/*.{js,css,html,ico,png,svg,jpg}"], // For precaching files under publid dir only
      manifest: {
        id: "com.letmeperplexitythat",
        short_name: "Perplexity That",
        name: "Let Me Perplexity That",
        description:
          "For all those people that find it more convenient to bother you with their question than to perplexity it for themselves",
        icons: [
          {
            src: "assets/manifest-icon-192.maskable.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "assets/manifest-icon-192.maskable.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "assets/manifest-icon-512.maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "assets/manifest-icon-512.maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        start_url: "/",
        scope: "/",
        lang: "en",
        display: "standalone",
        theme_color: "#191A1A",
        background_color: "#202222",
      },
    }),
  ],
});
