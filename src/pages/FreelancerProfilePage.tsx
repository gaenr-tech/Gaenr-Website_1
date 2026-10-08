import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useBranding } from '../context/BrandingContext';
import { AvatarGraphic, getAvatarImageSrc, VerifiedBadge3D } from '../components/common/Avatars';
import { getGoogleDriveDirectImageUrl } from '../utils/googleDriveUpload';
import { Star, ChevronLeft, ChevronRight, Quote, Maximize2, X, EyeOff, Play, ExternalLink, Upload, Copy } from 'lucide-react';
import { PortfolioItem } from '../types';

const defaultPricingByCategory: Record<string, { serviceName: string; price: string }[]> = {
  'graphics-design': [
    { serviceName: 'Brand Logo & Core Visual Identity', price: '3,500 - 7,500' },
    { serviceName: 'Social Media Creative Suite (10 Posts)', price: '4,000 - 8,000' },
    { serviceName: 'Vector Illustration & Iconography', price: '2,500 - 5,000' },
  ],
  'content-writing': [
    { serviceName: 'SEO Long-Form Article (1,500 words)', price: '2,000 - 4,500' },
    { serviceName: 'High-Converting Website Copywriting (5 Pages)', price: '5,000 - 10,000' },
    { serviceName: 'Social Media Copy & Caption Pack (15 Posts)', price: '2,500 - 5,000' },
  ],
  'video-editing': [
    { serviceName: 'Short-Form Viral Reel / TikTok / Shorts (60s)', price: '1,500 - 3,500' },
    { serviceName: 'Full YouTube Video Editing (Up to 10 mins)', price: '4,500 - 9,000' },
    { serviceName: 'Motion Graphics & Intro Animation', price: '3,000 - 6,000' },
  ],
  'wordpress-website': [
    { serviceName: 'Landing Page Design & Speed Optimization', price: '4,500 - 8,000' },
    { serviceName: 'Full Business Website Setup (Up to 6 Pages)', price: '10,000 - 20,000' },
    { serviceName: 'WooCommerce Store Setup & Payment Gateway', price: '12,000 - 25,000' },
  ],
  'presentation-slide-design': [
    { serviceName: 'Investor Pitch Deck Redesign (10-15 Slides)', price: '4,000 - 8,000' },
    { serviceName: 'Corporate Presentation Master Deck (20 Slides)', price: '6,000 - 12,000' },
    { serviceName: 'Custom Infographic & Diagram Pack', price: '2,500 - 5,000' },
  ],
  'ux-ui-design': [
    { serviceName: 'Mobile App High-Fidelity UI Screens (5 Screens)', price: '6,000 - 12,000' },
    { serviceName: 'Full SaaS Dashboard UX/UI Architecture', price: '15,000 - 30,000' },
    { serviceName: 'Interactive Clickable Prototype (Figma)', price: '5,000 - 10,000' },
  ],
  'ad-running': [
    { serviceName: 'Meta Ads Campaign Setup & Pixel Verification', price: '3,500 - 7,000' },
    { serviceName: 'Google Search & Display Ad Strategy Setup', price: '4,000 - 8,000' },
    { serviceName: 'Monthly ROAS Optimization & A/B Testing', price: '8,000 - 15,000' },
  ],
};

interface FreelancerProfilePageProps {
  code: string;
}

