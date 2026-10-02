import React from 'react';
import { GaenrLogo } from '../components/common/GaenrLogo';
import {
  Wallet,
  Percent,
  Headphones,
  GraduationCap,
  Users,
} from 'lucide-react';

export const AboutUsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-800 antialiased">
      {/* =========================================================================
          PAGE HERO BANNER: Blue background with textured pattern overlay
          (Reduced opacity design so it does not feel like flat solid blue)
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
            <linearGradient id="about-artistic-wave-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#818cf8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id="about-artistic-wave-2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#006eff" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="about-artistic-wave-3" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path fill="url(#about-artistic-wave-1)" d="M0,128L60,144C120,160,240,192,360,181.3C480,171,600,117,720,117.3C840,117,960,171,1080,181.3C1200,192,1320,160,1380,144L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
          <path fill="url(#about-artistic-wave-2)" d="M0,64L48,96C96,128,192,192,288,208C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,181.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          <path fill="url(#about-artistic-wave-3)" d="M0,224L60,208C120,192,240,160,360,165.3C480,171,600,213,720,202.7C840,192,960,128,1080,112C1200,96,1320,128,1380,144L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
        </svg>

        <article className="relative z-10 max-w-xl mx-auto flex flex-col items-center gap-y-3 sm:gap-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            About Us
          </h1>
          <p className="text-sm sm:text-base text-white/95 font-normal leading-relaxed text-center">
            Gaenr is Bangladesh’s dedicated marketplace for verified experts connecting talent students with clients.
          </p>
        </article>
      </section>

      {/* =========================================================================
          SECTION 1: WHAT IS GAENR?
          - Clean elevated logo card with natural soft shadow & smooth logo scale
          - Displacing shift animation and clunky blue block removed
         ========================================================================= */}
      <section className="mx-auto flex w-full max-w-5xl flex-col items-center gap-y-10 px-6 md:flex-row md:gap-x-14 pt-12 sm:pt-16">
        {/* Clean Logo Card */}
        <div className="group relative w-full max-w-[240px] sm:max-w-[260px] shrink-0 mx-auto md:mx-0">
          <div className="aspect-square w-full rounded-3xl bg-white p-10 sm:p-12 shadow-lg hover:shadow-2xl border border-slate-200/80 ring-4 ring-slate-100/60 hover:ring-blue-100 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 cursor-default">
            <div className="transition-transform duration-300 ease-out group-hover:scale-110 flex items-center justify-center">
              <GaenrLogo size={120} />
            </div>
          </div>
        </div>

        {/* Narrative Article */}
        <article className="space-y-4 text-center md:text-start">
          <h2 className="text-2xl sm:text-3xl font-semibold">
            <span className="text-slate-900">What is</span>{' '}
            <span className="text-[#0256d0]">Gaenr</span>
          </h2>
          <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed">
            <p>
              Gaenr is a Bangladesh-based freelance platform built for the local economy. We connect skilled professionals including students, independent specialists, homemakers, and entrepreneurs with businesses and individuals seeking reliable, high-quality work at competitive local rates.
            </p>
            <p>
              Unlike global freelancing platforms, Gaenr eliminates complex payment gateways and high commission fees, making it easier for Bangladeshi talent to earn and for clients to get work done.
            </p>
          </div>
        </article>
      </section>

      {/* =========================================================================
          SECTION 2: MISSION, GOAL, DREAM
          - Straight line expands from w-8 all the way to w-full on card hover
         ========================================================================= */}
      <section className="mx-auto w-full max-w-5xl px-6 pt-12 sm:pt-16">
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
          {/* Mission */}
          <li className="group flex flex-col justify-between gap-y-8 rounded-3xl bg-slate-50 border border-slate-200/90 hover:border-blue-200 p-7 sm:p-8 shadow-xs hover:shadow-lg transition-all duration-300 cursor-default">
            <div className="space-y-3">
              <h2 className="inline-block text-xl font-semibold text-slate-900">
                <p>Mission</p>
                <span className="block h-1 w-8 group-hover:w-full rounded-full bg-slate-900 group-hover:bg-[#006eff] transition-all duration-500 ease-out mt-3" />
              </h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed font-normal">
              Connecting experts and outsourcers through a trusted, intelligent platform for real impact.
            </p>
          </li>

          {/* Goal */}
          <li className="group flex flex-col justify-between gap-y-8 rounded-3xl bg-slate-50 border border-slate-200/90 hover:border-blue-200 p-7 sm:p-8 shadow-xs hover:shadow-lg transition-all duration-300 cursor-default">
            <div className="space-y-3">
              <h2 className="inline-block text-xl font-semibold text-slate-900">
                <p>Goal</p>
                <span className="block h-1 w-8 group-hover:w-full rounded-full bg-slate-900 group-hover:bg-[#006eff] transition-all duration-500 ease-out mt-3" />
              </h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed font-normal">
              To build a trusted, community driven freelancing ecosystem where skills meet opportunity.
            </p>
          </li>

          {/* Dream */}
          <li className="group flex flex-col justify-between gap-y-8 rounded-3xl bg-slate-50 border border-slate-200/90 hover:border-blue-200 p-7 sm:p-8 shadow-xs hover:shadow-lg transition-all duration-300 cursor-default">
            <div className="space-y-3">
              <h2 className="inline-block text-xl font-semibold text-slate-900">
                <p>Dream</p>
                <span className="block h-1 w-8 group-hover:w-full rounded-full bg-slate-900 group-hover:bg-[#006eff] transition-all duration-500 ease-out mt-3" />
              </h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed font-normal">
              We’re building an effortless platform that connects experts and outsourcers without barriers.
            </p>
          </li>
        </ul>
      </section>

      {/* =========================================================================
          SECTION 3: GAENR'S UNIQUENESS
          - Blue container with subtle pattern overlay and diamond rotate-45 icons
         ========================================================================= */}
      <section className="mx-auto w-full max-w-5xl px-6 pt-12 sm:pt-16 pb-16 sm:pb-24">
        <div className="relative flex flex-col gap-y-10 sm:gap-y-14 overflow-hidden rounded-3xl bg-gradient-to-br from-[#006eff] to-[#0142a3] p-8 sm:p-12 shadow-xl text-white">
          <div className="absolute inset-0 bg-[url('/expert-bg-pattern.svg')] bg-cover bg-center opacity-25 mix-blend-screen pointer-events-none" />
          <div className="absolute top-0 left-0 hidden size-36 -translate-x-10 -translate-y-10 rounded-full bg-white/10 blur-xl sm:block pointer-events-none" />
          <div className="absolute bottom-0 right-0 hidden size-48 translate-x-12 translate-y-12 rounded-full bg-blue-950/30 blur-2xl sm:block pointer-events-none" />

          <div className="text-center space-y-2 relative z-10 max-w-xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Gaenr's Uniqueness
            </h3>
            <p className="text-xs sm:text-sm text-white/85 font-normal">
              Distinct pillars built to empower talent and simplify outsourcing
            </p>
          </div>

          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-4 items-start justify-items-center relative z-10 w-full">
            {/* 1. Local Currency Payments */}
            <li className="flex flex-col items-center text-center w-full max-w-[160px] group">
              <div className="flex size-14 sm:size-15 rotate-45 items-center justify-center rounded-2xl bg-white shadow-md group-hover:scale-110 transition-transform mb-5 sm:mb-6 shrink-0">
                <Wallet className="size-6 sm:size-7 -rotate-45 text-[#006eff]" />
              </div>
              <p className="font-semibold text-white text-xs sm:text-sm leading-snug">
                Local Currency Payments
              </p>
            </li>

            {/* 2. Zero Platform Fees */}
            <li className="flex flex-col items-center text-center w-full max-w-[160px] group">
              <div className="flex size-14 sm:size-15 rotate-45 items-center justify-center rounded-2xl bg-white shadow-md group-hover:scale-110 transition-transform mb-5 sm:mb-6 shrink-0">
                <Percent className="size-6 sm:size-7 -rotate-45 text-[#006eff]" />
              </div>
              <p className="font-semibold text-white text-xs sm:text-sm leading-snug">
                Zero Platform Fees
              </p>
            </li>

            {/* 3. Dedicated Personal Support */}
            <li className="flex flex-col items-center text-center w-full max-w-[160px] group">
              <div className="flex size-14 sm:size-15 rotate-45 items-center justify-center rounded-2xl bg-white shadow-md group-hover:scale-110 transition-transform mb-5 sm:mb-6 shrink-0">
                <Headphones className="size-6 sm:size-7 -rotate-45 text-[#006eff]" />
              </div>
              <p className="font-semibold text-white text-xs sm:text-sm leading-snug">
                Dedicated Personal Support
              </p>
            </li>

            {/* 4. Student Focused Empowerment */}
            <li className="flex flex-col items-center text-center w-full max-w-[160px] group">
              <div className="flex size-14 sm:size-15 rotate-45 items-center justify-center rounded-2xl bg-white shadow-md group-hover:scale-110 transition-transform mb-5 sm:mb-6 shrink-0">
                <GraduationCap className="size-6 sm:size-7 -rotate-45 text-[#006eff]" />
              </div>
              <p className="font-semibold text-white text-xs sm:text-sm leading-snug">
                Student Focused Empowerment
              </p>
            </li>

            {/* 5. Community Over Competition */}
            <li className="flex flex-col items-center text-center w-full max-w-[160px] group col-span-2 sm:col-span-1 lg:col-span-1">
              <div className="flex size-14 sm:size-15 rotate-45 items-center justify-center rounded-2xl bg-white shadow-md group-hover:scale-110 transition-transform mb-5 sm:mb-6 shrink-0">
                <Users className="size-6 sm:size-7 -rotate-45 text-[#006eff]" />
              </div>
              <p className="font-semibold text-white text-xs sm:text-sm leading-snug">
                Community Over Competition
              </p>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};
