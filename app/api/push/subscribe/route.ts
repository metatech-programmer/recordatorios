import { NextResponse } from 'next/server';

// POST /api/push/subscribe
// El cliente envía su suscripción Push
export async function POST(request: Request) {
  try {
    const subscription = await request.json();

    // Aquí guardaríamos la suscripción en la DB
    // Por ahora, solo confirmamos que fue recibida
    // Si necesitaras persistencia, usa una DB local como SQLite o guardar en IndexedDB en el cliente

    console.log('📬 Nueva suscripción push recibida:', subscription.endpoint);

    return NextResponse.json(
      { success: true, message: 'Suscripción guardada' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error en /api/push/subscribe:', error);
    return NextResponse.json(
      { error: 'Error procesando suscripción' },
      { status: 500 }
    );
  }
}
