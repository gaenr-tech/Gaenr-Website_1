import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AvatarGraphic } from '../components/common/Avatars';
import { GaenrLogo } from '../components/common/GaenrLogo';
import {
  Star,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Smile,
  Meh,
  Frown,
  ExternalLink,
  MessageSquare,
  User,
  Mail,
  Building,
} from 'lucide-react';

interface ClientReviewPageProps {
  expertCode: string;
}

export const ClientReviewPage: React.FC<ClientReviewPageProps> = ({ expertCode }) => {
  const { freelancers, addExpertReview, confirmExpertDelivery, navigate } = useApp();

  const expert = freelancers.find(
    (fl) => fl.code.toLowerCase() === expertCode.toLowerCase()
  );

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientType, setClientType] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [satisfaction, setSatisfaction] = useState<'satisfied' | 'neutral' | 'unsatisfied'>('satisfied');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deliveryConfirmed, setDeliveryConfirmed] = useState(false);
  const [confirmingDelivery, setConfirmingDelivery] = useState(false);

  const ratingDescriptions: Record<number, string> = {
    1: '1 Star - Unsatisfactory Deliverable',
    2: '2 Stars - Below Expectations',
    3: '3 Stars - Met Basic Requirements',
    4: '4 Stars - Great Work & Professionalism',
    5: '5 Stars - Exceptional Quality & Precision',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expert) return;

    if (!clientName.trim() || !clientEmail.trim() || !reviewText.trim()) {
      return;
    }

    setSubmitting(true);

    const success = addExpertReview(expert.code, {
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      clientType: clientType.trim() || 'Verified Client',
      rating,
      text: reviewText.trim(),
      satisfaction,
      skipDeliveryIncrement: deliveryConfirmed,
    });

    setSubmitting(false);
    if (success) {
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!expert) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200/90 rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Review Link Not Found</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            The expert code <code className="font-mono text-[#006eff] font-bold">{expertCode}</code> is invalid or has expired. Please verify the completion link provided by Gaenr Operations.
          </p>
          <button
            onClick={() => navigate('/')}
            className="gaenr-btn-primary w-full !py-2.5 !rounded-xl !text-xs cursor-pointer"
          >
            Go to Gaenr Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 antialiased py-10 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background blur circles */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl mx-auto space-y-6 relative z-10">
        {/* Top Gaenr Header Brand */}
        <div className="flex flex-col items-center justify-center text-center space-y-3">
          {/* Logo & Brand Name */}
          <div className="inline-flex items-center justify-center gap-2.5">
            <GaenrLogo size={32} />
            <span className="font-black text-2xl text-slate-900 tracking-tight leading-none">Gaenr</span>
          </div>

          {/* Verified Badge */}
          <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/90 border border-blue-200/80 text-[11px] font-mono font-bold text-[#006eff] shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-[#006eff] shrink-0" />
            <span className="tracking-wide uppercase">Verified Project Completion Review</span>
          </div>

          {/* Heading & Subtitle */}
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Client Review &amp; Testimonial
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Your verified feedback will be attached directly to this expert's official Gaenr showcase portfolio.
            </p>
          </div>
        </div>

        {/* Success View */}
        {isSubmitted ? (
          <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-sm text-center space-y-6 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900">
                Thank You, {clientName}!
              </h2>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Your verified review of <strong>{rating} Stars</strong> has been successfully submitted and permanently linked to Expert <strong className="font-mono text-[#006eff]">{expert.code}</strong>.
              </p>
            </div>

            {/* Preview submitted card */}
            <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl text-left space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-500">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s <= rating ? 'fill-amber-400 text-amber-500' : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-slate-400">Just now</span>
              </div>
              <p className="text-xs text-slate-700 italic">"{reviewText}"</p>
              <div className="text-[11px] font-bold text-slate-900 pt-1 border-t border-slate-200/60 flex items-center justify-between">
                <span>{clientName}</span>
                <span className="text-slate-400 font-normal">{clientType || 'Verified Client'}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(`/experts/${expert.code}`)}
                className="gaenr-btn-primary w-full !py-3 !rounded-2xl !text-xs !font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
              >
                <span>View Expert's Live Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Return to Homepage
              </button>
            </div>
          </div>
        ) : (
          /* Review Form Card */
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            {/* Target Expert Banner */}
            <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-2xl flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white border border-blue-200 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
                <AvatarGraphic id={expert.avatarId} size={52} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                  Deliverable Executed By
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-extrabold text-sm text-[#006eff]">
                    {expert.code}
                  </span>
                  <span className="text-xs font-bold text-slate-900 truncate">
                    {expert.categoryTitle}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5 font-mono">
                  <span>Current: ★ {expert.rating.toFixed(1)}</span>
                  <span>•</span>
                  <span>{expert.reviewsCount} Client Reviews</span>
                  <span>•</span>
                  <span className="text-emerald-600 font-bold">{expert.completedProjects || 0} Deliveries</span>
                </div>
              </div>
            </div>

            {/* Quick Delivery Confirmation Card */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                deliveryConfirmed
                  ? 'bg-emerald-50/90 border-emerald-200'
                  : 'bg-slate-50/90 border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 ${
                        deliveryConfirmed ? 'text-emerald-600' : 'text-[#006eff]'
                      }`}
                    />
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                      {deliveryConfirmed
                        ? 'Project Delivery Confirmed!'
                        : 'Direct Delivery Confirmation'}
                    </h3>
                    {deliveryConfirmed && (
                      <span className="text-[10px] bg-emerald-600 text-white font-mono px-2 py-0.5 rounded-full font-bold">
                        Counted
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed max-w-md">
                    {deliveryConfirmed
                      ? `Delivery registered for Expert ${expert.code}. Total completed deliveries count has been updated in the ledger.`
                      : 'Received your completed work? Confirm delivery here with 1 click so this completion is counted, even if you do not want to write a review.'}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {deliveryConfirmed ? (
                    <div className="flex items-center gap-2">
                      <div className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-emerald-700 border border-emerald-300 rounded-xl text-xs font-bold shadow-2xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Yes, Delivered</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Return Home
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={confirmingDelivery}
                      onClick={() => {
                        setConfirmingDelivery(true);
                        const ok = confirmExpertDelivery(expert.code);
                        setConfirmingDelivery(false);
                        if (ok) {
                          setDeliveryConfirmed(true);
                        }
                      }}
                      className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm Delivery / Yes, Delivered</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="relative flex py-1 items-center">
              <div className="grow border-t border-slate-200"></div>
              <span className="shrink mx-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
                {deliveryConfirmed ? 'Optional: Leave a Testimonial' : 'Or Submit Full Client Review'}
              </span>
              <div className="grow border-t border-slate-200"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Star Rating Section */}
              <div className="space-y-2 text-center py-2 border-y border-slate-100">
                <label className="block text-xs font-bold text-slate-700">
                  Rate Overall Quality &amp; Deliverables <span className="text-rose-500">*</span>
                </label>

                {/* 5 Interactive Stars */}
                <div className="flex items-center justify-center gap-2 py-2">
                  {[1, 2, 3, 4, 5].map((starVal) => {
                    const activeVal = hoverRating || rating;
                    const isFilled = starVal <= activeVal;
                    return (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setRating(starVal)}
                        onMouseEnter={() => setHoverRating(starVal)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 hover:scale-120 active:scale-95 transition-transform cursor-pointer focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 sm:w-9 sm:h-9 transition-colors ${
                            isFilled
                              ? 'fill-amber-400 text-amber-500 drop-shadow-xs'
                              : 'text-slate-200 hover:text-slate-300'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                <div className="text-xs font-bold text-slate-800">
                  {ratingDescriptions[hoverRating || rating]}
                </div>
              </div>

              {/* Client Name & Client Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Your Full Name <span className="text-rose-500">*</span></span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Asif Mahmud"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-[#006eff] focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Your Email Address <span className="text-rose-500">*</span></span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. asif@company.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-[#006eff] focus:outline-none transition-all"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    (Email is kept confidential and will not be displayed publicly)
                  </span>
                </div>
              </div>

              {/* Client Title / Organization */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>Designation or Organization (Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Founder, Apex Digital / Retail Client"
                  value={clientType}
                  onChange={(e) => setClientType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-[#006eff] focus:outline-none transition-all"
                />
              </div>

              {/* Satisfaction Choice */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Project Outcome Satisfaction
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSatisfaction('satisfied')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      satisfaction === 'satisfied'
                        ? 'border-emerald-500 bg-emerald-50/80 text-emerald-800 font-bold ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Smile className={`w-5 h-5 ${satisfaction === 'satisfied' ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className="text-xs">Satisfied</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSatisfaction('neutral')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      satisfaction === 'neutral'
                        ? 'border-amber-500 bg-amber-50/80 text-amber-800 font-bold ring-2 ring-amber-500/20'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Meh className={`w-5 h-5 ${satisfaction === 'neutral' ? 'text-amber-600' : 'text-slate-400'}`} />
                    <span className="text-xs">Neutral</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSatisfaction('unsatisfied')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      satisfaction === 'unsatisfied'
                        ? 'border-rose-500 bg-rose-50/80 text-rose-800 font-bold ring-2 ring-rose-500/20'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Frown className={`w-5 h-5 ${satisfaction === 'unsatisfied' ? 'text-rose-600' : 'text-slate-400'}`} />
                    <span className="text-xs">Unsatisfied</span>
                  </button>
                </div>
              </div>

              {/* Review Testimonial Text */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                  <span>Review &amp; Testimonial <span className="text-rose-500">*</span></span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share details regarding output accuracy, delivery speed, and communication quality during the project execution..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-[#006eff] focus:outline-none transition-all leading-relaxed"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="gaenr-btn-primary w-full !py-3.5 !rounded-2xl !text-sm !font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all"
              >
                <span>Submit Verified Review</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-1">
                <div className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-100/90 border border-slate-200/80 text-[11px] text-slate-500 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Secured &amp; verified under Gaenr Talent Assurance</span>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
