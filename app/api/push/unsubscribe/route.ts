import { NextResponse } from 'next/server';
import { removeSubscription } from '@/lib/pushStore';
import { removeSubscriptionSupabase, isSupabaseConfigured } from '@/lib/supabasePush';

// POST /api/push/unsubscribe
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const subscription = body.subscription || body;
    const deviceId = body.deviceId || subscription.deviceId || null;

    if (!subscription || !subscription.endpoint) {
      // allow unsubscribe by deviceId only
      if (!deviceId) return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 });
    }

    const identifier = deviceId || subscription.endpoint;

    if (isSupabaseConfigured()) {
      try {
        await removeSubscriptionSupabase(identifier);
        console.log('🗑️ Unsubscribed from Supabase:', identifier);
      } catch (e) {
        console.warn('Failed removing from Supabase, removing local copy', e);
        await removeSubscription(identifier);
      }
    } else {
      await removeSubscription(identifier);
      console.log('🗑️ Unsubscribed:', identifier);
    }

    return NextResponse.json({ success: true, message: 'Unsubscribed' }, { status: 200 });
  } catch (error) {
    console.error('Error en /api/push/unsubscribe:', error);
    return NextResponse.json({ error: 'Error procesando unsubscribe' }, { status: 500 });
  }
}
