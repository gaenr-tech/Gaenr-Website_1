export type WelcomeEmailResult =
  | { status: 'sent' }
  | { status: 'already-sent' }
  | { status: 'skipped'; reason: 'no-email' | 'not-configured' }
  | { status: 'failed'; message: string };

const apiBase = () => (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Ask the server to email the newly created expert. The recipient is looked up
 * server-side from the saved profile, so only the expert's own address is used.
 */
import { FreelancerProfile } from '../types';

export const sendExpertWelcomeEmail = async (
  code: string,
  cardImageDataUrl?: string | null,
  expert?: FreelancerProfile
): Promise<WelcomeEmailResult> => {
  // The profile is mirrored to the shared database asynchronously; give it a moment and retry.
  for (let attempt = 0; attempt < 5; attempt += 1) {
    await sleep(attempt === 0 ? 1500 : 2000);
    try {
      const response = await fetch(`${apiBase()}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          cardImage: cardImageDataUrl || undefined,
          expert: expert || undefined,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as { alreadySent?: boolean; code?: string; error?: string };

      if (response.ok) return data.alreadySent ? { status: 'already-sent' } : { status: 'sent' };
      if (data.code === 'EXPERT_NOT_FOUND') continue; // not saved to the database yet
      if (data.code === 'NO_EMAIL') return { status: 'skipped', reason: 'no-email' };
      if (data.code === 'EMAIL_NOT_CONFIGURED') return { status: 'skipped', reason: 'not-configured' };
      return { status: 'failed', message: data.error || `HTTP ${response.status}` };
    } catch {
      // A transient cold-start/network failure should not immediately report a
      // permanent failure; continue through the bounded retry window.
      if (attempt === 4) return { status: 'failed', message: 'Could not reach the email service after several retries' };
    }
  }
  return { status: 'failed', message: 'Profile was not saved to the database in time' };
};

/**
 * Dispatch an automated onboarding invitation email to an approved applicant.
 */
export const sendExpertOnboardingInviteEmail = async (application: {
  id: string;
  fullName: string;
  email: string;
  skill?: string;
  otherSkill?: string;
}): Promise<WelcomeEmailResult> => {
  try {
    const response = await fetch(`${apiBase()}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'onboarding_invite',
        applicationId: application.id,
        fullName: application.fullName,
        email: application.email,
        skill: application.otherSkill || application.skill || 'Digital Creator',
      }),
    });
    const data = (await response.json().catch(() => ({}))) as {
      alreadySent?: boolean;
      error?: string;
      code?: string;
    };

    if (response.ok) return data.alreadySent ? { status: 'already-sent' } : { status: 'sent' };
    if (data.code === 'NO_EMAIL') return { status: 'skipped', reason: 'no-email' };
    if (data.code === 'EMAIL_NOT_CONFIGURED') return { status: 'skipped', reason: 'not-configured' };
    return { status: 'failed', message: data.error || `HTTP ${response.status}` };
  } catch (err: any) {
    return { status: 'failed', message: err?.message || 'Network request failed' };
  }
};
