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

    if (type === 'onboarding_invite') {
      recipient = (payload.email || '').trim();
      const name = (payload.fullName || 'there').trim();
      const skill = (payload.skill || 'Digital Creator').trim();
      const onboardingUrl = `${siteUrl}/onboard/${payload.applicationId}?name=${encodeURIComponent(name)}&email=${encodeURIComponent(recipient)}&skill=${encodeURIComponent(skill)}`;
      subject = 'Congratulations! Your Gaenr Expert Application is Approved';
      text = `Hi ${name},\n\nCongratulations! We are pleased to inform you that your application has been reviewed and approved as a Verified Expert in ${skill}.\n\nPlease complete the expert onboarding form below to finalize your profile:\n\nComplete Onboarding Form: ${onboardingUrl}\n\nTeam Gaenr\nhttps://gaenr.com`;
      html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><style>body{font-family:'DM Sans',sans-serif;background:#f8fafc;color:#1e293b;padding:20px;margin:0;} .card{max-width:540px;margin:0 auto;background:#ffffff;border-radius:20px;border:1px solid #e2e8f0;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.05);} .hdr{background:#0a1222;padding:24px;text-align:center;color:#fff;} .logo{font-size:20px;font-weight:800;letter-spacing:3px;color:#006eff;} .body{padding:30px;} .btn{display:inline-block;background:#006eff;color:#ffffff !important;padding:14px 36px;border-radius:9999px;font-weight:700;text-decoration:none;font-size:14px;} .ftr{background:#f8fafc;padding:20px;text-align:center;font-size:12px;color:#64748b;border-top:1px solid #edf2f7;}</style></head>
<body>
  <div class="card">
    <div class="hdr"><div class="logo">GAENR</div></div>
    <div class="body">
      <h2 style="font-size:20px;margin-top:0;">Congratulations, <span style="color:#006eff;">${name}</span>!</h2>
      <p style="font-size:14px;line-height:1.6;color:#475569;">We are pleased to inform you that your application has been reviewed and officially approved as a <strong>Verified Expert in ${skill}</strong>.</p>
      <p style="font-size:14px;line-height:1.6;color:#475569;">Please complete the expert onboarding form below to finalize your profile setup:</p>
      <div style="text-align:center;margin:30px 0;">
        <a href="${onboardingUrl}" class="btn" target="_blank">Complete Onboarding Form &rarr;</a>
      </div>
      <p style="font-size:12px;color:#94a3b8;line-height:1.5;">Direct link: <a href="${onboardingUrl}" style="color:#006eff;">${onboardingUrl}</a></p>
    </div>
    <div class="ftr"><strong>Team Gaenr</strong> &bull; <a href="https://gaenr.com" style="color:#006eff;text-decoration:none;">gaenr.com</a></div>
  </div>
</body>
</html>`;
    } else if (type === 'applicant_received') {
      recipient = (payload.email || '').trim();
      const name = (payload.fullName || 'there').trim();
      const skill = (payload.skill || 'Digital Creator').trim();
      subject = 'Gaenr Expert Application Received';
      text = `Hi ${name},\n\nThank you for applying to join Gaenr as an Expert in ${skill}!\n\nWe have successfully received your application. Our vetting team is actively reviewing your credentials.\n\nBest regards,\nTeam Gaenr\nhttps://gaenr.com`;
      html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><style>body{font-family:'DM Sans',sans-serif;background:#f8fafc;color:#1e293b;padding:20px;margin:0;} .card{max-width:540px;margin:0 auto;background:#ffffff;border-radius:20px;border:1px solid #e2e8f0;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.05);} .hdr{background:#0a1222;padding:24px;text-align:center;color:#fff;} .logo{font-size:20px;font-weight:800;letter-spacing:3px;color:#006eff;} .body{padding:30px;} .ftr{background:#f8fafc;padding:20px;text-align:center;font-size:12px;color:#64748b;border-top:1px solid #edf2f7;}</style></head>
<body>
  <div class="card">
    <div class="hdr"><div class="logo">GAENR</div></div>
    <div class="body">
      <h2 style="font-size:20px;margin-top:0;">Application Received, <span style="color:#006eff;">${name}</span>!</h2>
      <p style="font-size:14px;line-height:1.6;color:#475569;">Thank you for applying to join Gaenr as a Verified Expert in <strong>${skill}</strong>. Our team is actively reviewing your application.</p>
    </div>
    <div class="ftr"><strong>Team Gaenr</strong> &bull; <a href="https://gaenr.com" style="color:#006eff;text-decoration:none;">gaenr.com</a></div>
  </div>
</body>
</html>`;
    } else {
      // Welcome email
      recipient = (payload.expert?.privateEmail || payload.email || '').trim();
      const name = (payload.expert?.name || 'there').trim();
      const code = (payload.code || payload.expert?.code || '').trim();
      const profileUrl = `${siteUrl}/experts/${encodeURIComponent(code)}`;
      const uploadToken = payload.expert?.uploadToken || code;
      const uploadPortalUrl = `${siteUrl}/u/${encodeURIComponent(uploadToken)}`;
      subject = 'Your GAENR Expert Profile is Live';
      text = `Hi ${name},\n\nCongratulations! Your verified expert profile (${code}) is now live on Gaenr.\n\nView Profile: ${profileUrl}\nUpload Portal: ${uploadPortalUrl}\n\nTeam Gaenr`;

      const cardDataUrl = payload.cardImage || payload.cardImageDataUrl || '';
      const cardPreviewHtml = cardDataUrl
        ? `<div style="text-align:center;margin:24px 0;">
            <img src="${cardDataUrl}" alt="GAENR Official Verified ID Card" style="max-width:320px;width:100%;border-radius:18px;border:1px solid #cbd5e1;box-shadow:0 12px 30px rgba(0,0,0,0.12);display:inline-block;" />
            <p style="font-size:12px;color:#64748b;margin:8px 0 0;font-weight:600;">Official Digital ID Card &bull; ID: <span style="font-family:monospace;color:#006eff;">${code}</span></p>
          </div>`
        : '';

      html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><style>body{font-family:'DM Sans',sans-serif;background:#f8fafc;color:#1e293b;padding:20px;margin:0;} .card{max-width:540px;margin:0 auto;background:#ffffff;border-radius:20px;border:1px solid #e2e8f0;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.05);} .hdr{background:#0a1222;padding:24px;text-align:center;color:#fff;} .logo{font-size:20px;font-weight:800;letter-spacing:3px;color:#006eff;} .body{padding:30px;} .btn{display:inline-block;background:#006eff;color:#ffffff !important;padding:12px 30px;border-radius:9999px;font-weight:700;text-decoration:none;font-size:13px;} .sec-btn{display:inline-block;background:#f1f5f9;color:#0f172a !important;padding:12px 30px;border-radius:9999px;font-weight:700;text-decoration:none;font-size:13px;border:1px solid #cbd5e1;margin-left:8px;} .ftr{background:#f8fafc;padding:20px;text-align:center;font-size:12px;color:#64748b;border-top:1px solid #edf2f7;}</style></head>
<body>
  <div class="card">
    <div class="hdr"><div class="logo">GAENR</div></div>
    <div class="body">
      <h2 style="font-size:20px;margin-top:0;">Profile Live, <span style="color:#006eff;">${name}</span>!</h2>
      <p style="font-size:14px;line-height:1.6;color:#475569;">Congratulations! Your verified expert profile (Official ID: <strong>${code}</strong>) is now active and live on Gaenr.</p>
      ${cardPreviewHtml}
      <div style="text-align:center;margin:30px 0;">
        <a href="${profileUrl}" class="btn" target="_blank">View Live Profile</a>
        <a href="${uploadPortalUrl}" class="sec-btn" target="_blank">Upload Portal</a>
      </div>
      <p style="font-size:12px;color:#94a3b8;line-height:1.5;text-align:center;">Your official digital ID card has been attached to this email. Please keep it safe for verification.</p>
    </div>
    <div class="ftr"><strong>Team Gaenr</strong> &bull; <a href="https://gaenr.com" style="color:#006eff;text-decoration:none;">gaenr.com</a></div>
  </div>
</body>
</html>`;
    }

    const attachments = [];
    const cardData = payload.cardImage || payload.cardImageDataUrl;
    if (cardData && typeof cardData === 'string') {
      const code = (payload.code || payload.expert?.code || 'EXPERT').trim();
      const base64Content = cardData.includes(',') ? cardData.split(',')[1] : cardData;
      attachments.push({
        filename: `GAENR-ID-${code}.png`,
        content: base64Content,
      });
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
