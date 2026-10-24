/* Greek God Protocol · service worker
   Estrategia: network-first para el HTML (para que una versión nueva llegue enseguida)
   y cache-first para todo lo demás (iconos, fuentes, GIFs de los ejercicios). */
const CACHE = 'greek-god-v4';
const CORE = [
  './',
  './index.html',
  './manifest.json',
  './icon-180.png',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      // addAll falla entero si un recurso falla: se cachea uno a uno.
      .then(c => Promise.all(CORE.map(u => c.add(u).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function cacheable(url) {
  return url.startsWith(self.location.origin)
    || url.includes('fonts.googleapis.com')
    || url.includes('fonts.gstatic.com')
    || url.includes('inspireusafoundation.org');
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = req.url;
  if (url.startsWith('chrome-extension:') || !cacheable(url)) return;

  // Navegación / HTML: red primero, caché como respaldo offline
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    e.respondWith(
      fetch(req)
        .then(resp => {
          const copy = resp.clone();
          caches.open(CACHE).then(c => c.put('./index.html', copy)).catch(() => {});
          return resp;
        })
        .catch(() => caches.match('./index.html').then(r => r || caches.match('./')))
    );
    return;
  }

  // Resto: caché primero, y si no está se pide y se guarda
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(resp => {
      if (resp && (resp.ok || resp.type === 'opaque')) {
        const copy = resp.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
      }
      return resp;
    }).catch(() => new Response('', { status: 504, statusText: 'Sin conexión' })))
  );
});
