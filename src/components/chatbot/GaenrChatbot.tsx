import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChatMessage,
  getLocalAIResponse,
  queryGeminiAPI,
} from './gaenrKnowledgeBase';
import {
  Bot,
  Send,
  X,
  Sparkles,
  RotateCcw,
  Settings,
  ChevronDown,
  ArrowRight,
  Phone,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Check,
  Key,
} from 'lucide-react';

const INITIAL_WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome-1',
  sender: 'bot',
  text: `👋 **স্বাগতম! আমি Gaenr AI সহকারী।**\n\nগেইনারের ৭টি সার্ভিস, দক্ষ এক্সপার্ট হায়ার করা, প্রজেক্ট ডেলিভারি, অথবা আউটসোর্সার হিসেবে রেজিস্ট্রেশন নিয়ে আপনার যেকোনো তথ্যে আমি সাহায্য করতে পারি।\n\nআপনি কী বিষয়ে জানতে চান?`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  actions: [
    { label: 'আমাদের সার্ভিসসমূহ', actionType: 'navigate', payload: '/services' },
    { label: 'টাস্ক অ্যাসাইন করুন', actionType: 'openAssignModal' },
    { label: 'হোয়াটসঅ্যাপে চ্যাট', actionType: 'openWhatsApp', payload: '01608922800' },
  ],
};

const SUGGESTED_QUESTIONS = [
  'কী কী সার্ভিস অফার করা হয়?',
  'গেইনারে টাস্ক বা কাজ দেওয়ার নিয়ম?',
  'আউটসোর্সার হিসেবে কীভাবে জয়েন করব?',
  'মিরপুর অফিস ও ফোন নাম্বার কী?',
  'পেমেন্ট ও প্ল্যাটফর্ম ফি কত?',
];

