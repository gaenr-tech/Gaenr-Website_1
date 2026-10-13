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

export async function onRequestGet({ env }) {
  const connectionString = env.DATABASE_URL || env.POSTGRES_URL;
  if (!connectionString) {
    return jsonResponse({
      version: 1,
      state: {},
      warning: 'DATABASE_URL is not configured in Cloudflare environment variables',
    });
  }

  try {
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

    const rawState = rows[0]?.state || {};
    const normalizedState = {};
    for (const [k, v] of Object.entries(rawState)) {
      if (SENSITIVE_LOCAL_KEYS.includes(k)) continue;
      normalizedState[k] = typeof v === 'string' ? v : JSON.stringify(v);
    }

    return jsonResponse({
      version: 1,
      state: normalizedState,
      updatedAt: rows[0]?.updatedAt || null,
    });
  } catch (err) {
    return jsonResponse({ error: 'Database read failed', detail: err.message }, 500);
  }
}

export async function onRequestPut({ request, env }) {
  const connectionString = env.DATABASE_URL || env.POSTGRES_URL;
  if (!connectionString) {
    return jsonResponse({ error: 'DATABASE_URL is required' }, 500);
  }

  try {
    const payload = await request.json().catch(() => ({}));
    const sql = neon(connectionString);

    await sql`
      CREATE TABLE IF NOT EXISTS gaenr_app_state (
        id integer PRIMARY KEY,
        state jsonb NOT NULL DEFAULT '{}'::jsonb,
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `;

    const existingRows = await sql`
      SELECT state, updated_at AS "updatedAt"
      FROM gaenr_app_state
      WHERE id = 1
      LIMIT 1
    `;

    let currentState = {};
    if (existingRows[0]?.state && typeof existingRows[0].state === 'object') {
      currentState = { ...existingRows[0].state };
    }

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

    // 2. Direct key-value changes
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

    const savedRows = await sql`
      INSERT INTO gaenr_app_state (id, state, updated_at)
      VALUES (1, ${JSON.stringify(finalState)}::jsonb, now())
      ON CONFLICT (id) DO UPDATE
      SET state = EXCLUDED.state, updated_at = now()
      RETURNING state, updated_at AS "updatedAt"
    `;

    return jsonResponse({
      version: 1,
      state: finalState,
      updatedAt: savedRows[0]?.updatedAt || new Date().toISOString(),
    });
  } catch (err) {
    return jsonResponse({ error: 'Database update failed', detail: err.message }, 500);
  }
}
