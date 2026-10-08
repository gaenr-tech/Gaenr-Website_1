import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useBranding } from '../../context/BrandingContext';
import { GaenrLogo } from '../../components/common/GaenrLogo';
import { SERVICE_CATEGORIES } from '../../data/mockData';
import {
  FreelancerProfile,
  ServiceCategory,
  AvatarAsset,
} from '../../types';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  FolderKanban,
  Layers,
  Tag,
  Image as ImageIcon,
  Building2,
  SlidersHorizontal,
  Sliders,
  LogOut,
  ExternalLink,
  Lock,
  ArrowLeft,
  AlertCircle,
  X,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

// Import modular view components implementing the backend sitemap
import { OverviewView } from './views/OverviewView';
import { ProfilesListView } from './views/ProfilesListView';
import { ProfileCreateView } from './views/ProfileCreateView';
import { PortfolioManageView } from './views/PortfolioManageView';
import { CategoriesManageView } from './views/CategoriesManageView';
import { SkillsManageView, SkillItem } from './views/SkillsManageView';
import { DirectoryManageView } from './views/DirectoryManageView';
import { AvatarsManageView } from './views/AvatarsManageView';
import { SettingsManageView, AdminUser } from './views/SettingsManageView';
import { BrandingManageView } from './views/BrandingManageView';
import { ExpertApplicationsView } from './views/ExpertApplicationsView';
import { FeedbackResponsesView } from './views/FeedbackResponsesView';
import { TaskAssignmentsView } from './views/TaskAssignmentsView';
import { MessageSquare, UserCheck } from 'lucide-react';

type SitemapTab =
  | 'dashboard'
  | 'profiles'
  | 'profiles_new'
  | 'portfolio'
  | 'categories'
  | 'skills'
  | 'directory'
  | 'avatars'
  | 'settings'
  | 'branding'
  | 'tasks'
  | 'applications'
  | 'feedbacks';

