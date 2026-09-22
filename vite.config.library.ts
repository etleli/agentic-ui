import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const workspaceRoot = path.dirname(fileURLToPath(import.meta.url));

const externalPackages = [/^react($|\/)/, /^react-dom($|\/)/, /^lucide-react($|\/)/, /^@codemirror\//, /^@lezer\//];

export default defineConfig({
  build: {
    copyPublicDir: false,
    emptyOutDir: true,
    outDir: 'dist-library',
    lib: {
      cssFileName: 'agentic-ui',
      entry: path.join(workspaceRoot, 'src', 'index.ts'),
      fileName: (format) => (format === 'es' ? 'agentic-ui.js' : 'agentic-ui.cjs'),
      formats: ['es', 'cjs'],
      name: 'AgenticUI',
    },
    rollupOptions: {
      external: (id) => externalPackages.some((pattern) => pattern.test(id)),
    },
  },
  plugins: [react()],
});
