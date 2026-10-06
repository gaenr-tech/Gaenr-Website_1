import React, { useState, useEffect } from 'react';

interface MessagePill {
  id: string;
  role: 'Outsourcer' | 'Expert';
  location: string;
  message: string;
  avatarUrl: string;
  posClass: string;
  anchor: { x: number; y: number };
}

interface MessagePair {
  id: string;
  category: string;
  outsourcer: MessagePill;
  expert: MessagePill;
}

// 4 Diverse Connected Pairs inspired directly by the Pinterest Orbit Community Capsule design
const MESSAGE_PAIRS: MessagePair[] = [
  {
    id: 'pair-ui',
    category: 'UX / UI Design',
    outsourcer: {
      id: 'out-1',
      role: 'Outsourcer',
      location: 'London',
      message: 'Need a clean SaaS dashboard redesign',
      avatarUrl: '/images/avatars/student_male_4.png',
      posClass: 'top-[4%] left-[-1%] sm:left-[1%]',
      anchor: { x: 25, y: 12 },
    },
    expert: {
      id: 'exp-1',
      role: 'Expert',
      location: 'Dhaka',
      message: 'Interactive Figma prototype ready! 🎨',
      avatarUrl: '/images/avatars/student_female_1.png',
      posClass: 'bottom-[6%] right-[-1%] sm:right-[1%]',
      anchor: { x: 75, y: 86 },
    },
  },
  {
    id: 'pair-video',
    category: 'Video Editing',
    outsourcer: {
      id: 'out-2',
      role: 'Outsourcer',
      location: 'New York',
      message: 'Looking for dynamic 4K YouTube edits',
      avatarUrl: '/images/avatars/student_male_2.png',
      posClass: 'top-[6%] right-[-1%] sm:right-[1%]',
      anchor: { x: 75, y: 15 },
    },
    expert: {
      id: 'exp-2',
      role: 'Expert',
      location: 'Dhaka',
      message: 'Colour-graded & sound FX exported 🎬',
      avatarUrl: '/images/avatars/student_male_1.png',
      posClass: 'bottom-[8%] left-[-1%] sm:left-[1%]',
      anchor: { x: 25, y: 84 },
    },
  },
  {
    id: 'pair-web',
    category: 'WordPress Website',
    outsourcer: {
      id: 'out-3',
      role: 'Outsourcer',
      location: 'Singapore',
      message: 'WooCommerce store speed optimization',
      avatarUrl: '/images/avatars/student_female_4.png',
      posClass: 'top-[36%] left-[-2%] sm:left-[0%]',
      anchor: { x: 24, y: 44 },
    },
    expert: {
      id: 'exp-3',
      role: 'Expert',
      location: 'Dhaka',
      message: 'Google PageSpeed boosted to 98! ⚡',
      avatarUrl: '/images/avatars/student_male_3.png',
      posClass: 'top-[40%] right-[-2%] sm:right-[0%]',
      anchor: { x: 76, y: 48 },
    },
  },
  {
    id: 'pair-deck',
    category: 'Slide Deck & Escrow',
    outsourcer: {
      id: 'out-4',
      role: 'Outsourcer',
      location: 'Sydney',
      message: 'Need 15-slide investor pitch deck',
      avatarUrl: '/images/avatars/student_female_2.png',
      posClass: 'bottom-[12%] left-[-1%] sm:left-[1%]',
      anchor: { x: 25, y: 76 },
    },
    expert: {
      id: 'exp-4',
      role: 'Expert',
      location: 'Dhaka',
      message: 'Slides ready • 5.0 ★ Rating approved! 📊',
      avatarUrl: '/images/avatars/student_female_5.png',
      posClass: 'top-[5%] right-[-1%] sm:right-[1%]',
      anchor: { x: 75, y: 14 },
    },
  },
];

