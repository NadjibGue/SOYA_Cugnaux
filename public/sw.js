const CACHE_NAME = 'soya-v1.0.0';

// Installation du service worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installation...');
  self.skipWaiting();
});

// Activation et nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activation...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Suppression de l\'ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Stratégie de cache simplifiée (network-first)
self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // Ignorer les requêtes non-HTTP, Vite, WebSocket
  if (
    !url.startsWith('http') ||
    url.includes('?t=') ||
    url.includes('__vite') ||
    url.includes('@vite') ||
    url.includes('node_modules') ||
    url.startsWith('ws')
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone).catch(() => {});
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;

          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }

          return new Response('Contenu non disponible hors ligne', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        });
      })
  );
});

// Gestion des notifications push
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nouvelle offre chez Soya !',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    tag: 'soya-notification',
    requireInteraction: true
  };

  event.waitUntil(
    self.registration.showNotification('Soya 🍔', options)
  );
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
