import React from 'react';

interface AnimatedIconProps {
  className?: string;
}

/* =========================================================================
   GAENR COMPREHENSIVE ANIMATED ICONS
   - Container stays completely still
   - Only the specific internal parts of the icons animate
   ========================================================================= */

// --- 1. GRAPHICS DESIGN ---

export const AnimatedSparkles: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path
      d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"
      className="origin-center animate-[sparkleMain_2.8s_ease-in-out_infinite]"
    />
    <g className="origin-[19px_5px] animate-[starTwinkle_2.2s_ease-in-out_infinite_0.4s]">
      <path d="M19 2v4" />
      <path d="M17 4h4" />
    </g>
    <g className="origin-[5px_19px] animate-[starTwinkle_2.4s_ease-in-out_infinite_1.2s]">
      <path d="M5 17v4" />
      <path d="M3 19h4" />
    </g>
  </svg>
);

export const AnimatedPalette: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    <circle cx="13.5" cy="6.5" r="1.2" fill="currentColor" className="origin-[13.5px_6.5px] animate-[dotPop_2.2s_ease-in-out_infinite_0s]" />
    <circle cx="17.5" cy="10.5" r="1.2" fill="currentColor" className="origin-[17.5px_10.5px] animate-[dotPop_2.2s_ease-in-out_infinite_0.4s]" />
    <circle cx="8.5" cy="7.5" r="1.2" fill="currentColor" className="origin-[8.5px_7.5px] animate-[dotPop_2.2s_ease-in-out_infinite_0.8s]" />
    <circle cx="6.5" cy="12.5" r="1.2" fill="currentColor" className="origin-[6.5px_12.5px] animate-[dotPop_2.2s_ease-in-out_infinite_1.2s]" />
  </svg>
);

export const AnimatedBox: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.29 7 12 12 20.71 7" />
    <line x1="12" y1="22" x2="12" y2="12" />
    <path d="M12 12l4.5-2.5" className="origin-[12px_12px] animate-[boxFlap_3s_ease-in-out_infinite]" />
    <path d="M12 12l-4.5-2.5" className="origin-[12px_12px] animate-[boxFlap_3s_ease-in-out_infinite_0.15s]" />
  </svg>
);

export const AnimatedFileText: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <line x1="8" y1="11" x2="16" y2="11" className="origin-left animate-[lineSweep_2.6s_ease-in-out_infinite_0s]" />
    <line x1="8" y1="14" x2="16" y2="14" className="origin-left animate-[lineSweep_2.6s_ease-in-out_infinite_0.4s]" />
    <line x1="8" y1="17" x2="12" y2="17" className="origin-left animate-[lineSweep_2.6s_ease-in-out_infinite_0.8s]" />
  </svg>
);

export const AnimatedMaximize2: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <g className="animate-[expandTR_2.6s_ease-in-out_infinite]">
      <polyline points="15 3 21 3 21 9" />
      <line x1="21" y1="3" x2="14" y2="10" />
    </g>
    <g className="animate-[expandBL_2.6s_ease-in-out_infinite]">
      <polyline points="9 21 3 21 3 15" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </g>
  </svg>
);

export const AnimatedPenTool: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 21c3-2 6-2 9 0" className="animate-[drawCurve_3s_ease-in-out_infinite]" strokeDasharray="14" />
    <g className="origin-[12px_19px] animate-[penTip_3s_ease-in-out_infinite]">
      <path d="m12 19 7-7 3 3-7 7-3-3z" />
      <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="m2 2 7.586 7.586" />
      <circle cx="11" cy="11" r="1.5" fill="currentColor" />
    </g>
  </svg>
);

// --- 2. CONTENT WRITING ---

export const AnimatedGlobe: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path
      d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"
      className="origin-center animate-[globeShift_3.5s_ease-in-out_infinite]"
    />
    <line x1="2" y1="12" x2="22" y2="12" className="animate-[equatorPulse_2.5s_ease-in-out_infinite]" />
  </svg>
);

export const AnimatedBookOpen: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path
      d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
      className="origin-[12px_7px] animate-[pageFlutter_2.8s_ease-in-out_infinite]"
    />
  </svg>
);

export const AnimatedShoppingBag: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path
      d="M16 10a4 4 0 0 1-8 0"
      className="origin-top animate-[handleSway_2.4s_ease-in-out_infinite]"
    />
  </svg>
);

