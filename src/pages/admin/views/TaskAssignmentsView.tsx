import React, { useState } from 'react';
import { TaskAssignment } from '../../../types';
import {
  FolderKanban,
  Search,
  ExternalLink,
  Trash2,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  Calendar,
  Layers,
  FileText,
  DollarSign,
  Edit2,
  Save,
  Download,
  Bot,
  Globe,
  MessageCircle,
  Eye,
  X,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

interface TaskAssignmentsViewProps {
  tasks: TaskAssignment[];
  onUpdateStatus: (taskId: string, status: TaskAssignment['status']) => void;
  onUpdateTask: (taskId: string, updates: Partial<TaskAssignment>) => void;
  onDeleteTask: (taskId: string) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const TaskAssignmentsView: React.FC<TaskAssignmentsViewProps> = ({
  tasks,
  onUpdateStatus,
  onUpdateTask,
  onDeleteTask,
  showToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedTask, setSelectedTask] = useState<TaskAssignment | null>(null);

  // Inline pricing edit state: map taskId -> draftPrice string
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [draftPrice, setDraftPrice] = useState<string>('');

  const statusOptions: Array<{ value: TaskAssignment['status']; label: string; color: string }> = [
    { value: 'pending_review', label: 'Pending Review', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { value: 'payment_escrow', label: 'Escrow Funded', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { value: 'in_progress', label: 'In Progress', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    { value: 'completed', label: 'Completed', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  ];

  const getStatusBadge = (status: TaskAssignment['status']) => {
    const match = statusOptions.find((s) => s.value === status) || statusOptions[0];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${match.color}`}>
        {match.label}
      </span>
    );
  };

  const filteredTasks = tasks.filter((t) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm.trim() ||
      t.id.toLowerCase().includes(q) ||
      t.fullName.toLowerCase().includes(q) ||
      t.email.toLowerCase().includes(q) ||
      t.whatsapp.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.subCategory.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q);

    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalCalculatedRevenue = tasks.reduce((sum, t) => {
    const val = Number(t.price);
    return !isNaN(val) ? sum + val : sum;
  }, 0);

  const startEditPrice = (t: TaskAssignment) => {
    setEditingPriceId(t.id);
    setDraftPrice(t.price !== undefined ? String(t.price) : '');
  };

  const saveEditPrice = (taskId: string) => {
    const clean = draftPrice.trim();
    onUpdateTask(taskId, { price: clean ? clean : undefined });
    setEditingPriceId(null);
    showToast('Task pricing updated successfully', 'success');
  };

  const handleExportCSV = () => {
    if (tasks.length === 0) {
      showToast('No tasks to export', 'info');
      return;
    }
    const headers = [
      'Task ID',
      'Created Date',
      'Source',
      'Client Name',
      'WhatsApp',
      'Email',
      'Category',
      'Sub-Service',
      'Deadline',
      'Price (BDT)',
      'Status',
      'Project Brief',
      'Document URL',
    ];
    const rows = tasks.map((t) => [
      t.id,
      new Date(t.createdAt).toLocaleString(),
      t.assignedVia === 'ginny_ai' ? 'Ginny AI' : 'Website Form',
      `"${t.fullName.replace(/"/g, '""')}"`,
      `"${t.whatsapp}"`,
      `"${t.email}"`,
      `"${t.category}"`,
      `"${t.subCategory.replace(/"/g, '""')}"`,
      `"${t.deadline}"`,
      t.price || 'Not set',
      t.status,
      `"${t.description.replace(/"/g, '""')}"`,
      `"${t.documentUrl || ''}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `gaenr_tasks_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported tasks to CSV', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Client Task Assignments
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-[#006eff]">
              {tasks.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage incoming client orders from Ginny AI chatbot &amp; website modal, update status, and manage task pricing records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {tasks.filter((t) => t.status === 'pending_review').length}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">In Progress / Escrow</span>
            <FolderKanban className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {tasks.filter((t) => t.status === 'in_progress' || t.status === 'payment_escrow').length}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Completed</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {tasks.filter((t) => t.status === 'completed').length}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Recorded Volume</span>
            <DollarSign className="w-4 h-4 text-[#006eff]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#006eff] truncate">
            ৳ {totalCalculatedRevenue.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-colors cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-[#006eff] text-white shadow-xs font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({tasks.length})
          </button>
          {statusOptions.map((opt) => {
            const count = tasks.filter((t) => t.status === opt.value).length;
            return (
              <button
                key={opt.value}
                onClick={() => setFilterStatus(opt.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-colors cursor-pointer ${
                  filterStatus === opt.value
                    ? 'bg-[#006eff] text-white shadow-xs font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {opt.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by client, ID, service..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006eff]/20 focus:border-[#006eff]"
          />
        </div>
      </div>

      {/* Tasks Table / Cards */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#006eff] flex items-center justify-center mx-auto mb-3">
            <FolderKanban className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No task assignments found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchTerm || filterStatus !== 'all'
              ? 'Try modifying your search query or filter settings.'
              : 'New project requests assigned via Ginny AI or the website modal will appear here in real-time.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-mono uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4 font-semibold">Ref &amp; Client</th>
                  <th className="py-3 px-4 font-semibold">Source</th>
                  <th className="py-3 px-4 font-semibold">Service &amp; Deadline</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Pricing (BDT)</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredTasks.map((t) => {
                  const isEditingPrice = editingPriceId === t.id;
                  const cleanPhone = t.whatsapp.replace(/\D/g, '');
                  const waLink = `https://wa.me/88${cleanPhone.startsWith('88') ? cleanPhone.slice(2) : cleanPhone}`;

                  return (
                    <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Ref & Client */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-mono font-bold text-slate-800 text-[11px]">
                            {t.id}
                          </span>
                          <span className="font-semibold text-slate-900 text-sm">
                            {t.fullName}
                          </span>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>{t.whatsapp}</span>
                            </a>
                            <span>•</span>
                            <span className="truncate max-w-[130px]">{t.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Source */}
                      <td className="py-3.5 px-4 align-top">
                        {t.assignedVia === 'ginny_ai' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-[#006eff] border border-blue-200/70 font-semibold text-[10px]">
                            <Bot className="w-3 h-3" />
                            Ginny AI
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-medium text-[10px]">
                            <Globe className="w-3 h-3" />
                            Web Form
                          </span>
                        )}
                        <div className="text-[10px] text-slate-400 mt-1">
                          {new Date(t.createdAt).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                      </td>

                      {/* Service & Deadline */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="font-medium text-slate-900">
                          {t.subCategory || t.category}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>Deadline: {t.deadline}</span>
                        </div>
                        {t.documentUrl && (
                          <a
                            href={t.documentUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-[#006eff] hover:underline mt-1 font-medium"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Attached Asset</span>
                          </a>
                        )}
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-4 align-top">
                        <select
                          value={t.status}
                          onChange={(e) =>
                            onUpdateStatus(t.id, e.target.value as TaskAssignment['status'])
                          }
                          className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-800 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#006eff]/30 cursor-pointer"
                        >
                          {statusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Pricing (BDT) Edit */}
                      <td className="py-3.5 px-4 align-top">
                        {isEditingPrice ? (
                          <div className="flex items-center gap-1">
                            <div className="relative">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                                ৳
                              </span>
                              <input
                                type="text"
                                value={draftPrice}
                                onChange={(e) => setDraftPrice(e.target.value)}
                                placeholder="5000"
                                className="w-24 pl-5 pr-2 py-1 text-xs font-bold border border-[#006eff] rounded-lg focus:outline-none bg-blue-50/50"
                                autoFocus
                              />
                            </div>
                            <button
                              onClick={() => saveEditPrice(t.id)}
                              className="p-1 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors cursor-pointer"
                              title="Save Price"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingPriceId(null)}
                              className="p-1 rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors cursor-pointer"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => startEditPrice(t)}
                            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-slate-100 group cursor-pointer transition-colors"
                            title="Click to edit or add pricing"
                          >
                            <span className="font-bold text-slate-800">
                              {t.price !== undefined && t.price !== '' ? `৳ ${t.price}` : '— Set Price'}
                            </span>
                            <Edit2 className="w-3 h-3 text-slate-400 group-hover:text-[#006eff] transition-colors" />
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 align-top text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedTask(t)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#006eff] hover:bg-blue-50 transition-colors cursor-pointer"
                            title="View Full Brief"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete task ${t.id}?`)) {
                                onDeleteTask(t.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Task Record"
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

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-mono uppercase font-bold text-[#006eff] bg-blue-50 px-2 py-0.5 rounded-md">
                  Ref: {selectedTask.id}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Project Brief &amp; Requirements
                </h3>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Details Grid */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl text-xs border border-slate-100">
              <div>
                <span className="text-slate-400 font-medium block">Client Name</span>
                <span className="font-semibold text-slate-900">{selectedTask.fullName}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">WhatsApp</span>
                <a
                  href={`https://wa.me/88${selectedTask.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-emerald-600 hover:underline flex items-center gap-1"
                >
                  <MessageCircle className="w-3 h-3" />
                  {selectedTask.whatsapp}
                </a>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Email Address</span>
                <span className="font-semibold text-slate-900">{selectedTask.email}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Target Deadline</span>
                <span className="font-semibold text-slate-900">{selectedTask.deadline}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Category / Deliverable</span>
                <span className="font-semibold text-slate-900">{selectedTask.subCategory || selectedTask.category}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Accounting Price</span>
                <span className="font-bold text-[#006eff]">
                  {selectedTask.price ? `৳ ${selectedTask.price}` : 'Not Specified'}
                </span>
              </div>
            </div>

            {/* Project Requirements Full Text */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Project Requirements:</label>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs text-slate-800 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                {selectedTask.description}
              </div>
            </div>

            {/* Project Link if present */}
            {selectedTask.documentUrl && (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-blue-50 border border-blue-200/60 text-xs">
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <ExternalLink className="w-4 h-4 text-[#006eff]" />
                  <span>External Asset / Document Link</span>
                </div>
                <a
                  href={selectedTask.documentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[#006eff] hover:underline"
                >
                  Open Link
                </a>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <a
                href={`https://wa.me/88${selectedTask.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>
              <button
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
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
