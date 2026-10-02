import React, { useState, useRef } from 'react';
import { useApp } from '../../../context/AppContext';
import { FreelancerProfile, ServiceCategory, AvatarAsset, ServiceSlug, ExpertPricingTier, PortfolioItem, DeliverableType, DELIVERABLE_TYPE_OPTIONS } from '../../../types';
import { AvatarGraphic, getOfficialAvatarUrl, getCategoryAvatar, RAW_AVATAR_SPECS, CategoryAvatarMeta } from '../../../components/common/Avatars';
import {
  ArrowLeft,
  Briefcase,
  User,
  CreditCard,
  FileText,
  Sparkles,
  CheckCircle2,
  Lock,
  Plus,
  Trash2,
  Loader2,
  FolderKanban,
  ExternalLink,
  ChevronDown,
  Globe,
  Eye,
  Link as LinkIcon,
  Play,
} from 'lucide-react';

import { CustomSelect, SelectOption } from '../../../components/common/CustomSelect';

interface InitialPortfolioInput {
  id: string;
  title: string;
  mediaUrl: string;
  toolsInput: string;
  description: string;
}

interface ProfileCreateViewProps {
  categories: ServiceCategory[];
  avatars: AvatarAsset[];
  addFreelancer: (fl: FreelancerProfile) => void;
  navigate: (route: string) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onAddAvatar?: (avatar: AvatarAsset) => void;
}

