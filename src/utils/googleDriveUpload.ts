export const GAENR_DRIVE_FOLDER_ID = '13TfzgSRtRCy2ubOU4fyFEg_NEGZLonDO';
export const GAENR_DRIVE_FOLDER_URL =
  'https://drive.google.com/drive/folders/13TfzgSRtRCy2ubOU4fyFEg_NEGZLonDO?usp=sharing';

export interface DriveUploadResponse {
  success: boolean;
  fileId?: string;
  fileUrl?: string;
  downloadUrl?: string;
  error?: string;
}

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
 * Uploads file base64 directly to the designated Google Drive folder (ID: 13TfzgSRtRCy2ubOU4fyFEg_NEGZLonDO)
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
        });

        const data = await response.json();
        if (data && (data.status === 'success' || data.success || data.fileUrl)) {
          resolve({
            success: true,
            fileId: data.fileId,
            fileUrl: data.fileUrl || data.url,
            downloadUrl: data.downloadUrl || data.viewUrl,
          });
        } else {
          resolve({
            success: false,
            error: data?.message || 'Google Drive webhook response did not contain file URL',
          });
        }
      } catch (err: any) {
        console.warn('Google Drive direct upload error:', err);
        resolve({
          success: false,
          error: err?.message || 'Network error during Google Drive upload',
        });
      }
    };
    reader.readAsDataURL(file);
  });
};
