export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({
    ok: true,
    service: 'gaenr-vercel-api',
    databaseConfigured: Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL),
    timestamp: new Date().toISOString(),
  });
}
