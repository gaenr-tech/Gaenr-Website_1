import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { GaenrLogo } from '../components/common/GaenrLogo';
import { FreelancerProfile } from '../types';
import { ExpertIdCard } from '../components/common/ExpertIdCard';
import { downloadIdCardBadge } from '../utils/downloadIdCardImage';
import { Download, CheckCircle, ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';

interface IdCardDownloadPageProps {
  code?: string;
}

export const IdCardDownloadPage: React.FC<IdCardDownloadPageProps> = ({ code: propCode }) => {
  const { currentRoute, freelancers, navigate } = useApp();

  const cleanRoute = currentRoute.split('#')[0].split('?')[0];
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const resolvedCode = (
    propCode ||
    urlParams.get('code') ||
    cleanRoute.replace('/download/id-card/', '').replace('/id-card-download/', '').replace('/id-card/', '').trim()
  ).toUpperCase();

  const [isDownloaded, setIsDownloaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const expert = freelancers.find((f) => f.code.toUpperCase() === resolvedCode);
  const [remoteExpert, setRemoteExpert] = useState<FreelancerProfile | null>(null);

  // Fetch authoritative expert profile from remote store if opened on an external device/incognito
  useEffect(() => {
    if (expert) return;
    let isMounted = true;
    const fetchExpert = async () => {
      try {
        const apiBase = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
        const res = await fetch(`${apiBase}/api/state?_t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          const raw = data?.state?.gaenr_freelancers;
          if (raw) {
            const list: FreelancerProfile[] = typeof raw === 'string' ? JSON.parse(raw) : raw;
            const found = list.find((fl) => fl.code.toUpperCase() === resolvedCode.toUpperCase());
            if (found && isMounted) {
              setRemoteExpert(found);
            }
          }
        }
      } catch (err) {
        console.warn('Failed to fetch remote state for ID card:', err);
      }
    };
    fetchExpert();
    return () => {
      isMounted = false;
    };
  }, [resolvedCode, expert]);

  const effectiveExpert: FreelancerProfile = expert || remoteExpert || {
    id: `fl_${resolvedCode}`,
    code: resolvedCode,
    name: '',
    category: 'graphics-design',
    categoryTitle: 'Verified Expert',
    avatarId: 'avatar-youth-m1',
    completedProjects: 0,
    rating: 0,
    reviewsCount: 0,
    satisfactionRate: { satisfied: 0, neutral: 0, unsatisfied: 0 },
    reviews: [],
    portfolioItems: [],
    isPublic: true,
    statement: '',
    skills: ['Verified Discipline'],
    status: 'active',
    dateAdded: new Date().toISOString(),
  };

  const handleStartDownload = async () => {
    // Direct download using the exact backend ExpertIdCard DOM element
    if (cardRef.current) {
      try {
        const success = await downloadIdCardBadge(cardRef.current, effectiveExpert);
        if (success) {
          setIsDownloaded(true);
        }
      } catch (err) {
        console.warn('DOM card download warning:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-[#006eff] selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GaenrLogo size={30} variant="white" />
            <span className="text-slate-700">|</span>
            <span className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#006eff]" />
              Official Credential Vault
            </span>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            gaenr.com
          </button>
        </div>
      </header>

      {/* Main Download Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 my-auto">
        <div className="max-w-md w-full text-center space-y-5">
          {/* Header text */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono tracking-widest uppercase px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 font-bold inline-block">
              GAENR Verified Digital ID
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Official Expert ID Card
            </h1>
            <p className="text-xs text-slate-400">
              {isDownloaded
                ? 'Official ID card has been downloaded to your device.'
                : 'Your official credential card is displayed below. Click the button to download directly.'}
            </p>
          </div>

          {/* Exact Backend Digital ID Card Rendered Visibly */}
          <div className="flex justify-center transition-transform hover:scale-[1.01] duration-300">
            <ExpertIdCard ref={cardRef} freelancer={effectiveExpert} />
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-1 max-w-[340px] mx-auto w-full">
            <button
              onClick={handleStartDownload}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer !cursor-pointer active:scale-98 select-none ${
                isDownloaded
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/25'
                  : 'bg-[#006eff] hover:bg-blue-600 active:bg-blue-700 text-white shadow-blue-500/25'
              }`}
            >
              {isDownloaded ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-100 shrink-0" />
                  <span>Downloaded (Click to Re-Download)</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 shrink-0" />
                  <span>Download ID Card</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/experts/${resolvedCode}`)}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View Live Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Home</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 px-6 py-4 text-center text-xs text-slate-600">
        Team GAENR &bull; Security &amp; Talent Vault &bull; gaenr.com
      </footer>
    </div>
  );
};
