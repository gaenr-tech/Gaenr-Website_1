import {
  GaenrEmployee,
  OperationalTask,
  OperationalClient,
  PaymentRecord,
  PayoutRecord,
  OperationalLogEntry,
  InternalDocument,
  OperationalNotification,
} from '../types';

export const INITIAL_EMPLOYEES: GaenrEmployee[] = [
  {
    id: 'GOP-001',
    name: 'Gaenr Operations',
    username: 'operations',
    email: 'operations@gaenr.com',
    whatsapp: '+8801700000000',
    role: 'Director',
    department: 'Operations',
    designation: 'Operations Lead',
    status: 'Active',
    joinedDate: '2024-01-01',
    notes: 'Primary operations master account. Full administrative authority.',
    cvUploaded: true,
    performanceScore: 100,
  },
];

export const INITIAL_OPERATIONAL_TASKS: OperationalTask[] = [];

export const INITIAL_OPERATIONAL_CLIENTS: OperationalClient[] = [];

export const INITIAL_PAYMENT_RECORDS: PaymentRecord[] = [];

export const INITIAL_PAYOUT_RECORDS: PayoutRecord[] = [];

export const INITIAL_ACTIVITY_LOGS: OperationalLogEntry[] = [];

export const INITIAL_INTERNAL_DOCUMENTS: InternalDocument[] = [
  {
    id: 'DOC-SOP-01',
    title: 'SOP: Client Brief Quality Review & Intake',
    category: 'SOP',
    restrictedToRoles: ['Director', 'HR', 'Employee'],
    lastUpdated: '2026-09-01',
    author: 'Zubair Hasan (Director)',
    summary: 'Standard operational protocol for verifying client project scope, deadlines, and technical requirements before assignment.',
    content: `1. Intake Verification:
- Upon receiving a new task (GT-XXXX), the Task Coordinator must inspect the brief within 30 minutes.
- Verify clarity of deliverables, word counts, brand guidelines, and reference attachments.
- If scope is ambiguous, place a phone call or WhatsApp message to client before confirming.

2. Escrow Initiation:
- Generate and dispatch secure payment link.
- Never authorize freelancer work to begin before payment status is 'Escrow Funded'.`,
  },
  {
    id: 'DOC-SOP-02',
    title: 'SOP: Escrow Payment Verification & Dispute Handling',
    category: 'SOP',
    restrictedToRoles: ['Director', 'HR', 'Employee'],
    lastUpdated: '2026-09-10',
    author: 'Arif Mahmud (Finance)',
    summary: 'Procedures for verifying bKash, Nagad, and bank transactions, handling client revisions, and dispute resolution.',
    content: `1. Escrow Confirmation:
- Check merchant statement for transaction ID match.
- Mark status as 'Verified' in Payment Operations.

2. Revision Protocol:
- Clients are entitled to revision rounds managed by Gaenr coordinator.
- If a revision requires out-of-scope additions, issue a supplemental task add-on.

3. 100% Refund Policy:
- If an expert fails to deliver within agreed timeline or fails quality benchmarks, funds are refunded in full to client wallet within 24 hours.`,
  },
  {
    id: 'DOC-POL-03',
    title: 'Policy: Freelancer Privacy & Public Profile Separation',
    category: 'Policy',
    restrictedToRoles: ['Director', 'HR', 'Employee'],
    lastUpdated: '2026-09-15',
    author: 'Nusrat Jahan (HR Lead)',
    summary: 'Mandatory guidelines ensuring freelancer private information is never exposed to public or client-facing interfaces.',
    content: `1. Public Separation:
- Under no circumstance shall freelancer phone numbers, university ID cards, or residential addresses appear on freelancer.gaenr.com.
- Public visitors identify freelancers ONLY by their approved Unique ID (e.g. GD2602001) and approved portfolio visual cards.

2. Operations Access:
- All private communication with freelancers is conducted by authorized Gaenr Task Coordinators.`,
  },
];

export const INITIAL_NOTIFICATIONS: OperationalNotification[] = [
  {
    id: 'notif-1',
    title: 'New Task Awaiting Assignment',
    message: 'Task GT-1027 (Presentation Slide Design) needs coordinator and expert assignment.',
    timestamp: '15 mins ago',
    type: 'task',
    priority: 'high',
    isRead: false,
    targetTab: 'assignments',
  },
  {
    id: 'notif-2',
    title: 'Payment Pending Verification',
    message: 'Task GT-1025 has a pending Nagad deposit of 25,000 BDT awaiting confirmation.',
    timestamp: '2 hours ago',
    type: 'payment',
    priority: 'high',
    isRead: false,
    targetTab: 'payments',
  },
  {
    id: 'notif-3',
    title: 'Deliverables Ready for Client Review',
    message: 'Expert VE2602001 completed all 10 video reels for Task GT-1026.',
    timestamp: '4 hours ago',
    type: 'task',
    priority: 'medium',
    isRead: false,
    targetTab: 'tasks',
  },
  {
    id: 'notif-4',
    title: 'Freelancer Payout Ready',
    message: 'Task GT-1028 approved. Payout of 15,000 BDT ready for Tanvir Anam (CW2602001).',
    timestamp: 'Yesterday',
    type: 'payment',
    priority: 'medium',
    isRead: true,
    targetTab: 'payments',
  },
];
