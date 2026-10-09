import React, { useState } from 'react';
import { FreelancerProfile, ServiceCategory } from '../../../types';
import { AvatarGraphic, VerifiedBadge3D } from '../../../components/common/Avatars';
import {
  Download,
  Search,
  Filter,
  FileSpreadsheet,
  FileJson,
  Printer,
  MapPin,
  Eye,
  X,
  CreditCard,
  User,
  Mail,
  Phone,
  FileText,
  Star,
  ExternalLink,
  Copy,
  Sparkles,
} from 'lucide-react';
import { CustomSelect } from '../../../components/common/CustomSelect';

interface DirectoryManageViewProps {
  freelancers: FreelancerProfile[];
  categories: ServiceCategory[];
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const DirectoryManageView: React.FC<DirectoryManageViewProps> = ({
  freelancers,
  categories,
  showToast,
}) => {
  // Filters
  const [filterCode, setFilterCode] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterSkill, setFilterSkill] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [selectedExpertDossier, setSelectedExpertDossier] = useState<FreelancerProfile | null>(null);

  // Collect all unique skills for filter
  const allSkills = Array.from(
    new Set(freelancers.flatMap((f) => f.skills || []))
  );

  const filteredDirectory = freelancers.filter((fl) => {
    // Filter by unique code
    const matchesCode =
      !filterCode || fl.code.toLowerCase().includes(filterCode.toLowerCase());

    // Filter by category
    const matchesCategory =
      filterCategory === 'All' || fl.category === filterCategory;

    // Filter by skill
    const matchesSkill =
      !filterSkill ||
      (fl.skills &&
        fl.skills.some((s) => s.toLowerCase().includes(filterSkill.toLowerCase())));

    // Filter by active/inactive status
    const isActive = (fl.status === 'active' || !fl.status) && fl.isPublic !== false;
    const matchesStatus =
      filterStatus === 'All' ||
      (filterStatus === 'Active' && isActive) ||
      (filterStatus === 'Inactive' && !isActive);

    return matchesCode && matchesCategory && matchesSkill && matchesStatus;
  });

