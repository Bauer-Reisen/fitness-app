// Offline-Speicher der App-Dateien (wie Sportplatz- und Sziget-App).
// - Dateien dieser Version kommen sofort aus dem Handy, ohne aufs Netz zu warten.
// - Nach dem vollständigen Speichern legt er die Marke „bereit" ab → „Heute" zeigt „Offline bereit ✓".
// - Updates: app.js merkt eine neue Version (version.json) und lädt mit ?v=<neu> – das geht übers Netz.
// - Deine Daten (IndexedDB) werden hier nicht angefasst.

const VERSION = '0.1.6';
const CACHE = 'fitness-' + VERSION;
const DATEIEN = [
  './', 'index.html', 'manifest.webmanifest', 'style.css', 'version.json',
  'js/app.js', 'js/bedarf.js', 'js/config.js', 'js/datum.js', 'js/db.js', 'js/essen.js', 'js/gelenke.js', 'js/geraete.js', 'js/gesundheit.js', 'js/gesundheitseite.js', 'js/heute.js', 'js/hilfe.js', 'js/install.js', 'js/katalog.js', 'js/koerper.js', 'js/koerperseite.js', 'js/kontext.js', 'js/lauf.js', 'js/lebensmittel.js', 'js/mehr.js', 'js/news.js', 'js/offline.js', 'js/profil.js', 'js/rechnen.js', 'js/regeln.js', 'js/store.js', 'js/stufen.js', 'js/studio.js', 'js/supplemente.js', 'js/supplementseite.js', 'js/tabs.js', 'js/teilen.js', 'js/tour.js', 'js/training.js', 'js/ui.js', 'js/vorschlag.js',
  'icons/icon-192.png', 'icons/apple-touch-icon.png', 'icons/qr.svg',
];

self.addEventListener('install', (ev) => {
  ev.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await c.addAll(DATEIEN.map((u) => new Request(u, { cache: 'reload' })));
    await c.put('bereit', new Response(VERSION));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (ev) => {
  ev.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('fitness-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// Netz fragen, höchstens `ms` lang; danach (oder ohne Netz) die Kopie aus dem Handy.
async function netzZuerst(req, cache, ms) {
  const netz = fetch(req).then((res) => {
    if (res.ok && res.type === 'basic') cache.put(req, res.clone());
    return res;
  });
  netz.catch(() => { /* offline */ });
  const zeit = new Promise((resolve) => setTimeout(resolve, ms, null));
  try {
    const res = await Promise.race([netz, zeit]);
    if (res) return res;
  } catch { /* offline */ }
  const kopie = await cache.match(req, { ignoreSearch: true });
  return kopie || netz;
}

self.addEventListener('fetch', (ev) => {
  const req = ev.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // fremde Dienste nicht anfassen
  if (!url.pathname.includes('/fitness-app/') && location.hostname !== 'localhost') return; // andere Apps derselben Adresse
  if (url.pathname.endsWith('/version.json')) return; // Update-Prüfung immer frisch

  const v = url.searchParams.get('v');
  ev.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if (v && v !== VERSION) return netzZuerst(req, cache, 8000); // gerade ein Update
    const kopie = await cache.match(req, { ignoreSearch: true });
    if (kopie) {
      // Startseite und Dateien ohne Versionsnummer im Hintergrund auffrischen
      if (!v) {
        ev.waitUntil(fetch(req).then((res) => {
          if (res.ok && res.type === 'basic') return cache.put(req, res);
        }).catch(() => {}));
      }
      return kopie;
    }
    return netzZuerst(req, cache, 8000);
  })());
});
