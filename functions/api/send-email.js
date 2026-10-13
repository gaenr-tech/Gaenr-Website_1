// functions/api/send-email.js
// Cloudflare Pages Function: Dispatches official automated emails with GAENR branding & ID attachments

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

function getEmailHeader(siteUrl) {
  return `
  <a href="${siteUrl}" target="_blank" style="display:inline-block;text-decoration:none;">
    <img src="${siteUrl}/images/gaenr-logo-email.png?v=20261013" alt="GAENR" width="175" height="50" style="display:block;margin:0 auto;width:175px;max-width:175px;height:auto;border:0;outline:none;" />
  </a>`;
}

function getEmailFooter(siteUrl) {
  return `
  <div style="font-size:13px;font-weight:600;color:#334155;letter-spacing:1px;margin-bottom:16px;text-transform:uppercase;text-align:center;">
    TEAM <span style="color:#006eff;font-weight:600;">GAENR</span>
  </div>
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto;border-collapse:collapse;">
    <tr>
      <!-- 1. Website -->
      <td align="center" valign="middle" width="28" style="width:28px;padding:0 2px;text-align:center;">
        <a href="${siteUrl}" target="_blank" title="Website" style="display:inline-block;text-decoration:none;">
          <img src="${siteUrl}/email-footer-icons/globe.png?v=20261013" alt="Website" width="24" height="24" style="display:block;width:24px;height:24px;border:0;outline:none;" />
        </a>
      </td>
      <!-- 2. Phone -->
      <td align="center" valign="middle" width="28" style="width:28px;padding:0 2px;text-align:center;">
        <a href="tel:+8809647922800" title="Phone: 09647 922 800" style="display:inline-block;text-decoration:none;">
          <img src="${siteUrl}/email-footer-icons/phone.png?v=20261013" alt="Phone" width="24" height="24" style="display:block;width:24px;height:24px;border:0;outline:none;" />
        </a>
      </td>
      <!-- 3. Email -->
      <td align="center" valign="middle" width="28" style="width:28px;padding:0 2px;text-align:center;">
        <a href="mailto:contact@gmail.com" title="Email: contact@gmail.com" style="display:inline-block;text-decoration:none;">
          <img src="${siteUrl}/email-footer-icons/mail.png?v=20261013" alt="Email" width="24" height="24" style="display:block;width:24px;height:24px;border:0;outline:none;" />
        </a>
      </td>
      <!-- 4. WhatsApp -->
      <td align="center" valign="middle" width="28" style="width:28px;padding:0 2px;text-align:center;">
        <a href="https://wa.me/8801608922800" target="_blank" title="WhatsApp: +8801608922800" style="display:inline-block;text-decoration:none;">
          <img src="${siteUrl}/email-footer-icons/whatsapp.png?v=20261013" alt="WhatsApp" width="24" height="24" style="display:block;width:24px;height:24px;border:0;outline:none;" />
        </a>
      </td>
      <!-- 5. Facebook -->
      <td align="center" valign="middle" width="28" style="width:28px;padding:0 2px;text-align:center;">
        <a href="https://www.facebook.com/gaenrglobal/" target="_blank" title="Facebook" style="display:inline-block;text-decoration:none;">
          <img src="${siteUrl}/email-footer-icons/facebook.png?v=20261013" alt="Facebook" width="24" height="24" style="display:block;width:24px;height:24px;border:0;outline:none;" />
        </a>
      </td>
      <!-- 6. LinkedIn -->
      <td align="center" valign="middle" width="28" style="width:28px;padding:0 2px;text-align:center;">
        <a href="https://www.linkedin.com/company/gaenrglobal/" target="_blank" title="LinkedIn" style="display:inline-block;text-decoration:none;">
          <img src="${siteUrl}/email-footer-icons/linkedin.png?v=20261013" alt="LinkedIn" width="24" height="24" style="display:block;width:24px;height:24px;border:0;outline:none;" />
        </a>
      </td>
      <!-- 7. Instagram -->
      <td align="center" valign="middle" width="28" style="width:28px;padding:0 2px;text-align:center;">
        <a href="https://www.instagram.com/gaenr_global/" target="_blank" title="Instagram" style="display:inline-block;text-decoration:none;">
          <img src="${siteUrl}/email-footer-icons/instagram.png?v=20261013" alt="Instagram" width="24" height="24" style="display:block;width:24px;height:24px;border:0;outline:none;" />
        </a>
      </td>
      <!-- 8. Pinterest -->
      <td align="center" valign="middle" width="28" style="width:28px;padding:0 2px;text-align:center;">
        <a href="https://www.pinterest.com/gaenr_global/" target="_blank" title="Pinterest" style="display:inline-block;text-decoration:none;">
          <img src="${siteUrl}/email-footer-icons/pinterest.png?v=20261013" alt="Pinterest" width="24" height="24" style="display:block;width:24px;height:24px;border:0;outline:none;" />
        </a>
      </td>
      <!-- 9. X / Twitter -->
      <td align="center" valign="middle" width="28" style="width:28px;padding:0 2px;text-align:center;">
        <a href="https://x.com/gaenr_global" target="_blank" title="X" style="display:inline-block;text-decoration:none;">
          <img src="${siteUrl}/email-footer-icons/x.png?v=20261013" alt="X" width="24" height="24" style="display:block;width:24px;height:24px;border:0;outline:none;" />
        </a>
      </td>
      <!-- 10. Threads -->
      <td align="center" valign="middle" width="28" style="width:28px;padding:0 2px;text-align:center;">
        <a href="https://www.threads.com/@gaenr_global" target="_blank" title="Threads" style="display:inline-block;text-decoration:none;">
          <img src="${siteUrl}/email-footer-icons/threads.png?v=20261013" alt="Threads" width="24" height="24" style="display:block;width:24px;height:24px;border:0;outline:none;" />
        </a>
      </td>
      <!-- 11. TikTok -->
      <td align="center" valign="middle" width="28" style="width:28px;padding:0 2px;text-align:center;">
        <a href="https://www.tiktok.com/@gaenr_global" target="_blank" title="TikTok" style="display:inline-block;text-decoration:none;">
          <img src="${siteUrl}/email-footer-icons/tiktok.png?v=20261013" alt="TikTok" width="24" height="24" style="display:block;width:24px;height:24px;border:0;outline:none;" />
        </a>
      </td>
    </tr>
  </table>`;
}

