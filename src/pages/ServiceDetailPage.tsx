import React from 'react';
import { useApp } from '../context/AppContext';
import { SERVICE_CATEGORIES } from '../data/mockData';
import { ServiceSlug } from '../types';
import { ArrowRight, ExternalLink } from 'lucide-react';
import {
  AnimatedSparkles,
  AnimatedPalette,
  AnimatedBox,
  AnimatedFileText,
  AnimatedMaximize2,
  AnimatedPenTool,
  AnimatedGlobe,
  AnimatedBookOpen,
  AnimatedShoppingBag,
  AnimatedMessageSquare,
  AnimatedMail,
  AnimatedBuilding,
  AnimatedFilm,
  AnimatedSmartphone,
  AnimatedVideo,
  AnimatedMic,
  AnimatedType,
  AnimatedSliders,
  AnimatedLayout,
  AnimatedShoppingCart,
  AnimatedRocket,
  AnimatedZap,
  AnimatedShieldCheck,
  AnimatedCreditCard,
  AnimatedBriefcase,
  AnimatedBarChart,
  AnimatedPresentation,
  AnimatedLineChart,
  AnimatedCopy,
  AnimatedMonitor,
  AnimatedLayoutDashboard,
  AnimatedWorkflow,
  AnimatedLayers,
  AnimatedMousePointerClick,
  AnimatedCheckSquare,
  AnimatedMegaphone,
  AnimatedSearch,
  AnimatedTarget,
  AnimatedSplit,
  AnimatedDollarSign,
  AnimatedTrendingUp,
} from '../components/common/AnimatedServiceIcons';

interface ServiceDetailPageProps {
  slug: ServiceSlug;
}

