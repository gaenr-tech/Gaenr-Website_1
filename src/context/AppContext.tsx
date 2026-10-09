import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  ServiceSlug,
  ServiceCategory,
  FreelancerProfile,
  PortfolioItem,
  TaskAssignment,
  FeedbackSubmission,
  ExpertApplication,
  ExpertApplicationStatus,
  ExpertOnboardingData,
  AvatarAsset,
  GaenrEmployee,
  OperationalTask,
  OperationalClient,
  PaymentRecord,
  PayoutRecord,
  OperationalLogEntry,
  InternalDocument,
  OperationalNotification,
  OperationsRole,
} from '../types';
import { INITIAL_FREELANCERS, INITIAL_AVATARS, SERVICE_CATEGORIES } from '../data/mockData';
import { getCategoryAvatar, RAW_AVATAR_SPECS } from '../components/common/Avatars';
import { generateSecureUploadToken, generateUniqueExpertCode } from '../utils/security';
import { sendExpertWelcomeEmail, sendExpertOnboardingInviteEmail } from '../utils/email';

export const GAENR_OFFICIAL_DRIVE_FOLDER_URL =
  'https://drive.google.com/drive/folders/13TfzgSRtRCy2ubOU4fyFEg_NEGZLonDO?usp=sharing';

export const mapSkillToCategory = (
  skillString: string
): { slug: ServiceSlug; title: string; codePrefix: string } => {
  const lower = (skillString || '').toLowerCase();
  if (lower.includes('video') || lower.includes('ভিডিও')) {
    return { slug: 'video-editing', title: 'Video Editing', codePrefix: 'VE' };
  }
  if (lower.includes('word') || lower.includes('web') || lower.includes('সাইট')) {
    return { slug: 'wordpress-website', title: 'WordPress Website Design', codePrefix: 'WP' };
  }
  if (lower.includes('content') || lower.includes('write') || lower.includes('লেখা')) {
    return { slug: 'content-writing', title: 'Content Writing & Copywriting', codePrefix: 'CW' };
  }
  if (lower.includes('slide') || lower.includes('presentation') || lower.includes('স্লাইড')) {
    return { slug: 'presentation-slide-design', title: 'Presentation Slide Design', codePrefix: 'PS' };
  }
  if (lower.includes('ui') || lower.includes('ux') || lower.includes('figma')) {
    return { slug: 'ux-ui-design', title: 'UX / UI Design', codePrefix: 'UI' };
  }
  if (lower.includes('ad') || lower.includes('campaign') || lower.includes('মার্কেটিং')) {
    return { slug: 'ad-running', title: 'Ad Running & Campaign Setup', codePrefix: 'AD' };
  }
  return { slug: 'graphics-design', title: 'Graphics Design', codePrefix: 'GD' };
};
import {
  INITIAL_EMPLOYEES,
  INITIAL_OPERATIONAL_TASKS,
  INITIAL_OPERATIONAL_CLIENTS,
  INITIAL_PAYMENT_RECORDS,
  INITIAL_PAYOUT_RECORDS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_INTERNAL_DOCUMENTS,
  INITIAL_NOTIFICATIONS,
} from '../data/operationsMockData';

