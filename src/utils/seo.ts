/**
 * Comprehensive SEO & Metadata Management Utility for Gaenr
 * Synchronizes document.title, meta descriptions, canonical URLs, and Open Graph tags.
 */

export interface PageMeta {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
}

const SITE_NAME = 'Gaenr';
const BASE_URL = 'https://gaenr.com';
const DEFAULT_OG_IMAGE = 'https://gaenr.com/images/gaenr-logo-card.png?v=2';

const SERVICE_META: Record<string, { title: string; description: string }> = {
  'graphics-design': {
    title: 'Graphics Design Services — Brand Identity, Logos & Visuals | Gaenr',
    description: 'Custom logo design, brand style guides, social media kits, and vector illustrations crafted by verified designers in Bangladesh with 0% platform markup.',
  },
  'content-writing': {
    title: 'Content Writing & Copywriting Services — SEO & Technical Articles | Gaenr',
    description: 'Human-researched SEO blogs, website copywriting, e-commerce product copy, and company profiles with verified proofreading and fast turnarounds.',
  },
  'video-editing': {
    title: 'Video Editing Services — High-Retention YouTube, Reels & Promos | Gaenr',
    description: 'Turn raw footage into polished, high-retention video stories in Premiere Pro & DaVinci Resolve. 4K exports, dynamic subtitles, audio mix, and sound design.',
  },
  'wordpress-website': {
    title: 'WordPress Website Design Services — Fast, Responsive Sites | Gaenr',
    description: 'Modern, mobile-first WordPress & WooCommerce sites engineered for performance, clean architecture, and local payment gateways (bKash, Nagad).',
  },
  'presentation-slide-design': {
    title: 'Presentation Slide Design Services — Pitch Decks & Keynotes | Gaenr',
    description: 'Investor pitch decks, sales presentations, and conference slides structured for visual impact, data clarity, and executive engagement.',
  },
  'ux-ui-design': {
    title: 'UX / UI Design Services — App & Web Interface Systems | Gaenr',
    description: 'Intuitive user experiences, clickable Figma prototypes, and developer-ready design systems for SaaS, mobile apps, and web products.',
  },
  'ad-running': {
    title: 'Social Media Advertising & Ad Campaign Services | Gaenr',
    description: 'Data-driven Meta & Google ad campaigns engineered for local Bangladeshi and international audiences with targeted pixels and ROAS optimization.',
  },
};

