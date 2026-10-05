import { neon } from '@neondatabase/serverless';

const SITE_URL = (process.env.SITE_URL || 'https://gaenr.com').replace(/\/$/, '');

const escapeHtml = (value = '') =>
  String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const send = (res, status, body) => res.status(status).setHeader('Cache-Control', 'no-store').json(body);

const buildWelcomeEmail = (expert) => {
  const name = expert.name?.trim() || 'there';
  const profileUrl = `${SITE_URL}/experts/${encodeURIComponent(expert.code)}`;
  const idCardUrl = `${SITE_URL}/api/id-card?code=${encodeURIComponent(expert.code)}`;
  const idCardDownloadUrl = `${idCardUrl}&download=1`;
  const logoUrl = `${SITE_URL}/logo.svg`;
  const iconUrl = (name) => `${SITE_URL}/email-icons/${name}.svg`;
  const iconImage = (name, alt) => `<img src="${iconUrl(name)}" width="18" height="18" alt="${alt}" style="display:inline-block;width:18px;height:18px;vertical-align:middle;border:0" />`;
  const subject = 'Welcome to Gaenr — your expert profile is live';
  const text = [
    `Hi ${name},`,
    '',
    'Welcome to Gaenr! Your verified expert profile has been created and is now live.',
    '',
    'Your digital Gaenr ID card is ready:',
    idCardDownloadUrl,
    `View your profile: ${profileUrl}`,
    '',
    'Keep your digital ID card safe. Clients and the Gaenr operations team use it to identify verified experts.',
    '',
    'Team Gaenr',
    'WhatsApp: https://wa.me/8801608922800',
    'Email: contact@gaenr.com | Phone: 09647 922 800',
    'https://gaenr.com',
    'Facebook: https://www.facebook.com/gaenrglobal/',
    'LinkedIn: https://www.linkedin.com/company/gaenrglobal/',
    'Instagram: https://www.instagram.com/gaenr_global/',
    'X: https://x.com/gaenr_global',
    'Threads: https://www.threads.com/@gaenr_global',
    'TikTok: https://www.tiktok.com/@gaenr_global',
  ].join('\n');
  const html = `<!doctype html><html><head><meta name="x-apple-disable-message-reformatting" /><style>@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');</style></head><body style="margin:0;background:#f4f7fb;font-family:'DM Sans',Arial,Helvetica,sans-serif;color:#0f172a">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
    <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:16px;border:1px solid #e2e8f0;font-family:'DM Sans',Arial,Helvetica,sans-serif">
      <tr><td align="center" style="padding:24px 32px 18px;background:#eff6ff;border-radius:16px 16px 0 0;border-bottom:1px solid #dbeafe">
        <img src="${logoUrl}" width="48" height="48" alt="Gaenr logo" style="display:block;width:48px;height:48px;margin:0 auto 8px" />
        <div style="font-size:23px;font-weight:900;letter-spacing:4px;color:#005dd7;text-align:center">GAENR</div>
      </td></tr>
      <tr><td style="padding:8px 32px 0;font-size:18px;font-weight:700">Welcome, ${escapeHtml(name)}!</td></tr>
      <tr><td style="padding:12px 32px 0;font-size:14px;line-height:1.6;color:#334155">
        We’re very glad to welcome you. Your verified expert profile is now live on Gaenr.
      </td></tr>
      <tr><td style="padding:20px 32px 0">
        <div style="font-size:13px;font-weight:800;color:#334155;margin-bottom:10px">Your digital Gaenr ID card</div>
        <a href="${idCardUrl}" style="display:block;text-decoration:none;background:#f8fafc;border:1px solid #dbeafe;border-radius:18px;padding:12px;text-align:center">
          <img src="${idCardUrl}" width="260" alt="Gaenr digital ID card" style="display:block;width:260px;max-width:100%;height:auto;margin:0 auto;border-radius:12px" />
        </a>
      </td></tr>
      <tr><td style="padding:18px 32px 0;text-align:center"><a href="${idCardDownloadUrl}" style="display:inline-block;background:#006eff;color:#ffffff;text-decoration:none;font-weight:800;font-size:14px;padding:12px 20px;border-radius:12px">Download ID Card</a></td></tr>
      <tr><td style="padding:12px 32px 0;text-align:center"><a href="${profileUrl}" style="color:#006eff;text-decoration:none;font-weight:700;font-size:13px">View my live profile →</a></td></tr>
      <tr><td style="padding:24px 32px 0"><div style="height:1px;background:#e2e8f0"></div></td></tr>
      <tr><td style="padding:20px 32px 28px;font-size:12px;line-height:1.8;color:#64748b;text-align:center">
        <img src="${logoUrl}" width="26" height="26" alt="Gaenr" style="display:inline-block;width:26px;height:26px;vertical-align:middle;margin-right:6px" />
        <strong style="color:#0f172a;vertical-align:middle;font-size:14px">Team Gaenr</strong>
        <div style="height:1px;background:#e2e8f0;margin:14px 0"></div>
        <div style="margin-bottom:10px;white-space:nowrap">
          <a href="https://gaenr.com" title="Gaenr website" style="color:#006eff;text-decoration:none;font-weight:700;margin:0 7px">${iconImage('globe', 'Website')} Website</a>
          <a href="mailto:contact@gaenr.com" title="Email Gaenr" style="color:#4f46e5;text-decoration:none;font-weight:700;margin:0 7px">${iconImage('mail', 'Email')} Email</a>
          <a href="tel:09647922800" title="Call Gaenr" style="color:#006eff;text-decoration:none;font-weight:700;margin:0 7px">${iconImage('phone', 'Phone')} Phone</a>
          <a href="https://wa.me/8801608922800" title="WhatsApp Gaenr" style="color:#16803c;text-decoration:none;font-weight:700;margin:0 7px">${iconImage('whatsapp', 'WhatsApp')} WhatsApp</a>
        </div>
        <div style="margin-top:8px;white-space:nowrap">
          <a href="https://www.facebook.com/gaenrglobal/" title="Gaenr on Facebook" style="margin:0 6px">${iconImage('facebook', 'Facebook')}</a>
          <a href="https://www.linkedin.com/company/gaenrglobal/" title="Gaenr on LinkedIn" style="margin:0 6px">${iconImage('linkedin', 'LinkedIn')}</a>
          <a href="https://www.instagram.com/gaenr_global/" title="Gaenr on Instagram" style="margin:0 6px">${iconImage('instagram', 'Instagram')}</a>
          <a href="https://x.com/gaenr_global" title="Gaenr on X" style="margin:0 6px">${iconImage('x', 'X')}</a>
          <a href="https://www.threads.com/@gaenr_global" title="Gaenr on Threads" style="margin:0 6px">${iconImage('threads', 'Threads')}</a>
          <a href="https://www.tiktok.com/@gaenr_global" title="Gaenr on TikTok" style="margin:0 6px">${iconImage('tiktok', 'TikTok')}</a>
        </div>
        <div style="margin-top:10px"><a href="https://gaenr.com" style="color:#006eff;text-decoration:none;font-weight:700">gaenr.com</a></div>
      </td></tr>
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
