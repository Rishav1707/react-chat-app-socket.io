import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const manifestForPlugIn = {
  registerType: "autoUpdate",
  includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
  manifest: {
    short_name: "TalkWise",
    name: "TalkWise: Where seamless conversation meets simplicity",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/maskable_icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    id: "/",
    start_url: "/",
    background_color: "#2a2a2a",
    display: "standalone",
    scope: "/",
    theme_color: "#1f4645",
    description:
      "Introducing TalkWise: instant messaging, voice and video calls, and user-friendly design. Stay connected, stay secure, stay social. Try it now!",
    display_override: ["fullscreen", "minimal-ui"],
    orientation: "portrait",
    screenshots: [
      {
        src: "/screenshot1.png",
        type: "image/png",
        sizes: "891x872",
        form_factor: "narrow",
      },
      {
        src: "/screenshot2.png",
        type: "image/png",
        sizes: "1920x870",
        form_factor: "wide",
      },
    ],
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA(manifestForPlugIn)],
});