export type SubdomainMode = 'gaenr.com' | 'freelancer.gaenr.com';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  // Navigation / Ecosystem
  subdomain: SubdomainMode;
  setSubdomain: (mode: SubdomainMode) => void;
  currentRoute: string;
  navigate: (route: string) => void;

  // Modals
  isAssignTaskOpen: boolean;
  openAssignTask: (expertCode?: string, categorySlug?: ServiceSlug) => void;
  closeAssignTask: () => void;
  preselectedExpert: string | null;
  preselectedCategory: ServiceSlug | null;

  isApplyExpertOpen: boolean;
  openApplyExpert: () => void;
  closeApplyExpert: () => void;

  // Data & Admin operations
  freelancers: FreelancerProfile[];
  addFreelancer: (newFl: FreelancerProfile) => void;
  updateFreelancer: (code: string, updates: Partial<FreelancerProfile>) => void;
  deleteFreelancer: (code: string) => boolean;
  toggleFreelancerVisibility: (code: string) => void;
  addExpertReview: (
    code: string,
    review: {
      clientName: string;
      clientEmail: string;
      clientType: string;
      rating: number;
      text: string;
      satisfaction?: 'satisfied' | 'neutral' | 'unsatisfied';
      skipDeliveryIncrement?: boolean;
    }
  ) => boolean;
  confirmExpertDelivery: (code: string) => boolean;

  avatars: AvatarAsset[];
  addAvatar: (avatar: AvatarAsset) => void;
  deleteAvatar: (id: string) => boolean;

  // Service Categories (Dynamic for frontend and backend admin)
  categories: ServiceCategory[];
  addCategory: (category: ServiceCategory) => void;
  updateCategories: (categories: ServiceCategory[]) => void;
  deleteCategory: (categoryId: string) => void;

  taskAssignments: TaskAssignment[];
  submitTaskAssignment: (task: Omit<TaskAssignment, 'id' | 'createdAt' | 'status'> & Partial<Pick<TaskAssignment, 'status' | 'price' | 'pricingNotes' | 'assignedVia'>>) => TaskAssignment;
  updateTaskStatus: (taskId: string, status: TaskAssignment['status']) => void;
  updateTaskAssignment: (taskId: string, updates: Partial<TaskAssignment>) => void;
  deleteTaskAssignment: (taskId: string) => void;

  feedbacks: FeedbackSubmission[];
  submitFeedback: (feedback: Omit<FeedbackSubmission, 'id' | 'createdAt'>) => void;
  deleteFeedback: (id: string) => void;

  expertApplications: ExpertApplication[];
  submitExpertApplication: (app: Omit<ExpertApplication, 'id' | 'createdAt' | 'status'>) => void;
  updateExpertApplicationStatus: (
    id: string,
    newStatus: ExpertApplicationStatus,
    cardImage?: string | null,
    customCode?: string
  ) => void;
  saveExpertOnboardingResponse: (applicationId: string, data: ExpertOnboardingData) => void;
  deleteExpertApplication: (id: string) => void;

  // Dedicated Portfolio Management for specific expert
  addExpertPortfolioItem: (expertCode: string, item: PortfolioItem) => void;
  deleteExpertPortfolioItem: (expertCode: string, itemId: string) => void;

  // Notification Toast
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: (id: string) => void;

  // Admin / Operations Auth
  isAdminLoggedIn: boolean;
  loginAdmin: () => void;
  logoutAdmin: () => void;

  // Gaenr Operations Full Module State
  currentEmployee: GaenrEmployee | null;
  loginOperations: (employeeIdOrEmail: string, role?: OperationsRole) => boolean;
  logoutOperations: () => void;

  operationalTasks: OperationalTask[];
  updateOperationalTask: (taskId: string, updates: Partial<OperationalTask>) => void;
  addOperationalTask: (task: OperationalTask) => void;

  operationalClients: OperationalClient[];
  updateOperationalClient: (clientId: string, updates: Partial<OperationalClient>) => void;
  addOperationalClient: (client: OperationalClient) => void;

  paymentRecords: PaymentRecord[];
  updatePaymentRecord: (id: string, updates: Partial<PaymentRecord>) => void;
  payoutRecords: PayoutRecord[];
  updatePayoutRecord: (id: string, updates: Partial<PayoutRecord>) => void;

  employees: GaenrEmployee[];
  updateEmployee: (id: string, updates: Partial<GaenrEmployee>) => void;
  addEmployee: (emp: GaenrEmployee) => void;

  activityLogs: OperationalLogEntry[];
  addActivityLog: (entry: Omit<OperationalLogEntry, 'id' | 'timestamp'>) => void;

  internalDocs: InternalDocument[];
  operationalNotifications: OperationalNotification[];
  markNotificationRead: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subdomain, setSubdomainState] = useState<SubdomainMode>('gaenr.com');
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      return path && path !== '' ? path : '/';
    }
    return '/';
  });

  // Modals
  const [isAssignTaskOpen, setIsAssignTaskOpen] = useState(false);
  const [preselectedExpert, setPreselectedExpert] = useState<string | null>(null);
  const [preselectedCategory, setPreselectedCategory] = useState<ServiceSlug | null>(null);

  const [isApplyExpertOpen, setIsApplyExpertOpen] = useState(false);

  // Admin Auth - strictly requires active session authentication
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      const isSessionActive = sessionStorage.getItem('gaenr_admin_session') === 'active';
      if (!isSessionActive) {
        // Purge any leaked legacy credentials so password prompt always appears
        try {
          localStorage.removeItem('gaenr_admin_logged');
          localStorage.removeItem('gaenr_current_employee');
          localStorage.removeItem('gaenr_admin_session');
        } catch {}
        return false;
      }
      const savedEmp = sessionStorage.getItem('gaenr_current_employee') || localStorage.getItem('gaenr_current_employee');
      if (savedEmp) {
        const parsed = JSON.parse(savedEmp);
        if (parsed && parsed.username === 'operations') {
          return (sessionStorage.getItem('gaenr_admin_logged') === 'true' || localStorage.getItem('gaenr_admin_logged') === 'true');
        }
      }
      return false;
    } catch {
      return false;
    }
  });

  // Freelancers — start from empty; clear any old sample data from localStorage
  const [freelancers, setFreelancers] = useState<FreelancerProfile[]>(() => {
    try {
      // One-time migration: clear old fl-1…fl-6 sample data from previous sessions
      const dataVersion = localStorage.getItem('gaenr_data_v2');
      if (!dataVersion) {
        // Mark the migration without deleting shared or locally hydrated experts.
        // The shared backend is authoritative; a browser refresh must never wipe it.
        try {
          localStorage.setItem('gaenr_data_v2', '1');
        } catch {}
      }

      const saved = localStorage.getItem('gaenr_freelancers');
      if (saved) {
        const parsed: FreelancerProfile[] = JSON.parse(saved);

        let hasChanges = false;
        const updated = parsed.map((fl) => {
          let updatedFl = { ...fl };

          // Ensure valid avatar: preserve chosen avatar if valid in RAW_AVATAR_SPECS, else assign recommended student avatar
          const hasValidAvatar = RAW_AVATAR_SPECS.some((s) => s.id === fl.avatarId);
          if (!hasValidAvatar) {
            const categoryAvatar = getCategoryAvatar(
              fl.category,
              updatedFl.code,
              fl.gender
            );
            updatedFl.avatarId = categoryAvatar.id;
            hasChanges = true;
          }

          // If an expert has 0 reviews, ensure rating is accurately 0.0
          if ((!fl.reviewsCount || fl.reviewsCount === 0) && (!fl.reviews || fl.reviews.length === 0)) {
            if (fl.rating !== 0.0 || fl.reviewsCount !== 0) {
              updatedFl.rating = 0.0;
              updatedFl.reviewsCount = 0;
              hasChanges = true;
            }
          }

          // Strip fake "Professional Studio Tools" fallback from existing deliverables
          if (updatedFl.portfolioItems && updatedFl.portfolioItems.length > 0) {
            const cleanedPort = updatedFl.portfolioItems.map((p: any) => ({
              ...p,
              tools: (p.tools || []).filter((t: string) => t !== 'Professional Studio Tools'),
            }));
            if (JSON.stringify(cleanedPort) !== JSON.stringify(updatedFl.portfolioItems)) {
              updatedFl.portfolioItems = cleanedPort;
              hasChanges = true;
            }
          }

          // Clean legacy auto-generated dummy statement on custom test profiles
          if (
            updatedFl.id?.startsWith('fl-') &&
            updatedFl.statement &&
            updatedFl.statement.includes('is an authorized Gaenr-verified specialist in')
          ) {
            updatedFl.statement = '';
            hasChanges = true;
          }

          // Clean legacy dummy portfolio items that have no URL AND no real title/description content
          // NOTE: Curated portfolio items without URLs are valid — they use category-specific visual cards
          if (updatedFl.id?.startsWith('fl-') && updatedFl.portfolioItems && updatedFl.portfolioItems.length > 0) {
            const realPort = updatedFl.portfolioItems.filter((p: any) => {
              // Keep if it has a real URL link
              if (p.mediaUrl || p.imageUrl || p.externalUrl) return true;
              // Keep curated items that have a meaningful title and description (not auto-generated dummies)
              const hasTitle = p.title && p.title.trim().length > 0 &&
                !p.title.startsWith('Portfolio Item') &&
                !p.title.startsWith('Untitled');
              const hasDesc = p.description && p.description.trim().length > 5;
              return hasTitle && hasDesc;
            });
            if (realPort.length !== updatedFl.portfolioItems.length) {
              updatedFl.portfolioItems = realPort;
              hasChanges = true;
            }
          }

          // Restore curated portfolio items for baseline freelancers whose portfolio was
          // accidentally emptied by the previous buggy filter (items without URLs).
          // If portfolio is now empty but the initial data has curated items for this ID, restore them.
          if (updatedFl.id?.startsWith('fl-') && (!updatedFl.portfolioItems || updatedFl.portfolioItems.length === 0)) {
            const initialMatch = INITIAL_FREELANCERS.find((f) => f.id === updatedFl.id);
            if (initialMatch && initialMatch.portfolioItems && initialMatch.portfolioItems.length > 0) {
              updatedFl.portfolioItems = initialMatch.portfolioItems;
              hasChanges = true;
            }
          }

          // If presentation slide specialist fl-ps-1 still has legacy drive link in cache, update to clean slide image asset
          if (updatedFl.id === 'fl-ps-1' && (updatedFl.portfolioItems || []).some((p: any) => p.mediaUrl?.includes('drive.google.com'))) {
            const initialMatch = INITIAL_FREELANCERS.find((f) => f.id === 'fl-ps-1');
            if (initialMatch?.portfolioItems) {
              updatedFl.portfolioItems = initialMatch.portfolioItems;
              hasChanges = true;
            }
          }

          // Normalize bKash Personal to bKash
          if (updatedFl.paymentMethod === 'bKash Personal') {
            updatedFl.paymentMethod = 'bKash';
            hasChanges = true;
          }

          // Ensure canonical skills and baseline profiles preserve user-uploaded portfolio items!
          const initMatch = updatedFl.id?.startsWith('fl-')
            ? INITIAL_FREELANCERS.find((f) => f.id === updatedFl.id)
            : undefined;
          if (initMatch) {
            updatedFl.code = initMatch.code;
            updatedFl.skills = initMatch.skills;
            updatedFl.keywords = initMatch.keywords;

            const existingItems = updatedFl.portfolioItems || [];
            const initialIds = new Set((initMatch.portfolioItems || []).map((p) => p.id));
            // Retain all user-uploaded items (items whose ID is not part of the initial static template)
            const userUploadedItems = existingItems.filter((p) => !initialIds.has(p.id));

            // Merge: User uploaded items stay at the front, followed by canonical template items
            const mergedItems = [...userUploadedItems, ...(initMatch.portfolioItems || [])];
            if (JSON.stringify(mergedItems) !== JSON.stringify(existingItems)) {
              updatedFl.portfolioItems = mergedItems;
              hasChanges = true;
            }
          }

          // Ensure secure high-entropy uploadToken exists (privacy from public expert IDs)
          if (!updatedFl.uploadToken) {
            updatedFl.uploadToken = generateSecureUploadToken();
            hasChanges = true;
          }

          return updatedFl;
        });

        if (parsed.length === 0) {
          const initialWithTokens = INITIAL_FREELANCERS.map((f) => ({
            ...f,
            uploadToken: f.uploadToken || generateSecureUploadToken(),
          }));
          try {
            localStorage.setItem('gaenr_freelancers', JSON.stringify(initialWithTokens));
          } catch {}
          return initialWithTokens;
        }

        // Ensure any profile from INITIAL_FREELANCERS that is missing in saved state is merged
        for (const initFl of INITIAL_FREELANCERS) {
          if (!updated.some((f) => f.id === initFl.id || f.code === initFl.code)) {
            updated.unshift({
              ...initFl,
              uploadToken: initFl.uploadToken || generateSecureUploadToken(),
            });
            hasChanges = true;
          }
        }

        if (hasChanges) {
          try {
            localStorage.setItem('gaenr_freelancers', JSON.stringify(updated));
          } catch {}
        }
        return updated;
      }
      const initialWithTokens = INITIAL_FREELANCERS.map((f) => ({
        ...f,
        uploadToken: f.uploadToken || generateSecureUploadToken(),
      }));
      try {
        localStorage.setItem('gaenr_freelancers', JSON.stringify(initialWithTokens));
      } catch {}
      return initialWithTokens;
    } catch {
      return INITIAL_FREELANCERS.map((f) => ({
        ...f,
        uploadToken: f.uploadToken || generateSecureUploadToken(),
      }));
    }
  });

  // Avatars (Initialize with the 6 core authentic raw vector avatars)
  const [avatars, setAvatars] = useState<AvatarAsset[]>(() => {
    try {
      const saved = localStorage.getItem('gaenr_avatars');
      if (saved) {
        const parsed: AvatarAsset[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Remove old uploaded photos (like curious-thinker, etc.)
          const cleaned = parsed.filter(
            (a) =>
              !a.id.includes('curious') &&
              !a.id.startsWith('the-') &&
              !a.imageUrl?.includes('/avatars/')
          );
          if (cleaned.length > 0) {
            return cleaned;
          }
        }
      }
      return INITIAL_AVATARS;
    } catch {
      return INITIAL_AVATARS;
    }
  });

  // Categories (Dynamic for frontend and backend admin)
  const [categories, setCategories] = useState<ServiceCategory[]>(() => {
    try {
      const saved = localStorage.getItem('gaenr_categories');
      if (saved) {
        const parsed: ServiceCategory[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((cat) => {
            const initial = SERVICE_CATEGORIES.find((c) => c.slug === cat.slug);
            return {
              ...cat,
              cardImageUrl: cat.cardImageUrl || initial?.cardImageUrl,
              cardImageFallbackUrl: cat.cardImageFallbackUrl || initial?.cardImageFallbackUrl,
              coverImageUrl: cat.coverImageUrl || initial?.coverImageUrl,
              allowedMediaTypes: cat.allowedMediaTypes || ['Images/Graphics', 'PDF/Document'],
            };
          });
        }
      }
    } catch {}
    return SERVICE_CATEGORIES.map((c) => ({
      ...c,
      allowedMediaTypes: c.allowedMediaTypes || ['Images/Graphics', 'PDF/Document'],
    }));
  });

  const updateCategories = (newCategories: ServiceCategory[]) => {
    setCategories(newCategories);
    try {
      localStorage.setItem('gaenr_categories', JSON.stringify(newCategories));
    } catch {}
  };

  const addCategory = (newCat: ServiceCategory) => {
    const updated = [...categories, newCat];
    updateCategories(updated);
  };

  const deleteCategory = (catId: string) => {
    const updated = categories.filter((c) => c.id !== catId);
    updateCategories(updated);
  };

  // Tasks
  const [taskAssignments, setTaskAssignments] = useState<TaskAssignment[]>(() => {
    try {
      const saved = localStorage.getItem('gaenr_tasks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Feedbacks
  const [feedbacks, setFeedbacks] = useState<FeedbackSubmission[]>(() => {
    try {
      const saved = localStorage.getItem('gaenr_feedbacks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Expert Applications
  const [expertApplications, setExpertApplications] = useState<ExpertApplication[]>(() => {
    try {
      const saved = localStorage.getItem('gaenr_expert_applications');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('gaenr_expert_applications', JSON.stringify(expertApplications));
    } catch {}
  }, [expertApplications]);

  // Toasts - Strictly one single notification displayed at any moment
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // =====================================
  // GAENR OPERATIONS INTERNAL STATE
  // =====================================

  const [currentEmployee, setCurrentEmployee] = useState<GaenrEmployee | null>(() => {
    try {
      const isSessionActive = sessionStorage.getItem('gaenr_admin_session') === 'active';
      if (!isSessionActive) return null;
      const saved = sessionStorage.getItem('gaenr_current_employee') || localStorage.getItem('gaenr_current_employee');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.username === 'operations') return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [operationalTasks, setOperationalTasks] = useState<OperationalTask[]>(() => {
    try {
      const saved = localStorage.getItem('gaenr_op_tasks');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Clean out legacy sample mock data starting with GT-102
        const real = Array.isArray(parsed) ? parsed.filter((t: any) => !t.id?.startsWith('GT-102')) : [];
        return real;
      }
      return [];
    } catch {
      return [];
    }
  });

  const [operationalClients, setOperationalClients] = useState<OperationalClient[]>(() => {
    try {
      const saved = localStorage.getItem('gaenr_op_clients');
      if (saved) {
        const parsed = JSON.parse(saved);
        const real = Array.isArray(parsed) ? parsed.filter((c: any) => !c.id?.startsWith('CL-200')) : [];
        return real;
      }
      return [];
    } catch {
      return [];
    }
  });

  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>(() => {
    try {
      const saved = localStorage.getItem('gaenr_op_payments');
      if (saved) {
        const parsed = JSON.parse(saved);
        const real = Array.isArray(parsed) ? parsed.filter((p: any) => !p.id?.startsWith('PAY-880')) : [];
        return real;
      }
      return [];
    } catch {
      return [];
    }
  });

  const [payoutRecords, setPayoutRecords] = useState<PayoutRecord[]>(() => {
    try {
      const saved = localStorage.getItem('gaenr_op_payouts');
      if (saved) {
        const parsed = JSON.parse(saved);
        const real = Array.isArray(parsed) ? parsed.filter((p: any) => !p.id?.startsWith('PO-550')) : [];
        return real;
      }
      return [];
    } catch {
      return [];
    }
  });

  const [employees, setEmployees] = useState<GaenrEmployee[]>(() => {
    try {
      const saved = localStorage.getItem('gaenr_op_employees');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((e: GaenrEmployee) => e.username === 'operations')) {
          return parsed;
        }
      }
      return INITIAL_EMPLOYEES;
    } catch {
      return INITIAL_EMPLOYEES;
    }
  });

  const [activityLogs, setActivityLogs] = useState<OperationalLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem('gaenr_op_logs');
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
    } catch {
      return INITIAL_ACTIVITY_LOGS;
    }
  });

  const [internalDocs] = useState<InternalDocument[]>(() => {
    try {
      const saved = localStorage.getItem('gaenr_op_docs');
      return saved ? JSON.parse(saved) : INITIAL_INTERNAL_DOCUMENTS;
    } catch {
      return INITIAL_INTERNAL_DOCUMENTS;
    }
  });

  const [operationalNotifications, setOperationalNotifications] = useState<OperationalNotification[]>(() => {
    try {
      const saved = localStorage.getItem('gaenr_op_notifs');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('gaenr_freelancers', JSON.stringify(freelancers));
    } catch {}
  }, [freelancers]);

  useEffect(() => {
    try {
      localStorage.setItem('gaenr_avatars', JSON.stringify(avatars));
    } catch {}
  }, [avatars]);

  useEffect(() => {
    try {
      localStorage.setItem('gaenr_tasks', JSON.stringify(taskAssignments));
    } catch {}
  }, [taskAssignments]);

  useEffect(() => {
    try {
      localStorage.setItem('gaenr_feedbacks', JSON.stringify(feedbacks));
    } catch {}
  }, [feedbacks]);

  useEffect(() => {
    try {
      if (currentEmployee) {
        localStorage.setItem('gaenr_current_employee', JSON.stringify(currentEmployee));
      } else {
        localStorage.removeItem('gaenr_current_employee');
      }
    } catch {}
  }, [currentEmployee]);

  useEffect(() => {
    try {
      localStorage.setItem('gaenr_op_tasks', JSON.stringify(operationalTasks));
    } catch {}
  }, [operationalTasks]);

  useEffect(() => {
    try {
      localStorage.setItem('gaenr_op_clients', JSON.stringify(operationalClients));
    } catch {}
  }, [operationalClients]);

  useEffect(() => {
    try {
      localStorage.setItem('gaenr_op_payments', JSON.stringify(paymentRecords));
    } catch {}
  }, [paymentRecords]);

  useEffect(() => {
    try {
      localStorage.setItem('gaenr_op_payouts', JSON.stringify(payoutRecords));
    } catch {}
  }, [payoutRecords]);

  useEffect(() => {
    try {
      localStorage.setItem('gaenr_op_employees', JSON.stringify(employees));
    } catch {}
  }, [employees]);

  useEffect(() => {
    try {
      localStorage.setItem('gaenr_op_logs', JSON.stringify(activityLogs));
    } catch {}
  }, [activityLogs]);

  useEffect(() => {
    try {
      localStorage.setItem('gaenr_op_notifs', JSON.stringify(operationalNotifications));
    } catch {}
  }, [operationalNotifications]);

  // Sync browser back/forward buttons & cross-tab / in-window updates
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname || '/';
      setCurrentRoute(path);
      if (path.startsWith('/experts') || path.startsWith('/freelancers') || path.startsWith('/profile/')) {
        setSubdomainState('freelancer.gaenr.com');
      } else {
        setSubdomainState('gaenr.com');
      }
    };

    const handleExternalSync = (e?: StorageEvent) => {
      try {
        const key = e?.key;
        if (!key || key === 'gaenr_freelancers') {
          const raw = localStorage.getItem('gaenr_freelancers');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) setFreelancers(parsed);
          }
        }
        if (!key || key === 'gaenr_avatars') {
          const raw = localStorage.getItem('gaenr_avatars');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) setAvatars(parsed);
          }
        }
        if (!key || key === 'gaenr_categories') {
          const raw = localStorage.getItem('gaenr_categories');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) setCategories(parsed);
          }
        }
        if (!key || key === 'gaenr_tasks') {
          const raw = localStorage.getItem('gaenr_tasks');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) setTaskAssignments(parsed);
          }
        }
        if (!key || key === 'gaenr_feedbacks') {
          const raw = localStorage.getItem('gaenr_feedbacks');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) setFeedbacks(parsed);
          }
        }
        if (!key || key === 'gaenr_expert_applications') {
          const raw = localStorage.getItem('gaenr_expert_applications');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) setExpertApplications(parsed);
          }
        }
        if (!key || key === 'gaenr_op_tasks') {
          const raw = localStorage.getItem('gaenr_op_tasks');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) setOperationalTasks(parsed);
          }
        }
        if (!key || key === 'gaenr_op_clients') {
          const raw = localStorage.getItem('gaenr_op_clients');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) setOperationalClients(parsed);
          }
        }
        if (!key || key === 'gaenr_op_payments') {
          const raw = localStorage.getItem('gaenr_op_payments');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) setPaymentRecords(parsed);
          }
        }
        if (!key || key === 'gaenr_op_payouts') {
          const raw = localStorage.getItem('gaenr_op_payouts');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) setPayoutRecords(parsed);
          }
        }
        if (!key || key === 'gaenr_op_employees') {
          const raw = localStorage.getItem('gaenr_op_employees');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) setEmployees(parsed);
          }
        }
        if (!key || key === 'gaenr_op_logs') {
          const raw = localStorage.getItem('gaenr_op_logs');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) setActivityLogs(parsed);
          }
        }
        if (!key || key === 'gaenr_op_notifs') {
          const raw = localStorage.getItem('gaenr_op_notifs');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) setOperationalNotifications(parsed);
          }
        }
      } catch {}
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('storage', handleExternalSync);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('storage', handleExternalSync);
    };
  }, []);

  // Sync window history pushState and scroll to top or hash target
  const navigate = (route: string) => {
    setCurrentRoute(route);
    if (typeof window !== 'undefined') {
      if (window.location.pathname + window.location.hash !== route) {
        window.history.pushState({}, '', route);
      }
      
      const hashIndex = route.indexOf('#');
      if (hashIndex !== -1) {
        const hashId = route.substring(hashIndex + 1);
        setTimeout(() => {
          const el = document.getElementById(hashId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 150);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    // Auto-switch subdomain if route is in showcase or main
    const cleanRoute = route.split('#')[0].split('?')[0];
    if (cleanRoute.startsWith('/experts') || cleanRoute.startsWith('/freelancers') || cleanRoute.startsWith('/profile/')) {
      setSubdomainState('freelancer.gaenr.com');
    } else if (cleanRoute.startsWith('/manage') || cleanRoute === '/admin') {
      // Admin area
    } else {
      setSubdomainState('gaenr.com');
    }
  };

  const setSubdomain = (mode: SubdomainMode) => {
    setSubdomainState(mode);
    if (mode === 'freelancer.gaenr.com') {
      if (!currentRoute.startsWith('/experts') && !currentRoute.startsWith('/freelancers') && !currentRoute.startsWith('/profile/')) {
        setCurrentRoute('/experts');
      }
    } else {
      if (currentRoute === '/experts' || currentRoute === '/freelancers') {
        setCurrentRoute('/');
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    // Strictly single active toast: new notification immediately replaces any existing one
    setToasts([{ id, message, type }]);
    toastTimerRef.current = setTimeout(() => {
      setToasts([]);
      toastTimerRef.current = null;
    }, 3000);
  };

  const dismissToast = (_id?: string) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    setToasts([]);
  };

  const openAssignTask = (expertCode?: string, categorySlug?: ServiceSlug) => {
    if (expertCode) setPreselectedExpert(expertCode);
    else setPreselectedExpert(null);

    if (categorySlug) setPreselectedCategory(categorySlug);
    else setPreselectedCategory(null);

    setIsAssignTaskOpen(true);
  };

  const closeAssignTask = () => {
    setIsAssignTaskOpen(false);
  };

  const openApplyExpert = () => setIsApplyExpertOpen(true);
  const closeApplyExpert = () => setIsApplyExpertOpen(false);

  const loginAdmin = () => {
    setIsAdminLoggedIn(true);
    try {
      sessionStorage.setItem('gaenr_admin_session', 'active');
      sessionStorage.setItem('gaenr_admin_logged', 'true');
      localStorage.setItem('gaenr_admin_session', 'active');
      localStorage.setItem('gaenr_admin_logged', 'true');
    } catch {}
    showToast('Signed in to Gaenr Operations workspace', 'success');
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setCurrentEmployee(null);
    try {
      sessionStorage.removeItem('gaenr_admin_session');
      sessionStorage.removeItem('gaenr_admin_logged');
      sessionStorage.removeItem('gaenr_current_employee');
      localStorage.removeItem('gaenr_admin_session');
      localStorage.removeItem('gaenr_admin_logged');
      localStorage.removeItem('gaenr_current_employee');
    } catch {}
    showToast('Signed out of Operations', 'info');
    navigate('/');
  };

  const addFreelancer = (newFl: FreelancerProfile) => {
    const safeFl: FreelancerProfile = {
      ...newFl,
      uploadToken: newFl.uploadToken || generateSecureUploadToken(),
    };
    setFreelancers((prev) => {
      const updated = [safeFl, ...prev];
      try {
        localStorage.setItem('gaenr_freelancers', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showToast(`Expert profile ${newFl.code} created successfully`, 'success');
  };

  const updateFreelancer = (code: string, updates: Partial<FreelancerProfile>) => {
    setFreelancers((prev) => {
      const updated = prev.map((fl) => (fl.code === code ? { ...fl, ...updates } : fl));
      try {
        localStorage.setItem('gaenr_freelancers', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showToast(`Profile ${code} updated successfully`, 'success');
  };

  const deleteFreelancer = (code: string): boolean => {
    setFreelancers((prev) => {
      const updated = prev.filter((fl) => fl.code !== code);
      try {
        localStorage.setItem('gaenr_freelancers', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showToast(`Expert profile ${code} deleted successfully`, 'info');
    return true;
  };

  const toggleFreelancerVisibility = (code: string) => {
    let nextPublicState = false;
    setFreelancers((prev) => {
      const target = prev.find((fl) => fl.code === code);
      nextPublicState = target ? !target.isPublic : true;
      const updated = prev.map((fl) =>
        fl.code === code ? { ...fl, isPublic: nextPublicState } : fl
      );
      try {
        localStorage.setItem('gaenr_freelancers', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showToast(
      `Expert profile ${code} is now ${nextPublicState ? 'PUBLIC (Live on Website)' : 'DRAFT (Hidden from Public)'}`,
      nextPublicState ? 'success' : 'info'
    );
  };

  const addExpertReview = (
    code: string,
    review: {
      clientName: string;
      clientEmail: string;
      clientType: string;
      rating: number;
      text: string;
      satisfaction?: 'satisfied' | 'neutral' | 'unsatisfied';
      skipDeliveryIncrement?: boolean;
    }
  ): boolean => {
    let success = false;
    setFreelancers((prev) => {
      const target = prev.find((fl) => fl.code.toLowerCase() === code.toLowerCase());
      if (!target) return prev;
      success = true;

      const newReviewItem = {
        id: `rev-${Date.now()}`,
        text: review.text.trim(),
        clientType: review.clientType.trim() || 'Verified Client',
        date: 'Just now',
        rating: review.rating,
        clientName: review.clientName.trim(),
        clientEmail: review.clientEmail.trim(),
      };

      const existingReviews = target.reviews || [];
      const updatedReviews = [newReviewItem, ...existingReviews];
      const newReviewsCount = updatedReviews.length;
      const totalStars = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
      const newRating = Number((totalStars / newReviewsCount).toFixed(1));

      // Calculate satisfaction percentages
      const satisfiedCount = updatedReviews.filter((r) => r.rating >= 4).length;
      const neutralCount = updatedReviews.filter((r) => r.rating === 3).length;
      const unsatisfiedCount = updatedReviews.filter((r) => r.rating <= 2).length;

      const updatedExpert: FreelancerProfile = {
        ...target,
        reviews: updatedReviews,
        rating: Math.min(5, Math.max(1, newRating)),
        reviewsCount: newReviewsCount,
        completedProjects: review.skipDeliveryIncrement
          ? (target.completedProjects || 0)
          : (target.completedProjects || 0) + 1,
        satisfactionRate: {
          satisfied: Math.round((satisfiedCount / newReviewsCount) * 100),
          neutral: Math.round((neutralCount / newReviewsCount) * 100),
          unsatisfied: Math.round((unsatisfiedCount / newReviewsCount) * 100),
        },
      };

      const updatedAll = prev.map((fl) =>
        fl.code.toLowerCase() === code.toLowerCase() ? updatedExpert : fl
      );

      try {
        localStorage.setItem('gaenr_freelancers', JSON.stringify(updatedAll));
      } catch {}

      return updatedAll;
    });

    if (success) {
      showToast(`Verified review submitted successfully for Expert ${code}!`, 'success');
      return true;
    } else {
      showToast(`Expert profile ${code} not found`, 'error');
      return false;
    }
  };

  const confirmExpertDelivery = (code: string): boolean => {
    let success = false;
    setFreelancers((prev) => {
      const target = prev.find((fl) => fl.code.toLowerCase() === code.toLowerCase());
      if (!target) return prev;
      success = true;

      const updatedExpert: FreelancerProfile = {
        ...target,
        completedProjects: (target.completedProjects || 0) + 1,
      };

      const updatedAll = prev.map((fl) =>
        fl.code.toLowerCase() === code.toLowerCase() ? updatedExpert : fl
      );

      try {
        localStorage.setItem('gaenr_freelancers', JSON.stringify(updatedAll));
      } catch {}

      return updatedAll;
    });

    if (success) {
      showToast(`Project delivery confirmed for Expert ${code}! Completed deliveries count updated.`, 'success');
      return true;
    } else {
      showToast(`Expert profile ${code} not found`, 'error');
      return false;
    }
  };

  const addAvatar = (avatar: AvatarAsset) => {
    setAvatars((prev) => {
      const updated = [avatar, ...prev.filter((a) => a.id !== avatar.id)];
      try {
        localStorage.setItem('gaenr_avatars', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    showToast(`Avatar "${avatar.name}" added to library`, 'success');
  };

  const deleteAvatar = (id: string): boolean => {
    const isAssigned = freelancers.some((fl) => fl.avatarId === id);
    if (isAssigned) {
      showToast('Cannot delete avatar currently assigned to an active expert profile', 'error');
      return false;
    }
    setAvatars((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      try {
        localStorage.setItem('gaenr_avatars', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showToast('Avatar removed from library', 'info');
    return true;
  };

  const loginOperations = (employeeIdOrEmail: string, role?: OperationsRole): boolean => {
    const input = employeeIdOrEmail.trim().toLowerCase();
    let emp = employees.find(
      (e) => e.id.toLowerCase() === input || e.email.toLowerCase() === input || e.username.toLowerCase() === input
    );
    if (!emp && role) {
      emp = employees.find((e) => e.role === role);
    }
    if (!emp) {
      emp = employees[0];
    }
    setCurrentEmployee(emp);
    setIsAdminLoggedIn(true);
    try {
      sessionStorage.setItem('gaenr_admin_session', 'active');
      sessionStorage.setItem('gaenr_admin_logged', 'true');
      sessionStorage.setItem('gaenr_current_employee', JSON.stringify(emp));
      localStorage.setItem('gaenr_admin_session', 'active');
      localStorage.setItem('gaenr_admin_logged', 'true');
      localStorage.setItem('gaenr_current_employee', JSON.stringify(emp));
    } catch {}

    const log: OperationalLogEntry = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      category: 'System',
      action: 'Staff Authentication',
      performedBy: `${emp.name} (${emp.id})`,
      targetId: emp.designation,
      details: `${emp.name} logged into Gaenr Operations (${emp.role} - ${emp.department})`,
    };
    setActivityLogs((prev) => [log, ...prev]);
    showToast(`Welcome back, ${emp.name} (${emp.role})`, 'success');
    return true;
  };

  const logoutOperations = () => {
    if (currentEmployee) {
      const log: OperationalLogEntry = {
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString(),
        category: 'System',
        action: 'Staff Sign-Out',
        performedBy: `${currentEmployee.name} (${currentEmployee.id})`,
        targetId: currentEmployee.designation,
        details: `${currentEmployee.name} signed out of Operations`,
      };
      setActivityLogs((prev) => [log, ...prev]);
    }
    setCurrentEmployee(null);
    setIsAdminLoggedIn(false);
    try {
      sessionStorage.removeItem('gaenr_admin_session');
      sessionStorage.removeItem('gaenr_admin_logged');
      sessionStorage.removeItem('gaenr_current_employee');
      localStorage.removeItem('gaenr_admin_session');
      localStorage.removeItem('gaenr_admin_logged');
      localStorage.removeItem('gaenr_current_employee');
    } catch {}
    showToast('Signed out of Operations', 'info');
  };

  const updateOperationalTask = (taskId: string, updates: Partial<OperationalTask>) => {
    setOperationalTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updated = { ...t, ...updates };
          if (updates.status && updates.status !== t.status) {
            const actor = currentEmployee ? `${currentEmployee.name} (${currentEmployee.role})` : 'Operations Team';
            const logItem = {
              timestamp: new Date().toISOString(),
              action: `Status changed from "${t.status}" to "${updates.status}"`,
              performedBy: actor,
              details: `Task status update recorded in operations pipeline`,
            };
            updated.activityHistory = [logItem, ...(updated.activityHistory || [])];

            const globalLog: OperationalLogEntry = {
              id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              timestamp: new Date().toISOString(),
              category: 'Task',
              action: 'Task Status Change',
              performedBy: currentEmployee ? `${currentEmployee.name} (${currentEmployee.id})` : 'Operations Staff',
              targetId: taskId,
              details: `Changed task ${taskId} status to ${updates.status}`,
            };
            setActivityLogs((l) => [globalLog, ...l]);
          }
          return updated;
        }
        return t;
      })
    );
    showToast(`Task ${taskId} updated`, 'success');
  };

  const addOperationalTask = (task: OperationalTask) => {
    setOperationalTasks((prev) => [task, ...prev]);
    const globalLog: OperationalLogEntry = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      category: 'Task',
      action: 'Task Created',
      performedBy: currentEmployee ? `${currentEmployee.name} (${currentEmployee.id})` : 'Operations Staff',
      targetId: task.id,
      details: `Created new operational task ${task.id}: "${task.service}"`,
    };
    setActivityLogs((prev) => [globalLog, ...prev]);
    showToast(`Task ${task.id} created`, 'success');
  };

  const updateOperationalClient = (clientId: string, updates: Partial<OperationalClient>) => {
    setOperationalClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, ...updates } : c))
    );
    showToast(`Client ${clientId} updated`, 'success');
  };

  const addOperationalClient = (client: OperationalClient) => {
    setOperationalClients((prev) => [client, ...prev]);
    showToast(`Client ${client.name} added`, 'success');
  };

  const updatePaymentRecord = (id: string, updates: Partial<PaymentRecord>) => {
    setPaymentRecords((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return { ...p, ...updates };
        }
        return p;
      })
    );
    showToast(`Payment ${id} updated`, 'success');
  };

  const updatePayoutRecord = (id: string, updates: Partial<PayoutRecord>) => {
    setPayoutRecords((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...updates };
          if (updates.status === 'Paid') {
            updated.confirmedBy = currentEmployee ? `${currentEmployee.name} (${currentEmployee.id})` : 'Finance';
            updated.payoutDate = new Date().toISOString().split('T')[0];
          }
          return updated;
        }
        return p;
      })
    );
    showToast(`Payout ${id} updated`, 'success');
  };

  const updateEmployee = (id: string, updates: Partial<GaenrEmployee>) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
    showToast(`Employee record updated`, 'success');
  };

  const addEmployee = (emp: GaenrEmployee) => {
    setEmployees((prev) => [emp, ...prev]);
    showToast(`Employee ${emp.name} added to Gaenr Team`, 'success');
  };

  const addActivityLog = (entry: Omit<OperationalLogEntry, 'id' | 'timestamp'>) => {
    const log: OperationalLogEntry = {
      ...entry,
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
    };
    setActivityLogs((prev) => [log, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setOperationalNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const submitTaskAssignment = (
    taskData: Omit<TaskAssignment, 'id' | 'createdAt' | 'status'> &
      Partial<Pick<TaskAssignment, 'status' | 'price' | 'pricingNotes' | 'assignedVia'>>
  ) => {
    const newTask: TaskAssignment = {
      ...taskData,
      id: `task_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: taskData.status || 'pending_review',
      price: taskData.price,
      pricingNotes: taskData.pricingNotes,
      assignedVia: taskData.assignedVia || 'website_modal',
    };
    setTaskAssignments((prev) => [newTask, ...prev]);

    // Also bridge to OperationalTask for internal ops tracking!
    const newOpTask: OperationalTask = {
      id: `GT-${Math.floor(1000 + Math.random() * 9000)}`,
      clientId: `CL-${Math.floor(2000 + Math.random() * 8000)}`,
      clientName: taskData.fullName,
      clientEmail: taskData.email,
      clientWhatsapp: taskData.whatsapp,
      service: taskData.subCategory || taskData.category,
      categorySlug: taskData.category,
      freelancerCode: taskData.expertCode || undefined,
      requirements: taskData.description,
      status: 'New',
      paymentStatus: 'Unpaid',
      freelancerStatus: taskData.expertCode ? 'Assigned' : 'Unassigned',
      clientConfirmationStatus: 'Pending',
      budgetAmount: typeof taskData.price === 'number' ? taskData.price : (Number(taskData.price) || 5000),
      payoutAmount: 4000,
      createdAt: new Date().toISOString(),
      deadline: taskData.deadline,
      internalNotes: `Submitted via ${taskData.assignedVia === 'ginny_ai' ? 'Ginny AI Chatbot' : 'Website Form'}. Preferred Channel: ${taskData.preferredChannel}. Expert Code: ${taskData.expertCode || 'None'}.`,
      activityHistory: [
        {
          timestamp: new Date().toISOString(),
          action: `Task submitted by client via ${taskData.assignedVia === 'ginny_ai' ? 'Ginny AI' : 'Public Website'}`,
          performedBy: taskData.assignedVia === 'ginny_ai' ? 'Ginny AI' : 'Public Gateway',
          details: `Client ${taskData.fullName} requested ${taskData.subCategory}`,
        },
      ],
    };
    setOperationalTasks((prev) => [newOpTask, ...prev]);
    return newTask;
  };

  const updateTaskStatus = (taskId: string, status: TaskAssignment['status']) => {
    setTaskAssignments((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status } : t))
    );
  };

  const updateTaskAssignment = (taskId: string, updates: Partial<TaskAssignment>) => {
    setTaskAssignments((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
    );
  };

  const deleteTaskAssignment = (taskId: string) => {
    setTaskAssignments((prev) => prev.filter((t) => t.id !== taskId));
    showToast('Task record deleted', 'info');
  };

  const submitFeedback = (fbData: Omit<FeedbackSubmission, 'id' | 'createdAt'>) => {
    const newFb: FeedbackSubmission = {
      ...fbData,
      id: `fb_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setFeedbacks((prev) => [newFb, ...prev]);
    showToast('Thank you! Your feedback has been shared with the Gaenr team.', 'success');
  };

  const deleteFeedback = (id: string) => {
    setFeedbacks((prev) => prev.filter((f) => f.id !== id));
    showToast('Feedback record deleted', 'info');
  };

  const submitExpertApplication = (appData: Omit<ExpertApplication, 'id' | 'createdAt' | 'status'>) => {
    const newApp: ExpertApplication = {
      ...appData,
      id: `app_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'applied',
      googleDriveAssetFolderUrl: GAENR_OFFICIAL_DRIVE_FOLDER_URL,
    };
    setExpertApplications((prev) => [newApp, ...prev]);
  };

  const updateExpertApplicationStatus = (
    id: string,
    newStatus: ExpertApplicationStatus,
    cardImage?: string | null,
    customCode?: string
  ) => {
    const targetApp = expertApplications.find((a) => a.id === id);
    if (!targetApp) return;

    if (newStatus === 'onboarded') {
      // Must enforce: Cannot convert to live if onboardingData is missing!
      if (!targetApp.onboardingData) {
        showToast('Cannot convert to Live: Candidate has not submitted the onboarding questionnaire yet.', 'error');
        return;
      }

      const existingCodes = freelancers.map((f) => f.code);
      const CODE_REGEX = /^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{8}$/;
      let generatedCode = customCode || targetApp.convertedExpertCode;

      if (!generatedCode || !CODE_REGEX.test(generatedCode) || existingCodes.includes(generatedCode)) {
        generatedCode = generateUniqueExpertCode(existingCodes);
      }

      const uploadToken = targetApp.uploadToken || generateSecureUploadToken();
      const catMeta = mapSkillToCategory(targetApp.otherSkill || targetApp.skill);

      const chosenAvatar =
        targetApp.onboardingData?.avatarId ||
        (targetApp.gender.toLowerCase().includes('female') ? 'avatar-youth-f1' : 'avatar-youth-m1');

      const chosenStatement =
        targetApp.onboardingData?.statement ||
        `Verified Gaenr Expert in ${catMeta.title}. Specialized in professional deliverables and timely delivery.`;

      const newProfile: FreelancerProfile = {
        id: `fl_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`,
        code: generatedCode,
        uploadToken: uploadToken,
        name: targetApp.fullName,
        gender: targetApp.gender.toLowerCase().includes('female') ? 'Female' : 'Male',
        contactNumber: targetApp.whatsapp,
        privateEmail: targetApp.email,
        address: targetApp.otherAddress || targetApp.address,
        category: catMeta.slug,
        categoryTitle: catMeta.title,
        avatarId: chosenAvatar,
        rating: 5.0,
        reviewsCount: 0,
        completedProjects: 0,
        statement: chosenStatement,
        status: 'active',
        isPublic: true,
        satisfactionRate: { satisfied: 100, neutral: 0, unsatisfied: 0 },
        reviews: [],
        paymentMethod: targetApp.onboardingData?.payoutMethod === 'bank' ? 'Bank Transfer' : 'MFS',
        paymentDetails:
          targetApp.onboardingData?.payoutMethod === 'bank'
            ? `${targetApp.onboardingData.bankName || 'Bank'} | A/C: ${targetApp.onboardingData.accountNumber || ''} | Holder: ${targetApp.onboardingData.accountHolderName || ''} | Branch: ${targetApp.onboardingData.branchName || ''} ${targetApp.onboardingData.routingNumber ? `(${targetApp.onboardingData.routingNumber})` : ''}`
            : `${targetApp.onboardingData?.payoutMethod || 'MFS'}: ${targetApp.onboardingData?.mfsNumber || targetApp.whatsapp}`,
        pricingTiers: targetApp.onboardingData?.pricingTiers || [
          {
            id: `tier_${Date.now()}`,
            serviceName: 'Standard Project Deliverable',
            price: targetApp.onboardingData?.pricingModel || '5,000 BDT',
          },
        ],
        googleDriveFolderUrl: GAENR_OFFICIAL_DRIVE_FOLDER_URL,
        portfolioItems: [], // Crucial Rule: Profile starts clean; application portfolio is NOT published to live profile.
      };

      setFreelancers((prev) => {
        const cleanPrev = prev.filter((f) => f.code !== generatedCode && f.id !== newProfile.id);
        const updated = [newProfile, ...cleanPrev];
        try {
          localStorage.setItem('gaenr_freelancers', JSON.stringify(updated));
        } catch {}
        return updated;
      });

      setExpertApplications((prev) =>
        prev.map((a) =>
          a.id === id
            ? { ...a, status: 'onboarded', convertedExpertCode: generatedCode, uploadToken: uploadToken }
            : a
        )
      );

      // Trigger official welcome email in 100% English with ID card badge and upload portal link
      if (targetApp.email) {
        sendExpertWelcomeEmail(generatedCode, cardImage || null, newProfile).catch((err) => {
          console.warn('Welcome email dispatch note:', err);
        });
      }

      showToast(`Expert profile ${generatedCode} (${targetApp.fullName}) is now live on Gaenr!`, 'success');
      return;
    }

    if (newStatus === 'approved') {
      setExpertApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: 'approved' } : a))
      );

      // Trigger automated onboarding invitation email directly to applicant
      if (targetApp.email) {
        sendExpertOnboardingInviteEmail(targetApp).catch((err) => {
          console.warn('Onboarding invite email dispatch note:', err);
        });
      }

      showToast(`Application approved! Onboarding invitation sent to ${targetApp.fullName}`, 'success');
      return;
    }

    setExpertApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
    showToast(`Status updated to ${newStatus}`, 'info');
  };

  const saveExpertOnboardingResponse = (applicationId: string, data: ExpertOnboardingData) => {
    setExpertApplications((prev) =>
      prev.map((a) =>
        a.id === applicationId
          ? {
              ...a,
              onboardingData: {
                ...data,
                submittedAt: new Date().toISOString(),
              },
            }
          : a
      )
    );
    showToast('Onboarding profile & payout preferences saved successfully!', 'success');
  };

  const addExpertPortfolioItem = (expertCode: string, item: PortfolioItem) => {
    setFreelancers((prev) => {
      const updated = prev.map((fl) => {
        if (fl.code.toLowerCase() === expertCode.toLowerCase()) {
          return {
            ...fl,
            portfolioItems: [item, ...(fl.portfolioItems || [])],
          };
        }
        return fl;
      });
      try {
        localStorage.setItem('gaenr_freelancers', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteExpertPortfolioItem = (expertCode: string, itemId: string) => {
    setFreelancers((prev) => {
      const updated = prev.map((fl) => {
        if (fl.code.toLowerCase() === expertCode.toLowerCase()) {
          return {
            ...fl,
            portfolioItems: (fl.portfolioItems || []).filter((p) => p.id !== itemId),
          };
        }
        return fl;
      });
      try {
        localStorage.setItem('gaenr_freelancers', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showToast('Portfolio item removed', 'info');
  };

  const deleteExpertApplication = (id: string) => {
    setExpertApplications((prev) => prev.filter((a) => a.id !== id));
    showToast('Application record deleted', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        subdomain,
        setSubdomain,
        currentRoute,
        navigate,
        isAssignTaskOpen,
        openAssignTask,
        closeAssignTask,
        preselectedExpert,
        preselectedCategory,
        isApplyExpertOpen,
        openApplyExpert,
        closeApplyExpert,
        freelancers,
        addFreelancer,
        updateFreelancer,
        deleteFreelancer,
        toggleFreelancerVisibility,
        addExpertReview,
        confirmExpertDelivery,
        addExpertPortfolioItem,
        deleteExpertPortfolioItem,
        avatars,
        addAvatar,
        deleteAvatar,
        categories,
        addCategory,
        updateCategories,
        deleteCategory,
        taskAssignments,
        submitTaskAssignment,
        updateTaskStatus,
        updateTaskAssignment,
        deleteTaskAssignment,
        feedbacks,
        submitFeedback,
        deleteFeedback,
        expertApplications,
        submitExpertApplication,
        updateExpertApplicationStatus,
        saveExpertOnboardingResponse,
        deleteExpertApplication,
        toasts,
        showToast,
        dismissToast,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        currentEmployee,
        loginOperations,
        logoutOperations,
        operationalTasks,
        updateOperationalTask,
        addOperationalTask,
        operationalClients,
        updateOperationalClient,
        addOperationalClient,
        paymentRecords,
        updatePaymentRecord,
        payoutRecords,
        updatePayoutRecord,
        employees,
        updateEmployee,
        addEmployee,
        activityLogs,
        addActivityLog,
        internalDocs,
        operationalNotifications,
        markNotificationRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
};
