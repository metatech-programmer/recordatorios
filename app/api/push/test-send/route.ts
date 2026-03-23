import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { getSubscriptions, removeSubscription } from '@/lib/pushStore';
import { getSubscriptionsSupabase, isSupabaseConfigured } from '@/lib/supabasePush';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { title = 'Prueba de notificación', body: msg = 'Este es un envío de prueba', subscription } = body as any;

    // Configure VAPID
    if (process.env.VAPID_PRIVATE_KEY && process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_SUBJECT) {
      webpush.setVapidDetails(process.env.VAPID_SUBJECT, process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);
    }

    const payload = JSON.stringify({ title, body: msg });

    // If a subscription was provided in the POST body, send only to it
    if (subscription && subscription.endpoint) {
      try {
        await webpush.sendNotification(subscription, payload);
        return NextResponse.json({ success: true, sentTo: subscription.endpoint });
      } catch (err) {
        console.error('Error sending to provided subscription', err);
        return NextResponse.json({ error: 'Failed sending to provided subscription', detail: String(err) }, { status: 500 });
      }
    }

    // Otherwise, send to stored subscriptions (Supabase or local file)
    if (!process.env.VAPID_PRIVATE_KEY || !process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
      return NextResponse.json({ error: 'VAPID keys not configured. Set NEXT_PUBLIC_VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY.' }, { status: 400 });
    }

    const subs = isSupabaseConfigured() ? await getSubscriptionsSupabase() : await getSubscriptions();

    const results: any[] = [];

    await Promise.all(
      subs.map(async (s: any) => {
        try {
          await webpush.sendNotification({ endpoint: s.endpoint, keys: s.keys }, payload);
          results.push({ endpoint: s.endpoint, ok: true });
        } catch (err: any) {
          results.push({ endpoint: s.endpoint, ok: false, error: err?.message || err });
          const status = err && (err.statusCode || err.status);
          if (status === 410 || status === 404) {
            try { await removeSubscription(s.endpoint); } catch (e) { /* ignore */ }
          }
        }
      })
    );

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('Error in test-send:', error);
    return NextResponse.json({ error: 'Error ejecutando test-send' }, { status: 500 });
  }
}

// no-op
