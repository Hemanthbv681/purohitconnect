const CACHE_NAME = 'purohitconnect-v1';
const urlsToCache = [
  '/purohitconnect/',
  '/purohitconnect/index.html',
  '/purohitconnect/manifest.json'
];

// Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('PurohitConnect: Caching app shell');
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate & Clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    )
  );
});

// Fetch from cache first, then network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;
      return fetch(event.request).then(networkResponse => {
        if (!networkResponse || networkResponse.status !== 200) return networkResponse;
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
        return networkResponse;
      });
    }).catch(() => caches.match('/purohitconnect/index.html'))
  );
});
