import { neon } from '@neondatabase/serverless';

const SITE_URL = (process.env.SITE_URL || 'https://gaenr.com').replace(/\/$/, '');
const escapeXml = (value = '') => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));
const avatarMap = {
  'avatar-youth-m1': '/images/avatars/student_male_1.png',
  'avatar-youth-f1': '/images/avatars/student_female_1.png',
  'avatar-youth-m2': '/images/avatars/student_male_2.png',
  'avatar-youth-f2': '/images/avatars/student_female_2.png',
  'avatar-youth-m3': '/images/avatars/student_male_3.png',
  'avatar-youth-tg1': '/images/avatars/student_third_gender_1.png',
  'avatar-youth-m4': '/images/avatars/student_male_4.png?v=2',
  'avatar-youth-f4': '/images/avatars/student_female_4.png?v=3',
  'avatar-youth-m5': '/images/avatars/student_male_5.png',
  'avatar-youth-f5': '/images/avatars/student_female_5.png',
};

const sendError = (res, status, error) => res.status(status).setHeader('Cache-Control', 'no-store').json({ error });

const buildCardSvg = (expert) => {
  const code = escapeXml(expert.code || 'GAENR');
  const category = escapeXml(expert.categoryTitle || 'Verified Expert');
  const avatar = `${SITE_URL}${avatarMap[expert.avatarId] || avatarMap['avatar-youth-m1']}`;
  const logo = `${SITE_URL}/logo.svg`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="680" height="960" viewBox="0 0 680 960">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1329"/><stop offset="0.52" stop-color="#0b1120"/><stop offset="1" stop-color="#0f1d40"/></linearGradient>
    <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#006eff"/><stop offset="1" stop-color="#22d3ee"/></linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#000000" flood-opacity=".3"/></filter>
    <filter id="whiteLogo"><feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"/></filter>
    <clipPath id="avatarClip"><circle cx="340" cy="325" r="112"/></clipPath>
  </defs>
  <rect x="12" y="12" width="656" height="936" rx="48" fill="url(#bg)" stroke="#2563eb" stroke-opacity=".5" stroke-width="2" filter="url(#shadow)"/>
  <circle cx="610" cy="90" r="130" fill="#2563eb" opacity=".12"/><circle cx="70" cy="875" r="130" fill="#22d3ee" opacity=".09"/>
  <rect x="290" y="48" width="100" height="22" rx="11" fill="#020617" stroke="#334155"/>
  <rect x="320" y="55" width="40" height="8" rx="4" fill="#1e293b"/>
  <image href="${logo}" x="250" y="104" width="54" height="54" preserveAspectRatio="xMidYMid meet" filter="url(#whiteLogo)"/>
  <text x="340" y="143" fill="#ffffff" font-family="DM Sans,Arial,sans-serif" font-size="30" font-weight="900" letter-spacing="7" text-anchor="middle">GAENR</text>
  <line x1="86" y1="178" x2="594" y2="178" stroke="#ffffff" stroke-opacity=".14"/>
  <circle cx="340" cy="325" r="127" fill="url(#ring)"/>
  <circle cx="340" cy="325" r="115" fill="#eef2f6"/>
  <image href="${avatar}" x="225" y="210" width="230" height="230" preserveAspectRatio="xMidYMid slice" clip-path="url(#avatarClip)"/>
  <circle cx="435" cy="420" r="27" fill="#006eff" stroke="#0b1120" stroke-width="7"/>
  <path d="M422 420l9 9 17-21" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="160" y="492" width="360" height="76" rx="18" fill="#ffffff" fill-opacity=".06" stroke="#ffffff" stroke-opacity=".14"/>
  <text x="340" y="542" fill="#ffffff" font-family="DM Sans,Arial,sans-serif" font-size="35" font-weight="900" letter-spacing="6" text-anchor="middle">${code}</text>
  <rect x="150" y="592" width="380" height="48" rx="24" fill="#2563eb" fill-opacity=".16" stroke="#60a5fa" stroke-opacity=".35"/>
  <text x="340" y="623" fill="#bfdbfe" font-family="DM Sans,Arial,sans-serif" font-size="20" font-weight="700" text-anchor="middle">${category}</text>
  <line x1="86" y1="690" x2="594" y2="690" stroke="#ffffff" stroke-opacity=".14"/>
  <text x="170" y="755" fill="#ffffff" font-family="DM Sans,Arial,sans-serif" font-size="28" font-weight="900" text-anchor="middle">${expert.completedProjects || 0}</text>
  <text x="170" y="785" fill="#94a3b8" font-family="DM Sans,Arial,sans-serif" font-size="14" font-weight="700" text-anchor="middle">DELIVERIES</text>
  <text x="340" y="755" fill="#fbbf24" font-family="DM Sans,Arial,sans-serif" font-size="28" font-weight="900" text-anchor="middle">${expert.reviewsCount > 0 ? Number(expert.rating || 0).toFixed(1) : '0.0'}</text>
  <text x="340" y="785" fill="#94a3b8" font-family="DM Sans,Arial,sans-serif" font-size="14" font-weight="700" text-anchor="middle">RATING</text>
  <text x="510" y="755" fill="#34d399" font-family="DM Sans,Arial,sans-serif" font-size="28" font-weight="900" text-anchor="middle">${expert.reviewsCount > 0 ? `${expert.satisfactionRate?.satisfied ?? 100}%` : 'NEW'}</text>
  <text x="510" y="785" fill="#94a3b8" font-family="DM Sans,Arial,sans-serif" font-size="14" font-weight="700" text-anchor="middle">SATISFACTION</text>
  <text x="340" y="885" fill="#94a3b8" font-family="DM Sans,Arial,sans-serif" font-size="16" text-anchor="middle">Verified Expert • Gaenr Ecosystem</text>
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
    const rows = await sql`SELECT state->>'gaenr_freelancers' AS list FROM gaenr_app_state WHERE id = 1`;
    let experts = [];
    try { experts = JSON.parse(rows[0]?.list || '[]'); } catch { experts = []; }
    const expert = experts.find((item) => item?.code === code);
    if (!expert) return sendError(res, 404, 'Expert not found');

    const svg = buildCardSvg(expert);
    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
    if (url.searchParams.get('download') === '1') {
      res.setHeader('Content-Disposition', `attachment; filename="GAENR-ID-${code}.svg"`);
    }
    return res.status(200).send(svg);
  } catch (error) {
    console.error('id-card error:', error);
    return sendError(res, 500, 'Failed to render ID card');
  }
}
