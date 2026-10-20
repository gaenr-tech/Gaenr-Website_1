const SENSITIVE_LOCAL_KEYS = [
  'gaenr_admin_logged',
  'gaenr_current_employee',
  'gaenr_admin_session',
  'gaenr_theme',
  'gaenr_device_theme',
];

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
// Automated Meta WhatsApp Cloud Notification Helpers
// ---------------------------------------------------------------------------
const PERMANENT_META_TOKEN = 'EAAZAXOZCz9pG8BSscq88jdO9l6KFFW5OXdCHpzNZA0lETgkvfPZBc6aFrMajogZCcf6VkXZCR494zDbx8HiN5rtuaQxiRPTxwoXdJaVGP7DyBYKuHXuvGZCUwRXv2ZBTnZA6h4CnI7chbALiogDAcTSmDlZBQd7VGlnJT4J1LSGQrDCVdmtEeFxlFHPKFaTiAv6oZCBCAZDZD';
const META_PHONE_ID = '1436780476182860';
const TARGET_WA_NUMBER = '8801608922800';

function formatWhatsAppMessage(type, data) {
  if (type === 'feedback_submission') {
    return `*New Platform Feedback*

• From: ${data?.name || 'Anonymous'} (${data?.userType || 'Visitor'})
• Category: ${data?.category || 'General'}
• Email: ${data?.email || 'Not provided'}

Message:
"${data?.message || ''}"

*— Ginny, Gaenr*`;
  }
  if (type === 'expert_application') {
    const skill = (data?.otherSkill || data?.skill || 'Digital Creator').split('/')[0].replace(/[\u0980-\u09FF]/g, '').trim();
    const occupationName = data?.otherOccupation || data?.occupation || 'N/A';
    const addressName = data?.otherAddress || data?.address || 'Bangladesh';
    return `*New Expert Application*

• Name: ${data?.fullName || 'N/A'}
• Skill: ${skill}
• WhatsApp: ${data?.whatsapp || 'N/A'}
• Email: ${data?.email || 'N/A'}
• Occupation: ${occupationName}
• Location: ${addressName}
• Experience: ${data?.experience || 'Verified'}
• Portfolio: ${data?.portfolioUrl || 'None provided'}

Action: Review and approve via gaenr.com/admin

*— Ginny, Gaenr*`;
  }
  if (type === 'expert_onboarding') {
    const skill = (data?.skill || 'Verified Expert').split('/')[0].replace(/[\u0980-\u09FF]/g, '').trim();
    const payout = data?.payoutMethod === 'bank'
      ? `Bank (${data?.bankName || 'Bank'} - Acc: ${data?.accountNumber || 'Provided'})`
      : `MFS (${data?.mfsProvider || 'bKash'} - ${data?.mfsNumber || 'Provided'})`;
    return `*Expert Onboarding Completed*

• Name: ${data?.fullName || 'N/A'}
• Skill: ${skill}
• WhatsApp: ${data?.whatsapp || 'Registered in Admin'}
• Email: ${data?.email || 'Registered in Admin'}
• Avatar: ${data?.avatarName || 'Standard Verified Avatar'}
• Payout: ${payout}

Statement:
"${data?.statement || 'Ready to deliver quality work.'}"

Action: Review in Gaenr Admin and activate profile live: https://gaenr.com/admin

*— Ginny, Gaenr*`;
  }
  if (type === 'ginny_unanswered_question') {
    return `*Client Query Escalation*

Client Question:
"${data?.userQuestion || ''}"

• Time: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' })} BST

Note:
Please review this query to update my knowledge base.

*— Ginny, Gaenr*`;
  }
  return `*Platform Event: ${type}*

*— Ginny, Gaenr*`;
}

async function sendWhatsAppAlert(env, type, data) {
  try {
    const messageText = formatWhatsAppMessage(type, data);
    const token = env?.WHATSAPP_TOKEN || env?.META_WHATSAPP_TOKEN || PERMANENT_META_TOKEN;
    const phoneId = env?.WHATSAPP_PHONE_ID || env?.META_PHONE_ID || META_PHONE_ID;
    const target = (env?.WHATSAPP_TARGET_PHONE || TARGET_WA_NUMBER).replace(/[^0-9]/g, '');

    let res = await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: target,
        type: 'text',
        text: { preview_url: false, body: messageText },
      }),
    });

    if (!res.ok && token !== PERMANENT_META_TOKEN) {
      res = await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${PERMANENT_META_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: target,
          type: 'text',
          text: { preview_url: false, body: messageText },
        }),
      });
    }

    return res.ok;
  } catch (err) {
    console.warn('sendWhatsAppAlert warning:', err);
    return false;
  }
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
async function getPgSql(connectionString) {
  const { neon } = await import('@neondatabase/serverless');
  return neon(connectionString);
}

