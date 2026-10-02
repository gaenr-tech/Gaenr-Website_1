import React, { useState } from 'react';
import { ExpertApplication } from '../../../types';
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
} from 'lucide-react';

interface ExpertApplicationsViewProps {
  applications: ExpertApplication[];
  onDeleteApplication: (id: string) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ExpertApplicationsView: React.FC<ExpertApplicationsViewProps> = ({
  applications,
  onDeleteApplication,
  showToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSkill, setFilterSkill] = useState('all');
  const [selectedApp, setSelectedApp] = useState<ExpertApplication | null>(null);

  const filteredApps = applications.filter((app) => {
    const q = searchTerm.toLowerCase();
    const matchesQuery =
      !searchTerm.trim() ||
      app.fullName.toLowerCase().includes(q) ||
      app.email.toLowerCase().includes(q) ||
      app.whatsapp.toLowerCase().includes(q) ||
      app.skill.toLowerCase().includes(q) ||
      app.address.toLowerCase().includes(q);

    const matchesSkill =
      filterSkill === 'all' ||
      app.skill.toLowerCase().includes(filterSkill.toLowerCase());

    return matchesQuery && matchesSkill;
  });

  const uniqueSkills = Array.from(
    new Set(applications.map((a) => a.skill.split('/')[0].trim()))
  );

  const handleExportCSV = () => {
    if (applications.length === 0) {
      showToast('No responses to export', 'info');
      return;
    }
    const headers = [
      'ID',
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
    ];
    const rows = applications.map((a) => [
      a.id,
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
              Become an Expert Responses
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Directory of talent submissions and registrations received from the Join as Expert form.
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
            {applications.length} Total Responses
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by applicant name, email, WhatsApp, skill, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#006eff] transition-colors"
          />
        </div>

        {uniqueSkills.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500">Skill:</span>
            <select
              value={filterSkill}
              onChange={(e) => setFilterSkill(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#006eff] cursor-pointer"
            >
              <option value="all">All Skills ({applications.length})</option>
              {uniqueSkills.map((sk) => (
                <option key={sk} value={sk}>
                  {sk}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Responses Directory */}
      {filteredApps.length === 0 ? (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {applications.length === 0
              ? 'No Expert Applications Received Yet'
              : 'No matching responses found'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            {applications.length === 0
              ? 'When freelancers submit their details via the "Join as Expert / Become an Expert" modal on the frontend, their responses will automatically appear here in real time.'
              : 'Try clearing your search keyword or selecting a different skill filter.'}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/90 text-[10px] uppercase text-slate-500 font-bold tracking-wider font-mono">
                <tr>
                  <th className="py-3.5 px-4">Applicant</th>
                  <th className="py-3.5 px-4">Primary Skill &amp; Exp</th>
                  <th className="py-3.5 px-4">Contact &amp; Location</th>
                  <th className="py-3.5 px-4">Portfolio Link</th>
                  <th className="py-3.5 px-4">Submitted At</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Applicant */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{app.fullName}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span>{app.gender.split('/')[0].trim()}</span>
                        <span>•</span>
                        <span>{app.otherOccupation || app.occupation.split('/')[0].trim()}</span>
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

                    {/* Portfolio */}
                    <td className="py-3.5 px-4">
                      {app.portfolioUrl ? (
                        <a
                          href={
                            app.portfolioUrl.startsWith('http')
                              ? app.portfolioUrl
                              : `https://${app.portfolioUrl}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#006eff] font-semibold text-[11px] transition-colors"
                        >
                          <span>Open Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-400 italic">No link</span>
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

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedApp(app)}
                          className="p-1.5 text-slate-500 hover:text-[#006eff] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="View Full Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete application from ${app.fullName}?`)) {
                              onDeleteApplication(app.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete response"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selectedApp.fullName}</h3>
                <span className="text-[11px] text-slate-500 font-mono">
                  Applied on {new Date(selectedApp.createdAt).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
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
                <span className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Portfolio Deliverables Link</span>
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
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
