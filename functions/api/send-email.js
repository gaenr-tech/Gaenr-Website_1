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
  <div style="background:#ffffff;padding:26px 20px;text-align:center;border-bottom:1px solid #e2e8f0;">
    <a href="${siteUrl}" target="_blank" style="display:inline-block;text-decoration:none;">
      <img src="${siteUrl}/images/gaenr-logo.png" alt="GAENR" width="170" style="display:inline-block;max-width:170px;height:auto;border:0;outline:none;" />
    </a>
  </div>`;
}

function getEmailFooter(siteUrl) {
  return `
  <div style="background:#ffffff;padding:26px 20px;text-align:center;border-top:1px solid #e2e8f0;">
    <div style="font-size:13px;font-weight:700;color:#0f172a;letter-spacing:0.5px;margin-bottom:14px;">
      Team GAENR
    </div>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto;border-collapse:collapse;">
      <tr>
        <!-- 1. Website -->
        <td style="padding:0 5px;" align="center">
          <a href="${siteUrl}" target="_blank" title="Website" style="display:inline-block;text-decoration:none;">
            <img src="${siteUrl}/email-icons/globe.png" alt="Website" width="28" height="28" style="display:block;width:28px;height:28px;border:0;" />
          </a>
        </td>
        <!-- 2. Phone -->
        <td style="padding:0 5px;" align="center">
          <a href="tel:+8809647922800" title="Phone: 09647 922 800" style="display:inline-block;text-decoration:none;">
            <img src="${siteUrl}/email-icons/phone.png" alt="Phone" width="28" height="28" style="display:block;width:28px;height:28px;border:0;" />
          </a>
        </td>
        <!-- 3. Email -->
        <td style="padding:0 5px;" align="center">
          <a href="mailto:contact@gaenr.com" title="Email: contact@gaenr.com" style="display:inline-block;text-decoration:none;">
            <img src="${siteUrl}/email-icons/mail.png" alt="Email" width="28" height="28" style="display:block;width:28px;height:28px;border:0;" />
          </a>
        </td>
        <!-- 4. WhatsApp -->
        <td style="padding:0 5px;" align="center">
          <a href="https://wa.me/8801608922800" target="_blank" title="WhatsApp: +8801608922800" style="display:inline-block;text-decoration:none;">
            <img src="${siteUrl}/email-icons/whatsapp.png" alt="WhatsApp" width="28" height="28" style="display:block;width:28px;height:28px;border:0;" />
          </a>
        </td>
        <!-- 5. Facebook -->
        <td style="padding:0 5px;" align="center">
          <a href="https://www.facebook.com/gaenrglobal/" target="_blank" title="Facebook" style="display:inline-block;text-decoration:none;">
            <img src="${siteUrl}/email-icons/facebook.png" alt="Facebook" width="28" height="28" style="display:block;width:28px;height:28px;border:0;" />
          </a>
        </td>
        <!-- 6. LinkedIn -->
        <td style="padding:0 5px;" align="center">
          <a href="https://www.linkedin.com/company/gaenrglobal/" target="_blank" title="LinkedIn" style="display:inline-block;text-decoration:none;">
            <img src="${siteUrl}/email-icons/linkedin.png" alt="LinkedIn" width="28" height="28" style="display:block;width:28px;height:28px;border:0;" />
          </a>
        </td>
        <!-- 7. Instagram -->
        <td style="padding:0 5px;" align="center">
          <a href="https://www.instagram.com/gaenr_global/" target="_blank" title="Instagram" style="display:inline-block;text-decoration:none;">
            <img src="${siteUrl}/email-icons/instagram.png" alt="Instagram" width="28" height="28" style="display:block;width:28px;height:28px;border:0;" />
          </a>
        </td>
        <!-- 8. X / Twitter -->
        <td style="padding:0 5px;" align="center">
          <a href="https://x.com/gaenr_global" target="_blank" title="X" style="display:inline-block;text-decoration:none;">
            <img src="${siteUrl}/email-icons/x.png" alt="X" width="28" height="28" style="display:block;width:28px;height:28px;border:0;" />
          </a>
        </td>
        <!-- 9. Threads -->
        <td style="padding:0 5px;" align="center">
          <a href="https://www.threads.com/@gaenr_global" target="_blank" title="Threads" style="display:inline-block;text-decoration:none;">
            <img src="${siteUrl}/email-icons/threads.png" alt="Threads" width="28" height="28" style="display:block;width:28px;height:28px;border:0;" />
          </a>
        </td>
      </tr>
    </table>
  </div>`;
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
    const emailFrom = env.EMAIL_FROM || 'Gaenr <contact@gaenr.com>';
    const webhookUrl = env.VITE_GOOGLE_DRIVE_WEBHOOK_URL;

    let recipient = '';
    let subject = '';
    let html = '';
    let text = '';

    const headerHtml = getEmailHeader(siteUrl);
    const footerHtml = getEmailFooter(siteUrl);

    if (type === 'onboarding_invite') {
      recipient = (payload.email || '').trim();
      const name = (payload.fullName || 'there').trim();
      const skill = (payload.skill || 'Digital Creator').trim();
      const onboardingUrl = `${siteUrl}/onboard/${payload.applicationId}?name=${encodeURIComponent(name)}&email=${encodeURIComponent(recipient)}&skill=${encodeURIComponent(skill)}`;
      subject = 'Congratulations! Your Gaenr Expert Application is Approved';
      text = `Hi ${name},\n\nCongratulations! We are pleased to inform you that your application has been reviewed and approved as a Verified Expert in ${skill}.\n\nPlease complete the expert onboarding form below to finalize your profile:\n\nComplete Onboarding Form: ${onboardingUrl}\n\nTeam GAENR`;
      html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><style>body{font-family:'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f8fafc;color:#1e293b;padding:20px;margin:0;} .card{max-width:540px;margin:0 auto;background:#ffffff;border-radius:24px;border:1px solid #e2e8f0;overflow:hidden;box-shadow:0 12px 36px rgba(0,0,0,0.06);} .body{padding:32px 28px;} .btn{display:inline-block;background:#006eff;color:#ffffff !important;padding:14px 36px;border-radius:9999px;font-weight:700;text-decoration:none;font-size:14px;box-shadow:0 4px 14px rgba(0,110,255,0.25);}</style></head>
<body>
  <div class="card">
    ${headerHtml}
    <div class="body">
      <h2 style="font-size:22px;font-weight:800;color:#0f172a;margin-top:0;">Congratulations, <span style="color:#006eff;">${name}</span>!</h2>
      <p style="font-size:14px;line-height:1.6;color:#475569;">We are pleased to inform you that your application has been reviewed and officially approved as a <strong>Verified Expert in ${skill}</strong>.</p>
      <p style="font-size:14px;line-height:1.6;color:#475569;">Please complete your expert avatar selection, service rates, statement, and payout details below to activate your verified profile:</p>
      <div style="text-align:center;margin:32px 0;">
        <a href="${onboardingUrl}" class="btn" target="_blank">Complete Expert Onboarding &rarr;</a>
      </div>
      <p style="font-size:12px;color:#94a3b8;line-height:1.5;text-align:center;">This onboarding form is strictly single-use. Once submitted, your profile will be locked for review and final activation.</p>
    </div>
    ${footerHtml}
  </div>
</body>
</html>`;
    } else if (type === 'applicant_received') {
      recipient = (payload.email || '').trim();
      const name = (payload.fullName || 'there').trim();
      const skill = (payload.skill || 'Digital Creator').trim();
      subject = 'Gaenr Expert Application Received';
      text = `Hi ${name},\n\nThank you for applying to join Gaenr as an Expert in ${skill}!\n\nWe have successfully received your application. Our vetting team is actively reviewing your credentials.\n\nBest regards,\nTeam GAENR`;
      html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><style>body{font-family:'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f8fafc;color:#1e293b;padding:20px;margin:0;} .card{max-width:540px;margin:0 auto;background:#ffffff;border-radius:24px;border:1px solid #e2e8f0;overflow:hidden;box-shadow:0 12px 36px rgba(0,0,0,0.06);} .body{padding:32px 28px;}</style></head>
<body>
  <div class="card">
    ${headerHtml}
    <div class="body">
      <h2 style="font-size:22px;font-weight:800;color:#0f172a;margin-top:0;">Application Received, <span style="color:#006eff;">${name}</span>!</h2>
      <p style="font-size:14px;line-height:1.6;color:#475569;">Thank you for applying to join Gaenr as a Verified Expert in <strong>${skill}</strong>. We have received your portfolio and application details.</p>
      <p style="font-size:14px;line-height:1.6;color:#475569;">Our talent vetting operations team is actively reviewing your submission. You will receive an official update as soon as the review is complete.</p>
    </div>
    ${footerHtml}
  </div>
</body>
</html>`;
    } else {
      // Welcome email (Profile Live)
      recipient = (payload.expert?.privateEmail || payload.email || '').trim();
      const name = (payload.expert?.name || 'there').trim();
      const code = (payload.code || payload.expert?.code || '').trim();
      const profileUrl = `${siteUrl}/experts/${encodeURIComponent(code)}`;
      const uploadToken = payload.expert?.uploadToken || code;
      const uploadPortalUrl = `${siteUrl}/u/${encodeURIComponent(uploadToken)}`;
      const idCardDownloadUrl = `${siteUrl}/download/id-card/${encodeURIComponent(code)}`;

      subject = `Your GAENR Expert Profile is Live (ID: ${code})`;
      text = `Hi ${name},\n\nCongratulations! Your verified expert profile (${code}) is now active and live on Gaenr.\n\nDownload ID Card: ${idCardDownloadUrl}\nUpload Portfolios: ${uploadPortalUrl}\nView Profile: ${profileUrl}\n\nTeam GAENR`;

      html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><style>body{font-family:'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f8fafc;color:#1e293b;padding:20px;margin:0;} .card{max-width:540px;margin:0 auto;background:#ffffff;border-radius:24px;border:1px solid #e2e8f0;overflow:hidden;box-shadow:0 12px 36px rgba(0,0,0,0.06);} .body{padding:32px 28px;} .btn-dl{display:inline-block;background:#006eff;color:#ffffff !important;padding:12px 28px;border-radius:9999px;font-weight:700;text-decoration:none;font-size:13px;box-shadow:0 4px 14px rgba(0,110,255,0.25);} .btn-primary{display:inline-block;background:#0f172a;color:#ffffff !important;padding:11px 24px;border-radius:9999px;font-weight:700;text-decoration:none;font-size:13px;margin:4px;} .btn-secondary{display:inline-block;background:#ffffff;color:#0f172a !important;padding:11px 24px;border-radius:9999px;font-weight:700;text-decoration:none;font-size:13px;border:1px solid #cbd5e1;margin:4px;}</style></head>
<body>
  <div class="card">
    ${headerHtml}
    <div class="body">
      <h2 style="font-size:22px;font-weight:800;color:#0f172a;margin-top:0;">Profile Live, <span style="color:#006eff;">${name}</span>!</h2>
      <p style="font-size:14px;line-height:1.6;color:#475569;">Congratulations! Your verified expert profile (Official ID: <strong style="font-family:monospace;color:#006eff;font-size:15px;letter-spacing:1px;">${code}</strong>) is now active and live on Gaenr.</p>
      
      <!-- ID Card Announcement & Direct Download Action -->
      <div style="background:#f0f7ff;border:1px solid #bae6fd;border-radius:18px;padding:20px;margin:24px 0;text-align:center;">
        <div style="font-size:11px;font-weight:700;letter-spacing:1px;color:#0369a1;text-transform:uppercase;margin-bottom:6px;">
          Official Verified Digital ID Card
        </div>
        <div style="font-size:20px;font-weight:900;font-family:monospace;letter-spacing:3px;color:#006eff;margin-bottom:12px;">
          ${code}
        </div>
        <p style="font-size:12px;color:#475569;margin:0 0 16px 0;line-height:1.5;">Your official digital ID card image has been attached to this email. You can also download it automatically at anytime using the link below:</p>
        <div style="text-align:center;">
          <a href="${idCardDownloadUrl}" class="btn-dl" target="_blank">Download Official ID Card</a>
        </div>
      </div>

      <!-- Dedicated Upload Portfolios Section -->
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:18px;padding:24px 20px;margin:26px 0;text-align:center;">
        <h3 style="font-size:16px;font-weight:800;color:#0f172a;margin:0 0 8px 0;">Now you can start uploading your portfolios</h3>
        <p style="font-size:13px;color:#475569;margin:0 0 18px 0;line-height:1.6;">You can now start uploading your portfolio deliverables, case studies, and work samples directly into your verified Gaenr showcase.</p>
        <div style="text-align:center;">
          <a href="${uploadPortalUrl}" class="btn-primary" target="_blank">Upload Your Portfolio</a>
          <a href="${profileUrl}" class="btn-secondary" target="_blank">View Live Profile</a>
        </div>
      </div>

      <p style="font-size:12px;color:#94a3b8;line-height:1.5;text-align:center;margin-top:20px;">Please keep your official ID card safe for client authentication and verification.</p>
    </div>
    ${footerHtml}
  </div>
</body>
</html>`;
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
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: emailFrom,
            to: [recipient],
            subject,
            html,
            text,
            attachments: attachments.length > 0 ? attachments : undefined,
          }),
        });
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