const BLOG_META: Record<string, { title: string; description: string }> = {
  'oxford-online-labour-index-bangladesh-talent': {
    title: 'Empirical Evidence: Bangladesh in the Oxford Online Labour Index | Gaenr Academy',
    description: 'Academic analysis of Oxford Internet Institute (OII) data showing Bangladesh capturing 16% of global digital labor supply, ranking 2nd worldwide.',
  },
  'economics-of-freelance-escrow-vs-bidding-markets': {
    title: 'Contract Theory & Asymmetric Information: Escrow vs. Bidding Markets | Gaenr Academy',
    description: 'An economic analysis using Akerlof\'s Market for Lemons and Williamson\'s transaction cost framework to prove why uncurated bidding auctions fail.',
  },
  'neuroscience-of-short-form-video-retention-research': {
    title: 'The Neuroscience of Short-Form Video Retention: 1,500ms Cognitive Window | Gaenr Academy',
    description: 'Empirical research on visual cognitive processing, saccadic eye movement, and dopamine reward circuitry in high-retention video editing.',
  },
  'google-core-web-vitals-performance-economics': {
    title: 'The Millisecond Economy: Core Web Vitals & Conversion Yields | Gaenr Academy',
    description: 'Analyzing 10,000+ domains across Deloitte, Google CrUX, and Aberdeen Group studies. Proving how 100ms latency cuts elevate conversion rates by 8.4%.',
  },
  'human-capital-theory-student-freelancing-research': {
    title: 'Gary Becker\'s Human Capital Theory Applied to Student Freelancing | Gaenr Academy',
    description: 'A socioeconomic inquiry into student digital labor. How university students build verified market proof-of-work, accelerating career velocity by 42%.',
  },
  'freelancing-in-bd-guide': {
    title: 'Freelancing Guide: Hiring Verified Talent & Managing Remote Work | Gaenr Academy',
    description: 'Strategic insights on digital collaboration, verified talent selection, escrow fund protection, and frictionless execution.',
  },
  'top-freelance-marketplaces-bangladesh': {
    title: 'Analyzing Freelance Marketplaces: The Shift Toward Curated Ecosystems | Gaenr Academy',
    description: 'A structural comparison of traditional bidding platforms versus managed, zero-commission ecosystems with escrow protection.',
  },
  'how-to-hire-freelancers-in-bd': {
    title: 'How to Hire Digital Freelancers: Verified Employer Playbook | Gaenr Academy',
    description: 'Step-by-step blueprint to evaluate portfolios, structure milestone deliverables, and scale creative and technical operations.',
  },
  'student-freelancing-in-bd-guide': {
    title: 'Student Freelancing Roadmap: Academic Balance & Skill Monetization | Gaenr Academy',
    description: 'Practical framework for university students balancing academic coursework with high-value technical and creative client work.',
  },
  'freelance-outsourcing-in-bangladesh': {
    title: 'Global Outsourcing Dynamics: The Rise of Specialized Digital Hubs | Gaenr Academy',
    description: 'How businesses worldwide leverage verified talent hubs for video production, modern web development, and digital marketing.',
  },
  'zero-commission-advantage-bangladesh': {
    title: 'The Zero-Commission Advantage: Aligning Incentives in Knowledge Work | Gaenr Academy',
    description: 'Why high platform commissions distort market pricing and why zero-commission models attract top-tier creative professionals.',
  },
  'student-freelancer-proof-of-work-guide': {
    title: 'Building Proof-of-Work: The Student Freelancer\'s Asset Guide | Gaenr Academy',
    description: 'Why live, verifiable case studies and milestone outcomes outperform generic resumes in modern client acquisition.',
  },
  'video-editing-retention-playbook': {
    title: 'Video Retention Playbook: Pacing, Motion, and Sound Design Systems | Gaenr Academy',
    description: 'Technical framework for editors creating high-engagement social media content across TikTok, Instagram Reels, and YouTube Shorts.',
  },
  'wordpress-speed-optimization-checklist': {
    title: 'WordPress Speed Optimization: Achieving Sub-Second Page Loads | Gaenr Academy',
    description: 'Engineered guide to database optimization, cache architectures, and asset minification for production WordPress websites.',
  },
  'outsourcing-creative-work-risk-free': {
    title: 'Risk-Free Creative Outsourcing: Escrow, Briefs, and Milestones | Gaenr Academy',
    description: 'How founders and marketing teams safeguard budgets using milestone-based escrow delivery and clear revision protocols.',
  },
  'case-study-dhaka-fintech-rebrand': {
    title: 'Case Study: Scaling Visual Identity for an Emerging Fintech Brand | Gaenr Academy',
    description: 'Detailed breakdown of an end-to-end rebranding sprint: typography, design system, component libraries, and performance marketing assets.',
  },
};

