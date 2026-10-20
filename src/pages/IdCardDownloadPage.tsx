import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GaenrLogo } from '../components/common/GaenrLogo';
import { FreelancerProfile } from '../types';
import { generateInstantIdCardPng } from '../utils/instantIdCardCanvas';
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
  const expert = freelancers.find((f) => f.code.toUpperCase() === resolvedCode);

  const effectiveExpert: FreelancerProfile = expert || {
    id: `fl_${resolvedCode}`,
    code: resolvedCode,
    name: '',
    category: 'graphic_creative',
    categoryTitle: 'Verified Expert',
    avatarId: 'avatar-1',
    completedProjects: 0,
    rating: 0,
    reviewsCount: 0,
    satisfactionRate: { satisfied: 0, neutral: 0, unsatisfied: 0 },
    reviews: [],
    portfolioItems: [],
    isPublic: true,
    skills: ['Verified Discipline'],
    status: 'active',
    dateAdded: new Date().toISOString(),
  };

  const triggerDownload = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      if (document.body.contains(a)) document.body.removeChild(a);
    }, 200);
    setIsDownloaded(true);
  };

  const handleStartDownload = async () => {
    try {
      // 1. Generate ultra-crisp ID Card PNG immediately in ~15ms via HTML5 Canvas
      const dataUrl = await generateInstantIdCardPng(effectiveExpert);
      if (dataUrl) {
        triggerDownload(dataUrl, `GAENR-ID-${resolvedCode}.png`);

        // Background sync to server so server cache also has it
        fetch('/api/id-card', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: resolvedCode, imageData: dataUrl }),
        }).catch(() => {});
        return;
      }
    } catch (err) {
      console.warn('Canvas generator note:', err);
    }

    // 2. Direct server fallback if canvas unavailable
    triggerDownload(`/api/id-card?code=${encodeURIComponent(resolvedCode)}&format=binary`, `GAENR-ID-${resolvedCode}.png`);
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

      {/* Main Download Card */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Badge Icon */}
          <div className="relative mx-auto w-20 h-20 rounded-3xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-[#38bdf8] shadow-inner">
            {isDownloaded ? (
              <CheckCircle className="w-10 h-10 text-emerald-400 animate-in zoom-in-75 duration-200" />
            ) : (
              <Download className="w-10 h-10 text-[#38bdf8]" />
            )}
          </div>

          <div className="space-y-2 relative z-10">
            <span className="text-[11px] font-mono tracking-widest uppercase px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 font-bold inline-block">
              GAENR Verified Digital ID
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Official Expert ID Card
            </h1>
            <p className="text-xs font-mono font-bold text-[#38bdf8] tracking-widest text-lg">
              {resolvedCode}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
              {isDownloaded
                ? 'Official ID card has been downloaded to your device.'
                : 'This is your official expert ID card. Click below to download directly to your device.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-3 relative z-10">
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
                  <span>Download Now</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-3 pt-1">
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
