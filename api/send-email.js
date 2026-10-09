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
  const uploadToken = expert.uploadToken || expert.code;
  const uploadPortalUrl = `${SITE_URL}/u/${encodeURIComponent(uploadToken)}`;
  const logoUrl = `${SITE_URL}/logo.svg`;
  const iconUrl = (name) => `${SITE_URL}/email-icons/${name}.svg`;

  const subject = 'Welcome to Gaenr — your expert profile is live';
  const text = [
    `Hi ${name},`,
    '',
    'Welcome to Gaenr! Your verified expert profile has been created and is now live.',
    '',
    'Since your verified profile is now officially created, you can now independently upload, manage, and showcase your project deliverables yourself anytime.',
    '',
    `Upload Your Deliverables: ${uploadPortalUrl}`,
    `View your live profile: ${profileUrl}`,
    `Download your digital ID card: ${idCardDownloadUrl}`,
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
      color: #1e293b;
    }
    .brand-title {
      font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif !important;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 3px;
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
      padding: 13px 36px;
      border-radius: 9999px;
      box-shadow: 0 4px 14px rgba(0, 110, 255, 0.25);
      transition: all 0.2s ease;
    }
    .action-btn:hover {
      background-color: #0056cc !important;
      box-shadow: 0 6px 20px rgba(0, 110, 255, 0.35) !important;
    }
    .secondary-btn {
      display: inline-block;
      background-color: #f1f5f9;
      color: #0f172a !important;
      border: 1px solid #cbd5e1;
      text-decoration: none;
      font-weight: 600;
      font-size: 13px;
      padding: 10px 28px;
      border-radius: 9999px;
      transition: all 0.2s ease;
    }
    .secondary-btn:hover {
      background-color: #e2e8f0 !important;
      border-color: #94a3b8 !important;
      color: #006eff !important;
    }
    .footer-icon-btn {
      display: inline-block;
      width: 36px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      border-radius: 50%;
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      margin: 0 3px;
      vertical-align: middle;
      text-decoration: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .footer-icon-btn:hover {
      border-color: #cbd5e1 !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:'DM Sans',Arial,Helvetica,sans-serif;color:#1e293b">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <!-- Card Container with soft light tone -->
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:22px;border:1px solid #e2e8f0;font-family:'DM Sans',Arial,Helvetica,sans-serif;box-shadow:0 8px 30px rgba(15,23,42,0.04);overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding:24px 32px 18px;background:#f8fafc;border-bottom:1px solid #edf2f7;">
              <img src="${logoUrl}" width="40" height="40" alt="Gaenr logo" style="display:block;width:40px;height:40px;margin:0 auto 8px;" />
              <div class="brand-title">GAENR</div>
            </td>
          </tr>

          <!-- Welcome Greeting (Refined, balanced typography) -->
          <tr>
            <td style="padding:24px 32px 0;font-size:18px;font-weight:500;color:#1e293b;letter-spacing:-0.2px;">
              Welcome, <span style="font-weight:600;color:#006eff;">${escapeHtml(name)}</span>!
            </td>
          </tr>
          <tr>
            <td style="padding:10px 32px 0;font-size:14px;line-height:1.6;color:#475569;font-weight:400;">
              We’re delighted to welcome you to the Gaenr ecosystem. Your verified expert profile has been created and is now live for clients worldwide.
            </td>
          </tr>

          <!-- Digital ID Card Badge Info (Clean, robust, no broken images) -->
          <tr>
            <td style="padding:22px 32px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:18px;padding:22px 20px;text-align:center;">
                <tr>
                  <td align="center">
                    <div style="font-size:11px;font-weight:600;color:#006eff;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:8px;">
                      Official Digital Gaenr ID Card
                    </div>
                    <div style="font-size:26px;font-weight:800;color:#0f172a;letter-spacing:4px;font-family:'DM Sans',monospace;margin-bottom:8px;">
                      ${escapeHtml(expert.code)}
                    </div>
                    <div style="display:inline-block;padding:4px 16px;background:#e0edff;border:1px solid #bfdbfe;border-radius:20px;color:#0056cc;font-size:12px;font-weight:600;margin-bottom:14px;">
                      ${escapeHtml(expert.categoryTitle || 'Verified Expert')}
                    </div>
                    <div style="font-size:13px;color:#64748b;line-height:1.5;max-width:420px;margin:0 auto;">
                      Your official digital ID Card badge is attached to this email as <strong>GAENR-ID-${escapeHtml(expert.code)}.png</strong>. Keep it safe for client verification.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Creator Deliverable Upload Section (Self-service portfolio management) -->
          <tr>
            <td style="padding:20px 32px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0f7ff;border:1px solid #bfdbfe;border-radius:18px;padding:22px 20px;text-align:center;">
                <tr>
                  <td align="center">
                    <div style="font-size:11px;font-weight:700;color:#006eff;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:6px;">
                      Private Deliverable Vault
                    </div>
                    <div style="font-size:17px;font-weight:700;color:#0f172a;margin-bottom:8px;">
                      Upload &amp; Manage Your Portfolio Deliverables
                    </div>
                    <div style="font-size:13px;color:#475569;line-height:1.6;max-width:440px;margin:0 auto 16px;">
                      Your verified expert profile has been successfully activated! You can now start uploading and managing your official portfolio deliverables directly through your private portal link below:
                    </div>
                    <div>
                      <a href="${uploadPortalUrl}" class="action-btn" target="_blank" style="display:inline-block;background-color:#006eff;color:#ffffff !important;text-decoration:none;font-weight:700;font-size:13px;padding:12px 34px;border-radius:9999px;box-shadow:0 4px 14px rgba(0, 110, 255, 0.25);">
                        Open Portfolio Upload Portal →
                      </a>
                    </div>
                    <div style="margin-top:12px;font-size:12px;color:#64748b;">
                      Or directly <a href="${uploadPortalUrl}" target="_blank" style="color:#006eff;font-weight:600;text-decoration:underline;">click here to start uploading and updating your portfolio</a>.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Actions: Direct Download ID Card primary button + View Live Profile secondary button -->
          <tr>
            <td style="padding:22px 32px 0;text-align:center;">
              <div style="margin-bottom:12px;">
                <a href="${idCardDownloadUrl}" class="secondary-btn" target="_blank" style="display:inline-block;background-color:#f1f5f9;color:#0f172a !important;border:1px solid #cbd5e1;text-decoration:none;font-weight:600;font-size:13px;padding:10px 30px;border-radius:9999px;">
                  Download ID Card
                </a>
              </div>
              <div>
                <a href="${profileUrl}" class="secondary-btn" target="_blank" style="display:inline-block;background-color:#f1f5f9;color:#0f172a !important;border:1px solid #cbd5e1;text-decoration:none;font-weight:600;font-size:13px;padding:10px 30px;border-radius:9999px;">
                  View Live Profile →
                </a>
              </div>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:24px 32px 0;">
              <div style="height:1px;background:#e2e8f0;"></div>
            </td>
          </tr>

          <!-- Footer with modern contact & social icons -->
          <tr>
            <td style="padding:20px 32px 26px;text-align:center;background:#f8fafc;border-top:1px solid #edf2f7;">
              <div style="margin-bottom:12px;">
                <img src="${logoUrl}" width="22" height="22" alt="Gaenr" style="display:inline-block;width:22px;height:22px;vertical-align:middle;margin-right:6px;" />
                <span style="color:#0f172a;vertical-align:middle;font-size:13px;font-weight:700;">Team Gaenr</span>
              </div>

              <!-- Contact Icons (Directly hyperlinked, no text) -->
              <div style="margin-bottom:12px;white-space:nowrap;">
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

              <!-- Social Media Icons (Authentic brand colors) -->
              <div style="margin-bottom:12px;white-space:nowrap;">
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
                <a href="https://gaenr.com" style="color:#006eff;text-decoration:none;font-weight:600;font-size:13px;" target="_blank">gaenr.com</a>
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

const buildOnboardingInviteEmail = ({ name, skill, applicationId }) => {
  const safeName = (name || '').trim() || 'there';
  const safeSkill = (skill || '').trim() || 'Digital Creator';
  const onboardingUrl = `${SITE_URL}/expert-onboarding/${encodeURIComponent(applicationId)}`;
  const logoUrl = `${SITE_URL}/logo.svg`;
  const iconUrl = (name) => `${SITE_URL}/email-icons/${name}.svg`;

  const subject = 'Congratulations! Action Required: Complete Your Gaenr Expert Onboarding';
  const text = [
    `Dear ${safeName},`,
    '',
    `Congratulations! Following our review of your portfolio and background, you have been officially selected to join Gaenr as a Verified Expert in ${safeSkill}.`,
    '',
    'To activate your verified creator profile, choose your official 3D Youth Avatar, set your deliverable pricing, and submit your payout bank or MFS account details, please complete your private onboarding setup using your secure invitation link below:',
    '',
    `Complete Your Onboarding: ${onboardingUrl}`,
    '',
    'During onboarding, you will configure:',
    '1. Official 3D Youth Avatar Identity',
    '2. Standard Deliverable Pricing Packages (BDT)',
    '3. Professional Bio & Statement',
    '4. Payout Account Details (Bank Transfer or MFS: bKash / Nagad / Rocket with 0% platform deductions)',
    '',
    'Once submitted, our operations team will finalize your profile activation and provide your verified Gaenr Expert ID badge and portfolio management portal.',
    '',
    'Welcome to the Gaenr family!',
    '',
    'Warm regards,',
    'Gaenr Operations & Talent Acquisition Team',
    'Website: https://gaenr.com',
    'Email: contact@gaenr.com',
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
      color: #1e293b;
    }
    .brand-title {
      font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif !important;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 3px;
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
      padding: 13px 36px;
      border-radius: 9999px;
      box-shadow: 0 4px 14px rgba(0, 110, 255, 0.25);
      transition: all 0.2s ease;
    }
    .action-btn:hover {
      background-color: #0056cc !important;
      box-shadow: 0 6px 20px rgba(0, 110, 255, 0.35) !important;
    }
    .footer-icon-btn {
      display: inline-block;
      width: 36px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      border-radius: 50%;
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      margin: 0 3px;
      vertical-align: middle;
      text-decoration: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .footer-icon-btn:hover {
      border-color: #cbd5e1 !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:'DM Sans',Arial,Helvetica,sans-serif;color:#1e293b">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:22px;border:1px solid #e2e8f0;font-family:'DM Sans',Arial,Helvetica,sans-serif;box-shadow:0 8px 30px rgba(15,23,42,0.04);overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding:24px 32px 18px;background:#f8fafc;border-bottom:1px solid #edf2f7;">
              <img src="${logoUrl}" width="40" height="40" alt="Gaenr logo" style="display:block;width:40px;height:40px;margin:0 auto 8px;" />
              <div class="brand-title">GAENR</div>
            </td>
          </tr>

          <!-- Welcome Greeting -->
          <tr>
            <td style="padding:24px 32px 0;font-size:18px;font-weight:700;color:#1e293b;">
              Congratulations, <span style="color:#006eff;">${escapeHtml(safeName)}</span>!
            </td>
          </tr>
          <tr>
            <td style="padding:10px 32px 0;font-size:14px;line-height:1.6;color:#475569;">
              Following our review of your portfolio and background, you have been officially selected to join Gaenr as a Verified Expert in <strong>${escapeHtml(safeSkill)}</strong>.
            </td>
          </tr>

          <!-- Action Box -->
          <tr>
            <td style="padding:22px 32px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0f7ff;border:1px solid #bfdbfe;border-radius:18px;padding:24px 20px;text-align:center;">
                <tr>
                  <td align="center">
                    <div style="font-size:11px;font-weight:700;color:#006eff;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:6px;">
                      Private Setup Portal
                    </div>
                    <div style="font-size:18px;font-weight:800;color:#0f172a;margin-bottom:8px;">
                      Complete Your Expert Onboarding
                    </div>
                    <div style="font-size:13px;color:#475569;line-height:1.6;max-width:440px;margin:0 auto 18px;">
                      Please complete your private onboarding setup to select your official 3D Youth Avatar identity, set your deliverable pricing, and connect your payout account:
                    </div>
                    <div>
                      <a href="${onboardingUrl}" class="action-btn" target="_blank" style="display:inline-block;background-color:#006eff;color:#ffffff !important;text-decoration:none;font-weight:700;font-size:14px;padding:13px 36px;border-radius:9999px;box-shadow:0 4px 14px rgba(0, 110, 255, 0.25);">
                        Complete Onboarding Form →
                      </a>
                    </div>
                    <div style="margin-top:14px;font-size:12px;color:#64748b;">
                      Or directly <a href="${onboardingUrl}" target="_blank" style="color:#006eff;font-weight:600;text-decoration:underline;">click here to open your onboarding form</a>.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Onboarding Checklist -->
          <tr>
            <td style="padding:20px 32px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:18px 20px;">
                <tr>
                  <td>
                    <div style="font-size:12px;font-weight:700;color:#0f172a;margin-bottom:10px;text-transform:uppercase;letter-spacing:0.5px;">
                      What You Will Configure:
                    </div>
                    <div style="font-size:13px;color:#475569;line-height:1.8;">
                      ✓ <strong>Official 3D Youth Avatar Identity</strong><br/>
                      ✓ <strong>Standardized Deliverable Pricing Packages (BDT)</strong><br/>
                      ✓ <strong>Professional Bio Statement &amp; Value Proposition</strong><br/>
                      ✓ <strong>Payout Account (Bank Transfer or MFS: bKash / Nagad / Rocket)</strong>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:24px 32px 0;">
              <div style="height:1px;background:#e2e8f0;"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px 26px;text-align:center;background:#f8fafc;border-top:1px solid #edf2f7;">
              <div style="margin-bottom:12px;">
                <img src="${logoUrl}" width="22" height="22" alt="Gaenr" style="display:inline-block;width:22px;height:22px;vertical-align:middle;margin-right:6px;" />
                <span style="color:#0f172a;vertical-align:middle;font-size:13px;font-weight:700;">Team Gaenr</span>
              </div>
              <div style="margin-bottom:12px;white-space:nowrap;">
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
              <div>
                <a href="https://gaenr.com" style="color:#006eff;text-decoration:none;font-weight:600;font-size:13px;" target="_blank">gaenr.com</a>
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

  const type = req.body?.type || 'welcome';
  const sql = neon(connectionString);

  // Handle Onboarding Invitation Email for Approved Applicants
  if (type === 'onboarding_invite') {
    const applicationId = typeof req.body?.applicationId === 'string' ? req.body.applicationId.trim() : '';
    const to = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
    const fullName = typeof req.body?.fullName === 'string' ? req.body.fullName.trim() : '';
    const skill = typeof req.body?.skill === 'string' ? req.body.skill.trim() : '';

    if (!applicationId || !to) {
      return send(res, 400, { error: 'Application ID and email are required' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      return send(res, 422, { error: 'Invalid applicant email', code: 'NO_EMAIL' });
    }

    try {
      await sql`CREATE TABLE IF NOT EXISTS gaenr_email_log (
        code text NOT NULL, kind text NOT NULL, sent_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY (code, kind)
      )`;
      const claim = await sql`INSERT INTO gaenr_email_log (code, kind) VALUES (${applicationId}, 'onboarding_invite') ON CONFLICT DO NOTHING RETURNING code`;
      if (!claim[0]) return send(res, 200, { ok: true, alreadySent: true });

      const { subject, text, html } = buildOnboardingInviteEmail({ name: fullName, skill, applicationId });
      const emailPayload = { from, to: [to], subject, text, html };

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(emailPayload),
      });

      if (!response.ok) {
        await sql`DELETE FROM gaenr_email_log WHERE code = ${applicationId} AND kind = 'onboarding_invite'`;
        const detail = await response.text().catch(() => '');
        console.error('Resend onboarding email error:', response.status, detail);
        return send(res, 502, { error: 'Email provider rejected the message', code: 'PROVIDER_ERROR', detail: detail.slice(0, 300) });
      }

      return send(res, 200, { ok: true });
    } catch (err) {
      console.error('onboarding_invite error:', err);
      return send(res, 500, { error: 'Failed to send onboarding email' });
    }
  }

  // Welcome email flow
  const code = typeof req.body?.code === 'string' ? req.body.code.trim() : '';
  if (!/^[A-Za-z0-9]{4,20}$/.test(code)) return send(res, 400, { error: 'Invalid expert code' });

  try {
    // 1. Resolve expert: prioritize client-provided new profile payload to eliminate race conditions
    let expert = null;
    if (req.body?.expert && typeof req.body.expert === 'object' && req.body.expert.code === code) {
      expert = req.body.expert;

      // Auto-save into gaenr_app_state in Neon DB if not yet mirrored
      try {
        const rows = await sql`SELECT state FROM gaenr_app_state WHERE id = 1`;
        let curState = rows[0]?.state || {};
        let list = [];
        try { list = JSON.parse(curState['gaenr_freelancers'] || '[]'); } catch { list = []; }
        if (!list.some((e) => e?.code === code)) {
          list = [expert, ...list];
          curState['gaenr_freelancers'] = JSON.stringify(list);
          await sql`UPDATE gaenr_app_state SET state = ${curState}, updated_at = now() WHERE id = 1`;
        }
      } catch (dbSyncErr) {
        console.warn('Auto-save in send-email error:', dbSyncErr);
      }
    } else {
      const rows = await sql`SELECT state->>'gaenr_freelancers' AS list FROM gaenr_app_state WHERE id = 1`;
      let experts = [];
      try { experts = JSON.parse(rows[0]?.list || '[]'); } catch { experts = []; }
      expert = experts.find((e) => e?.code === code);
    }

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

    // 3. Cache and attach the exact ID Card PNG image to the email
    const attachments = [];
    const incomingCardImage = typeof req.body?.cardImage === 'string' ? req.body.cardImage.trim() : '';

    if (incomingCardImage && incomingCardImage.startsWith('data:image/png')) {
      // 3a. Save to gaenr_id_cards table so /api/id-card serves this exact rendered card
      try {
        await sql`CREATE TABLE IF NOT EXISTS gaenr_id_cards (
          code text PRIMARY KEY,
          image_data text NOT NULL,
          updated_at timestamptz NOT NULL DEFAULT now()
        )`;
        await sql`INSERT INTO gaenr_id_cards (code, image_data) VALUES (${code}, ${incomingCardImage})
          ON CONFLICT (code) DO UPDATE SET image_data = EXCLUDED.image_data, updated_at = now()`;
      } catch (dbErr) {
        console.warn('Could not cache card image in DB:', dbErr);
      }

      const base64Data = incomingCardImage.includes(',') ? incomingCardImage.split(',')[1] : incomingCardImage;
      attachments.push({
        filename: `GAENR-ID-${code}.png`,
        content: base64Data,
      });
    } else {
      // 3b. Fallback: fetch rendered card from /api/id-card endpoint
      try {
        const cardRes = await fetch(`${SITE_URL}/api/id-card?code=${encodeURIComponent(code)}`);
        if (cardRes.ok) {
          const cardBuffer = Buffer.from(await cardRes.arrayBuffer());
          attachments.push({
            filename: `GAENR-ID-${code}.png`,
            content: cardBuffer.toString('base64'),
          });
        }
      } catch (err) {
        console.warn('Could not attach ID card image to email:', err);
      }
    }

    const emailPayload = {
      from,
      to: [to],
      subject,
      text,
      html,
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(emailPayload),
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
