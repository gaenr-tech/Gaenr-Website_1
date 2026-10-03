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
    } else if (!changes || typeof changes !== 'object' || Array.isArray(changes)) {
      return send(res, 400, { error: 'Expected state or changes object' });
    }

    await sql`
      INSERT INTO gaenr_app_state (id, state, updated_at)
      VALUES (1, ${JSON.stringify(changes || {})}::jsonb, now())
      ON CONFLICT (id) DO UPDATE
      SET state = gaenr_app_state.state || EXCLUDED.state, updated_at = now()
    `;

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
