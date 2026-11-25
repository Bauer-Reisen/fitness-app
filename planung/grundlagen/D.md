# Agent D – Technik und Daten (Fitness-App)

Hinweis: webkit.org war aus dieser Sitzung nicht direkt abrufbar; WebKit-Aussagen stammen aus Suchergebnissen
(Zusammenfassungen der Blogposts, WebKit-Bugzilla). Vor dem Bau einmal die Originale lesen.

## 1. Speicherung auf dem iPhone
V1:
- **IndexedDB statt localStorage.** Begründung: strukturierte Einträge (Messungen, Sätze, Mahlzeiten) mit id,
  asynchron, kein 5-MB-Deckel; Bike-App-`js/db.js` (kv + Stores mit keyPath 'id', Wiederverbindung nach Hintergrund)
  1:1 übernehmen. localStorage höchstens für Kleinkram wie "zuletzt offene Seite".
- **7-Tage-Löschung (ITP):** Der WebKit-Post "Full Third-Party Cookie Blocking and More" (2020, webkit.org/blog/10218)
  führte die 7-Tage-Grenze für skriptgeschriebenen Speicher ein – gezählt nach Tagen *Safari-Nutzung* ohne Besuch der Seite.
  Später (webkit.org/blog/11338, "CNAME Cloaking and Bounce Tracking Defense") ausdrücklich ergänzt: Die eigene Domain
  einer **zum Home-Bildschirm hinzugefügten Web-App ist von der Löschung ausgenommen**; ein WebKit-Entwickler nennt den
  2020-Post in Bug 237350 "veraltet". Folge: App **nur vom Home-Bildschirm** nutzen, nicht im Safari-Tab.
  Vermutung, nicht geprüft: Ausnahme gilt nur mit `display: standalone` im Manifest (so in der Bike-App vorhanden).
- **Wichtig:** Home-Bildschirm-App und Safari-Tab haben auf iOS getrennte Speicher (Vermutung, nicht geprüft, aber
  vielfach berichtet). Daten im Safari-Tab tauchen in der Home-App nicht auf → im Einstieg darauf hinweisen.
- **navigator.storage.persist():** Laut "Updates to Storage Policy" (WebKit 2023, webkit.org/blog/14403, Safari 17)
  entscheidet WebKit per Heuristik, u. a. ob als Home-Bildschirm-App geöffnet; persistenter Speicher ist von
  Räumung bei Platzmangel ausgenommen, Kontingent richtet sich nach Gerätespeicher. Bug 271401 (2024) meldet aber
  "persist() liefert immer false". → Wie Bike-App (`app.js`) beim Start aufrufen, Ergebnis nicht vertrauen.
  Optional `navigator.storage.estimate()` in "Mehr" anzeigen.
- **Das Backup ist der eigentliche Schutz**, nicht persist() (iPhone-Wechsel, App gelöscht, "Websitedaten löschen").

## 2. Schutz vor Datenverlust
V1:
- Export als JSON über Teilen-Menü (`navigator.share` mit File, Fallback Download) – genau wie `dateiTeilen()` in
  `js/ui.js` der Bike-App; Nutzer legt sie in "Dateien"/iCloud Drive ab. Import über `<input type=file>`.
- Format: `{ app: 'fitness-app', format: 1, schema: <DB_VERSION>, erstellt, profilId, daten: {store: [...]} }`.
  `format` = Version der Backup-Datei, prüfen beim Laden (zu neu → klare Meldung "App erst aktualisieren").
- Laden = zusammenführen per id (wie Bike-App) **plus** Option "vorher alles löschen" für sauberen Gerätewechsel.
  Vor dem Import automatisch ein Sicherheits-Backup im Speicher (kv `backup:vorImport`) ablegen.
- **Erinnerung:** `kv.letztesBackup` (gibt es schon). Hinweis-Banner, wenn > 14 Tage her **und** seitdem neue Einträge,
  sowie nach jedem 10. Training. Kein Push nötig – Banner beim Öffnen reicht.
- **Schema-Migration:** `DB_VERSION` hochzählen, in `onupgradeneeded` je Stufe `if (alt < 2) {...}` ausführen;
  dieselben Migrationsfunktionen auf importierte ältere Backups anwenden (`migriere(daten, vonFormat)` in eigener
  Datei, damit node-Skript sie testen kann). Jeder Eintrag bekommt `geaendert` (ISO-Zeit) – hilft später beim Abgleich.
Später: Backup verschlüsselt (Passwort) – erst wenn Daten geteilt werden; jetzt unnötig.

