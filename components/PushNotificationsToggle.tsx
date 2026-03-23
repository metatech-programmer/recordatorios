"use client";
import { useEffect, useState } from 'react';
import {
  requestNotificationPermission,
  subscribeToPush,
  unsubscribeFromPush,
  sendPushSubscriptionToServer,
} from '@/lib/vapid';
import { getOrCreateDeviceId } from '@/lib/device';

export default function PushNotificationsToggle() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      setEnabled(true);
    }
  }, []);

  async function handleEnable() {
    setLoading(true);
    try {
      const granted = await requestNotificationPermission();
      if (!granted) return;

      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
      const sub = await subscribeToPush(vapidKey);
      if (sub) {
        // send to server
        try {
          await sendPushSubscriptionToServer(sub.toJSON());
        } catch (e) {
          console.warn('No se pudo enviar subscripción al servidor', e);
        }
        setEnabled(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleDisable() {
    setLoading(true);
    try {
      const unsub = await unsubscribeFromPush();
      if (unsub) {
        // Try to inform the server
          try {
            const registration = await navigator.serviceWorker.ready;
            const existing = await registration.pushManager.getSubscription();
            const deviceId = getOrCreateDeviceId();
            if (existing) {
              await fetch('/api/push/unsubscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subscription: existing.toJSON(), deviceId }) });
            } else {
              // inform server by deviceId only
              await fetch('/api/push/unsubscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ deviceId }) });
            }
          } catch (e) {
            // ignore
          }
        setEnabled(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      aria-pressed={enabled}
      onClick={() => (enabled ? handleDisable() : handleEnable())}
      className={`px-3 py-1 rounded-md border ${enabled ? 'bg-green-600 text-white' : 'bg-white text-black'}`}
      disabled={loading}
    >
      {loading ? 'Procesando…' : enabled ? 'Notificaciones activas' : 'Activar notificaciones'}
    </button>
  );
}
