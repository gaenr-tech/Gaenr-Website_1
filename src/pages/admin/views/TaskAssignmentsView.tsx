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
  Download,
  Bot,
  Globe,
  MessageCircle,
  Eye,
  X,
  AlertCircle,
  Check,
  Plus,
  Mail,
  FileText,
} from 'lucide-react';

interface TaskAssignmentsViewProps {
  tasks: TaskAssignment[];
  onUpdateStatus: (taskId: string, status: TaskAssignment['status']) => void;
  onUpdateTask: (taskId: string, updates: Partial<TaskAssignment>) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask?: (task: Omit<TaskAssignment, 'id' | 'createdAt' | 'status'> & Partial<Pick<TaskAssignment, 'status' | 'price' | 'pricingNotes' | 'assignedVia'>>) => TaskAssignment;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const TaskAssignmentsView: React.FC<TaskAssignmentsViewProps> = ({
  tasks,
  onUpdateStatus,
  onUpdateTask,
  onDeleteTask,
  onAddTask,
  showToast,
}) => {
  // Local state for instant optimistic updates
  const [localTasks, setLocalTasks] = useState<TaskAssignment[]>(tasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Modal 1: Full Task Detail / Brief Modal
  const [selectedTask, setSelectedTask] = useState<TaskAssignment | null>(null);

  // Modal 2: Dedicated Set Price Modal
  const [pricingTask, setPricingTask] = useState<TaskAssignment | null>(null);
  const [pricingDraft, setPricingDraft] = useState<string>('');

  // Modal 3: Delete Confirmation Modal
  const [taskToDelete, setTaskToDelete] = useState<TaskAssignment | null>(null);

  const statusOptions: Array<{ value: TaskAssignment['status']; label: string; color: string }> = [
    { value: 'pending_review', label: 'Pending Review', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { value: 'payment_escrow', label: 'Escrow Funded', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { value: 'in_progress', label: 'In Progress', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    { value: 'completed', label: 'Completed', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  ];

  // Sync localTasks when incoming tasks prop updates
  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  // Sync open modals if underlying tasks array changes
  useEffect(() => {
    if (selectedTask) {
      const refreshed = localTasks.find((t) => String(t.id).trim().toLowerCase() === String(selectedTask.id).trim().toLowerCase());
      if (refreshed) setSelectedTask(refreshed);
    }
    if (pricingTask) {
      const refreshed = localTasks.find((t) => String(t.id).trim().toLowerCase() === String(pricingTask.id).trim().toLowerCase());
      if (refreshed) setPricingTask(refreshed);
    }
  }, [localTasks]);

  // Handle escape key to close whichever modal is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (taskToDelete) {
          setTaskToDelete(null);
        } else if (pricingTask) {
          setPricingTask(null);
        } else if (selectedTask) {
          setSelectedTask(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [taskToDelete, pricingTask, selectedTask]);

  // Safe formatting helpers
  const safeStr = (val: any, fallback = ''): string => {
    if (val === undefined || val === null) return fallback;
    if (typeof val === 'string') return val;
    if (typeof val === 'number') return String(val);
    if (typeof val === 'object') return val.title || val.name || val.id || fallback;
    return String(val);
  };

  const getCategoryName = (t: TaskAssignment): string => {
    if (t.subCategory && typeof t.subCategory === 'string' && t.subCategory.trim()) {
      return t.subCategory;
    }
    if (t.category) {
      if (typeof t.category === 'string') return t.category;
      if (typeof t.category === 'object') return (t.category as any).title || (t.category as any).name || 'Custom Service';
    }
    return 'Custom Service';
  };

  const getWhatsAppLink = (phone?: any) => {
    if (!phone) return null;
    const raw = String(phone).replace(/\D/g, '');
    if (!raw) return null;
    return `https://wa.me/88${raw.startsWith('88') ? raw.slice(2) : raw}`;
  };

  const formatPrice = (price?: any) => {
    if (price === undefined || price === null || price === '') return null;
    const num = typeof price === 'number' ? price : Number(String(price).replace(/[^0-9.]/g, ''));
    return !isNaN(num) && num >= 0 ? `৳ ${num.toLocaleString()}` : String(price);
  };

  const filteredTasks = localTasks.filter((t) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm.trim() ||
      safeStr(t.id).toLowerCase().includes(q) ||
      safeStr(t.fullName).toLowerCase().includes(q) ||
      safeStr(t.email).toLowerCase().includes(q) ||
      safeStr(t.whatsapp).toLowerCase().includes(q) ||
      getCategoryName(t).toLowerCase().includes(q) ||
      safeStr(t.description).toLowerCase().includes(q);

    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalCalculatedRevenue = localTasks.reduce((sum, t) => {
    const val = typeof t.price === 'number' ? t.price : Number(String(t.price || '').replace(/[^0-9.]/g, ''));
    return !isNaN(val) ? sum + val : sum;
  }, 0);

  // Price Modal Handlers
  const handleOpenPriceModal = (t: TaskAssignment, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setPricingTask(t);
    const existingPrice = t.price !== undefined && t.price !== null ? String(t.price).replace(/[^0-9]/g, '') : '';
    setPricingDraft(existingPrice);
  };

  const handleSavePriceModal = () => {
    if (!pricingTask) return;
    const clean = pricingDraft.trim();
    const finalPrice = clean ? clean : undefined;
    const targetId = String(pricingTask.id).trim();

    // 1. Optimistically update localTasks immediately
    setLocalTasks((prev) =>
      prev.map((t) =>
        String(t.id).trim().toLowerCase() === targetId.toLowerCase()
          ? { ...t, price: finalPrice }
          : t
      )
    );

    // 2. Call parent onUpdateTask
    onUpdateTask(pricingTask.id, { price: finalPrice });

    // 3. Update detail modal if open
    if (selectedTask && String(selectedTask.id).trim().toLowerCase() === targetId.toLowerCase()) {
      setSelectedTask((prev) => (prev ? { ...prev, price: finalPrice } : null));
    }

    showToast(`Task pricing saved: ৳ ${clean ? Number(clean).toLocaleString() : 'Not Set'}`, 'success');
    setPricingTask(null);
  };

  // Detail Modal Handlers
  const handleOpenDetailModal = (t: TaskAssignment, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedTask({ ...t });
  };

  const handleDetailStatusChange = (newStatus: TaskAssignment['status']) => {
    if (!selectedTask) return;
    const targetId = String(selectedTask.id).trim();

    // Optimistic update
    setLocalTasks((prev) =>
      prev.map((t) =>
        String(t.id).trim().toLowerCase() === targetId.toLowerCase()
          ? { ...t, status: newStatus }
          : t
      )
    );

    onUpdateStatus(selectedTask.id, newStatus);
    setSelectedTask((prev) => (prev ? { ...prev, status: newStatus } : null));
    showToast(`Task status set to ${newStatus.replace('_', ' ')}`, 'success');
  };

  const handleRowStatusChange = (taskId: string, newStatus: TaskAssignment['status'], e?: React.ChangeEvent<HTMLSelectElement>) => {
    e?.stopPropagation();
    const targetId = String(taskId).trim();

    // Optimistic update
    setLocalTasks((prev) =>
      prev.map((t) =>
        String(t.id).trim().toLowerCase() === targetId.toLowerCase()
          ? { ...t, status: newStatus }
          : t
      )
    );

    onUpdateStatus(taskId, newStatus);
    if (selectedTask && String(selectedTask.id).trim().toLowerCase() === targetId.toLowerCase()) {
      setSelectedTask((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    showToast(`Status updated to ${newStatus.replace('_', ' ')}`, 'success');
  };

  // Delete Handlers
  const handleOpenDeleteConfirm = (t: TaskAssignment, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setTaskToDelete(t);
  };

  const handleConfirmDelete = () => {
    if (!taskToDelete) return;
    const targetId = String(taskToDelete.id).trim();

    // 1. Optimistic removal from localTasks
    setLocalTasks((prev) =>
      prev.filter((t) => String(t.id).trim().toLowerCase() !== targetId.toLowerCase())
    );

    // 2. Call parent onDeleteTask
    onDeleteTask(taskToDelete.id);

    // 3. Close open modals if matching
    if (selectedTask && String(selectedTask.id).trim().toLowerCase() === targetId.toLowerCase()) {
      setSelectedTask(null);
    }

    setTaskToDelete(null);
    showToast('Task assignment record deleted successfully', 'success');
  };

  // Demo task creator for instant backend testing
  const handleCreateDemoTask = () => {
    if (!onAddTask) return;
    const newDemo = onAddTask({
      fullName: 'Tahmid Rahman (Sample Client)',
      email: 'tahmid.client@example.com',
      whatsapp: '01819000000',
      category: 'Graphic & Creative' as any,
      subCategory: 'Brand Identity Design',
      description: 'Need complete corporate identity pack, vector logo guidelines, color palette, business cards, and social media media pack. Target launch next month.',
      deadline: '5 Days',
      status: 'pending_review',
      price: '8500',
      assignedVia: 'website_modal',
      preferredChannel: 'WhatsApp',
      expertCode: '',
      agreedTerms: true,
      agreedAccuracy: true,
    });
    showToast('Sample client task assignment added for testing', 'success');
    if (newDemo) {
      setLocalTasks((prev) => [newDemo, ...prev]);
      setSelectedTask(newDemo);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (localTasks.length === 0) {
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
    const rows = localTasks.map((t) => [
      safeStr(t.id),
      t.createdAt ? new Date(t.createdAt).toLocaleString() : '',
      t.assignedVia === 'ginny_ai' ? 'Ginny AI' : 'Website Form',
      `"${safeStr(t.fullName).replace(/"/g, '""')}"`,
      `"${safeStr(t.whatsapp).replace(/"/g, '""')}"`,
      `"${safeStr(t.email).replace(/"/g, '""')}"`,
      `"${getCategoryName(t).replace(/"/g, '""')}"`,
      `"${safeStr(t.subCategory).replace(/"/g, '""')}"`,
      `"${safeStr(t.deadline).replace(/"/g, '""')}"`,
      t.price ? String(t.price) : 'Not set',
      t.status || 'pending_review',
      `"${safeStr(t.description).replace(/"/g, '""')}"`,
      `"${safeStr(t.documentUrl).replace(/"/g, '""')}"`,
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
              {localTasks.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage incoming client orders from Ginny AI chatbot &amp; website modal, update status, and manage task pricing records.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onAddTask && (
            <button
              type="button"
              onClick={handleCreateDemoTask}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-[#006eff] dark:text-blue-300 border border-blue-200/80 dark:border-blue-700/60 transition-all cursor-pointer !cursor-pointer select-none active:scale-95 shadow-2xs"
              title="Create a sample task assignment for quick testing"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Test Task</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 transition-colors shadow-2xs cursor-pointer !cursor-pointer select-none"
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
            {localTasks.filter((t) => t.status === 'pending_review').length}
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-medium">In Progress / Escrow</span>
            <FolderKanban className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
            {localTasks.filter((t) => t.status === 'in_progress' || t.status === 'payment_escrow').length}
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-medium">Completed</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
            {localTasks.filter((t) => t.status === 'completed').length}
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
            className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-colors cursor-pointer !cursor-pointer select-none ${
              filterStatus === 'all'
                ? 'bg-[#006eff] text-white shadow-xs font-semibold'
                : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/15'
            }`}
          >
            All ({localTasks.length})
          </button>
          {statusOptions.map((opt) => {
            const count = localTasks.filter((t) => t.status === opt.value).length;
            return (
              <button
                type="button"
                key={opt.value}
                onClick={() => setFilterStatus(opt.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-colors cursor-pointer !cursor-pointer select-none ${
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
          {onAddTask && (
            <div className="mt-4">
              <button
                type="button"
                onClick={handleCreateDemoTask}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#006eff] hover:bg-[#0056cc] text-white shadow-xs transition-all cursor-pointer !cursor-pointer active:scale-95 select-none"
              >
                <Plus className="w-4 h-4" />
                <span>Create Sample Test Task</span>
              </button>
            </div>
          )}
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
                  const phoneStr = safeStr(t.whatsapp);
                  const waLink = getWhatsAppLink(phoneStr);
                  const priceFormatted = formatPrice(t.price);

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
                            onClick={(e) => handleOpenDetailModal(t, e)}
                            className="text-left font-mono font-bold text-slate-800 dark:text-slate-200 hover:text-[#006eff] dark:hover:text-blue-400 text-xs cursor-pointer !cursor-pointer inline-flex items-center gap-1.5 select-none"
                            title="Click to view full brief"
                          >
                            <span>{safeStr(t.id)}</span>
                            <Eye className="w-3 h-3 text-slate-400 group-hover/row:text-[#006eff] transition-colors" />
                          </button>
                          <span
                            onClick={(e) => handleOpenDetailModal(t, e)}
                            className="font-bold text-slate-900 dark:text-white text-sm cursor-pointer !cursor-pointer hover:text-[#006eff] transition-colors"
                          >
                            {safeStr(t.fullName, 'Unnamed Client')}
                          </span>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                            {waLink ? (
                              <a
                                href={waLink}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline font-semibold cursor-pointer !cursor-pointer"
                                title="Chat with client on WhatsApp"
                              >
                                <MessageCircle className="w-3 h-3" />
                                <span>{phoneStr}</span>
                              </a>
                            ) : (
                              <span>{phoneStr || 'No WhatsApp'}</span>
                            )}
                            {t.email && (
                              <>
                                <span>•</span>
                                <span className="truncate max-w-[130px]">{safeStr(t.email)}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Source */}
                      <td className="py-3.5 px-4 align-top">
                        {t.assignedVia === 'ginny_ai' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-[#006eff] dark:text-blue-300 border border-blue-200/70 dark:border-blue-800 font-semibold text-[10px]">
                            <Bot className="w-3 h-3" />
                            Ginny AI
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 font-medium text-[10px]">
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
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {getCategoryName(t)}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                          <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>Deadline: {safeStr(t.deadline, 'Flexible')}</span>
                        </div>
                        {t.documentUrl && (
                          <a
                            href={t.documentUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-[11px] text-[#006eff] dark:text-blue-400 hover:underline mt-1 font-semibold cursor-pointer !cursor-pointer"
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
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleRowStatusChange(t.id, e.target.value as TaskAssignment['status'], e)}
                          className="text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#131f37] text-slate-800 dark:text-slate-200 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#006eff]/30 cursor-pointer !cursor-pointer select-none"
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

                      {/* Pricing (BDT) Button */}
                      <td className="py-3.5 px-4 align-top">
                        <button
                          type="button"
                          onClick={(e) => handleOpenPriceModal(t, e)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer !cursor-pointer select-none active:scale-95 shadow-2xs group ${
                            priceFormatted
                              ? 'bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white dark:bg-emerald-950/40 dark:hover:bg-emerald-600 dark:text-emerald-300 dark:hover:text-white border-emerald-200 dark:border-emerald-800 font-bold'
                              : 'bg-blue-50 hover:bg-[#006eff] text-[#006eff] hover:text-white dark:bg-blue-950/40 dark:hover:bg-[#006eff] dark:text-blue-300 dark:hover:text-white border-blue-200/80 dark:border-blue-800 font-semibold text-xs'
                          }`}
                          title="Click to set or update task price"
                        >
                          <DollarSign className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                          <span>{priceFormatted || '+ Set Price'}</span>
                          <Edit2 className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 align-top text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Button */}
                          <button
                            type="button"
                            onClick={(e) => handleOpenDetailModal(t, e)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#006eff] hover:bg-[#0056cc] text-white shadow-xs transition-all cursor-pointer !cursor-pointer active:scale-95 select-none"
                            title="View Full Task Brief"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>

                          {/* Quick WhatsApp Action */}
                          {waLink && (
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white dark:bg-emerald-950/40 dark:hover:bg-emerald-600 dark:text-emerald-300 dark:hover:text-white border border-emerald-200 dark:border-emerald-800 transition-all cursor-pointer !cursor-pointer active:scale-95 shadow-2xs select-none"
                              title="Chat with client directly on WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span className="hidden xl:inline">WhatsApp</span>
                            </a>
                          )}

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={(e) => handleOpenDeleteConfirm(t, e)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white dark:bg-rose-950/40 dark:hover:bg-rose-600 dark:text-rose-400 dark:hover:text-white border border-rose-200 dark:border-rose-900/60 transition-all cursor-pointer !cursor-pointer active:scale-95 shadow-2xs select-none"
                            title="Delete Task Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
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

      {/* =========================================================================
          MODAL 1: TASK DETAIL & REQUIREMENTS (IN-TREE COMPONENT OVERLAY)
          ========================================================================= */}
      {selectedTask && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedTask(null);
          }}
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <div
            className="bg-white dark:bg-[#0d1627] rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-white/10 p-5 sm:p-6 space-y-5 relative z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono uppercase font-bold text-[#006eff] dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/80 px-2.5 py-0.5 rounded-md">
                    Ref: {safeStr(selectedTask.id, 'N/A')}
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10">
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
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer !cursor-pointer select-none"
                title="Close Modal (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Details Grid */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl text-xs border border-slate-100 dark:border-white/10">
              <div>
                <span className="text-slate-400 dark:text-slate-400 font-medium block text-[11px]">Client Name</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{safeStr(selectedTask.fullName, '—')}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-400 font-medium block text-[11px]">WhatsApp</span>
                {(() => {
                  const phoneStr = safeStr(selectedTask.whatsapp);
                  const waLink = getWhatsAppLink(phoneStr);
                  if (!phoneStr) return <span className="text-slate-500">Not provided</span>;
                  return waLink ? (
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer !cursor-pointer"
                      title="Chat on WhatsApp"
                    >
                      <MessageCircle className="w-3 h-3 shrink-0" />
                      <span>{phoneStr}</span>
                    </a>
                  ) : (
                    <span className="text-slate-800 dark:text-slate-200">{phoneStr}</span>
                  );
                })()}
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-400 font-medium block text-[11px]">Email Address</span>
                {selectedTask.email ? (
                  <a
                    href={`mailto:${selectedTask.email}`}
                    className="font-semibold text-slate-900 dark:text-white hover:text-[#006eff] truncate block"
                  >
                    {safeStr(selectedTask.email)}
                  </a>
                ) : (
                  <span className="text-slate-500">—</span>
                )}
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-400 font-medium block text-[11px]">Target Deadline</span>
                <span className="font-semibold text-slate-900 dark:text-white">{safeStr(selectedTask.deadline, 'Flexible')}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-400 font-medium block text-[11px]">Category / Deliverable</span>
                <span className="font-semibold text-slate-900 dark:text-white">{getCategoryName(selectedTask)}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-400 font-medium block text-[11px]">Assigned Expert Code</span>
                <span className="font-mono font-bold text-[#006eff]">{safeStr(selectedTask.expertCode, 'None Assigned')}</span>
              </div>

              {/* Status Update inside Modal */}
              <div>
                <span className="text-slate-400 dark:text-slate-400 font-medium block text-[11px] mb-1">Current Status</span>
                <select
                  value={selectedTask.status || 'pending_review'}
                  onChange={(e) => handleDetailStatusChange(e.target.value as TaskAssignment['status'])}
                  className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#131f37] text-slate-900 dark:text-white shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#006eff]/30 cursor-pointer !cursor-pointer"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Accounting Price Editor inside Modal */}
              <div>
                <span className="text-slate-400 dark:text-slate-400 font-medium block text-[11px] mb-1">Accounting Price (BDT)</span>
                <div className="flex items-center justify-between gap-1">
                  <span className="font-mono font-bold text-base text-[#006eff] dark:text-blue-400">
                    {formatPrice(selectedTask.price) || 'Not Specified'}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleOpenPriceModal(selectedTask, e)}
                    className="px-2.5 py-1 text-xs font-bold text-[#006eff] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800 transition-colors cursor-pointer !cursor-pointer select-none active:scale-95"
                  >
                    {selectedTask.price !== undefined && selectedTask.price !== null && String(selectedTask.price).trim() !== '' ? 'Edit Price' : '+ Set Price'}
                  </button>
                </div>
              </div>
            </div>

            {/* Project Requirements Full Text */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                <FileText className="w-4 h-4 text-[#006eff]" />
                <span>Project Requirements &amp; Brief:</span>
              </div>
              <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto font-sans select-text">
                {safeStr(selectedTask.description, 'No detailed requirements provided by client.')}
              </div>
            </div>

            {/* Project Link if present */}
            {selectedTask.documentUrl && (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60 text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium truncate">
                  <ExternalLink className="w-4 h-4 text-[#006eff] dark:text-blue-400 shrink-0" />
                  <span className="truncate">{safeStr(selectedTask.documentName, 'Attached Project Asset / Link')}</span>
                </div>
                <a
                  href={selectedTask.documentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-[#006eff] dark:text-blue-400 hover:underline shrink-0 ml-2 cursor-pointer !cursor-pointer"
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
                onClick={() => {
                  handleOpenDeleteConfirm(selectedTask);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition-colors cursor-pointer !cursor-pointer select-none active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Delete Task</span>
              </button>

              <div className="flex items-center gap-2">
                {(() => {
                  const phoneStr = safeStr(selectedTask.whatsapp);
                  const waLink = getWhatsAppLink(phoneStr);
                  if (!waLink) return null;
                  return (
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs cursor-pointer !cursor-pointer active:scale-95"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  );
                })()}

                <button
                  type="button"
                  onClick={() => setSelectedTask(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/15 transition-colors cursor-pointer !cursor-pointer select-none"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: DEDICATED SET TASK PRICE POPUP (IN-TREE COMPONENT OVERLAY)
          ========================================================================= */}
      {pricingTask && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setPricingTask(null);
          }}
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <div
            className="bg-white dark:bg-[#0d1627] rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-white/10 p-6 space-y-5 relative z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800 text-[#006eff] dark:text-blue-400 flex items-center justify-center shrink-0">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Set Task Pricing
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    Ref: {safeStr(pricingTask.id)} • {safeStr(pricingTask.fullName, 'Client')}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPricingTask(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer !cursor-pointer select-none"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Service Context */}
            <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-100 dark:border-white/10 text-xs flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Service requested:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                {getCategoryName(pricingTask)}
              </span>
            </div>

            {/* Amount Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Accounting Amount (BDT / ৳)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-bold text-base select-none">
                  ৳
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={pricingDraft}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/[^0-9]/g, '');
                    setPricingDraft(clean);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSavePriceModal();
                    if (e.key === 'Escape') setPricingTask(null);
                  }}
                  placeholder="e.g. 5000"
                  className="w-full pl-9 pr-4 py-2.5 text-base font-bold border border-slate-200 dark:border-white/10 focus:border-[#006eff] rounded-2xl focus:outline-none bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white shadow-2xs"
                  autoFocus
                />
              </div>
            </div>

            {/* Quick BDT Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 block">
                Quick BDT Presets:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[1500, 3000, 5000, 8000, 12000, 20000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setPricingDraft(String(amt))}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-white/5 hover:bg-[#006eff] text-[#006eff] hover:text-white dark:text-blue-300 dark:hover:text-white border border-blue-200/80 dark:border-white/10 transition-colors cursor-pointer !cursor-pointer select-none active:scale-95"
                  >
                    + ৳{amt.toLocaleString()}
                  </button>
                ))}
                {pricingDraft && (
                  <button
                    type="button"
                    onClick={() => setPricingDraft('')}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-white/10 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer !cursor-pointer select-none"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-white/10">
              <button
                type="button"
                onClick={() => setPricingTask(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer !cursor-pointer select-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePriceModal}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-[#006eff] hover:bg-[#0056cc] text-white transition-all cursor-pointer !cursor-pointer shadow-md shadow-blue-500/20 active:scale-95 select-none"
              >
                <Check className="w-4 h-4" />
                <span>Save Pricing</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: IN-APP DELETE CONFIRMATION (IN-TREE COMPONENT OVERLAY)
          ========================================================================= */}
      {taskToDelete && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setTaskToDelete(null);
          }}
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            className="bg-white dark:bg-[#0d1627] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-white/10 space-y-4 relative z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center shrink-0 border border-rose-200 dark:border-rose-900">
                <AlertCircle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Delete Task Assignment?</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  Ref: {safeStr(taskToDelete.id)} • {safeStr(taskToDelete.fullName, 'Client')}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete this client task assignment record ({getCategoryName(taskToDelete)})? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-white/10">
              <button
                type="button"
                onClick={() => setTaskToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer !cursor-pointer select-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer !cursor-pointer shadow-md shadow-rose-600/20 active:scale-95 select-none"
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
