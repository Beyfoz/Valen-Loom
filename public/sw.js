// Vaelen Loom — Progressive Web App Service Worker
// Versioned caching: Cache-first for static assets and scene artwork, Network-first for shell HTML,
// strictly bypasses all /api/* requests.

const CACHE_VERSION = 'v1.2.0';
const SHELL_CACHE_NAME = `vaelen-shell-${CACHE_VERSION}`;
const ASSETS_CACHE_NAME = `vaelen-assets-${CACHE_VERSION}`;
const IMAGES_CACHE_NAME = `vaelen-images-${CACHE_VERSION}`;

const CURRENT_CACHES = [SHELL_CACHE_NAME, ASSETS_CACHE_NAME, IMAGES_CACHE_NAME];

// Essential app shell routes to precache
const PRECACHE_SHELL = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_SHELL))
      .catch((err) => {
        console.warn('[SW] Shell precache failed:', err);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => {
            if (!CURRENT_CACHES.includes(name)) {
              console.log('[SW] Purging outdated cache:', name);
              return caches.delete(name);
            }
            return Promise.resolve();
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // 1. NEVER CACHE /api/* (always direct network bypass)
  if (url.pathname.startsWith('/api/') || url.pathname.includes('/api/')) {
    event.respondWith(fetch(req));
    return;
  }

  // 1b. NEVER intercept Vite dev server internal modules or dependencies
  if (
    url.pathname.includes('/node_modules/') ||
    url.pathname.startsWith('/@') ||
    url.pathname.includes('/@vite/') ||
    url.pathname.includes('/@fs/') ||
    url.pathname.includes('/@id/') ||
    url.pathname.startsWith('/src/')
  ) {
    return; // Pure native browser fetch, no SW interception
  }

  // Only handle GET requests for offline caching
  if (req.method !== 'GET') {
    event.respondWith(fetch(req));
    return;
  }

  // 1c. SCENE ART MANIFEST: Network-First under canonical key (never cache as image)
  if (url.pathname === '/scenes/manifest.json') {
    const canonicalKey = new Request('/scenes/manifest.json');
    event.respondWith(
      fetch(req)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(ASSETS_CACHE_NAME).then((cache) => {
              cache.put(canonicalKey, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(canonicalKey).then(
            (cached) =>
              cached ||
              new Response(JSON.stringify({ scenes: {} }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
              })
          );
        })
    );
    return;
  }

  // 2. SCENE IMAGES & ARTWORK: Cache-First strategy
  if (
    (url.pathname.startsWith('/scenes/') && !url.pathname.endsWith('.json')) ||
    url.pathname.startsWith('/images/') ||
    url.pathname.includes('/assets/images/') ||
    /\.(webp|jpg|jpeg|png|svg|ico)$/i.test(url.pathname)
  ) {
    event.respondWith(
      caches.match(req).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(req)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(IMAGES_CACHE_NAME).then((cache) => {
                cache.put(req, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            return caches
              .match('/images/preset_world_eldoria_1791455431121.webp')
              .then((fallback) => fallback || new Response('', { status: 503 }));
          });
      })
    );
    return;
  }

  // 3. COMPILED ASSETS & FONTS (JS / CSS / WOFF2): Cache-First strategy
  if (
    url.pathname.startsWith('/assets/') ||
    /\.(js|css|woff2|woff|ttf)$/i.test(url.pathname) ||
    url.origin.includes('fonts.gstatic.com') ||
    url.origin.includes('fonts.googleapis.com')
  ) {
    event.respondWith(
      caches.match(req).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(req)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(ASSETS_CACHE_NAME).then((cache) => {
                cache.put(req, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(() => new Response('', { status: 503 }));
      })
    );
    return;
  }

  // 4. HTML DOCUMENT NAVIGATION: Network-First with Cache fallback
  if (req.mode === 'navigate' || url.pathname === '/' || url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(req)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(SHELL_CACHE_NAME).then((cache) => {
              cache.put(req, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return caches
            .match(req)
            .then((cached) => cached || caches.match('/index.html'))
            .then((fallback) => fallback || new Response('Offline', { status: 503 }));
        })
    );
    return;
  }

  // 5. Default: Stale-while-revalidate for any other assets
  event.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(ASSETS_CACHE_NAME).then((cache) => {
              cache.put(req, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => cached || new Response('', { status: 503 }));
      return cached || fetchPromise;
    })
  );
});
