# Agent F – Kritik (Planungsrunde, Stand 23.11.2026)

## 1. Streichen/verschieben für Version 1 (Ziel: kleinste App, die im Studio trägt)
V1-Kern: Heute-Bildschirm → Training mit 4-Knopf-Feedback + Pausentimer → Steigerungsregel → Muskelkater-Karte;
Gerätekatalog zum Abhaken; Gewicht + Bedarf kcal/Eiweiß + Shake-Knopf + Schnelleingabe; Backup; Supplement-Seite statisch.
Verschieben auf später, mit Grund:
- D: Barcode-Scan, vendor/barcode-detector (.wasm), off.js, Warteschlange "offene Abfrage", Store `produkte` → OFF-CORS ungeprüft,
  größter Bau- und Cache-Aufwand; G und E planen OFF ohnehin erst später.
- D: Profil-Store/`profilId`-Index, Studio-Id → "andere Nutzer" heißt eigenes iPhone (D selbst); ein Feld kostet wenig,
  aber Index + Logik weglassen. Nur zufällige ids behalten.
- D: Backup-Zusammenführen + "vorher alles löschen" + Sicherheits-Backup + Migrationsdatei → V1: Export, Import = ersetzen
  (mit Rückfrage), `format`-Feld prüfen. Migration erst, wenn es Version 2 des Schemas gibt.
- D: hilfe.js/Rundgang/"Was ist neu?", check-quellen.mjs, storage.estimate-Anzeige → später.
- A: A/B-Varianten-Wechsel, Klimmzug-Leiter, automatisches Deload, Übungstausch nach 3x Stagnation, Region-Hinweispunkte,
  Aufwärmsatz-Berechnung → später. V1: ein Ganzkörperplan (4 Muster), Doppelprogression, Pausen-Regel, Kater-Bremse.
- A: Startgewicht-Suche mit bis zu 3 Testsätzen → V1 einfacher: Nutzer gibt Startstufe selbst ein (oder kleinste Stufe),
  die normale Satz-Feedback-Regel korrigiert ab Satz 2. Spart eigenen Ablauf.
- C: 30 Vorlagen ok (nur Daten), aber V1 ohne `einstellungenExtra`, ohne Ball-Skala, ohne Gravitron-`umgekehrt`
  (Studio hat laut Kontext keinen Gravitron genannt), ohne Fotos. Gerät–Übung-Verknüpfung behalten (Fortschritt hängt dran).
  Hinweis: Überschrift "27 Geräte", Tabelle hat 30 – bereinigen.
- B: Beschwerden mit Region/Seite/Stärke/Status → V1 nur Freitext + Datum + aktiv/erledigt (A wertet ohnehin nicht aus).
  Taille + Taille/Größe-Ampel → V1.1 (optional, braucht nur 1 Feld; Ampel-Bänder vorher an NICE prüfen).
- G: Handmaß-System, Vorlagen aus mehreren Zutaten, "wie gestern" für einzelne Mahlzeiten, 30–40 Gerichte mit Tag-Filter,
  BLS → später. V1: Eingabe kcal+Eiweiß, Favoriten/Zuletzt, Shake, ~10 feste Vorschläge sortiert nach Eiweiß/kcal.
- G: Kalorienanpassung am Gewichtstrend → V1.1: braucht ohnehin ≥3 Wochen Daten; V1 zeigt nur Wochenmittel.
- H: Stichwortsuche im Freitext ("Niere") und uhrzeitabhängige Koffeinwarnung → streichen (widerspricht A/G: Freitext
  wird nicht ausgewertet). Fester Hinweistext reicht.
- E: Händigkeits-Einstellung, Ton per Web Audio, "Nicht anpassen" je Übung → später; Wake Lock + Endzeit-Timer behalten.

## 2. Widersprüche und Auflösung
- Feedback-Stufen: A = 4 Stufen (nicht geschafft/gerade so/passend/easy) = E Abschnitt 4. E "Offene Punkte" nennt aber
  "leicht/passend/schwer" → streichen, A-Wortlaut gilt. "Ohne Feedback": E-Vorschlag "nicht bewertet, zählt nicht" übernehmen.
