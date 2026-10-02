import React, { useEffect, useCallback } from 'react';
import { PortfolioItem, FreelancerProfile } from '../../types';
import { useBranding } from '../../context/BrandingContext';
import { useApp } from '../../context/AppContext';
import { X, ChevronLeft, ChevronRight, ShieldCheck, Lock, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';

interface PortfolioLightboxProps {
  expert: FreelancerProfile;
  items: PortfolioItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
}

export const PortfolioLightbox: React.FC<PortfolioLightboxProps> = ({
  expert,
  items,
  currentIndex,
  isOpen,
  onClose,
  onSelectIndex,
}) => {
  const { branding } = useBranding();
  const { openAssignTask } = useApp();

  const currentItem = items[currentIndex];

  const handleNext = useCallback(() => {
    if (currentIndex < items.length - 1) {
      onSelectIndex(currentIndex + 1);
    } else {
      onSelectIndex(0); // loop
    }
  }, [currentIndex, items.length, onSelectIndex]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onSelectIndex(currentIndex - 1);
    } else {
      onSelectIndex(items.length - 1);
    }
  }, [currentIndex, items.length, onSelectIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev]);

  if (!isOpen || !currentItem) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={currentItem.title}
      onContextMenu={(e) => e.preventDefault()} // Portfolio protection deterrent
    >
      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl h-[88vh] flex flex-col md:flex-row overflow-hidden shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-full backdrop-blur-xs transition-colors"
          aria-label="Close Lightbox"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Viewing Pane */}
        <div className="relative flex-1 bg-slate-950 flex items-center justify-center p-4 sm:p-8 overflow-hidden">
          {/* Watermark Overlay (Runtime branding) */}
          <div
            className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center overflow-hidden"
            style={{ opacity: branding.watermarkOpacity / 100 }}
          >
            <div className="transform -rotate-25 text-white/30 text-3xl sm:text-5xl font-black uppercase tracking-widest text-center whitespace-nowrap select-none">
              {branding.watermarkText} · {expert.code}
            </div>
          </div>

          {/* Visual Presentation Container */}
          <div className="relative z-0 max-h-full max-w-full flex items-center justify-center">
            {currentItem.previewType === 'document' ? (
              /* High-fidelity Document Preview */
              <div className="bg-white text-slate-900 rounded-xl p-8 max-w-md shadow-2xl space-y-4 max-h-[60vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase">
                    <FileText className="w-4 h-4" />
                    <span>Editorial Manuscript / Copy</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{expert.code}</span>
                </div>
                <h4 className="text-xl font-bold leading-snug">{currentItem.title}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{currentItem.description}</p>

                {currentItem.summaryPoints && (
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <span className="text-xs font-semibold text-slate-700">Deliverable Breakdown:</span>
                    {currentItem.summaryPoints.map((pt, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : currentItem.previewType === 'video' ? (
              /* High-fidelity Video/Motion Showcase Graphic */
              <div className="w-full max-w-xl aspect-video rounded-xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col items-center justify-center p-6 text-center space-y-3 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/40 via-slate-900 to-blue-950/40" />
                <div className="relative z-10 w-16 h-16 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 fill-current translate-x-0.5" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div className="relative z-10 space-y-1">
                  <h4 className="text-white font-bold text-lg">{currentItem.title}</h4>
                  <p className="text-xs text-slate-400">4K Master · 60fps · Sound Engineered</p>
                </div>
              </div>
            ) : (
              /* Clean Graphic / Design Mockup Showcase */
              <div className="w-full max-w-xl aspect-4/3 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col justify-between p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-950/30 via-slate-900 to-indigo-950/40" />
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-xs font-mono font-medium text-blue-400 bg-blue-950/60 border border-blue-800/60 px-2.5 py-1 rounded-md">
                    Verified Portfolio Piece
                  </span>
                  <span className="text-xs font-mono text-slate-400">{expert.code}</span>
                </div>

                <div className="relative z-10 space-y-2 py-8">
                  <h4 className="text-2xl font-bold text-white tracking-tight leading-tight">
                    {currentItem.title}
                  </h4>
                  <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed">
                    {currentItem.description}
                  </p>
                </div>

                <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-3">
                  <span>{currentItem.clientIndustry || 'Client Project'}</span>
                  <span>Protected Preview</span>
                </div>
              </div>
            )}
          </div>

          {/* Prev / Next Controls */}
          {items.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 text-white/70 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-full backdrop-blur-xs transition-colors"
                aria-label="Previous Item"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 text-white/70 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-full backdrop-blur-xs transition-colors"
                aria-label="Next Item"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-slate-900/80 border border-slate-800 px-3 py-1 rounded-full text-xs font-mono text-slate-300">
            {currentIndex + 1} / {items.length}
          </div>
        </div>

        {/* Metadata & Conversion Pane */}
        <div className="w-full md:w-84 bg-slate-900 border-t md:border-t-0 md:border-l border-slate-800 p-6 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Curated Work Proof</span>
              </div>
              <h3 className="text-lg font-bold text-white leading-snug">
                {currentItem.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Completed by expert <span className="font-mono text-white font-medium">{expert.code}</span>
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <h5 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Tools &amp; Tech Stack
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {currentItem.tools.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-300 border border-slate-700 font-mono"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {currentItem.summaryPoints && (
                <div>
                  <h5 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Scope Highlights
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {currentItem.summaryPoints.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-blue-400 font-bold">·</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Practical Protection Notice */}
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
              <Lock className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
              <span>
                Protected inline preview. Direct asset downloads and unauthorized distribution are restricted by Gaenr media policy.
              </span>
            </div>
          </div>

          {/* Action to Assign Task */}
          <div className="pt-6 border-t border-slate-800 space-y-2">
            <button
              onClick={() => {
                onClose();
                openAssignTask(expert.code, currentItem.category);
              }}
              className="w-full py-3 rounded-lg text-sm font-semibold text-white shadow-sm hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              style={{ backgroundColor: branding.primaryColor }}
            >
              <span>Assign Project to {expert.code}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-center text-slate-400">
              0% platform fee · Managed by Gaenr team
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
