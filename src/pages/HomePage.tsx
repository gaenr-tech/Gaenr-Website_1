import React from 'react';
import { useApp } from '../context/AppContext';
import { GaenrLogo } from '../components/common/GaenrLogo';
import { Hero3DCanvas } from '../components/common/Hero3DCanvas';
import { Pathway3DCanvas } from '../components/common/Pathway3DCanvas';
import { IphoneWallpaper } from '../components/common/IphoneWallpaper';
import { TestimonialsCarousel } from '../components/common/TestimonialsCarousel';
import { PlantGrowthAnimation } from '../components/common/PlantGrowthAnimation';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Check,
  ChevronRight,
  FileText,
  PhoneCall,
  CreditCard,
  Laptop,
  CheckCheck,
  Wifi,
  Zap,
  Briefcase,
  TrendingUp,
  Percent,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { openAssignTask, openApplyExpert, navigate } = useApp();
  const [outsourcerBurst, setOutsourcerBurst] = React.useState<number>(0);
  const [expertBurst, setExpertBurst] = React.useState<number>(0);
  const [activeStepIndex, setActiveStepIndex] = React.useState<number>(0);

  // Automated 0.85s sequence through steps in "How It Works"
  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % 5);
    }, 850);
    return () => clearInterval(timer);
  }, []);

  // The 6 Available Services directly matching the approved UI reference
  const coreServices = [
    {
      title: 'Graphics Design',
      desc: 'Logo, brand identity, packaging, and high-retention marketing creatives tailored to your brand.',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-blue-600 fill-blue-50 stroke-1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19l7-7 3 3-7 7-3-3z" />
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
          <path d="M2 2l7.586 7.586" />
          <circle cx="11" cy="11" r="2" />
        </svg>
      ),
      slug: 'graphics-design',
    },
    {
      title: 'Content Writing & Copywriting',
      desc: 'Clear, strategic articles, website copy, and high-conversion e-commerce descriptions with purpose.',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-blue-600 fill-blue-50 stroke-1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
      slug: 'content-writing',
    },
    {
      title: 'WordPress Website',
      desc: 'Fast, secure, and mobile-optimized WordPress websites with local payment gateway integrations.',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-blue-600 fill-blue-50 stroke-1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
      slug: 'wordpress-website',
    },
    {
      title: 'Video Editing',
      desc: 'Turn raw clips into polished stories that capture and hold attention on social media and YouTube.',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-blue-600 fill-blue-50 stroke-1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="23 7 16 12 23 17 23 7" />
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
      ),
      slug: 'video-editing',
    },
    {
      title: 'Presentation Slide Design',
      desc: 'Investor pitch decks and keynote presentation slides structured for impact and visual clarity.',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-blue-600 fill-blue-50 stroke-1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
      slug: 'presentation-slide-design',
    },
    {
      title: 'UX & UI Design',
      desc: 'Modern web and mobile interfaces designed to eliminate user friction and convert visitors.',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-blue-600 fill-blue-50 stroke-1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      ),
      slug: 'ux-ui-design',
    },
  ];

  // Flowchart steps with progressive connected flow
  const flowchartSteps = [
    {
      id: 'brief',
      title: 'Assign Task',
      subtitle: 'Brief & Requirements',
      desc: 'Choose a specialized service and submit your detailed task requirements.',
      icon: <FileText className="w-5 h-5 sm:w-6 sm:h-6 stroke-current transition-colors duration-200" />,
    },
    {
      id: 'confirm',
      title: 'Confirmation',
      subtitle: 'Verified Match',
      desc: 'Our operations team reviews specifications and matches you with the best specialist.',
      icon: <PhoneCall className="w-5 h-5 sm:w-6 sm:h-6 stroke-current transition-colors duration-200" />,
    },
    {
      id: 'pay',
      title: 'Make Payment',
      subtitle: 'Escrow Protected',
      desc: 'Funds are securely deposited and protected in Gaenr escrow until full satisfaction.',
      icon: <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 stroke-current transition-colors duration-200" />,
    },
    {
      id: 'work',
      title: 'Work Begins',
      subtitle: 'Active Execution',
      desc: 'Your dedicated specialist executes the work with direct milestones and updates.',
      icon: <Laptop className="w-5 h-5 sm:w-6 sm:h-6 stroke-current transition-colors duration-200" />,
    },
    {
      id: 'approve',
      title: 'Final Approval',
      subtitle: 'Payment Released',
      desc: 'Review deliverables, approve the finished work, and expert payout is securely released.',
      icon: <CheckCheck className="w-5 h-5 sm:w-6 sm:h-6 stroke-current transition-colors duration-200" />,
    },
  ];

  return (
    <div className="pb-0">
      {/* =========================================================================
          SECTION 1: HERO SECTION
          - Colorful fluid background matching Gaenr aesthetics
          - Half-width (50%) text layout, reserving the right half for visual
          - Content writer copy for trust highlights (Verified Student Talent, Zero Platform Fees, Escrow Protection)
         ========================================================================= */}
      <section className="relative pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-20 border-b border-slate-200/80 bg-hero-colorful overflow-hidden">
        {/* Soft fluid ambient wave glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-200/35 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-blue-200/30 rounded-full blur-3xl pointer-events-none -mb-32" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content Column: order-2 on mobile (below visual), order-1 on desktop */}
            <div className="lg:col-span-6 space-y-6 text-left order-2 lg:order-1">
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.14]">
                  ARE YOU <br />
                  <span className="text-[#0256d0]">#ReadyToChange?</span>
                </h1>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                  Assign projects with ease and get reliable results. Gaenr connects you with verified student experts who deliver efficiently, so you can focus on what matters.
                </p>
              </div>

              {/* Action Buttons: single line on all screen sizes */}
              <div className="grid grid-cols-2 gap-2.5 sm:flex sm:items-center sm:gap-4 pt-2 w-full max-w-sm sm:max-w-md">
                <button
                  onClick={() => openAssignTask()}
                  className="gaenr-btn-primary !px-3 sm:!px-7 !py-2.5 sm:!py-3.5 !text-xs sm:!text-sm justify-center whitespace-nowrap text-center"
                >
                  <span>Assign Task</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                </button>

                <button
                  onClick={() => openApplyExpert()}
                  className="gaenr-btn-secondary !px-3 sm:!px-7 !py-2.5 sm:!py-3.5 !text-xs sm:!text-sm justify-center whitespace-nowrap text-center"
                >
                  Join as Expert
                </button>
              </div>

              {/* Crisp Professional Trust Highlights */}
              <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-700 font-medium">
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>0% Platform Fee</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#0256d0] shrink-0" />
                  <span>Verified Student Talent</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Escrow-Protected Delivery</span>
                </div>
              </div>
            </div>

            {/* Right Visual Space: order-1 on mobile (above headline), order-2 on desktop */}
            <div className="lg:col-span-6 relative flex justify-center items-center w-full order-1 lg:order-2">
              <Hero3DCanvas />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: MORE THAN A PLATFORM, A PATHWAY
          - "A Pathway" highlighted in blue
          - 2-Column Responsive Layout: Text & CTA on left, 3D Pathway Symbol on right
          - Exact geometric angle preserved without tilt drift
         ========================================================================= */}
      {/* =========================================================================
          SECTION 2: MORE THAN A PLATFORM, A PATHWAY
          - Mobile: 3D Icon appears FIRST right below Hero section, then headline & text
          - Desktop: Text on left (col-span-7), 3D Pathway Symbol on right (col-span-5)
          - Half-width text (max-w-xl) with concise, punchy copy
         ========================================================================= */}
      <section className="py-14 sm:py-18 lg:py-20 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
            {/* Visual Column: In DOM FIRST so on mobile it is strictly at top right after hero */}
            <div className="order-1 lg:order-2 lg:col-span-5 flex justify-center items-center w-full">
              <Pathway3DCanvas />
            </div>

            {/* Left Content Column: order-2 on mobile (below 3D icon), order-1 (lg:col-span-7) on desktop */}
            <div className="order-2 lg:order-1 lg:col-span-7 space-y-4 text-left max-w-xl">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                More Than a Platform, <span className="text-[#0256d0]">A Pathway</span>
              </h2>

              <div className="space-y-3 text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-xl">
                <p>
                  Gaenr connects skilled freelancers directly with clients who need quality work done efficiently—no bidding wars, no unnecessary layers.
                </p>
                <p>
                  Direct matching, clear project confirmation, and escrow security that protects every delivery.
                </p>
              </div>

              {/* Section link button with animated underline */}
              <div className="pt-2">
                <button
                  onClick={() => navigate('/about-us')}
                  className="gaenr-link-btn"
                >
                  <span>Know More About Us</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: WE'RE STILL BUILDING, BUT YOU CAN START TODAY
          - Mobile: Visual on top, then Headline, then Body text & CTA
          - Desktop: Visual on the Left, Headline and Text on the Right
         ========================================================================= */}
      <section className="py-14 sm:py-18 lg:py-20 border-b border-slate-200/80 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Visual: Top on mobile, Centered horizontally in the left column on desktop */}
            <div className="order-1 lg:order-1 lg:col-span-6 flex items-center justify-center w-full">
              <PlantGrowthAnimation />
            </div>

            {/* Text Content: Below visual on mobile, Right on desktop */}
            <div className="order-2 lg:order-2 lg:col-span-6 max-w-xl text-left space-y-4 lg:pl-4">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight text-slate-900">
                We're Still Building <br />
                <span className="text-[#0256d0]">But You Can Start Today</span>
              </h2>

              <div className="space-y-3 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                <p>
                  This is our beta version, and we're being honest about it. We handle the heavy lifting directly: confirming requirements, managing milestones, and ensuring work is delivered smoothly without hassle.
                </p>
                <p>
                  We're testing this with you because your feedback matters. Tell us what works so we can build even better features for you.
                </p>
              </div>

              {/* Section link button with animated underline */}
              <div className="pt-2">
                <button
                  onClick={() => navigate('/feedback')}
                  className="gaenr-link-btn"
                >
                  <span>Share Feedback</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: AVAILABLE SERVICES / SERVICES THAT MOVE YOU FORWARD
          - 6 core services (no numbers, compact card size, NO 'View Details')
          - Centered / Middle aligned "Let's Explore All Services" button
         ========================================================================= */}
      <section className="py-14 sm:py-18 lg:py-20 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-1.5 max-w-2xl text-left">
            <span className="text-xs font-semibold text-[#0256d0] uppercase tracking-wider">
              Available Services
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
              Services That Move You Forward
            </h2>
          </div>

          {/* 6 Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
            {coreServices.map((service) => (
              <div
                key={service.slug}
                onClick={() => navigate(`/services/${service.slug}`)}
                className="group p-5 bg-white border border-slate-200/90 rounded-2xl shadow-xs hover:border-[#0256d0] hover:shadow-md transition-all cursor-pointer space-y-2.5 flex flex-col justify-start text-left"
              >
                {/* Visual Icon Badge */}
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center transition-transform group-hover:scale-105">
                  {service.icon}
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0256d0] transition-colors">
                  {service.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Main Section CTA: Centered with animated underline */}
          <div className="pt-6 flex justify-center">
            <button
              onClick={() => navigate('/services')}
              className="gaenr-link-btn !text-base"
            >
              <span>Let's Explore</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: GAENR'S OFFERINGS - AN ECOSYSTEM DESIGNED FOR YOUR GROWTH
          - EXACT MATCH TO USER'S UPLOADED SCREENSHOT (image.png)
          - Colorful fluid background with curved waves
          - Arch-shaped photos with multiple radiating network pulse rings and floating Gaenr logo badges
          - Perfectly shaped blue speech bubbles overlapping bottom of photos
          - Balanced, harmonious grid alignment for For Outsourcers and For Experts
          - Expert photo: working relaxed by beach/ocean with laptop
      {/* =========================================================================
          SECTION 5: GAENR'S OFFERINGS - COMPACT ECOSYSTEM FOR GROWTH
          - Space-optimized layout with compressed padding and compact 16:9 frames
          - Integrated official Gaenr SVG logo in pulse rings and header eyebrow
          - Visual 1: Needy, focused corporate youth client urgently seeking assistance
          - Visual 2: Professional beach-side freelancer working on laptop with face visible
          - Responsive mobile alignment without text wrapping or broken lines
         ========================================================================= */}
      <section className="relative py-14 sm:py-18 lg:py-20 bg-gaenr-fluid overflow-hidden border-b border-blue-100/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 relative z-10">
          {/* Header Bar with Official SVG Logo */}
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 bg-[#0256d0] text-white text-xs font-semibold px-3.5 py-1 rounded-full shadow-xs">
              <GaenrLogo size={14} variant="white" className="shrink-0" />
              <span>Gaenr's Offerings</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              An Ecosystem Designed for Your Growth
            </h2>
          </div>

          {/* COMPACT DUAL-PILLAR ECOSYSTEM: OUTSOURCERS & EXPERTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 items-stretch">
            {/* CARD 1: FOR OUTSOURCERS (Young professional using smartphone seeking verified expertise) */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 border border-blue-100 shadow-md shadow-blue-900/5 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-blue-200">
              {/* Top Accent Gradient Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0256d0] to-sky-400" />

              <div className="space-y-3 sm:space-y-4">
                {/* Header Badge & Title */}
                <div className="flex items-center justify-between gap-2">
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-[#0256d0] font-bold text-xs uppercase tracking-wider block">For Outsourcers</span>
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight truncate">Hire Verified Experts</h3>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-blue-50 text-[#0256d0] border border-blue-200 whitespace-nowrap shrink-0">
                    0% Platform Fee
                  </span>
                </div>

                {/* Compact 16:9 Visual Frame with Corner Radar Pulse & Official SVG Logo */}
                <div className="relative w-full aspect-[16/9] rounded-xl sm:rounded-2xl bg-slate-100 border border-slate-200/80 shadow-inner my-2 sm:my-3">
                  {/* Photo container */}
                  <div className="absolute inset-0 rounded-xl sm:rounded-2xl overflow-hidden">
                    <img
                      src="/images/outsourcer_smartphone.jpg"
                      alt="Outsourcer using smartphone to manage projects and hire experts"
                      className="w-full h-full object-cover object-[center_20%]"
                      loading="lazy"
                    />
                  </div>

                  {/* Top-Left Client Role Status: Outsourcer badge */}
                  <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-white shadow-xs flex items-center gap-1.5 z-10 border border-white/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <span className="text-[10px] sm:text-[11px] font-bold whitespace-nowrap tracking-wide">Outsourcer</span>
                  </div>

                  {/* Corner Gaenr Radar Logo & Network Waves (Upper-Right Corner, facing Expert card) */}
                  <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-20">
                    {/* Continuous Multi-layer High-speed Network Waves radiating across toward center */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="absolute w-14 h-14 border-2 border-blue-400/40 rounded-full animate-network-wave-1" />
                      <div className="absolute w-20 h-20 border border-blue-400/30 rounded-full border-dashed animate-network-wave-2 animate-network-spin" />
                      <div className="absolute w-28 h-28 border border-blue-300/20 rounded-full animate-network-wave-3" />
                      <div className="absolute w-36 h-36 border border-blue-300/15 rounded-full animate-network-wave-3" />
                    </div>

                    {/* Interactive Burst Waves on Click/Tap */}
                    {outsourcerBurst > 0 && (
                      <div key={outsourcerBurst} className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div className="absolute w-14 h-14 border-2 border-blue-500 rounded-full animate-network-burst-1" />
                        <div className="absolute w-22 h-22 border-2 border-sky-400 rounded-full animate-network-burst-2" />
                        <div className="absolute w-32 h-32 border border-sky-300/60 rounded-full animate-network-burst-2" />
                      </div>
                    )}

                    {/* Floating Clickable Gaenr Logo Badge using official SVG brand mark */}
                    <button
                      type="button"
                      onClick={() => setOutsourcerBurst((b) => b + 1)}
                      className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 backdrop-blur-md shadow-md flex items-center justify-center cursor-pointer active:scale-90 transition-transform duration-150 hover:scale-105 p-1 group z-10"
                      title="Tap Gaenr Logo to broadcast network waves"
                      aria-label="Gaenr Network Pulse"
                    >
                      <GaenrLogo size={22} color="#0062e6" className="group-hover:scale-110 transition-transform" />
                    </button>
                  </div>

                  {/* Vibrant Gaenr Blue Speech Bubble - on the RIGHT side near center */}
                  <div className="absolute bottom-2 right-2 sm:bottom-2.5 sm:right-2.5 max-w-[85%] sm:max-w-[220px] bg-gradient-to-r from-[#0256d0] to-[#0142a3] text-white px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl shadow-lg shadow-blue-950/25 z-20 text-left border border-white/20">
                    <div className="text-[10px] font-bold text-sky-200 leading-none mb-0.5">Hey Gaenr,</div>
                    <p className="text-[11px] font-normal leading-tight text-white/95">
                      Urgent brief ready. Need a verified expert to execute efficiently.
                    </p>
                  </div>
                </div>

                {/* 4 Crisp Value Propositions in 2x2 Grid (Without truncate, fully readable on small screens) */}
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5 pt-1">
                  <div className="flex items-start gap-2 p-2 rounded-xl bg-slate-50/90 border border-slate-100 min-w-0">
                    <Percent className="w-3.5 h-3.5 text-[#0256d0] shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 leading-tight">0% Platform Fee</div>
                      <div className="text-[10px] sm:text-[11px] text-slate-500 leading-tight mt-0.5">Pay only for work</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-2 rounded-xl bg-slate-50/90 border border-slate-100 min-w-0">
                    <Zap className="w-3.5 h-3.5 text-[#0256d0] shrink-0 mt-0.5 fill-[#0256d0]" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 leading-tight">Hassle-Free Match</div>
                      <div className="text-[10px] sm:text-[11px] text-slate-500 leading-tight mt-0.5">Direct talent matching</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-2 rounded-xl bg-slate-50/90 border border-slate-100 min-w-0">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 leading-tight">Escrow Security</div>
                      <div className="text-[10px] sm:text-[11px] text-slate-500 leading-tight mt-0.5">Released on approval</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-2 rounded-xl bg-slate-50/90 border border-slate-100 min-w-0">
                    <CheckCheck className="w-3.5 h-3.5 text-[#0256d0] shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 leading-tight">Verified Talent</div>
                      <div className="text-[10px] sm:text-[11px] text-slate-500 leading-tight mt-0.5">Handpicked students</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom CTA: On mobile stacks vertically centered, on sm+ row */}
              <div className="pt-3 border-t border-slate-100 mt-4 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left">
                <span className="text-xs text-slate-500 font-medium">Ready to start?</span>
                <button
                  onClick={() => openAssignTask()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 h-10 px-5 rounded-xl bg-gradient-to-r from-[#1d74f5] via-[#0c67ea] to-[#0056d6] hover:from-[#2b82fa] hover:to-[#0862e6] text-white text-xs font-medium transition-all shadow-xs shrink-0 whitespace-nowrap min-w-[135px] cursor-pointer border border-white/20"
                >
                  <span>Assign Task</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* CARD 2: FOR EXPERTS (Professional beach-side freelancer working on laptop with face visible) */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 border border-blue-100 shadow-md shadow-blue-900/5 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-blue-200">
              {/* Top Accent Gradient Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 to-[#0256d0]" />

              <div className="space-y-3 sm:space-y-4">
                {/* Header Badge & Title */}
                <div className="flex items-center justify-between gap-2">
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-[#0256d0] font-bold text-xs uppercase tracking-wider block">For Experts</span>
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight truncate">Earn While You Build</h3>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-blue-50 text-[#0256d0] border border-blue-200 whitespace-nowrap shrink-0">
                    Guaranteed Pay
                  </span>
                </div>

                {/* Compact 16:9 Visual Frame with Corner Radar Pulse & Official SVG Logo */}
                <div className="relative w-full aspect-[16/9] rounded-xl sm:rounded-2xl bg-slate-100 border border-slate-200/80 shadow-inner my-2 sm:my-3">
                  {/* Photo container */}
                  <div className="absolute inset-0 rounded-xl sm:rounded-2xl overflow-hidden">
                    <img
                      src="/images/expert_working_tree.jpg"
                      alt="Man sitting by tree and working on laptop - Gaenr Expert"
                      className="w-full h-full object-cover object-[center_78%]"
                      loading="lazy"
                    />
                  </div>

                  {/* Corner Gaenr Radar Logo & Network Waves (Upper-Left Corner, facing Outsourcer card) */}
                  <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-20">
                    {/* Continuous Multi-layer High-speed Network Waves radiating across toward center */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="absolute w-14 h-14 border-2 border-blue-400/40 rounded-full animate-network-wave-1" />
                      <div className="absolute w-20 h-20 border border-blue-400/30 rounded-full border-dashed animate-network-wave-2 animate-network-spin" />
                      <div className="absolute w-28 h-28 border border-blue-300/20 rounded-full animate-network-wave-3" />
                      <div className="absolute w-36 h-36 border border-blue-300/15 rounded-full animate-network-wave-3" />
                    </div>

                    {/* Interactive Burst Waves on Click/Tap */}
                    {expertBurst > 0 && (
                      <div key={expertBurst} className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div className="absolute w-14 h-14 border-2 border-blue-500 rounded-full animate-network-burst-1" />
                        <div className="absolute w-22 h-22 border-2 border-sky-400 rounded-full animate-network-burst-2" />
                        <div className="absolute w-32 h-32 border border-sky-300/60 rounded-full animate-network-burst-2" />
                      </div>
                    )}

                    {/* Floating Clickable Gaenr Logo Badge using official SVG brand mark */}
                    <button
                      type="button"
                      onClick={() => setExpertBurst((b) => b + 1)}
                      className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 backdrop-blur-md shadow-md flex items-center justify-center cursor-pointer active:scale-90 transition-transform duration-150 hover:scale-105 p-1 group z-10"
                      title="Tap Gaenr Logo to broadcast network waves"
                      aria-label="Gaenr Network Pulse"
                    >
                      <GaenrLogo size={22} color="#0062e6" className="group-hover:scale-110 transition-transform" />
                    </button>
                  </div>

                  {/* Top-Right Expert Status: Gaenr Expert badge */}
                  <div className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-white shadow-xs flex items-center gap-1.5 z-10 border border-white/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse shrink-0" />
                    <span className="text-[10px] sm:text-[11px] font-bold whitespace-nowrap tracking-wide">Gaenr Expert</span>
                  </div>

                  {/* Vibrant Gaenr Blue Speech Bubble - on the LEFT side near center */}
                  <div className="absolute bottom-2 left-2 sm:bottom-2.5 sm:left-2.5 max-w-[85%] sm:max-w-[210px] bg-gradient-to-r from-[#0256d0] to-[#0142a3] text-white px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl shadow-lg shadow-blue-950/25 z-20 text-left border border-white/20">
                    <div className="text-[10px] font-bold text-sky-200 leading-none mb-0.5">Gaenr Expert</div>
                    <p className="text-[11px] font-normal leading-tight text-white/95">
                      Brief received! Matched to my skills. Delivering quality results on time.
                    </p>
                  </div>
                </div>

                {/* 4 Crisp Value Propositions in 2x2 Grid (Without truncate, fully readable on small screens) */}
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5 pt-1">
                  <div className="flex items-start gap-2 p-2 rounded-xl bg-slate-50/90 border border-slate-100 min-w-0">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 leading-tight">Guaranteed Pay</div>
                      <div className="text-[10px] sm:text-[11px] text-slate-500 leading-tight mt-0.5">Fast, secure payouts</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-2 rounded-xl bg-slate-50/90 border border-slate-100 min-w-0">
                    <TrendingUp className="w-3.5 h-3.5 text-[#0256d0] shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 leading-tight">Real Experience</div>
                      <div className="text-[10px] sm:text-[11px] text-slate-500 leading-tight mt-0.5">Build verified portfolio</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-2 rounded-xl bg-slate-50/90 border border-slate-100 min-w-0">
                    <Briefcase className="w-3.5 h-3.5 text-[#0256d0] shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 leading-tight">Fair Access</div>
                      <div className="text-[10px] sm:text-[11px] text-slate-500 leading-tight mt-0.5">No bidding wars</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-2 rounded-xl bg-slate-50/90 border border-slate-100 min-w-0">
                    <Check className="w-3.5 h-3.5 text-[#0256d0] shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 leading-tight">Total Flexibility</div>
                      <div className="text-[10px] sm:text-[11px] text-slate-500 leading-tight mt-0.5">Work anywhere, anytime</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom CTA: On mobile stacks vertically centered, on sm+ row */}
              <div className="pt-3 border-t border-slate-100 mt-4 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left">
                <span className="text-xs text-slate-500 font-medium">Ready to monetize?</span>
                <button
                  onClick={() => openApplyExpert()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 h-10 px-5 rounded-xl bg-white text-[#0256d0] border-2 border-[#0256d0] text-xs font-medium hover:bg-[#0256d0] hover:text-white transition-all duration-200 shadow-xs hover:shadow-md shrink-0 whitespace-nowrap min-w-[135px] group cursor-pointer"
                >
                  <span>Join as Expert</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: HOW IT WORKS (QUICK, CLEAR, SECURE PAYMENT PROCESS)
          - Eyebrow: "How It Works"
          - Hover attached strictly to circle boundary (no hover outside)
          - Hovering on circle turns icon white and background blue
         ========================================================================= */}
      <section className="py-14 sm:py-18 lg:py-20 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-1.5 max-w-2xl mx-auto text-center flex flex-col items-center">
            <span className="text-xs font-semibold text-[#0256d0] uppercase tracking-wider">
              How It Works
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
              Quick, Clear, Secure Payment Process
            </h2>
          </div>

          {/* Desktop Flowchart Track (Horizontal connected sequence) */}
          <div className="hidden lg:block relative pt-4 pb-2 pointer-events-none select-none">
            {/* Background connecting track */}
            <div className="absolute top-12 left-16 right-16 h-1 bg-slate-200/90 rounded-full -z-0" />
            {/* Dynamic progressive highlight bar */}
            <div
              className="absolute top-12 left-16 h-1 bg-[#0256d0] rounded-full -z-0 transition-all duration-300 ease-out"
              style={{
                width: `${(activeStepIndex / (flowchartSteps.length - 1)) * 100}%`,
                maxWidth: 'calc(100% - 8rem)',
              }}
            />

            <div className="grid grid-cols-5 gap-4 relative z-10">
              {flowchartSteps.map((st, idx) => {
                const isActive = activeStepIndex === idx;
                const isPast = idx < activeStepIndex;

                return (
                  <div
                    key={st.id}
                    className="flex flex-col items-center text-center space-y-3"
                  >
                    {/* Step Circle with completed checkmark on past steps */}
                    <div className="relative">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 relative ${
                          isActive
                            ? 'bg-[#0256d0] text-white ring-4 ring-blue-100 scale-110 shadow-lg'
                            : isPast
                            ? 'bg-blue-50 text-[#0256d0] border-2 border-blue-400 scale-100'
                            : 'bg-white text-slate-400 border-2 border-slate-200 scale-100'
                        }`}
                      >
                        {st.icon}
                      </div>

                      {/* Completed Check badge for past steps */}
                      {isPast && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#0256d0] text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    {/* Step label */}
                    <div className="space-y-1 px-1 transition-colors">
                      <h3
                        className={`font-bold text-sm transition-colors duration-300 ${
                          isActive ? 'text-[#0256d0]' : isPast ? 'text-slate-900' : 'text-slate-700'
                        }`}
                      >
                        {st.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        {st.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Vertical Stepper with progressive connection */}
          <div className="lg:hidden relative pl-6 space-y-5 pt-2 pointer-events-none select-none">
            {/* Background vertical line */}
            <div className="absolute top-4 bottom-4 left-4 w-0.5 bg-slate-200" />
            {/* Dynamic progressive vertical bar */}
            <div
              className="absolute top-4 left-4 w-0.5 bg-[#0256d0] transition-all duration-300 ease-out"
              style={{
                height: `${(activeStepIndex / (flowchartSteps.length - 1)) * 100}%`,
                maxHeight: 'calc(100% - 2rem)',
              }}
            />

            {flowchartSteps.map((st, idx) => {
              const isActive = activeStepIndex === idx;
              const isPast = idx < activeStepIndex;

              return (
                <div
                  key={st.id}
                  className="relative flex items-start gap-4"
                >
                  <div className="relative shrink-0 -ml-4.5 z-10">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shadow-xs transition-all duration-300 ${
                        isActive
                          ? 'bg-[#0256d0] text-white scale-115 ring-3 ring-blue-100 shadow-md'
                          : isPast
                          ? 'bg-blue-50 text-[#0256d0] border-2 border-blue-400'
                          : 'bg-white border-2 border-slate-300 text-slate-400'
                      }`}
                    >
                      {st.icon}
                    </div>
                    {isPast && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#0256d0] text-white flex items-center justify-center shadow-xs">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  <div
                    className={`flex-1 rounded-2xl p-4 shadow-xs space-y-1 text-left transition-all duration-300 border ${
                      isActive
                        ? 'bg-blue-50/80 border-[#0256d0] shadow-sm'
                        : isPast
                        ? 'bg-white border-blue-200'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <h3
                      className={`font-bold text-sm transition-colors duration-300 ${
                        isActive ? 'text-[#0256d0]' : 'text-slate-800'
                      }`}
                    >
                      {st.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {st.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-6 flex justify-center">
            <button
              onClick={() => openAssignTask()}
              className="gaenr-link-btn !text-base"
            >
              <span>Assign Task</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: TESTIMONIALS SLIDER / CAROUSEL
          - Modern interactive responsive slider (1 on mobile, 2 on tablet, 3 on desktop)
          - Client photo, name, designation, rating, quote, and verified profile link
          - Autoplay with hover pause, touch swipe, smooth transition controls
          - Bottom link to full /testimonials page
         ========================================================================= */}
      <TestimonialsCarousel />

      {/* =========================================================================
          SECTION 8: BECOME AN EXPERT (COMPACT & BALANCED SIZING)
          - Background: VIBRANT BLUE (bg-expert-blue)
          - Scaled down typography, spacing, and iPhone mockup for optimal proportions
         ========================================================================= */}
      <section className="py-10 sm:py-12 lg:py-14 relative overflow-hidden bg-gradient-to-b from-[#fafbfc] via-slate-100/60 to-blue-50/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-expert-blue rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative">
            {/* Textured Design Overlay with reduced opacity so it does not look like solid blue */}
            <div className="absolute inset-0 bg-[url('/expert-bg-pattern.svg')] bg-cover bg-center opacity-25 mix-blend-overlay pointer-events-none" />
            <svg
              className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1000 600"
              preserveAspectRatio="none"
            >
              <path
                d="M-50 120 C 250 280, 480 30, 800 220 C 950 310, 1050 260, 1100 290"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                strokeDasharray="6 8"
              />
              <path
                d="M-50 240 C 300 420, 560 120, 1050 340"
                fill="none"
                stroke="white"
                strokeWidth="2"
                opacity="0.5"
              />
              <path
                d="M-50 360 C 350 520, 650 200, 1050 440"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                opacity="0.35"
              />
              <circle cx="880" cy="180" r="160" stroke="white" strokeWidth="1" strokeDasharray="4 6" fill="none" opacity="0.4" />
              <circle cx="880" cy="180" r="250" stroke="white" strokeWidth="1" strokeDasharray="6 10" fill="none" opacity="0.25" />
              <circle cx="140" cy="460" r="130" stroke="white" strokeWidth="1" strokeDasharray="4 6" fill="none" opacity="0.35" />
            </svg>

            {/* Subtle ambient radial highlights on blue */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-900/40 rounded-full blur-3xl pointer-events-none" />

            {/* Left Content: order-2 on mobile (below iPhone), order-1 on desktop */}
            <div className="lg:col-span-7 space-y-4 text-left relative z-10 order-2 lg:order-1">
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-200 bg-white/10 px-2.5 py-0.5 rounded-full inline-block backdrop-blur-xs">
                  Become an Expert
                </span>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight leading-snug text-white">
                  Got skills? Let’s turn them into opportunity
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-blue-50 leading-relaxed font-normal">
                Join Gaenr to access real demand, fair pay, and support that understands Bangladesh's market. No more undercutting; just fair rates, fast payments, and continuous work.
              </p>

              {/* Why Join? */}
              <div className="space-y-2 pt-0.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-200 block">
                  Why Join?
                </span>
                <ul className="space-y-2 text-xs sm:text-[13px] text-white">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                    <span>Guaranteed Payments, No Global Barriers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                    <span>Real Clients, Local Opportunities</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                    <span>Build Your Portfolio &amp; Earn Fairly</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => openApplyExpert()}
                  className="bg-white text-[#0256d0] hover:bg-blue-50 font-medium px-6 py-2.5 sm:px-7 sm:py-3 rounded-full shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 inline-flex items-center gap-2 text-xs sm:text-sm cursor-pointer group"
                >
                  <span>Become an Expert Today</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>

            {/* Right: order-1 on mobile (above headline), order-2 on desktop */}
            <div className="lg:col-span-5 flex justify-center items-center py-2 relative z-10 order-1 lg:order-2">
              <div className="relative w-[210px] sm:w-[230px] h-[415px] sm:h-[455px]">
                {/* Physical side buttons */}
                <div className="absolute -left-[5px] top-20 w-[2.5px] h-6 bg-slate-600 rounded-l-xs z-10" />
                <div className="absolute -left-[5px] top-28 w-[2.5px] h-8 bg-slate-600 rounded-l-xs z-10" />
                <div className="absolute -left-[5px] top-39 w-[2.5px] h-8 bg-slate-600 rounded-l-xs z-10" />
                <div className="absolute -right-[5px] top-23 w-[2.5px] h-11 bg-slate-600 rounded-r-xs z-10" />

                {/* iPhone Chassis */}
                <div className="w-full h-full bg-slate-950 rounded-[38px] p-2.5 shadow-2xl border-[3px] border-slate-700/80 ring-2 ring-white/10 relative">
                  {/* iPhone Screen Area */}
                  <div className="w-full h-full bg-slate-950 rounded-[30px] p-3 flex flex-col justify-between relative overflow-hidden border border-slate-800/90">
                    {/* Official Gaenr Screen Wallpaper from user's Drive */}
                    <IphoneWallpaper className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none" />
                    {/* Subtle dark gradient overlay so text and status indicators remain crisp */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/45 z-0 pointer-events-none" />
                    {/* Unified Top Status Bar + Dynamic Island (Camera-Aligned) */}
                    <div className="relative z-30 w-full flex items-center justify-between px-2 pt-0.5 pointer-events-none select-none">
                      {/* Left: Time & WiFi */}
                      <div className="flex items-center gap-1 text-slate-200 shrink-0">
                        <span className="text-[9.5px] font-semibold tracking-tight">10:00</span>
                        <Wifi className="w-2.5 h-2.5 text-slate-300" />
                      </div>

                      {/* Center: Dynamic Island (Front Camera & Sensor) */}
                      <div className="w-16 h-3.5 bg-black rounded-full flex items-center justify-between px-2 border border-slate-800/80 shadow-xs shrink-0 mx-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-900 border border-slate-800" />
                        <div className="w-1 h-1 rounded-full bg-blue-950/80" />
                      </div>

                      {/* Right: Charging Percentage & Battery Icon */}
                      <div className="flex items-center gap-1 text-slate-200 shrink-0">
                        <span className="text-[9px] font-bold text-emerald-300">100%</span>
                        <div className="relative w-3.5 h-2 rounded-[3px] border border-emerald-400 p-[1px] flex items-center">
                          <div className="h-full w-full bg-emerald-400 rounded-[1.5px]" />
                          <div className="absolute -right-[2px] w-[1px] h-0.8 bg-emerald-400 rounded-r-xs" />
                        </div>
                      </div>
                    </div>

                    {/* Lock Screen Time & Date - Gaenr Launch: November 1st */}
                    <div className="text-center pt-6 space-y-0.5 z-10">
                      <div className="text-3xl font-extralight text-white font-mono tracking-tight">
                        10:00
                      </div>
                      <div className="text-[11px] text-sky-200 font-medium">
                        Sunday, November 1st
                      </div>
                    </div>

                    <div className="my-auto" />

                    {/* Home Swipe Indicator */}
                    <div className="w-20 h-1 bg-white/40 rounded-full mx-auto pb-0.5 z-20" />
                  </div>
                </div>

                {/* Compact Floating Notification Popup with Frameless Official Logo */}
                <div className="absolute top-[48%] -translate-y-1/2 -left-3 -right-3 sm:-left-5 sm:-right-5 z-30 pointer-events-auto">
                  <div className="bg-white/85 backdrop-blur-2xl text-slate-900 rounded-xl px-3.5 py-2.5 sm:py-3 shadow-xl border border-white/60 space-y-1 animate-notif text-left ring-1 ring-black/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <GaenrLogo size={20} className="shrink-0" />
                        <span className="font-extrabold text-[11px] text-slate-900 tracking-wider">
                          GAENR
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-400 font-medium">now</span>
                    </div>

                    <div className="pt-0.5 flex items-center justify-between">
                      <div className="text-xs sm:text-[13px] font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                        <span>Payment Received</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
