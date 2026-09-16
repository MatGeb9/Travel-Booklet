// Service worker — cache + mise à jour automatique (stale-while-revalidate).
// Sert le cache instantanément (donc : marche sans réseau, sans VPN, sans eSIM) et récupère
// la version fraîche en arrière-plan → la mise à jour apparaît au chargement suivant.
const CACHE = "carnet-chine-v4";
const ASSETS = [
  "./", "./index.html",
  "./css/styles.css",
  "./js/app.js", "./js/data.js", "./js/days.js", "./js/store.js", "./js/clock.js", "./js/photos.js",
  "./manifest.webmanifest",
  "./icons/icon-180.png", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-1024.png",
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.open(CACHE).then(cache =>
      cache.match(e.request).then(cached => {
        const network = fetch(e.request).then(res => {
          if (res && res.status === 200 && e.request.url.startsWith(self.location.origin))
            cache.put(e.request, res.clone());
          return res;
        }).catch(() => cached);
        return cached || network;
      })
    )
  );
});
