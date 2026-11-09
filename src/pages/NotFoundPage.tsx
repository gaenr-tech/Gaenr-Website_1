import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Compass, Home, Users, ArrowRight, Search, FileQuestion } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { navigate } = useApp();

  useEffect(() => {
    // Prevent Google from indexing non-existent or mistyped URLs
    let robotsMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    const previousRobots = robotsMeta.getAttribute('content') || 'index, follow';
    robotsMeta.setAttribute('content', 'noindex, follow');
    document.title = '404 — Page Not Found | Gaenr';

    return () => {
      if (robotsMeta) {
        robotsMeta.setAttribute('content', previousRobots);
      }
    };
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-slate-50 dark:bg-[#070b14]">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 dark:bg-[#006eff]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl w-full text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-[#006eff] border border-blue-500/20 mb-6">
          <FileQuestion className="w-3.5 h-3.5" />
          <span>Error 404 — Route Not Found</span>
        </div>

        {/* 404 Visual Heading */}
        <h1 className="text-7xl sm:text-9xl font-black tracking-tight text-slate-200 dark:text-slate-800/80 select-none">
          4<span className="text-[#006eff]">0</span>4
        </h1>

        <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Looking for Something in Bangladesh's Freelancing Hub?
        </h2>

        <p className="mt-3 text-base text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
          The page you requested doesn't exist, may have moved, or has an outdated URL. Don't worry — all verified talent and services are right here.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#006eff] hover:bg-[#0057cc] text-white font-medium text-sm transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <button
            onClick={() => navigate('/experts')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:border-[#006eff]/50 font-medium text-sm transition-all active:scale-95"
          >
            <Users className="w-4 h-4" />
            <span>Hire Freelancers in BD</span>
          </button>

          <button
            onClick={() => navigate('/services')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:border-[#006eff]/50 font-medium text-sm transition-all active:scale-95"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Services</span>
          </button>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800/60 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
          <button onClick={() => navigate('/blogs/freelancing-in-bd-guide')} className="hover:text-[#006eff] transition-colors flex items-center gap-1">
            Freelancing in BD Guide <ArrowRight className="w-3 h-3" />
          </button>
          <span>•</span>
          <button onClick={() => navigate('/support')} className="hover:text-[#006eff] transition-colors flex items-center gap-1">
            Support Center <ArrowRight className="w-3 h-3" />
          </button>
          <span>•</span>
          <button onClick={() => navigate('/contact')} className="hover:text-[#006eff] transition-colors flex items-center gap-1">
            Contact Gaenr <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
