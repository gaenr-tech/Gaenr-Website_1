import React, { useState, useRef, useEffect } from 'react';
import { FreelancerProfile, PortfolioItem, DELIVERABLE_TYPE_OPTIONS } from '../../../types';
import { AvatarGraphic } from '../../../components/common/Avatars';
import { useBranding } from '../../../context/BrandingContext';
import {
  Upload,
  Plus,
  Trash2,
  FolderKanban,
  CheckCircle,
  Link as LinkIcon,
  Link2,
  Play,
  Globe,
  Search,
  ChevronDown,
  X,
  FileImage,
  FileText,
  Sparkles,
  Code,
  Share2,
} from 'lucide-react';
import { CustomSelect } from '../../../components/common/CustomSelect';

interface PortfolioManageViewProps {
  freelancers: FreelancerProfile[];
  selectedCode?: string;
  onUpdateFreelancer: (updated: FreelancerProfile) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  navigate: (route: string) => void;
}

export const PortfolioManageView: React.FC<PortfolioManageViewProps> = ({
  freelancers,
  selectedCode,
  onUpdateFreelancer,
  showToast,
}) => {
  const { branding } = useBranding();
  const [activeCode, setActiveCode] = useState<string>(
    selectedCode || freelancers[0]?.code || ''
  );
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [profileSearch, setProfileSearch] = useState('');
  const selectorRef = useRef<HTMLDivElement>(null);

  // Sync if selectedCode prop changes
  useEffect(() => {
    if (selectedCode) {
      setActiveCode(selectedCode);
    }
  }, [selectedCode]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(e.target as Node)) {
        setIsSelectorOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedFreelancer =
    freelancers.find((f) => f.code === activeCode) || freelancers[0];

  const filteredProfiles = freelancers.filter((f) => {
    if (!profileSearch.trim()) return true;
    const q = profileSearch.toLowerCase();
    return (
      f.code.toLowerCase().includes(q) ||
      f.categoryTitle.toLowerCase().includes(q) ||
      (f.name && f.name.toLowerCase().includes(q))
    );
  });

  // Portfolio deliverable link state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaType, setMediaType] = useState<string>('website');
  const [mediaUrl, setMediaUrl] = useState('');
  const [toolsInput, setToolsInput] = useState('');
  const [description, setDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      showToast('Please select a valid image or video file', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const dataUrl = event.target.result as string;
        setMediaUrl(dataUrl);
        if (file.type.startsWith('image/')) {
          setMediaType('image');
        } else if (file.type.startsWith('video/')) {
          setMediaType('video');
        }
        if (!mediaTitle.trim()) {
          const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          setMediaTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
        }
        showToast('File loaded for portfolio preview!', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadPortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFreelancer) return;
    if (!mediaTitle.trim()) {
      showToast('Please provide a portfolio deliverable title', 'error');
      return;
    }

    const trimmedUrl = mediaUrl.trim();
    if (!trimmedUrl) {
      showToast('Please provide a valid deliverable URL link or upload a file', 'error');
      return;
    }

    let finalType = mediaType;
    if (trimmedUrl.startsWith('data:image') || trimmedUrl.match(/\.(jpeg|jpg|gif|png|webp|svg)($|\?)/i)) {
      finalType = 'image';
    } else if (
      trimmedUrl.startsWith('data:video') ||
      trimmedUrl.match(/\.(mp4|webm|ogg)($|\?)/i) ||
      trimmedUrl.includes('youtube.com') ||
      trimmedUrl.includes('youtu.be') ||
      trimmedUrl.includes('vimeo.com') ||
      trimmedUrl.includes('loom.com')
    ) {
      finalType = 'video';
    } else if (trimmedUrl.includes('figma.com')) {
      finalType = 'figma';
    } else if (
      trimmedUrl.includes('docs.google.com/presentation') ||
      trimmedUrl.includes('canva.com') ||
      trimmedUrl.match(/\.pdf($|\?)/i)
    ) {
      finalType = 'document';
    }

    const newItem: PortfolioItem = {
      id: `port-${Date.now()}`,
      title: mediaTitle.trim(),
      category: selectedFreelancer.category,
      description:
        description.trim() ||
        `Verified portfolio deliverable by ${selectedFreelancer.code}.`,
      tools: toolsInput
        ? toolsInput.split(',').map((t) => t.trim()).filter(Boolean)
        : ['Verified Toolset'],
      previewType: finalType,
      accentColor: '#006eff',
      aspectRatio: '16:9',
      mediaUrl: trimmedUrl || undefined,
      imageUrl:
        finalType === 'image' ||
        trimmedUrl.startsWith('data:image') ||
        trimmedUrl.match(/\.(jpeg|jpg|gif|png|webp|svg)($|\?)/i)
          ? trimmedUrl
          : undefined,
      externalUrl: trimmedUrl.startsWith('http') ? trimmedUrl : undefined,
    };

    const updatedFreelancer: FreelancerProfile = {
      ...selectedFreelancer,
      portfolioItems: [newItem, ...(selectedFreelancer.portfolioItems || [])],
    };

    onUpdateFreelancer(updatedFreelancer);
    showToast(
      `Added deliverable "${newItem.title}" to ${selectedFreelancer.code}'s portfolio!`,
      'success'
    );

    // Reset form
    setMediaTitle('');
    setMediaUrl('');
    setToolsInput('');
    setDescription('');
    setShowUploadModal(false);
  };

  const handleRemovePortfolioItem = (itemId: string) => {
    if (!selectedFreelancer) return;
    const confirmDelete = window.confirm(
      'Are you sure you want to remove this portfolio item?'
    );
    if (!confirmDelete) return;

    const updatedItems = selectedFreelancer.portfolioItems.filter(
      (item) => item.id !== itemId
    );
    const updatedFreelancer: FreelancerProfile = {
      ...selectedFreelancer,
      portfolioItems: updatedItems,
    };

    onUpdateFreelancer(updatedFreelancer);
    showToast('Portfolio item removed successfully', 'info');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Portfolio Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Select an expert profile to manage and organize their showcase portfolio deliverable links.
          </p>
        </div>
      </div>

      {/* Single Expert Profile Selector & Focused Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          {/* Active Expert Profile Overview (One at a time) */}
          {selectedFreelancer ? (
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#006eff] to-cyan-400 p-[2px] shadow-sm shrink-0">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                  <AvatarGraphic id={selectedFreelancer.avatarId} size={48} shape="circle" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-lg font-black text-slate-900">
                    {selectedFreelancer.code}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                      selectedFreelancer.isPublic
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {selectedFreelancer.isPublic ? 'PUBLIC' : 'DRAFT'}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-semibold text-slate-600">
                    {selectedFreelancer.categoryTitle}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs font-mono text-blue-600 font-semibold">
                    {selectedFreelancer.portfolioItems?.length || 0} items uploaded
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-400">No profile selected.</div>
          )}

          {/* Expert Switcher Selector Dropdown */}
          <div className="flex items-center gap-3">
            <div className="relative" ref={selectorRef}>
              <button
                type="button"
                onClick={() => setIsSelectorOpen(!isSelectorOpen)}
                className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <span>Select Profile:</span>
                <span className="font-mono text-[#006eff]">
                  {selectedFreelancer?.code || 'Choose'}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {isSelectorOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-30 space-y-2 animate-in fade-in zoom-in-95">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search expert code..."
                      value={profileSearch}
                      onChange={(e) => setProfileSearch(e.target.value)}
                      className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:border-[#006eff] focus:outline-none"
                    />
                  </div>

                  <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
                    {filteredProfiles.length === 0 ? (
                      <div className="p-3 text-center text-xs text-slate-400">
                        No profiles found
                      </div>
                    ) : (
                      filteredProfiles.map((fl) => (
                        <button
                          key={fl.code}
                          type="button"
                          onClick={() => {
                            setActiveCode(fl.code);
                            setIsSelectorOpen(false);
                          }}
                          className={`w-full p-2 rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer ${
                            activeCode === fl.code
                              ? 'bg-blue-50 text-[#006eff] font-bold border border-blue-200/80'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                              <AvatarGraphic id={fl.avatarId} size={20} shape="circle" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-mono text-xs truncate">{fl.code}</div>
                              <div className="text-[10px] text-slate-400 truncate">
                                {fl.categoryTitle}
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                            {fl.portfolioItems?.length || 0}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Selected Profile's Portfolio Showcase Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Portfolio Deliverables ({selectedFreelancer?.portfolioItems?.length || 0})
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Live client-facing showcase deliverables for {selectedFreelancer?.code}
            </p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-[#006eff] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Deliverable Link</span>
          </button>
        </div>

        {/* Attached Portfolio Items Grid for the Selected Profile */}
        {!selectedFreelancer?.portfolioItems || selectedFreelancer.portfolioItems.length === 0 ? (
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400 space-y-2">
            <FolderKanban className="w-10 h-10 mx-auto text-slate-300" />
            <div>
              <p className="text-xs font-semibold text-slate-700">
                No portfolio deliverable links added yet
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Use the "Add Deliverable Link" button above to add showcase links for {selectedFreelancer?.code}.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {selectedFreelancer.portfolioItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                {/* Media Preview Box */}
                <div className="h-44 bg-slate-900 relative p-3 flex flex-col justify-between overflow-hidden">
                  {/* Thumbnail background if mediaUrl is an image */}
                  {(item.mediaUrl || item.imageUrl) && (item.previewType === 'image' || item.previewType === 'social' || item.mediaUrl?.match(/\.(jpeg|jpg|gif|png|webp|svg)($|\?)/i)) ? (
                    <img
                      src={item.mediaUrl || item.imageUrl}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-85"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center bg-slate-900/95 space-y-2">
                      {item.previewType === 'video' ? (
                        <Play className="w-10 h-10 text-rose-500 opacity-90" />
                      ) : item.previewType === 'website' ? (
                        <Globe className="w-10 h-10 text-cyan-400 opacity-90" />
                      ) : item.previewType === 'figma' ? (
                        <Sparkles className="w-10 h-10 text-purple-400 opacity-90" />
                      ) : item.previewType === 'drive' ? (
                        <FolderKanban className="w-10 h-10 text-emerald-400 opacity-90" />
                      ) : item.previewType === 'code' ? (
                        <Code className="w-10 h-10 text-slate-300 opacity-90" />
                      ) : item.previewType === 'social' ? (
                        <Share2 className="w-10 h-10 text-pink-400 opacity-90" />
                      ) : item.previewType === 'document' ? (
                        <FileText className="w-10 h-10 text-amber-400 opacity-90" />
                      ) : (
                        <FileImage className="w-10 h-10 text-blue-400 opacity-70" />
                      )}
                      <span className="text-[11px] font-bold text-slate-300 line-clamp-1 max-w-[85%]">
                        {item.title}
                      </span>
                    </div>
                  )}

                  {/* Top Bar inside thumbnail */}
                  <div className="flex justify-between items-start z-10">
                    <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[10px] font-mono text-cyan-300 font-bold border border-white/10 shadow-2xs">
                      {item.previewType?.toUpperCase()}
                    </span>
                    {/* Remove button */}
                    <button
                      onClick={() => handleRemovePortfolioItem(item.id)}
                      className="p-1.5 bg-black/70 hover:bg-rose-600 text-white rounded-lg shadow-2xs transition-colors cursor-pointer border border-white/10"
                      title="Remove portfolio item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Watermark overlay - Render BOTH image and text */}
                  <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10 overflow-hidden"
                    style={{ opacity: (branding?.watermarkOpacity ?? 15) / 100 }}
                  >
                    <div
                      className={`flex flex-col items-center justify-center gap-1 text-center drop-shadow-md transition-all ${
                        branding?.watermarkPosition === 'bottom-right'
                          ? 'absolute bottom-2 right-2 scale-90'
                          : branding?.watermarkPosition === 'center'
                          ? ''
                          : 'rotate-[-25deg]'
                      }`}
                    >
                      {branding?.watermarkImage && (
                        branding.watermarkImage === '/logo.svg' ? (
                          <div className="w-8 h-8 flex items-center justify-center">
                            <img src="/logo.svg" alt="Watermark" className="w-full h-full object-contain filter brightness-200" />
                          </div>
                        ) : (
                          <img
                            src={branding.watermarkImage}
                            alt="Watermark"
                            className="max-w-[100px] max-h-[36px] object-contain drop-shadow"
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = 'none';
                            }}
                          />
                        )
                      )}
                      {branding?.watermarkText && (
                        <span className="text-white font-black text-[10px] tracking-widest uppercase whitespace-nowrap">
                          {branding.watermarkText}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Tool tags */}
                  <div className="z-10 flex flex-wrap gap-1">
                    {item.tools?.map((tool) => (
                      <span
                        key={tool}
                        className="px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-medium"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Metadata & Actions */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-slate-900 text-xs truncate flex-1">
                      {item.title}
                    </h3>
                    {(item.mediaUrl || item.externalUrl) && (
                      <a
                        href={item.mediaUrl || item.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#006eff] hover:text-blue-700 p-1 hover:bg-blue-50 rounded shrink-0"
                        title="Open deliverable link"
                      >
                        <Globe className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Aspect: {item.aspectRatio || '16:9'}</span>
                    <button
                      onClick={() => handleRemovePortfolioItem(item.id)}
                      className="text-rose-600 hover:underline font-semibold cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Direct Upload Portfolio Modal */}
      {showUploadModal && selectedFreelancer && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowUploadModal(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in overflow-y-auto"
        >
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 my-auto max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#006eff] border border-blue-200 flex items-center justify-center shrink-0">
                  <Link2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Add Deliverable Link
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Attach live showcase work link to expert {selectedFreelancer.code}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadPortfolio} className="space-y-4 text-xs">
              {/* Project Title */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Deliverable Item Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Modern Fintech Brand Identity &amp; Logo Guidelines"
                  value={mediaTitle}
                  onChange={(e) => setMediaTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-[#006eff] focus:outline-none"
                />
              </div>

              {/* Deliverable Type */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Deliverable Type
                </label>
                <CustomSelect
                  value={mediaType}
                  onChange={(val) => setMediaType(val)}
                  options={DELIVERABLE_TYPE_OPTIONS}
                />
              </div>

              {/* Deliverable Media / Link Input Section */}
              <div className="p-4 bg-blue-50/40 border border-blue-100 rounded-2xl space-y-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/webp, image/svg+xml, video/mp4, video/webm"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelect(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />

                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-800">
                    Deliverable Media / Link <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-50 text-[#006eff] border border-blue-200 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload File</span>
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Paste link: Google Drive, Figma, Google Slides, YouTube, Loom, Canva, Web URL or upload file"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:border-[#006eff] focus:outline-none shadow-2xs"
                  />
                  <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                </div>
                <p className="text-[11px] text-slate-500">
                  Upload an image/video file directly or paste any live URL (Google Drive, Figma, Google Slides, YouTube, Loom, Canva, Web URL).
                </p>

                {/* Live Preview */}
                {mediaUrl.trim() && (
                  <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-3">
                    <div className="w-14 h-12 bg-slate-100 rounded-lg overflow-hidden shrink-0 flex items-center justify-center border border-slate-200">
                      {mediaUrl.startsWith('data:image') ||
                      mediaUrl.match(/\.(jpeg|jpg|gif|png|webp|svg)($|\?)/i) ? (
                        <img
                          src={mediaUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : mediaUrl.includes('youtube.com') || mediaUrl.includes('youtu.be') ? (
                        <Play className="w-5 h-5 text-rose-500" />
                      ) : (
                        <Globe className="w-5 h-5 text-[#006eff]" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] font-bold text-slate-800 block truncate">
                        Deliverable Link Ready
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono truncate block">
                        {mediaUrl.slice(0, 50)}...
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-mono border border-emerald-200 font-bold shrink-0">
                      Ready
                    </span>
                  </div>
                )}
              </div>

              {/* Tools Used */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tools Used (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Figma, Adobe Illustrator, Photoshop"
                  value={toolsInput}
                  onChange={(e) => setToolsInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-[#006eff] focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Deliverable Description (optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief description of the deliverable outcome..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-[#006eff] focus:outline-none resize-none"
                />
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#006eff] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Add Deliverable Link</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
