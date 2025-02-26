self.addEventListener("install", (event) => {
    self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        fetch(event.request, { cache: "no-store" }) // Forces fresh content
    );
});