import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  LifeBuoy,
  Search,
  ChevronDown,
  Phone,
  MessageCircle,
  Mail,
  ArrowRight
} from 'lucide-react';

interface FaqItem {
  id: string;
  category: 'clients' | 'payments' | 'experts';
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  // Payments & Escrow
  {
    id: 'escrow-protection',
    category: 'payments',
    question: 'How does Gaenr escrow protection work?',
    answer: 'When a client accepts a project scope and deposits the fee, Gaenr securely holds the funds in escrow. The expert completes the deliverable according to the agreed brief, and funds are only released to the expert once the client reviews and approves the final submission.',
  },
  {
    id: 'refund-policy',
    category: 'payments',
    question: 'Can I get a refund if I change my mind?',
    answer: 'Yes! You have a 100% full refund window at any point before you give final confirmation to initiate execution with our Gaenr representative. Once work has been initiated and the expert begins execution, fees are non-refundable as the expert dedicates exclusive working hours.',
  },
  {
    id: 'payment-methods',
    category: 'payments',
    question: 'What payment methods are supported for depositing project fees?',
    answer: 'We support all major trusted local payment gateways in Bangladesh including bKash, Nagad, Rocket, as well as direct institutional bank transfers. All transactions are logged securely with verifiable digital payment receipts.',
  },
  {
    id: 'hidden-fees',
    category: 'payments',
    question: 'Are there any hidden fees or surprise charges for clients?',
    answer: 'No. The quote finalized with your Gaenr representative is the final and only amount you pay. We maintain absolute transparency with zero hidden platform markups or surprise maintenance charges.',
  },

  // Clients & Outsourcing
  {
    id: 'assign-process',
    category: 'clients',
    question: 'How do I assign a task or project to an expert?',
    answer: 'You can click "Assign Task" anywhere on Gaenr, describe your project requirements, select your required skill domain, and submit your brief. A Gaenr representative reviews your scope, pairs you with verified talent, and confirms the deliverables with you.',
  },
  {
    id: 'supported-domains',
    category: 'clients',
    question: 'What types of digital tasks and skills can I outsource?',
    answer: 'You can outsource tasks across Full-Stack Web Development, Mobile Apps (React Native, Flutter), UI/UX Design & Prototyping, Graphic Design & Branding, SEO & Digital Marketing, Content Writing, Motion Graphics, and Quality Assurance.',
  },
  {
    id: 'revisions',
    category: 'clients',
    question: 'What if I need revisions on my deliverables?',
    answer: 'Every project includes standard revision rounds agreed upon before kickoff. Our Gaenr operations team actively mediates between you and the expert to ensure the work matches your exact specifications and quality expectations.',
  },
  {
    id: 'intellectual-property',
    category: 'clients',
    question: 'Who owns the commercial rights and intellectual property of the final work?',
    answer: 'You do. Once the project deliverables are fully paid for and approved, 100% of the commercial ownership, source code, design files, and copyright belong exclusively to the client.',
  },
  {
    id: 'direct-communication',
    category: 'clients',
    question: 'Can I communicate with the expert during the project?',
    answer: 'Yes. Project milestones, file exchanges, and clarifications are coordinated seamlessly. Our operations managers facilitate discussions to keep deliverables on schedule and resolve any scope ambiguities immediately.',
  },
  {
    id: 'plagiarism-quality',
    category: 'clients',
    question: 'How does Gaenr guarantee original quality and prevent plagiarism?',
    answer: 'Every deliverable undergoes strict originality verification. Gaenr strictly prohibits copyright infringement, copied design templates, or unauthorized code reuse. Non-original work is rejected during review.',
  },

  // Experts & Freelancers
  {
    id: 'expert-onboarding',
    category: 'experts',
    question: 'How can a talent or student join as a verified expert?',
    answer: 'Visit the "Join as Expert" page, submit your portfolio, primary discipline, and skills. Our team conducts manual verification of sample projects, technical competency, and work history before publishing your public profile on our verified directory.',
  },
  {
    id: 'expert-payouts',
    category: 'experts',
    question: 'How and when do experts receive payouts?',
    answer: 'Earnings are transferred directly to verified Bangladeshi local payout channels (bKash, Nagad, or direct bank transfer) promptly after client milestone approvals, with transparent, industry-low platform fees and zero payout delays.',
  },
  {
    id: 'expert-support-mediation',
    category: 'experts',
    question: 'What happens if a client requests work beyond the agreed brief?',
    answer: 'Gaenr operations actively protects our experts against scope creep. If a client requests additional features or deliverables outside the approved initial brief, we mediate an adjusted scope and supplemental budget before you begin extra work.',
  },
  {
    id: 'response-time',
    category: 'clients',
    question: 'What is the typical response time for support inquiries?',
    answer: 'Our direct phone hotline and official WhatsApp support respond promptly. Email inquiries are reviewed and answered within 2 to 4 business hours.',
  },
];

