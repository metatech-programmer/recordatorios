// Supabase Edge Function to trigger the app scheduler
// Deploy with the Supabase CLI (`supabase functions deploy run-scheduler`) and set env vars below

// Deno types are not available during the Next.js TypeScript build, declare minimal Deno env
declare const Deno: any;

export default async function handler(req: Request) {
  const DEPLOY_URL = Deno.env.get('DEPLOY_URL') || 'https://recordatorios.vercel.app';
  const CRON_SECRET = Deno.env.get('CRON_SECRET');

  if (!CRON_SECRET) {
    return new Response(JSON.stringify({ error: 'CRON_SECRET not configured in function' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const resp = await fetch(`${DEPLOY_URL.replace(/\/+$/, '')}/api/push/run-scheduler`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CRON_SECRET}`,
        'Content-Type': 'application/json'
      }
    });

    const text = await resp.text().catch(() => '');
    return new Response(text || JSON.stringify({ status: resp.status, ok: resp.ok }), {
      status: resp.status || 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
