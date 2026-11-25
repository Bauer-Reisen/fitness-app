# J – Gesundheitsabfrage und Startprofil (Runde 2)

Kennzeichnung: **V1** / **später**. „Vermutung, nicht geprüft:“ = ohne geprüfte Quelle. Websuche 23.11.2026; PDFs von
vancouver.ca/southlake.ca waren aus der Sitzung nicht abrufbar (Netzsperre) → Wortlaut PAR-Q+ 2025 nicht selbst gelesen.
Grundsatz: Die App fragt ab und passt Training an; sie urteilt nicht medizinisch und ersetzt keine Freigabe.

## 1. Gesundheitsabfrage (V1)

Quellen:
- PAR-Q+ (PAR-Q+ Collaboration, aktuelle Fassung „2025 PAR-Q+“, Stand 01-11-2024): 7 allgemeine Fragen; alle „nein“ →
  ohne Einschränkung aktiv werden; ein „ja“ → Folgefragen je Erkrankung (u. a. „Arthritis, Osteoporose oder Rückenprobleme“).
  Erneut ausfüllen: mindestens alle 12 Monate oder bei Änderung des Zustands. (Quelle: Suchtreffer zu Formularkopien
  Vancouver/Richmond/Southlake; Wortlaut 2025 nicht selbst gelesen.)
- ACSM-Screening, Riebe et al. 2015, Med Sci Sports Exerc 47(11):2473–2479, doi 10.1249/MSS.0000000000000664:
  entscheidend sind (1) aktuelle Aktivität, (2) Warnzeichen oder bekannte Herz-Kreislauf-, Stoffwechsel-, Nierenerkrankung,
  (3) geplante Intensität. Risikofaktoren-Zählen entfällt; Ziel: weniger unnötige Hürden.
- Vermutung, nicht geprüft: PAR-Q+ ist urheberrechtlich geschützt → eigene Formulierungen verwenden, Quelle nennen.

Teil A – Warnzeichen (5 Ja/Nein-Fragen, eigene Formulierung angelehnt an PAR-Q+/ACSM, ca. 30 s):
1. Hat dir ein Arzt eine Herzerkrankung oder Bluthochdruck festgestellt?
2. Hast du Schmerzen/Druck in der Brust – in Ruhe, im Alltag oder bei Belastung?
3. Wird dir schwindlig bis zum Gleichgewichtsverlust, oder warst du in den letzten 12 Monaten bewusstlos?
4. Hast du eine bekannte Stoffwechsel- oder Nierenerkrankung (z. B. Diabetes)?
5. Ungewöhnliche Atemnot, Herzrasen/-stolpern oder geschwollene Knöchel?
Ein „ja“ → Hinweis „Bitte vor dem Training ärztlich abklären, ob und wie du trainieren darfst“, Knopf
„Ich habe das abgeklärt“ (speichert Datum) oder „trotzdem fortfahren“ (speichert ebenfalls, keine Sperre).
Keine Sperre, keine Bewertung; Hinweis bleibt im Profil sichtbar. Die App rechnet nichts aus diesen Antworten.

Teil B – Gelenke/Einschränkungen (Auswahl, ca. 60 s):
- „Gibt es Körperstellen, die beim Training Rücksicht brauchen?“ → Körperbild oder Liste: Schulter, Ellbogen, Handgelenk,
  Daumen/Hand, Nacken, oberer Rücken, unterer Rücken, Hüfte, Knie, Sprunggelenk/Fuß, sonstiges. Seite: links/rechts/beide.
- Je Eintrag Art: Arthrose · Gelenkersatz (Monat/Jahr der OP) · akute Beschwerde/Verletzung · OP geplant · sonstiges.
- Schmerz im Alltag 0–10 (Schieberegler; 0–10-Skala ist Standard-Schmerzskala NRS – Vermutung, nicht geprüft für diese
  Nutzung). Bewegung eingeschränkt ja/nein.
- „Gibt es ärztliche/physiotherapeutische Vorgaben?“ ja/nein + Freitext (z. B. „keine Hüftbeugung über 90°“).
- Diese Einträge speisen die Gelenkregeln von Agent I (Übung ausschließen, Variante, Belastungsgrenze). Freitext-Vorgaben
  werden nur angezeigt (beim Training oben), nie ausgewertet – außer der Nutzer übernimmt Vorschläge (Abschnitt 2).

Teil C – Vorgeschichte (Abschnitt 3, ca. 30 s). Gesamt: ca. 2 Minuten.

