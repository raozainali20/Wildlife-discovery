// ========================================
// SERVICE WORKER - Offline Functionality & Caching
// ========================================

const CACHE_VERSION = 'wildlife-v1.0.0';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;

// Assets to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/animals.html',
  '/animal-details.html',
  '/map.html',
  '/tips.html',
  '/favourites.html',
  '/css/base.css',
  '/css/navigation.css',
  '/css/home.css',
  '/css/animals.css',
  '/css/animal-details.css',
  '/css/map.css',
  '/css/tips.css',
  '/css/favourites.css',
  '/js/app.js',
  '/js/theme.js',
  '/js/network-status.js',
  '/js/battery-status.js',
  '/js/responsive-images.js',
  '/js/home.js',
  '/js/animals-page.js',
  '/js/animal-details.js',
  '/js/camera.js',
  '/js/map-page.js',
  '/js/tips-page.js',
  '/js/favourites-page.js',
  '/data/animals.json',
  '/data/events.json',
  '/images/logo.svg',
  '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Installed successfully');
        return self.skipWaiting(); // Activate immediately
      })
      .catch((error) => {
        console.error('[Service Worker] Installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              // Delete old versions
              return cacheName.startsWith('wildlife-') && 
                     cacheName !== STATIC_CACHE && 
                     cacheName !== DYNAMIC_CACHE &&
                     cacheName !== IMAGE_CACHE;
            })
            .map((cacheName) => {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[Service Worker] Activated successfully');
        return self.clients.claim(); // Take control immediately
      })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip external requests (e.g., Leaflet CDN)
  if (url.origin !== location.origin) {
    event.respondWith(fetch(request));
    return;
  }
  
  // Determine caching strategy based on request type
  if (isImageRequest(request)) {
    event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE));
  } else if (isStaticAsset(request)) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
  } else {
    event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE));
  }
});

// Cache First Strategy (for static assets and images)
async function cacheFirstStrategy(request, cacheName) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('[Service Worker] Serving from cache:', request.url);
      return cachedResponse;
    }
    
    // If not in cache, fetch from network
    console.log('[Service Worker] Fetching from network:', request.url);
    const networkResponse = await fetch(request);
    
    // Cache the response for future use
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[Service Worker] Fetch failed:', error);
    
    // Return offline page for HTML requests
    if (request.destination === 'document') {
      return caches.match('/index.html');
    }
    
    // Return placeholder for images
    if (isImageRequest(request)) {
      return new Response(
        '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect fill="#2d5016" width="400" height="300"/><text fill="#fff" x="50%" y="50%" text-anchor="middle">Offline</text></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }
    
    throw error;
  }
}

// Network First Strategy (for dynamic content)
async function networkFirstStrategy(request, cacheName) {
  try {
    // Try network first
    console.log('[Service Worker] Fetching from network:', request.url);
    const networkResponse = await fetch(request);
    
    // Cache the response
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] Network failed, trying cache:', request.url);
    
    // Fall back to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If nothing in cache, return offline page
    if (request.destination === 'document') {
      return caches.match('/index.html');
    }
    
    throw error;
  }
}

// Helper: Check if request is for an image
function isImageRequest(request) {
  return request.destination === 'image' || 
         request.url.match(/\.(jpg|jpeg|png|gif|webp|avif|svg|ico)$/i);
}

// Helper: Check if request is for a static asset
function isStaticAsset(request) {
  return request.url.match(/\.(css|js|json|woff|woff2|ttf|eot)$/i) ||
         STATIC_ASSETS.includes(new URL(request.url).pathname);
}

// Background Sync (for offline form submissions)
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Sync event:', event.tag);
  
  if (event.tag === 'sync-favourites') {
    event.waitUntil(syncFavourites());
  }
});

async function syncFavourites() {
  console.log('[Service Worker] Syncing favourites...');
  // Placeholder for future sync functionality
  // Could sync favourites to a backend API when back online
}

// Push Notification (for future features)
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push notification received');
  
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'British Wildlife Centre';
  const options = {
    body: data.body || 'New wildlife content available!',
    icon: '/images/icons/icon-192.png',
    badge: '/images/icons/icon-72.png',
    tag: data.tag || 'wildlife-notification',
    requireInteraction: false,
    actions: [
      { action: 'view', title: 'View' },
      { action: 'close', title: 'Close' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification Click Handler
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message Handler (for communication with clients)
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message received:', event.data);
  
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
  
  if (event.data.action === 'clearCache') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});

console.log('[Service Worker] Loaded successfully');