export const HeroGlobeMessages: React.FC = () => {
  const [pairIndex, setPairIndex] = useState(0);
  // 'first' -> 'second' -> 'exit'
  const [phase, setPhase] = useState<'first' | 'second' | 'exit'>('first');

  const currentPair = MESSAGE_PAIRS[pairIndex];

  useEffect(() => {
    let t1: NodeJS.Timeout;
    let t2: NodeJS.Timeout;
    let t3: NodeJS.Timeout;

    // 0ms: First message (Outsourcer) pops up
    setPhase('first');

    // 1100ms: Second message (Expert) pops up connecting across globe
    t1 = setTimeout(() => {
      setPhase('second');
    }, 1100);

    // 4400ms: Both smoothly pop out
    t2 = setTimeout(() => {
      setPhase('exit');
    }, 4400);

    // 4900ms: Cycle to next message pair
    t3 = setTimeout(() => {
      setPairIndex((prev) => (prev + 1) % MESSAGE_PAIRS.length);
      setPhase('first');
    }, 4900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [pairIndex]);

  // Compute curved connection beam across the globe
  const a1 = currentPair.outsourcer.anchor;
  const a2 = currentPair.expert.anchor;
  const mx = (a1.x + a2.x) / 2;
  const my = (a1.y + a2.y) / 2;
  const dx = a2.x - a1.x;
  const dy = a2.y - a1.y;
  const cx = mx - dy * 0.15;
  const cy = my + dx * 0.15;
  const beamPath = `M ${a1.x} ${a1.y} Q ${cx} ${cy} ${a2.x} ${a2.y}`;

  const isFirstVisible = phase !== 'exit';
  const isSecondVisible = phase === 'second';

  return (
    <div
      className="absolute inset-0 z-20 pointer-events-none select-none overflow-visible"
      aria-hidden="true"
    >
      {/* Curved Orbital Connection Beam between the two popping pills */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="orbitBeamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#006eff" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#0d9488" stopOpacity="0.85" />
          </linearGradient>

          <filter id="orbitGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {phase === 'second' && (
          <g className="transition-opacity duration-300 opacity-100">
            {/* Glowing connection line */}
            <path
              d={beamPath}
              fill="none"
              stroke="url(#orbitBeamGrad)"
              strokeWidth="1.2"
              strokeDasharray="2.5 2.5"
              filter="url(#orbitGlow)"
              className="animate-pulse"
            />

            {/* Traveling signal light particle */}
            <circle r="1.5" fill="#38bdf8" filter="url(#orbitGlow)">
              <animateMotion
                dur="1.2s"
                repeatCount="indefinite"
                path={beamPath}
              />
            </circle>

            {/* Glowing node at ends */}
            <circle cx={a1.x} cy={a1.y} r="1.6" fill="#006eff" />
            <circle cx={a2.x} cy={a2.y} r="1.6" fill="#0d9488" />
          </g>
        )}
      </svg>

      {/* Outsourcer Capsule Pill */}
      {isFirstVisible && (
        <div
          className={`absolute ${currentPair.outsourcer.posClass} pointer-events-none transition-all duration-300 ${
            phase === 'exit' ? 'animate-hero-pop-out' : 'animate-hero-pop-in'
          }`}
          style={{ willChange: 'transform, opacity' }}
        >
          <div className="group relative flex items-center gap-2 sm:gap-2.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-full bg-gradient-to-r from-[#004cb5]/95 via-[#0066d6]/95 to-[#0284c7]/95 border border-white/35 shadow-xl shadow-blue-600/25 backdrop-blur-md transition-transform duration-200">
            {/* Glowing Orbital Anchor Node */}
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-300 border border-white" />
            </span>

            {/* Circular Avatar on Left */}
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden shrink-0 border-2 border-white/90 shadow-xs bg-slate-800">
              <img
                src={currentPair.outsourcer.avatarUrl}
                alt={currentPair.outsourcer.role}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/images/avatars/student_male_1.png';
                }}
              />
            </div>

            {/* Text on Right (2 Lines) */}
            <div className="flex flex-col text-left pr-1.5 min-w-0 max-w-[165px] xs:max-w-[190px] sm:max-w-[215px]">
              <div className="flex items-center gap-1 leading-none mb-0.5">
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-white">
                  {currentPair.outsourcer.role}
                </span>
                <span className="text-[9px] sm:text-[10px] text-cyan-200 font-medium truncate">
                  • {currentPair.outsourcer.location}
                </span>
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-white truncate leading-tight tracking-tight">
                {currentPair.outsourcer.message}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Expert Capsule Pill */}
      {isSecondVisible && (
        <div
          className={`absolute ${currentPair.expert.posClass} pointer-events-none transition-all duration-300 ${
            phase === 'exit' ? 'animate-hero-pop-out' : 'animate-hero-pop-in'
          }`}
          style={{ willChange: 'transform, opacity' }}
        >
          <div className="group relative flex items-center gap-2 sm:gap-2.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-full bg-gradient-to-r from-[#0062be]/95 via-[#0284c7]/95 to-[#0d9488]/95 border border-white/35 shadow-xl shadow-cyan-600/25 backdrop-blur-md transition-transform duration-200">
            {/* Glowing Orbital Anchor Node */}
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-300 border border-white" />
            </span>

            {/* Circular Avatar on Left */}
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden shrink-0 border-2 border-white/90 shadow-xs bg-slate-800">
              <img
                src={currentPair.expert.avatarUrl}
                alt={currentPair.expert.role}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/images/avatars/student_female_1.png';
                }}
              />
            </div>

            {/* Text on Right (2 Lines) */}
            <div className="flex flex-col text-left pr-1.5 min-w-0 max-w-[165px] xs:max-w-[190px] sm:max-w-[215px]">
              <div className="flex items-center gap-1 leading-none mb-0.5">
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-white">
                  {currentPair.expert.role}
                </span>
                <span className="text-[9px] sm:text-[10px] text-emerald-200 font-medium truncate">
                  • {currentPair.expert.location}
                </span>
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-white truncate leading-tight tracking-tight">
                {currentPair.expert.message}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
