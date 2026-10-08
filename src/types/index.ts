export type ServiceSlug =
  | 'graphics-design'
  | 'content-writing'
  | 'video-editing'
  | 'wordpress-website'
  | 'presentation-slide-design'
  | 'ux-ui-design'
  | 'ad-running'
  | 'bundle'
  | (string & {});

export interface ServiceCategory {
  id: string;
  slug: ServiceSlug;
  title: string;
  tagline: string;
  description: string;
  iconName: string;
  subServices: string[];
  deliverables: string[];
  whyGaenr: string[];
  featuredProjectsCount: number;
  allowedMediaTypes?: string[];
  cardImageUrl?: string;
  cardImageFallbackUrl?: string;
  coverImageUrl?: string;
}

export type DeliverableType =
  | 'website'
  | 'image'
  | 'document'
  | 'figma'
  | 'video'
  | 'drive'
  | 'social'
  | 'code'
  | string;

export interface DeliverableTypeOption {
  value: string;
  label: string;
  badge: string;
  badgeColor: string;
}

export const DELIVERABLE_TYPE_OPTIONS: DeliverableTypeOption[] = [
  {
    value: 'website',
    label: 'Live Website / Web Application Link',
    badge: 'Live URL',
    badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  },
  {
    value: 'image',
    label: 'Image / Graphic Artwork / Photo Design',
    badge: 'PNG / JPG',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    value: 'document',
    label: 'Document / PDF / Presentation Slide Deck',
    badge: 'PDF / Deck',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  {
    value: 'figma',
    label: 'Figma UI/UX / Prototype Design System',
    badge: 'Figma',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  {
    value: 'video',
    label: 'Video Showcase / Motion Graphics Reel',
    badge: 'MP4 / Reel',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  {
    value: 'drive',
    label: 'Google Drive / Cloud Asset Folder',
    badge: 'Cloud Drive',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    value: 'social',
    label: 'Social Media Creative / Ad Campaign',
    badge: 'Social Ad',
    badgeColor: 'bg-pink-50 text-pink-700 border-pink-200',
  },
  {
    value: 'code',
    label: 'Source Code / GitHub / Technical Project',
    badge: 'Code / Git',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
  },
];

export interface PortfolioItem {
  id: string;
  title: string;
  category: ServiceSlug;
  description: string;
  tools: string[];
  previewType: DeliverableType;
  accentColor: string;
  aspectRatio: '16:9' | '4:3' | '1:1';
  summaryPoints?: string[];
  clientIndustry?: string;
  mediaUrl?: string; // Direct link (image, video, web, behance, drive)
  imageUrl?: string; // Direct image URL or base64 data
  externalUrl?: string; // Optional external link to live deliverable
}

export interface FreelancerProfile {
  id: string;
  code: string; // e.g. GD2602001
  category: ServiceSlug;
  categoryTitle: string;
  avatarId: string;
  rating: number;
  reviewsCount: number;
  completedProjects: number;
  statement: string;
  status: 'active' | 'in_review' | 'paused';
  isPublic: boolean;
  satisfactionRate: {
    satisfied: number; // e.g. 80%
    neutral: number;   // e.g. 12%
    unsatisfied: number; // e.g. 8%
  };
  reviews: {
    id: string;
    text: string;
    clientType: string;
    date: string;
    rating: number;
    clientName?: string;
    clientEmail?: string;
  }[];
  portfolioItems: PortfolioItem[];
  keywords?: string[];
  skills?: string[];
  name?: string;
  gender?: 'Male' | 'Female' | 'Third Gender' | 'Other';
  address?: string;
  privateEmail?: string;
  contactNumber?: string;
  additionalNote?: string;
  paymentMethod?: string;
  paymentDetails?: string;
  mediaType?: string;
  pricingTiers?: ExpertPricingTier[];
  googleDriveFolderUrl?: string;
}

export interface ExpertPricingTier {
  id: string;
  serviceName: string;
  price: string;
}

export interface AvatarAsset {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'third_gender';
  tone: string;
  assignedCount: number;
  imageUrl?: string;
}

export interface BrandingConfig {
  siteTitle: string;
  logoUrl?: string;
  faviconUrl?: string;
  watermarkImage?: string;
  primaryColor: string; // hex
  backgroundColor?: string; // hex
  footerBgColor?: string; // hex
  footerTextColor?: string; // hex
  footerText?: string;
  watermarkText: string;
  watermarkOpacity: number; // 0 to 100
  watermarkPosition: 'diagonal' | 'center' | 'bottom-right';
  repeatingWatermark?: boolean;
  footerTagline: string;
}

export interface TaskAssignment {
  id: string;
  fullName: string;
  email: string;
  whatsapp: string;
  preferredChannel: 'WhatsApp' | 'Email' | 'Telegram';
  category: ServiceSlug;
  subCategory: string;
  expertCode: string;
  deadline: string;
  description: string;
  documentName?: string;
  documentUrl?: string;
  agreedTerms: boolean;
  agreedAccuracy: boolean;
  createdAt: string;
  status: 'pending_review' | 'confirmed' | 'payment_escrow' | 'in_progress' | 'completed';
  price?: number | string;
  pricingNotes?: string;
  assignedVia?: 'website_modal' | 'ginny_ai';
}

export interface FeedbackSubmission {
  id: string;
  name?: string;
  email?: string;
  userType: 'Business / Outsourcer' | 'Expert' | 'Visitor';
  category: 'Suggestion / Idea' | 'Issue or Bug' | 'Feature Request' | 'General Feedback';
  message: string;
  createdAt: string;
  status?: 'New' | 'Reviewed' | 'Archived';
}

export type ExpertApplicationStatus = 'applied' | 'approved' | 'onboarded' | 'rejected' | string;

export interface ExpertOnboardingData {
  pricingModel?: string; // e.g. Fixed per task, Hourly, Custom Tiers
  pricingTiers?: ExpertPricingTier[];
  avatarId?: string; // e.g. avatar-youth-m1 to avatar-youth-f5
  statement?: string; // My Statement / Bio for client profile
  submittedAt?: string;
  notes?: string;
}

export interface ExpertApplication {
  id: string;
  fullName: string;
  whatsapp: string;
  email: string;
  gender: string;
  occupation: string;
  otherOccupation?: string;
  address: string;
  otherAddress?: string;
  skill: string;
  otherSkill?: string;
  experience: string;
  portfolioUrl: string;
  createdAt: string;
  status: ExpertApplicationStatus;
  onboardingData?: ExpertOnboardingData;
  convertedExpertCode?: string; // Code of generated expert profile (e.g. GD2603001)
  googleDriveAssetFolderUrl?: string; // Connected Google Drive Asset Folder
}

// ==========================================
// GAENR OPERATIONS - INTERNAL FUNCTION TYPES
// ==========================================

export type OperationsRole = 'Director' | 'HR' | 'Employee';

export interface GaenrEmployee {
  id: string; // e.g. GOP-001
  name: string;
  username: string;
  email: string;
  whatsapp: string;
  role: OperationsRole;
  department: string;
  designation: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  joinedDate: string;
  notes?: string;
  cvUploaded?: boolean;
  performanceScore?: number;
}

export type OperationalTaskStatus =
  | 'New'
  | 'Reviewing'
  | 'Freelancer Assigned'
  | 'Payment Pending'
  | 'Payment Confirmed'
  | 'In Progress'
  | 'Submitted'
  | 'Client Review'
  | 'Revision'
  | 'Completed'
  | 'Freelancer Payout'
  | 'Closed';

export type OperationalPaymentStatus = 'Unpaid' | 'Link Sent' | 'Escrow Funded' | 'Verified' | 'Refunded';
export type OperationalFreelancerStatus = 'Unassigned' | 'Assigned' | 'Accepted' | 'In Progress' | 'Delivered';

export interface OperationalTask {
  id: string; // e.g. GT-1024
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientWhatsapp: string;
  service: string;
  categorySlug: ServiceSlug;
  freelancerCode?: string;
  requirements: string;
  attachedFiles?: string[];
  assignedEmployeeId?: string;
  assignedEmployeeName?: string;
  status: OperationalTaskStatus;
  paymentStatus: OperationalPaymentStatus;
  freelancerStatus: OperationalFreelancerStatus;
  clientConfirmationStatus: 'Pending' | 'Confirmed' | 'Disputed';
  budgetAmount: number;
  payoutAmount: number;
  createdAt: string;
  deadline: string;
  internalNotes: string;
  activityHistory: Array<{
    timestamp: string;
    action: string;
    performedBy: string;
    details?: string;
  }>;
}

export interface OperationalClient {
  id: string; // e.g. CL-2041
  name: string;
  company?: string;
  email: string;
  phone: string;
  whatsapp: string;
  totalTasks: number;
  totalSpend: number;
  status: 'Active' | 'VIP' | 'New' | 'Flagged';
  assignedFreelancerCodes: string[];
  internalNotes: string;
  joinedDate: string;
}

export interface PaymentRecord {
  id: string; // e.g. PAY-8801
  taskId: string;
  clientName: string;
  amount: number;
  method: 'bKash' | 'Nagad' | 'Rocket' | 'Bank Transfer' | 'SSLCommerz';
  paymentLink?: string;
  status: 'Pending' | 'Verified' | 'Failed' | 'Refunded';
  paymentDate: string;
  referenceId: string;
  internalNotes?: string;
}

export interface PayoutRecord {
  id: string; // e.g. PO-5501
  freelancerCode: string;
  freelancerName: string;
  taskId: string;
  amount: number;
  status: 'Pending Approval' | 'Ready for Processing' | 'Paid';
  method: 'bKash' | 'Nagad' | 'Bank Transfer';
  payoutDate?: string;
  referenceId?: string;
  confirmedBy?: string;
}

export interface OperationalLogEntry {
  id: string;
  timestamp: string;
  category: 'Task' | 'Payment' | 'Freelancer' | 'Client' | 'HR' | 'System';
  action: string;
  performedBy: string;
  targetId?: string;
  details?: string;
}

export interface InternalDocument {
  id: string;
  title: string;
  category: 'SOP' | 'Policy' | 'Guidelines' | 'Template';
  restrictedToRoles: OperationsRole[];
  lastUpdated: string;
  author: string;
  summary: string;
  content: string;
}

export interface OperationalNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'alert' | 'task' | 'payment' | 'freelancer' | 'hr';
  priority: 'high' | 'medium' | 'low';
  isRead: boolean;
  targetTab?: string;
}

