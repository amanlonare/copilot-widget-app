import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    widget: "src/embed/index.tsx",
  },
  outDir: "public/embed",
  format: ["iife"],           // Browser-consumable bundle
  globalName: "CopilotWidget",
  platform: "browser",
  target: "es2020",
  bundle: true,
  minify: false,              // Set to true for production, false for easier debugging now
  clean: true,
  sourcemap: false,
  injectStyle: true,          // Inlines CSS into the JS bundle
  dts: false,
  noExternal: [/.*/],         // Bundle everything including React
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
    "process.env.NEXT_PUBLIC_ORCHESTRATOR_URL": JSON.stringify("http://localhost:8000"),
    "__WIDGET_VERSION__": JSON.stringify(process.env.npm_package_version ?? "0.0.0"),
  },
  esbuildOptions(options) {
    options.jsx = "automatic";
    options.loader = {
      ".txt": "text",
    };
  },
});
