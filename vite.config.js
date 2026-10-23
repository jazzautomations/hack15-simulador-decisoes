// @ts-check
import { defineConfig, loadEnv } from 'vite';
import { rotaInterpretar } from './server/interpretar.js';
import { rotaExplicar } from './server/explicar.js';

export default defineConfig(({ mode }) => ({
  server: { port: 3001, strictPort: true },
  build: { outDir: 'dist', emptyOutDir: true },
  // offline-first: o navegador nunca chama serviço externo. As rotas /api/interpretar e /api/explicar
  // só chamam a OpenAI se OPENAI_API_KEY e OPENAI_MODEL estiverem no .env
  plugins: (() => {
    const env = loadEnv(mode, process.cwd(), '');
    return [rotaInterpretar(env), rotaExplicar(env)];
  })(),
  define: { __DEV__: true }
}));
