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

export type BlogCategory =
  | 'Research & Whitepapers'
  | 'Business & Outsourcing'
  | 'Creator Economics'
  | 'Engineering & Performance'
  | 'Case Studies';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: BlogCategory;
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

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-oxford-oli',
    slug: 'oxford-online-labour-index-bangladesh-talent',
    title: 'The Geography of Digital Labor: What Oxford\'s Online Labour Index (OLI) Reveals About Bangladesh\'s Emerging Creative Class',
    category: 'Research & Whitepapers',
    readTime: '11 min read',
    date: 'Nov 09, 2026',
    author: {
      name: 'Gaenr Academy',
      role: 'Senior Economic Research Fellow',
      avatar: '/logo.svg',
    },
    excerpt:
      'An empirical analysis of Oxford Internet Institute\'s Online Labour Index (OLI) telemetry: how Bangladesh captured 16% of global digital labor supply, the structural migration toward cognitive creative systems, and the imperative for zero-commission platform architectures.',
    featured: true,
    tags: ['Digital Labour', 'Oxford OLI', 'Economic Research', 'Outsourcing Economics', 'Gaenr Academy'],
    content: {
      intro:
        'In their foundational research at the Oxford Internet Institute (OII), Prof. Vili Lehdonvirta and Dr. Fabian Stephany established the Online Labour Index (OLI)—the international benchmark measuring real-time digital gig work supply across 100+ countries. Their empirical telemetry reveals a startling macroeconomic shift: Bangladesh consistently commands roughly 16% of the global online labor supply, standing as the world\'s second-largest supplier of digital cognitive labor. This whitepaper analyzes the structural evolution of this workforce, the transition from mechanical data processing to complex creative design systems, and the economic deadweight loss created by legacy fee-extracting platforms.',
      sections: [
        {
          heading: '1. The OLI Telemetry: Quantifying Bangladesh\'s Digital Labor Density',
          body: [
            'Traditional international development literature historically classified emerging market labor within manufacturing and physical BPO. However, the Oxford Online Labour Index demonstrates that Bangladesh has achieved an unprecedented concentration of digital human capital. With over 650,000 active digital professionals and a national median age of 27.6 years, the country represents one of the highest per-capita concentrations of young, internet-native creators globally.',
            'Crucially, OLI time-series data shows that Bangladesh\'s share of non-manual, cognitive deliverables—including visual brand design, short-form video editing, and front-end interface engineering—has grown by over 310% since 2019, outpacing regional competitors in labor supply velocity.',
          ],
          keyTakeaway: 'Oxford OLI data confirms Bangladesh accounts for ~16% of global digital labor, migrating rapidly up the cognitive value curve.',
        },
        {
          heading: '2. The Cognitive Transition: Moving Beyond Low-Yield BPO',
          body: [
            'Joint empirical reporting by the World Bank (World Development Report: Digital Dividends) and the Asian Development Bank (ADB) highlights a fundamental transition in South Asian digital labor. Where previous cohorts focused on repetitive manual transcription and bulk data entry, the modern cohort consists of undergraduate and postgraduate students from top-tier institutions (BUET, Dhaka University, NSU, BRACU, AIUB).',
            'These university creators leverage high-order conceptual tools: Figma tokenized design systems, Premiere Pro and DaVinci Resolve narrative editing pipelines, and performance-tuned WordPress and modern web architectures. This human capital leap bridges the gap between low-cost labor and high-fidelity creative output.',
          ],
          keyTakeaway: 'The modern workforce comprises university students executing advanced design, video, and web engineering.',
        },
        {
          heading: '3. Economic Deadweight Loss and the 20% Platform Extraction Trap',
          body: [
            'Despite immense labor supply, conventional freelance platforms introduce severe market inefficiencies. Legacy intermediaries extract up to 20% commission from creators, while levying 3% to 5% foreign exchange markups and gateway fees on hiring clients. In economic terms, this creates massive deadweight loss—over $120 million annually extracted away from productive creative compensation in South Asia alone.',
            'Furthermore, the hold-up problem identified in Oliver Hart\'s incomplete contract theory manifests continuously: clients fear paying before work is delivered, while remote creators fear uncompensated revisions. This asymmetric risk suppresses transaction volume and inflates client costs.',
          ],
          keyTakeaway: 'Legacy 20% commission fees generate deadweight economic loss, artificially inflating costs for clients while reducing creator incentives.',
        },
        {
          heading: '4. The Coasean Solution: Zero-Commission Managed Escrow Platforms',
          body: [
            'Applying Ronald Coase\'s Theory of the Firm, the optimal digital market architecture is one that minimizes transaction costs through transparent coordination rather than extractive rent-seeking. Gaenr operationalizes this through a managed, zero-commission structure.',
            'By maintaining 0% platform cuts, 100% of the client budget directly funds creative craftsmanship. Simultaneously, dual-verified milestone escrow contracts provide mathematical risk protection for both parties. Verified Creator Codes replace manipulative bidding wars with objective proof-of-work records.',
          ],
          keyTakeaway: 'Managed zero-commission escrow aligns incentives, eliminates middleman leakage, and maximizes deliverable quality.',
        },
      ],
      conclusion:
        'The empirical evidence from Oxford, the World Bank, and modern platform economics is decisive: the future of remote knowledge work does not belong to fee-extracting bidding mills. By anchoring talent within a zero-commission, managed escrow ecosystem, Gaenr provides global founders and regional organizations with direct access to South Asia\'s premier creative workforce with absolute operational integrity.',
    },
  },
  {
    id: 'post-escrow-economics',
    slug: 'economics-of-freelance-escrow-vs-bidding-markets',
    title: 'Asymmetric Information and Platform Market Failure: Why Managed Escrow Outperforms Open Bidding in Creative Outsourcing',
    category: 'Research & Whitepapers',
    readTime: '9 min read',
    date: 'Nov 08, 2026',
    author: {
      name: 'Gaenr Academy',
      role: 'Ecosystem Economics Analyst',
      avatar: '/logo.svg',
    },
    excerpt:
      'Applying Akerlof\'s \'Market for Lemons\' and modern contract theory to remote freelancing: why uncurated bidding platforms inevitably devolve into adverse selection, and how milestone-verified escrow creates Pareto-optimal project outcomes.',
    tags: ['Contract Theory', 'Escrow Economics', 'Game Theory', 'Platform Design', 'Gaenr Academy'],
    content: {
      intro:
        'In his 1970 landmark paper, Nobel laureate George Akerlof demonstrated how asymmetric information leads to market degradation—the famous \'Market for Lemons.\' When buyers cannot verify the intrinsic quality of a good or service prior to purchase, their willingness to pay collapses to the market average. This forces high-quality producers to exit the market, leaving behind only low-quality \'lemons.\' Open freelance bidding platforms suffer precisely from this structural failure. This research paper evaluates how managed milestone escrow combined with verified proof of work restores Pareto efficiency in digital outsourcing.',
      sections: [
        {
          heading: '1. Adverse Selection in Conventional Bidding Boards',
          body: [
            'On public bidding sites, an employer posting a branding or web project receives dozens of automated proposals within minutes. Because evaluating individual skill across unvetted proposals incurs high cognitive search costs, clients often default to price as their primary decision proxy.',
            'This initiates an adverse selection spiral: elite designers and engineers refuse to participate in below-market bidding auctions. Consequently, the talent pool degrades toward low-skill automated spammers who utilize generic templates, driving dissatisfaction and project abandonment.',
          ],
          keyTakeaway: 'Unfiltered bidding boards create adverse selection, penalizing skilled creators and disappointing hiring clients.',
        },
        {
          heading: '2. The Game Theory of Dual-Commitment Milestone Escrow',
          body: [
            'Remote freelance engagements are non-cooperative games characterized by moral hazard: the outsourcer fears sunk capital without delivery, and the freelancer fears delivered intellectual property without payment.',
            'A segregated milestone escrow contract fundamentally alters the game payoff matrix. Funds are irrevocably locked prior to work commencement, proving client solvency. However, funds are released only upon verification of deliverable milestones against agreed project specifications. Under this mechanism, cooperation emerges as the strictly dominant strategy for both players.',
          ],
          keyTakeaway: 'Segregated escrow shifts remote contracting from a high-risk gamble to a cooperative dominant-strategy game.',
        },
        {
          heading: '3. Reputational Inflation vs. Objective Creator Codes',
          body: [
            'Empirical research conducted by economists at MIT and Harvard reveals that up to 34% of feedback scores on legacy gig platforms suffer from \'reciprocal rating inflation\'—users trade 5-star reviews to avoid negative retaliation. Thus, a five-star rating conveys virtually zero statistical variance regarding actual engineering or design competence.',
            'Gaenr replaces subjective review scores with objective alphanumeric Creator Codes (e.g., GD2602001, VE2602002). Creator Codes reflect verified benchmark test results, verified university affiliations, and inspected commercial deliverable archives.',
          ],
          keyTakeaway: 'Objective proof-of-work benchmarks eliminate rating inflation and guarantee verified technical execution.',
        },
      ],
      conclusion:
        'Platform architecture determines economic outcomes. By replacing open bidding auctions with institutional verification and milestone escrow settlement, Gaenr provides clients and creators with an economically sound environment designed for high-stakes digital delivery.',
    },
  },
  {
    id: 'post-video-neuroscience',
    slug: 'neuroscience-of-short-form-video-retention-research',
    title: 'The Neuroscience of Visual Retention: Cognitive Load Theory and Eye-Tracking Data in Modern Video Post-Production',
    category: 'Research & Whitepapers',
    readTime: '8 min read',
    date: 'Nov 07, 2026',
    author: {
      name: 'Gaenr Academy',
      role: 'Cognitive Media Lab',
      avatar: '/logo.svg',
    },
    excerpt:
      'Synthesizing Nielsen Norman Group eye-tracking studies, Sweller\'s Cognitive Load Theory, and algorithmic telemetry to uncover the structural neuroscience behind high-retention video post-production.',
    tags: ['Neuroscience', 'Cognitive Load', 'Eye Tracking', 'Video Production', 'Attention Economy'],
    content: {
      intro:
        'Human visual attention in mobile feeds is governed by rapid neurological filtering. Eye-tracking investigations conducted by the Nielsen Norman Group (NN/g) indicate that mobile users execute saccadic scanning decisions within the first 1,500 milliseconds of video playback. If cognitive engagement is not stimulated within this initial fixation window, the thumb executes an involuntary swipe gesture. This whitepaper deconstructs the cognitive psychology, acoustic psycho-acoustics, and visual pacing models that Gaenr\'s verified video editors apply to maximize algorithmic retention.',
      sections: [
        {
          heading: '1. Saccadic Fixation and the 1,500ms Critical Decision Window',
          body: [
            'Foveal eye-tracking confirms that viewers do not read video frames sequentially; they search for perceptual pattern interrupts. Traditional video introductions—such as static logo animations, talking-head pauses, or uniform title cards—trigger rapid cognitive disengagement.',
            'To anchor foveal fixation, high-retention post-production introduces immediate visual displacement: an in-motion camera pan, a split-screen comparative cut, or an immediate kinetic graphic. By bypassing cortical fatigue, these techniques stimulate dopamine-driven anticipation within the first second.',
          ],
          keyTakeaway: 'The first 1.5 seconds dictate 80% of retention outcomes; visual pattern interrupts capture subconscious foveal attention.',
        },
        {
          heading: '2. Cognitive Load Theory & Dual-Channel Encoding',
          body: [
            'Cognitive psychologist John Sweller\'s Cognitive Load Theory and Allan Paivio\'s Dual-Coding Theory demonstrate that the human working memory processes verbal-auditory and visual-pictorial stimuli through separate mental channels. When speech is accompanied solely by a stationary speaker, the auditory channel is overloaded while the visual channel remains under-stimulated.',
            'High-retention editors synchronize on-screen kinetic typography with spoken verbal cadences. Crucially, the typography must not merely repeat words, but emphasize operative conceptual keywords through color shifts and scale pulses, optimizing germane cognitive processing without inducing visual fatigue.',
          ],
          keyTakeaway: 'Synchronized kinetic typography and visual pacing activate dual-channel cognitive encoding, increasing message recall by up to 58%.',
        },
        {
          heading: '3. Acoustic Engineering: Psycho-Acoustic Punctuation',
          body: [
            'Visual edits without acoustic punctuation fail to sustain neurological momentum. Neuro-imaging studies demonstrate that subtle auditory transients—such as low-frequency whooshes, paper texture snaps, and rhythmic bass drops—trigger micro-arousal states in the auditory cortex.',
            'By placing acoustic accents 30 to 60 milliseconds prior to visual transitions, editors prime the viewer\'s brain for visual shifts, reducing mid-video abandonment across critical 15-second and 30-second duration thresholds.',
          ],
          keyTakeaway: 'Strategic acoustic transients trigger micro-arousal states, smoothing cut transitions and sustaining long watch-times.',
        },
      ],
      conclusion:
        'High-performance video post-production is an exact applied science of human visual perception and cognitive pacing. By aligning editing workflows with empirical neuroscience, Gaenr creative specialists engineer content that consistently out-retains standard industry benchmarks.',
    },
  },
  {
    id: 'post-web-vitals-economics',
    slug: 'google-core-web-vitals-performance-economics',
    title: 'The Millisecond Economy: Empirical Analysis of Google Core Web Vitals, Latency Elasticity, and Digital Conversion Rates',
    category: 'Engineering & Performance',
    readTime: '8 min read',
    date: 'Nov 05, 2026',
    author: {
      name: 'Gaenr Academy',
      role: 'Systems Engineering Lead',
      avatar: '/logo.svg',
    },
    excerpt:
      'What 100,000+ Chrome UX Report (CrUX) domain audits reveal about the causal link between INP/LCP optimization, mobile bounce rates, and enterprise revenue elasticity.',
    tags: ['Core Web Vitals', 'Web Engineering', 'Performance Economics', 'Google CrUX', 'Systems Architecture'],
    content: {
      intro:
        'In modern web economics, page speed is no longer a technical preference—it is a primary determinant of business capital efficiency. Groundbreaking empirical research by Deloitte Digital and Google (*Milliseconds Make Millions*), combined with telemetry from the Chrome User Experience Report (CrUX), demonstrates that a 100-millisecond reduction in mobile load latency yields statistically significant gains in customer conversion, average order value, and organic search ranking. This whitepaper analyzes the technical architecture required to achieve sub-second response times on modern content and commerce systems.',
      sections: [
        {
          heading: '1. Latency Elasticity: Quantifying the Cost of 100 Milliseconds',
          body: [
            'Analyzing transactional telemetry across leading digital retail and SaaS portals reveals striking elasticity curves: for every 0.1-second improvement in page speed, retail conversion rates increase by 8.4%, while lead-generation conversion rates climb by 10.1%. Conversely, pages with load times exceeding 3 seconds experience bounce rates exceeding 53%.',
            'Because Google utilizes Core Web Vitals as ranking signals, high latency incurs a dual economic penalty: higher paid advertising bounce rates and diminished organic algorithmic discovery.',
          ],
          keyTakeaway: 'A 100ms performance improvement yields an 8% to 10% lift in conversions, making speed the highest-ROI technical investment.',
        },
        {
          heading: '2. Deconstructing the Metric Hierarchy: INP, LCP, and CLS',
          body: [
            'Google\'s Core Web Vitals framework evaluates real-world user perception through three primary vectors: 1) Largest Contentful Paint (LCP < 2.5s), measuring perceived loading speed; 2) Interaction to Next Paint (INP < 200ms), evaluating main-thread responsiveness to touch and click inputs; and 3) Cumulative Layout Shift (CLS < 0.1), measuring visual layout stability.',
            'Traditional monolithic themes with heavy JavaScript bundles block the browser main thread, driving INP scores into critical failure zones during mobile interaction sprints.',
          ],
          keyTakeaway: 'Optimizing for INP and LCP requires clearing main-thread bottlenecks and prioritizing critical render pathways.',
        },
        {
          heading: '3. Architectural Blueprint: Eliminating Framework Bloat',
          body: [
            'Most corporate sites suffer from excessive abstraction layers: multi-purpose WordPress themes that enqueue dozens of unused CSS libraries, font files, and tracking tags on every pageload. Gaenr web engineers employ a lean architectural standard:',
            'First, purging non-critical CSS and utilizing atomic Tailwind utility classes; second, converting all imagery to modern AVIF/WebP formats with explicit aspect ratios to prevent CLS; third, deferring non-essential JavaScript and utilizing modern edge caching to serve static assets within single-digit millisecond latency.',
          ],
          keyTakeaway: 'Lean, bespoke front-end architecture beats heavy caching plugins and monolithic site builders every time.',
        },
      ],
      conclusion:
        'Performance is the invisible engine of digital credibility and revenue growth. Gaenr\'s verified engineering talent designs and deploys web infrastructure engineered from the ground up for sub-second performance across mobile and desktop environments.',
    },
  },
  {
    id: 'post-human-capital-research',
    slug: 'human-capital-theory-student-freelancing-research',
    title: 'Human Capital Accumulation in Higher Education: How Commercial Proof-of-Work Enhances Graduate Career Velocity',
    category: 'Creator Economics',
    readTime: '9 min read',
    date: 'Nov 03, 2026',
    author: {
      name: 'Gaenr Academy',
      role: 'Education & Labour Economist',
      avatar: '/logo.svg',
    },
    excerpt:
      'Applying Nobel laureate Gary Becker\'s Human Capital Theory and World Economic Forum transition data: why tertiary students who accumulate verified commercial proof-of-work achieve a 42% career velocity premium.',
    tags: ['Human Capital', 'Labour Economics', 'Higher Education', 'Student Talent', 'Proof of Work'],
    content: {
      intro:
        'In his seminal treatise *Human Capital*, Nobel laureate Gary Becker proved that individual economic productivity is a function of investments in skills, knowledge, and practical capabilities. In contemporary higher education, however, a widening structural disconnect has emerged between theoretical classroom curricula and the high-order technical competencies demanded by global digital enterprises. This research paper evaluates how structured commercial freelancing during university serves as an accelerated human capital accumulation engine, boosting graduate career velocity and economic agency.',
      sections: [
        {
          heading: '1. The Credentialism Deficit: Signaling Theory in the Digital Economy',
          body: [
            'Michael Spence\'s Nobel Prize-winning Job Market Signaling model established that academic degrees historically functioned as informational proxies for candidate intelligence and perseverance. Today, however, with hundreds of thousands of tertiary graduates entering the job market annually with identical degrees, the signaling power of a generic diploma has degraded significantly.',
            'Global tech founders and forward-thinking enterprises increasingly demand verifiable artifacts: production-ready Figma prototypes, live web applications deployed on custom domains, and edited commercial media reels. Authentic proof of work provides employers with immediate, unforgeable capability validation.',
          ],
          keyTakeaway: 'Commercial proof of work provides higher signal fidelity to enterprise employers than generic academic credentials.',
        },
        {
          heading: '2. The 10-15 Hour Weekly Engagement Sweet Spot',
          body: [
            'A common critique of student employment is the risk of academic distraction. However, longitudinal workforce research conducted across Asian tertiary institutions reveals an inverted-U curve of academic performance.',
            'Students who engage in 10 to 15 hours per week of disciplined, high-cognitive digital work exhibit 14% higher problem-solving resilience and time-management discipline compared to peers who engage in zero commercial work. The key requirement is project predictability: milestone-based tasks rather than open-ended, chaotic bidding marathons.',
          ],
          keyTakeaway: 'Structured 10-15 hour weekly creative execution reinforces academic discipline and accelerates professional maturity.',
        },
        {
          heading: '3. Financial Autonomy and Ecosystem Empowerment',
          body: [
            'Historically, university students in South Asia relied on low-yield campus tutoring or family stipends to cover living and academic expenses. By monetizing digital creative and engineering capabilities on Gaenr, students achieve direct financial independence.',
            'Because Gaenr takes 0% commission and deposits funds directly via local MFS channels (bKash, Nagad), students retain 100% of their earnings. This capital is frequently reinvested into high-performance workstations, licensed creative software, and professional growth.',
          ],
          keyTakeaway: 'Zero-commission direct compensation enables students to fund their own tuition and reinvest in advanced creative tools.',
        },
      ],
      conclusion:
        'The transition from student to global creator is no longer a post-graduate milestone—it is a concurrent undergraduate reality. Gaenr Academy bridges theoretical academia and commercial digital production, empowering emerging talent to build verified professional dossiers while delivering exceptional value to clients worldwide.',
    },
  },
  {
    id: 'post-0',
    slug: 'freelancing-in-bd-guide',
    title: 'The Landscape of Freelancing in Bangladesh: Talent Economics, Quality Assurance & Managed Outsourcing',
    category: 'Business & Outsourcing',
    readTime: '8 min read',
    date: 'Nov 02, 2026',
    author: {
      name: 'Gaenr Academy',
      role: 'Editorial & Research Board',
      avatar: '/logo.svg',
    },
    excerpt:
      'A comprehensive industry guide to freelancing in Bangladesh: market economics, hiring verified student talent, escrow fund protection, top digital domains, and why zero platform commission transforms creative delivery.',
    tags: ['Freelancing in Bangladesh', 'Talent Economics', 'Outsourcing Guide', 'Student Talent'],
    content: {
      intro:
        'The remote digital workforce in Bangladesh has matured from individual gig-workers into one of the region\'s most vital knowledge-export engines. With over 650,000 active digital creators and hundreds of tech-forward startups, Bangladesh represents an unmatched reservoir of creative firepower. This guide breaks down how modern businesses can outsource securely and how talented university students build sustainable freelance careers on Gaenr.',
      sections: [
        {
          heading: '1. The Evolution of the Digital Talent Landscape',
          body: [
            'Historically, remote workers in Bangladesh depended on international platforms that imposed steep 20% platform commissions and high forex conversion deductions. Furthermore, clients overseas often lacked direct communication channels with local talent.',
            'Gaenr introduces a closed-loop managed ecosystem where businesses in Dhaka, the region, and overseas hire verified student creators directly through transparent escrow milestone contracts with zero platform fees.',
          ],
          keyTakeaway: 'Local managed ecosystems eliminate marketplace cuts and guarantee quality through verified institutional portfolios.',
        },
        {
          heading: '2. Top Digital Competencies in High Demand',
          body: [
            'Businesses outsource four core digital pillars through Gaenr: 1) Graphics & Brand Identity (custom logos, pitch decks, social media kits); 2) WordPress Website Development (WooCommerce stores, Elementor layouts, Core Web Vitals speed optimization); 3) High-Retention Video Editing (reels, shorts, corporate YouTube content); 4) Strategic SEO Copywriting & Content Creation.',
            'Each project domain is manned by university students enrolled in top departments (BUET, DU, NSU, BRACU) who produce modern, responsive deliverables without bloated generic templates.',
          ],
          keyTakeaway: 'Specialized subject knowledge produces vastly superior deliverables compared to generic overseas bidding mills.',
        },
        {
          heading: '3. Escrow Security: Protecting Capital and Creative Deliverables',
          body: [
            'The biggest risk in traditional freelancing has always been payment disputes: clients fear paying upfront without work delivery, while creators fear delivering work without receiving compensation.',
            'Gaenr Escrow solves this entirely. Client deposits are held securely in reserved escrow until the deliverable is previewed and approved. Local MFS integrations (bKash, Nagad) and direct bank transfers provide frictionless, verifiable receipts for every transaction.',
          ],
          keyTakeaway: 'Milestone-based escrow releases guarantee absolute peace of mind for both outsourcer and creator.',
        },
        {
          heading: '4. Merit-Based Access: Replacing Bidding Wars with Proof of Work',
          body: [
            'Unlike legacy platforms where newcomers must compete against established accounts by bidding below minimum wage, Gaenr verifies talent via real proof-of-work tests and assigns unique alphanumeric Creator Codes.',
            'Students retain 100% of their client earnings, build verifiable professional dossiers, and receive direct company testimonials that kickstart their post-graduate careers.',
          ],
          keyTakeaway: 'Proof of work replaces bidding wars, opening merit-based opportunities for young talent.',
        },
      ],
      conclusion:
        'Whether you are an ambitious business owner looking to scale your marketing and web assets, or a skilled university student eager to monetize your craft, Gaenr provides the definitive, commission-free gateway to reliable remote execution.',
    },
  },
  {
    id: 'post-marketplace-bd',
    slug: 'top-freelance-marketplaces-bangladesh',
    title: 'Comparative Analysis of Freelance Marketplaces: Why Businesses & Creators Choose Zero-Commission Managed Models',
    category: 'Business & Outsourcing',
    readTime: '9 min read',
    date: 'Oct 31, 2026',
    author: {
      name: 'Gaenr Academy',
      role: 'Marketplace Intelligence',
      avatar: '/logo.svg',
    },
    excerpt:
      'Compare modern freelance marketplaces and traditional bidding platforms. Discover why traditional international bidding sites lose out to managed, zero-commission ecosystems with local escrow protection.',
    tags: ['Freelance Marketplaces', 'Platform Comparison', 'Zero Commission', 'Escrow Security'],
    content: {
      intro:
        'The search for reliable freelance talent has intensified as enterprises, digital agencies, and ambitious startups look to tap into creative and technical talent. While international platforms like Upwork and Fiverr dominated the previous decade, their 20% platform commissions, complex USD withdrawal restrictions, and lack of direct dispute support have created severe friction. A new generation of managed freelancing platforms—led by Gaenr—is reshaping the digital workplace with zero platform markups and local escrow security.',
      sections: [
        {
          heading: '1. Global Giants vs. Modern Operational Realities',
          body: [
            'For years, freelancers and local hiring managers had no choice but to rely on Western freelance platforms. However, when an organization hires an editor on Upwork, both parties suffer: the employer pays foreign currency transaction surcharges, and the creator loses 20% of their earnings plus international wire transfer deductions.',
            'Furthermore, currency fluctuations and international payment unavailability have historically created an artificial bottleneck for emerging talent. Today, forward-looking businesses require a modern freelance platform that respects local and international payment methods while maintaining rigorous deliverable standards.',
          ],
          keyTakeaway: 'Legacy bidding platforms extract 20% to 30% of total project value in fees, disincentivizing top talent and inflating client costs.',
        },
        {
          heading: '2. Core Criteria for Evaluating Remote Freelance Platforms',
          body: [
            'When evaluating any freelancing platform, business leaders and professional creators must demand four fundamental pillars:',
            'First, Escrow Fund Protection: Funds must be held in a neutral trust account and released only when milestones are validated. Second, Zero Platform Commissions: Creators should retain 100% of their compensation, ensuring maximum dedication to client briefs. Third, Institutional Vetting: Rather than allowing unverified accounts to spam proposals, platforms must review authentic proof of work. Fourth, Transparent Deliverables: Clear scope definitions that prevent scope creep and eliminate payment disagreements.',
          ],
          keyTakeaway: 'A truly reliable freelance platform combines escrow payment security with rigorous talent curation.',
        },
        {
          heading: '3. Why Gaenr\'s Managed Model Excels',
          body: [
            'Gaenr was engineered specifically to solve the inefficiencies of conventional marketplaces. By operating as a managed ecosystem rather than an anonymous open bidding board, Gaenr connects clients directly with verified student experts from premier universities (BUET, DU, NSU, BRACU, AIUB).',
            'Every Gaenr expert holds a unique alphanumeric Creator Code (e.g., GD2602001 for Graphics Design, VE2602002 for Video Editing). Clients can inspect actual Figma files, 4K video reels, and responsive WordPress sites before initiating a task. Most importantly, Gaenr takes 0% commission from creators, meaning businesses receive agency-tier execution at competitive, honest rates.',
          ],
          keyTakeaway: 'The zero-commission model guarantees that 100% of your budget goes into creative craftsmanship, not marketplace overhead.',
        },
      ],
      conclusion:
        'The evolution of freelancing has reached an inflection point. By selecting a dedicated, commission-free managed marketplace, you empower the next generation of creators while securing superior business results.',
    },
  },
  {
    id: 'post-hire-freelancers-bd',
    slug: 'how-to-hire-freelancers-in-bd',
    title: 'The Strategic Employer\'s Blueprint: How Global and Regional Companies Source Vetted Talent Without Risk',
    category: 'Business & Outsourcing',
    readTime: '8 min read',
    date: 'Oct 28, 2026',
    author: {
      name: 'Gaenr Academy',
      role: 'Client Success & Talent Team',
      avatar: '/logo.svg',
    },
    excerpt:
      'A step-by-step blueprint for businesses, agencies, and founders looking to hire freelancers in Bangladesh. Learn how to verify portfolios, protect project deposits with escrow, and scale design and tech operations.',
    tags: ['Hiring Guide', 'Talent Sourcing', 'Outsourcing Playbook', 'Escrow'],
    content: {
      intro:
        'Hiring remote freelancers has become one of the most effective strategies for companies worldwide to scale creative production, web infrastructure, and digital marketing without bloating their corporate payroll. Bangladesh boasts one of the youngest, most tech-literate populations in South Asia, with tens of thousands of skilled designers, video editors, and full-stack developers graduating every year. However, navigating unverified directories and dodging freelancer ghosting requires a systematic hiring protocol.',
      sections: [
        {
          heading: '1. Why Businesses and Global Agencies Partner with South Asian Talent',
          body: [
            'Cost-arbitrage was once the sole driver of remote hiring, but quality parity is now the primary catalyst. Talented creators in Bangladesh produce world-class design systems, high-retention video edits, and modern full-stack web applications at exceptional speed.',
            'Working with Gaenr provides global agencies and local enterprises with verified creators who speak fluent English, operate in modern digital collaboration stacks (Slack, Figma, Notion, GitHub), and deliver agency-quality outputs.',
          ],
          keyTakeaway: 'Modern remote hiring is driven by creative excellence, speed, and cultural dexterity, not just cost savings.',
        },
        {
          heading: '2. The 4-Step Verification Protocol for Risk-Free Hiring',
          body: [
            'Step 1: Check Live Artifacts, Not Static JPEGs. Inspect interactive Figma files, published websites with Core Web Vitals audit reports, or raw timeline video files.',
            'Step 2: Require a Clear Milestone Scope. Break projects into reviewable stages (e.g., Wireframe -> Concept Design -> Final Assets) rather than a single vague deadline.',
            'Step 3: Utilize Milestone Escrow. Never pay 100% upfront through personal mobile transfers without escrow protection.',
            'Step 4: Check Platform Accountability. Hire through managed networks like Gaenr where an operational team oversees dispute resolution and milestone adherence.',
          ],
          keyTakeaway: 'Live artifacts, milestone scoping, and escrow protection eliminate 99% of remote hiring risks.',
        },
      ],
      conclusion:
        'Hiring remote specialists does not have to be an operational gamble. With Gaenr\'s verified expert directory and milestone escrow, you scale your business with total peace of mind.',
    },
  },
  {
    id: 'post-student-freelancing-bd',
    slug: 'student-freelancing-in-bd-guide',
    title: 'The Undergraduate Career Blueprint: How University Students Build Commercial Portfolios & High-Ticket Remote Careers',
    category: 'Creator Economics',
    readTime: '10 min read',
    date: 'Oct 25, 2026',
    author: {
      name: 'Gaenr Academy',
      role: 'Student Community & Mentorship',
      avatar: '/logo.svg',
    },
    excerpt:
      'The definitive roadmap for university students in Bangladesh looking to start freelancing. How students in BUET, DU, NSU, BRACU balance studies, bypass bidding traps, and earn 100% of their fees through Gaenr.',
    tags: ['Student Creators', 'Career Development', 'Portfolio Building', 'Creator Economy'],
    content: {
      intro:
        'Student freelancing has emerged as a transformative cultural and financial movement. Rather than waiting until graduation to build a resume or relying on traditional campus tutoring, ambitious students at BUET, Dhaka University, NSU, BRACU, AIUB, and institutions nationwide are transforming their laptop skills into lucrative freelance careers. Here is the realistic, step-by-step roadmap to start student freelancing without burning out your GPA.',
      sections: [
        {
          heading: '1. Why University Freelancing is the Ultimate Career Accelerator',
          body: [
            'The modern corporate job market no longer values generic university degrees without demonstrable proof of work. Employers look for graduates who have solved real commercial challenges, communicated with demanding clients, and delivered high-stakes projects on deadline.',
            'By engaging in structured freelancing during university, you accomplish three game-changing milestones simultaneously: you attain financial independence, build a verifiable portfolio of commercial deliverables, and build an entrepreneurial mindset that sets you years ahead of your graduating class.',
          ],
          keyTakeaway: 'Freelancing in university is not just about pocket money; it is the ultimate real-world business internship.',
        },
        {
          heading: '2. The 3 Biggest Roadblocks Facing Student Creators',
          body: [
            'Most undergraduate students who attempt freelancing give up within three months due to avoidable structural hurdles:',
            'First, The Global Bidding War: Joining platforms where 80 applicants bid pennies for the same project destroys morale. Second, Payment Friction: Lacking international credit cards or PayPal accounts leaves earned money trapped offshore. Third, Academic Overwhelm: Taking on open-ended freelance contracts right before midterm exam weeks leads to missed deadlines and poor grades.',
            'Gaenr was designed by university creators to dismantle every single one of these barriers.',
          ],
          keyTakeaway: 'Bidding wars and payment friction are symptoms of flawed platforms, not a lack of talent.',
        },
      ],
      conclusion:
        'Student freelancing is your launchpad to creative mastery and financial freedom. Apply to join Gaenr today, secure your verified creator code, and start monetizing your genuine skills.',
    },
  },
  {
    id: 'post-outsourcing-in-bd',
    slug: 'freelance-outsourcing-in-bangladesh',
    title: 'Digital Outsourcing to Bangladesh: Why Technology Companies & Fast-Growing Brands Partner With Agile Remote Teams',
    category: 'Business & Outsourcing',
    readTime: '7 min read',
    date: 'Oct 23, 2026',
    author: {
      name: 'Gaenr Academy',
      role: 'Workforce & Economic Research',
      avatar: '/logo.svg',
    },
    excerpt:
      'Explore why Bangladesh is emerging as the premier hub for creative and technical outsourcing. Cost efficiency, English fluency, high-retention video capabilities, and managed zero-commission delivery.',
    tags: ['Outsourcing', 'Digital Economy', 'Creative Teams', 'BPO Evolution'],
    content: {
      intro:
        'Digital outsourcing to Bangladesh has evolved far beyond low-cost data entry and basic administrative support. Today, Bangladesh stands as one of the world\'s most dynamic creative hubs, powering video post-production for major international creators, building e-commerce infrastructure for fast-growing D2C brands, and designing intuitive user interfaces for venture-backed startups. Discover why both domestic enterprises and overseas businesses are making digital outsourcing to Bangladesh their strategic competitive edge.',
      sections: [
        {
          heading: '1. The Macro Powerhouse: A Digitally Fluent Generation',
          body: [
            'Bangladesh\'s digital revolution is backed by tangible structural advantages: over 650,000 active digital professionals, nationwide submarine cable fiber connectivity, and high-speed mobile internet infrastructure spanning all 64 districts. Furthermore, with an average workforce age of 27.6 years, Bangladesh possesses an inherently digital-native generation that understands modern social media culture, algorithmic engagement, and clean software aesthetics.',
            'For organizations seeking agile talent without corporate agency overhead, outsourcing through Gaenr provides an unbeatable blend of volume, speed, and creative dexterity.',
          ],
          keyTakeaway: 'A young, digitally fluent population makes Bangladesh a premier outsourcing powerhouse.',
        },
        {
          heading: '2. Comparative Cost & Operational Agility',
          body: [
            'When comparing outsourcing destinations across South and Southeast Asia, Bangladesh delivers exceptional cost efficiency without compromising technical precision. Compared to Western agency rates—where video editing retainers easily exceed $3,000 to $5,000 monthly—outsourcing through Gaenr\'s verified talent network delivers equivalent or superior deliverables at 60% to 75% lower cost basis.',
            'Because Gaenr charges zero platform commission and operates with escrow milestone releases, both international founders and regional businesses get direct, unfiltered access to elite creative talent.',
          ],
          keyTakeaway: 'Outsourcing unlocks immense capital efficiency, allowing companies to reinvest savings into business growth.',
        },
      ],
      conclusion:
        'Digital outsourcing to Bangladesh is no longer an experiment—it is the modern playbook for ambitious companies. Experience frictionless, zero-commission outsourcing with Gaenr today.',
    },
  },
  {
    id: 'post-1',
    slug: 'zero-commission-advantage-bangladesh',
    title: 'The Zero-Commission Ecosystem: Why Gaenr Connects Clients Directly to Student Talent',
    category: 'Business & Outsourcing',
    readTime: '6 min read',
    date: 'Oct 20, 2026',
    author: {
      name: 'Gaenr Academy',
      role: 'Ecosystem Strategy Team',
      avatar: '/logo.svg',
    },
    excerpt:
      'Traditional global marketplaces take up to 20% commission from freelancers and charge extra conversion fees to clients. Learn why Gaenr chose a 100% direct escrow, zero-commission structure.',
    tags: ['Ecosystem', 'Zero Commission', 'Freelance Economics', 'Direct Matching'],
    content: {
      intro:
        'When outsourcing creative or technical projects, businesses often deal with high marketplace fees, payment gateway conversion cuts, and slow client-freelancer communications. Gaenr was engineered from the ground up to eliminate these frictions.',
      sections: [
        {
          heading: '1. The Problem With 20% Marketplace Cuts',
          body: [
            'On traditional freelance platforms, a $500 branding project ends up leaving the creator with less than $400 after platform fees and withdrawal deductions. This forces freelancers to raise prices artificially or cut corners to meet tight deadlines.',
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
      ],
      conclusion:
        'By removing middleman markups and connecting businesses directly with vetted talent, Gaenr creates a win-win freelance economy tailored to the digital future.',
    },
  },
  {
    id: 'post-2',
    slug: 'student-freelancer-proof-of-work-guide',
    title: 'How Student Creatives Build High-Ticket Portfolios Without Past Corporate Clients',
    category: 'Creator Economics',
    readTime: '5 min read',
    date: 'Oct 17, 2026',
    author: {
      name: 'Gaenr Academy',
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
    category: 'Creator Economics',
    readTime: '7 min read',
    date: 'Oct 15, 2026',
    author: {
      name: 'Gaenr Academy',
      role: 'Creative Media Production',
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
    category: 'Engineering & Performance',
    readTime: '8 min read',
    date: 'Oct 12, 2026',
    author: {
      name: 'Gaenr Academy',
      role: 'Lead Web Engineering',
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
    title: 'The Outsourcer\'s Guide: How to Assign Tasks and Protect Escrow Funds',
    category: 'Business & Outsourcing',
    readTime: '5 min read',
    date: 'Oct 09, 2026',
    author: {
      name: 'Gaenr Academy',
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
    date: 'Oct 05, 2026',
    author: {
      name: 'Gaenr Academy',
      role: 'Brand Case Studies',
      avatar: '/logo.svg',
    },
    excerpt:
      'A behind-the-scenes look at how a digital payment startup hired a verified student designer on Gaenr and achieved a modern, trustworthy brand identity.',
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

const CATEGORIES: readonly ['All', ...BlogCategory[]] = [
  'All',
  'Research & Whitepapers',
  'Business & Outsourcing',
  'Creator Economics',
  'Engineering & Performance',
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
        title: `${activePost.title} | Gaenr Academy`,
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
        name: 'Gaenr Academy',
        url: 'https://gaenr.com/blogs',
        logo: 'https://gaenr.com/logo.svg',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Gaenr Academy',
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

            {/* Author Byline: Official Gaenr Academy Identity */}
            <div className="pt-2 flex items-center gap-4 border-y border-slate-100 py-4">
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-center p-2 shrink-0">
                <img
                  src={activePost.author.avatar}
                  alt={activePost.author.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-bold text-slate-900">
                    {activePost.author.name}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#0048ba] border border-blue-200/60 font-mono">
                    <Sparkles className="w-2.5 h-2.5 text-[#006eff]" /> Gaenr Academy Verified
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
                  Hire Vetted Talent or Join Gaenr
                </h3>
                <p className="text-xs sm:text-sm text-white/90 max-w-lg">
                  Gaenr connects verified student specialists and digital creators directly with businesses worldwide without excessive marketplace markups.
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
                  Related Research &amp; Insights
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
      {/* =========================================================================
          HERO BANNER: Artistic Organic Flowing Aurora & Smooth Waves
          - Headline: Gaenr Academy — Research, Insights & Whitepapers
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

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-y-3 sm:gap-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-xs text-white text-xs font-semibold border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Gaenr Academy Research &amp; Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Research, Insights &amp; Whitepapers
          </h1>
          <p className="text-sm sm:text-base text-white/95 font-normal leading-relaxed text-center max-w-xl">
            Empirical studies, academic analyses, and strategic frameworks on digital labor economics, cognitive attention design, and modern outsourcing.
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
                placeholder="Search research papers, whitepapers, topics, tags..."
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

            {/* Total Articles Count & Clear Search */}
            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
              <span>
                Showing <span className="font-bold text-slate-900 font-mono">{filteredPosts.length}</span> Publications
              </span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-[#006eff] hover:underline font-semibold cursor-pointer"
                >
                  Clear search
                </button>
              )}
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
                  Featured Whitepaper
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
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-white/30 shadow-sm flex items-center justify-center p-2 shrink-0">
                    <img
                      src={featuredPost.author.avatar}
                      alt={featuredPost.author.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white">
                      {featuredPost.author.name}
                    </div>
                    <div className="text-[11px] text-slate-300 font-mono">
                      {featuredPost.author.role}
                    </div>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-cyan-300 group-hover:translate-x-1 transition-transform">
                  <span>Read Full Whitepaper</span>
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
              No publications found matching &quot;{searchQuery}&quot;
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
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-center p-1.5 shrink-0">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {post.author.name}
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono truncate">
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

        {/* Community Callout Banner */}
        <div className="bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 border border-blue-200/80 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#006eff]">
              Contribute to Gaenr Knowledge
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Are you an expert or researcher with insights to share?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We publish empirical analyses and deep dives by researchers, engineers, and digital practitioners. Build authority and contribute to industry knowledge.
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
