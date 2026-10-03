import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 8787);
const host = process.env.HOST || '0.0.0.0';
const dataDir = path.join(__dirname, 'data');
const stateFile = path.join(dataDir, 'gaenr-state.json');
const distDir = path.join(__dirname, 'dist');
const maxBodyBytes = 8 * 1024 * 1024;
let writeQueue = Promise.resolve();

const corsOrigin = process.env.CORS_ORIGIN || '*';

const send = (res, status, body, contentType = 'application/json; charset=utf-8') => {
  res.writeHead(status, {
    'Content-Type': contentType,
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  if (Buffer.isBuffer(body) || body instanceof Uint8Array) {
    res.end(body);
  } else {
    res.end(typeof body === 'string' ? body : JSON.stringify(body));
  }
};

const readState = async () => {
  try {
    return JSON.parse(await fs.readFile(stateFile, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return { version: 1, updatedAt: new Date().toISOString(), state: {} };
  }
};

const persistState = (state) => {
  writeQueue = writeQueue.then(async () => {
    await fs.mkdir(dataDir, { recursive: true });
    const temporaryFile = `${stateFile}.tmp`;
    await fs.writeFile(temporaryFile, JSON.stringify(state, null, 2), 'utf8');
    await fs.rename(temporaryFile, stateFile);
  });
  return writeQueue;
};

const readBody = (req) => new Promise((resolve, reject) => {
  let total = 0;
  let raw = '';
  req.setEncoding('utf8');
  req.on('data', (chunk) => {
    total += Buffer.byteLength(chunk);
    if (total > maxBodyBytes) {
      reject(Object.assign(new Error('Request body too large'), { statusCode: 413 }));
      req.destroy();
      return;
    }
    raw += chunk;
  });
  req.on('end', () => {
    try {
      resolve(raw ? JSON.parse(raw) : {});
    } catch {
      reject(Object.assign(new Error('Invalid JSON body'), { statusCode: 400 }));
    }
  });
  req.on('error', reject);
});

const serveStatic = async (req, res) => {
  const requestPath = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
  const relativePath = requestPath === '/' ? 'index.html' : requestPath.replace(/^\/+/, '');
  const candidate = path.resolve(distDir, relativePath);
  const safePath = candidate.startsWith(path.resolve(distDir)) ? candidate : path.join(distDir, 'index.html');
  try {
    const stat = await fs.stat(safePath);
    if (stat.isFile()) {
      const extension = path.extname(safePath);
      const contentTypes = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.json': 'application/json; charset=utf-8' };
      send(res, 200, await fs.readFile(safePath), contentTypes[extension] || 'application/octet-stream');
      return;
    }
  } catch {}
  try {
    send(res, 200, await fs.readFile(path.join(distDir, 'index.html')), 'text/html; charset=utf-8');
  } catch {
    send(res, 404, { error: 'Frontend build not found. Run npm run build first.' });
  }
};

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, '');
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);

  if (requestUrl.pathname === '/api/health' && req.method === 'GET') {
    return send(res, 200, { ok: true, service: 'gaenr-api', timestamp: new Date().toISOString() });
  }

  if (requestUrl.pathname === '/api/state') {
    try {
      if (req.method === 'GET') {
        const database = await readState();
        return send(res, 200, database);
      }
      if (req.method === 'PUT') {
        const payload = await readBody(req);
        if (!payload || typeof payload.state !== 'object' || Array.isArray(payload.state)) {
          return send(res, 400, { error: 'Expected an object property named state' });
        }
        const next = { version: 1, updatedAt: new Date().toISOString(), state: payload.state };
        await persistState(next);
        return send(res, 200, next);
      }
      return send(res, 405, { error: 'Method not allowed' });
    } catch (error) {
      return send(res, error.statusCode || 500, { error: error.message || 'Server error' });
    }
  }

  if (req.method === 'GET') return serveStatic(req, res);
  return send(res, 404, { error: 'Not found' });
});

server.listen(port, host, () => {
  console.log(`Gaenr API listening on http://${host}:${port}`);
  console.log(`Persistent state file: ${stateFile}`);
});
