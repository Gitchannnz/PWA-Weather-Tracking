import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";


import react from "@vitejs/plugin-react";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VitePWA({
      manifest: {
        includeAssets: ["favicon.ico", "apple-touch-icon.png", "assets/*"],
        name: "Andam Typhoon Tracker",
        short_name: "Andam Typhoon Tracker",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#000000",
        icons: [
          {
            src: "/favicon.ico",
            sizes: "192x192",
            type: "image/ico",
          },
          {
            src: "/logo.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest}"],
      },
    }),
   

    { enforce: "pre" },
    react({ include: /\.(js|jsx|ts|tsx)$/ }),
  
  ],
  build: {
    chunkSizeWarningLimit: 1000
     // Ensure the static files are generated in 'dist' folder
  },
});
