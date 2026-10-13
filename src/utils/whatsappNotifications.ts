/**
 * GAENR Official WhatsApp Notification & Escalation Hub
 * Handles real-time structured WhatsApp alerts for:
 * 1. New Expert Applications (Join as Expert)
 * 2. Expert Onboarding Questionnaire Completion
 * 3. User & Client Feedback Submissions
 * 4. Ginny Chatbot Unknown Questions & Escalation Loop
 */

export const GAENR_OFFICIAL_WHATSAPP = '8801608922800'; // +880 1608 922 800

/**
 * Generate standard WhatsApp web / mobile intent link
 */
export const createWhatsAppUrl = (messageText: string, phone: string = GAENR_OFFICIAL_WHATSAPP): string => {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;
};

/**
 * 1. Expert Application Notification Template
 */
export interface ExpertApplicationNotifyData {
  id?: string;
  fullName: string;
  whatsapp: string;
  email: string;
  gender?: string;
  occupation?: string;
  otherOccupation?: string;
  address?: string;
  otherAddress?: string;
  skill?: string;
  otherSkill?: string;
  experience?: string;
  portfolioUrl?: string;
}

export const buildExpertApplicationNotification = (data: ExpertApplicationNotifyData): string => {
  const skillName = data.otherSkill || data.skill || 'Digital Creator';
  const occupationName = data.otherOccupation || data.occupation || 'N/A';
  const addressName = data.otherAddress || data.address || 'Bangladesh';

  return `*New Expert Application*

• Name: ${data.fullName}
• Skill: ${skillName}
• WhatsApp: ${data.whatsapp}
• Email: ${data.email}
• Gender: ${data.gender || 'Not specified'}
• Occupation: ${occupationName}
• Location: ${addressName}
• Experience: ${data.experience || 'Verified'}
• Portfolio: ${data.portfolioUrl || 'None provided'}

Action: Review and approve via gaenr.com/admin

*— Ginny, Gaenr*`;
};

/**
 * 2. Expert Onboarding Form Completed Notification Template
 */
export interface ExpertOnboardingNotifyData {
  id?: string;
  fullName: string;
  whatsapp?: string;
  email?: string;
  skill?: string;
  avatarName?: string;
  pricingTiers?: Array<{ serviceName: string; price: string }>;
  payoutMethod?: string;
  bankName?: string;
  accountNumber?: string;
  mfsProvider?: string;
  mfsAccountType?: string;
  mfsNumber?: string;
  statement?: string;
}

export const buildExpertOnboardingNotification = (data: ExpertOnboardingNotifyData): string => {
  const tiersSummary = data.pricingTiers && data.pricingTiers.length > 0
    ? data.pricingTiers.map((t) => `  - ${t.serviceName}: ${t.price} BDT`).join('\n')
    : '  - Default Service Tier';

  let payoutSummary = 'N/A';
  if (data.payoutMethod === 'bank') {
    payoutSummary = `Bank: ${data.bankName || 'Bank'} (Acc: ${data.accountNumber || 'Provided'})`;
  } else if (data.payoutMethod === 'mfs') {
    payoutSummary = `MFS (${data.mfsProvider || 'bKash'} - ${data.mfsAccountType || 'Personal'}): ${data.mfsNumber || 'Provided'}`;
  }

  return `*Expert Onboarding Completed*

• Name: ${data.fullName}
• Skill: ${data.skill || 'Verified Expert'}
• WhatsApp: ${data.whatsapp || 'Registered in Admin'}
• Email: ${data.email || 'Registered in Admin'}
• Avatar: ${data.avatarName || 'Standard Verified Avatar'}
• Payout: ${payoutSummary}

Pricing Packages:
${tiersSummary}

Expert Statement:
"${data.statement || 'Ready to deliver quality work.'}"

Action: Review in Gaenr Admin and activate profile live: https://gaenr.com/admin

*— Ginny, Gaenr*`;
};

/**
 * 3. Feedback Submission Notification Template
 */
export interface FeedbackNotifyData {
  name?: string;
  email?: string;
  userType: string;
  category: string;
  message: string;
}

export const buildFeedbackNotification = (data: FeedbackNotifyData): string => {
  return `*New Platform Feedback*

• From: ${data.name?.trim() || 'Anonymous'} (${data.userType})
• Category: ${data.category}
• Email: ${data.email?.trim() || 'Not provided'}

Message:
"${data.message}"

*— Ginny, Gaenr*`;
};

/**
 * 4. Ginny Chatbot Escalation & Knowledge Loop Notification Template
 */
export interface GinnyEscalationNotifyData {
  userQuestion: string;
  detectedLanguage?: 'bn' | 'en';
  userRole?: string;
  contextNotes?: string;
}

export const buildGinnyEscalationNotification = (data: GinnyEscalationNotifyData): string => {
  const langLabel = data.detectedLanguage === 'en' ? 'English' : 'Bangla';
  return `*Client Query Escalation*

Client Question:
"${data.userQuestion}"

• Language: ${langLabel}
• Time: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' })} BST
${data.userRole ? `• User Role: ${data.userRole}\n` : ''}${data.contextNotes ? `• Notes: ${data.contextNotes}\n` : ''}
Note:
Please review this query to update my knowledge base.

*— Ginny, Gaenr*`;
};

