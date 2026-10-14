import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import { useBranding } from '../../context/BrandingContext';
import { useTheme } from '../../context/ThemeContext';
import { Menu, X, ArrowUpRight, Sun, Moon } from 'lucide-react';
import { GaenrLogo } from './GaenrLogo';

export const Header: React.FC = () => {
  const { currentRoute, navigate, openAssignTask } = useApp();
  const { branding } = useBranding();
  const { theme, isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Close mobile sidebar drawer on outside click / tap anywhere on screen or Escape key
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (headerRef.current && !headerRef.current.contains(target)) {
        setMobileMenuOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick, { passive: true });
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [mobileMenuOpen]);

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
      ref={headerRef}
      className={`sticky top-0 z-50 border-b transition-colors duration-200 ${
        isDark ? 'border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.35)]' : 'border-slate-200/70 shadow-2xs'
      }`}
      style={{
        backgroundColor: isDark ? 'rgba(13, 21, 39, 0.62)' : 'rgba(255, 255, 255, 0.68)',
        backdropFilter: 'blur(24px) saturate(190%)',
        WebkitBackdropFilter: 'blur(24px) saturate(190%)',
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
          <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white select-none transition-colors">
            {branding.siteTitle}
          </span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
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
                    ? 'text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                {link.label}
                {link.route === '/experts' && (
                  <span className="inline-block ml-1 text-slate-400 dark:text-slate-500">
                    <ArrowUpRight className="w-3.5 h-3.5 inline" />
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary action & Dark Mode Switch */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Desktop Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="hidden md:inline-flex items-center justify-center w-9 h-9 rounded-full text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100/90 hover:bg-slate-200/90 dark:bg-slate-800/90 dark:hover:bg-slate-700/90 border border-slate-200/80 dark:border-slate-700/80 transition-all cursor-pointer shadow-2xs"
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? (
              <Sun className="w-4.5 h-4.5 text-amber-400 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-4.5 h-4.5 text-slate-700 transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* Desktop Assign Task Button */}
          <div className="hidden md:block">
            <button
              onClick={() => openAssignTask()}
              className="gaenr-btn-primary !min-h-[38px] !h-[38px] !px-6 !py-0 !text-sm !font-semibold min-w-[130px] shadow-xs hover:shadow-md transition-all"
            >
              Assign Task
            </button>
          </div>

          {/* Mobile Theme Toggle Button - Directly visible on phone top bar */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleTheme();
            }}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-full text-slate-600 hover:text-slate-900 dark:text-amber-400 bg-slate-100/90 dark:bg-white/10 dark:hover:bg-white/15 border border-slate-200/80 dark:border-white/15 dark:shadow-[0_0_12px_rgba(251,191,36,0.2)] dark:backdrop-blur-md transition-colors cursor-pointer"
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={isDark ? 'Light Mode' : 'Dark Mode'}
          >
            {isDark ? (
              <Sun className="w-4.5 h-4.5 text-amber-400" />
            ) : (
              <Moon className="w-4.5 h-4.5 text-slate-700" />
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Full-screen Backdrop overlay portaled to document.body: Tapping anywhere on phone screen outside closes drawer immediately */}
      {mobileMenuOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-xs cursor-pointer md:hidden transition-opacity duration-200"
            onClick={() => setMobileMenuOpen(false)}
            onTouchStart={() => setMobileMenuOpen(false)}
            aria-label="Close mobile navigation menu"
          />,
          document.body
        )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="relative z-50 md:hidden border-t border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#0d1527]/92 dark:backdrop-blur-2xl px-4 py-5 space-y-3 shadow-2xl transition-colors">
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
                      ? 'bg-blue-50 dark:bg-blue-600/25 dark:text-blue-400 dark:border dark:border-blue-500/30 font-semibold'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/8'
                  }`}
                >
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>


          <div className="pt-2 border-t border-slate-100 dark:border-white/10">
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
