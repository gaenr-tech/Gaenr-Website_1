import { neon } from '@neondatabase/serverless';

const getDatabase = () => {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not configured in Vercel project settings');
  }
  return neon(connectionString);
};

const send = (res, status, body) => {
  res.status(status).setHeader('Cache-Control', 'no-store').json(body);
};

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
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
      return send(res, 200, {
        version: 1,
        state: row?.state || {},
        updatedAt: row?.updatedAt || null,
      });
    }

    const incomingState = req.body?.state;
    const changes = req.body?.changes;
    const arrayChanges = Array.isArray(req.body?.arrayChanges) ? req.body.arrayChanges : [];
    const deletedKeys = Array.isArray(req.body?.deletedKeys) ? req.body.deletedKeys : [];

    if (incomingState && typeof incomingState === 'object' && !Array.isArray(incomingState)) {
      // Used only for first-browser migration when the shared table is empty.
      const rows = await sql`
        INSERT INTO gaenr_app_state (id, state, updated_at)
        VALUES (1, ${JSON.stringify(incomingState)}::jsonb, now())
        ON CONFLICT (id) DO NOTHING
        RETURNING state, updated_at AS "updatedAt"
      `;
      if (rows[0]) return send(res, 200, { version: 1, ...rows[0] });
    } else if ((!changes || typeof changes !== 'object' || Array.isArray(changes)) && arrayChanges.length === 0) {
      return send(res, 400, { error: 'Expected state or changes object' });
    }

    const safeChanges = {};
    const normalizedArrayChanges = [...arrayChanges];
    for (const [key, value] of Object.entries(changes || {})) {
      let parsed;
      try { parsed = typeof value === 'string' ? JSON.parse(value) : value; } catch { parsed = null; }
      if (key.startsWith('gaenr_') && Array.isArray(parsed)) {
        // Backward compatibility: old deployed clients still send full arrays.
        // Treat them as upserts so they cannot erase records created elsewhere.
        normalizedArrayChanges.push({ key, upserts: parsed, deletes: [] });
      } else {
        safeChanges[key] = value;
      }
    }

    await sql`
      INSERT INTO gaenr_app_state (id, state, updated_at)
      VALUES (1, '{}'::jsonb, now())
      ON CONFLICT (id) DO NOTHING
    `;

    // Array records are merged by id/code inside an atomic UPDATE. This prevents
    // two browsers saving stale full arrays from deleting each other's records.
    for (const change of normalizedArrayChanges) {
      const key = typeof change?.key === 'string' ? change.key : '';
      const upserts = Array.isArray(change?.upserts) ? change.upserts : [];
      const deletes = Array.isArray(change?.deletes) ? change.deletes : [];
      if (!key || !key.startsWith('gaenr_') || (upserts.length === 0 && deletes.length === 0)) continue;

      await sql`
        WITH existing_items AS (
          SELECT elements.item, elements.item_order
          FROM gaenr_app_state AS current_state,
               jsonb_array_elements(COALESCE(current_state.state->${key}, '[]'::jsonb))
                 WITH ORDINALITY AS elements(item, item_order)
          WHERE current_state.id = 1
        ),
        merged_items AS (
          SELECT existing_items.item, existing_items.item_order
          FROM existing_items
          WHERE NOT EXISTS (
            SELECT 1
            FROM jsonb_array_elements(${JSON.stringify(deletes)}::jsonb) AS deleted(item)
            WHERE COALESCE(deleted.item->>'code', deleted.item->>'id', deleted.item::text)
                = COALESCE(existing_items.item->>'code', existing_items.item->>'id', existing_items.item::text)
          )
          AND NOT EXISTS (
            SELECT 1
            FROM jsonb_array_elements(${JSON.stringify(upserts)}::jsonb) AS replacement(item)
            WHERE COALESCE(replacement.item->>'code', replacement.item->>'id', replacement.item::text)
                = COALESCE(existing_items.item->>'code', existing_items.item->>'id', existing_items.item::text)
          )
          UNION ALL
          SELECT additions.item, 1000000000 + additions.item_order
          FROM jsonb_array_elements(${JSON.stringify(upserts)}::jsonb)
            WITH ORDINALITY AS additions(item, item_order)
        ),
        merged AS (
          SELECT COALESCE(jsonb_agg(merged_items.item ORDER BY merged_items.item_order), '[]'::jsonb) AS value
          FROM merged_items
        )
        UPDATE gaenr_app_state AS target
        SET state = jsonb_set(target.state, ARRAY[${key}], merged.value, true), updated_at = now()
        FROM merged
        WHERE target.id = 1
      `;
    }

    if (Object.keys(safeChanges).length > 0) {
      await sql`
        INSERT INTO gaenr_app_state (id, state, updated_at)
        VALUES (1, ${JSON.stringify(safeChanges)}::jsonb, now())
        ON CONFLICT (id) DO UPDATE
        SET state = gaenr_app_state.state || EXCLUDED.state, updated_at = now()
      `;
    }

    for (const key of deletedKeys) {
      if (typeof key === 'string' && key.length > 0) {
        await sql`
          UPDATE gaenr_app_state
          SET state = state - ${key}, updated_at = now()
          WHERE id = 1
        `;
      }
    }

    const rows = await sql`
      SELECT state, updated_at AS "updatedAt"
      FROM gaenr_app_state
      WHERE id = 1
      LIMIT 1
    `;

    return send(res, 200, { version: 1, ...rows[0] });
  } catch (error) {
    console.error('Gaenr state API error:', error);
    return send(res, 500, {
      error: 'Shared database is unavailable',
      detail: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
