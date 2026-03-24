const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

type SubRecord = { endpoint: string; keys?: any; device_id?: string; created_at?: string };

function hasSupabase() {
  return !!SUPABASE_URL && !!SUPABASE_KEY;
}

async function supabaseFetch(path: string, options: RequestInit = {}) {
  if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error('Supabase not configured');
  const url = `${SUPABASE_URL.replace(/\/+$/, '')}/rest/v1${path}`;
  const headers = Object.assign({}, options.headers || {}, {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
  });
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err: any = new Error(`Supabase error ${res.status}: ${text}`);
    err.status = res.status;
    throw err;
  }
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return res.json();
  return res.text();
}

export async function addSubscriptionSupabase(sub: { endpoint: string; keys?: any; deviceId?: string }) {
  if (!hasSupabase()) return false;
  try {
    await supabaseFetch('/push_subscriptions', {
      method: 'POST',
      body: JSON.stringify({ endpoint: sub.endpoint, keys: sub.keys, device_id: sub.deviceId || null, created_at: new Date().toISOString() }),
      headers: { Prefer: 'return=representation' },
    });
    return true;
  } catch (e) {
    // if conflict (already exists) supabase returns 409; ignore
    return false;
  }
}

export async function removeSubscriptionSupabase(identifier: string) {
  if (!hasSupabase()) return false;
  try {
    // determine whether identifier is endpoint or device id
    if (identifier && (identifier.startsWith('http://') || identifier.startsWith('https://'))) {
      const encoded = encodeURIComponent(identifier);
      await supabaseFetch(`/push_subscriptions?endpoint=eq.${encoded}`, { method: 'DELETE' });
    } else {
      // device id
      const encoded = encodeURIComponent(identifier);
      await supabaseFetch(`/push_subscriptions?device_id=eq.${encoded}`, { method: 'DELETE' });
    }
    return true;
  } catch (e) {
    return false;
  }
}

export async function getSubscriptionsSupabase(): Promise<SubRecord[]> {
  if (!hasSupabase()) return [];
  try {
    // order by created_at descending
    const data = await supabaseFetch('/push_subscriptions?select=endpoint,keys,device_id,created_at');
    return data as SubRecord[];
  } catch (e) {
    return [];
  }
}

export function isSupabaseConfigured() {
  return hasSupabase();
}

// Reminders helpers
export type ReminderRecord = { id?: string | number; title: string; body?: string; next_occurrence: string; device_id?: string; sent?: boolean };

export async function upsertReminderSupabase(rem: ReminderRecord) {
  if (!hasSupabase()) return false;
  try {
    // Insert representation; Supabase should handle duplicates via primary key / constraints if configured
    const body = JSON.stringify({ reminder_id: rem.id || null, title: rem.title, body: rem.body || null, next_occurrence: rem.next_occurrence, device_id: rem.device_id || null, sent: rem.sent || false });
    await supabaseFetch('/push_reminders', { method: 'POST', body, headers: { Prefer: 'return=representation' } });
    return true;
  } catch (e) {
    return false;
  }
}

export async function getDueRemindersSupabase(windowMinutes = 1): Promise<ReminderRecord[]> {
  if (!hasSupabase()) return [];
  try {
    // fetch reminders not sent and whose next_occurrence is <= now + windowMinutes
    const cutoff = new Date(Date.now() + windowMinutes * 60 * 1000).toISOString();
    const data = await supabaseFetch(`/push_reminders?select=reminder_id,title,body,next_occurrence,device_id,sent&sent=eq.false&next_occurrence=lte.${encodeURIComponent(cutoff)}`);
    return data as ReminderRecord[];
  } catch (e) {
    return [];
  }
}

export async function markReminderSentSupabase(reminderId: string | number) {
  if (!hasSupabase()) return false;
  try {
    await supabaseFetch(`/push_reminders?reminder_id=eq.${encodeURIComponent(String(reminderId))}`, { method: 'PATCH', body: JSON.stringify({ sent: true }) });
    return true;
  } catch (e) {
    return false;
  }
}
