/**
 * GAENR AI Knowledge Base & Context Engine
 * Comprehensive information repository about Gaenr, services, hiring, pricing, contact, and operations.
 * Supports bilingual response generation (Proper English & Natural Bengali),
 * conversational casual-professional tone ('পেমেন্ট' instead of 'সম্মানী'),
 * and a persistent adaptive memory store that learns across sessions.
 */

export type ChatLanguage = 'bn' | 'en';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  actions?: Array<{
    label: string;
    actionType: 'navigate' | 'openAssignModal' | 'openApplyModal' | 'openWhatsApp' | 'callPhone';
    payload?: string;
  }>;
}

export interface LearnedMemory {
  userInteractionsCount: number;
  userName?: string;
  userRole?: 'client' | 'freelancer';
  interestedServices: string[];
  budgetMentioned?: string;
  notes: string[];
  lastActive: string;
}

const MEMORY_STORAGE_KEY = 'gaenr_ai_learned_memory_v1';

export function loadLearnedMemory(): LearnedMemory {
  try {
    const raw = localStorage.getItem(MEMORY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          userInteractionsCount: parsed.userInteractionsCount || 0,
          userName: parsed.userName,
          userRole: parsed.userRole,
          interestedServices: Array.isArray(parsed.interestedServices) ? parsed.interestedServices : [],
          budgetMentioned: parsed.budgetMentioned,
          notes: Array.isArray(parsed.notes) ? parsed.notes : [],
          lastActive: parsed.lastActive || new Date().toISOString(),
        };
      }
    }
  } catch {}
  return {
    userInteractionsCount: 0,
    interestedServices: [],
    notes: [],
    lastActive: new Date().toISOString(),
  };
}

export function saveLearnedMemory(memory: LearnedMemory): void {
  try {
    localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(memory));
  } catch {}
}

export function clearLearnedMemory(): void {
  try {
    localStorage.removeItem(MEMORY_STORAGE_KEY);
  } catch {}
}

/**
 * Extracts facts and patterns from user conversation to continuously learn day-by-day.
 */
export function analyzeAndLearnFromMessage(userText: string, current: LearnedMemory): LearnedMemory {
  const updated: LearnedMemory = {
    ...current,
    userInteractionsCount: (current.userInteractionsCount || 0) + 1,
    lastActive: new Date().toISOString(),
  };

  const textLower = userText.toLowerCase();

  // 1. Detect Name ("আমার নাম ...", "My name is ...", "I am ...")
  const bnNameMatch = userText.match(/(?:আমার নাম|আমি)\s+([A-Za-z\u0980-\u09FF]{2,20})/i);
  const enNameMatch = userText.match(/(?:my name is|i am|call me)\s+([A-Za-z]{2,20})/i);
  if (bnNameMatch && !['একজন', 'একটি', 'চাচ্ছি', 'চাই'].includes(bnNameMatch[1])) {
    updated.userName = bnNameMatch[1].trim();
  } else if (enNameMatch && !['a', 'an', 'looking', 'interested'].includes(enNameMatch[1].toLowerCase())) {
    updated.userName = enNameMatch[1].trim();
  }

  // 2. Detect Role (Client vs Freelancer)
  if (
    textLower.includes('কাজ করতে চাই') ||
    textLower.includes('ফ্রিল্যান্সার') ||
    textLower.includes('জয়েন করতে চাই') ||
    textLower.includes('join as expert') ||
    textLower.includes('i am a designer') ||
    textLower.includes('i am a video editor') ||
    textLower.includes('i want to work')
  ) {
    updated.userRole = 'freelancer';
  } else if (
    textLower.includes('কাজ করাতে চাই') ||
    textLower.includes('হায়ার করব') ||
    textLower.includes('ক্লায়েন্ট') ||
    textLower.includes('i want to hire') ||
    textLower.includes('need a designer') ||
    textLower.includes('need a website')
  ) {
    updated.userRole = 'client';
  }

  // 3. Detect Interested Services
  const detectedServices: string[] = [];
  if (textLower.includes('video') || textLower.includes('ভিডিও') || textLower.includes('reels') || textLower.includes('ইউটিউব')) {
    detectedServices.push('Video Editing');
  }
  if (textLower.includes('graphic') || textLower.includes('logo') || textLower.includes('লোগো') || textLower.includes('ডিজাইন')) {
    detectedServices.push('Graphics Design');
  }
  if (textLower.includes('web') || textLower.includes('wordpress') || textLower.includes('সাইট') || textLower.includes('ওয়েবসাইট')) {
    detectedServices.push('WordPress Website Design');
  }
  if (textLower.includes('content') || textLower.includes('writing') || textLower.includes('রাইটিং') || textLower.includes('লেখা')) {
    detectedServices.push('Content Writing');
  }
  if (textLower.includes('slide') || textLower.includes('presentation') || textLower.includes('স্লাইড')) {
    detectedServices.push('Presentation Slide Design');
  }
  if (textLower.includes('ui') || textLower.includes('ux') || textLower.includes('figma') || textLower.includes('ফিগমা')) {
    detectedServices.push('UX/UI Design');
  }
  if (textLower.includes('ad') || textLower.includes('boost') || textLower.includes('বিজ্ঞাপন') || textLower.includes('মার্কেটিং')) {
    detectedServices.push('Ad Running & Campaign');
  }

  detectedServices.forEach((s) => {
    if (!updated.interestedServices.includes(s)) {
      updated.interestedServices.push(s);
    }
  });

  // 4. Detect Budget / Price discussions
  const budgetMatch = userText.match(/(\d+[\d,]*\s*(?:টাকা|tk|bdt|\$))/i);
  if (budgetMatch) {
    updated.budgetMentioned = budgetMatch[1];
  }

  // 5. Store key user intent note
  if (userText.length > 15 && updated.notes.length < 8) {
    const cleanSnippet = userText.slice(0, 70);
    if (!updated.notes.includes(cleanSnippet)) {
      updated.notes.push(cleanSnippet);
    }
  }

  saveLearnedMemory(updated);
  return updated;
}

