import React from 'react';
import { RotateCcw, CheckCircle, AlertCircle, HeartHandshake, ShieldCheck } from 'lucide-react';

export const ReturnPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 antialiased space-y-10 sm:space-y-12 pb-20">
      {/* =========================================================================
          HERO BANNER: Artistic Organic Flowing Aurora & Smooth Waves
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
            <linearGradient id="return-wave-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#818cf8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id="return-wave-2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#006eff" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="return-wave-3" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path fill="url(#return-wave-1)" d="M0,128L60,144C120,160,240,192,360,181.3C480,171,600,117,720,117.3C840,117,960,171,1080,181.3C1200,192,1320,160,1380,144L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
          <path fill="url(#return-wave-2)" d="M0,64L48,96C96,128,192,192,288,208C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,181.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          <path fill="url(#return-wave-3)" d="M0,224L60,208C120,192,240,160,360,165.3C480,171,600,213,720,202.7C840,192,960,128,1080,112C1200,96,1320,128,1380,144L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
        </svg>

        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-y-3 sm:gap-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-white/95 bg-white/15 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full shadow-xs">
            <RotateCcw className="w-3.5 h-3.5 text-cyan-200" />
            <span>Cancellation &amp; Refunds</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Return Policy
          </h1>
          <p className="text-sm sm:text-base text-white/95 font-normal leading-relaxed text-center max-w-xl">
            Our Project Cancellation &amp; Refund Policy. Clarity and fairness are core to our service. Please read our policy regarding digital service cancellations.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Intro Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#006eff] flex items-center justify-center shrink-0 border border-blue-100 shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Tailored Digital Services Notice</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              At Gaenr, we provide digital services that are tailored to your specific project needs. Because this work involves dedicated time and creative effort from our verified experts, our policy on cancellations and refunds is as follows:
            </p>
          </div>
        </div>

        {/* Cancellation Window (Full 100% Refund) */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200/80 shadow-xs space-y-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Before Execution Starts</span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Cancellation Window (Full 100% Refund)
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-0 sm:pl-13 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
            You may cancel your project request for a full refund at any time before you provide final confirmation to our Gaenr Representative.
          </p>
        </section>

        {/* After Confirmation (No Refund) */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Active Project Phase</span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                After Project Confirmation (No Refund)
              </h2>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed pl-0 sm:pl-13">
            <p>
              A project is considered initiated once you have confirmed all of the following with our Gaenr representative (via WhatsApp, email, or verbal agreement):
            </p>

            <ul className="list-disc list-inside space-y-2 text-slate-700 pl-2">
              <li>The project details, deliverables, and scope requirements.</li>
              <li>The final agreed price.</li>
              <li>The assignment of a specific expert.</li>
            </ul>

            <p className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700">
              At this point, the expert dedicates their time and skills exclusively to your project. Because this digital work is created and delivered specifically for you, we cannot offer refunds or accept returns after a project has been confirmed and initiated.
            </p>
          </div>
        </section>

        {/* Commitment to Satisfaction */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#006eff] flex items-center justify-center border border-blue-100 shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">Quality Mediation</span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Our Commitment to Your Satisfaction
              </h2>
            </div>
          </div>

          <div className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-0 sm:pl-13 p-4 rounded-2xl bg-blue-50/40 border border-blue-100">
            <p>
              While refunds cannot be issued post-confirmation, we are deeply committed to your satisfaction. Our team is here to mediate and work with you and the expert to ensure the final product meets the requirements you both agreed upon, including required revision rounds.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};
