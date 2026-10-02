import React, { useState } from 'react';
import { Tag, Plus, Search, Trash2, LayoutGrid, List as ListIcon, CheckCircle2 } from 'lucide-react';
import { ServiceCategory } from '../../../types';
import { CustomSelect } from '../../../components/common/CustomSelect';

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  count: number;
}

interface SkillsManageViewProps {
  categories: ServiceCategory[];
  skills: SkillItem[];
  onUpdateSkills: (skills: SkillItem[]) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const normalizeCategory = (cat: string): string => {
  const c = (cat || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  if (c.includes('graphic')) return 'graphics';
  if (c.includes('content') || c.includes('writing') || c.includes('copywriting')) return 'writing';
  if (c.includes('video') || c.includes('motion')) return 'video';
  if (c.includes('wordpress')) return 'wordpress';
  if (c.includes('presentation') || c.includes('slide')) return 'presentation';
  if (c.includes('ux') || c.includes('ui')) return 'uxui';
  if (c.includes('ad') || c.includes('campaign') || c.includes('buying')) return 'ad';
  return c;
};

export const SkillsManageView: React.FC<SkillsManageViewProps> = ({
  categories,
  skills,
  onUpdateSkills,
  showToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState(
    categories[0]?.title || 'Graphics Design'
  );
  const [showAddForm, setShowAddForm] = useState(false);

  const isCategoryMatch = (skillCat: string, targetCat: string) => {
    if (targetCat === 'All') return true;
    if (skillCat === targetCat) return true;
    return normalizeCategory(skillCat) === normalizeCategory(targetCat);
  };

  const filteredSkills = skills.filter((sk) => {
    const matchesSearch =
      sk.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sk.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = isCategoryMatch(sk.category, selectedCategoryFilter);
    return matchesSearch && matchesCategory;
  });

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) {
      showToast('Please enter skill name', 'error');
      return;
    }

    if (skills.some((s) => s.name.toLowerCase() === newSkillName.trim().toLowerCase())) {
      showToast('This skill already exists in the library', 'error');
      return;
    }

    const newSkill: SkillItem = {
      id: `sk-${Date.now()}`,
      name: newSkillName.trim(),
      category: newSkillCategory,
      count: 0,
    };

    onUpdateSkills([newSkill, ...skills]);
    showToast(`Skill "${newSkill.name}" added to library!`, 'success');
    setNewSkillName('');
    setShowAddForm(false);
  };

  const handleRemoveSkill = (id: string, name: string) => {
    const confirm = window.confirm(`Remove skill "${name}" from the active skills library?`);
    if (!confirm) return;

    onUpdateSkills(skills.filter((s) => s.id !== id));
    showToast(`Removed "${name}" from skills library`, 'info');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Skills Library</h1>
          <p className="text-xs text-slate-500 mt-1">
            Global catalog of standardized skills, technical proficiencies, and software competencies.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-[#006eff] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold transition-all shadow-sm shadow-blue-500/20 flex items-center gap-2 cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill</span>
        </button>
      </div>

      {/* Add Skill Form */}
      {showAddForm && (
        <div className="bg-white border border-blue-200 rounded-2xl p-5 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#006eff]" />
              <span>Register New Skill Option</span>
            </h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleAddSkill} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                required
                placeholder="Skill name (e.g. Next.js, Midjourney, DaVinci Resolve, Meta Pixel)..."
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-[#006eff] focus:outline-none transition-all"
              />
            </div>

            <div className="w-full sm:w-64">
              <CustomSelect
                value={newSkillCategory}
                onChange={(val) => setNewSkillCategory(val)}
                options={categories.map((c) => ({
                  value: c.title,
                  label: c.title,
                }))}
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-[#006eff] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold shrink-0 shadow-sm shadow-blue-500/20 cursor-pointer transition-all"
            >
              Save Skill
            </button>
          </form>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search skills by name or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
            <span className="text-xs text-slate-500 font-medium px-1">
              {filteredSkills.length} {filteredSkills.length === 1 ? 'skill' : 'skills'}
            </span>

            {/* View Mode Toggle */}
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

        {/* Category Filter Pills (Horizontal scrollable) */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pt-1 pb-0.5 scrollbar-thin scrollbar-thumb-slate-200">
          <button
            onClick={() => setSelectedCategoryFilter('All')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer shrink-0 ${
              selectedCategoryFilter === 'All'
                ? 'bg-[#006eff] text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80 bg-slate-50'
            }`}
          >
            All Categories ({skills.length})
          </button>
          {categories.map((cat) => {
            const countInCat = skills.filter((s) => isCategoryMatch(s.category, cat.title)).length;
            const isSelected = selectedCategoryFilter === cat.title;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryFilter(cat.title)}
                className={`px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#006eff] text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80 bg-slate-50'
                }`}
              >
                <span>{cat.title}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {countInCat}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* View Skills Body */}
      {filteredSkills.length === 0 ? (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center space-y-2 shadow-2xs">
          <Tag className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No skills found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No skills matched your selected filter or search term. Try selecting "All Categories" or click "Add Skill" above.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* Comfortable Grid View with line wrapping and full visibility */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {filteredSkills.map((sk) => (
            <div
              key={sk.id}
              title={`${sk.name} • ${sk.category}`}
              className="p-3.5 bg-white hover:bg-slate-50/60 border border-slate-200/90 hover:border-[#006eff]/50 rounded-2xl flex flex-col justify-between gap-2.5 transition-all shadow-2xs hover:shadow-xs group min-h-[82px]"
            >
              <div className="flex items-start justify-between gap-2">
                {/* Full Skill Name: multiline, never clipped, clearly readable */}
                <h4 className="text-xs font-bold text-slate-900 leading-snug break-words">
                  {sk.name}
                </h4>
                <button
                  onClick={() => handleRemoveSkill(sk.id, sk.name)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer shrink-0"
                  title="Remove skill"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Tag and Count Badges */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                <span className="text-[10px] font-medium text-[#006eff] bg-blue-50/90 px-2 py-0.5 rounded-md border border-blue-100/70 truncate max-w-[170px]">
                  {sk.category}
                </span>
                <span className="text-[10px] text-slate-400 font-mono shrink-0">
                  {sk.count || 0} experts
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Detailed Table View for complete visibility */
        <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold">
                  <th className="py-3 px-4">Skill Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Active Experts</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSkills.map((sk) => (
                  <tr key={sk.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {sk.name}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-medium text-[#006eff] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                        {sk.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono">
                      {sk.count || 0} experts
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleRemoveSkill(sk.id, sk.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Remove skill"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
