import React, { useState } from 'react';
import { ExpertApplication, ExpertApplicationStatus } from '../../../types';
import { RAW_AVATAR_SPECS, AvatarGraphic } from '../../../components/common/Avatars';
import {
  Users,
  Search,
  ExternalLink,
  Trash2,
  CheckCircle,
  Eye,
  X,
  Phone,
  Mail,
  Briefcase,
  MapPin,
  Clock,
  Award,
  Sparkles,
  Download,
  Copy,
  UserCheck,
  Check,
  CreditCard,
  Quote,
  Upload,
  AlertCircle,
  Layers,
} from 'lucide-react';

interface ExpertApplicationsViewProps {
  applications: ExpertApplication[];
  onDeleteApplication: (id: string) => void;
  onUpdateStatus?: (id: string, status: ExpertApplicationStatus) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  navigate?: (route: string) => void;
}

export const ExpertApplicationsView: React.FC<ExpertApplicationsViewProps> = ({
  applications,
  onDeleteApplication,
  onUpdateStatus,
  showToast,
  navigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSkill, setFilterSkill] = useState('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<ExpertApplication | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredApps = applications.filter((app) => {
    const q = searchTerm.toLowerCase();
    const matchesQuery =
      !searchTerm.trim() ||
      app.fullName.toLowerCase().includes(q) ||
      app.email.toLowerCase().includes(q) ||
      app.whatsapp.toLowerCase().includes(q) ||
      app.skill.toLowerCase().includes(q) ||
      app.address.toLowerCase().includes(q) ||
      (app.convertedExpertCode && app.convertedExpertCode.toLowerCase().includes(q));

    const matchesSkill =
      filterSkill === 'all' ||
      app.skill.toLowerCase().includes(filterSkill.toLowerCase());

    const appStatus = app.status || 'applied';
    const matchesStatus =
      filterStatus === 'all' ||
      appStatus === filterStatus;

    return matchesQuery && matchesSkill && matchesStatus;
  });

  const uniqueSkills = Array.from(
    new Set(applications.map((a) => a.skill.split('/')[0].trim()))
  );

  const handleCopyLink = (url: string, id: string, label: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast(`${label} copied to clipboard`, 'success');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleExportCSV = () => {
    if (applications.length === 0) {
      showToast('No responses to export', 'info');
      return;
    }
    const headers = [
      'ID',
      'Status',
      'Expert Code',
      'Date',
      'Full Name',
      'WhatsApp',
      'Email',
      'Gender',
      'Occupation',
      'Location',
      'Primary Skill',
      'Experience',
      'Portfolio URL',
      'Has Onboarding',
    ];
    const rows = applications.map((a) => [
      a.id,
      a.status || 'applied',
      a.convertedExpertCode || 'N/A',
      new Date(a.createdAt).toLocaleString(),
      `"${a.fullName.replace(/"/g, '""')}"`,
      `"${a.whatsapp}"`,
      `"${a.email}"`,
      `"${a.gender}"`,
      `"${(a.otherOccupation || a.occupation).replace(/"/g, '""')}"`,
      `"${(a.otherAddress || a.address).replace(/"/g, '""')}"`,
      `"${(a.otherSkill || a.skill).replace(/"/g, '""')}"`,
      `"${a.experience}"`,
      `"${a.portfolioUrl.replace(/"/g, '""')}"`,
      a.onboardingData ? 'Yes' : 'No',
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `expert_applications_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported applications to CSV', 'success');
  };

  const getStatusBadge = (status?: ExpertApplicationStatus) => {
    switch (status) {
      case 'onboarded':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold font-mono">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            <span>ONBOARDED (LIVE)</span>
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold font-mono">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>APPROVED</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold font-mono">
            <X className="w-3 h-3 text-rose-600" />
            <span>REJECTED</span>
          </span>
        );
      case 'applied':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#006eff] border border-blue-200 text-[10px] font-bold font-mono">
            <Sparkles className="w-3 h-3 text-[#006eff]" />
            <span>APPLIED</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-[#006eff]">
              <Users className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Become an Expert Responses &amp; Onboarding
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review talent applications, approve for onboarding, and convert to live expert profiles automatically.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Export as CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <div className="px-3 py-1.5 bg-blue-50 text-[#006eff] rounded-xl text-xs font-bold font-mono border border-blue-200/60">
            {applications.length} Total Applications
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, WhatsApp, skill, location, or expert code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#006eff] transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-500">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#006eff] cursor-pointer"
            >
              <option value="all">All Statuses ({applications.length})</option>
              <option value="applied">Applied ({applications.filter((a) => (a.status || 'applied') === 'applied').length})</option>
              <option value="approved">Approved ({applications.filter((a) => a.status === 'approved').length})</option>
              <option value="onboarded">Onboarded / Live ({applications.filter((a) => a.status === 'onboarded').length})</option>
              <option value="rejected">Rejected ({applications.filter((a) => a.status === 'rejected').length})</option>
            </select>
          </div>

          {/* Skill Filter */}
          {uniqueSkills.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-500">Skill:</span>
              <select
                value={filterSkill}
                onChange={(e) => setFilterSkill(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#006eff] cursor-pointer"
              >
                <option value="all">All Skills</option>
                {uniqueSkills.map((sk) => (
                  <option key={sk} value={sk}>
                    {sk}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Responses Directory Table */}
      {filteredApps.length === 0 ? (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {applications.length === 0
              ? 'No Expert Applications Received Yet'
              : 'No matching applications found'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            {applications.length === 0
              ? 'When freelancers submit their details via the "Join as Expert" form, their responses will appear here in real time.'
              : 'Try clearing your search keyword or selecting a different status/skill filter.'}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/90 text-[10px] uppercase text-slate-500 font-bold tracking-wider font-mono">
                <tr>
                  <th className="py-3.5 px-4">Applicant &amp; Status</th>
                  <th className="py-3.5 px-4">Primary Skill &amp; Exp</th>
                  <th className="py-3.5 px-4">Contact &amp; Location</th>
                  <th className="py-3.5 px-4">Onboarding Progress</th>
                  <th className="py-3.5 px-4">Submitted At</th>
                  <th className="py-3.5 px-4 text-right">Workflow Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApps.map((app) => {
                  const status = app.status || 'applied';
                  const onboardingUrl = `${window.location.origin}/expert-onboarding/${app.id}`;
                  const uploadUrl = app.convertedExpertCode
                    ? `${window.location.origin}/expert-portfolio-upload/${app.convertedExpertCode}`
                    : '';

                  return (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Applicant & Status */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{app.fullName}</span>
                          {getStatusBadge(status)}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-1">
                          <span>{app.gender.split('/')[0].trim()}</span>
                          <span>•</span>
                          <span>{app.otherOccupation || app.occupation.split('/')[0].trim()}</span>
                          {app.convertedExpertCode && (
                            <>
                              <span>•</span>
                              <span className="font-mono font-bold text-[#006eff]">
                                {app.convertedExpertCode}
                              </span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Skill & Experience */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-blue-50 text-[#006eff] font-semibold text-[11px] border border-blue-100">
                          {app.otherSkill || app.skill.split('/')[0].trim()}
                        </span>
                        <div className="text-[11px] text-slate-500 mt-1 font-mono">
                          Exp: {app.experience.split('/')[0].trim()}
                        </div>
                      </td>

                      {/* Contact & Location */}
                      <td className="py-3.5 px-4 space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                          <a
                            href={`https://wa.me/${app.whatsapp.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-emerald-700 hover:underline font-semibold"
                          >
                            {app.whatsapp}
                          </a>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Mail className="w-3 h-3 shrink-0" />
                          <span className="truncate max-w-[150px]">{app.email}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span>{app.otherAddress || app.address.split('/')[0].trim()}</span>
                        </div>
                      </td>

                      {/* Onboarding Progress */}
                      <td className="py-3.5 px-4">
                        {status === 'onboarded' ? (
                          <div className="space-y-1">
                            <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Live on Website</span>
                            </span>
                            <div className="text-[10px] text-slate-500 font-mono">
                              Code: <b className="text-slate-800">{app.convertedExpertCode}</b>
                            </div>
                          </div>
                        ) : status === 'approved' ? (
                          app.onboardingData ? (
                            <div className="space-y-1">
                              <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Onboarding Submitted</span>
                              </span>
                              <div className="text-[10px] text-slate-500 font-mono">
                                Ready to convert to Live
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <span className="text-[11px] font-semibold text-amber-700 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-amber-600" />
                                <span>Link Sent / Pending</span>
                              </span>
                              <div className="text-[10px] text-slate-400 font-mono">
                                Awaiting candidate form
                              </div>
                            </div>
                          )
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">
                            Pending application review
                          </span>
                        )}
                      </td>

                      {/* Submitted Date */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {new Date(app.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                        <div className="text-[10px] text-slate-400">
                          {new Date(app.createdAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>

                      {/* Workflow Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {/* 1. If applied -> Approve & Generate Onboarding */}
                          {status === 'applied' && onUpdateStatus && (
                            <button
                              type="button"
                              onClick={() => onUpdateStatus(app.id, 'approved')}
                              className="px-2.5 py-1 bg-[#006eff] hover:bg-blue-600 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors shadow-2xs cursor-pointer"
                              title="Approve applicant and generate private onboarding link"
                            >
                              <UserCheck className="w-3 h-3" />
                              <span>Approve</span>
                            </button>
                          )}

                          {/* 2. If approved -> Copy Onboarding Link & Convert */}
                          {status === 'approved' && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleCopyLink(onboardingUrl, `onb-${app.id}`, 'Onboarding Form link')}
                                className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                                title="Copy candidate onboarding questionnaire link"
                              >
                                {copiedId === `onb-${app.id}` ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    <span>Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3 text-amber-700" />
                                    <span>Copy Form Link</span>
                                  </>
                                )}
                              </button>

                              {onUpdateStatus && (
                                <button
                                  type="button"
                                  onClick={() => onUpdateStatus(app.id, 'onboarded')}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors shadow-2xs cursor-pointer"
                                  title="Auto-create expert profile and generate unique expert code"
                                >
                                  <Sparkles className="w-3 h-3" />
                                  <span>Convert to Live</span>
                                </button>
                              )}
                            </>
                          )}

                          {/* 3. If onboarded -> Open Profile & Upload Portal */}
                          {status === 'onboarded' && app.convertedExpertCode && (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  if (navigate) {
                                    navigate(`/expert-portfolio-upload/${app.convertedExpertCode}`);
                                  } else {
                                    window.open(uploadUrl, '_blank');
                                  }
                                }}
                                className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-[#006eff] border border-blue-200 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                                title="Open Dedicated Portfolio Upload Portal"
                              >
                                <Upload className="w-3 h-3" />
                                <span>Portfolio Portal</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  if (navigate) {
                                    navigate(`/profile/${app.convertedExpertCode}`);
                                  } else {
                                    window.open(`/profile/${app.convertedExpertCode}`, '_blank');
                                  }
                                }}
                                className="p-1.5 text-slate-500 hover:text-[#006eff] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                title="View public profile"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}

                          {/* View Full Details Modal Button */}
                          <button
                            type="button"
                            onClick={() => setSelectedApp(app)}
                            className="p-1.5 text-slate-500 hover:text-[#006eff] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="View Full Details & Onboarding responses"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Application */}
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete application from ${app.fullName}?`)) {
                                onDeleteApplication(app.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete application"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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

      {/* Details & Onboarding Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150 my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">{selectedApp.fullName}</h3>
                  {getStatusBadge(selectedApp.status)}
                </div>
                <span className="text-[11px] text-slate-500 font-mono">
                  Application ID: {selectedApp.id} • Submitted {new Date(selectedApp.createdAt).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Applicant Personal & Contact Info */}
            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">WhatsApp</span>
                  <a
                    href={`https://wa.me/${selectedApp.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-emerald-700 hover:underline"
                  >
                    {selectedApp.whatsapp}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Email</span>
                  <a href={`mailto:${selectedApp.email}`} className="font-bold text-[#006eff] hover:underline">
                    {selectedApp.email}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Gender</span>
                  <span className="font-semibold text-slate-800">{selectedApp.gender}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Occupation</span>
                  <span className="font-semibold text-slate-800">
                    {selectedApp.otherOccupation || selectedApp.occupation}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Location / City</span>
                  <span className="font-semibold text-slate-800">
                    {selectedApp.otherAddress || selectedApp.address}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Experience</span>
                  <span className="font-semibold text-slate-800">{selectedApp.experience}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Primary Skill</span>
                <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl font-bold text-[#006eff]">
                  {selectedApp.otherSkill || selectedApp.skill}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block mb-1">
                  Submitted Portfolio Link
                </span>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-2">
                  <span className="font-mono text-slate-700 truncate">{selectedApp.portfolioUrl}</span>
                  <a
                    href={
                      selectedApp.portfolioUrl.startsWith('http')
                        ? selectedApp.portfolioUrl
                        : `https://${selectedApp.portfolioUrl}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-[#006eff] hover:bg-blue-600 text-white font-bold rounded-lg shrink-0 flex items-center gap-1"
                  >
                    <span>Visit</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Onboarding Questionnaire Response Details Section */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#006eff]" />
                    <span>Onboarding Questionnaire Data</span>
                  </span>
                  {selectedApp.onboardingData ? (
                    <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      SUBMITTED
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      NOT YET SUBMITTED
                    </span>
                  )}
                </div>

                {selectedApp.onboardingData ? (
                  <div className="space-y-3 p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/30 border border-blue-100">
                    {/* Selected Avatar */}
                    {selectedApp.onboardingData.avatarId && (
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 p-1 shrink-0">
                          <AvatarGraphic
                            avatar={
                              RAW_AVATAR_SPECS.find(
                                (a) => a.id === selectedApp.onboardingData?.avatarId
                              ) || RAW_AVATAR_SPECS[0]
                            }
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-mono uppercase block">
                            Selected Avatar Identity
                          </span>
                          <span className="font-bold text-slate-900">
                            {
                              RAW_AVATAR_SPECS.find(
                                (a) => a.id === selectedApp.onboardingData?.avatarId
                              )?.name
                            }{' '}
                            <span className="text-slate-400 font-mono text-xs">
                              ({selectedApp.onboardingData.avatarId})
                            </span>
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Pricing Model */}
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono uppercase block">
                        Base Pricing Structure
                      </span>
                      <span className="font-bold text-slate-900 text-sm">
                        {selectedApp.onboardingData.pricingModel}
                      </span>
                    </div>

                    {/* Pricing Tiers Table */}
                    {selectedApp.onboardingData.pricingTiers &&
                      selectedApp.onboardingData.pricingTiers.length > 0 && (
                        <div>
                          <span className="text-[10px] text-slate-400 font-mono uppercase block mb-1">
                            Service Pricing Packages
                          </span>
                          <div className="space-y-1.5">
                            {selectedApp.onboardingData.pricingTiers.map((tier) => (
                              <div
                                key={tier.id}
                                className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs"
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
                    {selectedApp.onboardingData.statement && (
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono uppercase block mb-1">
                          Applicant Public Statement
                        </span>
                        <div className="p-3 rounded-xl bg-white border border-slate-200 italic text-slate-700 text-xs leading-relaxed">
                          "{selectedApp.onboardingData.statement}"
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-center space-y-2">
                    <p className="text-xs text-amber-800">
                      The applicant has not yet filled out their onboarding questionnaire.
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyLink(
                          `${window.location.origin}/expert-onboarding/${selectedApp.id}`,
                          `modal-${selectedApp.id}`,
                          'Onboarding Link'
                        )
                      }
                      className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy Onboarding Link for Candidate</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                {selectedApp.status === 'applied' && onUpdateStatus && (
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateStatus(selectedApp.id, 'approved');
                      setSelectedApp({ ...selectedApp, status: 'approved' });
                    }}
                    className="px-4 py-2 bg-[#006eff] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Approve &amp; Send Onboarding
                  </button>
                )}

                {selectedApp.status === 'approved' && onUpdateStatus && (
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateStatus(selectedApp.id, 'onboarded');
                      setSelectedApp({ ...selectedApp, status: 'onboarded' });
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Auto-Convert to Live Expert</span>
                  </button>
                )}

                {selectedApp.status === 'onboarded' && selectedApp.convertedExpertCode && (
                  <button
                    type="button"
                    onClick={() => {
                      if (navigate) {
                        navigate(`/expert-portfolio-upload/${selectedApp.convertedExpertCode}`);
                      } else {
                        window.open(
                          `/expert-portfolio-upload/${selectedApp.convertedExpertCode}`,
                          '_blank'
                        );
                      }
                      setSelectedApp(null);
                    }}
                    className="px-4 py-2 bg-[#006eff] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Open Portfolio Upload Portal</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
