import { neon } from '@neondatabase/serverless';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { dmSansBoldBase64 } from './dmsans-font.js';

const SITE_URL = (process.env.SITE_URL || 'https://gaenr.com').replace(/\/$/, '');

const escapeXml = (value = '') =>
  String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));

const avatarMap = {
  'avatar-youth-m1': '/images/avatars/student_male_1.png',
  'avatar-youth-f1': '/images/avatars/student_female_1.png',
  'avatar-youth-m2': '/images/avatars/student_male_2.png',
  'avatar-youth-f2': '/images/avatars/student_female_2.png',
  'avatar-youth-m3': '/images/avatars/student_male_3.png',
  'avatar-youth-tg1': '/images/avatars/student_third_gender_1.png',
  'avatar-youth-m4': '/images/avatars/student_male_4.png',
  'avatar-youth-f4': '/images/avatars/student_female_4.png',
  'avatar-youth-m5': '/images/avatars/student_male_5.png',
  'avatar-youth-f5': '/images/avatars/student_female_5.png',
};

// Clean embedded Gaenr butterfly logo paths
const gaenrLogoPaths = `
  <path d="M0 0 C1.32 -0.01 1.32 -0.01 2.66 -0.01 C5.49 -0.02 8.33 -0.02 11.16 -0.02 C12.13 -0.02 13.1 -0.02 14.1 -0.02 C29.09 0.01 43.89 0.36 58.79 2.17 C59.87 2.3 60.95 2.43 62.06 2.56 C108.54 8.27 153.2 20.72 195.79 40.17 C197.01 40.71 197.01 40.71 198.25 41.27 C218.72 50.46 238.05 61.86 256.79 74.17 C257.79 74.83 257.79 74.83 258.82 75.5 C274.56 85.91 289.69 97.37 303.95 109.73 C306.7 112.09 309.51 114.35 312.35 116.61 C317.1 120.45 321.4 124.62 325.64 129.01 C328.53 131.98 331.55 134.58 334.79 137.17 C335.93 138.39 337.03 139.64 338.1 140.92 C340.51 143.75 342.99 146.4 345.66 148.98 C349.52 152.8 352.94 156.86 356.33 161.1 C358.02 163.21 359.73 165.29 361.46 167.36 C386.9 197.93 405.99 234.02 419.79 271.17 C420.32 272.59 420.32 272.59 420.85 274.03 C451.85 358.75 447.85 450.47 445.79 539.17 C440.8 536.6 437.27 532.91 433.37 528.96 C432.28 527.87 432.28 527.87 431.16 526.75 C428.76 524.34 426.36 521.92 423.96 519.5 C422.28 517.81 420.6 516.13 418.92 514.45 C414.51 510.02 410.09 505.58 405.68 501.14 C398.63 494.05 391.58 486.96 384.52 479.88 C382.06 477.41 379.61 474.94 377.15 472.47 C375.63 470.94 374.11 469.42 372.59 467.89 C371.92 467.21 371.25 466.53 370.55 465.83 C366.69 461.95 362.71 458.27 358.56 454.7 C355.97 452.46 353.48 450.13 350.98 447.79 C341.07 438.66 330.41 430.44 319.79 422.17 C318.76 421.37 317.73 420.56 316.68 419.74 C310.38 414.86 304.01 410.08 297.6 405.36 C296.9 404.84 296.19 404.32 295.47 403.78 C292.91 401.9 290.35 400.04 287.79 398.17 C287.17 397.71 286.55 397.26 285.91 396.79 C274.31 388.3 262.52 380.17 250.54 372.23 C249.69 371.67 248.84 371.1 247.96 370.52 C228.69 357.72 209.31 345.23 189.29 333.62 C186.97 332.27 184.65 330.9 182.34 329.53 C170.02 322.3 154.88 314.14 140.2 317.82 C132.51 320.53 128.53 324.81 124.6 331.79 C118.49 344.93 118.64 360 118.58 374.16 C118.57 375.65 118.56 377.14 118.55 378.63 C118.53 382.65 118.51 386.66 118.49 390.67 C118.46 394.88 118.44 399.08 118.41 403.29 C118.36 411.24 118.31 419.19 118.27 427.14 C118.22 436.2 118.17 445.25 118.11 454.31 C118 472.93 117.89 491.55 117.79 510.17 C116.05 509.07 114.3 507.96 112.56 506.86 C111.59 506.24 110.62 505.63 109.62 504.99 C105.78 502.52 102.06 499.9 98.35 497.23 C93.59 493.84 88.81 490.49 83.91 487.29 C72.16 479.51 60.53 471.29 50.31 461.55 C48.34 459.69 46.35 457.93 44.3 456.18 C38.82 451.41 33.71 446.27 28.57 441.14 C26.86 439.43 25.15 437.73 23.43 436.04 C17.47 430.11 11.87 424.1 6.66 417.5 C4.89 415.29 3.04 413.23 1.1 411.17 C-54.57 349.16 -82.76 262.91 -91.46 94.17 C-90.55 77.65 -88.7 62.18 -81.21 47.17 C-80.73 46.2 -80.25 45.23 -79.76 44.23 C-69.27 24.71 -51.07 10.98 -30.06 4.5 C-20.08 1.67 -10.36 0.02 0 0 Z " fill="#005DD7" transform="translate(92.2109375,0.83203125)"/>
  <path d="M0 0 C21 21.95 21.29 54.93 21.25 83.47 C21.25 84.58 21.25 84.58 21.25 85.71 C21.06 169.99 3.99 254.47 -107.19 413.53 C-107.93 414.28 -108.68 415.03 -109.44 415.8 C-114.11 420.46 -118.93 424.86 -123.94 429.16 C-124.99 430.08 -126.03 431.01 -127.08 431.94 C-136.93 440.59 -147.34 448.45 -157.94 456.16 C-158.67 456.69 -159.41 457.23 -160.17 457.78 C-162.21 459.25 -164.26 460.71 -166.31 462.16 C-166.88 462.56 -167.45 462.97 -168.03 463.39 C-172.22 466.28 -176.65 468.57 -181.2 470.82 C-181.85 471.14 -182.5 471.46 -183.16 471.79 C-184.75 472.58 -186.35 473.37 -187.94 474.16 C-187.94 472.98 -187.94 472.98 -187.95 471.78 C-188.03 452.7 -188.12 433.62 -188.23 414.54 C-188.28 405.31 -188.32 396.09 -188.36 386.86 C-188.39 378.81 -188.43 370.76 -188.48 362.72 C-188.51 358.46 -188.53 354.2 -188.54 349.95 C-188.55 345.93 -188.58 341.91 -188.6 337.9 C-188.61 336.43 -188.62 334.97 -188.62 333.5 C-188.65 318.76 -189.35 301.79 -200.31 290.56 C-206.75 285.01 -213 284.67 -221.25 284.53 C-233.04 285.52 -244.43 291.53 -254.69 296.97 C-255.3 297.29 -255.91 297.61 -256.54 297.94 C-270.32 305.16 -283.67 313.04 -296.94 321.16 C-298.28 321.97 -298.28 321.97 -299.65 322.8 C-315.53 332.46 -330.65 343.26 -344.94 355.16 C-345.67 355.77 -345.67 355.77 -346.43 356.39 C-353.26 362.07 -359.93 367.9 -366.47 373.91 C-368.52 375.77 -370.59 377.6 -372.69 379.41 C-376.71 382.9 -380.6 386.53 -384.5 390.16 C-385.13 390.74 -385.75 391.32 -386.4 391.92 C-389.46 394.78 -392.46 397.67 -395.4 400.66 C-397.73 403.01 -400.13 405.22 -402.64 407.37 C-407 411.16 -411.09 415.18 -415.15 419.28 C-416.32 420.45 -416.32 420.45 -417.51 421.64 C-419.19 423.32 -420.87 425 -422.54 426.68 C-425.19 429.35 -427.85 432.02 -430.51 434.68 C-436.16 440.34 -441.8 446 -447.44 451.66 C-453.98 458.22 -460.52 464.78 -467.06 471.34 C-469.67 473.95 -472.28 476.57 -474.89 479.19 C-476.5 480.81 -478.11 482.42 -479.72 484.04 C-480.79 485.12 -480.79 485.12 -481.89 486.22 C-492.16 496.49 -503.44 506.41 -516.94 512.16 C-517.93 512.16 -518.92 512.16 -519.94 512.16 C-522.48 423.01 -520.87 333.62 -410.94 109.16 C-410.15 108.26 -409.36 107.36 -408.55 106.43 C-402.57 99.75 -396.28 93.37 -389.96 87.01 C-388.96 86 -387.97 84.99 -386.97 83.98 C-380.31 77.23 -373.36 71.06 -365.94 65.16 C-364.91 64.29 -363.89 63.42 -362.87 62.55 C-288.08 -1.59 -191.02 -23.42 0 0 Z " fill="#005DD7" transform="translate(1076.9375,22.84375)"/>
  <path d="M0 0 C7.24 6.09 14.11 12.53 20.25 19.75 C23.63 23.71 27.3 27.34 31 31 C35.22 35.18 39.33 39.36 43.17 43.89 C45.67 46.78 48.27 49.57 50.88 52.38 C54.52 56.3 58.13 60.25 61.69 64.25 C65.21 68.18 68.87 71.93 72.66 75.6 C74.61 77.6 76.43 79.63 78.25 81.74 C82.12 86.2 86.24 90.39 90.44 94.56 C91.15 95.28 91.86 95.99 92.6 96.73 C96.69 100.82 100.89 104.71 105.27 108.49 C107.27 110.24 109.15 112.08 111 114 C114.84 117.88 118.85 121.46 123 125 C124.02 125.88 125.04 126.77 126.05 127.65 C152.48 150.53 180.51 171.78 211 189 C211.61 189.35 212.22 189.7 212.85 190.06 C229.74 199.65 247.87 206.87 266.06 213.56 C266.94 213.88 267.81 214.21 268.71 214.54 C280.1 218.63 292.63 221.69 304.44 217.38 C313.12 213.28 317.54 207.9 321 199 C323.75 189.84 324.44 181.1 324.43 171.58 C324.44 170.19 324.45 168.8 324.46 167.41 C324.49 163.68 324.5 159.94 324.51 156.21 C324.52 152.29 324.54 148.38 324.57 144.46 C324.61 137.06 324.64 129.66 324.66 122.26 C324.69 113.83 324.73 105.4 324.78 96.97 C324.87 79.65 324.94 62.32 325 45 C327.25 46.11 329.49 47.23 331.74 48.34 C332.69 48.81 332.69 48.81 333.66 49.29 C338.16 51.53 342.38 53.94 346.5 56.81 C347.11 57.23 347.73 57.65 348.36 58.09 C350.25 59.38 352.12 60.69 354 62 C355.2 62.83 356.4 63.65 357.6 64.48 C364.71 69.42 371.4 74.71 377.94 80.38 C380.6 82.68 383.35 84.84 386.12 87 C391.67 91.51 396.7 96.51 401.75 101.56 C402.55 102.37 403.36 103.17 404.19 104 C408.99 108.84 413.59 113.8 418 119 C418.55 119.64 419.1 120.28 419.66 120.94 C428.39 131.23 436.41 141.86 444 153 C444.84 154.21 445.67 155.42 446.51 156.63 C491.06 221.58 516.53 297.04 525 375 C525.12 376.1 525.24 377.21 525.36 378.34 C527.02 394.48 527.2 410.61 527.25 426.81 C527.26 427.79 527.26 428.77 527.27 429.78 C527.31 440.7 527.02 451.52 526.1 462.41 C526.02 463.34 525.94 464.28 525.86 465.24 C524.36 481.25 519.93 497.11 510 510 C509.38 510.81 508.75 511.62 508.11 512.46 C492.52 531.23 468.84 536.92 445.56 539.12 C433.73 540.15 421.87 540.69 410 541 C409.16 541.02 408.33 541.05 407.46 541.07 C319.84 543.18 230.74 519.79 160 467 C159.42 466.57 158.84 466.14 158.24 465.69 C146.27 456.78 135.01 447.06 124 437 C123.01 436.1 122.02 435.21 121.03 434.31 C112.89 426.93 104.94 419.43 97.79 411.06 C96.56 409.64 95.3 408.25 94.02 406.88 C86.75 399.04 80.38 390.56 74 382 C73.45 381.27 72.91 380.54 72.34 379.79 C58.49 361.32 47.37 341.6 37 321 C36.62 320.26 36.25 319.52 35.86 318.77 C6.16 260.21 -1.11 193.72 -2 129 C-2.02 127.83 -2.03 126.66 -2.05 125.46 C-2.54 83.66 -1.2 41.78 0 0 Z " fill="#007EFF" transform="translate(562,573)"/>
  <path d="M0 0 C1.76 23.08 2.13 46.17 2.23 69.31 C2.24 71.69 2.26 74.07 2.28 76.45 C2.43 92.56 1.46 108.08 -1 124 C-1.16 125.04 -1.32 126.08 -1.48 127.15 C-2.67 134.88 -3.95 142.6 -5.25 150.31 C-5.55 152.07 -5.55 152.07 -5.85 153.87 C-14.77 206.85 -25.87 258.18 -49 307 C-49.41 307.88 -49.82 308.76 -50.24 309.67 C-73.36 359 -109.32 410.2 -152.61 444.11 C-154.9 445.92 -157.04 447.83 -159.19 449.81 C-198.41 484.93 -249.42 508.96 -299 525 C-299.96 525.31 -300.91 525.63 -301.9 525.95 C-358.4 544.29 -436.51 561.93 -493 534 C-511.9 523.61 -524.61 507.91 -531.31 487.44 C-537.05 467.15 -536.21 445.63 -536.19 424.75 C-536.19 423.5 -536.19 422.25 -536.19 420.96 C-536.16 403.23 -535.99 385.64 -534 368 C-533.81 366.21 -533.81 366.21 -533.61 364.38 C-524.45 281.23 -495.51 201.32 -441.41 136.69 C-439.46 134.35 -437.58 131.95 -435.69 129.56 C-423.58 114.8 -409.82 100.22 -395.22 87.88 C-393.38 86.33 -391.58 84.75 -389.78 83.15 C-380.52 74.97 -370.92 67.37 -361 60 C-360.25 59.44 -359.5 58.87 -358.72 58.29 C-332.86 39 -332.86 39 -327 39 C-327 40.14 -327 40.14 -326.99 41.3 C-326.91 59.85 -326.82 78.4 -326.71 96.95 C-326.66 105.92 -326.62 114.89 -326.58 123.86 C-326.55 131.68 -326.51 139.5 -326.46 147.33 C-326.43 151.47 -326.41 155.6 -326.4 159.74 C-326.38 163.65 -326.36 167.55 -326.33 171.46 C-326.32 172.88 -326.32 174.3 -326.32 175.72 C-326.29 191.01 -326.17 208.72 -314.91 220.41 C-310.21 224.32 -304.68 225.69 -298.61 225.38 C-273.87 221.79 -250.04 202.8 -229.03 189.86 C-226.46 188.28 -223.88 186.73 -221.29 185.18 C-200.59 172.82 -180.5 159.17 -161 145 C-159.86 144.17 -159.86 144.17 -158.69 143.32 C-144.77 133.21 -131.18 122.81 -118.11 111.63 C-115.16 109.12 -112.15 106.68 -109.12 104.25 C-105.42 101.23 -101.99 98.11 -98.67 94.68 C-96.87 92.87 -94.99 91.22 -93.06 89.56 C-89.62 86.59 -86.41 83.46 -83.25 80.19 C-81.32 78.31 -79.36 76.57 -77.32 74.82 C-73.25 71.26 -69.41 67.53 -65.61 63.69 C-64.92 62.99 -64.23 62.3 -63.51 61.59 C-62.03 60.1 -60.55 58.6 -59.07 57.11 C-56.72 54.75 -54.38 52.39 -52.03 50.04 C-45.36 43.35 -38.7 36.65 -32.05 29.95 C-27.96 25.84 -23.87 21.73 -19.78 17.63 C-18.23 16.07 -16.67 14.5 -15.12 12.93 C-12.95 10.75 -10.79 8.58 -8.62 6.41 C-7.97 5.75 -7.33 5.1 -6.67 4.43 C-2.23 0 -2.23 0 0 0 Z " fill="#007EFF" transform="translate(537,564)"/>
`;

