import { neon } from '@neondatabase/serverless';

const SENSITIVE_LOCAL_KEYS = ['gaenr_admin_logged', 'gaenr_current_employee', 'gaenr_admin_session'];

const corsHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Cache-Control, Pragma',
};

const jsonResponse = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: corsHeaders });

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

// ---------------------------------------------------------------------------
// Cloudflare D1 Native Edge Helpers
// ---------------------------------------------------------------------------
let d1Initialized = false;

async function initD1Table(db) {
  if (d1Initialized) return;
  try {
    await db
      .prepare('CREATE TABLE IF NOT EXISTS gaenr_app_state (id INTEGER PRIMARY KEY, state TEXT NOT NULL, updated_at TEXT NOT NULL)')
      .run();
    d1Initialized = true;
  } catch (err) {
    console.error('initD1Table error:', err);
  }
}

async function getD1State(db) {
  await initD1Table(db);
  const row = await db
    .prepare('SELECT state, updated_at AS updatedAt FROM gaenr_app_state WHERE id = 1')
    .first();
  if (!row) return { state: {}, updatedAt: null };

  let raw = {};
  try {
    raw = typeof row.state === 'string' ? JSON.parse(row.state) : row.state || {};
  } catch {}

  const normalized = {};
  for (const [k, v] of Object.entries(raw)) {
    if (SENSITIVE_LOCAL_KEYS.includes(k)) continue;
    normalized[k] = typeof v === 'string' ? v : JSON.stringify(v);
  }
  return { state: normalized, updatedAt: row.updatedAt };
}

async function setD1State(db, finalState) {
  await initD1Table(db);
  const now = new Date().toISOString();
  await db
    .prepare('INSERT INTO gaenr_app_state (id, state, updated_at) VALUES (1, ?, ?) ON CONFLICT(id) DO UPDATE SET state = excluded.state, updated_at = excluded.updated_at')
    .bind(JSON.stringify(finalState), now)
    .run();
  return { state: finalState, updatedAt: now };
}