interface SubServiceItem {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SERVICE_SUB_ITEMS: Record<string, SubServiceItem[]> = {
  'graphics-design': [
    {
      title: 'Logo & Brand Identity',
      description: 'Minimalist logos, secondary marks, color palettes, and comprehensive brand guidelines.',
      icon: AnimatedSparkles,
    },
    {
      title: 'Social Media Creatives',
      description: 'High-converting Facebook, Instagram, LinkedIn post graphics, banners, and carousels.',
      icon: AnimatedPalette,
    },
    {
      title: 'Packaging & Label Design',
      description: 'Custom product boxes, bottle labels, pouches, and print-ready production dielines.',
      icon: AnimatedBox,
    },
    {
      title: 'Marketing Flyers & Brochures',
      description: 'Bi-fold & tri-fold corporate brochures, promotional leaflets, posters, and one-pagers.',
      icon: AnimatedFileText,
    },
    {
      title: 'Banner & Billboard Visuals',
      description: 'Large-format outdoor billboards, event roll-up standees, and digital web ad banners.',
      icon: AnimatedMaximize2,
    },
    {
      title: 'Custom Vector Illustrations',
      description: 'Hand-crafted vector iconography, editorial artwork, characters, and mascot graphics.',
      icon: AnimatedPenTool,
    },
  ],
  'content-writing': [
    {
      title: 'Website Copy & Landing Pages',
      description: 'Persuasive, high-converting copy for homepages, services, and sales funnels.',
      icon: AnimatedGlobe,
    },
    {
      title: 'SEO Articles & Educational Blogs',
      description: 'Keyword-optimized long-form articles that rank on Google and provide real value.',
      icon: AnimatedBookOpen,
    },
    {
      title: 'E-commerce Product Descriptions',
      description: 'Benefit-driven product write-ups structured to reduce friction and lift sales.',
      icon: AnimatedShoppingBag,
    },
    {
      title: 'Social Media Caption Sets',
      description: 'Punchy captions with engaging hooks, clear CTAs, and researched hashtag sets.',
      icon: AnimatedMessageSquare,
    },
    {
      title: 'Email Campaigns & Newsletters',
      description: 'Retention sequences, promotional broadcasts, and lead nurture drips.',
      icon: AnimatedMail,
    },
    {
      title: 'Company Profiles & Statements',
      description: 'Professional executive bios, mission & vision statements, and corporate profiles.',
      icon: AnimatedBuilding,
    },
  ],
  'video-editing': [
    {
      title: 'YouTube Long-form Content',
      description: 'Narrative pacing, jump cuts, sound FX, zoom-ins, and high-retention storytelling.',
      icon: AnimatedFilm,
    },
    {
      title: 'Reels, Shorts & TikTok Edits',
      description: 'Vertical 9:16 edits with dynamic captions, sound hooks, and trending rhythm.',
      icon: AnimatedSmartphone,
    },
    {
      title: 'Corporate & Promotional Promos',
      description: 'Brand introduction videos, customer case studies, and business overviews.',
      icon: AnimatedVideo,
    },
    {
      title: 'Podcast Audio & Video Sync',
      description: 'Multi-camera angle switching, noise reduction, and synchronized audio mastering.',
      icon: AnimatedMic,
    },
    {
      title: 'Dynamic Subtitles & Motion Graphics',
      description: 'Animated lower thirds, kinetic typography, callouts, and animated logo reveals.',
      icon: AnimatedType,
    },
    {
      title: 'Color Grading & Sound Design',
      description: 'Cinematic LUT application, color balance correction, audio leveling, and ambient SFX.',
      icon: AnimatedSliders,
    },
  ],
  'wordpress-website': [
    {
      title: 'Custom Elementor & Block Layouts',
      description: 'Tailored pixel-perfect page designs built cleanly without template bloat.',
      icon: AnimatedLayout,
    },
    {
      title: 'WooCommerce E-commerce Stores',
      description: 'Full online shop configuration, product catalog, cart, and checkout workflows.',
      icon: AnimatedShoppingCart,
    },
    {
      title: 'Landing Page Development',
      description: 'Fast-loading, single-purpose landing pages optimized for maximum lead conversion.',
      icon: AnimatedRocket,
    },
    {
      title: 'Speed Optimization & Core Web Vitals',
      description: 'Caching setup, image WebP compression, database cleanup, and 90+ PageSpeed.',
      icon: AnimatedZap,
    },
    {
      title: 'Domain, SSL & Hosting Setup',
      description: 'CPanel/Cloud hosting configuration, DNS propagation, and HTTPS SSL certificates.',
      icon: AnimatedShieldCheck,
    },
    {
      title: 'Payment Gateway Integration',
      description: 'Direct local checkout via bKash, Nagad, Rocket, and SSLCommerz cards.',
      icon: AnimatedCreditCard,
    },
  ],
  'presentation-slide-design': [
    {
      title: 'Startup Investor Pitch Decks',
      description: 'Problem, solution, market size, traction, and financial ask structured for VC review.',
      icon: AnimatedBriefcase,
    },
    {
      title: 'Corporate Sales Presentations',
      description: 'B2B pitch decks, service capability overviews, and client proposal decks.',
      icon: AnimatedBarChart,
    },
    {
      title: 'Academic & Keynote Presentations',
      description: 'Large auditorium slides with visual storytelling, minimal text, and high impact.',
      icon: AnimatedPresentation,
    },
    {
      title: 'Custom Infographics & Data Visuals',
      description: 'Transforming complex spreadsheets into readable diagrams, charts, and graphs.',
      icon: AnimatedLineChart,
    },
    {
      title: 'Branded Master Slide Templates',
      description: 'Reusable PowerPoint & Google Slides master theme with customized typography.',
      icon: AnimatedCopy,
    },
    {
      title: 'PowerPoint & Google Slides Format',
      description: 'Fully editable, cross-compatible files delivered in PPTX and cloud link format.',
      icon: AnimatedMonitor,
    },
  ],
  'ux-ui-design': [
    {
      title: 'Mobile App UI Design (iOS / Android)',
      description: 'Native design patterns, clean tap targets, status bars, and mobile flows.',
      icon: AnimatedSmartphone,
    },
    {
      title: 'SaaS & Web App Dashboards',
      description: 'Complex data tables, navigation sidebars, settings modals, and desktop viewports.',
      icon: AnimatedLayoutDashboard,
    },
    {
      title: 'User Journey & Wireframing',
      description: 'Low-fidelity user flows, information architecture, and screen layout schematics.',
      icon: AnimatedWorkflow,
    },
    {
      title: 'Figma Component Design Systems',
      description: 'Auto-layout components, color tokens, typography scales, and variants.',
      icon: AnimatedLayers,
    },
    {
      title: 'Interactive Clickable Prototypes',
      description: 'Realistic screen transitions, micro-interactions, and usability testing previews.',
      icon: AnimatedMousePointerClick,
    },
    {
      title: 'UX Usability Audits',
      description: 'Heuristic evaluations, heuristic breakdown of friction points, and UX fix blueprints.',
      icon: AnimatedCheckSquare,
    },
  ],
  'ad-running': [
    {
      title: 'Meta (Facebook & Instagram) Ad Campaigns',
      description: 'Traffic, leads, conversion, and catalog sales objective campaign structure.',
      icon: AnimatedMegaphone,
    },
    {
      title: 'Google Search & Display Advertising',
      description: 'High-intent search keyword bidding, negative match lists, and banner ads.',
      icon: AnimatedSearch,
    },
    {
      title: 'Local Audience Retargeting Pixels',
      description: 'Custom audiences, lookalikes, website pixel setup, and event tracking.',
      icon: AnimatedTarget,
    },
    {
      title: 'A/B Creative & Headline Testing',
      description: 'Testing multiple visual assets and ad copies to uncover the lowest CAC.',
      icon: AnimatedSplit,
    },
    {
      title: 'Campaign Budget Optimization',
      description: 'Smart CBO setup, daily pacing management, and bidding strategy adjustments.',
      icon: AnimatedDollarSign,
    },
    {
      title: 'Weekly Performance Analytics & Reporting',
      description: 'Transparent metrics report detailing ROAS, impressions, CTR, and CPA.',
      icon: AnimatedTrendingUp,
    },
  ],
};

const SERVICE_BG_MAP: Record<string, string> = {
  'graphics-design': '/images/services/graphics-design.svg',
  'content-writing': '/images/services/content-writing.svg',
  'video-editing': '/images/services/video-editing.svg',
  'wordpress-website': '/images/services/wordpress-website.svg',
  'presentation-slide-design': '/images/services/presentation-slide-design.svg',
  'ux-ui-design': '/images/services/ux-ui-design.svg',
  'ad-running': '/images/services/ad-running.svg',
  'bundle': '/images/services/graphics-design.svg',
};

const SERVICE_BG_POS: Record<string, string> = {
  'ad-running': 'object-top',
  'graphics-design': 'object-[center_15%]',
  'content-writing': 'object-[center_15%]',
  'video-editing': 'object-[center_15%]',
  'wordpress-website': 'object-[center_15%]',
  'presentation-slide-design': 'object-[center_15%]',
  'ux-ui-design': 'object-[center_24%]',
  'bundle': 'object-[center_15%]',
};

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ slug }) => {
  const { navigate, openAssignTask, categories } = useApp();

  const service =
    categories.find((c) => c.slug === slug) ||
    SERVICE_CATEGORIES.find((c) => c.slug === slug);

  const subItems: SubServiceItem[] = React.useMemo(() => {
    if (!service) return [];
    if (SERVICE_SUB_ITEMS[service.slug]) {
      return SERVICE_SUB_ITEMS[service.slug];
    }
    // Dynamic sub-services generated from category
    const defaultIcons = [
      AnimatedSparkles,
      AnimatedLayers,
      AnimatedFileText,
      AnimatedWorkflow,
      AnimatedShieldCheck,
      AnimatedRocket,
      AnimatedZap,
    ];
    return (service.subServices || []).map((subName, i) => ({
      title: subName,
      description: 'Specialized deliverable tailored to business requirements under Gaenr standard quality protocol.',
      icon: defaultIcons[i % defaultIcons.length],
    }));
  }, [service]);

  if (!service) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Service Category Not Found</h2>
        <p className="text-sm text-slate-500 max-w-md">
          The requested service category is not currently available or may have been updated.
        </p>
        <button
          onClick={() => navigate('/services')}
          className="px-6 py-2.5 bg-[#006eff] text-white rounded-xl font-semibold text-xs shadow-md cursor-pointer"
        >
          View All Services
        </button>
      </div>
    );
  }

  const coverImage = service.coverImageUrl || SERVICE_BG_MAP[service.slug];

  return (
    <div className="w-full">
      {/* =========================================================================
          AUTHENTIC LIGHT-BLUISH HERO HEADER WITH SERVICE VECTOR ARTWORK
          - Base: Signature vibrant light blue `#006eff`
          - Uniform height across all services: h-[190px] sm:h-[220px] lg:h-[240px]
          - Service artwork placed with `object-top` so character heads are fully visible
          - Finely adjusted opacity (80%) with soft bluish tint for clear recognition
          - Single-line headline
         ========================================================================= */}
      <section className="relative w-full bg-[#006eff] h-[190px] sm:h-[220px] lg:h-[240px] px-4 sm:px-6 lg:px-8 text-center overflow-hidden flex flex-col items-center justify-center">
        {/* Layer 1: Dedicated Service Artwork in Background with clear visibility & top alignment */}
        {coverImage && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
            <img
              src={coverImage}
              alt={service.title}
              className={`w-full h-full object-cover ${SERVICE_BG_POS[service.slug] || 'object-top'} opacity-80`}
            />
          </div>
        )}

        {/* Layer 2: Signature light bluish tint overlay to keep the light-bluish vibe while letting artwork show clearly */}
        <div className="absolute inset-0 bg-[#006eff]/35 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#006eff]/80 via-transparent to-[#006eff]/50 pointer-events-none" />

        {/* Layer 3: Original pattern overlay with reduced opacity (from ServicesPage) */}
        <div className="absolute inset-0 bg-[url('/expert-bg-pattern.svg')] bg-cover bg-center opacity-20 mix-blend-screen pointer-events-none" />

        {/* Layer 4: Subtle geometric dot grid overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.22)_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

        <article className="relative z-10 max-w-5xl mx-auto flex flex-col items-center justify-center px-2">
          {/* White box breadcrumb badge on top of blue header with proper compact distance */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white shadow-xs text-xs font-semibold mb-3 sm:mb-4 border border-white/80">
            <button
              onClick={() => navigate('/services')}
              className="text-slate-600 hover:text-[#006eff] transition-colors cursor-pointer"
            >
              Service
            </button>
            <span className="text-slate-400 font-bold select-none">&gt;&gt;</span>
            <span className="text-slate-900 font-bold">{service.title}</span>
          </div>

          {/* Main Headline: Single Line, punchy tagline */}
          <h1 className="text-base sm:text-xl md:text-2xl lg:text-[28px] font-bold text-white tracking-tight whitespace-nowrap text-center drop-shadow-xs max-w-full overflow-hidden text-ellipsis">
            {service.tagline || service.title}
          </h1>
        </article>
      </section>

      {/* =========================================================================
          MAIN CONTENT AREA
         ========================================================================= */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 text-left space-y-10 sm:space-y-12">
        {/* 1. About the Service Card: Distinct light background in light mode, sleek glassy card in dark mode */}
        <div className="group rounded-2xl sm:rounded-3xl bg-[#eef4fb] dark:bg-gradient-to-br dark:from-[#131f37]/95 dark:via-[#16233d]/90 dark:to-[#111b30]/95 border border-[#d3e2f5] dark:border-blue-500/30 p-6 sm:p-8 md:p-10 shadow-xs dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] dark:backdrop-blur-xl space-y-4 hover:border-blue-300 dark:hover:border-blue-400/50 transition-all duration-300">
          <div className="inline-block">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              About {service.title}
            </h2>
            <span className="block h-1 w-8 group-hover:w-full rounded-full bg-slate-900 dark:bg-blue-400 group-hover:bg-[#006eff] dark:group-hover:bg-[#38bdf8] transition-all duration-500 ease-out mt-3" />
          </div>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {service.description}
          </p>
        </div>

        {/* 2. Sub-Services Section: Clean visual cards with icons, title, and short description */}
        {subItems.length > 0 && (
          <div className="space-y-6">
            {/* Simple centered title line */}
            <div className="text-center pt-2">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Services
              </h3>
            </div>

            {/* 6 Clean Capability Cards with visual animated icons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {subItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.title}
                    className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:border-[#006eff]/40 hover:shadow-md transition-all flex flex-col text-left space-y-3.5"
                  >
                    {/* Visual icon container: strictly as before, steady and static */}
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/70 border border-blue-100 flex items-center justify-center text-[#006eff] shadow-2xs shrink-0">
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <h4 className="font-bold text-base text-slate-900 leading-snug">
                        {item.title}
                      </h4>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. Gaenr Official YouTube Channel Showcase for Video Editing */}
        {service.slug === 'video-editing' && (
          <div className="rounded-2xl bg-gradient-to-r from-red-500/10 via-rose-500/5 to-transparent dark:from-red-950/30 dark:via-rose-950/10 border border-red-200/80 dark:border-red-500/30 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-[#FF0000] text-white flex items-center justify-center shadow-md shadow-red-500/25 shrink-0">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Watch Our Video Breakdowns &amp; Guides on YouTube
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Explore creative samples, retention storytelling, and tutorials on official <strong>@gaenr</strong>.
                </p>
              </div>
            </div>

            <a
              href="https://www.youtube.com/@gaenr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF0000] hover:bg-[#D90000] text-white text-xs font-bold transition-all shadow-md shadow-red-500/20 shrink-0 cursor-pointer"
            >
              <span>Visit @gaenr</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* 4. Action Button: Assign Task */}
        <div className="pt-4 flex justify-center">
          <button
            onClick={() => openAssignTask(undefined, service.slug)}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#1d74f5] via-[#0c67ea] to-[#0056d6] hover:from-[#2b82fa] hover:to-[#0862e6] text-white font-medium text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/20"
          >
            <span>Assign Task in {service.title}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
