// functions/api/id-card.js
// Cloudflare Pages Function: Serves and stores official verified Digital ID Card badges

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

async function initIdCardTable(db) {
  if (!db) return;
  try {
    await db
      .prepare(
        'CREATE TABLE IF NOT EXISTS gaenr_id_cards (code TEXT PRIMARY KEY, image_data TEXT NOT NULL, created_at TEXT NOT NULL)'
      )
      .run();
  } catch (err) {
    console.error('initIdCardTable error:', err);
  }
}

// Convert base64 data URL to Uint8Array for raw binary stream response
function base64ToUint8Array(base64Str) {
  const clean = base64Str.includes(',') ? base64Str.split(',')[1] : base64Str;
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = (url.searchParams.get('code') || '').toUpperCase().trim();

  if (!code) {
    return new Response(JSON.stringify({ error: 'Expert code is required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    if (env.DB) {
      await initIdCardTable(env.DB);
      const row = await env.DB
        .prepare('SELECT image_data FROM gaenr_id_cards WHERE code = ?')
        .bind(code)
        .first();

      if (row && row.image_data) {
        const bytes = base64ToUint8Array(row.image_data);
        return new Response(bytes, {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'image/png',
            'Content-Disposition': `attachment; filename="GAENR-ID-${code}.png"`,
            'Cache-Control': 'public, max-age=86400, s-maxage=604800',
          },
        });
      }
    }
  } catch (err) {
    console.error('GET /api/id-card error:', err);
  }

  // Fallback: If not found in id_cards table, redirect to public live profile or return 404
  return new Response(
    JSON.stringify({ error: 'ID card image not found for code ' + code }),
    {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const code = (body.code || '').toUpperCase().trim();
    const imageData = body.imageData || body.image_data || body.cardImage || '';

    if (!code || !imageData) {
      return new Response(
        JSON.stringify({ error: 'Missing code or imageData' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (env.DB) {
      await initIdCardTable(env.DB);
      const now = new Date().toISOString();
      await env.DB
        .prepare(
          'INSERT INTO gaenr_id_cards (code, image_data, created_at) VALUES (?, ?, ?) ON CONFLICT(code) DO UPDATE SET image_data = excluded.image_data, created_at = excluded.created_at'
        )
        .bind(code, imageData, now)
        .run();
    }

    return new Response(
      JSON.stringify({ ok: true, code, message: 'ID card saved successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('POST /api/id-card error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
