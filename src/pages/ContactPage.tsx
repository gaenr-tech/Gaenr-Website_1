import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';

interface SocialChannel {
  name: string;
  handle: string;
  url: string;
  borderHover: string;
  bgHover: string;
  textHover: string;
  icon: React.ReactNode;
}

export const ContactPage: React.FC = () => {
  const { showToast } = useApp();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedWhatsapp, setCopiedWhatsapp] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const handleCopy = (text: string, type: 'email' | 'phone' | 'whatsapp' | 'address') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
      showToast('Official email copied to clipboard', 'info');
    } else if (type === 'phone') {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
      showToast('Phone hotline copied to clipboard', 'info');
    } else if (type === 'whatsapp') {
      setCopiedWhatsapp(true);
      setTimeout(() => setCopiedWhatsapp(false), 2000);
      showToast('WhatsApp number copied to clipboard', 'info');
    } else if (type === 'address') {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
      showToast('Office address copied to clipboard', 'info');
    }
  };

  const SOCIAL_CHANNELS: SocialChannel[] = [
    {
      name: 'Facebook',
      handle: '@gaenrglobal',
      url: 'https://www.facebook.com/gaenrglobal/',
      borderHover: 'group-hover:border-[#1877F2]',
      bgHover: 'group-hover:bg-blue-50/70',
      textHover: 'group-hover:text-[#1877F2]',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24" className="size-5 shrink-0 transition-colors">
          <path fill="currentColor" d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4z" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      handle: 'company/gaenrglobal',
      url: 'https://www.linkedin.com/company/gaenrglobal/',
      borderHover: 'group-hover:border-[#0077B5]',
      bgHover: 'group-hover:bg-sky-50/70',
      textHover: 'group-hover:text-[#0077B5]',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24" className="size-5 shrink-0 transition-colors">
          <path fill="currentColor" d="M18.336 18.339h-2.665v-4.177c0-.996-.02-2.278-1.39-2.278c-1.389 0-1.601 1.084-1.601 2.205v4.25h-2.666V9.75h2.56v1.17h.035c.358-.674 1.228-1.387 2.528-1.387c2.7 0 3.2 1.778 3.2 4.092v4.714M7.004 8.575a1.546 1.546 0 0 1-1.548-1.549a1.548 1.548 0 1 1 1.547 1.549m1.336 9.764H5.667V9.75H8.34zM19.67 3H4.33C3.594 3 3 3.58 3 4.297v15.406C3 20.42 3.594 21 4.328 21h15.339C20.4 21 21 20.42 21 19.703V4.297C21 3.581 20.4 3 19.666 3z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      handle: '@gaenr_global',
      url: 'https://www.instagram.com/gaenr_global/',
      borderHover: 'group-hover:border-[#E1306C]',
      bgHover: 'group-hover:bg-gradient-to-tr group-hover:from-amber-500/10 group-hover:via-rose-500/10 group-hover:to-purple-600/10',
      textHover: 'group-hover:text-[#E1306C]',
      icon: (
        <svg className="size-5 shrink-0 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="contact-ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f09433" />
              <stop offset="25%" stopColor="#e6683c" />
              <stop offset="50%" stopColor="#dc2743" />
              <stop offset="75%" stopColor="#cc2366" />
              <stop offset="100%" stopColor="#bc1888" />
            </linearGradient>
          </defs>
          <path
            className="block group-hover:hidden fill-current"
            d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
          />
          <path
            className="hidden group-hover:block"
            fill="url(#contact-ig-grad)"
            d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
          />
        </svg>
      ),
    },
    {
      name: 'X',
      handle: '@gaenr_global',
      url: 'https://x.com/gaenr_global',
      borderHover: 'group-hover:border-black',
      bgHover: 'group-hover:bg-slate-100',
      textHover: 'group-hover:text-black',
      icon: (
        <svg className="size-5 shrink-0 fill-current transition-colors" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: 'Threads',
      handle: '@gaenr_global',
      url: 'https://www.threads.com/@gaenr_global',
      borderHover: 'group-hover:border-black',
      bgHover: 'group-hover:bg-slate-100',
      textHover: 'group-hover:text-black',
      icon: (
        <svg className="size-5 shrink-0 fill-current transition-colors" viewBox="0 0 24 24">
          <path d="M18.263 11.097c-.03-3.486-1.92-5.586-5.111-5.586-2.13 0-3.922.963-4.863 2.499l2.062 1.438c.535-.843 1.272-1.543 2.628-1.543 1.528 0 2.318.85 2.544 2.431a15 15 0 0 0-2.236-.173c-4.125 0-6.068 1.867-6.068 4.336s1.943 3.99 4.804 3.99c3.139 0 5.013-2.115 5.781-4.735.798.361 1.348 1.204 1.348 2.47 0 3.387-3.907 5.232-7.22 5.232-4.885 0-8.077-3.207-8.077-8.424 0-6.392 4.223-10.487 9.9-10.487 3.808 0 5.69 1.671 6.97 3.914l2.108-1.475C21.44 2.078 18.331 0 13.663 0 6.227 0 1.168 5.277 1.168 12.934c0 7 4.953 11.066 10.856 11.066 4.878 0 9.809-2.846 9.809-7.716 0-2.545-1.46-4.231-3.569-5.187m-6.33 4.855c-1.077 0-2.026-.512-2.026-1.453 0-1.483 1.822-1.934 3.606-1.934.678 0 1.34.045 1.927.173-.422 1.927-1.671 3.215-3.508 3.214Z" />
        </svg>
      ),
    },
    {
      name: 'TikTok',
      handle: '@gaenr_global',
      url: 'https://www.tiktok.com/@gaenr_global',
      borderHover: 'group-hover:border-black',
      bgHover: 'group-hover:bg-slate-100',
      textHover: 'group-hover:text-black',
      icon: (
        <svg className="size-5 shrink-0 fill-current transition-colors" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      ),
    },
    {
      name: 'Pinterest',
      handle: 'gaenr_global',
      url: 'https://www.pinterest.com/gaenr_global/',
      borderHover: 'group-hover:border-[#BD081C]',
      bgHover: 'group-hover:bg-red-50/70',
      textHover: 'group-hover:text-[#BD081C]',
      icon: (
        <svg className="size-5 shrink-0 fill-current transition-colors" viewBox="0 0 24 24">
          <path d="M12 0a12 12 0 0 0-4.37 23.18c-.07-.94-.13-2.39.03-3.42l1.09-4.63s-.28-.56-.28-1.39c0-1.3.75-2.28 1.7-2.28.8 0 1.18.6 1.18 1.32 0 .8-.52 2.01-.78 3.12-.22.94.47 1.7 1.4 1.7 1.68 0 2.97-1.77 2.97-4.33 0-2.26-1.63-3.84-3.95-3.84-2.69 0-4.27 2.02-4.27 4.1 0 .81.31 1.68.7 2.16.08.09.09.18.06.31l-.26 1.07c-.04.18-.15.22-.34.13-1.27-.59-2.07-2.45-2.07-3.95 0-3.21 2.33-6.17 6.74-6.17 3.54 0 6.29 2.52 6.29 5.89 0 3.52-2.22 6.35-5.3 6.35-1.04 0-2.01-.54-2.34-1.18l-.64 2.43c-.23.89-.86 2.01-1.28 2.7A12 12 0 1 0 12 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 antialiased space-y-12 sm:space-y-14 pb-20">
      {/* =========================================================================
          HERO BANNER: Artistic Organic Flowing Aurora & Smooth Waves
          - No lines or grids (clean, fluid, artistic)
          - Exact same size: py-12 sm:py-16
         ========================================================================= */}
      <section className="relative w-full bg-gradient-to-br from-[#0048ba] via-[#006eff] to-[#003d99] py-12 sm:py-16 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        {/* Soft Glowing Ambient Color Clouds */}
        <div className="absolute -top-24 -left-20 w-96 h-96 bg-cyan-400/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-20 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-44 bg-sky-200/15 rounded-full blur-2xl pointer-events-none" />

        {/* Artistic Layered Flowing Waves SVG (No harsh lines, pure organic beauty) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-40 mix-blend-screen"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="artistic-wave-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#818cf8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id="artistic-wave-2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#006eff" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="artistic-wave-3" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path fill="url(#artistic-wave-1)" d="M0,128L60,144C120,160,240,192,360,181.3C480,171,600,117,720,117.3C840,117,960,171,1080,181.3C1200,192,1320,160,1380,144L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
          <path fill="url(#artistic-wave-2)" d="M0,64L48,96C96,128,192,192,288,208C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,181.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          <path fill="url(#artistic-wave-3)" d="M0,224L60,208C120,192,240,160,360,165.3C480,171,600,213,720,202.7C840,192,960,128,1080,112C1200,96,1320,128,1380,144L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
        </svg>

        <article className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-y-3 sm:gap-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Contact Us
          </h1>
          <p className="text-sm sm:text-base text-white/95 font-normal leading-relaxed text-center max-w-xl">
            Reach out directly through any of our official channels or connect across our verified social networks.
          </p>
        </article>
      </section>

      {/* =========================================================================
          PRIMARY DIRECT CHANNELS (Phone, WhatsApp, Email)
         ========================================================================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Phone Support (শুধুমাত্র ফোন নাম্বার - Blue/Slate Style, Direct Mobile Dialer tel: link) */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#006eff] flex items-center justify-center shadow-xs border border-blue-100">
                <Phone className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">Phone Support</h3>
                <span className="inline-block text-lg sm:text-xl font-extrabold text-slate-900 mt-1 transition-colors duration-200 hover:text-[#1d74f5] select-all cursor-default">
                  09647 922 800
                </span>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Direct voice helpline for immediate inquiries and call assistance.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <a
                href="tel:09647922800"
                className="flex-1 py-2.5 px-3 text-center text-xs font-medium text-white bg-[#006eff] hover:bg-[#005cd4] rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Phone className="w-4 h-4" />
                <span>Direct Call</span>
              </a>
              <button
                onClick={() => handleCopy('09647922800', 'phone')}
                title="Copy phone number"
                className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {copiedPhone ? <Check className="w-4 h-4 text-[#006eff]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Card 2: Dedicated WhatsApp Support (WhatsApp Green with number formatted 01608 922 800) */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs border border-emerald-200/60">
                <MessageCircle className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">WhatsApp Support</h3>
                <span className="inline-block text-lg sm:text-xl font-extrabold text-slate-900 mt-1 transition-colors duration-200 hover:text-emerald-600 select-all cursor-default">
                  01608 922 800
                </span>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  For enterprise onboarding, partnerships, direct proposals, freelancing, client services, task scopes, and all operational assistance.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <a
                href="https://wa.me/8801608922800"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-3 text-center text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
              <button
                onClick={() => handleCopy('01608922800', 'whatsapp')}
                title="Copy WhatsApp number"
                className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {copiedWhatsapp ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Card 3: Official Email (Deep Tech Indigo Theme - #4f46e5) */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#4f46e5] flex items-center justify-center shadow-xs border border-indigo-200/80">
                <Mail className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">Official Email</h3>
                <span className="block text-base sm:text-lg font-bold text-slate-900 hover:text-[#4f46e5] mt-1 break-all transition-colors duration-200 no-underline select-all cursor-default">
                  contact@gaenr.com
                </span>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Send your inquiries, briefs, or project documentation directly to our official inbox.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <a
                href="mailto:contact@gaenr.com"
                className="flex-1 py-2.5 px-3 text-center text-xs font-medium text-white bg-[#4f46e5] hover:bg-[#4338ca] rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Mail className="w-4 h-4" />
                <span>Send Email</span>
              </a>
              <button
                onClick={() => handleCopy('contact@gaenr.com', 'email')}
                title="Copy email address"
                className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-[#4f46e5]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          OFFICE LOCATION SECTION WITH LIVE GOOGLE MAPS PREVIEW
          - Positioned directly above Social Media
          - Address: 10/A, 15/13, Mirpur, Dhaka
         ========================================================================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-9 shadow-xs space-y-6">
          <div className="text-center space-y-1.5 max-w-md mx-auto">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Office Location
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Our central operations and management hub in Dhaka, Bangladesh.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left: Address details & copy action */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#006eff] flex items-center justify-center shrink-0 border border-blue-100 shadow-2xs">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Address</p>
                    <p className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                      10/A, 15/13, Mirpur, Dhaka
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1 border-t border-slate-200/60">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>10:00 AM – 10:00 PM (Saturday – Thursday)</span>
                </div>
              </div>

              <div>
                <button
                  onClick={() => handleCopy('10/A, 15/13, Mirpur, Dhaka', 'address')}
                  className="w-full py-2.5 px-4 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-2xs active:scale-95"
                >
                  {copiedAddress ? <Check className="w-4 h-4 text-[#006eff]" /> : <Copy className="w-4 h-4 text-slate-500" />}
                  <span>{copiedAddress ? 'Address Copied to Clipboard' : 'Copy Address'}</span>
                </button>
              </div>
            </div>

            {/* Right: Embedded Interactive Google Map Preview */}
            <div className="lg:col-span-7">
              <div className="w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 relative">
                <iframe
                  title="Mirpur Dhaka Location Map"
                  src="https://maps.google.com/maps?q=10/A,+15/13,+Mirpur,+Dhaka,+Bangladesh&t=m&z=15&output=embed&iwloc=near"
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          OFFICIAL SOCIAL MEDIA NETWORKS
          - Full card boundary hover triggering entire card color change
          - TikTok is pure black
          - Threads uses exact official 24x24 SVG
          - X is named 'X' (no brackets) and pure black
         ========================================================================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-7 sm:p-10 shadow-xs space-y-6">
          <div className="text-center space-y-1.5 max-w-md mx-auto">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Official Social Media
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Follow our verified profiles for updates, community releases, and announcements.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {SOCIAL_CHANNELS.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center justify-between p-4 rounded-2xl border border-slate-200/90 bg-slate-50/60 ${social.bgHover} ${social.borderHover} transition-all duration-200 hover:shadow-xs cursor-pointer`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`text-slate-600 ${social.textHover} transition-colors group-hover:scale-110 duration-200`}>
                    {social.icon}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-bold text-slate-900 ${social.textHover} transition-colors truncate`}>
                      {social.name}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {social.handle}
                    </p>
                  </div>
                </div>

                <ExternalLink className={`w-4 h-4 text-slate-400 ${social.textHover} transition-all group-hover:translate-x-0.5 shrink-0`} />
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
