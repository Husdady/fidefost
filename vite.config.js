/* eslint-disable no-undef */
// Librarys
import path from "path";
import svgr from "vite-plugin-svgr";
import million from "million/compiler";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

const DEFAULT_CORS = true;
const DEFAULT_PORT = 3000;

export default function () {
  return defineConfig({
    // Configure server in Vite
    server: {
      cors: DEFAULT_CORS,
      port: DEFAULT_PORT,
    },

    // Define the plugins to use in Vite
    plugins: [svgr(), react(), million.vite({ auto: false })],

    // Resolve absolute paths
    resolve: {
      alias: {
        libs: "/src/libs",
        data: "/src/data",
        hooks: "/src/hooks",
        utils: "/src/utils",
        assets: "/src/assets",
        styles: "/src/styles",
        context: "/src/context",
        components: "/src/components",
        containers: "/src/containers",
        "~bootstrap": path.resolve(__dirname, "node_modules/bootstrap"),
      },
    },
  });
}
