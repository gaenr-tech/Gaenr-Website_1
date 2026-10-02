import React, { useState, useRef, useEffect } from 'react';
import { BrandingConfig } from '../../../types';
import {
  Image as ImageIcon,
  Palette,
  ShieldAlert,
  RotateCcw,
  Check,
  Upload,
  X,
  Eye,
  FileText,
} from 'lucide-react';
import { GaenrLogo } from '../../../components/common/GaenrLogo';

interface BrandingManageViewProps {
  branding: BrandingConfig;
  onUpdateBranding: (updates: Partial<BrandingConfig>) => void;
  onResetBranding: () => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const BrandingManageView: React.FC<BrandingManageViewProps> = ({
  branding,
  onUpdateBranding,
  onResetBranding,
  showToast,
}) => {
  // Ensure legacy invalid logos are cleansed to official /logo.svg
  const cleanInitialLogo =
    branding.logoUrl &&
    (branding.logoUrl.includes('gaenr-official-logo') ||
      branding.logoUrl.includes('gaenr-logo') ||
      branding.logoUrl.includes('logo.png'))
      ? '/logo.svg'
      : branding.logoUrl || '/logo.svg';

  const cleanInitialWatermark =
    branding.watermarkImage &&
    (branding.watermarkImage.includes('gaenr-official-logo') ||
      branding.watermarkImage.includes('gaenr-logo') ||
      branding.watermarkImage.includes('logo.png'))
      ? '/logo.svg'
      : branding.watermarkImage || '/logo.svg';

  // State
  const [logoUrl, setLogoUrl] = useState(cleanInitialLogo);
  const [faviconUrl, setFaviconUrl] = useState(branding.faviconUrl || '/favicon.ico');
  const [watermarkImage, setWatermarkImage] = useState(cleanInitialWatermark);
  const [watermarkText, setWatermarkText] = useState(
    branding.watermarkText || 'GAENR VERIFIED PORTFOLIO'
  );
  const [primaryColor, setPrimaryColor] = useState(branding.primaryColor || '#006eff');
  const [backgroundColor, setBackgroundColor] = useState(branding.backgroundColor || '#f8fafc');
  const [footerBgColor, setFooterBgColor] = useState(branding.footerBgColor || '#0c182c');
  const [footerTextColor, setFooterTextColor] = useState(branding.footerTextColor || '#cbd5e1');
  const [footerTagline, setFooterTagline] = useState(
    branding.footerTagline || 'Connecting businesses with expert talent for seamless, hassle-free outsourcing.'
  );
  const [footerText, setFooterText] = useState(
    branding.footerText || 'Copyright © 2026 Gaenr. All Rights Reserved.'
  );
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(
    branding.watermarkOpacity ?? 15
  );
  const [watermarkPosition, setWatermarkPosition] = useState<'diagonal' | 'center' | 'bottom-right'>(
    branding.watermarkPosition || 'diagonal'
  );
  const [repeatingWatermark, setRepeatingWatermark] = useState<boolean>(
    branding.repeatingWatermark ?? true
  );

  // Background theme switcher for watermark simulation
  const [previewBgTheme, setPreviewBgTheme] = useState<'dark' | 'light' | 'theme'>('dark');

  // Hidden file inputs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const watermarkInputRef = useRef<HTMLInputElement>(null);

  // Keep state in sync if branding prop changes externally
  useEffect(() => {
    if (branding.logoUrl) setLogoUrl(branding.logoUrl);
    if (branding.watermarkImage) setWatermarkImage(branding.watermarkImage);
    if (branding.backgroundColor) setBackgroundColor(branding.backgroundColor);
    if (branding.footerBgColor) setFooterBgColor(branding.footerBgColor);
    if (branding.footerTextColor) setFooterTextColor(branding.footerTextColor);
    if (branding.footerTagline) setFooterTagline(branding.footerTagline);
    if (branding.footerText) setFooterText(branding.footerText);
  }, [branding]);

  // Handle Logo Upload
  const handleLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      showToast('Logo file size must be under 3MB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setLogoUrl(result);
        showToast('Logo file loaded! Click "Save Branding Settings" to apply.', 'success');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Handle Watermark Image Upload
  const handleWatermarkFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      showToast('Watermark file size must be under 4MB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setWatermarkImage(result);
        showToast('Watermark image loaded! Check live preview below.', 'success');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const updates: Partial<BrandingConfig> = {
      logoUrl: logoUrl.trim() || '/logo.svg',
      faviconUrl: faviconUrl.trim() || '/favicon.ico',
      watermarkImage: watermarkImage.trim(),
      watermarkText: watermarkText.trim() || 'GAENR VERIFIED PORTFOLIO',
      primaryColor,
      backgroundColor,
      footerBgColor,
      footerTextColor,
      footerTagline: footerTagline.trim(),
      footerText: footerText.trim(),
      watermarkOpacity,
      watermarkPosition,
      repeatingWatermark,
    };

    onUpdateBranding(updates);
    showToast('Branding settings saved successfully!', 'success');
  };

  const handleReset = () => {
    const confirm = window.confirm('Reset all branding settings to official platform defaults?');
    if (!confirm) return;

    onResetBranding();
    setLogoUrl('/logo.svg');
    setFaviconUrl('/favicon.ico');
    setWatermarkImage('/logo.svg');
    setWatermarkText('GAENR VERIFIED PORTFOLIO');
    setPrimaryColor('#006eff');
    setBackgroundColor('#f8fafc');
    setFooterBgColor('#0c182c');
    setFooterTextColor('#cbd5e1');
    setFooterTagline('Connecting businesses with expert talent for seamless, hassle-free outsourcing.');
    setFooterText('Copyright © 2026 Gaenr. All Rights Reserved.');
    setWatermarkOpacity(15);
    setWatermarkPosition('diagonal');
    setRepeatingWatermark(true);

    showToast('Branding reset to platform defaults', 'info');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-12 px-2 sm:px-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Branding Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure platform visual identity, logos, portfolio protection watermarks, and theme colors.
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="self-start sm:self-auto px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Official Platform Identity & Logos */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#006eff] shrink-0" />
              <span>1. Official Platform Identity &amp; Logos</span>
            </h2>
            <span className="text-[10px] font-mono text-[#006eff] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 font-bold">
              Official Gaenr Brand
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Website Logo */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs font-bold text-slate-700">
                  Website Header Logo
                </label>
                <div className="flex items-center gap-1.5">
                  {logoUrl !== '/logo.svg' && (
                    <button
                      type="button"
                      onClick={() => setLogoUrl('/logo.svg')}
                      className="text-[11px] text-slate-500 hover:text-slate-800 font-medium px-2 py-0.5 rounded bg-slate-100 cursor-pointer"
                    >
                      Default SVG
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#006eff] rounded-lg text-[11px] font-semibold transition-colors cursor-pointer border border-blue-200"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload Logo</span>
                  </button>
                </div>
                <input
                  type="file"
                  ref={logoInputRef}
                  onChange={handleLogoFile}
                  accept="image/png,image/svg+xml,image/webp,image/jpeg"
                  className="hidden"
                />
              </div>

              <input
                type="text"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="/logo.svg or data:image/..."
                className="w-full min-w-0 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:bg-white focus:border-[#006eff] focus:outline-none"
              />

              {/* Logo Preview representation */}
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-1.5 overflow-hidden shrink-0 shadow-2xs">
                    {logoUrl === '/logo.svg' ? (
                      <GaenrLogo size={28} />
                    ) : (
                      <img
                        src={logoUrl}
                        alt="Logo Preview"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-800 block truncate">
                      Official Header Logo
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {logoUrl === '/logo.svg' ? 'Official Dual-Blue Vector (/logo.svg)' : 'Custom Logo File'}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-mono font-bold border border-emerald-200 shrink-0">
                  Active
                </span>
              </div>
            </div>

            {/* Favicon */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Favicon (Browser Tab Icon)
              </label>
              <input
                type="text"
                value={faviconUrl}
                onChange={(e) => setFaviconUrl(e.target.value)}
                placeholder="/favicon.ico or https://..."
                className="w-full min-w-0 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:bg-white focus:border-[#006eff] focus:outline-none"
              />

              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center gap-2.5 text-xs text-slate-600">
                <div className="w-6 h-6 rounded bg-[#006eff] flex items-center justify-center text-[10px] text-white font-bold shrink-0 shadow-2xs">
                  G
                </div>
                <div className="min-w-0">
                  <span className="font-semibold text-slate-800 block text-xs truncate">
                    Browser Tab Representation
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {faviconUrl || '/favicon.ico'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Colors & Footer Legal Specifications */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#006eff] shrink-0" />
              <span>2. Theme Palette &amp; Footer Specifications</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Primary Brand Color */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Primary Brand Color
              </label>
              <div className="flex items-center gap-2.5">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-0.5 shrink-0"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-full min-w-0 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:bg-white focus:border-[#006eff] focus:outline-none uppercase"
                />
              </div>
            </div>

            {/* Background Theme Color */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Background Theme Color
              </label>
              <div className="flex items-center gap-2.5">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-0.5 shrink-0"
                />
                <input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-full min-w-0 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:bg-white focus:border-[#006eff] focus:outline-none uppercase"
                />
              </div>
            </div>

            {/* Footer Background Color */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Footer Background Color
              </label>
              <div className="flex items-center gap-2.5">
                <input
                  type="color"
                  value={footerBgColor}
                  onChange={(e) => setFooterBgColor(e.target.value)}
                  className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-0.5 shrink-0"
                />
                <input
                  type="text"
                  value={footerBgColor}
                  onChange={(e) => setFooterBgColor(e.target.value)}
                  className="w-full min-w-0 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:bg-white focus:border-[#006eff] focus:outline-none uppercase"
                />
              </div>
            </div>

            {/* Footer Text Color */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Footer Text / Links Color
              </label>
              <div className="flex items-center gap-2.5">
                <input
                  type="color"
                  value={footerTextColor}
                  onChange={(e) => setFooterTextColor(e.target.value)}
                  className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-0.5 shrink-0"
                />
                <input
                  type="text"
                  value={footerTextColor}
                  onChange={(e) => setFooterTextColor(e.target.value)}
                  className="w-full min-w-0 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:bg-white focus:border-[#006eff] focus:outline-none uppercase"
                />
              </div>
            </div>

            {/* Footer Tagline */}
            <div className="sm:col-span-2 space-y-1.5 pt-1">
              <label className="block text-xs font-bold text-slate-700">
                Footer Brand Tagline
              </label>
              <input
                type="text"
                value={footerTagline}
                onChange={(e) => setFooterTagline(e.target.value)}
                placeholder="Connecting businesses with expert talent..."
                className="w-full min-w-0 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-[#006eff] focus:outline-none font-medium"
              />
            </div>

            {/* Footer Copyright Text */}
            <div className="sm:col-span-2 space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  Footer Copyright &amp; Legal Text
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  Appears at the bottom of all platform pages
                </span>
              </div>
              <input
                type="text"
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                placeholder="e.g. Copyright © 2026 Gaenr. All Rights Reserved."
                className="w-full min-w-0 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-[#006eff] focus:outline-none font-medium"
              />

              {/* Live simulation preview of Footer */}
              <div
                className="p-4 rounded-2xl border transition-all space-y-2 mt-2 shadow-sm"
                style={{
                  backgroundColor: footerBgColor || '#0c182c',
                  color: footerTextColor || '#cbd5e1',
                  borderColor: 'rgba(255,255,255,0.1)',
                }}
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-2 text-xs">
                  <span className="font-bold flex items-center gap-1.5">
                    <GaenrLogo size={18} />
                    <span>Gaenr Footer Live Preview</span>
                  </span>
                  <span className="text-[10px] opacity-75 font-mono">{footerBgColor}</span>
                </div>
                <p className="text-xs opacity-85 leading-relaxed">{footerTagline}</p>
                <div className="pt-2 border-t border-white/10 flex items-center justify-center text-[11px] opacity-90">
                  <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs">
                    {footerText || 'Copyright © 2026 Gaenr. All Rights Reserved.'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Portfolio Watermark Engine */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#006eff] shrink-0" />
              <span>3. Portfolio Protection &amp; Watermark Engine</span>
            </h2>
            <span className="text-[10px] font-mono text-[#006eff] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 font-bold self-start sm:self-auto">
              Header Logo Watermark
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {/* Watermark Logo / Image */}
            <div className="space-y-1.5 md:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs font-bold text-slate-700">
                  Watermark Image (Official Logo)
                </label>
                <div className="flex items-center gap-1.5">
                  {watermarkImage !== '/logo.svg' && (
                    <button
                      type="button"
                      onClick={() => setWatermarkImage('/logo.svg')}
                      className="text-[11px] text-slate-600 hover:text-slate-900 font-medium px-2 py-0.5 rounded bg-slate-100 cursor-pointer"
                    >
                      Use Official Logo
                    </button>
                  )}
                  {watermarkImage && (
                    <button
                      type="button"
                      onClick={() => setWatermarkImage('')}
                      className="text-[11px] text-rose-600 hover:text-rose-700 font-medium px-2 py-0.5 rounded bg-rose-50 border border-rose-200 cursor-pointer inline-flex items-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      <span>Text Only</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => watermarkInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#006eff] rounded-lg text-[11px] font-semibold transition-colors cursor-pointer border border-blue-200"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload Image</span>
                  </button>
                </div>
                <input
                  type="file"
                  ref={watermarkInputRef}
                  onChange={handleWatermarkFile}
                  accept="image/png,image/svg+xml,image/webp,image/jpeg"
                  className="hidden"
                />
              </div>

              <input
                type="text"
                value={watermarkImage}
                onChange={(e) => setWatermarkImage(e.target.value)}
                placeholder="/logo.svg or data:image/... (Leave blank for text overlay)"
                className="w-full min-w-0 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:bg-white focus:border-[#006eff] focus:outline-none"
              />
            </div>

            {/* Watermark Fallback Text */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Watermark Text (Fallback or Text Mode)
              </label>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="e.g. GAENR VERIFIED PORTFOLIO"
                className="w-full min-w-0 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:bg-white focus:border-[#006eff] focus:outline-none uppercase"
              />
            </div>

            {/* Watermark Position */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Watermark Layout / Position
              </label>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                {[
                  { id: 'diagonal', label: 'Diagonal' },
                  { id: 'center', label: 'Center' },
                  { id: 'bottom-right', label: 'Bottom Right' },
                ].map((pos) => (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => setWatermarkPosition(pos.id as any)}
                    className={`py-2 px-1 text-center rounded-xl text-[11px] sm:text-xs font-medium border transition-colors cursor-pointer truncate ${
                      watermarkPosition === pos.id
                        ? 'bg-blue-50 text-[#006eff] border-blue-200 font-bold shadow-2xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Watermark Opacity Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Watermark Opacity</label>
                <span className="text-xs font-mono font-bold text-[#006eff] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                  {watermarkOpacity}%
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="80"
                step="5"
                value={watermarkOpacity}
                onChange={(e) => setWatermarkOpacity(Number(e.target.value))}
                className="w-full accent-[#006eff] cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Subtle (5%)</span>
                <span>Standard (15%)</span>
                <span>Prominent (80%)</span>
              </div>
            </div>

            {/* Repeating Watermark Option */}
            <div className="flex items-center pt-2 sm:pt-4">
              <label className="flex items-start sm:items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={repeatingWatermark}
                  onChange={(e) => setRepeatingWatermark(e.target.checked)}
                  className="w-4 h-4 rounded text-[#006eff] accent-[#006eff] mt-0.5 sm:mt-0 shrink-0 cursor-pointer"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-800 block">
                    Repeating Pattern Across Deliverable
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    Tile repeating security pattern across full portfolio deliverable canvas
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Watermark Live Simulation Preview Box */}
          <div className="space-y-2 pt-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <Eye className="w-4 h-4 text-[#006eff]" />
                <span>Live Simulation Preview on Portfolio Media</span>
              </div>

              {/* Theme toggles */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setPreviewBgTheme('dark')}
                  className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-colors cursor-pointer ${
                    previewBgTheme === 'dark'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Dark Deliverable
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewBgTheme('light')}
                  className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-colors cursor-pointer ${
                    previewBgTheme === 'light'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Light Deliverable
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewBgTheme('theme')}
                  className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-colors cursor-pointer ${
                    previewBgTheme === 'theme'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Platform Theme
                </button>
              </div>
            </div>

            {/* Simulation Canvas */}
            <div
              className={`relative overflow-hidden rounded-2xl border min-h-[180px] sm:min-h-[220px] flex items-center justify-center select-none transition-all shadow-inner ${
                previewBgTheme === 'dark'
                  ? 'bg-slate-950 border-slate-800'
                  : previewBgTheme === 'light'
                  ? 'bg-slate-100 border-slate-300'
                  : 'border-slate-300'
              }`}
              style={previewBgTheme === 'theme' ? { backgroundColor } : undefined}
            >
              {/* Deliverable Mock Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none opacity-30">
                <div className="text-xs font-bold uppercase font-mono tracking-widest text-slate-400">
                  Client Deliverable Showcase Media
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Protected against screenshots and unauthorized downloads
                </div>
              </div>

              {/* Active Watermark Rendering - BOTH Image and Text Render Together */}
              <div
                className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center overflow-hidden"
                style={{ opacity: watermarkOpacity / 100 }}
              >
                {repeatingWatermark ? (
                  /* Repeating Watermark Grid with BOTH Image & Text in Every Cell */
                  <div
                    className={`w-full h-full grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-10 p-4 sm:p-6 place-items-center ${
                      watermarkPosition === 'diagonal' ? 'rotate-[-20deg] scale-110' : ''
                    }`}
                  >
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="flex flex-col items-center justify-center gap-1.5 text-center drop-shadow-md select-none"
                      >
                        {watermarkImage && (
                          watermarkImage === '/logo.svg' ? (
                            <GaenrLogo size={36} variant={previewBgTheme === 'light' ? 'color' : 'white'} />
                          ) : (
                            <img
                              src={watermarkImage}
                              alt="Watermark"
                              className="max-h-9 max-w-[110px] object-contain drop-shadow"
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = 'none';
                              }}
                            />
                          )
                        )}
                        {watermarkText && (
                          <span
                            className={`font-black uppercase tracking-widest text-[10px] sm:text-[11px] whitespace-nowrap ${
                              previewBgTheme === 'light' ? 'text-slate-900' : 'text-white'
                            }`}
                          >
                            {watermarkText}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Single Position Watermark with BOTH Image & Text Together */
                  <div className="w-full h-full relative flex items-center justify-center p-6">
                    <div
                      className={`flex flex-col items-center justify-center gap-2 text-center drop-shadow-lg transition-all select-none ${
                        watermarkPosition === 'diagonal'
                          ? 'rotate-[-25deg]'
                          : watermarkPosition === 'center'
                          ? ''
                          : 'absolute bottom-4 right-4 scale-90'
                      }`}
                    >
                      {watermarkImage && (
                        watermarkImage === '/logo.svg' ? (
                          <GaenrLogo size={watermarkPosition === 'bottom-right' ? 36 : 60} variant={previewBgTheme === 'light' ? 'color' : 'white'} />
                        ) : (
                          <img
                            src={watermarkImage}
                            alt="Watermark"
                            className={`${watermarkPosition === 'bottom-right' ? 'max-h-12 max-w-[120px]' : 'max-h-20 max-w-[200px]'} object-contain drop-shadow-md`}
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = 'none';
                            }}
                          />
                        )
                      )}
                      {watermarkText && (
                        <span
                          className={`font-black uppercase tracking-widest whitespace-nowrap ${
                            watermarkPosition === 'bottom-right' ? 'text-[10px]' : 'text-xs sm:text-base'
                          } ${previewBgTheme === 'light' ? 'text-slate-900' : 'text-white'}`}
                        >
                          {watermarkText}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Watermark Status Pill */}
              <div className="absolute top-2.5 left-3 text-[10px] font-mono text-white/70 bg-black/50 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-white/10 z-20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  {watermarkImage === '/logo.svg' ? 'Official Gaenr Logo' : watermarkImage ? 'Custom Image' : 'Text'}{' '}
                  • {watermarkOpacity}% Opacity
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Action Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-[#006eff] hover:bg-blue-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
          >
            <Check className="w-4 h-4" />
            <span>Save Branding Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
