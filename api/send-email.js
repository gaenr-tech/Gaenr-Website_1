import { neon } from '@neondatabase/serverless';

const SITE_URL = (process.env.SITE_URL || 'https://gaenr.com').replace(/\/$/, '');

const escapeHtml = (value = '') =>
  String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const send = (res, status, body) => res.status(status).setHeader('Cache-Control', 'no-store').json(body);

const buildWelcomeEmail = (expert) => {
  const name = expert.name?.trim() || 'there';
  const profileUrl = `${SITE_URL}/experts/${encodeURIComponent(expert.code)}`;
  const subject = 'Welcome to Gaenr — your expert profile is live';
  const text = [
    `Hi ${name},`,
    '',
    'Welcome to Gaenr! Your verified expert profile has been created and is now live.',
    '',
    `Your Expert ID: ${expert.code}`,
    `Your profile: ${profileUrl}`,
    '',
    'Keep your Expert ID private-ish: clients and the Gaenr operations team use it to assign you tasks.',
    'If any detail on your profile looks wrong, just reply to this email and we will fix it.',
    '',
    '— Team Gaenr',
  ].join('\n');
  const html = `<!doctype html><html><body style="margin:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#0f172a">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
    <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:16px;border:1px solid #e2e8f0">
      <tr><td style="padding:28px 32px 8px;font-size:22px;font-weight:800;color:#006eff">Gaenr</td></tr>
      <tr><td style="padding:8px 32px 0;font-size:18px;font-weight:700">Welcome, ${escapeHtml(name)}!</td></tr>
      <tr><td style="padding:12px 32px 0;font-size:14px;line-height:1.6;color:#334155">
        Your verified expert profile has been created and is now live on Gaenr.
      </td></tr>
      <tr><td style="padding:20px 32px 0">
        <div style="background:#f1f5f9;border-radius:12px;padding:14px 16px;font-size:13px;color:#475569">Your Expert ID</div>
        <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:14px 16px;margin-top:-6px;font-size:22px;font-weight:800;letter-spacing:2px;color:#006eff;font-family:Consolas,monospace">${escapeHtml(expert.code)}</div>
      </td></tr>
      <tr><td style="padding:22px 32px 0"><a href="${profileUrl}" style="display:inline-block;background:#006eff;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 22px;border-radius:12px">View my profile</a></td></tr>
      <tr><td style="padding:20px 32px 0;font-size:13px;line-height:1.6;color:#64748b">Clients and the Gaenr operations team use your Expert ID to assign you tasks. If any detail on your profile looks wrong, simply reply to this email and we will fix it.</td></tr>
      <tr><td style="padding:24px 32px 28px;font-size:13px;color:#94a3b8">— Team Gaenr</td></tr>
    </table>
  </td></tr></table></body></html>`;
  return { subject, text, html };
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed' });

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!apiKey || !from) return send(res, 503, { error: 'Email service is not configured', code: 'EMAIL_NOT_CONFIGURED' });
  if (!connectionString) return send(res, 503, { error: 'Database is not configured' });

  const code = typeof req.body?.code === 'string' ? req.body.code.trim() : '';
  if (!/^[A-Za-z0-9]{4,20}$/.test(code)) return send(res, 400, { error: 'Invalid expert code' });

  const sql = neon(connectionString);

  try {
    // 1. Look up the expert in the shared database. The recipient is NEVER taken from the request.
    const rows = await sql`SELECT state->>'gaenr_freelancers' AS list FROM gaenr_app_state WHERE id = 1`;
    let experts = [];
    try { experts = JSON.parse(rows[0]?.list || '[]'); } catch { experts = []; }
    const expert = experts.find((e) => e?.code === code);
    if (!expert) return send(res, 404, { error: 'Expert not saved yet', code: 'EXPERT_NOT_FOUND' });

    const to = (expert.privateEmail || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) return send(res, 422, { error: 'Expert has no valid email', code: 'NO_EMAIL' });

    // 2. Send at most one welcome email per expert (atomic claim).
    await sql`CREATE TABLE IF NOT EXISTS gaenr_email_log (
      code text NOT NULL, kind text NOT NULL, sent_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY (code, kind)
    )`;
    const claim = await sql`INSERT INTO gaenr_email_log (code, kind) VALUES (${code}, 'welcome') ON CONFLICT DO NOTHING RETURNING code`;
    if (!claim[0]) return send(res, 200, { ok: true, alreadySent: true });

    const { subject, text, html } = buildWelcomeEmail(expert);
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], subject, text, html }),
    });

    if (!response.ok) {
      await sql`DELETE FROM gaenr_email_log WHERE code = ${code} AND kind = 'welcome'`; // allow a retry
      const detail = await response.text().catch(() => '');
      console.error('Resend error', response.status, detail);
      return send(res, 502, { error: 'Email provider rejected the message', code: 'PROVIDER_ERROR', detail: detail.slice(0, 300) });
    }

    return send(res, 200, { ok: true });
  } catch (error) {
    console.error('send-email error:', error);
    return send(res, 500, { error: 'Failed to send email' });
  }
}
