import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Check,
  Laptop,
  ShieldCheck,
  Landmark,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Zap,
  Sparkles,
  Clock,
  MessageSquare,
  Award,
  Send,
  CheckCircle2,
} from 'lucide-react';

export const JoinAsExpertPage: React.FC = () => {
  const { openApplyExpert, navigate } = useApp();

  // Carousel Active Index (0: Why Join, 1: What We Expect, 2: How to get payment, 3: How It Works)
  const [currentIndex, setCurrentIndex] = useState(0);

  // Direct link listener for #how-to-get-payment / #payment-procedure from Footer or direct URLs
  useEffect(() => {
    const handleSlideSelect = (e: Event) => {
      const customEvent = e as CustomEvent<{ slideIndex: number }>;
      if (customEvent.detail && typeof customEvent.detail.slideIndex === 'number') {
        setCurrentIndex(customEvent.detail.slideIndex);
        const timer = setTimeout(() => {
          const el = document.getElementById('how-to-get-payment');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
        return () => clearTimeout(timer);
      }
    };

    const handleHash = () => {
      if (
        typeof window !== 'undefined' &&
        (window.location.hash === '#how-to-get-payment' || window.location.hash === '#payment-procedure')
      ) {
        setCurrentIndex(2); // Slide index 2 is "How to get payment"
        const timer = setTimeout(() => {
          const el = document.getElementById('how-to-get-payment');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 150);
        return () => clearTimeout(timer);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    window.addEventListener('select-expert-slide', handleSlideSelect);
    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('select-expert-slide', handleSlideSelect);
    };
  }, []);

  // Touch swipe support
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const totalCards = 4;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalCards);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalCards) % totalCards);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) {
      handleNext();
    } else if (distance < -50) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Helper to render card content with modern, eye-pleasing, polished SaaS UI
  const renderCardContent = (index: number) => {
    switch (index) {
      case 0:
        return (
          <div className="w-full h-full flex flex-col justify-between text-slate-800">
            {/* Header */}
            <div className="text-center pb-2 border-b border-blue-100/60">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#006eff] text-[10px] font-bold tracking-wide uppercase border border-blue-200/50">
                <Sparkles className="w-3 h-3 text-[#006eff]" /> Direct Tasks
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mt-1">
                Why Join GAENR
              </h2>
            </div>

            {/* List */}
            <div className="space-y-2.5 sm:space-y-3 my-auto py-2">
              <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300 hover:shadow-xs transition-all duration-200 group shadow-2xs">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-blue-500 to-[#006eff] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Briefcase className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <div className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight group-hover:text-[#006eff] transition-colors">
                    Real Projects
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500 leading-tight mt-0.5">
                    Direct tasks with zero bidding or proposal wars
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-300 hover:shadow-xs transition-all duration-200 group shadow-2xs">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <div className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight group-hover:text-emerald-600 transition-colors">
                    Fair Payment
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500 leading-tight mt-0.5">
                    100% Escrow protected with timely milestone payouts
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl bg-white border border-slate-200/80 hover:border-purple-300 hover:shadow-xs transition-all duration-200 group shadow-2xs">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Zap className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <div className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight group-hover:text-purple-600 transition-colors">
                    Simple Process
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500 leading-tight mt-0.5">
                    Clear project briefs & coordinated workflows
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom status badge */}
            <div className="text-center pt-1 border-t border-slate-100">
              <span className="text-[10px] font-medium text-slate-400">
                Verified Expert Community
              </span>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="w-full h-full flex flex-col justify-between text-slate-800">
            {/* Header */}
            <div className="text-center pb-2 border-b border-blue-100/60">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 text-[#006eff] text-[10px] font-bold tracking-wide uppercase border border-sky-200/50">
                <Award className="w-3 h-3 text-[#006eff]" /> High Standards
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mt-1">
                What We Expect
              </h2>
            </div>

            {/* List */}
            <div className="space-y-2.5 sm:space-y-3 my-auto py-2">
              <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300 hover:shadow-xs transition-all duration-200 group shadow-2xs">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <MessageSquare className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <div className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight group-hover:text-[#006eff] transition-colors">
                    Clear Communication
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500 leading-tight mt-0.5">
                    Fast, polite & transparent updates to clients
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl bg-white border border-slate-200/80 hover:border-amber-300 hover:shadow-xs transition-all duration-200 group shadow-2xs">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Clock className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <div className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight group-hover:text-amber-600 transition-colors">
                    On-time Delivery
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500 leading-tight mt-0.5">
                    Strict adherence to agreed milestone timelines
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-300 hover:shadow-xs transition-all duration-200 group shadow-2xs">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <div className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight group-hover:text-emerald-600 transition-colors">
                    Quality Work
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500 leading-tight mt-0.5">
                    Original, creative & brief-tailored deliverables
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom status badge */}
            <div className="text-center pt-1 border-t border-slate-100">
              <span className="text-[10px] font-medium text-slate-400">
                Professional Work Ethic
              </span>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="w-full h-full flex flex-col justify-between text-slate-800">
            {/* Header */}
            <div className="text-center pb-2 border-b border-blue-100/60">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold tracking-wide uppercase border border-emerald-200/50">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Escrow Security
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mt-1">
                How to get payment
              </h2>
            </div>

            {/* Stepper Timeline */}
            <div className="relative space-y-2.5 sm:space-y-3 my-auto py-1 pl-1">
              {/* Connecting line */}
              <div className="absolute left-[18px] sm:left-[20px] top-3.5 bottom-3.5 w-0.5 bg-blue-200" />

              <div className="relative flex items-center gap-3 p-2 sm:p-2.5 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300 transition-all z-10 shadow-2xs">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-50 border border-blue-200 text-[#006eff] flex items-center justify-center shadow-2xs shrink-0">
                  <Laptop className="w-3.5 h-3.5 stroke-[2.2]" />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <div className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight">
                    Get Task
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500 leading-tight mt-0.5">
                    Client funds deposited into Escrow before kick-off
                  </div>
                </div>
              </div>

              <div className="relative flex items-center gap-3 p-2 sm:p-2.5 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300 transition-all z-10 shadow-2xs">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-50 border border-blue-200 text-[#006eff] flex items-center justify-center shadow-2xs shrink-0 text-[10px] font-bold font-mono">
                  100%
                </div>
                <div className="text-left min-w-0 flex-1">
                  <div className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight">
                    Complete Work
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500 leading-tight mt-0.5">
                    Execute tasks matching project specifications
                  </div>
                </div>
              </div>

              <div className="relative flex items-center gap-3 p-2 sm:p-2.5 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300 transition-all z-10 shadow-2xs">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-50 border border-blue-200 text-[#006eff] flex items-center justify-center shadow-2xs shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <div className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight">
                    Client Approval
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500 leading-tight mt-0.5">
                    Quick client sign-off or automated release
                  </div>
                </div>
              </div>

              <div className="relative flex items-center gap-3 p-2 sm:p-2.5 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300 transition-all z-10 shadow-2xs">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shadow-2xs shrink-0">
                  <Landmark className="w-3.5 h-3.5 stroke-[2.2]" />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <div className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight text-emerald-700">
                    Get Paid
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500 leading-tight mt-0.5">
                    Direct withdrawal via bKash / Nagad / Bank
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom status badge */}
            <div className="text-center pt-1 border-t border-slate-100">
              <span className="text-[10px] font-medium text-slate-400">
                Zero Risk Escrow Guarantee
              </span>
            </div>
          </div>
        );

      case 3:
      default:
        return (
          <div className="w-full h-full flex flex-col justify-between text-slate-800">
            {/* Header */}
            <div className="text-center pb-2 border-b border-blue-100/60">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold tracking-wide uppercase border border-indigo-200/50">
                <Send className="w-3 h-3 text-indigo-600" /> Onboarding Flow
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mt-1">
                How It Works
              </h2>
            </div>

            {/* Stepper Timeline */}
            <div className="relative space-y-2.5 sm:space-y-3 my-auto py-1 pl-1">
              {/* Connecting line */}
              <div className="absolute left-[18px] sm:left-[20px] top-3.5 bottom-3.5 w-0.5 bg-blue-200" />

              <div className="relative flex items-center gap-3 p-2 sm:p-2.5 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300 transition-all z-10 shadow-2xs">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-50 border border-blue-200 text-[#006eff] flex items-center justify-center shadow-2xs shrink-0 text-xs font-bold">
                  1
                </div>
                <div className="text-left min-w-0 flex-1">
                  <div className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight">
                    Apply Online
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500 leading-tight mt-0.5">
                    Submit your details and portfolio link
                  </div>
                </div>
              </div>

              <div className="relative flex items-center gap-3 p-2 sm:p-2.5 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300 transition-all z-10 shadow-2xs">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center shadow-2xs shrink-0 text-xs font-bold">
                  2
                </div>
                <div className="text-left min-w-0 flex-1">
                  <div className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight">
                    Get Reviewed
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500 leading-tight mt-0.5">
                    Evaluation team evaluates your sample quality
                  </div>
                </div>
              </div>

              <div className="relative flex items-center gap-3 p-2 sm:p-2.5 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300 transition-all z-10 shadow-2xs">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shadow-2xs shrink-0 text-xs font-bold">
                  3
                </div>
                <div className="text-left min-w-0 flex-1">
                  <div className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight">
                    Get Selected
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500 leading-tight mt-0.5">
                    Verified expert directory status awarded
                  </div>
                </div>
              </div>

              <div className="relative flex items-center gap-3 p-2 sm:p-2.5 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300 transition-all z-10 shadow-2xs">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shadow-2xs shrink-0 text-xs font-bold">
                  4
                </div>
                <div className="text-left min-w-0 flex-1">
                  <div className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight text-emerald-700">
                    Start Working
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500 leading-tight mt-0.5">
                    Direct matched client tasks & paid assignments
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom status badge */}
            <div className="text-center pt-1 border-t border-slate-100">
              <span className="text-[10px] font-medium text-slate-400">
                Fast 48-Hour Review
              </span>
            </div>
          </div>
        );
    }
  };

  const prevIndex = (currentIndex - 1 + totalCards) % totalCards;
  const nextIndex = (currentIndex + 1) % totalCards;

  return (
    <div className="min-h-screen bg-white text-slate-800 antialiased space-y-8 sm:space-y-12 pb-20 overflow-x-hidden">
      {/* =========================================================================
          HERO BANNER: Exactly matching other pages (Services / About Us)
          - Deep brand blue gradient: from-[#0048ba] via-[#006eff] to-[#003d99]
          - Soft glowing ambient color clouds
          - Artistic layered flowing waves SVG
          - Exact same user-facing content (Breadcrumb, Single-line title, Subtitle)
         ========================================================================= */}
      <section className="relative w-full bg-gradient-to-br from-[#0048ba] via-[#006eff] to-[#003d99] py-12 sm:py-16 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        {/* Soft Glowing Ambient Color Clouds */}
        <div className="absolute -top-24 -left-20 w-96 h-96 bg-cyan-400/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-20 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-44 bg-sky-200/15 rounded-full blur-2xl pointer-events-none" />

        {/* Artistic Layered Flowing Waves SVG */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-40 mix-blend-screen"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="expert-artistic-wave-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#818cf8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id="expert-artistic-wave-2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#006eff" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="expert-artistic-wave-3" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path fill="url(#expert-artistic-wave-1)" d="M0,128L60,144C120,160,240,192,360,181.3C480,171,600,117,720,117.3C840,117,960,171,1080,181.3C1200,192,1320,160,1380,144L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
          <path fill="url(#expert-artistic-wave-2)" d="M0,64L48,96C96,128,192,192,288,208C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,181.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          <path fill="url(#expert-artistic-wave-3)" d="M0,224L60,208C120,192,240,160,360,165.3C480,171,600,213,720,202.7C840,192,960,128,1080,112C1200,96,1320,128,1380,144L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
        </svg>

        <article className="relative z-10 max-w-4xl mx-auto flex flex-col items-center justify-center px-2">
          {/* White box breadcrumb badge on top of blue header */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white shadow-xs text-[11px] sm:text-xs font-semibold mb-2.5 sm:mb-3 border border-white/80">
            <button
              onClick={() => navigate('/')}
              className="text-slate-600 hover:text-[#006eff] transition-colors cursor-pointer"
            >
              Home
            </button>
            <span className="text-slate-400 font-bold select-none">&gt;&gt;</span>
            <span className="text-slate-900 font-bold">Join as Expert</span>
          </div>

          {/* Main Headline: Single Line on Desktop, responsive wrap on mobile */}
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-[27px] font-bold text-white tracking-tight sm:whitespace-nowrap text-center drop-shadow-xs leading-snug sm:leading-normal">
            Turn your skills into real opportunities.
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-white/90 font-normal leading-relaxed text-center mt-1.5 max-w-md sm:max-w-xl">
            No bidding. Fair opportunities. Secure payments.
          </p>
        </article>
      </section>

      {/* =========================================================================
          SLIDER CAROUSEL: Fully all-device friendly, no text clipping
          - Responsive card widths and auto-heights
          - Peeking side cards on tablet/desktop
          - Swipe and arrow controls on mobile
         ========================================================================= */}
      <section id="how-to-get-payment" className="relative w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 scroll-mt-24">
        <div
          className="relative flex items-center justify-center gap-3 sm:gap-6 md:gap-8 py-2 select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* LEFT PEEK CARD (Previous Slide, desktop/tablet only) */}
          <div
            onClick={handlePrev}
            aria-label="Previous Card"
            className="hidden md:block shrink-0 w-[260px] lg:w-[310px] min-h-[390px] sm:min-h-[420px] rounded-[28px] bg-[#f8fbfe] border border-slate-200/90 opacity-45 hover:opacity-75 transition-all duration-300 transform scale-95 cursor-pointer overflow-hidden shadow-2xs p-4 sm:p-5 flex flex-col justify-between"
          >
            {renderCardContent(prevIndex)}
          </div>

          {/* CENTER ACTIVE CARD (All devices) */}
          <div className="shrink-0 w-full max-w-[350px] sm:max-w-[390px] md:max-w-[415px] min-h-[390px] sm:min-h-[420px] rounded-[28px] bg-gradient-to-b from-white via-white to-[#f5f9fe] border border-blue-200 shadow-xl shadow-blue-500/5 transition-all duration-300 transform scale-100 relative z-10 flex flex-col justify-between p-4 sm:p-5.5 md:p-6 ring-1 ring-blue-500/10">
            {renderCardContent(currentIndex)}
          </div>

          {/* RIGHT PEEK CARD (Next Slide, desktop/tablet only) */}
          <div
            onClick={handleNext}
            aria-label="Next Card"
            className="hidden md:block shrink-0 w-[260px] lg:w-[310px] min-h-[390px] sm:min-h-[420px] rounded-[28px] bg-[#f8fbfe] border border-slate-200/90 opacity-45 hover:opacity-75 transition-all duration-300 transform scale-95 cursor-pointer overflow-hidden shadow-2xs p-4 sm:p-5 flex flex-col justify-between"
          >
            {renderCardContent(nextIndex)}
          </div>
        </div>

        {/* Carousel Navigation Controls (Arrows & Dots) */}
        <div className="flex flex-col items-center gap-2.5 mt-3 sm:mt-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              aria-label="Previous Slide"
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#006eff] hover:text-white text-slate-600 flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Pagination Dots */}
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalCards }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx ? 'w-6 bg-[#006eff]' : 'w-2 bg-slate-200 hover:bg-slate-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              aria-label="Next Slide"
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#006eff] hover:text-white text-slate-600 flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-2xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          READY TO START? SECTION: Authentic Glassy Blurry (Glassmorphic) Card
         ========================================================================= */}
      <section className="relative max-w-3xl mx-auto px-4 pt-4">
        {/* Soft Ambient Colorful Blurry Glow Orbs behind the glass */}
        <div className="absolute top-1/2 left-8 -translate-y-1/2 w-72 h-72 bg-gradient-to-tr from-[#006eff] to-cyan-300 rounded-full blur-[80px] opacity-40 pointer-events-none" />
        <div className="absolute top-1/2 right-8 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-indigo-500 to-[#006eff] rounded-full blur-[80px] opacity-35 pointer-events-none" />
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-80 h-32 bg-purple-400/25 rounded-full blur-[70px] pointer-events-none" />

        {/* Authentic Glassmorphism (গ্লাসি ব্লারি) Card */}
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-white/75 via-blue-50/40 to-white/60 backdrop-blur-2xl border border-white/90 shadow-xl shadow-blue-500/10 ring-1 ring-blue-500/10 p-8 sm:p-11 text-center space-y-4">
          {/* Top specular highlight & light sheen */}
          <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent" />
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-gradient-to-r from-blue-400/20 via-cyan-300/25 to-transparent rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Ready to Start?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Join GAENR and turn your skills into real client projects today.
            </p>
          </div>

          <div className="relative z-10 pt-2">
            <button
              onClick={() => openApplyExpert()}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-[#1c78f2] via-[#006eff] to-[#0055d4] hover:from-[#2a84fb] hover:to-[#0860e6] text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 transition-all cursor-pointer active:scale-95 border border-white/50"
            >
              Apply as Expert
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