function sanitizeEnglishSkill(skillStr) {
  if (!skillStr || typeof skillStr !== 'string') return 'Digital Creator';
  const primary = skillStr.split('/')[0].trim();
  const clean = primary.replace(/[\u0980-\u09FF]/g, '').trim();
  if (/wordpress/i.test(clean)) return 'WordPress Website Design';
  if (/ux|ui/i.test(clean)) return 'UX/UI Design';
  if (/graphic/i.test(clean)) return 'Graphics Design';
  if (/content/i.test(clean)) return 'Content Writing';
  if (/video/i.test(clean)) return 'Video Editing';
  if (/presentation/i.test(clean)) return 'Presentation Design';
  if (/ads|marketing/i.test(clean)) return 'Ads Running (Performance Marketing)';
  return clean || 'Digital Creator';
}

function buildFullEmailHtml({ siteUrl, bodyHtml }) {
  const headerInner = getEmailHeader(siteUrl);
  const footerInner = getEmailFooter(siteUrl);

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>GAENR</title>
</head>
<body style="font-family:'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#edf2f7;color:#1e293b;padding:24px 10px;margin:0;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#edf2f7;width:100%;margin:0;padding:0;">
    <tr>
      <td align="center" style="padding:10px 0;">
        <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background-color:#ffffff;border-radius:22px;border:1px solid #cbd5e1;overflow:hidden;box-shadow:0 12px 36px rgba(0,0,0,0.06);margin:0 auto;">
          <!-- Top Gradient Accent Bar with Increased Stroke (7px) -->
          <tr>
            <td height="7" bgcolor="#006eff" style="height:7px;background:#006eff;background:linear-gradient(90deg, #0048ba 0%, #006eff 50%, #38bdf8 100%);line-height:7px;font-size:0;padding:0;margin:0;border:0;">&nbsp;</td>
          </tr>
          <!-- 1. Pure Whitish Branded Header -->
          <tr>
            <td align="center" bgcolor="#ffffff" style="background-color:#ffffff;padding:30px 20px 20px 20px;border-bottom:1px solid #f1f5f9;text-align:center;">
              ${headerInner}
            </td>
          </tr>
          <!-- 2. Pure White Card Body -->
          <tr>
            <td bgcolor="#ffffff" style="background-color:#ffffff;padding:36px 30px;">
              ${bodyHtml}
            </td>
          </tr>
          <!-- 3. Pure Whitish Branded Footer -->
          <tr>
            <td align="center" bgcolor="#ffffff" style="background-color:#ffffff;padding:24px 20px 30px 20px;border-top:1px solid #f1f5f9;text-align:center;">
              ${footerInner}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function onRequestPost({ request, env }) {
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const payload = await request.json().catch(() => ({}));
    const type = payload?.type || 'welcome';
    const siteUrl = (env.APP_URL || env.SITE_URL || 'https://gaenr.com').replace(/\/$/, '');
    const resendApiKey = env.RESEND_API_KEY;
    const emailFrom = env.EMAIL_FROM || 'Gaenr <contact@gmail.com>';
    const webhookUrl = env.VITE_GOOGLE_DRIVE_WEBHOOK_URL;

    let recipient = '';
    let subject = '';
    let html = '';
    let text = '';

    if (type === 'onboarding_invite') {
      recipient = (payload.email || '').trim();
      const name = (payload.fullName || 'there').trim();
      const skill = sanitizeEnglishSkill(payload.skill || payload.otherSkill);
      const onboardingUrl = `${siteUrl}/onboard/${payload.applicationId}?name=${encodeURIComponent(name)}&email=${encodeURIComponent(recipient)}&skill=${encodeURIComponent(skill)}`;
      
      subject = 'Congratulations! Your GAENR Expert Application is Approved';
      text = `Hi ${name},\n\nCongratulations! We are pleased to inform you that your application has been reviewed and approved as a Verified Expert in ${skill}.\n\nPlease complete the expert onboarding form below to finalize your profile:\n\nComplete Onboarding Form: ${onboardingUrl}\n\nTeam GAENR`;
      
      const bodyHtml = `
      <h2 style="font-size:22px;font-weight:800;color:#0f172a;margin-top:0;">Congratulations, <span style="color:#006eff;">${name}</span>!</h2>
      <p style="font-size:14px;line-height:1.6;color:#475569;">We are pleased to inform you that your application has been reviewed and officially approved as a <strong>Verified Expert in ${skill}</strong>.</p>
      <p style="font-size:14px;line-height:1.6;color:#475569;">Please complete your expert avatar selection, service rates, statement, and payout details below to activate your verified profile:</p>
      <div style="text-align:center;margin:32px 0;">
        <a href="${onboardingUrl}" style="display:inline-block;background:#006eff;color:#ffffff !important;padding:14px 36px;border-radius:9999px;font-weight:700;text-decoration:none;font-size:14px;box-shadow:0 4px 14px rgba(0,110,255,0.25);" target="_blank">Complete Expert Onboarding &rarr;</a>
      </div>
      <p style="font-size:12px;color:#94a3b8;line-height:1.5;text-align:center;margin-bottom:0;">This onboarding form is strictly single-use. Once submitted, your profile will be locked for review and final activation.</p>`;

      html = buildFullEmailHtml({ siteUrl, bodyHtml });

    } else if (type === 'applicant_received') {
      recipient = (payload.email || '').trim();
      const name = (payload.fullName || 'there').trim();
      const skill = sanitizeEnglishSkill(payload.skill || payload.otherSkill);

      subject = 'GAENR Expert Application Received';
      text = `Hi ${name},\n\nThank you for applying to join Gaenr as an Expert in ${skill}!\n\nWe have successfully received your application. Our vetting team is actively reviewing your credentials.\n\nBest regards,\nTeam GAENR`;

      const bodyHtml = `
      <h2 style="font-size:22px;font-weight:800;color:#0f172a;margin-top:0;">Application Received, <span style="color:#006eff;">${name}</span>!</h2>
      <p style="font-size:14px;line-height:1.6;color:#475569;">Thank you for applying to join Gaenr as a Verified Expert in <strong>${skill}</strong>. We have received your portfolio and application details.</p>
      <p style="font-size:14px;line-height:1.6;color:#475569;margin-bottom:0;">Our talent vetting operations team is actively reviewing your submission. You will receive an official update as soon as the review is complete.</p>`;

      html = buildFullEmailHtml({ siteUrl, bodyHtml });

      // Automatically dispatch high-priority Operations Alert Email to contact@gmail.com
      if (resendApiKey) {
        const cleanWa = (payload.whatsapp || '').replace(/[^0-9]/g, '');
        const opsSubject = `🚨 [NEW EXPERT APPLICATION] ${name} - ${skill}`;
        const opsBody = `
        <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:14px;padding:16px 20px;margin-bottom:20px;">
          <span style="font-size:11px;font-weight:700;color:#1d4ed8;text-transform:uppercase;letter-spacing:1px;">New Expert Application Alert</span>
          <h2 style="font-size:20px;font-weight:800;color:#0f172a;margin:6px 0 0 0;">${name} (${skill})</h2>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:13px;color:#334155;margin-bottom:20px;">
          <tr><td style="padding:6px 0;font-weight:600;width:120px;">Applicant Name:</td><td>${name}</td></tr>
          <tr><td style="padding:6px 0;font-weight:600;">Category / Skill:</td><td><strong style="color:#006eff;">${skill}</strong></td></tr>
          <tr><td style="padding:6px 0;font-weight:600;">WhatsApp:</td><td><a href="https://wa.me/${cleanWa}" target="_blank" style="color:#006eff;font-weight:700;">${payload.whatsapp || 'N/A'}</a></td></tr>
          <tr><td style="padding:6px 0;font-weight:600;">Email:</td><td><a href="mailto:${recipient}" style="color:#006eff;">${recipient}</a></td></tr>
          <tr><td style="padding:6px 0;font-weight:600;">Experience:</td><td>${payload.experience || 'Verified'}</td></tr>
          <tr><td style="padding:6px 0;font-weight:600;">Portfolio:</td><td><a href="${payload.portfolioUrl || '#'}" target="_blank" style="color:#006eff;">${payload.portfolioUrl || 'None provided'}</a></td></tr>
        </table>
        <div style="text-align:center;margin-top:24px;">
          <a href="${siteUrl}/admin" style="display:inline-block;background:#006eff;color:#ffffff !important;padding:12px 30px;border-radius:9999px;font-weight:700;text-decoration:none;font-size:13px;box-shadow:0 4px 14px rgba(0,110,255,0.25);" target="_blank">Open Admin Dashboard &rarr;</a>
          ${cleanWa ? `&nbsp;<a href="https://wa.me/${cleanWa}" style="display:inline-block;background:#10b981;color:#ffffff !important;padding:12px 24px;border-radius:9999px;font-weight:700;text-decoration:none;font-size:13px;" target="_blank">Chat with Applicant on WhatsApp</a>` : ''}
        </div>`;
        const opsHtml = buildFullEmailHtml({ siteUrl, bodyHtml: opsBody });

        fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: emailFrom.includes('@gmail.com') ? 'Gaenr <contact@gaenr.com>' : emailFrom,
            reply_to: recipient || 'contact@gmail.com',
            to: ['contact@gmail.com'],
            subject: opsSubject,
            html: opsHtml,
          }),
        }).catch((e) => console.warn('Ops alert dispatch notice:', e));
      }

    } else if (type === 'ops_alert') {
      recipient = 'contact@gmail.com';
      const alertTitle = payload.title || payload.subject || 'Platform Operations Notification';
      subject = `🚨 [GAENR OPS] ${alertTitle}`;
      text = `GAENR Operations Alert: ${alertTitle}\n\nTime: ${new Date().toISOString()}`;

      const bodyHtml = `
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:14px;padding:16px 20px;margin-bottom:20px;">
        <span style="font-size:11px;font-weight:700;color:#15803d;text-transform:uppercase;letter-spacing:1px;">Gaenr Operations Alert</span>
        <h2 style="font-size:20px;font-weight:800;color:#0f172a;margin:6px 0 0 0;">${alertTitle}</h2>
      </div>
      <div style="font-size:14px;color:#334155;line-height:1.6;">
        ${payload.bodyHtml || `<p>${payload.text || 'New operational activity recorded.'}</p>`}
      </div>
      <div style="text-align:center;margin-top:28px;">
        <a href="${siteUrl}/admin" style="display:inline-block;background:#006eff;color:#ffffff !important;padding:12px 32px;border-radius:9999px;font-weight:700;text-decoration:none;font-size:13px;" target="_blank">Open Admin Operations &rarr;</a>
      </div>`;

      html = buildFullEmailHtml({ siteUrl, bodyHtml });

    } else {
      // Welcome email
      recipient = (payload.expert?.privateEmail || payload.email || '').trim();
      const name = (payload.expert?.name || 'there').trim();
      const code = (payload.code || payload.expert?.code || '').trim();
      const profileUrl = `${siteUrl}/experts/${encodeURIComponent(code)}`;
      const uploadToken = payload.expert?.uploadToken || code;
      const uploadPortalUrl = `${siteUrl}/u/${encodeURIComponent(uploadToken)}`;
      const idCardDownloadUrl = `${siteUrl}/api/id-card?code=${encodeURIComponent(code)}`;

      subject = 'Your GAENR Expert Profile is Live';
      text = `Hi ${name},\n\nCongratulations! Your verified expert profile (${code}) is now active and live on Gaenr.\n\nDownload ID Card: ${idCardDownloadUrl}\nUpload Portfolios: ${uploadPortalUrl}\nView Profile: ${profileUrl}\n\nTeam GAENR`;

      const bodyHtml = `
      <h2 style="font-size:22px;font-weight:800;color:#0f172a;margin-top:0;">Welcome to GAENR, <span style="color:#006eff;">${name}</span>!</h2>
      <p style="font-size:14px;line-height:1.6;color:#475569;">Congratulations! Your verified expert profile (Official ID: <strong style="font-family:monospace;color:#006eff;font-size:15px;letter-spacing:1px;">${code}</strong>) is now active and live on Gaenr.</p>
      
      <!-- ID Card Announcement & Direct Download Action -->
      <div style="background:#f0f7ff;border:1px solid #bae6fd;border-radius:18px;padding:24px 20px;margin:24px 0;text-align:center;">
        <div style="font-size:11px;font-weight:700;letter-spacing:1px;color:#0369a1;text-transform:uppercase;margin-bottom:8px;">
          Official Verified Digital ID Card
        </div>
        <div style="text-align:center;margin:10px 0 16px 0;">
          <div style="display:inline-block;background:#0f172a;color:#ffffff;border:2px solid #006eff;border-radius:12px;padding:9px 24px;font-size:22px;font-weight:900;font-family:monospace;letter-spacing:4px;box-shadow:0 4px 14px rgba(0,110,255,0.25);">
            ${code}
          </div>
        </div>
        <p style="font-size:12px;color:#475569;margin:0 0 16px 0;line-height:1.5;">Your official digital ID card image has been attached to this email. You can also download it directly at anytime using the button below:</p>
        <div style="text-align:center;">
          <a href="${idCardDownloadUrl}" style="display:inline-block;background:#006eff;color:#ffffff !important;padding:12px 28px;border-radius:9999px;font-weight:700;text-decoration:none;font-size:13px;box-shadow:0 4px 14px rgba(0,110,255,0.25);" target="_blank">Download Official ID Card</a>
        </div>
      </div>

      <!-- Dedicated Upload Portfolios Section -->
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:18px;padding:24px 20px;margin:26px 0;text-align:center;">
        <h3 style="font-size:16px;font-weight:800;color:#0f172a;margin:0 0 8px 0;">Now you can start uploading your portfolios</h3>
        <p style="font-size:13px;color:#475569;margin:0 0 18px 0;line-height:1.6;">You can now start uploading your portfolio deliverables, case studies, and work samples directly into your verified Gaenr showcase.</p>
        <div style="text-align:center;">
          <a href="${uploadPortalUrl}" style="display:inline-block;background:#0f172a;color:#ffffff !important;padding:11px 24px;border-radius:9999px;font-weight:700;text-decoration:none;font-size:13px;margin:4px;" target="_blank">Upload Your Portfolio</a>
          <a href="${profileUrl}" style="display:inline-block;background:#ffffff;color:#0f172a !important;padding:11px 24px;border-radius:9999px;font-weight:700;text-decoration:none;font-size:13px;border:1px solid #cbd5e1;margin:4px;" target="_blank">View Live Profile</a>
        </div>
      </div>

      <p style="font-size:12px;color:#94a3b8;line-height:1.5;text-align:center;margin-top:20px;margin-bottom:0;">Please keep your official ID card safe for client authentication and verification.</p>`;

      html = buildFullEmailHtml({ siteUrl, bodyHtml });
    }

    // Process attachments and store card image if provided
    const attachments = [];
    const cardData = payload.cardImage || payload.cardImageDataUrl;
    if (cardData && typeof cardData === 'string') {
      const code = (payload.code || payload.expert?.code || 'EXPERT').trim();
      const base64Content = cardData.includes(',') ? cardData.split(',')[1] : cardData;
      attachments.push({
        filename: `GAENR-ID-${code}.png`,
        content: base64Content,
      });

      // Save ID card into Cloudflare D1 for direct auto-download via /api/id-card
      if (env.DB && code) {
        try {
          await env.DB
            .prepare(
              'CREATE TABLE IF NOT EXISTS gaenr_id_cards (code TEXT PRIMARY KEY, image_data TEXT NOT NULL, created_at TEXT NOT NULL)'
            )
            .run();
          await env.DB
            .prepare(
              'INSERT INTO gaenr_id_cards (code, image_data, created_at) VALUES (?, ?, ?) ON CONFLICT(code) DO UPDATE SET image_data = excluded.image_data, created_at = excluded.created_at'
            )
            .bind(code, cardData, new Date().toISOString())
            .run();
        } catch (dbErr) {
          console.warn('Could not cache ID card in D1:', dbErr);
        }
      }
    }

    let sent = false;
    let provider = 'none';

    // 1. Send via Resend if API key available
    if (resendApiKey && recipient) {
      try {
        let fromAddress = emailFrom;
        let res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromAddress,
            reply_to: 'contact@gmail.com',
            to: [recipient],
            subject,
            html,
            text,
            attachments: attachments.length > 0 ? attachments : undefined,
          }),
        });

        // Resend requires a domain verified in Resend to send. If fromAddress is unverified
        // (e.g. @gmail.com), retry with verified domain fallback while keeping reply_to: contact@gmail.com
        if (!res.ok && fromAddress.includes('@gmail.com')) {
          const verifiedFallbackFrom = 'Gaenr <contact@gaenr.com>';
          const retryRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: verifiedFallbackFrom,
              reply_to: 'contact@gmail.com',
              to: [recipient],
              subject,
              html,
              text,
              attachments: attachments.length > 0 ? attachments : undefined,
            }),
          });
          if (retryRes.ok) {
            res = retryRes;
          }
        }

        if (res.ok) {
          sent = true;
          provider = 'resend';
        } else {
          const errDetail = await res.text().catch(() => '');
          console.warn('Resend error response:', res.status, errDetail);
        }
      } catch (err) {
        console.warn('Resend error:', err);
      }
    }

    // 2. Fallback to Google Apps Script Webhook
    if (!sent && webhookUrl && recipient) {
      try {
        const res = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'send_email',
            to: recipient,
            reply_to: 'contact@gmail.com',
            subject,
            html,
            text,
            attachments: attachments.length > 0 ? attachments : undefined,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (data.success || data.status === 'success') {
          sent = true;
          provider = 'google-apps-script';
        }
      } catch (err) {
        console.warn('Webhook email error:', err);
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        sent,
        provider,
        recipient,
        subject,
        timestamp: new Date().toISOString(),
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
