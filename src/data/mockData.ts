import {
  ServiceCategory,
  FreelancerProfile,
  AvatarAsset,
  BrandingConfig,
} from '../types';

export const INITIAL_BRANDING: BrandingConfig = {
  siteTitle: 'Gaenr',
  logoUrl: '/logo.svg',
  faviconUrl: '/favicon.ico',
  watermarkImage: '/logo.svg', // Official logo from the header
  primaryColor: '#006eff',
  backgroundColor: '#f8fafc',
  footerBgColor: '#0c182c',
  footerTextColor: '#cbd5e1',
  footerText: 'Copyright © 2026 Gaenr. All Rights Reserved.',
  watermarkText: 'GAENR VERIFIED PORTFOLIO',
  watermarkOpacity: 15,
  watermarkPosition: 'diagonal',
  repeatingWatermark: true,
  footerTagline: 'Connecting businesses with expert talent for seamless, hassle-free outsourcing.',
};

export const INITIAL_AVATARS: AvatarAsset[] = [
  { id: 'avatar-youth-m1', name: 'Avatar 01', gender: 'male', tone: 'standard', assignedCount: 1 },
  { id: 'avatar-youth-f1', name: 'Avatar 02', gender: 'female', tone: 'standard', assignedCount: 1 },
  { id: 'avatar-youth-m2', name: 'Avatar 03', gender: 'male', tone: 'standard', assignedCount: 1 },
  { id: 'avatar-youth-f2', name: 'Avatar 04', gender: 'female', tone: 'standard', assignedCount: 1 },
  { id: 'avatar-youth-m3', name: 'Avatar 05', gender: 'male', tone: 'standard', assignedCount: 1 },
  { id: 'avatar-youth-tg1', name: 'Avatar 06', gender: 'female', tone: 'standard', assignedCount: 1 },
  { id: 'avatar-youth-m4', name: 'Avatar 07', gender: 'male', tone: 'standard', assignedCount: 1 },
  { id: 'avatar-youth-f4', name: 'Avatar 08', gender: 'female', tone: 'standard', assignedCount: 1 },
  { id: 'avatar-youth-m5', name: 'Avatar 09', gender: 'male', tone: 'standard', assignedCount: 1 },
  { id: 'avatar-youth-f5', name: 'Avatar 10', gender: 'female', tone: 'standard', assignedCount: 1 },
];