Erneut fragen:
- V1: „Gesundheit prüfen“-Karte alle 3 Monate (eigene Wahl, strenger als PAR-Q+-12 Monate; Vermutung, nicht geprüft als
  sinnvoller Abstand) – nur „alles gleich“ antippen oder ändern.
- V1: sofort anbieten bei: „Schmerz, nicht Muskelkater“ oder „tut weh“ (2× in 14 Tagen an derselben Körperstelle – Faustregel),
  bei Eintrag „OP geplant“ nach dem angegebenen Monat („Ist die OP erfolgt?“), nach Trainingspause > 28 Tage.
- Nach Gelenkersatz-OP: Hinweis „Start erst mit ärztlicher/physiotherapeutischer Freigabe; Vorgaben eintragen“.
- Bestehender V1-Freitext „Beschwerden“ (Speicher `notizen`) geht in Teil B auf.

## 2. Freitext ohne KI

V1 – Stichwortliste mit Vorschlag, Nutzer bestätigt:
- Text klein schreiben, Umlaute vereinheitlichen (ü→ue, ß→ss), Satzzeichen weg; Treffer über Wortstämme.
- Körperstellen: hüft/hüfte/huefte/leiste · knie/meniskus/kreuzband · daumen/sattelgelenk/rhiz · hand/handgelenk/finger ·
  schulter/rotatoren/impingement · nacken/hws · rücken/ruecken/lws/bws/kreuz/hexenschuss/ischias/bandscheib/prolaps ·
  ellbogen/tennisarm/golferarm · sprung/knöchel/achilles/fuß.
- Art: arthros/verschleiß/abnutz/coxarthrose/gonarthrose/rhizarthrose · tep/prothese/künstlich/endoprothese/neues gelenk ·
  op/operiert/operation · gerissen/riss/zerrung/entzünd/akut · schmerz/tut weh/zieht/sticht.
- Seite: links/li/linke · rechts/re/rechte · beid/beidseit.
- Zahlen in der Nähe: Jahreszahl/Monat → OP-Datum-Vorschlag; „Grad 3/4“ nur speichern, nicht auswerten.
- Ergebnis: Karte „Erkannt: Hüfte links – Gelenkersatz – 06/20xx? [Übernehmen] [Ändern] [Verwerfen]“. Nichts wirkt ohne Tipp.
- Grenzen ehrlich: Verneinung („keine Knieprobleme“, „Knie wieder gut“) → einfache Regel: Wörter kein/keine/nicht/ohne/
  wieder gut/früher/ehemals bis 3 Wörter davor → Vorschlag mit Fragezeichen statt Vorauswahl; trotzdem Fehlzuordnungen
  möglich (Bezug auf andere Personen, Ironie, Tippfehler, Mehrfachnennungen in einem Satz, unbekannte Fachwörter).
  Deshalb immer bestätigen lassen; Freitext bleibt zusätzlich im Original sichtbar.
- Aufwand gering (Liste als Daten-Datei, ca. 150 Einträge; Tests mit 30 Beispielsätzen).

Später – lokales Sprachmodell im Browser (nur Einordnung):
- WebGPU ist in Safari/iOS 26 standardmäßig an (web.dev „WebGPU supported in major browsers“; WebKit-Berichte).
  WebLLM (Chat-Modelle ab SmolLM2-360M) und Transformers.js (kleinere Klassifikations-/Einbettungsmodelle) laufen im Browser.
- iPhone-Grenzen: Speicher; WebKit-Bug: WebLLM musste Puffer wegen iOS-Abstürzen auf 256 MB senken. Vermutung, nicht geprüft:
  ein kleines Klassifikationsmodell (ca. 20–100 MB) wäre machbar, ein Chat-Modell (≥ 250 MB Download) wackelig; einmaliger
  Download, dann offline im Cache (iOS kann Cache löschen).
- Vorgabe „keine KI-Schnittstellen“: lokal = keine Schnittstelle, keine Kosten, keine Datenweitergabe → formal vereinbar,
  aber hoher Aufwand und unklare Zuverlässigkeit für ca. 1 Freitext alle 3 Monate. Empfehlung: nicht bauen.

## 3. Trainingsvorgeschichte und Startprofil

Belege:
- Bosquet et al. 2013, Scand J Med Sci Sports 23:e140, doi 10.1111/sms.12047 (103 Studien): Trainingspause senkt Kraft
  (SMD −0,62 submaximal, −0,46 Maximalkraft), Effekt wächst mit Pausendauer; größer bei > 65 J. und bei Inaktiven.
- Staron et al. 1991, J Appl Physiol 70:631 (6 Frauen, 20 Wo. Training, 30–32 Wo. Pause, 6 Wo. Wiedereinstieg):
  ein Teil von Kraft/Faserquerschnitt blieb erhalten, in 6 Wochen schnell wiedergewonnen.
