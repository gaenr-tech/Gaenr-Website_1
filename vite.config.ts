import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
// @ts-ignore
import { readState, persistState, mergeState, handleSendEmail } from './serverApi.js';

function gaenrApiPlugin() {
  return {
    name: 'gaenr-api-middleware',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        const sendJson = (status: number, data: any) => {
          res.statusCode = status;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cache-Control');
          res.end(JSON.stringify(data));
        };

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cache-Control');
          return res.end();
        }

        const readBody = () =>
          new Promise<any>((resolve) => {
            let raw = '';
            req.on('data', (chunk: any) => {
              raw += chunk;
            });
            req.on('end', () => {
              try {
                resolve(raw ? JSON.parse(raw) : {});
              } catch {
                resolve({});
              }
            });
          });

        // 1. Health check
        if (url.pathname === '/api/health' && req.method === 'GET') {
          return sendJson(200, {
            ok: true,
            service: 'gaenr-vite-api',
            timestamp: new Date().toISOString(),
          });
        }

        // 2. Shared State endpoint (GET and PUT with full delta merging)
        if (url.pathname === '/api/state') {
          try {
            if (req.method === 'GET') {
              const database = await readState();
              return sendJson(200, database);
            }
            if (req.method === 'PUT') {
              const payload = await readBody();
              const currentDb = await readState();
              const merged = mergeState(currentDb.state || {}, payload);
              const nextState = {
                version: 1,
                updatedAt: new Date().toISOString(),
                state: merged,
              };
              await persistState(nextState);
              return sendJson(200, nextState);
            }
          } catch (err: any) {
            return sendJson(500, { error: err.message });
          }
        }

        // 3. Application lookup endpoint (allows guest browser to fetch specific application immediately)
        if (url.pathname === '/api/application' && req.method === 'GET') {
          try {
            const id = url.searchParams.get('id');
            if (!id) return sendJson(400, { error: 'Missing application id parameter' });
            const currentDb = await readState();
            const rawApps = currentDb.state?.['gaenr_expert_applications'];
            let apps: any[] = [];
            if (typeof rawApps === 'string') {
              try {
                apps = JSON.parse(rawApps);
              } catch {}
            } else if (Array.isArray(rawApps)) {
              apps = rawApps;
            }
            const found = apps.find((a: any) => a.id === id);
            if (!found) return sendJson(404, { error: 'Application record not found' });
            return sendJson(200, found);
          } catch (err: any) {
            return sendJson(500, { error: err.message });
          }
        }

        // 4. Send email endpoint (supports applicant confirmation, onboarding invite, and welcome emails)
        if (url.pathname === '/api/send-email' && req.method === 'POST') {
          try {
            const payload = await readBody();
            const result = await handleSendEmail(payload);
            return sendJson(200, result);
          } catch (err: any) {
            return sendJson(500, { error: err.message });
          }
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), gaenrApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve('.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/three')) {
              return 'vendor-three';
            }
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('node_modules/lucide-react')) {
              return 'vendor-icons';
            }
          },
        },
      },
      chunkSizeWarningLimit: 800,
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {
        ignored: ['**/public/**', '**/.git/**', '**/node_modules/**', '**/data/**'],
      },
    },
  };
});
