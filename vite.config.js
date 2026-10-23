// @ts-check
import { defineConfig } from 'vite';
export default defineConfig({
  server: { port: 3001, strictPort: true },
  build: { outDir: 'dist', emptyOutDir: true },
  // offline-first: nada de fetch externo
  define: { __DEV__: true }
});