export const AnimatedMessageSquare: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <circle cx="8" cy="10" r="1.2" fill="currentColor" className="origin-[8px_10px] animate-[dotPop_2s_ease-in-out_infinite_0s]" />
    <circle cx="12" cy="10" r="1.2" fill="currentColor" className="origin-[12px_10px] animate-[dotPop_2s_ease-in-out_infinite_0.35s]" />
    <circle cx="16" cy="10" r="1.2" fill="currentColor" className="origin-[16px_10px] animate-[dotPop_2s_ease-in-out_infinite_0.7s]" />
  </svg>
);

export const AnimatedMail: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path
      d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
      className="origin-[12px_4px] animate-[mailFlap_3s_ease-in-out_infinite]"
    />
  </svg>
);

export const AnimatedBuilding: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
    <path d="M6 12H4a2 2 0 0 0-2 2v8h4" />
    <path d="M18 9h2a2 2 0 0 1 2 2v11h-4" />
    <path d="M10 6h4" className="animate-[windowGlow_2.4s_ease-in-out_infinite_0s]" />
    <path d="M10 10h4" className="animate-[windowGlow_2.4s_ease-in-out_infinite_0.4s]" />
    <path d="M10 14h4" className="animate-[windowGlow_2.4s_ease-in-out_infinite_0.8s]" />
    <path d="M10 18h4" className="animate-[windowGlow_2.4s_ease-in-out_infinite_1.2s]" />
  </svg>
);

// --- 3. VIDEO EDITING ---

export const AnimatedFilm: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <line x1="7" x2="7" y1="3" y2="21" />
    <line x1="17" x2="17" y1="3" y2="21" />
    <line x1="3" x2="7" y1="9" y2="9" className="animate-[filmScroll_2.5s_linear_infinite]" />
    <line x1="3" x2="7" y1="15" y2="15" className="animate-[filmScroll_2.5s_linear_infinite]" />
    <line x1="17" x2="21" y1="9" y2="9" className="animate-[filmScroll_2.5s_linear_infinite]" />
    <line x1="17" x2="21" y1="15" y2="15" className="animate-[filmScroll_2.5s_linear_infinite]" />
  </svg>
);

export const AnimatedSmartphone: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
    <path d="M12 18h.01" />
    <line
      x1="9"
      y1="8"
      x2="15"
      y2="8"
      className="animate-[phoneSwipe_2.2s_ease-in-out_infinite]"
    />
  </svg>
);

export const AnimatedVideo: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
    <rect x="2" y="6" width="14" height="12" rx="2" />
    {/* Blinking REC indicator dot */}
    <circle cx="6" cy="10" r="1.5" fill="#ef4444" className="animate-[recBlink_1.3s_infinite]" />
  </svg>
);

export const AnimatedMic: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="22" />
    {/* Sound wave arcs on sides */}
    <path d="M21 8a10 10 0 0 1 0 8" className="animate-[soundWave_2s_ease-in-out_infinite]" />
    <path d="M3 8a10 10 0 0 0 0 8" className="animate-[soundWave_2s_ease-in-out_infinite_0.4s]" />
  </svg>
);

export const AnimatedType: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="4 7 4 4 20 4 20 7" />
    <line x1="9" y1="20" x2="15" y2="20" />
    <line x1="12" y1="4" x2="12" y2="20" />
    {/* Blinking text cursor bar */}
    <line x1="18" y1="11" x2="18" y2="18" className="animate-[cursorBlink_1s_steps(2,start)_infinite]" />
  </svg>
);

export const AnimatedSliders: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="4" y1="21" x2="4" y2="14" />
    <line x1="4" y1="10" x2="4" y2="3" />
    <circle cx="4" cy="12" r="2" fill="currentColor" className="animate-[thumbSlide_2.8s_ease-in-out_infinite]" />
    <line x1="12" y1="21" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12" y2="3" />
    <circle cx="12" cy="10" r="2" fill="currentColor" className="animate-[thumbSlideRev_2.3s_ease-in-out_infinite]" />
    <line x1="20" y1="21" x2="20" y2="16" />
    <line x1="20" y1="12" x2="20" y2="3" />
    <circle cx="20" cy="14" r="2" fill="currentColor" className="animate-[thumbSlide_3.2s_ease-in-out_infinite_0.4s]" />
  </svg>
);

// --- 4. WORDPRESS WEBSITE ---

export const AnimatedLayout: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M3 9h18" className="animate-[layoutBlock_2.5s_ease-in-out_infinite_0s]" />
    <path d="M9 21V9" className="animate-[layoutBlock_2.5s_ease-in-out_infinite_0.4s]" />
  </svg>
);

