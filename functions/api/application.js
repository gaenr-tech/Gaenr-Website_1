import { neon } from '@neondatabase/serverless';

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  const isD1 = Boolean(env.DB);
  const connectionString = env.DATABASE_URL || env.POSTGRES_URL;

  if (!id) {
    return new Response(JSON.stringify({ error: 'Application ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  try {
    let rawApps = null;

    if (isD1) {
      const row = await env.DB
        .prepare('SELECT state FROM gaenr_app_state WHERE id = 1')
        .first();
      let state = {};
      try {
        state = typeof row?.state === 'string' ? JSON.parse(row.state) : row?.state || {};
      } catch {}
      rawApps = state.gaenr_expert_applications;
    } else if (connectionString) {
      const sql = neon(connectionString);
      const rows = await sql`SELECT state FROM gaenr_app_state WHERE id = 1 LIMIT 1`;
      const state = rows[0]?.state || {};
      rawApps = state.gaenr_expert_applications;
    }

    let apps = [];
    if (Array.isArray(rawApps)) {
      apps = rawApps;
    } else if (typeof rawApps === 'string') {
      try {
        apps = JSON.parse(rawApps);
      } catch {}
    }

    const found = apps.find((a) => a && a.id === id);
    if (!found) {
      return new Response(JSON.stringify({ error: 'Application not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    return new Response(JSON.stringify(found), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