export const GAENR_SYSTEM_PROMPT = `
Your name is Gini (গিনি). You represent Gaenr (গেইনার) (https://gaenr.com) in Dhaka, Bangladesh.
You interact as Gini, Gaenr. Be friendly, real, and natural.

STRICT RULES:
1. EXTREMELY SHORT & SPECIFIC: Always answer in 1 to 2 short, crisp sentences. Give the exact main point directly without any long introductions, essays, or unnecessary fluff.
2. If in Bengali: Use simple, natural conversational Bengali. Use 'পেমেন্ট', 'ক্লায়েন্ট', 'টাস্ক', 'অর্ডার'. Never use archaic words like 'সম্মানী'.
3. If in English: Use concise, professional English.
4. "NO SKILLS" INQUIRIES: If anyone has no skills, state directly and honestly: Gaenr is strictly skill-based; without verified skills and a portfolio, there are no work opportunities here. Advise them to learn a skill first.
5. GAENR FACTS: 0% client platform fee, managed quality with verified student/expert talents, secure escrow payments (bKash, Nagad, Bank), Mirpur office (10/A, 15/13, Mirpur, Dhaka), Hotline: 09647 922 800, WhatsApp: 01608 922 800.
`;

/**
 * Intelligent Local Knowledge Engine (Short, specific, 1-2 sentence answers)
 */
