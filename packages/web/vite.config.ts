import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    rollupOptions: {
      // config/loader.ts imports node:fs / node:path, which are Node-only.
      // Those code paths are never reached in the browser (BUNDLED_CONFIG is
      // assembled at compile-time from imported JSON). Mark them external so
      // the bundler doesn't try to polyfill them.
      external: ['node:fs', 'node:path'],
    },
  },
  test: {
    environment: 'happy-dom',
    setupFiles: ['./src/test-setup.ts'],
    globals: true,
  },
});
