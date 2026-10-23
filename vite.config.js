// @ts-check
import { defineConfig, loadEnv } from 'vite';
import { rotaInterpretar } from './server/interpretar.js';

export default defineConfig(({ mode }) => ({
  server: { port: 3001, strictPort: true },
  build: { outDir: 'dist', emptyOutDir: true },
  // offline-first: o navegador nunca chama serviço externo. A rota /api/interpretar
  // só chama a OpenAI se OPENAI_API_KEY e OPENAI_MODEL estiverem no .env
  plugins: [rotaInterpretar(loadEnv(mode, process.cwd(), ''))],
  define: { __DEV__: true }
}));