// ── ZoomableImageCard ────────────────────────────────────────────────────────
// Image preview on navy background with working +/- zoom buttons (phone & desktop)
const ZoomableImageCard: React.FC<{
  src: string;
  alt: string;
  title: string;
  tools?: string[];
  externalUrl?: string;
  isExpanded?: boolean;
}> = ({ src, alt, title, tools, externalUrl, isExpanded }) => {
  const [zoom, setZoom] = useState(1);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setZoom(1);
    setHasError(false);
  }, [src]);

  const bump = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)));
  };
  const shrink = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom((z) => Math.max(0.4, +(z - 0.25).toFixed(2)));
  };

  const displaySrc = getGoogleDriveDirectImageUrl(src);
  const showExternal = externalUrl && !externalUrl.includes('drive.google.com');

  return (
    <div
      className={`w-full ${isExpanded ? 'max-w-3xl' : 'max-w-md'} rounded-xl overflow-hidden flex flex-col shadow-xl`}
      style={{ background: '#0c182c' }}
    >
      {/* Image area — navy bg, object-contain so logos/portraits show fully */}
      <div
        className="relative w-full overflow-hidden flex items-center justify-center"
        style={{ aspectRatio: '16/9', background: '#0c182c' }}
      >
        {!hasError ? (
          <img
            key={displaySrc}
            src={displaySrc}
            alt={alt}
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'center center',
              transition: 'transform 0.2s ease',
              maxHeight: '100%',
              maxWidth: '100%',
              objectFit: 'contain',
              display: 'block',
            }}
            onError={() => setHasError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400 gap-2">
            <Layers className="w-8 h-8 text-slate-500" />
            <span className="text-xs font-semibold text-slate-300">{title}</span>
          </div>
        )}
      </div>
      {/* Controls bar */}
      <div className="flex items-center justify-between px-3 py-2 border-t border-white/10" style={{ background: '#0c182c' }}>
        <div className="min-w-0 pr-2">
          <h4 className="font-bold text-white text-xs truncate">{title}</h4>
          {tools && tools.length > 0 && (
            <p className="text-[10px] text-white/50 truncate">{tools.join(' · ')}</p>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={shrink}
            disabled={zoom <= 0.4}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-base font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-colors select-none cursor-pointer"
            title="Zoom out"
          >−</button>
          <button
            type="button"
            onClick={() => setZoom(1)}
            title="Reset zoom to 100%"
            className="text-[10px] text-white/70 hover:text-white font-mono w-9 text-center cursor-pointer"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            type="button"
            onClick={bump}
            disabled={zoom >= 3}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-base font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-colors select-none cursor-pointer"
            title="Zoom in"
          >+</button>
          {showExternal && (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-7 h-7 rounded-lg bg-white/10 hover:bg-[#006eff] text-white flex items-center justify-center transition-colors"
              title="Open project link"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

// ── ZoomableEmbedCard ────────────────────────────────────────────────────────
// Figma / Drive / Docs / Loom embed with working +/- zoom (scales iframe via CSS transform)
const ZoomableEmbedCard: React.FC<{
  embedUrl: string;
  externalUrl: string;
  title: string;
  tools?: string[];
  isExpanded?: boolean;
}> = ({ embedUrl, externalUrl, title, tools, isExpanded }) => {
  const [zoom, setZoom] = useState(1);
  const bump = (e: React.MouseEvent) => { e.stopPropagation(); setZoom(z => Math.min(3, +(z + 0.5).toFixed(1))); };
  const shrink = (e: React.MouseEvent) => { e.stopPropagation(); setZoom(z => Math.max(1, +(z - 0.5).toFixed(1))); };

  return (
    <div
      className={`w-full ${isExpanded ? 'max-w-3xl' : 'max-w-md'} rounded-xl overflow-hidden flex flex-col shadow-xl`}
      style={{ background: '#0c182c' }}
    >
      {/* Embed area — iframe scaled via CSS transform */}
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: '16/9', background: '#111827' }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${100 / zoom}%`,
            height: `${100 / zoom}%`,
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
          }}
        >
          <iframe
            src={embedUrl}
            title={title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
          />
        </div>
      </div>
      {/* Controls bar */}
      <div className="flex items-center justify-between px-3 py-2 border-t border-white/10" style={{ background: '#0c182c' }}>
        <div className="min-w-0 pr-2">
          <h4 className="font-bold text-white text-xs truncate">{title}</h4>
          {tools && tools.length > 0 && (
            <p className="text-[10px] text-white/50 truncate">{tools.join(' · ')}</p>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={shrink}
            disabled={zoom <= 1}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-base font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-colors select-none"
            title="Zoom out"
          >−</button>
          <span className="text-[10px] text-white/60 font-mono w-9 text-center">{Math.round(zoom * 100)}%</span>
          <button
            type="button"
            onClick={bump}
            disabled={zoom >= 3}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-base font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-colors select-none"
            title="Zoom in"
          >+</button>
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-[#006eff] text-white flex items-center justify-center transition-colors"
            title="Open in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export const FreelancerProfilePage: React.FC<FreelancerProfilePageProps> = ({ code }) => {
  const { freelancers, isAdminLoggedIn, navigate } = useApp();
  const { branding } = useBranding();

  const [reviewIndex, setReviewIndex] = useState(0);
  const [portfolioIndex, setPortfolioIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fsZoom, setFsZoom] = useState(1);
  const [remoteExpert, setRemoteExpert] = useState<FreelancerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const expert = freelancers.find((fl) => fl.code.toLowerCase() === code.toLowerCase()) || remoteExpert;
  const reviews = expert?.reviews || [];
  const portfolioItems = expert?.portfolioItems || [];

  const totalPortfolios = portfolioItems.length;
  const validIndex = totalPortfolios > 0 ? ((portfolioIndex % totalPortfolios) + totalPortfolios) % totalPortfolios : 0;
  const currentPortfolio = portfolioItems[validIndex];

  useEffect(() => {
    setFsZoom(1);
  }, [portfolioIndex, isFullscreen]);

  useEffect(() => {
    if (expert) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    const fetchExpert = async () => {
      try {
        const apiBase = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
        const res = await fetch(`${apiBase}/api/state?_t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          const raw = data?.state?.gaenr_freelancers;
          if (raw) {
            const list: FreelancerProfile[] = JSON.parse(raw);
            const found = list.find((fl) => fl.code.toLowerCase() === code.toLowerCase());
            if (found && isMounted) {
              setRemoteExpert(found);
            }
          }
        }
      } catch (err) {
        console.warn('Failed to fetch remote state for expert profile:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchExpert();
    return () => {
      isMounted = false;
    };
  }, [code, expert]);

  const handlePrevReview = () => {
    setReviewIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const handleNextReview = () => {
    setReviewIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  const handlePrevPortfolio = () => {
    if (totalPortfolios <= 1) return;
    setPortfolioIndex((prev) => (prev <= 0 ? totalPortfolios - 1 : prev - 1));
    setFsZoom(1);
  };

  const handleNextPortfolio = () => {
    if (totalPortfolios <= 1) return;
    setPortfolioIndex((prev) => (prev >= totalPortfolios - 1 ? 0 : prev + 1));
    setFsZoom(1);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 45) {
      handleNextPortfolio();
    } else if (diff < -45) {
      handlePrevPortfolio();
    }
    setTouchStartX(null);
  };

  // Keyboard navigation & body scroll lock for Fullscreen mode
  useEffect(() => {
    if (!isFullscreen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      } else if (e.key === 'ArrowLeft') {
        handlePrevPortfolio();
      } else if (e.key === 'ArrowRight') {
        handleNextPortfolio();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen, portfolioItems.length]);

  if (isLoading && !expert) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-[#006eff] rounded-full animate-spin mb-4" />
        <p className="text-slate-500 text-sm font-medium">Loading verified expert profile...</p>
      </div>
    );
  }

  if (!expert) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Expert Profile Not Found</h2>
        <p className="text-slate-500 mb-6 text-sm max-w-md">
          The expert code <code className="font-mono text-blue-600 font-bold">{code}</code> does not exist in our talent registry.
        </p>
        <button
          onClick={() => navigate('/experts')}
          className="gaenr-btn-primary !px-6 !py-2.5 !rounded-full !text-sm cursor-pointer"
        >
          Browse All Experts
        </button>
      </div>
    );
  }

  // If expert is in draft status and current user is NOT logged in as operations staff
  if (!expert.isPublic && !isAdminLoggedIn) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-4 shadow-xs">
          <EyeOff className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Expert Profile Unavailable</h2>
        <p className="text-slate-500 mb-6 text-sm max-w-md leading-relaxed">
          Expert profile <strong className="font-mono text-slate-900">{expert.code}</strong> is currently set to private draft status and is not visible to public visitors.
        </p>
        <button
          onClick={() => navigate('/experts')}
          className="gaenr-btn-primary !px-6 !py-2.5 !rounded-full !text-sm cursor-pointer"
        >
          Browse Active Experts
        </button>
      </div>
    );
  }

  const currentReview = reviews[reviewIndex] || {
    id: 'default',
    text: 'Consistently exceptional quality and smooth delivery.',
    clientType: 'Verified Client',
    date: 'Recently',
    rating: 5,
  };

  // Helper: converts known embeddable platform URLs to an iframe-compatible src
  const getEmbedUrl = (url: string): string | null => {
    if (!url) return null;
    const cleanUrl = url.trim();

    // YouTube
    const ytMatch = cleanUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (ytMatch) return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`;

    // Vimeo
    const vimeoMatch = cleanUrl.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[3]}`;

    // Loom
    const loom = cleanUrl.match(/loom\.com\/share\/([a-zA-Z0-9]+)/);
    if (loom) return `https://www.loom.com/embed/${loom[1]}`;

    // Google Drive — file/d/{ID}/view or open?id={ID}
    const driveFile = cleanUrl.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (driveFile) return `https://drive.google.com/file/d/${driveFile[1]}/preview`;
    const driveOpen = cleanUrl.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
    if (driveOpen) return `https://drive.google.com/file/d/${driveOpen[1]}/preview`;

    // Google Docs
    const docs = cleanUrl.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/);
    if (docs) return `https://docs.google.com/document/d/${docs[1]}/preview`;

    // Google Slides (Presentations / pitch decks)
    const slides = cleanUrl.match(/docs\.google\.com\/presentation\/d\/([a-zA-Z0-9_-]+)/);
    if (slides) return `https://docs.google.com/presentation/d/${slides[1]}/embed?start=false&loop=false`;

    // Google Sheets
    const sheets = cleanUrl.match(/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
    if (sheets) return `https://docs.google.com/spreadsheets/d/${sheets[1]}/preview`;

    // Google Forms
    const forms = cleanUrl.match(/docs\.google\.com\/forms\/d\/([a-zA-Z0-9_-]+)/);
    if (forms) return `https://docs.google.com/forms/d/${forms[1]}/viewform?embedded=true`;

    // Figma (file, proto, design, board)
    if (cleanUrl.includes('figma.com/file/') || cleanUrl.includes('figma.com/proto/') ||
        cleanUrl.includes('figma.com/design/') || cleanUrl.includes('figma.com/board/'))
      return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(cleanUrl)}`;

    // Canva Presentations & Designs
    const canva = cleanUrl.match(/canva\.com\/design\/([a-zA-Z0-9_-]+)/);
    if (canva) return `${cleanUrl}${cleanUrl.includes('?') ? '&' : '?'}embed`;

    // PDF links
    if (cleanUrl.match(/\.pdf($|\?)/i)) {
      return `https://docs.google.com/viewer?url=${encodeURIComponent(cleanUrl)}&embedded=true`;
    }

    return null;
  };

  // Helper renderer for category-specific portfolio mockup cards
  const renderVisualCard = (item: PortfolioItem, index: number, isExpanded: boolean) => {
    if (!item) return null;

    // Check for direct uploaded media or submitted URL
    const activeMedia = item.mediaUrl || item.imageUrl;
    if (activeMedia) {
      const isYouTube = activeMedia.includes('youtube.com') || activeMedia.includes('youtu.be');
      const isVimeo = activeMedia.includes('vimeo.com');
      const isLoom = activeMedia.includes('loom.com');
      const isDirectVideo =
        activeMedia.endsWith('.mp4') ||
        activeMedia.endsWith('.webm') ||
        activeMedia.endsWith('.ogg') ||
        activeMedia.startsWith('data:video');

      if (isYouTube || isVimeo || isLoom || isDirectVideo || item.previewType === 'video') {
        let videoEmbedSrc = activeMedia;
        if (isYouTube) {
          const videoId = activeMedia.includes('youtu.be/')
            ? activeMedia.split('youtu.be/')[1]?.split('?')[0]
            : activeMedia.split('v=')[1]?.split('&')[0];
          videoEmbedSrc = videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : activeMedia;
        } else if (isVimeo) {
          const vimeoId = activeMedia.split('vimeo.com/').pop()?.split('?')[0];
          videoEmbedSrc = vimeoId ? `https://player.vimeo.com/video/${vimeoId}` : activeMedia;
        } else if (isLoom) {
          const loomId = activeMedia.match(/loom\.com\/share\/([a-zA-Z0-9]+)/)?.[1];
          videoEmbedSrc = loomId ? `https://www.loom.com/embed/${loomId}` : activeMedia;
        }

        const isIframeVideo = isYouTube || isVimeo || isLoom;

        return (
          <div
            className={`w-full ${isExpanded ? 'max-w-3xl' : 'max-w-md'} rounded-xl overflow-hidden flex flex-col shadow-xl`}
            style={{ background: '#0c182c' }}
          >
            {/* Always 16:9 frame — non-16:9 content is centered via object-contain */}
            <div className="w-full relative" style={{ aspectRatio: '16/9', background: '#050d1a' }}>
              {isIframeVideo ? (
                <iframe
                  src={videoEmbedSrc}
                  title={item.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (isDirectVideo || activeMedia.startsWith('data:video') || activeMedia.startsWith('http') || activeMedia.startsWith('/')) ? (
                <video
                  src={activeMedia}
                  controls
                  playsInline
                  controlsList="nodownload"
                  disablePictureInPicture
                  className="w-full h-full object-contain bg-black"
                />
              ) : (
                /* previewType=video but URL is external (e.g. social) */
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-[#006eff] flex items-center justify-center shadow-lg">
                    <Play className="w-6 h-6 text-white ml-0.5" />
                  </div>
                  <h4 className="text-sm font-bold text-white line-clamp-1">{item.title}</h4>
                  <a
                    href={activeMedia}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-slate-900 text-xs font-bold hover:bg-slate-100 transition-colors"
                  >
                    <span>Watch Video</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
            <div className="px-3 py-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/60" style={{ background: '#0c182c' }}>
              <span className="truncate max-w-[200px] text-white font-bold">{item.title}</span>
              {item.tools && item.tools.length > 0 && (
                <span className="truncate text-white/40">{item.tools.slice(0, 2).join(' · ')}</span>
              )}
            </div>
          </div>
        );
      }

      const isImage =
        activeMedia.startsWith('data:image') ||
        !!activeMedia.match(/\.(jpeg|jpg|gif|png|webp|svg)($|\?)/i) ||
        item.previewType === 'image';

      // ── Image preview → ZoomableImageCard (navy bg, object-contain, +/- zoom) ──
      if (isImage) {
        return (
          <ZoomableImageCard
            src={activeMedia}
            alt={item.title}
            title={item.title}
            tools={item.tools}
            externalUrl={item.externalUrl}
            isExpanded={isExpanded}
          />
        );
      }

      // ── Inline Embed for supported platforms ─────────────────────────────
      // Google Drive, Figma, Google Docs / Slides / Sheets, Loom, Google Forms
      const embedUrl = getEmbedUrl(activeMedia);
      if (embedUrl) {
        return (
          <ZoomableEmbedCard
            embedUrl={embedUrl}
            externalUrl={activeMedia}
            title={item.title}
            tools={item.tools}
            isExpanded={isExpanded}
          />
        );
      }

      // ── Clean external link card (non-embeddable: Behance, GitHub, etc.) ──
      // No raw URL, no expert code, no "Verified Deliverable" header — just
      // the title, description and a tap-to-open interaction.
      return (
        <div
          className={`w-full ${
            isExpanded ? 'max-w-3xl' : 'max-w-md'
          } bg-white rounded-xl border border-slate-200/90 shadow-md overflow-hidden flex flex-col`}
        >
          <a
            href={activeMedia}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4 hover:bg-slate-50/60 transition-colors group"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 group-hover:bg-blue-50 group-hover:border-blue-200 flex items-center justify-center mx-auto transition-colors">
              <ExternalLink className="w-6 h-6 text-slate-400 group-hover:text-[#006eff] transition-colors" />
            </div>
            <div className="space-y-1.5">
              <h4 className={`font-bold text-slate-900 ${isExpanded ? 'text-base' : 'text-sm'} leading-snug`}>
                {item.title}
              </h4>
              {item.description && (
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed max-w-xs mx-auto">
                  {item.description}
                </p>
              )}
            </div>
            <span className="text-xs font-semibold text-[#006eff] group-hover:underline">
              Tap to View Project →
            </span>
          </a>
          {item.tools && item.tools.length > 0 && (
            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-1.5">
              {item.tools.map((t) => (
                <span key={t} className="px-2 py-0.5 rounded text-[10px] bg-white text-slate-600 border border-slate-200 font-mono">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      );
    }


    if (item.category === 'wordpress-website') {
      const siteUrl = item.mediaUrl || item.externalUrl;

      // Both with-URL and no-URL use the same mockup card design
      // When URL exists, the whole card is a clickable link to the website
      const cardContent = (
        <div className={`w-full ${isExpanded ? 'max-w-2xl sm:max-w-3xl' : 'max-w-md'} bg-white rounded-lg border border-slate-200/90 shadow-md flex flex-col overflow-hidden text-slate-800 transition-all ${siteUrl ? 'cursor-pointer hover:shadow-lg hover:border-blue-200 active:scale-[0.99]' : ''}`}>
          {/* Browser Chrome Header */}
          <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
            </div>
            <div className="px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] sm:text-[11px] font-mono text-slate-600 flex items-center gap-1 truncate max-w-[170px] sm:max-w-[260px]">
              <span className="text-emerald-600">🔒</span>
              <span className="truncate">
                {siteUrl ? siteUrl : `https://${item.title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 18)}.com`}
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 hidden sm:inline">
              {siteUrl ? '↗ Visit' : 'WP 6.4'}
            </span>
          </div>
          {/* Website Mock Body */}
          <div className={`${isExpanded ? 'p-5 sm:p-7 space-y-4' : 'p-3 sm:p-4 space-y-2.5'} flex flex-col justify-between bg-gradient-to-b from-white to-slate-50/60`}>
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 text-[11px]">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <span className="w-4 h-4 rounded bg-[#006eff] text-white flex items-center justify-center text-[9px] font-extrabold">W</span>
                <span className="truncate max-w-[140px] sm:max-w-none">{item.title.split(' ')[0]} Official Store</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-500 text-[10px]">
                <span className="hidden sm:inline">Shop</span>
                <span className="hidden sm:inline">Collections</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#006eff] font-semibold text-[9px]">Cart (3)</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[9px] font-mono font-bold">
                {item.clientIndustry || 'WordPress & WooCommerce'}
              </div>
              <h4 className={`${isExpanded ? 'text-base sm:text-2xl' : 'text-xs sm:text-base'} font-bold text-slate-900 tracking-tight leading-snug line-clamp-2`}>
                {item.title}
              </h4>
              <p className={`${isExpanded ? 'text-xs sm:text-sm' : 'text-[10px] sm:text-[11px]'} text-slate-600 line-clamp-3 leading-relaxed`}>
                {item.description || 'Fast loading, responsive website architecture with secure payment gateway and optimized checkout.'}
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[9px] sm:text-[11px] font-mono text-slate-500">
              <span className="flex items-center gap-1 text-emerald-700 font-bold">⚡ 98 Google PageSpeed</span>
              {siteUrl ? (
                <span className="text-[#006eff] font-semibold flex items-center gap-1">
                  Click to visit <ExternalLink className="w-3 h-3" />
                </span>
              ) : (
                <span className="text-[#006eff] font-semibold">bKash Instant Pay</span>
              )}
            </div>
          </div>
        </div>
      );

      return siteUrl ? (
        <a
          href={siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="block"
        >
          {cardContent}
        </a>
      ) : cardContent;
    }


    if (item.category === 'presentation-slide-design') {
      return (
        <div className={`w-full ${isExpanded ? 'max-w-2xl sm:max-w-3xl' : 'max-w-md'} bg-white rounded-lg border border-slate-200/90 shadow-md flex flex-col justify-between ${isExpanded ? 'p-5 sm:p-7 space-y-4' : 'p-3.5 sm:p-5 space-y-2'} text-slate-900 transition-all`}>
          {/* Slide Header */}
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 text-[9px] sm:text-[10px] font-mono">
            <span className="font-bold text-[#006eff] uppercase tracking-wider">
              Investor Pitch Deck · Slide 0{index + 1}
            </span>
            <span className="text-slate-400 font-semibold">{expert.code}</span>
          </div>

          {/* Slide Headline */}
          <div className="space-y-0.5">
            <div className="inline-block px-2 py-0.5 rounded bg-blue-50 text-[#006eff] text-[9px] font-mono font-bold uppercase">
              {item.clientIndustry || 'Strategic Overview'}
            </div>
            <h4 className={`${isExpanded ? 'text-base sm:text-2xl' : 'text-xs sm:text-base'} font-extrabold text-slate-900 tracking-tight leading-tight line-clamp-2`}>
              {item.title}
            </h4>
          </div>

          {/* 3-Pillar Metric / Infographic Cards */}
          <div className="grid grid-cols-3 gap-2 py-1">
            <div className={`${isExpanded ? 'p-3' : 'p-1.5'} rounded-lg bg-slate-50 border border-slate-200 text-center space-y-0.5`}>
              <div className={`${isExpanded ? 'text-base sm:text-xl' : 'text-xs sm:text-sm'} font-extrabold text-[#006eff] font-mono`}>$4.2B</div>
              <div className="text-[8px] sm:text-[10px] text-slate-500 font-medium">TAM Size</div>
            </div>
            <div className={`${isExpanded ? 'p-3' : 'p-1.5'} rounded-lg bg-slate-50 border border-slate-200 text-center space-y-0.5`}>
              <div className={`${isExpanded ? 'text-base sm:text-xl' : 'text-xs sm:text-sm'} font-extrabold text-emerald-600 font-mono`}>+64%</div>
              <div className="text-[8px] sm:text-[10px] text-slate-500 font-medium">Margin</div>
            </div>
            <div className={`${isExpanded ? 'p-3' : 'p-1.5'} rounded-lg bg-slate-50 border border-slate-200 text-center space-y-0.5`}>
              <div className={`${isExpanded ? 'text-base sm:text-xl' : 'text-xs sm:text-sm'} font-extrabold text-indigo-600 font-mono`}>92%</div>
              <div className="text-[8px] sm:text-[10px] text-slate-500 font-medium">Retention</div>
            </div>
          </div>

          {/* Slide Footer */}
          <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between text-[8px] sm:text-[10px] font-mono text-slate-400">
            <span>CONFIDENTIAL & PROPRIETARY</span>
            <span>GAENR DECK SPECIMEN</span>
          </div>
        </div>
      );
    }

    if (item.category === 'ux-ui-design') {
      return (
        <div className={`w-full ${isExpanded ? 'max-w-2xl sm:max-w-3xl' : 'max-w-md'} bg-white rounded-lg border border-slate-200/90 shadow-md flex flex-col justify-between ${isExpanded ? 'p-5 sm:p-6 space-y-4' : 'p-3.5 sm:p-4 space-y-2'} text-slate-900 transition-all`}>
          {/* App Header & Navigation Tabs */}
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <div className="w-3.5 h-3.5 rounded bg-indigo-600 flex items-center justify-center text-[9px] text-white font-bold">F</div>
              <span className="text-[11px] font-mono truncate">Merchant Portal</span>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px]">
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium hidden sm:inline">Overview</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">Dispatch</span>
              <span className="flex items-center gap-1 text-emerald-600 font-semibold font-mono text-[9px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
              </span>
            </div>
          </div>

          {/* Main Dashboard UI Mock */}
          <div className="space-y-2 py-0.5">
            <div className="flex items-center justify-between">
              <h4 className={`${isExpanded ? 'text-base sm:text-xl' : 'text-xs sm:text-sm'} font-extrabold text-slate-900 tracking-tight line-clamp-1`}>
                {item.title}
              </h4>
              <span className="text-[9px] sm:text-[10px] font-mono text-slate-400">{expert.code}</span>
            </div>

            {/* Metric Cards Mock */}
            <div className="grid grid-cols-2 gap-2">
              <div className={`${isExpanded ? 'p-3' : 'p-2'} rounded-lg bg-indigo-50/70 border border-indigo-100`}>
                <div className="text-[9px] sm:text-[10px] text-indigo-700 font-semibold">Active Parcels</div>
                <div className={`${isExpanded ? 'text-lg sm:text-2xl' : 'text-xs sm:text-base'} font-mono font-extrabold text-indigo-950`}>1,482</div>
              </div>
              <div className={`${isExpanded ? 'p-3' : 'p-2'} rounded-lg bg-emerald-50/70 border border-emerald-100`}>
                <div className="text-[9px] sm:text-[10px] text-emerald-700 font-semibold">Success Rate</div>
                <div className={`${isExpanded ? 'text-lg sm:text-2xl' : 'text-xs sm:text-base'} font-mono font-extrabold text-emerald-950`}>99.4%</div>
              </div>
            </div>
          </div>

          {/* Footer Design System Spec */}
          <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[8px] sm:text-[10px] font-mono text-slate-500">
            <span>FIGMA SYSTEM · AUTO-LAYOUT</span>
            <span className="text-indigo-600 font-semibold">80+ COMPONENTS</span>
          </div>
        </div>
      );
    }

    if (item.previewType === 'website') {
      return (
        <div className={`w-full ${isExpanded ? 'max-w-2xl sm:max-w-3xl' : 'max-w-md'} bg-slate-950 text-white rounded-lg border border-slate-800 shadow-xl flex flex-col justify-between ${isExpanded ? 'p-5 sm:p-7' : 'p-3.5 sm:p-5'} relative overflow-hidden transition-all`}>
          {/* Browser Top Navigation Bar */}
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-800/80">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-md px-2.5 py-1 text-[9px] sm:text-[10px] font-mono text-cyan-300 truncate flex items-center gap-1.5">
              <span className="text-slate-500">https://</span>
              <span className="truncate">{item.mediaUrl?.replace(/^https?:\/\//, '') || 'verified-deliverable.com'}</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
              LIVE WEB
            </span>
          </div>

          {/* Website Hero Preview */}
          <div className={`flex flex-col items-center justify-center text-center space-y-2 ${isExpanded ? 'py-8' : 'py-4'}`}>
            <div className={`${isExpanded ? 'w-14 h-14' : 'w-10 h-10'} rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-lg`}>
              <svg className={`${isExpanded ? 'w-7 h-7' : 'w-5 h-5'} stroke-current fill-none`} viewBox="0 0 24 24" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <h4 className={`text-white font-extrabold ${isExpanded ? 'text-base sm:text-xl' : 'text-xs sm:text-sm'} tracking-tight line-clamp-1`}>
              {item.title}
            </h4>
            <p className="text-[10px] sm:text-xs text-slate-400 max-w-sm line-clamp-2">
              {item.description || 'Modern, fast-loading responsive web application optimized for conversion and cross-device performance.'}
            </p>
          </div>

          {/* Browser Footer */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[8px] sm:text-[10px] font-mono text-slate-500">
            <span>CORE WEB VITALS: 95+</span>
            <span className="text-cyan-400 font-semibold">RESPONSIVE STACK</span>
          </div>
        </div>
      );
    }

    if (item.previewType === 'video') {
      return (
        <div className={`w-full ${isExpanded ? 'max-w-2xl sm:max-w-3xl' : 'max-w-md'} bg-slate-900 rounded-lg border border-slate-800 shadow-xl flex flex-col justify-between ${isExpanded ? 'p-5 sm:p-7' : 'p-3.5 sm:p-5'} text-white relative overflow-hidden transition-all`}>
          {/* Top Studio Indicator */}
          <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono font-bold text-slate-400">
            <span className="flex items-center gap-1 text-rose-500">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              REC ● 4K 60FPS
            </span>
            <span>16:9 DCI · {expert.code}</span>
          </div>

          {/* Center Play Button and Video Title */}
          <div className={`flex flex-col items-center justify-center text-center space-y-2.5 ${isExpanded ? 'py-8' : 'py-3'}`}>
            <div className={`${isExpanded ? 'w-16 h-16 sm:w-20 sm:h-20' : 'w-12 h-12 sm:w-14 sm:h-14'} rounded-full bg-[#006eff] text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-105 ring-4 ring-white/10`}>
              <svg className={`${isExpanded ? 'w-8 h-8 sm:w-10 sm:h-10' : 'w-6 h-6 sm:w-7 sm:h-7'} fill-current translate-x-0.5`} viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <h4 className={`text-white font-extrabold ${isExpanded ? 'text-sm sm:text-xl' : 'text-xs sm:text-sm'} tracking-tight max-w-sm px-2 line-clamp-2`}>
              {item.title}
            </h4>
            {item.clientIndustry && (
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono uppercase">
                {item.clientIndustry}
              </span>
            )}
          </div>

          {/* Timeline Scrubber */}
          <div className="space-y-1 text-[8px] sm:text-[10px] font-mono text-slate-400">
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
              <div className="w-2/5 bg-[#006eff] h-full" />
            </div>
            <div className="flex items-center justify-between">
              <span>00:04:12</span>
              <span className="text-slate-500 hidden sm:inline">24-BIT 48kHz STEREO</span>
              <span>00:14:22</span>
            </div>
          </div>
        </div>
      );
    }

    if (item.previewType === 'document') {
      return (
        <div className={`w-full ${isExpanded ? 'max-w-2xl sm:max-w-3xl' : 'max-w-md'} bg-[#faf8f5] text-slate-900 rounded-lg ${isExpanded ? 'p-5 sm:p-7' : 'p-3.5 sm:p-5'} shadow-md flex flex-col justify-between overflow-hidden border border-amber-900/15 relative transition-all`}>
          {/* Editorial Header */}
          <div className="border-b-2 border-slate-900 pb-1.5 flex items-center justify-between">
            <span className="font-serif text-[9px] sm:text-xs font-bold uppercase tracking-wider text-slate-800">
              Gaenr Editorial Dispatch · Vol. {index + 1}
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] text-slate-500 font-semibold">
              {expert.code}
            </span>
          </div>

          {/* Headline */}
          <div className={`${isExpanded ? 'py-3' : 'py-1.5'} space-y-1`}>
            <h4 className={`font-serif font-extrabold ${isExpanded ? 'text-base sm:text-2xl' : 'text-xs sm:text-base'} text-slate-950 leading-snug line-clamp-2`}>
              {item.title}
            </h4>
            <div className="h-0.5 w-10 bg-slate-800" />
          </div>

          {/* Editorial Text Preview */}
          <div className={`${isExpanded ? 'text-xs sm:text-sm' : 'text-[10px] sm:text-xs'} text-slate-700 leading-relaxed font-serif py-1`}>
            <p className={`${isExpanded ? 'line-clamp-6' : 'line-clamp-4 sm:line-clamp-5'}`}>
              <span className={`${isExpanded ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-2xl'} font-bold float-left mr-1 leading-none text-slate-900`}>
                {item.description ? item.description.charAt(0) : 'T'}
              </span>
              {item.description || 'Verified published content piece written with specialized subject matter research, organic retention, and conversion-focused copy.'}
            </p>
          </div>

          {/* Editorial Footer */}
          <div className="border-t border-slate-200 pt-1.5 flex items-center justify-between text-[8px] sm:text-[10px] text-slate-500 font-mono">
            <span>VERIFIED MANUSCRIPT</span>
            <span>PAGE {index + 1} OF {portfolioItems.length}</span>
          </div>
        </div>
      );
    }

    // Default: Graphics Design & Creative Artworks
    return (
      <div
        className={`w-full ${isExpanded ? 'max-w-2xl sm:max-w-3xl' : 'max-w-md'} rounded-lg ${isExpanded ? 'p-5 sm:p-7' : 'p-4 sm:p-5'} flex flex-col justify-between border border-white/20 shadow-md relative overflow-hidden text-white transition-all`}
        style={{
          backgroundColor: item.accentColor || '#1E3A8A',
          backgroundImage: `radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 60%), linear-gradient(135deg, ${item.accentColor || '#1E3A8A'} 0%, #090d16 100%)`,
        }}
      >
        {/* Top Poster Meta */}
        <div className="flex items-center justify-between text-[9px] sm:text-xs font-mono font-bold tracking-widest uppercase opacity-85">
          <span>GAENR DESIGN SHOWCASE</span>
          <span>{expert.code}</span>
        </div>

        {/* Center Artwork Poster Composition */}
        <div className={`space-y-1.5 ${isExpanded ? 'py-6' : 'py-2.5'} text-center sm:text-left max-w-sm mx-auto sm:mx-0`}>
          <div className="inline-block px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider mb-0.5">
            {item.category.replace('-', ' ')}
          </div>
          <h4 className={`${isExpanded ? 'text-lg sm:text-3xl' : 'text-sm sm:text-xl'} font-black text-white leading-tight tracking-tight drop-shadow-sm line-clamp-2`}>
            {item.title}
          </h4>
          {item.clientIndustry && (
            <p className={`${isExpanded ? 'text-xs sm:text-sm' : 'text-[10px] sm:text-xs'} text-white/80 font-medium`}>
              {item.clientIndustry}
            </p>
          )}
        </div>

        {/* Bottom Poster Signature Bar & Palette Swatches */}
        <div className="border-t border-white/20 pt-2 flex items-center justify-between text-[8px] sm:text-[10px] font-mono font-semibold tracking-wider text-white/80">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-white/90" />
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="ml-1 text-[7px] sm:text-[8px] opacity-75">PALETTE</span>
          </div>
          <span>2026 ARCHIVE</span>
        </div>
      </div>
    );
  };

  return (
    <div className="relative max-w-xl sm:max-w-2xl mx-auto px-3.5 sm:px-6 py-6 sm:py-10 space-y-4 sm:space-y-6 text-left">
      {/* Draft banner for Operations staff */}
      {!expert.isPublic && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-amber-900 shadow-xs">
          <div className="flex items-center gap-2.5">
            <EyeOff className="w-4 h-4 text-amber-600 shrink-0" />
            <div className="text-xs">
              <span className="font-bold">Draft / Inactive Profile: </span>
              <span className="text-amber-800">Hidden from the public showcase. Visible to you as Operations staff.</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/manage/profiles')}
            className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-bold shrink-0 transition-colors cursor-pointer"
          >
            Manage Status
          </button>
        </div>
      )}

      {/* Admin Quick Operations Bar: Dedicated Portfolio Portal Access */}
      {isAdminLoggedIn && (
        <div className="mb-4 p-3 sm:p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <Upload className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Operations Control: Portfolio Portal</span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
                  {expert.portfolioItems?.length || 0} Items
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Dedicated Portal: /expert-portfolio-upload/{expert.code}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/expert-portfolio-upload/${expert.code}`);
              }}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-slate-300" />
              <span>Copy Portal Link</span>
            </button>
            <button
              type="button"
              onClick={() => navigate(`/expert-portfolio-upload/${expert.code}`)}
              className="px-3 py-1.5 bg-[#006eff] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Portal (Live Preview)</span>
            </button>
          </div>
        </div>
      )}

      {/* Soft Colorful Ambient Background Glows */}
      <div className="fixed top-0 left-1/4 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-10 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-10 left-10 w-72 h-72 bg-teal-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* =========================================================================
          1. ID CARD VIEW:
             - Centered Profile Picture at Top
             - Centered ID Code, Role & Star Rating
             - Instagram-Style Metrics (Projects, Reviews, Positive Rate)
             - Satisfaction Scale
             - Reviews (Centered Title, Bottom Slider Only)
          ========================================================================= */}
      <div className="relative bg-white/95 backdrop-blur-md border border-blue-200/70 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-[0_8px_30px_rgba(0,110,255,0.06)] space-y-4 sm:space-y-5 overflow-hidden text-center">
        {/* Top Decorative Gradient Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#006eff] via-cyan-400 to-indigo-600" />

        {/* Profile Hero Block: Centered Picture, ID, Category */}
        <div className="flex flex-col items-center justify-center space-y-2.5 pt-1">
          {/* Centered Avatar: Circular boundary filled with portrait */}
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[#006eff] to-cyan-400 p-[2.5px] shadow-lg shadow-blue-500/15 overflow-hidden">
              <div className="w-full h-full rounded-full bg-[#eef2f6] overflow-hidden flex items-center justify-center">
                <AvatarGraphic
                  id={expert.avatarId}
                  size="100%"
                  className="w-full h-full rounded-full"
                  shape="circle"
                  title={expert.code}
                />
              </div>
            </div>
            {/* Halfway inside, halfway outside avatar circular perimeter */}
            <div className="absolute bottom-[2px] right-[2px] sm:bottom-[3px] sm:right-[3px] z-10" title="Verified Expert">
              <VerifiedBadge3D size={26} className="drop-shadow-[0_0_8px_rgba(0,110,255,0.85)]" />
            </div>
          </div>

          {/* ID Code, Role & Star Rating */}
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-xl sm:text-2xl font-mono font-extrabold text-slate-900 tracking-tight leading-none">
                {expert.code}
              </h1>
              <VerifiedBadge3D size={20} title="Gaenr Verified Expert" />
            </div>
            <div className="flex items-center justify-center gap-2 pt-0.5">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 text-[#006eff] font-semibold text-[11px] sm:text-xs border border-blue-100">
                {expert.categoryTitle}
              </span>
              <div
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono font-bold text-[11px] sm:text-xs shadow-2xs ${
                  expert.reviewsCount > 0
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                }`}
              >
                <Star
                  className={`w-3 h-3 shrink-0 ${
                    expert.reviewsCount > 0
                      ? 'fill-emerald-500 text-emerald-600'
                      : 'text-slate-400'
                  }`}
                />
                <span>{expert.reviewsCount > 0 ? expert.rating.toFixed(1) : '0.0'}</span>
              </div>
            </div>
          </div>

          {/* Instagram-Style Profile Metrics Row (Projects, Reviews, Positive) */}
          <div className="grid grid-cols-3 divide-x divide-slate-200 py-2 w-full max-w-xs sm:max-w-sm mx-auto">
            <div className="px-1.5 sm:px-3 text-center">
              <div className="text-lg sm:text-2xl font-mono font-extrabold text-slate-900 leading-tight">
                {expert.completedProjects}
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
                Projects
              </div>
            </div>

            <div className="px-1.5 sm:px-3 text-center">
              <div className="text-lg sm:text-2xl font-mono font-extrabold text-slate-900 leading-tight">
                {expert.reviewsCount}
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
                Reviews
              </div>
            </div>

            <div className="px-1.5 sm:px-3 text-center">
              <div className="text-lg sm:text-2xl font-mono font-extrabold text-emerald-600 leading-tight">
                {expert.reviewsCount > 0 ? `${expert.satisfactionRate.satisfied}%` : '—'}
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
                Positive
              </div>
            </div>
          </div>
        </div>

        {/* Satisfaction Scale */}
        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/40 border border-emerald-200/70 shadow-2xs w-full space-y-2 text-left">
          <div className="flex items-center justify-between text-[11px] sm:text-xs">
            <span className="font-bold text-emerald-950 uppercase tracking-wider">
              Satisfaction Scale
            </span>
            <span className="text-emerald-700 font-extrabold font-mono">
              {expert.reviewsCount > 0 ? `${expert.satisfactionRate.satisfied}% Satisfied` : 'New Expert'}
            </span>
          </div>

          {/* Multi-segment Scale Bar */}
          <div className="h-2 sm:h-2.5 w-full bg-slate-200/80 rounded-full overflow-hidden flex shadow-inner">
            {expert.reviewsCount > 0 ? (
              <>
                <div
                  style={{ width: `${expert.satisfactionRate.satisfied}%` }}
                  className="bg-emerald-500 h-full transition-all"
                  title={`Satisfied ${expert.satisfactionRate.satisfied}%`}
                />
                <div
                  style={{ width: `${expert.satisfactionRate.neutral}%` }}
                  className="bg-amber-400 h-full transition-all"
                  title={`Neutral ${expert.satisfactionRate.neutral}%`}
                />
                <div
                  style={{ width: `${expert.satisfactionRate.unsatisfied}%` }}
                  className="bg-rose-500 h-full transition-all"
                  title={`Unsatisfied ${expert.satisfactionRate.unsatisfied}%`}
                />
              </>
            ) : (
              <div className="w-full bg-slate-200 h-full" title="Pending initial reviews" />
            )}
          </div>

          {/* Breakdown labels */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-600 font-semibold pt-0.5">
            <span className="text-emerald-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span>{expert.reviewsCount > 0 ? `${expert.satisfactionRate.satisfied}%` : '0%'} Satisfied</span>
            </span>
            <span className="text-amber-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              <span>{expert.reviewsCount > 0 ? `${expert.satisfactionRate.neutral}%` : '0%'} Neutral</span>
            </span>
            <span className="text-rose-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              <span>{expert.reviewsCount > 0 ? `${expert.satisfactionRate.unsatisfied}%` : '0%'} Unsat.</span>
            </span>
          </div>
        </div>

        {/* Reviews Section: Centered Heading, Bottom Slider Only */}
        <div className="space-y-2.5 pt-2 border-t border-slate-100 text-left">
          <div className="text-center">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 inline-block">
              Reviews
            </h3>
          </div>

          {/* Active Review Slide Card */}
          {reviews.length === 0 ? (
            <div className="p-4 bg-slate-50/80 border border-slate-200/70 rounded-xl sm:rounded-2xl text-center">
              <p className="text-xs text-slate-500">
                New verified specialist. No client reviews logged yet.
              </p>
            </div>
          ) : (
            <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-50/40 via-white to-indigo-50/30 border border-blue-100/80 rounded-xl sm:rounded-2xl space-y-2 shadow-2xs">
              <div className="flex items-start gap-2">
                <Quote className="w-3.5 h-3.5 text-[#006eff] shrink-0 mt-0.5" />
                <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed italic">
                  "{currentReview.text}"
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] sm:text-xs pt-2 border-t border-slate-100 pl-5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-slate-900">
                    {currentReview.clientName || currentReview.clientType}
                  </span>
                  {currentReview.clientName && currentReview.clientType && (
                    <span className="text-slate-500 font-medium text-[10px]">
                      ({currentReview.clientType})
                    </span>
                  )}
                  <span className="text-slate-400 text-[10px] sm:text-[11px]">· {currentReview.date}</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-600 font-bold text-[11px] sm:text-xs bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 shrink-0">
                  <Star className="w-3 h-3 fill-emerald-500 text-emerald-600" />
                  <span>{currentReview.rating ? currentReview.rating.toFixed(1) : '0.0'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Slider Navigation Only (No top controls) */}
          {reviews.length > 1 && (
            <div className="flex items-center justify-between pt-1 px-0.5">
              <button
                type="button"
                onClick={handlePrevReview}
                title="Previous review"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-600 hover:text-[#006eff] text-xs font-semibold transition-all shadow-2xs active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>

              {/* Dots Indicator */}
              <div className="flex items-center gap-1.5">
                {reviews.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setReviewIndex(idx)}
                    title={`Review ${idx + 1}`}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === reviewIndex ? 'w-5 bg-[#006eff]' : 'w-2 bg-slate-200 hover:bg-slate-300'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNextReview}
                title="Next review"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-600 hover:text-[#006eff] text-xs font-semibold transition-all shadow-2xs active:scale-95 cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          2. MY STATEMENT: Clean Card with Centered Title & Center Underline Bar
          ========================================================================= */}
      {expert.statement && expert.statement.trim().length > 0 && (
        <div className="bg-gradient-to-br from-white via-[#fcfdff] to-blue-50/25 border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs space-y-3">
          {/* Middle-Aligned Title with Center Underline Bar */}
          <div className="text-center">
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight inline-block relative">
              My Statement
              <span className="block h-0.5 w-8 bg-[#006eff] rounded-full mx-auto mt-1" />
            </h3>
          </div>

          {/* Statement Content Box */}
          <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-white/90 border border-slate-200/80 shadow-2xs">
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal text-left whitespace-pre-line">
              {expert.statement}
            </p>
          </div>
        </div>
      )}

      {/* =========================================================================
          3. MY PORTFOLIO: Light Background, Single White Border Box, No Black Border
             - Specialized responsive previews for WordPress, UX/UI, Slide, Video, Writing, Graphics
             - Fully Watermarked & Right-Click Protected
             - Direct slider inside the single clean showcase box
             - Fullscreen view support (Click to expand into immersive slider)
          ========================================================================= */}
      {portfolioItems.length > 0 && (
        <div className="bg-gradient-to-br from-white via-[#fcfdff] to-blue-50/25 border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs space-y-3">
        {/* Middle-Aligned Title with Center Underline Bar */}
        <div className="text-center">
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight inline-block relative">
            My Portfolio
            <span className="block h-0.5 w-8 bg-[#006eff] rounded-full mx-auto mt-1" />
          </h3>
        </div>

        {/* Single White Border Showcase Container */}
        <div className="rounded-xl sm:rounded-2xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden">
          {/* Main Visual Stage on Soft Light Backdrop */}
          <div
            className="relative w-full min-h-[300px] sm:min-h-[340px] bg-gradient-to-b from-slate-50 via-slate-50/70 to-slate-100/50 flex items-center justify-center select-none overflow-hidden group"
            onContextMenu={(e) => e.preventDefault()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Top-Right Fullscreen Button */}
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              title="Expand to Fullscreen"
              className="absolute top-2.5 right-2.5 z-40 px-2 py-1 rounded-lg bg-white/90 hover:bg-white text-slate-700 shadow-sm border border-slate-200/80 transition-all hover:scale-105 active:scale-95 flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5 text-[#006eff]" />
              <span className="hidden xs:inline">Fullscreen</span>
            </button>

            {/* Watermark Overlay Across the Stage - Visually layered on top, pointer-events-none preserves video controls & interaction */}
            <div
              className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center overflow-hidden select-none"
              style={{ opacity: Math.max(0.24, (branding.watermarkOpacity ?? 25) / 100) }}
            >
              {branding.repeatingWatermark ? (
                <div
                  className={`w-full h-full grid grid-cols-2 sm:grid-cols-3 gap-8 p-6 place-items-center ${
                    branding.watermarkPosition === 'diagonal' ? 'rotate-[-20deg] scale-110' : ''
                  }`}
                >
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center justify-center gap-1.5 text-center drop-shadow select-none">
                      {branding.watermarkImage && (
                        branding.watermarkImage === '/logo.svg' ? (
                          <div className="w-9 h-9 flex items-center justify-center">
                            <img src="/logo.svg" alt="Watermark" className="w-full h-full object-contain filter brightness-125" />
                          </div>
                        ) : (
                          <img
                            src={branding.watermarkImage}
                            alt="Watermark"
                            className="max-h-10 max-w-[120px] object-contain drop-shadow"
                          />
                        )
                      )}
                      <div className="text-slate-800 text-xs sm:text-sm font-black uppercase tracking-widest whitespace-nowrap">
                        {branding.watermarkText || 'GAENR VERIFIED PORTFOLIO'} · {expert.code}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full h-full relative flex items-center justify-center p-6">
                  <div
                    className={`flex flex-col items-center justify-center gap-2 text-center drop-shadow transition-all ${
                      branding.watermarkPosition === 'diagonal'
                        ? 'rotate-[-25deg]'
                        : branding.watermarkPosition === 'center'
                        ? ''
                        : 'absolute bottom-6 right-6 scale-90'
                    }`}
                  >
                    {branding.watermarkImage && (
                      branding.watermarkImage === '/logo.svg' ? (
                        <div className="w-14 h-14 flex items-center justify-center">
                          <img src="/logo.svg" alt="Watermark" className="w-full h-full object-contain filter brightness-125" />
                        </div>
                      ) : (
                        <img
                          src={branding.watermarkImage}
                          alt="Watermark"
                          className="max-h-20 max-w-[200px] object-contain drop-shadow"
                        />
                      )
                    )}
                    <div className="text-slate-800 text-xs sm:text-base font-black uppercase tracking-widest whitespace-nowrap">
                      {branding.watermarkText || 'GAENR VERIFIED PORTFOLIO'} · {expert.code}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Slider Navigation Arrows (Subtle floating arrows, touch swipe also supported) */}
            {portfolioItems.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevPortfolio}
                  title="Previous piece"
                  className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-40 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md border border-slate-200/80 flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleNextPortfolio}
                  title="Next piece"
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-40 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md border border-slate-200/80 flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Direct Visual Content Preview with Unique Key */}
            <div
              key={currentPortfolio?.id || `portfolio-card-${validIndex}`}
              className="w-full h-full flex items-center justify-center p-2.5 sm:p-4"
            >
              {renderVisualCard(currentPortfolio, validIndex, false)}
            </div>
          </div>

          {/* Integrated Bottom Slider Controls Bar */}
          {portfolioItems.length > 1 && (
            <div className="flex items-center justify-between py-2.5 px-3 sm:px-4 bg-white border-t border-slate-100">
              <button
                type="button"
                onClick={handlePrevPortfolio}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer active:scale-95 transition-colors"
              >
                Prev
              </button>

              {/* Dots Indicator */}
              <div className="flex items-center gap-1.5">
                {portfolioItems.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPortfolioIndex(idx)}
                    title={`Slide to piece ${idx + 1}`}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === portfolioIndex ? 'w-5 bg-[#006eff]' : 'w-2 bg-slate-200 hover:bg-slate-300'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNextPortfolio}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer active:scale-95 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      )}

      {/* =========================================================================
          PRICING TABLE (DIRECTLY UNDERNEATH MY PORTFOLIO)
          ========================================================================= */}
      <div className="bg-gradient-to-br from-white via-[#fcfdff] to-blue-50/25 border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs space-y-3">
        <div className="text-center">
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight inline-block relative">
            Pricing
            <span className="block h-0.5 w-8 bg-[#006eff] rounded-full mx-auto mt-1" />
          </h3>
        </div>

        <div className="rounded-xl sm:rounded-2xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase text-slate-400 font-bold tracking-wider">
              <tr>
                <th className="py-2.5 px-4">Deliverable / Scope</th>
                <th className="py-2.5 px-4 text-right">Standard Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {((expert?.pricingTiers && expert.pricingTiers.length > 0)
                ? expert.pricingTiers
                : (defaultPricingByCategory[expert?.category || ''] || [
                    { serviceName: 'Standard Milestone Deliverable', price: '3,000 - 6,000' },
                    { serviceName: 'Complete Project Delivery', price: '8,000 - 15,000' },
                  ])
              ).map((p, idx) => {
                // Strip any existing ৳ or BDT prefix so we never double-label
                const cleanPrice = p.price.replace(/^(৳\s*|BDT\s*)/i, '').trim();
                return (
                  <tr key={(p as any).id || idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {p.serviceName}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-[#006eff]">
                      <span className="text-slate-400 font-normal text-[11px] mr-0.5">BDT</span>
                      {' '}{cleanPrice}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          4. FULLSCREEN PORTFOLIO MODAL OVERLAY:
             - Expands to entire screen
             - Undownloadable & Watermarked
             - Full slider support (prev/next, dots, touch swipe, keyboard arrows, Esc)
          ========================================================================= */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 select-none animate-in fade-in duration-200"
          onContextMenu={(e) => e.preventDefault()}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Fullscreen Header */}
          <div className="flex items-center justify-between py-2 px-2 text-white">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
                GAENR VERIFIED SHOWCASE · {expert.code}
              </span>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-white/10 text-white font-mono text-[10px] uppercase">
                {expert.categoryTitle}
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Fullscreen Zoom Controller (− / % / +) */}
              <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/15">
                <button
                  type="button"
                  onClick={() => setFsZoom((z) => Math.max(0.4, +(z - 0.2).toFixed(1)))}
                  disabled={fsZoom <= 0.4}
                  className="w-7 h-7 rounded-lg hover:bg-white/20 text-white flex items-center justify-center text-base font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer select-none"
                  title="Zoom out (− make smaller)"
                >
                  −
                </button>
                <button
                  type="button"
                  onClick={() => setFsZoom(1)}
                  className="px-2 py-0.5 text-xs font-mono font-bold text-white/90 hover:text-white cursor-pointer select-none"
                  title="Reset to 100%"
                >
                  {Math.round(fsZoom * 100)}%
                </button>
                <button
                  type="button"
                  onClick={() => setFsZoom((z) => Math.min(3, +(z + 0.2).toFixed(1)))}
                  disabled={fsZoom >= 3}
                  className="w-7 h-7 rounded-lg hover:bg-white/20 text-white flex items-center justify-center text-base font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer select-none"
                  title="Zoom in (+ make larger)"
                >
                  +
                </button>
              </div>

              <span className="text-xs font-mono text-slate-400 font-semibold hidden xs:inline">
                Piece {validIndex + 1} of {portfolioItems.length}
              </span>
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                title="Close Fullscreen (Esc)"
                className="p-1.5 sm:px-3 sm:py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer flex items-center gap-1 active:scale-95"
              >
                <X className="w-5 h-5 text-slate-300" />
                <span className="hidden sm:inline text-xs font-medium pr-0.5">Close (Esc)</span>
              </button>
            </div>
          </div>

          {/* Main Fullscreen Stage */}
          <div className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden">
            {/* Watermarks across Fullscreen - Render BOTH Image and Text with pointer-events-none for video controls */}
            <div
              className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center overflow-hidden select-none py-8"
              style={{ opacity: Math.max(0.24, ((branding.watermarkOpacity ?? 25) / 100)) }}
            >
              {branding.repeatingWatermark ? (
                <div
                  className={`w-full h-full grid grid-cols-2 sm:grid-cols-4 gap-12 p-8 place-items-center ${
                    branding.watermarkPosition === 'diagonal' ? 'rotate-[-20deg] scale-125' : ''
                  }`}
                >
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center justify-center gap-2 text-center drop-shadow-md select-none">
                      {branding.watermarkImage && (
                        branding.watermarkImage === '/logo.svg' ? (
                          <div className="w-12 h-12 flex items-center justify-center">
                            <img src="/logo.svg" alt="Watermark" className="w-full h-full object-contain filter brightness-125" />
                          </div>
                        ) : (
                          <img
                            src={branding.watermarkImage}
                            alt="Watermark"
                            className="max-h-14 max-w-[160px] object-contain drop-shadow"
                          />
                        )
                      )}
                      <div className="text-white text-sm sm:text-base font-black uppercase tracking-widest whitespace-nowrap">
                        {branding.watermarkText || 'GAENR VERIFIED PORTFOLIO'} · {expert.code}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full h-full relative flex items-center justify-center p-8">
                  <div
                    className={`flex flex-col items-center justify-center gap-3 text-center drop-shadow-xl transition-all ${
                      branding.watermarkPosition === 'diagonal'
                        ? 'rotate-[-25deg]'
                        : branding.watermarkPosition === 'center'
                        ? ''
                        : 'absolute bottom-8 right-8 scale-90'
                    }`}
                  >
                    {branding.watermarkImage && (
                      branding.watermarkImage === '/logo.svg' ? (
                        <div className="w-20 h-20 flex items-center justify-center">
                          <img src="/logo.svg" alt="Watermark" className="w-full h-full object-contain filter brightness-125" />
                        </div>
                      ) : (
                        <img
                          src={branding.watermarkImage}
                          alt="Watermark"
                          className="max-h-28 max-w-[280px] object-contain drop-shadow"
                        />
                      )
                    )}
                    <div className="text-white text-base sm:text-2xl font-black uppercase tracking-widest whitespace-nowrap">
                      {branding.watermarkText || 'GAENR VERIFIED PORTFOLIO'} · {expert.code}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Floating Large Nav Arrows */}
            {portfolioItems.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevPortfolio}
                  title="Previous piece (Left arrow)"
                  className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xl"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  type="button"
                  onClick={handleNextPortfolio}
                  title="Next piece (Right arrow)"
                  className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xl"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Render portfolio content in fullscreen — fills all available space */}
            <div className="flex-1 w-full flex items-center justify-center overflow-hidden min-h-0">
              {(() => {
                const item = currentPortfolio;
                if (!item) return null;
                const activeMedia = item.mediaUrl || item.imageUrl;

                if (activeMedia) {
                  // ── YouTube ──────────────────────────────────────────────
                  if (activeMedia.includes('youtube.com') || activeMedia.includes('youtu.be')) {
                    const videoId = activeMedia.includes('youtu.be/')
                      ? activeMedia.split('youtu.be/')[1]?.split('?')[0]
                      : activeMedia.split('v=')[1]?.split('&')[0];
                    const src = videoId
                      ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0`
                      : activeMedia;
                    return (
                      <div className="w-full max-w-5xl aspect-video">
                        <iframe src={src} title={item.title} className="w-full h-full border-0" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
                      </div>
                    );
                  }
                  // ── Vimeo ────────────────────────────────────────────────
                  if (activeMedia.includes('vimeo.com')) {
                    const vimeoId = activeMedia.split('vimeo.com/').pop()?.split('?')[0];
                    const src = vimeoId ? `https://player.vimeo.com/video/${vimeoId}` : activeMedia;
                    return (
                      <div className="w-full max-w-5xl aspect-video">
                        <iframe src={src} title={item.title} className="w-full h-full border-0" allowFullScreen />
                      </div>
                    );
                  }
                  // ── Direct video ─────────────────────────────────────────
                  if (activeMedia.endsWith('.mp4') || activeMedia.endsWith('.webm') || activeMedia.startsWith('data:video')) {
                    return <video src={activeMedia} controls autoPlay className="max-w-5xl max-h-full w-full rounded-lg" />;
                  }
                  // ── Image ────────────────────────────────────────────────
                  const isImage = activeMedia.startsWith('data:image') || activeMedia.match(/\.(jpeg|jpg|gif|png|webp|svg)($|\?)/i) || item.previewType === 'image';
                  if (isImage) {
                    const directImageSrc = getGoogleDriveDirectImageUrl(activeMedia);
                    return (
                      <div className="relative w-full h-full flex items-center justify-center overflow-auto p-2 sm:p-6">
                        <img
                          key={`fs-img-${item.id || validIndex}-${directImageSrc}`}
                          src={directImageSrc}
                          alt={item.title}
                          style={{
                            transform: `scale(${fsZoom})`,
                            transformOrigin: 'center center',
                            transition: 'transform 0.2s ease-out',
                            maxHeight: '82vh',
                            maxWidth: '88vw',
                            objectFit: 'contain',
                          }}
                          className="rounded-xl shadow-2xl select-none"
                        />
                      </div>
                    );
                  }
                  // ── WordPress website ────────────────────────────────────
                  if (item.category === 'wordpress-website') {
                    return (
                      <div className="w-full max-w-5xl flex flex-col h-full">
                        <div className="bg-slate-800 px-3 py-2 rounded-t-lg flex items-center gap-2 shrink-0">
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                          </div>
                          <div className="flex-1 bg-slate-700 rounded px-2.5 py-0.5 text-[10px] font-mono text-slate-300 truncate min-w-0">
                            🔒 {activeMedia}
                          </div>
                          <a href={activeMedia} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="shrink-0 px-3 py-1 bg-[#006eff] hover:bg-blue-500 text-white text-[10px] font-bold rounded-lg flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" /><span>Visit Website</span>
                          </a>
                        </div>
                        <div className="flex-1 bg-white rounded-b-lg overflow-hidden min-h-0">
                          <iframe src={activeMedia} title={item.title} className="w-full h-full border-0" sandbox="allow-scripts allow-same-origin allow-forms allow-popups" />
                        </div>
                      </div>
                    );
                  }
                  // ── Embeddable platforms (Drive, Figma, Docs, Loom…) ─────
                  const embedUrl = getEmbedUrl(activeMedia);
                  if (embedUrl) {
                    return (
                      <div className="w-full max-w-5xl flex flex-col h-full">
                        <div className="shrink-0 pb-2 flex items-center justify-between">
                          <h4 className="text-white font-bold text-sm truncate">{item.title}</h4>
                          <a href={activeMedia} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors" title="Open in new tab">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                        <div className="flex-1 bg-white rounded-xl overflow-hidden min-h-0">
                          <iframe src={embedUrl} title={item.title} className="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowFullScreen sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation" />
                        </div>
                      </div>
                    );
                  }
                  // ── Non-embeddable external link ──────────────────────────
                  return (
                    <div className="flex flex-col items-center justify-center text-center space-y-5 p-8">
                      <div className="w-20 h-20 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center">
                        <ExternalLink className="w-8 h-8 text-white/70" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-white font-bold text-lg">{item.title}</h4>
                        {item.description && <p className="text-white/60 text-sm max-w-sm">{item.description}</p>}
                      </div>
                      <a href={activeMedia} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-[#006eff] hover:bg-blue-500 text-white font-bold rounded-xl flex items-center gap-2 transition-colors">
                        <span>Open Project</span><ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  );
                }

                // ── No URL — fall back to the card renderer (mockup cards) ─
                return (
                  <div className="scale-105 sm:scale-110">
                    {renderVisualCard(item, portfolioIndex, true)}
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Bottom Fullscreen Controls Bar */}
          <div className="flex items-center justify-between py-2 px-2 text-white border-t border-white/10">
            <button
              type="button"
              onClick={handlePrevPortfolio}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer active:scale-95 transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {portfolioItems.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setPortfolioIndex(idx);
                    setFsZoom(1);
                  }}
                  title={`Slide to piece ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    idx === validIndex ? 'w-7 bg-[#006eff]' : 'w-2.5 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNextPortfolio}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer active:scale-95 transition-colors flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
