"use client";
import { useEffect } from 'react';
import { registerServiceWorker } from '@/lib/vapid';

export default function PWARegistration() {
  useEffect(() => {
    // Register SW on client mount and auto-activate new versions
    (async () => {
      try {
        const registration = await registerServiceWorker();
        if (!registration) return;

        // If there's an updated worker waiting, tell it to skipWaiting
        const trySkipWaiting = (reg: ServiceWorkerRegistration) => {
          try {
            if (reg.waiting) {
              reg.waiting.postMessage({ type: 'SKIP_WAITING' });
            }
          } catch (e) {
            // ignore
          }
        };

        trySkipWaiting(registration);

        // Listen for updates
        registration.addEventListener?.('updatefound', () => {
          trySkipWaiting(registration);
        });

        // When a new service worker takes control, reload to apply the new version
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          try {
            // avoid infinite reload loops
            if ((window as any).__SW_RELOADED) return;
            (window as any).__SW_RELOADED = true;
            window.location.reload();
          } catch (e) {}
        });
      } catch (e) {
        console.warn('Service Worker registration/update handling failed', e);
      }
    })();
  }, []);

  return null;
}