export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'cat-1',
    slug: 'graphics-design',
    title: 'Graphics Design',
    tagline: 'Graphics that speak before words do.',
    description:
      'Good design builds trust instantly. Our designers create visuals that are clear, consistent, and aligned with your brand so your business looks professional everywhere it appears.',
    iconName: 'Palette',
    subServices: [
      'Logo & Brand Identity',
      'Social Media Creatives',
      'Packaging & Label Design',
      'Marketing Flyers & Brochures',
      'Banner & Billboard Visuals',
      'Vector Illustrations',
    ],
    deliverables: [
      'Print-ready vector source files (AI, EPS, SVG)',
      'Digital web assets in PNG and WebP formats',
      'Comprehensive brand typography & color guidelines',
    ],
    whyGaenr: [
      'Verified student designers from top design departments',
      'Every project includes 2 revision rounds and direct Gaenr oversight',
      '100% custom conceptual work with zero generic templates',
    ],
    featuredProjectsCount: 150,
    cardImageUrl: '/images/services/graphics-design-services.jpg',
    cardImageFallbackUrl: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&w=800&q=80',
    coverImageUrl: '/images/services/graphics-design.svg',
    allowedMediaTypes: ['Images/Graphics', 'PDF/Document'],
  },
  {
    id: 'cat-2',
    slug: 'content-writing',
    title: 'Content Writing & Copywriting',
    tagline: 'Content with purpose, not filler.',
    description:
      'We write content that is structured, readable, and aligned with your business goals whether it is for your website, blog, or brand communication.',
    iconName: 'PenTool',
    subServices: [
      'Website Copy & Landing Pages',
      'SEO Articles & Educational Blogs',
      'E-commerce Product Descriptions',
      'Social Media Caption Sets',
      'Email Campaigns & Newsletters',
      'Company Profiles & Statements',
    ],
    deliverables: [
      'Ready-to-publish Markdown and DOCX documents',
      'Meta title, description, and keyword structure',
      'Plagiarism-checked, proofread native copy',
    ],
    whyGaenr: [
      'Researched by university students with specialized subject knowledge',
      'Human-written clarity with authentic tone and voice',
      'Fast turnaround managed through our editorial team',
    ],
    featuredProjectsCount: 180,
    cardImageUrl: '/images/services/content-writing-copywriting-services.jpg',
    cardImageFallbackUrl: 'https://images.unsplash.com/photo-1636038692415-6276311a53cd?auto=format&fit=crop&w=800&q=80',
    coverImageUrl: '/images/services/content-writing.svg',
    allowedMediaTypes: ['PDF/Document'],
  },
  {
    id: 'cat-3',
    slug: 'video-editing',
    title: 'Video Editing',
    tagline: 'Turn raw footage into clear stories.',
    description:
      'We turn raw footage into polished stories that hold attention. From social clips to business videos, every edit is built for retention and impact.',
    iconName: 'Film',
    subServices: [
      'YouTube Long-form Content',
      'Reels, Shorts & TikTok Edits',
      'Corporate & Promotional Promos',
      'Podcast Audio & Video Sync',
      'Dynamic Subtitles & Motion Graphics',
      'Color Grading & Sound Design',
    ],
    deliverables: [
      'Exported 4K / 1080p Master MP4 files',
      'Platform-optimized aspect ratio variants (16:9, 9:16, 1:1)',
      'Clean audio mix, SFX, and licensed background score sync',
    ],
    whyGaenr: [
      'Experts adept in Premiere Pro, DaVinci Resolve, and After Effects',
      'High-retention pacing without cheesy template clutter',
      'Secure project handoff and fast cloud delivery',
    ],
    featuredProjectsCount: 120,
    cardImageUrl: '/images/services/video-editing-services.jpg',
    cardImageFallbackUrl: 'https://images.unsplash.com/photo-1618329027137-a520b57c6606?auto=format&fit=crop&w=800&q=80',
    coverImageUrl: '/images/services/video-editing.svg',
    allowedMediaTypes: ['Video files', 'Images/Graphics'],
  },
  {
    id: 'cat-4',
    slug: 'wordpress-website',
    title: 'WordPress Website Design',
    tagline: 'Functional, fast websites built to convert.',
    description:
      'Modern, mobile-responsive WordPress sites engineered for performance, clean architecture, and easy self-management.',
    iconName: 'Globe',
    subServices: [
      'Custom Elementor & Block Layouts',
      'WooCommerce E-commerce Stores',
      'Landing Page Development',
      'Speed Optimization & Core Web Vitals',
      'Domain, SSL & Hosting Setup',
      'Payment Gateway Integration (bKash, Nagad, SSLCommerz)',
    ],
    deliverables: [
      'Complete responsive WordPress site',
      'Mobile-first responsive optimization across tablet and phone',
      'Admin handover guide and essential security hardening',
    ],
    whyGaenr: [
      'Built by university CS & IT students with modern web standards',
      'Zero bloated premium theme dependencies',
      'Direct testing on real local network conditions in Bangladesh',
    ],
    featuredProjectsCount: 95,
    cardImageUrl: '/images/services/wordpress-website-design-services.jpg',
    cardImageFallbackUrl: 'https://images.unsplash.com/photo-1566207474742-de921626ad0c?auto=format&fit=crop&w=800&q=80',
    coverImageUrl: '/images/services/wordpress-website.svg',
    allowedMediaTypes: ['Code/Web Preview', 'Images/Graphics'],
  },
  {
    id: 'cat-5',
    slug: 'presentation-slide-design',
    title: 'Presentation Slide Design',
    tagline: 'Present your ideas with confidence.',
    description:
      'Pitch decks, conference slides, and business presentations restructured for visual clarity, investor focus, and professional weight.',
    iconName: 'Layout',
    subServices: [
      'Startup Investor Pitch Decks',
      'Corporate Sales Presentations',
      'Academic & Keynote Presentations',
      'Custom Infographics & Data Visuals',
      'Branded Master Slide Templates',
      'PowerPoint & Google Slides Format',
    ],
    deliverables: [
      'Editable PPTX and Google Slides master files',
      'High-resolution PDF presentation file',
      'Vector icon kit and chart styling palette',
    ],
    whyGaenr: [
      'Strategic visual pacing that keeps audience attention focused',
      'Clean tabular data and custom infographic typography',
      'Fast 24-48h expedited delivery available for urgent pitches',
    ],
    featuredProjectsCount: 80,
    cardImageUrl: '/images/services/presentation-slide-design-services.jpg',
    cardImageFallbackUrl: 'https://images.unsplash.com/photo-1588600878108-578307a3cc9d?auto=format&fit=crop&w=800&q=80',
    coverImageUrl: '/images/services/presentation-slide-design.svg',
    allowedMediaTypes: ['PDF/Document', 'Images/Graphics'],
  },
  {
    id: 'cat-6',
    slug: 'ux-ui-design',
    title: 'UX / UI Design',
    tagline: 'Digital interfaces crafted for humans.',
    description:
      'Intuitive user interfaces, wireframes, and design systems for web and mobile products that reduce friction and drive user retention.',
    iconName: 'Layers',
    subServices: [
      'Mobile App UI Design (iOS / Android)',
      'SaaS & Web App Dashboards',
      'User Journey & Wireframing',
      'Figma Component Design Systems',
      'Interactive Clickable Prototypes',
      'UX Usability Audits',
    ],
    deliverables: [
      'Organized Figma files with auto-layout and components',
      'Interactive clickable prototype link',
      'Developer handoff specs with responsive breakpoints',
    ],
    whyGaenr: [
      'Human-centric design validated against real user scenarios',
      'Modern aesthetics with zero-pill anti-slop visual discipline',
      'Ready for swift development handover',
    ],
    featuredProjectsCount: 65,
    cardImageUrl: '/images/services/ux-ui-design-services.jpg',
    cardImageFallbackUrl: 'https://images.unsplash.com/photo-1586717799252-bd134ad00e26?auto=format&fit=crop&w=800&q=80',
    coverImageUrl: '/images/services/ux-ui-design.svg',
    allowedMediaTypes: ['Images/Graphics', 'Code/Web Preview'],
  },
  {
    id: 'cat-7',
    slug: 'ad-running',
    title: 'Ad Running & Campaign Setup',
    tagline: 'Targeted reach with measurable ROI.',
    description:
      'Data-driven social media and search campaign configurations designed to reach targeted local audiences across Bangladesh and global markets.',
    iconName: 'Megaphone',
    subServices: [
      'Meta (Facebook & Instagram) Ad Campaigns',
      'Google Search & Display Advertising',
      'Local Audience Retargeting Pixels',
      'A/B Creative & Headline Testing',
      'Campaign Budget Optimization',
      'Weekly Performance Analytics & Reporting',
    ],
    deliverables: [
      'Configured Meta Ads Manager campaigns',
      'Detailed audience persona targeting blueprint',
      'Analytics report with ROAS and CAC breakdowns',
    ],
    whyGaenr: [
      'Deep insight into Bangladeshi digital consumer behaviors',
      'Transparent ad spend and zero hidden markups',
      'Continuous monitoring by certified campaign specialists',
    ],
    featuredProjectsCount: 75,
    cardImageUrl: '/images/services/social-media-advertising-services.jpg',
    cardImageFallbackUrl: 'https://i.pinimg.com/736x/d0/12/34/d012343994bae31b40b1ebf2c92b0e69.jpg',
    coverImageUrl: '/images/services/ad-running.svg',
    allowedMediaTypes: ['Images/Graphics', 'Video files', 'PDF/Document'],
  },
];

