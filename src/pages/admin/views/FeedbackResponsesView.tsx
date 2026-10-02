import React, { useState } from 'react';
import { FeedbackSubmission } from '../../../types';
import {
  MessageSquare,
  Search,
  Trash2,
  Eye,
  X,
  Mail,
  User,
  Lightbulb,
  Bug,
  Sparkles,
  Download,
  Filter,
} from 'lucide-react';

interface FeedbackResponsesViewProps {
  feedbacks: FeedbackSubmission[];
  onDeleteFeedback: (id: string) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const FeedbackResponsesView: React.FC<FeedbackResponsesViewProps> = ({
  feedbacks,
  onDeleteFeedback,
  showToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackSubmission | null>(null);

  const filteredFeedbacks = feedbacks.filter((fb) => {
    const q = searchTerm.toLowerCase();
    const matchesQuery =
      !searchTerm.trim() ||
      (fb.name && fb.name.toLowerCase().includes(q)) ||
      (fb.email && fb.email.toLowerCase().includes(q)) ||
      fb.message.toLowerCase().includes(q);

    const matchesCategory =
      filterCategory === 'all' || fb.category === filterCategory;

    return matchesQuery && matchesCategory;
  });

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'Suggestion / Idea':
        return {
          icon: Lightbulb,
          color: 'bg-amber-50 text-amber-700 border-amber-200',
        };
      case 'Issue or Bug':
        return {
          icon: Bug,
          color: 'bg-rose-50 text-rose-700 border-rose-200',
        };
      case 'Feature Request':
        return {
          icon: Sparkles,
          color: 'bg-purple-50 text-purple-700 border-purple-200',
        };
      default:
        return {
          icon: MessageSquare,
          color: 'bg-blue-50 text-[#006eff] border-blue-200',
        };
    }
  };

  const handleExportCSV = () => {
    if (feedbacks.length === 0) {
      showToast('No feedback responses to export', 'info');
      return;
    }
    const headers = ['ID', 'Date', 'Name', 'Email', 'User Type', 'Category', 'Message'];
    const rows = feedbacks.map((fb) => [
      fb.id,
      new Date(fb.createdAt).toLocaleString(),
      `"${(fb.name || 'Anonymous').replace(/"/g, '""')}"`,
      `"${(fb.email || '').replace(/"/g, '""')}"`,
      `"${fb.userType}"`,
      `"${fb.category}"`,
      `"${fb.message.replace(/"/g, '""')}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `feedback_responses_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported feedbacks to CSV', 'success');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-[#006eff]">
              <MessageSquare className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Feedback Form Responses
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Directory of platform feedback, feature requests, suggestions, and issue reports submitted by users.
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
            {feedbacks.length} Total Feedbacks
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search feedback message, user name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#006eff] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-500">Category:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#006eff] cursor-pointer"
          >
            <option value="all">All Categories ({feedbacks.length})</option>
            <option value="Suggestion / Idea">Suggestion / Idea</option>
            <option value="Issue or Bug">Issue or Bug</option>
            <option value="Feature Request">Feature Request</option>
            <option value="General Feedback">General Feedback</option>
          </select>
        </div>
      </div>

      {/* Responses Directory */}
      {filteredFeedbacks.length === 0 ? (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {feedbacks.length === 0
              ? 'No Feedback Received Yet'
              : 'No matching feedback found'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            {feedbacks.length === 0
              ? 'When visitors, clients, or experts submit thoughts via the "Share Feedback" page on the frontend, their responses will automatically display here in real time.'
              : 'Try clearing your search keyword or selecting a different category filter.'}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/90 text-[10px] uppercase text-slate-500 font-bold tracking-wider font-mono">
                <tr>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Feedback Message</th>
                  <th className="py-3.5 px-4">Submitted At</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFeedbacks.map((fb) => {
                  const badge = getCategoryBadge(fb.category);
                  const Icon = badge.icon;
                  return (
                    <tr key={fb.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* User */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900">
                          {fb.name || 'Anonymous User'}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {fb.email ? (
                            <a href={`mailto:${fb.email}`} className="hover:underline">
                              {fb.email}
                            </a>
                          ) : (
                            <span className="text-slate-400 italic">No email provided</span>
                          )}
                        </div>
                        <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.2 rounded bg-slate-100 text-slate-600">
                          {fb.userType}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${badge.color}`}
                        >
                          <Icon className="w-3.5 h-3.5 shrink-0" />
                          <span>{fb.category}</span>
                        </span>
                      </td>

                      {/* Message Preview */}
                      <td className="py-3.5 px-4 max-w-md">
                        <p className="text-slate-700 line-clamp-2 leading-relaxed">
                          {fb.message}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {new Date(fb.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                        <div className="text-[10px] text-slate-400">
                          {new Date(fb.createdAt).toLocaleTimeString('en-US', {
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
                            onClick={() => setSelectedFeedback(fb)}
                            className="p-1.5 text-slate-500 hover:text-[#006eff] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="View Full Message"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm('Delete this feedback entry?')) {
                                onDeleteFeedback(fb.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete feedback"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* Details Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedFeedback.name || 'Anonymous Feedback'}
                </h3>
                <span className="text-[11px] text-slate-500 font-mono">
                  Submitted on {new Date(selectedFeedback.createdAt).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => setSelectedFeedback(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                    getCategoryBadge(selectedFeedback.category).color
                  }`}
                >
                  <span>{selectedFeedback.category}</span>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-mono font-semibold text-[11px]">
                  Role: {selectedFeedback.userType}
                </span>
              </div>

              {selectedFeedback.email && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <a
                    href={`mailto:${selectedFeedback.email}`}
                    className="font-semibold text-[#006eff] hover:underline"
                  >
                    {selectedFeedback.email}
                  </a>
                </div>
              )}

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block mb-1">
                  Message Content
                </span>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 leading-relaxed whitespace-pre-line text-sm">
                  {selectedFeedback.message}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedFeedback(null)}
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