// ---------------------------------------------------------------------------
// Neon Postgres Helpers (Fallback)
// ---------------------------------------------------------------------------
async function getPgState(connectionString) {
  const sql = neon(connectionString);
  await sql`
    CREATE TABLE IF NOT EXISTS gaenr_app_state (
      id integer PRIMARY KEY,
      state jsonb NOT NULL DEFAULT '{}'::jsonb,
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  const rows = await sql`
    SELECT state, updated_at AS "updatedAt"
    FROM gaenr_app_state
    WHERE id = 1
    LIMIT 1
  `;
  const raw = rows[0]?.state || {};
  const normalized = {};
  for (const [k, v] of Object.entries(raw)) {
    if (SENSITIVE_LOCAL_KEYS.includes(k)) continue;
    normalized[k] = typeof v === 'string' ? v : JSON.stringify(v);
  }
  return { state: normalized, updatedAt: rows[0]?.updatedAt || null };
}

async function setPgState(connectionString, finalState) {
  const sql = neon(connectionString);
  await sql`
    CREATE TABLE IF NOT EXISTS gaenr_app_state (
      id integer PRIMARY KEY,
      state jsonb NOT NULL DEFAULT '{}'::jsonb,
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  const saved = await sql`
    INSERT INTO gaenr_app_state (id, state, updated_at)
    VALUES (1, ${JSON.stringify(finalState)}::jsonb, now())
    ON CONFLICT (id) DO UPDATE
    SET state = EXCLUDED.state, updated_at = now()
    RETURNING state, updated_at AS "updatedAt"
  `;
  return { state: finalState, updatedAt: saved[0]?.updatedAt || new Date().toISOString() };
}

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------
export async function onRequestGet({ env }) {
  // 1. Prioritize Cloudflare Native D1
  if (env.DB) {
    try {
      const res = await getD1State(env.DB);
      return jsonResponse({ version: 1, ...res, database: 'cloudflare-d1' });
    } catch (err) {
      return jsonResponse({ error: 'Cloudflare D1 read failed', detail: err.message }, 500);
    }
  }

  // 2. Fallback to Postgres / Neon
  const connectionString = env.DATABASE_URL || env.POSTGRES_URL;
  if (connectionString) {
    try {
      const res = await getPgState(connectionString);
      return jsonResponse({ version: 1, ...res, database: 'postgres' });
    } catch (err) {
      return jsonResponse({ error: 'Postgres read failed', detail: err.message }, 500);
    }
  }

  return jsonResponse({
    version: 1,
    state: {},
    warning: 'No database configured. Bind Cloudflare D1 as "DB" or set DATABASE_URL.',
  });
}

export async function onRequestPut({ request, env }) {
  const isD1 = Boolean(env.DB);
  const connectionString = env.DATABASE_URL || env.POSTGRES_URL;

  if (!isD1 && !connectionString) {
    return jsonResponse({ error: 'No database configured. Bind Cloudflare D1 as "DB" or set DATABASE_URL.' }, 500);
  }

  try {
    const payload = await request.json().catch(() => ({}));

    // Read current state
    let currentData = { state: {} };
    if (isD1) {
      currentData = await getD1State(env.DB);
    } else {
      currentData = await getPgState(connectionString);
    }

    let currentState = { ...(currentData.state || {}) };
    for (const key of SENSITIVE_LOCAL_KEYS) {
      delete currentState[key];
    }

    // 1. Full snapshot
    if (payload.state && typeof payload.state === 'object' && !Array.isArray(payload.state)) {
      for (const [key, value] of Object.entries(payload.state)) {
        if (SENSITIVE_LOCAL_KEYS.includes(key)) continue;
        currentState[key] = typeof value === 'string' ? value : JSON.stringify(value);
      }
    }

    // 2. Changes
    if (payload.changes && typeof payload.changes === 'object' && !Array.isArray(payload.changes)) {
      for (const [key, value] of Object.entries(payload.changes)) {
        if (typeof key !== 'string' || SENSITIVE_LOCAL_KEYS.includes(key)) continue;
        currentState[key] = typeof value === 'string' ? value : JSON.stringify(value);
      }
    }

    // 3. Array changes
    if (Array.isArray(payload.arrayChanges)) {
      for (const change of payload.arrayChanges) {
        const key = change?.key;
        if (!key || typeof key !== 'string' || SENSITIVE_LOCAL_KEYS.includes(key)) continue;
        const upserts = Array.isArray(change.upserts) ? change.upserts : [];
        const deletes = Array.isArray(change.deletes) ? change.deletes : [];
        if (upserts.length === 0 && deletes.length === 0) continue;

        let existingItems = [];
        const rawVal = currentState[key];
        if (Array.isArray(rawVal)) {
          existingItems = rawVal;
        } else if (typeof rawVal === 'string') {
          try {
            const parsed = JSON.parse(rawVal);
            if (Array.isArray(parsed)) existingItems = parsed;
          } catch {}
        }

        const getItemKey = (item) => {
          if (!item) return '';
          if (typeof item === 'object') {
            if (item.code) return `code:${item.code}`;
            if (item.id) return `id:${item.id}`;
          }
          return `val:${JSON.stringify(item)}`;
        };

        const deleteSet = new Set(deletes.map(getItemKey));
        const upsertMap = new Map();
        upserts.forEach((item) => upsertMap.set(getItemKey(item), item));

        const merged = [];
        for (const item of existingItems) {
          const k = getItemKey(item);
          if (deleteSet.has(k)) continue;
          if (upsertMap.has(k)) {
            merged.push(upsertMap.get(k));
            upsertMap.delete(k);
          } else {
            merged.push(item);
          }
        }
        for (const rem of upsertMap.values()) {
          merged.push(rem);
        }
        currentState[key] = JSON.stringify(merged);
      }
    }

    // 4. Deleted keys
    if (Array.isArray(payload.deletedKeys)) {
      for (const key of payload.deletedKeys) {
        if (typeof key === 'string') delete currentState[key];
      }
    }

    for (const key of SENSITIVE_LOCAL_KEYS) {
      delete currentState[key];
    }

    const finalState = {};
    for (const [k, v] of Object.entries(currentState)) {
      if (SENSITIVE_LOCAL_KEYS.includes(k)) continue;
      finalState[k] = typeof v === 'string' ? v : JSON.stringify(v);
    }

    let saved = null;
    if (isD1) {
      saved = await setD1State(env.DB, finalState);
    } else {
      saved = await setPgState(connectionString, finalState);
    }

    return jsonResponse({
      version: 1,
      state: finalState,
      updatedAt: saved.updatedAt,
      database: isD1 ? 'cloudflare-d1' : 'postgres',
    });
  } catch (err) {
    return jsonResponse({ error: 'Database update failed', detail: err.message }, 500);
  }
}