export const AnimatedShoppingCart: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="8" cy="21" r="1.5" fill="currentColor" className="origin-[8px_21px] animate-[wheelSpin_3s_linear_infinite]" />
    <circle cx="19" cy="21" r="1.5" fill="currentColor" className="origin-[19px_21px] animate-[wheelSpin_3s_linear_infinite]" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </svg>
);

export const AnimatedRocket: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    <path d="m3 21 2-2" className="origin-[3px_21px] animate-[flameFlicker_1.4s_ease-in-out_infinite]" />
  </svg>
);

export const AnimatedZap: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" className="origin-center animate-[zapFlash_2s_ease-in-out_infinite]" />
  </svg>
);

export const AnimatedShieldCheck: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" className="origin-center animate-[checkPop_2.4s_ease-in-out_infinite]" />
  </svg>
);

export const AnimatedCreditCard: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
    <rect x="5" y="14" width="4" height="2" fill="currentColor" className="animate-[chipGlint_2.5s_ease-in-out_infinite]" />
  </svg>
);

// --- 5. PRESENTATION SLIDE DESIGN ---

export const AnimatedBriefcase: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    <rect width="20" height="14" x="2" y="6" rx="2" />
    <circle cx="12" cy="13" r="1.5" fill="currentColor" className="animate-[latchClick_2.4s_ease-in-out_infinite]" />
  </svg>
);

export const AnimatedBarChart: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="20" x2="18" y2="10" className="origin-bottom animate-[barRise_2.4s_ease-in-out_infinite_0.6s]" />
    <line x1="12" y1="20" x2="12" y2="4" className="origin-bottom animate-[barRise_2.4s_ease-in-out_infinite_0.3s]" />
    <line x1="6" y1="20" x2="6" y2="14" className="origin-bottom animate-[barRise_2.4s_ease-in-out_infinite_0s]" />
  </svg>
);

export const AnimatedPresentation: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 3h20" />
    <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" />
    <path d="m7 21 5-5 5 5" />
    {/* Pulsing laser / projector highlight dot */}
    <circle cx="12" cy="9" r="1.5" fill="currentColor" className="animate-[laserDot_2.2s_ease-in-out_infinite]" />
  </svg>
);

export const AnimatedLineChart: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 3v18h18" />
    <path d="m19 9-5 5-4-4-3 3" className="animate-[lineDraw_2.8s_ease-in-out_infinite]" strokeDasharray="20" />
    <circle cx="19" cy="9" r="1.5" fill="currentColor" className="animate-[dotPop_2.8s_ease-in-out_infinite_1.4s]" />
  </svg>
);

export const AnimatedCopy: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path
      d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
      className="animate-[copySlide_2.6s_ease-in-out_infinite]"
    />
  </svg>
);

export const AnimatedMonitor: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="14" x="2" y="3" rx="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
    <line x1="5" y1="10" x2="19" y2="10" className="animate-[screenScan_2.4s_ease-in-out_infinite]" />
  </svg>
);

// --- 6. UX / UI DESIGN ---

export const AnimatedLayoutDashboard: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="7" height="9" x="3" y="3" rx="1" className="animate-[dashWidget_2.6s_ease-in-out_infinite_0s]" />
    <rect width="7" height="5" x="14" y="3" rx="1" className="animate-[dashWidget_2.6s_ease-in-out_infinite_0.4s]" />
    <rect width="7" height="9" x="14" y="12" rx="1" className="animate-[dashWidget_2.6s_ease-in-out_infinite_0.8s]" />
    <rect width="7" height="5" x="3" y="16" rx="1" className="animate-[dashWidget_2.6s_ease-in-out_infinite_1.2s]" />
  </svg>
);

export const AnimatedWorkflow: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="8" height="8" x="3" y="3" rx="2" />
    <path d="M7 11v4a2 2 0 0 0 2 2h4" />
    <rect width="8" height="8" x="13" y="13" rx="2" />
    <circle cx="10" cy="17" r="1.5" fill="currentColor" className="animate-[packetFlow_2s_ease-in-out_infinite]" />
  </svg>
);

export const AnimatedLayers: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 2 7 12 12 22 7 12 2" className="animate-[layerUp_2.8s_ease-in-out_infinite]" />
    <polyline points="2 12 12 17 22 12" />
    <polyline points="2 17 12 22 22 17" className="animate-[layerDown_2.8s_ease-in-out_infinite]" />
  </svg>
);

