import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, 'data');
const stateFile = path.join(dataDir, 'gaenr-state.json');
const emailsFile = path.join(dataDir, 'sent-emails.json');

const SENSITIVE_LOCAL_KEYS = ['gaenr_admin_logged', 'gaenr_current_employee', 'gaenr_admin_session'];

let writeQueue = Promise.resolve();

export const readState = async () => {
  try {
    const raw = await fs.readFile(stateFile, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.warn('readState error:', error.message);
    }
    return { version: 1, updatedAt: new Date().toISOString(), state: {} };
  }
};

export const persistState = (state) => {
  writeQueue = writeQueue.then(async () => {
    await fs.mkdir(dataDir, { recursive: true });
    const temporaryFile = `${stateFile}.tmp`;
    await fs.writeFile(temporaryFile, JSON.stringify(state, null, 2), 'utf8');
    await fs.rename(temporaryFile, stateFile);
  });
  return writeQueue;
};

export const logSentEmail = async (emailRecord) => {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    let existing = [];
    try {
      const raw = await fs.readFile(emailsFile, 'utf8');
      existing = JSON.parse(raw);
      if (!Array.isArray(existing)) existing = [];
    } catch {}
    existing.unshift(emailRecord);
    if (existing.length > 200) existing = existing.slice(0, 200);
    await fs.writeFile(emailsFile, JSON.stringify(existing, null, 2), 'utf8');
  } catch (err) {
    console.warn('logSentEmail note:', err.message);
  }
};

export const mergeState = (currentState, payload) => {
  const state = { ...(currentState || {}) };

  // Strip sensitive keys
  for (const k of SENSITIVE_LOCAL_KEYS) {
    delete state[k];
  }

  // 1. Full state snapshot
  if (payload.state && typeof payload.state === 'object' && !Array.isArray(payload.state)) {
    for (const [k, v] of Object.entries(payload.state)) {
      if (SENSITIVE_LOCAL_KEYS.includes(k)) continue;
      state[k] = typeof v === 'string' ? v : JSON.stringify(v);
    }
  }

  // 2. Array changes (merging by code or id)
  if (Array.isArray(payload.arrayChanges)) {
    for (const change of payload.arrayChanges) {
      const key = change?.key;
      if (!key || typeof key !== 'string' || SENSITIVE_LOCAL_KEYS.includes(key)) continue;
      const upserts = Array.isArray(change.upserts) ? change.upserts : [];
      const deletes = Array.isArray(change.deletes) ? change.deletes : [];
      if (upserts.length === 0 && deletes.length === 0) continue;

      let existingItems = [];
      const rawVal = state[key];
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

      state[key] = JSON.stringify(merged);
    }
  }

  // 3. Key-value changes
  if (payload.changes && typeof payload.changes === 'object' && !Array.isArray(payload.changes)) {
    for (const [k, v] of Object.entries(payload.changes)) {
      if (typeof k !== 'string' || SENSITIVE_LOCAL_KEYS.includes(k)) continue;
      state[k] = typeof v === 'string' ? v : JSON.stringify(v);
    }
  }

  // 4. Deleted keys
  if (Array.isArray(payload.deletedKeys)) {
    for (const k of payload.deletedKeys) {
      if (typeof k === 'string') delete state[k];
    }
  }

  for (const k of SENSITIVE_LOCAL_KEYS) {
    delete state[k];
  }

  return state;
};

