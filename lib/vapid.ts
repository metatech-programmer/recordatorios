export async function registerServiceWorker() {
  if (typeof window === 'undefined') {
    console.log('Service Worker registration skipped (SSR)');
    return;
  }

  // En esta PWA, permitimos SW en localhost para probar offline & features
  // Si deseas limpiar el caché agresivo en dev, puedes comentar las líneas de abajo.

  if (!('serviceWorker' in navigator)) {
    console.warn('Este navegador no soporta Service Workers');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });
    console.log('✅ Service Worker registrado:', registration);
    return registration;
  } catch (error) {
    console.warn('⚠️ Service Worker registration warning:', error instanceof Error ? error.message : error);
    // No es un error crítico - la app funciona sin SW en desarrollo
  }
}

export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.warn('Este navegador no soporta notificaciones');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export async function subscribeToPush(vapidPublicKey: string) {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.error('Push notifications not supported');
    return null;
  }

  if (!vapidPublicKey) {
    console.error('No VAPID public key provided!');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });

    return subscription;
  } catch (error) {
    console.error('Error suscribiéndose a push:', error);
    return null;
  }
}

export async function unsubscribeFromPush() {
  if (!('serviceWorker' in navigator)) return false;

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
      return true;
    }
  } catch (error) {
    console.error('Error desuscribiéndose:', error);
  }

  return false;
}

function urlBase64ToUint8Array(base64String: string) {
  if (!base64String) {
    throw new Error('Base64 string is empty or undefined');
  }
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

export async function sendPushSubscriptionToServer(
  subscription: PushSubscriptionJSON
) {
  const response = await fetch('/api/push/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subscription),
  });

  return response.json();
}
