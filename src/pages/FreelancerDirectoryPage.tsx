import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SERVICE_CATEGORIES } from '../data/mockData';
import { AvatarGraphic, VerifiedBadge3D } from '../components/common/Avatars';
import { Star, Share2, ChevronDown, Check, SlidersHorizontal } from 'lucide-react';

export const FreelancerDirectoryPage: React.FC = () => {
  const { freelancers, navigate, showToast } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleShare = (code: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      const url = `${window.location.origin}/experts/${code}`;
      navigator.clipboard.writeText(url);
      showToast('Profile link copied to clipboard!', 'success');
    }
  };

  // Render keywords set from backend / mock data: strictly show real skills/keywords, no fake fallbacks
  const getExpertKeywords = (expert: (typeof freelancers)[0]): string[] => {
    if (expert.keywords && expert.keywords.length > 0) {
      return expert.keywords.filter((k) => k !== 'Professional Studio Tools');
    }
    if (expert.skills && expert.skills.length > 0) {
      return expert.skills.filter((s) => s !== 'Professional Studio Tools');
    }
    const allTools = (expert.portfolioItems || [])
      .flatMap((p) => p.tools || [])
      .filter((t) => t && !t.toLowerCase().includes('professional studio tool'));
    const uniqueTools = Array.from(new Set(allTools));
    if (uniqueTools.length > 0) {
      return uniqueTools.slice(0, 3);
    }
    return [];
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Show only publicly visible experts filtered by category
  const visibleFreelancers = freelancers.filter((fl) => {
    const matchesCategory = selectedCategory === 'all' || fl.category === selectedCategory;
    return matchesCategory && fl.isPublic !== false;
  });

  const selectedCategoryTitle =
    selectedCategory === 'all'
      ? 'All Disciplines'
      : SERVICE_CATEGORIES.find((c) => c.slug === selectedCategory)?.title || 'All Disciplines';

  const getCategoryCount = (slug: string) => {
    if (slug === 'all') return freelancers.filter((f) => f.isPublic !== false).length;
    return freelancers.filter((f) => f.category === slug && f.isPublic !== false).length;
  };


  return (
    <div className="min-h-screen text-slate-800 antialiased space-y-10 sm:space-y-12 pb-20">
      {/* =========================================================================
          HERO BANNER: Artistic Organic Flowing Aurora & Smooth Waves
          - Headline: Gaenr Freelancers
          - Matching standard py-12 sm:py-16 banner across ecosystem
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
            <linearGradient id="freelancers-wave-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#818cf8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id="freelancers-wave-2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#006eff" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="freelancers-wave-3" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path fill="url(#freelancers-wave-1)" d="M0,128L60,144C120,160,240,192,360,181.3C480,171,600,117,720,117.3C840,117,960,171,1080,181.3C1200,192,1320,160,1380,144L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
          <path fill="url(#freelancers-wave-2)" d="M0,64L48,96C96,128,192,192,288,208C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,181.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          <path fill="url(#freelancers-wave-3)" d="M0,224L60,208C120,192,240,160,360,165.3C480,171,600,213,720,202.7C840,192,960,128,1080,112C1200,96,1320,128,1380,144L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
        </svg>

        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-y-3 sm:gap-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Gaenr Experts
          </h1>
          <p className="text-sm sm:text-base text-white/95 font-normal leading-relaxed text-center max-w-xl">
            Discover verified talent and student experts across Bangladesh. Browse real proof of work, inspect portfolios, and assign tasks with zero platform fee.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Custom Interactive Filter Popover Bar */}
        {/* Simplified & Responsive Filter Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5 max-w-7xl mx-auto px-1">
          <div className="flex flex-wrap items-center gap-3">
            {/* Discipline Dropdown Selector */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2.5 px-4 py-2 bg-white hover:bg-slate-50/90 border border-slate-200/90 hover:border-blue-400 rounded-2xl shadow-xs transition-all cursor-pointer group active:scale-98"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#006eff]" />
                <span className="text-xs font-medium text-slate-500">Discipline:</span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#006eff] transition-colors">
                  {selectedCategoryTitle}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180 text-[#006eff]' : 'group-hover:text-slate-600'
                  }`}
                />
              </button>

              {/* Custom Popover Dropdown Card */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 z-50 w-72 sm:w-80 bg-white/98 backdrop-blur-xl rounded-2xl border border-slate-200/90 shadow-2xl p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Select Discipline</span>
                    <span>Total</span>
                  </div>

                  {/* All Disciplines Option */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('all');
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer ${
                      selectedCategory === 'all'
                        ? 'bg-blue-50/90 text-[#006eff] font-bold'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          selectedCategory === 'all' ? 'bg-[#006eff]' : 'bg-slate-300'
                        }`}
                      />
                      <span>All Disciplines</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold">
                        {getCategoryCount('all')}
                      </span>
                      {selectedCategory === 'all' && <Check className="w-4 h-4 text-[#006eff]" />}
                    </div>
                  </button>

                  <div className="h-px bg-slate-100 my-1" />

                  {/* Individual Categories */}
                  <div className="max-h-64 overflow-y-auto space-y-0.5 scrollbar-thin scrollbar-thumb-slate-200 pr-1">
                    {SERVICE_CATEGORIES.map((cat) => {
                      const isSelected = selectedCategory === cat.slug;
                      const count = getCategoryCount(cat.slug);

                      return (
                        <button
                          key={cat.slug}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(cat.slug);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-blue-50/90 text-[#006eff] font-bold'
                              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                isSelected ? 'bg-[#006eff]' : 'bg-slate-300'
                              }`}
                            />
                            <span className="truncate text-left">{cat.title}</span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs font-mono px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold">
                              {count}
                            </span>
                            {isSelected && <Check className="w-4 h-4 text-[#006eff]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="text-xs text-slate-500 font-medium self-end md:self-center">
            Showing <span className="font-bold text-slate-900 font-mono">{visibleFreelancers.length}</span> Verified Experts
          </div>

        </div>

        {/* Freelancers Showcase Grid */}
        {visibleFreelancers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-6 text-center space-y-5">
            {/* Icon */}
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-50 to-slate-100 border border-slate-200/80 flex items-center justify-center shadow-sm">
              <svg className="w-9 h-9 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
            {/* Text */}
            <div className="space-y-2 max-w-xs">
              <h3 className="text-base font-bold text-slate-800 tracking-tight">
                {selectedCategory === 'all' ? 'No experts yet' : 'No experts in this category'}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {selectedCategory === 'all'
                  ? 'Verified experts will appear here once added.'
                  : 'Try a different discipline, or check back soon.'}
              </p>
            </div>
            {/* Reset link — only show when a category is selected */}
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-xs text-[#006eff] hover:underline font-semibold cursor-pointer transition-opacity"
              >
                View all disciplines
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleFreelancers.map((expert) => {
              const keywords = getExpertKeywords(expert);
              const personaTitle = (() => {
                switch (expert.category) {
                  case 'graphics-design':
                    return 'Graphics Designer';
                  case 'presentation-slide-design':
                    return 'Presentation Slide Designer';
                  case 'ux-ui-design':
                    return 'UX / UI Designer';
                  case 'wordpress-website':
                    return 'WordPress Website Designer';
                  case 'video-editing':
                    return 'Video Editor';
                  case 'content-writing':
                    return 'Content Writer & Copywriter';
                  case 'ad-running':
                    return 'Ad Running Specialist';
                  default:
                    if (expert.categoryTitle && expert.categoryTitle.endsWith(' Design')) {
                      return expert.categoryTitle.replace(/ Design$/, ' Designer');
                    }
                    return expert.categoryTitle || 'Verified Specialist';
                }
              })();

              return (
                <div
                  key={expert.code}
                  className="group relative bg-white rounded-[26px] sm:rounded-[30px] p-6 sm:p-7 shadow-[0_4px_24px_rgba(15,23,42,0.05)] hover:shadow-[0_16px_40px_rgba(0,110,255,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between text-center min-h-[410px]"
                >
                  {/* Top Row: Star Rating on Left, Share Button on Right */}
                  <div className="flex items-center justify-between w-full h-8">
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full shadow-2xs font-mono font-bold text-xs sm:text-sm ${
                        expert.reviewsCount > 0
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      <Star
                        className={`w-3.5 h-3.5 shrink-0 ${
                          expert.reviewsCount > 0
                            ? 'fill-emerald-500 text-emerald-600'
                            : 'text-slate-400'
                        }`}
                      />
                      <span>{expert.reviewsCount > 0 ? expert.rating.toFixed(1) : '0.0'}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleShare(expert.code)}
                      title="Share profile link"
                      className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 hover:text-[#006eff] text-slate-500 flex items-center justify-center transition-all shadow-2xs active:scale-95 cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Middle Section: Centered Borderless Avatar, ID, Persona Title & Subcategories */}
                  <div className="flex flex-col items-center text-center space-y-2.5 pt-1">
                    {/* 1. Circular Avatar: Fixed height container */}
                    <div className="h-24 flex items-center justify-center relative transition-transform duration-300 group-hover:scale-105">
                      <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full flex items-center justify-center shrink-0 overflow-hidden bg-slate-100">
                        <AvatarGraphic id={expert.avatarId} size={84} className="rounded-full" />
                      </div>
                    </div>

                    {/* 2. Expert ID with Verified Badge: Exactly aligned horizontally across all cards */}
                    <div className="h-7 flex items-center justify-center w-full">
                      <div className="inline-flex items-center justify-center gap-1.5">
                        <h3 className="font-mono font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight leading-none group-hover:text-[#002f6c] transition-colors">
                          {expert.code}
                        </h3>
                        <VerifiedBadge3D size={20} className="shrink-0 inline-block align-middle" title="Gaenr Verified Expert" />
                      </div>
                    </div>

                    {/* 3. Persona Title: Single line strictly ("ডিজাইনার", "এক লাইনে থাকবে") */}
                    <div className="h-5 flex items-center justify-center w-full px-2">
                      <p className="text-xs sm:text-sm font-semibold text-slate-600 truncate whitespace-nowrap max-w-full">
                        {personaTitle}
                      </p>
                    </div>

                    {/* 4. Sub-Categories / Skills: Exactly same layer height across all cards */}
                    <div className="h-14 flex items-center justify-center w-full px-1">
                      <div className="flex flex-wrap items-center justify-center gap-1.5 max-h-14 overflow-hidden">
                        {keywords.map((kw, kIdx) => (
                          <span
                            key={kIdx}
                            className="px-2.5 py-1 rounded-full bg-slate-50 text-[11px] font-medium text-slate-600 shadow-2xs group-hover:text-slate-900 transition-colors whitespace-nowrap"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action: Full-width 'View Portfolio' button pinned to the bottom */}
                  <div className="mt-auto pt-3 w-full">
                    <button
                      type="button"
                      onClick={() => navigate(`/experts/${expert.code}`)}
                      className="gaenr-btn-primary w-full !py-3 !rounded-full !text-sm !font-bold shadow-xs hover:shadow-md active:scale-98 transition-all cursor-pointer"
                    >
                      View Portfolio
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
