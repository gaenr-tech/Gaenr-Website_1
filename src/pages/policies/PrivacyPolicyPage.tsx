import React, { useState } from 'react';
import { ShieldCheck, Database, Layers, Share2, UserCheck, RefreshCw, Mail, CheckCircle2, Plus, Minus } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  // State for collapsible accordion sections (default all closed per user request)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const allOpen = ['p1', 'p2', 'p3', 'p4', 'p5'].every((id) => openSections[id]);

  const toggleAll = () => {
    if (allOpen) {
      setOpenSections({});
    } else {
      setOpenSections({ p1: true, p2: true, p3: true, p4: true, p5: true });
    }
  };

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
            <linearGradient id="privacy-wave-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#818cf8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id="privacy-wave-2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#006eff" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="privacy-wave-3" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path fill="url(#privacy-wave-1)" d="M0,128L60,144C120,160,240,192,360,181.3C480,171,600,117,720,117.3C840,117,960,171,1080,181.3C1200,192,1320,160,1380,144L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
          <path fill="url(#privacy-wave-2)" d="M0,64L48,96C96,128,192,192,288,208C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,181.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          <path fill="url(#privacy-wave-3)" d="M0,224L60,208C120,192,240,160,360,165.3C480,171,600,213,720,202.7C840,192,960,128,1080,112C1200,96,1320,128,1380,144L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
        </svg>

        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-y-3 sm:gap-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-white/95 bg-white/15 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-200" />
            <span>User Data Protection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-white/95 font-normal leading-relaxed text-center max-w-xl">
            Your Privacy Is Our Priority. Your trust is the foundation of our platform. This policy explains how Gaenr collects, uses, and protects your personal information in a clear and simple way.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Core Guarantee Card with Expand/Collapse All Control */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 shadow-xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Zero Data Selling Guarantee</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Click any section below to expand detailed privacy commitments and data handling.
              </p>
            </div>
          </div>

          <button
            onClick={toggleAll}
            className="text-xs font-bold text-[#006eff] hover:underline self-end sm:self-center shrink-0 cursor-pointer px-3 py-1.5 rounded-xl bg-blue-50/80 border border-blue-100/80 transition-colors"
          >
            {allOpen ? 'Collapse All' : 'Expand All'}
          </button>
        </div>

        {/* Collapsible Section 1 */}
        <section className="bg-white rounded-3xl border border-slate-200/90 shadow-xs transition-all overflow-hidden">
          <button
            onClick={() => toggleSection('p1')}
            className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-slate-50/70 transition-colors group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <span className="w-8 h-8 rounded-xl bg-blue-50 text-[#006eff] border border-blue-100 text-xs font-bold flex items-center justify-center shrink-0">
                01
              </span>
              <div className="flex items-center gap-2.5 min-w-0">
                <Database className="w-4 h-4 text-slate-400 group-hover:text-[#006eff] transition-colors shrink-0" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                  What Information We Collect
                </h2>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors shrink-0">
              {openSections['p1'] ? <Minus className="w-4 h-4 text-[#006eff]" /> : <Plus className="w-4 h-4" />}
            </div>
          </button>

          {openSections['p1'] && (
            <div className="p-5 sm:p-7 pt-2 border-t border-slate-100/90 space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <div className="p-4 sm:p-4.5 rounded-2xl bg-slate-50/80 border border-slate-100/90 space-y-1.5 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006eff]" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                    Information You Provide
                  </h3>
                </div>
                <p className="pl-3.5 text-slate-600 leading-relaxed">
                  When you create an account, submit a task brief, or apply as an expert, you provide us with details like your name, email, WhatsApp contact number, and project requirements.
                </p>
              </div>

              <div className="p-4 sm:p-4.5 rounded-2xl bg-slate-50/80 border border-slate-100/90 space-y-1.5 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006eff]" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                    Payment Information
                  </h3>
                </div>
                <p className="pl-3.5 text-slate-600 leading-relaxed">
                  When you pay or receive earnings, transactions are handled through secure, trusted third-party payment gateways (bKash, Nagad, bank transfers). Gaenr does not store complete banking or card credentials on our servers.
                </p>
              </div>

              <div className="p-4 sm:p-4.5 rounded-2xl bg-slate-50/80 border border-slate-100/90 space-y-1.5 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006eff]" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                    Information We Collect Automatically
                  </h3>
                </div>
                <p className="pl-3.5 text-slate-600 leading-relaxed">
                  We log standard technical information (such as browser type or IP address) to verify our beta service is functioning stably, ensure account integrity, and continually improve platform usability.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Collapsible Section 2 */}
        <section className="bg-white rounded-3xl border border-slate-200/90 shadow-xs transition-all overflow-hidden">
          <button
            onClick={() => toggleSection('p2')}
            className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-slate-50/70 transition-colors group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <span className="w-8 h-8 rounded-xl bg-blue-50 text-[#006eff] border border-blue-100 text-xs font-bold flex items-center justify-center shrink-0">
                02
              </span>
              <div className="flex items-center gap-2.5 min-w-0">
                <Layers className="w-4 h-4 text-slate-400 group-hover:text-[#006eff] transition-colors shrink-0" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                  How We Use Your Information
                </h2>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors shrink-0">
              {openSections['p2'] ? <Minus className="w-4 h-4 text-[#006eff]" /> : <Plus className="w-4 h-4" />}
            </div>
          </button>

          {openSections['p2'] && (
            <div className="p-5 sm:p-7 pt-2 border-t border-slate-100/90 space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <div className="p-4 sm:p-4.5 rounded-2xl bg-slate-50/80 border border-slate-100/90 space-y-1.5 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006eff]" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                    To Operate the Platform
                  </h3>
                </div>
                <p className="pl-3.5 text-slate-600 leading-relaxed">
                  To connect clients with verified experts, clarify deliverables, hold payments in escrow, and coordinate project completion.
                </p>
              </div>

              <div className="p-4 sm:p-4.5 rounded-2xl bg-slate-50/80 border border-slate-100/90 space-y-1.5 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006eff]" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                    To Communicate With You
                  </h3>
                </div>
                <p className="pl-3.5 text-slate-600 leading-relaxed">
                  To send you task milestone notifications, respond to support inquiries, and confirm requirement scopes.
                </p>
              </div>

              <div className="p-4 sm:p-4.5 rounded-2xl bg-slate-50/80 border border-slate-100/90 space-y-1.5 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006eff]" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                    To Improve Our Service
                  </h3>
                </div>
                <p className="pl-3.5 text-slate-600 leading-relaxed">
                  As a beta platform, we analyze anonymized feedback and usage trends to remove friction and build features requested by our community.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Collapsible Section 3 */}
        <section className="bg-white rounded-3xl border border-slate-200/90 shadow-xs transition-all overflow-hidden">
          <button
            onClick={() => toggleSection('p3')}
            className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-slate-50/70 transition-colors group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <span className="w-8 h-8 rounded-xl bg-blue-50 text-[#006eff] border border-blue-100 text-xs font-bold flex items-center justify-center shrink-0">
                03
              </span>
              <div className="flex items-center gap-2.5 min-w-0">
                <Share2 className="w-4 h-4 text-slate-400 group-hover:text-[#006eff] transition-colors shrink-0" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                  How We Share Your Information
                </h2>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors shrink-0">
              {openSections['p3'] ? <Minus className="w-4 h-4 text-[#006eff]" /> : <Plus className="w-4 h-4" />}
            </div>
          </button>

          {openSections['p3'] && (
            <div className="p-5 sm:p-7 pt-2 border-t border-slate-100/90 space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-emerald-950">We DO NOT Sell Your Data. Ever.</h4>
                  <p className="text-[11px] sm:text-xs text-emerald-800/90 mt-0.5">Your personal information is never traded, rented, or monetized with any third-party advertisers.</p>
                </div>
              </div>

              <div className="p-4 sm:p-4.5 rounded-2xl bg-slate-50/80 border border-slate-100/90 space-y-1.5 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006eff]" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                    With Other Users
                  </h3>
                </div>
                <p className="pl-3.5 text-slate-600 leading-relaxed">
                  To facilitate the ecosystem, public showcase profiles (expert code, discipline, and curated portfolio work) are visible to visitors. Private contact or payment details are never exposed publicly.
                </p>
              </div>

              <div className="p-4 sm:p-4.5 rounded-2xl bg-slate-50/80 border border-slate-100/90 space-y-1.5 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006eff]" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                    With Service Providers
                  </h3>
                </div>
                <p className="pl-3.5 text-slate-600 leading-relaxed">
                  We use trusted third-party providers (like SMS delivery and secure payment gateways) strictly to process requested transactions.
                </p>
              </div>

              <div className="p-4 sm:p-4.5 rounded-2xl bg-slate-50/80 border border-slate-100/90 space-y-1.5 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006eff]" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                    For Legal Reasons
                  </h3>
                </div>
                <p className="pl-3.5 text-slate-600 leading-relaxed">
                  We may disclose information if legally required to protect the safety, rights, and integrity of our community.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Collapsible Section 4 */}
        <section className="bg-white rounded-3xl border border-slate-200/90 shadow-xs transition-all overflow-hidden">
          <button
            onClick={() => toggleSection('p4')}
            className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-slate-50/70 transition-colors group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <span className="w-8 h-8 rounded-xl bg-blue-50 text-[#006eff] border border-blue-100 text-xs font-bold flex items-center justify-center shrink-0">
                04
              </span>
              <div className="flex items-center gap-2.5 min-w-0">
                <UserCheck className="w-4 h-4 text-slate-400 group-hover:text-[#006eff] transition-colors shrink-0" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                  Your Choices &amp; Rights
                </h2>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors shrink-0">
              {openSections['p4'] ? <Minus className="w-4 h-4 text-[#006eff]" /> : <Plus className="w-4 h-4" />}
            </div>
          </button>

          {openSections['p4'] && (
            <div className="p-5 sm:p-7 pt-2 border-t border-slate-100/90 space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <div className="p-4 sm:p-4.5 rounded-2xl bg-slate-50/80 border border-slate-100/90 space-y-1.5 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006eff]" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                    Access, Update &amp; Deletion
                  </h3>
                </div>
                <p className="pl-3.5 text-slate-600 leading-relaxed">
                  You have the right to access, update, or ask us to delete your personal information. You can request changes at any time by contacting our support team at <a href="mailto:contact@gaenr.com" className="text-[#006eff] hover:underline font-semibold inline-flex items-center gap-1"><Mail className="w-3.5 h-3.5 inline" /> contact@gaenr.com</a>.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Collapsible Section 5 */}
        <section className="bg-white rounded-3xl border border-slate-200/90 shadow-xs transition-all overflow-hidden">
          <button
            onClick={() => toggleSection('p5')}
            className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-slate-50/70 transition-colors group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <span className="w-8 h-8 rounded-xl bg-blue-50 text-[#006eff] border border-blue-100 text-xs font-bold flex items-center justify-center shrink-0">
                05
              </span>
              <div className="flex items-center gap-2.5 min-w-0">
                <RefreshCw className="w-4 h-4 text-slate-400 group-hover:text-[#006eff] transition-colors shrink-0" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                  Changes to This Policy
                </h2>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors shrink-0">
              {openSections['p5'] ? <Minus className="w-4 h-4 text-[#006eff]" /> : <Plus className="w-4 h-4" />}
            </div>
          </button>

          {openSections['p5'] && (
            <div className="p-5 sm:p-7 pt-2 border-t border-slate-100/90 space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <div className="p-4 sm:p-4.5 rounded-2xl bg-slate-50/80 border border-slate-100/90 space-y-1.5 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006eff]" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                    Policy Revisions &amp; Acceptance
                  </h3>
                </div>
                <p className="pl-3.5 text-slate-600 leading-relaxed">
                  We may update this policy as Gaenr evolves. We will notify users of any substantial revisions. By continuing to use our platform, you agree to the active policy.
                </p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
