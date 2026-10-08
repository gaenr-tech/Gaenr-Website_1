import React, { useState } from 'react';
import { useApp, GAENR_OFFICIAL_DRIVE_FOLDER_URL } from '../context/AppContext';
import { useBranding } from '../context/BrandingContext';
import { GaenrLogo } from '../components/common/GaenrLogo';
import { RAW_AVATAR_SPECS, AvatarGraphic } from '../components/common/Avatars';
import {
  PortfolioItem,
  DeliverableType,
  DELIVERABLE_TYPE_OPTIONS,
  ServiceSlug,
} from '../types';
import {
  Upload,
  CheckCircle,
  Sparkles,
  ExternalLink,
  Trash2,
  Eye,
  Link,
  Image as ImageIcon,
  Video,
  Globe,
  FolderArchive,
  Layers,
  Copy,
  ChevronRight,
  ShieldCheck,
  Plus,
  X,
  Star,
  Info,
  Maximize2,
} from 'lucide-react';

interface ExpertPortfolioUploadPageProps {
  expertCode?: string;
}

export const ExpertPortfolioUploadPage: React.FC<ExpertPortfolioUploadPageProps> = ({
  expertCode,
}) => {
  const {
    currentRoute,
    freelancers,
    addExpertPortfolioItem,
    deleteExpertPortfolioItem,
    navigate,
    showToast,
  } = useApp();
  const { branding } = useBranding();

  // Extract code from props or route: /expert-portfolio-upload/:expertCode
  const resolvedCode =
    expertCode ||
    currentRoute.split('#')[0].split('?')[0].replace('/expert-portfolio-upload/', '').trim();

  const expert = freelancers.find(
    (fl) => fl.code.toLowerCase() === resolvedCode.toLowerCase()
  );

  // Form State
  const [title, setTitle] = useState('');
  const [previewType, setPreviewType] = useState<DeliverableType>('image');
  const [mediaUrl, setMediaUrl] = useState('');
  const [description, setDescription] = useState('');
  const [tools, setTools] = useState<string[]>(['Figma']);
  const [toolInput, setToolInput] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '4:3' | '1:1'>('16:9');
  const [clientIndustry, setClientIndustry] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Quick tool presets based on category
  const commonTools = [
    'Adobe Photoshop',
    'Adobe Illustrator',
    'Figma',
    'Adobe Premiere Pro',
    'After Effects',
    'DaVinci Resolve',
    'WordPress',
    'Elementor Pro',
    'Canva',
    'Google Slides',
    'Keynote',
    'Tailwind CSS',
  ];

  const handleAddTool = (toolName: string) => {
    const trimmed = toolName.trim();
    if (trimmed && !tools.includes(trimmed)) {
      setTools([...tools, trimmed]);
      setToolInput('');
    }
  };

  const handleRemoveTool = (toolToRemove: string) => {
    setTools(tools.filter((t) => t !== toolToRemove));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      showToast('Image size should be under 8MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64 = uploadEvent.target?.result as string;
      if (base64) {
        setMediaUrl(base64);
        setPreviewType('image');
        showToast('Image attached successfully for preview', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCopyPortalLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    showToast('Portfolio Upload Portal link copied to clipboard', 'success');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();

    if (!expert) {
      showToast('Expert profile not found', 'error');
      return;
    }

    if (!title.trim()) {
      showToast('Please provide a deliverable title', 'error');
      return;
    }

    if (!mediaUrl.trim()) {
      showToast('Please provide a deliverable media URL or upload an image', 'error');
      return;
    }

    const newItem: PortfolioItem = {
      id: `port-${Date.now()}`,
      title: title.trim(),
      category: expert.category,
      description: description.trim(),
      tools: tools.length > 0 ? tools : ['Professional Deliverable'],
      previewType,
      accentColor: '#006eff',
      aspectRatio,
      clientIndustry: clientIndustry.trim() || undefined,
      mediaUrl: mediaUrl.trim(),
      externalUrl: externalUrl.trim() || undefined,
    };

    addExpertPortfolioItem(expert.code, newItem);

    // Reset Form
    setTitle('');
    setMediaUrl('');
    setDescription('');
    setClientIndustry('');
    setExternalUrl('');
    setTools(['Figma']);
    setZoomLevel(1);
  };

  // Helper for embed URLs (Drive, Figma, Youtube, Docs)
  const getEmbedPreviewUrl = (raw: string) => {
    if (!raw) return null;
    const clean = raw.trim();

    // YouTube
    const ytMatch = clean.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (ytMatch) return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`;

    // Vimeo
    const vimeoMatch = clean.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[3]}`;

    // Loom
    const loomMatch = clean.match(/loom\.com\/share\/([a-zA-Z0-9]+)/);
    if (loomMatch) return `https://www.loom.com/embed/${loomMatch[1]}`;

    // Google Drive
    const driveFile = clean.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (driveFile) return `https://drive.google.com/file/d/${driveFile[1]}/preview`;
    const driveOpen = clean.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
    if (driveOpen) return `https://drive.google.com/file/d/${driveOpen[1]}/preview`;

    // Google Docs / Sheets / Slides
    const docs = clean.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/);
    if (docs) return `https://docs.google.com/document/d/${docs[1]}/preview`;
    const slides = clean.match(/docs\.google\.com\/presentation\/d\/([a-zA-Z0-9_-]+)/);
    if (slides) return `https://docs.google.com/presentation/d/${slides[1]}/embed?start=false&loop=false`;
    const sheets = clean.match(/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
    if (sheets) return `https://docs.google.com/spreadsheets/d/${sheets[1]}/preview`;

    // Figma
    if (
      clean.includes('figma.com/file/') ||
      clean.includes('figma.com/proto/') ||
      clean.includes('figma.com/design/') ||
      clean.includes('figma.com/board/')
    ) {
      return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(clean)}`;
    }

    return null;
  };

  if (!expert) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <Info className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900">Expert Profile Not Found</h2>
            <p className="text-xs text-slate-500">
              No expert matches code{' '}
              <span className="font-mono font-bold text-slate-800">{resolvedCode || 'None'}</span>.
            </p>
          </div>
          <button
            onClick={() => navigate('/experts')}
            className="w-full py-2.5 bg-[#006eff] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Go to Experts Directory
          </button>
        </div>
      </div>
    );
  }

  const avatarSpec = RAW_AVATAR_SPECS.find((a) => a.id === expert.avatarId) || RAW_AVATAR_SPECS[0];
  const embedPreviewUrl = getEmbedPreviewUrl(mediaUrl);
  const isImageMedia =
    previewType === 'image' ||
    mediaUrl.startsWith('data:image') ||
    !!mediaUrl.match(/\.(jpeg|jpg|gif|png|webp|svg)($|\?)/i);
  const isVideoMedia =
    previewType === 'video' ||
    mediaUrl.includes('youtube.com') ||
    mediaUrl.includes('youtu.be') ||
    mediaUrl.includes('vimeo.com') ||
    mediaUrl.endsWith('.mp4');

  return (
    <div className="min-h-screen bg-slate-50/70 pb-24 text-slate-800">
      {/* Top Banner Navigation */}
      <header className="bg-white border-b border-slate-200/90 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/experts')}
              className="flex items-center gap-2 text-slate-900 hover:opacity-85 transition-opacity"
            >
              <GaenrLogo size={28} />
              <div className="leading-tight text-left">
                <span className="text-sm font-black tracking-tight block">
                  {branding.siteTitle || 'Gaenr'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Portfolio Vault Portal</span>
              </div>
            </button>
            <span className="text-slate-300">/</span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#006eff] font-mono font-bold text-xs border border-blue-200">
                {expert.code}
              </span>
              <span className="text-xs font-bold text-slate-700 hidden sm:inline">
                {expert.categoryTitle}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyPortalLink}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Copy private portal link for this expert"
            >
              {copiedLink ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Copy Portal Link</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate(`/profile/${expert.code}`)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Live Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Expert Profile Strip & Connected Google Drive Banner */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-slate-200 p-1.5 shrink-0 shadow-2xs">
              <AvatarGraphic avatar={avatarSpec} />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 ring-2 ring-white flex items-center justify-center text-white text-[9px] font-bold">
                ✓
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                  Deliverable Portfolio Management
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold border border-emerald-200">
                  {expert.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
                Add new verified deliverables to your public Gaenr profile. Upload your preview assets,
                connect your Google Drive project folder, and review the live presentation card in real time.
              </p>
              <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500 font-mono">
                <span>Code: <b className="text-slate-800">{expert.code}</b></span>
                <span>•</span>
                <span>Deliverables: <b className="text-slate-800">{expert.portfolioItems?.length || 0}</b></span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-600 font-bold">
                  <Star className="w-3 h-3 fill-amber-400" />
                  {expert.rating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Connected Google Drive Storage Vault Card */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0 md:max-w-md w-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <FolderArchive className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-emerald-950">Gaenr Official Cloud Drive</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="text-[10px] text-emerald-700 font-mono">
                  Cloud Asset Vault Connected
                </div>
              </div>
            </div>
            <a
              href={GAENR_OFFICIAL_DRIVE_FOLDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs"
            >
              <span>Open Vault</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Two-Column Editor & Live Instant Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Upload Form (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-blue-50 text-[#006eff]">
                  <Upload className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Add Portfolio Deliverable</h2>
                  <p className="text-[11px] text-slate-500">
                    Enter the details of your project. The preview on the right will update in real time.
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#006eff] text-[10px] font-mono font-bold">
                Live Sync
              </span>
            </div>

            <form onSubmit={handlePublish} className="space-y-5">
              {/* Deliverable Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">
                  Deliverable Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Modern Brand Identity & Vector Assets"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#006eff] transition-all font-medium"
                />
              </div>

              {/* Deliverable Type & Aspect Ratio */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Deliverable Format</label>
                  <select
                    value={previewType}
                    onChange={(e) => setPreviewType(e.target.value as DeliverableType)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#006eff] cursor-pointer"
                  >
                    {DELIVERABLE_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Frame Aspect Ratio</label>
                  <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value as '16:9' | '4:3' | '1:1')}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#006eff] cursor-pointer"
                  >
                    <option value="16:9">16:9 (Standard Video / Showcase)</option>
                    <option value="4:3">4:3 (Editorial / Slide Deck)</option>
                    <option value="1:1">1:1 (Square / Social Graphic)</option>
                  </select>
                </div>
              </div>

              {/* Deliverable Media URL / Upload Input */}
              <div className="space-y-2 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Link className="w-3.5 h-3.5 text-[#006eff]" />
                    <span>Media Link or Asset URL</span> <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">Direct / Drive / Embed</span>
                </div>

                <input
                  type="text"
                  required
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="Paste Google Drive share link, YouTube, Figma, or Image URL..."
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#006eff] font-mono transition-all"
                />

                <div className="flex items-center justify-between gap-3 pt-1">
                  {/* Local file upload option */}
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold cursor-pointer shadow-2xs transition-colors">
                    <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                    <span>Or Select Image File from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <a
                    href={GAENR_OFFICIAL_DRIVE_FOLDER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>Upload to Drive Folder</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <p className="text-[10px] text-slate-500 leading-relaxed pt-1">
                  💡 <b>Drive Tip:</b> Set your file sharing to "Anyone with the link can view". Paste the link here and Gaenr will automatically generate an interactive, responsive viewer card.
                </p>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">
                  Deliverable Description &amp; Scope
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly summarize what was created, client challenges solved, or key highlights..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#006eff] transition-all"
                />
              </div>

              {/* Tools Used (Chips + Custom Input) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800">Software &amp; Tools Used</label>
                <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 rounded-xl bg-slate-50 border border-slate-200">
                  {tools.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white text-slate-700 text-[11px] font-mono border border-slate-200 shadow-2xs"
                    >
                      <span>{t}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTool(t)}
                        className="text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={toolInput}
                    onChange={(e) => setToolInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTool(toolInput);
                      }
                    }}
                    placeholder="+ Add tool (Press Enter)"
                    className="flex-1 min-w-[120px] bg-transparent text-xs text-slate-900 focus:outline-none px-2 py-0.5"
                  />
                </div>

                {/* Popular tools quick chips */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[10px] text-slate-400 font-mono">Suggestions:</span>
                  {commonTools.slice(0, 7).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleAddTool(t)}
                      className="px-2 py-0.5 rounded text-[10px] bg-slate-100 hover:bg-blue-50 hover:text-[#006eff] text-slate-600 transition-colors cursor-pointer"
                    >
                      + {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Client Industry & External Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Client Industry (Optional)</label>
                  <input
                    type="text"
                    value={clientIndustry}
                    onChange={(e) => setClientIndustry(e.target.value)}
                    placeholder="e.g. SaaS, E-commerce, Healthcare"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#006eff] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Live Website / Project URL (Optional)</label>
                  <input
                    type="text"
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#006eff] font-mono transition-all"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setTitle('');
                    setMediaUrl('');
                    setDescription('');
                    setTools(['Figma']);
                    setClientIndustry('');
                    setExternalUrl('');
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Clear Fields
                </button>

                <button
                  type="submit"
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-[#006eff] hover:bg-[#005cd4] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Publish Deliverable to Live Profile</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Live Instant Preview (5 cols) */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
            <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    Live Instant Preview
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Client View
                </span>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                This is exactly how potential clients will interact with this deliverable on your live Gaenr profile:
              </p>

              {/* Live Render Card */}
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#0c182c]">
                {/* Visual Content Display */}
                {mediaUrl ? (
                  embedPreviewUrl ? (
                    <div
                      className="w-full relative overflow-hidden"
                      style={{ aspectRatio: aspectRatio === '1:1' ? '1/1' : aspectRatio === '4:3' ? '4/3' : '16/9' }}
                    >
                      <iframe
                        src={embedPreviewUrl}
                        title={title || 'Deliverable Preview'}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : isVideoMedia ? (
                    <div
                      className="w-full relative bg-black flex items-center justify-center overflow-hidden"
                      style={{ aspectRatio: '16/9' }}
                    >
                      <video
                        src={mediaUrl}
                        controls
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div
                      className="relative w-full overflow-hidden flex items-center justify-center"
                      style={{
                        aspectRatio: aspectRatio === '1:1' ? '1/1' : aspectRatio === '4:3' ? '4/3' : '16/9',
                        background: '#0c182c',
                      }}
                    >
                      <img
                        src={mediaUrl}
                        alt={title || 'Deliverable Preview'}
                        style={{
                          transform: `scale(${zoomLevel})`,
                          transformOrigin: 'center center',
                          transition: 'transform 0.2s ease',
                          maxHeight: '100%',
                          maxWidth: '100%',
                          objectFit: 'contain',
                        }}
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )
                ) : (
                  <div
                    className="w-full flex flex-col items-center justify-center p-12 text-center space-y-2 text-slate-400"
                    style={{ aspectRatio: '16/9' }}
                  >
                    <Layers className="w-10 h-10 text-slate-600 stroke-[1.5]" />
                    <p className="text-xs font-semibold text-slate-300">No Asset Attached Yet</p>
                    <p className="text-[10px] text-slate-500 max-w-xs">
                      Enter a media URL or upload an image on the left to preview the deliverable card.
                    </p>
                  </div>
                )}

                {/* Card Controls Bar */}
                <div className="flex items-center justify-between px-3.5 py-2.5 border-t border-white/10 bg-[#081120]">
                  <div className="min-w-0 pr-2">
                    <h4 className="font-bold text-white text-xs truncate">
                      {title || 'Untitled Deliverable'}
                    </h4>
                    {tools.length > 0 && (
                      <p className="text-[10px] text-white/50 truncate font-mono">
                        {tools.join(' · ')}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setZoomLevel((z) => Math.max(1, +(z - 0.5).toFixed(1)))}
                      disabled={zoomLevel <= 1}
                      className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      title="Zoom out"
                    >
                      -
                    </button>
                    <span className="text-[10px] text-white/60 font-mono w-8 text-center">
                      {Math.round(zoomLevel * 100)}%
                    </span>
                    <button
                      type="button"
                      onClick={() => setZoomLevel((z) => Math.min(3, +(z + 0.5).toFixed(1)))}
                      disabled={zoomLevel >= 3}
                      className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      title="Zoom in"
                    >
                      +
                    </button>
                    {externalUrl && (
                      <a
                        href={externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-7 h-7 rounded-lg bg-white/10 hover:bg-[#006eff] text-white flex items-center justify-center transition-colors"
                        title="Open external link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Meta Summary */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Category</span>
                  <span className="font-bold text-blue-400">{expert.categoryTitle}</span>
                </div>
                {clientIndustry && (
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Industry</span>
                    <span className="font-semibold text-slate-200">{clientIndustry}</span>
                  </div>
                )}
                {description && (
                  <div className="pt-2 border-t border-white/10">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                      Deliverable Scope
                    </span>
                    <p className="text-[11px] text-slate-300 line-clamp-3 leading-relaxed">
                      {description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Published Deliverables for this Expert */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Published Deliverables ({expert.portfolioItems?.length || 0})
              </h3>
              <p className="text-xs text-slate-500">
                All live portfolio items currently showcased on this expert's public profile.
              </p>
            </div>
            <button
              onClick={() => navigate(`/profile/${expert.code}`)}
              className="px-3 py-1.5 rounded-xl bg-blue-50 text-[#006eff] text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>View Full Profile</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {!expert.portfolioItems || expert.portfolioItems.length === 0 ? (
            <div className="p-12 text-center space-y-2 text-slate-400">
              <Layers className="w-10 h-10 mx-auto text-slate-300 stroke-[1.5]" />
              <p className="text-xs font-semibold text-slate-700">No deliverables published yet</p>
              <p className="text-[11px] text-slate-400">
                Use the form above to publish your first deliverable to this expert's profile.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {expert.portfolioItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-video bg-slate-900 overflow-hidden flex items-center justify-center">
                    {item.mediaUrl && !item.mediaUrl.includes('drive.google.com') && !item.mediaUrl.includes('youtube') ? (
                      <img
                        src={item.mediaUrl}
                        alt={item.title}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4 text-center text-slate-400 gap-1.5">
                        <FolderArchive className="w-8 h-8 text-blue-400" />
                        <span className="text-[11px] font-mono font-bold text-white uppercase">
                          {item.previewType}
                        </span>
                      </div>
                    )}
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-mono font-bold border border-white/20">
                      #{idx + 1}
                    </span>
                  </div>

                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.title}</h4>
                      {item.description && (
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2.5 pt-2 border-t border-slate-100">
                      {item.tools && item.tools.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.tools.slice(0, 3).map((t) => (
                            <span
                              key={t}
                              className="px-1.5 py-0.5 rounded text-[9px] bg-slate-100 text-slate-600 font-mono"
                            >
                              {t}
                            </span>
                          ))}
                          {item.tools.length > 3 && (
                            <span className="px-1 py-0.5 rounded text-[9px] bg-slate-100 text-slate-500 font-mono">
                              +{item.tools.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1">
                        {item.mediaUrl ? (
                          <a
                            href={item.mediaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-[#006eff] hover:underline flex items-center gap-1 font-semibold"
                          >
                            <span>Open Asset</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-mono">No direct url</span>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete deliverable "${item.title}"?`)) {
                              deleteExpertPortfolioItem(expert.code, item.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete deliverable"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
