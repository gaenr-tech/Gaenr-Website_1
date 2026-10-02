import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useBranding } from '../../context/BrandingContext';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { GaenrLogo } from './GaenrLogo';

export const Header: React.FC = () => {
  const { currentRoute, navigate, openAssignTask } = useApp();
  const { branding } = useBranding();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (route: string) => {
    navigate(route);
    setMobileMenuOpen(false);
  };

  // Exactly as requested: Home, Services, Freelancers (redirects to freelancer.gaenr.com showcase), Testimonial, Contact
  // Note: Feedback is strictly in the footer as requested.
  const navLinks = [
    { label: 'Home', route: '/' },
    { label: 'Services', route: '/services' },
    { label: 'Experts', route: '/experts' },
    { label: 'Testimonial', route: '/testimonials' },
    { label: 'Contact', route: '/contact' },
  ];

  return (
    <header
      className="sticky top-0 z-50 border-b border-slate-200/70 shadow-2xs transition-all"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.68)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      }}
    >
      {/* Main Top Bar Contract: 3 zones */}
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between"
        onClick={() => {
          if (mobileMenuOpen) {
            setMobileMenuOpen(false);
          }
        }}
      >
        {/* Zone 1: Frameless Wordmark & Logo */}
        <button
          onClick={() => handleNavClick('/')}
          className="group flex items-center gap-2.5 text-left focus-visible:outline-2 focus-visible:outline-blue-600 cursor-pointer"
          aria-label="Gaenr Homepage"
        >
          <div className="flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
            {branding.logoUrl && branding.logoUrl !== '/logo.svg' ? (
              <img src={branding.logoUrl} alt={branding.siteTitle} className="w-8 h-8 object-contain" />
            ) : (
              <GaenrLogo size={32} />
            )}
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-slate-900 select-none">
            {branding.siteTitle}
          </span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          {navLinks.map((link) => {
            const isActive =
              link.route === '/'
                ? currentRoute === '/'
                : currentRoute.startsWith(link.route);

            return (
              <button
                key={link.route}
                onClick={() => handleNavClick(link.route)}
                className={`relative py-1 transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-blue-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {link.label}
                {link.route === '/experts' && (
                  <span className="inline-block ml-1 text-slate-400">
                    <ArrowUpRight className="w-3.5 h-3.5 inline" />
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary action - Strictly hidden on mobile header, available in mobile drawer */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <button
              onClick={() => openAssignTask()}
              className="gaenr-btn-primary !min-h-[38px] !h-[38px] !px-6 !py-0 !text-sm !font-semibold min-w-[130px] shadow-xs hover:shadow-md transition-all"
            >
              Assign Task
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Backdrop overlay to close drawer when tapping anywhere on screen */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-18 bg-slate-900/25 backdrop-blur-2xs z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="relative z-50 md:hidden border-t border-slate-200 bg-white px-4 py-5 space-y-3 shadow-lg">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive =
                link.route === '/'
                  ? currentRoute === '/'
                  : currentRoute.startsWith(link.route);
              return (
                <button
                  key={link.route}
                  onClick={() => handleNavClick(link.route)}
                  className={`flex items-center justify-between text-left px-3 py-2.5 rounded-lg text-base font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openAssignTask();
              }}
              className="gaenr-btn-primary w-full !py-3"
            >
              Assign Task
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
