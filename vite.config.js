import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      include: "**/*.{jsx,js}",
    }),
  ],
  resolve: {
    alias: {
      components: path.resolve(__dirname, "./src/components"),
      hooks: path.resolve(__dirname, "./src/hooks"),
      icons: path.resolve(__dirname, "./src/icons"),
      utils: path.resolve(__dirname, "./src/utils"),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
  server: {
    port: 3000,
    open: true,
    middlewareMode: false,
  },
  build: {
    outDir: "build",
  },
  assetsInclude: ["**/*.gz"],
  publicDir: "public",
});
