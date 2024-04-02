import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html")
      },
      output: {
        chunkFileNames: "static/js/[name]-[hash].js",
        entryFileNames: "static/js/[name]-[hash].js",
        assetFileNames: (assetInfo) => {
          if (
            assetInfo.type === "asset" &&
            /\.(jpe?g|png|gif|svg)$/i.test(assetInfo.name!)
          ) {
            return "static/img/[name].[hash][ext]";
          }
          if (
            assetInfo.type === "asset" &&
            /\.(ttf|woff|woff2|eot)$/i.test(assetInfo.name!)
          ) {
            return "static/fonts/[name].[hash][ext]";
          }
          return "static/[ext]/name1-[hash].[ext]";
        }
      }
    }
    // assetsInlineLimit: 1
  }
});
