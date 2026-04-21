// Mahj Advisor — Service Worker
// Strategy: network-first with 3s timeout, cache fallback
// No version bumping needed — network-first always fetches fresh when online

const CACHE_NAME = 'mahj-v1';
const OFFLINE_URLS = ['/'];

// Install: pre-cache the app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(OFFLINE_URLS))
  );
  // Activate immediately — don't wait for old tabs to close
  self.skipWaiting();
});

// Activate: clean up any old caches from previous versions
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  // Take control of all open tabs immediately
  self.clients.claim();
});

// Fetch: network-first with 3-second timeout, fall back to cache
self.addEventListener('fetch', event => {
  // Only handle GET requests for same-origin or Vercel-served files
  if (event.request.method !== 'GET') return;

  event.respondWith(networkFirst(event.request));
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    // Race the network against a 3-second timeout
    const networkResponse = await Promise.race([
      fetch(request),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 3000)
      )
    ]);

    // If we got a good response, cache it and return it
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;

  } catch (err) {
    // Network failed or timed out — serve from cache
    const cached = await cache.match(request);
    if (cached) return cached;

    // Nothing in cache either — return a simple offline message
    // (This should rarely happen since the app is cached on install)
    return new Response('App is offline. Please reconnect and try again.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}
