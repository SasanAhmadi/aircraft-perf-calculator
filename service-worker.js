self.addEventListener("install", event => {
    console.log('Service Worker installing.');
    const baseUrl = self.location.origin + self.location.pathname.replace(/\/[^/]*$/, '');
    event.waitUntil(
        caches.open("c172-cache-v1").then(cache => {
            return cache.addAll([
                `${baseUrl}/`,
                `${baseUrl}/index.html`,
                `${baseUrl}/script.js`,
                `${baseUrl}/styles.css`,
                `${baseUrl}/manifest.json`,
                `${baseUrl}/icons/icon-192x192.png`,
                `${baseUrl}/icons/icon-512x512.png`,
                `${baseUrl}/favicon.ico`
            ]);
        })
    );
});

self.addEventListener('activate', event => {
    console.log('Service Worker activating.');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== "c172-cache-v1") {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request)
                    .then(response => {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Check if the request URL scheme is supported
                        if (event.request.url.startsWith('http')) {
                            // If the request was successful, clone the response and store it in the cache.
                            const responseClone = response.clone();
                            caches.open("c172-cache-v1").then(cache => {
                                cache.put(event.request, responseClone).catch(err => {
                                    console.error('Failed to cache request:', event.request.url, err);
                                });
                            });
                        }

                        return response;
                    })
                    .catch(err => {
                        console.error('Fetch failed; returning cached page instead.', err);
                        // If the network request fails, try to serve the request from the cache.
                        return caches.match(event.request);
                    });
            })
    );
});