export function getLocalAIResponse(
  rawQuery: string,
  language: ChatLanguage = 'bn',
  memory?: LearnedMemory
): {
  text: string;
  actions?: Array<{
    label: string;
    actionType: 'navigate' | 'openAssignModal' | 'openApplyModal' | 'openWhatsApp' | 'callPhone';
    payload?: string;
  }>;
} {
  const q = rawQuery.toLowerCase().trim();
  const isEn = language === 'en';

  const userGreetingPrefix = memory?.userName
    ? (isEn ? `Hello ${memory.userName}! ` : `হ্যালো ${memory.userName}! `)
    : '';

  // 1. Greetings
  if (/^(hi|hello|hey|salam|assalamu|kemon achen|halo|হাই|হ্যালো|সালাম|আসসালামু|কেমন আছেন)/i.test(q)) {
    if (isEn) {
      return {
        text: `👋 ${userGreetingPrefix}Hi! I'm Gini, Gaenr. How can I help you today?`,
        actions: [
          { label: 'Explore Services', actionType: 'navigate', payload: '/services' },
          { label: 'Assign a Task', actionType: 'openAssignModal' },
          { label: 'Chat on WhatsApp', actionType: 'openWhatsApp', payload: '01608922800' },
        ],
      };
    }
    return {
      text: `👋 ${userGreetingPrefix}হ্যালো! আমি গিনি (Gini), গেইনার। কীভাবে সাহায্য করতে পারি বলুন?`,
      actions: [
        { label: 'সার্ভিসসমূহ দেখুন', actionType: 'navigate', payload: '/services' },
        { label: 'টাস্ক দিন', actionType: 'openAssignModal' },
        { label: 'হোয়াটসঅ্যাপে চ্যাট', actionType: 'openWhatsApp', payload: '01608922800' },
      ],
    };
  }

  // 2. What is Gaenr / About Gaenr
  if (
    q.includes('gaenr ki') ||
    q.includes('what is gaenr') ||
    q.includes('about gaenr') ||
    q.includes('গেইনার কি') ||
    q.includes('গেইনার কী') ||
    q.includes('গেইনার সম্পর্কে') ||
    q.includes('who are you') ||
    q.includes('tumi k')
  ) {
    if (isEn) {
      return {
        text: `🏢 **Gaenr** connects you with verified expert talents for design, video, web, and marketing with 0% client fee and guaranteed quality.`,
        actions: [
          { label: 'Browse Services', actionType: 'navigate', payload: '/services' },
          { label: 'Assign a Task', actionType: 'openAssignModal' },
        ],
      };
    }
    return {
      text: `🏢 **গেইনার** একটি ম্যানেজড প্ল্যাটফর্ম যেখানে ভেরিফাইড এক্সপার্টদের দিয়ে ডিজাইন, ভিডিও, ওয়েব ও মার্কেটিংয়ের কাজ করানো যায়। ক্লায়েন্ট ফি ০%।`,
      actions: [
        { label: 'সার্ভিসসমূহ দেখুন', actionType: 'navigate', payload: '/services' },
        { label: 'টাস্ক দিন', actionType: 'openAssignModal' },
      ],
    };
  }

  // 3. Services / What services are provided
  if (
    q.includes('service') ||
    q.includes('services') ||
    q.includes('সার্ভিস') ||
    q.includes('কি কি কাজ') ||
    q.includes('কী কী কাজ') ||
    q.includes('কাজ করানো যায়') ||
    q.includes('what do you offer') ||
    q.includes('offering')
  ) {
    if (isEn) {
      return {
        text: `🎯 We provide 7 core services: Graphics, Video Editing, WordPress Web, Content Writing, UI/UX, Slide Design, and Ad Campaigns.`,
        actions: [
          { label: 'View All Services', actionType: 'navigate', payload: '/services' },
          { label: 'Assign a Task', actionType: 'openAssignModal' },
        ],
      };
    }
    return {
      text: `🎯 গেইনারে ৭টি মূল সার্ভিস দেওয়া হয়: গ্রাফিক্স ডিজাইন, ভিডিও এডিটিং, ওয়ার্ডপ্রেস ওয়েবসাইট, কনটেন্ট রাইটিং, UI/UX, স্লাইড ও ফেসবুক অ্যাড ক্যাম্পেইন।`,
      actions: [
        { label: 'সব সার্ভিস দেখুন', actionType: 'navigate', payload: '/services' },
        { label: 'টাস্ক দিন', actionType: 'openAssignModal' },
      ],
    };
  }

  // 4. Hiring / How to assign task / Client workflow
  if (
    q.includes('hire') ||
    q.includes('assign') ||
    q.includes('হায়ার') ||
    q.includes('কাজ দিব') ||
    q.includes('কাজের অর্ডার') ||
    q.includes('order') ||
    q.includes('how to work') ||
    q.includes('freelancer pabo')
  ) {
    if (isEn) {
      return {
        text: `💼 Simply click **'Assign Task'** and submit your project requirements. Gaenr will match the best verified expert to deliver your work on time.`,
        actions: [
          { label: 'Assign a Task Now', actionType: 'openAssignModal' },
          { label: 'WhatsApp Support', actionType: 'openWhatsApp', payload: '01608922800' },
        ],
      };
    }
    return {
      text: `💼 **'টাস্ক দিন'** বাটনে ক্লিক করে কাজের তথ্য ও সময় জানান। গেইনার আপনার জন্য উপযুক্ত ভেরিফাইড এক্সপার্ট নির্বাচন করে সময়মতো কাজ বুঝিয়ে দেবে।`,
      actions: [
        { label: 'টাস্ক দিন', actionType: 'openAssignModal' },
        { label: 'হোয়াটসঅ্যাপে হেল্প নিন', actionType: 'openWhatsApp', payload: '01608922800' },
      ],
    };
  }

  // 5a. Explicit Handling for "No skills"
  if (
    q.includes('skill nei') ||
    q.includes('skill nai') ||
    q.includes('স্কিল নেই') ||
    q.includes('স্কিল নাই') ||
    q.includes('কোন স্কিল') ||
    q.includes('কোনো স্কিল') ||
    q.includes('no skill') ||
    q.includes('without skill') ||
    q.includes('স্কিল ছাড়া') ||
    q.includes('কাজ পারি না') ||
    q.includes('kaj pari na') ||
    q.includes('দক্ষতা নেই') ||
    q.includes('দক্ষতা নাই')
  ) {
    if (isEn) {
      return {
        text: `❌ Gaenr is strictly skill-based. Without demonstrable expertise and a verified portfolio in a specific skill, there are no work opportunities here. Please learn a skill first!`,
        actions: [
          { label: 'Explore Services', actionType: 'navigate', payload: '/services' },
          { label: 'Chat on WhatsApp', actionType: 'openWhatsApp', payload: '01608922800' },
        ],
      };
    }
    return {
      text: `❌ গেইনারে স্কিল ছাড়া কোনো কাজের সুযোগ নেই। এখানে কাজ করতে অন্তত একটি বিষয়ে নির্দিষ্ট দক্ষতা ও কাজের পোর্টফোলিও থাকতে হবে। তাই আগে কোনো স্কিল ভালোভাবে শিখে নেওয়ার পরামর্শ থাকবে!`,
      actions: [
        { label: 'সার্ভিসসমূহ দেখুন', actionType: 'navigate', payload: '/services' },
        { label: 'হোয়াটসঅ্যাপে জানান', actionType: 'openWhatsApp', payload: '01608922800' },
      ],
    };
  }

  // 5. Freelancer / Join as expert / Student onboarding
  if (
    q.includes('join') ||
    q.includes('freelancer') ||
    q.includes('expert hoye') ||
    q.includes('কাজ করতে চাই') ||
    q.includes('জয়েন') ||
    q.includes('আউটসোর্সার') ||
    q.includes('apply') ||
    q.includes('student') ||
    q.includes('job')
  ) {
    if (isEn) {
      return {
        text: `🚀 Apply at **'Join as Expert'** with your portfolio. Once verified, you will receive real client tasks with guaranteed on-time payments.`,
        actions: [
          { label: 'Apply as Expert', actionType: 'openApplyModal' },
          { label: 'Join as Expert Page', actionType: 'navigate', payload: '/join-as-expert' },
        ],
      };
    }
    return {
      text: `🚀 **'Join as Expert'** পেজে গিয়ে আপনার পোর্টফোলিও লিঙ্ক দিয়ে আবেদন করুন। ভেরিফিকেশন সম্পন্ন হলে নিয়মিত ক্লায়েন্ট টাস্ক ও নিশ্চিত পেমেন্ট পাবেন।`,
      actions: [
        { label: 'আবেদন করুন', actionType: 'openApplyModal' },
        { label: 'বিস্তারিত জানুন', actionType: 'navigate', payload: '/join-as-expert' },
      ],
    };
  }

  // 6. Pricing, Cost, Charges, Platform Fee, Escrow, Payment
  if (
    q.includes('price') ||
    q.includes('cost') ||
    q.includes('charge') ||
    q.includes('fee') ||
    q.includes('দাম') ||
    q.includes('খরচ') ||
    q.includes('টাকা') ||
    q.includes('ফি') ||
    q.includes('payment') ||
    q.includes('পেমেন্ট')
  ) {
    if (isEn) {
      return {
        text: `💳 **0% Client Platform Fee.** Payments are held in secure escrow (bKash, Nagad, Bank, Card) and released only after you approve the deliverable.`,
        actions: [
          { label: 'Get WhatsApp Quote', actionType: 'openWhatsApp', payload: '01608922800' },
          { label: 'Assign a Task', actionType: 'openAssignModal' },
        ],
      };
    }
    return {
      text: `💳 **ক্লায়েন্টদের প্ল্যাটফর্ম চার্জ ০%।** বিকাশ, নগদ ও ব্যাংকে নিরাপদ এস্ক্রো পেমেন্ট—কাজ দেখে সন্তুষ্ট হয়ে অ্যাপ্রুভ করার পরেই কেবল পেমেন্ট রিলিজ হয়।`,
      actions: [
        { label: 'বাজেট নিয়ে আলোচনা', actionType: 'openWhatsApp', payload: '01608922800' },
        { label: 'টাস্ক দিন', actionType: 'openAssignModal' },
      ],
    };
  }

  // 7. Contact info, phone, whatsapp, email, address, office location
  if (
    q.includes('contact') ||
    q.includes('phone') ||
    q.includes('number') ||
    q.includes('whatsapp') ||
    q.includes('email') ||
    q.includes('address') ||
    q.includes('location') ||
    q.includes('office') ||
    q.includes('যোগাযোগ') ||
    q.includes('ফোন') ||
    q.includes('ঠিকানা') ||
    q.includes('অফিস') ||
    q.includes('নাম্বার')
  ) {
    if (isEn) {
      return {
        text: `📞 **Mirpur Office:** 10/A, 15/13, Mirpur, Dhaka. Hotline: 09647 922 800 | WhatsApp: 01608 922 800 | Hours: 10 AM – 10 PM.`,
        actions: [
          { label: 'Chat on WhatsApp', actionType: 'openWhatsApp', payload: '01608922800' },
          { label: 'Call Hotline', actionType: 'callPhone', payload: '09647922800' },
        ],
      };
    }
    return {
      text: `📞 **মিরপুর অফিস:** ১০/এ, ১৫/১৩, মিরপুর, ঢাকা। হটলাইন: 09647 922 800 | হোয়াটসঅ্যাপ: 01608 922 800 | সময়: সকাল ১০টা – রাত ১০টা।`,
      actions: [
        { label: 'হোয়াটসঅ্যাপে মেসেজ', actionType: 'openWhatsApp', payload: '01608922800' },
        { label: 'হটলাইনে কল করুন', actionType: 'callPhone', payload: '09647922800' },
      ],
    };
  }

  // 8. Specific service queries (Video, Graphics, Web, Slides, Ads)
  if (q.includes('video') || q.includes('ভিডিও') || q.includes('reels') || q.includes('youtube')) {
    if (isEn) {
      return {
        text: `🎬 Professional video editing for YouTube, Reels, Shorts, and podcasts with color grading and dynamic subtitles.`,
        actions: [
          { label: 'Assign Video Task', actionType: 'openAssignModal' },
          { label: 'Service Details', actionType: 'navigate', payload: '/services/video-editing' },
        ],
      };
    }
    return {
      text: `🎬 ইউটিউব, রিলস, শর্টস ও পডকাস্টের জন্য প্রফেশনাল ভিডিও এডিটিং, কালার গ্রেডিং ও ক্যাপশন তৈরি সার্ভিস।`,
      actions: [
        { label: 'ভিডিও টাস্ক দিন', actionType: 'openAssignModal' },
        { label: 'সার্ভিস বিস্তারিত', actionType: 'navigate', payload: '/services/video-editing' },
      ],
    };
  }

  if (q.includes('graphic') || q.includes('logo') || q.includes('লোগো') || q.includes('ডিজাইন') || q.includes('banner')) {
    if (isEn) {
      return {
        text: `🎨 Custom logos, branding packages, social media creatives, and print designs with vector source files and revision support.`,
        actions: [
          { label: 'Assign Design Task', actionType: 'openAssignModal' },
          { label: 'Service Details', actionType: 'navigate', payload: '/services/graphics-design' },
        ],
      };
    }
    return {
      text: `🎨 লোগো, ব্র্যান্ড আইডেন্টিটি, সোশ্যাল মিডিয়া ব্যানার ও ভেক্টর ডিজাইন সোর্স ফাইল ও রিভিশন সুবিধাসহ।`,
      actions: [
        { label: 'ডিজাইন টাস্ক দিন', actionType: 'openAssignModal' },
        { label: 'সার্ভিস বিস্তারিত', actionType: 'navigate', payload: '/services/graphics-design' },
      ],
    };
  }

  if (q.includes('web') || q.includes('wordpress') || q.includes('website') || q.includes('ওয়েবসাইট') || q.includes('সাইট')) {
    if (isEn) {
      return {
        text: `🌐 Responsive WordPress and WooCommerce websites with local bKash/Nagad checkout and speed optimization.`,
        actions: [
          { label: 'Assign Web Task', actionType: 'openAssignModal' },
          { label: 'Service Details', actionType: 'navigate', payload: '/services/wordpress-website' },
        ],
      };
    }
    return {
      text: `🌐 রেসপন্সিভ ওয়ার্ডপ্রেস ও ই-কমার্স ওয়েবসাইট ডিজাইন বিকাশ/নগদ পেমেন্ট গেটওয়ে ও ফাস্ট লোডিংসহ।`,
      actions: [
        { label: 'ওয়েব টাস্ক দিন', actionType: 'openAssignModal' },
        { label: 'সার্ভিস বিস্তারিত', actionType: 'navigate', payload: '/services/wordpress-website' },
      ],
    };
  }

  // 9. Default fallback response
  if (isEn) {
    return {
      text: `I'm here to help with any project task, hiring, or Gaenr services. What would you like to get done?`,
      actions: [
        { label: 'Explore Services', actionType: 'navigate', payload: '/services' },
        { label: 'Assign a Task', actionType: 'openAssignModal' },
        { label: 'WhatsApp', actionType: 'openWhatsApp', payload: '01608922800' },
      ],
    };
  }

  return {
    text: `গেইনারের যেকোনো কাজ করানো, এক্সপার্ট হায়ার বা সার্ভিস সংক্রান্ত তথ্যের জন্য বলুন—কীভাবে সাহায্য করতে পারি?`,
    actions: [
      { label: 'সার্ভিসসমূহ দেখুন', actionType: 'navigate', payload: '/services' },
      { label: 'টাস্ক দিন', actionType: 'openAssignModal' },
      { label: 'হোয়াটসঅ্যাপে চ্যাট', actionType: 'openWhatsApp', payload: '01608922800' },
    ],
  };
}

