import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useBranding } from '../../context/BrandingContext';
import { GaenrLogo } from '../common/GaenrLogo';
import {
  X,
  CheckCircle2,
  Send,
  User,
  Mail,
  Phone,
  Briefcase,
  FolderGit2,
  ChevronDown,
  MapPin,
  Award,
  Clock,
  Users,
  Check,
} from 'lucide-react';
import { sendApplicantReceivedEmail } from '../../utils/email';

export const ApplyExpertModal: React.FC = () => {
  const { isApplyExpertOpen, closeApplyExpert, showToast, submitExpertApplication } = useApp();
  const { branding } = useBranding();

  // Form Fields State
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('Male / পুরুষ');
  const [occupation, setOccupation] = useState('Student / শিক্ষার্থী');
  const [otherOccupation, setOtherOccupation] = useState('');
  const [address, setAddress] = useState('Dhaka / ঢাকা');
  const [otherAddress, setOtherAddress] = useState('');
  const [skill, setSkill] = useState('Graphics Design / গ্রাফিক ডিজাইন');
  const [otherSkill, setOtherSkill] = useState('');
  const [experience, setExperience] = useState('1–2 years / ১–২ বছর');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Active open dropdown tracker ('gender' | 'occupation' | 'address' | 'skill' | 'experience' | null)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    if (activeDropdown) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [activeDropdown]);

  if (!isApplyExpertOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !whatsapp.trim() || !email.trim() || !portfolioUrl.trim()) {
      showToast('Please complete all required fields.', 'error');
      return;
    }
    if (occupation === 'Other / অন্যান্য' && !otherOccupation.trim()) {
      showToast('Please specify your occupation.', 'error');
      return;
    }
    if (address === 'Other / অন্যান্য' && !otherAddress.trim()) {
      showToast('Please specify your city or district.', 'error');
      return;
    }
    if (skill === 'Other / অন্যান্য' && !otherSkill.trim()) {
      showToast('Please specify your primary skill.', 'error');
      return;
    }

    submitExpertApplication({
      fullName: fullName.trim(),
      whatsapp: whatsapp.trim(),
      email: email.trim(),
      gender,
      occupation,
      otherOccupation: otherOccupation.trim() || undefined,
      address,
      otherAddress: otherAddress.trim() || undefined,
      skill,
      otherSkill: otherSkill.trim() || undefined,
      experience,
      portfolioUrl: portfolioUrl.trim(),
    });

    sendApplicantReceivedEmail({
      fullName: fullName.trim(),
      email: email.trim(),
      skill: otherSkill.trim() || skill,
      whatsapp: whatsapp.trim(),
    }).catch((err) => {
      console.warn('Applicant received email note:', err);
    });

    setIsSubmitted(true);
    showToast('Application received! Gaenr vetting team will review your portfolio.', 'success');
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setFullName('');
    setWhatsapp('');
    setEmail('');
    setGender('Male / পুরুষ');
    setOccupation('Student / শিক্ষার্থী');
    setOtherOccupation('');
    setAddress('Dhaka / ঢাকা');
    setOtherAddress('');
    setSkill('Graphics Design / গ্রাফিক ডিজাইন');
    setOtherSkill('');
    setExperience('1–2 years / ১–২ বছর');
    setPortfolioUrl('');
    setActiveDropdown(null);
    closeApplyExpert();
  };

  const genderOptions = [
    'Male / পুরুষ',
    'Female / নারী',
    'Third Gender / তৃতীয় লিঙ্গ',
  ];

  const occupationOptions = [
    'Student / শিক্ষার্থী',
    'Employed / চাকুরিজীবী',
    'Self-employed / ফ্রিল্যান্সার বা আত্মকর্মসংস্থান',
    'Unemployed / বেকার বা কর্মপ্রত্যাশী',
    'Retired / অবসরপ্রাপ্ত',
    'Other / অন্যান্য',
  ];

  const addressOptions = [
    'Dhaka / ঢাকা',
    'Chattogram / চট্টগ্রাম',
    'Khulna / খুলনা',
    'Barishal / বরিশাল',
    'Mymensingh / ময়মনসিংহ',
    'Rajshahi / রাজশাহী',
    'Rangpur / রংপুর',
    'Sylhet / সিলেট',
    'Other / অন্যান্য',
  ];

  const skillOptions = [
    'Graphics Design / গ্রাফিক ডিজাইন',
    'Content Writing / কনটেন্ট রাইটিং',
    'Video Editing / ভিডিও এডিটিং',
    'WordPress Website Design / ওয়ার্ডপ্রেস ওয়েবসাইট ডিজাইন',
    'Presentation Design / প্রেজেন্টেশন ডিজাইন',
    'UX/UI Design / ইউএক্স/ইউআই ডিজাইন',
    'Ads Running (Performance Marketing) / অ্যাডস ক্যাম্পেইন ও পারফরম্যান্স মার্কেটিং',
    'Other / অন্যান্য',
  ];

  const experienceOptions = [
    'Less than 1 year / ১ বছরের কম',
    '1–2 years / ১–২ বছর',
    '2–5 years / ২–৫ বছর',
    '5+ years / ৫ বছরের বেশি',
  ];

  // Helper for rendering custom styled dropdown menu with vibrant colors & active indicator
  const renderCustomDropdown = (
    id: string,
    currentValue: string,
    options: string[],
    onSelect: (val: string) => void,
    IconComponent: React.FC<{ className?: string }>
  ) => {
    const isOpen = activeDropdown === id;

    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setActiveDropdown(isOpen ? null : id)}
          className={`w-full pl-10 pr-9 py-3 text-xs sm:text-sm bg-white border rounded-xl text-left flex items-center justify-between transition-all cursor-pointer ${
            isOpen
              ? 'border-[#006eff] ring-4 ring-blue-500/10 shadow-xs'
              : 'border-slate-200/90 hover:border-slate-300'
          }`}
        >
          <IconComponent className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <span className="truncate font-medium text-slate-800">{currentValue}</span>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
              isOpen ? 'rotate-180 text-[#006eff]' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white/98 backdrop-blur-md border border-slate-200 shadow-2xl rounded-2xl p-1.5 max-h-56 overflow-y-auto space-y-1 animate-in fade-in zoom-in-95 duration-150">
            {options.map((opt) => {
              const isSelected = currentValue === opt;
              return (
                <div
                  key={opt}
                  onClick={() => {
                    onSelect(opt);
                    setActiveDropdown(null);
                  }}
                  className={`px-3 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50/90 text-[#006eff] font-bold border border-blue-100 shadow-2xs'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
                  }`}
                >
                  <span className="truncate">{opt}</span>
                  {isSelected && <Check className="w-4 h-4 text-[#006eff] shrink-0 ml-2" />}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleResetAndClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="apply-expert-title"
    >
      <div
        ref={formRef}
        className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-2xl my-4 sm:my-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header: Centered GAENR Logo & Apply as Expert */}
        <div className="relative px-6 py-6 border-b border-slate-100 bg-slate-50/70 text-center flex flex-col items-center justify-center">
          <button
            onClick={handleResetAndClose}
            className="absolute top-5 right-5 w-8 h-8 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col items-center justify-center gap-2">
            <GaenrLogo size={36} />
            <h2 id="apply-expert-title" className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Apply as Expert
            </h2>
          </div>
        </div>

        {isSubmitted ? (
          <div className="p-8 sm:p-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200 shadow-xs animate-in zoom-in-95 duration-200">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900">Application Submitted!</h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you, <span className="font-semibold text-slate-900">{fullName}</span>. Our vetting team will review your proof-of-work submission within 48 hours. If approved, you will receive an expert ID code and your profile will be created in the showcase directory.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={handleResetAndClose}
                className="px-8 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-xs hover:shadow-md transition-all cursor-pointer"
                style={{ backgroundColor: branding.primaryColor }}
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 sm:space-y-7 max-h-[78vh] overflow-y-auto">
            
            {/* Section 1: Personal & Contact Information */}
            <div className="space-y-5">
              {/* Row 1: Full Name & WhatsApp Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-[13px] font-bold text-slate-800">
                    Full Name / আপনার পুরো নাম <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Shakib Ahmed"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-3 text-xs sm:text-sm bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:border-[#006eff] focus:ring-4 focus:ring-blue-500/10 text-slate-900 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* WhatsApp Number */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-[13px] font-bold text-slate-800">
                    WhatsApp Number / হোয়াটসঅ্যাপ নম্বর <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 017** *** ***"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-3 text-xs sm:text-sm bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:border-[#006eff] focus:ring-4 focus:ring-blue-500/10 text-slate-900 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Email Address & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {/* Email Address */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-[13px] font-bold text-slate-800">
                    Email Address / ইমেইল অ্যাড্রেস <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. shakib@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-3 text-xs sm:text-sm bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:border-[#006eff] focus:ring-4 focus:ring-blue-500/10 text-slate-900 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-[13px] font-bold text-slate-800">
                    Gender / লিঙ্গ <span className="text-rose-500">*</span>
                  </label>
                  {renderCustomDropdown('gender', gender, genderOptions, setGender, Users)}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100" />

            {/* Section 2: Professional Background & Location */}
            <div className="space-y-5">
              {/* Row 3: Occupation & Present Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {/* Occupation */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-[13px] font-bold text-slate-800">
                    Occupation / পেশাগত অবস্থা <span className="text-rose-500">*</span>
                  </label>
                  {renderCustomDropdown('occupation', occupation, occupationOptions, setOccupation, Briefcase)}

                  {/* Dynamic Other Occupation input */}
                  {occupation === 'Other / অন্যান্য' && (
                    <div className="pt-1.5 animate-in fade-in duration-200">
                      <input
                        type="text"
                        required
                        placeholder="Specify occupation / আপনার পেশা লিখুন"
                        value={otherOccupation}
                        onChange={(e) => setOtherOccupation(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#006eff] rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 text-slate-900 transition-all placeholder:text-slate-400"
                      />
                    </div>
                  )}
                </div>

                {/* Present Address */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-[13px] font-bold text-slate-800">
                    Present Address / বর্তমান ঠিকানা <span className="text-rose-500">*</span>
                  </label>
                  {renderCustomDropdown('address', address, addressOptions, setAddress, MapPin)}

                  {/* Dynamic Other Address input */}
                  {address === 'Other / অন্যান্য' && (
                    <div className="pt-1.5 animate-in fade-in duration-200">
                      <input
                        type="text"
                        required
                        placeholder="Specify city or district / জেলা বা শহরের নাম লিখুন"
                        value={otherAddress}
                        onChange={(e) => setOtherAddress(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#006eff] rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 text-slate-900 transition-all placeholder:text-slate-400"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Row 4: Skills & Practical Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {/* Skills & Experience */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-[13px] font-bold text-slate-800">
                    Skills &amp; Experience / স্কিল ও কাজের অভিজ্ঞতা <span className="text-rose-500">*</span>
                  </label>
                  {renderCustomDropdown('skill', skill, skillOptions, setSkill, Award)}

                  {/* Dynamic Other Skill input */}
                  {skill === 'Other / অন্যান্য' && (
                    <div className="pt-1.5 animate-in fade-in duration-200">
                      <input
                        type="text"
                        required
                        placeholder="Specify primary skill / আপনার প্রধান স্কিল লিখুন"
                        value={otherSkill}
                        onChange={(e) => setOtherSkill(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#006eff] rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 text-slate-900 transition-all placeholder:text-slate-400"
                      />
                    </div>
                  )}
                </div>

                {/* Practical Experience */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-[13px] font-bold text-slate-800">
                    Practical Experience / আপনার প্র্যাকটিক্যাল অভিজ্ঞতা <span className="text-rose-500">*</span>
                  </label>
                  {renderCustomDropdown('experience', experience, experienceOptions, setExperience, Clock)}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100" />

            {/* Section 3: Portfolio & Proof of Work */}
            <div className="space-y-2">
              <label className="block text-xs sm:text-[13px] font-bold text-slate-800 leading-snug">
                Link to your Previous Work / Portfolio (Google Drive / Behance / Website Link) / আপনার সেরা কাজের পোর্টফোলিও লিংক দিন <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <FolderGit2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="url"
                  required
                  placeholder="https://behance.net/profile or Google Drive folder / website link"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-3 text-xs sm:text-sm bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:border-[#006eff] focus:ring-4 focus:ring-blue-500/10 text-slate-900 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Form Footer Actions (Strictly English) */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3.5">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-7 py-2.5 rounded-xl bg-[#006eff] hover:bg-[#0055d4] text-white font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-2 active:scale-95"
              >
                <span>Submit Application</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
