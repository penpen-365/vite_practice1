import { defineConfig } from "vite";

import path from "path";
import { glob } from "glob";

import handlebars from "vite-plugin-handlebars";
import eslint from "vite-plugin-eslint";
import stylelint from "vite-plugin-stylelint";

const is_dev_mode = process.env.NODE_ENV !== "production";

const input_dir = path.resolve(__dirname, "src");
const output_dir = path.resolve(__dirname, "dist");

export default defineConfig({
  root: input_dir,
  base: "/",
  build: {
    outDir: output_dir,
    emptyOutDir: true,
    preserveModules: true,
    rollupOptions: {
      input: {
        // 先頭にアンダーバーがつかないHTML,CSSはすべてエントリーポイントとする（MPA）
        ...Object.fromEntries(
          glob.sync(path.resolve(input_dir, "**/!(_)*.{html,css}")).map((filepath) => {
            const relative_path = path.relative(input_dir, filepath);
            const basename = path.basename(relative_path);
            const ext = path.extname(basename);
            return [relative_path.replace(ext, ""), filepath];
          }),
        ),
      },
      output: {
        assetFileNames: ({ name }) => {
          const filepath = glob.sync(path.resolve(input_dir, "**/" + name)).shift();
          const relative_path = path.relative(input_dir, filepath);
          return relative_path;
        },
        entryFileNames: (entryInfo) => {
          const relative_path = path.relative(input_dir, entryInfo.facadeModuleId);
          const extname = path.extname(relative_path);
          let result = relative_path;
          if (/.html/.test(entryInfo.facadeModuleId)) {
            for (let i = 0; i < entryInfo.moduleIds.length; i++) {
              const item = entryInfo.moduleIds[i];
              if (/.js/.test(item)) {
                result = path.relative(input_dir, item);
                break;
              }
            }
          }
          if (/.css/.test(entryInfo.facadeModuleId)) {
            result = result.replace(extname, "");
          }
          return result;
        },
        manualChunks: (id) => {
          if (id.includes("modulepreload-polyfill")) {
            return "modulepreload-polyfill";
          }
        },
        chunkFileNames: (chunkInfo) => {
          if (chunkInfo.name.includes("modulepreload-polyfill")) {
            return "assets/js/modules/vendor/[name].js";
          }
          return "assets/js/modules/[name].js";
        },
      },
    },
  },
  CSS: {
    devSourcemap: is_dev_mode,
  },
  plugins: [
    handlebars(),
    eslint({
      fix: true,
      include: path.resolve(input_dir, "**/*.js"),
    }),
    stylelint({
      fix: true,
      include: path.resolve(input_dir, "**/*.css"),
      exclude: ["node_modules", "virtual", "dist", "vendor"],
      cache: true,
      chokidar: true,
      lintOnStart: true,
    }),

  ],
});
