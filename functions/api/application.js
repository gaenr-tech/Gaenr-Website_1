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

  const connectionString = env.DATABASE_URL || env.POSTGRES_URL;
  if (!connectionString || !id) {
    return new Response(JSON.stringify({ error: 'Application ID and DATABASE_URL are required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  try {
    const sql = neon(connectionString);
    const rows = await sql`SELECT state FROM gaenr_app_state WHERE id = 1 LIMIT 1`;
    const state = rows[0]?.state || {};
    const rawApps = state.gaenr_expert_applications;
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
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    return new Response(JSON.stringify(found), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