export const GaenrChatbot: React.FC = () => {
  const { navigate, openAssignTask, openApplyExpert, showToast } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('gaenr_chat_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [INITIAL_WELCOME_MESSAGE];
  });
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Gemini API Key (from env or custom localStorage)
  const envApiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (import.meta as any).env?.GEMINI_API_KEY || '';
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('gaenr_gemini_api_key') || envApiKey;
  });
  const [tempApiKey, setTempApiKey] = useState(apiKey);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Save messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gaenr_chat_history', JSON.stringify(messages.slice(-30)));
    } catch {}
  }, [messages]);

  // Scroll to bottom
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

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

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

      // If an API key is available, attempt live Gemini query
      if (activeKey) {
        try {
          botResponseText = await queryGeminiAPI(
            activeKey,
            messages.map((m) => ({ sender: m.sender, text: m.text })),
            text
          );
        } catch (apiError) {
          console.warn('Gemini API call failed, falling back to local Gaenr knowledge engine:', apiError);
          const fallback = getLocalAIResponse(text);
          botResponseText = fallback.text;
          botActions = fallback.actions;
        }
      } else {
        // Built-in intelligent local Gaenr knowledge engine (instant, zero lag, reliable)
        await new Promise((resolve) => setTimeout(resolve, 600)); // slight natural typing effect
        const local = getLocalAIResponse(text);
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
      const fallback = getLocalAIResponse(text);
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
    setMessages([INITIAL_WELCOME_MESSAGE]);
    try {
      localStorage.removeItem('gaenr_chat_history');
    } catch {}
    showToast('Chat history cleared', 'info');
  };

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = tempApiKey.trim();
    setApiKey(cleanKey);
    if (cleanKey) {
      localStorage.setItem('gaenr_gemini_api_key', cleanKey);
      showToast('Gemini API key saved! Live AI activated.', 'success');
    } else {
      localStorage.removeItem('gaenr_gemini_api_key');
      showToast('Using Gaenr Built-in Knowledge Engine.', 'info');
    }
    setShowSettings(false);
  };

  // Basic markdown-like renderer for bold and line breaks
  const formatMessageText = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, i) => {
      // Split bold segments **text**
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

  return (
    <>
      {/* =========================================================================
          1. FLOATING CHATBOT LAUNCHER BUTTON (Lower Right Corner)
         ========================================================================= */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[100] flex flex-col items-end">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Chat with Gaenr AI"
            className="group relative flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-3.5 bg-gradient-to-r from-[#006eff] to-[#0051cc] text-white rounded-full shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border border-blue-400/40"
          >
            {/* Subtle Pulse Halo */}
            <span className="absolute -inset-1 rounded-full bg-blue-400/30 blur-sm group-hover:bg-blue-400/50 animate-pulse pointer-events-none" />

            {/* Glowing Bot Icon */}
            <div className="relative w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0 border border-white/20">
              <Bot className="w-5 h-5 text-white" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#006eff] rounded-full animate-ping" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#006eff] rounded-full" />
            </div>

            {/* Button Label */}
            <div className="relative text-left hidden xs:block sm:block pr-1">
              <div className="flex items-center gap-1.5 text-xs font-bold leading-none tracking-tight">
                <span>Gaenr AI</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              </div>
              <p className="text-[10px] text-blue-100/90 font-medium mt-0.5">Ask questions • 24/7</p>
            </div>
          </button>
        )}

        {/* =========================================================================
            2. CHATBOT WINDOW (Lower Right Corner Modal / Card)
           ========================================================================= */}
        {isOpen && (
          <div className="relative w-[calc(100vw-2rem)] xs:w-[380px] sm:w-[410px] h-[560px] sm:h-[600px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300 select-text">
            
            {/* Window Header */}
            <div className="px-4 py-3.5 bg-gradient-to-r from-[#006eff] via-[#005cd4] to-[#0048ba] text-white flex items-center justify-between shrink-0 shadow-xs relative">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#006eff] rounded-full" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-sm font-bold leading-tight">Gaenr AI Assistant</h2>
                    <span className="px-1.5 py-0.5 bg-white/20 rounded-md text-[9px] font-semibold text-white/95">
                      {apiKey.trim() ? 'Gemini AI' : 'Instant AI'}
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-100 flex items-center gap-1.5 mt-0.5 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                    <span>Active • Managed Platform</span>
                  </p>
                </div>
              </div>

              {/* Header Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowSettings(!showSettings)}
                  title="Configure AI API Key"
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    showSettings ? 'bg-white/25 text-white' : 'text-blue-100 hover:bg-white/15 hover:text-white'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleClearChat}
                  title="Clear conversation"
                  className="p-1.5 rounded-lg text-blue-100 hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                  className="p-1.5 rounded-lg text-blue-100 hover:bg-white/15 hover:text-white transition-colors cursor-pointer ml-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Optional Settings Drawer inside Header */}
              {showSettings && (
                <div className="absolute top-full left-0 right-0 bg-slate-900 text-slate-100 p-4 border-b border-slate-700 shadow-xl z-20 animate-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                      <Key className="w-3.5 h-3.5 text-blue-400" />
                      <span>Gemini API Key (Optional)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowSettings(false)}
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug mb-3">
                    গেইনারের বিল্ট-ইন নলেজ ইঞ্জিন কোনো কি (Key) ছাড়াই তাৎক্ষণিক কাজ করে। লাইভ গুগল জেমিনি ২.০ ফ্ল্যাশ মডেল যুক্ত করতে আপনার Google AI Studio API Key দিন:
                  </p>
                  <form onSubmit={handleSaveApiKey} className="space-y-2">
                    <input
                      type="password"
                      placeholder="AIzaSy..."
                      value={tempApiKey}
                      onChange={(e) => setTempApiKey(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                    />
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setTempApiKey('');
                          setApiKey('');
                          localStorage.removeItem('gaenr_gemini_api_key');
                          showToast('Reset to built-in knowledge base', 'info');
                          setShowSettings(false);
                        }}
                        className="text-[11px] text-slate-400 hover:text-rose-400 underline cursor-pointer"
                      >
                        Reset / Remove Key
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 bg-[#006eff] hover:bg-blue-600 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                      >
                        Save Key
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/70 scroll-smooth">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
                  >
                    <div className="flex items-end gap-2 max-w-[88%]">
                      {!isUser && (
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-[#006eff] flex items-center justify-center shrink-0 mb-1 border border-blue-200/80 shadow-2xs">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}

                      <div
                        className={`p-3.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-xs ${
                          isUser
                            ? 'bg-[#006eff] text-white rounded-br-xs font-medium'
                            : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                        }`}
                      >
                        {formatMessageText(msg.text)}

                        {/* Interactive Action Chips */}
                        {!isUser && msg.actions && msg.actions.length > 0 && (
                          <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5">
                            {msg.actions.map((act, aIdx) => (
                              <button
                                key={aIdx}
                                type="button"
                                onClick={() => handleActionClick(act)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-50/80 hover:bg-blue-100/90 text-[#006eff] hover:text-[#005cd4] border border-blue-200/80 rounded-lg text-[11px] font-bold transition-all cursor-pointer active:scale-95 shadow-2xs"
                              >
                                {act.actionType === 'openWhatsApp' && <MessageCircle className="w-3 h-3 text-emerald-600" />}
                                {act.actionType === 'callPhone' && <Phone className="w-3 h-3 text-blue-600" />}
                                {act.actionType === 'openAssignModal' && <ShieldCheck className="w-3 h-3 text-[#006eff]" />}
                                {act.actionType === 'navigate' && <ArrowRight className="w-3 h-3 text-slate-500" />}
                                <span>{act.label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}

              {/* Bot Typing Indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 max-w-[85%] animate-in fade-in">
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-[#006eff] flex items-center justify-center shrink-0 border border-blue-200/80">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-3 bg-white border border-slate-200/80 rounded-2xl rounded-bl-xs shadow-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#006eff] animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 rounded-full bg-[#006eff] animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 rounded-full bg-[#006eff] animate-bounce" />
                    <span className="text-[11px] font-semibold text-slate-500 ml-1">উত্তর তৈরি হচ্ছে...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Pills (if few messages) */}
            {messages.length <= 4 && (
              <div className="px-3 py-2 bg-slate-100/70 border-t border-slate-200/60 overflow-x-auto flex items-center gap-1.5 scrollbar-none shrink-0">
                {SUGGESTED_QUESTIONS.map((question, qIdx) => (
                  <button
                    key={qIdx}
                    type="button"
                    onClick={() => handleSendMessage(question)}
                    disabled={isTyping}
                    className="whitespace-nowrap px-2.5 py-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-[#006eff] border border-slate-200 hover:border-blue-300 rounded-full text-[11px] font-medium transition-all shadow-2xs shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            {/* Input Footer Bar */}
            <div className="p-3 bg-white border-t border-slate-200 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything... / প্রশ্ন করুন..."
                  disabled={isTyping}
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#006eff] focus:bg-white transition-all shadow-2xs"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="w-10 h-10 rounded-2xl bg-[#006eff] hover:bg-[#005cd4] disabled:bg-slate-200 disabled:text-slate-400 text-white flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 px-1">
                <span>GAENR Managed Talent AI</span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  <span>Always active</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