export const SupportCenterPage: React.FC = () => {
  const { navigate } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'clients' | 'payments' | 'experts'>('all');
  const [openFaq, setOpenFaq] = useState<string | null>('escrow-protection');

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesQuery =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const toggleFaq = (id: string) => {
    setOpenFaq((prev) => (prev === id ? null : id));
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
            <linearGradient id="support-wave-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#818cf8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id="support-wave-2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#006eff" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="support-wave-3" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path fill="url(#support-wave-1)" d="M0,128L60,144C120,160,240,192,360,181.3C480,171,600,117,720,117.3C840,117,960,171,1080,181.3C1200,192,1320,160,1380,144L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
          <path fill="url(#support-wave-2)" d="M0,64L48,96C96,128,192,192,288,208C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,181.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          <path fill="url(#support-wave-3)" d="M0,224L60,208C120,192,240,160,360,165.3C480,171,600,213,720,202.7C840,192,960,128,1080,112C1200,96,1320,128,1380,144L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
        </svg>

        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-y-3 sm:gap-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-white/95 bg-white/15 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full shadow-xs">
            <LifeBuoy className="w-3.5 h-3.5 text-cyan-200" />
            <span>Help &amp; Assistance Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Support Center
          </h1>
          <p className="text-sm sm:text-base text-white/95 font-normal leading-relaxed text-center max-w-xl">
            Find quick answers, explore ecosystem guides, or connect directly with our dedicated operations team.
          </p>

          {/* Interactive Search Box */}
          <div className="w-full max-w-lg mt-2 relative">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics (e.g. escrow, refund, assign task, payouts, revisions)..."
                className="w-full pl-11 pr-4 py-3 bg-white text-slate-900 rounded-2xl shadow-lg border border-slate-200 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-400 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Support Center Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Immediate Help Bar (No time, pulse + Need Immediate Help on left, Contact Channels on right) */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-row items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <span className="font-bold text-slate-900">
              Need Immediate Help?
            </span>
          </div>

          <button
            onClick={() => navigate('/contact')}
            className="font-bold text-[#006eff] hover:underline cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <span>Contact Channels</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* FAQs Section */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-9 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Everything you need to know about navigating Gaenr services safely.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-2xl">
              {(
                [
                  { id: 'all', label: 'All' },
                  { id: 'clients', label: 'Clients' },
                  { id: 'payments', label: 'Payments' },
                  { id: 'experts', label: 'Experts' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    selectedCategory === tab.id
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <p className="text-sm font-bold text-slate-700">No matching help articles found</p>
              <p className="text-xs text-slate-500">
                Try searching with different keywords or contact our team directly.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFaqs.map((faq) => {
                const isOpen = openFaq === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`rounded-2xl border transition-all ${
                      isOpen ? 'border-blue-200 bg-blue-50/20' : 'border-slate-200/80 bg-white hover:border-slate-300'
                    }`}
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left cursor-pointer"
                    >
                      <span className="text-xs sm:text-sm font-bold text-slate-900">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#006eff]' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100/80 mt-1">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Direct Channels Callout */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-9 shadow-xs space-y-6">
          <div className="text-center max-w-md mx-auto space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Still Need Help?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Our support team is available across voice, chat, and email channels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="tel:09647922800"
              className="p-5 rounded-2xl border border-slate-200 hover:border-blue-300 bg-slate-50/50 hover:bg-blue-50/40 transition-all flex flex-col items-center text-center space-y-2.5 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#006eff] flex items-center justify-center border border-blue-100 group-hover:scale-105 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Direct Phone Hotline</p>
                <p className="text-sm font-extrabold text-[#006eff] mt-0.5">09647 922 800</p>
                <p className="text-[11px] text-slate-500 mt-1">Instant voice call assistance</p>
              </div>
            </a>

            <a
              href="https://wa.me/8801608922800"
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 bg-slate-50/50 hover:bg-emerald-50/40 transition-all flex flex-col items-center text-center space-y-2.5 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:scale-105 transition-transform">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">WhatsApp Support</p>
                <p className="text-sm font-extrabold text-emerald-600 mt-0.5">01608 922 800</p>
                <p className="text-[11px] text-slate-500 mt-1">For task scopes, direct proposals &amp; operational assistance</p>
              </div>
            </a>

            <a
              href="mailto:contact@gaenr.com"
              className="p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 bg-slate-50/50 hover:bg-indigo-50/40 transition-all flex flex-col items-center text-center space-y-2.5 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#4f46e5] flex items-center justify-center border border-indigo-100 group-hover:scale-105 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Official Support Inbox</p>
                <p className="text-sm font-extrabold text-[#4f46e5] mt-0.5">contact@gaenr.com</p>
                <p className="text-[11px] text-slate-500 mt-1">Detailed briefs &amp; documentation</p>
              </div>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};
