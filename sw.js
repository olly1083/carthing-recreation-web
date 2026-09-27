const CACHE = "carthing-v3";

const STATIC_FILES = [
    "./",
    "./index.html",
    "./manifest.json"
];


self.addEventListener(
    "install",
    event => {

        event.waitUntil(

            caches
                .open(CACHE)
                .then(cache => {

                    return cache.addAll(
                        STATIC_FILES
                    );

                })

        );

        self.skipWaiting();
    }
);


self.addEventListener(
    "activate",
    event => {

        event.waitUntil(

            caches
                .keys()
                .then(keys => {

                    return Promise.all(

                        keys
                            .filter(
                                key =>
                                    key !== CACHE
                            )
                            .map(
                                key =>
                                    caches.delete(
                                        key
                                    )
                            )

                    );

                })

        );

        self.clients.claim();
    }
);


self.addEventListener(
    "fetch",
    event => {

        const url =
            new URL(
                event.request.url
            );


        /*
         * IMPORTANT:
         *
         * Only handle requests belonging
         * to the GitHub Pages website.
         *
         * This prevents the service worker
         * from interfering with the
         * Cloudflare API connection.
         */

        if (
            url.origin !==
            self.location.origin
        ) {
            return;
        }


        if (
            event.request.method !==
            "GET"
        ) {
            return;
        }


        event.respondWith(

            fetch(
                event.request
            )
            .catch(
                () => {

                    return caches
                        .match(
                            event.request
                        )
                        .then(
                            response => {

                                if (
                                    response
                                ) {
                                    return response;
                                }

                                return new Response(
                                    "Car Thing is offline",
                                    {
                                        status: 503,
                                        headers: {
                                            "Content-Type":
                                                "text/plain"
                                        }
                                    }
                                );

                            }
                        );

                }
            )

        );

    }
);
