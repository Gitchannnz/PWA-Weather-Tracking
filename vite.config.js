import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";

import react from "@vitejs/plugin-react";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VitePWA({
      manifest: {
        includeAssets: ["favicon.ico", "apple-touch-icon.png", "assets/*"],
        name: "Cyclone Tracker",
        short_name: "Cyclone Tracker",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#000000",
        icons: [
          {
            src: "/favicon.ico",
            sizes: "192x192",
            type: "image/png",
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
    createHtmlPlugin({
      inject: {
        data: {
          title: "Cyclone Tracker",
          description: "This is the official website of Bakester Mumshie.",
          keywords: "Bakester Mumshie, official website, SEO",
          author: "Bakester Mumshie",
        },
      },
    }),

    { enforce: "pre" },
    react({ include: /\.(js|jsx|ts|tsx)$/ }),
  
  ],
  build: {
    outDir: "dist", // Ensure the static files are generated in 'dist' folder
  },
});
