import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { updatePageMeta } from '../utils/seo';
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
  ArrowLeft,
} from 'lucide-react';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: 'Freelancing in BD' | 'Guides & Tutorials' | 'Business & Outsourcing' | 'Student Freelancers' | 'Case Studies';
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
    id: 'post-0',
    slug: 'freelancing-in-bd-guide',
    title: 'Freelancing in BD: The Complete Guide to Hiring Talent & Building Remote Careers in Bangladesh',
    category: 'Freelancing in BD',
    readTime: '8 min read',
    date: 'Nov 08, 2026',
    author: {
      name: 'Gaenr',
      role: 'Official Editorial Board',
      avatar: '/logo.svg',
    },
    excerpt:
      'Everything you need to know about freelancing in BD: market economics, hiring verified student talent, escrow fund protection, top digital domains (Graphics, Web, Video), and why 0% platform commission is changing Bangladesh.',
    featured: true,
    tags: ['Freelancing in BD', 'Bangladesh Freelancing', 'Hire Freelancers BD', 'Student Freelancing'],
    content: {
      intro:
        'Freelancing in BD has grown from a niche subculture of individual gig-workers into one of Bangladesh’s most vital knowledge-export engines. With over 650,000 active digital creators and hundreds of tech-forward startups, Bangladesh represents an unmatched reservoir of creative firepower. This guide breaks down how modern businesses can outsource securely and how talented university students build sustainable freelance careers on Gaenr.',
      sections: [
        {
          heading: '1. The Evolution of Freelancing in Bangladesh',
          body: [
            'Historically, freelance workers in Bangladesh depended on international platforms that imposed steep 20% platform commissions and high forex conversion deductions. Furthermore, clients overseas often lacked direct communication channels with local talent.',
            'Gaenr introduces a closed-loop managed ecosystem where businesses in Dhaka, Chittagong, and overseas hire verified student creators directly through transparent escrow milestone contracts with zero platform fees.',
          ],
          keyTakeaway: 'Local managed ecosystems eliminate marketplace cuts and guarantee quality through verified institutional portfolios.',
        },
        {
          heading: '2. Top Digital Freelancing Domains in High Demand Across BD',
          body: [
            'Businesses outsource four core digital pillars through Gaenr: 1) Graphics & Brand Identity (custom logos, pitch decks, social media kits); 2) WordPress Website Development (WooCommerce stores, Elementor layouts, Core Web Vitals speed optimization); 3) High-Retention Video Editing (reels, shorts, corporate YouTube content); 4) Strategic SEO Copywriting & Content Creation.',
            'Each project domain is manned by university students enrolled in top departments (BUET, DU, NSU, BRACU) who produce modern, responsive deliverables without bloated generic templates.',
          ],
          keyTakeaway: 'Specialized subject knowledge produces vastly superior deliverables compared to generic overseas bidding mills.',
        },
        {
          heading: '3. Escrow Security: How Gaenr Protects Clients and Freelancers in BD',
          body: [
            'The biggest risk in traditional freelancing in BD has always been payment disputes: clients fear paying upfront without work delivery, while creators fear delivering work without receiving compensation.',
            'Gaenr Escrow solves this entirely. Client deposits are held securely in reserved escrow until the deliverable is previewed and approved. Local MFS integrations (bKash, Nagad) and direct bank transfers provide frictionless, verifiable receipts for every transaction.',
          ],
          keyTakeaway: 'Milestone-based escrow releases guarantee absolute peace of mind for both outsourcer and creator.',
        },
        {
          heading: '4. How University Students Can Start Freelancing in BD Today',
          body: [
            'Unlike legacy platforms where newcomers must compete against established accounts by bidding below minimum wage, Gaenr verifies talent via real proof-of-work tests and assigns unique alphanumeric Creator Codes.',
            'Students retain 100% of their client earnings, build verifiable professional dossiers, and receive direct company testimonials that kickstart their post-graduate careers.',
          ],
          keyTakeaway: 'Proof of work replaces bidding wars, opening merit-based opportunities for young Bangladeshi talent.',
        },
      ],
      conclusion:
        'Whether you are an ambitious business owner looking to scale your marketing and web assets, or a skilled university student eager to monetize your craft, Gaenr provides the definitive, commission-free gateway to freelancing in BD.',
    },
  },
  {
    id: 'post-marketplace-bd',
    slug: 'top-freelance-marketplaces-bangladesh',
    title: 'Top Freelance Marketplaces in Bangladesh: Why Businesses & Creators Are Choosing Local Zero-Commission Platforms in BD',
    category: 'Freelancing in BD',
    readTime: '9 min read',
    date: 'Nov 07, 2026',
    author: {
      name: 'Gaenr',
      role: 'Marketplace Intelligence',
      avatar: '/logo.svg',
    },
    excerpt:
      'Compare the best freelance marketplaces in Bangladesh. Discover why traditional international bidding sites lose out to managed, zero-commission ecosystems with bKash/Nagad escrow in BD.',
    featured: false,
    tags: ['Freelance Marketplace BD', 'Best Freelancing Platform Bangladesh', 'Freelancing Website in Bangladesh', 'Freelancing in BD'],
    content: {
      intro:
        'The search for the best freelance marketplace in BD has intensified as thousands of Bangladeshi enterprises, digital agencies, and ambitious startups look to tap into local creative and technical talent. While international platforms like Upwork and Fiverr dominated the previous decade, their 20% platform commissions, complex USD withdrawal restrictions, and lack of direct dispute support have created severe friction. A new generation of managed freelancing websites in Bangladesh—led by Gaenr—is reshaping the digital workplace with zero platform markups and local escrow security.',
      sections: [
        {
          heading: '1. The State of Freelance Marketplaces in BD: Global Giants vs. Local Realities',
          body: [
            'For years, Bangladeshi freelancers and local hiring managers had no choice but to rely on Western freelance platforms. However, when a Dhaka-based e-commerce brand hires an editor on Upwork, both parties suffer: the employer pays foreign currency transaction surcharges, and the creator loses 20% of their earnings plus international wire transfer deductions.',
            'Furthermore, currency fluctuations and PayPal unavailability have historically created an artificial bottleneck for Bangladeshi talent. Today, forward-looking businesses require a modern freelance marketplace in BD that respects local payment methods (bKash, Nagad, Rocket, BEFTN) while maintaining international deliverable standards.',
          ],
          keyTakeaway: 'Legacy bidding platforms extract 20% to 30% of total project value in fees, disincentivizing top talent and inflating client costs.',
        },
        {
          heading: '2. Core Criteria for Evaluating the Best Freelancing Platform in Bangladesh',
          body: [
            'When evaluating any freelancing website in Bangladesh, business leaders and professional creators must demand four fundamental pillars:',
            'First, Escrow Fund Protection: Funds must be held in a neutral trust account and released only when milestones are validated. Second, Zero Platform Commissions: Creators should retain 100% of their compensation, ensuring maximum dedication to client briefs. Third, Institutional Vetting: Rather than allowing unverified accounts to spam proposals, platforms must review authentic proof of work. Fourth, Transparent Deliverables: Clear scope definitions that prevent scope creep and eliminate payment disagreements.',
          ],
          keyTakeaway: 'A truly reliable freelance platform combines escrow payment security with rigorous talent curation.',
        },
        {
          heading: '3. Why Gaenr is Ranked Among the Best Freelance Marketplaces in BD',
          body: [
            'Gaenr was engineered specifically to solve the inefficiencies of conventional marketplaces. By operating as a managed ecosystem rather than an anonymous open bidding board, Gaenr connects clients directly with verified student experts from premier universities (BUET, DU, NSU, BRACU, AIUB).',
            'Every Gaenr expert holds a unique alphanumeric Creator Code (e.g., GD2602001 for Graphics Design, VE2602002 for Video Editing). Clients can inspect actual Figma files, 4K video reels, and responsive WordPress sites before initiating a task. Most importantly, Gaenr takes 0% commission from creators, meaning businesses receive agency-tier execution at competitive, honest rates.',
          ],
          keyTakeaway: 'The zero-commission model guarantees that 100% of your budget goes into creative craftsmanship, not marketplace overhead.',
        },
        {
          heading: '4. The Verdict: How to Choose the Right Freelance Marketplace in BD',
          body: [
            'If you need anonymous low-bid volume where quality is secondary, legacy platforms might suffice. But if you are building a reputable brand, launching an e-commerce platform, or scaling high-retention video content in Bangladesh, Gaenr offers the unmatched advantage of vetted talent, instant local MFS deposits, and dedicated operational support.',
          ],
          keyTakeaway: 'Choose platforms that align with your operational reality: local currency, verified talent, and zero middleman markups.',
        },
      ],
      conclusion:
        'The evolution of freelancing in BD has reached an inflection point. By selecting a dedicated, commission-free freelance marketplace in BD, you empower the next generation of Bangladeshi creators while securing superior business results.',
    },
  },
  {
    id: 'post-hire-freelancers-bd',
    slug: 'how-to-hire-freelancers-in-bd',
    title: 'How to Hire Freelancers in BD: The Complete Employer’s Guide to Sourcing Top Bangladeshi Talent Without Risk',
    category: 'Freelancing in BD',
    readTime: '8 min read',
    date: 'Nov 06, 2026',
    author: {
      name: 'Gaenr',
      role: 'Client Success & Talent Team',
      avatar: '/logo.svg',
    },
    excerpt:
      'A step-by-step blueprint for businesses, agencies, and founders looking to hire freelancers in BD. Learn how to verify portfolios, protect project deposits with escrow, and scale design and tech operations in Bangladesh.',
    featured: false,
    tags: ['Hire Freelancers in BD', 'Hire Freelancers Bangladesh', 'Outsourcing in Bangladesh', 'Freelancing in BD'],
    content: {
      intro:
        'Hiring freelancers in BD has become one of the most effective strategies for companies worldwide to scale creative production, web infrastructure, and digital marketing without bloating their corporate payroll. Bangladesh boasts one of the youngest, most tech-literate populations in South Asia, with tens of thousands of skilled designers, video editors, and full-stack developers graduating every year. However, navigating unverified directories and dodging freelancer ghosting requires a systematic hiring protocol.',
      sections: [
        {
          heading: '1. Why Businesses and Global Agencies Hire Freelancers in BD',
          body: [
            'The Oxford Internet Institute consistently ranks Bangladesh among the top two global providers of online labor. Several factors make Bangladesh an exceptional hiring ground: deep English proficiency among university graduates, favorable time zone positioning (GMT+6), high familiarity with Western digital aesthetics, and an exceptional cost-to-performance ratio.',
            'Whether you need a custom brand identity system, a high-converting WooCommerce storefront, or weekly high-retention YouTube video edits, hiring freelancers in BD provides agile turnaround at a fraction of traditional agency retainers.',
          ],
          keyTakeaway: 'Hiring verified Bangladeshi freelancers offers enterprise-grade output with maximum financial agility.',
        },
        {
          heading: '2. The 4 Common Traps When Hiring Freelancers in Bangladesh (And How to Avoid Them)',
          body: [
            'Hiring managers who rely on unverified social media groups or raw email proposals frequently encounter four classic roadblocks: 1) Plagiarized Portfolios: Candidates displaying templates they never designed; 2) Ghosting & Missed Deadlines: Uncommitted freelancers disappearing midway through sprints; 3) Unclear Milestone Scoping: Ambiguous briefs resulting in endless, frustrating revision cycles; 4) Payment Vulnerability: Paying advance deposits via unmonitored personal numbers with zero refund guarantees.',
            'Gaenr was structured specifically to neutralize these four traps through mandatory portfolio code verification and client-protected escrow accounts.',
          ],
          keyTakeaway: 'Never hire through unvetted channels without escrow safeguards and live, inspectable deliverables.',
        },
        {
          heading: '3. The Step-by-Step Gaenr Protocol: How to Hire Freelancers in BD Safely',
          body: [
            'To ensure flawless project delivery every time, follow this 4-step framework:',
            'Step 1 — Search Verified Categories: Browse Gaenr’s expert directory across Graphics Design, Content Writing, Video Editing, WordPress Websites, Presentation Decks, and UI/UX.',
            'Step 2 — Inspect Alphanumeric Creator Codes: Every expert has an assigned ID (such as GD2602001). Check their verified live projects, average client rating, and verified institutional background.',
            'Step 3 — Fund the Milestone in Escrow: Deposit the agreed project fee using bKash, Nagad, or direct bank transfer. Your capital is safely held in reserve while work proceeds.',
            'Step 4 — Review Deliverable & Approve Release: Once the final vector files, video exports, or staging website links are submitted and meet your exact scope, confirm approval to release payout to the expert.',
          ],
          keyTakeaway: 'Milestone escrow aligns incentives: creators work with confidence, and clients only pay for verified results.',
        },
        {
          heading: '4. Top Skillsets to Outsource When Hiring Freelancers in BD',
          body: [
            'The highest ROI hiring categories in Bangladesh include: 1) High-Retention Short-Form Video Editing (Reels, TikTok, YouTube Shorts with dynamic motion graphics); 2) Vector Brand Identity & Typography (Figma, Illustrator master files); 3) Speed-Optimized WordPress & WooCommerce Web Development; 4) Presentation Slide Decks for investor pitches and corporate briefings.',
          ],
          keyTakeaway: 'Focus your remote hiring on well-defined digital deliverables with clear technical acceptance criteria.',
        },
      ],
      conclusion:
        'Hiring freelancers in BD does not have to be a gamble. By utilizing Gaenr’s verified talent directory and escrow security, you gain an elite on-demand workforce that drives measurable growth for your business.',
    },
  },
  {
    id: 'post-student-freelancing-bd',
    slug: 'student-freelancing-in-bd-guide',
    title: 'Student Freelancing in BD: How Bangladeshi University Students Build High-Paying Remote Careers',
    category: 'Freelancing in BD',
    readTime: '10 min read',
    date: 'Nov 05, 2026',
    author: {
      name: 'Gaenr',
      role: 'Student Community & Mentorship',
      avatar: '/logo.svg',
    },
    excerpt:
      'The definitive roadmap for university students in Bangladesh looking to start freelancing. How students in BUET, DU, NSU, BRACU balance studies, bypass bidding traps, and earn 100% of their fees through Gaenr.',
    featured: false,
    tags: ['Student Freelancing BD', 'Freelancing in BD', 'Start Freelancing Bangladesh', 'Student Freelancing in Bangladesh'],
    content: {
      intro:
        'Student freelancing in BD has emerged as a transformative cultural and financial movement. Rather than waiting until graduation to build a resume or relying on traditional campus tutoring, ambitious students at BUET, Dhaka University, NSU, BRACU, AIUB, and institutions nationwide are transforming their laptop skills into lucrative freelance careers. Here is the realistic, step-by-step roadmap to start student freelancing in Bangladesh without burning out your GPA.',
      sections: [
        {
          heading: '1. Why Student Freelancing in BD is the Smartest Career Move You Can Make',
          body: [
            'The modern corporate job market no longer values generic university degrees without demonstrable proof of work. Employers look for graduates who have solved real commercial challenges, communicated with demanding clients, and delivered high-stakes projects on deadline.',
            'By engaging in student freelancing in BD, you accomplish three game-changing milestones simultaneously: you attain financial independence during university, build a verifiable portfolio of commercial deliverables, and build an entrepreneurial mindset that sets you years ahead of your graduating class.',
          ],
          keyTakeaway: 'Freelancing in university is not just about pocket money; it is the ultimate real-world business internship.',
        },
        {
          heading: '2. The 3 Biggest Roadblocks Facing Student Freelancers in Bangladesh',
          body: [
            'Most undergraduate students who attempt freelancing give up within three months due to avoidable structural hurdles:',
            'First, The Global Bidding War: Joining platforms where 80 applicants bid pennies for the same project destroys morale. Second, Payment Friction: Lacking international credit cards or PayPal accounts leaves earned money trapped offshore. Third, Academic Overwhelm: Taking on open-ended freelance contracts right before midterm exam weeks leads to missed deadlines and poor grades.',
            'Gaenr was designed by university creators to dismantle every single one of these barriers.',
          ],
          keyTakeaway: 'Bidding wars and payment friction are symptoms of flawed platforms, not a lack of talent.',
        },
        {
          heading: '3. The Gaenr Playbook: How to Launch Your Student Freelancing Journey in BD',
          body: [
            'Step 1 — Master One High-Value Skill: Choose a single high-demand lane. For visual design: Figma and Adobe Illustrator. For video: Premiere Pro, DaVinci Resolve, and After Effects. For web: responsive WordPress development, custom CSS, and Core Web Vitals optimization.',
            'Step 2 — Construct 3 Polished Concept Projects: If you do not have clients yet, build complete concept redesigns for well-known Bangladeshi companies (e.g., redesigning a local grocery delivery app or creating a dynamic promo reel for a consumer electronics startup).',
            'Step 3 — Apply for Gaenr Expert Onboarding: Submit your live deliverables to Gaenr’s review panel. Once approved, you receive an official verified Creator Code (e.g., GD2602001) and digital ID credentials.',
            'Step 4 — Receive Direct Client Tasks & Keep 100%: Gaenr assigns client briefs matching your verified specialization. You complete the deliverable, submit through our secure upload portal, and receive payment directly to your bKash or Nagad wallet with zero platform deductions.',
          ],
          keyTakeaway: 'Focus on depth of skill and live proof of work rather than mass-bidding on random jobs.',
        },
        {
          heading: '4. How to Balance University Exams and Freelancing Deliverables',
          body: [
            'Successful student freelancers apply ruthless time-blocking: dedicate 2 to 3 focused evening hours on weekdays and reserve Saturdays for deep execution sprints. During semester finals, update your Gaenr representative in advance to pause incoming project assignments.',
          ],
          keyTakeaway: 'Professional communication and calendar discipline protect both your client reputation and your GPA.',
        },
      ],
      conclusion:
        'Student freelancing in BD is your launchpad to creative mastery and financial freedom. Apply to join Gaenr today, secure your verified creator code, and start monetizing your genuine skills.',
    },
  },
  {
    id: 'post-outsourcing-in-bd',
    slug: 'freelance-outsourcing-in-bangladesh',
    title: 'Freelance Outsourcing in Bangladesh: Why Global Brands & Local Startups Are Outsourcing to BD in 2026',
    category: 'Freelancing in BD',
    readTime: '7 min read',
    date: 'Nov 04, 2026',
    author: {
      name: 'Gaenr',
      role: 'Workforce & Economic Intelligence',
      avatar: '/logo.svg',
    },
    excerpt:
      'Explore why Bangladesh is emerging as the premier hub for creative and technical freelance outsourcing in BD. Cost efficiency, English fluency, high-retention video capabilities, and managed zero-commission delivery.',
    featured: false,
    tags: ['Freelance Outsourcing BD', 'Outsourcing in Bangladesh', 'BPO Bangladesh', 'Freelancing in BD'],
    content: {
      intro:
        'Freelance outsourcing in Bangladesh has evolved far beyond low-cost data entry and basic administrative support. Today, Bangladesh stands as one of the world’s most dynamic creative hubs, powering video post-production for major international creators, building e-commerce infrastructure for fast-growing D2C brands, and designing intuitive user interfaces for venture-backed startups. Discover why both domestic enterprises and overseas businesses are making freelance outsourcing in BD their strategic competitive edge.',
      sections: [
        {
          heading: '1. The Macro Powerhouse: Bangladesh’s Digital Workforce',
          body: [
            'Bangladesh’s ICT revolution is backed by tangible structural advantages: over 650,000 active digital professionals, nationwide submarine cable fiber connectivity, and high-speed mobile internet infrastructure spanning all 64 districts. Furthermore, with an average workforce age of 27.6 years, Bangladesh possesses an inherently digital-native generation that understands modern social media culture, algorithmic engagement, and clean software aesthetics.',
            'For organizations seeking agile talent without corporate agency overhead, freelance outsourcing in BD provides an unbeatable blend of volume, speed, and creative dexterity.',
          ],
          keyTakeaway: 'A young, digitally fluent population makes Bangladesh a premier outsourcing powerhouse.',
        },
        {
          heading: '2. Comparative Cost & Efficiency: Why BD Outperforms Regional Competitors',
          body: [
            'When comparing freelance outsourcing destinations across South and Southeast Asia, Bangladesh delivers exceptional cost efficiency without compromising technical precision. Compared to Western agency rates—where video editing retainers easily exceed $3,000 to $5,000 monthly—outsourcing through Gaenr’s verified talent network in Bangladesh delivers equivalent or superior deliverables at 60% to 75% lower cost basis.',
            'Because Gaenr charges zero platform commission and operates with escrow milestone releases, both international founders and local Bangladeshi businesses get direct, unfiltered access to elite creative talent.',
          ],
          keyTakeaway: 'Outsourcing to BD unlocks immense capital efficiency, allowing companies to reinvest savings into business growth.',
        },
        {
          heading: '3. Dominant Freelance Outsourcing Domains in BD',
          body: [
            'Four primary fields dominate freelance outsourcing in Bangladesh:',
            '1. High-Retention Video Production: Editing viral TikToks, Instagram Reels, and episodic YouTube videos with kinetic captions, sound design, and color grading.',
            '2. Brand Identity & Vector Illustration: Complete corporate visual systems, logo suites, iconography, and investor pitch decks.',
            '3. Performance WordPress & WooCommerce Engineering: Lightweight, mobile-first web applications designed for rapid load times and high conversions.',
            '4. Social Media Advertising & Funnel Optimization: Setting up targeted Meta and Google ad campaigns with custom event tracking and conversion analytics.',
          ],
          keyTakeaway: 'Focus on strategic digital assets that directly impact audience acquisition and revenue conversion.',
        },
        {
          heading: '4. The Gaenr Managed Model: Enterprise Quality with Freelance Agility',
          body: [
            'Traditional outsourcing often suffers from communication lapses and inconsistent quality. Gaenr bridges this gap with its managed ecosystem: every project is assigned an operational representative, every expert is vetted by portfolio benchmarks, and all payments are secured under milestone-based escrow.',
          ],
          keyTakeaway: 'A managed freelance model provides the reliability of an agency with the cost advantage of independent talent.',
        },
      ],
      conclusion:
        'Freelance outsourcing in Bangladesh is no longer an experiment—it is the modern playbook for ambitious companies. Experience frictionless, zero-commission outsourcing with Gaenr today.',
    },
  },
  {
    id: 'post-1',
    slug: 'zero-commission-advantage-bangladesh',
    title: 'The Zero-Commission Ecosystem: Why Gaenr Connects Clients Directly to Student Talent',
    category: 'Business & Outsourcing',
    readTime: '6 min read',
    date: 'Nov 02, 2026',
    author: {
      name: 'Gaenr',
      role: 'Ecosystem Strategy',
      avatar: '/logo.svg',
    },
    excerpt:
      'Traditional global marketplaces take up to 20% commission from freelancers and charge extra conversion fees to clients. Learn why Gaenr chose a 100% direct escrow, zero-commission structure.',
    featured: false,
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
    date: 'Oct 30, 2026',
    author: {
      name: 'Gaenr',
      role: 'UI/UX & Creative Review',
      avatar: '/logo.svg',
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
    date: 'Oct 26, 2026',
    author: {
      name: 'Gaenr',
      role: 'Creative Media Lead',
      avatar: '/logo.svg',
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
    date: 'Oct 21, 2026',
    author: {
      name: 'Gaenr',
      role: 'Lead Web Engineer',
      avatar: '/logo.svg',
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
    date: 'Oct 16, 2026',
    author: {
      name: 'Gaenr',
      role: 'Trust & Verification',
      avatar: '/logo.svg',
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
    date: 'Oct 10, 2026',
    author: {
      name: 'Gaenr',
      role: 'Brand Design Case Studies',
      avatar: '/logo.svg',
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
  'Freelancing in BD',
  'Business & Outsourcing',
  'Student Freelancers',
  'Guides & Tutorials',
  'Case Studies',
] as const;

export interface BlogsPageProps {
  initialSlug?: string;
}

export const BlogsPage: React.FC<BlogsPageProps> = ({ initialSlug }) => {
  const { navigate, showToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePost, setActivePost] = useState<BlogPost | null>(() => {
    if (initialSlug) {
      const clean = initialSlug.replace(/\/+$/, '').trim().toLowerCase();
      return (
        BLOG_POSTS.find((p) => p.slug.toLowerCase() === clean) || null
      );
    }
    return null;
  });

  // Sync active post with URL changes or initialSlug prop
  useEffect(() => {
    if (initialSlug) {
      const clean = initialSlug.replace(/\/+$/, '').trim().toLowerCase();
      const match = BLOG_POSTS.find((p) => p.slug.toLowerCase() === clean);
      setActivePost(match || null);
    } else {
      setActivePost(null);
    }
  }, [initialSlug]);

  // Update document title and meta tags when reading an article
  useEffect(() => {
    if (activePost) {
      updatePageMeta(`/blogs/${activePost.slug}`, {
        title: `${activePost.title} | Gaenr Insights`,
        description: activePost.excerpt,
        canonical: `https://gaenr.com/blogs/${activePost.slug}`,
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      updatePageMeta('/blogs');
    }
  }, [activePost]);

  const openArticle = (post: BlogPost) => {
    setActivePost(post);
    navigate(`/blogs/${post.slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeArticle = () => {
    setActivePost(null);
    navigate('/blogs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const blogPostSchema = useMemo(() => {
    if (!activePost) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: activePost.title,
      description: activePost.excerpt,
      datePublished: activePost.date,
      dateModified: activePost.date,
      author: {
        '@type': 'Organization',
        name: 'Gaenr',
        url: 'https://gaenr.com',
        logo: 'https://gaenr.com/logo.svg',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Gaenr',
        logo: {
          '@type': 'ImageObject',
          url: 'https://gaenr.com/logo.svg',
        },
      },
      mainEntityOfPage: `https://gaenr.com/blogs/${activePost.slug}`,
      keywords: activePost.tags.join(', '),
    };
  }, [activePost]);

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
      const url = `${window.location.origin}/blogs/${post.slug}`;
      navigator.clipboard.writeText(url);
      showToast('Article link copied to clipboard!', 'success');
    }
  };

  if (activePost) {
    return (
      <div className="min-h-screen text-slate-800 antialiased pb-20">
        {blogPostSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostSchema) }}
          />
        )}

        {/* Top Sticky Navigation / Breadcrumb */}
        <div className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-30 shadow-2xs">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={closeArticle}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-[#006eff] transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to all articles</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => handleShare(activePost, e)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-[#006eff] hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-colors cursor-pointer"
                title="Share this article"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Article Content Layout */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 space-y-8">
          {/* Metadata & Title */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="px-3 py-1 rounded-full font-bold uppercase tracking-wider bg-blue-50 text-[#006eff] border border-blue-100">
                {activePost.category}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {activePost.readTime}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {activePost.date}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-snug sm:leading-tight">
              {activePost.title}
            </h1>

            {/* Author Byline: Official Gaenr Identity */}
            <div className="pt-2 flex items-center gap-3.5 border-y border-slate-100 py-4">
              <img
                src={activePost.author.avatar}
                alt={activePost.author.name}
                className="w-12 h-12 rounded-full object-contain p-2 bg-blue-50/70 border border-slate-200 shadow-2xs shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-bold text-slate-900">
                    {activePost.author.name}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100/70 text-[#0048ba]">
                    <Sparkles className="w-2.5 h-2.5" /> Verified Editorial
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  {activePost.author.role}
                </div>
              </div>
            </div>
          </div>

          {/* Intro Card */}
          <div className="bg-gradient-to-br from-blue-50/80 via-sky-50/40 to-slate-50 border border-blue-100 rounded-2xl p-5 sm:p-7 text-base sm:text-lg text-slate-800 font-medium leading-relaxed shadow-2xs">
            {activePost.content.intro}
          </div>

          {/* Article Body Sections */}
          <div className="space-y-10 pt-2 text-slate-700">
            {activePost.content.sections.map((sec, sIdx) => (
              <section key={sIdx} className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {sec.heading}
                </h2>
                {sec.body.map((para, pIdx) => (
                  <p key={pIdx} className="text-slate-700 leading-relaxed text-sm sm:text-base">
                    {para}
                  </p>
                ))}
                {sec.keyTakeaway && (
                  <div className="flex items-start gap-3 p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs sm:text-sm text-emerald-950 font-semibold shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Key Insight:</strong> {sec.keyTakeaway}</span>
                  </div>
                )}
              </section>
            ))}

            {/* Conclusion */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#006eff]">
                Key Takeaway &amp; Conclusion
              </span>
              <p className="text-slate-800 text-sm sm:text-base italic leading-relaxed">
                &ldquo;{activePost.content.conclusion}&rdquo;
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-mono text-slate-400">Topics:</span>
              {activePost.tags.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    closeArticle();
                    setSearchQuery(t);
                  }}
                  className="px-3 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-[#006eff] text-xs font-medium text-slate-600 font-mono transition-colors cursor-pointer"
                >
                  #{t}
                </button>
              ))}
            </div>

            {/* Gaenr Hiring / Talent Platform Banner */}
            <div className="bg-gradient-to-br from-[#0048ba] via-[#006eff] to-[#003d99] text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
              <div className="space-y-2 text-center sm:text-left">
                <h3 className="text-xl sm:text-2xl font-bold">
                  Hire Vetted Freelance Talent or Join Gaenr
                </h3>
                <p className="text-xs sm:text-sm text-white/90 max-w-lg">
                  Gaenr connects verified Bangladeshi student freelancers and top digital specialists directly with businesses worldwide without excessive marketplace cuts.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => navigate('/freelancers')}
                  className="w-full sm:w-auto px-5 py-3 bg-white text-[#0048ba] hover:bg-slate-100 font-bold rounded-xl text-xs transition-all shadow-sm cursor-pointer"
                >
                  Explore Talent
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/join-as-expert')}
                  className="w-full sm:w-auto px-5 py-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl text-xs transition-all border border-white/30 cursor-pointer"
                >
                  Join as Expert
                </button>
              </div>
            </div>

            {/* Related Articles Section */}
            <div className="space-y-4 pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  Related Guides &amp; Insights
                </h3>
                <button
                  type="button"
                  onClick={closeArticle}
                  className="text-xs font-bold text-[#006eff] hover:underline cursor-pointer"
                >
                  View All &rarr;
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {BLOG_POSTS.filter((p) => p.id !== activePost.id)
                  .slice(0, 3)
                  .map((relPost) => (
                    <div
                      key={relPost.id}
                      onClick={() => openArticle(relPost)}
                      className="p-4 bg-white border border-slate-200 hover:border-blue-400 rounded-2xl shadow-2xs hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
                    >
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono font-bold uppercase text-[#006eff]">
                          {relPost.category}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#006eff] transition-colors line-clamp-2">
                          {relPost.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {relPost.excerpt}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-[#006eff] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Read</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Bottom Back Button */}
            <div className="pt-6 text-center">
              <button
                type="button"
                onClick={closeArticle}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Blog Directory</span>
              </button>
            </div>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-800 antialiased space-y-10 sm:space-y-12 pb-20">
      {blogPostSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostSchema) }}
        />
      )}
      {/* =========================================================================
          HERO BANNER: Artistic Organic Flowing Aurora & Smooth Waves
          - Headline: Gaenr Insights & Blogs
          - Matching standard py-12 sm:py-16 banner across ecosystem
         ========================================================================= */}
      <section className="relative w-full bg-gradient-to-br from-[#0048ba] via-[#006eff] to-[#003d99] py-12 sm:py-16 px-4 sm:px-6 lg:px-8 text-center overflow-hidden isolate">
        {/* Soft Glowing Ambient Color Clouds */}
        <div className="absolute -top-24 -left-20 w-96 h-96 bg-cyan-400/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-20 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-44 bg-sky-200/15 rounded-full blur-2xl pointer-events-none" />

        {/* Artistic Layered Flowing Waves SVG */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-25"
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

          {/* Quick Keyword Discovery Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono mr-1">
              BD Focus Topics:
            </span>
            {[
              'Freelancing in BD',
              'Freelance Marketplace BD',
              'Hire Freelancers in BD',
              'Student Freelancing BD',
              'Outsourcing in Bangladesh',
            ].map((kw) => (
              <button
                key={kw}
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery(kw);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer border ${
                  searchQuery.toLowerCase() === kw.toLowerCase()
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-blue-50/70 hover:bg-blue-100/80 text-blue-700 border-blue-200/60'
                }`}
              >
                #{kw}
              </button>
            ))}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[11px] text-slate-500 hover:text-red-600 underline font-medium ml-1"
              >
                Reset Search
              </button>
            )}
          </div>
        </div>

        {/* Featured Editorial Post (shown when on "All" without search query) */}
        {selectedCategory === 'All' && !searchQuery.trim() && featuredPost && (
          <a
            href={`/blogs/${featuredPost.slug}`}
            onClick={(e) => {
              e.preventDefault();
              openArticle(featuredPost);
            }}
            className="group relative block bg-gradient-to-br from-slate-900 via-slate-850 to-blue-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl hover:shadow-2xl transition-all cursor-pointer overflow-hidden border border-slate-800 no-underline"
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
                    className="w-10 h-10 rounded-full object-contain p-1.5 bg-white border-2 border-white/30 shadow-xs"
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
          </a>
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
              <a
                key={post.id}
                href={`/blogs/${post.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  openArticle(post);
                }}
                className="group bg-white block border border-slate-200/90 hover:border-blue-300 rounded-3xl p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-5 cursor-pointer no-underline text-inherit"
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
                      className="w-7 h-7 rounded-full object-contain p-1 bg-white shrink-0 border border-slate-200 shadow-2xs"
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
              </a>
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
    </div>
  );
};
