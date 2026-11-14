import React, { useState } from 'react';
import { Copy, Check, Download, ExternalLink, Image as ImageIcon } from 'lucide-react';
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
      label: 'Standard Logo (1600 × 600)',
      url: 'https://gaenr.com/logo-white-bg.png',
      altUrl: 'https://gaenr.com/images/gaenr-logo-white-bg.png',
      format: 'PNG',
      desc: 'Full horizontal logo centered on pure white canvas',
    },
    {
      label: 'Square Logo (1200 × 1200)',
      url: 'https://gaenr.com/logo-white-bg-square.png',
      altUrl: 'https://gaenr.com/images/gaenr-logo-square-white-bg.png',
      format: 'PNG (1:1)',
      desc: 'Ideal for avatars, merchant profiles & app stores',
    },
    {
      label: 'Vector Logo (SVG)',
      url: 'https://gaenr.com/logo-white-bg.svg',
      altUrl: 'https://gaenr.com/images/gaenr-logo-white-bg.svg',
      format: 'SVG',
      desc: 'Infinite resolution scalable vector format',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 py-12 px-4 sm:px-6 flex flex-col items-center justify-center">
      {/* Container */}
      <div className="w-full max-w-4xl mx-auto space-y-10">
        
        {/* Main Logo Display on Pure White */}
        <div className="w-full bg-white rounded-3xl border border-slate-200/80 shadow-xs p-8 sm:p-14 flex flex-col items-center justify-center">
          <div className="w-full max-w-xl aspect-[16/6] bg-white flex items-center justify-center">
            <img
              src="/logo-white-bg.png"
              alt="Gaenr Logo on White Background"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200/80">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Gaenr Official Logo (White Background)
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Direct public URLs for embedding, forms, KYC, and external branding.
              </p>
            </div>
            
            <a
              href="/logo-white-bg.png"
              download="gaenr-logo-white-bg.png"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#006eff] hover:bg-[#005cd4] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download High-Res PNG</span>
            </a>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {assetLinks.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{item.label}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                      {item.format}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-2 space-y-2">
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-200/70 text-[11px] font-mono text-slate-600 truncate">
                    <span className="truncate flex-1 select-all">{item.url}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(item.url, `url-${idx}`)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
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
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors"
                      title="Open image in new tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
