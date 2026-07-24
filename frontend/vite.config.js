import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.js",

      registerType: "autoUpdate",

      manifest: {
        name: "Quavron",
        short_name: "Quavron",
        description: "Next Generation Platform",
        theme_color: "#000000",
        background_color: "#000000",
        display: "standalone",

        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
