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

  return `🚀 [GAENR ALERT] নতুন এক্সপার্ট আবেদন জমা পড়েছে!
━━━━━━━━━━━━━━━━━━━━
👤 নাম: ${data.fullName}
💼 স্কিল: ${skillName}
📞 হোয়াটসঅ্যাপ: ${data.whatsapp}
✉️ ইমেইল: ${data.email}
⚧ লিঙ্গ: ${data.gender || 'Not specified'}
💼 পেশা: ${occupationName}
📍 ঠিকানা: ${addressName}
⏳ অভিজ্ঞতা: ${data.experience || 'Verified'}
🔗 পোর্টফোলিও লিংক:
${data.portfolioUrl || 'None provided'}
━━━━━━━━━━━━━━━━━━━━
📌 পরবর্তী পদক্ষেপ: পোর্টফোলিও যাচাই করে প্রার্থীর সাথে ওভার-কল কথা বলুন এবং gaenr.com/admin থেকে Approve করুন।
🌐 Gaenr Operations Platform`;
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
    ? data.pricingTiers.map((t) => `• ${t.serviceName}: ${t.price} BDT`).join('\n')
    : 'Default Service Tier';

  let payoutSummary = 'N/A';
  if (data.payoutMethod === 'bank') {
    payoutSummary = `ব্যাংক: ${data.bankName || 'Bank'} (Acc: ${data.accountNumber || 'Provided'})`;
  } else if (data.payoutMethod === 'mfs') {
    payoutSummary = `MFS (${data.mfsProvider || 'bKash'} - ${data.mfsAccountType || 'Personal'}): ${data.mfsNumber || 'Provided'}`;
  }

  return `🎉 [GAENR ALERT] এক্সপার্ট অনবোর্ডিং ফর্ম সম্পূর্ণ হয়েছে!
━━━━━━━━━━━━━━━━━━━━
👤 নাম: ${data.fullName}
💼 স্কিল: ${data.skill || 'Verified Expert'}
📞 হোয়াটসঅ্যাপ: ${data.whatsapp || 'Registered in Admin'}
✉️ ইমেইল: ${data.email || 'Registered in Admin'}
🎨 নির্বাচিত অবতার: ${data.avatarName || 'Standard Verified Avatar'}
🏦 পে-আউট মেথড: ${payoutSummary}

💰 নির্ধারিত প্যাকেজসমূহ:
${tiersSummary}

📝 এক্সপার্ট স্টেটমেন্ট:
"${data.statement || 'Ready to deliver quality work.'}"
━━━━━━━━━━━━━━━━━━━━
⚡ তাৎক্ষণিক অ্যাকশন: Gaenr Operations প্যানেলে চেক করে প্রোফাইলটি Live & Verified করে দিন!
🔗 অ্যাডমিন ড্যাশবোর্ড: https://gaenr.com/admin
🌐 Gaenr Talent Network`;
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
  return `💬 [GAENR FEEDBACK] নতুন প্ল্যাটফর্ম ফিডব্যাক জমা হয়েছে!
━━━━━━━━━━━━━━━━━━━━
👤 প্রেরক: ${data.name?.trim() || 'নাম প্রকাশে অনিচ্ছুক (Anonymous)'}
🏷️ ভূমিকা: ${data.userType}
📌 ক্যাটাগরি: ${data.category}
✉️ ইমেইল: ${data.email?.trim() || 'প্রদান করা হয়নি'}

📝 মতামত / বার্তা:
"${data.message}"
━━━━━━━━━━━━━━━━━━━━
🌐 Gaenr Quality & Experience Team`;
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
  const langLabel = data.detectedLanguage === 'en' ? 'English' : 'বাংলা (Bangla)';
  return `🤖 [GINNY ESCALATION] ব্যবহারকারীর অজানা প্রশ্ন ও নলেজ রিকুয়েস্ট
━━━━━━━━━━━━━━━━━━━━
❓ ক্লায়েন্ট / ইউজারের প্রশ্ন:
"${data.userQuestion}"

🗣️ ভাষা: ${langLabel}
⏰ সময়: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' })} BST
${data.userRole ? `👤 ইউজার ভূমিকা: ${data.userRole}\n` : ''}${data.contextNotes ? `📌 নোট: ${data.contextNotes}\n` : ''}
💡 গিনির বার্তা:
"টিম গেইনার, এই প্রশ্নের সঠিক সমাধান দিলে আমি ক্লায়েন্টকে সহায়তা করতে পারব এবং পরবর্তীতে আমার নলেজ ব্যাংকে এই তথ্য যুক্ত করে আমি আরও উন্নত হতে পারব।"
━━━━━━━━━━━━━━━━━━━━
📲 Gaenr AI Intelligence Core`;
};

/**
 * Post notification payload to server / Cloudflare API for central logging & webhook dispatch
 */
export const sendBackendNotification = async (
  type: 'expert_application' | 'expert_onboarding' | 'feedback_submission' | 'ginny_unanswered_question',
  data: any
): Promise<{ ok: boolean; error?: string }> => {
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
    });
    if (res.ok) {
      return { ok: true };
    }
    return { ok: false, error: `HTTP ${res.status}` };
  } catch (err: any) {
    // Non-blocking log if offline or local dev
    console.warn('Backend notification logging note:', err?.message);
    return { ok: false, error: err?.message };
  }
};

/**
 * Trigger WhatsApp client handover safely
 */
export const triggerWhatsAppNotification = (messageText: string, autoOpen = true): string => {
  const url = createWhatsAppUrl(messageText);
  if (autoOpen && typeof window !== 'undefined') {
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (e) {
      console.warn('Could not auto-open WhatsApp:', e);
    }
  }
  return url;
};