- Muskelkater-Stufen: A 0–3 + 5 Gruppen; E kein/leicht/stark + 7 Regionen. → Auflösung: E's 3 Stufen (1 Tipp) und
  A's Regeln darauf abbilden: leicht = A-Stufe 1 (keine Wirkung), stark = A-Stufe 2 (kein Gewichtssprung, −1 Satz).
  A-Stufe 3 (Muster ersetzen) entfällt in V1. Regionen = A's 5 Gruppen (passen zu den 4 Mustern); "Po" → Beine, "Bauch" → Rumpf.
  Zeitfenster: E (12–72 h nach Training, 1 Frage) gilt.
- Gewichtsstufen C vs. A: A rechnet in "Stufe" und parallel "ca. −10 %" (Fehlschlag, Pause 15–28 Tage, Startgewicht 50 %/25 % KG).
  → Nur Stufen (C-Modell `stufen[]` + `zusatz[]`), nie Prozent. Zusatzgewicht: alle Kombinationen Stufe+Zusatz zu einer
  sortierten kg-Liste zusammenfassen, "+1 Stufe" = nächster Eintrag. A's Gerätefeld "Start/Schritt/Max" ist nur Eingabehilfe.
  E's "± 2,5/5 kg" = ±1 Eintrag dieser Liste.
- Wiegen B vs. G: B ≥4 Werte/7 Tage, G ≥3. → 4 nehmen (strenger, B begründet). B "täglich bis 3x/Woche" ist ok als Hinweis.
- Kalorienanpassung B vs. G: B "frühestens nach 2–3 Wochen", G "Vergleich mit vor 2 Wochen, max. 1x/14 Tage, ±150 kcal".
  → Erste Anpassung frühestens 21 Tage nach Start (und nach Kreatin-Beginn, s. u.); dann Vergleich Wochenmittel jetzt vs.
  vor 14 Tagen, ±150 kcal, nur mit Bestätigung, frühestens 14 Tage nach letzter Änderung. B's Wasser-Hinweis Einstieg + H's
  Kreatin-Wasser (1–2 kg) gehören in dieselbe Sperre.
- Barcode D vs. G/E: D plant Scan in V1, G/E später. → Später (s. 1). Keine Tastatur-Eingabe von Barcodes in V1 nötig.
- Alter B vs. G: G-Formel nutzt "Alter", B speichert Geburtsdatum. → B gilt; Alter zur Rechenzeit.
- Unverträglichkeiten B vs. G: B Freitext (Tags später), G Tags in V1. → bei nur ~10 Vorschlägen: Tags später.
- A in sich, nicht eindeutig programmierbar:
  - "max. 1 Gewichtsänderung pro Übung und Einheit" vs. "nicht geschafft → nächster Satz −1 Stufe" vs. "2. easy in Folge → +1 Stufe":
    nach +1 ist kein −1 mehr erlaubt. → Regel: Senken geht immer (Sicherheit), Erhöhen höchstens 1x je Einheit.
  - "Mehrheit easy/gerade so" bei 2 Sätzen (Gleichstand) undefiniert → "mindestens die Hälfte".
  - "gerade so → Ziel −1 Wdh." gilt nur Folgesatz oder auch nächste Einheit? → nur Folgesatz.
  - Sprung >10 %: "Obergrenze 15" + "nach Sprung 6–8 akzeptieren" vs. Grundregel "Wdh. zurück auf 8–9" → eine Zahl je Fall
    festlegen (z. B. Ziel nach Sprung = 6, Untergrenze für "verfehlt" = 6).
  - Abzüge stapeln sich (Woche 1: 2 Sätze, Kater −1, erschöpft −1 → 0 Sätze) → Untergrenze 1 Satz je Übung.
  - "2x hintereinander verfehlt" vs. "≥1 nicht geschafft → Fehlschlag-Regel": zählt "verfehlt" je Satz oder je Einheit? → je Einheit
    (Einheit verfehlt = mind. 1 Satz "nicht geschafft").
  - Deload "alle 6–8 Wochen" → feste Zahl (oder in V1 nur manuell anbieten).
  - Rumpf "Sekunden oder Wdh." → je Übung fest im Katalog (C `belastungsart`), Steigerung C: +10 s.

