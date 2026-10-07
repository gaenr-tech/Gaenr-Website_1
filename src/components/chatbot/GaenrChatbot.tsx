import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChatMessage,
  ChatLanguage,
  LearnedMemory,
  loadLearnedMemory,
  analyzeAndLearnFromMessage,
  clearLearnedMemory,
  getLocalAIResponse,
  queryGeminiAPI,
  getActiveGeminiApiKey,
} from './gaenrKnowledgeBase';
import { GaenrBotAvatar } from './GaenrBotAvatar';
import {
  Send,
  X,
  Sparkles,
  RotateCcw,
  Settings,
  ArrowRight,
  Phone,
  MessageCircle,
  ShieldCheck,
  Brain,
  Key,
  Trash2,
} from 'lucide-react';

const SUGGESTIONS_BN = [
  'কী কী সার্ভিস আছে?',
  'টাস্ক কীভাবে দেব?',
  'স্কিল ছাড়া কাজ পাব?',
  'মিরপুর অফিস ও ফোন নম্বর',
  'পেমেন্ট ও প্ল্যাটফর্ম চার্জ',
];

const SUGGESTIONS_EN = [
  'What services do you offer?',
  'How to assign a project task?',
  'Can I earn without skills?',
  'Mirpur office & contact info?',
  'Pricing & platform fee details?',
];

