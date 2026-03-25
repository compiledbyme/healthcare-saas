/* eslint-disable no-restricted-globals */
const CACHE_NAME = "pulsecare-cache-v1";
const OFFLINE_URLS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/logo192.png",
  "/logo512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_URLS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(
      (cached) =>
        cached ||
        fetch(event.request)
          .then((response) => {
            const clone = response.clone();
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(event.request, clone));
            return response;
          })
          .catch(() => caches.match("/index.html")),
    ),
  );
});

self.addEventListener("push", (event) => {
  const data = (() => {
    if (!event.data)
      return {
        title: "PulseCare update",
        body: "You have a new notification.",
      };
    try {
      return event.data.json();
    } catch (err) {
      return { title: "PulseCare update", body: event.data.text() };
    }
  })();

  event.waitUntil(
    self.registration.showNotification(data.title || "PulseCare", {
      body: data.body || "New activity in your panel.",
      icon: "/logo192.png",
      badge: "/logo192.png",
      data: data.url || "/",
    }),
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "LOCAL_NOTIFICATION") {
    const { title, options } = event.data;
    event.waitUntil(
      self.registration.showNotification(title || "PulseCare", {
        icon: "/logo192.png",
        badge: "/logo192.png",
        ...options,
      }),
    );
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data || "/";
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        const client = clientList.find((c) => c.url.includes(targetUrl));
        if (client) {
          return client.focus();
        }
        return self.clients.openWindow(targetUrl);
      }),
  );
});
