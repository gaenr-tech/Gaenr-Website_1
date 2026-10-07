import React from 'react';

interface GaenrBotAvatarProps {
  className?: string;
  size?: number | string;
}

/**
 * Gaenr Butterfly Robot Avatar
 * Merges Gaenr's authentic butterfly wings with a friendly cyber-robot persona.
 */
export const GaenrBotAvatar: React.FC<GaenrBotAvatarProps> = ({
  className = '',
  size = 32,
}) => {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
    >
      <defs>
        {/* Gradients for butterfly wings */}
        <linearGradient id="gBotWingLeft" x1="10" y1="20" x2="60" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#005cd4" />
          <stop offset="100%" stopColor="#007eff" />
        </linearGradient>
        <linearGradient id="gBotWingRight" x1="110" y1="20" x2="60" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#007eff" />
          <stop offset="100%" stopColor="#005cd4" />
        </linearGradient>

        {/* Visor glow */}
        <linearGradient id="gBotVisor" x1="42" y1="52" x2="78" y2="68" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#00e5ff" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>

        <filter id="gBotGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* ── Left Butterfly Wing ──────────────────────────── */}
      {/* Top wing */}
      <path
        d="M 52 46 C 42 22 18 16 10 32 C 4 44 14 62 36 65 C 44 66 50 56 52 46 Z"
        fill="url(#gBotWingLeft)"
        opacity="0.95"
      />
      {/* Bottom wing */}
      <path
        d="M 50 64 C 36 65 14 74 18 90 C 22 102 40 100 50 84 C 53 78 52 69 50 64 Z"
        fill="#005cd4"
        opacity="0.85"
      />
      {/* Wing cyber accent lines */}
      <path
        d="M 22 36 Q 36 42 46 50"
        stroke="#ffffff"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.4"
      />
      <circle cx="20" cy="35" r="2" fill="#38bdf8" />

      {/* ── Right Butterfly Wing ─────────────────────────── */}
      {/* Top wing */}
      <path
        d="M 68 46 C 78 22 102 16 110 32 C 116 44 106 62 84 65 C 76 66 70 56 68 46 Z"
        fill="url(#gBotWingRight)"
        opacity="0.95"
      />
      {/* Bottom wing */}
      <path
        d="M 70 64 C 84 65 106 74 102 90 C 98 102 80 100 70 84 C 67 78 68 69 70 64 Z"
        fill="#007eff"
        opacity="0.85"
      />
      {/* Wing cyber accent lines */}
      <path
        d="M 98 36 Q 84 42 74 50"
        stroke="#ffffff"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.4"
      />
      <circle cx="100" cy="35" r="2" fill="#38bdf8" />

      {/* ── Robot Butterfly Antennae ─────────────────────── */}
      <path
        d="M 54 36 Q 48 18 36 15"
        stroke="#005cd4"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="36" cy="15" r="3.5" fill="#00e5ff" filter="url(#gBotGlow)" />

      <path
        d="M 66 36 Q 72 18 84 15"
        stroke="#007eff"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="84" cy="15" r="3.5" fill="#00e5ff" filter="url(#gBotGlow)" />

      {/* ── Center Robot Head / Chassis ──────────────────── */}
      <rect
        x="42"
        y="34"
        width="36"
        height="38"
        rx="14"
        fill="#ffffff"
        stroke="#0f172a"
        strokeWidth="2.5"
      />

      {/* Head chassis top panel */}
      <path
        d="M 48 35 Q 60 37 72 35"
        stroke="#cbd5e1"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Friendly Glowing Visor / Eyes */}
      <rect
        x="47"
        y="45"
        width="26"
        height="12"
        rx="6"
        fill="#0c182c"
      />
      {/* Cyan dual-eye glow slit */}
      <rect
        x="50"
        y="48"
        width="7"
        height="6"
        rx="2.5"
        fill="url(#gBotVisor)"
        filter="url(#gBotGlow)"
      />
      <rect
        x="63"
        y="48"
        width="7"
        height="6"
        rx="2.5"
        fill="url(#gBotVisor)"
        filter="url(#gBotGlow)"
      />

      {/* Cheerful subtle smile line */}
      <path
        d="M 55 64 Q 60 67 65 64"
        stroke="#0284c7"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Small robotic neck connector & core node */}
      <rect
        x="55"
        y="72"
        width="10"
        height="6"
        rx="2"
        fill="#0f172a"
      />
      <circle cx="60" cy="85" r="4.5" fill="#006eff" />
      <circle cx="60" cy="85" r="2" fill="#ffffff" />
    </svg>
  );
};
