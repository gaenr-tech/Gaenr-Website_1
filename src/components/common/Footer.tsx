import React from 'react';
import { useApp } from '../../context/AppContext';
import { useBranding } from '../../context/BrandingContext';
import { Phone, Mail } from 'lucide-react';
import { GaenrLogo } from './GaenrLogo';

export const Footer: React.FC = () => {
  const { navigate, currentRoute } = useApp();
  const { branding } = useBranding();

  return (
    <footer
      className="text-slate-300 pt-12 pb-4 border-t border-slate-850 shadow-2xl relative transition-colors duration-300"
      style={{
        backgroundColor: branding.footerBgColor || '#0c182c',
        color: branding.footerTextColor || undefined,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-8 border-b border-slate-800/80">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center shrink-0">
                {branding.logoUrl && branding.logoUrl !== '/logo.svg' ? (
                  <img src={branding.logoUrl} alt={branding.siteTitle} className="w-8 h-8 object-contain" />
                ) : (
                  <GaenrLogo size={32} />
                )}
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                {branding.siteTitle}
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              {branding.footerTagline}
            </p>

            {/* Social Icons with Official Handles */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/gaenrglobal/"
                target="_blank"
                rel="noreferrer"
                aria-label="Gaenr Facebook"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#1877F2] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/gaenrglobal/"
                target="_blank"
                rel="noreferrer"
                aria-label="Gaenr LinkedIn"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#0077B5] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M18.336 18.339h-2.665v-4.177c0-.996-.02-2.278-1.39-2.278c-1.389 0-1.601 1.084-1.601 2.205v4.25h-2.666V9.75h2.56v1.17h.035c.358-.674 1.228-1.387 2.528-1.387c2.7 0 3.2 1.778 3.2 4.092v4.714M7.004 8.575a1.546 1.546 0 0 1-1.548-1.549a1.548 1.548 0 1 1 1.547 1.549m1.336 9.764H5.667V9.75H8.34zM19.67 3H4.33C3.594 3 3 3.58 3 4.297v15.406C3 20.42 3.594 21 4.328 21h15.339C20.4 21 21 20.42 21 19.703V4.297C21 3.581 20.4 3 19.666 3z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/gaenr_global/"
                target="_blank"
                rel="noreferrer"
                aria-label="Gaenr Instagram"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 text-slate-300 hover:text-white flex items-center justify-center transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* Pinterest */}
              <a
                href="https://www.pinterest.com/gaenr_global/"
                target="_blank"
                rel="noreferrer"
                aria-label="Gaenr Pinterest"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#BD081C] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0a12 12 0 0 0-4.37 23.18c-.07-.94-.13-2.39.03-3.42l1.09-4.63s-.28-.56-.28-1.39c0-1.3.75-2.28 1.7-2.28.8 0 1.18.6 1.18 1.32 0 .8-.52 2.01-.78 3.12-.22.94.47 1.7 1.4 1.7 1.68 0 2.97-1.77 2.97-4.33 0-2.26-1.63-3.84-3.95-3.84-2.69 0-4.27 2.02-4.27 4.1 0 .81.31 1.68.7 2.16.08.09.09.18.06.31l-.26 1.07c-.04.18-.15.22-.34.13-1.27-.59-2.07-2.45-2.07-3.95 0-3.21 2.33-6.17 6.74-6.17 3.54 0 6.29 2.52 6.29 5.89 0 3.52-2.22 6.35-5.3 6.35-1.04 0-2.01-.54-2.34-1.18l-.64 2.43c-.23.89-.86 2.01-1.28 2.7A12 12 0 1 0 12 0z" />
                </svg>
              </a>

              {/* X / Twitter */}
              <a
                href="https://x.com/gaenr_global"
                target="_blank"
                rel="noreferrer"
                aria-label="Gaenr X"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-black text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Threads */}
              <a
                href="https://www.threads.com/@gaenr_global"
                target="_blank"
                rel="noreferrer"
                aria-label="Gaenr Threads"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-black text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.263 11.097c-.03-3.486-1.92-5.586-5.111-5.586-2.13 0-3.922.963-4.863 2.499l2.062 1.438c.535-.843 1.272-1.543 2.628-1.543 1.528 0 2.318.85 2.544 2.431a15 15 0 0 0-2.236-.173c-4.125 0-6.068 1.867-6.068 4.336s1.943 3.99 4.804 3.99c3.139 0 5.013-2.115 5.781-4.735.798.361 1.348 1.204 1.348 2.47 0 3.387-3.907 5.232-7.22 5.232-4.885 0-8.077-3.207-8.077-8.424 0-6.392 4.223-10.487 9.9-10.487 3.808 0 5.69 1.671 6.97 3.914l2.108-1.475C21.44 2.078 18.331 0 13.663 0 6.227 0 1.168 5.277 1.168 12.934c0 7 4.953 11.066 10.856 11.066 4.878 0 9.809-2.846 9.809-7.716 0-2.545-1.46-4.231-3.569-5.187m-6.33 4.855c-1.077 0-2.026-.512-2.026-1.453 0-1.483 1.822-1.934 3.606-1.934.678 0 1.34.045 1.927.173-.422 1.927-1.671 3.215-3.508 3.214Z" />
                </svg>
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@gaenr_global"
                target="_blank"
                rel="noreferrer"
                aria-label="Gaenr TikTok"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-black text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => navigate('/about-us')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/join-as-expert')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Careers
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/blogs')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Blogs
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/feedback')}
                  className="transition-colors cursor-pointer text-[#1877F2] hover:underline font-semibold"
                >
                  Share Feedback
                </button>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Policies
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => navigate('/privacy-policy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/terms')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/return-policy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Return Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/support')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Support Center
                </button>
              </li>
            </ul>
          </div>

          {/* Processes & Contact Info */}
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
                Processes
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    onClick={() => {
                      if (currentRoute.split('#')[0] === '/join-as-expert') {
                        window.location.hash = 'how-to-get-payment';
                        window.dispatchEvent(new CustomEvent('select-expert-slide', { detail: { slideIndex: 2 } }));
                        const el = document.getElementById('how-to-get-payment');
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      } else {
                        navigate('/join-as-expert#how-to-get-payment');
                      }
                    }}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Payment Procedure
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      if (currentRoute.split('#')[0] === '/services') {
                        const el = document.getElementById('how-to-assign-task');
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      } else {
                        navigate('/services#how-to-assign-task');
                      }
                    }}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Task Assign Process
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/join-as-expert')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Become an Expert Process
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">
                Contact Info
              </h4>
              <div className="space-y-1.5 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono text-xs font-semibold text-white">09647 922 800</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <a href="mailto:contact@gaenr.com" className="text-white hover:text-slate-200 text-xs font-medium transition-colors">
                    contact@gaenr.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gaenr Operations - Middle Aligned */}
        <div className="py-2.5 border-t border-slate-800/80 flex items-center justify-center">
          <button
            onClick={() => navigate('/admin')}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-slate-700 shadow-xs inline-flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Gaenr Operations</span>
          </button>
        </div>

        {/* Palestine Solidarity Box with Middle Alignment between subtle dividers */}
        <div className="py-3 border-t border-slate-800/80 flex items-center justify-center">
          <div className="group inline-flex items-center gap-2.5 px-4 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 text-xs font-medium text-slate-200 cursor-default">
            {/* Flying / Waving Palestinian Flag SVG */}
            <svg
              className="w-6 h-5 shrink-0 group-hover:scale-110 group-hover:rotate-1 transition-transform duration-300"
              viewBox="0 0 28 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Flagpole */}
              <line x1="2" y1="1" x2="2" y2="19" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="2" cy="1.5" r="1.2" fill="#CBD5E1" />
              {/* Waving Flag Fabric */}
              <g>
                <path
                  d="M2.5 2.5 C 9 1, 15 4, 25 2.5 L 25 13.5 C 15 15, 9 12, 2.5 13.5 Z"
                  fill="#007A3D"
                />
                <path
                  d="M2.5 2.5 C 9 1, 15 4, 25 2.5 L 25 6.2 C 15 7.7, 9 4.7, 2.5 6.2 Z"
                  fill="#000000"
                />
                <path
                  d="M2.5 6.2 C 9 4.7, 15 7.7, 25 6.2 L 25 9.8 C 15 11.3, 9 8.3, 2.5 9.8 Z"
                  fill="#FFFFFF"
                />
                {/* Red Triangle Hoist */}
                <path
                  d="M2.5 2.5 L 11.5 8 L 2.5 13.5 Z"
                  fill="#EE2A35"
                />
              </g>
            </svg>
            <span>We stand with Palestine</span>
          </div>
        </div>

        {/* Bottom Bar: Copyright middle-aligned in a sleek glassy pill container */}
        <div className="pt-3 pb-1 border-t border-slate-800/80 flex items-center justify-center text-xs text-slate-400">
          <div className="font-medium text-slate-300 text-center px-4 py-1.5 rounded-full bg-slate-800/60 backdrop-blur-md border border-white/10 shadow-xs">
            {branding.footerText || `Copyright © ${new Date().getFullYear()} Gaenr. All Rights Reserved.`}
          </div>
        </div>
      </div>
    </footer>
  );
};