- Bruusgaard et al. 2010, PNAS (Mäuse/Ratten): zusätzliche Muskelzellkerne bleiben bei Abbau erhalten → mögliche
  Grundlage „Muscle Memory“. Psilander et al. 2019, J Appl Physiol (Menschen, 10 Wo./20 Wo. Pause/5 Wo.): kein klarer Beleg.
  Blocquiaux et al. 2020, Exp Gerontol (ältere Männer, 12/12/12 Wo.): Kraft teilweise erhalten, 1RM schnell wieder erreicht.
  Fazit: Wiedereinstieg geht schneller als Neuanfang; Mechanismus beim Menschen umstritten. Sehnen/Gelenke passen sich
  langsamer an als Muskeln (Vermutung, nicht geprüft) → Tempo deckeln.

Fragen (je Muster Drücken, Ziehen, Beine, Rumpf + Ausdauer; 1 Bildschirm):
1. Erfahrung je Muster: neu · früher regelmäßig · aktuell regelmäßig.
2. Bei „früher“: Pause in Monaten (< 3 · 3–6 · 6–12 · > 12).
3. Optional früheres Niveau: Klimmzüge am Stück / Liegestütze am Stück (Zahl) – nur als Info und für Leiter-Startwert später.
4. Ausdauer: wie lange locker Rad/Laufband am Stück? (< 10 · 10–30 · 30–60 · > 60 Min.).
5. Aktuelle Belastbarkeit: „Treppe 2 Stockwerke ohne Pause“ ja/nein (Vermutung, nicht geprüft als Maß; nur Info).

Regeln je Muster (Feld `erfahrung`), ersetzen in Abschnitt 1a die feste Einstiegsregel (Faustregeln, ungeprüft):
| erfahrung | Einstiegsphase | Steigerung | Startstufe |
|---|---|---|---|
| neu | 14 Tage, 2 Sätze, 10–12 Wdh. | Standardregel | kleinste Stufe |
| früher, Pause > 12 Mon. | 10 Tage | Standard, +1 Stufe schon nach 1 erfülltem Training | kleinste bzw. 2. Stufe |
| früher, Pause 3–12 Mon. | 7 Tage | nach 1 erfülltem Training +1 Stufe; easy → +2 Stufen möglich, höchstens 1 Sprung je Training | Nutzer schätzt; Vorschlag 2.–3. Stufe |
| aktuell | keine (gleich 3 Sätze) | Standard | Nutzer gibt ein |
- Schnelle Steigerung gilt nur, bis die Stufe erreicht ist, die der Nutzer als „früher üblich“ angibt (optional); danach Standard.
- Gelenkregel schlägt Erfahrung: Muster/Übung mit Gelenkeintrag (Agent I) → Einstieg wie „neu“, Sprung höchstens +1 Stufe,
  Obergrenze aus Agent-I-Regel; Schmerz-Feedback stoppt jede Steigerung dieser Übung.
- Aufwärmen: Ausdauer > 30 Min. → Aufwärmen frei wählbar; sonst Vorgabe 5–8 Min. locker.

Beispielprofile (allgemein):
(a) Früher hohes Volumen Drücken/Ziehen, 3–12 Monate Pause, Hüft- und Daumengelenk eingetragen:
  Drücken/Ziehen = „früher, 3–12 Mon.“ → 7 Tage Einstieg, schnelle Stufen; aber Daumen-Eintrag → Griffvarianten/Gerätewahl
  laut Agent I, Sprung max. +1. Beine = Gelenkregel Hüfte → wie „neu“. Rumpf: Übungen ohne Hüftbeugung unter Last (Agent I).
(b) Sehr trainierte Beine/Ausdauer, Oberkörper ungeübt: Beine „aktuell“ → Startstufe vom Nutzer, Standard-Steigerung;
  Drücken/Ziehen/Rumpf „neu“ → 14 Tage Einstieg. Ausdauer > 60 Min. → kein Pflicht-Aufwärmen. Hinweis: Radkilometer
  zählen nicht als Beinkrafttraining an Maschinen (Vermutung, nicht geprüft) → Startstufe bewusst mittel wählen.

## 4. Mehrnutzer

- Eigenes iPhone = eigene Home-Bildschirm-App = eigener Speicher → automatisch getrennt (V1, nichts zu tun).
- Gemeinsames Training an zwei Geräten: keine Synchronisation nötig. Nützlich: Gerätekatalog (nur `geraete` mit
  vorhanden/Stufen/Einstellungsnamen, ohne Einstellungswerte, ohne Gesundheit/Training) als Datei exportieren und beim zweiten Nutzer
  importieren (zusammenführen). Aufwand klein, da Backup-Export schon existiert. Empfehlung: **später** (V1.1);
  V1-Ersatz: Katalog-Abhaken dauert einmalig ca. 5 Min.