## 3. Offline im Studio
V1:
- Service Worker wie Bike-App (`sw.js`: network first mit 1,5/3 s Zeitlimit, Cache-Name mit Version, alte Caches
  löschen, fremde Origins nicht anfassen, `version.json` nie cachen).
- Vorab cachen: index.html, manifest, CSS, **alle** js-Module, Gerätekatalog-/Übungsdaten (`daten/*.json` oder
  js-Datei), Lebensmittel-Grundliste, Icons, Barcode-Bibliothek inkl. **.wasm-Datei**.
- Ohne Netz muss alles außer Open Food Facts gehen: Training erfassen, Vorschlag berechnen, Essen aus eigener Liste/
  zuletzt genutzt, Körperdaten. Vorschlagslogik rein lokal (keine Server-Abfrage).
- **Open Food Facts offline:** Barcode-Abfrage nur online. Offline: Scan trotzdem erlauben, Code speichern als
  "offene Abfrage" und beim nächsten Öffnen mit Netz nachschlagen; sofort Alternative "Werte von der Packung eintippen".
  Einmal gefundene Produkte lokal im Store `produkte` (Schlüssel = Barcode) ablegen → zweiter Scan klappt offline.
  OFF-Daten stehen unter ODbL (Quelle: OFF-API-Doku) → Hinweis "Daten: Open Food Facts, ODbL" in README und App.
  OFF verlangt eine App-Kennung (User-Agent, OFF-Support-Seite); Vermutung, nicht geprüft: im Browser lässt sich
  User-Agent nicht setzen – stattdessen Parameter/Kopfzeile laut OFF-Doku mit App-Namen (ohne Personendaten).
  Endpunkt `GET https://world.openfoodfacts.org/api/v2/product/{code}?fields=...` (nur benötigte Felder).
  Keine Suche per Freitext über OFF in V1 (Such-Endpunkt laut Berichten oft überlastet).

## 4. Spätere Mehrnutzer-Fähigkeit (ohne Kosten)
- Jeder auf eigenem iPhone: mit reiner Web-App automatisch gegeben – Daten liegen je Gerät getrennt. Das deckt "später
  für andere" fast vollständig ab. Kein Server, keine Anmeldung nötig.
V1 (nur vorbereiten, kostet fast nichts):
- Store `profile` mit genau einem Profil; jeder personenbezogene Eintrag bekommt `profilId`.
  Aktives Profil in `kv.aktivesProfil`. Keine Profilwahl-Oberfläche in V1.
- Index `profilId` auf den Stores anlegen (gleich in DB_VERSION 1, spart Migration).
- Gerätekatalog trennen: mitgelieferte Geräte (aus Datei, nicht im Backup) vs. eigene Geräte (Store, mit profilId oder
  `studioId` – Vermutung: später teilen sich zwei Nutzer ein Studio).
- ids zufällig (wie `neueId()`), nie fortlaufend → Backups zweier Geräte kollidieren nicht.
Später:
- Mehrere Profile auf einem Gerät (Partner teilt iPhone/iPad): Profilwahl + Filter per profilId.
- Profil "weitergeben": Export nur eines Profils / nur des Gerätekatalogs als Datei (Studio-Katalog für Freunde).

## 5. Barcode-Scan im iPhone-Safari
- **BarcodeDetector:** in iOS-Safari nicht standardmäßig aktiv (caniuse: "Disabled by default" bis iOS 26/27; WebKit-
  Bug 281848/Apple-Forum: unter iOS 18 selbst mit Flag defekt). → Nicht darauf bauen, nur Feature-Erkennung.
V1-Empfehlung:
- **`barcode-detector` (Sec-ant) – MIT**, Polyfill/Ponyfill der Standard-API auf Basis von zxing-wasm (zxing-cpp,
  Apache-2.0). Gleiche Schnittstelle wie die echte API → falls Apple sie freischaltet, Polyfill einfach weglassen.
  Lokal unter `vendor/barcode-detector/` ablegen (inkl. .wasm, nicht vom CDN laden – Vermutung, nicht geprüft: das
  Paket lädt .wasm standardmäßig von jsDelivr; Pfad per Konfiguration auf lokale Datei setzen). LICENSE-Dateien mitkopieren.
- Kamera per `getUserMedia({video:{facingMode:'environment'}})` (geht in Home-Bildschirm-Apps ab iOS 13.4 –
  Vermutung, nicht geprüft), nur EAN-13/EAN-8/UPC scannen → schneller.
