import React, { useEffect, useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { GaenrLogo } from '../components/common/GaenrLogo';
import { ExpertIdCard } from '../components/common/ExpertIdCard';
import { captureIdCardDataUrl } from '../utils/downloadIdCardImage';
import { Download, CheckCircle, ArrowRight, ExternalLink, ShieldCheck, RefreshCw } from 'lucide-react';

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
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);

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
    setIsGenerating(false);
  };

  const handleStartDownload = async () => {
    setIsGenerating(true);
    setDownloadError(null);

    // 1. Try downloading directly from /api/id-card?code=...
    try {
      const res = await fetch(`/api/id-card?code=${encodeURIComponent(resolvedCode)}&format=binary`);
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('image')) {
        const blob = await res.blob();
        if (blob && blob.size > 1000) {
          const blobUrl = URL.createObjectURL(blob);
          triggerDownload(blobUrl, `GAENR-ID-${resolvedCode}.png`);
          return;
        }
      }
    } catch {
      // Fallback to client-side capture
    }

    // 2. Client-side Canvas Capture fallback using ExpertIdCard component
    if (cardRef.current) {
      try {
        await new Promise((r) => setTimeout(r, 250));
        const dataUrl = await captureIdCardDataUrl(cardRef.current);
        if (dataUrl) {
          // Sync to server in background
          fetch('/api/id-card', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: resolvedCode, imageData: dataUrl }),
          }).catch(() => {});

          triggerDownload(dataUrl, `GAENR-ID-${resolvedCode}.png`);
          return;
        }
      } catch (err: any) {
        console.warn('Client card render error:', err);
      }
    }

    // Direct link fallback
    triggerDownload(`/api/id-card?code=${encodeURIComponent(resolvedCode)}`, `GAENR-ID-${resolvedCode}.png`);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleStartDownload();
    }, 400);
    return () => clearTimeout(timer);
  }, [resolvedCode]);

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
              <Download className="w-10 h-10 animate-bounce duration-1000" />
            )}
          </div>

          <div className="space-y-2 relative z-10">
            <span className="text-[11px] font-mono tracking-widest uppercase px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 font-bold inline-block">
              GAENR Verified Digital ID
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {isDownloaded ? 'ID Card Downloaded!' : 'Downloading Official ID Card'}
            </h1>
            <p className="text-xs font-mono font-bold text-[#38bdf8] tracking-widest text-lg">
              {resolvedCode}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
              {isDownloaded
                ? 'Your high-resolution credential badge PNG has been saved to your device. Please store it securely.'
                : 'Your high-resolution verified credential badge PNG is downloading automatically. Please wait a moment.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-3 relative z-10">
            <button
              onClick={handleStartDownload}
              className="w-full py-3.5 px-6 rounded-xl bg-[#006eff] hover:bg-blue-600 text-white font-bold text-xs transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isDownloaded ? 'Click to Re-Download' : 'Download ID Card Now'}</span>
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

      {/* Hidden Offscreen Render for Instant Client-Side DOM Capture */}
      <div className="fixed -left-[9999px] -top-[9999px] pointer-events-none opacity-0" aria-hidden="true">
        <div ref={cardRef}>
          <ExpertIdCard freelancer={effectiveExpert} />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 px-6 py-4 text-center text-xs text-slate-600">
        Team GAENR &bull; Security &amp; Talent Vault &bull; gaenr.com
      </footer>
    </div>
  );
};
