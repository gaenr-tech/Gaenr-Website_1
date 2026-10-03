import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrandingConfig } from '../types';
import { INITIAL_BRANDING } from '../data/mockData';

interface BrandingContextType {
  branding: BrandingConfig;
  updateBranding: (updates: Partial<BrandingConfig>) => void;
  resetBranding: () => void;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

const normalizeBranding = (value: Partial<BrandingConfig>): BrandingConfig => {
  const normalized = { ...INITIAL_BRANDING, ...value };
  // Repair the mojibake saved by older builds (UTF-8 © decoded as Windows-1252).
  if (normalized.footerText?.includes('Â©')) {
    normalized.footerText = normalized.footerText.replace(/Â©/g, '©');
  }
  return normalized;
};

export const BrandingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [branding, setBranding] = useState<BrandingConfig>(() => {
    try {
      const saved = localStorage.getItem('gaenr_branding');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Cleanse legacy invalid logo paths
        if (
          parsed.watermarkImage?.includes('gaenr-official-logo') ||
          parsed.watermarkImage?.includes('gaenr-logo') ||
          parsed.watermarkImage?.includes('logo.png')
        ) {
          parsed.watermarkImage = '/logo.svg';
        }
        if (
          parsed.logoUrl?.includes('gaenr-official-logo') ||
          parsed.logoUrl?.includes('gaenr-logo') ||
          parsed.logoUrl?.includes('logo.png')
        ) {
          parsed.logoUrl = '/logo.svg';
        }
        return normalizeBranding(parsed);
      }
      return normalizeBranding(INITIAL_BRANDING);
    } catch {
      return normalizeBranding(INITIAL_BRANDING);
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('gaenr_branding', JSON.stringify(branding));
    } catch {
      // Storage unavailable
    }
    // Update CSS variables dynamically
    if (branding.primaryColor) {
      document.documentElement.style.setProperty('--primary-brand-color', branding.primaryColor);
    }
    if (branding.backgroundColor) {
      document.documentElement.style.setProperty('--bg-theme-color', branding.backgroundColor);
      document.body.style.backgroundColor = branding.backgroundColor;
    }
    if (branding.footerBgColor) {
      document.documentElement.style.setProperty('--footer-bg-color', branding.footerBgColor);
    }
    if (branding.footerTextColor) {
      document.documentElement.style.setProperty('--footer-text-color', branding.footerTextColor);
    }
  }, [branding]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== 'gaenr_branding' || !event.newValue) return;
      try {
        setBranding(normalizeBranding(JSON.parse(event.newValue)));
      } catch {
        // Ignore malformed values from another tab.
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const updateBranding = (updates: Partial<BrandingConfig>) => {
    setBranding((prev) => ({ ...prev, ...updates }));
  };

  const resetBranding = () => {
    setBranding(normalizeBranding(INITIAL_BRANDING));
  };

  return (
    <BrandingContext.Provider value={{ branding, updateBranding, resetBranding }}>
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = () => {
  const ctx = useContext(BrandingContext);
  if (!ctx) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return ctx;
};