export function getActiveGeminiApiKey(): string {
  try {
    return (
      localStorage.getItem('gaenr_gemini_api_key') ||
      (import.meta as any).env?.VITE_GEMINI_API_KEY ||
      (import.meta as any).env?.GEMINI_API_KEY ||
      ''
    );
  } catch {
    return '';
  }
}

/**
 * Call live Gemini API if an API key is available
 */
export async function queryGeminiAPI(
  apiKey: string,
  history: Array<{ sender: 'user' | 'bot'; text: string }>,
  userMessage: string,
  language: ChatLanguage = 'bn',
  memory?: LearnedMemory
): Promise<string> {
  const memoryContext = memory
    ? `\nLEARNED CONVERSATION MEMORY & USER CONTEXT:
- Total Interactions: ${memory.userInteractionsCount}
- User Name: ${memory.userName || 'Unknown'}
- User Role: ${memory.userRole || 'Unknown'}
- Interested Services: ${memory.interestedServices.join(', ') || 'None mentioned yet'}
- Budget Noted: ${memory.budgetMentioned || 'None'}
- Past Interaction Notes: ${memory.notes.slice(-4).join('; ') || 'None'}
`
    : '';

  const languageDirective =
    language === 'en'
      ? 'CRITICAL: Answer strictly in Proper, fluent English. MUST BE 1-2 SHORT SENTENCES ONLY.'
      : "CRITICAL: Answer strictly in natural conversational Bengali. MUST BE 1-2 SHORT SENTENCES ONLY. Always use 'পেমেন্ট', 'ক্লায়েন্ট', 'টাস্ক'. Never use 'সম্মানী'.";

  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `SYSTEM CONTEXT INSTRUCTIONS:\n${GAENR_SYSTEM_PROMPT}\n${memoryContext}\n${languageDirective}\n\nCRITICAL LENGTH CONSTRAINT: Strictly respond in 1 to 2 short sentences maximum. Be specific and direct to the point.`,
        },
      ],
    },
    {
      role: 'model',
      parts: [
        {
          text: `Understood! I am Gini, representing Gaenr. I will give direct, specific answers in 1 to 2 short sentences only.`,
        },
      ],
    },
    ...history.slice(-6).map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    })),
    {
      role: 'user',
      parts: [{ text: userMessage }],
    },
  ];

  const keyToUse = (apiKey || getActiveGeminiApiKey()).trim();
  if (!keyToUse) {
    throw new Error('No Gemini API key provided');
  }

  const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
          keyToUse
        )}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: 0.6,
              maxOutputTokens: 250,
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (textOutput) {
          return textOutput;
        }
      } else {
        lastError = new Error(`Model ${model} returned ${response.status}`);
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('Failed to generate response from Gemini API');
}
