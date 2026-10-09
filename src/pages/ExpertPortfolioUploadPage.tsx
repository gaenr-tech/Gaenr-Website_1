import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useBranding } from '../context/BrandingContext';
import { GaenrLogo } from '../components/common/GaenrLogo';
import { RAW_AVATAR_SPECS, AvatarGraphic, VerifiedBadge3D } from '../components/common/Avatars';
import { PortfolioItem, DeliverableType } from '../types';
import {
  uploadFileToGoogleDrive,
  getGoogleDriveDirectImageUrl,
} from '../utils/googleDriveUpload';
import {
  Upload,
  Sparkles,
  ExternalLink,
  Trash2,
  Eye,
  FileText,
  Layers,
  ChevronRight,
  ShieldCheck,
  Info,
  FileUp,
  Video,
  Image as ImageIcon,
  Globe,
  Link2,
} from 'lucide-react';

interface ExpertPortfolioUploadPageProps {
  tokenOrCode?: string;
  expertCode?: string;
}

export const ExpertPortfolioUploadPage: React.FC<ExpertPortfolioUploadPageProps> = ({
  tokenOrCode,
  expertCode,
}) => {
  const {
    currentRoute,
    freelancers,
    isAdminLoggedIn,
    addExpertPortfolioItem,
    deleteExpertPortfolioItem,
    navigate,
    showToast,
  } = useApp();
  const { branding } = useBranding();

  // Extract secure token or code from route: /u/:token, /p-upload/:token or /expert-portfolio-upload/:tokenOrCode
  const resolvedIdentifier = (
    tokenOrCode ||
    expertCode ||
    currentRoute
      .split('#')[0]
      .split('?')[0]
      .replace('/u/', '')
      .replace('/p-upload/', '')
      .replace('/expert-portfolio-upload/', '')
      .trim()
  );

  // Secure resolution:
  // 1. By high-entropy uploadToken (zero correlation with expert ID)
  // 2. Or if Operations staff is logged in, allow resolving by public code
  const expert = freelancers.find(
    (fl) =>
      fl.uploadToken === resolvedIdentifier ||
      (isAdminLoggedIn && fl.code.toLowerCase() === resolvedIdentifier.toLowerCase())
  );

  // Direct File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string>('');
  const [websiteUrl, setWebsiteUrl] = useState<string>('');
  const [deliverableTitle, setDeliverableTitle] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [fileSizeStr, setFileSizeStr] = useState<string>('');
  const [previewType, setPreviewType] = useState<DeliverableType>('image');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '4:3' | '1:1' | '9:16'>('16:9');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatusMsg, setUploadStatusMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const processFile = (file: File) => {
    // Max 50MB
    if (file.size > 50 * 1024 * 1024) {
      showToast('File size exceeds 50MB limit', 'error');
      return;
    }

    setSelectedFile(file);
    setFileName(file.name);
    setFileSizeStr(formatFileSize(file.size));

    // Determine preview type
    if (file.type.startsWith('image/')) {
      setPreviewType('image');
    } else if (file.type.startsWith('video/')) {
      setPreviewType('video');
    } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      setPreviewType('document');
    } else {
      setPreviewType('image');
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setMediaPreview(dataUrl);
        setZoomLevel(1);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleClearSelected = () => {
    setSelectedFile(null);
    setMediaPreview('');
    setFileName('');
    setFileSizeStr('');
    setWebsiteUrl('');
    setDeliverableTitle('');
    setZoomLevel(1);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUploadAndPublish = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!expert) {
      showToast('Expert profile not found', 'error');
      return;
    }

    const hasWebsiteLink = !!websiteUrl.trim();
    if (!mediaPreview && !hasWebsiteLink) {
      showToast(
        previewType === 'website'
          ? 'Please enter a website link or upload a file'
          : 'Please select a file to upload',
        'error'
      );
      return;
    }

    setIsUploading(true);
    setUploadStatusMsg('Storing and verifying deliverable...');

    const cleanTitle = deliverableTitle.trim()
      ? deliverableTitle.trim()
      : fileName
      ? fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
      : hasWebsiteLink
      ? websiteUrl.replace(/^https?:\/\//, '').replace(/\/.*$/, '') || 'Live Web Deliverable'
      : `Deliverable #${(expert.portfolioItems?.length || 0) + 1}`;

    const formattedTitle =
      cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);

    let finalMediaUrl = mediaPreview || websiteUrl.trim();
    let finalImageUrl: string | undefined = previewType === 'image' ? mediaPreview : undefined;
    let externalDriveUrl: string | undefined = hasWebsiteLink ? websiteUrl.trim() : undefined;

    if (selectedFile) {
      try {
        const driveResult = await uploadFileToGoogleDrive(selectedFile, expert.code);
        if (driveResult.success) {
          if (!hasWebsiteLink) externalDriveUrl = driveResult.fileUrl;
          if (previewType === 'image' && driveResult.directImageUrl) {
            finalMediaUrl = driveResult.directImageUrl;
            finalImageUrl = driveResult.directImageUrl;
          } else if ((previewType === 'video' || previewType === 'document') && driveResult.previewUrl) {
            finalMediaUrl = driveResult.previewUrl;
          } else if (driveResult.downloadUrl || driveResult.fileUrl) {
            if (!hasWebsiteLink) finalMediaUrl = driveResult.downloadUrl || driveResult.fileUrl || mediaPreview;
          }
        }
      } catch (err: any) {
        console.warn('Direct upload error:', err);
      }
    }

    const newItem: PortfolioItem = {
      id: `port-${Date.now()}`,
      title: formattedTitle,
      category: expert.category,
      description: `Verified project deliverable by ${expert.code}.`,
      tools: [expert.categoryTitle],
      previewType: hasWebsiteLink ? 'website' : previewType,
      accentColor: '#006eff',
      aspectRatio: aspectRatio === '9:16' ? '16:9' : (aspectRatio as '16:9' | '4:3' | '1:1'),
      mediaUrl: finalMediaUrl,
      imageUrl: finalImageUrl,
      externalUrl: externalDriveUrl,
    };

    addExpertPortfolioItem(expert.code, newItem);
    setIsUploading(false);
    setUploadStatusMsg('');
    handleClearSelected();
    showToast('Uploaded successfully!', 'success');
  };

  if (!expert) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <Info className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900">Private Portal Access Required</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              This deliverable upload vault requires an authentic, personalized invitation link.
              Please verify the secure upload link provided in your welcome email or contact Gaenr Operations.
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-full py-2.5 bg-[#006eff] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  const isVideoMedia = previewType === 'video' || selectedFile?.type.startsWith('video/');
  const isDocMedia = previewType === 'document' || selectedFile?.type === 'application/pdf';

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-20">
      {/* Top Professional Header Bar */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-2xs backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="hover:opacity-80 transition-opacity cursor-pointer flex items-center gap-2"
              title="Return to Home"
            >
              <GaenrLogo className="h-6 text-slate-900" />
            </button>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-[#006eff]" />
              <span>Verified Creator Workspace</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate(`/profile/${expert.code}`)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Profile</span>
            </button>
            <button
              onClick={() => navigate('/experts')}
              className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#006eff] text-xs font-bold transition-colors cursor-pointer"
            >
              Directory
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Creator Workspace Header Profile Card */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Avatar with Verified Badge Halfway Inside, Halfway Outside */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[#006eff] to-cyan-400 p-[2.5px] shrink-0 shadow-lg shadow-blue-500/20">
              <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-slate-900">
                <AvatarGraphic
                  id={expert.avatarId}
                  size="100%"
                  className="w-full h-full object-cover rounded-full"
                  title={expert.code}
                />
              </div>
              <div
                className="absolute bottom-[2px] right-[2px] sm:bottom-[3px] sm:right-[3px] z-10"
                title="Verified Expert"
              >
                <VerifiedBadge3D size={26} className="drop-shadow-[0_0_8px_rgba(0,110,255,0.85)]" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-mono">
                  {expert.code}
                </h1>
                <div className="flex items-center gap-1.5">
                  <VerifiedBadge3D size={18} />
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    Verified Creator
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                  {expert.categoryTitle}
                </span>
              </div>
              <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
                Welcome to your creator workspace. Upload your project deliverables directly below. Deliverables are verified and showcased on your live client profile.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
            <button
              onClick={() => navigate(`/profile/${expert.code}`)}
              className="px-4 py-2 bg-[#006eff] hover:bg-[#005cd4] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <span>View Public Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Two-Column: Direct File Upload on Left, Live Instant Preview on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Upload Box (6 cols) */}
          <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-[#006eff]" />
                  <span>Upload Deliverable</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Drop your showcase file below to publish directly to your live verified profile.
                </p>
              </div>
            </div>

            <form onSubmit={handleUploadAndPublish} className="space-y-4">
              {/* Optional Custom Deliverable Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Project / Deliverable Title (Optional)</label>
                <input
                  type="text"
                  value={deliverableTitle}
                  onChange={(e) => setDeliverableTitle(e.target.value)}
                  placeholder="e.g. Modern E-commerce Store Architecture"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#006eff]"
                />
              </div>

              {/* Minimal Options: Format & Aspect Ratio */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Display Format</label>
                  <select
                    value={previewType}
                    onChange={(e) => setPreviewType(e.target.value as DeliverableType)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#006eff] cursor-pointer"
                  >
                    <option value="image">Image Showcase / Artwork</option>
                    <option value="video">Video Showcase / Reel (MP4)</option>
                    <option value="document">PDF / Presentation Deck</option>
                    <option value="website">Web / Interactive Mockup</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Aspect Ratio</label>
                  <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#006eff] cursor-pointer"
                  >
                    <option value="16:9">16:9 (Landscape / Video)</option>
                    <option value="4:3">4:3 (Presentation / Standard)</option>
                    <option value="1:1">1:1 (Square / Social Creative)</option>
                    <option value="9:16">9:16 (Vertical / Mobile Reel)</option>
                  </select>
                </div>
              </div>

              {/* Dedicated Website / Interactive Mockup Link Input */}
              {previewType === 'website' && (
                <div className="space-y-2 p-4 bg-blue-50/80 border border-blue-200 rounded-2xl transition-all">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-[#006eff]" />
                      <span>Live Website / Interactive Mockup URL</span>
                    </label>
                    <span className="text-[10px] font-mono text-[#006eff] bg-blue-100 px-2 py-0.5 rounded-full font-bold">
                      Direct Link Mode
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    আপনার তৈরি করা লাইভ ওয়েবসাইট, ওয়ার্ডপ্রেস পোর্টাল বা ফিগমা প্রোটোটাইপ লিঙ্ক এখানে পেস্ট করুন। লিঙ্ক দিলে কোনো ফাইল আপলোড করার প্রয়োজন নেই (যেকোনো একটা দিলেই হবে)।
                  </p>
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://your-wordpress-site.com or https://figma.com/proto/..."
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#006eff] focus:ring-1 focus:ring-[#006eff]"
                  />
                </div>
              )}

              {/* Drag and Drop File Upload Area */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-7 sm:p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2.5 ${
                  mediaPreview
                    ? 'border-emerald-400 bg-emerald-50/20'
                    : 'border-slate-300 hover:border-[#006eff] bg-slate-50/60 hover:bg-blue-50/30'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {mediaPreview ? (
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-2xs">
                      {isVideoMedia ? (
                        <Video className="w-6 h-6" />
                      ) : isDocMedia ? (
                        <FileText className="w-6 h-6" />
                      ) : (
                        <ImageIcon className="w-6 h-6" />
                      )}
                    </div>
                    <div className="font-bold text-slate-900 text-xs truncate max-w-xs mx-auto">
                      {fileName}
                    </div>
                    <div className="text-[11px] text-emerald-700 font-mono font-semibold">
                      {fileSizeStr} • Ready to Publish
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearSelected();
                      }}
                      className="text-xs text-rose-600 hover:underline pt-1 inline-block font-semibold"
                    >
                      Change or remove file
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#006eff] flex items-center justify-center shadow-2xs">
                      <FileUp className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-800">
                        {previewType === 'website'
                          ? 'Optional: Upload cover screenshot or mockup file'
                          : 'Click to browse or drag and drop your file here'}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {previewType === 'website'
                          ? 'লিঙ্ক দিয়েছেন? তাহলে ফাইল আপলোড ঐচ্ছিক (যেকোনো একটা দিলেই হবে)।'
                          : 'Supports Images (PNG, JPG, WebP), Videos (MP4) & Presentations (PDF)'}
                      </p>
                    </div>
                    <span className="px-3 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 text-[10px] font-mono font-bold shadow-2xs mt-0.5">
                      Max file size: 50MB
                    </span>
                  </>
                )}
              </div>

              {/* Upload & Publish Button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                {(mediaPreview || websiteUrl.trim()) && (
                  <button
                    type="button"
                    onClick={handleClearSelected}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Clear
                  </button>
                )}

                <button
                  type="submit"
                  disabled={(!mediaPreview && !websiteUrl.trim()) || isUploading}
                  className="flex-1 py-3 px-6 bg-[#006eff] hover:bg-[#005cd4] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {isUploading ? (uploadStatusMsg || 'Storing & Publishing Deliverable...') : 'Publish Deliverable'}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Live Instant Preview (6 cols) */}
          <div className="lg:col-span-6 space-y-4 lg:sticky lg:top-24">
            <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    Live Client Preview
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Exact Profile Representation
                </span>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                This is exactly how potential clients interact with this deliverable on your live Gaenr profile:
              </p>

              {/* Render Card matching Profile Page design */}
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#0c182c]">
                {websiteUrl.trim() && !mediaPreview ? (
                  /* Live Website Browser Frame Mockup */
                  <div
                    className="w-full bg-[#070e1c] flex flex-col justify-between p-4 sm:p-6"
                    style={{ aspectRatio: '16/9' }}
                  >
                    {/* Browser top navigation bar */}
                    <div className="flex items-center gap-2 pb-2.5 border-b border-white/10">
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      </div>
                      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-md px-2.5 py-1 text-[9px] sm:text-[10px] font-mono text-cyan-300 truncate flex items-center gap-1.5">
                        <span className="text-slate-500">https://</span>
                        <span className="truncate">{websiteUrl.replace(/^https?:\/\//, '')}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
                        LIVE WEB
                      </span>
                    </div>

                    {/* Website Center View */}
                    <div className="flex flex-col items-center justify-center text-center space-y-2 py-6">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-lg">
                        <Globe className="w-6 h-6" />
                      </div>
                      <h4 className="text-white font-extrabold text-sm sm:text-base tracking-tight line-clamp-1 px-2">
                        {deliverableTitle || websiteUrl.replace(/^https?:\/\//, '').replace(/\/.*$/, '')}
                      </h4>
                      <p className="text-[11px] text-slate-400 max-w-sm px-2">
                        Verified Live Web Deliverable &amp; Interactive Preview
                      </p>
                    </div>

                    {/* Browser footer */}
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[9px] font-mono text-slate-400">
                      <span>CORE WEB VITALS: 95+</span>
                      <a
                        href={websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>Open Live Website</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ) : mediaPreview ? (
                  isVideoMedia ? (
                    <div
                      className="w-full relative bg-black flex items-center justify-center overflow-hidden"
                      style={{
                        aspectRatio:
                          aspectRatio === '1:1'
                            ? '1/1'
                            : aspectRatio === '4:3'
                            ? '4/3'
                            : aspectRatio === '9:16'
                            ? '9/16'
                            : '16/9',
                      }}
                    >
                      <video
                        src={mediaPreview}
                        controls
                        playsInline
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : isDocMedia ? (
                    <div
                      className="w-full relative bg-slate-950 flex flex-col items-center justify-center p-8 text-center space-y-3"
                      style={{ aspectRatio: '16/9' }}
                    >
                      <FileText className="w-12 h-12 text-blue-400" />
                      <p className="text-xs font-bold text-white truncate max-w-xs">{fileName}</p>
                      <span className="text-[10px] text-slate-400 font-mono">PDF Document Ready</span>
                    </div>
                  ) : (
                    <div
                      className="relative w-full overflow-hidden flex items-center justify-center"
                      style={{
                        aspectRatio:
                          aspectRatio === '1:1'
                            ? '1/1'
                            : aspectRatio === '4:3'
                            ? '4/3'
                            : aspectRatio === '9:16'
                            ? '9/16'
                            : '16/9',
                        background: '#0c182c',
                      }}
                    >
                      <img
                        src={mediaPreview}
                        alt="Deliverable Preview"
                        style={{
                          transform: `scale(${zoomLevel})`,
                          transformOrigin: 'center center',
                          transition: 'transform 0.2s ease',
                          maxHeight: '100%',
                          maxWidth: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    </div>
                  )
                ) : (
                  <div
                    className="w-full flex flex-col items-center justify-center p-14 text-center space-y-2 text-slate-400"
                    style={{ aspectRatio: '16/9' }}
                  >
                    <Layers className="w-10 h-10 text-slate-600 stroke-[1.5]" />
                    <p className="text-xs font-semibold text-slate-300">No Asset Selected</p>
                    <p className="text-[10px] text-slate-500 max-w-xs">
                      Enter a website URL or select/drop a file on the left to see the instant preview here.
                    </p>
                  </div>
                )}

                {/* Card Controls Bar */}
                <div className="flex items-center justify-between px-3.5 py-2.5 border-t border-white/10 bg-[#081120]">
                  <div className="min-w-0 pr-2">
                    <h4 className="font-bold text-white text-xs truncate">
                      {deliverableTitle || fileName || (websiteUrl ? websiteUrl.replace(/^https?:\/\//, '').replace(/\/.*$/, '') : 'Deliverable Preview')}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {expert.categoryTitle}
                    </span>
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: My Published Portfolio Items */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                My Published Deliverables ({expert.portfolioItems?.length || 0})
              </h3>
              <p className="text-xs text-slate-500">
                All showcase items currently live on your public Gaenr profile.
              </p>
            </div>

            <button
              onClick={() => navigate(`/profile/${expert.code}`)}
              className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-[#006eff] text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>View On Live Profile</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {!expert.portfolioItems || expert.portfolioItems.length === 0 ? (
            <div className="p-12 text-center space-y-2 text-slate-400">
              <Layers className="w-10 h-10 mx-auto text-slate-300 stroke-[1.5]" />
              <p className="text-xs font-semibold text-slate-700">No deliverables uploaded yet</p>
              <p className="text-[11px] text-slate-400">
                Use the direct upload box above to add your first portfolio item.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {expert.portfolioItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-video bg-slate-950 overflow-hidden flex items-center justify-center">
                    {item.previewType === 'image' && (item.imageUrl || item.mediaUrl) ? (
                      <img
                        src={getGoogleDriveDirectImageUrl(item.imageUrl || item.mediaUrl || '')}
                        alt={item.title}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : item.previewType === 'video' ? (
                      <div className="flex flex-col items-center justify-center gap-1 text-white">
                        <Video className="w-8 h-8 text-rose-500" />
                        <span className="text-[10px] font-mono">Video Deliverable</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-1 text-white">
                        <FileText className="w-8 h-8 text-blue-400" />
                        <span className="text-[10px] font-mono">Verified Deliverable</span>
                      </div>
                    )}
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-mono font-bold border border-white/20">
                      #{idx + 1}
                    </span>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.title}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {item.previewType.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono font-bold">
                        Live on Profile
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Remove "${item.title}" from your profile?`)) {
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
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
