import React from 'react';

interface GaenrBotAvatarProps {
  className?: string;
  size?: number | string;
  strokeColor?: string;
}

/**
 * Gini Butterfly Bot Avatar - "Dana with a Bot"
 * Features the clean, whitish 3D edition matching the user's butterfly robot reference.
 */
export const GaenrBotAvatar: React.FC<GaenrBotAvatarProps> = ({
  className = '',
  size = 32,
}) => {
  const pixelSize = typeof size === 'number' ? `${size}px` : size;

  return (
    <div
      style={{ width: pixelSize, height: pixelSize }}
      className={`inline-flex items-center justify-center shrink-0 select-none overflow-hidden ${className}`}
    >
      <img
        src="/images/bot/gini-bot-avatar-thumb.png"
        alt="Gini"
        style={{ width: pixelSize, height: pixelSize }}
        className="w-full h-full object-contain pointer-events-none drop-shadow-xs transition-transform duration-200"
        loading="eager"
        decoding="async"
      />
    </div>
  );
};
