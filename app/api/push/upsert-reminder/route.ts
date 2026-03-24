import { NextResponse } from 'next/server';
import { upsertReminderSupabase, isSupabaseConfigured } from '@/lib/supabasePush';

// POST /api/push/upsert-reminder
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { reminder, deviceId } = body as any;

    if (!reminder || !reminder.nextOccurrence || !reminder.title) {
      return NextResponse.json({ error: 'Invalid reminder' }, { status: 400 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 400 });
    }

    const rec = {
      id: reminder.id || null,
      title: reminder.title,
      body: reminder.description || reminder.body || null,
      next_occurrence: new Date(reminder.nextOccurrence).toISOString(),
      device_id: deviceId || null,
      sent: false,
    };

    const ok = await upsertReminderSupabase(rec as any);
    if (!ok) return NextResponse.json({ error: 'Failed to upsert reminder' }, { status: 500 });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Error in /api/push/upsert-reminder:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