const STATIC_ROUTE_META: Record<string, PageMeta> = {
  '/': {
    title: 'Gaenr - Are You #ReadyToChange?',
    description: 'Gaenr connects businesses and clients worldwide with verified student talent and digital experts with zero platform fees. Are you #ReadyToChange?',
    canonical: `${BASE_URL}/`,
  },
  '/services': {
    title: 'Services & Managed Outsourcing | Gaenr',
    description: 'Explore creative and digital services on Gaenr: graphics design, content writing, video editing, WordPress website design, UI/UX, and social media advertising.',
    canonical: `${BASE_URL}/services`,
  },
  '/experts': {
    title: 'Verified Digital Experts & Creator Directory | Gaenr',
    description: 'Browse verified student talent and digital specialists on Gaenr. Inspect verified portfolios, deliverables, client reviews, and direct escrow hiring.',
    canonical: `${BASE_URL}/experts`,
  },
  '/freelancers': {
    title: 'Verified Digital Experts & Creator Directory | Gaenr',
    description: 'Browse verified student talent and digital specialists on Gaenr. Inspect verified portfolios, deliverables, client reviews, and direct escrow hiring.',
    canonical: `${BASE_URL}/experts`,
  },
  '/about': {
    title: 'About Us - Bangladesh-Based Freelancing Platform for All | Gaenr',
    description: 'Discover Gaenr: a Bangladesh-based freelancing platform connecting verified student creators with clients worldwide and locally with zero commission.',
    canonical: `${BASE_URL}/about-us`,
  },
  '/about-us': {
    title: 'About Us - Bangladesh-Based Freelancing Platform for All | Gaenr',
    description: 'Discover Gaenr: a Bangladesh-based freelancing platform connecting verified student creators with clients worldwide and locally with zero commission.',
    canonical: `${BASE_URL}/about-us`,
  },
  '/testimonials': {
    title: 'Client Testimonials & Verified Case Studies | Gaenr',
    description: 'Read authentic reviews and feedback from founders, agency owners, and companies who outsource digital projects and work with talent through Gaenr.',
    canonical: `${BASE_URL}/testimonials`,
  },
  '/blogs': {
    title: 'Gaenr Academy — Research, Insights & Industry Guides',
    description: 'Authoritative research-backed articles, digital market studies, and guides by Gaenr Academy on outsourcing economics and digital craftsmanship.',
    canonical: `${BASE_URL}/blogs`,
  },
  '/blog': {
    title: 'Gaenr Academy — Research, Insights & Industry Guides',
    description: 'Authoritative research-backed articles, digital market studies, and guides by Gaenr Academy on outsourcing economics and digital craftsmanship.',
    canonical: `${BASE_URL}/blogs`,
  },
  '/support': {
    title: 'Support Center & Frequently Asked Questions | Gaenr',
    description: 'Get immediate answers about project escrow, refund guarantees, payment methods, and collaborating with talent on Gaenr.',
    canonical: `${BASE_URL}/support`,
  },
  '/support-center': {
    title: 'Support Center & Frequently Asked Questions | Gaenr',
    description: 'Get immediate answers about project escrow, refund guarantees, payment methods, and collaborating with talent on Gaenr.',
    canonical: `${BASE_URL}/support`,
  },
  '/contact': {
    title: 'Contact Us & Office Location | Gaenr',
    description: 'Contact Gaenr. Call 09647 922 800 or email hello@gaenr.com for immediate project onboarding and enterprise inquiries.',
    canonical: `${BASE_URL}/contact`,
  },
  '/join-as-expert': {
    title: 'Join as Verified Expert — Monetize Your Craft | Gaenr',
    description: 'Monetize your craft with 0% platform commission. Gaenr connects university students and creators with verified clients and direct escrow payouts.',
    canonical: `${BASE_URL}/join-as-expert`,
  },
  '/feedback': {
    title: 'Share Feedback & Project Review | Gaenr',
    description: 'Share your feedback, report an issue, or review your experience with Gaenr to help us build a better outsourcing ecosystem.',
  },
  '/privacy-policy': {
    title: 'Privacy Policy | Gaenr',
    description: 'Read the official Gaenr Privacy Policy regarding personal information, escrow transaction security, and user data rights.',
  },
  '/terms': {
    title: 'Terms of Service | Gaenr',
    description: 'Review the terms, conditions, and escrow policies governing client and expert collaboration on Gaenr.',
  },
  '/return-policy': {
    title: 'Refund & Return Policy | Gaenr',
    description: 'Learn about our 100% pre-initiation refund guarantee and milestone-based escrow release guidelines.',
  },
};

/**
 * Dynamically resolves meta tags for a given route.
 */
