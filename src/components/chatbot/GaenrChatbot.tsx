import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChatMessage,
  ChatLanguage,
  LearnedMemory,
  loadLearnedMemory,
  analyzeAndLearnFromMessage,
  getLocalAIResponse,
  queryGeminiAPI,
  getActiveGeminiApiKey,
  detectLanguage,
} from './gaenrKnowledgeBase';
import { GaenrBotAvatar } from './GaenrBotAvatar';
import { ServiceSlug, FreelancerProfile } from '../../types';
import { SERVICE_CATEGORIES } from '../../data/mockData';
import {
  Send,
  X,
  Sparkles,
  ArrowRight,
  Phone,
  MessageCircle,
  RotateCcw,
  Bot,
  Mic,
  MicOff,
} from 'lucide-react';

const SUGGESTIONS_BN = [
  'টাস্ক কীভাবে দিতে হয়?',
  'কী কী সার্ভিস দেওয়া হয়?',
  'স্কিল ছাড়া কি কাজ পাওয়া যাবে?',
  'মিরপুর অফিস ও ফোন নম্বর?',
  'পেমেন্ট সিস্টেম ও চার্জ কত?',
];

const SUGGESTIONS_EN = [
  'How to assign a project task?',
  'What services do you offer?',
  'Can I earn without skills?',
  'Mirpur office & hotline number?',
  'Pricing & platform fee details?',
];

interface InChatTaskState {
  active: boolean;
  step:
    | 'idle'
    | 'name'
    | 'whatsapp'
    | 'email'
    | 'category'
    | 'subCategory'
    | 'expert'
    | 'brief'
    | 'deadline'
    | 'document'
    | 'agreement';
  fullName: string;
  email: string;
  whatsapp: string;
  category: ServiceSlug;
  categoryTitle: string;
  subCategory: string;
  expertCode: string;
  description: string;
  deadline: string;
  documentUrl?: string;
}

