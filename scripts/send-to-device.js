#!/usr/bin/env node
/*
  Usage:
    node scripts/send-to-device.js --deviceId=ID --title="Título" --body="Mensaje"

  The script will try Supabase if NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
  are present, otherwise it will read the local data/push_subscriptions.json file.
*/

try { require('dotenv').config(); } catch (e) {}

const fs = require('fs');
const path = require('path');
const webpush = require('web-push');

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (const a of args) {
    const m = a.match(/^--([^=]+)=(.*)$/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

async function getSubsFromSupabase(deviceId) {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_KEY) return [];
  const url = `${SUPABASE_URL.replace(/\/+$/, '')}/rest/v1/push_subscriptions?select=endpoint,keys&device_id=eq.${encodeURIComponent(deviceId)}`;
  const res = await fetch(url, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } });
  if (!res.ok) throw new Error(`Supabase error ${res.status}`);
  return await res.json();
}

function getSubsFromFile(deviceId) {
  const file = path.join(process.cwd(), 'data', 'push_subscriptions.json');
  if (!fs.existsSync(file)) return [];
  try {
    const raw = fs.readFileSync(file, 'utf-8');
    const list = JSON.parse(raw || '[]');
    return list.filter((s) => !deviceId || s.deviceId === deviceId || s.device_id === deviceId);
  } catch (e) {
    console.error('Error reading local subscriptions file', e);
    return [];
  }
}

async function main() {
  const args = parseArgs();
  const deviceId = args.deviceId;
  const title = args.title || 'Prueba desde script';
  const body = args.body || 'Mensaje de prueba';

  if (!deviceId) {
    console.error('Error: --deviceId is required');
    process.exit(2);
  }

  const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const vapidPrivate = process.env.VAPID_PRIVATE_KEY;
  const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:example@example.com';

  if (!vapidPublic || !vapidPrivate) {
    console.error('VAPID keys not configured. Set NEXT_PUBLIC_VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY in env.');
    process.exit(3);
  }

  webpush.setVapidDetails(vapidSubject, vapidPublic, vapidPrivate);

  let subs = [];
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      subs = await getSubsFromSupabase(deviceId);
    } else {
      subs = getSubsFromFile(deviceId);
    }
  } catch (e) {
    console.error('Error fetching subscriptions:', e);
    process.exit(4);
  }

  if (!subs || subs.length === 0) {
    console.error('No subscriptions found for deviceId:', deviceId);
    process.exit(1);
  }

  const payload = JSON.stringify({ title, body });

  const results = [];
  for (const s of subs) {
    try {
      const sub = { endpoint: s.endpoint, keys: s.keys };
      await webpush.sendNotification(sub, payload);
      console.log('Sent to', s.endpoint);
      results.push({ endpoint: s.endpoint, ok: true });
    } catch (e) {
      console.error('Failed to send to', s.endpoint, e && e.stack ? e.stack : e);
      results.push({ endpoint: s.endpoint, ok: false, error: String(e) });
    }
  }

  console.log('Done. Results:', results);
}

main().catch((e) => { console.error(e); process.exit(10); });
