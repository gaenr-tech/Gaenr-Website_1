import React, { useState } from 'react';
import { Copy, Check, Download, ExternalLink } from 'lucide-react';
import { updatePageMeta } from '../utils/seo';

export const LogoWhiteBgPage: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  React.useEffect(() => {
    updatePageMeta('/logo-white-bg', {
      title: 'Gaenr Logo — White Background',
      description: 'Official Gaenr brand logo on white background.',
    });
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const assetLinks = [
    {
      label: 'Official Logo (PNG)',
      url: 'https://gaenr.com/logo-white-bg.png',
      altUrl: 'https://gaenr.com/images/gaenr-logo-white-bg.png',
      format: '1024 × 1024 PNG',
      desc: 'Lossless quality on pure white background',
    },
    {
      label: 'Standard JPG',
      url: 'https://gaenr.com/logo-white-bg.jpg',
      altUrl: 'https://gaenr.com/images/gaenr-logo-white-bg.jpg',
      format: '1024 × 1024 JPG',
      desc: 'Compatible with forms, portals & merchant KYC',
    },
    {
      label: 'Ultra High-Res (2K)',
      url: 'https://gaenr.com/logo-white-bg-2k.png',
      altUrl: 'https://gaenr.com/images/gaenr-logo-white-bg-2k.png',
      format: '2048 × 2048 PNG',
      desc: 'High-resolution for large print and display',
    },
    {
      label: 'Scalable Vector (SVG)',
      url: 'https://gaenr.com/logo-white-bg.svg',
      altUrl: 'https://gaenr.com/images/gaenr-logo-white-bg.svg',
      format: 'SVG Vector',
      desc: 'Infinitely scalable resolution',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 py-12 px-4 sm:px-6 flex flex-col items-center justify-center selection:bg-[#006eff] selection:text-white">
      {/* Container */}
      <div className="w-full max-w-3xl mx-auto space-y-8">
        
        {/* Main Logo Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-12 flex flex-col items-center justify-center">
          <div className="w-64 h-64 sm:w-80 sm:h-80 bg-white rounded-2xl border border-slate-100 flex items-center justify-center overflow-hidden shadow-2xs">
            <img
              src="/logo-white-bg.png"
              alt="Gaenr Logo on White Background"
              className="w-full h-full object-contain"
            />
          </div>
          
          <div className="text-center mt-6 space-y-1">
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Gaenr Official Brand Logo
            </h1>
            <p className="text-xs text-slate-500">
              Pure White Background • 1024 × 1024 px
            </p>
          </div>
        </div>

        {/* Action Panel */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-100">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Direct Unlisted URLs
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Use these direct links for external profiles, documents, merchant accounts, or forms.
              </p>
            </div>

            <a
              href="/logo-white-bg.png"
              download="gaenr-logo-white-bg.png"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#006eff] hover:bg-[#005cd4] text-white text-xs font-semibold transition-all shadow-sm shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Download PNG</span>
            </a>
          </div>

          {/* Links List */}
          <div className="space-y-3">
            {assetLinks.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{item.label}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 font-semibold">
                      {item.format}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-500 truncate">
                    {item.url}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleCopy(item.url, `url-${idx}`)}
                    className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:text-[#006eff] text-slate-700 text-xs font-medium transition-all cursor-pointer shadow-2xs"
                  >
                    {copiedKey === `url-${idx}` ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-semibold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 transition-colors shadow-2xs"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
