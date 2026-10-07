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
You are the official Gaenr AI Assistant (গেইনার এআই সহকারী) for GAENR (https://gaenr.com).
Your mission is to assist clients, business owners, and freelancers in either Proper English or Natural Bengali based on the user's selected preference or query language.

CRITICAL TONE & VOCABULARY RULES:
- If replying in Bengali:
  * Do NOT use overly bookish or archaic words like 'সম্মানী' (honorarium). Instead, ALWAYS use everyday modern words: 'পেমেন্ট' (Payment), 'টাস্ক' (Task), 'ক্লায়েন্ট' (Client), 'ফ্রিল্যান্সার' (Freelancer), 'অর্ডার' (Order), 'সার্ভিস' (Service), 'বাজেট' (Budget).
  * Keep the tone friendly, polite, slightly casual, yet highly professional and clear.
  * Bengali should feel natural, like a modern tech-savvy team representative talking in Dhaka.
- If replying in English:
  * Use proper, professional, fluent, and warm business English.

ABOUT GAENR:
- What is GAENR: Bangladesh's premier Managed Outsourcing & Talent Platform. Connecting businesses with verified top-tier university student talents and creative experts.
- Managed Model: Every project has Gaenr quality oversight, milestones, and on-time delivery guarantees. No ghosting, no sloppy templates.
- Client Platform Fee: 0% Platform fee for clients! 100% transparent milestone pricing.
- Payment & Escrow: Payment is held in secure escrow until client approves the deliverable. Supports bKash, Nagad, Bank transfer, and Cards.
- 7 Core Services: Graphics Design, Content Writing & Copywriting, Video Editing, WordPress Website Design, Presentation Slide Design, UX/UI Design, Ad Running & Campaign Setup.
- Hiring Process: Click "Assign Task", specify project details, Gaenr operations assigns the best verified expert, track progress via watermarked preview, approve and release payment.
- Join as Freelancer / Expert: Visit /join-as-expert, free application, university student or skilled portfolio, skills verification test, get verified Gaenr Expert ID Card and client task assignments.
- Contact Details:
  * Phone Hotline: 09647 922 800
  * WhatsApp Support: 01608 922 800 (https://wa.me/8801608922800)
  * Email: contact@gaenr.com
  * Central Office: 10/A, 15/13, Mirpur, Dhaka, Bangladesh (মিরপুর, ঢাকা)
  * Hours: 10:00 AM – 10:00 PM (Saturday – Thursday)
`;

/**
 * Intelligent Local Knowledge Engine (Works instantly with 0 external API setup)
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
        text: `👋 **${userGreetingPrefix}Welcome to GAENR AI Assistant!**\n\nI am here to guide you with everything about Gaenr's services, hiring verified experts, project delivery, or joining as a freelancer.\n\nHow can I help you today?\n\n• Explore our 7 core services\n• Hire a verified expert for your project\n• Learn how to join as a freelancer\n• Contact our Mirpur, Dhaka office or WhatsApp team`,
        actions: [
          { label: 'Explore Services', actionType: 'navigate', payload: '/services' },
          { label: 'Assign a Task', actionType: 'openAssignModal' },
          { label: 'Chat on WhatsApp', actionType: 'openWhatsApp', payload: '01608922800' },
        ],
      };
    }
    return {
      text: `👋 **${userGreetingPrefix}স্বাগতম! আমি Gaenr AI অ্যাসিস্ট্যান্ট।**\n\nগেইনার (GAENR) সম্পর্কে যেকোনো তথ্য জানতে পারেন। আমি কীভাবে সাহায্য করতে পারি?\n\n• আমাদের ৭টি মূল সার্ভিস সম্পর্কে জানতে চান?\n• নতুন কোনো কাজের জন্য এক্সপার্ট হায়ার করতে চান?\n• ফ্রিল্যান্সার বা আউটসোর্সার হিসেবে জয়েন করতে চান?\n• পেমেন্ট, বাজেট বা অফিস যোগাযোগের তথ্য লাগবে?`,
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
        text: `🏢 **What is GAENR?**\n\nGAENR is Bangladesh's premier **Managed Outsourcing & Talent Platform**. We bridge businesses, startups, and agencies with verified, highly skilled university student talents and creative experts.\n\n**Why choose Gaenr?**\n• **Managed Quality:** Unlike chaotic traditional marketplaces, every project is monitored by Gaenr operations for quality and on-time delivery.\n• **0% Client Platform Fee:** No hidden client fees or surprise charges.\n• **Secure Escrow:** Your payment is released only after you review and approve the satisfactory deliverable.`,
        actions: [
          { label: 'Browse Services', actionType: 'navigate', payload: '/services' },
          { label: 'About Gaenr', actionType: 'navigate', payload: '/about' },
          { label: 'Assign a Task', actionType: 'openAssignModal' },
        ],
      };
    }
    return {
      text: `🏢 **GAENR (গেইনার) কী?**\n\nগেইনার হলো বাংলাদেশের একটি নির্ভরযোগ্য **ম্যানেজড আউটসোর্সিং ও ট্যালেন্ট প্ল্যাটফর্ম**। এখানে দেশের শীর্ষ বিশ্ববিদ্যালয়গুলোর যাচাইকৃত মেধাবী ছাত্র ও অভিজ্ঞ ফ্রিল্যান্সারদের দিয়ে বিজনেস প্রজেক্ট করানো হয়।\n\n**গেইনারের মূল সুবিধা:**\n• **ম্যানেজড কোয়ালিটি:** সাধারণ মার্কেটপ্লেসের মতো ফ্রিল্যান্সার উধাও হয়ে যাওয়ার ভয় নেই। প্রতিটি কাজ গেইনার টিম সরাসরি তদারকি করে।\n• **০% ক্লায়েন্ট ফি:** ক্লায়েন্টদের কোনো অতিরিক্ত প্ল্যাটফর্ম ফি দিতে হয় না।\n• **নিরাপদ পেমেন্ট:** সম্পূর্ণ কাজ ডেলিভারি পেয়ে সন্তুষ্ট হওয়ার পরই কেবল ফ্রিল্যান্সারের পেমেন্ট ছাড় করা হয়।`,
      actions: [
        { label: 'সার্ভিসসমূহ দেখুন', actionType: 'navigate', payload: '/services' },
        { label: 'আমাদের সম্পর্কে জানুন', actionType: 'navigate', payload: '/about' },
        { label: 'টাস্ক অ্যাসাইন করুন', actionType: 'openAssignModal' },
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
        text: `🎯 **GAENR's 7 Core Services:**\n\n1. 🎨 **Graphics Design:** Brand Identity, Logos, Social Media Creatives, Packaging & Vector Graphics.\n2. ✍️ **Content Writing & Copywriting:** SEO Articles, Website Content, Product Copy & Social Captions.\n3. 🎬 **Video Editing:** YouTube Videos, Reels, Shorts, TikTok, Color Grading & Motion Graphics.\n4. 🌐 **WordPress Website Design:** Custom Responsive Sites, Landing Pages, WooCommerce & Payment Gateways (bKash/Nagad/SSLCommerz).\n5. 📊 **Presentation Slide Design:** Investor Pitch Decks, Corporate Sales Decks (Fast 24-48h rush turnaround available).\n6. 📱 **UX / UI Design:** Figma Interactive Prototypes, Mobile App UI & SaaS Dashboards.\n7. 📣 **Ad Running & Campaign Setup:** Meta (Facebook/Instagram) & Google Ads with Local Audience Retargeting.`,
        actions: [
          { label: 'View All Services', actionType: 'navigate', payload: '/services' },
          { label: 'Assign a Task', actionType: 'openAssignModal' },
          { label: 'Chat on WhatsApp', actionType: 'openWhatsApp', payload: '01608922800' },
        ],
      };
    }
    return {
      text: `🎯 **GAENR-এর ৭টি মূল সার্ভিস:**\n\n1. 🎨 **Graphics Design:** লোগো, ব্র্যান্ড আইডেন্টিটি, সোশ্যাল মিডিয়া পোস্ট, প্যাকেজিং ও ভেক্টর ডিজাইন।\n2. ✍️ **Content Writing & Copywriting:** এসইও ব্লগ, ওয়েবসাইট কনটেন্ট, সেলস কপি ও প্রোডাক্ট ডেসক্রিপশন।\n3. 🎬 **Video Editing:** ইউটিউব ভিডিও, রিলস, শর্টস, টিকটক, কালার গ্রেডিং ও সাউন্ড ডিজাইন।\n4. 🌐 **WordPress Website Design:** রেসপন্সিভ ওয়েবসাইট, ল্যান্ডিং পেজ ও বিকাশ/নগদ পেমেন্ট ইন্টিগ্রেশন।\n5. 📊 **Presentation Slide Design:** ইনভেস্টর পিচ ডেক, বিজনেস প্রেজেন্টেশন (জরুরি প্রয়োজনে ২৪-৪৮ ঘণ্টায়)।\n6. 📱 **UX / UI Design:** ফিগমা প্রোটোটাইপ, মোবাইল অ্যাপ ও ড্যাশবোর্ড ইন্টারফেস।\n7. 📣 **Ad Running & Campaign Setup:** ফেসবুক, ইনস্টাগ্রাম ও গুগল অ্যাডস ক্যাম্পেইন ম্যানেজমেন্ট।`,
      actions: [
        { label: 'সব সার্ভিস বিস্তারিত দেখুন', actionType: 'navigate', payload: '/services' },
        { label: 'টাস্ক দিন', actionType: 'openAssignModal' },
        { label: 'হোয়াটসঅ্যাপে আলোচনা', actionType: 'openWhatsApp', payload: '01608922800' },
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
        text: `💼 **How Hiring Works on GAENR:**\n\n1. **Submit Your Task:** Click 'Assign Task' on our website and share your project brief and timeline.\n2. **Expert Matching:** Our Project Manager assigns the best-verified talent for your specific needs within hours.\n3. **Track Progress:** You will receive watermarked live previews to review revisions safely.\n4. **Approve & Delivery:** Once you are fully satisfied, approve the work and release the payment to receive full source files.`,
        actions: [
          { label: 'Assign a Task Now', actionType: 'openAssignModal' },
          { label: 'Explore Experts', actionType: 'navigate', payload: '/experts' },
          { label: 'WhatsApp Support', actionType: 'openWhatsApp', payload: '01608922800' },
        ],
      };
    }
    return {
      text: `💼 **গেইনারে কাজ করানোর নিয়ম (Hiring Process):**\n\n1. **টাস্ক সাবমিট করুন:** 'Assign Task' বাটনে ক্লিক করে আপনার কাজের বিবরণ, প্রয়োজনীয় সময় ও বাজেট জানান।\n2. **এক্সপার্ট ম্যাচিং:** গেইনার প্রজেক্ট ম্যানেজার কয়েক ঘণ্টার মধ্যে আপনার কাজের জন্য সবচেয়ে উপযুক্ত ভেরিফাইড ফ্রিল্যান্সার অ্যাসাইন করবেন।\n3. **কাজের অগ্রগতি ও প্রিভিউ:** ওয়াটারমার্কড লাইভ প্রিভিউতে কাজ দেখে রিভিশন দিতে পারবেন।\n4. **ডেলিভারি ও পেমেন্ট রিলিজ:** সম্পূর্ণ কাজ ঠিকঠাক বুঝে পাওয়ার পর ফাইনাল ফাইল ডাউনলোড করবেন এবং পেমেন্ট ছাড় করবেন।`,
      actions: [
        { label: 'টাস্ক অ্যাসাইন করুন', actionType: 'openAssignModal' },
        { label: 'এক্সপার্টদের প্রোফাইল দেখুন', actionType: 'navigate', payload: '/experts' },
        { label: 'হোয়াটসঅ্যাপে হেল্প নিন', actionType: 'openWhatsApp', payload: '01608922800' },
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
        text: `🚀 **How to Join GAENR as an Expert / Freelancer:**\n\nAre you a university student or a skilled creative professional?\n\n• **Eligibility:** Passionate student or talent with a strong portfolio in design, video, web, writing, or marketing.\n• **Application:** Apply via our **Join as Expert** page with your profile details and sample work.\n• **Verification:** Our team reviews your portfolio and conducts a skills check to grant your verified Gaenr Expert ID Card.\n• **Perks:** 100% free registration, real client projects, and timely guaranteed payments!`,
        actions: [
          { label: 'Apply as Expert', actionType: 'openApplyModal' },
          { label: 'Join as Expert Page', actionType: 'navigate', payload: '/join-as-expert' },
        ],
      };
    }
    return {
      text: `🚀 **এক্সপার্ট হিসেবে GAENR-এ জয়েন করার নিয়ম:**\n\nআপনি যদি ডিজাইনার, ভিডিও এডিটর, ওয়েব ডেভেলপার, রাইটার বা মার্কেটার হন:\n\n• **যোগ্যতা:** বিশ্ববিদ্যালয়ের শিক্ষার্থী অথবা কাজে ভালো দক্ষতা ও কাজের স্যাম্পল থাকতে হবে।\n• **আবেদন:** সাইটের **Join as Expert** অপশনে গিয়ে আপনার তথ্য ও পোর্টফোলিও লিঙ্ক সাবমিট করুন।\n• **ভেরিফিকেশন:** আমাদের টিম আপনার কাজ যাচাই করে গেইনার ভেরিফাইড আইডি কার্ড ও প্রোফাইল দেবে।\n• **সুবিধা:** ১০০% ফ্রি রেজিস্ট্রেশন, সরাসরি ক্লায়েন্ট প্রজেক্ট ও সময়মতো নিশ্চিত পেমেন্ট পাওয়ার গ্যারান্টি!`,
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
        text: `💳 **Pricing & Payment System:**\n\n• **0% Client Fee:** Clients pay zero platform fees on Gaenr.\n• **Transparent Milestones:** Upfront fixed or custom project pricing without hidden charges.\n• **Escrow Protection:** Your payment stays 100% secure in escrow and is released only upon your project approval.\n• **Payment Methods:** bKash, Nagad, direct Bank Transfer, and major Cards.\n\nWant an instant custom quote? Message us directly on WhatsApp!`,
        actions: [
          { label: 'Get WhatsApp Quote', actionType: 'openWhatsApp', payload: '01608922800' },
          { label: 'Assign a Task', actionType: 'openAssignModal' },
        ],
      };
    }
    return {
      text: `💳 **গেইনারের চার্জ ও পেমেন্ট সিস্টেম:**\n\n• **০% ক্লায়েন্ট প্ল্যাটফর্ম ফি:** ক্লায়েন্টদের জন্য গেইনার কোনো অতিরিক্ত প্ল্যাটফর্ম চার্জ কাটে না।\n• **ক্লিয়ার প্রজেক্ট বাজেট:** কাজের ধরন ও স্কোপ অনুযায়ী ফিক্সড বাজেট ঠিক করা হয়। কোনো হিডেন চার্জ নেই।\n• **পেমেন্ট সম্পূর্ণ নিরাপদ:** আপনার পেমেন্ট এসক্রোতে সুরক্ষিত থাকে। কাজ ডেলিভারি পাওয়ার পর আপনি সন্তুষ্ট হলেই পেমেন্ট ফ্রিল্যান্সারকে দেওয়া হয়।\n• **পেমেন্ট মেথড:** বিকাশ, নগদ, ব্যাংক ট্রান্সফার এবং কার্ডের মাধ্যমে পেমেন্ট করতে পারবেন।`,
      actions: [
        { label: 'বাজেট নিয়ে আলোচনা করুন', actionType: 'openWhatsApp', payload: '01608922800' },
        { label: 'টাস্ক অ্যাসাইন করুন', actionType: 'openAssignModal' },
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
        text: `📞 **Official Contact Information:**\n\n• 📱 **Hotline Phone:** 09647 922 800 (Direct call)\n• 💬 **WhatsApp Support:** 01608 922 800 (Fast proposals & queries)\n• ✉️ **Official Email:** contact@gaenr.com\n• 📍 **Office Address:** 10/A, 15/13, Mirpur, Dhaka, Bangladesh\n• ⏰ **Operating Hours:** 10:00 AM – 10:00 PM (Saturday – Thursday)`,
        actions: [
          { label: 'Chat on WhatsApp', actionType: 'openWhatsApp', payload: '01608922800' },
          { label: 'Call Hotline', actionType: 'callPhone', payload: '09647922800' },
          { label: 'Contact Us Page', actionType: 'navigate', payload: '/contact' },
        ],
      };
    }
    return {
      text: `📞 **GAENR-এর অফিসিয়াল যোগাযোগ মাধ্যম:**\n\n• 📱 **হটলাইন ফোন:** 09647 922 800 (সরাসরি কল করতে পারেন)\n• 💬 **হোয়াটসঅ্যাপ:** 01608 922 800 (যেকোনো কাজের আলোচনা বা মেসেজ দিতে)\n• ✉️ **অফিসিয়াল ইমেইল:** contact@gaenr.com\n• 📍 **অফিস ঠিকানা:** 10/A, 15/13, মিরপুর, ঢাকা, বাংলাদেশ\n• ⏰ **সাপোর্ট টাইম:** সকাল ১০:০০ টা – রাত ১০:০০ টা (শনিবার – বৃহস্পতিবার)`,
      actions: [
        { label: 'হোয়াটসঅ্যাপে মেসেজ পাঠান', actionType: 'openWhatsApp', payload: '01608922800' },
        { label: 'হটলাইনে কল করুন', actionType: 'callPhone', payload: '09647922800' },
        { label: 'যোগাযোগ পেজ দেখুন', actionType: 'navigate', payload: '/contact' },
      ],
    };
  }

  // 8. Specific service queries (Video, Graphics, Web, Slides, Ads)
  if (q.includes('video') || q.includes('ভিডিও') || q.includes('reels') || q.includes('youtube')) {
    if (isEn) {
      return {
        text: `🎬 **Video Editing Services:**\n\nOur verified video creators work in Premiere Pro, DaVinci Resolve, and After Effects:\n• YouTube long-form videos & podcast audio/video sync\n• High-retention Reels, TikToks & Shorts\n• Color grading, sound effects & dynamic typography\n• Exported in full 4K / 1080p master quality.`,
        actions: [
          { label: 'Assign Video Task', actionType: 'openAssignModal' },
          { label: 'Service Details', actionType: 'navigate', payload: '/services/video-editing' },
        ],
      };
    }
    return {
      text: `🎬 **Video Editing সার্ভিস:**\n\nআমাদের এক্সপার্টরা প্রিমিয়ার প্রো, ডাভিঞ্চি রিজলভ ও আফটার ইফেক্টসে কাজ করেন:\n• ইউটিউব ভিডিও ও পডকাস্ট এডিটিং\n• হাই-রিটেনশন রিলস, শর্টস ও টিকটক\n• কালার গ্রেডিং, সাউন্ড ডিজাইন ও ডায়নামিক সাবটাইটেল\n• ফুল 4K / 1080p হাই-কোয়ালিটি মাস্টার ডেলিভারি।`,
      actions: [
        { label: 'ভিডিও টাস্ক দিন', actionType: 'openAssignModal' },
        { label: 'সার্ভিস বিস্তারিত', actionType: 'navigate', payload: '/services/video-editing' },
      ],
    };
  }

  if (q.includes('graphic') || q.includes('logo') || q.includes('লোগো') || q.includes('ডিজাইন') || q.includes('banner')) {
    if (isEn) {
      return {
        text: `🎨 **Graphics Design Services:**\n\n• Custom Logo & Brand Identity packages\n• Social media creative banners & flyers\n• Product packaging & label design\n• Source vector files (AI, EPS, SVG, PNG) with guaranteed revision rounds.`,
        actions: [
          { label: 'Assign Design Task', actionType: 'openAssignModal' },
          { label: 'Service Details', actionType: 'navigate', payload: '/services/graphics-design' },
        ],
      };
    }
    return {
      text: `🎨 **Graphics Design সার্ভিস:**\n\n• কাস্টম লোগো ও ব্র্যান্ড আইডেন্টিটি\n• সোশ্যাল মিডিয়া পোস্টার ও ব্যানার ডিজাইন\n• প্যাকেজিং ও লেবেল ডিজাইন\n• সম্পূর্ণ প্রিন্ট-রেডি ভেক্টর সোর্স ফাইল (AI, EPS, SVG, PNG) সহ প্রতিটি কাজে রিভিশন সুবিধা।`,
      actions: [
        { label: 'ডিজাইন টাস্ক দিন', actionType: 'openAssignModal' },
        { label: 'সার্ভিস বিস্তারিত', actionType: 'navigate', payload: '/services/graphics-design' },
      ],
    };
  }

  if (q.includes('web') || q.includes('wordpress') || q.includes('website') || q.includes('ওয়েবসাইট') || q.includes('সাইট')) {
    if (isEn) {
      return {
        text: `🌐 **WordPress Website Design:**\n\n• Modern, mobile-responsive corporate sites & landing pages\n• WooCommerce online stores with local payment gateways (bKash, Nagad, SSLCommerz)\n• Speed optimization & clean architecture without bloated themes.`,
        actions: [
          { label: 'Assign Web Task', actionType: 'openAssignModal' },
          { label: 'Service Details', actionType: 'navigate', payload: '/services/wordpress-website' },
        ],
      };
    }
    return {
      text: `🌐 **WordPress Website Design:**\n\n• রেসপন্সিভ ওয়েবসাইট ও হাই-কনভার্টিং ল্যান্ডিং পেজ\n• WooCommerce অনলাইন স্টোর ও বিকাশ/নগদ পেমেন্ট গেটওয়ে সেটআপ\n• স্পিড অপ্টিমাইজেশন ও মোবাইল-ফ্রেন্ডলি আর্কিটেকচার।`,
      actions: [
        { label: 'ওয়েব টাস্ক দিন', actionType: 'openAssignModal' },
        { label: 'সার্ভিস বিস্তারিত', actionType: 'navigate', payload: '/services/wordpress-website' },
      ],
    };
  }

  // 9. Default fallback response
  if (isEn) {
    return {
      text: `Thank you for reaching out! I can assist you with any of Gaenr's services, hiring verified talents, project scoping, or reaching our Mirpur office team.\n\nFeel free to describe what you need or pick an option below:`,
      actions: [
        { label: 'Explore Services', actionType: 'navigate', payload: '/services' },
        { label: 'Assign a Task', actionType: 'openAssignModal' },
        { label: 'Chat on WhatsApp', actionType: 'openWhatsApp', payload: '01608922800' },
        { label: 'Call Hotline', actionType: 'callPhone', payload: '09647922800' },
      ],
    };
  }

  return {
    text: `ধন্যবাদ আপনার মেসেজের জন্য! আমি গেইনারের যেকোনো সার্ভিস, এক্সপার্ট হায়ার করার নিয়ম, ফ্রিল্যান্সার হিসেবে রেজিস্ট্রেশন বা পেমেন্ট সংক্রান্ত বিষয়ে সাহায্য করতে পারি।\n\nআপনার রিকোয়ারমেন্ট লিখে জানাতে পারেন অথবা নিচের অপশনগুলোতে ক্লিক করতে পারেন:`,
    actions: [
      { label: 'সার্ভিসসমূহ দেখুন', actionType: 'navigate', payload: '/services' },
      { label: 'টাস্ক দিন', actionType: 'openAssignModal' },
      { label: 'হোয়াটসঅ্যাপে চ্যাট', actionType: 'openWhatsApp', payload: '01608922800' },
      { label: 'হটলাইনে কল করুন', actionType: 'callPhone', payload: '09647922800' },
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
      ? 'CRITICAL: Answer strictly in Proper, fluent, professional English.'
      : "CRITICAL: Answer strictly in natural, modern conversational Bengali. Do NOT use overly archaic words like 'সম্মানী'; ALWAYS use 'পেমেন্ট', 'ক্লায়েন্ট', 'টাস্ক', 'অর্ডার'. Keep it friendly and clear.";

  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `SYSTEM CONTEXT INSTRUCTIONS:\n${GAENR_SYSTEM_PROMPT}\n${memoryContext}\n${languageDirective}\n\nPlease strictly follow these instructions and answer the user query based on GAENR's real facts.`,
        },
      ],
    },
    {
      role: 'model',
      parts: [
        {
          text: `Understood! I am Gaenr AI, the official assistant for GAENR. I will follow the language directive (${language.toUpperCase()}) and use natural modern terminology like 'পেমেন্ট' instead of 'সম্মানী'.`,
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
              temperature: 0.7,
              maxOutputTokens: 800,
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
