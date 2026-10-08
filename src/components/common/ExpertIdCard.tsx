import React, { forwardRef } from 'react';
import { FreelancerProfile } from '../../types';
import { AvatarGraphic, getAvatarImageSrc, VerifiedBadge3D } from './Avatars';
import { GaenrLogo } from './GaenrLogo';
import { Star } from 'lucide-react';

interface ExpertIdCardProps {
  freelancer: FreelancerProfile;
  className?: string;
}

export const ExpertIdCard = forwardRef<HTMLDivElement, ExpertIdCardProps>(
  ({ freelancer, className = '' }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          background: 'linear-gradient(180deg, #0b1329 0%, #0b1120 50%, #0f1d40 100%)',
          backgroundColor: '#0b1120',
          borderRadius: '24px',
          overflow: 'hidden',
          border: '1px solid rgba(59, 130, 246, 0.35)',
          color: '#ffffff',
          fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
        className={`relative w-full max-w-[340px] mx-auto text-white rounded-3xl p-6 shadow-2xl border border-blue-500/30 overflow-hidden select-none ${className}`}
      >
        {/* Lanyard Slot / Hole Punch simulation */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-3 rounded-full bg-slate-950 border border-slate-700/80 shadow-inner flex items-center justify-center">
            <div className="w-8 h-1 rounded-full bg-slate-800" />
          </div>
        </div>

        {/* Ambient Top & Bottom Lighting Accents */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Card Header: Pure GAENR Branding (No OPS, No Subtitle, No Top Verified Pill) */}
        <div className="relative z-10 flex items-center justify-center pb-3.5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <GaenrLogo size={24} variant="white" />
            <span className="text-base font-black tracking-widest text-white uppercase">
              GAENR
            </span>
          </div>
        </div>

        {/* Card Body: Avatar with Verified Check & Code */}
        <div className="relative z-10 py-5 flex flex-col items-center text-center space-y-3.5">
          {/* Avatar Frame with Verified Badge - Circular Boundary matching student avatar */}
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#006eff] to-cyan-400 p-[3px] shadow-lg shadow-blue-500/25">
              <div className="w-full h-full rounded-full bg-[#eef2f6] overflow-hidden flex items-center justify-center">
                <AvatarGraphic
                  id={freelancer.avatarId}
                  size="100%"
                  className="w-full h-full rounded-full"
                  shape="circle"
                  title={freelancer.code}
                />
              </div>
            </div>
            {/* 3D Glowing Verified Badge on avatar - Halfway inside, halfway outside avatar boundary */}
            <div className="absolute bottom-[3px] right-[3px] z-10" title="Verified Expert">
              <VerifiedBadge3D size={28} className="drop-shadow-[0_0_8px_rgba(0,110,255,0.85)]" />
            </div>
          </div>

          {/* Unique Alphanumeric Code (Clean, DM Sans Font) */}
          <div className="text-2xl font-black text-white tracking-widest px-5 py-1.5 rounded-xl bg-white/5 border border-white/10 inline-block shadow-inner">
            {freelancer.code}
          </div>

          {/* Clean Category Title */}
          <div className="inline-block px-3.5 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-200 text-xs font-semibold max-w-[260px] truncate">
            {freelancer.categoryTitle}
          </div>
        </div>

        {/* Performance Metrics Grid (Deliveries, Rating, Satisfaction in DM Sans) */}
        <div className="relative z-10 grid grid-cols-3 gap-2 py-3 border-t border-white/10 bg-white/[0.02] rounded-xl px-2 mt-1">
          <div className="text-center">
            <div className="text-base font-black text-white">
              {freelancer.completedProjects || 0}
            </div>
            <div className="text-[9px] font-semibold text-slate-400 uppercase tracking-tight">
              Deliveries
            </div>
          </div>

          <div className="text-center border-x border-white/10 px-1">
            <div className="text-base font-black text-amber-400 flex items-center justify-center gap-0.5">
              <Star className={`w-3 h-3 shrink-0 ${freelancer.reviewsCount > 0 ? 'fill-amber-400 text-amber-400' : 'text-slate-500'}`} />
              <span>{freelancer.reviewsCount > 0 ? freelancer.rating.toFixed(1) : '0.0'}</span>
            </div>
            <div className="text-[9px] font-semibold text-slate-400 uppercase tracking-tight">
              Rating ({freelancer.reviewsCount})
            </div>
          </div>

          <div className="text-center">
            <div className="text-base font-black text-emerald-400">
              {freelancer.reviewsCount > 0 ? `${freelancer.satisfactionRate?.satisfied ?? 100}%` : 'New'}
            </div>
            <div className="text-[9px] font-semibold text-slate-400 uppercase tracking-tight">
              Satisfaction
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ExpertIdCard.displayName = 'ExpertIdCard';
