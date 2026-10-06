import React, { useState, useEffect, useRef } from 'react';
import {
  Building2,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Star,
  Zap,
} from 'lucide-react';

interface Scenario {
  id: string;
  category: string;
  outsourcer: {
    role: 'Outsourcer';
    label: string;
    meta: string;
    text: string;
    status: string;
    posClass: string;
    anchor: { x: number; y: number }; // Percentage coordinate for SVG connection beam
  };
  expert: {
    role: 'Expert';
    label: string;
    meta: string;
    text: string;
    status: string;
    posClass: string;
    anchor: { x: number; y: number }; // Percentage coordinate for SVG connection beam
  };
  outcome: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'ux-ui',
    category: 'UX / UI Design',
    outsourcer: {
      role: 'Outsourcer',
      label: 'Outsourcer',
      meta: 'Fintech Startup • London',
      text: 'Looking for a clean SaaS dashboard redesign & interactive prototype.',
      status: 'Task Brief Submitted',
      posClass: 'top-[3%] left-[1%] sm:left-[0%]',
      anchor: { x: 26, y: 14 },
    },
    expert: {
      role: 'Expert',
      label: 'Expert',
      meta: 'Verified Talent #UI-829 • Dhaka',
      text: 'Wireframes & Figma design system ready for client review! 🎨',
      status: 'Prototype Delivered',
      posClass: 'bottom-[5%] right-[1%] sm:right-[0%]',
      anchor: { x: 74, y: 84 },
    },
    outcome: 'Prototype Approved • Escrow Protected',
  },
  {
    id: 'video',
    category: 'Video Editing',
    outsourcer: {
      role: 'Outsourcer',
      label: 'Outsourcer',
      meta: 'Content Creator • New York',
      text: 'Need dynamic YouTube & short-form video edit with kinetic motion captions.',
      status: 'Active Assignment',
      posClass: 'top-[4%] right-[1%] sm:right-[0%]',
      anchor: { x: 74, y: 15 },
    },
    expert: {
      role: 'Expert',
      label: 'Expert',
      meta: 'Verified Talent #VE-410 • Dhaka',
      text: 'Rendered in 4K with custom sound design & pacing optimized for retention! 🚀',
      status: 'Final Export Ready',
      posClass: 'bottom-[6%] left-[1%] sm:left-[0%]',
      anchor: { x: 26, y: 83 },
    },
    outcome: '100% Satisfaction • 5.0 Star Rated',
  },
  {
    id: 'web',
    category: 'WordPress Website',
    outsourcer: {
      role: 'Outsourcer',
      label: 'Outsourcer',
      meta: 'E-commerce Brand • Singapore',
      text: 'Urgent: High-converting WooCommerce store setup & mobile speed optimization.',
      status: 'Milestone Initiated',
      posClass: 'bottom-[12%] left-[1%] sm:left-[0%]',
      anchor: { x: 26, y: 76 },
    },
    expert: {
      role: 'Expert',
      label: 'Expert',
      meta: 'Verified Talent #WP-320 • Dhaka',
      text: 'Mobile checkout streamlined & Google PageSpeed boosted to 96+! ⚡',
      status: 'Deployed to Production',
      posClass: 'top-[4%] right-[1%] sm:right-[0%]',
      anchor: { x: 74, y: 15 },
    },
    outcome: 'Milestone Verified • Payout Released',
  },
  {
    id: 'graphics',
    category: 'Graphics Design',
    outsourcer: {
      role: 'Outsourcer',
      label: 'Outsourcer',
      meta: 'Digital Agency • Sydney',
      text: 'Need vector brand identity guidelines, social assets, and slide decks.',
      status: 'Brief Confirmed',
      posClass: 'top-[34%] left-[0%] sm:-left-[2%]',
      anchor: { x: 24, y: 44 },
    },
    expert: {
      role: 'Expert',
      label: 'Expert',
      meta: 'Verified Talent #GD-158 • Dhaka',
      text: 'Complete brand guidelines, logos & 3D mockups delivered in vector formats! ✨',
      status: 'Asset Package Delivered',
      posClass: 'top-[38%] right-[0%] sm:-right-[2%]',
      anchor: { x: 76, y: 48 },
    },
    outcome: 'All Deliverables Approved',
  },
];

