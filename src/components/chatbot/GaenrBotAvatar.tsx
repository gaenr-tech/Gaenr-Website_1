import React from 'react';

interface GaenrBotAvatarProps {
  className?: string;
  size?: number | string;
  strokeColor?: string;
}

/**
 * Gaenr Butterfly AI Bot Avatar - "Dana with a Bot"
 * Clean, bold, iconic Line Art representation matching the robot reference.
 * Features:
 * - Expressive Butterfly Wings (ডানা) with clean cyber circuit accents
 * - Friendly Robot Monitor Head with curved visor and dual capsule eyes
 * - Cyber Antennae with rounded node tips
 * - Streamlined robotic torso and segmented abdomen
 */
export const GaenrBotAvatar: React.FC<GaenrBotAvatarProps> = ({
  className = '',
  size = 32,
  strokeColor = '#ffffff',
}) => {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
    >
      {/* ── 1. Cyber Antennae with Node Tips ───────────────────── */}
      <path
        d="M 43 27 C 39 18 35 14 30 12"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="29" cy="11.5" r="2.8" fill={strokeColor} />

      <path
        d="M 57 27 C 61 18 65 14 70 12"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="71" cy="11.5" r="2.8" fill={strokeColor} />

      {/* ── 2. Butterfly Wings Silhouette (Clean Line Art) ─────── */}
      {/* Left Upper Wing */}
      <path
        d="M 37 38 C 26 23 12 18 8 26 C 4 35 12 49 35 53"
        stroke={strokeColor}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Left Lower Wing */}
      <path
        d="M 36 55 C 22 58 14 69 17 79 C 21 87 33 83 39 67"
        stroke={strokeColor}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Right Upper Wing */}
      <path
        d="M 63 38 C 74 23 88 18 92 26 C 96 35 88 49 65 53"
        stroke={strokeColor}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right Lower Wing */}
      <path
        d="M 64 55 C 78 58 86 69 83 79 C 79 87 67 83 61 67"
        stroke={strokeColor}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* ── 3. Subtle Wing Circuit Accents (Non-cluttered) ────── */}
      {/* Left Wing Circuit Trace & Node */}
      <path
        d="M 16 31 L 23 37 L 31 37"
        stroke={strokeColor}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="15.5" cy="30.5" r="2.0" fill={strokeColor} />

      <path
        d="M 23 70 L 29 70 L 33 65"
        stroke={strokeColor}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="23" cy="70" r="1.8" fill={strokeColor} />

      {/* Right Wing Circuit Trace & Node */}
      <path
        d="M 84 31 L 77 37 L 69 37"
        stroke={strokeColor}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="84.5" cy="30.5" r="2.0" fill={strokeColor} />

      <path
        d="M 77 70 L 71 70 L 67 65"
        stroke={strokeColor}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="77" cy="70" r="1.8" fill={strokeColor} />

      {/* ── 4. Central Robot Body / Segmented Abdomen ─────────── */}
      {/* Torso Bracket / Neck */}
      <path
        d="M 43 49 L 43 57 C 43 60 57 60 57 57 L 57 49"
        stroke={strokeColor}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Segmented Abdomen Contours */}
      <path
        d="M 44 59 C 44 68 47 79 50 86 C 53 79 56 68 56 59"
        stroke={strokeColor}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Abdomen Rib Segments */}
      <line
        x1="45"
        y1="67"
        x2="55"
        y2="67"
        stroke={strokeColor}
        strokeWidth="2.0"
        strokeLinecap="round"
      />
      <line
        x1="47"
        y1="75"
        x2="53"
        y2="75"
        stroke={strokeColor}
        strokeWidth="2.0"
        strokeLinecap="round"
      />

      {/* ── 5. Robot Head Chassis & Screen (Pure Line Art) ────── */}
      {/* Outer Head Chassis */}
      <rect
        x="36"
        y="25"
        width="28"
        height="23"
        rx="7"
        stroke={strokeColor}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner Screen Visor Outline */}
      <rect
        x="39.5"
        y="28.5"
        width="21"
        height="16"
        rx="4.5"
        stroke={strokeColor}
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* Glowing Capsule Visor Eyes */}
      <rect
        x="43.5"
        y="33.5"
        width="3.5"
        height="6.5"
        rx="1.75"
        fill={strokeColor}
      />
      <rect
        x="53"
        y="33.5"
        width="3.5"
        height="6.5"
        rx="1.75"
        fill={strokeColor}
      />
    </svg>
  );
};
