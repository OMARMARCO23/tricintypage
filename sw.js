const CACHE_NAME = 'tricinty-cache-v1';
const URLS_TO_CACHE = [
  '/',
  './index.html',
  './index.js',
  './manifest.json',
  './icon-192x192.png',
  './icon-512x512.png',
  './App.js',
  './contexts/AppContext.js',
  './hooks/useLocalStorage.js',
  './components/Layout.js',
  './components/BottomNav.js',
  './components/Card.js',
  './components/Modal.js',
  './components/LoadingSpinner.js',
  './components/WelcomeModal.js',
  './components/AdSenseAd.js',
  './pages/LandingPage.js',
  './pages/Dashboard.js',
  './pages/History.js',
  './pages/Advice.js',
  './pages/Settings.js',
  './utils/calculations.js',
  './constants.js',
  'https://aistudiocdn.com/react@^19.1.1',
  'https://aistudiocdn.com/react-dom@^19.1.1/client',
  'https://aistudiocdn.com/react-router-dom@^6.23.1',
  'https://cdn.tailwindcss.com',
  'https://aistudiocdn.com/recharts@^3.1.2'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request because it's a stream and can only be consumed once.
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              // For third-party assets (like CDNs), response.type might be 'cors'. 'basic' is for same-origin.
              // We only cache valid responses.
               if(response && response.type === 'opaque'){
                 // This is an opaque response (e.g. from a CDN with no CORS).
                 // We can cache it, but cannot inspect its contents.
               } else if (!response || response.status !== 200) {
                 return response;
               }
            }
            
            // Clone the response because it's also a stream.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});