export const AnimatedMousePointerClick: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="9" cy="9" r="3" className="origin-[9px_9px] animate-[clickRipple_2.2s_ease-out_infinite]" />
    <path d="m9 9 5 12 1.8-5.2L21 14Z" className="origin-[9px_9px] animate-[pointerTap_2.2s_ease-in-out_infinite]" />
  </svg>
);

export const AnimatedCheckSquare: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="9 11 12 14 22 4" className="animate-[checkPop_2.4s_ease-in-out_infinite]" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);

// --- 7. AD RUNNING ---

export const AnimatedMegaphone: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m3 11 18-5v12L3 14v-3z" />
    <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    <path d="M21 9a3.5 3.5 0 0 1 0 6" className="origin-left animate-[soundWave_2s_ease-in-out_infinite_0s]" />
    <path d="M23 7a6.5 6.5 0 0 1 0 10" className="origin-left animate-[soundWave_2s_ease-in-out_infinite_0.4s]" />
  </svg>
);

export const AnimatedSearch: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <g className="animate-[searchGlide_2.8s_ease-in-out_infinite]">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </g>
  </svg>
);

export const AnimatedTarget: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="2" fill="currentColor" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="10" className="origin-center animate-[radarRing_2.5s_ease-in-out_infinite]" />
    <line x1="12" y1="2" x2="12" y2="4" />
    <line x1="12" y1="20" x2="12" y2="22" />
    <line x1="2" y1="12" x2="4" y2="12" />
    <line x1="20" y1="12" x2="22" y2="12" />
  </svg>
);

export const AnimatedSplit: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 3h5v5" />
    <path d="M8 3H3v5" />
    <path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3" className="animate-[splitPulse_2.4s_ease-in-out_infinite]" />
    <path d="m15 9 6-6" className="animate-[splitPulse_2.4s_ease-in-out_infinite_0.4s]" />
  </svg>
);

export const AnimatedDollarSign: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="2" x2="12" y2="22" className="animate-[dollarShine_2.4s_ease-in-out_infinite]" />
    <path
      d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
      className="origin-center animate-[dollarShine_2.4s_ease-in-out_infinite_0.2s]"
    />
  </svg>
);

export const AnimatedTrendingUp: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" className="animate-[lineDraw_2.4s_ease-in-out_infinite]" strokeDasharray="25" />
    <polyline points="16 7 22 7 22 13" className="animate-[arrowAscend_2.4s_ease-in-out_infinite]" />
  </svg>
);

// --- 8. SERVICES PAGE FLOWCHART & TRUST PILLAR ICONS ---

export const AnimatedUserCheck: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <polyline points="16 11 18 13 22 9" className="animate-[checkPop_2.2s_ease-in-out_infinite]" />
  </svg>
);

export const AnimatedPhoneCall: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path
      d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
      className="origin-[8px_8px] animate-[phoneRing_2.2s_ease-in-out_infinite]"
    />
  </svg>
);

export const AnimatedLaptop: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16" />
    <line x1="8" y1="10" x2="16" y2="10" className="animate-[laptopCode_2.4s_ease-in-out_infinite]" />
  </svg>
);

export const AnimatedCheckCheck: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 6 7 17l-5-5" className="animate-[checkPop_2.4s_ease-in-out_infinite_0s]" />
    <path d="m22 10-7.5 7.5L13 16" className="animate-[checkPop_2.4s_ease-in-out_infinite_0.35s]" />
  </svg>
);

export const AnimatedLock: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path
      d="M7 11V7a5 5 0 0 1 10 0v4"
      className="origin-bottom animate-[shackleLock_2.5s_ease-in-out_infinite]"
    />
  </svg>
);

export const AnimatedAward: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="8" r="6" className="animate-[sparkleMain_2.4s_ease-in-out_infinite]" />
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" className="origin-top animate-[ribbonSway_2.4s_ease-in-out_infinite]" />
  </svg>
);

export const AnimatedPercent: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="19" y1="5" x2="5" y2="19" />
    <circle cx="6.5" cy="6.5" r="2.5" fill="currentColor" className="animate-[dotPop_2.2s_ease-in-out_infinite_0s]" />
    <circle cx="17.5" cy="17.5" r="2.5" fill="currentColor" className="animate-[dotPop_2.2s_ease-in-out_infinite_0.5s]" />
  </svg>
);

export const AnimatedUsers: React.FC<AnimatedIconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" className="animate-[userNudge_2.6s_ease-in-out_infinite]" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" className="animate-[userNudge_2.6s_ease-in-out_infinite]" />
  </svg>
);
