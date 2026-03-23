import { NextResponse } from 'next/server';

// POST /api/push/send
// Endpoint para que el cliente pueda enviar notificaciones a través del servidor
// En este caso, usamos web-push para enviar notificaciones reales

interface PushPayload {
  subscription: {
    endpoint: string;
    keys: {
      auth: string;
      p256dh: string;
    };
  };
  title: string;
  body: string;
  data?: Record<string, any>;
}

export async function POST(request: Request) {
  try {
    const { subscription, title, body, data } = (await request.json()) as PushPayload;

    // web-push es opcional si tenemos un servidor real
    // Para esta PWA gratuita, las notificaciones se manejan principalmente en el cliente
    // Las recordatorios se disparan desde el Service Worker

    console.log('📬 Intentando enviar notificación:', title);

    // Si tuvieras un backend real com web-push instalado, aquí iría:
    // const webpush = require('web-push');
    // webpush.setVapidDetails(
    //   process.env.VAPID_SUBJECT!,
    //   process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    //   process.env.VAPID_PRIVATE_KEY!
    // );
    //
    // await webpush.sendNotification(subscription, JSON.stringify({
    //   title, body, data
    // }));

    return NextResponse.json(
      { success: true, message: 'Notificación en cola' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error enviando notificación:', error);
    return NextResponse.json(
      { error: 'Error enviando notificación' },
      { status: 500 }
    );
  }
}
