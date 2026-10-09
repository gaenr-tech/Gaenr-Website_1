import React, { useState } from 'react';
import { ServiceCategory, ServiceSlug } from '../../../types';
import {
  Layers,
  Plus,
  Check,
  Search,
  Pencil,
  Trash2,
  X,
  LayoutGrid,
  List as ListIcon,
  Image as ImageIcon,
  Upload,
  Globe,
  Sparkles,
} from 'lucide-react';

interface CategoriesManageViewProps {
  categories: ServiceCategory[];
  onUpdateCategories: (categories: ServiceCategory[]) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const AVAILABLE_MEDIA_TYPES = [
  'Images/Graphics',
  'Video files',
  'PDF/Document',
  'Code/Web Preview',
];

export const CategoriesManageView: React.FC<CategoriesManageViewProps> = ({
  categories,
  onUpdateCategories,
  showToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal State for Add / Edit
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [formTagline, setFormTagline] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formSubServices, setFormSubServices] = useState('');
  const [formCardImageUrl, setFormCardImageUrl] = useState('');
  const [formCoverImageUrl, setFormCoverImageUrl] = useState('');
  const [formAllowedMedia, setFormAllowedMedia] = useState<string[]>([
    'Images/Graphics',
    'PDF/Document',
  ]);

  const filteredCategories = categories.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (val: string) => {
    setFormTitle(val);
    if (!slugManuallyEdited) {
      setFormSlug(slugify(val));
    }
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'card' | 'cover'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        if (target === 'card') {
          setFormCardImageUrl(result);
        } else {
          setFormCoverImageUrl(result);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const openAddModal = () => {
    setModalMode('add');
    setEditingCatId(null);
    setFormTitle('');
    setFormSlug('');
    setSlugManuallyEdited(false);
    setFormTagline('');
    setFormDescription('');
    setFormSubServices('');
    setFormCardImageUrl('');
    setFormCoverImageUrl('');
    setFormAllowedMedia(['Images/Graphics', 'PDF/Document']);
  };

  const openEditModal = (cat: ServiceCategory) => {
    setModalMode('edit');
    setEditingCatId(cat.id);
    setFormTitle(cat.title);
    setFormSlug(cat.slug);
    setSlugManuallyEdited(true);
    setFormTagline(cat.tagline || '');
    setFormDescription(cat.description || '');
    setFormSubServices((cat.subServices || []).join(', '));
    setFormCardImageUrl(cat.cardImageUrl || '');
    setFormCoverImageUrl(cat.coverImageUrl || '');
    setFormAllowedMedia(cat.allowedMediaTypes || ['Images/Graphics', 'PDF/Document']);
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingCatId(null);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showToast('Please enter category title', 'error');
      return;
    }

    const slug = (formSlug.trim() || slugify(formTitle)) as ServiceSlug;
    const subServicesList = formSubServices
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const defaultCard = formCardImageUrl || '/images/services/graphics-design-services.jpg';
    const defaultCover = formCoverImageUrl || '/images/services/graphics-design.svg';

    if (modalMode === 'add') {
      const newCat: ServiceCategory = {
        id: `cat-${Date.now()}`,
        slug,
        title: formTitle.trim(),
        tagline: formTagline.trim() || `${formTitle.trim()} solutions managed with Gaenr quality.`,
        description: formDescription.trim() || 'Professional services managed through Gaenr quality assurance protocol.',
        iconName: 'Layers',
        subServices: subServicesList.length > 0 ? subServicesList : ['General Deliverable', 'Custom Brief', 'Quality Review'],
        deliverables: ['Production source files', 'Export review deck'],
        whyGaenr: ['Verified expert talent', 'Direct platform milestone tracking'],
        featuredProjectsCount: 20,
        cardImageUrl: defaultCard,
        coverImageUrl: defaultCover,
        allowedMediaTypes: formAllowedMedia,
      };

      onUpdateCategories([...categories, newCat]);
      showToast(`Category "${newCat.title}" created successfully!`, 'success');
    } else if (modalMode === 'edit' && editingCatId) {
      const updated = categories.map((cat) => {
        if (cat.id !== editingCatId) return cat;
        return {
          ...cat,
          title: formTitle.trim(),
          slug,
          tagline: formTagline.trim() || cat.tagline,
          description: formDescription.trim() || cat.description,
          subServices: subServicesList.length > 0 ? subServicesList : cat.subServices,
          cardImageUrl: formCardImageUrl || cat.cardImageUrl,
          coverImageUrl: formCoverImageUrl || cat.coverImageUrl,
          allowedMediaTypes: formAllowedMedia,
        };
      });

      onUpdateCategories(updated);
      showToast(`Category "${formTitle}" updated successfully!`, 'success');
    }

    closeModal();
  };

  const handleDeleteCategory = (catId: string, catTitle: string) => {
    if (window.confirm(`Are you sure you want to remove "${catTitle}"? This will also remove its frontend page.`)) {
      const updated = categories.filter((c) => c.id !== catId);
      onUpdateCategories(updated);
      showToast(`Category "${catTitle}" removed`, 'info');
    }
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Service Categories
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Categories created here automatically generate live frontend cards and dedicated service pages.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-[#006eff] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold transition-all shadow-sm shadow-blue-500/20 flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Simplified Filter & View Toggle Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search categories by title, slug, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-[#006eff] focus:outline-none transition-all placeholder:text-slate-400"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <span className="text-xs text-slate-500 font-medium px-1">
            {filteredCategories.length} {filteredCategories.length === 1 ? 'category' : 'categories'}
          </span>

          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              title="Grid View"
              className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              title="List View"
              className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <ListIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((cat) => {
            const allowed = cat.allowedMediaTypes || ['Images/Graphics', 'PDF/Document'];

            return (
              <div
                key={cat.id}
                className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between group"
              >
                {/* Visual Image Header */}
                <div className="relative h-28 w-full bg-slate-100 overflow-hidden border-b border-slate-100">
                  {cat.cardImageUrl ? (
                    <img
                      src={cat.cardImageUrl}
                      alt={cat.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-slate-400">
                      <ImageIcon className="w-8 h-8 opacity-40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Floating Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-white bg-slate-900/70 backdrop-blur-xs px-2 py-0.5 rounded-md font-semibold tracking-wide">
                      /{cat.slug}
                    </span>
                    <a
                      href={`/services/${cat.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-white bg-[#006eff]/90 hover:bg-[#006eff] px-2 py-0.5 rounded-md font-medium flex items-center gap-1 shadow-xs"
                    >
                      <span>Live Page</span>
                    </a>
                  </div>

                  <div className="absolute bottom-2 left-3 right-3 text-white">
                    <h2 className="text-sm font-bold truncate drop-shadow-xs">
                      {cat.title}
                    </h2>
                  </div>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    {/* Catchline / Tagline */}
                    {cat.tagline && (
                      <p className="text-[11px] font-semibold text-[#006eff] line-clamp-1 italic">
                        "{cat.tagline}"
                      </p>
                    )}

                    {/* About Service description */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>

                    {/* Sub-services count & clean chips */}
                    {cat.subServices && cat.subServices.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {cat.subServices.slice(0, 3).map((sub, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-200/80"
                          >
                            {sub}
                          </span>
                        ))}
                        {cat.subServices.length > 3 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md text-slate-400 font-mono">
                            +{cat.subServices.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Footer: Allowed Formats & Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 overflow-hidden">
                      <span className="text-[10px] text-slate-400 font-medium shrink-0">Media:</span>
                      <div className="flex items-center gap-1 truncate">
                        {allowed.map((m) => (
                          <span
                            key={m}
                            className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 truncate max-w-[70px]"
                            title={m}
                          >
                            {m.split('/')[0]}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-[#006eff] hover:text-white rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      {categories.length > 1 && (
                        <button
                          onClick={() => handleDeleteCategory(cat.id, cat.title)}
                          title="Remove category"
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold">
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Catchline / Tagline</th>
                  <th className="py-3 px-4">Sub-Services</th>
                  <th className="py-3 px-4">Allowed Media</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCategories.map((cat) => {
                  const allowed = cat.allowedMediaTypes || ['Images/Graphics', 'PDF/Document'];
                  return (
                    <tr key={cat.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-8 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                            {cat.cardImageUrl ? (
                              <img src={cat.cardImageUrl} alt={cat.title} className="w-full h-full object-cover" />
                            ) : (
                              <Layers className="w-4 h-4 m-auto text-slate-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{cat.title}</div>
                            <span className="font-mono text-[10px] text-[#006eff]">/{cat.slug}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 max-w-xs text-slate-600 truncate">
                        {cat.tagline || '—'}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {cat.subServices ? `${cat.subServices.length} sub-services` : '0'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {allowed.map((m) => (
                            <span
                              key={m}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium"
                            >
                              {m.split('/')[0]}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(cat)}
                            className="p-1.5 text-slate-500 hover:text-[#006eff] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Category"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          {categories.length > 1 && (
                            <button
                              onClick={() => handleDeleteCategory(cat.id, cat.title)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Category"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {modalMode && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-hidden"
        >
          <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl max-w-2xl w-full shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[90vh] animate-in fade-in zoom-in-95 overflow-hidden">
            {/* Modal Header: Fixed at top */}
            <div className="px-5 py-4 sm:px-6 sm:py-4.5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {modalMode === 'add' ? 'Create Service Category' : 'Edit Service Category'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Creates both the card on the Services page and its dedicated detail page.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form
              id="category-manage-form"
              onSubmit={handleSaveCategory}
              className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs scrollbar-thin scrollbar-thumb-slate-300"
            >
              {/* Row 1: Title and Auto Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Category Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AI Prompt Engineering"
                    value={formTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-[#006eff] focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Category Slug <span className="text-slate-400 font-normal">(auto-generated)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-400 font-mono">/services/</span>
                    <input
                      type="text"
                      placeholder="ai-prompt-engineering"
                      value={formSlug}
                      onChange={(e) => {
                        setFormSlug(e.target.value);
                        setSlugManuallyEdited(true);
                      }}
                      className="w-full pl-20 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white focus:border-[#006eff] focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Catchline / Hero Tagline */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Catchline / Hero Tagline <span className="text-slate-400 font-normal">(Top headline on banner)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Targeted reach with measurable ROI. / Turn raw footage into clear stories."
                  value={formTagline}
                  onChange={(e) => setFormTagline(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-[#006eff] focus:outline-none transition-all"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Displays prominently on the detail page hero banner and as the punchline.
                </p>
              </div>

              {/* Row 3: About Service */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  About Service <span className="text-slate-400 font-normal">(Overview & scope of work)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Briefly describe what this service provides, client value, and standards."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-[#006eff] focus:outline-none transition-all resize-none"
                />
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Appears under "About [Service]" on the dedicated page, and on the Services page card.
                </p>
              </div>

              {/* Row 4: Sub-Services */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Sub-Services <span className="text-slate-400 font-normal">(Comma-separated)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Logo Design, Social Media Creatives, Packaging Design"
                  value={formSubServices}
                  onChange={(e) => setFormSubServices(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-[#006eff] focus:outline-none transition-all"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  These generate the individual capability cards under the "Services" section on the detail page.
                </p>
              </div>

              {/* Row 5: Two Photos (Card Photo & Cover Photo) */}
              <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3">
                <span className="block font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                  Service Imagery (Card & Cover Photos)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Photo 1: Card Photo */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-slate-700 text-xs">
                        1. Card Photo <span className="text-slate-400 text-[10px]">(Services Page Card)</span>
                      </label>
                    </div>

                    {/* Preview box */}
                    <div className="relative h-24 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                      {formCardImageUrl ? (
                        <img
                          src={formCardImageUrl}
                          alt="Card preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center text-slate-400">
                          <ImageIcon className="w-6 h-6 mx-auto opacity-40 mb-1" />
                          <span className="text-[10px]">No Card Image</span>
                        </div>
                      )}
                    </div>

                    {/* Upload or URL input */}
                    <div className="flex items-center gap-1.5">
                      <label className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#006eff] font-medium rounded-lg cursor-pointer text-[11px] flex items-center gap-1 shrink-0 transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'card')}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="text"
                        placeholder="Or paste image URL..."
                        value={formCardImageUrl}
                        onChange={(e) => setFormCardImageUrl(e.target.value)}
                        className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-900 focus:bg-white focus:border-[#006eff] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Photo 2: Cover Photo */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-slate-700 text-xs">
                        2. Cover Photo <span className="text-slate-400 text-[10px]">(Detail Page Banner)</span>
                      </label>
                    </div>

                    {/* Preview box */}
                    <div className="relative h-24 rounded-lg bg-[#006eff] overflow-hidden flex items-center justify-center">
                      {formCoverImageUrl ? (
                        <>
                          <img
                            src={formCoverImageUrl}
                            alt="Cover preview"
                            className="w-full h-full object-cover opacity-80"
                          />
                          <div className="absolute inset-0 bg-[#006eff]/30 pointer-events-none" />
                        </>
                      ) : (
                        <div className="text-center text-white/70">
                          <ImageIcon className="w-6 h-6 mx-auto opacity-50 mb-1" />
                          <span className="text-[10px]">Default Blue Banner</span>
                        </div>
                      )}
                    </div>

                    {/* Upload or URL input */}
                    <div className="flex items-center gap-1.5">
                      <label className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#006eff] font-medium rounded-lg cursor-pointer text-[11px] flex items-center gap-1 shrink-0 transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'cover')}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="text"
                        placeholder="Or paste cover URL / SVG..."
                        value={formCoverImageUrl}
                        onChange={(e) => setFormCoverImageUrl(e.target.value)}
                        className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-900 focus:bg-white focus:border-[#006eff] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 6: Allowed Media Types */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Allowed Media Types in Portfolio
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {AVAILABLE_MEDIA_TYPES.map((type) => {
                    const isChecked = formAllowedMedia.includes(type);
                    return (
                      <button
                        type="button"
                        key={type}
                        onClick={() => {
                          if (isChecked) {
                            setFormAllowedMedia(formAllowedMedia.filter((m) => m !== type));
                          } else {
                            setFormAllowedMedia([...formAllowedMedia, type]);
                          }
                        }}
                        className={`flex items-center justify-between p-2 rounded-xl border text-left cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-blue-50/80 border-blue-200 text-[#006eff] font-semibold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <span className="truncate text-[11px]">{type}</span>
                        {isChecked && <Check className="w-3.5 h-3.5 shrink-0 text-[#006eff] ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </form>

            {/* Fixed Footer: Always visible at bottom */}
            <div className="px-5 py-3 sm:px-6 sm:py-3.5 border-t border-slate-100 flex items-center justify-end gap-2.5 shrink-0 bg-slate-50/80">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="category-manage-form"
                className="px-4 py-2 bg-[#006eff] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/20 cursor-pointer"
              >
                {modalMode === 'add' ? 'Create Service Category' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
