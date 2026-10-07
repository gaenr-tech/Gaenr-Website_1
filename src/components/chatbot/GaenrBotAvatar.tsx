import React from 'react';

interface GaenrBotAvatarProps {
  className?: string;
  size?: number | string;
  strokeColor?: string;
}

/**
 * Gaenr Butterfly Robot Avatar - Pure White Line Art
 * Minimalist geometric butterfly wings with cyber-robotic antenna and visor.
 * 100% vector line art with crisp white strokes.
 */
export const GaenrBotAvatar: React.FC<GaenrBotAvatarProps> = ({
  className = '',
  size = 28,
  strokeColor = '#ffffff',
}) => {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
    >
      {/* ── Left Butterfly Wing Line Art ────────────────── */}
      {/* Upper Wing */}
      <path
        d="M 21 19 C 17 11 9 9 5 15 C 2 20 6 28 17 29"
        stroke={strokeColor}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Lower Wing */}
      <path
        d="M 17 29 C 11 31 6 36 8 42 C 10 46 17 45 20 37"
        stroke={strokeColor}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Left Wing Inner Tech Line */}
      <path
        d="M 10 18 Q 16 21 19 25"
        stroke={strokeColor}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeDasharray="1 3"
        opacity="0.85"
      />

      {/* ── Right Butterfly Wing Line Art ───────────────── */}
      {/* Upper Wing */}
      <path
        d="M 27 19 C 31 11 39 9 43 15 C 46 20 42 28 31 29"
        stroke={strokeColor}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Lower Wing */}
      <path
        d="M 31 29 C 37 31 42 36 40 42 C 38 46 31 45 28 37"
        stroke={strokeColor}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right Wing Inner Tech Line */}
      <path
        d="M 38 18 Q 32 21 29 25"
        stroke={strokeColor}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeDasharray="1 3"
        opacity="0.85"
      />

      {/* ── Robot Antennae Line Art ─────────────────────── */}
      <path
        d="M 22 15 Q 19 7 14 5"
        stroke={strokeColor}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="14" cy="5" r="1.5" fill={strokeColor} />

      <path
        d="M 26 15 Q 29 7 34 5"
        stroke={strokeColor}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="34" cy="5" r="1.5" fill={strokeColor} />

      {/* ── Robot Head / Core Outline ───────────────────── */}
      <rect
        x="19"
        y="14"
        width="10"
        height="14"
        rx="5"
        stroke={strokeColor}
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Robot Visor / Eyes Line */}
      <path
        d="M 21.5 19.5 L 26.5 19.5"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Robot Lower Spine / Tail Line */}
      <path
        d="M 24 28 L 24 35"
        stroke={strokeColor}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="24" cy="38" r="1.4" fill={strokeColor} />
    </svg>
  );
};
