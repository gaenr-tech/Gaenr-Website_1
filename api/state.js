import { neon } from '@neondatabase/serverless';

const getDatabase = () => {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not configured in Vercel project settings');
  }
  return neon(connectionString);
};

const send = (res, status, body) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cache-Control, Pragma');
  res.status(status).json(body);
};

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cache-Control, Pragma');
    return res.status(204).end();
  }

  if (req.method !== 'GET' && req.method !== 'PUT') {
    return send(res, 405, { error: 'Method not allowed' });
  }

  try {
    const sql = getDatabase();
    await sql`
      CREATE TABLE IF NOT EXISTS gaenr_app_state (
        id integer PRIMARY KEY,
        state jsonb NOT NULL DEFAULT '{}'::jsonb,
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `;

    if (req.method === 'GET') {
      const rows = await sql`
        SELECT state, updated_at AS "updatedAt"
        FROM gaenr_app_state
        WHERE id = 1
        LIMIT 1
      `;
      const row = rows[0];
      const rawState = row?.state || {};
      const normalizedState = {};
      for (const [k, v] of Object.entries(rawState)) {
        normalizedState[k] = typeof v === 'string' ? v : JSON.stringify(v);
      }
      return send(res, 200, {
        version: 1,
        state: normalizedState,
        updatedAt: row?.updatedAt || null,
      });
    }

    const incomingState = req.body?.state;
    const changes = req.body?.changes;
    const arrayChanges = Array.isArray(req.body?.arrayChanges) ? req.body.arrayChanges : [];
    const deletedKeys = Array.isArray(req.body?.deletedKeys) ? req.body.deletedKeys : [];

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

    if (incomingState && typeof incomingState === 'object' && !Array.isArray(incomingState)) {
      // First-browser migration or full state seed if table is currently empty
      if (Object.keys(currentState).length === 0) {
        for (const [key, value] of Object.entries(incomingState)) {
          currentState[key] = typeof value === 'string' ? value : JSON.stringify(value);
        }
      }
    } else if ((!changes || typeof changes !== 'object' || Array.isArray(changes)) && arrayChanges.length === 0 && deletedKeys.length === 0) {
      return send(res, 400, { error: 'Expected state, changes, arrayChanges, or deletedKeys' });
    }

    // Process array changes by merging on id or code
    for (const change of arrayChanges) {
      const key = change?.key;
      if (!key || typeof key !== 'string') continue;
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
      upserts.forEach((item) => {
        upsertMap.set(getItemKey(item), item);
      });

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
      for (const remainingUpsert of upsertMap.values()) {
        merged.push(remainingUpsert);
      }

      currentState[key] = JSON.stringify(merged);
    }

    // Process general key-value changes
    if (changes && typeof changes === 'object' && !Array.isArray(changes)) {
      for (const [key, value] of Object.entries(changes)) {
        if (typeof key !== 'string') continue;
        currentState[key] = typeof value === 'string' ? value : JSON.stringify(value);
      }
    }

    // Process deleted keys
    for (const key of deletedKeys) {
      if (typeof key === 'string' && key.length > 0) {
        delete currentState[key];
      }
    }

    // Normalize entire currentState so all values stored are JSON strings
    const finalState = {};
    for (const [k, v] of Object.entries(currentState)) {
      finalState[k] = typeof v === 'string' ? v : JSON.stringify(v);
    }

    const savedRows = await sql`
      INSERT INTO gaenr_app_state (id, state, updated_at)
      VALUES (1, ${JSON.stringify(finalState)}::jsonb, now())
      ON CONFLICT (id) DO UPDATE
      SET state = EXCLUDED.state, updated_at = now()
      RETURNING state, updated_at AS "updatedAt"
    `;

    return send(res, 200, {
      version: 1,
      state: finalState,
      updatedAt: savedRows[0]?.updatedAt || new Date().toISOString(),
    });
  } catch (error) {
    console.error('Gaenr state API error:', error);
    return send(res, 500, {
      error: 'Shared database is unavailable',
      detail: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