export const ProfileCreateView: React.FC<ProfileCreateViewProps> = ({
  categories,
  avatars,
  addFreelancer,
  navigate,
  showToast,
  onAddAvatar,
}) => {
  // Form fields
  const [category, setCategory] = useState<ServiceSlug>(
    (categories[0]?.slug as ServiceSlug) || 'graphics-design'
  );
  const [mediaType, setMediaType] = useState<string>('website');
  const [statement, setStatement] = useState<string>('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Third Gender'>('Male');
  const [address, setAddress] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [privateEmail, setPrivateEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('+880 ');
  const [additionalNote, setAdditionalNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'MFS' | 'Bank Transfer'>('MFS');
  const [paymentDetails, setPaymentDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialPortfolio, setInitialPortfolio] = useState<InitialPortfolioInput[]>([]);

  // Service Pricing Tiers
  const [pricingTiers, setPricingTiers] = useState<ExpertPricingTier[]>([
    { id: 'price-1', serviceName: '', price: '' },
  ]);

  const handleAddPricingTier = () => {
    setPricingTiers([
      ...pricingTiers,
      { id: `price-${Date.now()}`, serviceName: '', price: '' },
    ]);
  };

  const handleRemovePricingTier = (id: string) => {
    if (pricingTiers.length <= 1) return;
    setPricingTiers(pricingTiers.filter((p) => p.id !== id));
  };

  const handleUpdatePricingTier = (id: string, field: 'serviceName' | 'price', val: string) => {
    setPricingTiers(
      pricingTiers.map((p) => (p.id === id ? { ...p, [field]: val } : p))
    );
  };

  // Suggested skills by category
  const skillsByCategory: Record<string, string[]> = {
    'graphics-design': ['Logo Design', 'Brand Guidelines', 'Social Media Posts', 'Packaging', 'Vector Art', 'Illustrator', 'Photoshop'],
    'content-writing': ['SEO Articles', 'Website Copywriting', 'UX Copy', 'Blog Posts', 'Product Descriptions', 'Proofreading'],
    'video-editing': ['Short-form Reels', 'YouTube Long-form', 'Color Grading', 'Sound Design', 'Motion Graphics', 'Premiere Pro'],
    'wordpress-website': ['Custom WordPress Theme', 'WooCommerce Setup', 'bKash Gateway Integration', 'Elementor', 'Page Speed (90+)', 'Tailwind CSS'],
    'presentation-slide-design': ['Pitch Decks', 'Investor Slides', 'Keynote', 'PowerPoint', 'Infographics', 'Financial Charts'],
    'ux-ui-design': ['Figma Design System', 'Mobile App UX', 'Wireframing', 'Interactive Prototypes', 'SaaS Dashboard', 'Usability Audits'],
    'ad-running': ['Meta Ads Manager', 'Google Search Ads', 'Audience Retargeting', 'A/B Creative Testing', 'Pixel Setup', 'Campaign Analytics'],
  };

  const suggestedSkills = skillsByCategory[category] || ['Communication', 'Fast Delivery', 'Problem Solving'];

  const handleToggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddCustomSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillsInput.trim()) {
      e.preventDefault();
      if (!selectedSkills.includes(skillsInput.trim())) {
        setSelectedSkills([...selectedSkills, skillsInput.trim()]);
      }
      setSkillsInput('');
    }
  };

  const { freelancers } = useApp();

  // Generate fully randomized alphanumeric unique code (letters + numbers, no skill prefix)
  const generateRandomAlphanumericCode = (existing: string[]): string => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 200) {
      code = '';
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      if (!existing.includes(code.toUpperCase())) {
        isUnique = true;
      }
      attempts++;
    }
    return code;
  };

  const [generatedCode] = useState<string>(() => {
    const existing = (freelancers || []).map((f) => f.code.toUpperCase());
    return generateRandomAlphanumericCode(existing);
  });

  const catObj = categories.find((c) => c.slug === category);

  const autoAvatar = getCategoryAvatar(
    category,
    generatedCode,
    gender === 'Male' ? 'male' : gender === 'Female' ? 'female' : 'third_gender'
  );

  const [selectedAvatarId, setSelectedAvatarId] = useState<string>('');

  // Active avatar is either the chosen one, or the auto-recommended one
  const activeAvatar = RAW_AVATAR_SPECS.find((a) => a.id === selectedAvatarId) || autoAvatar;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('Please enter the expert real name for internal records', 'error');
      const nameEl = document.getElementById('expert-real-name');
      if (nameEl) {
        nameEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        nameEl.focus();
      }
      return;
    }

    try {
      setIsSubmitting(true);

      // Map initial portfolio items entered by admin (if any)
      const createdPortfolioItems: PortfolioItem[] = initialPortfolio
        .filter((p) => p.title.trim() || p.mediaUrl.trim())
        .map((p, idx) => {
          const trimmedUrl = p.mediaUrl.trim();
          const isImage = trimmedUrl.startsWith('data:image') || trimmedUrl.match(/\.(jpeg|jpg|gif|png|webp|svg)($|\?)/i);
          const tools = p.toolsInput.trim()
            ? p.toolsInput.split(',').map((t) => t.trim()).filter(Boolean)
            : selectedSkills.length > 0 ? selectedSkills.slice(0, 3) : ['Verified Toolset'];
          const selectedType = mediaType || (isImage ? 'image' : 'website');
          return {
            id: `port-${Date.now()}-${idx}`,
            title: p.title.trim() || 'Deliverable Project',
            category,
            description: p.description.trim() || `Verified deliverable for ${generatedCode}.`,
            tools,
            previewType: selectedType as DeliverableType,
            accentColor: '#006eff',
            aspectRatio: '16:9',
            mediaUrl: trimmedUrl || undefined,
            imageUrl: isImage ? trimmedUrl : undefined,
            externalUrl: trimmedUrl.startsWith('http') ? trimmedUrl : undefined,
          };
        });

      const newProfile: FreelancerProfile = {
        id: `fl-${Date.now()}`,
        code: generatedCode,
        category,
        categoryTitle: catObj?.title || 'Creative Discipline',
        avatarId: activeAvatar.id,
        rating: 0.0,
        reviewsCount: 0,
        completedProjects: 0,
        statement: statement.trim(),
        status: 'active',
        isPublic: true, // Newly created profiles are immediately published to the directory
        satisfactionRate: {
          satisfied: 0,
          neutral: 0,
          unsatisfied: 0,
        },
        reviews: [],
        portfolioItems: createdPortfolioItems,
        skills: selectedSkills,
        // Private internal fields
        name: name.trim(),
        gender,
        address: address.trim(),
        privateEmail: privateEmail.trim(),
        contactNumber: contactNumber.trim(),
        additionalNote: additionalNote.trim(),
        paymentMethod,
        paymentDetails: paymentDetails.trim(),
        mediaType,
        pricingTiers: pricingTiers.filter((p) => p.serviceName.trim() && p.price.trim()),
      };

      addFreelancer(newProfile);
      showToast(`Expert Profile ${generatedCode} created successfully!`, 'success');
      navigate('/manage/profiles');
    } catch (err) {
      console.error(err);
      showToast('Failed to create profile. Please check required fields.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6 max-w-4xl mx-auto pb-16 px-3 sm:px-0">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => navigate('/manage/profiles')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Expert Management</span>
        </button>
      </div>

      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Create Expert Profile
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Register a verified expert with public statement, portfolio deliverables, and payout credentials.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        {/* Unique Expert Code & Selected Avatar Banner */}
        <div className="p-4 sm:p-5 bg-white border border-slate-200/90 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#006eff] to-cyan-400 p-[2.5px] shadow-sm shrink-0">
              <div className="w-full h-full rounded-full bg-[#eef2f6] overflow-hidden flex items-center justify-center">
                <AvatarGraphic
                  id={activeAvatar.id}
                  size="100%"
                  shape="circle"
                  className="w-full h-full rounded-full"
                  title={activeAvatar.name}
                />
              </div>
            </div>
            <div className="space-y-1 min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                Expert ID &amp; Selected Portrait
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xl sm:text-2xl font-black text-[#006eff] tracking-wider">
                  {generatedCode}
                </span>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>{activeAvatar.name}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 1: Service Discipline & Media Type */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#006eff]" />
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
              1. Service Discipline &amp; Media Specifications
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Service Category <span className="text-rose-500">*</span>
              </label>
              <CustomSelect
                value={category}
                onChange={(val) => setCategory(val as ServiceSlug)}
                options={categories.map((c) => ({
                  value: c.slug,
                  label: c.title,
                }))}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Portfolio Deliverable Media Type <span className="text-rose-500">*</span>
              </label>
              <CustomSelect
                value={mediaType}
                onChange={(val) => setMediaType(val)}
                options={DELIVERABLE_TYPE_OPTIONS}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Choose Expert Avatar Portrait */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#006eff]" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                2. Choose Expert Avatar Portrait
              </h2>
            </div>
            {selectedAvatarId && selectedAvatarId !== autoAvatar.id && (
              <button
                type="button"
                onClick={() => setSelectedAvatarId('')}
                className="text-[11px] text-[#006eff] hover:underline font-semibold cursor-pointer"
              >
                ↺ Reset Selection
              </button>
            )}
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Standardized 3D student portraits with uniform studio backdrop. Any expert can choose any avatar.
          </p>

          {/* 10 Avatar Options Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-1">
            {RAW_AVATAR_SPECS.map((spec) => {
              const isSelected = activeAvatar.id === spec.id;

              return (
                <button
                  key={spec.id}
                  type="button"
                  onClick={() => {
                    setSelectedAvatarId(spec.id);
                  }}
                  className={`relative flex flex-col items-center p-3 rounded-2xl border text-center transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-blue-50/80 border-[#006eff] shadow-sm ring-2 ring-blue-500/20'
                      : 'bg-slate-50/60 hover:bg-white border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  {/* Avatar Preview */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-2 shadow-2xs border border-slate-200/70 bg-[#eef2f6] p-1 shrink-0 flex items-center justify-center">
                    <AvatarGraphic
                      id={spec.id}
                      size="100%"
                      shape="circle"
                      className="w-full h-full rounded-full"
                    />
                  </div>

                  {/* Title & Info */}
                  <div className="flex flex-col items-center gap-1 w-full min-w-0">
                    <span className="text-xs font-bold text-slate-900 truncate w-full">
                      {spec.name}
                    </span>

                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                        spec.gender === 'female'
                          ? 'bg-pink-50 text-pink-700 border border-pink-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {spec.gender}
                    </span>
                  </div>

                  {/* Active Selected Checkmark Badge */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#006eff] text-white flex items-center justify-center shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Card 3: Initial Portfolio Deliverables / Work Samples (Optional) */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-[#006eff]" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                3. Portfolio Deliverables &amp; Work Samples (Optional)
              </h2>
            </div>
            <button
              type="button"
              onClick={() =>
                setInitialPortfolio([
                  ...initialPortfolio,
                  {
                    id: `port-init-${Date.now()}`,
                    title: '',
                    mediaUrl: '',
                    toolsInput: '',
                    description: '',
                  },
                ])
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#006eff] rounded-xl text-xs font-bold transition-all cursor-pointer border border-blue-200/70 shadow-2xs active:scale-95 self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Deliverable Link</span>
            </button>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Attach project or deliverable links (Google Drive, Figma, Behance, GitHub, website, etc.) to showcase on the expert's profile.
          </p>

          {initialPortfolio.length === 0 ? (
            <div className="p-8 border border-dashed border-slate-200 rounded-2xl text-center space-y-2 bg-slate-50/50">
              <FolderKanban className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-semibold text-slate-700">No deliverables added yet</p>
              <p className="text-[11px] text-slate-400">
                Click "+ Add Deliverable Link" above to add work links now, or upload them later via Portfolio Management.
              </p>
            </div>
          ) : (
            <div className="space-y-4 pt-1">
              {initialPortfolio.map((item, idx) => {
                const hasUrl = item.mediaUrl.trim().length > 0;
                const isImage =
                  item.mediaUrl.startsWith('data:image') ||
                  /\.(jpeg|jpg|gif|png|webp|svg)($|\?)/i.test(item.mediaUrl);
                const currentTypeOpt =
                  DELIVERABLE_TYPE_OPTIONS.find((o) => o.value === mediaType) ||
                  DELIVERABLE_TYPE_OPTIONS[0];

                return (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 transition-all"
                  >
                    {/* Item Header */}
                    <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-mono text-[#006eff]">
                          Sample #{idx + 1}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${currentTypeOpt.badgeColor}`}
                        >
                          {currentTypeOpt.badge}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setInitialPortfolio(initialPortfolio.filter((p) => p.id !== item.id))
                        }
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Remove deliverable"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Deliverable Item Title */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Deliverable Item Title <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Modern Fintech Brand Identity & Logo Guidelines"
                        value={item.title}
                        onChange={(e) =>
                          setInitialPortfolio(
                            initialPortfolio.map((p) =>
                              p.id === item.id ? { ...p, title: e.target.value } : p
                            )
                          )
                        }
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#006eff] transition-all"
                      />
                    </div>

                    {/* Deliverable Link Input Section with Live Preview */}
                    <div className="p-3.5 bg-blue-50/40 border border-blue-100 rounded-2xl space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-800 mb-1">
                          Deliverable URL Link <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="url"
                            required
                            placeholder="e.g. Google Drive, Figma prototype, Behance project, Live website URL"
                            value={item.mediaUrl}
                            onChange={(e) =>
                              setInitialPortfolio(
                                initialPortfolio.map((p) =>
                                  p.id === item.id ? { ...p, mediaUrl: e.target.value } : p
                                )
                              )
                            }
                            className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:border-[#006eff] focus:outline-none shadow-2xs"
                          />
                          <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Direct deliverable link to proof of work (Google Drive, Figma, Behance, Live website, or YouTube).
                        </p>
                      </div>

                      {/* Live Preview */}
                      {hasUrl && (
                        <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-3">
                          <div className="w-14 h-12 bg-slate-100 rounded-lg overflow-hidden shrink-0 flex items-center justify-center border border-slate-200">
                            {isImage ? (
                              <img
                                src={item.mediaUrl}
                                alt={item.title || 'Preview'}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.currentTarget as HTMLElement).style.display = 'none';
                                }}
                              />
                            ) : item.mediaUrl.includes('youtube.com') ||
                              item.mediaUrl.includes('youtu.be') ? (
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
                              {item.mediaUrl.slice(0, 50)}...
                            </span>
                          </div>
                          <a
                            href={item.mediaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-[#006eff] hover:underline flex items-center gap-1 shrink-0 ml-2"
                          >
                            <span>Open Link</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Tools Used (Tool Use) */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Tools Used (comma separated)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Figma, Adobe Illustrator, Photoshop"
                        value={item.toolsInput}
                        onChange={(e) =>
                          setInitialPortfolio(
                            initialPortfolio.map((p) =>
                              p.id === item.id ? { ...p, toolsInput: e.target.value } : p
                            )
                          )
                        }
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#006eff] transition-all"
                      />
                    </div>

                    {/* Deliverable Description */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Deliverable Description (optional)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Brief description of the deliverable outcome..."
                        value={item.description}
                        onChange={(e) =>
                          setInitialPortfolio(
                            initialPortfolio.map((p) =>
                              p.id === item.id ? { ...p, description: e.target.value } : p
                            )
                          )
                        }
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#006eff] transition-all resize-none"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Card 4: Competencies & Discipline Skills */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#006eff]" />
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
              4. Competencies &amp; Discipline Skills
            </h2>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Select authentic skills and software competencies. Only chosen competencies will appear as badges on the expert's card.
          </p>

          <div className="space-y-3 pt-1">
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {suggestedSkills.map((sk) => {
                const isSelected = selectedSkills.includes(sk);
                return (
                  <button
                    key={sk}
                    type="button"
                    onClick={() => handleToggleSkill(sk)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer shadow-2xs ${
                      isSelected
                        ? 'bg-blue-50 text-[#006eff] border-blue-300 ring-1 ring-blue-500/20'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {sk}
                  </button>
                );
              })}
            </div>

            <div>
              <input
                type="text"
                placeholder="Type a custom skill and press Enter..."
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                onKeyDown={handleAddCustomSkill}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-[#006eff] focus:outline-none transition-all shadow-2xs"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Selected skills ({selectedSkills.length}): {selectedSkills.length > 0 ? selectedSkills.join(', ') : 'None'}
              </p>
            </div>
          </div>
        </div>

        {/* Card 5: Public Profile Statement */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#006eff]" />
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
              5. Public Profile Statement &amp; Bio
            </h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              My Statement (Displayed on Public Profile)
            </label>
            <textarea
              rows={3}
              placeholder="Write the expert statement as it should appear in the 'My Statement' section of their live public profile (leave empty for auto-generated)..."
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-[#006eff] focus:outline-none transition-all leading-relaxed shadow-2xs"
            />
          </div>
        </div>

        {/* Card 6: Service Pricing & Rates */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#006eff]" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                6. Service Pricing &amp; Deliverable Rates
              </h2>
            </div>
            <button
              type="button"
              onClick={handleAddPricingTier}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#006eff] rounded-xl text-xs font-bold transition-all cursor-pointer border border-blue-200/70 shadow-2xs active:scale-95 self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Service Rate</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-500">
            Define standardized deliverable pricing for clients to view transparent service costs (e.g. Logo Design, UI Screen, Slide Deck).
          </p>

          <div className="space-y-3 pt-1">
            {pricingTiers.map((tier, idx) => (
              <div
                key={tier.id}
                className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/90 shadow-2xs"
              >
                <div className="flex items-center gap-2 md:w-1/2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 w-5 text-center shrink-0">
                    #{idx + 1}
                  </span>
                  <input
                    type="text"
                    placeholder="Service / Deliverable (e.g. Logo Design, Landing Page)"
                    value={tier.serviceName}
                    onChange={(e) => handleUpdatePricingTier(tier.id, 'serviceName', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#006eff]"
                  />
                </div>

                <div className="flex items-center gap-2 flex-1">
                  <div className="flex items-center flex-1 bg-white border border-slate-200 rounded-xl overflow-hidden focus-within:border-[#006eff] transition-colors">
                    <span className="px-2.5 py-2 text-[10px] font-bold font-mono text-[#006eff] bg-blue-50 border-r border-slate-200 shrink-0 select-none">
                      BDT
                    </span>
                    <input
                      type="text"
                      placeholder="e.g. 3,500 - 7,500 or 5,000"
                      value={tier.price}
                      onChange={(e) => handleUpdatePricingTier(tier.id, 'price', e.target.value)}
                      className="w-full px-3 py-2 bg-transparent text-xs text-slate-900 focus:outline-none font-mono"
                    />
                  </div>
                  {pricingTiers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePricingTier(tier.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer shrink-0"
                      title="Remove row"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 7: Private Legal Info */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-[#006eff]" />
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
              7. Private Legal Information (Internal Records Only)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Expert Real Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="expert-real-name"
                type="text"
                required
                placeholder="e.g. Tanvir Hasan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-[#006eff] focus:outline-none transition-all shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Gender <span className="text-rose-500">*</span>
              </label>
              <CustomSelect
                value={gender}
                onChange={(val) => setGender(val as any)}
                options={[
                  { value: 'Male', label: 'Male' },
                  { value: 'Female', label: 'Female' },
                  { value: 'Third Gender', label: 'Third Gender' },
                ]}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Present Address / District
              </label>
              <input
                type="text"
                placeholder="e.g. Dhanmondi, Dhaka"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-[#006eff] focus:outline-none transition-all shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Private Email
              </label>
              <input
                type="email"
                placeholder="e.g. tanvir@gmail.com"
                value={privateEmail}
                onChange={(e) => setPrivateEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-[#006eff] focus:outline-none transition-all shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Contact Number (WhatsApp)
              </label>
              <input
                type="tel"
                placeholder="+880 1700 000000"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-[#006eff] focus:outline-none transition-all font-mono shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Additional Note (Internal Vetting)
              </label>
              <input
                type="text"
                placeholder="e.g. University student, 3 years experience"
                value={additionalNote}
                onChange={(e) => setAdditionalNote(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-[#006eff] focus:outline-none transition-all shadow-2xs"
              />
            </div>
          </div>
        </div>

        {/* Card 8: Payment Credentials */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#006eff]" />
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
              8. Payout &amp; Banking Credentials
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Payment Method <span className="text-rose-500">*</span>
              </label>
              <CustomSelect
                value={paymentMethod}
                onChange={(val) => setPaymentMethod(val as any)}
                options={[
                  {
                    value: 'MFS',
                    label: 'MFS',
                  },
                  {
                    value: 'Bank Transfer',
                    label: 'Bank Transfer',
                  },
                ]}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Payment Details (Account Number / Routing / Instructions) <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="e.g.&#10;Account Name: Tanvir Ahmed&#10;Account Number: 01700-000000 / 150.120.3456&#10;Bank / Branch: Dutch Bangla Bank, Banani Branch&#10;Routing Number: 090271234"
                value={paymentDetails}
                onChange={(e) => setPaymentDetails(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-[#006eff] focus:outline-none transition-all font-mono shadow-2xs leading-relaxed"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Multi-line statement enabled. Specify full bank instructions, routing numbers, or account instructions.
              </p>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-3">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => navigate('/manage/profiles')}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#006eff] hover:bg-blue-600 disabled:opacity-60 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                <span>Creating Expert Profile...</span>
              </>
            ) : (
              <span>Create Expert Profile</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
