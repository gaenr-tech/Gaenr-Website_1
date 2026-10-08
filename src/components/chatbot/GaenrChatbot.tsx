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
import { ServiceSlug } from '../../types';
import {
  Send,
  X,
  Sparkles,
  ArrowRight,
  Phone,
  MessageCircle,
  RotateCcw,
  Bot,
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
  step: 'idle' | 'name' | 'contact' | 'service' | 'brief' | 'deadline' | 'document';
  fullName: string;
  email: string;
  whatsapp: string;
  category: ServiceSlug;
  subCategory: string;
  description: string;
  deadline: string;
  documentUrl?: string;
}

export const GaenrChatbot: React.FC = () => {
  const { navigate, openAssignTask, openApplyExpert, submitTaskAssignment, showToast } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Dynamic language state: starts in English, automatically adapts to user's query
  const [language, setLanguage] = useState<ChatLanguage>('en');

  // Interactive step-by-step task flow state
  const [taskFlow, setTaskFlow] = useState<InChatTaskState>({
    active: false,
    step: 'idle',
    fullName: '',
    email: '',
    whatsapp: '',
    category: 'graphics-design',
    subCategory: 'Graphics Design',
    description: '',
    deadline: 'Flexible (3-5 Days)',
  });

  // Adaptive memory state
  const [memory, setMemory] = useState<LearnedMemory>(() => loadLearnedMemory());

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const apiKey = getActiveGeminiApiKey();

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
        ? `Hi, I'm Ginny from Gaenr. How can I help you today?`
        : `হ্যালো, আমি গেইনার থেকে গিনি (Ginny)। কীভাবে সাহায্য করতে পারি বলুন?`,
    timestamp: getRealtimeClock(),
    actions: [
      {
        label: lang === 'en' ? 'Assign a Task' : 'টাস্ক দিন',
        actionType: 'startInChatTask',
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
    setTaskFlow({
      active: false,
      step: 'idle',
      fullName: '',
      email: '',
      whatsapp: '',
      category: 'graphics-design',
      subCategory: 'Graphics Design',
      description: '',
      deadline: 'Flexible (3-5 Days)',
    });
    setMessages([getInitialMessage(language)]);
    showToast('Started new conversation', 'info');
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
      subCategory: taskFlow.subCategory,
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
      expertCode: 'Gaenr Verified Match',
      deadline: taskData.deadline,
      description: taskData.description,
      documentUrl: taskData.documentUrl,
      agreedAccuracy: true,
      agreedTerms: true,
      assignedVia: 'ginny_ai',
    });

    // 2. Format exact WhatsApp message matching AssignTaskModal
    const categoryTitle = taskData.subCategory;
    const resolvedExpert = 'Gaenr Verified Match (Auto Assignment)';
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
      subCategory: 'Graphics Design',
      description: '',
      deadline: 'Flexible (3-5 Days)',
    });

    // Auto open WhatsApp directly
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 700);

    return {
      text: isBn
        ? `✅ **টাস্ক সফলভাবে তৈরি হয়েছে! (রেফারেন্স: ${newTask.id})**\n\nপ্রজেক্টের তথ্য আমাদের সিস্টেমে যুক্ত হয়েছে। নিচের বাটনে ক্লিক করলেই প্রস্তুতকৃত প্রজেক্ট ব্রিফসহ হোয়াটসঅ্যাপে চলে যাবে—আপনার কাজ শুধু সেন্ড বাটনে ক্লিক করা:`
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
        subCategory: 'Graphics Design',
        description: '',
        deadline: 'Flexible (3-5 Days)',
      });
      return {
        text: isBn
          ? 'টাস্ক প্রসেসটি বাতিল করা হয়েছে। আর কীভাবে সাহায্য করতে পারি?'
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
      setTaskFlow((prev) => ({ ...prev, fullName, step: 'contact' }));
      return {
        text: isBn
          ? `ধন্যবাদ **${fullName}**! এবার আপনার WhatsApp নম্বর এবং Email অ্যাড্রেস দিন (যেমন: 01700000000, name@example.com):`
          : `Thank you **${fullName}**! Please provide your WhatsApp number and Email address (e.g. 01700000000, name@example.com):`,
      };
    }

    // Step 2: Contact Info
    if (taskFlow.step === 'contact') {
      const emailMatch = cleanText.match(/[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}/);
      const email = emailMatch ? emailMatch[0] : (taskFlow.email || 'client@gaenr.com');
      const phoneMatch = cleanText.match(/(?:\+?88)?01[3-9]\d{8}/) || cleanText.match(/\d{10,13}/);
      const whatsapp = phoneMatch ? phoneMatch[0] : cleanText.replace(emailMatch ? emailMatch[0] : '', '').trim();

      setTaskFlow((prev) => ({
        ...prev,
        whatsapp: whatsapp || cleanText,
        email,
        step: 'service',
      }));

      return {
        text: isBn
          ? 'আপনার প্রজেক্টটি কোন সার্ভিসের অন্তর্ভুক্ত? নিচের অপশন থেকে বেছে নিন বা টাইপ করুন:'
          : 'Which service category does your project belong to? Choose below or type it out:',
        actions: [
          { label: '🎨 Graphics Design', actionType: 'selectTaskCategory', payload: 'graphics-design' },
          { label: '🎬 Video Editing', actionType: 'selectTaskCategory', payload: 'video-editing' },
          { label: '🌐 WordPress Website', actionType: 'selectTaskCategory', payload: 'wordpress-website' },
          { label: '✍️ Content Writing', actionType: 'selectTaskCategory', payload: 'content-writing' },
          { label: '📊 Slide Design', actionType: 'selectTaskCategory', payload: 'presentation-slide' },
          { label: '📱 UX/UI Design', actionType: 'selectTaskCategory', payload: 'ux-ui-design' },
          { label: '📢 Ad Campaign', actionType: 'selectTaskCategory', payload: 'ad-campaign' },
        ],
      };
    }

    // Step 3: Service Category
    if (taskFlow.step === 'service') {
      const lower = cleanText.toLowerCase();
      let catSlug: ServiceSlug = 'graphics-design';
      let catName = 'Graphics Design';

      if (lower.includes('video') || lower.includes('ভিডিও')) {
        catSlug = 'video-editing';
        catName = 'Video Editing';
      } else if (lower.includes('web') || lower.includes('word') || lower.includes('সাইট') || lower.includes('site')) {
        catSlug = 'wordpress-website';
        catName = 'WordPress Website Design';
      } else if (lower.includes('content') || lower.includes('write') || lower.includes('লেখা')) {
        catSlug = 'content-writing';
        catName = 'Content Writing & Copy';
      } else if (lower.includes('slide') || lower.includes('presentation') || lower.includes('স্লাইড')) {
        catSlug = 'presentation-slide';
        catName = 'Presentation Slide Design';
      } else if (lower.includes('ui') || lower.includes('ux') || lower.includes('figma')) {
        catSlug = 'ux-ui-design';
        catName = 'UX/UI Design';
      } else if (lower.includes('ad') || lower.includes('boost') || lower.includes('বিজ্ঞাপন')) {
        catSlug = 'ad-campaign';
        catName = 'Ad Running & Campaign';
      }

      setTaskFlow((prev) => ({
        ...prev,
        category: catSlug,
        subCategory: catName,
        step: 'brief',
      }));

      return {
        text: isBn
          ? `সার্ভিস: **${catName}**। এবার প্রজেক্টের কাজের সংক্ষিপ্ত বিবরণ ও প্রয়োজনীয় রিকোয়ারমেন্টস (Brief) লিখুন:`
          : `Service: **${catName}**. Please describe your project requirements and brief:`,
      };
    }

    // Step 4: Project Brief
    if (taskFlow.step === 'brief') {
      const description = cleanText;
      setTaskFlow((prev) => ({ ...prev, description, step: 'deadline' }));
      return {
        text: isBn
          ? 'কাজটি কবে নাগাদ ডেলিভারি প্রয়োজন? (যেমন: ২-৩ দিন, ১ সপ্তাহ, জরুরি ইত্যাদি):'
          : 'What is your target deadline? (e.g. 2-3 days, 1 week, urgent, specific date):',
      };
    }

    // Step 5: Target Deadline
    if (taskFlow.step === 'deadline') {
      const deadline = cleanText || 'Flexible (3-5 Days)';
      setTaskFlow((prev) => ({ ...prev, deadline, step: 'document' }));
      return {
        text: isBn
          ? 'কাজের কোনো রেফারেন্স ফাইল বা ড্রাইভ লিংক আছে কি? (না থাকলে নিচের Skip বাটনে ক্লিক করুন বা "নেই" লিখুন):'
          : 'Do you have any reference document, Google Drive link, or asset URL? (If none, click Skip below):',
        actions: [
          { label: isBn ? '⏩ Skip (নেই)' : '⏩ Skip', actionType: 'skipTaskDocument' },
        ],
      };
    }

    // Step 6: Document Link & Finalize
    if (taskFlow.step === 'document') {
      const isSkip = /^(skip|no|নেই|না|none|-)$/i.test(cleanText);
      const documentUrl = isSkip ? undefined : cleanText;
      return completeTaskFlow(documentUrl, lang);
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

      // 2. Otherwise normal AI handling (Gemini or Local Knowledge)
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
    } else if (action.actionType === 'startInChatTask') {
      const isBn = language === 'bn';
      setTaskFlow({
        active: true,
        step: 'name',
        fullName: '',
        email: '',
        whatsapp: '',
        category: 'graphics-design',
        subCategory: 'Graphics Design',
        description: '',
        deadline: 'Flexible (3-5 Days)',
      });
      const promptMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: isBn
          ? 'অসাধারণ! প্রজেক্টটি শুরু করতে আপনার পূর্ণ নাম (Full Name) লিখুন:'
          : 'Great! To initiate the project, please provide your Full Name:',
        timestamp: getRealtimeClock(),
      };
      setMessages((prev) => [...prev, promptMsg]);
    } else if (action.actionType === 'selectTaskCategory' && action.payload) {
      const catMap: Record<string, { slug: ServiceSlug; label: string }> = {
        'graphics-design': { slug: 'graphics-design', label: 'Graphics Design' },
        'video-editing': { slug: 'video-editing', label: 'Video Editing' },
        'wordpress-website': { slug: 'wordpress-website', label: 'WordPress Website' },
        'content-writing': { slug: 'content-writing', label: 'Content Writing' },
        'presentation-slide': { slug: 'presentation-slide', label: 'Presentation Slide' },
        'ux-ui-design': { slug: 'ux-ui-design', label: 'UX/UI Design' },
        'ad-campaign': { slug: 'ad-campaign', label: 'Ad Campaign' },
      };
      const sel = catMap[action.payload] || { slug: 'graphics-design', label: 'Graphics Design' };
      setTaskFlow((prev) => ({
        ...prev,
        category: sel.slug,
        subCategory: sel.label,
        step: 'brief',
      }));
      const isBn = language === 'bn';
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: isBn
            ? `সার্ভিস: **${sel.label}**। এবার প্রজেক্টের কাজের সংক্ষিপ্ত বিবরণ ও প্রয়োজনীয় রিকোয়ারমেন্টস (Brief) লিখুন:`
            : `Selected Service: **${sel.label}**. Please describe your project requirements and brief:`,
          timestamp: getRealtimeClock(),
        },
      ]);
    } else if (action.actionType === 'skipTaskDocument') {
      const resp = completeTaskFlow(undefined, language);
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

            {/* Input Box Footer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-2.5 bg-white border-t border-slate-200/80 flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  taskFlow.active
                    ? 'Type your answer or brief...'
                    : language === 'en'
                    ? 'Ask Ginny or type in Bangla...'
                    : 'গিনিকে কিছু জিজ্ঞেস করুন...'
                }
                className="flex-1 bg-slate-50 border border-slate-200/90 rounded-2xl px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006eff]/20 focus:border-[#006eff] transition-all"
                disabled={isTyping}
              />
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
