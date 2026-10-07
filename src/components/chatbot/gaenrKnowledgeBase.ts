/**
 * GAENR AI Knowledge Base & Context Engine
 * Comprehensive information repository about Gaenr, services, hiring, pricing, contact, and operations.
 */

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

export const GAENR_SYSTEM_PROMPT = `
You are the official Gaenr AI Assistant (গেইনার এআই সহকারী) for GAENR (https://gaenr.com).
Your mission is to assist clients, business owners, and freelancers in Bengali (বাংলা) or English depending on the language they use.

ABOUT GAENR:
- What is GAENR: Gaenr is Bangladesh's premier Managed Outsourcing & Talent Platform. We bridge businesses, startups, and agencies with verified, highly skilled university student talents and creative experts.
- Key Value Proposition: Unlike chaotic traditional marketplaces (Fiverr/Upwork) where clients struggle with quality control and ghosting, Gaenr provides "Managed Outsourcing". Every project is overseen by Gaenr operations for quality, milestone security, and on-time delivery.
- Platform Fee: 0% Platform fee for clients! Transparent milestone-based payments with escrow protection.
- Student Outsourcing Model: Empowering verified, gifted university students in Bangladesh with fair wages, direct portfolio attribution, and real-world project experience.

OUR 7 CORE SERVICES:
1. Graphics Design (লোগো, ব্র্যান্ড আইডেন্টিটি, সোশ্যাল মিডিয়া ব্যানার, প্যাকেজিং, ভেক্টর ইলাস্ট্রেশন)
2. Content Writing & Copywriting (SEO আর্টিকেল, ওয়েবসাইট কনটেন্ট, ব্লগ, প্রোডাক্ট ডেসক্রিপশন, সোশ্যাল মিডিয়া ক্যাপশন)
3. Video Editing (ইউটিউব ভিডিও, রিলস, শর্টস, টিকটক, কর্পোরেট প্রোমো, পডকাস্ট সিঙ্ক, কালার গ্রেডিং)
4. WordPress Website Design (এলিমেন্টর, ও-কমার্স শপ, ল্যান্ডিং পেজ, স্পিড অপ্টিমাইজেশন, বিকাশ/নগদ পেমেন্ট গেটওয়ে)
5. Presentation Slide Design (স্টার্টআপ পিচ ডেক, ইনভেস্টর স্লাইড, সেলস প্রেজেন্টেশন, ২৪-৪৮ ঘণ্টার ফাস্ট ডেলিভারি)
6. UX / UI Design (ফিগমা প্রোটোটাইপ, মোবাইল অ্যাপ ইউআই, SaaS ড্যাশবোর্ড, ইউজার জার্নি)
7. Ad Running & Campaign Setup (মেটা ফেসবুক/ইনস্টাগ্রাম অ্যাড, গুগল অ্যাড, লোকাল অডিয়েন্স রিটার্গেটিং, ROAS অ্যানালিটিক্স)

HOW TO HIRE AN EXPERT:
1. Browse verified talent at /experts or click "Assign Task" button.
2. Submit your task brief, scope, and timeline.
3. A Gaenr Project Manager matches you with the ideal verified expert within hours.
4. Review milestones and approve final deliverables.
5. All deliverables come with verified preview security (watermarked against leaks until final handover).

HOW TO JOIN AS A FREELANCER / EXPERT:
- Visit /join-as-expert or click "Join as Expert".
- Complete the online application with skills, university details, and portfolio proof.
- Pass the Gaenr skill & portfolio verification test.
- Get a dedicated verified profile with Gaenr Expert ID card, official avatar, and client project assignments.
- 100% free to join.

CONTACT & OFFICE INFORMATION:
- Hotline Phone: 09647 922 800 (সরাসরি কল)
- WhatsApp Support: 01608 922 800 (https://wa.me/8801608922800)
- Official Email: contact@gaenr.com
- Central Office: 10/A, 15/13, Mirpur, Dhaka, Bangladesh (মিরপুর, ঢাকা)
- Support Hours: 10:00 AM – 10:00 PM (Saturday – Thursday)

STYLE & TONE:
- Professional, welcoming, concise, and helpful.
- If asked in Bengali, reply in polite, natural Bengali (প্রমিত বাংলা).
- If asked in English, reply in fluent, clear English.
- Always provide actionable next steps (like offering to assign a task or contact on WhatsApp).
`;

/**
 * Intelligent Local Fallback Engine
 * Evaluates user questions against Gaenr's deep knowledge base when an external API key is not present.
 */
