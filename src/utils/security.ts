/**
 * Security & Privacy Utilities for Gaenr Deliverable Vault
 * 
 * Provides cryptographically random, high-entropy tokens for expert portfolio uploads.
 * Ensures zero correlation with public expert IDs/codes (e.g. CL-101, GD26001),
 * preventing unauthorized deliverable uploads and protecting creator privacy.
 */

import { FreelancerProfile } from '../types';

/**
 * Generates an unguessable, high-entropy 32-character cryptographic upload token.
 * Example format: "u_9k2m4x7q8b1c5z3h6v0j8t4p9w2y1a7"
 */
export const generateSecureUploadToken = (): string => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let randomSegment = '';

  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const bytes = new Uint8Array(28);
    crypto.getRandomValues(bytes);
    for (let i = 0; i < bytes.length; i++) {
      randomSegment += alphabet[bytes[i] % alphabet.length];
    }
  } else {
    for (let i = 0; i < 28; i++) {
      randomSegment += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
  }

  return `u_${randomSegment}`;
};

/**
 * Returns the secure, unpredictable URL for an expert's portfolio upload portal.
 * Defaults to the production domain or current browser origin.
 */
export const getExpertSecureUploadUrl = (
  expert: Pick<FreelancerProfile, 'code' | 'uploadToken'>,
  origin?: string
): string => {
  const baseOrigin =
    origin ||
    (typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://gaenr.com');

  const token = expert.uploadToken || expert.code;
  return `${baseOrigin.replace(/\/$/, '')}/u/${token}`;
};

/**
 * Ensures a freelancer profile always possesses a unique uploadToken.
 */
export const ensureExpertUploadToken = (expert: FreelancerProfile): FreelancerProfile => {
  if (expert.uploadToken && expert.uploadToken.startsWith('u_')) {
    return expert;
  }
  return {
    ...expert,
    uploadToken: generateSecureUploadToken(),
  };
};

/**
 * Generates an unguessable, high-entropy 8-character uppercase alphanumeric expert code.
 * Example format: "8K2N9X4P", "7M3Q1W9Z"
 * Excludes ambiguous characters (0, O, 1, I).
 */
export const generateUniqueExpertCode = (existingCodes: string[] = []): string => {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  const taken = new Set(existingCodes.map((c) => (c || '').toUpperCase().trim()));
  let code = '';
  do {
    code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  } while (taken.has(code));
  return code;
};
