import { domToPng } from 'modern-screenshot';
import { FreelancerProfile } from '../types';

/**
 * Downloads the EXACT previewed Digital ID Card as a crisp, high-resolution PNG image.
 * Uses modern-screenshot to clone the exact DOM node:
 * - Exact height (no extra bottom empty space)
 * - Exact CSS gradient and ambient glow (no banding or pixelation)
 * - Exact avatar currently rendered on screen (including custom uploaded images)
 * - Zero hanging because font: false skips remote font HTTP requests.
 */
export async function downloadIdCardBadge(
  cardElement: HTMLElement | null,
  freelancer: FreelancerProfile
): Promise<boolean> {
  if (!cardElement) return false;

  try {
    const dataUrl = await domToPng(cardElement, {
      scale: 3,
      quality: 1,
      font: false, // Prevents hanging on remote Google Fonts HTTP download
      features: {
        removeAbnormalAttributes: true,
      },
    });

    if (dataUrl && dataUrl.startsWith('data:image/png')) {
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
    console.error('Failed to capture ID card with modern-screenshot:', err);
  }

  return false;
}