export function getMetaForRoute(
  route: string,
  overrides?: Partial<PageMeta>
): PageMeta {
  const cleanRoute = route.split('#')[0].split('?')[0];

  // Service Detail match: /services/:slug
  if (cleanRoute.startsWith('/services/')) {
    const slug = cleanRoute.replace('/services/', '');
    const svc = SERVICE_META[slug];
    if (svc) {
      return {
        title: overrides?.title || svc.title,
        description: overrides?.description || svc.description,
        canonical: `${BASE_URL}/services/${slug}`,
        ogImage: overrides?.ogImage || DEFAULT_OG_IMAGE,
      };
    }
  }

  // Expert Profile match: /experts/:code or /freelancers/:code
  if (cleanRoute.startsWith('/experts/') || cleanRoute.startsWith('/freelancers/')) {
    const code = cleanRoute.replace(/^\/(experts|freelancers)\//, '').toUpperCase();
    return {
      title: overrides?.title || `Verified Expert ${code} Portfolio & Proof of Work | Gaenr`,
      description:
        overrides?.description ||
        `Review verified portfolio deliverables, active ratings, and proof of work for Gaenr Expert ${code}. Direct booking with zero platform markup.`,
      canonical: `${BASE_URL}/experts/${code}`,
      ogImage: overrides?.ogImage || DEFAULT_OG_IMAGE,
    };
  }

  // Blog Post match: /blogs/:slug or /blog/:slug
  if (cleanRoute.startsWith('/blogs/') || cleanRoute.startsWith('/blog/')) {
    const slug = cleanRoute.replace(/^\/(blogs|blog)\//, '');
    const blogMeta = BLOG_META[slug];
    return {
      title: overrides?.title || blogMeta?.title || `Gaenr Insights & Editorial | Gaenr`,
      description: overrides?.description || blogMeta?.description || `In-depth analysis and practical guides on digital outsourcing and freelancing.`,
      canonical: `${BASE_URL}/blogs/${slug}`,
      ogImage: overrides?.ogImage || DEFAULT_OG_IMAGE,
    };
  }

  // Static route match
  const staticMeta = STATIC_ROUTE_META[cleanRoute];
  if (staticMeta) {
    return {
      title: overrides?.title || staticMeta.title,
      description: overrides?.description || staticMeta.description,
      canonical: overrides?.canonical || `${BASE_URL}${cleanRoute === '/' ? '' : cleanRoute}`,
      ogImage: overrides?.ogImage || DEFAULT_OG_IMAGE,
    };
  }

  // Default fallback
  return {
    title: overrides?.title || `${SITE_NAME} - Are You #ReadyToChange?`,
    description:
      overrides?.description ||
      'Gaenr connects businesses and clients worldwide with verified student talent and digital experts with zero platform fees.',
    canonical: overrides?.canonical || `${BASE_URL}${cleanRoute}`,
    ogImage: overrides?.ogImage || DEFAULT_OG_IMAGE,
  };
}

/**
 * Updates DOM title, meta tags, and canonical links.
 */
export function updatePageMeta(route: string, overrides?: Partial<PageMeta>): void {
  if (typeof document === 'undefined') return;

  const meta = getMetaForRoute(route, overrides);

  // 1. Title
  document.title = meta.title;

  // 2. Helper to set/create meta element
  const setMetaTag = (attribute: 'name' | 'property', key: string, content: string) => {
    let el = document.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attribute, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // 3. Standard Description
  setMetaTag('name', 'description', meta.description);

  // 4. Open Graph Tags
  setMetaTag('property', 'og:title', meta.title);
  setMetaTag('property', 'og:description', meta.description);
  setMetaTag('property', 'og:url', meta.canonical || `${BASE_URL}${route}`);
  setMetaTag('property', 'og:site_name', SITE_NAME);
  setMetaTag('property', 'og:type', meta.ogType || 'website');
  if (meta.ogImage) {
    setMetaTag('property', 'og:image', meta.ogImage);
  }

  // 5. Twitter Card Tags
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', meta.title);
  setMetaTag('name', 'twitter:description', meta.description);
  setMetaTag('name', 'twitter:url', meta.canonical || `${BASE_URL}${route}`);
  if (meta.ogImage) {
    setMetaTag('name', 'twitter:image', meta.ogImage);
  }

  // 6. Canonical Link
  let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute('href', meta.canonical || `${BASE_URL}${route}`);
}
