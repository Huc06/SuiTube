import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const rootDir = path.resolve(import.meta.dirname);
const sharedDir = path.resolve(rootDir, "../shared");
const assetsDir = path.resolve(rootDir, "../attached_assets");

export default defineConfig({
  root: rootDir,
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "src"),
      "@shared": sharedDir,
      "@assets": assetsDir,
    },
  },
  build: {
    outDir: path.resolve(rootDir, "dist"),
    emptyOutDir: true,
  },
});