  // 1. Export filtered directory as CSV (Excel compatible)
  const handleExportCSV = () => {
    if (filteredDirectory.length === 0) {
      showToast('No expert records to export', 'error');
      return;
    }

    const headers = [
      'Expert Code',
      'Full Legal Name (Private)',
      'Gender',
      'Category',
      'Address / District',
      'Contact Number (WhatsApp)',
      'Private Email',
      'Payment Method',
      'Payment Account Details',
      'Skills & Sub-skills',
      'Rating',
      'Public Status',
      'My Statement',
      'Internal Notes',
    ];

    const rows = filteredDirectory.map((f) => [
      `"${f.code}"`,
      `"${f.name || 'Verified Expert'}"`,
      `"${f.gender || 'Not specified'}"`,
      `"${f.categoryTitle}"`,
      `"${f.address || 'Dhaka, Bangladesh'}"`,
      `"${f.contactNumber || '+8801700000000'}"`,
      `"${f.privateEmail || `${f.code.toLowerCase()}@experts.gaenr.com`}"`,
      `"${f.paymentMethod || 'bKash'}"`,
      `"${f.paymentDetails || '01700000000'}"`,
      `"${(f.skills || []).join('; ')}"`,
      `"${f.rating}"`,
      `"${f.isPublic ? 'Public' : 'Draft'}"`,
      `"${(f.statement || '').replace(/"/g, '""')}"`,
      `"${(f.additionalNote || 'Vetted talent').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `gaenr_expert_directory_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${filteredDirectory.length} records to CSV/Excel`, 'success');
  };

  // 2. Export filtered directory as JSON Backup
  const handleExportJSON = () => {
    if (filteredDirectory.length === 0) {
      showToast('No expert records to export', 'error');
      return;
    }

    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(filteredDirectory, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute(
      'download',
      `gaenr_expert_directory_backup_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${filteredDirectory.length} records to JSON`, 'success');
  };

  // 3. Print / PDF View
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header with Multiple Export Options */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Internal Expert Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Private administrative directory containing real legal identities, verified contacts, and payout banking credentials.
          </p>
        </div>

        {/* 3 Export Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            title="Export full filtered table as CSV / Excel"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV / Excel</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            title="Download JSON structured database backup"
          >
            <FileJson className="w-4 h-4" />
            <span>JSON Backup</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            title="Print or save as PDF"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print / PDF View</span>
          </button>
        </div>
      </div>

      {/* Filter Bar: Code, Category, Skill, Status */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Filter by unique code */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1">
            Filter by Unique Code
          </label>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="e.g. GD2602001..."
              value={filterCode}
              onChange={(e) => setFilterCode(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* Filter by category */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1">
            Filter by Category
          </label>
          <CustomSelect
            value={filterCategory}
            onChange={(val) => setFilterCategory(val)}
            options={[
              { value: 'All', label: 'All Categories' },
              ...categories.map((c) => ({ value: c.slug, label: c.title })),
            ]}
          />
        </div>

        {/* Filter by skill */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1">
            Filter by Skill / Sub-skill
          </label>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="e.g. Figma, SEO, WordPress..."
              value={filterSkill}
              onChange={(e) => setFilterSkill(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Filter by status */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1">
            Filter by Status
          </label>
          <CustomSelect
            value={filterStatus}
            onChange={(val) => setFilterStatus(val as any)}
            options={[
              { value: 'All', label: 'All Status' },
              { value: 'Active', label: 'Active Experts' },
              { value: 'Inactive', label: 'Inactive / Paused' },
            ]}
          />
        </div>
      </div>

      {/* Directory Table with View Private Profile Fields (NO Verified column) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-mono uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Expert Code</th>
                <th className="py-3.5 px-4">Private Legal Name</th>
                <th className="py-3.5 px-4">Service &amp; Category</th>
                <th className="py-3.5 px-4">Present Address / District</th>
                <th className="py-3.5 px-4">Contact Phone &amp; Email</th>
                <th className="py-3.5 px-4">Payment Method &amp; Details</th>
                <th className="py-3.5 px-4 text-right">Dossier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDirectory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No expert directory records found matching your active filters.
                  </td>
                </tr>
              ) : (
                filteredDirectory.map((fl) => (
                  <tr key={fl.code} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                          <AvatarGraphic id={fl.avatarId} size={28} />
                        </div>
                        <div>
                          <span className="font-mono font-bold text-[#006eff] block">
                            {fl.code}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {fl.isPublic ? 'Public' : 'Draft'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* View Private Legal Name & Gender */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{fl.name || 'Verified Specialist'}</div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {fl.gender || 'Not specified'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{fl.categoryTitle}</div>
                      <div className="text-[10px] text-slate-400 font-mono truncate max-w-[150px]">
                        {(fl.skills || []).slice(0, 2).join(', ')}
                      </div>
                    </td>

                    {/* View Address / District */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[160px]">{fl.address || 'Dhaka, Bangladesh'}</span>
                      </div>
                    </td>

                    {/* View Contact Phone & Private Email */}
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      <div className="text-slate-900 font-medium">
                        {fl.contactNumber || '+880 1700-000000'}
                      </div>
                      <div className="text-slate-400 text-[10px] truncate max-w-[170px]">
                        {fl.privateEmail || `${fl.code.toLowerCase()}@experts.gaenr.com`}
                      </div>
                    </td>

                    {/* View Payment Method & Details */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">
                        {fl.paymentMethod || 'bKash Personal'}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">
                        {fl.paymentDetails || '01700-000000'}
                      </div>
                    </td>

                    {/* Actions / Full Dossier modal button */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedExpertDossier(fl)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#006eff] text-xs font-semibold transition-colors cursor-pointer"
                        title="View complete private dossier"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Private Dossier Modal - Complete Executive Profile Popup */}
      {selectedExpertDossier && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedExpertDossier(null);
          }}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in cursor-pointer overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 my-6 max-h-[92vh] overflow-y-auto cursor-default"
          >
            {/* Header: Avatar, Name, Verified, Status, and Close */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-[#006eff] p-0.5 overflow-hidden shrink-0 shadow-md relative flex items-center justify-center">
                  <AvatarGraphic
                    id={selectedExpertDossier.avatarId}
                    size="100%"
                    shape="circle"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-slate-900">
                      {selectedExpertDossier.name || 'Verified Expert'}
                    </h3>
                    <VerifiedBadge3D size={20} />
                    <span className="font-mono text-xs font-bold px-2 py-0.5 bg-blue-50 text-[#006eff] rounded-md border border-blue-200">
                      {selectedExpertDossier.code}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                      {selectedExpertDossier.categoryTitle}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono ${
                        selectedExpertDossier.isPublic !== false
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {selectedExpertDossier.isPublic !== false ? 'PUBLIC (LIVE)' : 'DRAFT'}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono ${
                        selectedExpertDossier.status === 'active' || !selectedExpertDossier.status
                          ? 'bg-blue-50 text-[#006eff] border border-blue-200'
                          : selectedExpertDossier.status === 'in_review'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {(selectedExpertDossier.status || 'ACTIVE').toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedExpertDossier(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Performance Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Rating</span>
                <div className="flex items-center justify-center gap-1 mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span className="font-bold text-slate-900 text-sm">
                    {selectedExpertDossier.reviewsCount > 0 ? selectedExpertDossier.rating.toFixed(1) : '0.0'}
                  </span>
                </div>
                <span className="text-[9px] text-slate-400">
                  {selectedExpertDossier.reviewsCount || 0} reviews
                </span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Deliveries</span>
                <span className="font-bold text-slate-900 text-sm block mt-0.5">
                  {selectedExpertDossier.completedProjects || 0}
                </span>
                <span className="text-[9px] text-slate-400">Projects Done</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Satisfaction</span>
                <span className="font-bold text-emerald-700 text-sm block mt-0.5">
                  {selectedExpertDossier.satisfactionRate?.satisfied ?? 100}%
                </span>
                <span className="text-[9px] text-slate-400">Positive Feedback</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Portfolio</span>
                <span className="font-bold text-[#006eff] text-sm block mt-0.5">
                  {selectedExpertDossier.portfolioItems?.length || 0}
                </span>
                <span className="text-[9px] text-slate-400">Items Showcase</span>
              </div>
            </div>

            {/* Personal & Contact Dossier */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                <User className="w-3.5 h-3.5 text-[#006eff]" />
                <span>Personal &amp; Contact Information</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Full Legal Name</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {selectedExpertDossier.name || 'Verified Expert'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Gender</span>
                  <span className="font-semibold text-slate-800">
                    {selectedExpertDossier.gender || 'Not specified'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">WhatsApp / Phone</span>
                  {selectedExpertDossier.contactNumber ? (
                    <a
                      href={`https://wa.me/${selectedExpertDossier.contactNumber.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono font-bold text-emerald-700 hover:underline inline-flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3 text-emerald-600" />
                      <span>{selectedExpertDossier.contactNumber}</span>
                    </a>
                  ) : (
                    <span className="text-slate-400 font-mono italic">Not provided</span>
                  )}
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Private Email</span>
                  {selectedExpertDossier.privateEmail ? (
                    <a
                      href={`mailto:${selectedExpertDossier.privateEmail}`}
                      className="font-mono font-bold text-[#006eff] hover:underline truncate block inline-flex items-center gap-1"
                    >
                      <Mail className="w-3 h-3 text-[#006eff]" />
                      <span className="truncate">{selectedExpertDossier.privateEmail}</span>
                    </a>
                  ) : (
                    <span className="text-slate-400 font-mono italic">Not provided</span>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Location / Address</span>
                  <span className="text-slate-800 font-semibold flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{selectedExpertDossier.address || 'Dhaka, Bangladesh'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Financial Payout Account */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                <CreditCard className="w-3.5 h-3.5 text-[#006eff]" />
                <span>Financial Payout Account</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between font-bold pb-1 border-b border-slate-200">
                  <span className="text-slate-500">Method</span>
                  <span className="text-[#006eff] font-mono font-bold uppercase">
                    {selectedExpertDossier.paymentMethod || 'Bank Transfer'}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-3 pt-0.5">
                  <span className="text-slate-500 shrink-0">Account Details:</span>
                  <span className="font-mono font-bold text-slate-900 text-right">
                    {selectedExpertDossier.paymentDetails || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Service Pricing Packages */}
            {selectedExpertDossier.pricingTiers && selectedExpertDossier.pricingTiers.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                    Service Pricing Packages
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {selectedExpertDossier.pricingTiers.length} Packages
                  </span>
                </div>

                <div className="space-y-1.5">
                  {selectedExpertDossier.pricingTiers.map((tier) => (
                    <div
                      key={tier.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                    >
                      <span className="font-medium text-slate-800">{tier.serviceName}</span>
                      <span className="font-mono font-bold text-emerald-700">
                        {tier.price} BDT
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* My Statement */}
            {selectedExpertDossier.statement && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono block">
                  My Statement (Public Profile)
                </span>
                <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100 text-slate-700 text-xs leading-relaxed italic">
                  "{selectedExpertDossier.statement}"
                </div>
              </div>
            )}

            {/* Skills & Sub-skills */}
            {selectedExpertDossier.skills && selectedExpertDossier.skills.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono block">
                  Assigned Skills &amp; Competencies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedExpertDossier.skills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Direct Links (Live Profile & Upload Portal) */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono block">
                System Portals &amp; Live Links
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {/* Live Public Profile Link */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                  <div className="truncate">
                    <span className="text-[10px] text-slate-400 block font-mono">Public Profile</span>
                    <span className="font-mono text-slate-700 truncate block text-[11px]">
                      /experts/{selectedExpertDossier.code}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        const url = `${window.location.origin}/experts/${selectedExpertDossier.code}`;
                        navigator.clipboard.writeText(url);
                        showToast('Live profile link copied', 'success');
                      }}
                      className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors cursor-pointer"
                      title="Copy public URL"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={`${window.location.origin}/experts/${selectedExpertDossier.code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 hover:bg-slate-200 rounded-lg text-[#006eff] transition-colors cursor-pointer"
                      title="Visit public profile"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Upload Portal Link */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                  <div className="truncate">
                    <span className="text-[10px] text-slate-400 block font-mono">Upload Portal</span>
                    <span className="font-mono text-slate-700 truncate block text-[11px]">
                      /u/{selectedExpertDossier.uploadToken ? '••••••••' : selectedExpertDossier.code}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        const token = selectedExpertDossier.uploadToken || selectedExpertDossier.code;
                        const url = `${window.location.origin}/u/${encodeURIComponent(token)}`;
                        navigator.clipboard.writeText(url);
                        showToast('Upload portal link copied', 'success');
                      }}
                      className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors cursor-pointer"
                      title="Copy upload portal link"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={`${window.location.origin}/u/${encodeURIComponent(selectedExpertDossier.uploadToken || selectedExpertDossier.code)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 hover:bg-slate-200 rounded-lg text-emerald-600 transition-colors cursor-pointer"
                      title="Open upload portal"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Google Drive Link if exists */}
              {selectedExpertDossier.googleDriveFolderUrl && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 text-xs">
                  <div className="truncate">
                    <span className="text-[10px] text-slate-400 block font-mono">Google Drive Asset Folder</span>
                    <span className="font-mono text-slate-700 truncate block text-[11px]">
                      {selectedExpertDossier.googleDriveFolderUrl}
                    </span>
                  </div>
                  <a
                    href={selectedExpertDossier.googleDriveFolderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <span>Drive</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedExpertDossier(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
