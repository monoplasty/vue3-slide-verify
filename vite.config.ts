import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "/src"),
    },
  },
  // 发布GitHub pages 是打开
  build: {
    outDir: "docs",
  },
  // 发布npm包时
  /* build: {
    lib: {
      entry: path.resolve(__dirname, "src/components/index.ts"),
      name: "vue3SlideVerify",
      fileName: (format) => `vue3-slide-verify.${format}.js`,
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ["vue"],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: "Vue",
        },
      },
    },
  }, */
});
