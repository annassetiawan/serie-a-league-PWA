importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js"
);
workbox.precaching.precacheAndRoute([
  { url: "/", revision: "1" },
  { url: "/nav.html", revision: "1" },
  { url: "/index.html", revision: "1" },
  { url: "/manifest.json", revision: "1" },
  { url: "/push.js", revision: "1" },
  { url: "/bundle.js", revision: "1" },
  { url: "/pages/standings.html", revision: "1" },
  { url: "/pages/saved.html", revision: "1" },
  { url: "/pages/schedules.html", revision: "1" },
  { url: "/pages/teams.html", revision: "1" },
  { url: "/main.css", revision: "1" },
  { url: "/assets/football2.svg", revision: "1" },
  { url: "/assets/seriea.svg", revision: "1" },
  { url: "/imgs/football2.svg", revision: "1" },
  { url: "/imgs/seriea.svg", revision: "1" },
  { url: "/assets/icon-72x72.png", revision: "1" },
  { url: "/assets/icon-96x96.png", revision: "1" },
  { url: "/assets/icon-128x128.png", revision: "1" },
  { url: "/assets/icon-144x144.png", revision: "1" },
  { url: "/assets/icon-152x152.png", revision: "1" },
  { url: "/assets/icon-192x192.png", revision: "1" },
  { url: "/assets/icon-384x384.png", revision: "1" },
  { url: "/assets/icon-512x512.png", revision: "1" },
  { url: "/assets/favicon-16x16-dunplab-manifest-6626.png", revision: "1" },
]);

if (workbox)
  console.log(`Workbox berhasil dimuat`);
else
  console.log(`Workbox gagal dimuat`);

workbox.routing.registerRoute(
  new RegExp('https://api.football-data.org/v2/'),
  workbox.strategies.staleWhileRevalidate()
)

self.addEventListener("push", function (event) {
  var body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = "Push message no payload";
  }
  var options = {
    body: body,
    icon: "img/notification.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  };
  event.waitUntil(
    self.registration.showNotification("Push Notification", options)
  );
});
