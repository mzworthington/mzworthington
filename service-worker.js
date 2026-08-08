const cacheName = "mzworthington-v5";

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
  "/assets/js/theme.js",
];

function isStaticAsset(url) {
  return url.origin === self.location.origin && url.pathname.startsWith("/assets/");
}

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

async function staleWhileRevalidate(request) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  const networkResponsePromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }

      return response;
    })
    .catch(() => cachedResponse);

  return cachedResponse || networkResponsePromise;
}

async function networkFirst(request) {
  try {
    return await fetch(request);
  } catch (_error) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    if (cachedResponse) return cachedResponse;

    if (request.mode === "navigate") {
      return cache.match("/offline.html");
    }

    return new Response("Offline", {
      status: 503,
      statusText: "Service Unavailable",
    });
  }
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

  const requestUrl = new URL(event.request.url);

  if (isStaticAsset(requestUrl)) {
    event.respondWith(staleWhileRevalidate(event.request));
    return;
  }

  event.respondWith(networkFirst(event.request));
});
