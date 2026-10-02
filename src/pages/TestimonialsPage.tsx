import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { TESTIMONIALS_DATA } from '../data/testimonialsData';

export const TestimonialsPage: React.FC = () => {
  const { currentRoute } = useApp();
  const [activeIndex, setActiveIndex] = useState(0);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [detectedLightBg, setDetectedLightBg] = useState<boolean | null>(null);

  // If user navigated with a specific testimonial ID or index in query
  useEffect(() => {
    if (currentRoute.includes('?id=')) {
      const matchId = currentRoute.split('?id=')[1]?.split('&')[0];
      const foundIdx = TESTIMONIALS_DATA.findIndex((t) => t.id === matchId);
      if (foundIdx !== -1) setActiveIndex(foundIdx);
    } else if (currentRoute.includes('?index=')) {
      const idx = parseInt(currentRoute.split('?index=')[1]?.split('&')[0], 10);
      if (!isNaN(idx) && idx >= 0 && idx < TESTIMONIALS_DATA.length) {
        setActiveIndex(idx);
      }
    }
  }, [currentRoute]);

  const current = TESTIMONIALS_DATA[activeIndex] || TESTIMONIALS_DATA[0];
  const total = TESTIMONIALS_DATA.length;

  // Dynamically analyze image bottom luminance for contrast adaptation while keeping blurry view
  useEffect(() => {
    setDetectedLightBg(null);
    if (!current?.imageUrl) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = current.imageUrl;
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 40;
        canvas.height = 40;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, img.naturalHeight * 0.75, img.naturalWidth, img.naturalHeight * 0.25, 0, 0, 40, 40);
          const data = ctx.getImageData(0, 0, 40, 40).data;
          let totalBrightness = 0;
          for (let i = 0; i < data.length; i += 4) {
            const b = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
            totalBrightness += b;
          }
          const avg = totalBrightness / (data.length / 4);
          setDetectedLightBg(avg > 140);
        }
      } catch {
        // Fallback to static flag
      }
    };
  }, [current?.imageUrl]);

  const isLight = detectedLightBg !== null ? detectedLightBg : Boolean(current.isLightBg);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 antialiased space-y-12 sm:space-y-16 pb-16">
      {/* =========================================================================
          HERO BANNER: Exactly matching Service Page Cover
          - Deep brand blue `#006eff`
          - Pattern overlay with reduced opacity (from ServicesPage)
          - Subtle radial geometric dot grid overlay
          - Breadcrumb navigation
          - Clean headline and subtitle
         ========================================================================= */}
      <section className="relative w-full bg-gradient-to-br from-[#0048ba] via-[#006eff] to-[#003d99] py-12 sm:py-16 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        {/* Soft Glowing Ambient Color Clouds */}
        <div className="absolute -top-24 -left-20 w-96 h-96 bg-cyan-400/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-20 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-44 bg-sky-200/15 rounded-full blur-2xl pointer-events-none" />

        {/* Artistic Layered Flowing Waves SVG */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-40 mix-blend-screen"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="testimonials-artistic-wave-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#818cf8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id="testimonials-artistic-wave-2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#006eff" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="testimonials-artistic-wave-3" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path fill="url(#testimonials-artistic-wave-1)" d="M0,128L60,144C120,160,240,192,360,181.3C480,171,600,117,720,117.3C840,117,960,171,1080,181.3C1200,192,1320,160,1380,144L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
          <path fill="url(#testimonials-artistic-wave-2)" d="M0,64L48,96C96,128,192,192,288,208C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,181.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          <path fill="url(#testimonials-artistic-wave-3)" d="M0,224L60,208C120,192,240,160,360,165.3C480,171,600,213,720,202.7C840,192,960,128,1080,112C1200,96,1320,128,1380,144L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
        </svg>

        <article className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-y-3 sm:gap-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Testimonials
          </h1>
          <p className="text-sm sm:text-base text-white/95 font-normal leading-relaxed text-center">
            Discover the stories of our satisfied customers and how our services have transformed their lives.
          </p>
        </article>
      </section>

      {/* =========================================================================
          FEATURED TESTIMONIAL SHOWCASE
          - Left: Aspect 3:4 portrait photo card with glassmorphism "Watch Testimonial" button
          - Right: Stylized gradient quote mark, bold statement, author & official social icons
         ========================================================================= */}
      <section className="mx-auto w-full max-w-5xl px-6">
        <div className="flex flex-col gap-12 md:flex-row items-center md:items-stretch">
          {/* Left Column: Portrait Photo Card */}
          <div className="relative mx-auto aspect-3/4 w-full max-w-xs overflow-hidden rounded-4xl bg-gray-100 border border-slate-200/80 shadow-md shrink-0">
            <img
              alt={current.name}
              loading="lazy"
              className="w-full h-full object-cover object-center transition-all duration-500"
              src={current.imageUrl}
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== current.fallbackUrl) {
                  target.src = current.fallbackUrl;
                }
              }}
            />

            {/* Watch Testimonial Floating Frosted Glass Button:
                - Exact same blurry glassmorphic view for everyone (border-2 border-white/20 bg-white/20 backdrop-blur-lg saturate-150)
                - If background is light: writing & icon are dark
                - Else: writing & icon are light like before
            */}
            <button
              onClick={() => setVideoModalOpen(true)}
              className="absolute bottom-8 left-1/2 flex w-[78%] -translate-x-1/2 cursor-pointer items-center justify-between rounded-full border-2 border-white/20 bg-white/20 px-5 py-3 text-center text-sm saturate-150 backdrop-blur-lg duration-200 hover:bg-white/35 active:scale-95 shadow-lg transition-all"
            >
              <p className={`font-semibold tracking-tight transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Watch Testimonial
              </p>
              <div
                className={`size-5 shrink-0 rounded-full p-1 flex items-center justify-center transition-colors ${
                  isLight
                    ? 'bg-black/15 ring-1 ring-black/25'
                    : 'bg-white/20 ring-1 ring-white/60'
                }`}
              >
                <Play
                  className={`size-2.5 ml-0.5 transition-colors ${
                    isLight ? 'fill-slate-900 text-slate-900' : 'fill-white text-white'
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Right Column: Quote + Gradient Quotation Mark + Author Details */}
          <div className="flex flex-col justify-between gap-y-8 md:my-10 text-left flex-1">
            <div className="relative pt-2">
              {/* Giant Stylized Gradient Quotation Mark SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 9.5 7.5"
                className="absolute top-0 left-0 -z-10 size-10 -translate-y-1/3 sm:size-12 pointer-events-none opacity-80"
              >
                <defs>
                  <linearGradient id="testimonial-linear-gradient" x1="4.75" y1="7.5" x2="4.75" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#8ec5ff" stopOpacity=".7" />
                    <stop offset=".14" stopColor="#90c6ff" stopOpacity=".68" />
                    <stop offset=".29" stopColor="#98caff" stopOpacity=".63" />
                    <stop offset=".45" stopColor="#a5d1ff" stopOpacity=".55" />
                    <stop offset=".6" stopColor="#b8daff" stopOpacity=".44" />
                    <stop offset=".76" stopColor="#cfe6ff" stopOpacity=".29" />
                    <stop offset=".91" stopColor="#ecf5ff" stopOpacity=".12" />
                    <stop offset="1" stopColor="#fff" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#testimonial-linear-gradient)"
                  d="M7.28,7.5c-1,.03-2.09-.72-2.26-2.3v-.16s-.01,0-.01,0c-.1-1.66,1.06-3.93,3.59-5.02.12-.05.25,0,.32.1l.56.96c.07.12.03.27-.09.34,0,0,0,0,0,0-.86.48-1.52,1.24-1.92,2.15.6.11,1.02.35,1.31.68.33.38.45.85.45,1.26,0,1.11-.85,2-1.93,1.98M2.28,7.5c-1,.03-2.09-.72-2.26-2.3v-.16s-.01,0-.01,0C-.09,3.38,1.07,1.11,3.6.02c.12-.05.25,0,.32.1l.55.96c.07.12.03.27-.09.34,0,0,0,0,0,0-.86.48-1.52,1.24-1.92,2.15.6.11,1.02.35,1.31.68.33.38.45.85.45,1.26,0,1.11-.85,2-1.93,1.98"
                />
              </svg>

              <h2 className="text-center text-xl font-medium md:text-start md:text-2xl text-slate-900 leading-snug">
                {current.quote}
              </h2>
            </div>

            <div className="flex flex-col items-center justify-between gap-y-6 md:flex-row pt-4 border-t border-slate-100">
              <div className="flex flex-col items-center md:items-start space-y-0.5 text-center md:text-left">
                <h3 className="text-lg font-bold text-slate-900 md:text-xl">
                  {current.name}
                </h3>
                <p className="text-sm font-medium text-gray-500">
                  {current.title} at {current.company}
                </p>
              </div>

              {/* Exact Official Social Media Icons from Reference HTML */}
              <div className="flex items-center gap-x-6">
                {/* Facebook Button */}
                <a
                  href={current.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook Profile"
                  className="flex size-7 items-center justify-center rounded-xl border border-gray-300 text-gray-500 duration-200 hover:text-gray-800 hover:border-gray-500 active:text-gray-800 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="size-4 shrink-0"
                  >
                    <path
                      fill="currentColor"
                      d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4z"
                    />
                  </svg>
                </a>

                {/* LinkedIn Button */}
                <a
                  href={current.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  className="flex size-7 items-center justify-center rounded-xl border border-gray-300 text-gray-500 duration-200 hover:text-gray-800 hover:border-gray-500 active:text-gray-800 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="size-4 shrink-0"
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
        </div>
      </section>

      {/* =========================================================================
          PAGINATION BAR
          - Index counter
          - Subtle divider track
          - Circular prev / next buttons with active scale
          - Dot indicators with active primary color
         ========================================================================= */}
      <section className="mx-auto grid w-full max-w-4xl grid-cols-6 gap-12 px-6 pt-4">
        <div className="col-span-full flex w-full items-center justify-center gap-x-6">
          <p className="hidden w-12 text-center text-sm font-medium text-slate-500 md:block">
            {activeIndex + 1} / {total}
          </p>

          <div className="hidden h-0.5 w-full grow rounded-full bg-gray-200/60 md:block" />

          {/* Previous Button */}
          <button
            onClick={handlePrev}
            aria-label="Previous testimonial"
            className="flex size-7.5 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 text-gray-600 duration-200 hover:border-gray-400 active:scale-70 active:border-gray-400 cursor-pointer transition-all"
          >
            <ChevronLeft className="size-4" />
          </button>

          {/* Dot Indicators */}
          <div className="flex gap-x-3 items-center">
            {TESTIMONIALS_DATA.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                aria-label={`Go to testimonial ${idx + 1}`}
                className={`relative overflow-hidden rounded-full transition-all cursor-pointer ${
                  activeIndex === idx
                    ? 'size-2.5 md:size-3 bg-[#006eff]'
                    : 'size-2 md:size-2.5 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            aria-label="Next testimonial"
            className="flex size-7.5 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 text-gray-600 duration-200 hover:border-gray-400 active:scale-70 active:border-gray-400 cursor-pointer transition-all"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </section>

      {/* =========================================================================
          VIDEO TESTIMONIAL MODAL
         ========================================================================= */}
      {videoModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in"
          onClick={() => setVideoModalOpen(false)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-white space-y-4 shadow-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#006eff]" />
                <h3 className="font-bold text-sm">{current.videoTitle}</h3>
              </div>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video bg-slate-950 rounded-xl flex flex-col items-center justify-center text-center p-6 border border-slate-800 space-y-3 relative overflow-hidden">
              <div className="w-16 h-16 rounded-full bg-[#006eff] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer">
                <Play className="w-7 h-7 fill-white text-white ml-1" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">Video Testimonial</p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                  Watch {current.name} share their journey and verified experience with Gaenr.
                </p>
              </div>
            </div>

            <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-800">
              <p className="text-xs text-slate-300 italic">
                "{current.fullQuote || current.quote}"
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setVideoModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
