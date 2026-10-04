export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({
    ok: true,
    service: 'gaenr-vercel-api',
    databaseConfigured: Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL),
    emailConfigured: Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM),
    emailFromConfigured: Boolean(process.env.EMAIL_FROM),
    timestamp: new Date().toISOString(),
  });
}