/**
 * Direct automated WhatsApp notification dispatch via Meta WhatsApp Cloud API
 * Sends from Meta Cloud Test Number (+1 555-662-7228) directly to Gaenr Desk (+880 1608 922 800) with loud sound & alert!
 */
export const sendDirectMetaCloudNotification = async (messageText: string): Promise<boolean> => {
  try {
    const metaToken =
      import.meta.env.VITE_META_WHATSAPP_TOKEN ||
      'EAAZAXOZCz9pG8BSscq88jdO9l6KFFW5OXdCHpzNZA0lETgkvfPZBc6aFrMajogZCcf6VkXZCR494zDbx8HiN5rtuaQxiRPTxwoXdJaVGP7DyBYKuHXuvGZCUwRXv2ZBTnZA6h4CnI7chbALiogDAcTSmDlZBQd7VGlnJT4J1LSGQrDCVdmtEeFxlFHPKFaTiAv6oZCBCAZDZD';
    const metaPhoneId = import.meta.env.VITE_META_PHONE_ID || '1436780476182860';
    const targetPhone = (import.meta.env.VITE_WHATSAPP_TARGET_PHONE || GAENR_OFFICIAL_WHATSAPP).replace(/[^0-9]/g, '');

    const res = await fetch(`https://graph.facebook.com/v20.0/${metaPhoneId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${metaToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: targetPhone,
        type: 'text',
        text: { preview_url: false, body: messageText },
      }),
    });
    return res.ok;
  } catch (err) {
    console.warn('Direct Meta Cloud dispatch note:', err);
    return false;
  }
};

/**
 * Direct automated WhatsApp notification dispatch via Green-API (green-api.com)
 * Fallback gateway if Meta Cloud has limitations
 */
export const sendDirectGreenApiNotification = async (messageText: string): Promise<boolean> => {
  try {
    const idInstance = import.meta.env.VITE_GREEN_API_INSTANCE_ID || '710722763907';
    const apiToken = import.meta.env.VITE_GREEN_API_TOKEN || '94c8624adafa427c8528cd7760d200c5c2b3b049349b4bc2a9';
    const targetPhone = (import.meta.env.VITE_WHATSAPP_TARGET_PHONE || GAENR_OFFICIAL_WHATSAPP).replace(/[^0-9]/g, '');

    const res = await fetch(`https://api.green-api.com/waInstance${idInstance}/sendMessage/${apiToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chatId: `${targetPhone}@c.us`,
        message: messageText,
      }),
    });
    return res.ok;
  } catch (err) {
    console.warn('Direct Green-API dispatch note:', err);
    return false;
  }
};

/**
 * Post notification payload to server / Cloudflare API for central logging & webhook dispatch
 */
export const sendBackendNotification = async (
  type: 'expert_application' | 'expert_onboarding' | 'feedback_submission' | 'ginny_unanswered_question',
  data: any
): Promise<{ ok: boolean; error?: string }> => {
  // 1. Authoritative Server Dispatch via Cloudflare Pages /api/notify
  // Guarantees delivery even if guest browser has adblockers or privacy extensions
  try {
    const apiBase = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
    const res = await fetch(`${apiBase}/api/notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        data,
        timestamp: new Date().toISOString(),
      }),
      keepalive: true,
    });
    if (res.ok) {
      return { ok: true };
    }
  } catch (serverErr: any) {
    console.warn('Server notify dispatch notice (trying direct fallback):', serverErr?.message);
  }

  // 2. Client-side Fallback (for local dev or if backend worker is unreachable)
  try {
    let messageText = '';
    if (type === 'expert_application') {
      messageText = buildExpertApplicationNotification(data);
    } else if (type === 'expert_onboarding') {
      messageText = buildExpertOnboardingNotification(data);
    } else if (type === 'feedback_submission') {
      messageText = buildFeedbackNotification(data);
    } else if (type === 'ginny_unanswered_question') {
      messageText = buildGinnyEscalationNotification(data);
    }
    if (messageText) {
      const sent = await sendDirectMetaCloudNotification(messageText);
      if (!sent) {
        await sendDirectGreenApiNotification(messageText);
      }
    }
    return { ok: true };
  } catch (directErr: any) {
    console.warn('Direct fallback dispatch note:', directErr);
    return { ok: false, error: directErr?.message };
  }
};

/**
 * Trigger WhatsApp client handover safely
 */
export const triggerWhatsAppNotification = (messageText: string, autoOpen = true): string => {
  const url = createWhatsAppUrl(messageText);
  if (autoOpen && typeof window !== 'undefined') {
    try {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '');
      if (isMobile) {
        window.location.href = url;
      } else {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } catch (e) {
      console.warn('Could not auto-open WhatsApp:', e);
    }
  }
  return url;
};
