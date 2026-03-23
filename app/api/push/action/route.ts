import { NextResponse } from 'next/server';

// POST /api/push/action
// El cliente invoca esto cuando el usuario clickea una notificación

export async function POST(request: Request) {
  try {
    const { reminderId, action } = await request.json();

    console.log(`📬 Acción de notificación: Recordatorio ${reminderId} - ${action}`);

    // En una app real, aquí guardarías en la DB
    // Para esta versión, solo confirmamos
    return NextResponse.json(
      { success: true, action },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error procesando acción:', error);
    return NextResponse.json(
      { error: 'Error procesando acción' },
      { status: 500 }
    );
  }
}
