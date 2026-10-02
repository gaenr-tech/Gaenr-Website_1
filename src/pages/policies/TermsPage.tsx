import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Briefcase, CreditCard, Ban, Power, CheckCircle2, Plus, Minus, AlertTriangle } from 'lucide-react';

export const TermsPage: React.FC = () => {
  // State for collapsible accordion sections (default all closed per user request)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const allOpen = ['s1', 's2', 's3', 's4', 's5'].every((id) => openSections[id]);

  const toggleAll = () => {
    if (allOpen) {
      setOpenSections({});
    } else {
      setOpenSections({ s1: true, s2: true, s3: true, s4: true, s5: true });
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
            <linearGradient id="terms-wave-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#818cf8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id="terms-wave-2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#006eff" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="terms-wave-3" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path fill="url(#terms-wave-1)" d="M0,128L60,144C120,160,240,192,360,181.3C480,171,600,117,720,117.3C840,117,960,171,1080,181.3C1200,192,1320,160,1380,144L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
          <path fill="url(#terms-wave-2)" d="M0,64L48,96C96,128,192,192,288,208C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,181.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          <path fill="url(#terms-wave-3)" d="M0,224L60,208C120,192,240,160,360,165.3C480,171,600,213,720,202.7C840,192,960,128,1080,112C1200,96,1320,128,1380,144L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
        </svg>

        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-y-3 sm:gap-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-white/95 bg-white/15 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-200" />
            <span>Operational Standards</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="text-sm sm:text-base text-white/95 font-normal leading-relaxed text-center max-w-xl">
            Clear, Fair &amp; Transparent. These terms outline how Gaenr operates as a managed freelancing and outsourcing ecosystem in Bangladesh.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Core Guarantee Card with Expand/Collapse All Control */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#006eff] flex items-center justify-center shrink-0 border border-blue-100 shadow-xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Ecosystem Integrity &amp; Escrow Rules</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Click any section below to review the guidelines for clients, experts, and project deliveries.
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
            onClick={() => toggleSection('s1')}
            className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-slate-50/70 transition-colors group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <span className="w-8 h-8 rounded-xl bg-blue-50 text-[#006eff] border border-blue-100 text-xs font-bold flex items-center justify-center shrink-0">
                01
              </span>
              <div className="flex items-center gap-2.5 min-w-0">
                <UserCheck className="w-4 h-4 text-slate-400 group-hover:text-[#006eff] transition-colors shrink-0" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                  Your Account &amp; Participation
                </h2>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors shrink-0">
              {openSections['s1'] ? <Minus className="w-4 h-4 text-[#006eff]" /> : <Plus className="w-4 h-4" />}
            </div>
          </button>

          {openSections['s1'] && (
            <div className="p-5 sm:p-7 pt-2 border-t border-slate-100/90 space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <div className="p-4 sm:p-4.5 rounded-2xl bg-slate-50/80 border border-slate-100/90 space-y-1.5 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006eff]" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                    Eligibility
                  </h3>
                </div>
                <p className="pl-3.5 text-slate-600 leading-relaxed">
                  You must be at least 13 years old to use Gaenr services and create an account or assign tasks.
                </p>
              </div>

              <div className="p-4 sm:p-4.5 rounded-2xl bg-slate-50/80 border border-slate-100/90 space-y-1.5 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006eff]" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                    Account Responsibility
                  </h3>
                </div>
                <p className="pl-3.5 text-slate-600 leading-relaxed">
                  You are responsible for keeping all contact details accurate and maintaining the confidentiality of your credentials.
                </p>
              </div>

              <div className="p-4 sm:p-4.5 rounded-2xl bg-slate-50/80 border border-slate-100/90 space-y-1.5 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006eff]" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                    Beta Agreement
                  </h3>
                </div>
                <p className="pl-3.5 text-slate-600 leading-relaxed">
                  By using our beta platform, you acknowledge that some workflows are human-managed by our team rather than fully automated. You agree to provide honest feedback to help us build a better platform.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Collapsible Section 2 */}
        <section className="bg-white rounded-3xl border border-slate-200/90 shadow-xs transition-all overflow-hidden">
          <button
            onClick={() => toggleSection('s2')}
            className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-slate-50/70 transition-colors group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <span className="w-8 h-8 rounded-xl bg-blue-50 text-[#006eff] border border-blue-100 text-xs font-bold flex items-center justify-center shrink-0">
                02
              </span>
              <div className="flex items-center gap-2.5 min-w-0">
                <Briefcase className="w-4 h-4 text-slate-400 group-hover:text-[#006eff] transition-colors shrink-0" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                  The Gaenr Service
                </h2>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors shrink-0">
              {openSections['s2'] ? <Minus className="w-4 h-4 text-[#006eff]" /> : <Plus className="w-4 h-4" />}
            </div>
          </button>

          {openSections['s2'] && (
            <div className="p-5 sm:p-7 pt-2 border-t border-slate-100/90 space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <div className="p-4 sm:p-4.5 rounded-2xl bg-slate-50/80 border border-slate-100/90 space-y-1.5 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006eff]" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                    Clients (Outsourcers)
                  </h3>
                </div>
                <p className="pl-3.5 text-slate-600 leading-relaxed">
                  You agree to provide clear and accurate project specifications. Once you have paid for and approved the final deliverables, you own 100% of the commercial rights to that specific work.
                </p>
              </div>

              <div className="p-4 sm:p-4.5 rounded-2xl bg-slate-50/80 border border-slate-100/90 space-y-1.5 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006eff]" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                    Experts
                  </h3>
                </div>
                <p className="pl-3.5 text-slate-600 leading-relaxed">
                  You agree to deliver high-quality, original work on time, as described in the agreed brief. Payment is released to your local payout account following client approval.
                </p>
              </div>

              <div className="p-4 sm:p-4.5 rounded-2xl bg-slate-50/80 border border-slate-100/90 space-y-1.5 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006eff]" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                    Gaenr's Role
                  </h3>
                </div>
                <p className="pl-3.5 text-slate-600 leading-relaxed">
                  Gaenr acts as a facilitator and escrow manager. We confirm project details, hold payments in escrow, and mediate issues to ensure fairness for both sides.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Collapsible Section 3 */}
        <section className="bg-white rounded-3xl border border-slate-200/90 shadow-xs transition-all overflow-hidden">
          <button
            onClick={() => toggleSection('s3')}
            className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-slate-50/70 transition-colors group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <span className="w-8 h-8 rounded-xl bg-blue-50 text-[#006eff] border border-blue-100 text-xs font-bold flex items-center justify-center shrink-0">
                03
              </span>
              <div className="flex items-center gap-2.5 min-w-0">
                <CreditCard className="w-4 h-4 text-slate-400 group-hover:text-[#006eff] transition-colors shrink-0" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                  Payments &amp; Escrow
                </h2>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors shrink-0">
              {openSections['s3'] ? <Minus className="w-4 h-4 text-[#006eff]" /> : <Plus className="w-4 h-4" />}
            </div>
          </button>

          {openSections['s3'] && (
            <div className="p-5 sm:p-7 pt-2 border-t border-slate-100/90 space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <div className="p-4 sm:p-4.5 rounded-2xl bg-slate-50/80 border border-slate-100/90 space-y-1.5 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006eff]" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                    Upfront Escrow Deposit
                  </h3>
                </div>
                <p className="pl-3.5 text-slate-600 leading-relaxed">
                  Clients must deposit the project fee before expert execution commences.
                </p>
              </div>

              <div className="p-4 sm:p-4.5 rounded-2xl bg-slate-50/80 border border-slate-100/90 space-y-1.5 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006eff]" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                    Milestone &amp; Completion Release
                  </h3>
                </div>
                <p className="pl-3.5 text-slate-600 leading-relaxed">
                  Gaenr holds funds safely in escrow and releases them only after the client approves the final submission or confirms completion.
                </p>
              </div>

              <div className="p-4 sm:p-4.5 rounded-2xl bg-rose-50/70 border border-rose-200/80 space-y-1.5">
                <div className="flex items-center gap-2 text-rose-900">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <h3 className="text-xs sm:text-sm font-bold tracking-tight">
                    Off-Platform Payment Prohibition
                  </h3>
                </div>
                <p className="pl-6 text-rose-900/90 leading-relaxed">
                  Attempting to solicit off-platform payments or circumvent our escrow system is a direct breach of community safety and results in immediate account suspension.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Collapsible Section 4 */}
        <section className="bg-white rounded-3xl border border-slate-200/90 shadow-xs transition-all overflow-hidden">
          <button
            onClick={() => toggleSection('s4')}
            className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-slate-50/70 transition-colors group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <span className="w-8 h-8 rounded-xl bg-blue-50 text-[#006eff] border border-blue-100 text-xs font-bold flex items-center justify-center shrink-0">
                04
              </span>
              <div className="flex items-center gap-2.5 min-w-0">
                <Ban className="w-4 h-4 text-slate-400 group-hover:text-[#006eff] transition-colors shrink-0" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                  Prohibited Conduct
                </h2>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors shrink-0">
              {openSections['s4'] ? <Minus className="w-4 h-4 text-[#006eff]" /> : <Plus className="w-4 h-4" />}
            </div>
          </button>

          {openSections['s4'] && (
            <div className="p-5 sm:p-7 pt-2 border-t border-slate-100/90 space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p className="font-semibold text-slate-900 text-xs sm:text-sm">You agree not to:</p>
              
              <div className="p-4 sm:p-4.5 rounded-2xl bg-slate-50/80 border border-slate-100/90 space-y-1.5 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                    Illegal &amp; Fraudulent Activities
                  </h3>
                </div>
                <p className="pl-3.5 text-slate-600 leading-relaxed">
                  Use Gaenr for illegal, harmful, or fraudulent activities.
                </p>
              </div>

              <div className="p-4 sm:p-4.5 rounded-2xl bg-slate-50/80 border border-slate-100/90 space-y-1.5 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                    Harassment &amp; Abuse
                  </h3>
                </div>
                <p className="pl-3.5 text-slate-600 leading-relaxed">
                  Harass, abuse, or demean any freelancer, client, or representative.
                </p>
              </div>

              <div className="p-4 sm:p-4.5 rounded-2xl bg-slate-50/80 border border-slate-100/90 space-y-1.5 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                    Plagiarism &amp; Infringement
                  </h3>
                </div>
                <p className="pl-3.5 text-slate-600 leading-relaxed">
                  Submit plagiarized content or copyright-infringing assets.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Collapsible Section 5 */}
        <section className="bg-white rounded-3xl border border-slate-200/90 shadow-xs transition-all overflow-hidden">
          <button
            onClick={() => toggleSection('s5')}
            className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-slate-50/70 transition-colors group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <span className="w-8 h-8 rounded-xl bg-blue-50 text-[#006eff] border border-blue-100 text-xs font-bold flex items-center justify-center shrink-0">
                05
              </span>
              <div className="flex items-center gap-2.5 min-w-0">
                <Power className="w-4 h-4 text-slate-400 group-hover:text-[#006eff] transition-colors shrink-0" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                  Termination
                </h2>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors shrink-0">
              {openSections['s5'] ? <Minus className="w-4 h-4 text-[#006eff]" /> : <Plus className="w-4 h-4" />}
            </div>
          </button>

          {openSections['s5'] && (
            <div className="p-5 sm:p-7 pt-2 border-t border-slate-100/90 space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <div className="p-4 sm:p-4.5 rounded-2xl bg-slate-50/80 border border-slate-100/90 space-y-1.5 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006eff]" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                    Account Suspension &amp; Community Safety
                  </h3>
                </div>
                <p className="pl-3.5 text-slate-600 leading-relaxed">
                  We reserve the right to suspend or terminate access for any user that violates these terms or compromises the trust and safety of the community.
                </p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
