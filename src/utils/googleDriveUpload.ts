export const GAENR_DRIVE_FOLDER_ID = '13TfzgSRtRCy2ubOU4fyFEg_NEGZLonDO';
export const GAENR_DRIVE_FOLDER_URL =
  'https://drive.google.com/drive/folders/13TfzgSRtRCy2ubOU4fyFEg_NEGZLonDO?usp=sharing';

export interface DriveUploadResponse {
  success: boolean;
  fileId?: string;
  fileUrl?: string;
  previewUrl?: string;
  directImageUrl?: string;
  downloadUrl?: string;
  error?: string;
}

/**
 * Extracts a Google Drive file ID from a URL or raw ID string.
 */
export const extractGoogleDriveFileId = (urlOrId: string): string | null => {
  if (!urlOrId) return null;
  const trimmed = urlOrId.trim();
  if (/^[a-zA-Z0-9_-]{25,}$/.test(trimmed)) {
    return trimmed;
  }
  const dMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (dMatch && dMatch[1]) return dMatch[1];
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) return idMatch[1];
  return null;
};

/**
 * Generates a direct Google Drive image CDN URL that renders natively in <img> tags.
 */
export const getGoogleDriveDirectImageUrl = (driveUrlOrId: string): string => {
  if (!driveUrlOrId) return '';
  const fileId = extractGoogleDriveFileId(driveUrlOrId);
  if (!fileId) return driveUrlOrId;
  return `https://lh3.googleusercontent.com/d/${fileId}`;
};

/**
 * Generates a Google Drive preview embed URL that renders in <iframe> (documents, videos, slides).
 */
export const getGoogleDriveEmbedPreviewUrl = (driveUrlOrId: string): string => {
  if (!driveUrlOrId) return '';
  const fileId = extractGoogleDriveFileId(driveUrlOrId);
  if (!fileId) return driveUrlOrId;
  return `https://drive.google.com/file/d/${fileId}/preview`;
};

export const getDriveWebhookUrl = (): string => {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('gaenr_drive_webhook_url');
    if (local && local.trim()) return local.trim();
  }
  return (import.meta.env.VITE_GOOGLE_DRIVE_WEBHOOK_URL as string) || '';
};

export const setDriveWebhookUrl = (url: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('gaenr_drive_webhook_url', url.trim());
  }
};

/**
 * Uploads file base64 directly to the designated cloud folder (ID: 13TfzgSRtRCy2ubOU4fyFEg_NEGZLonDO)
 * via Google Apps Script Webhook. Zero storage consumed on web hosting.
 */
export const uploadFileToGoogleDrive = async (
  file: File,
  expertCode: string
): Promise<DriveUploadResponse> => {
  const webhookUrl = getDriveWebhookUrl();
  if (!webhookUrl) {
    return {
      success: false,
      error: 'NO_WEBHOOK_CONFIGURED',
    };
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onerror = () => {
      resolve({ success: false, error: 'Failed to read file data' });
    };
    reader.onload = async () => {
      try {
        const dataUrl = reader.result as string;
        const base64Data = dataUrl.split(',')[1] || '';
        const timestamp = new Date().toISOString().slice(0, 10);
        const targetFileName = `[${expertCode}]_${timestamp}_${file.name}`;

        const payload = {
          folderId: GAENR_DRIVE_FOLDER_ID,
          fileName: targetFileName,
          mimeType: file.type || 'application/octet-stream',
          base64: base64Data,
          expertCode,
        };

        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify(payload),
          redirect: 'follow',
        });

        let data: any = null;
        try {
          data = await response.json();
        } catch {
          try {
            const rawText = await response.text();
            data = JSON.parse(rawText);
          } catch (jsonErr) {
            console.warn('Could not parse response JSON:', jsonErr);
          }
        }
        if (data && (data.status === 'success' || data.success || data.fileUrl || data.fileId)) {
          const fileId = data.fileId || extractGoogleDriveFileId(data.fileUrl || '') || '';
          resolve({
            success: true,
            fileId,
            fileUrl: data.fileUrl || (fileId ? `https://drive.google.com/file/d/${fileId}/view` : ''),
            previewUrl: data.previewUrl || (fileId ? `https://drive.google.com/file/d/${fileId}/preview` : ''),
            directImageUrl: data.directImageUrl || (fileId ? `https://lh3.googleusercontent.com/d/${fileId}` : ''),
            downloadUrl: data.downloadUrl || data.viewUrl,
          });
        } else {
          resolve({
            success: false,
            error: data?.message || 'Storage webhook response did not contain file data',
          });
        }
      } catch (err: any) {
        console.warn('Direct cloud upload error:', err);
        resolve({
          success: false,
          error: err?.message || 'Network error during cloud upload',
        });
      }
    };
    reader.readAsDataURL(file);
  });
};
