const CACHE_NAME = "expenses-v2"; // 🔥 bump this on every release

const FILES = [
    "/",
    "/index.html",
    "/css/style.css",
    "/js/script.js"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(FILES))
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(k => k !== CACHE_NAME)
                    .map(k => caches.delete(k))
            )
        )
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(res => res || fetch(event.request))
    );
});

// Allow instant update
self.addEventListener("message", event => {
    if (event.data === "SKIP_WAITING") {
        self.skipWaiting();
    }
});
