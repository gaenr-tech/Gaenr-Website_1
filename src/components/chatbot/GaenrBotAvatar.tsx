import React from 'react';

interface GaenrBotAvatarProps {
  className?: string;
  size?: number | string;
  strokeColor?: string;
}

/**
 * Gaenr Butterfly AI Bot Avatar - Bold White Line Art with Whitish Outer Aura
 * Features bold geometric butterfly wings, robotic center chassis, glowing cyber visor,
 * antennae sensors, and a subtle whitish outer boundary ring.
 */
export const GaenrBotAvatar: React.FC<GaenrBotAvatarProps> = ({
  className = '',
  size = 30,
  strokeColor = '#ffffff',
}) => {
  return (
    <svg
      viewBox="0 0 56 56"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
    >
      <defs>
        {/* Soft whitish outer halo glow filter */}
        <filter id="gBotOuterGlow" x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* ── 1. Whitish Outer Boundary Layer (Tech Halo Ring) ─── */}
      <circle
        cx="28"
        cy="28"
        r="26"
        stroke="#ffffff"
        strokeWidth="1.6"
        strokeDasharray="4 2.5"
        opacity="0.5"
      />
      <circle
        cx="28"
        cy="28"
        r="24.5"
        stroke="#ffffff"
        strokeWidth="1.0"
        opacity="0.3"
      />

      {/* ── 2. Left Butterfly Wing (Bold Cyber-Curved Lines) ─── */}
      {/* Upper Wing */}
      <path
        d="M 23 23 C 18 12 7 11 3 18 C -1 25 5 34 18 35"
        stroke={strokeColor}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Lower Wing */}
      <path
        d="M 18 35 C 11 37 5 44 8 50 C 11 55 20 52 23 42"
        stroke={strokeColor}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Left Wing Inner Tech Trace */}
      <path
        d="M 8 22 Q 16 26 20 30"
        stroke={strokeColor}
        strokeWidth="2.0"
        strokeLinecap="round"
        opacity="0.9"
      />
      <circle cx="8" cy="22" r="1.6" fill={strokeColor} />

      {/* ── 3. Right Butterfly Wing (Bold Cyber-Curved Lines) ── */}
      {/* Upper Wing */}
      <path
        d="M 33 23 C 38 12 49 11 53 18 C 57 25 51 34 38 35"
        stroke={strokeColor}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Lower Wing */}
      <path
        d="M 38 35 C 45 37 51 44 48 50 C 45 55 36 52 33 42"
        stroke={strokeColor}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right Wing Inner Tech Trace */}
      <path
        d="M 48 22 Q 40 26 36 30"
        stroke={strokeColor}
        strokeWidth="2.0"
        strokeLinecap="round"
        opacity="0.9"
      />
      <circle cx="48" cy="22" r="1.6" fill={strokeColor} />

      {/* ── 4. Robot Butterfly Cyber Antennae ────────────────── */}
      <path
        d="M 24 16 Q 19 8 13 6"
        stroke={strokeColor}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="13" cy="6" r="2.2" fill={strokeColor} filter="url(#gBotOuterGlow)" />

      <path
        d="M 32 16 Q 37 8 43 6"
        stroke={strokeColor}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="43" cy="6" r="2.2" fill={strokeColor} filter="url(#gBotOuterGlow)" />

      {/* ── 5. Robot Bot Head Chassis (Center Core) ─────────── */}
      <rect
        x="21"
        y="16"
        width="14"
        height="18"
        rx="7"
        stroke={strokeColor}
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="rgba(0, 110, 255, 0.45)"
      />

      {/* Robot Eye Visor (Bold Horizontal Light Bar) */}
      <rect
        x="24"
        y="22.5"
        width="8"
        height="3.5"
        rx="1.75"
        fill={strokeColor}
        filter="url(#gBotOuterGlow)"
      />

      {/* Lower Robotic Abdomen / Spine Nodes */}
      <path
        d="M 28 34 L 28 41"
        stroke={strokeColor}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="28" cy="44" r="2.0" fill={strokeColor} />
    </svg>
  );
};