- **Nicht** html5-qrcode: Apache-2.0, aber laut Scanbot/Snyk seit 2023 ohne Release, "maintenance mode", iOS-Probleme.
- Fallback immer: Barcode-Ziffern eintippen.
Später: Foto statt Live-Video (`<input type=file capture>`) als zweiter Weg, falls Live-Scan zickt.

## 6. Dateistruktur (analog Bike-App)
```
index.html  manifest.webmanifest  sw.js  version.json  README.md  css/app.css  icons/
js/app.js        Start, Seitenwechsel, Backup-Knöpfe     js/ui.js      Helfer (toast, dateiTeilen)
js/db.js         IndexedDB, Backup, DB_VERSION           js/migration.js  migriere() für DB+Backups
js/zustand.js    gemeinsamer Zustand + melde()           js/version.js
js/koerper.js    Messungen, Verlauf                      js/bedarf.js  Kalorien/Eiweiß (reine Rechenfunktionen)
js/geraete.js + js/geraete-daten.js  Katalog/Übungen     js/training.js Erfassung
js/vorschlag.js  Steigerungslogik (rein, ohne DOM)       js/essen.js  Erfassung, Mahlzeitvorschläge
js/lebensmittel-daten.js  Grundliste                     js/off.js    Open Food Facts + Warteschlange
js/scan.js       Kamera + BarcodeDetector/Polyfill       js/supplemente-daten.js  Prüfliste mit Quellen
js/hilfe.js + hilfe-daten.js  Rundgang/"Was ist neu?"    vendor/barcode-detector/ (+LICENSE)
tools/server.mjs  make-icons.mjs  check-privat.mjs  check-hilfe.mjs (übernehmen)
tools/check-vorschlag.mjs  erfundene Trainingsverläufe → erwartete Steigerung/Entlastung/Pause
tools/check-bedarf.mjs     Beispielpersonen → Kalorien/Eiweiß in plausiblen Grenzen, Trainings- vs. Pausentag
tools/check-katalog.mjs    jede Übung hat Gerät, keine doppelten ids, Plan nutzt nur Katalog-Geräte, keine Freihantel
tools/check-backup.mjs     Backup format 1 → migriere() → aktuelles Schema; Rundreise ohne Datenverlust
tools/check-quellen.mjs    jedes Supplement in der Prüfliste hat Quelle, Dosis, Nebenwirkungen, Ausschlussgründe
tools/check-sw.mjs         jede Datei aus js/, vendor/, daten/ steht in der DATEIEN-Liste von sw.js
```
Begründung: Rechenlogik ohne DOM → mit node prüfbar (wie ampel.js/training.js). check-sw verhindert den typischen
Offline-Fehler "neues Modul vergessen zu cachen". check-privat wichtig: Körperdaten dürfen nie ins Repo (Testdaten erfunden).

## 7. Getrennt von der Bike-App halten
- **Eigenes Repo** (z. B. `fitness-app`) → eigene GitHub-Pages-Adresse `<nutzer>.github.io/fitness-app/`.
- Begründung: Origin = Schema+Host+Port, **ohne Pfad**. Projekt-Pages aller Repos eines Kontos liegen auf derselben
  Origin `<nutzer>.github.io`. Getrennt sind also nicht die Speicher, sondern nur Pfade. Daher trotzdem nötig:
  eigener DB-Name (`fitness-app`), eigenes Cache-Präfix (`fitness-app-`; Bike-`sw.js` löscht nur `bike-app-*` – passt),
  eigener SW-`scope` und Manifest `id`/`start_url`/`scope` = `./`. Vermutung, nicht geprüft: iOS gibt jeder
  Home-Bildschirm-App ohnehin einen eigenen Speicherbereich – dann wäre die Trennung doppelt gesichert.
- Unterordner im Bike-Repo dagegen: gemeinsame Versionsnummer/`version.json`, pre-push-Prüfungen vermischt, Bike-SW
  mit scope `./` würde Anfragen des Unterordners abfangen und cachen. → Nachteile ohne Nutzen.
- Echte Origin-Trennung später möglich (eigene Domain), kostet aber Geld → nicht nötig.

## Quellen
webkit.org/blog/10218 (2020); webkit.org/blog/11338; bugs.webkit.org 237350, 271401, 281848; webkit.org/blog/14403 (2023);
caniuse.com/mdn-api_barcodedetector; npmjs.com/package/barcode-detector (MIT); github.com/mebjas/html5-qrcode,
scanbot.io (Wartungsstand); openfoodfacts.github.io/openfoodfacts-server/api (ODbL, v2); support.openfoodfacts.org (User-Agent).
