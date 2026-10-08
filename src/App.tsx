/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrandingProvider, useBranding } from './context/BrandingContext';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { AssignTaskModal } from './components/modals/AssignTaskModal';
import { ApplyExpertModal } from './components/modals/ApplyExpertModal';

import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { FreelancerDirectoryPage } from './pages/FreelancerDirectoryPage';
import { FreelancerProfilePage } from './pages/FreelancerProfilePage';
import { TestimonialsPage } from './pages/TestimonialsPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { ClientReviewPage } from './pages/ClientReviewPage';
import { JoinAsExpertPage } from './pages/JoinAsExpertPage';
import { ExpertOnboardingPage } from './pages/ExpertOnboardingPage';
import { ExpertPortfolioUploadPage } from './pages/ExpertPortfolioUploadPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/policies/PrivacyPolicyPage';
import { TermsPage } from './pages/policies/TermsPage';
import { ReturnPolicyPage } from './pages/policies/ReturnPolicyPage';
import { SupportCenterPage } from './pages/SupportCenterPage';
import { BlogsPage } from './pages/BlogsPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { GaenrChatbot } from './components/chatbot/GaenrChatbot';
import { ServiceSlug } from './types';
import { X, CheckCircle, Info, AlertTriangle } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentRoute, toasts, dismissToast, isAdminLoggedIn } = useApp();
  const { branding } = useBranding();

  // Global protection: Prevent saving, context menu, and dragging on all photos
  React.useEffect(() => {
    const isImageTarget = (target: any, e?: MouseEvent | DragEvent): boolean => {
      if (!target || typeof target.closest !== 'function') return false;
      if (
        target.tagName === 'IMG' ||
        target.tagName === 'PICTURE' ||
        target.closest('img') ||
        target.closest('picture')
      ) {
        return true;
      }
      // Check if target is an overlay or gradient layer directly sitting over an image
      if (target.parentElement) {
        const siblingImg = target.parentElement.querySelector('img');
        if (siblingImg && e && 'clientX' in e) {
          const rect = siblingImg.getBoundingClientRect();
          if (
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom
          ) {
            return true;
          }
        }
      }
      return false;
    };

    const handleContextMenu = (e: MouseEvent) => {
      if (isImageTarget(e.target as HTMLElement | null, e)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    const handleDragStart = (e: DragEvent) => {
      if (isImageTarget(e.target as HTMLElement | null, e)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    window.addEventListener('contextmenu', handleContextMenu, { capture: true });
    window.addEventListener('dragstart', handleDragStart, { capture: true });

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu, { capture: true });
      window.removeEventListener('dragstart', handleDragStart, { capture: true });
    };
  }, []);

  const renderCurrentPage = () => {
    // Normalize path by stripping query parameters and hash anchors for robust matching
    const cleanRoute = currentRoute.split('#')[0].split('?')[0];

    // Service detail route match: /services/:slug
    if (cleanRoute.startsWith('/services/')) {
      const slug = cleanRoute.replace('/services/', '') as ServiceSlug;
      return <ServiceDetailPage slug={slug} />;
    }

    // Profile route match: /experts/:code or /profile/:code
    if (cleanRoute.startsWith('/experts/')) {
      const code = cleanRoute.replace('/experts/', '');
      return <FreelancerProfilePage code={code} />;
    }
    if (cleanRoute.startsWith('/profile/')) {
      const code = cleanRoute.replace('/profile/', '');
      return <FreelancerProfilePage code={code} />;
    }

    // Expert Onboarding private route match: /expert-onboarding/:id
    if (cleanRoute.startsWith('/expert-onboarding/')) {
      const applicationId = cleanRoute.replace('/expert-onboarding/', '');
      return <ExpertOnboardingPage applicationId={applicationId} />;
    }

    // Expert Portfolio Upload portal match: /expert-portfolio-upload/:expertCode
    if (cleanRoute.startsWith('/expert-portfolio-upload/')) {
      const expertCode = cleanRoute.replace('/expert-portfolio-upload/', '');
      return <ExpertPortfolioUploadPage expertCode={expertCode} />;
    }

    // Client Review route match: /review/:expertCode
    if (cleanRoute.startsWith('/review/')) {
      const expertCode = cleanRoute.replace('/review/', '');
      return <ClientReviewPage expertCode={expertCode} />;
    }

    // Testimonials route match (with query params support)
    if (cleanRoute.startsWith('/testimonials')) {
      return <TestimonialsPage />;
    }

    switch (cleanRoute) {
      case '/about':
      case '/about-us':
      case '/about-gaenr':
        return <AboutUsPage />;
      case '/blogs':
      case '/blog':
        return <BlogsPage />;
      case '/services':
        return <ServicesPage />;
      case '/experts':
      case '/freelancers':
        return <FreelancerDirectoryPage />;
      case '/testimonials':
        return <TestimonialsPage />;
      case '/feedback':
        return <FeedbackPage />;
      case '/join-as-expert':
        return <JoinAsExpertPage />;
      case '/contact':
        return <ContactPage />;
      case '/privacy-policy':
        return <PrivacyPolicyPage />;
      case '/terms':
        return <TermsPage />;
      case '/return-policy':
        return <ReturnPolicyPage />;
      case '/support':
      case '/support-center':
        return <SupportCenterPage />;
      case '/operations':
      case '/ops':
      case '/admin':
      case '/manage/profiles':
      case '/manage/profiles/new':
      case '/manage/portfolio':
      case '/manage/categories':
      case '/manage/skills':
      case '/manage/directory':
      case '/manage/avatars':
      case '/manage/branding':
      case '/manage/settings':
        return <AdminDashboard />;
      case '/':
      default:
        return <HomePage />;
    }
  };

  const isOperationsRoute =
    currentRoute.startsWith('/admin') ||
    currentRoute.startsWith('/operations') ||
    currentRoute.startsWith('/ops') ||
    currentRoute.startsWith('/manage');

  if (isOperationsRoute) {
    return (
      <div
        className={`min-h-screen flex flex-col font-sans selection:bg-[#006eff] selection:text-white ${isAdminLoggedIn ? 'text-slate-800' : 'text-slate-900'}`}
        style={{ backgroundColor: branding.backgroundColor || '#f8fafc' }}
      >
        <AdminDashboard />

        {/* Global AI Chatbot */}
        <GaenrChatbot />

        {/* Toast Notification Container */}
        <div className="fixed bottom-24 right-5 z-[110] flex flex-col gap-2 pointer-events-none">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-xs font-medium max-w-sm animate-in fade-in slide-in-from-bottom-2 ${
                toast.type === 'success'
                  ? 'bg-emerald-950/95 text-emerald-100 border-emerald-800'
                  : toast.type === 'error'
                  ? 'bg-rose-950/95 text-rose-100 border-rose-800'
                  : 'bg-slate-900/95 text-slate-100 border-slate-800'
              }`}
            >
              {toast.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : toast.type === 'error' ? (
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              ) : (
                <Info className="w-4 h-4 text-blue-400 shrink-0" />
              )}
              <span className="flex-1 leading-snug">{toast.message}</span>
              <button
                onClick={() => dismissToast(toast.id)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col text-slate-900 selection:bg-blue-600 selection:text-white"
      style={{ backgroundColor: branding.backgroundColor || '#fafbfc' }}
    >
      {/* Top Bar Header adhering to 3-zone contract */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Modals */}
      <AssignTaskModal />
      <ApplyExpertModal />

      {/* Global AI Chatbot */}
      <GaenrChatbot />

      {/* Toast Notification Container - Clean Auto-Dismissing, No Cross Button */}
      <div className="fixed bottom-24 right-5 z-[110] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-xs font-medium max-w-sm animate-in fade-in slide-in-from-bottom-2 ${
              toast.type === 'success'
                ? 'bg-emerald-950/95 text-emerald-100 border-emerald-800'
                : toast.type === 'error'
                ? 'bg-rose-950/95 text-rose-100 border-rose-800'
                : 'bg-slate-900/95 text-slate-100 border-slate-800'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : toast.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-blue-400 shrink-0" />
            )}
            <span className="flex-1 leading-snug">{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <BrandingProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </BrandingProvider>
  );
}
