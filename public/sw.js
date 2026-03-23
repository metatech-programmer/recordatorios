// Service Worker para Recordatorios PWA
// Maneja: cache, offline, push notifications, background sync

const CACHE_NAME = 'recordatorios-v1';
const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('✅ Cache abierto');
      return cache.addAll(STATIC_ASSETS).catch(() => {
        console.warn('⚠️ Algunos assets no pudieron ser cacheados');
      });
    })
  );
  self.skipWaiting();
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  console.log('🎯 Service Worker activado');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estrategia de Fetch: Network First para API, Cache First para assets
self.addEventListener('fetch', (event) => {
  try {
    const url = new URL(event.request.url);
    const isSameOrigin = url.origin === self.location.origin;

    // API routes - Network First (same-origin only)
    if (isSameOrigin && url.pathname.startsWith('/api/')) {
      event.respondWith(
        fetch(event.request)
          .then((response) => {
            try {
              if (response && response.status === 200) {
                caches.open(CACHE_NAME).then((c) => c.put(event.request, response.clone()));
              }
            } catch (e) {
              // ignore cache errors
              console.warn('Cache put failed for API response', e);
            }
            return response;
          })
          .catch(() => {
            return caches.match(event.request).then((response) => {
              if (response) return response;
              // Fallback: si es JSON, retornar array vacío
              if (event.request.headers.get('accept')?.includes('application/json')) {
                return new Response('[]', {
                  headers: { 'Content-Type': 'application/json' },
                });
              }
              return caches.match('/offline.html');
            });
          })
      );
      return;
    }

    // Assets estáticos - Cache First (same-origin only)
    if (
      isSameOrigin &&
      event.request.method === 'GET' &&
      (url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|eot)$/i) || url.pathname.includes('/_next/'))
    ) {
      event.respondWith(
        caches.match(event.request).then((response) => {
          if (response) return response;
          return fetch(event.request)
            .then((fetchResponse) => {
              try {
                if (fetchResponse && fetchResponse.status === 200) {
                  const responseToCache = fetchResponse.clone();
                  caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                  });
                }
              } catch (e) {
                console.warn('Cache put failed for asset', e);
              }
              return fetchResponse;
            })
            .catch(() => {
              return caches.match('/offline.html');
            });
        })
      );
      return;
    }

    // Rutas HTML - Network First (same-origin only)
    if (isSameOrigin) {
      event.respondWith(
        fetch(event.request)
          .then((response) => {
            try {
              if (response && response.status === 200) {
                const responseToCache = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, responseToCache);
                });
              }
            } catch (e) {
              console.warn('Cache put failed for HTML route', e);
            }
            return response;
          })
          .catch(() => {
            return caches.match(event.request).then((response) => {
              if (response) return response;
              return caches.match('/offline.html');
            });
          })
      );
      return;
    }

    // For cross-origin requests, do not intercept - let browser handle them
  } catch (e) {
    // If anything unexpected occurs, do not block the request; try network directly
    console.warn('Service Worker fetch handler error, falling back to network:', e);
    // Note: do not call event.respondWith here because we might be outside of fetch event flow
  }
});

// Manejo de Push Notifications
self.addEventListener('push', (event) => {
  console.log('📬 Push notification recibida');

  let data = {
    title: 'Recordatorios',
    body: 'Tienes un recordatorio pendiente',
    icon: '/icons/icon-192.svg',
    badge: '/icons/icon-72.svg',
    tag: 'reminder-notification',
    requireInteraction: true,
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    ...data,
    actions: [
      { action: 'done', title: 'Lo cumplí' },
      { action: 'skip', title: 'No lo cumplí' },
    ],
    data: {
      reminderId: data.reminderId,
      occurrence: data.nextOccurrence || Date.now(),
    },
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Programación Local de Notificaciones (Offline - Zero Cost)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    const { reminderId, nextOccurrence, title, body } = event.data;
    
    // Solo programar si la fecha está en el futuro
    if (nextOccurrence > Date.now()) {
      try {
        if ('TimestampTrigger' in self) {
          const trigger = new self.TimestampTrigger(nextOccurrence);
          self.registration.showNotification(title, {
            body: body || '¡Es hora de tu recordatorio!',
            icon: '/icons/icon-192.svg',
            badge: '/icons/icon-72.svg',
            tag: `reminder-${reminderId}-${nextOccurrence}`,
            showTrigger: trigger,
            requireInteraction: true,
            actions: [
              { action: 'done', title: 'Lo cumplí' },
              { action: 'skip', title: 'No lo cumplí' },
            ],
            data: {
              reminderId,
              occurrence: nextOccurrence,
            },
          });
          console.log(`✅ Notificación programada offline para: ${new Date(nextOccurrence).toLocaleString()}`);
        } else {
          console.warn('La API de showTrigger no es compatible con este navegador.');
        }
      } catch (e) {
        console.error('Error programando notificación:', e);
      }
    }
  }
});

// Manejo de clicks en notificaciones
self.addEventListener('notificationclick', (event) => {
  console.log('👆 Notificación clickeada:', event.action);

  event.notification.close();

  const reminderData = event.notification.data || {};

  if (event.action === 'done' || event.action === 'skip') {
    // Validar ventana de acción (30 min)
    const occurrence = reminderData.occurrence || Date.now();
    const now = Date.now();
    const ACTION_WINDOW = 30 * 60 * 1000;

    if (now > occurrence + ACTION_WINDOW) {
      // Expirado: notificar al servidor que la acción llegó fuera de ventana
      fetch('/api/push/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reminderId: reminderData.reminderId, action: 'expired' }),
      }).catch(() => console.error('Error enviando acción expirado'));
    } else {
      // Dentro de la ventana, enviar acción correcta
      const action = event.action === 'done' ? 'completed' : 'skipped';
      fetch('/api/push/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reminderId: reminderData.reminderId, action: action }),
      }).catch(() => console.error('Error enviando acción'));
    }
  }

  // Abrir la app o la página del recordatorio
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Buscar si ya hay una ventana abierta
      const urlToOpen = reminderData && reminderData.reminderId ? `/recordatorio/${reminderData.reminderId}` : '/';

      for (let client of windowClients) {
        try {
          const clientUrl = new URL(client.url);
          if (clientUrl.pathname === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        } catch (e) {
          // ignore malformed URL
        }
      }

      // Si no hay ventana abierta hacia la ruta específica, abrirla
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Manejo de cerrar notificación
self.addEventListener('notificationclose', (event) => {
  console.log('✖️ Notificación cerrada');
});

// Sincronización en background (para quando no hay internet)
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync:', event.tag);

  if (event.tag === 'sync-reminders') {
    event.waitUntil(
      fetch('/api/push/sync')
        .then((response) => response.json())
        .then((data) => {
          console.log('✅ Sync completado:', data);
        })
        .catch((error) => {
          console.error('❌ Error en sync:', error);
          throw error;
        })
    );
  }
});

// Responder a mensajes desde el cliente
self.addEventListener('message', (event) => {
  console.log('💬 Mensaje del cliente:', event.data);

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
