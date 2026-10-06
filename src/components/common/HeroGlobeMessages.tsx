import React, { useState, useEffect } from 'react';
import {
  Building2,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Star,
  Presentation,
  Video,
  Layout,
  Globe2,
} from 'lucide-react';

interface Scenario {
  id: string;
  category: string;
  outsourcer: {
    label: string;
    meta: string;
    text: string;
    badge: string;
    posClass: string;
    anchor: { x: number; y: number };
  };
  expert: {
    label: string;
    meta: string;
    text: string;
    badge: string;
    posClass: string;
    anchor: { x: number; y: number };
  };
}

// Fixed curated messaging animation representing diverse project types & collaboration
const SCENARIOS: Scenario[] = [
  {
    id: 'presentation',
    category: 'Presentation Slide Design',
    outsourcer: {
      label: 'Outsourcer',
      meta: 'Fintech Founder • London',
      text: 'Need a 15-slide investor pitch deck redesigned for our seed funding round.',
      badge: 'Brief Assigned',
      posClass: 'top-[3%] left-[1%] sm:left-[0%]',
      anchor: { x: 26, y: 14 },
    },
    expert: {
      label: 'Expert',
      meta: 'Verified Talent #SL-204 • Dhaka',
      text: 'Slide deck completed with custom 3D charts & clean visual storytelling! 📊',
      badge: 'Delivered in 24h',
      posClass: 'bottom-[5%] right-[1%] sm:right-[0%]',
      anchor: { x: 74, y: 84 },
    },
  },
  {
    id: 'video',
    category: 'Video Editing',
    outsourcer: {
      label: 'Outsourcer',
      meta: 'YouTube Creator • New York',
      text: 'Looking for dynamic 4K video editing with kinetic captions & retention hooks.',
      badge: 'Task In Progress',
      posClass: 'top-[4%] right-[1%] sm:right-[0%]',
      anchor: { x: 74, y: 15 },
    },
    expert: {
      label: 'Expert',
      meta: 'Verified Talent #VE-512 • Dhaka',
      text: 'Rendered in 4K with custom sound design & viral kinetic typography! 🎬',
      badge: '4K Cut Exported',
      posClass: 'bottom-[6%] left-[1%] sm:left-[0%]',
      anchor: { x: 26, y: 83 },
    },
  },
  {
    id: 'ux-ui',
    category: 'UX & UI Design',
    outsourcer: {
      label: 'Outsourcer',
      meta: 'SaaS Startup • San Francisco',
      text: 'Need clean web & mobile dashboard UI wireframes with responsive tokens.',
      badge: 'Milestone 1',
      posClass: 'bottom-[12%] left-[1%] sm:left-[0%]',
      anchor: { x: 26, y: 76 },
    },
    expert: {
      label: 'Expert',
      meta: 'Verified Talent #UI-829 • Dhaka',
      text: 'Interactive Figma prototype & component kit delivered for your review! 🎨',
      badge: 'Figma Ready',
      posClass: 'top-[3%] right-[1%] sm:right-[0%]',
      anchor: { x: 74, y: 14 },
    },
  },
  {
    id: 'wordpress',
    category: 'WordPress Website',
    outsourcer: {
      label: 'Outsourcer',
      meta: 'E-Commerce Brand • Singapore',
      text: 'Urgent: WooCommerce checkout speed optimization & mobile checkout fixes.',
      badge: 'Escrow Funded',
      posClass: 'top-[34%] left-[0%] sm:-left-[2%]',
      anchor: { x: 24, y: 44 },
    },
    expert: {
      label: 'Expert',
      meta: 'Verified Talent #WP-320 • Dhaka',
      text: 'Google PageSpeed boosted to 98! Checkout bottleneck fully resolved ⚡',
      badge: '98+ PageScore',
      posClass: 'top-[38%] right-[0%] sm:-right-[2%]',
      anchor: { x: 76, y: 48 },
    },
  },
  {
    id: 'graphics',
    category: 'Graphics Design',
    outsourcer: {
      label: 'Outsourcer',
      meta: 'Brand Agency • Sydney',
      text: 'Need brand identity guidelines, marketing slide decks & vector logo kit.',
      badge: 'Brief Confirmed',
      posClass: 'top-[4%] left-[1%] sm:left-[0%]',
      anchor: { x: 26, y: 15 },
    },
    expert: {
      label: 'Expert',
      meta: 'Verified Talent #GD-741 • Dhaka',
      text: 'Vector logo package, color palette & realistic 3D mockups delivered! ✨',
      badge: 'Vector Suite Ready',
      posClass: 'bottom-[5%] right-[1%] sm:right-[0%]',
      anchor: { x: 74, y: 84 },
    },
  },
  {
    id: 'approval',
    category: 'Escrow Protected Milestone',
    outsourcer: {
      label: 'Outsourcer',
      meta: 'Product Studio • Toronto',
      text: 'All final deliverables approved. Milestone verified & escrow payout released! ✅',
      badge: 'Escrow Released',
      posClass: 'bottom-[6%] right-[1%] sm:right-[0%]',
      anchor: { x: 74, y: 84 },
    },
    expert: {
      label: 'Expert',
      meta: 'Verified Talent #GA-109 • Dhaka',
      text: 'Payout received! 5.0 ★ review & rating recorded on verified expert profile.',
      badge: '5.0 ★ Rated',
      posClass: 'top-[4%] left-[1%] sm:left-[0%]',
      anchor: { x: 26, y: 15 },
    },
  },
];

