export async function onRequestGet({ env }) {
  return new Response(
    JSON.stringify({
      ok: true,
      service: 'gaenr-cloudflare-pages-api',
      databaseConfigured: Boolean(env.DATABASE_URL || env.POSTGRES_URL),
      emailConfigured: Boolean(env.RESEND_API_KEY && env.EMAIL_FROM),
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Cache-Control',
    },
  });
}
