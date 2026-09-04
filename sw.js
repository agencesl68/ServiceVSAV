// Service worker — l'app s'ouvre même sans réseau.
//
// Différence avec les autres apps SL Agence : l'app shell est servie en
// « réseau d'abord, cache en secours » plutôt qu'en « cache d'abord ». Ici la
// configuration Supabase vit dans index.html : avec un cache prioritaire, une
// mise à jour de l'URL ou de la clé ne serait jamais vue par les téléphones
// déjà installés. Les images, elles, ne bougent jamais : cache d'abord.
const CACHE = "vsav-kits-v1";

const COQUILLE = ["./", "./index.html", "./manifest.json"];
const IMAGES   = ["./icon.png", "./logo.png", "./fond.jpg"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll([...COQUILLE, ...IMAGES])));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const req = e.request;

  // On ne touche JAMAIS aux appels Supabase ni à aucune autre origine :
  // l'inventaire doit toujours venir de la base, jamais d'un cache.
  if (req.method !== "GET") return;
  if (new URL(req.url).origin !== self.location.origin) return;

  const chemin = new URL(req.url).pathname.split("/").pop() || "index.html";

  // Images : cache d'abord, elles ne changent pas.
  if (IMAGES.some((a) => a.endsWith(chemin))) {
    e.respondWith(caches.match(req).then((r) => r || fetch(req)));
    return;
  }

  // App shell : réseau d'abord pour que les mises à jour arrivent, cache en
  // secours quand la caserne n'a pas de réseau.
  if (chemin === "index.html" || chemin === "manifest.json" || chemin === "") {
    e.respondWith(
      fetch(req)
        .then((r) => {
          const copie = r.clone();
          caches.open(CACHE).then((c) => c.put(req, copie));
          return r;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match("./index.html")))
    );
  }
});
