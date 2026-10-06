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
    'Website: https://gaenr.com',
    'Email: contact@gaenr.com',
    'Phone: 09647 922 800',
    'WhatsApp: https://wa.me/8801608922800',
  ].join('\n');

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap');
    * {
      font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
    }
    body {
      margin: 0;
      padding: 0;
      background-color: #f1f5f9;
      font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
    }
    .brand-title {
      font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif !important;
      font-size: 24px;
      font-weight: 900;
      letter-spacing: 5px;
      color: #006eff;
      text-align: center;
    }
    .action-btn {
      display: inline-block;
      background-color: #006eff;
      color: #ffffff !important;
      text-decoration: none;
      font-weight: 700;
      font-size: 14px;
      padding: 13px 28px;
      border-radius: 12px;
      box-shadow: 0 4px 14px rgba(0, 110, 255, 0.25);
      transition: all 0.2s ease;
    }
    .action-btn:hover {
      background-color: #0056cc !important;
      box-shadow: 0 6px 20px rgba(0, 110, 255, 0.35) !important;
    }
    .profile-link {
      display: inline-block;
      color: #006eff !important;
      text-decoration: none;
      font-weight: 700;
      font-size: 13px;
      transition: color 0.2s ease;
    }
    .profile-link:hover {
      color: #004bb3 !important;
      text-decoration: underline;
    }
    .footer-icon-btn {
      display: inline-block;
      width: 38px;
      height: 38px;
      line-height: 38px;
      text-align: center;
      border-radius: 50%;
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      margin: 0 4px;
      vertical-align: middle;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    .footer-icon-btn:hover {
      background-color: #006eff !important;
      border-color: #006eff !important;
      box-shadow: 0 4px 12px rgba(0, 110, 255, 0.25);
    }
    .footer-icon-btn:hover img {
      filter: brightness(0) invert(1) !important;
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'DM Sans',Arial,Helvetica,sans-serif;color:#0f172a">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:20px;border:1px solid #e2e8f0;font-family:'DM Sans',Arial,Helvetica,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,0.04);overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding:28px 32px 20px;background:#f0f6ff;border-bottom:1px solid #dbeafe;">
              <img src="${logoUrl}" width="46" height="46" alt="Gaenr logo" style="display:block;width:46px;height:46px;margin:0 auto 8px;" />
              <div class="brand-title">GAENR</div>
            </td>
          </tr>

          <!-- Welcome Greeting -->
          <tr>
            <td style="padding:24px 32px 0;font-size:20px;font-weight:800;color:#0f172a;letter-spacing:-0.3px;">
              Welcome, ${escapeHtml(name)}!
            </td>
          </tr>
          <tr>
            <td style="padding:10px 32px 0;font-size:14px;line-height:1.6;color:#475569;">
              We’re delighted to welcome you to the Gaenr ecosystem. Your verified expert profile has been created and is now live for clients worldwide.
            </td>
          </tr>

          <!-- Digital ID Card Display -->
          <tr>
            <td style="padding:24px 32px 0;">
              <div style="font-size:12px;font-weight:800;color:#64748b;margin-bottom:12px;text-transform:uppercase;letter-spacing:0.8px;">
                Your Digital Gaenr ID Card
              </div>
              <a href="${idCardUrl}" target="_blank" style="display:block;text-decoration:none;background:#0b1329;border:1px solid #1e293b;border-radius:20px;padding:12px;text-align:center;box-shadow:0 8px 30px rgba(0,0,0,0.12);">
                <img src="${idCardUrl}" width="270" alt="Gaenr digital ID card" style="display:block;width:270px;max-width:100%;height:auto;margin:0 auto;border-radius:14px;" />
              </a>
            </td>
          </tr>

          <!-- Actions -->
          <tr>
            <td style="padding:22px 32px 0;text-align:center;">
              <a href="${idCardDownloadUrl}" class="action-btn">
                Download ID Card
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:14px 32px 0;text-align:center;">
              <a href="${profileUrl}" class="profile-link" target="_blank">
                View My Live Profile →
              </a>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:28px 32px 0;">
              <div style="height:1px;background:#e2e8f0;"></div>
            </td>
          </tr>

          <!-- Footer with modern contact & social icons -->
          <tr>
            <td style="padding:22px 32px 28px;text-align:center;background:#fafcff;">
              <div style="margin-bottom:12px;">
                <img src="${logoUrl}" width="24" height="24" alt="Gaenr" style="display:inline-block;width:24px;height:24px;vertical-align:middle;margin-right:6px;" />
                <span style="color:#0f172a;vertical-align:middle;font-size:14px;font-weight:800;">Team Gaenr</span>
              </div>

              <!-- Contact Icons (Directly hyperlinked, no text) -->
              <div style="margin-bottom:14px;white-space:nowrap;">
                <a href="https://gaenr.com" class="footer-icon-btn" title="Gaenr Website" target="_blank">
                  <img src="${iconUrl('globe')}" width="18" height="18" alt="Website" style="vertical-align:middle;display:inline-block;border:0;" />
                </a>
                <a href="mailto:contact@gaenr.com" class="footer-icon-btn" title="Email Gaenr">
                  <img src="${iconUrl('mail')}" width="18" height="18" alt="Email" style="vertical-align:middle;display:inline-block;border:0;" />
                </a>
                <a href="tel:09647922800" class="footer-icon-btn" title="Call Gaenr">
                  <img src="${iconUrl('phone')}" width="18" height="18" alt="Phone" style="vertical-align:middle;display:inline-block;border:0;" />
                </a>
                <a href="https://wa.me/8801608922800" class="footer-icon-btn" title="WhatsApp Gaenr" target="_blank">
                  <img src="${iconUrl('whatsapp')}" width="18" height="18" alt="WhatsApp" style="vertical-align:middle;display:inline-block;border:0;" />
                </a>
              </div>

              <!-- Social Media Icons -->
              <div style="margin-bottom:14px;white-space:nowrap;">
                <a href="https://www.facebook.com/gaenrglobal/" class="footer-icon-btn" title="Gaenr on Facebook" target="_blank">
                  <img src="${iconUrl('facebook')}" width="16" height="16" alt="Facebook" style="vertical-align:middle;display:inline-block;border:0;" />
                </a>
                <a href="https://www.linkedin.com/company/gaenrglobal/" class="footer-icon-btn" title="Gaenr on LinkedIn" target="_blank">
                  <img src="${iconUrl('linkedin')}" width="16" height="16" alt="LinkedIn" style="vertical-align:middle;display:inline-block;border:0;" />
                </a>
                <a href="https://www.instagram.com/gaenr_global/" class="footer-icon-btn" title="Gaenr on Instagram" target="_blank">
                  <img src="${iconUrl('instagram')}" width="16" height="16" alt="Instagram" style="vertical-align:middle;display:inline-block;border:0;" />
                </a>
                <a href="https://x.com/gaenr_global" class="footer-icon-btn" title="Gaenr on X" target="_blank">
                  <img src="${iconUrl('x')}" width="16" height="16" alt="X" style="vertical-align:middle;display:inline-block;border:0;" />
                </a>
                <a href="https://www.threads.com/@gaenr_global" class="footer-icon-btn" title="Gaenr on Threads" target="_blank">
                  <img src="${iconUrl('threads')}" width="16" height="16" alt="Threads" style="vertical-align:middle;display:inline-block;border:0;" />
                </a>
                <a href="https://www.tiktok.com/@gaenr_global" class="footer-icon-btn" title="Gaenr on TikTok" target="_blank">
                  <img src="${iconUrl('tiktok')}" width="16" height="16" alt="TikTok" style="vertical-align:middle;display:inline-block;border:0;" />
                </a>
              </div>

              <div>
                <a href="https://gaenr.com" style="color:#006eff;text-decoration:none;font-weight:700;font-size:13px;" target="_blank">gaenr.com</a>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

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
