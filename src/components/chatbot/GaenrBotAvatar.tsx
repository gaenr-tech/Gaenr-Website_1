import React, { useId } from 'react';

interface GaenrBotAvatarProps {
  className?: string;
  size?: number | string;
  color?: string;
}

/**
 * Gini Butterfly Bot Avatar - "Dana with a Bot"
 * Solid, filled ("ভরাট") 1-color pure white vector design.
 * Refined proportions:
 * - Central robot (face, screen visor, eyes, torso, tail) is enlarged & prominent
 *   so the facial features and eyes ("চোখ মুখ") are crystal-clear and adorable.
 * - Butterfly wings (ডানা) are sleek, compact, and balanced without overpowering the robot.
 * - Front-facing, perfectly symmetrical, one-color vector SVG.
 */
export const GaenrBotAvatar: React.FC<GaenrBotAvatarProps> = ({
  className = '',
  size = 24,
  color = '#ffffff',
}) => {
  const maskId = useId().replace(/:/g, '_');

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
    >
      <defs>
        {/* Negative Space Mask: Carves clean visor screen, wing circuits, and abdomen grooves */}
        <mask id={`bot-mask-${maskId}`}>
          {/* Base white covering entire area */}
          <rect width="100" height="100" fill="#ffffff" />

          {/* ── Prominent Large Visor Screen Cutout in Head ── */}
          <rect
            x="34.5"
            y="24"
            width="31"
            height="21"
            rx="5.5"
            fill="#000000"
          />

          {/* ── Compact Wing Circuit Cuts (Negative Space) ── */}
          {/* Left Upper Wing Circuit */}
          <path
            d="M 18 35 L 24 40 L 31 40"
            stroke="#000000"
            strokeWidth="2.0"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="17.5" cy="34.5" r="2.0" fill="#000000" />

          {/* Left Lower Wing Circuit */}
          <path
            d="M 23 68 L 28 68 L 32 63"
            stroke="#000000"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="23" cy="68" r="1.8" fill="#000000" />

          {/* Right Upper Wing Circuit */}
          <path
            d="M 82 35 L 76 40 L 69 40"
            stroke="#000000"
            strokeWidth="2.0"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="82.5" cy="34.5" r="2.0" fill="#000000" />

          {/* Right Lower Wing Circuit */}
          <path
            d="M 77 68 L 72 68 L 68 63"
            stroke="#000000"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="77" cy="68" r="1.8" fill="#000000" />

          {/* ── Abdomen Segment Grooves ── */}
          <line
            x1="43"
            y1="70"
            x2="57"
            y2="70"
            stroke="#000000"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <line
            x1="45.5"
            y1="78"
            x2="54.5"
            y2="78"
            stroke="#000000"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </mask>
      </defs>

      {/* ── Main Solid Filled Silhouette with Masked Details ── */}
      <g mask={`url(#bot-mask-${maskId})`} fill={color}>
        {/* Compact Symmetrical Butterfly Wings (Balanced Proportions) */}
        {/* Left Upper Wing */}
        <path d="M 32 40 C 22 26 14 24 10 32 C 6 41 14 54 33 56 Z" />
        {/* Left Lower Wing */}
        <path d="M 33 57 C 18 60 12 70 16 79 C 20 87 31 82 37 68 Z" />

        {/* Right Upper Wing */}
        <path d="M 68 40 C 78 26 86 24 90 32 C 94 41 86 54 67 56 Z" />
        {/* Right Lower Wing */}
        <path d="M 67 57 C 82 60 88 70 84 79 C 80 87 69 82 63 68 Z" />

        {/* Cyber Antennae with Bold Spheres */}
        <path
          d="M 43 20 C 39 12 35 9 30 7"
          stroke={color}
          strokeWidth="3.4"
          strokeLinecap="round"
        />
        <circle cx="29" cy="6.5" r="4.0" />

        <path
          d="M 57 20 C 61 12 65 9 70 7"
          stroke={color}
          strokeWidth="3.4"
          strokeLinecap="round"
        />
        <circle cx="71" cy="6.5" r="4.0" />

        {/* Large Prominent Robot Monitor Head Chassis */}
        <rect x="30" y="20" width="40" height="29" rx="8" />

        {/* Robot Torso Joint */}
        <rect x="39" y="50" width="22" height="12" rx="4.5" />

        {/* Segmented Abdomen Tail */}
        <path d="M 40 63 C 40 75 44 87 50 93 C 56 87 60 75 60 63 Z" />
      </g>

      {/* ── Large, Clear Glowing Visor Capsule Eyes (Instantly Visible & Expressive) ── */}
      <rect
        x="40"
        y="29.5"
        width="6"
        height="10"
        rx="3"
        fill={color}
      />
      <rect
        x="54"
        y="29.5"
        width="6"
        height="10"
        rx="3"
        fill={color}
      />
    </svg>
  );
};
