function formatWhatsAppMessage(type, data) {
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

— Ginny, Gaenr`;
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

— Ginny, Gaenr`;
  }
  if (type === 'feedback_submission') {
    return `*New Platform Feedback*

• From: ${data?.name || 'Anonymous'} (${data?.userType || 'Visitor'})
• Category: ${data?.category || 'General'}
• Email: ${data?.email || 'Not provided'}

Message:
"${data?.message || ''}"

— Ginny, Gaenr`;
  }
  if (type === 'ginny_unanswered_question') {
    return `*Client Query Escalation*

Client Question:
"${data?.userQuestion || ''}"

• Time: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' })} BST

Note:
Please review this query to update my knowledge base.

— Ginny, Gaenr`;
  }
  return `*Platform Event: ${type}*

— Ginny, Gaenr`;
}

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
    const defaultWebhook = 'https://script.google.com/macros/s/AKfycbzSo8p6JPfJKNfv9_yFBMyBMOxoOLyFcDkuirNgjj3dpvVOH-4la7FjyS_ybqLlQhYSUg/exec';
    const webhookUrl = env?.GOOGLE_WEBHOOK_URL || env?.VITE_GOOGLE_DRIVE_WEBHOOK_URL || defaultWebhook;
    const waGatewayUrl = env?.WHATSAPP_GATEWAY_URL;
    const resendApiKey = env?.RESEND_API_KEY;
    const siteUrl = (env?.APP_URL || env?.SITE_URL || 'https://gaenr.com').replace(/\/$/, '');

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

    // 2. Forward to configured Webhook (Google Apps Script)
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

    // 3. Dispatch Instant Operations Email Alert to contact@gmail.com
    let emailDispatched = false;
    if (resendApiKey) {
      try {
        let alertSubject = `🚨 [GAENR ALERT] Platform Event: ${type}`;
        let alertDetailsHtml = `<pre style="background:#f8fafc;padding:12px;border-radius:8px;font-size:12px;overflow:auto;">${JSON.stringify(data, null, 2)}</pre>`;

        if (type === 'expert_onboarding') {
          const name = data.fullName || 'Candidate';
          const cleanSkill = (data.skill || 'Verified Expert').split('/')[0].replace(/[\u0980-\u09FF]/g, '').trim();
          alertSubject = `🎉 [ONBOARDING COMPLETED] ${name} (${cleanSkill})`;
          alertDetailsHtml = `
          <div style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:14px;padding:16px 20px;margin-bottom:20px;">
            <span style="font-size:11px;font-weight:700;color:#047857;text-transform:uppercase;letter-spacing:1px;">Onboarding Completed</span>
            <h2 style="font-size:20px;font-weight:800;color:#0f172a;margin:6px 0 0 0;">${name} (${cleanSkill})</h2>
          </div>
          <table style="width:100%;border-collapse:collapse;font-size:13px;color:#334155;margin-bottom:20px;">
            <tr><td style="padding:6px 0;font-weight:600;width:130px;">Expert Name:</td><td>${name}</td></tr>
            <tr><td style="padding:6px 0;font-weight:600;">Skill:</td><td><strong style="color:#006eff;">${cleanSkill}</strong></td></tr>
            <tr><td style="padding:6px 0;font-weight:600;">Selected Avatar:</td><td>${data.avatarName || 'Standard'}</td></tr>
            <tr><td style="padding:6px 0;font-weight:600;">Payout Method:</td><td><strong>${data.payoutMethod === 'bank' ? `Bank (${data.bankName || 'Bank'} - Acc: ${data.accountNumber || 'Provided'})` : `MFS (${data.mfsProvider || 'bKash'} ${data.mfsAccountType || 'Personal'} - ${data.mfsNumber || 'Provided'})`}</strong></td></tr>
            <tr><td style="padding:6px 0;font-weight:600;">Statement:</td><td><em>"${data.statement || 'Ready'}"</em></td></tr>
          </table>
          <div style="text-align:center;margin-top:24px;">
            <a href="${siteUrl}/admin" style="display:inline-block;background:#006eff;color:#ffffff !important;padding:12px 30px;border-radius:9999px;font-weight:700;text-decoration:none;font-size:13px;box-shadow:0 4px 14px rgba(0,110,255,0.25);" target="_blank">Open Admin &amp; Publish Live Profile &rarr;</a>
          </div>`;
        } else if (type === 'expert_application') {
          const name = data.fullName || 'Applicant';
          const cleanSkill = (data.otherSkill || data.skill || 'Digital Creator').split('/')[0].replace(/[\u0980-\u09FF]/g, '').trim();
          const cleanWa = (data.whatsapp || '').replace(/[^0-9]/g, '');
          alertSubject = `🚀 [NEW EXPERT APPLICATION] ${name} (${cleanSkill})`;
          alertDetailsHtml = `
          <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:14px;padding:16px 20px;margin-bottom:20px;">
            <span style="font-size:11px;font-weight:700;color:#1d4ed8;text-transform:uppercase;letter-spacing:1px;">New Expert Application</span>
            <h2 style="font-size:20px;font-weight:800;color:#0f172a;margin:6px 0 0 0;">${name} (${cleanSkill})</h2>
          </div>
          <table style="width:100%;border-collapse:collapse;font-size:13px;color:#334155;margin-bottom:20px;">
            <tr><td style="padding:6px 0;font-weight:600;width:130px;">Name:</td><td>${name}</td></tr>
            <tr><td style="padding:6px 0;font-weight:600;">Skill:</td><td><strong style="color:#006eff;">${cleanSkill}</strong></td></tr>
            <tr><td style="padding:6px 0;font-weight:600;">WhatsApp:</td><td><a href="https://wa.me/${cleanWa}" target="_blank" style="color:#006eff;font-weight:700;">${data.whatsapp || 'N/A'}</a></td></tr>
            <tr><td style="padding:6px 0;font-weight:600;">Email:</td><td>${data.email || 'N/A'}</td></tr>
            <tr><td style="padding:6px 0;font-weight:600;">Portfolio:</td><td><a href="${data.portfolioUrl || '#'}" target="_blank" style="color:#006eff;">${data.portfolioUrl || 'None'}</a></td></tr>
          </table>
          <div style="text-align:center;margin-top:24px;">
            <a href="${siteUrl}/admin" style="display:inline-block;background:#006eff;color:#ffffff !important;padding:12px 30px;border-radius:9999px;font-weight:700;text-decoration:none;font-size:13px;" target="_blank">Open Admin Review &rarr;</a>
            ${cleanWa ? `&nbsp;<a href="https://wa.me/${cleanWa}" style="display:inline-block;background:#10b981;color:#ffffff !important;padding:12px 24px;border-radius:9999px;font-weight:700;text-decoration:none;font-size:13px;" target="_blank">Chat on WhatsApp</a>` : ''}
          </div>`;
        } else if (type === 'feedback_submission') {
          alertSubject = `💬 [GAENR FEEDBACK] New Feedback from ${data.name || 'Anonymous'}`;
          alertDetailsHtml = `
          <div style="background:#fef3c7;border:1px solid #fde68a;border-radius:14px;padding:16px 20px;margin-bottom:20px;">
            <span style="font-size:11px;font-weight:700;color:#b45309;text-transform:uppercase;letter-spacing:1px;">User Feedback</span>
            <h2 style="font-size:18px;font-weight:800;color:#0f172a;margin:6px 0 0 0;">${data.category || 'General Feedback'}</h2>
          </div>
          <p style="font-size:14px;color:#334155;line-height:1.6;"><strong>From:</strong> ${data.name || 'Anonymous'} (${data.userType || 'Visitor'}${data.email ? ` - ${data.email}` : ''})</p>
          <div style="background:#f8fafc;border-left:4px solid #f59e0b;padding:12px 16px;margin:16px 0;font-style:italic;color:#1e293b;font-size:13px;">
            "${data.message || ''}"
          </div>`;
        } else if (type === 'ginny_unanswered_question') {
          alertSubject = `🤖 [GINNY ALERT] Unanswered Question Escalation`;
          alertDetailsHtml = `
          <div style="background:#f3e8ff;border:1px solid #e9d5ff;border-radius:14px;padding:16px 20px;margin-bottom:20px;">
            <span style="font-size:11px;font-weight:700;color:#7e22ce;text-transform:uppercase;letter-spacing:1px;">Ginny AI Knowledge Escalation</span>
            <h2 style="font-size:18px;font-weight:800;color:#0f172a;margin:6px 0 0 0;">Client Query Requiring Team Review</h2>
          </div>
          <div style="background:#f8fafc;border-left:4px solid #8b5cf6;padding:12px 16px;margin:16px 0;color:#1e293b;font-size:14px;font-weight:600;">
            "${data.userQuestion || ''}"
          </div>
          <p style="font-size:12px;color:#64748b;">Ginny could not fully answer this question with the current playbook. Please review and update Ginny's Knowledge Bank.</p>`;
        }

        const emailHtml = `<!DOCTYPE html><html><body style="font-family:sans-serif;background:#edf2f7;padding:24px 10px;margin:0;">
        <table width="100%" border="0" cellpadding="0" cellspacing="0"><tr><td align="center">
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #cbd5e1;box-shadow:0 10px 30px rgba(0,0,0,0.06);">
          <tr><td height="7" bgcolor="#006eff" style="height:7px;background:#006eff;background:linear-gradient(90deg, #0048ba 0%, #006eff 50%, #38bdf8 100%);line-height:7px;font-size:0;padding:0;margin:0;">&nbsp;</td></tr>
          <tr><td style="padding:28px 24px;">${alertDetailsHtml}</td></tr>
          <tr><td align="center" style="padding:16px;background:#f8fafc;border-top:1px solid #f1f5f9;font-size:11px;color:#64748b;font-weight:600;letter-spacing:1px;text-transform:uppercase;">TEAM GAENR OPERATIONS &bull; 09647 922 800</td></tr>
        </table>
        </td></tr></table></body></html>`;

        const mailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Gaenr System <contact@gaenr.com>',
            reply_to: data?.email || 'contact@gmail.com',
            to: ['contact@gmail.com'],
            subject: alertSubject,
            html: emailHtml,
          }),
        });
        if (mailRes.ok) emailDispatched = true;
      } catch (mailErr) {
        console.warn('Direct Ops email alert warning:', mailErr);
      }
    }

    // 4. Automated Direct WhatsApp Dispatch (CallMeBot / Meta Cloud / UltraMsg / Gateway)
    const waMessageText = formatWhatsAppMessage(type, data);
    const targetWaNumber = (env?.WHATSAPP_TARGET_PHONE || '8801608922800').replace(/[^0-9]/g, '');
    let callMeBotDispatched = false;
    let metaCloudDispatched = false;

    // 4A. CallMeBot Instant Free WhatsApp Dispatch
    const callMeBotKey = env?.CALLMEBOT_API_KEY;
    if (callMeBotKey) {
      try {
        const cmbUrl = `https://api.callmebot.com/whatsapp.php?phone=+${targetWaNumber}&text=${encodeURIComponent(waMessageText)}&apikey=${encodeURIComponent(callMeBotKey)}`;
        const cmbRes = await fetch(cmbUrl);
        if (cmbRes.ok) callMeBotDispatched = true;
      } catch (cmbErr) {
        console.warn('CallMeBot dispatch notice:', cmbErr);
      }
    }

    // 4B. Meta WhatsApp Business Cloud API Dispatch (Primary: sends from +1 555 number with loud ringtone)
    const metaToken =
      env?.WHATSAPP_TOKEN ||
      env?.META_WHATSAPP_TOKEN ||
      'EAAZAXOZCz9pG8BSscq88jdO9l6KFFW5OXdCHpzNZA0lETgkvfPZBc6aFrMajogZCcf6VkXZCR494zDbx8HiN5rtuaQxiRPTxwoXdJaVGP7DyBYKuHXuvGZCUwRXv2ZBTnZA6h4CnI7chbALiogDAcTSmDlZBQd7VGlnJT4J1LSGQrDCVdmtEeFxlFHPKFaTiAv6oZCBCAZDZD';
    const metaPhoneId = env?.WHATSAPP_PHONE_ID || env?.META_PHONE_ID || '1436780476182860';
    if (metaToken && metaPhoneId) {
      try {
        const metaRes = await fetch(`https://graph.facebook.com/v20.0/${metaPhoneId}/messages`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${metaToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: targetWaNumber,
            type: 'text',
            text: { preview_url: false, body: waMessageText },
          }),
        });
        if (metaRes.ok) metaCloudDispatched = true;
      } catch (metaErr) {
        console.warn('Meta WhatsApp Cloud dispatch notice:', metaErr);
      }
    }

    // 4C. Green-API Native WhatsApp Dispatch (Fallback only if Meta Cloud did not dispatch)
    const greenApiInstance = env?.GREEN_API_INSTANCE_ID || '710722763907';
    const greenApiToken = env?.GREEN_API_TOKEN || '94c8624adafa427c8528cd7760d200c5c2b3b049349b4bc2a9';
    let greenApiDispatched = false;

    if (!metaCloudDispatched && greenApiInstance && greenApiToken) {
      try {
        const greenUrl = `https://api.green-api.com/waInstance${greenApiInstance}/sendMessage/${greenApiToken}`;
        const greenRes = await fetch(greenUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chatId: `${targetWaNumber}@c.us`,
            message: waMessageText,
          }),
        });
        if (greenRes.ok) greenApiDispatched = true;
      } catch (greenErr) {
        console.warn('Green-API dispatch notice:', greenErr);
      }
    }

    // 4D. Forward to WhatsApp Gateway API (UltraMsg / Custom Gateway)
    let gatewayDispatched = false;
    if (waGatewayUrl) {
      try {
        const isUltraMsg = waGatewayUrl.includes('ultramsg.com');
        const gwBody = isUltraMsg
          ? JSON.stringify({ to: targetWaNumber, body: waMessageText })
          : JSON.stringify({
              recipient: targetWaNumber,
              type,
              data,
              message: waMessageText,
            });

        const gwRes = await fetch(waGatewayUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(env?.WHATSAPP_GATEWAY_TOKEN ? { Authorization: `Bearer ${env.WHATSAPP_GATEWAY_TOKEN}` } : {}),
          },
          body: gwBody,
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
        emailDispatched,
        callMeBotDispatched,
        metaCloudDispatched,
        greenApiDispatched,
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