export const HeroGlobeMessages: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Stages: 'outsourcer' -> 'connecting' -> 'expert' -> 'exiting'
  const [stage, setStage] = useState<'outsourcer' | 'connecting' | 'expert' | 'exiting'>('outsourcer');
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const scenario = SCENARIOS[currentIndex];

  useEffect(() => {
    if (isPaused) return;

    let t1: NodeJS.Timeout;
    let t2: NodeJS.Timeout;
    let t3: NodeJS.Timeout;
    let t4: NodeJS.Timeout;

    // Reset to outsourcer popup
    setStage('outsourcer');

    // After 1400ms: trigger connection beam
    t1 = setTimeout(() => {
      setStage('connecting');
    }, 1400);

    // After 1800ms: expert message pops up
    t2 = setTimeout(() => {
      setStage('expert');
    }, 1800);

    // After 5200ms: both messages gracefully exit upwards
    t3 = setTimeout(() => {
      setStage('exiting');
    }, 5200);

    // After 5800ms: transition to next scenario
    t4 = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % SCENARIOS.length);
      setStage('outsourcer');
    }, 5800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [currentIndex, isPaused]);

  // Compute curved connection path between the two message hubs
  const { anchor: a1 } = scenario.outsourcer;
  const { anchor: a2 } = scenario.expert;
  const mx = (a1.x + a2.x) / 2;
  const my = (a1.y + a2.y) / 2;
  // Arc control point curved toward or through globe center
  const dx = a2.x - a1.x;
  const dy = a2.y - a1.y;
  const cx = mx - dy * 0.16;
  const cy = my + dx * 0.16;
  const beamPath = `M ${a1.x} ${a1.y} Q ${cx} ${cy} ${a2.x} ${a2.y}`;

  const isOutsourcerVisible = stage !== 'exiting';
  const isExpertVisible = (stage === 'connecting' || stage === 'expert') && stage !== 'exiting';
  const isConnected = stage === 'expert';

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="absolute inset-0 z-20 pointer-events-none select-none overflow-visible"
      aria-live="polite"
    >
      {/* Dynamic Animated Connection Beam across the globe */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="globeBeamGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#006eff" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.85" />
          </linearGradient>

          <filter id="beamGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {stage !== 'exiting' && (stage === 'connecting' || stage === 'expert') && (
          <g className="transition-opacity duration-500 opacity-100">
            {/* Glowing background arc */}
            <path
              d={beamPath}
              fill="none"
              stroke="url(#globeBeamGradient)"
              strokeWidth="1.2"
              strokeDasharray="2.5 2.5"
              filter="url(#beamGlow)"
              className="animate-pulse"
            />

            {/* Traveling signal particle */}
            <circle r="1.6" fill="#38bdf8" filter="url(#beamGlow)">
              <animateMotion
                dur="1.4s"
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
          className={`absolute ${scenario.outsourcer.posClass} w-[200px] xs:w-[218px] sm:w-[236px] lg:w-[248px] pointer-events-auto transition-all duration-300 ${
            stage === 'exiting' ? 'animate-hero-pop-out' : 'animate-hero-pop-in'
          }`}
          style={{ willChange: 'transform, opacity' }}
        >
          <div className="relative p-2.5 sm:p-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-blue-200/90 dark:border-blue-500/30 shadow-xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all text-left">
            {/* Ambient subtle corner glow */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />

            {/* Card Header */}
            <div className="flex items-center justify-between gap-1.5 pb-1.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-blue-50 dark:bg-blue-950/60 text-[#006eff] border border-blue-200/80 dark:border-blue-800/80 shrink-0">
                  <Building2 className="w-2.5 h-2.5 shrink-0" />
                  {scenario.outsourcer.label}
                </span>
              </div>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate text-right">
                {scenario.outsourcer.meta}
              </span>
            </div>

            {/* Card Message Body */}
            <p className="mt-2 text-[11px] sm:text-xs font-medium text-slate-800 dark:text-slate-100 leading-snug">
              &ldquo;{scenario.outsourcer.text}&rdquo;
            </p>

            {/* Bottom Status & Connection Pill */}
            <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
              <span className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping inline-block" />
                {scenario.outsourcer.status}
              </span>
              <span className="text-[9px] text-slate-400 font-mono">
                {scenario.category}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Expert Perspective Pop-up Card */}
      {isExpertVisible && (
        <div
          className={`absolute ${scenario.expert.posClass} w-[200px] xs:w-[218px] sm:w-[236px] lg:w-[248px] pointer-events-auto transition-all duration-300 ${
            stage === 'exiting' ? 'animate-hero-pop-out' : 'animate-hero-pop-in'
          }`}
          style={{ willChange: 'transform, opacity' }}
        >
          <div className="relative p-2.5 sm:p-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-emerald-200/90 dark:border-emerald-500/30 shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all text-left">
            {/* Ambient subtle corner glow */}
            <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

            {/* Card Header */}
            <div className="flex items-center justify-between gap-1.5 pb-1.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80 shrink-0">
                  <Sparkles className="w-2.5 h-2.5 shrink-0" />
                  {scenario.expert.label}
                </span>
              </div>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate text-right">
                {scenario.expert.meta}
              </span>
            </div>

            {/* In Reply / Connection Tag */}
            <div className="mt-1 flex items-center gap-1 text-[9px] text-slate-400 font-medium">
              <span className="text-emerald-500 font-bold">↳</span>
              <span>Connected with Outsourcer</span>
            </div>

            {/* Card Message Body */}
            <p className="mt-1 text-[11px] sm:text-xs font-semibold text-slate-800 dark:text-slate-100 leading-snug">
              &ldquo;{scenario.expert.text}&rdquo;
            </p>

            {/* Bottom Status & Escrow Pill */}
            <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                {scenario.expert.status}
              </span>
              <span className="text-[9px] font-bold text-slate-500 flex items-center gap-0.5">
                <ShieldCheck className="w-2.5 h-2.5 text-blue-500" />
                Escrow
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Mini Interactive Progress Indicators (Bottom Center) */}
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 pointer-events-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800/60 shadow-xs z-30">
        <span className="text-[9px] font-bold text-slate-500 tracking-wider uppercase mr-1 hidden xs:inline">
          Live Ecosystem:
        </span>
        {SCENARIOS.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => {
              setCurrentIndex(idx);
              setStage('outsourcer');
            }}
            title={s.category}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              idx === currentIndex
                ? 'w-5 h-1.5 bg-[#006eff]'
                : 'w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
