import { domToPng } from 'modern-screenshot';
import { FreelancerProfile } from '../types';
import { dmSansBoldBase64 } from '../assets/fonts/dmSansBase64';

/**
 * Self-contained CSS text with embedded Base64 DM Sans.
 * Bypasses all SVG foreignObject sandbox restrictions and remote font CORS blocks.
 */
const DM_SANS_CSS = `
  @font-face {
    font-family: 'DM Sans';
    src: url('data:font/ttf;base64,${dmSansBoldBase64}') format('truetype');
    font-weight: 100 1000;
    font-style: normal;
  }
  @font-face {
    font-family: 'DM Sans';
    src: url('data:font/ttf;base64,${dmSansBoldBase64}') format('truetype');
    font-weight: 400;
    font-style: normal;
  }
  @font-face {
    font-family: 'DM Sans';
    src: url('data:font/ttf;base64,${dmSansBoldBase64}') format('truetype');
    font-weight: 500;
    font-style: normal;
  }
  @font-face {
    font-family: 'DM Sans';
    src: url('data:font/ttf;base64,${dmSansBoldBase64}') format('truetype');
    font-weight: 600;
    font-style: normal;
  }
  @font-face {
    font-family: 'DM Sans';
    src: url('data:font/ttf;base64,${dmSansBoldBase64}') format('truetype');
    font-weight: 700;
    font-style: normal;
  }
  @font-face {
    font-family: 'DM Sans';
    src: url('data:font/ttf;base64,${dmSansBoldBase64}') format('truetype');
    font-weight: 800;
    font-style: normal;
  }
  @font-face {
    font-family: 'DM Sans';
    src: url('data:font/ttf;base64,${dmSansBoldBase64}') format('truetype');
    font-weight: 900;
    font-style: normal;
  }
`;

/**
 * Captures the previewed Digital ID Card as a crisp, high-resolution PNG Data URL.
 * Uses modern-screenshot to clone the exact DOM node with embedded DM Sans font:
 * - Exact height, CSS gradient, and ambient glow
 * - Exact avatar currently rendered on screen
 * - Embedded base64 font eliminates system font fallbacks (Arial/sans-serif)
 */
export async function captureIdCardDataUrl(
  cardElement: HTMLElement | null
): Promise<string | null> {
  if (!cardElement) return null;

  try {
    // 1. Ensure document fonts are ready and register the embedded DM Sans in browser font registry
    if (typeof FontFace !== 'undefined' && typeof document !== 'undefined') {
      try {
        const fontFace = new FontFace(
          'DM Sans',
          `url('data:font/ttf;base64,${dmSansBoldBase64}')`,
          { weight: '100 1000', style: 'normal' }
        );
        await fontFace.load();
        document.fonts.add(fontFace);
      } catch {
        // FontFace load fallback
      }
    }

    if (typeof document !== 'undefined' && document.fonts) {
      await document.fonts.ready;
    }

    // 2. Ensure all images inside the element are fully loaded & decoded
    const images = Array.from(cardElement.querySelectorAll('img'));
    await Promise.all(
      images.map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete) return resolve(true);
            img.onload = () => resolve(true);
            img.onerror = () => resolve(true);
          })
      )
    );

    const dataUrl = await domToPng(cardElement, {
      scale: 3,
      quality: 1,
      backgroundColor: 'transparent',
      font: {
        cssText: DM_SANS_CSS,
      },
      features: {
        removeAbnormalAttributes: true,
      },
    });

    if (dataUrl && dataUrl.startsWith('data:image/png')) {
      return dataUrl;
    }
  } catch (err) {
    console.error('Failed to capture ID card data URL:', err);
  }

  return null;
}

export async function downloadIdCardBadge(
  cardElement: HTMLElement | null,
  freelancer: FreelancerProfile
): Promise<boolean> {
  if (!cardElement) return false;

  try {
    const dataUrl = await captureIdCardDataUrl(cardElement);

    if (dataUrl) {
      // Background sync to server so /api/id-card also has the exact browser-rendered PNG
      try {
        fetch('/api/id-card', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: freelancer.code, imageData: dataUrl }),
        }).catch(() => {});
      } catch {}

      const link = document.createElement('a');
      link.download = `GAENR-ID-${freelancer.code}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
      }, 150);
      return true;
    }
  } catch (err) {
    console.error('Failed to download ID card badge:', err);
  }

  return false;
}
