// functions/api/notify.js
// Cloudflare Pages Function: Receives, logs, and forwards real-time Gaenr platform notifications

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function onRequestGet({ env }) {
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const isD1 = Boolean(env?.DB);
    let logs = [];

    if (isD1) {
      const row = await env.DB
        .prepare('SELECT state FROM gaenr_app_state WHERE id = 1')
        .first();
      let state = {};
      try {
        state = typeof row?.state === 'string' ? JSON.parse(row.state) : row?.state || {};
      } catch {}
      logs = state.gaenr_notification_logs || [];
    }

    return new Response(JSON.stringify({ ok: true, logs }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

export async function onRequestPost({ request, env }) {
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const body = await request.json().catch(() => ({}));
    const { type, data, timestamp = new Date().toISOString() } = body;

    if (!type) {
      return new Response(JSON.stringify({ error: 'Notification type is required' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const isD1 = Boolean(env?.DB);
    const webhookUrl = env?.GOOGLE_WEBHOOK_URL || env?.VITE_GOOGLE_DRIVE_WEBHOOK_URL;
    const waGatewayUrl = env?.WHATSAPP_GATEWAY_URL;

    // 1. Audit Log in D1 storage if available
    if (isD1) {
      try {
        const row = await env.DB
          .prepare('SELECT state FROM gaenr_app_state WHERE id = 1')
          .first();
        let state = {};
        try {
          state = typeof row?.state === 'string' ? JSON.parse(row.state) : row?.state || {};
        } catch {}

        let logs = state.gaenr_notification_logs || [];
        if (!Array.isArray(logs)) logs = [];

        logs.unshift({
          id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          type,
          data,
          timestamp,
        });

        // Retain latest 150 notifications
        if (logs.length > 150) {
          logs = logs.slice(0, 150);
        }

        state.gaenr_notification_logs = logs;

        await env.DB
          .prepare(
            'INSERT INTO gaenr_app_state (id, state, updated_at) VALUES (1, ?, ?) ON CONFLICT(id) DO UPDATE SET state = excluded.state, updated_at = excluded.updated_at'
          )
          .bind(JSON.stringify(state), timestamp)
          .run();
      } catch (dbErr) {
        console.warn('Notification DB audit log warning:', dbErr);
      }
    }

    // 2. Forward to configured Webhook (e.g. Google Apps Script)
    let webhookForwarded = false;
    if (webhookUrl) {
      try {
        const hookRes = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'whatsapp_notification_event',
            type,
            data,
            timestamp,
          }),
        });
        if (hookRes.ok) webhookForwarded = true;
      } catch (hookErr) {
        console.warn('Webhook notification forwarding warning:', hookErr);
      }
    }

    // 3. Forward to WhatsApp Gateway API if configured
    let gatewayDispatched = false;
    if (waGatewayUrl) {
      try {
        const gwRes = await fetch(waGatewayUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(env?.WHATSAPP_GATEWAY_TOKEN ? { Authorization: `Bearer ${env.WHATSAPP_GATEWAY_TOKEN}` } : {}),
          },
          body: JSON.stringify({
            recipient: '8801608922800',
            type,
            data,
          }),
        });
        if (gwRes.ok) gatewayDispatched = true;
      } catch (gwErr) {
        console.warn('WhatsApp gateway dispatch warning:', gwErr);
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        type,
        timestamp,
        webhookForwarded,
        gatewayDispatched,
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
