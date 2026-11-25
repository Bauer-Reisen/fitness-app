# Fitness-App

Persönliche Fitness-App fürs Studio: Training mit Feedback nach jedem Satz, Rücksicht auf Gelenke, Ernährung mit Eiweiß-Ziel und Körperdaten. Reine Web-App fürs iPhone – ohne Server, ohne Anmeldung, ohne laufende Kosten. Alle Daten bleiben auf dem eigenen Handy.

**→ https://bauer-reisen.github.io/fitness-app/** (nach dem Einschalten von GitHub Pages: Branch `main`, Ordner `/docs`)

Am iPhone in Safari öffnen und über **Teilen → Zum Home-Bildschirm** speichern – nur so bleiben die Daten sicher gespeichert.

## Aufbau
- `docs/` – die App (wird von GitHub Pages ausgeliefert)
- `scripts/` – Prüfungen und Hilfsprogramme
- `ANFORDERUNGEN.md`, `PLAN.md`, `STAND.md` – Planung und Stand
- `planung/grundlagen/` – Rechercheberichte mit Quellen

## Für Entwickler
- Lokal testen: `npm start` → http://localhost:5820
- Prüfen: `npm run check` (läuft vor jedem Push, wenn der Hook aktiv ist: `git config core.hooksPath .githooks`)
- Neue Version: `node scripts/set-version.js 0.x.y`
- Symbole: `npm run icons`, QR-Code: `npm install` und `npm run qr`

Die App ersetzt keine ärztliche Beratung.
