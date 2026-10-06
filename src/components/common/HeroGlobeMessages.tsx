import React, { useState, useEffect } from 'react';

interface MessageItem {
  id: string;
  role: 'Outsourcer' | 'Expert';
  location: string;
  message: string;
  avatarUrl: string;
  posClass: string;
}

// 8 Diverse Messages popping up one at a time from different locations around the globe
const MESSAGES: MessageItem[] = [
  {
    id: 'msg-1',
    role: 'Outsourcer',
    location: 'London',
    message: 'Need a clean SaaS dashboard redesign',
    avatarUrl: '/images/avatars/student_male_4.png',
    posClass: 'top-[5%] left-[2%] sm:left-[3%]',
  },
  {
    id: 'msg-2',
    role: 'Expert',
    location: 'Dhaka',
    message: 'Interactive Figma prototype ready! 🎨',
    avatarUrl: '/images/avatars/student_female_1.png',
    posClass: 'top-[36%] right-[2%] sm:right-[3%]',
  },
  {
    id: 'msg-3',
    role: 'Outsourcer',
    location: 'New York',
    message: 'Looking for dynamic 4K YouTube edits',
    avatarUrl: '/images/avatars/student_male_2.png',
    posClass: 'top-[8%] right-[2%] sm:right-[3%]',
  },
  {
    id: 'msg-4',
    role: 'Expert',
    location: 'Dhaka',
    message: 'Colour-graded & sound FX exported 🎬',
    avatarUrl: '/images/avatars/student_male_1.png',
    posClass: 'bottom-[10%] left-[2%] sm:left-[3%]',
  },
  {
    id: 'msg-5',
    role: 'Outsourcer',
    location: 'Singapore',
    message: 'WooCommerce store speed optimization',
    avatarUrl: '/images/avatars/student_female_4.png',
    posClass: 'top-[42%] left-[1%] sm:left-[2%]',
  },
  {
    id: 'msg-6',
    role: 'Expert',
    location: 'Dhaka',
    message: 'Google PageSpeed boosted to 98! ⚡',
    avatarUrl: '/images/avatars/student_male_3.png',
    posClass: 'bottom-[6%] right-[3%] sm:right-[4%]',
  },
  {
    id: 'msg-7',
    role: 'Outsourcer',
    location: 'Sydney',
    message: 'Need 15-slide investor pitch deck',
    avatarUrl: '/images/avatars/student_female_2.png',
    posClass: 'bottom-[14%] left-[3%] sm:left-[4%]',
  },
  {
    id: 'msg-8',
    role: 'Expert',
    location: 'Dhaka',
    message: 'Milestone approved • 5.0 ★ review! ✅',
    avatarUrl: '/images/avatars/student_female_5.png',
    posClass: 'top-[4%] right-[4%] sm:right-[5%]',
  },
];

export const HeroGlobeMessages: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const current = MESSAGES[index];

  useEffect(() => {
    setIsExiting(false);

    // After 2300ms, start exiting
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 2300);

    // After 2700ms, switch to next single message
    const switchTimer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % MESSAGES.length);
      setIsExiting(false);
    }, 2700);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(switchTimer);
    };
  }, [index]);

  return (
    <div
      className="absolute inset-0 z-20 pointer-events-none select-none overflow-visible"
      aria-hidden="true"
    >
      {/* Exactly one compact capsule pill rendered at a time */}
      <div
        key={`${current.id}-${index}`}
        className={`absolute ${current.posClass} pointer-events-none transition-all duration-300 ${
          isExiting ? 'animate-hero-pop-out' : 'animate-hero-pop-in'
        }`}
        style={{ willChange: 'transform, opacity' }}
      >
        <div
          className={`group relative flex items-center gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-white/35 shadow-lg backdrop-blur-md transition-transform duration-200 ${
            current.role === 'Outsourcer'
              ? 'bg-gradient-to-r from-[#004cb5]/95 via-[#0066d6]/95 to-[#0284c7]/95 shadow-blue-600/20'
              : 'bg-gradient-to-r from-[#0062be]/95 via-[#0284c7]/95 to-[#0d9488]/95 shadow-cyan-600/20'
          }`}
        >
          {/* Subtle Glowing Orbital Anchor Node */}
          <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 border border-white ${
                current.role === 'Outsourcer' ? 'bg-cyan-300' : 'bg-emerald-300'
              }`}
            />
          </span>

          {/* Compact Circular Avatar */}
          <div className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden shrink-0 border border-white/90 shadow-2xs bg-slate-800">
            <img
              src={current.avatarUrl}
              alt={current.role}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/images/avatars/student_male_1.png';
              }}
            />
          </div>

          {/* Compact 2-Line Text Content */}
          <div className="flex flex-col text-left pr-1 min-w-0 max-w-[130px] xs:max-w-[155px] sm:max-w-[175px]">
            <div className="flex items-center gap-1 leading-none mb-0.5">
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-white">
                {current.role}
              </span>
              <span
                className={`text-[8px] sm:text-[9px] font-medium truncate ${
                  current.role === 'Outsourcer' ? 'text-cyan-200' : 'text-emerald-200'
                }`}
              >
                • {current.location}
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-white truncate leading-tight tracking-tight">
              {current.message}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
