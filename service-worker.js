const cacheName = "mzworthington-v2";

const precacheResources = [
  "/",
  "/offline.html",
  "/assets/site.webmanifest",
  "/assets/offline/offline.webp",
  "/assets/android-chrome-192x192.png",
  "/assets/android-chrome-512x512.png",
  "/assets/apple-touch-icon.png",
  "/assets/background.webp",
  "/assets/favicon-16x16.png",
  "/assets/favicon-32x32.png",
  "/assets/me.webp",
  "/assets/social-icons.svg",
  "/assets/css/style.css",
  "/assets/js/experience.js",
];

async function precache(cache) {
  await Promise.all(
    precacheResources.map(async (url) => {
      try {
        await cache.add(url);
      } catch (_error) {
        // Skip missing resources so install still succeeds.
      }
    })
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName);
      await precache(cache);
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((key) => key !== cacheName).map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    (async () => {
      try {
        return await fetch(event.request);
      } catch (_error) {
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) return cachedResponse;

        if (event.request.mode === "navigate") {
          return cache.match("/offline.html");
        }

        return new Response("Offline", {
          status: 503,
          statusText: "Service Unavailable",
        });
      }
    })()
  );
});
