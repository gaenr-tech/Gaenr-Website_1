import React from 'react';

interface AvatarProps {
  id?: string;
  size?: number | string;
  className?: string;
  title?: string;
  shape?: 'circle' | 'square' | 'rounded';
}

export interface CategoryAvatarMeta {
  id: string;
  name: string;
  url: string;
  fallbackUrl: string;
  gender: 'male' | 'female';
}

// 10 Curated High-Aesthetic 3D Pixar/Disney Style Youth Student Avatars with Uniform Studio Backdrop
// Clean numbering ("Avatar 01" to "Avatar 10") without category or skill locks.
export const RAW_AVATAR_SPECS: CategoryAvatarMeta[] = [
  {
    id: 'avatar-youth-m1',
    name: 'Avatar 01',
    gender: 'male',
    url: '/images/avatars/student_male_1.png',
    fallbackUrl: '/images/avatars/student_male_1.jpg',
  },
  {
    id: 'avatar-youth-f1',
    name: 'Avatar 02',
    gender: 'female',
    url: '/images/avatars/student_female_1.png',
    fallbackUrl: '/images/avatars/student_female_1.jpg',
  },
  {
    id: 'avatar-youth-m2',
    name: 'Avatar 03',
    gender: 'male',
    url: '/images/avatars/student_male_2.png',
    fallbackUrl: '/images/avatars/student_male_2.jpg',
  },
  {
    id: 'avatar-youth-f2',
    name: 'Avatar 04',
    gender: 'female',
    url: '/images/avatars/student_female_2.png',
    fallbackUrl: '/images/avatars/student_female_2.jpg',
  },
  {
    id: 'avatar-youth-m3',
    name: 'Avatar 05',
    gender: 'male',
    url: '/images/avatars/student_male_3.png',
    fallbackUrl: '/images/avatars/student_male_3.jpg',
  },
  {
    id: 'avatar-youth-tg1',
    name: 'Avatar 06',
    gender: 'female',
    url: '/images/avatars/student_third_gender_1.png',
    fallbackUrl: '/images/avatars/student_third_gender_1.jpg',
  },
  {
    id: 'avatar-youth-m4',
    name: 'Avatar 07',
    gender: 'male',
    url: '/images/avatars/student_male_4.png?v=2',
    fallbackUrl: '/images/avatars/student_male_4.jpg?v=2',
  },
  {
    id: 'avatar-youth-f4',
    name: 'Avatar 08',
    gender: 'female',
    url: '/images/avatars/student_female_4.png?v=3',
    fallbackUrl: '/images/avatars/student_female_4.jpg?v=3',
  },
  {
    id: 'avatar-youth-m5',
    name: 'Avatar 09',
    gender: 'male',
    url: '/images/avatars/student_male_5.png',
    fallbackUrl: '/images/avatars/student_male_5.jpg',
  },
  {
    id: 'avatar-youth-f5',
    name: 'Avatar 10',
    gender: 'female',
    url: '/images/avatars/student_female_5.png',
    fallbackUrl: '/images/avatars/student_female_5.jpg',
  },
];

/**
 * Assigns an authentic student cartoon avatar based on gender preference.
 * Freely selectable by any expert across any category.
 */
