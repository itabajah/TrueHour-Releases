import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://itabajah.github.io",
  base: "/TrueHour-Releases",
  outDir: "../docs",
  integrations: [tailwind(), sitemap()],
  devToolbar: {
    enabled: false,
  },
  build: {
    assets: "_astro",
  },
  vite: {
    build: {
      chunkSizeWarningLimit: 700,
      rollupOptions: {
        output: {
          manualChunks: {
            three: ["three"],
          },
        },
      },
    },
  },
});
