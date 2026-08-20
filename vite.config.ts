import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: "prompt",
      injectRegister: "auto",
      includeAssets: [
        "favicon.svg",
        "icons.svg",
        "startup-logo.svg",
        "pwa/app-icon.svg",
        "pwa/app-icon-192.png",
        "pwa/app-icon-512.png",
        "pwa/apple-touch-icon-180.png",
      ],
      manifest: {
        id: "/",
        name: "Zistup",
        short_name: "Zistup",
        description:
          "زیست‌آپ؛ همراه شما برای تغذیه سالم‌تر و انتخاب‌های غذایی بهتر",
        lang: "fa",
        dir: "rtl",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#21262d",
        icons: [
          {
            src: "/pwa/app-icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any",
          },
          {
            src: "/pwa/app-icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa/app-icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,woff,woff2}"],
        navigateFallback: "index.html",
      },
    }),
  ],

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
