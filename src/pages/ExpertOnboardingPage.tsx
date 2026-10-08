import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useBranding } from '../context/BrandingContext';
import { GaenrLogo } from '../components/common/GaenrLogo';
import { RAW_AVATAR_SPECS, AvatarGraphic, VerifiedBadge3D } from '../components/common/Avatars';
import { ExpertPricingTier } from '../types';
import {
  CheckCircle,
  Sparkles,
  ArrowRight,
  UserCheck,
  CreditCard,
  Quote,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Plus,
  Trash2,
  Lock,
  Building2,
  Smartphone,
  Wallet,
} from 'lucide-react';

interface ExpertOnboardingPageProps {
  applicationId?: string;
}

export const ExpertOnboardingPage: React.FC<ExpertOnboardingPageProps> = ({ applicationId }) => {
  const { currentRoute, expertApplications, saveExpertOnboardingResponse, navigate, showToast } = useApp();
  const { branding } = useBranding();

  // Resolve applicationId from props or route: /expert-onboarding/:id
  const resolvedId =
    applicationId ||
    currentRoute.split('#')[0].split('?')[0].replace('/expert-onboarding/', '').trim();

  const application = expertApplications.find((a) => a.id === resolvedId);

  // Form State initialized from existing onboardingData if present
  const [pricingModel, setPricingModel] = useState(
    application?.onboardingData?.pricingModel || '5,000 BDT / Deliverable'
  );

  const [pricingTiers, setPricingTiers] = useState<ExpertPricingTier[]>(
    application?.onboardingData?.pricingTiers && application.onboardingData.pricingTiers.length > 0
      ? application.onboardingData.pricingTiers
      : [
          { id: 'tier-1', serviceName: 'Standard Package', price: '5,000 BDT' },
          { id: 'tier-2', serviceName: 'Pro / Extended Deliverables', price: '10,000 BDT' },
        ]
  );

  // Default avatar selection (smart default matching gender)
  const defaultAvatar = application?.gender.toLowerCase().includes('female')
    ? 'avatar-youth-f1'
    : 'avatar-youth-m1';

  const [selectedAvatarId, setSelectedAvatarId] = useState<string>(
    application?.onboardingData?.avatarId || defaultAvatar
  );

  const [statement, setStatement] = useState(
    application?.onboardingData?.statement ||
      `Dedicated Gaenr Expert specializing in ${
        application?.otherSkill || application?.skill?.split('/')[0].trim() || 'creative digital work'
      }. Committed to delivering exceptional quality with verified precision.`
  );

  // Payout & Banking Details
  const [payoutMethod, setPayoutMethod] = useState<'bank' | 'bkash' | 'nagad'>(
    application?.onboardingData?.payoutMethod || 'bank'
  );
  const [bankName, setBankName] = useState(application?.onboardingData?.bankName || '');
  const [accountHolderName, setAccountHolderName] = useState(
    application?.onboardingData?.accountHolderName || application?.fullName || ''
  );
  const [accountNumber, setAccountNumber] = useState(application?.onboardingData?.accountNumber || '');
  const [branchName, setBranchName] = useState(application?.onboardingData?.branchName || '');
  const [routingNumber, setRoutingNumber] = useState(application?.onboardingData?.routingNumber || '');
  const [mfsNumber, setMfsNumber] = useState(
    application?.onboardingData?.mfsNumber || application?.whatsapp || ''
  );

  const [isSubmitted, setIsSubmitted] = useState(false);

  // If application not found
  if (!application) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xl text-center space-y-4">
          <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Application Record Not Found</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            The onboarding link you accessed appears to be invalid or has expired. If you submitted an application, please contact Gaenr team on WhatsApp.
          </p>
          <div className="pt-2">
            <a
              href="https://wa.me/8801608922800"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
            >
              <span>Contact Gaenr Operations</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  const handleAddPricingTier = () => {
    const newTier: ExpertPricingTier = {
      id: `tier_${Date.now()}`,
      serviceName: 'Custom Deliverable',
      price: '8,000 BDT',
    };
    setPricingTiers([...pricingTiers, newTier]);
  };

  const handleRemovePricingTier = (id: string) => {
    if (pricingTiers.length <= 1) {
      showToast('At least one pricing tier is required', 'info');
      return;
    }
    setPricingTiers(pricingTiers.filter((t) => t.id !== id));
  };

  const handleUpdateTier = (id: string, field: 'serviceName' | 'price', val: string) => {
    setPricingTiers(
      pricingTiers.map((t) => (t.id === id ? { ...t, [field]: val } : t))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statement.trim()) {
      showToast('Please provide your statement / bio.', 'error');
      return;
    }

    if (payoutMethod === 'bank' && (!bankName.trim() || !accountNumber.trim())) {
      showToast('Please provide your Bank Name and Account Number.', 'error');
      return;
    }

    if ((payoutMethod === 'bkash' || payoutMethod === 'nagad') && !mfsNumber.trim()) {
      showToast(`Please enter your ${payoutMethod === 'bkash' ? 'bKash' : 'Nagad'} personal number.`, 'error');
      return;
    }

    saveExpertOnboardingResponse(application.id, {
      pricingModel,
      pricingTiers,
      avatarId: selectedAvatarId,
      statement: statement.trim(),
      payoutMethod,
      bankName: bankName.trim(),
      accountHolderName: accountHolderName.trim(),
      accountNumber: accountNumber.trim(),
      branchName: branchName.trim(),
      routingNumber: routingNumber.trim(),
      mfsNumber: mfsNumber.trim(),
    });

    setIsSubmitted(true);
    showToast('Onboarding profile & payout details saved successfully!', 'success');
  };

  const skillTitle = application.otherSkill || application.skill.split('/')[0].trim();

  return (
    <div className="min-h-screen bg-slate-50/70 selection:bg-[#006eff] selection:text-white pb-20">
      {/* Top Floating Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GaenrLogo className="h-6 text-slate-900" />
            <span className="text-slate-300">|</span>
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-[#006eff]" />
              Expert Onboarding Portal
            </span>
          </div>

          <div className="flex items-center gap-2">
            <VerifiedBadge3D size={20} />
            <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Verified Applicant
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        {/* Welcome Card - Official Selection Notice */}
        <div className="bg-gradient-to-br from-[#0c182c] to-[#050d1a] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden mb-8 border border-slate-800">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                <span>Gaenr Expert Selection &amp; Profile Setup</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Congratulations, {application.fullName}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                You have been officially selected as a Gaenr Expert! Please complete your 3D youth avatar selection, pricing model, bio statement, and bank payout details below to activate your verified creator profile.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs text-xs space-y-1.5 shrink-0 min-w-[220px]">
              <div className="text-[10px] text-slate-400 uppercase font-mono font-bold flex items-center justify-between">
                <span>Selected Candidate</span>
                <span className="text-emerald-400 font-bold">APPROVED</span>
              </div>
              <div className="font-bold text-white text-sm">{application.fullName}</div>
              <div className="text-blue-300 font-semibold">{skillTitle}</div>
              <div className="text-slate-400 text-[11px] truncate">{application.email}</div>
            </div>
          </div>
        </div>

        {/* Submission Complete View */}
        {isSubmitted ? (
          <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-12 text-center shadow-lg space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Onboarding Details Saved Successfully!
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your 3D avatar, pricing structure, bio statement, and payout account have been linked to your Gaenr Expert record. Gaenr Operations is finalizing your profile activation.
              </p>
            </div>

            {/* Summary Card */}
            <div className="max-w-md mx-auto p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-200/70">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-900 border border-slate-300 shrink-0 relative">
                  <AvatarGraphic id={selectedAvatarId} size="100%" className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Selected Avatar</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 text-xs">
                      {RAW_AVATAR_SPECS.find((a) => a.id === selectedAvatarId)?.name || 'Custom Avatar'}
                    </span>
                    <VerifiedBadge3D size={16} />
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Pricing Model</span>
                <span className="font-bold text-slate-800 text-xs">{pricingModel}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Payout Method</span>
                <span className="font-bold text-slate-800 text-xs uppercase">
                  {payoutMethod === 'bank'
                    ? `${bankName || 'Bank'} (${accountNumber ? `•••• ${accountNumber.slice(-4)}` : 'Active'})`
                    : `${payoutMethod} (${mfsNumber})`}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block">My Statement</span>
                <p className="text-xs text-slate-600 italic">"{statement}"</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Edit My Responses
              </button>
            </div>
          </div>
        ) : (
          /* The Interactive Onboarding Form */
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Avatar Selection */}
            <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-blue-50 text-[#006eff] font-bold text-xs flex items-center justify-center font-mono">
                  1
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                    Choose Your 3D Youth Avatar
                  </h2>
                  <p className="text-xs text-slate-500">
                    To maintain professional consistency and complete privacy on Gaenr, select one of the 10 official 3D student avatars.
                  </p>
                </div>
              </div>

              {/* 10 Avatars Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                {RAW_AVATAR_SPECS.map((avatar) => {
                  const isSelected = selectedAvatarId === avatar.id;
                  return (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => setSelectedAvatarId(avatar.id)}
                      className={`relative p-3 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-2 cursor-pointer group ${
                        isSelected
                          ? 'border-[#006eff] bg-blue-50/50 shadow-md ring-2 ring-[#006eff]/20'
                          : 'border-slate-200 hover:border-blue-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-900 border border-slate-200/80 shadow-2xs group-hover:scale-105 transition-transform flex items-center justify-center">
                        <AvatarGraphic id={avatar.id} size="100%" className="w-full h-full object-cover" />
                      </div>
                      <div className="text-xs font-bold text-slate-900">{avatar.name}</div>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                        {avatar.gender}
                      </span>

                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <VerifiedBadge3D size={22} className="drop-shadow-sm" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Step 2: Pricing Model & Packages */}
            <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-blue-50 text-[#006eff] font-bold text-xs flex items-center justify-center font-mono">
                  2
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                    Pricing Model &amp; Rates
                  </h2>
                  <p className="text-xs text-slate-500">
                    Set your expected deliverable rates. Gaenr maintains transparent pricing for clients with 0% client platform charge.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Standard Pricing Model / Base Rate
                  </label>
                  <input
                    type="text"
                    value={pricingModel}
                    onChange={(e) => setPricingModel(e.target.value)}
                    placeholder="e.g. 5,000 BDT / Deliverable or Hourly Rate"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#006eff] transition-colors"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Clients will see this base estimate when exploring your talent profile.
                  </span>
                </div>

                {/* Pricing Tiers Table */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Custom Package Tiers</span>
                    <button
                      type="button"
                      onClick={handleAddPricingTier}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-[#006eff] text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Tier</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {pricingTiers.map((tier) => (
                      <div
                        key={tier.id}
                        className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200/80 rounded-xl"
                      >
                        <input
                          type="text"
                          value={tier.serviceName}
                          onChange={(e) => handleUpdateTier(tier.id, 'serviceName', e.target.value)}
                          placeholder="Package Deliverable (e.g. Standard Logo Design)"
                          className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#006eff]"
                        />
                        <input
                          type="text"
                          value={tier.price}
                          onChange={(e) => handleUpdateTier(tier.id, 'price', e.target.value)}
                          placeholder="Price (e.g. 6,000 BDT)"
                          className="w-36 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#006eff] font-mono font-bold"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemovePricingTier(tier.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Remove tier"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Step 3: My Statement / Bio */}
            <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-blue-50 text-[#006eff] font-bold text-xs flex items-center justify-center font-mono">
                  3
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                    My Statement &amp; Value Proposition
                  </h2>
                  <p className="text-xs text-slate-500">
                    Write a compelling statement that highlights your core skill, approach to client work, and reliability.
                  </p>
                </div>
              </div>

              <div>
                <textarea
                  rows={4}
                  value={statement}
                  onChange={(e) => setStatement(e.target.value)}
                  placeholder="Describe your professional philosophy and core deliverable standards..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#006eff] leading-relaxed transition-colors"
                />
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                  <span>This bio will be proudly highlighted on your official Gaenr Profile page.</span>
                  <span>{statement.length} characters</span>
                </div>
              </div>
            </section>

            {/* Step 4: Bank & Payout Details (Secure Freelancer Earnings) */}
            <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-blue-50 text-[#006eff] font-bold text-xs flex items-center justify-center font-mono">
                  4
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <span>Bank &amp; Payment Payout Details</span>
                    <Lock className="w-4 h-4 text-emerald-600" />
                  </h2>
                  <p className="text-xs text-slate-500">
                    Provide your preferred payout account to receive direct client project earnings and milestone fees with 0% platform deductions.
                  </p>
                </div>
              </div>

              {/* Method Selection Tabs */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPayoutMethod('bank')}
                  className={`p-3.5 rounded-2xl border-2 flex flex-col items-center gap-2 text-center transition-all cursor-pointer ${
                    payoutMethod === 'bank'
                      ? 'border-[#006eff] bg-blue-50/60 text-[#006eff] font-bold shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                  <span className="text-xs font-bold">Bank Account</span>
                  <span className="text-[10px] text-slate-400 font-mono">EFT / NPSB / RTGS</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPayoutMethod('bkash')}
                  className={`p-3.5 rounded-2xl border-2 flex flex-col items-center gap-2 text-center transition-all cursor-pointer ${
                    payoutMethod === 'bkash'
                      ? 'border-[#006eff] bg-blue-50/60 text-[#006eff] font-bold shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-rose-500" />
                  <span className="text-xs font-bold">bKash</span>
                  <span className="text-[10px] text-slate-400 font-mono">Personal Account</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPayoutMethod('nagad')}
                  className={`p-3.5 rounded-2xl border-2 flex flex-col items-center gap-2 text-center transition-all cursor-pointer ${
                    payoutMethod === 'nagad'
                      ? 'border-[#006eff] bg-blue-50/60 text-[#006eff] font-bold shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <Wallet className="w-5 h-5 text-amber-500" />
                  <span className="text-xs font-bold">Nagad</span>
                  <span className="text-[10px] text-slate-400 font-mono">Personal Account</span>
                </button>
              </div>

              {/* Conditional Inputs */}
              {payoutMethod === 'bank' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Bank Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="e.g. Dutch-Bangla Bank, BRAC Bank, City Bank"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#006eff]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Account Holder Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={accountHolderName}
                      onChange={(e) => setAccountHolderName(e.target.value)}
                      placeholder="Exact name as in bank record"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#006eff]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Account Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="e.g. 1201010023456"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-[#006eff]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Branch Name &amp; Routing Number
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={branchName}
                        onChange={(e) => setBranchName(e.target.value)}
                        placeholder="Branch (e.g. Gulshan)"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#006eff]"
                      />
                      <input
                        type="text"
                        value={routingNumber}
                        onChange={(e) => setRoutingNumber(e.target.value)}
                        placeholder="Routing No. (Optional)"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-[#006eff]"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="pt-1 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {payoutMethod === 'bkash' ? 'bKash' : 'Nagad'} Personal Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={mfsNumber}
                      onChange={(e) => setMfsNumber(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full max-w-md px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-[#006eff]"
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Must be a personal wallet registered under your verified NID.
                    </span>
                  </div>
                </div>
              )}

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5 text-slate-500 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Payout details are securely encrypted and accessed only by Gaenr Finance for processing your project payments.
                </span>
              </div>
            </section>

            {/* Form Action */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                className="px-8 py-3.5 bg-[#006eff] hover:bg-blue-600 text-white font-bold text-xs rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Save &amp; Submit Onboarding Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};