export const getCategoryAvatar = (
  category?: string,
  code?: string,
  gender?: 'Male' | 'Female' | 'male' | 'female' | 'unspecified' | string
): CategoryAvatarMeta => {
  const g = (gender || '').toLowerCase();
  const seed = `${code || ''}-${category || ''}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const maleSpecs = RAW_AVATAR_SPECS.filter((s) => s.gender === 'male');
  const femaleSpecs = RAW_AVATAR_SPECS.filter((s) => s.gender === 'female');

  if (g.includes('male') && !g.includes('fe')) {
    return maleSpecs[absHash % maleSpecs.length];
  }
  if (g.includes('fe')) {
    return femaleSpecs[absHash % femaleSpecs.length];
  }

  return RAW_AVATAR_SPECS[absHash % RAW_AVATAR_SPECS.length];
};

export const getAvatarImageSrc = (idOrName?: string, fallbackTitle?: string): string => {
  const target = (idOrName || fallbackTitle || '').trim();
  if (!target) return RAW_AVATAR_SPECS[0].url;
  if (target.startsWith('data:image/') || target.startsWith('http://') || target.startsWith('https://') || target.startsWith('/')) {
    return target;
  }
  const spec = RAW_AVATAR_SPECS.find(
    (s) => s.id.toLowerCase() === target.toLowerCase() || s.name.toLowerCase() === target.toLowerCase()
  );
  if (spec) return spec.url;
  return getCategoryAvatar(target).url;
};

export const getOfficialAvatarUrl = (nameOrId?: string): string => {
  return getAvatarImageSrc(nameOrId);
};

export const getAvatarDataUri = (avatarId?: string): string => {
  return getAvatarImageSrc(avatarId);
};

/**
 * Authentic Gaenr Verified Youthful Student Avatar Component.
 * Displays crisp, high-aesthetic university student portraits with smooth error fallback.
 */
export const AvatarGraphic: React.FC<AvatarProps> = ({
  id,
  size = 48,
  className = '',
  title,
  shape = 'circle',
}) => {
  const pixelSize = typeof size === 'number' ? `${size}px` : size;
  const shapeClass = shape === 'square' ? 'rounded-none' : shape === 'rounded' ? 'rounded-xl' : 'rounded-full';

  // Direct data URLs or remote photos
  if (id && (id.startsWith('data:image/') || id.startsWith('http://') || id.startsWith('https://') || id.startsWith('/images/'))) {
    return (
      <img
        src={id}
        alt={title || 'Expert Avatar'}
        style={{ width: pixelSize, height: pixelSize }}
        className={`block aspect-square ${shapeClass} object-cover shrink-0 select-none ${className}`}
        loading="lazy"
      />
    );
  }

  // Exact ID match or name match
  const normalizedId = (id || '').trim().toLowerCase();
  const exact = RAW_AVATAR_SPECS.find(
    (s) => s.id.toLowerCase() === normalizedId || s.name.toLowerCase() === normalizedId
  );
  if (exact) {
    return (
      <img
        src={exact.url}
        alt={title || exact.name}
        style={{ width: pixelSize, height: pixelSize }}
        className={`block aspect-square ${shapeClass} object-cover shrink-0 select-none ${className}`}
        onError={(e) => {
          const img = e.currentTarget;
          if (!img.src.includes(exact.fallbackUrl)) {
            img.src = exact.fallbackUrl;
          }
        }}
        loading="lazy"
      />
    );
  }

  // Fallback matching
  let resolvedId = normalizedId || 'avatar-youth-m1';
  if (resolvedId.includes('m1') || resolvedId === '1' || resolvedId === '01') resolvedId = 'avatar-youth-m1';
  else if (resolvedId.includes('f1') || resolvedId === '2' || resolvedId === '02') resolvedId = 'avatar-youth-f1';
  else if (resolvedId.includes('m2') || resolvedId === '3' || resolvedId === '03') resolvedId = 'avatar-youth-m2';
  else if (resolvedId.includes('f2') || resolvedId === '4' || resolvedId === '04') resolvedId = 'avatar-youth-f2';
  else if (resolvedId.includes('m3') || resolvedId === '5' || resolvedId === '05') resolvedId = 'avatar-youth-m3';
  else if (resolvedId.includes('tg') || resolvedId.includes('f3') || resolvedId === '6' || resolvedId === '06') resolvedId = 'avatar-youth-tg1';
  else if (resolvedId.includes('m4') || resolvedId === '7' || resolvedId === '07') resolvedId = 'avatar-youth-m4';
  else if (resolvedId.includes('f4') || resolvedId === '8' || resolvedId === '08') resolvedId = 'avatar-youth-f4';
  else if (resolvedId.includes('m5') || resolvedId === '9' || resolvedId === '09') resolvedId = 'avatar-youth-m5';
  else if (resolvedId.includes('f5') || resolvedId === '10') resolvedId = 'avatar-youth-f5';

  const spec = RAW_AVATAR_SPECS.find((s) => s.id === resolvedId) || RAW_AVATAR_SPECS[0];

  return (
    <img
      src={spec.url}
      alt={title || spec.name}
      style={{ width: pixelSize, height: pixelSize }}
      className={`block aspect-square ${shapeClass} object-cover shrink-0 select-none ${className}`}
      onError={(e) => {
        const img = e.currentTarget;
        if (!img.src.includes(spec.fallbackUrl)) {
          img.src = spec.fallbackUrl;
        }
      }}
      loading="lazy"
    />
  );
};