export function getLocalAIResponse(rawQuery: string): {
  text: string;
  actions?: Array<{
    label: string;
    actionType: 'navigate' | 'openAssignModal' | 'openApplyModal' | 'openWhatsApp' | 'callPhone';
    payload?: string;
  }>;
} {
  const q = rawQuery.toLowerCase().trim();

  // 1. Greetings
  if (/^(hi|hello|hey|salam|assalamu|kemon achen|halo|হাই|হ্যালো|সালাম|আসসালামু|কেমন আছেন)/i.test(q)) {
    return {
      text: `👋 **স্বাগতম! আমি Gaenr AI সহকারী।**\n\nগেইনার (GAENR) সম্পর্কে আপনার যেকোনো প্রশ্নের উত্তর দিতে আমি প্রস্তুত। আপনি কীভাবে সাহায্য চান?\n\n• আমাদের ৭টি প্রধান সার্ভিস জানতে চান?\n• নতুন কোনো প্রজেক্ট বা কাজের জন্য এক্সপার্ট হায়ার করতে চান?\n• আউটসোর্সার বা এক্সপার্ট হিসেবে আমাদের সাথে যুক্ত হতে চান?\n• সরাসরি মিরপুর অফিস বা হোয়াটসঅ্যাপে যোগাযোগ করতে চান?`,
      actions: [
        { label: 'সার্ভিসসমূহ দেখুন', actionType: 'navigate', payload: '/services' },
        { label: 'টাস্ক অ্যাসাইন করুন', actionType: 'openAssignModal' },
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
    return {
      text: `🏢 **GAENR (গেইনার) কী?**\n\nগেইনার হলো বাংলাদেশের প্রথম সারির **ম্যানেজড আউটসোর্সিং ও ট্যালেন্ট প্ল্যাটফর্ম**। আমরা দেশের শীর্ষ বিশ্ববিদ্যালয়গুলোর যাচাইকৃত মেধাবী ছাত্র ও দক্ষ ফ্রিল্যান্সারদের সাথে দেশি-বিদেশি ব্যবসা ও এজেন্সির সংযোগ তৈরি করি।\n\n**কেন গেইনার অনন্য?**\n• **ম্যানেজড কোয়ালিটি:** সাধারণ মার্কেটপ্লেসের মতো ফ্রিল্যান্সার হারানোর ভয় নেই। প্রতিটি প্রজেক্ট গেইনারের নিজস্ব টিম দ্বারা মনিটর করা হয়।\n• **০% ক্লায়েন্ট প্ল্যাটফর্ম ফি:** ক্লায়েন্টদের কোনো বাড়তি হিডেন ফি দিতে হয় না।\n• **এসক্রো নিরাপত্তা:** আপনার কাজ শতভাগ সন্তোষজনক ডেলিভারি পাওয়ার পরই পেমেন্ট ছাড় করা হয়।`,
      actions: [
        { label: 'আমাদের সার্ভিসসমূহ', actionType: 'navigate', payload: '/services' },
        { label: 'আমাদের সম্পর্কে বিস্তারিত', actionType: 'navigate', payload: '/about' },
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
    return {
      text: `🎯 **GAENR-এর ৭টি মূল সার্ভিস:**\n\n1. 🎨 **Graphics Design:** লোগো, ব্র্যান্ডিং, সোশ্যাল মিডিয়া পোস্ট, প্যাকেজিং ও ভেক্টর ডিজাইন।\n2. ✍️ **Content Writing & Copywriting:** এসইও আর্টিকেল, ওয়েবসাইট কনটেন্ট, সেলস কপি ও সোশ্যাল ক্যাপশন।\n3. 🎬 **Video Editing:** ইউটিউব ভিডিও, রিলস, শর্টস, টিকটক, কালার গ্রেডিং ও মোশন গ্রাফিক্স।\n4. 🌐 **WordPress Website Design:** মোবাইল-রেসপন্সিভ ওয়েবসাইট, ল্যান্ডিং পেজ ও বিকাশ/নগদ পেমেন্ট গেটওয়ে ইন্টিগ্রেশন।\n5. 📊 **Presentation Slide Design:** ইনভেস্টর পিচ ডেক, পাওয়ারপয়েন্ট/গুগল স্লাইডস (জরুরি প্রয়োজনে ২৪-৪৮ ঘণ্টায়)।\n6. 📱 **UX / UI Design:** ফিগমা প্রোটোটাইপ, মোবাইল অ্যাপ ও ওয়েব ড্যাশবোর্ড ইন্টারফেস।\n7. 📣 **Ad Running & Campaign Setup:** মেটা (ফেসবুক/ইনস্টাগ্রাম) ও গুগল অ্যাডস ক্যাম্পেইন ম্যানেজমেন্ট।`,
      actions: [
        { label: 'সব সার্ভিস বিস্তারিত দেখুন', actionType: 'navigate', payload: '/services' },
        { label: 'টাস্ক অ্যাসাইন করুন', actionType: 'openAssignModal' },
        { label: 'হোয়াটসঅ্যাপে পরামর্শ নিন', actionType: 'openWhatsApp', payload: '01608922800' },
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
    return {
      text: `💼 **গেইনারে কীভাবে কাজ করাবেন (Hiring Process):**\n\n1. **টাস্ক সাবমিট করুন:** আমাদের ওয়েবসাইটে 'Assign Task' বাটনে ক্লিক করে কাজের বিবরণ ও প্রয়োজনীয় সময় উল্লেখ করুন।\n2. **এক্সপার্ট ম্যাচিং:** গেইনার প্রজেক্ট ম্যানেজার কয়েক ঘণ্টার মধ্যে আপনার কাজের ধরন অনুযায়ী সেরা ভেরিফাইড এক্সপার্ট অ্যাসাইন করবেন।\n3. **নিরাপদ মাইলস্টোন:** কাজের অগ্রগতি দেখে ওয়াটারমার্কড লাইভ প্রিভিউ যাচাই করবেন।\n4. **ফাইনাল ডেলিভারি ও রিলিজ:** সম্পূর্ণ কাজ সঠিকভাবে সম্পন্ন হওয়ার পর ফাইনাল সোর্স ফাইল বুঝে নেবেন।`,
      actions: [
        { label: 'এখনই টাস্ক দিন', actionType: 'openAssignModal' },
        { label: 'এক্সপার্ট ডিরেক্টরি দেখুন', actionType: 'navigate', payload: '/experts' },
        { label: 'হোয়াটসঅ্যাপে সাপোর্ট', actionType: 'openWhatsApp', payload: '01608922800' },
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
    return {
      text: `🚀 **এক্সপার্ট হিসেবে GAENR-এ যুক্ত হওয়ার নিয়ম:**\n\nআপনি যদি একজন দক্ষ ডিজাইনার, ভিডিও এডিটর, কনটেন্ট রাইটার, ওয়েব ডেভেলপার বা মার্কেটার হন:\n\n• **যোগ্যতা:** বিশ্ববিদ্যালয়ের শিক্ষার্থী অথবা সংশ্লিষ্ট কাজে দক্ষ পোর্টফোলিও থাকা।\n• **আবেদন পদ্ধতি:** ওয়েবসাইটের **Join as Expert** ফর্মে আপনার কাজের স্যাম্পল ও তথ্য দিয়ে সাবমিট করুন।\n• **যাচাইকরণ:** আমাদের টিম আপনার পোর্টফোলিও ও স্কিল রিভিউ করে গেইনার ভেরিফাইড প্রোফাইল ও আইডি কার্ড প্রদান করবে।\n• **সুবিধা:** ১০০% ফ্রি রেজিস্ট্রেশন, সরাসরি রিয়েল-লাইফ প্রজেক্ট ও নিশ্চিন্তে সম্মানী পাওয়ার সুবিধা!`,
      actions: [
        { label: 'এক্সপার্ট হিসেবে আবেদন করুন', actionType: 'openApplyModal' },
        { label: 'বিস্তারিত পেজ দেখুন', actionType: 'navigate', payload: '/join-as-expert' },
      ],
    };
  }

  // 6. Pricing, Cost, Charges, Platform Fee, Escrow
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
    return {
      text: `💳 **গেইনারের চার্জ ও পেমেন্ট সিস্টেম:**\n\n• **০% প্ল্যাটফর্ম ফি:** ক্লায়েন্টদের জন্য গেইনার কোনো অতিরিক্ত প্ল্যাটফর্ম ফি কাটে না।\n• **স্বচ্ছ বাজেট:** প্রজেক্টের রিকোয়ারমেন্ট অনুযায়ী ফিক্সড বা কাস্টম বাজেট নির্ধারণ করা হয়।\n• **এসক্রো নিরাপত্তা:** আপনার টাকা সম্পূর্ণ নিরাপদ থাকে এবং কাজ যথাযথভাবে বুঝিয়ে পাওয়ার পর ফ্রিল্যান্সারকে পেমেন্ট ছাড় করা হয়।\n• **পেমেন্ট মেথড:** বিকাশ, নগদ, ব্যাংক ট্রান্সফার ও কার্ডে পেমেন্ট করা সম্ভব।\n\nকাস্টম বাজেটের জন্য সরাসরি হোয়াটসঅ্যাপে আমাদের টিমকে জানাতে পারেন।`,
      actions: [
        { label: 'বাজেট নিয়ে আলোচনা করুন', actionType: 'openWhatsApp', payload: '01608922800' },
        { label: 'টাস্ক অ্যাসাইন ফর্ম', actionType: 'openAssignModal' },
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
    return {
      text: `📞 **GAENR-এর অফিসিয়াল যোগাযোগ মাধ্যম:**\n\n• 📱 **হটলাইন ফোন:** 09647 922 800 (সরাসরি কল)\n• 💬 **হোয়াটসঅ্যাপ:** 01608 922 800 (যেকোনো প্রজেক্ট সংক্রান্ত আলাপ)\n• ✉️ **অফিসিয়াল ইমেইল:** contact@gaenr.com\n• 📍 **অফিস ঠিকানা:** 10/A, 15/13, মিরপুর, ঢাকা, বাংলাদেশ\n• ⏰ **সাপোর্ট সময়:** সকাল ১০:০০ টা – রাত ১০:০০ টা (শনিবার – বৃহস্পতিবার)`,
      actions: [
        { label: 'হোয়াটসঅ্যাপে মেসেজ পাঠান', actionType: 'openWhatsApp', payload: '01608922800' },
        { label: 'হটলাইনে কল করুন', actionType: 'callPhone', payload: '09647922800' },
        { label: 'যোগাযোগ পেজ দেখুন', actionType: 'navigate', payload: '/contact' },
      ],
    };
  }

  // 8. Video editing specifics
  if (q.includes('video') || q.includes('ভিডিও') || q.includes('reels') || q.includes('youtube')) {
    return {
      text: `🎬 **Video Editing সার্ভিস:**\n\nআমাদের এক্সপার্টরা প্রিমিয়ার প্রো, আফটার ইফেক্টস এবং ডাভিঞ্চি রিজলভ ব্যবহার করে কাজ করেন:\n• ইউটিউব লং-ফর্ম ভিডিও ও পডকাস্ট\n• রিলস, শর্টস ও টিকটক হাই-রিটেনশন এডিটিং\n• কালার গ্রেডিং, সাউন্ড এফেক্টস ও সাবটাইটেল\n• 4K / 1080p মাস্টার ডেলিভারি`,
      actions: [
        { label: 'ভিডিও টাস্ক দিন', actionType: 'openAssignModal' },
        { label: 'সার্ভিস বিস্তারিত', actionType: 'navigate', payload: '/services/video-editing' },
      ],
    };
  }

  // 9. Graphics design specifics
  if (q.includes('graphic') || q.includes('logo') || q.includes('লোগো') || q.includes('ডিজাইন') || q.includes('banner')) {
    return {
      text: `🎨 **Graphics Design সার্ভিস:**\n\n• কাস্টম লোগো ও ব্র্যান্ড আইডেন্টিটি\n• সোশ্যাল মিডিয়া পোস্টার ও ব্যানার\n• প্যাকেজিং ও লেবেল ডিজাইন\n• সম্পূর্ণ প্রিন্ট-রেডি ভেক্টর সোর্স ফাইল (AI, EPS, SVG, PNG) সহ প্রতিটি কাজে ন্যূনতম ২টি রিভিশন অন্তর্ভুক্ত।`,
      actions: [
        { label: 'ডিজাইন টাস্ক দিন', actionType: 'openAssignModal' },
        { label: 'সার্ভিস বিস্তারিত', actionType: 'navigate', payload: '/services/graphics-design' },
      ],
    };
  }

  // 10. WordPress or Website specifics
  if (q.includes('web') || q.includes('wordpress') || q.includes('website') || q.includes('ওয়েবসাইট') || q.includes('সাইট')) {
    return {
      text: `🌐 **WordPress Website Design:**\n\n• রেসপন্সিভ বিজনেস ওয়েবসাইট ও ল্যান্ডিং পেজ\n• WooCommerce ই-কমার্স ও পেমেন্ট গেটওয়ে (বিকাশ, নগদ, SSLCommerz)\n• স্পিড অপ্টিমাইজেশন ও এসইও ফ্রেন্ডলি কাঠামো\n• কোনো স্লো/ভারী থিম ছাড়া ক্লিন আর্কিটেকচার।`,
      actions: [
        { label: 'ওয়েব টাস্ক দিন', actionType: 'openAssignModal' },
        { label: 'সার্ভিস বিস্তারিত', actionType: 'navigate', payload: '/services/wordpress-website' },
      ],
    };
  }

  // 11. Presentation slide design specifics
  if (q.includes('slide') || q.includes('presentation') || q.includes('pitch deck') || q.includes('স্লাইড')) {
    return {
      text: `📊 **Presentation Slide Design:**\n\n• স্টার্টআপ ইনভেস্টর পিচ ডেক\n• সেলস ও কর্পোরেট প্রেজেন্টেশন\n• পাওয়ারপয়েন্ট (.pptx) ও গুগল স্লাইডস মাস্টার ফাইল\n• জরুরি প্রয়োজন অনুযায়ী ২৪ থেকে ৪৮ ঘণ্টার মধ্যে ডেলিভারি সুবিধা।`,
      actions: [
        { label: 'স্লাইড টাস্ক দিন', actionType: 'openAssignModal' },
        { label: 'সার্ভিস বিস্তারিত', actionType: 'navigate', payload: '/services/presentation-slide-design' },
      ],
    };
  }

  // 12. Ad running / Digital marketing
  if (q.includes('ad') || q.includes('facebook ad') || q.includes('বিজ্ঞাপন') || q.includes('মার্কেটিং') || q.includes('campaign')) {
    return {
      text: `📣 **Ad Running & Campaign Setup:**\n\n• ফেসবুক ও ইনস্টাগ্রাম (Meta) অ্যাডস ক্যাম্পেইন\n• গুগল সার্চ ও ডিসপ্লে বিজ্ঞাপন\n• টার্গেটেড লোকাল অডিয়েন্স রিটার্গেটিং ও পিক্সেল সেটআপ\n• স্বচ্ছ বাজেট ও সাপ্তাহিক পারফরম্যান্স অ্যানালিটিক্স।`,
      actions: [
        { label: 'ক্যাম্পেইন শুরু করুন', actionType: 'openAssignModal' },
        { label: 'সার্ভিস বিস্তারিত', actionType: 'navigate', payload: '/services/ad-running' },
      ],
    };
  }

  // 13. Default fallback response with smart suggestions
  return {
    text: `ধন্যবাদ আপনার মেসেজের জন্য! আমি গেইনারের যেকোনো সার্ভিস, এক্সপার্ট হায়ার করার নিয়ম, আউটসোর্সার হিসেবে রেজিস্ট্রেশন কিংবা সরাসরি অফিস যোগাযোগের ব্যাপারে সাহায্য করতে পারি।\n\nআপনার প্রয়োজনটি বিস্তারিত জানাতে পারেন অথবা নিচের অপশনগুলো থেকে বেছে নিতে পারেন:`,
    actions: [
      { label: 'সার্ভিসসমূহ জানুন', actionType: 'navigate', payload: '/services' },
      { label: 'টাস্ক অ্যাসাইন করুন', actionType: 'openAssignModal' },
      { label: 'হোয়াটসঅ্যাপে সরাসরি চ্যাট', actionType: 'openWhatsApp', payload: '01608922800' },
      { label: 'হটলাইনে কল করুন', actionType: 'callPhone', payload: '09647922800' },
    ],
  };
}

/**
 * Call live Gemini API if an API key is available
 */
export async function queryGeminiAPI(
  apiKey: string,
  history: Array<{ sender: 'user' | 'bot'; text: string }>,
  userMessage: string
): Promise<string> {
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `SYSTEM CONTEXT INSTRUCTIONS:\n${GAENR_SYSTEM_PROMPT}\n\nPlease strictly follow these instructions and answer the user query based on GAENR's real facts.`,
        },
      ],
    },
    {
      role: 'model',
      parts: [
        {
          text: `Understood! I am Gaenr AI, the official assistant for GAENR. I will respond helpfully, accurately, and politely in Bengali or English based on the user's language.`,
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

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(
      apiKey
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

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errorBody}`);
  }

  const data = await response.json();
  const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textOutput) {
    throw new Error('No response text received from Gemini');
  }

  return textOutput;
}
