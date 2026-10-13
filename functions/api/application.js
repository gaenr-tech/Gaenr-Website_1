import { neon } from '@neondatabase/serverless';

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  const isD1 = Boolean(env.DB);
  const connectionString = env.DATABASE_URL || env.POSTGRES_URL;

  if (!id) {
    return new Response(JSON.stringify({ error: 'Application ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  try {
    let rawApps = null;

    if (isD1) {
      const row = await env.DB
        .prepare('SELECT state FROM gaenr_app_state WHERE id = 1')
        .first();
      let state = {};
      try {
        state = typeof row?.state === 'string' ? JSON.parse(row.state) : row?.state || {};
      } catch {}
      rawApps = state.gaenr_expert_applications;
    } else if (connectionString) {
      const sql = neon(connectionString);
      const rows = await sql`SELECT state FROM gaenr_app_state WHERE id = 1 LIMIT 1`;
      const state = rows[0]?.state || {};
      rawApps = state.gaenr_expert_applications;
    }

    let apps = [];
    if (Array.isArray(rawApps)) {
      apps = rawApps;
    } else if (typeof rawApps === 'string') {
      try {
        apps = JSON.parse(rawApps);
      } catch {}
    }

    const found = apps.find((a) => a && a.id === id);
    if (!found) {
      return new Response(JSON.stringify({ error: 'Application not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    return new Response(JSON.stringify(found), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}

export async function onRequestPost({ request, env }) {
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const body = await request.json().catch(() => ({}));
    const id = body.id || body.applicationId;
    const onboardingData = body.onboardingData;
    const baseApp = body.baseApp || {};

    if (!id || !onboardingData) {
      return new Response(
        JSON.stringify({ error: 'Missing applicationId or onboardingData' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const isD1 = Boolean(env.DB);
    if (!isD1) {
      return new Response(
        JSON.stringify({ ok: true, savedLocallyOnly: true }),
        { status: 200, headers: corsHeaders }
      );
    }

    // Read current state from D1
    const row = await env.DB
      .prepare('SELECT state FROM gaenr_app_state WHERE id = 1')
      .first();
    let state = {};
    try {
      state = typeof row?.state === 'string' ? JSON.parse(row.state) : row?.state || {};
    } catch {}

    let apps = [];
    const rawApps = state.gaenr_expert_applications;
    if (Array.isArray(rawApps)) {
      apps = rawApps;
    } else if (typeof rawApps === 'string') {
      try {
        apps = JSON.parse(rawApps);
      } catch {}
    }

    let found = apps.find((a) => a && a.id === id);
    if (found) {
      if (found.onboardingData && found.onboardingData.statement) {
        return new Response(
          JSON.stringify({ ok: true, alreadySubmitted: true, application: found }),
          { status: 200, headers: corsHeaders }
        );
      }
      found.onboardingData = {
        ...onboardingData,
        submittedAt: new Date().toISOString(),
      };
      found.status = 'submitted';
    } else {
      found = {
        id,
        fullName: baseApp.fullName || 'Verified Expert',
        email: baseApp.email || '',
        whatsapp: baseApp.whatsapp || '',
        gender: baseApp.gender || 'Male',
        skill: baseApp.skill || 'Verified Skill',
        otherSkill: baseApp.otherSkill,
        status: 'submitted',
        createdAt: baseApp.createdAt || new Date().toISOString(),
        occupation: baseApp.occupation || 'Freelance Expert',
        address: baseApp.address || 'Bangladesh',
        experience: baseApp.experience || 'Verified',
        portfolioUrl: baseApp.portfolioUrl || '',
        googleDriveAssetFolderUrl: '',
        onboardingData: {
          ...onboardingData,
          submittedAt: new Date().toISOString(),
        },
      };
      apps.push(found);
    }

    state.gaenr_expert_applications = JSON.stringify(apps);
    const now = new Date().toISOString();

    await env.DB
      .prepare(
        'INSERT INTO gaenr_app_state (id, state, updated_at) VALUES (1, ?, ?) ON CONFLICT(id) DO UPDATE SET state = excluded.state, updated_at = excluded.updated_at'
      )
      .bind(JSON.stringify(state), now)
      .run();

    return new Response(
      JSON.stringify({ ok: true, saved: true, application: found }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
