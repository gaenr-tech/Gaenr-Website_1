import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useBranding } from '../../context/BrandingContext';
import { GaenrLogo } from '../common/GaenrLogo';
import {
  X,
  Download,
  CheckCircle,
  Smartphone,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
  QrCode,
  ArrowRight,
  Info,
  Sparkles,
  MousePointer,
  HelpCircle,
} from 'lucide-react';

export const DownloadAppModal: React.FC = () => {
  const { isDownloadAppOpen, closeDownloadApp, showToast } = useApp();
  const { branding } = useBranding();

  const [downloadState, setDownloadState] = useState<'idle' | 'downloading' | 'completed'>('idle');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'qr'>('android');
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [highlightOpenPulse, setHighlightOpenPulse] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);

  const apkUrl = branding.appDownloadUrl || '/downloads/Gaenr.apk';
  const resolvedFullUrl = typeof window !== 'undefined'
    ? (apkUrl.startsWith('http') ? apkUrl : `${window.location.origin}${apkUrl}`)
    : 'https://gaenr.com/downloads/Gaenr.apk';

  // Detect Mobile device on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userAgent = navigator.userAgent || '';
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isIos = /iPhone|iPad|iPod/i.test(userAgent);
      setIsMobileDevice(isMobile);
      if (isIos) {
        setActiveTab('ios');
      } else if (!isMobile) {
        setActiveTab('android');
      }
    }
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!isDownloadAppOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDownloadApp();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDownloadAppOpen, closeDownloadApp]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isDownloadAppOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setDownloadState('idle');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDownloadAppOpen]);

  // Direct trigger function for downloading Gaenr.apk
  const handleTriggerApkDownload = () => {
    setDownloadState('downloading');
    showToast('Gaenr.apk ডাউনলোড শুরু হয়েছে...', 'info');

    // Trigger direct browser download
    const link = document.createElement('a');
    link.href = apkUrl;
    link.download = 'Gaenr.apk';
    link.setAttribute('type', 'application/vnd.android.package-archive');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // After 2.5s simulated network finish, switch to completed & highlight "Open" button
    setTimeout(() => {
      setDownloadState('completed');
      setHighlightOpenPulse(true);
      showToast('ডাউনলোড সম্পন্ন! ব্রাউজারের "Open" বাটনে চাপ দিয়ে ১-ট্যাপে ইনস্টল করুন।', 'success');
    }, 2400);
  };

  // Copy shareable download URL to clipboard
  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(resolvedFullUrl);
      setCopied(true);
      showToast('অ্যাপ ডাউনলোড লিংক কপি করা হয়েছে!', 'success');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!isDownloadAppOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity"
        onClick={closeDownloadApp}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        ref={modalRef}
        className="relative w-full max-w-xl bg-white dark:bg-[#0c162d] rounded-3xl shadow-2xl border border-slate-200/90 dark:border-blue-500/25 overflow-hidden flex flex-col z-10 transition-colors my-auto"
      >
        {/* Header Bar */}
        <div className="px-5 py-4 sm:px-6 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white flex items-center justify-between shrink-0 shadow-sm relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20 shadow-inner">
              {branding.logoUrl && branding.logoUrl !== '/logo.svg' ? (
                <img src={branding.logoUrl} alt="Gaenr" className="w-6 h-6 object-contain" />
              ) : (
                <GaenrLogo size={24} />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold leading-tight tracking-tight">
                  Gaenr Official App
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-300/30 text-emerald-300 text-[10px] font-semibold tracking-wide">
                  Android APK
                </span>
              </div>
              <p className="text-xs text-blue-100/90 font-normal mt-0.5">
                সরাসরি ওয়েবসাইট থেকে ডাউনলোড ও ১-ট্যাপে ইনস্টল করুন
              </p>
            </div>
          </div>

          <button
            onClick={closeDownloadApp}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close download modal"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Tab Navigation (Android APK, iPhone Guide, QR Code) */}
        <div className="flex items-center border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50 px-5 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('android')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'android'
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Android (APK)</span>
          </button>

          <button
            onClick={() => setActiveTab('qr')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'qr'
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>QR Code (মোবাইলে নিন)</span>
          </button>

          <button
            onClick={() => setActiveTab('ios')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ios'
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <span>iPhone (iOS)</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto max-h-[72vh] space-y-5 text-slate-800 dark:text-slate-200">
          {activeTab === 'android' && (
            <>
              {/* Main Action Banner */}
              <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-slate-900 border border-blue-200/80 dark:border-blue-800/40 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 w-full sm:w-auto">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <Download className={`w-6 h-6 ${downloadState === 'downloading' ? 'animate-bounce' : ''}`} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                      Gaenr Official Android App
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      ভার্সন ১.০.০ • সাইজ: হালকা ও সুপার ফাস্ট • নো অ্যাড
                    </p>
                    <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>ভাইরাস ও ম্যালওয়্যার মুক্ত ভেরিফায়েড প্যাকেজ</span>
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-auto shrink-0">
                  <button
                    onClick={handleTriggerApkDownload}
                    disabled={downloadState === 'downloading'}
                    className="w-full sm:w-auto gaenr-btn-primary !min-h-[44px] !h-[44px] !px-6 !text-sm !font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {downloadState === 'downloading' ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>ডাউনলোড হচ্ছে...</span>
                      </>
                    ) : downloadState === 'completed' ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-white" />
                        <span>আবার ডাউনলোড করুন</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 text-white" />
                        <span>Download APK Now</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Real-time Browser Download Helper / Highlight Section */}
              <div className="bg-slate-50 dark:bg-slate-900/80 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>১-ট্যাপে ইনস্টল করার সহজ নিয়ম</span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    ফাইল ম্যানেজারে খোঁজার দরকার নেই
                  </span>
                </div>

                {/* 3 Step Interactive Visual Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Step 1 */}
                  <div className="bg-white dark:bg-slate-800/90 rounded-xl p-3.5 border border-slate-200/90 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs font-bold mb-2">
                        ১
                      </span>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                        ডাউনলোড শুরু হবে
                      </h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        বাটনে চাপার পর কয়েক সেকেন্ডের মধ্যে ফাইলটি ডাউনলোড হবে। ব্রাউজার সতর্কবার্তা দিলে "Download anyway" চাপুন।
                      </p>
                    </div>
                  </div>

                  {/* Step 2 - The Critical "Open" step */}
                  <div className="bg-gradient-to-b from-blue-50/90 to-blue-100/40 dark:from-blue-900/30 dark:to-slate-800 rounded-xl p-3.5 border-2 border-blue-500/80 dark:border-blue-400/80 shadow-sm flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">
                      গুরুত্বপূর্ণ
                    </div>
                    <div>
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold mb-2 shadow-xs">
                        ২
                      </span>
                      <h5 className="text-xs font-bold text-blue-700 dark:text-blue-300 mb-1 flex items-center gap-1">
                        <span>"Open" এ ট্যাপ করুন</span>
                        <MousePointer className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-pulse" />
                      </h5>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                        ডাউনলোড শেষ হলেই ব্রাউজারের নিচে বা নোটিফিকেশনে আসা <strong className="text-blue-700 dark:text-blue-300 font-bold underline">"Open"</strong> বা <strong className="text-blue-700 dark:text-blue-300 font-bold underline">"খুলুন"</strong> অপশনে এক ট্যাপ করুন।
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="bg-white dark:bg-slate-800/90 rounded-xl p-3.5 border border-slate-200/90 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
                        ৩
                      </span>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                        ইনস্টলেশন উইন্ডো
                      </h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        সরাসরি ফোনের ইনস্টল স্ক্রিন আসবে। শুধু <strong className="text-slate-900 dark:text-white font-semibold">"Install"</strong> চাপলেই অ্যাপটি মোবাইলের হোম স্ক্রিনে যুক্ত হয়ে যাবে।
                      </p>
                    </div>
                  </div>
                </div>

                {/* Simulated Android Notification Mockup showing the user exactly what to look for */}
                <div className="bg-slate-900 text-white rounded-xl p-3.5 border border-slate-700 shadow-md flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                      <Download className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 text-left">
                      <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                        <span>Gaenr.apk</span>
                        <span className="text-[10px] text-emerald-400 font-semibold">• Download complete</span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate">
                        ব্রাউজারের নোটিফিকেশনে ডানদিকের Open বাটনে চাপুন
                      </p>
                    </div>
                  </div>

                  {/* Glowing Open Button simulation */}
                  <div className="relative shrink-0">
                    <button
                      onClick={handleTriggerApkDownload}
                      className={`px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1 cursor-pointer ${
                        highlightOpenPulse ? 'ring-4 ring-blue-400/50 scale-105' : ''
                      }`}
                    >
                      <span>OPEN</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    {highlightOpenPulse && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Permission / Settings Helper */}
                <div className="flex items-start gap-2.5 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 p-3 rounded-xl border border-amber-200 dark:border-amber-800/40 text-[11px] leading-relaxed">
                  <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold">টিপস (যদি ফোন পারমিশন চায়):</strong> প্রথমবার সাধারণ ব্রাউজার থেকে APK ইনস্টলের সময় ফোন <em>"Settings &gt; Allow from this source"</em> চাইতে পারে। জাস্ট সেটিংস অপশনে গিয়ে সুইচটি অন করে দিলেই ইনস্টলেশন শুরু হয়ে যাবে।
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'qr' && (
            <div className="text-center py-4 space-y-4">
              <div className="inline-block p-4 bg-white rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-md">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(resolvedFullUrl)}`}
                  alt="Gaenr App QR Code"
                  className="w-44 h-44 object-contain mx-auto"
                />
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  মোবাইল ক্যামেরা দিয়ে স্ক্যান করুন
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
                  আপনার মোবাইল ফোনের ক্যামেরা বা কিউআর কোড স্ক্যানার দিয়ে স্ক্যান করলে সরাসরি ফোনে Gaenr.apk ডাউনলোড হয়ে যাবে।
                </p>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={handleCopyLink}
                  className="gaenr-btn-secondary !min-h-[38px] !h-[38px] !px-4 !text-xs !font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'লিংক কপি হয়েছে!' : 'ডাউনলোড লিংক কপি করুন'}</span>
                </button>

                <button
                  onClick={handleTriggerApkDownload}
                  className="gaenr-btn-primary !min-h-[38px] !h-[38px] !px-4 !text-xs !font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>পিসিতে নামিয়ে রাখুন</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'ios' && (
            <div className="py-3 space-y-4">
              <div className="bg-blue-50 dark:bg-blue-950/40 rounded-2xl p-4 border border-blue-200 dark:border-blue-900/50 flex items-start gap-3">
                <Smartphone className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                    আইফোন ব্যবহারকারীদের জন্য ইনস্টলেশন
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300">
                    অ্যাপলের সিকিউরিটি নিয়মের কারণে আইফোনে সরাসরি APK চালানো যায় না। তবে আপনি কোনো অ্যাপ স্টোর ছাড়াই Safari ব্রাউজার দিয়ে Gaenr-কে ১-ট্যাপে সরাসরি হোম স্ক্রিনে ফুল অ্যাপ হিসেবে যুক্ত করতে পারেন।
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    ১
                  </span>
                  <div className="text-xs">
                    <strong className="text-slate-900 dark:text-white font-semibold block mb-0.5">
                      Safari ব্রাউজারে খুলুন
                    </strong>
                    <span className="text-slate-500 dark:text-slate-400">
                      আইফোনের Safari ব্রাউজারে <strong>gaenr.com</strong> ওয়েবসাইটে প্রবেশ করুন।
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    ২
                  </span>
                  <div className="text-xs">
                    <strong className="text-slate-900 dark:text-white font-semibold block mb-0.5">
                      Share আইকনে চাপুন
                    </strong>
                    <span className="text-slate-500 dark:text-slate-400">
                      Safari-র নিচে থাকা Share আইকন (তীর চিহ্নিত বক্স) টি চাপুন।
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    ৩
                  </span>
                  <div className="text-xs">
                    <strong className="text-slate-900 dark:text-white font-semibold block mb-0.5">
                      "Add to Home Screen" নির্বাচন করুন
                    </strong>
                    <span className="text-slate-500 dark:text-slate-400">
                      অপশনগুলো থেকে <strong>"Add to Home Screen"</strong> চাপুন। Gaenr অ্যাপ আপনার আইফোনের স্ক্রিনে সেভ হয়ে যাবে!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info & re-download link */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            <span>অফিসিয়াল ডিরেক্ট বিল্ড (Gaenr Tech)</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleTriggerApkDownload}
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
            >
              ডাউনলোড না হলে এখানে ক্লিক করুন
            </button>
            <span>•</span>
            <button
              onClick={closeDownloadApp}
              className="text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium cursor-pointer"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
