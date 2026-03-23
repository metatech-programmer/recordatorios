import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { addSubscription } from '@/lib/pushStore';
import { addSubscriptionSupabase, isSupabaseConfigured } from '@/lib/supabasePush';

// POST /api/push/subscribe
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as any;
    // support either full subscription as body or { subscription, deviceId }
    const subscription = body.subscription || body;
    const deviceId = body.deviceId || subscription.deviceId || null;

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 });
    }

    // Configure VAPID if available
    if (process.env.VAPID_PRIVATE_KEY && process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_SUBJECT) {
      try {
        webpush.setVapidDetails(process.env.VAPID_SUBJECT, process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);
      } catch (e) {
        console.warn('Failed to set VAPID details:', e);
      }
    }

    // Try Supabase first if configured, otherwise use local file store
    if (isSupabaseConfigured()) {
      try {
        await addSubscriptionSupabase({ endpoint: subscription.endpoint, keys: subscription.keys, deviceId });
        console.log('📬 Nueva suscripción push guardada en Supabase:', subscription.endpoint);
      } catch (e) {
        console.warn('No se pudo guardar en Supabase, guardando localmente', e);
        await addSubscription({ endpoint: subscription.endpoint, keys: subscription.keys, deviceId, createdAt: Date.now() } as any);
      }
    } else {
      await addSubscription({ endpoint: subscription.endpoint, keys: subscription.keys, deviceId, createdAt: Date.now() } as any);
      console.log('📬 Nueva suscripción push guardada:', subscription.endpoint);
    }

    return NextResponse.json({ success: true, message: 'Suscripción guardada' }, { status: 201 });
  } catch (error) {
    console.error('Error en /api/push/subscribe:', error);
    return NextResponse.json({ error: 'Error procesando suscripción' }, { status: 500 });
  }
}
