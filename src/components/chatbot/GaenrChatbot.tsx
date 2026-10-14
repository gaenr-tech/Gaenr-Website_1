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
import {
  buildGinnyEscalationNotification,
  createWhatsAppUrl,
  sendBackendNotification,
} from '../../utils/whatsappNotifications';

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
    | 'phone'
    | 'whatsapp'
    | 'email'
    | 'service_needed'
    | 'category'
    | 'subCategory'
    | 'custom_subcategory'
    | 'expert'
    | 'brief'
    | 'deadline'
    | 'document'
    | 'awaiting_confirmation'
    | 'editing_field';
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string;
  serviceNeeded: string;
  category: ServiceSlug;
  categoryTitle: string;
  subCategory: string;
  expertCode: string;
  description: string;
  deadline: string;
  documentUrl?: string;
  editField?: 'name' | 'phone' | 'email' | 'category' | 'expert' | 'brief' | 'deadline' | 'document';
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
  const [isJumping, setIsJumping] = useState(false);
  const [isMessagePopupVisible, setIsMessagePopupVisible] = useState(false);
  const [isBubbleHovered, setIsBubbleHovered] = useState(false);
  const isBubbleHoveredRef = useRef(false);
  isBubbleHoveredRef.current = isBubbleHovered;
  const hidePopupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Periodic playful jump animation (every 15s) and proactive speech bubble (every 25s for 3s)
  useEffect(() => {
    if (isOpen) {
      setIsJumping(false);
      setIsMessagePopupVisible(false);
      if (hidePopupTimerRef.current) clearTimeout(hidePopupTimerRef.current);
      return;
    }

    // Trigger initial jump 6 seconds after arrival
    const initialJumpTimer = setTimeout(() => {
      setIsJumping(true);
      const stopTimer = setTimeout(() => setIsJumping(false), 2000);
      return () => clearTimeout(stopTimer);
    }, 6000);

    // Repeated playful bounce and wing fluttering every 15 seconds
    const jumpInterval = setInterval(() => {
      setIsJumping(true);
      setTimeout(() => {
        setIsJumping(false);
      }, 2000);
    }, 15000);

    // Proactive greeting bubble timer: pop up every 25 seconds, stay visible for 3 seconds
    const popupInterval = setInterval(() => {
      setIsMessagePopupVisible(true);
      if (hidePopupTimerRef.current) clearTimeout(hidePopupTimerRef.current);
      hidePopupTimerRef.current = setTimeout(() => {
        if (!isBubbleHoveredRef.current) {
          setIsMessagePopupVisible(false);
        }
      }, 3000);
    }, 25000);

    return () => {
      clearTimeout(initialJumpTimer);
      clearInterval(jumpInterval);
      clearInterval(popupInterval);
      if (hidePopupTimerRef.current) clearTimeout(hidePopupTimerRef.current);
    };
  }, [isOpen]);

  // Dynamic language state: starts in English, automatically adapts to user's query
  const [language, setLanguage] = useState<ChatLanguage>('en');

  // Speech-to-text / Voice Command state
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const latestSpeechTranscriptRef = useRef<string>('');

  // Interactive step-by-step task flow state
  const [taskFlow, setTaskFlow] = useState<InChatTaskState>({
    active: false,
    step: 'idle',
    fullName: '',
    email: '',
    phone: '',
    whatsapp: '',
    serviceNeeded: '',
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
      phone: '',
      whatsapp: '',
      serviceNeeded: '',
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
        latestSpeechTranscriptRef.current = '';
      };

      recognition.onresult = (event: any) => {
        let fullText = '';
        for (let i = 0; i < event.results.length; ++i) {
          fullText += event.results[i][0].transcript;
        }
        const trimmed = fullText.trim();
        latestSpeechTranscriptRef.current = trimmed;
        if (trimmed) {
          setInputValue(trimmed);
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

  // Helper: validate HTTP / HTTPS URL (no javascript: or data:)
  const isValidHttpUrl = (str: string): boolean => {
    if (/^(javascript|data|file|ftp):/i.test(str.trim())) {
      return false;
    }
    try {
      const url = new URL(str.trim());
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  // Helper: map user free text / slug strictly to approved category from Gaenr's taxonomy
  const matchApprovedCategory = (slugOrKey: string): { slug: ServiceSlug; title: string } | null => {
    const lower = slugOrKey.toLowerCase().trim();
    if (
      lower === 'graphics-design' ||
      lower.includes('graphic') ||
      lower.includes('গ্রাফিক') ||
      lower.includes('logo') ||
      lower.includes('লোগো') ||
      lower.includes('banner') ||
      lower.includes('ব্যানার') ||
      lower.includes('illustration')
    ) {
      return { slug: 'graphics-design', title: 'Graphics Design' };
    }
    if (
      lower === 'video-editing' ||
      lower.includes('video') ||
      lower.includes('ভিডিও') ||
      lower.includes('reels') ||
      lower.includes('রিল') ||
      lower.includes('edit') ||
      lower.includes('animation')
    ) {
      return { slug: 'video-editing', title: 'Video Editing' };
    }
    if (
      lower === 'wordpress-website' ||
      lower.includes('word') ||
      lower.includes('web') ||
      lower.includes('সাইট') ||
      lower.includes('site') ||
      lower.includes('website') ||
      lower.includes('ওয়েবসাইট')
    ) {
      return { slug: 'wordpress-website', title: 'WordPress Website Design' };
    }
    if (
      lower === 'content-writing' ||
      lower.includes('content') ||
      lower.includes('write') ||
      lower.includes('লেখা') ||
      lower.includes('কন্টেন্ট') ||
      lower.includes('copywriting') ||
      lower.includes('কপিরাইটিং') ||
      lower.includes('article')
    ) {
      return { slug: 'content-writing', title: 'Content Writing & Copywriting' };
    }
    if (
      lower === 'presentation-slide-design' ||
      lower.includes('slide') ||
      lower.includes('presentation') ||
      lower.includes('স্লাইড') ||
      lower.includes('পাওয়ারপয়েন্ট') ||
      lower.includes('ppt') ||
      lower.includes('pitch deck')
    ) {
      return { slug: 'presentation-slide-design', title: 'Presentation Slide Design' };
    }
    if (
      lower === 'ux-ui-design' ||
      lower.includes('ui') ||
      lower.includes('ux') ||
      lower.includes('figma') ||
      lower.includes('ফিগমা') ||
      lower.includes('app design') ||
      lower.includes('ইউআই')
    ) {
      return { slug: 'ux-ui-design', title: 'UX / UI Design' };
    }
    if (
      lower === 'ad-running' ||
      lower.includes('ad') ||
      lower.includes('campaign') ||
      lower.includes('বিজ্ঞাপন') ||
      lower.includes('boost') ||
      lower.includes('বুস্ট') ||
      lower.includes('marketing')
    ) {
      return { slug: 'ad-running', title: 'Ad Running & Campaign Setup' };
    }
    return null;
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

  // Helper: verify expert name or code against live approved list or supported Auto-match
  const matchApprovedExpert = (
    slugOrKey: string,
    currentCategory: ServiceSlug,
    list: FreelancerProfile[]
  ): string | null => {
    const lower = slugOrKey.toLowerCase().trim();
    if (
      lower.includes('match') ||
      lower.includes('auto') ||
      lower.includes('gaenr verified') ||
      lower.includes('no preference') ||
      lower.includes('যেকোনো') ||
      lower.includes('অটো') ||
      lower.includes('পছন্দ নেই') ||
      lower === 'none' ||
      lower === 'default'
    ) {
      return 'Gaenr Verified Match';
    }

    const cleanCode = lower.replace(/^#/, '');
    const matched = list.find(
      (f) =>
        f.code.toLowerCase() === cleanCode ||
        (f.name && f.name.toLowerCase() === lower) ||
        f.code.toLowerCase().includes(cleanCode)
    );

    if (matched) {
      return matched.code;
    }

    return null;
  };

  // Helper: displays the complete, readable Task Summary prompt with explicit confirmation actions
  const showTaskSummaryPrompt = (
    flow: InChatTaskState,
    lang: ChatLanguage
  ): { text: string; actions: NonNullable<ChatMessage['actions']> } => {
    const isBn = lang === 'bn';
    const contactPhone = flow.phone.trim() || flow.whatsapp.trim();
    const linkText = flow.documentUrl ? flow.documentUrl : (isBn ? 'দেওয়া হয়নি' : 'None provided');

    return {
      text: isBn
        ? `📋 **টাস্ক সামারি ও চূড়ান্ত রিভিউ:**\n- **ক্লায়েন্ট নাম:** ${flow.fullName}\n- **যোগাযোগের ফোন (WhatsApp):** ${contactPhone}\n- **ইমেইল:** ${flow.email}\n- **সার্ভিস ক্যাটাগরি:** ${flow.categoryTitle}\n- **ডেলিভারেবল:** ${flow.subCategory}\n- **মনোনীত এক্সপার্ট:** ${flow.expertCode}\n- **টার্গেট ডেডলাইন:** ${flow.deadline}\n- **রেফারেন্স লিংক:** ${linkText}\n- **কাজের বিবরণ:** ${flow.description}\n\nঅনুগ্রহ করে উপরের বিবরণটি রিভিউ করুন। সবকিছু সঠিক থাকলে **'Confirm and assign'** বেছে নিন। কোনো পরিবর্তন করতে **'Edit details'** বা বাতিল করতে **'Cancel'** সিলেক্ট করুন। আপনার স্পষ্ট সম্মতি ছাড়া কোনো টাস্ক সাবমিট করা হবে না।`
        : `📋 **Task Summary for Review:**\n- **Requester Name:** ${flow.fullName}\n- **Contact Phone (WhatsApp):** ${contactPhone}\n- **Email:** ${flow.email}\n- **Service Category:** ${flow.categoryTitle}\n- **Deliverable:** ${flow.subCategory}\n- **Assigned Expert:** ${flow.expertCode}\n- **Target Deadline:** ${flow.deadline}\n- **Reference Link:** ${linkText}\n- **Project Brief:** ${flow.description}\n\nPlease review the details above. If everything is correct, choose **'Confirm and assign'**. Choose **'Edit details'** to make changes, or **'Cancel'** to stop. I won’t submit the task unless you confirm.`,
      actions: [
        {
          label: isBn ? '✅ Confirm and assign (নিশ্চিত ও সাবমিট)' : '✅ Confirm and assign',
          actionType: 'confirmTaskAgreement',
        },
        {
          label: isBn ? '✏️ Edit details (তথ্য পরিবর্তন)' : '✏️ Edit details',
          actionType: 'editTaskDetails',
        },
        {
          label: isBn ? '❌ Cancel (বাতিল)' : '❌ Cancel',
          actionType: 'cancelTaskFlow',
        },
      ],
    };
  };

  /**
   * Finalizes the task collected in chat:
   * 1. Saves task to backend database (AppContext + localStorage + remote storage)
   * 2. Prepares pre-filled WhatsApp message in the exact format
   * 3. Opens WhatsApp and shows direct action button
   */
  const completeTaskFlow = (documentUrl: string | undefined, lang: ChatLanguage) => {
    const isBn = lang === 'bn';
    const contactPhone = taskFlow.phone.trim() || taskFlow.whatsapp.trim();
    const taskData = {
      fullName: taskFlow.fullName.trim() || 'Valued Client',
      email: taskFlow.email.trim() || 'client@gaenr.com',
      whatsapp: contactPhone || 'Not provided',
      category: taskFlow.category,
      categoryTitle: taskFlow.categoryTitle || 'Graphics Design',
      subCategory: taskFlow.subCategory || 'General Deliverable',
      expertCode: taskFlow.expertCode || 'Gaenr Verified Match',
      deadline: taskFlow.deadline || 'Flexible (3-5 Days)',
      description: taskFlow.description || taskFlow.serviceNeeded || 'Project details provided via Ginny AI chat.',
      documentUrl: taskFlow.documentUrl || documentUrl,
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
      phone: '',
      whatsapp: '',
      serviceNeeded: '',
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
   * Step-by-step interview runner for Assign Task adhering to GINNY Training Guide V1.0
   */
  const handleTaskFlowStep = (text: string, lang: ChatLanguage) => {
    const isBn = lang === 'bn';
    const cleanText = text.trim();

    // 1. Cancellation check (Cancel must never trigger task creation)
    if (/^(cancel|বাতিল|exit|stop|বন্ধ|never mind)$/i.test(cleanText)) {
      setTaskFlow({
        active: false,
        step: 'idle',
        fullName: '',
        email: '',
        phone: '',
        whatsapp: '',
        serviceNeeded: '',
        category: 'graphics-design',
        categoryTitle: 'Graphics Design',
        subCategory: 'Logo & Brand Identity',
        expertCode: 'Gaenr Verified Match',
        description: '',
        deadline: 'Flexible (3-5 Days)',
      });
      return {
        text: isBn
          ? 'টাস্ক প্রক্রিয়াটি বাতিল করা হয়েছে। কোনো টাস্ক সাবমিট করা হয়নি। পরবর্তীতে প্রয়োজন হলে যেকোনো সময় আবার নতুন টাস্ক শুরু করতে পারেন।'
          : 'Understood. I’ve cancelled this submission. No task was submitted. If you want to continue later, you can start a new assignment.',
        actions: [
          { label: isBn ? 'সার্ভিসসমূহ' : 'Explore Services', actionType: 'navigate', payload: '/services' },
          { label: isBn ? 'হোয়াটসঅ্যাপ' : 'WhatsApp', actionType: 'openWhatsApp', payload: '01608922800' },
        ],
      };
    }

    // 2. Handling off-topic question during assignment (Scenario G)
    if (/^(poem|কবিতা|weather|আবহাওয়া|গান|joke)/i.test(cleanText)) {
      return {
        text: isBn
          ? 'আমি সাধারণ বিষয়ে সাহায্য করতে পারি, তবে বর্তমানে আমরা আপনার টাস্ক অ্যাসাইনমেন্টের তথ্য নিচ্ছি। আমরা প্রথমে এই টাস্কটি সম্পন্ন করতে পারি, অথবা আপনি এটি বাতিল করে অন্য বিষয়ে কথা বলতে পারেন।'
          : 'I can help with general questions where supported, but I’m currently collecting details for your task assignment. We can finish the assignment first, or you can cancel it and ask something else.',
      };
    }

    // Editing a specific field after review (State: editing_field)
    if (taskFlow.step === 'editing_field') {
      const field = taskFlow.editField;

      if (field === 'name') {
        const isBadName =
          cleanText.length < 2 ||
          cleanText.length > 60 ||
          /^\d+$/.test(cleanText) ||
          /^(asdf|qwerty|test|abc|xyz|na|none|anything|12345|just do it)$/i.test(cleanText);
        if (isBadName) {
          return {
            text: isBn
              ? 'নামটি সঠিক মনে হচ্ছে না। অনুগ্রহ করে একটি সঠিক নাম লিখুন (যেমন: রাফি আহমেদ বা Rafi Ahmed):'
              : 'Please enter a valid requester name (e.g. Rafi Ahmed):',
          };
        }
        const updated = { ...taskFlow, fullName: cleanText, step: 'awaiting_confirmation' as const, editField: undefined };
        setTaskFlow(updated);
        return showTaskSummaryPrompt(updated, lang);
      }

      if (field === 'phone') {
        const phoneDigits = cleanText.replace(/[\s-]/g, '');
        const isBDMobile = /(?:\+?88)?01[3-9]\d{8}$/.test(phoneDigits);
        const isIntlPhone = /^\+[1-9]\d{6,14}$/.test(phoneDigits);
        if (!isBDMobile && !isIntlPhone) {
          return {
            text: isBn
              ? 'নম্বরটি সঠিক মনে হচ্ছে না। আন্তর্জাতিক নম্বর হলে কান্ট্রি কোডসহ অথবা বাংলাদেশি ১১ ডিজিটের নম্বর দিন (যেমন: 01712345678):'
              : 'That doesn’t look like a valid phone number. Please enter a reachable number (e.g. 01712345678 or +8801712345678):',
          };
        }
        const phoneMatch = phoneDigits.match(/(?:\+?88)?01[3-9]\d{8}/) || phoneDigits.match(/\+[1-9]\d{6,14}/);
        const validPhone = phoneMatch ? phoneMatch[0] : phoneDigits;
        const updated = { ...taskFlow, phone: validPhone, whatsapp: validPhone, step: 'awaiting_confirmation' as const, editField: undefined };
        setTaskFlow(updated);
        return showTaskSummaryPrompt(updated, lang);
      }

      if (field === 'email') {
        const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(cleanText);
        const isPlaceholder = /^(test|asdf|na|none|skip|no)$/i.test(cleanText);
        if (!isEmailValid || isPlaceholder) {
          return {
            text: isBn
              ? 'ইমেইলটি সঠিক নয়। অনুগ্রহ করে একটি কার্যকর ইমেইল দিন (যেমন: name@example.com):'
              : 'Please enter a valid email address (e.g. name@example.com):',
          };
        }
        const updated = { ...taskFlow, email: cleanText.toLowerCase(), step: 'awaiting_confirmation' as const, editField: undefined };
        setTaskFlow(updated);
        return showTaskSummaryPrompt(updated, lang);
      }

      if (field === 'category') {
        const matched = matchApprovedCategory(cleanText);
        if (!matched) {
          return {
            text: isBn
              ? 'অনুগ্রহ করে নিচের তালিকাভুক্ত অনুমোদিত ক্যাটাগরিগুলোর একটি বেছে নিন:'
              : 'Please choose one of our approved categories below:',
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
        const subList = getSubCategories(matched.slug);
        const updated = {
          ...taskFlow,
          category: matched.slug,
          categoryTitle: matched.title,
          subCategory: subList[0] || matched.title,
          step: 'awaiting_confirmation' as const,
          editField: undefined,
        };
        setTaskFlow(updated);
        return showTaskSummaryPrompt(updated, lang);
      }

      if (field === 'expert') {
        const verified = matchApprovedExpert(cleanText, taskFlow.category, freelancers);
        if (!verified) {
          const matchedExperts = getMatchedFreelancers(taskFlow.category);
          return {
            text: isBn
              ? 'এই ক্যাটাগরিতে এই নামের কোনো এক্সপার্ট পাওয়া যায়নি। অনুগ্রহ করে নিচের অপশন থেকে বেছে নিন:'
              : 'I couldn’t find an eligible expert with that name. Please select from the options below:',
            actions: [
              { label: '✨ Gaenr Verified Match (Auto)', actionType: 'selectTaskExpert', payload: 'Gaenr Verified Match' },
              ...matchedExperts.map((f) => ({ label: `👤 Expert #${f.code}`, actionType: 'selectTaskExpert' as const, payload: f.code })),
            ],
          };
        }
        const updated = { ...taskFlow, expertCode: verified, step: 'awaiting_confirmation' as const, editField: undefined };
        setTaskFlow(updated);
        return showTaskSummaryPrompt(updated, lang);
      }

      if (field === 'brief') {
        if (cleanText.length < 5) {
          return {
            text: isBn
              ? 'কাজের বিবরণটি আরেকটু বিস্তারিত লিখুন:'
              : 'Please provide a bit more detail for the project brief:',
          };
        }
        const updated = { ...taskFlow, description: cleanText, step: 'awaiting_confirmation' as const, editField: undefined };
        setTaskFlow(updated);
        return showTaskSummaryPrompt(updated, lang);
      }

      if (field === 'deadline') {
        const updated = { ...taskFlow, deadline: cleanText || 'Flexible (3-5 Days)', step: 'awaiting_confirmation' as const, editField: undefined };
        setTaskFlow(updated);
        return showTaskSummaryPrompt(updated, lang);
      }

      if (field === 'document') {
        const isSkip = /^(skip|no|নেই|না|none|-|স্কিপ)$/i.test(cleanText);
        let docUrl: string | undefined = undefined;
        if (!isSkip) {
          if (!isValidHttpUrl(cleanText)) {
            return {
              text: isBn
                ? 'লিংকটি সঠিক URL মনে হচ্ছে না। অনুগ্রহ করে https:// দিয়ে শুরু হওয়া পূর্ণ লিংক দিন, অথবা কোনো লিংক না থাকলে "নেই" লিখুন:'
                : 'That doesn’t appear to be a valid reference URL. Please paste a full link starting with https://, or write "none":',
            };
          }
          docUrl = cleanText;
        }
        const updated = { ...taskFlow, documentUrl: docUrl, step: 'awaiting_confirmation' as const, editField: undefined };
        setTaskFlow(updated);
        return showTaskSummaryPrompt(updated, lang);
      }
    }

    // Step 1: Client Full Name
    if (taskFlow.step === 'name') {
      const trimmed = cleanText.trim();
      const isBadName =
        trimmed.length < 2 ||
        trimmed.length > 60 ||
        /^\d+$/.test(trimmed) ||
        /^(asdf|qwerty|test|abc|xyz|na|none|anything|12345|just do it|না|নেই)$/i.test(trimmed) ||
        /^(.)\1{4,}$/.test(trimmed);

      if (isBadName) {
        return {
          text: isBn
            ? 'টাস্কটির জন্য যিনি রিকোয়েস্ট করছেন তার নাম প্রয়োজন। অনুগ্রহ করে আপনার সঠিক নামটি লিখুন (যেমন: রাফি আহমেদ বা Rafi Ahmed):'
            : 'I need the name of the person this task is for. Please enter the name you’d like us to use (e.g. Rafi Ahmed):',
        };
      }

      setTaskFlow((prev) => ({ ...prev, fullName: trimmed, step: 'phone' }));
      return {
        text: isBn
          ? `ধন্যবাদ **${trimmed}**! এবার আপনার সাথে যোগাযোগের ফোন নম্বরটি দিন (যেমন: 01712345678 বা +8801712345678)। এই ক্ষেত্রটি আবশ্যক, তাই স্কিপ করা যাবে না:`
          : `Thanks **${trimmed}**! What phone number should we use to contact you? (e.g. 01712345678 or +8801712345678). This field is required, so we can't skip it:`,
      };
    }

    // Step 2: Phone Number (Required & Non-skippable)
    if (taskFlow.step === 'phone' || taskFlow.step === 'whatsapp') {
      const isTryingSkip = /^(skip|স্কিপ|না|নেই|no|পরে|default)$/i.test(cleanText);
      if (isTryingSkip) {
        return {
          text: isBn
            ? 'ফোন নম্বর স্কিপ করা যাবে না, কারণ টাস্ক যোগাযোগের জন্য এটি আবশ্যক। একটি সচল নম্বর দিন (যেমন: 01712345678), অথবা চাইলে টাস্কটি বাতিল করতে পারেন:'
            : 'I can’t skip the phone number because it’s required for this task. Please enter a reachable number (e.g. 01712345678), or you can cancel the assignment without submitting:',
        };
      }

      const phoneDigits = cleanText.replace(/[\s-]/g, '');
      const isBDMobile = /(?:\+?88)?01[3-9]\d{8}$/.test(phoneDigits);
      const isIntlPhone = /^\+[1-9]\d{6,14}$/.test(phoneDigits);
      const isDummy = /^(01700000000|01800000000|01900000000|1234567890)$/.test(phoneDigits);

      if ((!isBDMobile && !isIntlPhone) || isDummy) {
        return {
          text: isBn
            ? 'নম্বরটি সঠিক মনে হচ্ছে না। আন্তর্জাতিক নম্বর হলে কান্ট্রি কোডসহ অথবা বাংলাদেশি ১১ ডিজিটের সচল নম্বর দিন (যেমন: 01712345678)। এই ক্ষেত্রটি আবশ্যক:'
            : 'That doesn’t look like a valid phone number. Please enter a reachable number, including the country code if it’s an international number (e.g. 01712345678). This field is required:',
        };
      }

      const phoneMatch = phoneDigits.match(/(?:\+?88)?01[3-9]\d{8}/) || phoneDigits.match(/\+[1-9]\d{6,14}/);
      const validPhone = phoneMatch ? phoneMatch[0] : phoneDigits;
      setTaskFlow((prev) => ({ ...prev, phone: validPhone, whatsapp: validPhone, step: 'email' }));
      return {
        text: isBn
          ? 'ধন্যবাদ! এবার আপনার ইমেইল অ্যাড্রেসটি দিন (অফিসিয়াল ডেলিভারি ও রসিদের জন্য আবশ্যক, যেমন: name@example.com):'
          : 'Thanks! Please provide your email address as well (required for official delivery & receipts, e.g. name@example.com):',
      };
    }

    // Step 3: Email (Required & Non-skippable)
    if (taskFlow.step === 'email') {
      const isTryingSkip = /^(skip|স্কিপ|না|নেই|no|পরে|default|none|no email)$/i.test(cleanText);
      if (isTryingSkip) {
        return {
          text: isBn
            ? 'ইমেইল স্কিপ করা যাবে না, কারণ ফাইনাল ডেলিভারি আর দরকারি রেকর্ড ইমেইলে পাঠানো হয়। একটি সঠিক ইমেইল দিন (যেমন: name@example.com):'
            : 'The email address is also required, so I can’t continue without it. Please enter a valid address, such as name@example.com:',
        };
      }

      const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(cleanText);
      const isPlaceholder = /^(test|asdf|na|none|hello|abc@)$/i.test(cleanText);

      if (!isEmailValid || isPlaceholder) {
        return {
          text: isBn
            ? 'ইমেইল অ্যাড্রেসটি সঠিক মনে হচ্ছে না। অনুগ্রহ করে একটি সঠিক ইমেইল দিন (যেমন: name@example.com):'
            : 'That email address appears incomplete or invalid. Please provide a valid email address (e.g. name@example.com) to continue:',
        };
      }

      setTaskFlow((prev) => ({ ...prev, email: cleanText.toLowerCase(), step: 'category' }));
      return {
        text: isBn
          ? 'ধন্যবাদ! এবার আপনার প্রয়োজনীয় সার্ভিসটি নির্বাচন করুন (নিচের যে কোনো একটি অপশনে ক্লিক করুন বা সার্ভিসের নাম লিখুন):'
          : 'Thank you! Now please select the service you need from our approved categories below:',
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

    // Step 4: Service Category (Approved Taxonomy & Skill Detection)
    if (taskFlow.step === 'category' || taskFlow.step === 'service_needed') {
      const matched = matchApprovedCategory(cleanText);
      if (!matched) {
        return {
          text: isBn
            ? `"${cleanText}" আমাদের কোনো অনুমোদিত সার্ভিস ক্যাটাগরির সাথে মেলেনি। অনুগ্রহ করে নিচের তালিকাভুক্ত অনুমোদিত ক্যাটাগরিগুলো থেকে বেছে নিন:`
            : `"${cleanText}" doesn't match an approved Gaenr service category. Please choose from our approved categories below:`,
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

      const subList = getSubCategories(matched.slug);
      setTaskFlow((prev) => ({
        ...prev,
        category: matched.slug,
        categoryTitle: matched.title,
        serviceNeeded: matched.title,
        subCategory: subList[0] || matched.title,
        step: 'subCategory',
      }));

      return {
        text: isBn
          ? `সার্ভিস: **${matched.title}**। এই সার্ভিসের কোন নির্দিষ্ট কাজটি করাতে চান? নিচে ক্লিক করুন বা অন্য কিছু হলে 'Other' বেছে নিন:`
          : `Service: **${matched.title}**. What specific deliverable do you need? Choose below or select 'Other':`,
        actions: [
          ...subList.slice(0, 5).map((sub) => ({
            label: sub,
            actionType: 'selectTaskSubCategory' as const,
            payload: sub,
          })),
          {
            label: isBn ? '✨ Other / অন্যান্য' : '✨ Other / Custom',
            actionType: 'selectTaskSubCategory' as const,
            payload: 'Other',
          },
        ],
      };
    }

    // Step 5: Sub-Category / Specific Deliverable
    if (taskFlow.step === 'subCategory') {
      const isOther = /^(other|অন্যান্য|অন্য কিছু|অন্য|custom|আদার)$/i.test(cleanText);
      if (isOther) {
        setTaskFlow((prev) => ({ ...prev, step: 'custom_subcategory' }));
        return {
          text: isBn
            ? 'আপনি ঠিক কী ধরণের কাজ করাতে চাচ্ছেন? আপনার সাব-ক্যাটাগরি বা কাজের ধরনটি সংক্ষেপে লিখে জানান:'
            : 'What specific deliverable or custom task do you need? Please describe it below:',
        };
      }

      const isJunk = cleanText.length < 3 || /^(asdf|qwerty|na|none|test|\?\?|\.\.)$/i.test(cleanText);
      if (isJunk) {
        const subList = getSubCategories(taskFlow.category);
        return {
          text: isBn
            ? `অনুগ্রহ করে নিচের অপশনগুলো থেকে একটি নির্দিষ্ট ডেলিভারেবল বেছে নিন অথবা 'Other' নির্বাচন করে আপনার কাস্টম কাজের নাম লিখুন:`
            : `Please choose a deliverable from the options below or select 'Other' to describe your custom task:`,
          actions: [
            ...subList.slice(0, 5).map((sub) => ({
              label: sub,
              actionType: 'selectTaskSubCategory' as const,
              payload: sub,
            })),
            {
              label: isBn ? '✨ Other / অন্যান্য' : '✨ Other / Custom',
              actionType: 'selectTaskSubCategory' as const,
              payload: 'Other',
            },
          ],
        };
      }

      const subCategory = cleanText;
      const matchedExperts = getMatchedFreelancers(taskFlow.category);
      setTaskFlow((prev) => ({
        ...prev,
        subCategory,
        serviceNeeded: `${prev.categoryTitle} - ${subCategory}`,
        step: 'expert',
      }));

      try {
        navigate(`/experts?category=${taskFlow.category}`);
      } catch {}

      return {
        text: isBn
          ? `ডেলিভারেবল: **${subCategory}**। আমরা পেজে এক্সপার্ট ডিরেক্টরি ওপেন করেছি যাতে সরাসরি দেখতে পারেন। 'Gaenr Verified Match (অটো-ম্যাচ)' বেছে নিতে পারেন অথবা নিচের ভেরিফাইড এক্সপার্টদের থেকে নির্বাচন করুন:`
          : `Deliverable: **${subCategory}**. We've loaded the expert directory on page for direct viewing. You can choose 'Gaenr Verified Match (Auto)' or pick an eligible expert code:`,
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
          {
            label: isBn ? '🌐 এক্সপার্ট ডিরেক্টরি দেখুন (/experts)' : '🌐 View All Experts (/experts)',
            actionType: 'navigate',
            payload: `/experts?category=${taskFlow.category}`,
          },
        ],
      };
    }

    // Step 5b: Custom Sub-Category Deliverable
    if (taskFlow.step === 'custom_subcategory') {
      const isJunk =
        cleanText.length < 3 ||
        /^(asdf|qwerty|na|none|test|\?\?|\.\.)$/i.test(cleanText);
      if (isJunk) {
        return {
          text: isBn
            ? 'অনুগ্রহ করে কাজের ধরণ বা প্রয়োজনীয় সাব-ক্যাটাগরিটি আরেকটু স্পষ্ট করে লিখুন (যেমন: "কাস্টম ইলাস্ট্রেশন" বা "ইনভয়েস ডিজাইন"):'
            : 'Please specify a meaningful deliverable or sub-category name (e.g. "Custom Illustration" or "Invoice Design"):',
        };
      }

      const customSub = cleanText;
      const matchedExperts = getMatchedFreelancers(taskFlow.category);
      setTaskFlow((prev) => ({
        ...prev,
        subCategory: customSub,
        serviceNeeded: `${prev.categoryTitle} - ${customSub}`,
        step: 'expert',
      }));

      try {
        navigate(`/experts?category=${taskFlow.category}`);
      } catch {}

      return {
        text: isBn
          ? `কাস্টম ডেলিভারেবল: **${customSub}**। আমরা পেজে এক্সপার্টদের ডিরেক্টরি ওপেন করেছি। 'Gaenr Verified Match (অটো-ম্যাচ)' বেছে নিতে পারেন অথবা নিচের ভেরিফাইড এক্সপার্টদের মধ্য থেকে নির্বাচন করুন:`
          : `Custom Deliverable: **${customSub}**. We've loaded the category experts on page. Select 'Gaenr Verified Match (Auto)' or pick an expert code below:`,
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
          {
            label: isBn ? '🌐 এক্সপার্ট ডিরেক্টরি দেখুন (/experts)' : '🌐 View All Experts (/experts)',
            actionType: 'navigate',
            payload: `/experts?category=${taskFlow.category}`,
          },
        ],
      };
    }

    // Step 6: Expert Selection (Must map to approved expert or Auto-match)
    if (taskFlow.step === 'expert') {
      const verifiedExpertCode = matchApprovedExpert(cleanText, taskFlow.category, freelancers);
      if (!verifiedExpertCode) {
        const matchedExperts = getMatchedFreelancers(taskFlow.category);
        return {
          text: isBn
            ? `এই ক্যাটাগরিতে "${cleanText}" নামের কোনো তালিকাভুক্ত এক্সপার্ট পাওয়া যায়নি। অনুগ্রহ করে 'Gaenr Verified Match (অটো-ম্যাচ)' বেছে নিন অথবা নিচের ভেরিফাইড এক্সপার্টদের থেকে নির্বাচন করুন:`
            : `I couldn’t find an eligible expert named "${cleanText}" for this category. Would you like to select 'Gaenr Verified Match (Auto)' or pick from our verified experts below?`,
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
            {
              label: isBn ? '🌐 এক্সপার্ট ডিরেক্টরি দেখুন (/experts)' : '🌐 View All Experts (/experts)',
              actionType: 'navigate',
              payload: `/experts?category=${taskFlow.category}`,
            },
          ],
        };
      }

      setTaskFlow((prev) => ({ ...prev, expertCode: verifiedExpertCode, step: 'brief' }));
      return {
        text: isBn
          ? `মনোনীত এক্সপার্ট: **${verifiedExpertCode}**। এবার আপনার কাজের বিবরণ ও প্রয়োজনীয় রিকোয়ারমেন্টস (Brief) লিখুন:`
          : `Assigned Expert: **${verifiedExpertCode}**. Please provide any specific requirements, brief, or instructions for the project:`,
      };
    }

    // Step 8: Project Brief
    if (taskFlow.step === 'brief') {
      if (cleanText.length < 5) {
        return {
          text: isBn
            ? 'কাজের বিবরণটি একটু বিস্তারিত লিখুন যাতে এক্সপার্ট বুঝতে পারেন কী ডেলিভারি করতে হবে:'
            : 'Please provide a bit more detail for the project brief so the expert knows exactly what to deliver:',
        };
      }

      setTaskFlow((prev) => ({ ...prev, description: cleanText, step: 'deadline' }));
      return {
        text: isBn
          ? 'কাজটি কবে নাগাদ ডেলিভারি প্রয়োজন? নিচের অপশন থেকে বেছে নিন বা নির্দিষ্ট সময় লিখে দিন:'
          : 'What is your target deadline? Choose an option below or specify:',
        actions: [
          { label: '⚡ Rush (24-48 Hours)', actionType: 'selectTaskDeadline', payload: 'Rush (24-48 Hours)' },
          { label: '📅 3-5 Days', actionType: 'selectTaskDeadline', payload: '3-5 Days' },
          { label: '🗓️ 1 Week', actionType: 'selectTaskDeadline', payload: '1 Week' },
          { label: '✨ Flexible', actionType: 'selectTaskDeadline', payload: 'Flexible (3-5 Days)' },
        ],
      };
    }

    // Step 9: Target Deadline
    if (taskFlow.step === 'deadline') {
      const deadline = cleanText || 'Flexible (3-5 Days)';
      setTaskFlow((prev) => ({ ...prev, deadline, step: 'document' }));
      return {
        text: isBn
          ? 'কাজের কোনো রেফারেন্স ফাইল, Google Drive ফোল্ডার বা অ্যাসেট লিংক আছে কি? (না থাকলে নিচের Skip বাটনে ক্লিক করুন বা "নেই" লিখুন):'
          : 'Please provide a reference link, Google Drive folder, or brief document URL for the task (If none, click Skip below):',
        actions: [
          { label: isBn ? '⏩ Skip (নেই)' : '⏩ Skip (No reference link)', actionType: 'skipTaskDocument' },
        ],
      };
    }

    // Step 10: Reference Link / Document (URL Validation)
    if (taskFlow.step === 'document') {
      const isSkip = /^(skip|no|নেই|না|none|-|স্কিপ)$/i.test(cleanText);
      let docUrl: string | undefined = undefined;

      if (!isSkip) {
        if (!isValidHttpUrl(cleanText)) {
          return {
            text: isBn
              ? 'লিংকটি সঠিক URL মনে হচ্ছে না। অনুগ্রহ করে https:// দিয়ে শুরু হওয়া পূর্ণ লিংক দিন, অথবা কোনো লিংক না থাকলে নিচের Skip বাটনে ক্লিক করুন:'
              : 'That doesn’t appear to be a valid reference URL. Please paste the full link starting with https://, or click Skip below if you don’t have one:',
            actions: [
              { label: isBn ? '⏩ Skip (নেই)' : '⏩ Skip (No reference link)', actionType: 'skipTaskDocument' },
            ],
          };
        }
        docUrl = cleanText;
      }

      setTaskFlow((prev) => ({
        ...prev,
        documentUrl: docUrl,
        step: 'awaiting_confirmation',
      }));

      return showTaskSummaryPrompt({ ...taskFlow, documentUrl: docUrl }, isBn ? 'bn' : 'en');
    }

    // Step 11: Final Review & Confirmation Gate (Consent Checkpoint)
    if (taskFlow.step === 'awaiting_confirmation') {
      // 1. Explicit Cancel
      if (/^(cancel|stop|exit|বাতিল|বন্ধ)$/i.test(cleanText)) {
        setTaskFlow({
          active: false,
          step: 'idle',
          fullName: '',
          email: '',
          phone: '',
          whatsapp: '',
          serviceNeeded: '',
          category: 'graphics-design',
          categoryTitle: 'Graphics Design',
          subCategory: 'Logo & Brand Identity',
          expertCode: 'Gaenr Verified Match',
          description: '',
          deadline: 'Flexible (3-5 Days)',
        });
        return {
          text: isBn
            ? 'টাস্ক প্রক্রিয়াটি বাতিল করা হয়েছে। কোনো টাস্ক সাবমিট করা হয়নি। পরবর্তীতে প্রয়োজন হলে যেকোনো সময় আবার নতুন টাস্ক শুরু করতে পারেন।'
            : 'Understood. I’ve cancelled this submission. No task was submitted. If you want to continue later, you can start a new assignment.',
          actions: [
            { label: isBn ? 'সার্ভিসসমূহ' : 'Explore Services', actionType: 'navigate', payload: '/services' },
            { label: isBn ? 'হোয়াটসঅ্যাপ' : 'WhatsApp', actionType: 'openWhatsApp', payload: '01608922800' },
          ],
        };
      }

      // 2. Decline / Not yet
      if (/^(no|not yet|না|এখনো না|wait|থামো)$/i.test(cleanText)) {
        return {
          text: isBn
            ? 'সাবমিশন স্থগিত রয়েছে। আপনি কি কোনো তথ্য এডিট করতে চান নাকি অ্যাসাইনমেন্টটি বাতিল করতে চান?'
            : 'Submission paused. Would you like to edit any details, or cancel the assignment?',
          actions: [
            { label: isBn ? '✏️ Edit details' : '✏️ Edit details', actionType: 'editTaskDetails' },
            { label: isBn ? '❌ Cancel' : '❌ Cancel', actionType: 'cancelTaskFlow' },
          ],
        };
      }

      // 3. Edit request
      if (/^(edit|change|এডিট|পরিবর্তন)$/i.test(cleanText)) {
        setTaskFlow((prev) => ({ ...prev, step: 'editing_field' }));
        return {
          text: isBn
            ? 'কোন তথ্যটি পরিবর্তন করতে চান? নিচে থেকে সিলেক্ট করুন:'
            : 'Which detail would you like to edit? Please select below:',
          actions: [
            { label: isBn ? '👤 নাম' : '👤 Name', actionType: 'selectEditField', payload: 'name' },
            { label: isBn ? '📞 ফোন' : '📞 Phone', actionType: 'selectEditField', payload: 'phone' },
            { label: isBn ? '✉️ ইমেইল' : '✉️ Email', actionType: 'selectEditField', payload: 'email' },
            { label: isBn ? '🎨 ক্যাটাগরি' : '🎨 Category', actionType: 'selectEditField', payload: 'category' },
            { label: isBn ? '🧑‍💻 এক্সপার্ট' : '🧑‍💻 Expert', actionType: 'selectEditField', payload: 'expert' },
            { label: isBn ? '📝 বিবরণ' : '📝 Brief', actionType: 'selectEditField', payload: 'brief' },
            { label: isBn ? '⏰ ডেডলাইন' : '⏰ Deadline', actionType: 'selectEditField', payload: 'deadline' },
            { label: isBn ? '🔗 লিংক' : '🔗 Link', actionType: 'selectEditField', payload: 'document' },
          ],
        };
      }

      // 4. Explicit Affirmative Confirm
      if (/^(confirm|confirm and assign|yes|yes,?\s*submit|হ্যাঁ|হ্যা|নিশ্চিত|সম্মতি|submit|agree|done|i agree)/i.test(cleanText)) {
        return completeTaskFlow(taskFlow.documentUrl, lang);
      }

      // 5. Ambiguous or unclear response -> Prompt for clear decision, never submit
      return {
        text: isBn
          ? 'সাবমিট করার আগে আপনার স্পষ্ট সম্মতি নিশ্চিত করা প্রয়োজন। অনুগ্রহ করে "Confirm and assign", "Edit details", অথবা "Cancel" বেছে নিন:'
          : 'I want to make sure I have your permission before submitting. Please choose "Confirm and assign", "Edit details", or "Cancel":',
        actions: [
          {
            label: isBn ? '✅ Confirm and assign (নিশ্চিত ও সাবমিট)' : '✅ Confirm and assign',
            actionType: 'confirmTaskAgreement',
          },
          {
            label: isBn ? '✏️ Edit details (তথ্য পরিবর্তন)' : '✏️ Edit details',
            actionType: 'editTaskDetails',
          },
          {
            label: isBn ? '❌ Cancel (বাতিল)' : '❌ Cancel',
            actionType: 'cancelTaskFlow',
          },
        ],
      };
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
    } else if (cleaned.includes('[ACTION:ESCALATE_TO_WHATSAPP]')) {
      cleaned = cleaned.replace(/\[ACTION:ESCALATE_TO_WHATSAPP\]/g, '').trim();
    }

    return cleaned;
  };

  const handleSendMessage = async (textToSend?: string) => {
    // If voice listening is currently on, stop it immediately and capture pending speech transcript
    let pendingVoiceText = '';
    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {}
      setIsListening(false);
      pendingVoiceText = latestSpeechTranscriptRef.current.trim();
    }

    const text = (textToSend || inputValue || pendingVoiceText).trim();
    if (!text || isTyping) return;

    latestSpeechTranscriptRef.current = '';

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
              label: isBn ? '🤖 গিনির সহায়তায় শুরু করুন' : '🤖 Let Ginny guide me',
              actionType: 'startInChatTask',
            },
            {
              label: isBn ? '📋 নিজে ফর্ম পূরণ করুন' : '📋 Fill form myself',
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

      // Handle Ginny escalation to WhatsApp
      const hasEscalationTag = botResponseText.includes('[ACTION:ESCALATE_TO_WHATSAPP]');
      if (hasEscalationTag) {
        const escalationUrl = createWhatsAppUrl(
          buildGinnyEscalationNotification({
            userQuestion: text,
            detectedLanguage: detectedLang,
            userRole: updatedMemory?.userRole,
          })
        );
        const escalateBtn = {
          label: detectedLang === 'en' ? '📲 Ask Gaenr on WhatsApp' : '📲 হোয়াটসঅ্যাপে প্রশ্নটি জানান',
          actionType: 'openWhatsAppUrl' as const,
          payload: escalationUrl,
        };
        botActions = [escalateBtn, ...(botActions || [])];
      }

      // If unanswered or escalated, log to backend notify audit
      if (hasEscalationTag || botActions?.some((a) => a.actionType === 'openWhatsAppUrl' && a.payload?.includes('GINNY%20ESCALATION'))) {
        sendBackendNotification('ginny_unanswered_question', {
          userQuestion: text,
          language: detectedLang,
          userRole: updatedMemory?.userRole,
        }).catch(() => {});
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

      sendBackendNotification('ginny_unanswered_question', {
        userQuestion: text,
        language: detectedLang,
        error: String(error),
      }).catch(() => {});

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
              label: isBn ? '🤖 গিনির সহায়তায় শুরু করুন' : '🤖 Let Ginny guide me',
              actionType: 'startInChatTask',
            },
            {
              label: isBn ? '📋 নিজে ফর্ম পূরণ করুন' : '📋 Fill form myself',
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
        phone: '',
        whatsapp: '',
        serviceNeeded: '',
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
          ? 'আমি ধাপে ধাপে আপনার টাস্ক প্রস্তুত করতে সাহায্য করব। প্রয়োজনীয় তথ্য সংগ্রহ করে যাচাই করব এবং সাবমিট করার আগে সম্পূর্ণ সামারি দেখাব। প্রথমে আপনার নামটি (Full Name) বলুন?'
          : 'I\'ll help you prepare your task step-by-step. I\'ll collect the required details, validate them, and show you a complete summary before anything is submitted. First, what is your Full Name?',
        timestamp: getRealtimeClock(),
      };
      setMessages((prev) => [...prev, promptMsg]);
    } else if (action.actionType === 'selectTaskCategory' && action.payload) {
      const meta = matchApprovedCategory(action.payload) || { slug: 'graphics-design' as ServiceSlug, title: 'Graphics Design' };
      const subList = getSubCategories(meta.slug);
      setTaskFlow((prev) => ({
        ...prev,
        category: meta.slug,
        categoryTitle: meta.title,
        serviceNeeded: meta.title,
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
            ? `সার্ভিস: **${meta.title}**। এই সার্ভিসের কোন নির্দিষ্ট কাজটি করাতে চান? নিচে ক্লিক করুন বা অন্য কিছু হলে 'Other' বেছে নিন:`
            : `Service: **${meta.title}**. What specific deliverable do you need? Choose below or select 'Other':`,
          timestamp: getRealtimeClock(),
          actions: [
            ...subList.slice(0, 5).map((sub) => ({
              label: sub,
              actionType: 'selectTaskSubCategory' as const,
              payload: sub,
            })),
            {
              label: isBn ? '✨ Other / অন্যান্য' : '✨ Other / Custom',
              actionType: 'selectTaskSubCategory' as const,
              payload: 'Other',
            },
          ],
        },
      ]);
    } else if (action.actionType === 'selectTaskSubCategory' && action.payload) {
      const subCategory = action.payload;
      const isBn = language === 'bn';

      if (subCategory === 'Other') {
        setTaskFlow((prev) => ({
          ...prev,
          step: 'custom_subcategory',
        }));
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: isBn
              ? 'আপনি ঠিক কী ধরণের কাজ করাতে চাচ্ছেন? আপনার সাব-ক্যাটাগরি বা কাজের ধরনটি সংক্ষেপে লিখে জানান:'
              : 'What specific deliverable or custom task do you need? Please describe it below:',
            timestamp: getRealtimeClock(),
          },
        ]);
        return;
      }

      const matchedExperts = getMatchedFreelancers(taskFlow.category);
      setTaskFlow((prev) => ({
        ...prev,
        subCategory,
        serviceNeeded: `${prev.categoryTitle} - ${subCategory}`,
        step: 'expert',
      }));

      // Direct view to experts directory on main page
      try {
        navigate(`/experts?category=${taskFlow.category}`);
      } catch {}

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: isBn
            ? `ডেলিভারেবল: **${subCategory}**। আমরা পেজে এক্সপার্ট ডিরেক্টরি ওপেন করেছি যাতে সরাসরি দেখতে পারেন। গেইনার ভেরিফাইড অটো-ম্যাচ নিতে পারেন অথবা নির্দিষ্ট এক্সপার্ট কোড বেছে নিন:`
            : `Deliverable: **${subCategory}**. We've loaded the expert directory on page for direct viewing. Choose Gaenr Auto-Match or pick an Expert code:`,
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
            {
              label: isBn ? '🌐 এক্সপার্ট ডিরেক্টরি দেখুন (/experts)' : '🌐 View All Experts (/experts)',
              actionType: 'navigate',
              payload: `/experts?category=${taskFlow.category}`,
            },
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
            ? `মনোনীত এক্সপার্ট: **${expertCode}**। এবার আপনার কাজের সংক্ষিপ্ত বিবরণ ও প্রয়োজনীয় রিকোয়ারমেন্টস (Brief) লিখে দিন:`
            : `Assigned Expert: **${expertCode}**. Please provide any specific requirements, brief, or instructions for the project:`,
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
            ? 'কাজের কোনো রেফারেন্স ফাইল, Google Drive ফোল্ডার বা অ্যাসেট লিংক আছে কি? (না থাকলে নিচের Skip বাটনে ক্লিক করুন বা "নেই" লিখুন):'
            : 'Please provide a reference link, Google Drive folder, or brief document URL for the task (If none, click Skip below):',
          timestamp: getRealtimeClock(),
          actions: [
            { label: isBn ? '⏩ Skip (নেই)' : '⏩ Skip (No reference link)', actionType: 'skipTaskDocument' },
          ],
        },
      ]);
    } else if (action.actionType === 'skipTaskDocument') {
      const updated = {
        ...taskFlow,
        documentUrl: undefined,
        step: 'awaiting_confirmation' as const,
      };
      setTaskFlow(updated);
      const isBn = language === 'bn';
      const summaryMsg = showTaskSummaryPrompt(updated, language);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: summaryMsg.text,
          timestamp: getRealtimeClock(),
          actions: summaryMsg.actions,
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
    } else if (action.actionType === 'editTaskDetails') {
      setTaskFlow((prev) => ({ ...prev, step: 'editing_field' }));
      const isBn = language === 'bn';
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: isBn
            ? 'কোন তথ্যটি পরিবর্তন করতে চান? নিচে থেকে বেছে নিন:'
            : 'Which detail would you like to edit? Please select below:',
          timestamp: getRealtimeClock(),
          actions: [
            { label: isBn ? '👤 নাম' : '👤 Name', actionType: 'selectEditField', payload: 'name' },
            { label: isBn ? '📞 ফোন' : '📞 Phone', actionType: 'selectEditField', payload: 'phone' },
            { label: isBn ? '✉️ ইমেইল' : '✉️ Email', actionType: 'selectEditField', payload: 'email' },
            { label: isBn ? '🎨 ক্যাটাগরি' : '🎨 Category', actionType: 'selectEditField', payload: 'category' },
            { label: isBn ? '🧑‍💻 এক্সপার্ট' : '🧑‍💻 Expert', actionType: 'selectEditField', payload: 'expert' },
            { label: isBn ? '📝 বিবরণ' : '📝 Brief', actionType: 'selectEditField', payload: 'brief' },
            { label: isBn ? '⏰ ডেডলাইন' : '⏰ Deadline', actionType: 'selectEditField', payload: 'deadline' },
            { label: isBn ? '🔗 লিংক' : '🔗 Link', actionType: 'selectEditField', payload: 'document' },
          ],
        },
      ]);
    } else if (action.actionType === 'selectEditField' && action.payload) {
      const field = action.payload as any;
      setTaskFlow((prev) => ({ ...prev, step: 'editing_field', editField: field }));
      const isBn = language === 'bn';
      let promptText = '';
      let fieldActions: ChatMessage['actions'] = undefined;

      if (field === 'name') {
        promptText = isBn ? 'নতুন নামটি লিখুন (যেমন: রাফি আহমেদ বা Rafi Ahmed):' : 'Please enter the updated requester name:';
      } else if (field === 'phone') {
        promptText = isBn ? 'নতুন ফোন নম্বরটি দিন (যেমন: 01712345678):' : 'Please enter the updated phone number (e.g. 01712345678):';
      } else if (field === 'email') {
        promptText = isBn ? 'নতুন ইমেইল অ্যাড্রেসটি দিন (যেমন: name@example.com):' : 'Please enter the updated email address (e.g. name@example.com):';
      } else if (field === 'category') {
        promptText = isBn ? 'নতুন সার্ভিস ক্যাটাগরি বেছে নিন:' : 'Please choose the new service category:';
        fieldActions = [
          { label: '🎨 Graphics Design', actionType: 'selectTaskCategory', payload: 'graphics-design' },
          { label: '🎬 Video Editing', actionType: 'selectTaskCategory', payload: 'video-editing' },
          { label: '🌐 WordPress Website', actionType: 'selectTaskCategory', payload: 'wordpress-website' },
          { label: '✍️ Content Writing', actionType: 'selectTaskCategory', payload: 'content-writing' },
          { label: '📊 Slide Design', actionType: 'selectTaskCategory', payload: 'presentation-slide-design' },
          { label: '📱 UX/UI Design', actionType: 'selectTaskCategory', payload: 'ux-ui-design' },
          { label: '📢 Ad Campaign', actionType: 'selectTaskCategory', payload: 'ad-running' },
        ];
      } else if (field === 'expert') {
        promptText = isBn ? 'নতুন এক্সপার্ট বেছে নিন:' : 'Please select the preferred expert:';
        const matchedExperts = getMatchedFreelancers(taskFlow.category);
        fieldActions = [
          { label: '✨ Gaenr Verified Match (Auto)', actionType: 'selectTaskExpert', payload: 'Gaenr Verified Match' },
          ...matchedExperts.map((f) => ({ label: `👤 Expert #${f.code}`, actionType: 'selectTaskExpert' as const, payload: f.code })),
        ];
      } else if (field === 'brief') {
        promptText = isBn ? 'নতুন কাজের বিবরণ/ব্রিফ লিখুন:' : 'Please enter the updated project requirements/brief:';
      } else if (field === 'deadline') {
        promptText = isBn ? 'নতুন ডেডলাইন নির্বাচন করুন:' : 'Please choose the new target deadline:';
        fieldActions = [
          { label: '⚡ Rush (24-48 Hours)', actionType: 'selectTaskDeadline', payload: 'Rush (24-48 Hours)' },
          { label: '📅 3-5 Days', actionType: 'selectTaskDeadline', payload: '3-5 Days' },
          { label: '🗓️ 1 Week', actionType: 'selectTaskDeadline', payload: '1 Week' },
          { label: '✨ Flexible', actionType: 'selectTaskDeadline', payload: 'Flexible (3-5 Days)' },
        ];
      } else if (field === 'document') {
        promptText = isBn ? 'নতুন রেফারেন্স লিংক দিন (বা লিংক না থাকলে "নেই" লিখুন):' : 'Please enter the updated reference link (or write "none"):';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: promptText,
          timestamp: getRealtimeClock(),
          actions: fieldActions,
        },
      ]);
    } else if (action.actionType === 'cancelTaskFlow') {
      setTaskFlow({
        active: false,
        step: 'idle',
        fullName: '',
        email: '',
        phone: '',
        whatsapp: '',
        serviceNeeded: '',
        category: 'graphics-design',
        categoryTitle: 'Graphics Design',
        subCategory: 'Logo & Brand Identity',
        expertCode: 'Gaenr Verified Match',
        description: '',
        deadline: 'Flexible (3-5 Days)',
      });
      const isBn = language === 'bn';
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: isBn
            ? 'টাস্ক প্রক্রিয়াটি বাতিল করা হয়েছে। কোনো টাস্ক সাবমিট করা হয়নি। পরবর্তীতে প্রয়োজন হলে যেকোনো সময় আবার নতুন টাস্ক শুরু করতে পারেন।'
            : 'Understood. I’ve cancelled this submission. No task was submitted. If you want to continue later, you can start a new assignment.',
          timestamp: getRealtimeClock(),
          actions: [
            { label: isBn ? 'সার্ভিসসমূহ' : 'Explore Services', actionType: 'navigate', payload: '/services' },
            { label: isBn ? 'হোয়াটসঅ্যাপ' : 'WhatsApp', actionType: 'openWhatsApp', payload: '01608922800' },
          ],
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
          <>
            {/* Proactive Speech Bubble Popup (every 25s for 3s) */}
            <div
              onMouseEnter={() => setIsBubbleHovered(true)}
              onMouseLeave={() => {
                setIsBubbleHovered(false);
                setIsMessagePopupVisible(false);
              }}
              onClick={() => {
                setIsOpen(true);
                setIsMessagePopupVisible(false);
              }}
              role="dialog"
              aria-live="polite"
              className={`mb-2.5 sm:mb-3 max-w-[270px] sm:max-w-[290px] cursor-pointer select-none relative group/bubble transition-all duration-300 ease-out ${
                isMessagePopupVisible
                  ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                  : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
              }`}
            >
              {/* Bubble Card */}
              <div className="relative bg-white/95 dark:bg-[#0c162d]/95 backdrop-blur-md text-slate-800 dark:text-slate-100 px-3.5 py-2.5 rounded-2xl shadow-xl shadow-blue-900/10 dark:shadow-[0_12px_28px_rgba(0,0,0,0.6)] border border-slate-200/90 dark:border-blue-500/30 flex items-center gap-2.5 hover:border-blue-400 dark:hover:border-blue-400 transition-colors">
                {/* Mini Bot Avatar Badge */}
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#002868] to-[#0048ba] flex items-center justify-center shrink-0 border border-blue-300/40 shadow-xs">
                  <GaenrBotAvatar size={18} />
                </div>

                {/* Text Content */}
                <div className="text-left flex-1 min-w-0 pr-0.5">
                  <div className="text-[12px] font-bold text-slate-900 dark:text-white leading-tight flex items-center gap-1">
                    <span>Hi, I'm Ginny from Gaenr!</span>
                    <Sparkles className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-300 font-medium leading-tight mt-0.5">
                    Ask me anything.
                  </p>
                </div>

                {/* Dismiss Button (X) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMessagePopupVisible(false);
                  }}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 -mr-1 rounded-full transition-colors cursor-pointer"
                  aria-label="Dismiss message"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Speech Bubble Arrow / Caret pointing down to launcher button */}
              <div
                className="absolute -bottom-1.5 right-4 sm:right-5 w-3 h-3 bg-white/95 dark:bg-[#0c162d]/95 border-b border-r border-slate-200/90 dark:border-blue-500/30 rotate-45 transform pointer-events-none"
                aria-hidden="true"
              />
            </div>

            <button
              onClick={() => setIsOpen(true)}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              aria-label="Chat with Ginny"
              className={`group relative flex items-center bg-gradient-to-r from-[#006eff] to-[#004dc9] text-white rounded-full shadow-2xl hover:shadow-blue-500/35 border border-blue-400/40 cursor-pointer active:scale-95 transition-all duration-300 ease-out h-12 w-12 sm:h-13 sm:w-13 overflow-hidden px-2 hover:px-3.5 ${
                isJumping && !isHovered ? 'animate-ginny-jump shadow-[0_16px_32px_rgba(0,110,255,0.5)]' : ''
              }`}
              style={{
                width: isHovered ? 'auto' : undefined,
              }}
            >
              {/* Ambient Pulse Ring */}
              <span className="absolute -inset-1 rounded-full bg-blue-400/30 blur-sm group-hover:bg-blue-400/50 animate-pulse pointer-events-none" />

              {/* Custom Gaenr Butterfly AI Bot Avatar - High Contrast Royal Blue Disc */}
              <div className="relative w-8.5 h-8.5 rounded-full bg-gradient-to-tr from-[#002868] to-[#0048ba] flex items-center justify-center shrink-0 border border-blue-300/40 shadow-inner">
                <GaenrBotAvatar size={24} isFlapping={isJumping && !isHovered} />
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
          </>
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
                      ? language === 'bn'
                        ? '🎙️ শুনছি... বলুন বা Send বাটনে চাপুন...'
                        : '🎙️ Listening... Speak or hit Send...'
                      : taskFlow.active
                      ? language === 'bn'
                        ? 'উত্তর লিখুন বা অপশন বেছে নিন...'
                        : 'Type your answer or select an option...'
                      : language === 'bn'
                      ? 'যে কোনো প্রশ্ন করুন...'
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
                disabled={(!inputValue.trim() && !isListening) || isTyping}
                aria-label="Send message"
                title={isListening ? 'Send voice command now' : 'Send message'}
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