export const GaenrChatbot: React.FC = () => {
  const { navigate, openAssignTask, openApplyExpert, showToast, currentRoute, isAdminLoggedIn } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Settings visibility: ONLY accessible when inside backend operations/admin
  const isOperationsUser = Boolean(
    isAdminLoggedIn ||
    currentRoute.startsWith('/admin') ||
    currentRoute.startsWith('/operations') ||
    currentRoute.startsWith('/ops') ||
    currentRoute.startsWith('/manage')
  );

  // Language state: 'bn' (Default Bangla) or 'en' (English)
  const [language, setLanguage] = useState<ChatLanguage>(() => {
    try {
      const savedLang = localStorage.getItem('gaenr_chat_language') as ChatLanguage;
      if (savedLang === 'bn' || savedLang === 'en') return savedLang;
    } catch {}
    return 'bn';
  });

  // Adaptive memory state
  const [memory, setMemory] = useState<LearnedMemory>(() => loadLearnedMemory());

  const getInitialMessage = (lang: ChatLanguage): ChatMessage => ({
    id: 'welcome-1',
    sender: 'bot',
    text:
      lang === 'en'
        ? `Hi there! I'm here from the Gaenr team. How can I help with your project or inquiry today?`
        : `হ্যালো! আমি গেইনার টিম থেকে আছি। কোনো প্রজেক্ট করাতে চান নাকি কোনো তথ্য জানতে চান? বলুন কীভাবে সাহায্য করতে পারি।`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    actions: [
      {
        label: lang === 'en' ? 'Services' : 'সার্ভিসসমূহ',
        actionType: 'navigate',
        payload: '/services',
      },
      {
        label: lang === 'en' ? 'Assign Task' : 'টাস্ক দিন',
        actionType: 'openAssignModal',
      },
      {
        label: lang === 'en' ? 'WhatsApp' : 'হোয়াটসঅ্যাপ চ্যাট',
        actionType: 'openWhatsApp',
        payload: '01608922800',
      },
    ],
  });

  // Messages state
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('gaenr_chat_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [getInitialMessage(language)];
  });

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Gemini API Key (Loaded securely from .env, localStorage, or user settings)
  const [apiKey, setApiKey] = useState<string>(() => getActiveGeminiApiKey());
  const [tempApiKey, setTempApiKey] = useState(apiKey);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync language to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gaenr_chat_language', language);
    } catch {}
  }, [language]);

  // Sync messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gaenr_chat_history', JSON.stringify(messages.slice(-25)));
    } catch {}
  }, [messages]);

  // Auto-scroll to bottom
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom('auto');
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping]);

  const handleLanguageToggle = (newLang: ChatLanguage) => {
    setLanguage(newLang);
    showToast(newLang === 'bn' ? 'বাংলা ভাষা নির্বাচন করা হয়েছে' : 'Switched to English', 'info');
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

    // Continuous learning: analyze user's message and update adaptive memory
    const updatedMemory = analyzeAndLearnFromMessage(text, memory);
    setMemory(updatedMemory);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      let botResponseText = '';
      let botActions: ChatMessage['actions'] = undefined;

      const activeKey = apiKey.trim();

      // If API key is present, use live Gemini API with language and learned context
      if (activeKey) {
        try {
          botResponseText = await queryGeminiAPI(
            activeKey,
            messages.map((m) => ({ sender: m.sender, text: m.text })),
            text,
            language,
            updatedMemory
          );
        } catch (apiError) {
          console.warn('Gemini API call failed, using intelligent local engine:', apiError);
          const fallback = getLocalAIResponse(text, language, updatedMemory);
          botResponseText = fallback.text;
          botActions = fallback.actions;
        }
      } else {
        // Built-in intelligent local Gaenr knowledge engine
        await new Promise((resolve) => setTimeout(resolve, 500));
        const local = getLocalAIResponse(text, language, updatedMemory);
        botResponseText = local.text;
        botActions = local.actions;
      }

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: botActions,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const fallback = getLocalAIResponse(text, language, updatedMemory);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: fallback.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
    }
  };

  const handleClearChat = () => {
    setMessages([getInitialMessage(language)]);
    try {
      localStorage.removeItem('gaenr_chat_history');
    } catch {}
    showToast(language === 'en' ? 'Conversation reset' : 'চ্যাট রিসেট করা হয়েছে', 'info');
  };

  const handleClearMemory = () => {
    clearLearnedMemory();
    setMemory({
      userInteractionsCount: 0,
      interestedServices: [],
      notes: [],
      lastActive: new Date().toISOString(),
    });
    showToast(language === 'en' ? 'AI Memory reset successfully' : 'এআই মেমরি রিসেট করা হয়েছে', 'info');
  };

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = tempApiKey.trim();
    setApiKey(cleanKey);
    if (cleanKey) {
      localStorage.setItem('gaenr_gemini_api_key', cleanKey);
      showToast(language === 'en' ? 'Gemini API key saved! Live AI activated.' : 'জেমিনি এপিআই কি সেভ হয়েছে!', 'success');
    } else {
      localStorage.removeItem('gaenr_gemini_api_key');
      showToast(language === 'en' ? 'Using Built-in Knowledge Engine.' : 'বিল্ট-ইন নলেজ ইঞ্জিন সক্রিয়।', 'info');
    }
    setShowSettings(false);
  };

  // Format bold markdown and linebreaks
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
      <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-[100] flex flex-col items-end">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-label="Chat with Gaenr Team"
            className="group relative flex items-center bg-gradient-to-r from-[#006eff] to-[#004dc9] text-white rounded-full shadow-2xl hover:shadow-blue-500/35 border border-blue-400/40 cursor-pointer active:scale-95 transition-all duration-300 ease-out h-12 w-12 sm:h-13 sm:w-13 overflow-hidden px-2 hover:px-3.5"
            style={{
              width: isHovered ? 'auto' : undefined,
            }}
          >
            {/* Ambient Pulse Ring */}
            <span className="absolute -inset-1 rounded-full bg-blue-400/30 blur-sm group-hover:bg-blue-400/50 animate-pulse pointer-events-none" />

            {/* Custom Gaenr Butterfly Robot Avatar Core */}
            <div className="relative w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 border border-white/25">
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
                <div className="flex items-center gap-1 text-[11px] font-bold leading-tight">
                  <span>Gaenr</span>
                  <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                </div>
                <p className="text-[9.5px] text-blue-100 font-medium leading-none mt-0.5">
                  {language === 'en' ? 'Chat with us' : 'কথা বলুন'}
                </p>
              </div>
            </div>
          </button>
        )}

        {/* =========================================================================
            2. COMPACT CHATBOT WINDOW (Refined size, human presence, mobile ready)
           ========================================================================= */}
        {isOpen && (
          <div className="relative w-[calc(100vw-1.5rem)] xs:w-[335px] sm:w-[348px] h-[465px] sm:h-[490px] max-h-[80vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-250 select-text">
            
            {/* Header: Persona, Language Switcher, Operations-Only Settings, Close */}
            <div className="px-3.5 py-2.5 bg-gradient-to-r from-[#006eff] via-[#005cd4] to-[#0048ba] text-white flex items-center justify-between shrink-0 shadow-xs relative">
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shrink-0">
                  <GaenrBotAvatar size={24} />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-400 border-2 border-[#006eff] rounded-full" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-xs font-bold leading-tight">Gaenr Team</h2>
                    <span className="px-1 py-0.2 bg-white/20 rounded text-[8.5px] font-semibold text-emerald-300">
                      Active
                    </span>
                  </div>
                  <p className="text-[10px] text-blue-100 flex items-center gap-1 mt-0.5 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                    <span>{language === 'en' ? 'Talent Coordinator' : 'ট্যালেন্ট টিম অ্যাসিস্ট্যান্ট'}</span>
                  </p>
                </div>
              </div>

              {/* Language Switcher Pill & Control Buttons */}
              <div className="flex items-center gap-1">
                {/* Language Toggle: [বাংলা | EN] */}
                <div className="flex items-center bg-black/25 p-0.5 rounded-lg border border-white/20 text-[9.5px] font-bold">
                  <button
                    type="button"
                    onClick={() => handleLanguageToggle('bn')}
                    className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                      language === 'bn'
                        ? 'bg-white text-[#006eff] shadow-2xs font-extrabold'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    বাংলা
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLanguageToggle('en')}
                    className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                      language === 'en'
                        ? 'bg-white text-[#006eff] shadow-2xs font-extrabold'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    EN
                  </button>
                </div>

                {/* Operations Backend Only: Settings Toggle */}
                {isOperationsUser && (
                  <button
                    type="button"
                    onClick={() => setShowSettings(!showSettings)}
                    title="Operations API Settings"
                    className={`p-1 rounded-md transition-colors cursor-pointer ${
                      showSettings ? 'bg-white/25 text-white' : 'text-blue-100 hover:bg-white/15 hover:text-white'
                    }`}
                  >
                    <Settings className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Clear Chat */}
                <button
                  type="button"
                  onClick={handleClearChat}
                  title={language === 'en' ? 'Reset chat' : 'চ্যাট রিসেট'}
                  className="p-1 rounded-md text-blue-100 hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                {/* Close Window */}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title={language === 'en' ? 'Close' : 'বন্ধ করুন'}
                  className="p-1 rounded-md text-blue-100 hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Operations-Only Settings Drawer */}
              {isOperationsUser && showSettings && (
                <div className="absolute top-full left-0 right-0 bg-slate-900 text-slate-100 p-3.5 border-b border-slate-700 shadow-xl z-20 animate-in slide-in-from-top-2 duration-200 max-h-[340px] overflow-y-auto">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                      <Brain className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Operations Internal Settings</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowSettings(false)}
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Learned Memory Facts */}
                  <div className="p-2 bg-slate-800/90 rounded-lg border border-slate-700 space-y-1 text-[10.5px] mb-2.5">
                    <div className="flex items-center justify-between text-slate-300 font-semibold border-b border-slate-700/60 pb-1">
                      <span>Learned Facts:</span>
                      <span className="text-emerald-400 font-mono text-[9.5px]">
                        {memory.userInteractionsCount} interactions
                      </span>
                    </div>
                    {memory.userName && (
                      <p className="text-slate-200">
                        • Name: <span className="font-bold text-blue-300">{memory.userName}</span>
                      </p>
                    )}
                    {memory.userRole && (
                      <p className="text-slate-200">
                        • Role: <span className="capitalize font-bold text-amber-300">{memory.userRole}</span>
                      </p>
                    )}
                    {memory.interestedServices.length > 0 && (
                      <p className="text-slate-200">
                        • Services: {memory.interestedServices.join(', ')}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={handleClearMemory}
                      className="inline-flex items-center gap-1 text-[9.5px] text-rose-400 hover:text-rose-300 pt-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Reset Memory</span>
                    </button>
                  </div>

                  {/* Gemini API Key Config */}
                  <form onSubmit={handleSaveApiKey} className="space-y-2">
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-200">
                      <Key className="w-3.5 h-3.5 text-blue-400" />
                      <span>Google Gemini API Key</span>
                    </div>
                    <input
                      type="password"
                      placeholder="AIzaSy... or AQ..."
                      value={tempApiKey}
                      onChange={(e) => setTempApiKey(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                    />
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setTempApiKey('');
                          setApiKey('');
                          localStorage.removeItem('gaenr_gemini_api_key');
                          showToast('API key removed from browser storage', 'info');
                          setShowSettings(false);
                        }}
                        className="text-[10px] text-slate-400 hover:text-rose-400 underline cursor-pointer"
                      >
                        Clear Key
                      </button>
                      <button
                        type="submit"
                        className="px-2.5 py-1 bg-[#006eff] hover:bg-blue-600 text-white rounded-md text-xs font-semibold cursor-pointer transition-colors"
                      >
                        Save Key
                      </button>
                    </div>
                  </form>
                </div>
              )}
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
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mb-0.5 border border-blue-200/80 shadow-2xs">
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
                          <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                            {msg.actions.map((act, aIdx) => (
                              <button
                                key={aIdx}
                                type="button"
                                onClick={() => handleActionClick(act)}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50/80 hover:bg-blue-100/90 text-[#006eff] hover:text-[#005cd4] border border-blue-200/80 rounded-lg text-[10.5px] font-bold transition-all cursor-pointer active:scale-95 shadow-2xs"
                              >
                                {act.actionType === 'openWhatsApp' && <MessageCircle className="w-2.5 h-2.5 text-emerald-600" />}
                                {act.actionType === 'callPhone' && <Phone className="w-2.5 h-2.5 text-blue-600" />}
                                {act.actionType === 'openAssignModal' && <ShieldCheck className="w-2.5 h-2.5 text-[#006eff]" />}
                                {act.actionType === 'navigate' && <ArrowRight className="w-2.5 h-2.5 text-slate-500" />}
                                <span>{act.label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <span className="text-[9.5px] text-slate-400 font-mono px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-center gap-1.5 max-w-[85%] animate-in fade-in">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 border border-blue-200/80">
                    <GaenrBotAvatar size={18} />
                  </div>
                  <div className="px-3 py-2 bg-white border border-slate-200/80 rounded-2xl rounded-bl-xs shadow-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#006eff] animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#006eff] animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#006eff] animate-bounce" />
                    <span className="text-[10.5px] font-medium text-slate-500 ml-1">
                      {language === 'en' ? 'Writing...' : 'টাইপ করছে...'}
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Compact Quick Suggestion Chips (Few messages only) */}
            {messages.length <= 3 && (
              <div className="px-2.5 py-1.5 bg-slate-100/70 border-t border-slate-200/60 overflow-x-auto flex items-center gap-1.5 scrollbar-none shrink-0">
                {activeSuggestions.map((question, qIdx) => (
                  <button
                    key={qIdx}
                    type="button"
                    onClick={() => handleSendMessage(question)}
                    disabled={isTyping}
                    className="whitespace-nowrap px-2 py-0.8 bg-white hover:bg-blue-50 text-slate-700 hover:text-[#006eff] border border-slate-200 hover:border-blue-300 rounded-full text-[10px] font-medium transition-all shadow-2xs shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <div className="p-2.5 bg-white border-t border-slate-200 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-1.5"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={
                    language === 'en'
                      ? 'Type your message...'
                      : 'মেসেজ লিখুন...'
                  }
                  disabled={isTyping}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#006eff] focus:bg-white transition-all shadow-2xs"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="w-8.5 h-8.5 rounded-xl bg-[#006eff] hover:bg-[#005cd4] disabled:bg-slate-200 disabled:text-slate-400 text-white flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
              <div className="flex items-center justify-between text-[9.5px] text-slate-400 mt-1 px-1">
                <span>Gaenr Coordinator</span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  <span>Online</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