export const handleSendEmail = async (payload) => {
  const type = payload?.type || 'welcome';
  const resendApiKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM || 'Gaenr <contact@gaenr.com>';
  const webhookUrl = process.env.VITE_GOOGLE_DRIVE_WEBHOOK_URL;
  const siteUrl = (process.env.APP_URL || process.env.SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

  let recipient = '';
  let subject = '';
  let html = '';
  let text = '';

  if (type === 'onboarding_invite') {
    recipient = (payload.email || '').trim();
    const name = (payload.fullName || 'there').trim();
    const skill = (payload.skill || 'Digital Creator').trim();
    const onboardingUrl = `${siteUrl}/onboard/${payload.applicationId}?name=${encodeURIComponent(name)}&email=${encodeURIComponent(recipient)}&skill=${encodeURIComponent(skill)}`;
    
    subject = 'Congratulations! Your Gaenr Expert Application is Approved';
    text = `Hi ${name},\n\nCongratulations! We are pleased to inform you that your application has been reviewed and officially approved as a Verified Expert in ${skill}.\n\nPlease complete the expert onboarding form below to finalize your profile setup:\n\nComplete Onboarding Form: ${onboardingUrl}\n\nTeam Gaenr\nhttps://gaenr.com`;
    html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><style>body{font-family:'DM Sans',sans-serif;background:#f8fafc;color:#1e293b;padding:20px;margin:0;} .card{max-width:540px;margin:0 auto;background:#ffffff;border-radius:20px;border:1px solid #e2e8f0;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.05);} .hdr{background:#0a1222;padding:24px;text-align:center;color:#fff;} .logo{font-size:20px;font-weight:800;letter-spacing:3px;color:#006eff;} .body{padding:30px;} .btn{display:inline-block;background:#006eff;color:#ffffff !important;padding:14px 36px;border-radius:9999px;font-weight:700;text-decoration:none;font-size:14px;} .ftr{background:#f8fafc;padding:20px;text-align:center;font-size:12px;color:#64748b;border-top:1px solid #edf2f7;}</style></head>
<body>
  <div class="card">
    <div class="hdr">
      <div class="logo">GAENR</div>
    </div>
    <div class="body">
      <h2 style="font-size:20px;margin-top:0;">Congratulations, <span style="color:#006eff;">${name}</span>!</h2>
      <p style="font-size:14px;line-height:1.6;color:#475569;">We are pleased to inform you that your application has been reviewed and officially approved as a <strong>Verified Expert in ${skill}</strong>.</p>
      <p style="font-size:14px;line-height:1.6;color:#475569;">Please complete the expert onboarding form below to finalize your profile setup for further process:</p>
      <div style="text-align:center;margin:30px 0;">
        <a href="${onboardingUrl}" class="btn" target="_blank">Complete Onboarding Form &rarr;</a>
      </div>
      <p style="font-size:12px;color:#94a3b8;line-height:1.5;">If the button above does not work, copy and paste this secure link into your browser:<br/><a href="${onboardingUrl}" style="color:#006eff;word-break:break-all;">${onboardingUrl}</a></p>
    </div>
    <div class="ftr">
      <strong>Team Gaenr</strong> &bull; <a href="https://gaenr.com" style="color:#006eff;text-decoration:none;">gaenr.com</a> &bull; WhatsApp: +8801608922800
    </div>
  </div>
</body>
</html>`;
  } else if (type === 'applicant_received') {
    recipient = (payload.email || '').trim();
    const name = (payload.fullName || 'there').trim();
    const skill = (payload.skill || 'Digital Creator').trim();

    subject = 'Gaenr Expert Application Received';
    text = `Hi ${name},\n\nThank you for applying to join Gaenr as an Expert in ${skill}!\n\nWe have successfully received your application. Our vetting team is currently reviewing your portfolio and credentials.\n\nOnce reviewed, you will receive an official notification and invitation to complete your onboarding.\n\nBest regards,\nTeam Gaenr\nhttps://gaenr.com`;
    html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><style>body{font-family:'DM Sans',sans-serif;background:#f8fafc;color:#1e293b;padding:20px;margin:0;} .card{max-width:540px;margin:0 auto;background:#ffffff;border-radius:20px;border:1px solid #e2e8f0;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.05);} .hdr{background:#0a1222;padding:24px;text-align:center;color:#fff;} .logo{font-size:20px;font-weight:800;letter-spacing:3px;color:#006eff;} .body{padding:30px;} .ftr{background:#f8fafc;padding:20px;text-align:center;font-size:12px;color:#64748b;border-top:1px solid #edf2f7;}</style></head>
<body>
  <div class="card">
    <div class="hdr">
      <div class="logo">GAENR</div>
    </div>
    <div class="body">
      <h2 style="font-size:20px;margin-top:0;">Application Received, <span style="color:#006eff;">${name}</span>!</h2>
      <p style="font-size:14px;line-height:1.6;color:#475569;">Thank you for applying to join Gaenr as a Verified Expert in <strong>${skill}</strong>.</p>
      <p style="font-size:14px;line-height:1.6;color:#475569;">We have received your credentials and portfolio. Our vetting team is actively reviewing your application. You will receive an official notification and onboarding invitation email once approved.</p>
    </div>
    <div class="ftr">
      <strong>Team Gaenr</strong> &bull; <a href="https://gaenr.com" style="color:#006eff;text-decoration:none;">gaenr.com</a> &bull; WhatsApp: +8801608922800
    </div>
  </div>
</body>
</html>`;
  } else {
    // Welcome email
    recipient = (payload.expert?.privateEmail || payload.email || '').trim();
    const name = (payload.expert?.name || 'there').trim();
    const code = (payload.code || payload.expert?.code || '').trim();
    subject = 'Your GAENR Expert Profile is Live';
    const profileUrl = `${siteUrl}/experts/${encodeURIComponent(code)}`;
    text = `Hi ${name},\n\nCongratulations! Your verified expert profile (${code}) is now live on Gaenr.\n\nView Profile: ${profileUrl}\n\nTeam Gaenr`;
    html = `<p>Hi ${name}, your profile ${code} is live!</p><p><a href="${profileUrl}">View Profile</a></p>`;
  }

  let delivery = { sent: false, provider: 'none', timestamp: new Date().toISOString() };

  // 1. Attempt Resend if API key is provided
  if (resendApiKey && recipient) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: emailFrom, to: [recipient], subject, html, text }),
      });
      if (res.ok) {
        delivery = { sent: true, provider: 'resend', timestamp: new Date().toISOString() };
      } else {
        console.warn('Resend send failed:', res.status, await res.text());
      }
    } catch (e) {
      console.warn('Resend exception:', e.message);
    }
  }

  // 2. Attempt Google Apps Script webhook
  if (!delivery.sent && webhookUrl && recipient) {
    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_email',
          to: recipient,
          subject,
          html,
          text,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.success || data.status === 'success') {
        delivery = { sent: true, provider: 'google-apps-script', timestamp: new Date().toISOString() };
      }
    } catch (e) {
      console.warn('Apps Script email note:', e.message);
    }
  }

  // 3. Log to persistent sent emails vault
  await logSentEmail({
    type,
    recipient,
    subject,
    delivery,
    timestamp: new Date().toISOString(),
  });

  return { ok: true, delivery, recipient };
};
