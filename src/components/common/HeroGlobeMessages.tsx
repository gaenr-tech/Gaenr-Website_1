import React, { useState, useEffect } from 'react';

interface MessageItem {
  id: string;
  role: 'Outsourcer' | 'Expert';
  location: string;
  message: string;
  avatarUrl: string;
  posClass: string;
}

// Fixed curated messages that strictly stay within the 3D globe boundaries
const MESSAGES: MessageItem[] = [
  {
    id: 'msg-1',
    role: 'Outsourcer',
    location: 'London',
    message: 'Need clean SaaS UI/UX',
    avatarUrl: '/images/avatars/student_male_4.png',
    posClass: 'top-[30%] left-[22%] sm:left-[24%]',
  },
  {
    id: 'msg-2',
    role: 'Expert',
    location: 'Dhaka',
    message: 'Figma prototype ready! 🎨',
    avatarUrl: '/images/avatars/student_female_1.png',
    posClass: 'top-[44%] right-[18%] sm:right-[20%]',
  },
  {
    id: 'msg-3',
    role: 'Outsourcer',
    location: 'New York',
    message: 'Need 4K video editing',
    avatarUrl: '/images/avatars/student_male_2.png',
    posClass: 'top-[26%] left-1/2 -translate-x-1/2',
  },
  {
    id: 'msg-4',
    role: 'Expert',
    location: 'Dhaka',
    message: 'Rendered with sound FX 🎬',
    avatarUrl: '/images/avatars/student_male_1.png',
    posClass: 'top-[58%] left-[20%] sm:left-[22%]',
  },
  {
    id: 'msg-5',
    role: 'Outsourcer',
    location: 'Singapore',
    message: 'WooCommerce speed boost',
    avatarUrl: '/images/avatars/student_female_4.png',
    posClass: 'top-[28%] right-[20%] sm:right-[22%]',
  },
  {
    id: 'msg-6',
    role: 'Expert',
    location: 'Dhaka',
    message: 'PageSpeed boosted to 98! ⚡',
    avatarUrl: '/images/avatars/student_male_3.png',
    posClass: 'top-[64%] left-1/2 -translate-x-1/2',
  },
  {
    id: 'msg-7',
    role: 'Outsourcer',
    location: 'Sydney',
    message: 'Need pitch deck redesign',
    avatarUrl: '/images/avatars/student_female_2.png',
    posClass: 'top-[42%] left-[22%] sm:left-[24%]',
  },
  {
    id: 'msg-8',
    role: 'Expert',
    location: 'Dhaka',
    message: 'Milestone approved! 5★ ✅',
    avatarUrl: '/images/avatars/student_female_5.png',
    posClass: 'top-[56%] right-[20%] sm:right-[22%]',
  },
];

export const HeroGlobeMessages: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const current = MESSAGES[index];

  useEffect(() => {
    setIsExiting(false);

    // Visible for 2400ms, then begins smooth exit
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 2400);

    // Switches to next message at 2800ms
    const switchTimer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % MESSAGES.length);
      setIsExiting(false);
    }, 2800);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(switchTimer);
    };
  }, [index]);

  return (
    <div
      className="absolute inset-0 z-20 pointer-events-none select-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Exactly one compact capsule pill rendered at a time, strictly inside globe boundaries */}
      <div
        key={`${current.id}-${index}`}
        className={`absolute ${current.posClass} pointer-events-none transition-all duration-300 ${
          isExiting ? 'animate-hero-pop-out' : 'animate-hero-pop-in'
        }`}
        style={{ willChange: 'transform, opacity' }}
      >
        <div
          className={`group relative flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-white/40 shadow-md backdrop-blur-md transition-transform duration-200 ${
            current.role === 'Outsourcer'
              ? 'bg-gradient-to-r from-[#0047b3]/95 via-[#0062d2]/95 to-[#0277bd]/95 shadow-blue-600/25'
              : 'bg-gradient-to-r from-[#005fb8]/95 via-[#0284c7]/95 to-[#0d9488]/95 shadow-cyan-600/25'
          }`}
        >
          {/* Subtle Glowing Orbital Anchor Node */}
          <span className="absolute -top-0.5 -right-0.5 flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span
              className={`relative inline-flex rounded-full h-1.5 w-1.5 border border-white ${
                current.role === 'Outsourcer' ? 'bg-cyan-300' : 'bg-emerald-300'
              }`}
            />
          </span>

          {/* Ultra-compact Circular Avatar */}
          <div className="relative w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full overflow-hidden shrink-0 border border-white/90 shadow-2xs bg-slate-800">
            <img
              src={current.avatarUrl}
              alt={current.role}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/images/avatars/student_male_1.png';
              }}
            />
          </div>

          {/* Compact 2-Line Content - FULL MESSAGE DISPLAY (NO TRUNCATE) */}
          <div className="flex flex-col text-left pr-1 min-w-0">
            <div className="flex items-center gap-1 leading-none mb-0.5">
              <span className="text-[7.5px] sm:text-[8px] font-black uppercase tracking-wider text-white">
                {current.role}
              </span>
              <span
                className={`text-[7px] sm:text-[7.5px] font-medium ${
                  current.role === 'Outsourcer' ? 'text-cyan-200' : 'text-emerald-200'
                }`}
              >
                • {current.location}
              </span>
            </div>
            {/* Fully visible message without clipping */}
            <span className="text-[8.5px] sm:text-[9.5px] font-bold text-white leading-tight tracking-tight whitespace-nowrap">
              {current.message}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
