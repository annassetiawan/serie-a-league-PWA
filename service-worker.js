const CACHE_NAME = "seriea-app-v3";
var urlsToCache = [
  "/",
  "/nav.html",
  "/index.html",
  "/manifest.json",
  "/push.js",
  "/pages/standings.html",
  "/pages/saved.html",
  "/pages/schedules.html",
  "/pages/teams.html",
  "/css/materialize.min.css",
  "/css/style.css",
  "/js/materialize.min.js",
  "/js/nav.js",
  "/js/db.js",
  "/js/idb.js",
  "/js/script.js",
  "/js/api.js",
  "/assets/football2.svg",
  "/assets/seriea.svg",
  "/assets/android-icon-192x192-dunplab-manifest-6626.png",
  "/assets/apple-icon-57x57-dunplab-manifest-6626.png",
  "/assets/apple-icon-60x60-dunplab-manifest-6626.png",
  "/assets/apple-icon-72x72-dunplab-manifest-6626.png",
  "/assets/apple-icon-114x114-dunplab-manifest-6626.png",
  "/assets/apple-icon-120x120-dunplab-manifest-6626.png",
  "/assets/apple-icon-144x144-dunplab-manifest-6626.png",
  "/assets/apple-icon-152x152-dunplab-manifest-6626.png",
  "/assets/apple-icon-180x180-dunplab-manifest-6626.png",
  "/assets/favicon-16x16-dunplab-manifest-6626.png",
  "/assets/favicon-32x32-dunplab-manifest-6626.png",
  "/assets/favicon-96x96-dunplab-manifest-6626.png",
];
 
self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", function(event) {
    const base_url = "https://api.football-data.org/v2/";
    if (event.request.url.indexOf(base_url) > -1) {
        event.respondWith(
            caches.open(CACHE_NAME).then(function(cache) {
                return fetch(event.request).then(function(response) {
                    cache.put(event.request.url, response.clone());
                    return response;
                })
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request, {'ignoreSearch': true}).then(function(response) {
                return response || fetch (event.request);
            })
        )
    }
});
  self.addEventListener("activate", function(event) {
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            if (cacheName != CACHE_NAME) {
              console.log("ServiceWorker: cache " + cacheName + " dihapus");
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });

  self.addEventListener('push', function(event) {
    var body;
    if (event.data) {
      body = event.data.text();
    } else {
      body = 'Push message no payload';
    }
    var options = {
      body: body,
      icon: 'img/notification.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };
    event.waitUntil(
      self.registration.showNotification('Push Notification', options)
    );
  });