export const HeroGlobeMessages: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Stages: 'outsourcer' -> 'connecting' -> 'expert' -> 'exiting'
  const [stage, setStage] = useState<'outsourcer' | 'connecting' | 'expert' | 'exiting'>('outsourcer');

  const scenario = SCENARIOS[currentIndex];

  useEffect(() => {
    let t1: NodeJS.Timeout;
    let t2: NodeJS.Timeout;
    let t3: NodeJS.Timeout;
    let t4: NodeJS.Timeout;

    // Phase 1: Outsourcer pops up immediately from zero
    setStage('outsourcer');

    // Phase 2: After 1200ms, connector line animates across the globe
    t1 = setTimeout(() => {
      setStage('connecting');
    }, 1200);

    // Phase 3: After 1600ms, Expert card pops up from zero connecting to it
    t2 = setTimeout(() => {
      setStage('expert');
    }, 1600);

    // Phase 4: After 4600ms, both cards smoothly float up & fade out
    t3 = setTimeout(() => {
      setStage('exiting');
    }, 4600);

    // Phase 5: After 5100ms, cycle to next scenario seamlessly
    t4 = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % SCENARIOS.length);
      setStage('outsourcer');
    }, 5100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [currentIndex]);

  // Compute curved connection path between the two message hubs
  const { anchor: a1 } = scenario.outsourcer;
  const { anchor: a2 } = scenario.expert;
  const mx = (a1.x + a2.x) / 2;
  const my = (a1.y + a2.y) / 2;
  const dx = a2.x - a1.x;
  const dy = a2.y - a1.y;
  const cx = mx - dy * 0.16;
  const cy = my + dx * 0.16;
  const beamPath = `M ${a1.x} ${a1.y} Q ${cx} ${cy} ${a2.x} ${a2.y}`;

  const isOutsourcerVisible = stage !== 'exiting';
  const isExpertVisible = (stage === 'connecting' || stage === 'expert') && stage !== 'exiting';

  return (
    <div
      className="absolute inset-0 z-20 pointer-events-none select-none overflow-visible"
      aria-hidden="true"
    >
      {/* Animated Connection Beam across the globe connecting Outsourcer & Expert */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="heroGlobeBeamGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#006eff" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
          </linearGradient>

          <filter id="heroBeamGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {stage !== 'exiting' && (stage === 'connecting' || stage === 'expert') && (
          <g className="transition-opacity duration-300 opacity-100">
            {/* Glowing background arc */}
            <path
              d={beamPath}
              fill="none"
              stroke="url(#heroGlobeBeamGradient)"
              strokeWidth="1.2"
              strokeDasharray="2.5 2.5"
              filter="url(#heroBeamGlow)"
              className="animate-pulse"
            />

            {/* Traveling signal particle */}
            <circle r="1.6" fill="#38bdf8" filter="url(#heroBeamGlow)">
              <animateMotion
                dur="1.3s"
                repeatCount="indefinite"
                path={beamPath}
              />
            </circle>

            {/* Hub Anchor Pulses */}
            <circle cx={a1.x} cy={a1.y} r="1.8" fill="#006eff" />
            <circle cx={a1.x} cy={a1.y} r="3.6" fill="none" stroke="#006eff" strokeWidth="0.5" className="animate-ping" />

            <circle cx={a2.x} cy={a2.y} r="1.8" fill="#10b981" />
            <circle cx={a2.x} cy={a2.y} r="3.6" fill="none" stroke="#10b981" strokeWidth="0.5" className="animate-ping" />
          </g>
        )}
      </svg>

      {/* Outsourcer Perspective Pop-up Card */}
      {isOutsourcerVisible && (
        <div
          className={`absolute ${scenario.outsourcer.posClass} w-[190px] xs:w-[212px] sm:w-[230px] lg:w-[242px] pointer-events-none transition-all duration-300 ${
            stage === 'exiting' ? 'animate-hero-pop-out' : 'animate-hero-pop-in'
          }`}
          style={{ willChange: 'transform, opacity' }}
        >
          <div className="relative p-2.5 sm:p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-blue-200/90 shadow-xl shadow-blue-500/10 text-left">
            {/* Subtle ambient lighting */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />

            {/* Card Header with Outsourcer Badge */}
            <div className="flex items-center justify-between gap-1.5 pb-1.5 border-b border-slate-100">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-blue-50 text-[#006eff] border border-blue-200/80 shrink-0">
                <Building2 className="w-2.5 h-2.5 shrink-0" />
                {scenario.outsourcer.label}
              </span>
              <span className="text-[10px] font-medium text-slate-500 truncate text-right">
                {scenario.outsourcer.meta}
              </span>
            </div>

            {/* Message Body */}
            <p className="mt-2 text-[11px] sm:text-xs font-semibold text-slate-800 leading-snug">
              &ldquo;{scenario.outsourcer.text}&rdquo;
            </p>

            {/* Status Pill */}
            <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
              <span className="font-semibold text-blue-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping inline-block" />
                {scenario.outsourcer.badge}
              </span>
              <span className="text-[9px] text-slate-400 font-mono truncate max-w-[90px]">
                {scenario.category}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Expert Perspective Pop-up Card */}
      {isExpertVisible && (
        <div
          className={`absolute ${scenario.expert.posClass} w-[190px] xs:w-[212px] sm:w-[230px] lg:w-[242px] pointer-events-none transition-all duration-300 ${
            stage === 'exiting' ? 'animate-hero-pop-out' : 'animate-hero-pop-in'
          }`}
          style={{ willChange: 'transform, opacity' }}
        >
          <div className="relative p-2.5 sm:p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-emerald-200/90 shadow-xl shadow-emerald-500/10 text-left">
            {/* Subtle ambient lighting */}
            <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

            {/* Card Header with Expert Badge */}
            <div className="flex items-center justify-between gap-1.5 pb-1.5 border-b border-slate-100">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-emerald-50 text-emerald-600 border border-emerald-200/80 shrink-0">
                <Sparkles className="w-2.5 h-2.5 shrink-0" />
                {scenario.expert.label}
              </span>
              <span className="text-[10px] font-medium text-slate-500 truncate text-right">
                {scenario.expert.meta}
              </span>
            </div>

            {/* Connection Link */}
            <div className="mt-1 flex items-center gap-1 text-[9px] text-slate-400 font-medium">
              <span className="text-emerald-500 font-bold">↳</span>
              <span>Matched with Outsourcer</span>
            </div>

            {/* Message Body */}
            <p className="mt-1 text-[11px] sm:text-xs font-semibold text-slate-800 leading-snug">
              &ldquo;{scenario.expert.text}&rdquo;
            </p>

            {/* Status & Escrow Badge */}
            <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                {scenario.expert.badge}
              </span>
              <span className="text-[9px] font-bold text-slate-500 flex items-center gap-0.5">
                <ShieldCheck className="w-2.5 h-2.5 text-blue-500" />
                Escrow
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
