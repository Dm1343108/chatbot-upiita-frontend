// public/sw.js
const CACHE = "upiita-chat-v2";
const ASSETS = [
  "/",                // shell
  "/index.html",
  "/manifest.json",   // <-- unificado
  "/favicon.ico",
  "/logo192.png",
  "/logo512.png"
];

// Instalar: precache del shell y activar enseguida
self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});

// Activar: limpiar caches viejos + tomar control
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

// Fetch: SPA + estrategias por tipo
self.addEventListener("fetch", (e) => {
  const req = e.request;

  // Solo manejamos GET; el resto pasa directo a red
  if (req.method !== "GET") {
    return; // dejar que el navegador maneje
  }

  const url = new URL(req.url);
  const isSameOrigin = url.origin === self.location.origin;

  // 1) Navegación SPA: si falla la red, sirve index.html
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).catch(() => caches.match("/index.html"))
    );
    return;
  }

  // 2) Mismo origen
  if (isSameOrigin) {
    // 2.a) Imágenes (incluye /mapas/): cache-first
    if (req.destination === "image" || url.pathname.startsWith("/mapas/")) {
      e.respondWith(
        caches.match(req).then((cached) => {
          if (cached) return cached;
          return fetch(req).then((res) => {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
            return res;
          });
        })
      );
      return;
    }

    // 2.b) Resto de GET: stale-while-revalidate
    e.respondWith(
      caches.match(req).then((cached) => {
        const network = fetch(req).then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        }).catch(() => cached || Promise.reject("offline"));

        // Si hay caché, devolverlo inmediato; si no, espera red
        return cached || network;
      })
    );
    return;
  }

  // 3) Origen cruzado: pasa directo (puedes añadir estrategias si lo necesitas)
  e.respondWith(fetch(req));
});