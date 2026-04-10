/* eslint-disable no-undef */
// Librarys
import path from "path";
import svgr from "vite-plugin-svgr";
import million from "million/compiler";
import react from "@vitejs/plugin-react-swc";
import { loadEnv, defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const DEFAULT_CORS = true;
const DEFAULT_PORT = 3000;

export default function ({ mode }) {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  const PORT = process.env.VITE_PORT;
  const CORS = process.env.VITE_CORS;
  const cors = typeof CORS === "undefined" ? DEFAULT_CORS : JSON.parse(CORS);
  const port = typeof PORT === "undefined" ? DEFAULT_PORT : JSON.parse(PORT);

  return defineConfig({
    // Configure server in Vite
    server: {
      cors: cors,
      port: port,
    },

    // Define the plugins to use in Vite
    plugins: [
      svgr(),
      react(),
      million.vite({ auto: false }),
      viteSingleFile({ removeViteModuleLoader: true }),
    ],

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