const sendError = (res, status, error) => res.status(status).setHeader('Cache-Control', 'no-store').json({ error });

const fetchAvatarBuffer = async (avatarRelPath) => {
  if (!avatarRelPath) return null;
  const cleanPath = avatarRelPath.split('?')[0];

  // 1. Try local filesystem first
  try {
    const localPath = path.join(process.cwd(), 'public', cleanPath);
    if (fs.existsSync(localPath)) {
      return fs.readFileSync(localPath);
    }
  } catch {}

  // 2. Fetch over HTTP if not on local disk
  try {
    const response = await fetch(`${SITE_URL}${cleanPath}`);
    if (response.ok) {
      return Buffer.from(await response.arrayBuffer());
    }
  } catch {}

  return null;
};

const buildCardSvg = (expert) => {
  const code = escapeXml(expert.code || 'GAENR');
  const category = escapeXml(expert.categoryTitle || 'Verified Expert');
  const deliveries = expert.completedProjects || 0;
  const rating = expert.reviewsCount > 0 ? Number(expert.rating || 0).toFixed(1) : '0.0';
  const satisfaction = expert.reviewsCount > 0 ? `${expert.satisfactionRate?.satisfied ?? 100}%` : 'NEW';

  const width = 680;
  const height = 960;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <style>
        @font-face {
          font-family: 'DM Sans';
          src: url('data:font/ttf;base64,${dmSansBoldBase64}') format('truetype');
          font-weight: 700;
          font-style: normal;
        }
        .dm-sans {
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
      </style>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#0b1329"/>
        <stop offset="0.52" stop-color="#0b1120"/>
        <stop offset="1" stop-color="#0f1d40"/>
      </linearGradient>
      <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#006eff"/>
        <stop offset="1" stop-color="#22d3ee"/>
      </linearGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity=".4"/>
      </filter>
    </defs>

    <!-- Card Background -->
    <rect x="16" y="16" width="648" height="928" rx="44" fill="url(#bg)" stroke="#2563eb" stroke-opacity=".5" stroke-width="2" filter="url(#shadow)"/>
    <circle cx="590" cy="100" r="140" fill="#2563eb" opacity=".12"/>
    <circle cx="80" cy="860" r="140" fill="#22d3ee" opacity=".09"/>

    <!-- Top Lanyard Slot -->
    <rect x="290" y="44" width="100" height="20" rx="10" fill="#020617" stroke="#334155"/>
    <rect x="325" y="50" width="30" height="8" rx="4" fill="#1e293b"/>

    <!-- Header Logo & Brand -->
    <g transform="translate(230, 96) scale(0.04)">
      ${gaenrLogoPaths}
    </g>
    <text x="360" y="132" fill="#ffffff" class="dm-sans" font-size="28" font-weight="900" letter-spacing="5" text-anchor="middle">GAENR</text>
    <line x1="86" y1="168" x2="594" y2="168" stroke="#ffffff" stroke-opacity=".14"/>

    <!-- Avatar Glow Rings -->
    <circle cx="340" cy="320" r="126" fill="url(#ring)"/>
    <circle cx="340" cy="320" r="116" fill="#0b1329"/>

    <!-- Verified Badge -->
    <g transform="translate(410, 390)">
      <circle cx="26" cy="26" r="24" fill="#006eff" stroke="#0b1120" stroke-width="6"/>
      <path d="M16 26l7 7 13-15" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    </g>

    <!-- Expert Code Badge -->
    <rect x="160" y="486" width="360" height="76" rx="20" fill="#ffffff" fill-opacity=".06" stroke="#ffffff" stroke-opacity=".15"/>
    <text x="340" y="536" fill="#ffffff" class="dm-sans" font-size="34" font-weight="900" letter-spacing="5" text-anchor="middle">${code}</text>

    <!-- Discipline / Category Badge -->
    <rect x="150" y="586" width="380" height="50" rx="25" fill="#2563eb" fill-opacity=".18" stroke="#60a5fa" stroke-opacity=".4"/>
    <text x="340" y="618" fill="#bfdbfe" class="dm-sans" font-size="20" font-weight="700" text-anchor="middle">${category}</text>
    <line x1="86" y1="680" x2="594" y2="680" stroke="#ffffff" stroke-opacity=".14"/>

    <!-- Metrics Row -->
    <text x="170" y="744" fill="#ffffff" class="dm-sans" font-size="28" font-weight="900" text-anchor="middle">${deliveries}</text>
    <text x="170" y="774" fill="#94a3b8" class="dm-sans" font-size="13" font-weight="700" letter-spacing="1" text-anchor="middle">DELIVERIES</text>

    <text x="340" y="744" fill="#fbbf24" class="dm-sans" font-size="28" font-weight="900" text-anchor="middle">${rating}</text>
    <text x="340" y="774" fill="#94a3b8" class="dm-sans" font-size="13" font-weight="700" letter-spacing="1" text-anchor="middle">RATING</text>

    <text x="510" y="744" fill="#34d399" class="dm-sans" font-size="28" font-weight="900" text-anchor="middle">${satisfaction}</text>
    <text x="510" y="774" fill="#94a3b8" class="dm-sans" font-size="13" font-weight="700" letter-spacing="1" text-anchor="middle">SATISFACTION</text>

    <!-- Card Footer -->
    <text x="340" y="878" fill="#94a3b8" class="dm-sans" font-size="15" font-weight="700" text-anchor="middle">Verified Expert • Gaenr Ecosystem</text>
  </svg>`;
};

export default async function handler(req, res) {
  const url = new URL(req.url || '/', SITE_URL);
  const code = (url.searchParams.get('code') || '').trim();
  if (!/^[A-Za-z0-9]{4,20}$/.test(code)) return sendError(res, 400, 'Invalid expert code');
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) return sendError(res, 503, 'Database is not configured');

  try {
    const sql = neon(connectionString);

    // 1. If an exact browser-rendered snapshot exists, serve it directly
    try {
      const cardRows = await sql`SELECT image_data FROM gaenr_id_cards WHERE code = ${code} LIMIT 1`;
      if (cardRows[0]?.image_data) {
        const raw = cardRows[0].image_data;
        const base64Data = raw.includes(',') ? raw.split(',')[1] : raw;
        const imageBuffer = Buffer.from(base64Data, 'base64');
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
        if (url.searchParams.get('download') === '1') {
          res.setHeader('Content-Disposition', `attachment; filename="GAENR-ID-${code}.png"`);
        }
        return res.status(200).send(imageBuffer);
      }
    } catch {}

    const rows = await sql`SELECT state->>'gaenr_freelancers' AS list FROM gaenr_app_state WHERE id = 1`;
    let experts = [];
    try { experts = JSON.parse(rows[0]?.list || '[]'); } catch { experts = []; }
    const expert = experts.find((item) => item?.code === code);
    if (!expert) return sendError(res, 404, 'Expert not found');

    const avatarRelPath = avatarMap[expert.avatarId] || avatarMap['avatar-youth-m1'];
    const avatarRawBuffer = await fetchAvatarBuffer(avatarRelPath);

    const composites = [];
    if (avatarRawBuffer) {
      const avatarSize = 228;
      const avatarCircleMask = Buffer.from(
        `<svg width="${avatarSize}" height="${avatarSize}"><circle cx="${avatarSize / 2}" cy="${avatarSize / 2}" r="${avatarSize / 2}" fill="#fff"/></svg>`
      );
      const circularAvatar = await sharp(avatarRawBuffer)
        .resize(avatarSize, avatarSize, { fit: 'cover' })
        .composite([{ input: avatarCircleMask, blend: 'dest-in' }])
        .png()
        .toBuffer();

      composites.push({ input: circularAvatar, top: 206, left: 226 });
    }

    const cardSvgString = buildCardSvg(expert);
    const png = await sharp(Buffer.from(cardSvgString))
      .composite(composites)
      .png()
      .toBuffer();

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
    if (url.searchParams.get('download') === '1') {
      res.setHeader('Content-Disposition', `attachment; filename="GAENR-ID-${code}.png"`);
    }
    return res.status(200).send(png);
  } catch (error) {
    console.error('id-card error:', error);
    return sendError(res, 500, 'Failed to render ID card');
  }
}
