import React, { useState, useEffect } from 'react';
import { TaskAssignment } from '../../../types';
import {
  FolderKanban,
  Search,
  ExternalLink,
  Trash2,
  CheckCircle,
  Clock,
  DollarSign,
  Edit2,
  Save,
  Download,
  Bot,
  Globe,
  MessageCircle,
  Eye,
  X,
  AlertCircle,
  Check,
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

  // Inline pricing edit state for table rows
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [draftPrice, setDraftPrice] = useState<string>('');

  // Modal price editing state
  const [isModalEditingPrice, setIsModalEditingPrice] = useState(false);
  const [modalDraftPrice, setModalDraftPrice] = useState<string>('');

  // Delete confirmation modal state
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const statusOptions: Array<{ value: TaskAssignment['status']; label: string; color: string }> = [
    { value: 'pending_review', label: 'Pending Review', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { value: 'payment_escrow', label: 'Escrow Funded', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { value: 'in_progress', label: 'In Progress', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    { value: 'completed', label: 'Completed', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  ];

  // Sync selectedTask when underlying tasks array updates
  useEffect(() => {
    if (selectedTask) {
      const refreshed = tasks.find((t) => t.id === selectedTask.id);
      if (refreshed) {
        setSelectedTask(refreshed);
      }
    }
  }, [tasks]);

  // Handle escape key to close modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (deletingTaskId) {
          setDeletingTaskId(null);
        } else if (selectedTask) {
          setSelectedTask(null);
        } else if (editingPriceId) {
          setEditingPriceId(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deletingTaskId, selectedTask, editingPriceId]);

  const filteredTasks = tasks.filter((t) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm.trim() ||
      (t.id || '').toLowerCase().includes(q) ||
      (t.fullName || '').toLowerCase().includes(q) ||
      (t.email || '').toLowerCase().includes(q) ||
      (t.whatsapp || '').toLowerCase().includes(q) ||
      (t.category || '').toLowerCase().includes(q) ||
      (t.subCategory || '').toLowerCase().includes(q) ||
      (t.description || '').toLowerCase().includes(q);

    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalCalculatedRevenue = tasks.reduce((sum, t) => {
    const val = Number(t.price);
    return !isNaN(val) ? sum + val : sum;
  }, 0);

  const startEditPrice = (t: TaskAssignment, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingPriceId(t.id);
    setDraftPrice(t.price !== undefined && t.price !== null ? String(t.price) : '');
  };

  const saveEditPrice = (taskId: string, e?: React.MouseEvent | React.FormEvent) => {
    e?.stopPropagation();
    const clean = draftPrice.trim();
    onUpdateTask(taskId, { price: clean ? clean : undefined });
    setEditingPriceId(null);
    showToast('Task pricing updated successfully', 'success');
  };

  const handleOpenDetailModal = (t: TaskAssignment) => {
    setSelectedTask(t);
    setIsModalEditingPrice(false);
    setModalDraftPrice(t.price !== undefined && t.price !== null ? String(t.price) : '');
  };

  const handleSaveModalPrice = () => {
    if (!selectedTask) return;
    const clean = modalDraftPrice.trim();
    onUpdateTask(selectedTask.id, { price: clean ? clean : undefined });
    setSelectedTask({ ...selectedTask, price: clean ? clean : undefined });
    setIsModalEditingPrice(false);
    showToast('Task pricing updated successfully', 'success');
  };

  const handleModalStatusChange = (newStatus: TaskAssignment['status']) => {
    if (!selectedTask) return;
    onUpdateStatus(selectedTask.id, newStatus);
    setSelectedTask({ ...selectedTask, status: newStatus });
  };

  const handleConfirmDelete = () => {
    if (!deletingTaskId) return;
    const idToDelete = deletingTaskId;
    onDeleteTask(idToDelete);
    if (selectedTask?.id === idToDelete) {
      setSelectedTask(null);
    }
    setDeletingTaskId(null);
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
      t.id || '',
      t.createdAt ? new Date(t.createdAt).toLocaleString() : '',
      t.assignedVia === 'ginny_ai' ? 'Ginny AI' : 'Website Form',
      `"${(t.fullName || '').replace(/"/g, '""')}"`,
      `"${t.whatsapp || ''}"`,
      `"${t.email || ''}"`,
      `"${t.category || ''}"`,
      `"${(t.subCategory || '').replace(/"/g, '""')}"`,
      `"${t.deadline || ''}"`,
      t.price || 'Not set',
      t.status || 'pending_review',
      `"${(t.description || '').replace(/"/g, '""')}"`,
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
      <div className="glass-panel rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Client Task Assignments
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-[#006eff] dark:text-blue-300">
              {tasks.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage incoming client orders from Ginny AI chatbot &amp; website modal, update status, and manage task pricing records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 transition-colors shadow-2xs cursor-pointer select-none"
          >
            <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="glass-panel p-4 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-medium">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
            {tasks.filter((t) => t.status === 'pending_review').length}
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-medium">In Progress / Escrow</span>
            <FolderKanban className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
            {tasks.filter((t) => t.status === 'in_progress' || t.status === 'payment_escrow').length}
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-medium">Completed</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
            {tasks.filter((t) => t.status === 'completed').length}
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-medium">Recorded Volume</span>
            <DollarSign className="w-4 h-4 text-[#006eff] dark:text-blue-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#006eff] dark:text-blue-400 font-mono truncate">
            ৳ {totalCalculatedRevenue.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 glass-panel p-3 rounded-2xl shadow-2xs">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-colors cursor-pointer select-none ${
              filterStatus === 'all'
                ? 'bg-[#006eff] text-white shadow-xs font-semibold'
                : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/15'
            }`}
          >
            All ({tasks.length})
          </button>
          {statusOptions.map((opt) => {
            const count = tasks.filter((t) => t.status === opt.value).length;
            return (
              <button
                type="button"
                key={opt.value}
                onClick={() => setFilterStatus(opt.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-colors cursor-pointer select-none ${
                  filterStatus === opt.value
                    ? 'bg-[#006eff] text-white shadow-xs font-semibold'
                    : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/15'
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
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#006eff]/20 focus:border-[#006eff]"
          />
        </div>
      </div>

      {/* Tasks Table */}
      {filteredTasks.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-[#006eff] dark:text-blue-400 flex items-center justify-center mx-auto mb-3">
            <FolderKanban className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">No task assignments found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {searchTerm || filterStatus !== 'all'
              ? 'Try modifying your search query or filter settings.'
              : 'New project requests assigned via Ginny AI or the website modal will appear here in real-time.'}
          </p>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3 px-4 font-semibold">Ref &amp; Client</th>
                  <th className="py-3 px-4 font-semibold">Source</th>
                  <th className="py-3 px-4 font-semibold">Service &amp; Deadline</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Pricing (BDT)</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-xs">
                {filteredTasks.map((t) => {
                  const isEditingPrice = editingPriceId === t.id;
                  const rawPhone = (t.whatsapp || '').replace(/\D/g, '');
                  const waLink = rawPhone ? `https://wa.me/88${rawPhone.startsWith('88') ? rawPhone.slice(2) : rawPhone}` : undefined;

                  return (
                    <tr
                      key={t.id}
                      className="hover:bg-blue-50/40 dark:hover:bg-white/5 transition-colors group/row"
                    >
                      {/* Ref & Client */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="flex flex-col gap-0.5">
                          <button
                            type="button"
                            onClick={() => handleOpenDetailModal(t)}
                            className="text-left font-mono font-bold text-slate-800 dark:text-slate-200 hover:text-[#006eff] dark:hover:text-blue-400 text-[11px] cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <span>{t.id}</span>
                            <Eye className="w-3 h-3 text-slate-400 group-hover/row:text-[#006eff] transition-colors" />
                          </button>
                          <span
                            onClick={() => handleOpenDetailModal(t)}
                            className="font-semibold text-slate-900 dark:text-white text-sm cursor-pointer hover:underline"
                          >
                            {t.fullName || 'Unnamed Client'}
                          </span>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                            {waLink ? (
                              <a
                                href={waLink}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium"
                                title="Chat on WhatsApp"
                              >
                                <MessageCircle className="w-3 h-3" />
                                <span>{t.whatsapp}</span>
                              </a>
                            ) : (
                              <span>{t.whatsapp || 'No WhatsApp'}</span>
                            )}
                            {t.email && (
                              <>
                                <span>•</span>
                                <span className="truncate max-w-[130px]">{t.email}</span>
                              </>
                            )}
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
                          {t.createdAt
                            ? new Date(t.createdAt).toLocaleDateString([], {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : '—'}
                        </div>
                      </td>

                      {/* Service & Deadline */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="font-medium text-slate-900 dark:text-white">
                          {t.subCategory || t.category || 'Custom Service'}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                          <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>Deadline: {t.deadline || 'Flexible'}</span>
                        </div>
                        {t.documentUrl && (
                          <a
                            href={t.documentUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-[11px] text-[#006eff] dark:text-blue-400 hover:underline mt-1 font-medium"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Attached Asset</span>
                          </a>
                        )}
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-4 align-top">
                        <select
                          value={t.status || 'pending_review'}
                          onChange={(e) =>
                            onUpdateStatus(t.id, e.target.value as TaskAssignment['status'])
                          }
                          className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#131f37] text-slate-800 dark:text-slate-200 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#006eff]/30 cursor-pointer"
                        >
                          {statusOptions.map((opt) => (
                            <option
                              key={opt.value}
                              value={opt.value}
                              className="bg-white dark:bg-[#131f37] text-slate-900 dark:text-white"
                            >
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Pricing (BDT) Edit */}
                      <td className="py-3.5 px-4 align-top">
                        {isEditingPrice ? (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              saveEditPrice(t.id, e);
                            }}
                            className="flex items-center gap-1"
                          >
                            <div className="relative">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs select-none">
                                ৳
                              </span>
                              <input
                                type="text"
                                value={draftPrice}
                                onChange={(e) => setDraftPrice(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Escape') {
                                    setEditingPriceId(null);
                                  }
                                }}
                                placeholder="5000"
                                className="w-24 pl-5 pr-2 py-1 text-xs font-bold border border-[#006eff] rounded-lg focus:outline-none bg-blue-50/50 dark:bg-white/10 text-slate-900 dark:text-white shadow-2xs"
                                autoFocus
                              />
                            </div>
                            <button
                              type="submit"
                              className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white transition-all cursor-pointer shadow-2xs"
                              title="Save Price (Press Enter)"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingPriceId(null)}
                              className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/20 active:scale-95 text-slate-600 dark:text-slate-300 transition-all cursor-pointer shadow-2xs"
                              title="Cancel (Esc)"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </form>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => startEditPrice(t, e)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all cursor-pointer select-none shadow-2xs active:scale-95 group ${
                              t.price !== undefined && t.price !== null && String(t.price).trim() !== ''
                                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 font-bold'
                                : 'bg-blue-50 hover:bg-blue-100 text-[#006eff] dark:bg-blue-950/40 dark:text-blue-300 border-blue-200/80 dark:border-blue-800 font-semibold text-[11px]'
                            }`}
                            title="Click to edit or set task price"
                          >
                            <span>
                              {t.price !== undefined && t.price !== null && String(t.price).trim() !== ''
                                ? `৳ ${t.price}`
                                : '+ Set Price'}
                            </span>
                            <Edit2 className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                          </button>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 align-top text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenDetailModal(t)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/50 text-[#006eff] dark:text-blue-300 border border-blue-200/70 dark:border-blue-800 transition-all cursor-pointer active:scale-95 shadow-2xs"
                            title="View Full Brief"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => setDeletingTaskId(t.id)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200/80 transition-all cursor-pointer active:scale-95 shadow-2xs"
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
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedTask(null);
          }}
          className="fixed inset-0 z-[9999] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <div className="bg-white dark:bg-[#0d1627] rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-white/10 p-5 sm:p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono uppercase font-bold text-[#006eff] dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/80 px-2.5 py-0.5 rounded-md">
                    Ref: {selectedTask.id}
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {selectedTask.assignedVia === 'ginny_ai' ? 'Ginny AI Chatbot' : 'Website Form'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  Project Brief &amp; Requirements
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                title="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Details Grid */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl text-xs border border-slate-100 dark:border-white/10">
              <div>
                <span className="text-slate-400 dark:text-slate-400 font-medium block text-[11px]">Client Name</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{selectedTask.fullName || '—'}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-400 font-medium block text-[11px]">WhatsApp</span>
                {(() => {
                  const digits = (selectedTask.whatsapp || '').replace(/\D/g, '');
                  if (!digits) return <span className="text-slate-500">Not provided</span>;
                  const link = `https://wa.me/88${digits.startsWith('88') ? digits.slice(2) : digits}`;
                  return (
                    <a
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3 shrink-0" />
                      <span>{selectedTask.whatsapp}</span>
                    </a>
                  );
                })()}
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-400 font-medium block text-[11px]">Email Address</span>
                <span className="font-semibold text-slate-900 dark:text-white truncate block">{selectedTask.email || '—'}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-400 font-medium block text-[11px]">Target Deadline</span>
                <span className="font-semibold text-slate-900 dark:text-white">{selectedTask.deadline || 'Flexible'}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-400 font-medium block text-[11px]">Category / Deliverable</span>
                <span className="font-semibold text-slate-900 dark:text-white">{selectedTask.subCategory || selectedTask.category || '—'}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-400 font-medium block text-[11px]">Assigned Expert Code</span>
                <span className="font-mono font-bold text-[#006eff]">{selectedTask.expertCode || 'None Assigned'}</span>
              </div>

              {/* Status Update inside Modal */}
              <div>
                <span className="text-slate-400 dark:text-slate-400 font-medium block text-[11px] mb-1">Current Status</span>
                <select
                  value={selectedTask.status || 'pending_review'}
                  onChange={(e) => handleModalStatusChange(e.target.value as TaskAssignment['status'])}
                  className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#131f37] text-slate-900 dark:text-white shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#006eff]/30 cursor-pointer"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Editor inside Modal */}
              <div>
                <span className="text-slate-400 dark:text-slate-400 font-medium block text-[11px] mb-1">Accounting Price (BDT)</span>
                {isModalEditingPrice ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={modalDraftPrice}
                      onChange={(e) => setModalDraftPrice(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveModalPrice();
                        if (e.key === 'Escape') setIsModalEditingPrice(false);
                      }}
                      placeholder="e.g. 5000"
                      className="w-full px-2.5 py-1 text-xs font-bold border border-[#006eff] rounded-lg focus:outline-none bg-white dark:bg-white/10 text-slate-900 dark:text-white"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleSaveModalPrice}
                      className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer transition-colors shrink-0"
                      title="Save Price"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalEditingPrice(false)}
                      className="p-1.5 rounded-lg bg-slate-200 dark:bg-white/10 hover:bg-slate-300 text-slate-600 cursor-pointer transition-colors shrink-0"
                      title="Cancel"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono font-bold text-base text-[#006eff] dark:text-blue-400">
                      {selectedTask.price ? `৳ ${selectedTask.price}` : 'Not Specified'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setModalDraftPrice(selectedTask.price !== undefined && selectedTask.price !== null ? String(selectedTask.price) : '');
                        setIsModalEditingPrice(true);
                      }}
                      className="px-2 py-1 text-[11px] font-semibold text-[#006eff] hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800 transition-colors cursor-pointer"
                    >
                      {selectedTask.price ? 'Edit Price' : '+ Set Price'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Project Requirements Full Text */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Project Requirements &amp; Brief:</label>
              <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto font-sans">
                {selectedTask.description || 'No detailed requirements provided by client.'}
              </div>
            </div>

            {/* Project Link if present */}
            {selectedTask.documentUrl && (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60 text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                  <ExternalLink className="w-4 h-4 text-[#006eff] dark:text-blue-400 shrink-0" />
                  <span className="truncate">Attached Asset / Brief Link</span>
                </div>
                <a
                  href={selectedTask.documentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-[#006eff] dark:text-blue-400 hover:underline shrink-0 ml-2"
                >
                  Open Link
                </a>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-white/10 flex-wrap">
              {/* Delete Task button inside modal */}
              <button
                type="button"
                onClick={() => setDeletingTaskId(selectedTask.id)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Delete Task</span>
              </button>

              <div className="flex items-center gap-2">
                {(() => {
                  const digits = (selectedTask.whatsapp || '').replace(/\D/g, '');
                  if (!digits) return null;
                  const link = `https://wa.me/88${digits.startsWith('88') ? digits.slice(2) : digits}`;
                  return (
                    <a
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  );
                })()}

                <button
                  type="button"
                  onClick={() => setSelectedTask(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/15 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* In-App Delete Confirmation Modal (Zero reliance on blocked browser dialogs) */}
      {deletingTaskId && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setDeletingTaskId(null);
          }}
          className="fixed inset-0 z-[10000] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white dark:bg-[#0d1627] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-white/10 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center shrink-0 border border-rose-200 dark:border-rose-900">
                <AlertCircle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Delete Task Assignment</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Ref: {deletingTaskId}</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete this client task assignment record? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-white/10">
              <button
                type="button"
                onClick={() => setDeletingTaskId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer shadow-sm shadow-rose-600/20 active:scale-95"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