## 3. Quellen H (Stichproben per WebSearch, 23.11.2026)
- Kreider 2017, JISSN 14:18, DOI 10.1186/s12970-017-0173-z: existiert, Inhalt passt (keine Belege für Nierenschaden bei Gesunden,
  Erhalt 3–5 g/Tag). Ergänzen: Übersicht vom Council for Responsible Nutrition (Industrieverband) beauftragt und mitfinanziert.
  Vermutung, nicht geprüft: "bis 30 g/Tag über 5 Jahre" – nicht im Suchergebnis gesehen.
- Antonio 2021, JISSN 18:13, DOI 10.1186/s12970-021-00412-w: bestätigt (3–5 g/Tag oder 0,1 g/kg; Ladephase nicht nötig; Wasser,
  Niere behandelt). Teil II erschien 2025 – als Ergänzung aufnehmbar.
- Guest 2021 ISSN Koffein, JISSN 18:1, DOI 10.1186/s12970-020-00383-4: bestätigt (3–6 mg/kg, evtl. ab 2 mg/kg; 9 mg/kg viele
  Nebenwirkungen; Nutzen "klein bis moderat", nicht in allen Studien).
- EFSA 2015 Koffein, EFSA Journal 13(5):4102: bestätigt (200 mg Einzeldosis auch <2 h vor intensivem Sport, 400 mg/Tag, 100 mg
  können Schlaf stören).
- Grgic 2018, JISSN 15:11: bestätigt; Kraft SMD 0,20 (KI 0,03–0,36), Oberkörper 0,21 signifikant, Unterkörper 0,15 NICHT
  signifikant, Schnellkraft 0,17 grenzwertig; nur n = 46 gepoolt.
- BfR Ashwagandha: bestätigt als Mitteilung 39/2024 vom 10.09.2024 (Leberschäden inkl. akutes Leberversagen, keine sichere
  Menge ableitbar, Wechselwirkungen). Quelle trägt.
- VO (EU) 2022/2340: bestätigt (Tagesportion < 800 mg EGCG, Warnhinweis). Inkrafttretensdatum in Sekundärquellen uneinheitlich
  (12. vs. 22.12.2022) – nur "seit Dezember 2022" schreiben.
- Kreatin-Health-Claims: VO (EU) 2017/672 bestätigt (3 g/Tag + Krafttraining ≥3x/Woche, Erwachsene >55). Der Kontext-Nutzer
  ist laut Kontext nicht als >55 bekannt → in der App nur als Beleg "anerkannt", nicht als Zielaussage für ihn.
  Vermutung, nicht geprüft: Claim aus VO 432/2012 "Leistungssteigerung bei wiederholten kurzen Belastungen hoher Intensität,
  3 g/Tag" – Wortlaut nicht gefunden.
- Ausschlusslogik:
  - Koffein: Bedingung (b) "klar belegter Nutzen für Kraft/Muskelaufbau" ist NICHT erfüllt: kleiner akuter Effekt, Unterkörper
    nicht signifikant, kein Muskelaufbau, kleine Stichprobe. Gleichzeitig wird Beta-Alanin wegen (b) ausgeschlossen – inkonsistent.
    → Vorschlag: Koffein aus der Prüfliste in einen Vermerk "kleiner kurzfristiger Effekt, kein Muskelaufbau; Kaffee reicht;
    Abendtraining = Schlafrisiko" verschieben. Prüfliste V1 = nur Kreatin (+ Eiweißpulver-Bestätigung).
  - H-Kopfzeile "nur 2 erfüllen alles (… eingeschränkt Koffein)" widerspricht sich selbst.
  - Vitamin D und Magnesium stehen doppelt (Mangel-Block und Ausschlussliste) → nur einmal führen.
  - Viele Ausschlusszeilen nur "Vermutung, nicht geprüft" (Glutamin, Carnitin, Kollagen, Multivitamin, CLA, EAA). Für eine
    Ausschlussliste ok, wenn als "nicht geprüft" sichtbar; V1 kann die Liste auf die belegten Zeilen kürzen.

