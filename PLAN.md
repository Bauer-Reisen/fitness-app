# Fitness-App – Bauplan Version 1

Bezug: [ANFORDERUNGEN.md](ANFORDERUNGEN.md). Stand der Umsetzung: [STAND.md](STAND.md). Aufbau wie Sziget-/Sportplatz-App: App in `docs/`, Prüfungen in `scripts/`.

Jeder Abschnitt endet mit einem Test, der ohne die späteren Abschnitte funktioniert. Erst weiter, wenn der Test besteht.

---

## Abschnitt 1 – Grundgerüst und Installation
- Eigenes Repository `fitness-app` (entschieden), öffentlich, damit GitHub Pages im kostenlosen Tarif läuft; Planungsdokumente liegen unter `docs/`. `index.html`, `manifest.webmanifest` (`display: standalone`, eigene `id`/`scope`), Icons, `sw.js` mit Cache-Präfix `fitness-app-`, `version.json`.
- `docs/js/db.js` aus der Bike-App übernehmen, Datenbankname `fitness-app`, alle Speicher aus dem Datenmodell anlegen.
- Leiste unten: Heute · Training · Essen · Körper · Mehr.
- `scripts/check-privat.mjs` (vor jedem Push), `scripts/check-sw.mjs` (jede Datei aus `docs/js/` und `daten/` steht in der Cache-Liste), `scripts/server.mjs`.

**Test:** Am iPhone zum Home-Bildschirm hinzufügen, öffnen, Flugmodus an, erneut öffnen → App startet. `check-sw` und `check-privat` grün.

## Abschnitt 2 – Backup
- Export als JSON über das Teilen-Menü, Import ersetzt nach Rückfrage, Prüfung von `app` und `format`.
- Backup-Erinnerung (über 14 Tage und neue Einträge).
- Einstiegshinweis „nur vom Home-Bildschirm nutzen“.

**Test:** `scripts/check-backup.mjs`: erfundene Daten → Export → Import → identisch. Am iPhone: Datei in „Dateien“ sichern und wieder laden.

## Abschnitt 3 – Profil und Körperdaten
- Profil-Formular; Gewicht und Taille eintragen, optionale weitere Umfänge; Verlauf als einfache Linie mit 7-Tage-Mittel.
- Messanleitungen als kurzer Text.
- Unverträglichkeiten: Freitext, Datum, aktiv/erledigt.
- `docs/js/koerper.js` (Mittelwert, Alter aus Geburtsdatum) ohne Bildschirm-Code.

**Test:** `scripts/check-koerper.mjs`: 7-Tage-Mittel mit Lücken, „zu wenig Daten“ bei unter 4 Werten, Alter am Geburtstag.

## Abschnitt 3a – Gesundheitsabfrage und Startprofil
- Teil A (Warnzeichen), Teil B (Einschränkungen mit Vorgaben-Häkchen), Teil C (Erfahrung je Muster) als kurze Bildschirmfolge; Wiedervorlage-Karten (3 Monate, OP-Monat, Pause, Schmerz).
- Hinweis beim Backup, „Gesundheitsangaben löschen“.
- `check-privat` erweitern: keine Backup-Dateien und keine echten Gesundheitsangaben in Test- oder Beispieldaten.

**Test:** `scripts/check-gesundheit.mjs`: Wiedervorlage-Daten richtig berechnet (90 Tage, OP-Monat, > 28 Tage Pause, 2× „zu viel“ in 14 Tagen), nie am selben Tag wie die Muskelkater-Karte. Am iPhone: Abfrage in unter 2 Minuten.

## Abschnitt 4 – Gerätekatalog
- `docs/js/katalog.js` mit 30 Vorlagen und Übungen (aus `planung/grundlagen/C.md`), Prioritätslisten je Muster, Belastungsmerkmale je Übung (aus `planung/grundlagen/I.md`), Förder-, Mobilitäts- und Handübungen.
- Abhaken „vorhanden“, Stufenliste je Gerät einstellen, eigenes Gerät anlegen, „wie Gerät X“, Einstellungen (Sitzhöhe …).

**Test:** `scripts/check-katalog.mjs`: jede Übung hat ein Gerät, keine doppelten ids, keine freien Gewichte, jedes Muster hat mindestens eine Übung, Stufenliste sortiert, jede Vorlagen-Übung hat alle Belastungsmerkmale, jedes Muster hat mindestens eine Übung mit `griff` höchstens `druck` und eine mit `hueftbeugung` gering oder begrenzbar. Am iPhone: eigenes Gerät in unter 30 s anlegen.

## Abschnitt 5 – Vorschlagslogik
- `docs/js/vorschlag.js`: Plan aus dem Katalog bilden; Vorgabe je Übung (Stufe, Sätze, Ziel-Wdh.) aus Stand, Pausentagen, Abstand, Muskelkater; Folgesatz-Regel; Auswertung nach dem Training mit Begründungstext.
- Alle Regeln aus Anforderungen Abschnitt 1a und 1c (Filter, Auswahl je Muster, Einstieg je Erfahrung, Schmerzregeln, Förderblock mit Wechsel), Schwellen gesammelt in einer Datei `docs/js/regeln.js`.

