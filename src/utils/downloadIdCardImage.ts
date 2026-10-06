import { domToPng } from 'modern-screenshot';
import { FreelancerProfile } from '../types';

/**
 * Captures the previewed Digital ID Card as a crisp, high-resolution PNG Data URL.
 * Uses modern-screenshot to clone the exact DOM node:
 * - Exact height, CSS gradient, and ambient glow
 * - Exact avatar currently rendered on screen
 * - font: false prevents hanging on remote Google Fonts HTTP download
 */
export async function captureIdCardDataUrl(
  cardElement: HTMLElement | null
): Promise<string | null> {
  if (!cardElement) return null;

  try {
    // 1. Ensure all fonts and images inside the element are fully loaded & decoded
    if (typeof document !== 'undefined' && document.fonts) {
      await document.fonts.ready;
    }

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
        preferredFormat: 'woff2',
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