export const GaenrChatbot: React.FC = () => {
  const {
    navigate,
    openAssignTask,
    openApplyExpert,
    submitTaskAssignment,
    showToast,
    freelancers,
  } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Dynamic language state: starts in English, automatically adapts to user's query
  const [language, setLanguage] = useState<ChatLanguage>('en');

  // Speech-to-text / Voice Command state
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Interactive step-by-step task flow state
  const [taskFlow, setTaskFlow] = useState<InChatTaskState>({
    active: false,
    step: 'idle',
    fullName: '',
    email: '',
    whatsapp: '',
    category: 'graphics-design',
    categoryTitle: 'Graphics Design',
    subCategory: 'Logo & Brand Identity',
    expertCode: 'Gaenr Verified Match',
    description: '',
    deadline: 'Flexible (3-5 Days)',
  });

  // Adaptive memory state
  const [memory, setMemory] = useState<LearnedMemory>(() => loadLearnedMemory());

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const apiKey = getActiveGeminiApiKey();

  // Clean up speech recognition on unmount
  useEffect(() => {
    return () => {
      try {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      } catch {}
    };
  }, []);

  // Auto-shrink back to compact circle when clicking outside the chat container
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        chatContainerRef.current &&
        !chatContainerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setIsHovered(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Real-time formatted clock (e.g. 1:04 AM)
  const getRealtimeClock = (): string => {
    return new Date().toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Crisp human welcome message from Ginny from Gaenr (spoken only once at session start)
  const getInitialMessage = (lang: ChatLanguage): ChatMessage => ({
    id: 'welcome-1',
    sender: 'bot',
    text:
      lang === 'en'
        ? `Hi, I'm Ginny from Gaenr. How can I help you today? Whether you're looking to hire top talent or join us as a verified Expert, I'm here for you.`
        : `হ্যালো, আমি গেইনার থেকে গিনি (Ginny)। কীভাবে সাহায্য করতে পারি? আপনি যদি প্রজেক্টের জন্য এক্সপার্ট হায়ার করতে চান বা নিজে এক্সপার্ট হিসেবে জয়েন করতে চান—দুটোতেই আমি সাহায্য করতে পারি।`,
    timestamp: getRealtimeClock(),
    actions: [
      {
        label: lang === 'en' ? 'Assign a Task' : 'টাস্ক দিন',
        actionType: 'promptTaskOptions',
      },
      {
        label: lang === 'en' ? 'Apply as Expert' : 'এক্সপার্ট হিসেবে জয়েন',
        actionType: 'openApplyModal',
      },
      {
        label: lang === 'en' ? 'Explore Services' : 'সার্ভিসসমূহ',
        actionType: 'navigate',
        payload: '/services',
      },
      {
        label: lang === 'en' ? 'WhatsApp' : 'হোয়াটসঅ্যাপ চ্যাট',
        actionType: 'openWhatsApp',
        payload: '01608922800',
      },
    ],
  });

  // Ephemeral, strictly one-time session-based messages:
  // Messages are NEVER saved across sessions or refreshes, ensuring 100% privacy so no one else sees previous chats.
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      localStorage.removeItem('gaenr_chat_messages_v2');
      localStorage.removeItem('gaenr_chat_messages_v1');
    } catch {}
    return [getInitialMessage('en')];
  });

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Auto scroll to latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Handle resetting the chat cleanly
  const handleResetChat = () => {
    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {}
      setIsListening(false);
    }
    setTaskFlow({
      active: false,
      step: 'idle',
      fullName: '',
      email: '',
      whatsapp: '',
      category: 'graphics-design',
      categoryTitle: 'Graphics Design',
      subCategory: 'Logo & Brand Identity',
      expertCode: 'Gaenr Verified Match',
      description: '',
      deadline: 'Flexible (3-5 Days)',
    });
    setMessages([getInitialMessage(language)]);
    showToast('Started new conversation', 'info');
  };

  /**
   * Toggle Voice Command (Speech Recognition)
   * Converts voice to text live; when turned off or paused, the writing remains in input!
   */
  const handleToggleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showToast(
        language === 'bn'
          ? 'আপনার ব্রাউজারে স্পিচ রিকগনিশন সাপোর্ট নেই। দয়া করে গুগল ক্রোম বা এজ ব্যবহার করুন।'
          : 'Speech recognition is not supported in this browser. Please use Chrome or Edge.',
        'info'
      );
      return;
    }

    if (isListening) {
      // User turned off voice command -> stop listening, transcription is in input field
      try {
        recognitionRef.current?.stop();
      } catch {}
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      // Smart recognition language: default to Bengali if user or browser locale is in Bangla, else English
      const userLocale = typeof navigator !== 'undefined' && navigator.language ? navigator.language.toLowerCase() : '';
      recognition.lang = language === 'bn' || userLocale.includes('bn') ? 'bn-BD' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let fullText = '';
        for (let i = 0; i < event.results.length; ++i) {
          fullText += event.results[i][0].transcript;
        }
        if (fullText.trim()) {
          setInputValue(fullText.trim());
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          showToast(
            language === 'bn'
              ? 'মাইক্রোফোন পারমিশন প্রয়োজন। দয়া করে ব্রাউজারে পারমিশন এলাও করুন।'
              : 'Microphone permission denied. Please allow microphone access in your browser.',
            'error'
          );
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
    }
  };

  // Helpers to resolve categories, sub-services, and experts
  const getCategoryMeta = (slugOrKey: string): { slug: ServiceSlug; title: string } => {
    const lower = slugOrKey.toLowerCase();
    if (lower.includes('video') || lower.includes('ভিডিও')) {
      return { slug: 'video-editing', title: 'Video Editing' };
    }
    if (lower.includes('word') || lower.includes('web') || lower.includes('সাইট') || lower.includes('site')) {
      return { slug: 'wordpress-website', title: 'WordPress Website Design' };
    }
    if (lower.includes('content') || lower.includes('write') || lower.includes('লেখা') || lower.includes('কন্টেন্ট')) {
      return { slug: 'content-writing', title: 'Content Writing & Copywriting' };
    }
    if (lower.includes('slide') || lower.includes('presentation') || lower.includes('স্লাইড') || lower.includes('পাওয়ারপয়েন্ট')) {
      return { slug: 'presentation-slide-design', title: 'Presentation Slide Design' };
    }
    if (lower.includes('ui') || lower.includes('ux') || lower.includes('figma') || lower.includes('ফিগমা')) {
      return { slug: 'ux-ui-design', title: 'UX / UI Design' };
    }
    if (lower.includes('ad') || lower.includes('campaign') || lower.includes('বিজ্ঞাপন') || lower.includes('boost')) {
      return { slug: 'ad-running', title: 'Ad Running & Campaign Setup' };
    }
    return { slug: 'graphics-design', title: 'Graphics Design' };
  };

  const getSubCategories = (slug: ServiceSlug): string[] => {
    const found = SERVICE_CATEGORIES.find((c) => c.slug === slug);
    if (found && found.subServices && found.subServices.length > 0) {
      return found.subServices;
    }
    return [
      'Logo & Brand Identity',
      'Social Media Creatives',
      'Packaging & Label Design',
      'Vector Illustrations',
    ];
  };

  const getMatchedFreelancers = (slug: ServiceSlug): FreelancerProfile[] => {
    const matched = freelancers.filter((f) => f.category === slug);
    if (matched.length > 0) {
      return matched.slice(0, 3);
    }
    return freelancers.slice(0, 3);
  };

  /**
   * Finalizes the task collected in chat:
   * 1. Saves task to backend database (AppContext + localStorage + remote storage)
   * 2. Prepares pre-filled WhatsApp message in the exact format
   * 3. Opens WhatsApp and shows direct action button
   */
  const completeTaskFlow = (documentUrl: string | undefined, lang: ChatLanguage) => {
    const isBn = lang === 'bn';
    const taskData = {
      fullName: taskFlow.fullName || 'Valued Client',
      email: taskFlow.email || 'client@gaenr.com',
      whatsapp: taskFlow.whatsapp || 'Not provided',
      category: taskFlow.category,
      categoryTitle: taskFlow.categoryTitle || 'Graphics Design',
      subCategory: taskFlow.subCategory || 'General Deliverable',
      expertCode: taskFlow.expertCode || 'Gaenr Verified Match',
      deadline: taskFlow.deadline || 'Flexible (3-5 Days)',
      description: taskFlow.description || 'Project details provided via Ginny AI chat.',
      documentUrl,
    };

    // 1. Submit to Backend database (creates task with ID, pending_review, bridges to ops)
    const newTask = submitTaskAssignment({
      fullName: taskData.fullName,
      email: taskData.email,
      whatsapp: taskData.whatsapp,
      preferredChannel: 'WhatsApp',
      category: taskData.category,
      subCategory: taskData.subCategory,
      expertCode: taskData.expertCode,
      deadline: taskData.deadline,
      description: taskData.description,
      documentUrl: taskData.documentUrl,
      agreedAccuracy: true,
      agreedTerms: true,
      assignedVia: 'ginny_ai',
    });

    // 2. Format exact WhatsApp message matching AssignTaskModal
    const categoryTitle = taskData.categoryTitle;
    const resolvedExpert = taskData.expertCode.toLowerCase().includes('match')
      ? 'Gaenr Verified Match (Auto Assignment)'
      : `Gaenr Verified Expert #${taskData.expertCode}`;
    const resolvedDeadline = taskData.deadline;
    const resolvedSubCategory = taskData.subCategory;

    const greeting = `Hey GAENR, this is *${taskData.fullName.trim()}*! I would like to initiate and assign a project task with the following details:`;
    const taskRef = `*Task Reference ID:* ${newTask.id}`;
    const clientBlock = `*Client Information:*
- *Full Name:* ${taskData.fullName.trim()}
- *Email:* ${taskData.email.trim()}
- *WhatsApp Number:* ${taskData.whatsapp.trim()}`;
    const scopeBlock = `*Project Scope:*
- *Service Category:* ${categoryTitle}
- *Sub-Service / Deliverable:* ${resolvedSubCategory}
- *Assigned Expert:* ${resolvedExpert}
- *Target Deadline:* ${resolvedDeadline}`;
    const briefBlock = `*Project Brief & Requirements:*
${taskData.description.trim()}`;

    let docBlock = '';
    if (taskData.documentUrl) {
      docBlock = `*Project Document / Asset Link:*
- Link: ${taskData.documentUrl.trim()}`;
    }

    const confirmBlock = `*Client Confirmation:* Confirmed scope accuracy and agreed to GAENR escrow protection policies.`;

    const messageBlocks = [greeting, taskRef, clientBlock, scopeBlock, briefBlock];
    if (docBlock) {
      messageBlocks.push(docBlock);
    }
    messageBlocks.push(confirmBlock);

    const whatsappMessage = messageBlocks.join('\n\n');
    const whatsappUrl = `https://wa.me/8801608922800?text=${encodeURIComponent(whatsappMessage)}`;

    // Reset task state
    setTaskFlow({
      active: false,
      step: 'idle',
      fullName: '',
      email: '',
      whatsapp: '',
      category: 'graphics-design',
      categoryTitle: 'Graphics Design',
      subCategory: 'Logo & Brand Identity',
      expertCode: 'Gaenr Verified Match',
      description: '',
      deadline: 'Flexible (3-5 Days)',
    });

    // Auto open WhatsApp directly
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 700);

    return {
      text: isBn
        ? `✅ **টাস্ক সফলভাবে তৈরি হয়েছে! (রেফারেন্স: ${newTask.id})**\n\nপ্রজেক্টের তথ্য আমাদের সিস্টেমে সংরক্ষিত হয়েছে। নিচের বাটনে ক্লিক করলেই প্রস্তুতকৃত প্রজেক্ট ব্রিফসহ হোয়াটসঅ্যাপে চলে যাবে—আপনার কাজ শুধু সেন্ড বাটনে ক্লিক করা:`
        : `✅ **Task Registered Successfully! (Ref: ${newTask.id})**\n\nYour project details are saved in our database. Click the button below to send your pre-formatted project brief directly on WhatsApp—you just need to hit Send:`,
      actions: [
        {
          label: isBn ? '🚀 WhatsApp-এ পাঠান' : '🚀 Send to WhatsApp',
          actionType: 'openWhatsAppUrl',
          payload: whatsappUrl,
        },
        {
          label: isBn ? 'সার্ভিসসমূহ দেখুন' : 'Explore Services',
          actionType: 'navigate',
          payload: '/services',
        },
      ],
    };
  };

  /**
   * Step-by-step interview runner for Assign Task
   */
  const handleTaskFlowStep = (text: string, lang: ChatLanguage) => {
    const isBn = lang === 'bn';
    const cleanText = text.trim();

    // Check cancellation
    if (/^(cancel|বাতিল|exit|stop)$/i.test(cleanText)) {
      setTaskFlow({
        active: false,
        step: 'idle',
        fullName: '',
        email: '',
        whatsapp: '',
        category: 'graphics-design',
        categoryTitle: 'Graphics Design',
        subCategory: 'Logo & Brand Identity',
        expertCode: 'Gaenr Verified Match',
        description: '',
        deadline: 'Flexible (3-5 Days)',
      });
      return {
        text: isBn
          ? 'টাস্ক প্রক্রিয়াটি বাতিল করা হয়েছে। আর কীভাবে সাহায্য করতে পারি?'
          : 'Task assignment has been cancelled. How else can I help you today?',
        actions: [
          { label: isBn ? 'সার্ভিসসমূহ' : 'Explore Services', actionType: 'navigate', payload: '/services' },
          { label: isBn ? 'হোয়াটসঅ্যাপ' : 'WhatsApp', actionType: 'openWhatsApp', payload: '01608922800' },
        ],
      };
    }

    // Step 1: Client Full Name
    if (taskFlow.step === 'name') {
      const fullName = cleanText;
      setTaskFlow((prev) => ({ ...prev, fullName, step: 'whatsapp' }));
      return {
        text: isBn
          ? `ধন্যবাদ **${fullName}**! এবার আপনার WhatsApp নম্বরটি দিন (যেমন: 01700000000):`
          : `Thank you **${fullName}**! What is your WhatsApp number? (e.g. 01700000000):`,
      };
    }

    // Step 2: WhatsApp Number specifically
    if (taskFlow.step === 'whatsapp') {
      const phoneMatch = cleanText.match(/(?:\+?88)?01[3-9]\d{8}/) || cleanText.match(/\d{10,13}/);
      const whatsapp = phoneMatch ? phoneMatch[0] : cleanText;
      setTaskFlow((prev) => ({ ...prev, whatsapp, step: 'email' }));
      return {
        text: isBn
          ? `আপনার ইমেইল অ্যাড্রেসটি দিন (প্রজেক্ট ডেলিভারি ও রসিদের জন্য):`
          : `Please provide your Email address (for final delivery & receipt):`,
        actions: [
          {
            label: isBn ? '⏩ Skip (পরে দেব)' : '⏩ Skip / Use Default',
            actionType: 'skipTaskEmail',
          },
        ],
      };
    }

    // Step 3: Email specifically
    if (taskFlow.step === 'email') {
      const emailMatch = cleanText.match(/[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}/);
      const isSkip = /^(skip|no|নেই|না|পরে|default)$/i.test(cleanText);
      const email = emailMatch ? emailMatch[0] : isSkip ? 'client@gaenr.com' : cleanText;
      setTaskFlow((prev) => ({ ...prev, email, step: 'category' }));
      return {
        text: isBn
          ? 'কোন সার্ভিসের জন্য কাজটি করাতে চান? নিচের সার্ভিস ক্যাটাগরি থেকে বেছে নিন:'
          : 'Which service category does your project belong to? Please select below:',
        actions: [
          { label: '🎨 Graphics Design', actionType: 'selectTaskCategory', payload: 'graphics-design' },
          { label: '🎬 Video Editing', actionType: 'selectTaskCategory', payload: 'video-editing' },
          { label: '🌐 WordPress Website', actionType: 'selectTaskCategory', payload: 'wordpress-website' },
          { label: '✍️ Content Writing', actionType: 'selectTaskCategory', payload: 'content-writing' },
          { label: '📊 Slide Design', actionType: 'selectTaskCategory', payload: 'presentation-slide-design' },
          { label: '📱 UX/UI Design', actionType: 'selectTaskCategory', payload: 'ux-ui-design' },
          { label: '📢 Ad Campaign', actionType: 'selectTaskCategory', payload: 'ad-running' },
        ],
      };
    }

    // Step 4: Service Category
    if (taskFlow.step === 'category') {
      const meta = getCategoryMeta(cleanText);
      const subList = getSubCategories(meta.slug);
      setTaskFlow((prev) => ({
        ...prev,
        category: meta.slug,
        categoryTitle: meta.title,
        subCategory: subList[0] || meta.title,
        step: 'subCategory',
      }));
      return {
        text: isBn
          ? `সার্ভিস: **${meta.title}**। এই সার্ভিসের কোন কাজটি করাতে চান? নিচে ক্লিক করুন বা লিখে জানান:`
          : `Service: **${meta.title}**. What specific deliverable do you need? Choose below or type:`,
        actions: subList.slice(0, 5).map((sub) => ({
          label: sub,
          actionType: 'selectTaskSubCategory',
          payload: sub,
        })),
      };
    }

    // Step 5: Sub-Category / Deliverable
    if (taskFlow.step === 'subCategory') {
      const subCategory = cleanText;
      const matchedExperts = getMatchedFreelancers(taskFlow.category);
      setTaskFlow((prev) => ({ ...prev, subCategory, step: 'expert' }));
      return {
        text: isBn
          ? `ডেলিভারেবল: **${subCategory}**। এবার এক্সপার্ট নির্বাচন করুন। গেইনার ভেরিফাইড অটো-ম্যাচ নিতে পারেন অথবা নির্দিষ্ট এক্সপার্ট কোড বেছে নিন:`
          : `Deliverable: **${subCategory}**. Select an Expert for your project. Choose Gaenr Auto-Match or pick an Expert code:`,
        actions: [
          {
            label: '✨ Gaenr Verified Match (Auto)',
            actionType: 'selectTaskExpert',
            payload: 'Gaenr Verified Match',
          },
          ...matchedExperts.map((f) => ({
            label: `👤 Expert #${f.code} (${f.rating}★)`,
            actionType: 'selectTaskExpert' as const,
            payload: f.code,
          })),
        ],
      };
    }

    // Step 6: Expert Selection
    if (taskFlow.step === 'expert') {
      const expertCode = cleanText || 'Gaenr Verified Match';
      setTaskFlow((prev) => ({ ...prev, expertCode, step: 'brief' }));
      return {
        text: isBn
          ? `নির্বাচিত এক্সপার্ট: **${expertCode}**। এবার আপনার কাজের বিবরণ ও প্রয়োজনীয় রিকোয়ারমেন্টস (Brief) লিখুন:`
          : `Selected Expert: **${expertCode}**. Please describe your project requirements and brief:`,
      };
    }

    // Step 7: Project Brief
    if (taskFlow.step === 'brief') {
      const description = cleanText;
      setTaskFlow((prev) => ({ ...prev, description, step: 'deadline' }));
      return {
        text: isBn
          ? 'কাজটি কবে নাগাদ ডেলিভারি প্রয়োজন? নিচের অপশন থেকে বেছে নিন বা লিখে দিন:'
          : 'What is your target deadline? Choose below or specify:',
        actions: [
          { label: '⚡ Rush (24-48 Hours)', actionType: 'selectTaskDeadline', payload: 'Rush (24-48 Hours)' },
          { label: '📅 3-5 Days', actionType: 'selectTaskDeadline', payload: '3-5 Days' },
          { label: '🗓️ 1 Week', actionType: 'selectTaskDeadline', payload: '1 Week' },
          { label: '✨ Flexible', actionType: 'selectTaskDeadline', payload: 'Flexible (3-5 Days)' },
        ],
      };
    }

    // Step 8: Target Deadline
    if (taskFlow.step === 'deadline') {
      const deadline = cleanText || 'Flexible (3-5 Days)';
      setTaskFlow((prev) => ({ ...prev, deadline, step: 'document' }));
      return {
        text: isBn
          ? 'কাজের কোনো রেফারেন্স ফাইল বা Google Drive লিংক আছে কি? (না থাকলে নিচের Skip বাটনে ক্লিক করুন বা "নেই" লিখুন):'
          : 'Do you have any reference document, Google Drive link, or asset URL? (If none, click Skip below):',
        actions: [
          { label: isBn ? '⏩ Skip (নেই)' : '⏩ Skip', actionType: 'skipTaskDocument' },
        ],
      };
    }

    // Step 9: Document Link -> Step 10: Agreement Confirmation
    if (taskFlow.step === 'document') {
      const isSkip = /^(skip|no|নেই|না|none|-)$/i.test(cleanText);
      const documentUrl = isSkip ? undefined : cleanText;
      setTaskFlow((prev) => ({ ...prev, documentUrl, step: 'agreement' }));

      return {
        text: isBn
          ? `📋 **টাস্ক সামারি ও সম্মতি যাচাই:**\n- ক্লায়েন্ট: **${taskFlow.fullName}** (${taskFlow.whatsapp})\n- ক্যাটাগরি: **${taskFlow.categoryTitle}**\n- ডেলিভারেবল: **${taskFlow.subCategory}**\n- এক্সপার্ট: **${taskFlow.expertCode}**\n- ডেডলাইন: **${taskFlow.deadline}**\n\nআপনি কি নিশ্চিত করছেন যে তথ্যগুলো সঠিক এবং আপনি গেইনারের কোয়ালিটি ও এস্ক্রো পলিসিতে সম্মত আছেন?`
          : `📋 **Task Summary & Confirmation:**\n- Client: **${taskFlow.fullName}** (${taskFlow.whatsapp})\n- Category: **${taskFlow.categoryTitle}**\n- Deliverable: **${taskFlow.subCategory}**\n- Expert: **${taskFlow.expertCode}**\n- Deadline: **${taskFlow.deadline}**\n\nDo you confirm that this scope is accurate and you agree to Gaenr's escrow protection and delivery policies?`,
        actions: [
          {
            label: isBn ? '✅ I Confirm & Agree (সম্মত ও সম্পন্ন করুন)' : '✅ I Confirm & Agree',
            actionType: 'confirmTaskAgreement',
          },
          {
            label: isBn ? '❌ Cancel (বাতিল)' : '❌ Cancel',
            actionType: 'startInChatTask',
          },
        ],
      };
    }

    // Step 10: Agreement confirmed via chat text
    if (taskFlow.step === 'agreement') {
      if (/^(cancel|বাতিল|না|no)$/i.test(cleanText)) {
        setTaskFlow({
          active: false,
          step: 'idle',
          fullName: '',
          email: '',
          whatsapp: '',
          category: 'graphics-design',
          categoryTitle: 'Graphics Design',
          subCategory: 'Logo & Brand Identity',
          expertCode: 'Gaenr Verified Match',
          description: '',
          deadline: 'Flexible (3-5 Days)',
        });
        return {
          text: isBn ? 'টাস্ক বাতিল করা হয়েছে।' : 'Task assignment cancelled.',
        };
      }
      return completeTaskFlow(taskFlow.documentUrl, lang);
    }

    return null;
  };

  /**
   * Autonomous Action Executor: parses [ACTION:...] tags and triggers actions
   */
  const executeAutonomousAction = (rawResponse: string): string => {
    let cleaned = rawResponse;

    if (cleaned.includes('[ACTION:OPEN_ASSIGN_TASK]')) {
      cleaned = cleaned.replace(/\[ACTION:OPEN_ASSIGN_TASK\]/g, '').trim();
      setTimeout(() => openAssignTask(), 500);
    } else if (cleaned.includes('[ACTION:OPEN_APPLY_EXPERT]')) {
      cleaned = cleaned.replace(/\[ACTION:OPEN_APPLY_EXPERT\]/g, '').trim();
      setTimeout(() => openApplyExpert(), 500);
    } else if (cleaned.includes('[ACTION:NAVIGATE:')) {
      const navMatch = cleaned.match(/\[ACTION:NAVIGATE:([^\]]+)\]/);
      if (navMatch && navMatch[1]) {
        const dest = navMatch[1];
        cleaned = cleaned.replace(/\[ACTION:NAVIGATE:[^\]]+\]/g, '').trim();
        setTimeout(() => {
          navigate(dest);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 500);
      }
    } else if (cleaned.includes('[ACTION:OPEN_WHATSAPP]')) {
      cleaned = cleaned.replace(/\[ACTION:OPEN_WHATSAPP\]/g, '').trim();
      setTimeout(() => {
        window.open('https://wa.me/8801608922800', '_blank');
      }, 500);
    }

    return cleaned;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

    // If voice listening is currently on, stop it
    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {}
      setIsListening(false);
    }

    // Detect user language automatically from their message
    const detectedLang = detectLanguage(text);
    setLanguage(detectedLang);

    // Continuous learning: learn facts from conversation
    const updatedMemory = analyzeAndLearnFromMessage(text, memory);
    setMemory(updatedMemory);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: getRealtimeClock(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // 1. If currently inside active In-Chat Task flow, route through state machine
      if (taskFlow.active) {
        await new Promise((resolve) => setTimeout(resolve, 350));
        const flowResult = handleTaskFlowStep(text, detectedLang);
        if (flowResult) {
          const botMessage: ChatMessage = {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: flowResult.text,
            timestamp: getRealtimeClock(),
            actions: flowResult.actions as any,
          };
          setMessages((prev) => [...prev, botMessage]);
          setIsTyping(false);
          return;
        }
      }

      // 2. Direct intent for assigning task: directly present the clear, specific choice!
      const qLower = text.toLowerCase();
      if (
        qLower.includes('assign task') ||
        qLower.includes('hire') ||
        qLower.includes('start project') ||
        qLower.includes('কাজ দিতে চাই') ||
        qLower.includes('টাস্ক দিতে চাই') ||
        qLower.includes('কাজ করাতে চাই') ||
        qLower.includes('টাস্ক করব') ||
        qLower.includes('টাস্ক করতে চাই') ||
        qLower.includes('অ্যাসাইন টাস্ক') ||
        qLower.includes('সার্ভিস নিতে চাই')
      ) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const isBn = detectedLang === 'bn';
        const taskPromptMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: isBn
            ? 'তুমি সরাসরি ফর্ম ওপেন করে নিজেই টাস্কের তথ্য পূরণ করতে পারো, অথবা **আমি নিজেই তোমার সম্পূর্ণ টাস্ক অ্যাসাইন করে দিতে পারি!** তোমার কোনো ফর্ম পূরণ করতে হবে না—শুধু একে একে আমাকে তথ্যগুলো বলবে। আমি সবকিছু সাজিয়ে সরাসরি WhatsApp-এ নিয়ে যাব, সেখানে শুধু "Send" বাটনটা ক্লিক করলেই কাজ শুরু হয়ে যাবে!'
            : 'You can click the task form button to submit the details yourself, or **I can handle the entire task assignment for you right here!** You don\'t have to fill out any forms—just tell me the details step-by-step. I\'ll prepare everything and take you directly to WhatsApp where you simply click Send!',
          timestamp: getRealtimeClock(),
          actions: [
            {
              label: isBn ? '🤖 গিনির সাথেই চ্যাটে করুন' : '🤖 Assign with Ginny',
              actionType: 'startInChatTask',
            },
            {
              label: isBn ? '📋 সরাসরি ফর্ম ওপেন করুন' : '📋 Open Task Form',
              actionType: 'openAssignModal',
            },
          ],
        };
        setMessages((prev) => [...prev, taskPromptMsg]);
        setIsTyping(false);
        return;
      }

      // 3. Otherwise normal AI handling (Gemini or Local Knowledge)
      let botResponseText = '';
      let botActions: ChatMessage['actions'] = undefined;

      const activeKey = apiKey.trim();

      if (activeKey) {
        try {
          botResponseText = await queryGeminiAPI(
            activeKey,
            messages.map((m) => ({ sender: m.sender, text: m.text })),
            text,
            detectedLang,
            updatedMemory
          );
        } catch (apiError) {
          console.warn('Gemini API query failed, fallback to local knowledge:', apiError);
          const fallback = getLocalAIResponse(text, detectedLang, updatedMemory);
          botResponseText = fallback.text;
          botActions = fallback.actions;
        }
      } else {
        await new Promise((resolve) => setTimeout(resolve, 400));
        const local = getLocalAIResponse(text, detectedLang, updatedMemory);
        botResponseText = local.text;
        botActions = local.actions;
      }

      // Execute website control actions if requested
      const finalText = executeAutonomousAction(botResponseText);

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: finalText,
        timestamp: getRealtimeClock(),
        actions: botActions,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const fallback = getLocalAIResponse(text, detectedLang, updatedMemory);
      const finalText = executeAutonomousAction(fallback.text);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: finalText,
          timestamp: getRealtimeClock(),
          actions: fallback.actions,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = (action: NonNullable<ChatMessage['actions']>[number]) => {
    if (action.actionType === 'navigate' && action.payload) {
      navigate(action.payload);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (action.actionType === 'openAssignModal') {
      openAssignTask();
    } else if (action.actionType === 'openApplyModal') {
      openApplyExpert();
    } else if (action.actionType === 'openWhatsApp') {
      const number = action.payload || '01608922800';
      window.open(`https://wa.me/88${number.replace(/\D/g, '')}`, '_blank');
    } else if (action.actionType === 'callPhone') {
      const number = action.payload || '09647922800';
      window.open(`tel:${number.replace(/\D/g, '')}`, '_self');
    } else if (action.actionType === 'openWhatsAppUrl' && action.payload) {
      window.open(action.payload, '_blank');
    } else if (action.actionType === 'promptTaskOptions') {
      const isBn = language === 'bn';
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: isBn
            ? 'তুমি সরাসরি ফর্ম ওপেন করে নিজেই টাস্কের তথ্য পূরণ করতে পারো, অথবা **আমি নিজেই তোমার সম্পূর্ণ টাস্ক অ্যাসাইন করে দিতে পারি!** তোমার কোনো ফর্ম পূরণ করতে হবে না—শুধু একে একে আমাকে তথ্যগুলো বলবে। আমি সবকিছু সাজিয়ে সরাসরি WhatsApp-এ নিয়ে যাব, সেখানে শুধু "Send" বাটনটা ক্লিক করলেই কাজ শুরু হয়ে যাবে!'
            : 'You can click the task form button to submit the details yourself, or **I can handle the entire task assignment for you right here!** You don\'t have to fill out any forms—just tell me the details step-by-step. I\'ll prepare everything and take you directly to WhatsApp where you simply click Send!',
          timestamp: getRealtimeClock(),
          actions: [
            {
              label: isBn ? '🤖 গিনির সাথেই চ্যাটে করুন' : '🤖 Assign with Ginny',
              actionType: 'startInChatTask',
            },
            {
              label: isBn ? '📋 সরাসরি ফর্ম ওপেন করুন' : '📋 Open Task Form',
              actionType: 'openAssignModal',
            },
          ],
        },
      ]);
    } else if (action.actionType === 'startInChatTask') {
      const isBn = language === 'bn';
      setTaskFlow({
        active: true,
        step: 'name',
        fullName: '',
        email: '',
        whatsapp: '',
        category: 'graphics-design',
        categoryTitle: 'Graphics Design',
        subCategory: 'Logo & Brand Identity',
        expertCode: 'Gaenr Verified Match',
        description: '',
        deadline: 'Flexible (3-5 Days)',
      });
      const promptMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: isBn
          ? 'দারুণ! আপনার কোনো ফর্ম পূরণ করতে হবে না, শুধু একে একে আমাকে বলুন। প্রথমে আপনার পূর্ণ নাম (Full Name) কী?'
          : 'Awesome! You don\'t have to fill out any forms, just tell me step-by-step. First, what is your Full Name?',
        timestamp: getRealtimeClock(),
      };
      setMessages((prev) => [...prev, promptMsg]);
    } else if (action.actionType === 'skipTaskEmail') {
      const isBn = language === 'bn';
      setTaskFlow((prev) => ({
        ...prev,
        email: 'client@gaenr.com',
        step: 'category',
      }));
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: isBn
            ? 'কোন সার্ভিসের জন্য কাজটি করাতে চান? নিচের সার্ভিস ক্যাটাগরি থেকে বেছে নিন:'
            : 'Which service category does your project belong to? Please select below:',
          timestamp: getRealtimeClock(),
          actions: [
            { label: '🎨 Graphics Design', actionType: 'selectTaskCategory', payload: 'graphics-design' },
            { label: '🎬 Video Editing', actionType: 'selectTaskCategory', payload: 'video-editing' },
            { label: '🌐 WordPress Website', actionType: 'selectTaskCategory', payload: 'wordpress-website' },
            { label: '✍️ Content Writing', actionType: 'selectTaskCategory', payload: 'content-writing' },
            { label: '📊 Slide Design', actionType: 'selectTaskCategory', payload: 'presentation-slide-design' },
            { label: '📱 UX/UI Design', actionType: 'selectTaskCategory', payload: 'ux-ui-design' },
            { label: '📢 Ad Campaign', actionType: 'selectTaskCategory', payload: 'ad-running' },
          ],
        },
      ]);
    } else if (action.actionType === 'selectTaskCategory' && action.payload) {
      const meta = getCategoryMeta(action.payload);
      const subList = getSubCategories(meta.slug);
      setTaskFlow((prev) => ({
        ...prev,
        category: meta.slug,
        categoryTitle: meta.title,
        subCategory: subList[0] || meta.title,
        step: 'subCategory',
      }));
      const isBn = language === 'bn';
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: isBn
            ? `সার্ভিস: **${meta.title}**। এই সার্ভিসের কোন নির্দিষ্ট কাজটি করাতে চান? নিচে ক্লিক করুন বা লিখে জানান:`
            : `Service: **${meta.title}**. What specific deliverable do you need? Choose below or type:`,
          timestamp: getRealtimeClock(),
          actions: subList.slice(0, 5).map((sub) => ({
            label: sub,
            actionType: 'selectTaskSubCategory',
            payload: sub,
          })),
        },
      ]);
    } else if (action.actionType === 'selectTaskSubCategory' && action.payload) {
      const subCategory = action.payload;
      const matchedExperts = getMatchedFreelancers(taskFlow.category);
      setTaskFlow((prev) => ({
        ...prev,
        subCategory,
        step: 'expert',
      }));
      const isBn = language === 'bn';
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: isBn
            ? `ডেলিভারেবল: **${subCategory}**। এবার এক্সপার্ট নির্বাচন করুন। গেইনার ভেরিফাইড অটো-ম্যাচ নিতে পারেন অথবা নির্দিষ্ট এক্সপার্ট কোড বেছে নিন:`
            : `Deliverable: **${subCategory}**. Select an Expert for your project. Choose Gaenr Auto-Match or pick an Expert code:`,
          timestamp: getRealtimeClock(),
          actions: [
            {
              label: '✨ Gaenr Verified Match (Auto)',
              actionType: 'selectTaskExpert',
              payload: 'Gaenr Verified Match',
            },
            ...matchedExperts.map((f) => ({
              label: `👤 Expert #${f.code} (${f.rating}★)`,
              actionType: 'selectTaskExpert' as const,
              payload: f.code,
            })),
          ],
        },
      ]);
    } else if (action.actionType === 'selectTaskExpert' && action.payload) {
      const expertCode = action.payload;
      setTaskFlow((prev) => ({
        ...prev,
        expertCode,
        step: 'brief',
      }));
      const isBn = language === 'bn';
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: isBn
            ? `নির্বাচিত এক্সপার্ট: **${expertCode}**। এবার আপনার কাজের সংক্ষিপ্ত বিবরণ ও প্রয়োজনীয় রিকোয়ারমেন্টস (Brief) লিখে দিন:`
            : `Selected Expert: **${expertCode}**. Please describe your project requirements and brief:`,
          timestamp: getRealtimeClock(),
        },
      ]);
    } else if (action.actionType === 'selectTaskDeadline' && action.payload) {
      const deadline = action.payload;
      setTaskFlow((prev) => ({
        ...prev,
        deadline,
        step: 'document',
      }));
      const isBn = language === 'bn';
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: isBn
            ? 'কাজের কোনো রেফারেন্স ফাইল বা Google Drive লিংক আছে কি? (না থাকলে নিচের Skip বাটনে ক্লিক করুন বা "নেই" লিখুন):'
            : 'Do you have any reference document, Google Drive link, or asset URL? (If none, click Skip below):',
          timestamp: getRealtimeClock(),
          actions: [
            { label: isBn ? '⏩ Skip (নেই)' : '⏩ Skip', actionType: 'skipTaskDocument' },
          ],
        },
      ]);
    } else if (action.actionType === 'skipTaskDocument') {
      setTaskFlow((prev) => ({
        ...prev,
        documentUrl: undefined,
        step: 'agreement',
      }));
      const isBn = language === 'bn';
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: isBn
            ? `📋 **টাস্ক সামারি ও সম্মতি যাচাই:**\n- ক্লায়েন্ট: **${taskFlow.fullName}** (${taskFlow.whatsapp})\n- ক্যাটাগরি: **${taskFlow.categoryTitle}**\n- ডেলিভারেবল: **${taskFlow.subCategory}**\n- এক্সপার্ট: **${taskFlow.expertCode}**\n- ডেডলাইন: **${taskFlow.deadline}**\n\nআপনি কি নিশ্চিত করছেন যে তথ্যগুলো সঠিক এবং আপনি গেইনারের কোয়ালিটি ও এস্ক্রো পলিসিতে সম্মত আছেন?`
            : `📋 **Task Summary & Confirmation:**\n- Client: **${taskFlow.fullName}** (${taskFlow.whatsapp})\n- Category: **${taskFlow.categoryTitle}**\n- Deliverable: **${taskFlow.subCategory}**\n- Expert: **${taskFlow.expertCode}**\n- Deadline: **${taskFlow.deadline}**\n\nDo you confirm that this scope is accurate and you agree to Gaenr's escrow protection and delivery policies?`,
          timestamp: getRealtimeClock(),
          actions: [
            {
              label: isBn ? '✅ I Confirm & Agree (সম্মত ও সম্পন্ন করুন)' : '✅ I Confirm & Agree',
              actionType: 'confirmTaskAgreement',
            },
            {
              label: isBn ? '❌ Cancel (বাতিল)' : '❌ Cancel',
              actionType: 'startInChatTask',
            },
          ],
        },
      ]);
    } else if (action.actionType === 'confirmTaskAgreement') {
      const resp = completeTaskFlow(taskFlow.documentUrl, language);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: resp.text,
          timestamp: getRealtimeClock(),
          actions: resp.actions as any,
        },
      ]);
    }
  };

  // Basic markdown bold & linebreaks
  const formatMessageText = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, i) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <span key={i} className="block leading-relaxed">
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-bold text-inherit">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return <React.Fragment key={pIdx}>{part}</React.Fragment>;
          })}
        </span>
      );
    });
  };

  const activeSuggestions = language === 'en' ? SUGGESTIONS_EN : SUGGESTIONS_BN;

  return (
    <>
      {/* =========================================================================
          1. FLOATING CHATBOT LAUNCHER (Circular by default, expands on hover)
         ========================================================================= */}
      <div ref={chatContainerRef} className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-[100] flex flex-col items-end">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-label="Chat with Ginny"
            className="group relative flex items-center bg-gradient-to-r from-[#006eff] to-[#004dc9] text-white rounded-full shadow-2xl hover:shadow-blue-500/35 border border-blue-400/40 cursor-pointer active:scale-95 transition-all duration-300 ease-out h-12 w-12 sm:h-13 sm:w-13 overflow-hidden px-2 hover:px-3.5"
            style={{
              width: isHovered ? 'auto' : undefined,
            }}
          >
            {/* Ambient Pulse Ring */}
            <span className="absolute -inset-1 rounded-full bg-blue-400/30 blur-sm group-hover:bg-blue-400/50 animate-pulse pointer-events-none" />

            {/* Custom Gaenr Butterfly AI Bot Avatar - High Contrast Royal Blue Disc */}
            <div className="relative w-8.5 h-8.5 rounded-full bg-gradient-to-tr from-[#002868] to-[#0048ba] flex items-center justify-center shrink-0 border border-blue-300/40 shadow-inner">
              <GaenrBotAvatar size={24} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 border-2 border-[#006eff] rounded-full animate-ping" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 border-2 border-[#006eff] rounded-full" />
            </div>

            {/* Smoothly expanding label revealed on hover */}
            <div
              className={`flex items-center gap-1.5 transition-all duration-300 ease-out whitespace-nowrap overflow-hidden ${
                isHovered
                  ? 'max-w-[145px] opacity-100 ml-2'
                  : 'max-w-0 opacity-0 ml-0'
              }`}
            >
              <div className="text-left">
                <div className="flex items-center gap-1 text-[11px] font-bold leading-tight text-white">
                  <span>Ginny</span>
                  <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                </div>
                <p className="text-[9.5px] text-blue-100 font-medium leading-none mt-0.5">
                  Gaenr
                </p>
              </div>
            </div>
          </button>
        )}

        {/* =========================================================================
            2. CHATBOT WINDOW (Clean, Auto Language Matching, In-Chat Task Automation)
           ========================================================================= */}
        {isOpen && (
          <div className="relative w-[calc(100vw-1.5rem)] xs:w-[335px] sm:w-[350px] h-[475px] sm:h-[500px] max-h-[82vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-250 select-text">
            
            {/* Header: High Contrast Avatar Disc, Ginny Identity, New Chat Reset, Close */}
            <div className="px-3.5 py-2.5 bg-gradient-to-r from-[#006eff] via-[#005cd4] to-[#0048ba] text-white flex items-center justify-between shrink-0 shadow-xs relative">
              <div className="flex items-center gap-2.5">
                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00225e] to-[#003d99] flex items-center justify-center border border-white/30 shrink-0 shadow-inner">
                  <GaenrBotAvatar size={25} />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-400 border-2 border-[#006eff] rounded-full" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-xs font-bold leading-tight">Ginny</h2>
                    <span className="px-1 py-0.2 bg-white/20 rounded text-[8.5px] font-semibold text-emerald-300">
                      Active
                    </span>
                  </div>
                  <p className="text-[10px] text-blue-100 flex items-center gap-1 mt-0.5 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                    <span>Virtual Assistant • Gaenr</span>
                  </p>
                </div>
              </div>

              {/* Header Action Buttons (New Chat & Close) */}
              <div className="flex items-center gap-1">
                {/* Reset / New Chat */}
                <button
                  type="button"
                  onClick={handleResetChat}
                  title="Start fresh conversation"
                  className="p-1.5 rounded-lg text-blue-100 hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                {/* Close Window */}
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setIsHovered(false);
                  }}
                  title="Close"
                  className="p-1.5 rounded-lg text-blue-100 hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-50/70 scroll-smooth">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                  >
                    <div className="flex items-end gap-1.5 max-w-[89%]">
                      {!isUser && (
                        <div className="w-6.5 h-6.5 rounded-full bg-gradient-to-tr from-[#00225e] to-[#003d99] flex items-center justify-center shrink-0 mb-0.5 shadow-xs border border-white/30">
                          <GaenrBotAvatar size={18} />
                        </div>
                      )}

                      <div
                        className={`p-3 rounded-2xl text-[12px] sm:text-[12.5px] leading-relaxed shadow-xs ${
                          isUser
                            ? 'bg-[#006eff] text-white rounded-br-xs font-medium'
                            : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                        }`}
                      >
                        {formatMessageText(msg.text)}

                        {/* Interactive Action Chips */}
                        {!isUser && msg.actions && msg.actions.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2 border-t border-slate-100">
                            {msg.actions.map((act, aIdx) => (
                              <button
                                key={aIdx}
                                onClick={() => handleActionClick(act)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10.5px] font-semibold bg-blue-50 text-[#006eff] hover:bg-[#006eff] hover:text-white transition-colors border border-blue-200/60 cursor-pointer shadow-2xs active:scale-95"
                              >
                                <span>{act.label}</span>
                                <ArrowRight className="w-2.5 h-2.5" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Accurate Real-Time Clock */}
                    <span
                      className={`text-[9.5px] text-slate-400 font-mono px-1 ${
                        isUser ? 'pr-1' : 'pl-8'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}

              {/* Bot Typing Indicator */}
              {isTyping && (
                <div className="flex items-center gap-1.5 max-w-[85%] animate-in fade-in">
                  <div className="w-6.5 h-6.5 rounded-full bg-gradient-to-tr from-[#00225e] to-[#003d99] flex items-center justify-center shrink-0 border border-white/30 shadow-xs">
                    <GaenrBotAvatar size={18} />
                  </div>
                  <div className="px-3 py-2 bg-white border border-slate-200/80 rounded-2xl rounded-bl-xs shadow-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#006eff] animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#006eff] animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#006eff] animate-bounce" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* In-Chat Task Progress Banner (Visible when task interview is active) */}
            {taskFlow.active && (
              <div className="px-3 py-1.5 bg-blue-50 border-t border-blue-100 flex items-center justify-between text-[11px] text-[#006eff] font-medium shrink-0">
                <div className="flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 animate-pulse" />
                  <span>Ginny Task Setup: Step {taskFlow.step}</span>
                </div>
                <button
                  onClick={() => handleSendMessage('cancel')}
                  className="text-slate-500 hover:text-rose-600 text-[10px] underline cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Quick Suggestions Chips Carousel (Visible only on initial state) */}
            {messages.length <= 2 && !taskFlow.active && (
              <div className="px-3 py-1.5 bg-slate-100/80 border-t border-slate-200/60 overflow-x-auto scrollbar-none flex gap-1.5 shrink-0">
                {activeSuggestions.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(sug)}
                    className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white text-slate-700 hover:text-[#006eff] hover:border-blue-300 text-[10px] font-medium border border-slate-200 shadow-2xs transition-colors shrink-0 cursor-pointer active:scale-95"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            )}

            {/* Input Box Footer with Voice Command Mic Button placed right beside Send Button */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-2.5 bg-white border-t border-slate-200/80 flex items-center gap-1.5 shrink-0"
            >
              {/* Input container with inline jumping audio visualizer */}
              <div className="relative flex-1 flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={
                    isListening
                      ? 'Listening to voice...'
                      : taskFlow.active
                      ? 'Type your answer or brief...'
                      : 'Ask me anything...'
                  }
                  className={`w-full bg-slate-50 border rounded-2xl px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006eff]/20 focus:border-[#006eff] transition-all ${
                    isListening
                      ? 'border-[#006eff] ring-1 ring-[#006eff]/30 pr-14 bg-blue-50/20'
                      : 'border-slate-200/90'
                  }`}
                  disabled={isTyping}
                />

                {/* Inline Jumping Audio Soundwave Visualizer Bars */}
                {isListening && (
                  <div
                    className="absolute right-2.5 flex items-center gap-0.5 pointer-events-none"
                    title="Audio detecting"
                  >
                    <span className="w-0.5 bg-[#006eff] rounded-full animate-bounce [animation-duration:500ms] h-2" />
                    <span className="w-0.5 bg-[#006eff] rounded-full animate-bounce [animation-duration:800ms] [animation-delay:150ms] h-4" />
                    <span className="w-0.5 bg-[#006eff] rounded-full animate-bounce [animation-duration:450ms] [animation-delay:300ms] h-3" />
                    <span className="w-0.5 bg-[#006eff] rounded-full animate-bounce [animation-duration:700ms] [animation-delay:100ms] h-5" />
                    <span className="w-0.5 bg-[#006eff] rounded-full animate-bounce [animation-duration:600ms] [animation-delay:250ms] h-2" />
                  </div>
                )}
              </div>

              {/* Voice Command Button — Positioned right beside the Send button */}
              <button
                type="button"
                onClick={handleToggleVoiceInput}
                title={
                  isListening
                    ? 'Stop recording (converts to text)'
                    : 'Voice command'
                }
                aria-label="Voice command"
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/40 ring-2 ring-rose-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-[#006eff] active:scale-95'
                }`}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4 text-white" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                aria-label="Send message"
                className="w-8 h-8 rounded-xl bg-[#006eff] hover:bg-[#005cd4] text-white flex items-center justify-center shrink-0 transition-colors shadow-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};
