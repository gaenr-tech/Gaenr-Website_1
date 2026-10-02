import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { AvatarGraphic } from './Avatars';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Quote,
  ExternalLink,
} from 'lucide-react';
import { TESTIMONIALS_DATA } from '../../data/testimonialsData';

export const TestimonialsCarousel: React.FC = () => {
  const { navigate } = useApp();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  const total = TESTIMONIALS_DATA.length;

  // Infinite cyclic advancement: (prev + 1) % total wraps smoothly 5 -> 0
  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  // Infinite cyclic retreat: (prev - 1 + total) % total wraps smoothly 0 -> 5
  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Autoplay loop (5s interval, pauses when hovering or touching)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, handleNext]);

  // Touch Swipe Handlers for mobile phone view
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartXRef.current || !touchEndXRef.current) {
      setIsPaused(false);
      return;
    }
    const diff = touchStartXRef.current - touchEndXRef.current;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
    setIsPaused(false);
  };

  /**
   * Cyclic offset calculation:
   * Returns shortest distance (-2, -1, 0, 1, 2) from activeIndex in circular space.
   * Enables continuous infinite carousel without any jarring rewinds!
   */
  const getCyclicDiff = (index: number) => {
    let diff = (index - activeIndex) % total;
    if (diff < -Math.floor(total / 2)) diff += total;
    if (diff > Math.floor(total / 2)) diff -= total;
    return diff;
  };

  return (
    <section id="testimonials-section" className="py-14 sm:py-18 lg:py-20 border-b border-slate-200/80 bg-slate-50/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Header: Voices of Trust & Endorsed by Recognized Voices */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0256d0] text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0256d0]" />
            <span>Voices of Trust</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Endorsed by Recognized Voices
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-normal max-w-xl mx-auto">
            Respected professionals and founders sharing their belief in Gaenr's dependable ecosystem.
          </p>
        </div>

        {/* Carousel Area: Prominent Center Card + Seamless Peeking Adjacent Cards */}
        <div
          className="relative w-full max-w-5xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Floating Left Arrow Button */}
          <button
            onClick={handlePrev}
            aria-label="Previous Endorsement"
            className="absolute -left-2 sm:left-2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 text-slate-700 hover:text-[#0256d0] hover:border-[#0256d0] shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer -translate-y-1/2 top-1/2"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Floating Right Arrow Button */}
          <button
            onClick={handleNext}
            aria-label="Next Endorsement"
            className="absolute -right-2 sm:right-2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 text-slate-700 hover:text-[#0256d0] hover:border-[#0256d0] shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer -translate-y-1/2 top-1/2"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Cards Stage Container */}
          <div className="relative w-full h-[330px] sm:h-[305px] overflow-hidden flex items-center justify-center">
            {TESTIMONIALS_DATA.map((item, index) => {
              const diff = getCyclicDiff(index);
              const isActive = diff === 0;
              const isVisible = Math.abs(diff) <= 1;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (!isActive) {
                      setActiveIndex(index);
                    }
                  }}
                  style={{
                    transform: `translateX(calc(-50% + ${diff * 96}%)) scale(${isActive ? 1 : 0.9})`,
                    opacity: isActive ? 1 : Math.abs(diff) === 1 ? 0.4 : 0,
                    zIndex: isActive ? 15 : Math.abs(diff) === 1 ? 10 : 0,
                    pointerEvents: isVisible ? 'auto' : 'none',
                    transition: 'transform 500ms cubic-bezier(0.22, 1, 0.36, 1), opacity 500ms ease, filter 500ms ease',
                  }}
                  className={`absolute top-0 bottom-0 left-1/2 my-auto h-[310px] sm:h-[285px] w-[90%] sm:w-[78%] lg:w-[64%] max-w-xl flex flex-col justify-between overflow-hidden rounded-3xl p-5 sm:p-7 text-left transition-all bg-white ${
                    isActive
                      ? 'border-2 border-[#0256d0]/80 shadow-2xl shadow-blue-950/10 ring-4 ring-blue-50 cursor-default'
                      : 'border border-slate-200/90 shadow-md cursor-pointer blur-[0.5px] hover:opacity-60'
                  }`}
                >
                  {/* Top Accent Gradient on Featured Card */}
                  {isActive && (
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#0256d0] via-sky-400 to-[#0256d0]" />
                  )}

                  {/* Decorative Background Quote Watermark */}
                  <Quote className="absolute right-5 top-5 w-10 h-10 sm:w-12 sm:h-12 text-slate-100/90 pointer-events-none" />

                  {/* Endorsement Quote Body */}
                  <div className="relative z-10 pt-1 sm:pt-1.5">
                    <p className="text-xs sm:text-sm lg:text-[14.5px] text-slate-800 leading-relaxed font-normal">
                      "{item.quote}"
                    </p>
                  </div>

                  {/* Author Profile Footer: Photo, Details, and Official Social Icons */}
                  <div className="flex items-center justify-between gap-3 pt-3.5 border-t border-slate-100 relative z-10">
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Photo / Avatar */}
                      <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden shrink-0 ring-2 ring-blue-100 shadow-xs bg-slate-100 flex items-center justify-center">
                        {!imgErrors[item.id] ? (
                          <img
                            src={item.avatarUrl || item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover object-center"
                            onError={() => setImgErrors((prev) => ({ ...prev, [item.id]: true }))}
                            loading="lazy"
                          />
                        ) : (
                          <AvatarGraphic id={item.avatarId} size={48} />
                        )}
                      </div>

                      {/* Name, Designation, and Company */}
                      <div className="min-w-0 flex flex-col justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/testimonials?id=${item.id}`);
                          }}
                          className="text-left text-sm sm:text-base font-bold text-slate-900 truncate leading-tight hover:text-[#006eff] transition-colors cursor-pointer group inline-flex items-center gap-1"
                        >
                          <span>{item.name}</span>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#006eff]" />
                        </button>
                        <p className="text-xs sm:text-sm text-slate-500 font-normal truncate leading-snug">
                          {item.title}
                        </p>
                        <p className="text-[11px] sm:text-xs font-semibold text-slate-700 truncate leading-snug">
                          {item.company}
                        </p>
                      </div>
                    </div>

                    {/* Official Social Media Icons */}
                    <div className="flex items-center gap-x-2 shrink-0">
                      {/* Official Facebook SVG */}
                      <a
                        href={item.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${item.name} Facebook Profile`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex size-7 items-center justify-center rounded-xl border border-gray-300 text-gray-500 duration-200 hover:text-gray-800 hover:border-gray-500 active:text-gray-800 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          className="size-3.5 sm:size-4 shrink-0"
                        >
                          <path
                            fill="currentColor"
                            d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4z"
                          />
                        </svg>
                      </a>

                      {/* Official LinkedIn SVG */}
                      <a
                        href={item.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${item.name} LinkedIn Profile`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex size-7 items-center justify-center rounded-xl border border-gray-300 text-gray-500 duration-200 hover:text-gray-800 hover:border-gray-500 active:text-gray-800 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          className="size-3.5 sm:size-4 shrink-0"
                        >
                          <path
                            fill="currentColor"
                            d="M18.336 18.339h-2.665v-4.177c0-.996-.02-2.278-1.39-2.278c-1.389 0-1.601 1.084-1.601 2.205v4.25h-2.666V9.75h2.56v1.17h.035c.358-.674 1.228-1.387 2.528-1.387c2.7 0 3.2 1.778 3.2 4.092v4.714M7.004 8.575a1.546 1.546 0 0 1-1.548-1.549a1.548 1.548 0 1 1 1.547 1.549m1.336 9.764H5.667V9.75H8.34zM19.67 3H4.33C3.594 3 3 3.58 3 4.297v15.406C3 20.42 3.594 21 4.328 21h15.339C20.4 21 21 20.42 21 19.703V4.297C21 3.581 20.4 3 19.666 3z"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Single Consolidated Pagination Dots Indicator */}
        <div className="flex items-center justify-center gap-2 pt-1">
          {TESTIMONIALS_DATA.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => setActiveIndex(dotIdx)}
              aria-label={`Go to endorsement ${dotIdx + 1}`}
              className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
                activeIndex === dotIdx
                  ? 'w-7 bg-[#0256d0]'
                  : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>

        {/* Bottom CTA Link: Connect directly to Testimonials Page */}
        <div className="pt-2 flex justify-center">
          <button
            onClick={() => navigate('/testimonials')}
            className="gaenr-link-btn !text-base cursor-pointer"
          >
            <span>Explore All Testimonials</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
