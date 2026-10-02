import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ServiceSlug } from '../types';
import {
  ArrowRight,
} from 'lucide-react';
import {
  AnimatedMousePointerClick,
  AnimatedFileText,
  AnimatedUserCheck,
  AnimatedPhoneCall,
  AnimatedCreditCard,
  AnimatedLaptop,
  AnimatedCheckCheck,
  AnimatedLock,
  AnimatedPercent,
  AnimatedUsers,
  AnimatedAward,
} from '../components/common/AnimatedServiceIcons';

export const ServicesPage: React.FC = () => {
  const { navigate, openAssignTask, categories } = useApp();

  // Fallback map for default photography & alts for standard categories
  const DEFAULT_IMAGE_MAP: Record<string, { imageUrl: string; fallbackUrl: string; imageAlt: string }> = {
    'graphics-design': {
      imageUrl: '/images/services/graphics-design-services.jpg',
      fallbackUrl: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'Designer using tablet and laptop workspace for Graphics Design',
    },
    'content-writing': {
      imageUrl: '/images/services/content-writing-copywriting-services.jpg',
      fallbackUrl: 'https://images.unsplash.com/photo-1636038692415-6276311a53cd?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'A man typing on an old-fashioned typewriter for Content Writing',
    },
    'video-editing': {
      imageUrl: '/images/services/video-editing-services.jpg',
      fallbackUrl: 'https://images.unsplash.com/photo-1618329027137-a520b57c6606?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'Computer monitor displaying video editing studio workspace',
    },
    'wordpress-website': {
      imageUrl: '/images/services/wordpress-website-design-services.jpg',
      fallbackUrl: 'https://images.unsplash.com/photo-1566207474742-de921626ad0c?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'WordPress developer coding and building responsive websites',
    },
    'presentation-slide-design': {
      imageUrl: '/images/services/presentation-slide-design-services.jpg',
      fallbackUrl: 'https://images.unsplash.com/photo-1588600878108-578307a3cc9d?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'Person writing and organizing presentation slide designs',
    },
    'ux-ui-design': {
      imageUrl: '/images/services/ux-ui-design-services.jpg',
      fallbackUrl: 'https://images.unsplash.com/photo-1586717799252-bd134ad00e26?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'MacBook Pro beside Apple Magic Mouse for UX/UI design',
    },
    'ad-running': {
      imageUrl: '/images/services/social-media-advertising-services.jpg',
      fallbackUrl: 'https://i.pinimg.com/736x/d0/12/34/d012343994bae31b40b1ebf2c92b0e69.jpg',
      imageAlt: 'Targeted advertising campaigns and digital marketing for Ad Running',
    },
  };

  // Dynamically populated from system categories (includes newly added categories from admin)
  const servicesList = categories.map((cat) => {
    const defaultMeta = DEFAULT_IMAGE_MAP[cat.slug] || {
      imageUrl: cat.cardImageUrl || '/images/services/graphics-design-services.jpg',
      fallbackUrl: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&w=800&q=80',
      imageAlt: `${cat.title} professional service`,
    };

    return {
      title: cat.title,
      slug: cat.slug,
      description: cat.description,
      imageUrl: cat.cardImageUrl || defaultMeta.imageUrl,
      fallbackUrl: cat.cardImageFallbackUrl || defaultMeta.fallbackUrl,
      imageAlt: defaultMeta.imageAlt,
    };
  });

  // 7-step interactive workflow up to confirmation and approval
  const assignWorkflowSteps = [
    {
      title: 'Click Assign Task',
      subtitle: 'Initiate Order',
      description: 'Click the "Assign Task" button on any page or service card to open the order form.',
      icon: <AnimatedMousePointerClick className="w-5 h-5 sm:w-6 sm:h-6" />,
    },
    {
      title: 'Add Task Details',
      subtitle: 'Specify Scope',
      description: 'Share clear requirements, reference files, timeline, and expectations for your deliverables.',
      icon: <AnimatedFileText className="w-5 h-5 sm:w-6 sm:h-6" />,
    },
    {
      title: 'Choose an Expert',
      subtitle: 'Talent Selection',
      description: 'Select a verified student expert using their ID Number, or let Gaenr match the top candidate.',
      icon: <AnimatedUserCheck className="w-5 h-5 sm:w-6 sm:h-6" />,
    },
    {
      title: 'Order Confirmation',
      subtitle: 'Gaenr Coordinator Call',
      description: 'A Gaenr coordinator contacts you promptly to clarify details and confirm the project scope.',
      icon: <AnimatedPhoneCall className="w-5 h-5 sm:w-6 sm:h-6" />,
    },
    {
      title: 'Make Payment',
      subtitle: 'Escrow Security',
      description: 'Receive a secure local payment link to fund the project safely through bKash, Nagad, or Bank.',
      icon: <AnimatedCreditCard className="w-5 h-5 sm:w-6 sm:h-6" />,
    },
    {
      title: 'Work in Progress',
      subtitle: 'Supervised Execution',
      description: 'Your verified expert begins execution while our team monitors progress and tracks milestones.',
      icon: <AnimatedLaptop className="w-5 h-5 sm:w-6 sm:h-6" />,
    },
    {
      title: 'Final Approval',
      subtitle: 'Funds Released',
      description: 'Review the completed deliverables. Payment is released to the expert only after your approval.',
      icon: <AnimatedCheckCheck className="w-5 h-5 sm:w-6 sm:h-6" />,
    },
  ];

  // Auto-rotating timer for flowchart (0.85s / 850ms cycle speed as requested)
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const mobileStepScrollRef = useRef<HTMLDivElement>(null);
  const stepItemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % assignWorkflowSteps.length);
    }, 850);
    return () => clearInterval(interval);
  }, [assignWorkflowSteps.length]);

  // Auto-slide to keep the active step centered and in full view on mobile & tablet
  useEffect(() => {
    const container = mobileStepScrollRef.current;
    const targetItem = stepItemRefs.current[activeStepIndex];
    if (container && targetItem) {
      const scrollTarget =
        targetItem.offsetLeft - container.clientWidth / 2 + targetItem.clientWidth / 2;
      container.scrollTo({
        left: Math.max(0, scrollTarget),
        behavior: 'smooth',
      });
    }
  }, [activeStepIndex]);

  // Handle direct navigation to How to Assign Task section via hash
  useEffect(() => {
    if (typeof window !== 'undefined' && (window.location.hash === '#how-to-assign-task' || window.location.hash === '#assign-process')) {
      const timer = setTimeout(() => {
        const el = document.getElementById('how-to-assign-task');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 antialiased space-y-12 sm:space-y-16 pb-16">
      {/* =========================================================================
          HERO BANNER: Exactly matching About Us styling
          - Deep brand blue `#006eff`
          - Pattern overlay with reduced opacity (no gradient banding)
          - Subheadline provided by the user
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
            <linearGradient id="services-artistic-wave-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#818cf8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id="services-artistic-wave-2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#006eff" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="services-artistic-wave-3" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path fill="url(#services-artistic-wave-1)" d="M0,128L60,144C120,160,240,192,360,181.3C480,171,600,117,720,117.3C840,117,960,171,1080,181.3C1200,192,1320,160,1380,144L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
          <path fill="url(#services-artistic-wave-2)" d="M0,64L48,96C96,128,192,192,288,208C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,181.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          <path fill="url(#services-artistic-wave-3)" d="M0,224L60,208C120,192,240,160,360,165.3C480,171,600,213,720,202.7C840,192,960,128,1080,112C1200,96,1320,128,1380,144L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
        </svg>

        <article className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-y-3 sm:gap-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Services
          </h1>
          <p className="text-sm sm:text-base text-white/95 font-normal leading-relaxed text-center">
            Explore the wide range of services offered by Gaenr, connecting you with skilled experts for all your needs.
          </p>
        </article>
      </section>

      {/* =========================================================================
          SECTION 1: THE 7 CORE SERVICES
          - Rich real photography from Unsplash
          - Clean concise cards with smooth hover zoom
          - Direct button to explore details, clicking anywhere navigates
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        {/* 7 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {servicesList.map((svc) => (
            <div
              key={svc.slug}
              onClick={() => navigate(`/services/${svc.slug}`)}
              className="group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-[#0256d0]/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
            >
              {/* Photo preview header with smooth zoom hover */}
              <div className="p-4 sm:p-5 pb-3">
                <div className="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden bg-slate-100 shadow-xs border border-slate-200/80">
                  <img
                    src={svc.imageUrl}
                    alt={svc.imageAlt}
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src !== svc.fallbackUrl) {
                        target.src = svc.fallbackUrl;
                      }
                    }}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/15 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Card body (Clean & concise: title & short description only) */}
              <div className="px-5 pb-4 space-y-2 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-[#0256d0] transition-colors">
                    {svc.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {svc.description}
                  </p>
                </div>
              </div>

              {/* Card action button */}
              <div className="p-4 sm:p-5 pt-2">
                <div className="w-full py-2.5 px-4 rounded-xl bg-slate-100 group-hover:bg-[#0256d0] text-slate-700 group-hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300 shadow-xs">
                  <span>Explore Details</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: HOW TO ASSIGN TASK ON GAENR (AUTOMATED FLOWCHART)
          - Headings INSIDE the bordered container as requested
          - Centered headline with colorful Gaenr
          - Step numbers (01, 02...) removed
          - Automated 0.85s rotation (non-interactive clicking, pure automated loop)
          - Prominent wide Assign Task button
         ========================================================================= */}
      <section id="how-to-assign-task" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        {/* Workflow Container with heading INSIDE the border */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm space-y-8 sm:space-y-10">
          {/* Centered Heading inside the card container */}
          <div className="space-y-2 max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              How to Assign Task on <span className="text-[#0256d0]">Gaenr</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              A clear, supervised workflow connecting you with verified experts. Every phase is managed by Gaenr from brief to payout.
            </p>
          </div>

          {/* Desktop Flowchart Track (Horizontal connected sequence) */}
          <div className="hidden xl:block relative pt-2 pb-2">
            {/* Background connecting track */}
            <div className="absolute top-9 left-10 right-10 h-1 bg-slate-200 -z-0" />
            {/* Dynamic progress highlight bar */}
            <div
              className="absolute top-9 left-10 h-1 bg-[#0256d0] -z-0 transition-all duration-300"
              style={{
                width: `${(activeStepIndex / (assignWorkflowSteps.length - 1)) * 100}%`,
              }}
            />

            <div className="grid grid-cols-7 gap-3 relative z-10 pointer-events-none select-none">
              {assignWorkflowSteps.map((st, idx) => {
                const isActive = activeStepIndex === idx;
                const isPast = idx < activeStepIndex;

                return (
                  <div
                    key={st.title}
                    className="flex flex-col items-center text-center space-y-3"
                  >
                    {/* Circle Node (Numbers removed as requested) */}
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 relative ${
                        isActive
                          ? 'bg-[#0256d0] text-white ring-4 ring-blue-100 scale-110 shadow-md'
                          : isPast
                          ? 'bg-blue-50 text-[#0256d0] border-2 border-blue-300'
                          : 'bg-white text-slate-400 border-2 border-slate-200'
                      }`}
                    >
                      {st.icon}
                    </div>

                    {/* Step label */}
                    <div className="space-y-0.5">
                      <p
                        className={`text-xs font-bold transition-colors line-clamp-1 ${
                          isActive ? 'text-[#0256d0]' : 'text-slate-700'
                        }`}
                      >
                        {st.title}
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium">
                        {st.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tablet & Mobile Track with Upper Alignment, Auto-Sliding and Centered Connecting Line */}
          <div
            ref={mobileStepScrollRef}
            className="xl:hidden relative overflow-x-auto no-scrollbar py-4 px-3 select-none"
          >
            <div className="relative inline-flex items-start gap-4 sm:gap-6 min-w-full">
              {/* Connecting Track Line running straight through the exact center of all upper-aligned circles */}
              <div className="absolute top-6 sm:top-7 left-8 right-8 h-1 bg-slate-200 pointer-events-none z-0" />
              {/* Active Progress Fill Line */}
              <div
                className="absolute top-6 sm:top-7 left-8 h-1 bg-[#0256d0] pointer-events-none transition-all duration-300 z-0"
                style={{
                  width: `${(activeStepIndex / (assignWorkflowSteps.length - 1)) * 100}%`,
                }}
              />

              {assignWorkflowSteps.map((st, idx) => {
                const isActive = activeStepIndex === idx;
                const isPast = idx < activeStepIndex;

                return (
                  <div
                    key={st.title}
                    ref={(el) => {
                      stepItemRefs.current[idx] = el;
                    }}
                    className="flex flex-col items-center text-center shrink-0 w-24 sm:w-28 relative z-10"
                  >
                    {/* Circle Node: upper-aligned, exactly 48px (w-12 h-12) or 56px (w-14 h-14) */}
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 relative shrink-0 ${
                        isActive
                          ? 'bg-[#0256d0] text-white ring-4 ring-blue-100 scale-105 shadow-md'
                          : isPast
                          ? 'bg-blue-50 text-[#0256d0] border-2 border-blue-300'
                          : 'bg-white text-slate-400 border-2 border-slate-200'
                      }`}
                    >
                      {React.cloneElement(st.icon as React.ReactElement<any>, {
                        className: 'w-5 h-5 sm:w-6 sm:h-6',
                      })}
                    </div>

                    {/* Step Labels: Upper-aligned directly below the circle with consistent top margin */}
                    <div className="mt-2.5 space-y-0.5 w-full">
                      <p
                        className={`text-xs font-bold leading-snug transition-colors ${
                          isActive ? 'text-[#0256d0]' : 'text-slate-800'
                        }`}
                      >
                        {st.title}
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium">
                        {st.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Step Spotlight Card - Fixed min-height & Middle-aligned to prevent any jumping */}
          <div className="bg-gradient-to-br from-blue-50/60 via-white to-slate-50 border border-blue-200/80 rounded-2xl p-5 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 transition-all duration-300 text-left min-h-[150px] sm:min-h-[134px] md:min-h-[120px]">
            <div className="flex items-center gap-4 sm:gap-5 flex-1 w-full md:w-auto">
              <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-[#0256d0] text-white flex items-center justify-center shrink-0 shadow-md">
                {assignWorkflowSteps[activeStepIndex].icon}
              </div>
              <div className="space-y-1 flex-1 min-h-[64px] sm:min-h-[56px] flex flex-col justify-center">
                <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {assignWorkflowSteps[activeStepIndex].title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                  {assignWorkflowSteps[activeStepIndex].description}
                </p>
              </div>
            </div>

            {/* Prominent Wide Assign Task Button */}
            <div className="shrink-0 w-full md:w-auto">
              <button
                onClick={() => openAssignTask()}
                className="w-full md:w-auto px-10 sm:px-12 py-3.5 rounded-xl bg-gradient-to-r from-[#1d74f5] via-[#0c67ea] to-[#0056d6] hover:from-[#2b82fa] hover:to-[#0862e6] text-white text-sm font-medium transition-all shadow-md flex items-center justify-center gap-2.5 whitespace-nowrap min-w-[180px] sm:min-w-[210px] border border-white/20"
              >
                <span>Assign Task</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: WHY YOU CAN TRUST GAENR
          - Middle-aligned
          - Rectangle badge of same color with text on top (scaled down on mobile)
          - Single-line headline with responsive sizing, 100% visible with zero truncation
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Why You Can Trust <span className="text-[#0256d0]">Gaenr</span>?
        </h2>

        {/* 4 Pillars Infographic Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {/* Pillar 1: Verified Experts */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-5 lg:p-6 shadow-xs hover:border-[#0256d0] hover:shadow-md transition-all flex flex-col items-center justify-center text-center space-y-2 sm:space-y-2.5">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0256d0] shadow-xs">
              <AnimatedAward className="w-5 h-5 sm:w-7 sm:h-7" />
            </div>
            {/* Rectangle badge: scaled down on mobile, desktop size on PC */}
            <div className="inline-flex items-center justify-center px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-blue-50 border border-blue-200/60 max-w-full">
              <span className="text-[9px] min-[380px]:text-[10px] sm:text-xs font-bold uppercase tracking-tight sm:tracking-wider text-[#0256d0] whitespace-nowrap">
                Pre-Vetted Talent
              </span>
            </div>
            {/* Headline: full text completely visible, single line */}
            <h3 className="font-bold text-[11px] min-[380px]:text-xs sm:text-sm lg:text-base text-slate-900 whitespace-nowrap text-center">
              100% Verified Experts
            </h3>
          </div>

          {/* Pillar 2: Managed Workflow */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-5 lg:p-6 shadow-xs hover:border-[#0256d0] hover:shadow-md transition-all flex flex-col items-center justify-center text-center space-y-2 sm:space-y-2.5">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs">
              <AnimatedUsers className="w-5 h-5 sm:w-7 sm:h-7" />
            </div>
            <div className="inline-flex items-center justify-center px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-indigo-50 border border-indigo-200/60 max-w-full">
              <span className="text-[9px] min-[380px]:text-[10px] sm:text-xs font-bold uppercase tracking-tight sm:tracking-wider text-indigo-600 whitespace-nowrap">
                Active Supervision
              </span>
            </div>
            <h3 className="font-bold text-[11px] min-[380px]:text-xs sm:text-sm lg:text-base text-slate-900 whitespace-nowrap text-center">
              Managed Workflow
            </h3>
          </div>

          {/* Pillar 3: Escrow Payments */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-5 lg:p-6 shadow-xs hover:border-[#0256d0] hover:shadow-md transition-all flex flex-col items-center justify-center text-center space-y-2 sm:space-y-2.5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-xs">
              <AnimatedLock className="w-5 h-5 sm:w-7 sm:h-7" />
            </div>
            <div className="inline-flex items-center justify-center px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-emerald-50 border border-emerald-200/60 max-w-full">
              <span className="text-[9px] min-[380px]:text-[10px] sm:text-xs font-bold uppercase tracking-tight sm:tracking-wider text-emerald-600 whitespace-nowrap">
                100% Protected
              </span>
            </div>
            <h3 className="font-bold text-[11px] min-[380px]:text-xs sm:text-sm lg:text-base text-slate-900 whitespace-nowrap text-center">
              Escrow-Secure Payments
            </h3>
          </div>

          {/* Pillar 4: 0% Platform Fee */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-5 lg:p-6 shadow-xs hover:border-[#0256d0] hover:shadow-md transition-all flex flex-col items-center justify-center text-center space-y-2 sm:space-y-2.5">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-xs">
              <AnimatedPercent className="w-5 h-5 sm:w-7 sm:h-7" />
            </div>
            <div className="inline-flex items-center justify-center px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-amber-50 border border-amber-200/60 max-w-full">
              <span className="text-[9px] min-[380px]:text-[10px] sm:text-xs font-bold uppercase tracking-tight sm:tracking-wider text-amber-600 whitespace-nowrap">
                Fair & Transparent
              </span>
            </div>
            <h3 className="font-bold text-[11px] min-[380px]:text-xs sm:text-sm lg:text-base text-slate-900 whitespace-nowrap text-center">
              0% Platform Fee
            </h3>
          </div>
        </div>
      </section>
    </div>
  );
};