export const AdminDashboard: React.FC = () => {
  const {
    currentRoute,
    isAdminLoggedIn,
    currentEmployee,
    loginOperations,
    logoutOperations,
    freelancers,
    addFreelancer,
    updateFreelancer,
    deleteFreelancer,
    toggleFreelancerVisibility,
    avatars,
    addAvatar,
    deleteAvatar,
    categories: categoriesList,
    updateCategories: handleUpdateCategories,
    taskAssignments,
    updateTaskStatus,
    updateTaskAssignment,
    deleteTaskAssignment,
    expertApplications,
    deleteExpertApplication,
    updateExpertApplicationStatus,
    feedbacks,
    deleteFeedback,
    navigate,
    showToast,
  } = useApp();

  const { branding, updateBranding, resetBranding } = useBranding();

  // Helper to map route to tab
  const getTabFromRoute = (route: string): SitemapTab => {
    const clean = route.split('#')[0].split('?')[0];
    if (clean === '/manage/profiles/new') return 'profiles_new';
    if (clean === '/manage/profiles' || clean === '/manage/portfolio') return 'profiles';
    if (clean === '/manage/categories') return 'categories';
    if (clean === '/manage/skills') return 'skills';
    if (clean === '/manage/directory') return 'directory';
    if (clean === '/manage/avatars') return 'avatars';
    if (clean === '/manage/settings') return 'settings';
    if (clean === '/manage/branding') return 'branding';
    if (clean === '/manage/tasks') return 'tasks';
    if (clean === '/manage/applications') return 'applications';
    if (clean === '/manage/feedbacks') return 'feedbacks';
    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState<SitemapTab>(() => getTabFromRoute(currentRoute));
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Sync activeTab when currentRoute changes
  useEffect(() => {
    const matched = getTabFromRoute(currentRoute);
    setActiveTab(matched);
  }, [currentRoute]);

  // Navigate helper that updates route and active tab
  const handleNavigateTab = (tab: SitemapTab) => {
    setActiveTab(tab);
    setMobileNavOpen(false);
    switch (tab) {
      case 'dashboard':
        navigate('/admin');
        break;
      case 'profiles':
        navigate('/manage/profiles');
        break;
      case 'profiles_new':
        navigate('/manage/profiles/new');
        break;
      case 'portfolio':
        navigate('/manage/portfolio');
        break;
      case 'categories':
        navigate('/manage/categories');
        break;
      case 'skills':
        navigate('/manage/skills');
        break;
      case 'directory':
        navigate('/manage/directory');
        break;
      case 'avatars':
        navigate('/manage/avatars');
        break;
      case 'settings':
        navigate('/manage/settings');
        break;
      case 'branding':
        navigate('/manage/branding');
        break;
      case 'tasks':
        navigate('/manage/tasks');
        break;
      case 'applications':
        navigate('/manage/applications');
        break;
      case 'feedbacks':
        navigate('/manage/feedbacks');
        break;
      default:
        navigate('/admin');
    }
  };

  // State: Pre-selected code for portfolio management
  const [selectedPortfolioCode, setSelectedPortfolioCode] = useState<string>('');

  // State: Skills library (Comprehensive multi-category skills catalog)
  const [skillsList, setSkillsList] = useState<SkillItem[]>(() => {
    const DEFAULT_EXPANDED_SKILLS: SkillItem[] = [
      // Graphics Design
      { id: 'sk-gd-1', name: 'Brand Identity & Guidelines', category: 'Graphics Design', count: 24 },
      { id: 'sk-gd-2', name: 'Logo Design & Monograms', category: 'Graphics Design', count: 28 },
      { id: 'sk-gd-3', name: 'Adobe Photoshop Manipulation', category: 'Graphics Design', count: 22 },
      { id: 'sk-gd-4', name: 'Adobe Illustrator Vector Art', category: 'Graphics Design', count: 26 },
      { id: 'sk-gd-5', name: 'Packaging & Die-cut Design', category: 'Graphics Design', count: 14 },
      { id: 'sk-gd-6', name: 'Social Media Banner Ad Creatives', category: 'Graphics Design', count: 20 },
      { id: 'sk-gd-7', name: 'Print & Corporate Stationery', category: 'Graphics Design', count: 12 },
      { id: 'sk-gd-8', name: 'Typography & Bengali Lettering', category: 'Graphics Design', count: 15 },
      { id: 'sk-gd-9', name: 'T-Shirt & Apparel Merch Design', category: 'Graphics Design', count: 10 },
      { id: 'sk-gd-10', name: 'Brochure & Editorial Catalog', category: 'Graphics Design', count: 9 },
      { id: 'sk-gd-11', name: 'Vector Iconography & Mascot Design', category: 'Graphics Design', count: 16 },
      { id: 'sk-gd-12', name: 'Billboard & Large Format Print Design', category: 'Graphics Design', count: 11 },

      // Content Writing & Copywriting
      { id: 'sk-cw-1', name: 'SEO Long-form Article Writing', category: 'Content Writing & Copywriting', count: 25 },
      { id: 'sk-cw-2', name: 'High-Conversion Sales Copywriting', category: 'Content Writing & Copywriting', count: 19 },
      { id: 'sk-cw-3', name: 'Technical & API Documentation', category: 'Content Writing & Copywriting', count: 11 },
      { id: 'sk-cw-4', name: 'Website UX Copy & Microcopy', category: 'Content Writing & Copywriting', count: 14 },
      { id: 'sk-cw-5', name: 'YouTube Scriptwriting & Storyboarding', category: 'Content Writing & Copywriting', count: 13 },
      { id: 'sk-cw-6', name: 'Proofreading & Editorial Line Editing', category: 'Content Writing & Copywriting', count: 16 },
      { id: 'sk-cw-7', name: 'E-commerce Product Descriptions', category: 'Content Writing & Copywriting', count: 18 },
      { id: 'sk-cw-8', name: 'Email Marketing & Newsletters', category: 'Content Writing & Copywriting', count: 15 },
      { id: 'sk-cw-9', name: 'Press Releases & Media Statements', category: 'Content Writing & Copywriting', count: 8 },
      { id: 'sk-cw-10', name: 'Case Studies & Success Stories', category: 'Content Writing & Copywriting', count: 10 },
      { id: 'sk-cw-11', name: 'Social Media Captions & Hook Writing', category: 'Content Writing & Copywriting', count: 22 },
      { id: 'sk-cw-12', name: 'Company Profile & Brand Storytelling', category: 'Content Writing & Copywriting', count: 17 },

      // Video Editing
      { id: 'sk-ve-1', name: 'Adobe Premiere Pro Video Editing', category: 'Video Editing', count: 21 },
      { id: 'sk-ve-2', name: 'After Effects VFX & Compositing', category: 'Video Editing', count: 17 },
      { id: 'sk-ve-3', name: 'DaVinci Resolve Cinematic Color Grading', category: 'Video Editing', count: 14 },
      { id: 'sk-ve-4', name: 'YouTube Long-form Retentive Cuts', category: 'Video Editing', count: 19 },
      { id: 'sk-ve-5', name: 'Reels, TikTok & Shorts Vertical Video', category: 'Video Editing', count: 24 },
      { id: 'sk-ve-6', name: 'Dynamic Kinetic Typography & Titles', category: 'Video Editing', count: 15 },
      { id: 'sk-ve-7', name: 'Sound Design & Audio Mastering', category: 'Video Editing', count: 16 },
      { id: 'sk-ve-8', name: 'Podcast Multicam Video Editing', category: 'Video Editing', count: 12 },
      { id: 'sk-ve-9', name: 'Automated Subtitles & Visual Hooks', category: 'Video Editing', count: 18 },
      { id: 'sk-ve-10', name: '2D Explainer Video Animation', category: 'Video Editing', count: 11 },
      { id: 'sk-ve-11', name: 'Green Screen Keying & Background Removal', category: 'Video Editing', count: 13 },
      { id: 'sk-ve-12', name: 'Corporate Promo & Commercial Editing', category: 'Video Editing', count: 15 },

      // WordPress Website Design
      { id: 'sk-wp-1', name: 'WordPress Custom Theme Development', category: 'WordPress Website Design', count: 20 },
      { id: 'sk-wp-2', name: 'Elementor Pro Responsive Page Building', category: 'WordPress Website Design', count: 23 },
      { id: 'sk-wp-3', name: 'WooCommerce Online Store Setup', category: 'WordPress Website Design', count: 18 },
      { id: 'sk-wp-4', name: 'PageSpeed & Core Web Vitals Optimization', category: 'WordPress Website Design', count: 17 },
      { id: 'sk-wp-5', name: 'bKash, Nagad & SSLCommerz Gateway Integration', category: 'WordPress Website Design', count: 21 },
      { id: 'sk-wp-6', name: 'Responsive Mobile-First UI Layouts', category: 'WordPress Website Design', count: 22 },
      { id: 'sk-wp-7', name: 'Custom CSS, JavaScript & Tailwind Styling', category: 'WordPress Website Design', count: 15 },
      { id: 'sk-wp-8', name: 'Security Hardening & Malware Cleanup', category: 'WordPress Website Design', count: 12 },
      { id: 'sk-wp-9', name: 'Lead Capture Forms & CRM Integration', category: 'WordPress Website Design', count: 13 },
      { id: 'sk-wp-10', name: 'Database Migration & Staging Setup', category: 'WordPress Website Design', count: 14 },
      { id: 'sk-wp-11', name: 'Yoast & RankMath Technical SEO Setup', category: 'WordPress Website Design', count: 16 },
      { id: 'sk-wp-12', name: 'Custom Post Types & Advanced Custom Fields (ACF)', category: 'WordPress Website Design', count: 14 },

      // Presentation Slide Design
      { id: 'sk-sd-1', name: 'Investor Pitch Decks (Seed & Series A)', category: 'Presentation Slide Design', count: 22 },
      { id: 'sk-sd-2', name: 'PowerPoint (PPTX) Master Theme Templates', category: 'Presentation Slide Design', count: 24 },
      { id: 'sk-sd-3', name: 'Google Slides Cloud Collaboration Decks', category: 'Presentation Slide Design', count: 19 },
      { id: 'sk-sd-4', name: 'Apple Keynote Executive Presentations', category: 'Presentation Slide Design', count: 16 },
      { id: 'sk-sd-5', name: 'Infographics, Financial Charts & Data Visuals', category: 'Presentation Slide Design', count: 18 },
      { id: 'sk-sd-6', name: 'Corporate Boardroom Annual Reports', category: 'Presentation Slide Design', count: 14 },
      { id: 'sk-sd-7', name: 'Slide Redesign & Visual Pacing Cleanup', category: 'Presentation Slide Design', count: 20 },
      { id: 'sk-sd-8', name: 'Academic, Keynote & Conference Slides', category: 'Presentation Slide Design', count: 11 },
      { id: 'sk-sd-9', name: 'Sales Proposal & Capability Pitch Decks', category: 'Presentation Slide Design', count: 15 },
      { id: 'sk-sd-10', name: 'Animated Transition & Clickable Slide Decks', category: 'Presentation Slide Design', count: 13 },

      // UX / UI Design
      { id: 'sk-ux-1', name: 'Figma Auto-Layout & Design Systems', category: 'UX / UI Design', count: 25 },
      { id: 'sk-ux-2', name: 'Mobile App UI Design (iOS & Android)', category: 'UX / UI Design', count: 23 },
      { id: 'sk-ux-3', name: 'Web Dashboard & SaaS Product Interfaces', category: 'UX / UI Design', count: 21 },
      { id: 'sk-ux-4', name: 'Interactive Clickable Prototyping', category: 'UX / UI Design', count: 19 },
      { id: 'sk-ux-5', name: 'Wireframing & Information Architecture', category: 'UX / UI Design', count: 16 },
      { id: 'sk-ux-6', name: 'User Journey Mapping & User Personas', category: 'UX / UI Design', count: 14 },
      { id: 'sk-ux-7', name: 'Developer Handoff Specs & Design Tokens', category: 'UX / UI Design', count: 17 },
      { id: 'sk-ux-8', name: 'Usability Testing & Accessibility (WCAG)', category: 'UX / UI Design', count: 12 },
      { id: 'sk-ux-9', name: 'Micro-interactions & Component Variants', category: 'UX / UI Design', count: 15 },
      { id: 'sk-ux-10', name: 'Heuristic UX Usability Audits', category: 'UX / UI Design', count: 14 },

      // Ad Running & Campaign Setup
      { id: 'sk-ad-1', name: 'Meta (Facebook & Instagram) Ads Setup', category: 'Ad Running & Campaign Setup', count: 22 },
      { id: 'sk-ad-2', name: 'Google Search, Display & YouTube Ads', category: 'Ad Running & Campaign Setup', count: 18 },
      { id: 'sk-ad-3', name: 'TikTok Ads Manager Campaigns', category: 'Ad Running & Campaign Setup', count: 15 },
      { id: 'sk-ad-4', name: 'Meta Pixel & Conversion API (CAPI) Tracking', category: 'Ad Running & Campaign Setup', count: 17 },
      { id: 'sk-ad-5', name: 'Campaign Budget Optimization (CBO) Strategy', category: 'Ad Running & Campaign Setup', count: 16 },
      { id: 'sk-ad-6', name: 'A/B Creative & Headline Split Testing', category: 'Ad Running & Campaign Setup', count: 14 },
      { id: 'sk-ad-7', name: 'Audience Retargeting & Lookalike Modeling', category: 'Ad Running & Campaign Setup', count: 19 },
      { id: 'sk-ad-8', name: 'E-commerce ROAS & Lead Cost Optimization', category: 'Ad Running & Campaign Setup', count: 20 },
      { id: 'sk-ad-9', name: 'Google Analytics 4 (GA4) & Tag Manager (GTM)', category: 'Ad Running & Campaign Setup', count: 16 },
      { id: 'sk-ad-10', name: 'Local Audience Targeting in Bangladesh', category: 'Ad Running & Campaign Setup', count: 18 },
    ];

    const normalizeSkillCategory = (cat: string): string => {
      const c = (cat || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      if (c.includes('graphic')) return 'Graphics Design';
      if (c.includes('content') || c.includes('writing') || c.includes('copywriting')) return 'Content Writing & Copywriting';
      if (c.includes('video') || c.includes('motion')) return 'Video Editing';
      if (c.includes('wordpress')) return 'WordPress Website Design';
      if (c.includes('presentation') || c.includes('slide')) return 'Presentation Slide Design';
      if (c.includes('ux') || c.includes('ui')) return 'UX / UI Design';
      if (c.includes('ad') || c.includes('campaign') || c.includes('buying')) return 'Ad Running & Campaign Setup';
      return cat;
    };

    try {
      const saved = localStorage.getItem('gaenr_skills');
      if (saved) {
        const parsed: SkillItem[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Normalize existing categories and ensure all default skills are present
          const normalizedExisting = parsed.map((s) => ({
            ...s,
            category: normalizeSkillCategory(s.category),
          }));

          const existingNames = new Set(normalizedExisting.map((s) => s.name?.toLowerCase()));
          const missingDefaults = DEFAULT_EXPANDED_SKILLS.filter(
            (s) => !existingNames.has(s.name.toLowerCase())
          );

          const fullList = [...normalizedExisting, ...missingDefaults];
          try {
            localStorage.setItem('gaenr_skills', JSON.stringify(fullList));
          } catch {}
          return fullList;
        }
      }
    } catch {}

    try {
      localStorage.setItem('gaenr_skills', JSON.stringify(DEFAULT_EXPANDED_SKILLS));
    } catch {}
    return DEFAULT_EXPANDED_SKILLS;
  });

  const handleUpdateSkills = (newSkills: SkillItem[]) => {
    setSkillsList(newSkills);
    try {
      localStorage.setItem('gaenr_skills', JSON.stringify(newSkills));
    } catch {}
  };

  // State: Secondary Admins for /manage/settings
  const [adminsList, setAdminsList] = useState<AdminUser[]>(() => {
    try {
      const saved = localStorage.getItem('gaenr_admins');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'ADM-001',
        username: 'operations',
        name: 'Gaenr Operations',
        email: 'operations@gaenr.com',
        role: 'Master Admin',
        status: 'Active',
        createdAt: '2024-01-01',
      },
      {
        id: 'ADM-002',
        username: 'tanvir.ops',
        name: 'Tanvir Ahmed',
        email: 'tanvir@gaenr.com',
        role: 'Secondary Admin',
        status: 'Active',
        createdAt: '2024-02-15',
      },
    ];
  });

  const handleUpdateAdmins = (newAdmins: AdminUser[]) => {
    setAdminsList(newAdmins);
    try {
      localStorage.setItem('gaenr_admins', JSON.stringify(newAdmins));
    } catch {}
  };

  // State: Update single freelancer (e.g. portfolio media updates)
  const handleUpdateFreelancer = (updated: FreelancerProfile) => {
    const list = freelancers.map((f) => (f.code === updated.code ? updated : f));
    try {
      localStorage.setItem('gaenr_freelancers', JSON.stringify(list));
    } catch {}
    // Trigger window storage event or reload state
    window.dispatchEvent(new Event('storage'));
  };

  // Login form state — starts empty, never pre-filled
  const [loginInput, setLoginInput] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // -------------------------------------------------------------
  // Unauthenticated: Operations Login
  // -------------------------------------------------------------
  if (!isAdminLoggedIn || !currentEmployee) {
    const handleLoginSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const u = loginInput.trim().toLowerCase();
      const p = loginPassword.trim();
      if (u === 'operations' && p === '123456') {
        setLoginError('');
        loginOperations('operations');
      } else {
        setLoginError('Incorrect username or password. Please try again.');
      }
    };

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 selection:bg-[#006eff] selection:text-white relative">
        {/* Soft Ambient Glows */}
        <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="fixed bottom-10 right-1/4 w-80 h-80 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Return to Public Button */}
        <div className="w-full max-w-md flex justify-start mb-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-blue-50 border border-slate-200/90 hover:border-blue-200 text-slate-600 hover:text-[#006eff] text-xs font-semibold transition-all cursor-pointer shadow-2xs group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 text-[#006eff]" />
            <span>Return to Public gaenr.com</span>
          </button>
        </div>

        {/* Whitish Login Card */}
        <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_12px_45px_rgba(0,110,255,0.06)] space-y-6 text-left">
          <div className="text-center space-y-2">
            <div className="pt-1 flex justify-center">
              <GaenrLogo className="h-7 text-slate-900" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Gaenr Operations Gateway
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
              Authorized internal control center. Private access for Gaenr operations.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {loginError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={loginInput}
                onChange={(e) => {
                  setLoginInput(e.target.value);
                  setLoginError('');
                }}
                placeholder="Enter username"
                autoComplete="off"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#006eff] rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => {
                  setLoginPassword(e.target.value);
                  setLoginError('');
                }}
                placeholder="Enter password"
                autoComplete="new-password"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#006eff] rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#006eff] hover:bg-[#005cd4] active:bg-[#0052be] text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-blue-500/20 cursor-pointer flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Enter Operations Gateway</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Active section title lookup
  const getSectionTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard Overview';
      case 'profiles':
        return 'Expert Management';
      case 'profiles_new':
        return 'Create Expert Profile';
      case 'portfolio':
        return 'Portfolio Management';
      case 'categories':
        return 'Service Categories';
      case 'skills':
        return 'Skills Library';
      case 'directory':
        return 'Internal Directory';
      case 'avatars':
        return 'Avatar Library';
      case 'settings':
        return 'Admin Settings';
      case 'branding':
        return 'Branding Settings';
      case 'applications':
        return 'Become an Expert Responses';
      case 'feedbacks':
        return 'Feedback Form Responses';
      default:
        return 'Gaenr Operations';
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 overflow-hidden font-sans">
      {/* ------------------------------------------------------------- */}
      {/* MOBILE DRAWER NAVIGATION (< md screens)                        */}
      {/* ------------------------------------------------------------- */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {/* Drawer Brand Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {branding.logoUrl && branding.logoUrl !== '/logo.svg' ? (
                  <img
                    src={branding.logoUrl}
                    alt={branding.siteTitle}
                    className="w-8 h-8 object-contain rounded-lg shadow-2xs"
                  />
                ) : (
                  <GaenrLogo size={28} />
                )}
                <div>
                  <div className="text-xs font-black tracking-wider uppercase text-slate-900 flex items-center gap-1.5">
                    <span>{branding.siteTitle || 'Gaenr'}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-50 text-[#006eff] border border-blue-200/60 font-mono font-bold">
                      OPS
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">Control Center v2.4</div>
                </div>
              </div>
              <button
                onClick={() => setMobileNavOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-4">
              <div>
                <button
                  onClick={() => handleNavigateTab('dashboard')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'dashboard'
                      ? 'bg-[#006eff] text-white shadow-sm shadow-blue-500/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  <span>Overview</span>
                </button>
              </div>

              <div className="space-y-1">
                <div className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-1">
                  EXPERTS &amp; TALENT
                </div>
                <button
                  onClick={() => handleNavigateTab('profiles')}
                  className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'profiles'
                      ? 'bg-blue-50 text-[#006eff] border border-blue-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Users className="w-4 h-4 shrink-0" />
                  <span>Expert Management</span>
                  <span className="ml-auto text-[10px] font-mono text-slate-400">{freelancers.length}</span>
                </button>
                <button
                  onClick={() => handleNavigateTab('profiles_new')}
                  className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'profiles_new'
                      ? 'bg-blue-50 text-[#006eff] border border-blue-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <UserPlus className="w-4 h-4 shrink-0" />
                  <span>Create Expert Profile</span>
                </button>
                <button
                  onClick={() => handleNavigateTab('directory')}
                  className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'directory'
                      ? 'bg-blue-50 text-[#006eff] border border-blue-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Building2 className="w-4 h-4 shrink-0" />
                  <span>Internal Directory</span>
                </button>
              </div>

              <div className="space-y-1">
                <div className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-1">
                  PLATFORM CATALOG
                </div>
                <button
                  onClick={() => handleNavigateTab('categories')}
                  className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'categories'
                      ? 'bg-blue-50 text-[#006eff] border border-blue-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Layers className="w-4 h-4 shrink-0" />
                  <span>Service Categories</span>
                  <span className="ml-auto text-[10px] font-mono text-slate-400">{categoriesList.length}</span>
                </button>
                <button
                  onClick={() => handleNavigateTab('skills')}
                  className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'skills'
                      ? 'bg-blue-50 text-[#006eff] border border-blue-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Tag className="w-4 h-4 shrink-0" />
                  <span>Skills Library</span>
                  <span className="ml-auto text-[10px] font-mono text-slate-400">{skillsList.length}</span>
                </button>
              </div>

              <div className="space-y-1">
                <div className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-1">
                  RESPONSES &amp; INBOX
                </div>
                <button
                  onClick={() => handleNavigateTab('tasks')}
                  className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'tasks'
                      ? 'bg-blue-50 text-[#006eff] border border-blue-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <FolderKanban className="w-4 h-4 shrink-0" />
                  <span>Assigned Tasks</span>
                  <span className="ml-auto text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-[#006eff]">
                    {taskAssignments.length}
                  </span>
                </button>
                <button
                  onClick={() => handleNavigateTab('applications')}
                  className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'applications'
                      ? 'bg-blue-50 text-[#006eff] border border-blue-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <UserCheck className="w-4 h-4 shrink-0" />
                  <span>Become an Expert</span>
                  <span className="ml-auto text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-[#006eff]">
                    {expertApplications.length}
                  </span>
                </button>
                <button
                  onClick={() => handleNavigateTab('feedbacks')}
                  className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'feedbacks'
                      ? 'bg-blue-50 text-[#006eff] border border-blue-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span>Feedback Forms</span>
                  <span className="ml-auto text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-[#006eff]">
                    {feedbacks.length}
                  </span>
                </button>
              </div>

              <div className="space-y-1 pb-4">
                <div className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-1">
                  SYSTEM
                </div>
                <button
                  onClick={() => handleNavigateTab('settings')}
                  className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'settings'
                      ? 'bg-blue-50 text-[#006eff] border border-blue-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4 shrink-0" />
                  <span>Admin Settings</span>
                </button>
                <button
                  onClick={() => handleNavigateTab('branding')}
                  className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'branding'
                      ? 'bg-blue-50 text-[#006eff] border border-blue-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Sliders className="w-4 h-4 shrink-0" />
                  <span>Branding Settings</span>
                </button>
              </div>
            </nav>

            {/* Mobile Footer */}
            <div className="p-3.5 border-t border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#006eff] flex items-center justify-center p-1.5 shadow-xs overflow-hidden shrink-0">
                  {branding.logoUrl && branding.logoUrl !== '/logo.svg' ? (
                    <img src={branding.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <GaenrLogo size={20} variant="white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">Gaenr Operations</div>
                  <div className="text-[10px] text-slate-500 truncate font-mono">{currentEmployee.id}</div>
                </div>
                <button
                  onClick={logoutOperations}
                  title="Sign Out"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SIDEBAR NAVIGATION (COLLAPSIBLE DESKTOP)                       */}
      {/* ------------------------------------------------------------- */}
      <aside
        className={`hidden md:flex ${
          sidebarCollapsed ? 'md:w-16' : 'md:w-64'
        } bg-white border-r border-slate-200/90 flex-col shrink-0 shadow-xs transition-all duration-200`}
      >
        {/* Brand Header */}
        <div
          className={`p-3.5 border-b border-slate-100 flex items-center ${
            sidebarCollapsed ? 'justify-center flex-col gap-2' : 'justify-between'
          }`}
        >
          {!sidebarCollapsed ? (
            <>
              <div className="flex items-center gap-2.5 min-w-0">
                {branding.logoUrl && branding.logoUrl !== '/logo.svg' ? (
                  <img
                    src={branding.logoUrl}
                    alt={branding.siteTitle}
                    className="w-8 h-8 object-contain rounded-lg shadow-2xs"
                  />
                ) : (
                  <GaenrLogo size={28} />
                )}
                <div className="min-w-0">
                  <div className="text-xs font-black tracking-wider uppercase text-slate-900 flex items-center gap-1.5">
                    <span className="truncate">{branding.siteTitle || 'Gaenr'}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-50 text-[#006eff] border border-blue-200/60 font-mono font-bold shrink-0">
                      OPS
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">Control Center</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSidebarCollapsed(true)}
                title="Collapse sidebar to icon-only"
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2.5">
              <button
                type="button"
                onClick={() => setSidebarCollapsed(false)}
                title="Expand sidebar"
                className="p-1.5 text-slate-400 hover:text-[#006eff] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
              >
                <PanelLeftOpen className="w-4 h-4" />
              </button>
              {branding.logoUrl && branding.logoUrl !== '/logo.svg' ? (
                <img
                  src={branding.logoUrl}
                  alt={branding.siteTitle}
                  className="w-7 h-7 object-contain rounded-lg"
                />
              ) : (
                <GaenrLogo size={24} />
              )}
            </div>
          )}
        </div>

        {/* Sidebar Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-4 scrollbar-thin scrollbar-thumb-slate-200">
          {/* Section: OVERVIEW */}
          <div>
            <button
              onClick={() => handleNavigateTab('dashboard')}
              title="Overview"
              className={`w-full flex items-center ${
                sidebarCollapsed ? 'justify-center p-2.5 rounded-xl' : 'gap-3 px-3 py-2 rounded-xl text-xs font-semibold'
              } transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#006eff] text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Overview</span>}
            </button>
          </div>

          {/* Section: EXPERT MANAGEMENT */}
          <div className="space-y-1">
            {!sidebarCollapsed ? (
              <div className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-1">
                EXPERTS &amp; TALENT
              </div>
            ) : (
              <div className="h-px bg-slate-100 my-2 mx-1" />
            )}

            {/* /manage/profiles */}
            <button
              onClick={() => handleNavigateTab('profiles')}
              title="Expert Management"
              className={`w-full flex items-center ${
                sidebarCollapsed ? 'justify-center p-2.5 rounded-xl' : 'gap-3 px-3 py-1.5 rounded-lg text-xs font-medium'
              } transition-colors cursor-pointer ${
                activeTab === 'profiles'
                  ? 'bg-blue-50 text-[#006eff] border border-blue-200/80 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && (
                <>
                  <span className="truncate">Expert Management</span>
                  <span className="ml-auto text-[10px] font-mono text-slate-400">
                    {freelancers.length}
                  </span>
                </>
              )}
            </button>

            {/* /manage/profiles/new */}
            <button
              onClick={() => handleNavigateTab('profiles_new')}
              title="Create Expert Profile"
              className={`w-full flex items-center ${
                sidebarCollapsed ? 'justify-center p-2.5 rounded-xl' : 'gap-3 px-3 py-1.5 rounded-lg text-xs font-medium'
              } transition-colors cursor-pointer ${
                activeTab === 'profiles_new'
                  ? 'bg-blue-50 text-[#006eff] border border-blue-200/80 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <UserPlus className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span className="truncate">Create Expert Profile</span>}
            </button>

            {/* /manage/directory */}
            <button
              onClick={() => handleNavigateTab('directory')}
              title="Internal Directory"
              className={`w-full flex items-center ${
                sidebarCollapsed ? 'justify-center p-2.5 rounded-xl' : 'gap-3 px-3 py-1.5 rounded-lg text-xs font-medium'
              } transition-colors cursor-pointer ${
                activeTab === 'directory'
                  ? 'bg-blue-50 text-[#006eff] border border-blue-200/80 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Building2 className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span className="truncate">Internal Directory</span>}
            </button>
          </div>

          {/* Section: TAXONOMY & MEDIA */}
          <div className="space-y-1">
            {!sidebarCollapsed ? (
              <div className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-1">
                TAXONOMY &amp; ASSETS
              </div>
            ) : (
              <div className="h-px bg-slate-100 my-2 mx-1" />
            )}

            {/* /manage/categories */}
            <button
              onClick={() => handleNavigateTab('categories')}
              title="Service Categories"
              className={`w-full flex items-center ${
                sidebarCollapsed ? 'justify-center p-2.5 rounded-xl' : 'gap-3 px-3 py-1.5 rounded-lg text-xs font-medium'
              } transition-colors cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-blue-50 text-[#006eff] border border-blue-200/80 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Layers className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && (
                <>
                  <span className="truncate">Service Categories</span>
                  <span className="ml-auto text-[10px] font-mono text-slate-400">
                    {categoriesList.length}
                  </span>
                </>
              )}
            </button>

            {/* /manage/skills */}
            <button
              onClick={() => handleNavigateTab('skills')}
              title="Skills Library"
              className={`w-full flex items-center ${
                sidebarCollapsed ? 'justify-center p-2.5 rounded-xl' : 'gap-3 px-3 py-1.5 rounded-lg text-xs font-medium'
              } transition-colors cursor-pointer ${
                activeTab === 'skills'
                  ? 'bg-blue-50 text-[#006eff] border border-blue-200/80 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Tag className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && (
                <>
                  <span className="truncate">Skills Library</span>
                  <span className="ml-auto text-[10px] font-mono text-slate-400">
                    {skillsList.length}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Section: FORM RESPONSES & INBOX */}
          <div className="space-y-1">
            {!sidebarCollapsed ? (
              <div className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-1">
                RESPONSES &amp; INBOX
              </div>
            ) : (
              <div className="h-px bg-slate-100 my-2 mx-1" />
            )}

            {/* /manage/tasks */}
            <button
              onClick={() => handleNavigateTab('tasks')}
              title="Assigned Tasks & Client Orders"
              className={`w-full flex items-center ${
                sidebarCollapsed ? 'justify-center p-2.5 rounded-xl' : 'gap-3 px-3 py-1.5 rounded-lg text-xs font-medium'
              } transition-colors cursor-pointer ${
                activeTab === 'tasks'
                  ? 'bg-blue-50 text-[#006eff] border border-blue-200/80 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <FolderKanban className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && (
                <>
                  <span className="truncate">Assigned Tasks</span>
                  <span className="ml-auto text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-[#006eff]">
                    {taskAssignments.length}
                  </span>
                </>
              )}
            </button>

            {/* /manage/applications */}
            <button
              onClick={() => handleNavigateTab('applications')}
              title="Become an Expert Responses"
              className={`w-full flex items-center ${
                sidebarCollapsed ? 'justify-center p-2.5 rounded-xl' : 'gap-3 px-3 py-1.5 rounded-lg text-xs font-medium'
              } transition-colors cursor-pointer ${
                activeTab === 'applications'
                  ? 'bg-blue-50 text-[#006eff] border border-blue-200/80 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <UserCheck className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && (
                <>
                  <span className="truncate">Become an Expert</span>
                  <span className="ml-auto text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-[#006eff]">
                    {expertApplications.length}
                  </span>
                </>
              )}
            </button>

            {/* /manage/feedbacks */}
            <button
              onClick={() => handleNavigateTab('feedbacks')}
              title="Feedback Form Responses"
              className={`w-full flex items-center ${
                sidebarCollapsed ? 'justify-center p-2.5 rounded-xl' : 'gap-3 px-3 py-1.5 rounded-lg text-xs font-medium'
              } transition-colors cursor-pointer ${
                activeTab === 'feedbacks'
                  ? 'bg-blue-50 text-[#006eff] border border-blue-200/80 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && (
                <>
                  <span className="truncate">Feedback Forms</span>
                  <span className="ml-auto text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-[#006eff]">
                    {feedbacks.length}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Section: SYSTEM */}
          <div className="space-y-1 pb-4">
            {!sidebarCollapsed ? (
              <div className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-1">
                SYSTEM
              </div>
            ) : (
              <div className="h-px bg-slate-100 my-2 mx-1" />
            )}

            {/* /manage/settings */}
            <button
              onClick={() => handleNavigateTab('settings')}
              title="Admin Settings"
              className={`w-full flex items-center ${
                sidebarCollapsed ? 'justify-center p-2.5 rounded-xl' : 'gap-3 px-3 py-1.5 rounded-lg text-xs font-medium'
              } transition-colors cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-blue-50 text-[#006eff] border border-blue-200/80 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span className="truncate">Admin Settings</span>}
            </button>

            {/* /manage/branding */}
            <button
              onClick={() => handleNavigateTab('branding')}
              title="Branding Settings"
              className={`w-full flex items-center ${
                sidebarCollapsed ? 'justify-center p-2.5 rounded-xl' : 'gap-3 px-3 py-1.5 rounded-lg text-xs font-medium'
              } transition-colors cursor-pointer ${
                activeTab === 'branding'
                  ? 'bg-blue-50 text-[#006eff] border border-blue-200/80 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Sliders className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span className="truncate">Branding Settings</span>}
            </button>
          </div>
        </nav>

        {/* User Card & Sign Out */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/70">
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#006eff] flex items-center justify-center p-1.5 shadow-xs overflow-hidden shrink-0">
                {branding.logoUrl && branding.logoUrl !== '/logo.svg' ? (
                  <img src={branding.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <GaenrLogo size={20} variant="white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">
                  Gaenr Operations
                </div>
                <div className="text-[10px] text-slate-500 truncate font-mono">
                  {currentEmployee.id}
                </div>
              </div>
              <button
                onClick={logoutOperations}
                title="Sign Out of Operations"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#006eff] flex items-center justify-center p-1.5 shadow-xs overflow-hidden shrink-0">
                {branding.logoUrl && branding.logoUrl !== '/logo.svg' ? (
                  <img src={branding.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <GaenrLogo size={18} variant="white" />
                )}
              </div>
              <button
                onClick={logoutOperations}
                title="Sign Out"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* MAIN CONTENT AREA                                             */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#f8fafc]">
        {/* Top Header Bar */}
        <header className="h-14 bg-white border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="md:hidden p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-bold text-slate-900 capitalize tracking-wide truncate max-w-[200px] sm:max-w-none">
              {getSectionTitle()}
            </h2>
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/70 text-[10px] font-mono text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>ONLINE</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Account badge */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono">
              <span className="text-slate-500">Account:</span>
              <span className="text-[#006eff] font-bold">Gaenr Operations</span>
            </div>

            {/* Direct View Public Site Action */}
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#006eff] border border-slate-200 hover:border-blue-200 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
              title="View Public Site"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#006eff]" />
              <span>View Public Site</span>
            </button>
          </div>
        </header>

        {/* View Content Body: Renders exact sitemap component */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#f8fafc] scrollbar-thin scrollbar-thumb-slate-300">
          {activeTab === 'dashboard' && (
            <OverviewView
              freelancers={freelancers}
              categories={categoriesList}
              navigate={navigate}
            />
          )}

          {activeTab === 'profiles' && (
            <ProfilesListView
              freelancers={freelancers}
              toggleFreelancerVisibility={toggleFreelancerVisibility}
              navigate={navigate}
              onSelectPortfolioProfile={(code) => setSelectedPortfolioCode(code)}
              categories={categoriesList}
              avatars={avatars}
              onUpdateFreelancer={updateFreelancer}
              onDeleteFreelancer={deleteFreelancer}
              showToast={showToast}
            />
          )}

          {activeTab === 'profiles_new' && (
            <ProfileCreateView
              categories={categoriesList}
              avatars={avatars}
              addFreelancer={addFreelancer}
              navigate={navigate}
              showToast={showToast}
              onAddAvatar={addAvatar}
            />
          )}

          {activeTab === 'portfolio' && (
            <PortfolioManageView
              freelancers={freelancers}
              selectedCode={selectedPortfolioCode}
              onUpdateFreelancer={handleUpdateFreelancer}
              showToast={showToast}
              navigate={navigate}
            />
          )}

          {activeTab === 'categories' && (
            <CategoriesManageView
              categories={categoriesList}
              onUpdateCategories={handleUpdateCategories}
              showToast={showToast}
            />
          )}

          {activeTab === 'skills' && (
            <SkillsManageView
              categories={categoriesList}
              skills={skillsList}
              onUpdateSkills={handleUpdateSkills}
              showToast={showToast}
            />
          )}

          {activeTab === 'directory' && (
            <DirectoryManageView
              freelancers={freelancers}
              categories={categoriesList}
              showToast={showToast}
            />
          )}

          {activeTab === 'avatars' && (
            <AvatarsManageView
              avatars={avatars}
              freelancers={freelancers}
              onAddAvatar={addAvatar}
              onDeleteAvatar={deleteAvatar}
              showToast={showToast}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsManageView
              admins={adminsList}
              onUpdateAdmins={handleUpdateAdmins}
              showToast={showToast}
            />
          )}

          {activeTab === 'branding' && (
            <BrandingManageView
              branding={branding}
              onUpdateBranding={updateBranding}
              onResetBranding={resetBranding}
              showToast={showToast}
            />
          )}

          {activeTab === 'tasks' && (
            <TaskAssignmentsView
              tasks={taskAssignments}
              onUpdateStatus={updateTaskStatus}
              onUpdateTask={updateTaskAssignment}
              onDeleteTask={deleteTaskAssignment}
              showToast={showToast}
            />
          )}

          {activeTab === 'applications' && (
            <ExpertApplicationsView
              applications={expertApplications}
              onDeleteApplication={deleteExpertApplication}
              onUpdateStatus={updateExpertApplicationStatus}
              showToast={showToast}
              navigate={navigate}
            />
          )}

          {activeTab === 'feedbacks' && (
            <FeedbackResponsesView
              feedbacks={feedbacks}
              onDeleteFeedback={deleteFeedback}
              showToast={showToast}
            />
          )}
        </main>
      </div>
    </div>
  );
};
