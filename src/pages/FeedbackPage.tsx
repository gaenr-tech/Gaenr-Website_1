import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useBranding } from '../context/BrandingContext';
import {
  Send,
  CheckCircle2,
  MessageSquare,
  Lightbulb,
  Bug,
  Sparkles,
  User,
  Mail,
  Briefcase,
  Award,
  Globe,
  Check,
  Headphones,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const FeedbackPage: React.FC = () => {
  const { submitFeedback, navigate } = useApp();
  const { branding } = useBranding();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState<'Business / Outsourcer' | 'Expert' | 'Visitor'>('Business / Outsourcer');
  const [category, setCategory] = useState<'Suggestion / Idea' | 'Issue or Bug' | 'Feature Request' | 'General Feedback'>('Suggestion / Idea');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    submitFeedback({
      name: name.trim() || undefined,
      email: email.trim() || undefined,
      userType,
      category,
      message: message.trim(),
    });

    setSubmitted(true);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setMessage('');
    setSubmitted(false);
  };

  const userRoles: { id: 'Business / Outsourcer' | 'Expert' | 'Visitor'; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'Business / Outsourcer', label: 'Business / Outsourcer', icon: Briefcase },
    { id: 'Expert', label: 'Expert', icon: Award },
    { id: 'Visitor', label: 'Visitor / Explorer', icon: Globe },
  ];

  const categories: {
    id: 'Suggestion / Idea' | 'Issue or Bug' | 'Feature Request' | 'General Feedback';
    title: string;
    description: string;
    icon: React.FC<{ className?: string }>;
    accentColor: string;
  }[] = [
    {
      id: 'Suggestion / Idea',
      title: 'Suggestion / Idea',
      description: 'Workflow improvements or clever thoughts',
      icon: Lightbulb,
      accentColor: 'text-amber-500',
    },
    {
      id: 'Issue or Bug',
      title: 'Issue or Bug',
      description: 'Interface glitches or broken friction points',
      icon: Bug,
      accentColor: 'text-rose-500',
    },
    {
      id: 'Feature Request',
      title: 'Feature Request',
      description: 'New tools, automations, or services needed',
      icon: Sparkles,
      accentColor: 'text-purple-500',
    },
    {
      id: 'General Feedback',
      title: 'General Feedback',
      description: 'Overall impressions and user experience',
      icon: MessageSquare,
      accentColor: 'text-[#006eff]',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 antialiased space-y-10 sm:space-y-12 pb-20">
      {/* =========================================================================
          HERO BANNER: Artistic Organic Flowing Aurora & Smooth Waves
          - Matching standard ecosystem styling
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
            <linearGradient id="feedback-wave-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#818cf8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id="feedback-wave-2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#006eff" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="feedback-wave-3" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path fill="url(#feedback-wave-1)" d="M0,128L60,144C120,160,240,192,360,181.3C480,171,600,117,720,117.3C840,117,960,171,1080,181.3C1200,192,1320,160,1380,144L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
          <path fill="url(#feedback-wave-2)" d="M0,64L48,96C96,128,192,192,288,208C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,181.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          <path fill="url(#feedback-wave-3)" d="M0,224L60,208C120,192,240,160,360,165.3C480,171,600,213,720,202.7C840,192,960,128,1080,112C1200,96,1320,128,1380,144L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
        </svg>

        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-y-3 sm:gap-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-white/95 bg-white/15 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            <span>Community & Ecosystem Feedback</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Your Voice Shapes Gaenr
          </h1>
          <p className="text-sm sm:text-base text-white/95 font-normal leading-relaxed text-center max-w-xl">
            If you've noticed something we can improve, have an idea to elevate the platform, or encountered an issue, share it directly. Every submission is personally reviewed.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Context, Guidelines & Quick Support */}
          <div className="lg:col-span-5 space-y-6">
            {/* Guide Card */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#006eff]" />
                  <span>What You Can Share</span>
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Every suggestion helps us make outsourcing and freelancing smoother, faster, and more reliable for Bangladesh.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 border border-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Ideas & Improvements</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Suggestions for client ordering, communication, or portfolio showcases.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Bug className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Bugs & UI Flaws</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Visual glitches, broken links, or friction points noticed while browsing.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Feature Requests</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Specific tools, payment options, or automations you wish existed.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#006eff] border border-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">General Experience</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Honest feedback on what currently feels great and what can be polished.
                    </p>
                  </div>
                </div>
              </div>

              {/* Founding Team Commitment */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-2.5 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Reviewed directly by the Gaenr core team in Dhaka during weekly sprints.</span>
              </div>
            </div>

            {/* Need Urgent Project Help? */}
            <div className="bg-gradient-to-br from-blue-50/90 via-sky-50/50 to-indigo-50/40 border border-blue-200/80 rounded-3xl p-5 sm:p-6 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#006eff]">
                <Headphones className="w-4 h-4" />
                <span>Need Urgent Project Assistance?</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                If you have an active task or need urgent operational support, please connect with our dedicated Support Center for instant escalation.
              </p>
              <button
                type="button"
                onClick={() => navigate('/support')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#006eff] hover:text-blue-700 transition-colors cursor-pointer group"
              >
                <span>Visit Support Center</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Feedback Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
            {submitted ? (
              <div className="text-center py-12 sm:py-16 space-y-6">
                <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200 shadow-xs animate-in zoom-in-95 duration-200">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-slate-900">Thank You for Your Feedback!</h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Your thoughts have been logged successfully. Community input directly steers our roadmap, features, and platform updates.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-[#006eff] bg-blue-50 hover:bg-blue-100 rounded-xl transition-all cursor-pointer border border-blue-200 active:scale-95"
                  >
                    Submit Another Feedback
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">Share Your Thoughts</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    We welcome all types of input. Choose your role and topic to help us route your message accurately.
                  </p>
                </div>

                {/* Role Selection Pills */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    You are sharing feedback as:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {userRoles.map((role) => {
                      const Icon = role.icon;
                      const isSelected = userType === role.id;
                      return (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => setUserType(role.id)}
                          className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-[#006eff] text-white border-[#006eff] shadow-xs'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/90'
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                          <span className="truncate">{role.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Category Selection Grid */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    What is this feedback regarding?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {categories.map((cat) => {
                      const Icon = cat.icon;
                      const isSelected = category === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.id)}
                          className={`flex items-start gap-2.5 p-3 rounded-2xl text-left transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-blue-50/70 border-[#006eff] shadow-xs ring-1 ring-[#006eff]/20'
                              : 'bg-white hover:bg-slate-50/80 border-slate-200/90'
                          }`}
                        >
                          <div className={`p-1.5 rounded-lg shrink-0 ${isSelected ? 'bg-[#006eff] text-white' : 'bg-slate-100 text-slate-600'}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className={`text-xs font-bold ${isSelected ? 'text-[#006eff]' : 'text-slate-800'}`}>
                                {cat.title}
                              </span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-[#006eff]" />}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                              {cat.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Contact Information (Name & Email) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Name <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:border-[#006eff] focus:ring-4 focus:ring-blue-500/10 text-slate-900 transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Email <span className="text-slate-400 font-normal">(Optional, for replies)</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        placeholder="you@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:border-[#006eff] focus:ring-4 focus:ring-blue-500/10 text-slate-900 transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Message Textarea */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Your Feedback <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Share your experience, feature request, or constructive thoughts. The more details you share, the better we can assist..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-3 text-xs sm:text-sm bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:border-[#006eff] focus:ring-4 focus:ring-blue-500/10 text-slate-900 leading-relaxed transition-all placeholder:text-slate-400 resize-none"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 text-xs sm:text-sm font-bold text-white rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 gaenr-btn-primary"
                    style={{ backgroundColor: branding.primaryColor }}
                  >
                    <span>Submit Feedback</span>
                    <Send className="w-4 h-4" />
                  </button>
                  <p className="text-[11px] text-slate-400 text-center mt-2.5">
                    Your submission is kept confidential and protected by Gaenr's privacy standards.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
