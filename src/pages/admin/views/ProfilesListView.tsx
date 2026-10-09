import React, { useState, useRef } from 'react';
import { FreelancerProfile, ServiceCategory, AvatarAsset, ServiceSlug, ExpertPricingTier } from '../../../types';
import { AvatarGraphic, getOfficialAvatarUrl, getAvatarImageSrc, getCategoryAvatar, RAW_AVATAR_SPECS } from '../../../components/common/Avatars';
import {
  Search,
  Plus,
  Eye,
  EyeOff,
  FolderKanban,
  ExternalLink,
  Star,
  Copy,
  Check,
  X,
  CreditCard,
  Download,
  Loader2,
  Edit2,
  Lock,
  Save,
  Tag,
  Briefcase,
  User,
  Trash2,
  Upload,
} from 'lucide-react';
import { CustomSelect } from '../../../components/common/CustomSelect';
import { downloadIdCardBadge } from '../../../utils/downloadIdCardImage';
import { ExpertIdCard } from '../../../components/common/ExpertIdCard';
import { getExpertSecureUploadUrl } from '../../../utils/security';

interface ProfilesListViewProps {
  freelancers: FreelancerProfile[];
  toggleFreelancerVisibility: (code: string) => void;
  navigate: (route: string) => void;
  onSelectPortfolioProfile?: (code: string) => void;
  categories?: ServiceCategory[];
  avatars?: AvatarAsset[];
  onUpdateFreelancer?: (code: string, updates: Partial<FreelancerProfile>) => void;
  onDeleteFreelancer?: (code: string) => void;
  showToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ProfilesListView: React.FC<ProfilesListViewProps> = ({
  freelancers,
  toggleFreelancerVisibility,
  navigate,
  onSelectPortfolioProfile,
  categories = [],
  avatars = [],
  onUpdateFreelancer,
  onDeleteFreelancer,
  showToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'public' | 'draft'>('all');
  const [selectedReviewExpert, setSelectedReviewExpert] = useState<FreelancerProfile | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedPortalExpert, setSelectedPortalExpert] = useState<FreelancerProfile | null>(null);
  const [portalCopied, setPortalCopied] = useState(false);
  const [selectedIdCardExpert, setSelectedIdCardExpert] = useState<FreelancerProfile | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [expertToDelete, setExpertToDelete] = useState<FreelancerProfile | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleConfirmDelete = (code: string) => {
    if (onDeleteFreelancer) {
      onDeleteFreelancer(code);
    } else {
      showToast?.(`Expert profile ${code} deleted`, 'info');
    }
    setEditingExpert(null);
    setExpertToDelete(null);
  };

  // Edit Expert Profile Modal State
  const [editingExpert, setEditingExpert] = useState<FreelancerProfile | null>(null);
  const [editCategory, setEditCategory] = useState<ServiceSlug>('graphics-design');
  const [editCategoryTitle, setEditCategoryTitle] = useState('');
  const [editAvatarId, setEditAvatarId] = useState('');
  const [editStatement, setEditStatement] = useState('');
  const [editSkills, setEditSkills] = useState<string[]>([]);
  const [editSkillInput, setEditSkillInput] = useState('');
  const [editGender, setEditGender] = useState<'Male' | 'Female' | 'Third Gender' | 'Other'>('Male');
  const [editStatus, setEditStatus] = useState<'active' | 'in_review' | 'paused'>('active');
  const [editIsPublic, setEditIsPublic] = useState(false);
  const [editPricingTiers, setEditPricingTiers] = useState<ExpertPricingTier[]>([]);
  const [editPrivateEmail, setEditPrivateEmail] = useState('');
  const [editContactNumber, setEditContactNumber] = useState('');
  const [editAddress, setEditAddress] = useState('');

  const handleOpenEdit = (fl: FreelancerProfile) => {
    setEditingExpert(fl);
    setEditCategory(fl.category);
    setEditCategoryTitle(fl.categoryTitle);
    setEditAvatarId(
      fl.avatarId ||
        getCategoryAvatar(
          fl.category,
          fl.code,
          fl.gender === 'Male' ? 'male' : fl.gender === 'Female' ? 'female' : 'third_gender'
        ).id
    );
    setEditStatement(fl.statement || '');
    setEditSkills(fl.skills ? [...fl.skills] : []);
    setEditSkillInput('');
    setEditGender(fl.gender || 'Male');
    setEditStatus(fl.status || 'active');
    setEditIsPublic(fl.isPublic);
    setEditPricingTiers(
      fl.pricingTiers && fl.pricingTiers.length > 0
        ? [...fl.pricingTiers]
        : [{ id: 'price-1', serviceName: '', price: '' }]
    );
    setEditPrivateEmail(fl.privateEmail || '');
    setEditContactNumber(fl.contactNumber || '');
    setEditAddress(fl.address || '');
  };

  const handleAddSkill = () => {
    const trimmed = editSkillInput.trim();
    if (trimmed && !editSkills.includes(trimmed)) {
      setEditSkills([...editSkills, trimmed]);
      setEditSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setEditSkills(editSkills.filter((s) => s !== skill));
  };

  const handleAddEditPricingTier = () => {
    setEditPricingTiers([
      ...editPricingTiers,
      { id: `price-${Date.now()}`, serviceName: '', price: '' },
    ]);
  };

  const handleRemoveEditPricingTier = (id: string) => {
    setEditPricingTiers(editPricingTiers.filter((p) => p.id !== id));
  };

  const handleUpdateEditPricingTier = (id: string, field: 'serviceName' | 'price', val: string) => {
    setEditPricingTiers(
      editPricingTiers.map((p) => (p.id === id ? { ...p, [field]: val } : p))
    );
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExpert) return;

    if (!editCategoryTitle.trim()) {
      showToast?.('Expert Specialty Title cannot be empty', 'error');
      return;
    }

    if (!editStatement.trim()) {
      showToast?.('Public Statement cannot be empty', 'error');
      return;
    }

    const updates: Partial<FreelancerProfile> = {
      // NOTE: Expert ID (code), Rating, and Completed Projects are strictly auto-tracked / read-only
      category: editCategory,
      categoryTitle: editCategoryTitle.trim(),
      avatarId:
        editAvatarId ||
        getCategoryAvatar(
          editCategory,
          editingExpert.code,
          editGender === 'Male' ? 'male' : editGender === 'Female' ? 'female' : 'third_gender'
        ).id,
      statement: editStatement.trim(),
      skills: editSkills,
      gender: editGender,
      status: editStatus,
      isPublic: editIsPublic,
      pricingTiers: editPricingTiers.filter((p) => p.serviceName.trim() && p.price.trim()),
      privateEmail: editPrivateEmail.trim(),
      contactNumber: editContactNumber.trim(),
      address: editAddress.trim(),
    };

    onUpdateFreelancer?.(editingExpert.code, updates);
    setEditingExpert(null);
  };

  const filtered = freelancers.filter((fl) => {
    const matchesSearch =
      fl.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fl.categoryTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fl.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (fl.skills && fl.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())));

    if (!matchesSearch) return false;
    if (statusFilter === 'public') return fl.isPublic;
    if (statusFilter === 'draft') return !fl.isPublic;
    return true;
  });

  const handleCopyReviewLink = (expertCode: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://gaenr.com';
    const link = `${origin}/review/${expertCode}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleDownloadCardImage = async () => {
    if (!selectedIdCardExpert) return;
    try {
      setIsDownloading(true);
      const success = await downloadIdCardBadge(cardRef.current, selectedIdCardExpert);
      if (success) {
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 2500);
      }
    } catch (error) {
      console.error('Failed to export ID Card as image:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Expert Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Search, curate, and control public vs internal status for all verified experts.
          </p>
        </div>
        {/* Link to Create Profile */}
        <button
          onClick={() => navigate('/manage/profiles/new')}
          className="px-4 py-2 bg-[#006eff] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/20 flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Expert Profile</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search profiles by code/service */}
        <div className="flex items-center gap-2.5 flex-1 max-w-md bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by code (e.g. 8K2N9X4P), service, or skill..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
          />
        </div>

        {/* View public / draft status filter */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({freelancers.length})
            </button>
            <button
              onClick={() => setStatusFilter('public')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                statusFilter === 'public'
                  ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Public ({freelancers.filter((f) => f.isPublic).length})
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                statusFilter === 'draft'
                  ? 'bg-white text-slate-800 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Draft ({freelancers.filter((f) => !f.isPublic).length})
            </button>
          </div>
        </div>
      </div>

      {/* Profiles Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-mono uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Expert</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 w-20 text-center">Media</th>
                <th className="py-3 px-3 w-28 text-center">Rating</th>
                <th className="py-3 px-3 w-28 text-center">Status</th>
                <th className="py-3 px-4 w-48 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No expert profiles found matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map((fl) => (
                  <tr key={fl.code} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                          <AvatarGraphic id={fl.avatarId} size={30} />
                        </div>
                        <div className="min-w-0">
                          <span className="font-mono font-bold text-slate-900 text-xs block truncate">
                            {fl.code}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate block">
                            {fl.name || 'Verified Expert'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900 text-xs truncate max-w-[140px]">{fl.categoryTitle}</div>
                      <div className="text-[10px] text-slate-500 capitalize">
                        {fl.category.replace('-', ' ')}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono whitespace-nowrap text-center">
                      <button
                        onClick={() => {
                          if (onSelectPortfolioProfile) onSelectPortfolioProfile(fl.code);
                          navigate('/manage/portfolio');
                        }}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-[#006eff] hover:bg-blue-100 transition-colors font-bold text-[11px] cursor-pointer"
                        title="Manage portfolio deliverables"
                      >
                        <FolderKanban className="w-3 h-3" />
                        <span>{fl.portfolioItems?.length || 0}</span>
                      </button>
                    </td>
                    <td className="py-3 px-3 font-mono whitespace-nowrap text-center">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                        fl.reviewsCount > 0
                          ? 'text-amber-700 bg-amber-50/80 border-amber-200/60'
                          : 'text-slate-500 bg-slate-50 border-slate-200'
                      }`}>
                        <Star className={`w-3 h-3 ${fl.reviewsCount > 0 ? 'fill-amber-400 text-amber-500' : 'text-slate-400'}`} />
                        <span>{fl.reviewsCount > 0 ? fl.rating.toFixed(1) : '0.0'}</span>
                        <span className="text-slate-400 font-normal">({fl.reviewsCount})</span>
                      </span>
                    </td>

                    {/* View public/draft status */}
                    <td className="py-3 px-3 whitespace-nowrap text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFreelancerVisibility(fl.code);
                        }}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-all cursor-pointer border shadow-2xs select-none active:scale-95 ${
                          fl.isPublic
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                        }`}
                        title={fl.isPublic ? "Click to set DRAFT (Hide from public)" : "Click to set PUBLIC (Live on website)"}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            fl.isPublic ? 'bg-emerald-500 ring-2 ring-emerald-300 animate-pulse' : 'bg-slate-400'
                          }`}
                        />
                        <span>{fl.isPublic ? 'PUBLIC' : 'DRAFT'}</span>
                      </button>
                    </td>

                    {/* Actions Column (Edit, ID Card, Review, Link) */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        {/* Edit Expert Profile Action Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(fl)}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 hover:bg-[#006eff] text-[#006eff] hover:text-white border border-blue-200/80 hover:border-[#006eff] rounded-lg text-[11px] font-bold transition-all cursor-pointer shadow-2xs active:scale-95 group"
                          title="Edit expert profile credentials (ID is immutable)"
                        >
                          <Edit2 className="w-3 h-3 text-[#006eff] group-hover:text-white shrink-0 transition-colors" />
                          <span>Edit</span>
                        </button>

                        {/* Digital ID Card Action Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedIdCardExpert(fl);
                            setDownloadSuccess(false);
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 hover:bg-blue-100 text-[#006eff] border border-blue-200/80 rounded-lg text-[11px] font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
                          title="View & download Digital ID Card"
                        >
                          <CreditCard className="w-3 h-3 text-[#006eff] shrink-0" />
                          <span>ID Card</span>
                        </button>

                        {/* Dedicated Portfolio Upload Portal Action Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPortalExpert(fl);
                            setPortalCopied(false);
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 rounded-lg text-[11px] font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
                          title="View & copy dedicated Portfolio Upload Portal link"
                        >
                          <Upload className="w-3 h-3 text-emerald-700 shrink-0" />
                          <span>Portal</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedReviewExpert(fl);
                            setCopied(false);
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 rounded-lg text-[11px] font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
                          title="Generate unique client review link"
                        >
                          <Star className="w-3 h-3 fill-amber-400 text-amber-500 shrink-0" />
                          <span>Review</span>
                        </button>

                        {/* Delete Profile Action Button */}
                        <button
                          type="button"
                          onClick={() => setExpertToDelete(fl)}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200/80 hover:border-rose-600 rounded-lg text-[11px] font-bold transition-all cursor-pointer shadow-2xs active:scale-95 group"
                          title="Delete expert profile permanently"
                        >
                          <Trash2 className="w-3 h-3 text-rose-600 group-hover:text-white shrink-0 transition-colors" />
                          <span>Delete</span>
                        </button>

                        <button
                          onClick={() => navigate(`/profile/${fl.code}`)}
                          className="p-1.5 text-slate-400 hover:text-[#006eff] hover:bg-blue-50 border border-transparent hover:border-blue-100 rounded-lg transition-all cursor-pointer"
                          title="View public live profile"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Client Review Link Generator Modal */}
      {selectedReviewExpert && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedReviewExpert(null);
              setCopied(false);
            }
          }}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Generate Client Review Link</h3>
                  <p className="text-xs text-slate-500">Provide this link to the client once project is completed</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedReviewExpert(null);
                  setCopied(false);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Expert Card */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                <AvatarGraphic id={selectedReviewExpert.avatarId} size={40} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#006eff] text-xs">{selectedReviewExpert.code}</span>
                  <span className="font-bold text-slate-900 text-xs truncate">{selectedReviewExpert.name || 'Verified Expert'}</span>
                </div>
                <span className="text-[11px] text-slate-500">{selectedReviewExpert.categoryTitle}</span>
              </div>
            </div>

            {/* Link display & copy */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Unique Review URL for this Expert:
              </label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5 focus-within:border-[#006eff] focus-within:bg-white transition-all">
                <input
                  type="text"
                  readOnly
                  value={`${typeof window !== 'undefined' ? window.location.origin : 'https://gaenr.com'}/review/${selectedReviewExpert.code}`}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                  className="w-full bg-transparent px-2.5 text-xs font-mono text-slate-800 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleCopyReviewLink(selectedReviewExpert.code)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                    copied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#006eff] hover:bg-blue-600 text-white shadow-xs'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-2xl text-[11px] text-slate-600 space-y-1">
              <div className="font-bold text-[#006eff]">How it works:</div>
              <p>1. When a task or milestone is completed, send this link to the client.</p>
              <p>2. The client provides star rating, their name, email, and testimonial.</p>
              <p>3. Once submitted, it automatically attaches to Expert <strong>{selectedReviewExpert.code}</strong>'s public portfolio and recalculates their rating.</p>
            </div>

            {/* Footer Actions */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
              <a
                href={`/review/${selectedReviewExpert.code}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#006eff] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Open Review Page in New Tab</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                type="button"
                onClick={() => {
                  setSelectedReviewExpert(null);
                  setCopied(false);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Portfolio Upload Portal Link Modal */}
      {selectedPortalExpert && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedPortalExpert(null);
              setPortalCopied(false);
            }
          }}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
                  <Upload className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Dedicated Portfolio Upload Portal</h3>
                  <p className="text-xs text-slate-500">
                    Private link for {selectedPortalExpert.code} to upload assets with live preview
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedPortalExpert(null);
                  setPortalCopied(false);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Expert Card */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                  <AvatarGraphic id={selectedPortalExpert.avatarId} size={40} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#006eff] text-xs">{selectedPortalExpert.code}</span>
                    <span className="font-bold text-slate-900 text-xs truncate">{selectedPortalExpert.name || 'Verified Expert'}</span>
                  </div>
                  <span className="text-[11px] text-slate-500">{selectedPortalExpert.categoryTitle}</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#006eff] font-mono text-[10px] font-bold shrink-0 border border-blue-200">
                {selectedPortalExpert.portfolioItems?.length || 0} Deliverables
              </span>
            </div>

            {/* URL Display and One-Click Copy */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>Unique Portfolio Portal URL</span>
                <span className="text-[10px] text-emerald-600 font-mono font-semibold">Live Preview Enabled</span>
              </label>

              <div className="flex items-center gap-2">
                <div className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 truncate select-all">
                  {getExpertSecureUploadUrl(selectedPortalExpert)}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      getExpertSecureUploadUrl(selectedPortalExpert)
                    );
                    setPortalCopied(true);
                    showToast?.(`Private Upload Portal link copied for ${selectedPortalExpert.code}`, 'success');
                    setTimeout(() => setPortalCopied(false), 2500);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 shrink-0 ${
                    portalCopied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#006eff] hover:bg-[#005cd4] text-white'
                  }`}
                >
                  {portalCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Cloud Storage Vault Status */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Private Creator Vault</span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  Protected with high-entropy cryptographic token. Only the creator holding this private link can upload deliverables.
                </p>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  navigate(`/u/${selectedPortalExpert.uploadToken || selectedPortalExpert.code}`);
                  setSelectedPortalExpert(null);
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <span>Open Portal (Live Preview)</span>
                <ExternalLink className="w-3 h-3" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedPortalExpert(null);
                  setPortalCopied(false);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unique Digital ID Card Modal */}
      {selectedIdCardExpert && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedIdCardExpert(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in overflow-y-auto"
        >
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 my-auto max-h-[95vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#006eff] border border-blue-200 flex items-center justify-center shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Expert Digital ID Card
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    ID Card Badge for {selectedIdCardExpert.code}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedIdCardExpert(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Visual Digital ID Card Render */}
            <div className="py-2 flex justify-center">
              <ExpertIdCard ref={cardRef} freelancer={selectedIdCardExpert} />
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedIdCardExpert(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handleDownloadCardImage}
                disabled={isDownloading}
                className={`px-4 py-2 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer ${
                  downloadSuccess
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                    : 'bg-[#006eff] hover:bg-blue-600 disabled:opacity-60 shadow-blue-500/20'
                }`}
              >
                {downloadSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Card Downloaded!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Download ID Card</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Expert Profile Modal */}
      {editingExpert && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingExpert(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in overflow-y-auto"
        >
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl space-y-5 my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95">
            {/* Modal Header with Live Avatar Preview */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#eef2f6] border-2 border-[#006eff] overflow-hidden shrink-0 shadow-xs relative flex items-center justify-center">
                  <AvatarGraphic
                    id={editAvatarId || editingExpert.avatarId}
                    size="100%"
                    shape="circle"
                    className="w-full h-full rounded-full"
                    title="Selected Avatar"
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span>Edit Expert Profile</span>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-[#006eff] border border-blue-200">
                      {editingExpert.code}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Update specialty title, avatar, statements, and operational credentials.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingExpert(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveEdit} className="flex-1 overflow-y-auto pr-1 space-y-6">
              {/* Section 1: Expert ID (LOCKED & IMMUTABLE) */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                      Expert Verification ID
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-amber-700 bg-amber-100/70 border border-amber-300 px-2 py-0.5 rounded-md">
                    <Lock className="w-3 h-3" />
                    READ-ONLY &bull; LOCKED
                  </span>
                </div>

                <div>
                  <input
                    type="text"
                    value={editingExpert.code}
                    readOnly
                    disabled
                    className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-300 text-slate-600 font-mono font-bold rounded-xl text-xs cursor-not-allowed select-none shadow-inner"
                  />
                  <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1.5">
                    <span className="text-amber-600 font-bold">&bull;</span>
                    The Expert ID is strictly permanent and cannot be modified to maintain contract tracking and review integrity.
                  </p>
                </div>
              </div>

              {/* Section 2: Service Category & Title */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Service Category <span className="text-rose-500">*</span>
                    </label>
                    <CustomSelect
                      value={editCategory}
                      onChange={(val) => {
                        const newCat = val as ServiceSlug;
                        setEditCategory(newCat);
                        const matched = categories.find((c) => c.slug === newCat);
                        if (matched && (!editCategoryTitle || editCategoryTitle === editingExpert.categoryTitle)) {
                          setEditCategoryTitle(matched.title);
                        }
                      }}
                      options={
                        categories.length > 0
                          ? categories.map((c) => ({ value: c.slug, label: c.title }))
                          : [
                              { value: 'graphics-design', label: 'Graphics Design' },
                              { value: 'content-writing', label: 'Content Writing' },
                              { value: 'video-editing', label: 'Video Editing' },
                              { value: 'wordpress-website', label: 'WordPress Website' },
                              { value: 'presentation-slide-design', label: 'Presentation Slide Design' },
                              { value: 'ux-ui-design', label: 'UX / UI Design' },
                              { value: 'ad-running', label: 'Ad Running & Campaign Setup' },
                            ]
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Expert Specialty Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editCategoryTitle}
                      onChange={(e) => setEditCategoryTitle(e.target.value)}
                      placeholder="e.g. Senior Brand Designer"
                      required
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#006eff] rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Expert Avatar Portrait */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">
                    Expert Avatar Portrait (3D Studio)
                  </label>
                  <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                    10 UNIFIED 3D STYLES
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {RAW_AVATAR_SPECS.map((spec) => {
                    const isSelected = (editAvatarId || '').toLowerCase() === spec.id.toLowerCase();
                    return (
                      <button
                        key={spec.id}
                        type="button"
                        onClick={() => {
                          setEditAvatarId(spec.id);
                        }}
                        className={`relative flex flex-col items-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50/80 border-[#006eff] ring-2 ring-blue-500/20 shadow-xs'
                            : 'bg-white hover:bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full overflow-hidden mb-1.5 border border-slate-200/60 bg-[#eef2f6] p-0.5 shadow-2xs flex items-center justify-center">
                          <AvatarGraphic
                            id={spec.id}
                            size="100%"
                            shape="circle"
                            className="w-full h-full rounded-full"
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-900 truncate w-full">
                          {spec.name}
                        </span>
                        <span className="text-[8px] font-mono uppercase text-slate-400">
                          {spec.gender}
                        </span>
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#006eff] text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 4: My Statement */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  My Statement <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={editStatement}
                  onChange={(e) => setEditStatement(e.target.value)}
                  placeholder="Professional statement shown on expert's live public profile..."
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#006eff] rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium resize-none leading-relaxed"
                />
              </div>

              {/* Section 5: Skills Management */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-slate-700">
                  Expert Skills &amp; Deliverables
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editSkillInput}
                    onChange={(e) => setEditSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder="Type a skill (e.g. Logo Design, Figma UI) and press Add..."
                    className="flex-1 px-3.5 py-2 bg-white border border-slate-200 focus:border-[#006eff] rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#006eff] border border-slate-200 hover:border-blue-200 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0"
                  >
                    Add Skill
                  </button>
                </div>

                {/* Assigned Skills Chips */}
                <div className="flex flex-wrap gap-1.5 min-h-[38px] p-2 bg-slate-50 border border-slate-200/80 rounded-xl">
                  {editSkills.length === 0 ? (
                    <span className="text-[11px] text-slate-400 italic">No skills added yet.</span>
                  ) : (
                    editSkills.map((sk) => (
                      <span
                        key={sk}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 text-[11px] font-medium shadow-2xs"
                      >
                        <Tag className="w-3 h-3 text-[#006eff]" />
                        <span>{sk}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(sk)}
                          className="hover:text-rose-600 transition-colors cursor-pointer ml-0.5"
                          title="Remove skill"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Section 6: Service Pricing & Rates */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#006eff]" />
                    <label className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                      Service Pricing &amp; Deliverable Rates
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddEditPricingTier}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-blue-50 text-[#006eff] rounded-lg text-[11px] font-bold transition-all cursor-pointer border border-blue-200 shadow-2xs active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Service Rate</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-500">
                  Standardized client pricing shown on the live profile (e.g. Logo Design, UI Screen, Slide Deck).
                </p>

                <div className="space-y-2.5 pt-1">
                  {editPricingTiers.map((tier, idx) => (
                    <div
                      key={tier.id}
                      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs"
                    >
                      <div className="flex items-center gap-1.5 sm:w-1/2">
                        <span className="text-[10px] font-mono font-bold text-slate-400 w-5 text-center shrink-0">
                          #{idx + 1}
                        </span>
                        <input
                          type="text"
                          placeholder="Deliverable (e.g. Logo Design, Landing Page)"
                          value={tier.serviceName}
                          onChange={(e) => handleUpdateEditPricingTier(tier.id, 'serviceName', e.target.value)}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#006eff]"
                        />
                      </div>

                      <div className="flex items-center gap-1.5 flex-1">
                        <div className="flex items-center flex-1 bg-white border border-slate-200 rounded-lg overflow-hidden focus-within:border-[#006eff] transition-colors">
                          <span className="px-2 py-1.5 text-[10px] font-bold font-mono text-[#006eff] bg-blue-50 border-r border-slate-200 shrink-0 select-none">
                            BDT
                          </span>
                          <input
                            type="text"
                            placeholder="e.g. 3,500 - 7,500 or 5,000"
                            value={tier.price}
                            onChange={(e) => handleUpdateEditPricingTier(tier.id, 'price', e.target.value)}
                            className="w-full px-3 py-1.5 bg-transparent text-xs text-slate-900 focus:outline-none font-mono"
                          />
                        </div>
                        {editPricingTiers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveEditPricingTier(tier.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                            title="Remove row"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 7: Visibility & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200/90 rounded-2xl">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Public Visibility
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setEditIsPublic(true)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        editIsPublic
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>PUBLIC</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditIsPublic(false)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        !editIsPublic
                          ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>DRAFT</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Operational Status
                  </label>
                  <CustomSelect
                    value={editStatus}
                    onChange={(val) => setEditStatus(val as any)}
                    options={[
                      { value: 'active', label: 'Active (Available for Orders)', badge: 'Available', badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
                      { value: 'in_review', label: 'In Review (Under Evaluation)', badge: 'Reviewing', badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200' },
                      { value: 'paused', label: 'Paused (Temporarily Inactive)', badge: 'Paused', badgeColor: 'bg-slate-100 text-slate-600' },
                    ]}
                  />
                </div>
              </div>

              {/* Section 8: Performance & Ratings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Client Star Rating
                    </label>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md">
                      <Lock className="w-3 h-3 text-amber-600" />
                      AUTO CALCULATED
                    </span>
                  </div>
                  <div className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-500 shrink-0" />
                      <span className="font-mono font-bold text-slate-900 text-xs">
                        {editingExpert.reviewsCount > 0 ? editingExpert.rating.toFixed(1) : '0.0'}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        / 5.0 ({editingExpert.reviewsCount || editingExpert.reviews?.length || 0} reviews)
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
                    <span>Generated automatically from client review link submissions (Cannot be manually edited).</span>
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Completed Projects
                    </label>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-md">
                      <Lock className="w-3 h-3 text-blue-600" />
                      AUTO CALCULATED
                    </span>
                  </div>
                  <div className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-[#006eff] shrink-0" />
                      <span className="font-mono font-bold text-slate-900 text-xs">
                        {editingExpert.completedProjects || 0}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        milestones delivered
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
                    <span>Automatically tracked and updated as client orders and milestones complete.</span>
                  </p>
                </div>
              </div>

              {/* Section 8: Private Internal Info */}
              <div className="border-t border-slate-100 pt-4 space-y-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-bold text-slate-700 uppercase font-mono tracking-wider">
                    Internal Private Information
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Gender</label>
                    <CustomSelect
                      value={editGender}
                      onChange={(val) => setEditGender(val as any)}
                      options={[
                        { value: 'Male', label: 'Male' },
                        { value: 'Female', label: 'Female' },
                        { value: 'Third Gender', label: 'Third Gender' },
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Private Email</label>
                    <input
                      type="email"
                      value={editPrivateEmail}
                      onChange={(e) => setEditPrivateEmail(e.target.value)}
                      placeholder="expert@mail.com"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#006eff]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Contact Number</label>
                    <input
                      type="text"
                      value={editContactNumber}
                      onChange={(e) => setEditContactNumber(e.target.value)}
                      placeholder="+8801..."
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#006eff]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Address / Location</label>
                  <input
                    type="text"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    placeholder="City, Country"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#006eff]"
                  />
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 sticky bottom-0 bg-white py-2">
                <button
                  type="button"
                  onClick={() => setExpertToDelete(editingExpert)}
                  className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer"
                  title="Delete this expert profile"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Profile</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingExpert(null)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#006eff] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Profile Updates</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {expertToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-center">
            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-100 shadow-inner">
              <Trash2 className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-black text-slate-900 mb-2">Delete Expert Profile?</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Are you sure you want to permanently delete profile{' '}
              <span className="font-bold text-slate-800">{expertToDelete.code}</span> (
              {expertToDelete.categoryTitle || expertToDelete.category})? This action cannot be undone.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setExpertToDelete(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleConfirmDelete(expertToDelete.code)}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-600/20 cursor-pointer flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Yes, Delete Profile</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
