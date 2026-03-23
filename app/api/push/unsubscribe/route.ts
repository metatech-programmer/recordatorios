import { NextResponse } from 'next/server';

// POST /api/push/unsubscribe
// El cliente envía su suscripción push para que el servidor la elimine
export async function POST(request: Request) {
  try {
    const subscription = await request.json();

    console.log('🗑️ Unsubscribe request received for:', subscription.endpoint);

    // Si tuvieras persistencia server-side, aquí eliminarías la subscripción.

    return NextResponse.json({ success: true, message: 'Unsubscribed' }, { status: 200 });
  } catch (error) {
    console.error('Error en /api/push/unsubscribe:', error);
    return NextResponse.json({ error: 'Error procesando unsubscribe' }, { status: 500 });
  }
}