## 4. Quellen A und G (Kurzprüfung)
- Mifflin 1990, AJCN 51(2):241–247, DOI 10.1093/ajcn/51.2.241: bestätigt (498 Personen, 19–78 J., Formel +5 Männer). Trägt.
- ISSN Protein (Jäger 2017, JISSN 14:20, DOI 10.1186/s12970-017-0177-8): 1,4–2,0 g/kg bestätigt. Vermutung, nicht geprüft:
  2,3–3,1 g/kg bezieht sich auf Erhalt fettfreier Masse im Kaloriendefizit (Abstract im Suchergebnis abgeschnitten).
- Morton 2018 BJSM: von H mit DOI belegt; von mir nicht separat gesucht (Vermutung, nicht geprüft: 49 Studien/1863 Teiln.).
- Zourdos 2016, JSCR 30(1):267–275: bestätigt (29 Personen, 15 erfahren/14 Einsteiger; enger Zusammenhang r = −0,88 für
  Erfahrene). Vermutung, nicht geprüft: schwächerer Zusammenhang bei Einsteigern – stützt A's "Wdh. zusätzlich zählen".
- Helms 2016, Strength Cond J: Existenz bestätigt (Praxisartikel, keine Studie – als "Anwendungshinweis" zitieren).
- A [Q2] "ACSM Position Stand 2026" nur aus Pressetext → vor Bau Originalartikel prüfen oder auf ACSM 2009/WHO 2020 stützen.

## 5. Vor dem Bau am Original prüfen (D/E)
- WebKit 7-Tage-Regel: Bestätigt per Suche (Bug 237350, Kommentar Wilander): für die Hauptdomain einer Home-Bildschirm-App
  sollen HTML-Speicher (IndexedDB/localStorage) nicht gelöscht werden; Home-Apps haben eigenen Tageszähler. Es gibt aber
  Entwicklerberichte (2022) über Verlust trotzdem; keine aktuelle offizielle WebKit-Doku gefunden. → Backup-Erinnerung bleibt Pflicht.
- Wake Lock: bestätigt – Safari-18.4-Versionshinweise "Fixed Wake Lock API for Home Screen Web Apps" (iOS 18.4, 31.03.2025);
  Bug 254545 RESOLVED FIXED. Neuanforderung nach App-Wechsel (Bug 255363): Vermutung, nicht geprüft.
- Open Food Facts CORS: NICHT bestätigt. Suche ohne Ergebnis; eigener curl-Test vom Proxy dieser Sitzung blockiert (403).
  Vermutung, nicht geprüft: Lesezugriff aus dem Browser geht (offizielles JS-SDK nutzt fetch). → Einmal am iPhone testen,
  bevor OFF eingeplant wird (bestärkt: OFF nicht in V1).
- BarcodeDetector-Stand iOS 26/27 (D): Vermutung, nicht geprüft (nicht gesucht; für V1 irrelevant nach Verschiebung).
- Getrennter Speicher Safari-Tab vs. Home-App (D): Vermutung, nicht geprüft – am Gerät testen, Hinweis im Einstieg.

Quellen der Websuche: pubmed 28615996, PMC7871530, PMC7777221, pubmed 29527137, efsa.europa.eu/en/efsajournal/pub/4102,
eur-lex.europa.eu/eli/reg/2022/2340, eur-lex.europa.eu/eli/reg_impl/2017/672, mobil.bfr.bund.de (Ashwagandha-PDF),
pubmed 28642676, bugs.webkit.org 237350 und 254545, developer.apple.com Safari 18.4 Release Notes, openrepository.aut.ac.nz (Zourdos).
