export interface TestimonialItem {
  id: string;
  name: string;
  title: string;
  company: string;
  quote: string;
  fullQuote?: string;
  imageUrl: string;
  fallbackUrl: string;
  avatarUrl: string;
  avatarId: string;
  facebookUrl: string;
  linkedinUrl: string;
  videoTitle: string;
  isLightBg?: boolean;
}

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: 't-1',
    name: 'Darren Dunlap',
    title: 'CEO & Founder',
    company: 'Flex.co',
    quote: 'Work on your terms every day and still earn a dependable, full-time paycheck',
    fullQuote:
      "Gaenr's escrow-first approach and verified talent model is exactly what the outsourcing market needs. It removes chaotic bidding wars and replaces them with genuine accountability and swift execution.",
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    fallbackUrl: '/images/youth_corp_1.jpg',
    avatarUrl: '/images/thumb_young_biz_1_face.jpg',
    avatarId: 'avatar-m3',
    facebookUrl: 'https://www.facebook.com/gaenrglobal/',
    linkedinUrl: 'https://www.linkedin.com/company/gaenrglobal/',
    videoTitle: 'Darren Dunlap · Flex.co Founder Story',
    isLightBg: true,
  },
  {
    id: 't-2',
    name: 'Rafiqul Islam',
    title: 'Managing Director',
    company: 'Dhaka Horizon Media',
    quote:
      "Bangladesh's freelance ecosystem has long needed structured verification. Gaenr bridges the trust gap between ambitious businesses and top-tier student talent with zero platform friction.",
    fullQuote:
      "Bangladesh's freelance ecosystem has long needed structured verification. Gaenr bridges the trust gap between ambitious businesses and top-tier student talent with zero platform friction.",
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    fallbackUrl: '/images/thumb_focused_corporate_client_2.jpg',
    avatarUrl: '/images/thumb_focused_corporate_client_2.jpg',
    avatarId: 'avatar-m1',
    facebookUrl: 'https://www.facebook.com/gaenrglobal/',
    linkedinUrl: 'https://www.linkedin.com/company/gaenrglobal/',
    videoTitle: 'Rafiqul Islam · Dhaka Horizon Media Growth',
    isLightBg: false,
  },
  {
    id: 't-3',
    name: 'Nadia Chowdhury',
    title: 'Founder & CEO',
    company: 'Organic Essentials BD',
    quote:
      'As a business owner, trust and on-time delivery are non-negotiable. Gaenr’s managed milestone structure gives businesses complete confidence while empowering skilled local creators.',
    fullQuote:
      'As a business owner, trust and on-time delivery are non-negotiable. Gaenr’s managed milestone structure gives businesses complete confidence while empowering skilled local creators.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    fallbackUrl: '/images/focused_corporate_woman_1.jpg',
    avatarUrl: '/images/focused_corporate_woman_1.jpg',
    avatarId: 'avatar-f2',
    facebookUrl: 'https://www.facebook.com/gaenrglobal/',
    linkedinUrl: 'https://www.linkedin.com/company/gaenrglobal/',
    videoTitle: 'Nadia Chowdhury · Organic Essentials BD Story',
    isLightBg: false,
  },
  {
    id: 't-4',
    name: 'Tanvir Ahmed',
    title: 'Head of Product',
    company: 'Fintech Horizon',
    quote:
      'The focus on vetted skills rather than who bids the lowest rate sets a new benchmark for quality in Bangladesh. Gaenr is building a dependable ecosystem for the long run.',
    fullQuote:
      'The focus on vetted skills rather than who bids the lowest rate sets a new benchmark for quality in Bangladesh. Gaenr is building a dependable ecosystem for the long run.',
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
    fallbackUrl: '/images/thumb_biz_coffee_closeup.jpg',
    avatarUrl: '/images/thumb_biz_coffee_closeup.jpg',
    avatarId: 'avatar-m2',
    facebookUrl: 'https://www.facebook.com/gaenrglobal/',
    linkedinUrl: 'https://www.linkedin.com/company/gaenrglobal/',
    videoTitle: 'Tanvir Ahmed · Fintech Horizon Product Scalability',
    isLightBg: false,
  },
  {
    id: 't-5',
    name: 'Sarah Jenkins',
    title: 'VP of Operations',
    company: 'CloudSprint Global',
    quote:
      'Gaenr solves the two biggest pain points in offshore outsourcing: communication reliability and payment safety. Their dedicated coordination model is built for serious teams.',
    fullQuote:
      'Gaenr solves the two biggest pain points in offshore outsourcing: communication reliability and payment safety. Their dedicated coordination model is built for serious teams.',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80',
    fallbackUrl: '/images/cand_wiki_2.jpg',
    avatarUrl: '/images/cand_wiki_2.jpg',
    avatarId: 'avatar-f1',
    facebookUrl: 'https://www.facebook.com/gaenrglobal/',
    linkedinUrl: 'https://www.linkedin.com/company/gaenrglobal/',
    videoTitle: 'Sarah Jenkins · CloudSprint Operations Case Study',
    isLightBg: true,
  },
  {
    id: 't-6',
    name: 'Mahmudul Hasan',
    title: 'E-commerce Director',
    company: 'UrbanStyle',
    quote:
      'The direct talent matching and escrow protection make Gaenr a breath of fresh air. A trustworthy, streamlined platform that genuinely protects both the client and the expert.',
    fullQuote:
      'The direct talent matching and escrow protection make Gaenr a breath of fresh air. A trustworthy, streamlined platform that genuinely protects both the client and the expert.',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80',
    fallbackUrl: '/images/thumb_eager_project_client_3.jpg',
    avatarUrl: '/images/thumb_eager_project_client_3.jpg',
    avatarId: 'avatar-m4',
    facebookUrl: 'https://www.facebook.com/gaenrglobal/',
    linkedinUrl: 'https://www.linkedin.com/company/gaenrglobal/',
    videoTitle: 'Mahmudul Hasan · UrbanStyle E-commerce Story',
    isLightBg: false,
  },
];
