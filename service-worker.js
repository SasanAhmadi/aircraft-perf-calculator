self.addEventListener("install", event => {
    event.waitUntil(
        caches.open("c172-cache").then(cache => {
            return cache.addAll([
                "/",
                "/index.html",
                "/script.js",
                "/styles.css",
                "/manifest.json",
                "/icons/icon-192x192.png",
                "/icons/icon-512x512.png"
            ]);
        })
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // If the request was successful, clone the response and store it in the cache.
                if (response && response.status === 200) {
                    const responseClone = response.clone();
                    caches.open("c172-cache").then(cache => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                // If the network request fails, try to serve the request from the cache.
                return caches.match(event.request);
            })
    );
});