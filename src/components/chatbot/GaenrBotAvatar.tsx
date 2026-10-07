import React, { useId } from 'react';

interface GaenrBotAvatarProps {
  className?: string;
  size?: number | string;
  color?: string;
}

/**
 * Gini Butterfly Bot Avatar - "Dana with a Bot"
 * Solid, filled ("ভরাট") 1-color pure white vector design.
 * Straight and perfectly symmetrical front-facing view with clean negative-space cutouts.
 * Features:
 * - Solid butterfly wings with cyber circuit cutouts & node pads
 * - Solid robot monitor head with screen visor cutout & glowing white capsule eyes
 * - Symmetrical cyber antennae with sphere tips
 * - Solid torso & segmented ribbed abdomen
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
        {/* Negative Space Mask: White draws solid body, Black carves out clean circuit & visor details */}
        <mask id={`bot-mask-${maskId}`}>
          {/* Base white covering entire area */}
          <rect width="100" height="100" fill="#ffffff" />

          {/* ── Screen Visor Cutout in Head ── */}
          <rect
            x="38.5"
            y="28.5"
            width="23"
            height="17"
            rx="4.5"
            fill="#000000"
          />

          {/* ── Wing Circuit Cuts (Negative Space) ── */}
          {/* Left Upper Wing Circuit */}
          <path
            d="M 16 31 L 24 37 L 33 37"
            stroke="#000000"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="15.5" cy="30.5" r="2.4" fill="#000000" />

          {/* Left Lower Wing Circuit */}
          <path
            d="M 24 71 L 30 71 L 34 66"
            stroke="#000000"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="24" cy="71" r="2.2" fill="#000000" />

          {/* Right Upper Wing Circuit */}
          <path
            d="M 84 31 L 76 37 L 67 37"
            stroke="#000000"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="84.5" cy="30.5" r="2.4" fill="#000000" />

          {/* Right Lower Wing Circuit */}
          <path
            d="M 76 71 L 70 71 L 66 66"
            stroke="#000000"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="76" cy="71" r="2.2" fill="#000000" />

          {/* ── Abdomen Segment Grooves ── */}
          <line
            x1="43"
            y1="67"
            x2="57"
            y2="67"
            stroke="#000000"
            strokeWidth="2.0"
            strokeLinecap="round"
          />
          <line
            x1="45"
            y1="75"
            x2="55"
            y2="75"
            stroke="#000000"
            strokeWidth="2.0"
            strokeLinecap="round"
          />
        </mask>
      </defs>

      {/* ── Main Solid Filled Silhouette with Masked Details ── */}
      <g mask={`url(#bot-mask-${maskId})`} fill={color}>
        {/* Left Upper Wing (Solid Filled) */}
        <path d="M 37 38 C 24 18 8 14 5 24 C 1 35 10 51 36 55 Z" />
        {/* Left Lower Wing (Solid Filled) */}
        <path d="M 36 55 C 20 58 12 70 16 80 C 20 89 34 85 40 67 Z" />

        {/* Right Upper Wing (Solid Filled) */}
        <path d="M 63 38 C 76 18 92 14 95 24 C 99 35 90 51 64 55 Z" />
        {/* Right Lower Wing (Solid Filled) */}
        <path d="M 64 55 C 80 58 88 70 84 80 C 80 89 66 85 60 67 Z" />

        {/* Cyber Antennae & Tips */}
        <path
          d="M 44 26 C 41 17 37 13 33 10"
          stroke={color}
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <circle cx="32" cy="9.5" r="3.6" />

        <path
          d="M 56 26 C 59 17 63 13 67 10"
          stroke={color}
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <circle cx="68" cy="9.5" r="3.6" />

        {/* Robot Monitor Head Chassis (Solid Filled) */}
        <rect x="35" y="25" width="30" height="24" rx="7" />

        {/* Torso Top Joint (Solid Filled) */}
        <rect x="41" y="49" width="18" height="11" rx="4" />

        {/* Abdomen Tail (Solid Filled) */}
        <path d="M 42 59 C 42 70 45 81 50 88 C 55 81 58 70 58 59 Z" />
      </g>

      {/* ── Glowing Visor Capsule Eyes (Crisp Solid Shapes Inside Visor) ── */}
      <rect
        x="43"
        y="33.5"
        width="4"
        height="7"
        rx="2"
        fill={color}
      />
      <rect
        x="53"
        y="33.5"
        width="4"
        height="7"
        rx="2"
        fill={color}
      />
    </svg>
  );
};
