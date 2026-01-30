const CACHE_NAME = "expenses-v1";
const ASSETS = [
    "./",
    "./index.html",
    "./manifest.json",
    "./css/style.css",
    "./js/script.js"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(res => res || fetch(event.request))
    );
});
