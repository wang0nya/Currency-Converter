// add an install event listener to the service worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('v2').then(cache => cache.addAll([
            '/Currency-Converter/',
            '/Currency-Converter/index.html',
            '/Currency-Converter/404.html',
            '/Currency-Converter/css/main.css',
            '/Currency-Converter/css/bootstrap.min.css',
            '/Currency-Converter/css/normalize.css',
            '/Currency-Converter/css/paper-kit.css',
            'https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css',
            '/Currency-Converter/css/paper-kit.css',
            '/Currency-Converter/js/vendor/modernizr-3.6.0.min.js',
            '/Currency-Converter/js/vendor/jquery-3.3.1.min.js',
            '/Currency-Converter/js/jquery-ui-1.12.1.custom.min.js',
            '/Currency-Converter/js/popper.js',
            '/Currency-Converter/js/plugins.js',
            '/Currency-Converter/js/main.js',
            '/Currency-Converter/js/bootstrap.min.js',
            '/Currency-Converter/js/bootstrap-switch.min.js',
            '/Currency-Converter/js/paper-kit.js'
        ]))
    );
});

// attach a fetch event listener to the service worker,
// then call the respondWith() method on the event to hijack HTTP responses
self.addEventListener('fetch', event => {
    event.respondWith(caches.match(event.request).then(response => {
        // caches.match() always resolves
        // but in case of success response will have value
        if (response !== undefined) {
            return response;
        } else {
            return fetch(event.request).then(response => {
                // response may be used only once
                // we need to save clone to put one copy in cache
                // and serve second one
                let responseClone = response.clone();

                caches.open('v2').then(cache => {
                    cache.put(event.request, responseClone);
                });
                return response;
            }).catch(() => // return Response;
                new Response('Something went wrong :('));
        }
    }));
});

// activate
self.addEventListener('activate', event => {
    const cacheWhitelist = ['v2'];

    event.waitUntil(
        caches.keys().then(keyList => Promise.all(keyList.map(key => {
            if (!cacheWhitelist.includes(key)) {
                return caches.delete(key);
            }
        })))
    );
});