import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const workspaceRoot = path.dirname(fileURLToPath(import.meta.url));
const themeConfigPath = path.join(workspaceRoot, 'src', 'theme', 'theme.config.json');

type ThemeConfigRequest = {
  method?: string;
  setEncoding: (encoding: string) => void;
  on: {
    (event: 'data', listener: (chunk: string) => void): void;
    (event: 'end', listener: () => void): void;
    (event: 'error', listener: (error: Error) => void): void;
  };
};

type ThemeConfigResponse = {
  statusCode: number;
  setHeader: (name: string, value: string) => void;
  end: (body?: string) => void;
};

const editableThemeTokens = new Set([
  '--color-foreground',
  '--color-background',
  '--color-surface',
  '--color-surface-muted',
  '--color-surface-raised',
  '--color-muted',
  '--color-border',
  '--color-border-strong',
  '--color-scrollbar-thumb',
  '--color-code-background',
  '--color-code-foreground',
  '--color-code-gutter-background',
  '--color-code-active-line',
  '--color-code-selection',
  '--color-accent',
  '--color-trading-positive',
  '--color-trading-negative',
  '--color-trading-warning',
  '--color-trading-neutral',
  '--radius-xs',
  '--radius-sm',
  '--radius-md',
  '--radius-lg',
  '--motion-duration-press',
  '--motion-duration-popup',
  '--motion-duration-list',
  '--motion-duration-counter',
  '--motion-duration-indicator',
]);

function sendJson(res: ThemeConfigResponse, statusCode: number, payload: unknown) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeThemeConfig(value: unknown): Record<string, string> {
  if (!isRecord(value)) {
    throw new Error('Theme config must be a JSON object.');
  }

  return Object.fromEntries(
    Object.entries(value).filter(([key, nextValue]) => editableThemeTokens.has(key) && typeof nextValue === 'string'),
  ) as Record<string, string>;
}

function readRequestBody(req: ThemeConfigRequest) {
  return new Promise<string>((resolve, reject) => {
    let body = '';

    req.setEncoding('utf8');
    req.on('data', (chunk: string) => {
      body += chunk;
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function themeConfigApiPlugin(): Plugin {
  return {
    name: 'agentic-theme-config-api',
    configureServer(server) {
      server.middlewares.use('/api/theme-config', async (request, response) => {
        const req = request as ThemeConfigRequest;
        const res = response as ThemeConfigResponse;

        try {
          if (req.method === 'GET') {
            const config = await fs.readFile(themeConfigPath, 'utf8');
            sendJson(res, 200, JSON.parse(config));
            return;
          }

          if (req.method === 'PUT') {
            const body = await readRequestBody(req);
            const nextConfig = normalizeThemeConfig(JSON.parse(body));

            await fs.mkdir(path.dirname(themeConfigPath), { recursive: true });
            await fs.writeFile(themeConfigPath, `${JSON.stringify(nextConfig, null, 2)}\n`, 'utf8');
            sendJson(res, 200, nextConfig);
            return;
          }

          sendJson(res, 405, { error: 'Method not allowed' });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Theme config request failed.';
          sendJson(res, 400, { error: message });
        }
      });
    },
  };
}

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@codemirror') || id.includes('@lezer')) {
            return 'codemirror';
          }

          if (id.includes('node_modules')) {
            return 'vendor';
          }

          return undefined;
        },
      },
    },
  },
  plugins: [react(), themeConfigApiPlugin()],
});
