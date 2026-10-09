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

  // Resolve applicationId from props or route: /onboard/:id or /expert-onboarding/:id
  const cleanPath = currentRoute.split('#')[0].split('?')[0];
  const resolvedId =
    applicationId ||
    cleanPath
      .replace('/expert-onboarding/', '')
      .replace('/onboard/', '')
      .replace('/o/', '')
      .trim();

  const application = expertApplications.find((a) => a.id === resolvedId);

  // Form State initialized from existing onboardingData if previously submitted, otherwise completely blank
  const [pricingModel, setPricingModel] = useState(
    application?.onboardingData?.pricingModel || ''
  );

  const [pricingTiers, setPricingTiers] = useState<ExpertPricingTier[]>(
    application?.onboardingData?.pricingTiers && application.onboardingData.pricingTiers.length > 0
      ? application.onboardingData.pricingTiers.map((t) => ({
          ...t,
          price: t.price.replace(/\s*BDT\s*/gi, '').trim(),
        }))
      : [
          { id: 'tier-1', serviceName: '', price: '' },
        ]
  );

  // Default avatar selection (matching gender if available, or first avatar)
  const defaultAvatar = application?.gender.toLowerCase().includes('female')
    ? 'avatar-youth-f1'
    : 'avatar-youth-m1';

  const [selectedAvatarId, setSelectedAvatarId] = useState<string>(
    application?.onboardingData?.avatarId || defaultAvatar
  );

  const [statement, setStatement] = useState(
    application?.onboardingData?.statement || ''
  );

  // Payout Details: Strictly TWO options (Bank Account vs MFS)
  const [payoutMethod, setPayoutMethod] = useState<'bank' | 'mfs'>(
    application?.onboardingData?.payoutMethod === 'bank' ? 'bank' : 'mfs'
  );

  // Bank Account fields (Starts blank)
  const [bankName, setBankName] = useState(application?.onboardingData?.bankName || '');
  const [accountHolderName, setAccountHolderName] = useState(
    application?.onboardingData?.accountHolderName || ''
  );
  const [accountNumber, setAccountNumber] = useState(application?.onboardingData?.accountNumber || '');
  const [branchName, setBranchName] = useState(application?.onboardingData?.branchName || '');
  const [routingNumber, setRoutingNumber] = useState(application?.onboardingData?.routingNumber || '');

  // MFS fields (Starts blank)
  const [mfsProvider, setMfsProvider] = useState<'bKash' | 'Nagad' | 'Rocket'>(
    application?.onboardingData?.mfsProvider || 'bKash'
  );
  const [mfsAccountHolderName, setMfsAccountHolderName] = useState(
    application?.onboardingData?.accountHolderName || ''
  );
  const [mfsNumber, setMfsNumber] = useState(
    application?.onboardingData?.mfsNumber || ''
  );
  const [mfsAccountType, setMfsAccountType] = useState<'Personal' | 'Agent' | 'Merchant'>(
    application?.onboardingData?.mfsAccountType || 'Personal'
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
      serviceName: '',
      price: '',
    };
    setPricingTiers([...pricingTiers, newTier]);
  };

  const handleRemovePricingTier = (id: string) => {
    if (pricingTiers.length <= 1) {
      showToast('At least one pricing package is required', 'info');
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

    // 1. Mandatory Pricing validation
    const emptyTiers = pricingTiers.filter((t) => !t.serviceName.trim() || !t.price.trim());
    if (pricingTiers.length === 0 || emptyTiers.length > 0) {
      showToast('Please provide both service name and price for all pricing packages.', 'error');
      return;
    }

    // 2. Mandatory Statement validation
    if (!statement.trim()) {
      showToast('Please provide your statement.', 'error');
      return;
    }

    // 3. Mandatory Payout validation
    if (payoutMethod === 'bank') {
      if (!bankName.trim() || !accountHolderName.trim() || !accountNumber.trim()) {
        showToast('Please provide your Bank Name, Account Holder Name, and Account Number.', 'error');
        return;
      }
    } else {
      if (!mfsAccountHolderName.trim() || !mfsNumber.trim()) {
        showToast(`Please enter your ${mfsProvider} account holder name and mobile number.`, 'error');
        return;
      }
    }

    const cleanedTiers = pricingTiers.map((t) => ({
      ...t,
      price: t.price.replace(/\s*BDT\s*/gi, '').trim(),
    }));

    const calculatedBaseRate = cleanedTiers[0]?.price
      ? `${cleanedTiers[0].price} BDT / Deliverable`
      : pricingModel;

    saveExpertOnboardingResponse(application.id, {
      pricingModel: calculatedBaseRate,
      pricingTiers: cleanedTiers,
      avatarId: selectedAvatarId,
      statement: statement.trim(),
      payoutMethod,
      bankName: payoutMethod === 'bank' ? bankName.trim() : undefined,
      accountHolderName: payoutMethod === 'bank' ? accountHolderName.trim() : mfsAccountHolderName.trim(),
      accountNumber: payoutMethod === 'bank' ? accountNumber.trim() : undefined,
      branchName: payoutMethod === 'bank' ? branchName.trim() : undefined,
      routingNumber: payoutMethod === 'bank' ? routingNumber.trim() : undefined,
      mfsProvider: payoutMethod === 'mfs' ? mfsProvider : undefined,
      mfsAccountType: payoutMethod === 'mfs' ? mfsAccountType : undefined,
      mfsNumber: payoutMethod === 'mfs' ? mfsNumber.trim() : undefined,
    });

    setIsSubmitted(true);
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

          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>Gaenr Expert Selection &amp; Profile Setup</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Congratulations, {application.fullName}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              You have been officially selected as a Gaenr Expert in <strong className="text-blue-300">{skillTitle}</strong>. Please complete your avatar selection, service rates, statement, and payout details below to activate your verified profile.
            </p>
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
                Your avatar identity, pricing structure, statement, and payout account have been linked to your Gaenr Expert record. Gaenr Operations is finalizing your profile activation.
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
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Pricing Packages</span>
                <div className="space-y-1 mt-1">
                  {pricingTiers.map((t) => (
                    <div key={t.id} className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">{t.serviceName}</span>
                      <span className="font-mono font-bold text-[#006eff]">{t.price} BDT</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Payout Method</span>
                <span className="font-bold text-slate-800 text-xs uppercase">
                  {payoutMethod === 'bank'
                    ? `${bankName || 'Bank'} (${accountNumber ? `•••• ${accountNumber.slice(-4)}` : 'Active'})`
                    : `${mfsProvider} (${mfsAccountType}) • ${mfsNumber}`}
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
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-[#006eff] hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer inline-flex items-center gap-2 active:scale-98"
              >
                <span>Back to GAENR</span>
                <ArrowRight className="w-4 h-4" />
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
                    Choose Your Avatar
                  </h2>
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-blue-50 text-[#006eff] font-bold text-xs flex items-center justify-center font-mono">
                    2
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                      Service Pricing &amp; Deliverable Rates
                    </h2>
                    <p className="text-xs text-slate-500">
                      Define standardized deliverable pricing for clients to view transparent service costs with 0% platform charges.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddPricingTier}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#006eff] rounded-xl text-xs font-bold transition-all cursor-pointer border border-blue-200/70 shadow-2xs active:scale-95 self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Service Rate</span>
                </button>
              </div>

              {/* Pricing Tiers Table matching Create Expert Profile */}
              <div className="space-y-3 pt-1">
                {pricingTiers.map((tier, idx) => (
                  <div
                    key={tier.id}
                    className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/90 shadow-2xs"
                  >
                    <div className="flex items-center gap-2 md:w-1/2">
                      <span className="text-[10px] font-mono font-bold text-slate-400 w-5 text-center shrink-0">
                        #{idx + 1}
                      </span>
                      <input
                        type="text"
                        placeholder="Service / Deliverable (e.g. Logo Design, Landing Page, Slide Deck)"
                        value={tier.serviceName}
                        onChange={(e) => handleUpdateTier(tier.id, 'serviceName', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#006eff]"
                      />
                    </div>

                    <div className="flex items-center gap-2 flex-1">
                      <div className="flex items-center flex-1 bg-white border border-slate-200 rounded-xl overflow-hidden focus-within:border-[#006eff] transition-colors">
                        <span className="px-2.5 py-2 text-[10px] font-bold font-mono text-[#006eff] bg-blue-50 border-r border-slate-200 shrink-0 select-none">
                          BDT
                        </span>
                        <input
                          type="text"
                          placeholder="e.g. 5,000 or 3,500 - 7,500"
                          value={tier.price}
                          onChange={(e) => handleUpdateTier(tier.id, 'price', e.target.value.replace(/\s*BDT\s*/gi, ''))}
                          className="w-full px-3 py-2 bg-transparent text-xs text-slate-900 focus:outline-none font-mono font-bold"
                        />
                      </div>
                      {pricingTiers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePricingTier(tier.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer shrink-0"
                          title="Remove tier"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
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
                    My Statement
                  </h2>
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
                    <span>Payment Payout Options</span>
                    <Lock className="w-4 h-4 text-emerald-600" />
                  </h2>
                  <p className="text-xs text-slate-500">
                    Select your preferred payout channel to receive direct project earnings with 0% platform deductions.
                  </p>
                </div>
              </div>

              {/* Strictly TWO Payment Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <button
                  type="button"
                  onClick={() => setPayoutMethod('bank')}
                  className={`p-4 rounded-2xl border-2 flex items-center gap-3.5 transition-all cursor-pointer text-left ${
                    payoutMethod === 'bank'
                      ? 'border-[#006eff] bg-blue-50/50 shadow-xs ring-2 ring-[#006eff]/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      payoutMethod === 'bank' ? 'bg-[#006eff] text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">1. Bank Account</div>
                    <div className="text-[11px] text-slate-500 font-mono">EFT / NPSB / RTGS / Online Transfer</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPayoutMethod('mfs')}
                  className={`p-4 rounded-2xl border-2 flex items-center gap-3.5 transition-all cursor-pointer text-left ${
                    payoutMethod === 'mfs'
                      ? 'border-[#006eff] bg-blue-50/50 shadow-xs ring-2 ring-[#006eff]/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      payoutMethod === 'mfs' ? 'bg-[#006eff] text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">2. MFS (Mobile Financial Services)</div>
                    <div className="text-[11px] text-slate-500 font-mono">bKash / Nagad / Rocket</div>
                  </div>
                </button>
              </div>

              {/* Conditional Inputs */}
              {payoutMethod === 'bank' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Bank Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="e.g. Dutch-Bangla Bank, BRAC Bank, City Bank, Eastern Bank"
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
                      placeholder="Exact name registered with your bank"
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
                <div className="pt-2 border-t border-slate-100 space-y-4">
                  {/* MFS Provider Selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      MFS Provider <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {(['bKash', 'Nagad', 'Rocket'] as const).map((prov) => (
                        <button
                          key={prov}
                          type="button"
                          onClick={() => setMfsProvider(prov)}
                          className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            mfsProvider === prov
                              ? prov === 'bKash'
                                ? 'bg-pink-50 border-pink-400 text-pink-700 ring-2 ring-pink-500/20'
                                : prov === 'Nagad'
                                ? 'bg-amber-50 border-amber-400 text-amber-700 ring-2 ring-amber-500/20'
                                : 'bg-purple-50 border-purple-400 text-purple-700 ring-2 ring-purple-500/20'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span>{prov}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Account Holder Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={mfsAccountHolderName}
                        onChange={(e) => setMfsAccountHolderName(e.target.value)}
                        placeholder="e.g. Tanvir Hasan (Registered under NID)"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#006eff]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {mfsProvider} Mobile Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={mfsNumber}
                        onChange={(e) => setMfsNumber(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-[#006eff]"
                      />
                    </div>
                  </div>

                  {/* Account Type Selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Account Type <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      {(['Personal', 'Agent', 'Merchant'] as const).map((accType) => (
                        <button
                          key={accType}
                          type="button"
                          onClick={() => setMfsAccountType(accType)}
                          className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            mfsAccountType === accType
                              ? 'bg-blue-50 border-blue-400 text-[#006eff] ring-1 ring-blue-500/20'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {accType}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5 text-slate-500 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Payout details are securely encrypted and accessed only by Gaenr Finance for processing your project payments with 0% platform deductions.
                </span>
              </div>
            </section>

            {/* Form Action */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                className="px-8 py-3.5 bg-[#006eff] hover:bg-blue-600 text-white font-bold text-xs rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Submit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};