**Test:** `scripts/check-vorschlag.mjs` mit erfundenen Verläufen, mindestens: 2× erfüllt → +1 Stufe; 1× easy → kein Sprung; 2× verfehlt → −1 Stufe; großer Sprung → Obergrenze 15; Pausen 7/8/15/29 Tage; Muskelkater stark in Beinen; Abzüge stapeln sich nicht unter 1 Satz; „nicht bewertet“ zählt nicht.
Gelenkfälle mit erfundenen Profilen: Daumen-Arthrose → Ziehen wählt keine `zug_stark`-Übung, wenn eine Alternative da ist; Hüft-TEP mit „nicht über 90°“ → keine tiefe Beugung ohne Anschlag-Hinweis; „weiß nicht“ → vorsorglich ausgeblendet; alles ausgeblendet → Muster entfällt mit Hinweis; „geht noch“ → keine Erhöhung; 2× „Gelenk schlechter“ → ausgeblendet; Förderblock wechselt Abduktion → Streckung → Kontrolle; Erfahrung „früher“ → Einstieg 7 Tage, mit Gelenkeintrag 14 Tage.

## Abschnitt 6 – Training im Studio
- Heute-Bildschirm mit Startknopf; Ablauf Aufwärmen → Übung → Satz → Pause → Abschluss.
- 4 Feedback-Knöpfe in der Daumenzone (mind. 60 px hoch), Knopf „Schmerz“ mit „geht noch / zu viel“, Plus/Minus statt Tastatur, Rückgängig.
- Mobilitätseinheit und Handprogramm als eigene kurze Schritte mit 1-Tipp-Feedback; Förderblock nach den Hauptübungen.
- Pausentimer über Endzeit, Wake Lock mit Neuanforderung nach Rückkehr.
- Sofortiges Speichern je Satz, „Fortsetzen?“, Abbruch nach 4 h.
- „später“, Anzeige aktiver Einschränkungen und Vorgaben, „vorsorglich ausgeblendet“ mit Einblenden, Abschluss mit Änderungsliste.

**Test:** Einmal komplett im Studio trainieren. Prüfpunkte: normaler Satz = 1 Tipp; App mitten im Training wegwischen → Fortsetzen klappt ohne Verlust; Bildschirm 2 Min. aus → Timer zeigt richtige Restzeit; offline ohne Fehler.

## Abschnitt 7 – Nachträgliches Feedback
- Muskelkater-Karte 12–72 h nach dem Training, Muskelgruppen, „Gelenk schlechter als sonst“ bzw. „Schmerz, nicht Muskelkater“, Einstellung an/aus.

**Test:** Mit verstellter Gerätezeit bzw. erfundenem Trainingsdatum: Karte erscheint bei 13 h, nicht bei 11 h und 73 h, nur einmal; „stark Beine“ ändert den nächsten Vorschlag sichtbar (deckt sich mit check-vorschlag).

## Abschnitt 8 – Bedarf
- `docs/js/bedarf.js`: Grundumsatz, Pausentag, Trainingstag-Zuschlag, Ziele, Rundung, Untergrenzen; Schalter „heute trainiere ich noch“.
- Seite „Wie wird gerechnet?“.

**Test:** `scripts/check-bedarf.mjs`: Beispielpersonen gegen von Hand gerechnete Werte; Trainingstag > Pausentag; Eiweiß gleich; nie unter Grundumsatz.

## Abschnitt 9 – Essen erfassen
- „+ Shake“ mit eingestellter Portion; Schnelleingabe kcal/Eiweiß; Zuletzt/Favoriten; Grundliste `docs/js/lebensmittel.js`; 10–15 Mahlzeitvorschläge nach Restbedarf sortiert.
- Tagesbalken Eiweiß/kcal auf Heute und Essen.

**Test:** Shake in 1 Tipp, eine Mahlzeit aus „Zuletzt“ in unter 10 s; Vorschläge ändern sich mit dem Restbedarf; alles offline.

## Abschnitt 10 – Supplements
- `docs/js/supplemente.js` mit Prüfliste, Mangel-Block und Ausschlussliste aus Anforderungen Abschnitt 3; Markieren „nehme ich“.

**Test:** `scripts/check-quellen.mjs`: jeder Prüflisten-Eintrag hat Nutzen, Dosis, Risiken, Ausschlussgründe, mindestens eine Quelle und ein Stand-Datum; jeder Ausschluss-Eintrag hat eine Begründung.

## Abschnitt 11 – Abnahme Version 1
- Zwei Wochen echter Gebrauch. Danach: Schwellen in `docs/js/regeln.js` nachstellen, Punkte aus „Später“ priorisieren.

**Test:** Alle `scripts/check-*.mjs` grün; Backup vom iPhone auf einem frisch installierten Stand eingespielt → alles da.
