import React from 'react';

interface GaenrBotAvatarProps {
  className?: string;
  size?: number | string;
  color?: string;
}

/**
 * Gini Butterfly Bot Avatar - "Dana with a Bot"
 * Clean, symmetrical, front-facing 1-color vector SVG designed from simple geometric shapes.
 * Perfectly readable and sharp at compact icon sizes (16px to 32px).
 * Features:
 * - Symmetrical front-facing butterfly wings (ডানা) with circuit traces & terminal nodes
 * - Cute front-facing robot monitor head with screen visor & capsule eyes
 * - Straight cyber antennae rising with solid sphere tips
 * - Robotic torso & segmented tapered abdomen
 */
export const GaenrBotAvatar: React.FC<GaenrBotAvatarProps> = ({
  className = '',
  size = 24,
  color = '#ffffff',
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
      {/* ── 1. Cyber Antennae with Sphere Tips (Front-facing symmetrical) ── */}
      <path
        d="M 44 26 C 41 18 38 14 34 11"
        stroke={color}
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <circle cx="33" cy="10.5" r="3.4" fill={color} />

      <path
        d="M 56 26 C 59 18 62 14 66 11"
        stroke={color}
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <circle cx="67" cy="10.5" r="3.4" fill={color} />

      {/* ── 2. Butterfly Wings (Straight, Symmetrical, Bold Shape Lines) ── */}
      {/* Left Upper Wing */}
      <path
        d="M 36 38 C 24 20 10 16 6 24 C 2 34 10 50 35 54"
        stroke={color}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Left Lower Wing */}
      <path
        d="M 36 55 C 22 58 14 69 17 79 C 21 87 33 83 39 67"
        stroke={color}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Right Upper Wing */}
      <path
        d="M 64 38 C 76 20 90 16 94 24 C 98 34 90 50 65 54"
        stroke={color}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right Lower Wing */}
      <path
        d="M 64 55 C 78 58 86 69 83 79 C 79 87 67 83 61 67"
        stroke={color}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* ── 3. Wing Circuit Traces & Nodes (Clean geometric accents) ── */}
      {/* Left Circuit */}
      <path
        d="M 15 31 L 22 37 L 31 37"
        stroke={color}
        strokeWidth="2.0"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="14.5" cy="30.5" r="2.2" fill={color} />

      <path
        d="M 23 70 L 29 70 L 33 65"
        stroke={color}
        strokeWidth="2.0"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="23" cy="70" r="2.0" fill={color} />

      {/* Right Circuit */}
      <path
        d="M 85 31 L 78 37 L 69 37"
        stroke={color}
        strokeWidth="2.0"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="85.5" cy="30.5" r="2.2" fill={color} />

      <path
        d="M 77 70 L 71 70 L 67 65"
        stroke={color}
        strokeWidth="2.0"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="77" cy="70" r="2.0" fill={color} />

      {/* ── 4. Robotic Torso & Segmented Abdomen (Straight Center Axis) ── */}
      {/* Torso Top Joint */}
      <rect
        x="42"
        y="49"
        width="16"
        height="9"
        rx="3.5"
        stroke={color}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Segmented Abdomen Silhouette */}
      <path
        d="M 44 59 C 44 68 47 79 50 86 C 53 79 56 68 56 59"
        stroke={color}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      {/* Horizontal Rib Segments */}
      <line
        x1="45"
        y1="67"
        x2="55"
        y2="67"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <line
        x1="47"
        y1="75"
        x2="53"
        y2="75"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* ── 5. Robot Head Chassis (Straight Front-Facing Monitor) ── */}
      {/* Monitor Chassis */}
      <rect
        x="36"
        y="25"
        width="28"
        height="23"
        rx="7"
        stroke={color}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner Screen Visor */}
      <rect
        x="39.5"
        y="28.5"
        width="21"
        height="16"
        rx="4.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Symmetrical Visor Eyes (Solid One-Color Pill Shapes) */}
      <rect
        x="43.5"
        y="33.5"
        width="3.5"
        height="6.5"
        rx="1.75"
        fill={color}
      />
      <rect
        x="53"
        y="33.5"
        width="3.5"
        height="6.5"
        rx="1.75"
        fill={color}
      />
    </svg>
  );
};