- Mehrere Profile auf einem Gerät: bleibt „später“.

## 5. Datenschutz

- Gesundheitsdaten = besondere Kategorie, DSGVO Art. 9 Abs. 1 (Gesetzestext). Nutzt eine Person die App nur für sich,
  greift Vermutung, nicht geprüft: die Haushaltsausnahme Art. 2 Abs. 2 lit. c (ausschließlich persönliche/familiäre
  Tätigkeit) – DSGVO dann nicht anwendbar. Der App-Herausgeber erhält keine Daten; ob er dennoch „Verantwortlicher“ ist,
  klären die Suchtreffer nicht (Bitkom/IHK sehen App-Anbieter regelmäßig als Verantwortliche, aber bei Datenzugriff;
  EDSA-Leitlinien 07/2020 wären die Prüfquelle). Praktisch: nichts verlässt das Gerät → kein Problem erkennbar.
- Folgen für die App (V1):
  - Kein Netzwerkaufruf mit Nutzerdaten; keine Analyse-/Fehlerdienste; Schriften/Bibliotheken lokal.
  - Backup-Export: Hinweis „Die Datei enthält Gesundheitsangaben. Nur an sicheren Ort speichern (z. B. eigene iCloud/Dateien),
    nicht weitergeben.“ Katalog-Export (später) enthält keine Gesundheitsdaten – im Dateinamen/Text klar trennen.
  - Abfrage-Teil A/B jederzeit löschbar („Gesundheitsangaben löschen“), Seite „Was speichert die App?“.
  - Prüfskript `check-privat`: Repo darf keine Backup-Dateien (`*.json` mit `"app":"fitness-app"`), keine echten Namen,
    Daten, Diagnosen in Beispiel-/Testdaten enthalten; Testprofile nur erfunden und allgemein. Code-Suche nach `fetch(`/
    `XMLHttpRequest`/`sendBeacon` außer für die App-eigenen Dateien.
- Vermutung, nicht geprüft: Weil die App keine Diagnose/Therapieentscheidung trifft, sondern Trainingsregeln anwendet, ist sie
  kein Medizinprodukt (MDR) – Formulierungen entsprechend neutral halten („Rücksicht“, „Vorgabe“, nicht „Behandlung“).

## 6. Datenmodell-Ergänzung

| Speicher | Felder | Hinweis |
|---|---|---|
| `gesundheit` (neu) | `datum`, `warnzeichen` {`herz`,`brust`,`schwindel`,`stoffwechsel`,`atemnot`: ja/nein}, `abgeklaertAm`, `trotzdemAm`, `naechstePruefung`, `anlass` (`erst`/`turnus`/`schmerz`/`op`/`pause`/`manuell`) | eine Zeile je Abfrage; nie überschreiben (Verlauf) |
| `einschraenkungen` (neu, ersetzt `notizen.typ=beschwerde`) | `stelle` (Liste s. o.), `seite` (`links`/`rechts`/`beide`), `art` (`arthrose`/`gelenkersatz`/`akut`/`opGeplant`/`sonstiges`), `opDatum` (JJJJ-MM), `schmerz` 0–10, `eingeschraenkt`, `vorgabe` {`ja`, `text`}, `quelle` (`auswahl`/`freitextVorschlag`), `status` (`aktiv`/`erledigt`), `beginn`, `erledigtAm`, `verlauf[{datum, schmerz}]` | von Agent-I-Regeln gelesen |
| `profil` (Ergänzung) | `erfahrung` {`druecken`,`ziehen`,`beine`,`rumpf`: {`stufe`: `neu`/`frueher`/`aktuell`, `pauseMonate`, `frueherWert`}}, `ausdauerMinuten`, `freitextGesundheit` | Startprofil |
| `geraetUebung.stand` (Ergänzung) | `einstiegBis` (Datum), `tempo` (`standard`/`schnell`), `zielStufeFrueher` | aus `erfahrung` beim ersten Training berechnet |
| `kv` | `gesundheitPruefIntervallTage` (90) | |
| Daten-Datei `stichwoerter.json` | `{muster, feld, wert}` je Stichwort | in der App, nicht im Backup |
Backup: `schema` auf 2 (neue Speicher); Import alter Dateien: `notizen.beschwerde` → `einschraenkungen` mit `art=sonstiges`.
