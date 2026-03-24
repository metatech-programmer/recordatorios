import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { getSubscriptionsSupabase, isSupabaseConfigured } from '@/lib/supabasePush';
import { getDueRemindersSupabase, markReminderSentSupabase } from '@/lib/supabasePush';

// POST /api/push/run-scheduler
export async function POST(request: Request) {
  try {
    // Verify CRON secret if configured
    try {
      const auth = request.headers.get('authorization') || request.headers.get('Authorization');
      if (process.env.CRON_SECRET) {
        if (!auth || auth !== `Bearer ${process.env.CRON_SECRET}`) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
      }
    } catch (e) {
      // ignore header parsing errors
    }
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 400 });
    }

    if (process.env.VAPID_PRIVATE_KEY && process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_SUBJECT) {
      webpush.setVapidDetails(process.env.VAPID_SUBJECT, process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);
    }

    // Get due reminders
    const due = await getDueRemindersSupabase(1);
    const results: Array<{ reminderId?: any; sentTo: number }> = [];

    for (const r of due) {
      // find subscriptions for this reminder's device_id
      let sentCount = 0;
      try {
        const subs = await getSubscriptionsSupabase();
        const targets = subs.filter((s: any) => s.device_id === r.device_id || (!r.device_id && true));

        const payload = JSON.stringify({ title: r.title || 'Recordatorio', body: r.body || '', reminderId: r.id || r.reminder_id });

        await Promise.all(
          targets.map(async (s: any) => {
            try {
              await webpush.sendNotification({ endpoint: s.endpoint, keys: s.keys }, payload);
              sentCount++;
            } catch (err) {
              console.warn('Failed sending to', s.endpoint, err?.statusCode || err?.message || err);
            }
          })
        );

        // mark reminder sent
        try { await markReminderSentSupabase(r.reminder_id || r.id); } catch (e) {}
      } catch (e) {
        console.warn('Error processing reminder', r, e);
      }

      results.push({ reminderId: r.reminder_id || r.id, sentTo: sentCount });
    }

    return NextResponse.json({ success: true, results }, { status: 200 });
  } catch (error) {
    console.error('Error running scheduler:', error);
    return NextResponse.json({ error: 'Error running scheduler' }, { status: 500 });
  }
}
