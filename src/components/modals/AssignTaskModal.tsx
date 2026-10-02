import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useBranding } from '../../context/BrandingContext';
import { SERVICE_CATEGORIES } from '../../data/mockData';
import { ServiceSlug } from '../../types';
import {
  X,
  CheckCircle,
  ShieldCheck,
  ArrowRight,
  MessageCircle,
  ExternalLink,
  Paperclip,
  Link as LinkIcon,
} from 'lucide-react';
import { CustomSelect } from '../common/CustomSelect';

export const AssignTaskModal: React.FC = () => {
  const {
    isAssignTaskOpen,
    closeAssignTask,
    preselectedExpert,
    preselectedCategory,
    freelancers,
    submitTaskAssignment,
    showToast,
    navigate,
  } = useApp();
  const { branding } = useBranding();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [preferredChannel, setPreferredChannel] = useState<'WhatsApp' | 'Email' | 'Telegram'>('WhatsApp');
  const [category, setCategory] = useState<ServiceSlug>('graphics-design');
  const [subCategory, setSubCategory] = useState('');
  const [expertCode, setExpertCode] = useState('match_recommended');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const [agreedAccuracy, setAgreedAccuracy] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);

  const [submittedTask, setSubmittedTask] = useState<{
    id: string;
    status: string;
    whatsappUrl?: string;
    documentUrl?: string;
  } | null>(null);

  // Sync preselection
  useEffect(() => {
    if (preselectedCategory) {
      setCategory(preselectedCategory);
    }
    if (preselectedExpert) {
      setExpertCode(preselectedExpert);
    } else {
      setExpertCode('match_recommended');
    }
    setSubmittedTask(null);
  }, [preselectedCategory, preselectedExpert, isAssignTaskOpen]);

  // Current category's subservices
  const currentCategoryData = SERVICE_CATEGORIES.find((c) => c.slug === category);

  useEffect(() => {
    if (currentCategoryData && currentCategoryData.subServices.length > 0) {
      setSubCategory(currentCategoryData.subServices[0]);
    }
  }, [category, currentCategoryData]);

  if (!isAssignTaskOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !whatsapp.trim() || !description.trim()) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    if (!agreedAccuracy || !agreedTerms) {
      showToast('Please agree to the accuracy confirmation and platform policies.', 'error');
      return;
    }

    const task = submitTaskAssignment({
      fullName,
      email,
      whatsapp,
      preferredChannel,
      category,
      subCategory: subCategory || (currentCategoryData?.subServices[0] ?? 'General'),
      expertCode: expertCode === 'match_recommended' ? 'Gaenr Verified Match' : expertCode,
      deadline: deadline || 'Flexible (3-5 Days)',
      description,
      documentUrl: documentUrl.trim() || undefined,
      agreedAccuracy,
      agreedTerms,
    });

    const categoryTitle = currentCategoryData?.title || category;
    const resolvedExpert = expertCode === 'match_recommended' ? 'Gaenr Verified Match (Auto Assignment)' : expertCode;
    const resolvedDeadline = deadline.trim() || 'Flexible (3-5 Days)';
    const resolvedSubCategory = subCategory || (currentCategoryData?.subServices[0] ?? 'General');

    const greeting = `Hey GAENR, this is *${fullName.trim()}*! I would like to initiate and assign a project task with the following details:`;

    const taskRef = `*Task Reference ID:* ${task.id}`;

    const clientBlock = `*Client Information:*
- *Full Name:* ${fullName.trim()}
- *Email:* ${email.trim()}
- *WhatsApp Number:* ${whatsapp.trim()}`;

    const scopeBlock = `*Project Scope:*
- *Service Category:* ${categoryTitle}
- *Sub-Service / Deliverable:* ${resolvedSubCategory}
- *Assigned Expert:* ${resolvedExpert}
- *Target Deadline:* ${resolvedDeadline}`;

    const briefBlock = `*Project Brief & Requirements:*
${description.trim()}`;

    // Project Document / Asset Link block
    let docBlock = '';
    if (documentUrl.trim()) {
      docBlock = `*Project Document / Asset Link:*
- Link: ${documentUrl.trim()}`;
    }

    const confirmBlock = `*Client Confirmation:* Confirmed scope accuracy and agreed to GAENR escrow protection policies.`;

    const messageBlocks = [greeting, taskRef, clientBlock, scopeBlock, briefBlock];
    if (docBlock) {
      messageBlocks.push(docBlock);
    }
    messageBlocks.push(confirmBlock);

    const whatsappMessage = messageBlocks.join('\n\n');
    const whatsappUrl = `https://wa.me/8801608922800?text=${encodeURIComponent(whatsappMessage)}`;

    setSubmittedTask({
      id: task.id,
      status: 'pending_review',
      whatsappUrl,
      documentUrl: documentUrl.trim() || undefined,
    });

    // Clear all inputs so fields are fresh and empty
    setFullName('');
    setEmail('');
    setWhatsapp('');
    setDescription('');
    setDeadline('');
    setDocumentUrl('');
    setAgreedAccuracy(false);
    setAgreedTerms(false);

    try {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.warn('Could not auto-open WhatsApp tab:', err);
    }

    showToast('Task submitted! Opening GAENR Official WhatsApp...', 'success');
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAssignTask();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="assign-task-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl sm:max-w-2xl md:max-w-3xl my-auto max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 relative bg-slate-50/70 text-center shrink-0">
          <h2 id="assign-task-title" className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            Assign Task
          </h2>
          <button
            onClick={closeAssignTask}
            className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedTask ? (
          /* Confirmation Success State - Responsive & Clear WhatsApp Steps */
          <div className="px-4 sm:px-6 md:px-8 py-5 sm:py-7 text-center space-y-4 sm:space-y-5 overflow-y-auto flex-1">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200 shrink-0">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Task Assigned Successfully!
              </h3>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-xs text-slate-700">
                <span>Task Reference ID:</span>
                <span className="font-mono font-bold text-[#006eff]">{submittedTask.id}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto pt-1 leading-relaxed">
                Your task requirements are prepared. <strong>Send the pre-filled message directly on GAENR Official WhatsApp</strong> so operations can immediately begin execution.
              </p>
            </div>

            {submittedTask.documentUrl && (
              <div className="flex items-center justify-between gap-3 p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl text-left max-w-xl mx-auto text-xs text-emerald-950">
                <div className="flex items-center gap-2 truncate">
                  <LinkIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">
                    Asset Link: <strong className="font-mono">{submittedTask.documentUrl}</strong>
                  </span>
                </div>
                <span className="shrink-0 text-[10px] sm:text-[11px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                  Included in Message
                </span>
              </div>
            )}

            {submittedTask.whatsappUrl && (
              <div className="p-4 sm:p-5 bg-emerald-50/90 border border-emerald-200 rounded-2xl max-w-xl mx-auto space-y-3 text-center shadow-xs">
                <div className="flex items-center justify-center gap-2 text-emerald-900 font-bold text-xs sm:text-sm">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
                  <span>GAENR Official WhatsApp Desk (+880 1608 922 800)</span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed max-w-md mx-auto">
                  Your complete task brief and document details are typed and ready in the chat box. Click below to send:
                </p>
                <a
                  href={submittedTask.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer w-full active:scale-98"
                >
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Open &amp; Send on WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* Simplified 3-Step Guide */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 text-left space-y-2.5 max-w-xl mx-auto">
              <h4 className="text-xs font-bold uppercase text-slate-600 tracking-wider">
                Quick Sending Steps
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-[#006eff] flex items-center justify-center text-[11px] font-mono font-bold">1</span>
                    <span>Open WhatsApp</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Tap the button above or switch to your opened WhatsApp tab.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-[#006eff] flex items-center justify-center text-[11px] font-mono font-bold">2</span>
                    <span>Review Details</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Your Task ID, scope, and document details are pre-filled.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[11px] font-mono font-bold">3</span>
                    <span>Press Send</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Hit Send in WhatsApp to initiate your task with GAENR.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center pt-1">
              <button
                onClick={closeAssignTask}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                Back to Site
              </button>
            </div>
          </div>
        ) : (
          /* Form Body */
          <form onSubmit={handleSubmit} className="px-4 sm:px-8 md:px-12 py-6 sm:py-7 space-y-5 overflow-y-auto flex-1">
            {/* Client Info Grid (3 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fahim Rahman"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. fahim@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  WhatsApp Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="017** *** ***"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900"
                />
              </div>
            </div>

            {/* Service & Subcategory Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Task Category <span className="text-red-500">*</span>
                </label>
                <CustomSelect
                  value={category}
                  onChange={(val) => setCategory(val as ServiceSlug)}
                  options={SERVICE_CATEGORIES.map((cat) => ({
                    value: cat.slug,
                    label: cat.title,
                  }))}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subcategory
                </label>
                <CustomSelect
                  value={subCategory}
                  onChange={(val) => setSubCategory(val)}
                  options={
                    currentCategoryData?.subServices.map((sub) => ({
                      value: sub,
                      label: sub,
                    })) || []
                  }
                />
              </div>
            </div>

            {/* Expert selection and Deadline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Expert
                </label>
                <CustomSelect
                  value={expertCode}
                  onChange={(val) => setExpertCode(val)}
                  options={[
                    {
                      value: 'match_recommended',
                      label: 'Gaenr Smart Match',
                      badge: 'Fastest Available',
                      badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
                    },
                    ...freelancers
                      .filter((fl) => fl.isPublic)
                      .map((fl) => ({
                        value: fl.code,
                        label: `${fl.code} — ${fl.categoryTitle}`,
                        badge: `${fl.rating > 0 ? fl.rating.toFixed(1) : '0.0'}★`,
                      })),
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deadline / Expected Delivery
                </label>
                <input
                  type="text"
                  placeholder="e.g. Within 3 days / Oct 15"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Task Description &amp; Detailed Requirements <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="Please describe your task clearly. Include goals, scope, format, references, and any specific instructions..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 leading-relaxed"
              />
            </div>

            {/* Project Document / Asset Link (Optional) */}
            <div className="space-y-1.5 p-4 bg-slate-50/80 border border-slate-200 rounded-xl">
              <label className="block text-xs font-bold text-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Project Document / Asset Link (Optional)</span>
                </span>
                <span className="text-[11px] text-slate-400 font-normal">Drive, Figma, Dropbox, OneDrive</span>
              </label>
              <div className="relative">
                <input
                  type="url"
                  placeholder="Paste Google Drive, Dropbox, Figma, OneDrive or file link..."
                  value={documentUrl}
                  onChange={(e) => setDocumentUrl(e.target.value)}
                  className="w-full pl-8 pr-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 placeholder:text-slate-400 font-mono"
                />
                <LinkIcon className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5 sm:top-3 pointer-events-none" />
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Provide a shareable cloud link to your requirements, designs, or files. This link will be automatically attached directly into your WhatsApp message.
              </p>
            </div>

            {/* Checkboxes */}
            <div className="space-y-2.5 pt-2">
              <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedAccuracy}
                  onChange={(e) => setAgreedAccuracy(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span>I confirm that the information provided is accurate and complete.</span>
              </label>

              <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span>
                  I agree to Gaenr’s{' '}
                  <button
                    type="button"
                    onClick={() => {
                      closeAssignTask();
                      navigate('/terms');
                    }}
                    className="text-emerald-600 underline font-medium cursor-pointer"
                  >
                    Terms &amp; Conditions
                  </button>
                  ,{' '}
                  <button
                    type="button"
                    onClick={() => {
                      closeAssignTask();
                      navigate('/privacy-policy');
                    }}
                    className="text-emerald-600 underline font-medium cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                  , and{' '}
                  <button
                    type="button"
                    onClick={() => {
                      closeAssignTask();
                      navigate('/return-policy');
                    }}
                    className="text-emerald-600 underline font-medium cursor-pointer"
                  >
                    Return Policy
                  </button>
                  .
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeAssignTask}
                className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-emerald-500/25 flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white/20" />
                <span>Assign Task via WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
