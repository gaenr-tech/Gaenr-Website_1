import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  Calendar,
  Clock,
  Search,
  ArrowRight,
  Share2,
  X,
  Sparkles,
  CheckCircle2,
  Bookmark,
  TrendingUp,
} from 'lucide-react';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: 'Guides & Tutorials' | 'Business & Outsourcing' | 'Student Freelancers' | 'Case Studies';
  readTime: string;
  date: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  excerpt: string;
  featured?: boolean;
  content: {
    intro: string;
    sections: {
      heading: string;
      body: string[];
      keyTakeaway?: string;
    }[];
    conclusion: string;
  };
  tags: string[];
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'zero-commission-advantage-bangladesh',
    title: 'The Zero-Commission Ecosystem: Why Gaenr Connects Clients Directly to Student Talent',
    category: 'Business & Outsourcing',
    readTime: '6 min read',
    date: 'Oct 01, 2026',
    author: {
      name: 'Gaenr Operations Team',
      role: 'Ecosystem Strategy',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    excerpt:
      'Traditional global marketplaces take up to 20% commission from freelancers and charge extra conversion fees to clients. Learn why Gaenr chose a 100% direct escrow, zero-commission structure.',
    featured: true,
    tags: ['Ecosystem', 'Zero Commission', 'Freelance Economics', 'Bangladesh'],
    content: {
      intro:
        'When outsourcing creative or technical projects, businesses in Bangladesh and abroad often deal with high marketplace fees, payment gateway conversion cuts, and slow client-freelancer communications. Gaenr was engineered from the ground up to eliminate these frictions.',
      sections: [
        {
          heading: '1. The Problem With 20% Marketplace Cuts',
          body: [
            'On traditional freelance platforms, a \$500 branding project ends up leaving the creator with less than \$400 after platform fees and withdrawal deductions. This forces freelancers to raise prices artificially or cut corners to meet tight deadlines.',
            'Gaenr eliminates the marketplace take. 100% of the agreed client budget goes straight to the expert who delivers the work.',
          ],
          keyTakeaway: 'Zero platform commissions mean higher quality deliverables and lower costs for businesses.',
        },
        {
          heading: '2. Empowering University Students with Verified Proof of Work',
          body: [
            'Bangladesh has thousands of brilliant computer science, multimedia, and business students in institutions like BUET, DU, NSU, and BRACU who create world-class designs and web solutions.',
            'Rather than competing against bot accounts or bids on overseas platforms, Gaenr provides them with verified unique alphanumeric IDs and transparent portfolios.',
          ],
          keyTakeaway: 'Direct proof of work replaces guesswork, helping young talent build verifiable track records.',
        },
        {
          heading: '3. Built for Local Reality: Instant MFS & Direct Bank Payouts',
          body: [
            'International freelance platforms require complex offshore accounts or high-fee intermediaries. Gaenr natively integrates local MFS and BEFTN/NPSB bank transfers.',
            'Payouts are fast, frictionless, and tracked through verified internal operations dossiers.',
          ],
        },
      ],
      conclusion:
        'By removing middleman markups and connecting businesses directly with vetted talent, Gaenr creates a win-win freelance economy tailored to the digital future of Bangladesh.',
    },
  },
  {
    id: 'post-2',
    slug: 'student-freelancer-proof-of-work-guide',
    title: 'How Student Creatives Build High-Ticket Portfolios Without Past Corporate Clients',
    category: 'Student Freelancers',
    readTime: '5 min read',
    date: 'Sep 28, 2026',
    author: {
      name: 'Adnan Sami',
      role: 'Senior UI/UX Mentor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
    excerpt:
      'Struggling to land your first outsourcing client because you lack corporate case studies? Here is how to create compelling, verified proof-of-work deliverables that win clients.',
    tags: ['Portfolio', 'Students', 'UI/UX', 'Career Advice'],
    content: {
      intro:
        'The chicken-and-egg problem of freelancing: clients want to see past work, but you need clients to get past work. The solution lies in concept deliverables and redesign case studies.',
      sections: [
        {
          heading: '1. Treat Concept Projects With Commercial Rigor',
          body: [
            'Pick a local business or product you frequently use (e.g. an e-commerce grocery app, a ride-sharing interface, or a local beverage brand). Identify 3 concrete user pain points.',
            'Design the solution as if you were hired as the head of product. Document your rationale, typography decisions, and export pixel-perfect deliverables.',
          ],
          keyTakeaway: 'Clients evaluate your problem-solving process and final polish, not whether you had a corporate contract.',
        },
        {
          heading: '2. Host Everything as Accessible Live Deliverables',
          body: [
            'Do not send raw compressed zip files. Host your work on Figma prototypes, Google Drive presentation folders, or Behance showcases so clients can inspect it instantly on mobile.',
          ],
        },
      ],
      conclusion:
        'With 3 deep, well-documented concept projects, your Gaenr portfolio will outshine generic freelancers with dozens of low-effort templates.',
    },
  },
  {
    id: 'post-3',
    slug: 'video-editing-retention-playbook',
    title: 'Short-Form Video Editing Playbook: Hooking Viewers in the First 3 Seconds',
    category: 'Guides & Tutorials',
    readTime: '7 min read',
    date: 'Sep 24, 2026',
    author: {
      name: 'Fariha Rahman',
      role: 'Creative Media Lead',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    },
    excerpt:
      'TikTok, Instagram Reels, and YouTube Shorts require an entirely different editing psychology than traditional horizontal video. Master the visual retention curve.',
    tags: ['Video Editing', 'Reels', 'Social Media', 'Retention'],
    content: {
      intro:
        'Video editors who understand audience psychology command 3x higher retainers than those who only know keyboard shortcuts. Here is the retention checklist Gaenr video experts follow.',
      sections: [
        {
          heading: '1. The Visual Pattern Interrupt',
          body: [
            'The first 1.5 seconds determine whether 80% of viewers swipe away. Never start with a title card or a speaker taking a breath. Start with an in-motion camera cut or an intriguing visual question.',
          ],
          keyTakeaway: 'Lead with momentum, kinetic text overlays, and sound design accents.',
        },
        {
          heading: '2. Sound Design: The Secret Weapon of Viral Retention',
          body: [
            'Whooshes, subtle paper crunches, bass drops, and rhythmic music cuts keep human brains engaged even when speech is informational.',
          ],
        },
      ],
      conclusion:
        'Short-form editing is rhythm and storytelling compressed into 45 seconds. Master pacing and clients will line up for monthly content retainers.',
    },
  },
  {
    id: 'post-4',
    slug: 'wordpress-speed-optimization-checklist',
    title: 'Core Web Vitals for WordPress: Achieving 90+ Mobile Speed Without Theme Bloat',
    category: 'Guides & Tutorials',
    readTime: '8 min read',
    date: 'Sep 20, 2026',
    author: {
      name: 'Nayeem Chowdhury',
      role: 'Lead Web Engineer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    },
    excerpt:
      'A slow website costs businesses over 40% of their mobile conversions. Here is how our verified WordPress experts eliminate bloat and optimize LCP/INP scores.',
    tags: ['WordPress', 'Core Web Vitals', 'PageSpeed', 'Web Dev'],
    content: {
      intro:
        'Modern consumers expect page loads in under 2 seconds. When building WordPress sites for local and international businesses, performance cannot be an afterthought.',
      sections: [
        {
          heading: '1. Ditch Heavy Multi-Purpose Themes',
          body: [
            'Bloated themes load hundreds of unused CSS rules and jQuery libraries on every page. Use lightweight block builders or bespoke child themes with Tailwind or minimal utility styling.',
          ],
          keyTakeaway: 'Clean code architecture beats heavy caching plugins every single time.',
        },
        {
          heading: '2. Next-Gen Image Formats & Direct CDN Delivery',
          body: [
            'Convert all imagery to modern WebP or AVIF formats. Use responsive srcset attributes so mobile devices do not load desktop-resolution assets.',
          ],
        },
      ],
      conclusion:
        'Fast websites convert visitors into paying clients. High page speed is the highest-ROI investment for any business site.',
    },
  },
  {
    id: 'post-5',
    slug: 'outsourcing-creative-work-risk-free',
    title: 'The Outsourcer’s Guide: How to Assign Tasks and Protect Escrow Funds',
    category: 'Business & Outsourcing',
    readTime: '5 min read',
    date: 'Sep 15, 2026',
    author: {
      name: 'Gaenr Client Success',
      role: 'Trust & Verification',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    },
    excerpt:
      'Outsourcing should be empowering, not risky. Discover the best practices for scoping deliverables, setting review deadlines, and approving milestones on Gaenr.',
    tags: ['Outsourcing', 'Escrow', 'Project Management', 'Client Guide'],
    content: {
      intro:
        'Whether you are an agency owner needing extra design firepower or a startup founder building an MVP, clear task assignment prevents 95% of project misunderstandings.',
      sections: [
        {
          heading: '1. Define the Deliverable Format Upfront',
          body: [
            'Instead of requesting "a nice logo", specify: "Vector master SVG and AI files, transparent PNG for dark and light backgrounds, and 16:9 brand color guide PDF".',
          ],
          keyTakeaway: 'Unambiguous scope documents lead to fast project turnarounds without endless revision loops.',
        },
        {
          heading: '2. Leverage Gaenr Escrow Review Protocol',
          body: [
            'Funds remain securely reserved until the expert delivers the live preview link and you confirm full satisfaction.',
          ],
        },
      ],
      conclusion:
        'Transparency and clear deliverable standards make outsourcing reliable and productive for both parties.',
    },
  },
  {
    id: 'post-6',
    slug: 'case-study-dhaka-fintech-rebrand',
    title: 'Case Study: How an Emerging Fintech Rebranded in 10 Days via Student Talent',
    category: 'Case Studies',
    readTime: '6 min read',
    date: 'Sep 10, 2026',
    author: {
      name: 'Tanvir Hasan',
      role: 'Brand Designer (Expert GD2602001)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    },
    excerpt:
      'A behind-the-scenes look at how a digital payment startup in Dhaka hired a verified student designer on Gaenr and achieved a modern, trustworthy brand identity.',
    tags: ['Case Study', 'Fintech', 'Brand Design', 'Success Story'],
    content: {
      intro:
        'When PayBridge was preparing for their pre-seed funding round, their existing visual identity looked dated and generic. They needed a clean, institutional-grade rebrand on a tight schedule.',
      sections: [
        {
          heading: '1. The Creative Challenge',
          body: [
            'Traditional agencies quoted a 6-week timeline and over 200,000 BDT. The founders reached out to verified Gaenr expert GD2602001, who specializes in financial tech minimalism.',
          ],
          keyTakeaway: 'Agile student experts move faster than bloated corporate design committees.',
        },
        {
          heading: '2. The 10-Day Turnaround',
          body: [
            'Day 1-3: Competitive audit and moodboard curation.',
            'Day 4-7: Geometric logomark exploration and typography pairing.',
            'Day 8-10: Complete UI token export and brand guidelines booklet.',
          ],
        },
      ],
      conclusion:
        'PayBridge successfully launched their brand, raised capital, and continues to assign monthly collateral tasks through Gaenr.',
    },
  },
];

const CATEGORIES = [
  'All',
  'Business & Outsourcing',
  'Student Freelancers',
  'Guides & Tutorials',
  'Case Studies',
] as const;

export const BlogsPage: React.FC = () => {
  const { navigate, showToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory =
      selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPost = BLOG_POSTS.find((p) => p.featured) || BLOG_POSTS[0];

  const handleShare = (post: BlogPost, e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      const url = `${window.location.origin}/blogs#${post.slug}`;
      navigator.clipboard.writeText(url);
      showToast('Article link copied to clipboard!', 'success');
    }
  };

  return (
    <div className="min-h-screen text-slate-800 antialiased space-y-10 sm:space-y-12 pb-20">
      {/* =========================================================================
          HERO BANNER: Artistic Organic Flowing Aurora & Smooth Waves
          - Headline: Gaenr Insights & Blogs
          - Matching standard py-12 sm:py-16 banner across ecosystem
         ========================================================================= */}
      <section className="relative w-full bg-gradient-to-br from-[#0048ba] via-[#006eff] to-[#003d99] py-12 sm:py-16 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        {/* Soft Glowing Ambient Color Clouds */}
        <div className="absolute -top-24 -left-20 w-96 h-96 bg-cyan-400/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-20 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-44 bg-sky-200/15 rounded-full blur-2xl pointer-events-none" />

        {/* Artistic Layered Flowing Waves SVG */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-40 mix-blend-screen"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="blogs-wave-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#818cf8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id="blogs-wave-2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#006eff" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="blogs-wave-3" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path fill="url(#blogs-wave-1)" d="M0,128L60,144C120,160,240,192,360,181.3C480,171,600,117,720,117.3C840,117,960,171,1080,181.3C1200,192,1320,160,1380,144L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
          <path fill="url(#blogs-wave-2)" d="M0,64L48,96C96,128,192,192,288,208C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,181.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          <path fill="url(#blogs-wave-3)" d="M0,224L60,208C120,192,240,160,360,165.3C480,171,600,213,720,202.7C840,192,960,128,1080,112C1200,96,1320,128,1380,144L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
        </svg>

        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-y-3 sm:gap-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-white text-xs font-semibold border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Gaenr Ecosystem Insights</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Knowledge, Guides &amp; Stories
          </h1>
          <p className="text-sm sm:text-base text-white/95 font-normal leading-relaxed text-center max-w-xl">
            In-depth guides on outsourcing, student talent monetization, creative design systems, and freelance economics in Bangladesh.
          </p>
        </div>
      </section>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Search & Topic Filters Bar */}
        <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search articles, topics, guides, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-[#006eff] focus:outline-none transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Total Articles Count */}
            <div className="text-xs text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-900 font-mono">{filteredPosts.length}</span> Published Articles
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#006eff] text-white shadow-xs shadow-blue-500/20'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Editorial Post (shown when on "All" without search query) */}
        {selectedCategory === 'All' && !searchQuery.trim() && featuredPost && (
          <div
            onClick={() => setActivePost(featuredPost)}
            className="group relative bg-gradient-to-br from-slate-900 via-slate-850 to-blue-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl hover:shadow-2xl transition-all cursor-pointer overflow-hidden border border-slate-800"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-3xl space-y-4 sm:space-y-5">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-3 h-3 text-cyan-400" />
                  Featured Editorial
                </span>
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {featuredPost.readTime}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {featuredPost.date}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight group-hover:text-cyan-300 transition-colors leading-tight">
                {featuredPost.title}
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal line-clamp-3">
                {featuredPost.excerpt}
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={featuredPost.author.avatar}
                    alt={featuredPost.author.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                  />
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white">
                      {featuredPost.author.name}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {featuredPost.author.role}
                    </div>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-cyan-300 group-hover:translate-x-1 transition-transform">
                  <span>Read Full Article</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Articles Grid */}
        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200/90 rounded-3xl space-y-3 shadow-xs">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm sm:text-base font-semibold text-slate-800">
              No articles found matching &quot;{searchQuery}&quot;
            </p>
            <p className="text-xs text-slate-400">
              Try adjusting your search terms or filter selection.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="text-xs text-[#006eff] hover:underline font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                onClick={() => setActivePost(post)}
                className="group bg-white border border-slate-200/90 hover:border-blue-300 rounded-3xl p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-5 cursor-pointer"
              >
                <div className="space-y-3.5">
                  {/* Top Meta: Category + Read Time + Share */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#006eff] border border-blue-100 font-mono">
                      {post.category}
                    </span>
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="text-[11px] font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleShare(post, e)}
                        title="Share article link"
                        className="p-1 hover:bg-slate-100 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 group-hover:text-[#006eff] transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-xs sm:text-sm text-slate-500 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-slate-50 text-[10px] font-medium text-slate-600 border border-slate-100"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer: Author Info & Read CTA */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {post.author.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono truncate">
                        {post.date}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#006eff] shrink-0 group-hover:translate-x-1 transition-transform">
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Community Newsletter & Creator Callout */}
        <div className="bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 border border-blue-200/80 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#006eff]">
              Contribute to Gaenr Knowledge
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Are you an expert student creator with insights to share?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We publish deep dives written by Bangladeshi student freelancers and client organizations. Get published, build authority, and inspire the next generation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => navigate('/join-as-expert')}
              className="w-full sm:w-auto px-5 py-3 bg-[#006eff] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/20 cursor-pointer text-center"
            >
              Join as Verified Expert
            </button>
            <button
              onClick={() => navigate('/feedback')}
              className="w-full sm:w-auto px-5 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
            >
              Submit Article Pitch
            </button>
          </div>
        </div>
      </main>

      {/* =========================================================================
          FULL ARTICLE READER MODAL
         ========================================================================= */}
      {activePost && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setActivePost(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in overflow-y-auto"
        >
          <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full p-6 sm:p-9 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 my-auto max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#006eff] border border-blue-100 font-mono">
                  {activePost.category}
                </span>
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {activePost.readTime}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => handleShare(activePost, e)}
                  className="p-2 text-slate-400 hover:text-[#006eff] hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                  title="Share article"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActivePost(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  title="Close article"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Article Title & Author */}
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {activePost.title}
              </h1>

              <div className="flex items-center gap-3 pt-1">
                <img
                  src={activePost.author.avatar}
                  alt={activePost.author.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-slate-200"
                />
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    {activePost.author.name}
                  </div>
                  <div className="text-xs text-slate-500 font-mono flex items-center gap-2">
                    <span>{activePost.author.role}</span>
                    <span>•</span>
                    <span>{activePost.date}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div className="space-y-6 text-slate-700 text-sm sm:text-base leading-relaxed pt-2">
              <p className="text-base sm:text-lg text-slate-800 font-medium leading-relaxed bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80">
                {activePost.content.intro}
              </p>

              {activePost.content.sections.map((sec, sIdx) => (
                <div key={sIdx} className="space-y-3 pt-2">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                    {sec.heading}
                  </h3>
                  {sec.body.map((para, pIdx) => (
                    <p key={pIdx} className="text-slate-600 leading-relaxed text-sm sm:text-base">
                      {para}
                    </p>
                  ))}
                  {sec.keyTakeaway && (
                    <div className="flex items-start gap-3 p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl text-xs sm:text-sm text-[#0048ba] font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-[#006eff] shrink-0 mt-0.5" />
                      <span>{sec.keyTakeaway}</span>
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                  Final Thoughts
                </h4>
                <p className="text-slate-700 leading-relaxed italic text-sm sm:text-base">
                  &ldquo;{activePost.content.conclusion}&rdquo;
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-4">
                {activePost.tags.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-700 font-mono"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Bookmark className="w-4 h-4 text-[#006eff]" />
                <span>Gaenr Verified Editorial Publication</span>
              </div>
              <button
                type="button"
                onClick={() => setActivePost(null)}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer text-center"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