async function getPgState(connectionString) {
  const sql = await getPgSql(connectionString);
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
  const sql = await getPgSql(connectionString);
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

    // 5. Automatic WhatsApp notification trigger for newly added feedbacks or expert applications
    try {
      let logs = [];
      try {
        const logsRaw = finalState.gaenr_notification_logs || currentState.gaenr_notification_logs || '[]';
        logs = typeof logsRaw === 'string' ? JSON.parse(logsRaw) : (logsRaw || []);
      } catch {}
      if (!Array.isArray(logs)) logs = [];

      const notifiedFbKeys = new Set(
        logs
          .filter((l) => l?.type === 'feedback_submission')
          .map((l) => l.data?.id || `${l.data?.name}_${l.data?.message}`)
          .filter(Boolean)
      );

      const notifiedAppKeys = new Set(
        logs
          .filter((l) => l?.type === 'expert_application')
          .map((l) => l.data?.id || `${l.data?.fullName}_${l.data?.whatsapp}`)
          .filter(Boolean)
      );

      // Check feedbacks
      let currentFeedbacks = [];
      let previousFeedbacks = [];
      try { currentFeedbacks = typeof finalState.gaenr_feedbacks === 'string' ? JSON.parse(finalState.gaenr_feedbacks) : (finalState.gaenr_feedbacks || []); } catch {}
      try { previousFeedbacks = typeof currentData.state?.gaenr_feedbacks === 'string' ? JSON.parse(currentData.state.gaenr_feedbacks) : (currentData.state?.gaenr_feedbacks || []); } catch {}

      if (Array.isArray(currentFeedbacks)) {
        const prevFbKeys = new Set(
          (Array.isArray(previousFeedbacks) ? previousFeedbacks : []).map((f) => f?.id || `${f?.name}_${f?.message}`).filter(Boolean)
        );

        for (const fb of currentFeedbacks) {
          const key = fb?.id || `${fb?.name}_${fb?.message}`;
          if (key && !prevFbKeys.has(key) && !notifiedFbKeys.has(key)) {
            // New feedback detected! Fire WhatsApp notification!
            await sendWhatsAppAlert(env, 'feedback_submission', fb);
            logs.unshift({
              id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
              type: 'feedback_submission',
              data: fb,
              timestamp: new Date().toISOString(),
            });
            notifiedFbKeys.add(key);
          }
        }
      }

      // Check expert applications
      let currentApps = [];
      let previousApps = [];
      try { currentApps = typeof finalState.gaenr_expert_applications === 'string' ? JSON.parse(finalState.gaenr_expert_applications) : (finalState.gaenr_expert_applications || []); } catch {}
      try { previousApps = typeof currentData.state?.gaenr_expert_applications === 'string' ? JSON.parse(currentData.state.gaenr_expert_applications) : (currentData.state?.gaenr_expert_applications || []); } catch {}

      if (Array.isArray(currentApps)) {
        const prevAppKeys = new Set(
          (Array.isArray(previousApps) ? previousApps : []).map((a) => a?.id || `${a?.fullName}_${a?.whatsapp}`).filter(Boolean)
        );

        for (const app of currentApps) {
          const key = app?.id || `${app?.fullName}_${app?.whatsapp}`;
          if (key && !prevAppKeys.has(key) && !notifiedAppKeys.has(key)) {
            await sendWhatsAppAlert(env, 'expert_application', app);
            logs.unshift({
              id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
              type: 'expert_application',
              data: app,
              timestamp: new Date().toISOString(),
            });
            notifiedAppKeys.add(key);
          }
        }
      }

      finalState.gaenr_notification_logs = JSON.stringify(logs.slice(0, 150));
    } catch (notifErr) {
      console.warn('PUT /api/state automatic notification warning:', notifErr);
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