export const INITIAL_FREELANCERS: FreelancerProfile[] = [];

export const TESTIMONIALS = [
  {
    id: 't-1',
    name: 'Darren Dunlap',
    title: 'CEO & Founder at Flex.co',
    quote:
      'The best solution for anyone who wants to work with reliable experts without platform chaos. The managed communication and delivery speed are unmatched.',
    category: 'Business & Outsourcing',
    hasVideo: true,
  },
  {
    id: 't-2',
    name: 'Rafiqul Islam',
    title: 'Managing Director, Dhaka Horizon Media',
    quote:
      'Finding dependable creative talent in Bangladesh used to take weeks of filtering. Gaenr gave us a verified designer in hours, and the work was delivered on time without any hassle.',
    category: 'Graphics & Brand',
    hasVideo: false,
  },
  {
    id: 't-3',
    name: 'Nadia Chowdhury',
    title: 'Founder, Organic Essentials BD',
    quote:
      'Our complete product label suite and WordPress store were handled via Gaenr. The 0% platform fee and escrow protection gave us total peace of mind.',
    category: 'E-commerce & Web',
    hasVideo: true,
  },
  {
    id: 't-4',
    name: 'Shamsul Alam',
    title: 'COO, NextGen Logistics',
    quote:
      'The managed workflow model is genius. Having a Gaenr representative confirm requirements upfront prevents 99% of typical freelancer miscommunications.',
    category: 'Managed Outsourcing',
    hasVideo: false,
  },
];
