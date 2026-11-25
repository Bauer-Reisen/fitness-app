# STAND – Fitness-App

Für eine neue Sitzung: zuerst diese Datei lesen, dann bei Bedarf [ANFORDERUNGEN.md](ANFORDERUNGEN.md) (Regeln) und [PLAN.md](PLAN.md) (Bauabschnitte).

**Regeln:** Deutsch, knapp, ohne Fachjargon. Keine Konten anlegen, keine Passwörter eingeben. **Keine persönlichen Gesundheitsangaben ins Repository** – Testdaten nur erfunden und allgemein. Aufbau wie Sziget-/Sportplatz-App (`docs/`, `scripts/`, Rundgang + „Was ist neu?“ in `docs/js/hilfe.js`, Versionen mit `scripts/set-version.js`). Bei jeder sichtbaren Neuerung: Rundgang-Karte prüfen (`stand`) und „Was ist neu?“-Eintrag ergänzen.

## Eingerichtet
- Repository `Bauer-Reisen/fitness-app` (öffentlich). Entwicklung auf Branch `claude/fitness-app-requirements-bwg1n9`, veröffentlicht über `main` (Pages: main /docs, eingeschaltet 25.11.2026).
- Default-Branch im Repository noch auf `main` umstellen (nur über GitHub-Einstellungen möglich).
- Speicher: IndexedDB `fitness-app`, localStorage-Präfix `fitness.`, Offline-Speicher `fitness-<Version>` (alle Apps auf bauer-reisen.github.io teilen sich den Browser-Speicher).
- Prüfungen: `npm run check` = check-privat (nichts Privates, keine Backup-Dateien), check-app (Versionen, Importe, sw.js-Liste, Hilfe, Supplemente), check-logik (251 Regeltests).

## Version 0.1.0 (25.11.2026) – erste Fassung, Abschnitte 1–10 aus PLAN.md
- Heute: Einrichten-Schritte, Muskelkater-Karte (12–72 h, mit „Gelenk schlechter als sonst“), Gesundheits-Wiedervorlage, Lage (Ruhetag/Training), Eiweiß/kcal mit „+ Shake“, Backup-Erinnerung, „Offline bereit ✓“.
- Training: Plan aus Katalog + Gelenkregeln (Abschnitt 1c), Ablauf Aufwärmen → Mobilität (bei Hüfte) → Übungen → Förderblock → Handprogramm (bei Daumen/Hand) → Abschluss mit „Nächstes Mal“. 1 Tipp pro Satz, Schmerz-Knopf (geht noch / zu viel), Pausentimer über Endzeit, Ton, Wake Lock, Rückgängig 5 s, später/tauschen/überspringen, Fortsetzen, Auto-Ende nach 4 h.
- Geräte: 28 Vorlagen, Abhaken, Stufen (Start/Schritt/Max oder frei, Zusatzgewicht, Anzeige kg/Stufe), Einstellungen, eigene Geräte („wie Gerät X“), Übungen aus-/einblenden.
- Essen: Bedarf (Mifflin, PAL, MET 3,5, Ziel), Ziel „Fett ab, Muskeln auf“ (Standard), Shake mit 1 Tipp, Schnelleingabe, Favoriten, Zuletzt, Grundliste (35 Lebensmittel, Richtwerte), 13 Mahlzeitvorschläge.
- Körper: Gewicht mit 7-Tage-Mittel und Wochenkurve, Umfänge, Ziel-Check Rekomposition (Gewicht/Taille), Unverträglichkeiten, Profil (inkl. Erfahrung je Muster), Gesundheitsabfrage.
- Mehr: Backup (Teilen-Menü, Import ersetzt), Supplement-Prüfliste, „Wie wird gerechnet?“, Einstellungen, Weitergeben (QR), Offline neu speichern, Daten löschen.
- Geprüft im Browser bei 375 px: Einrichten, Gesundheitsabfrage, Geräte, zwei Trainings (Startgewicht, Steigerung im Training), Muskelkater-Karte, Backup-Download; keine Fehler in der Konsole, kein Querscrollen.

- **0.1.1** (25.11.2026): Körper → Umfänge mit Taille, Brust, Oberarm, Oberschenkel (je Anleitung, Datum zum Nachtragen, Veränderung seit erster Messung), Ziel-Check mit allen Umfängen. Gewichts-Knöpfe in eigener Reihe (ragten bei 375 px über den Rand), lange Texte brechen um (Geräte, Profil). Bei 320 und 375 px alle Seiten ohne Überstand geprüft.

- **0.1.2** (25.11.2026): Erster Satz einer neuen Übung mit Körpergewicht oder Haltezeit ist ein Test (so viele saubere Wdh. wie gut gehen, 2–3 Reserve); daraus werden Folgesätze und Startwert. Bei Geräten Hinweis zum Startgewicht. Vorschau im Reiter Training zeigt den Test.

- **0.1.3** (25.11.2026): Gelenkeinträge verlängern den Einstieg nicht mehr (Wunsch Nutzer: Feedback statt Vorsicht von vornherein); Einstieg nur nach Erfahrung im Profil. Bestehende Übungen werden beim Start einmal angepasst (kv `einstiegAngepasst`). Ausblenden nach ärztlichen Vorgaben bleibt.

- **0.1.4** (25.11.2026): Studio-Liste (docs/js/studio.js): Hauptbereich 1–33 und Gerätepark rot 1–7 laut Geräteliste des Studios, dazu Ausdauergeräte, Matten, Medizinbälle, Wand-Klimmzugstange; je Gerät Vorlage und Übungen. Standard an (kv `studio`), allgemeine Vorlagen zusätzlich aufklappbar. Gewichtsstufen ungeprüft → Hinweis im Training und auf der Geräteseite, bis gespeichert (`stufenGeprueft`). Neue Übungen Crossover (Brust), Dips an der Maschine. Offene Fragen an den Nutzer: Gerätepark rot (Art des Widerstands), 15/21 Klimmzug/Dips (mit Unterstützung?), 24 Crossover (Maschine oder Seilzug?).

## Als Nächstes
- `main` + Pages einschalten, dann am iPhone testen (Home-Bildschirm, Wake Lock ab iOS 18.4, Offline im Studio).
- Prüfpunkte vor/bei Abnahme: ANFORDERUNGEN.md Abschnitt 4 (u. a. Gerätemerkmale im Studio prüfen, Vorgaben zur Hüftprothese erfragen).
- Danach Schwellen in `docs/js/regeln.js` nach zwei Wochen Gebrauch nachstellen.
