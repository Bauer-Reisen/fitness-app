# G – Ernährung (Planung, Agent G)

Hinweis: Mehrere Primärseiten (openfoodfacts.github.io, support.openfoodfacts.org, pubmed, heise.de,
world.openfoodfacts.org) waren aus dieser Sitzung nicht erreichbar (Netzwerksperre). Fakten unten stammen aus
Suchergebnissen; was nicht bestätigt ist, ist als "Vermutung, nicht geprüft:" gekennzeichnet.

## 1. Bedarfsberechnung
- **Grundumsatz: Mifflin-St Jeor** (Mann): `10 × kg + 6,25 × cm − 5 × Alter + 5`.
  Quelle: Mifflin et al., Am J Clin Nutr 1990;51(2):241–247, doi 10.1093/ajcn/51.2.241 (498 gesunde Erwachsene,
  19–78 J.). Begründung: einfach, nur Gewicht/Größe/Alter nötig, die die App ohnehin hat.
- **Alltagsfaktor OHNE Training** (Auswahl in 3 Stufen, Text statt Zahl zeigen):
  überwiegend sitzend 1,4 / teils gehend-stehend 1,6 / körperlich arbeitend 1,8.
  Vermutung, nicht geprüft: Stufen angelehnt an die PAL-Werte der DGE-Referenzwerte (Energie); vor Umsetzung gegen
  DGE-Tabelle prüfen. Wichtig: Faktor beschreibt nur den Alltag, Sport ausdrücklich NICHT einrechnen.
- **Pausentag** = Grundumsatz × Alltagsfaktor.
- **Trainingstag** = Pausentag + Trainingszuschlag (kein pauschal höherer Faktor).
  Zuschlag = (MET − 1) × kg × Stunden. "−1", weil der Ruheverbrauch im Grundbedarf schon steckt
  → keine Doppelzählung. Dauer kommt aus dem erfassten Training (sonst Standard 60 min).
  MET-Werte aus dem "Compendium of Physical Activities" (Ainsworth et al.).
  Vermutung, nicht geprüft: Gerätetraining moderat ≈ 3,5–5 MET, Ergometer/Air Bike moderat ≈ 7 MET.
  Beispiel 80 kg, 60 min, 4 MET → +240 kcal. Grob genug; mehr Genauigkeit ist ohne Messung nicht erreichbar.
- Regel gegen Doppelzählung: keine Schrittzähler-/Uhrdaten zusätzlich addieren (V1 ohnehin nicht vorhanden).
- **Eiweiß** an Trainings- und Pausentagen gleich (Bedarf hängt am Körpergewicht, nicht am Tag); der Mehrbedarf
  am Trainingstag geht in kcal. Vermutung, nicht geprüft: gängige Praxis, keine Fachgesellschaft dazu gefunden.
- Anzeige gerundet auf 50 kcal und 5 g Eiweiß – vermeidet Scheingenauigkeit.

## 2. Ziele Aufbau / Halten / Abnehmen
| Ziel | kcal | Eiweiß g/kg/Tag |
|---|---|---|
| Halten | ±0 | 1,6 |
| Aufbau | +10 % (ca. +250 kcal) | 1,6–2,0 (Standard 1,8) |
| Abnehmen | −20 % (höchstens −500 kcal) | 2,0 (einstellbar bis 2,4) |
- Quellen Eiweiß:
  - ISSN Position Stand "Protein and exercise", Jäger et al., J Int Soc Sports Nutr 2017;14:20:
    1,4–2,0 g/kg/Tag reichen für die meisten Trainierenden zum Aufbau und Erhalt von Muskulatur;
    höhere Mengen (2,3–3,1 g/kg) können in bestimmten Lagen nötig sein.
    Vermutung, nicht geprüft: Der Satz mit 2,3–3,1 g/kg bezieht sich auf Kaloriendefizit bei Trainierten
    (Abstract-Ende im Suchergebnis abgeschnitten) – deshalb im Defizit Standard 2,0, nicht höher.
  - Morton et al., Br J Sports Med 2018;52(6):376–384 (49 Studien, 1863 Teilnehmer): oberhalb ~1,62 g/kg/Tag
    Gesamteiweiß kein weiterer Zuwachs an fettfreier Masse → 1,6 als vernünftiger Standard.
  - DGE: 0,8 g/kg/Tag empfohlene Zufuhr für 19 bis <65 J.; ab 65 J. Schätzwert 1,0 g/kg (DGE-Pressemeldung
    08/2017; DGE-FAQ Protein 2021). Als **Untergrenze** anzeigen ("Grundbedarf laut DGE"), nie darunter.
- Quelle kcal-Abschlag: Helms, Aragon, Fitschen, J Int Soc Sports Nutr 2014;11:20.
  Vermutung, nicht geprüft: Empfehlung dort ≈ 0,5–1 % Körpergewicht Abnahme pro Woche. App zielt auf 0,5 %/Woche.
  Aufbau +10 %: Vermutung, nicht geprüft (übliche Praxis für langsamen Aufbau, Quelle nicht verifiziert).
- Vermutung, nicht geprüft: bei deutlichem Übergewicht Eiweiß nicht auf volles Gewicht rechnen, sondern auf
  Zielgewicht – sonst unrealistische Mengen. V1: Feld "Eiweiß rechnen mit kg = …" (Vorgabe aktuelles Gewicht).

## 3. Anpassung nach Gewichtsverlauf (V1, einfach)
- Wochenmittel = Mittel aller Wiegungen der letzten 7 Tage (mind. 3 Werte, sonst keine Aussage).
- Vergleich Wochenmittel jetzt vs. vor 2 Wochen. Erwartung: Abnehmen −0,5 %/Woche, Halten ±0,25 %,
  Aufbau +0,25 %/Woche (Vermutung, nicht geprüft: Aufbau-Rate übliche Praxis).
- Weicht es ab: **Vorschlag** ±150 kcal/Tag, Nutzer bestätigt per Tipp. Höchstens eine Änderung pro 14 Tage
  (Wasserschwankungen). Vermutung, nicht geprüft: 150 kcal ist ein vorsichtiger Schritt; 7700-kcal-pro-kg-Regel
  nur grob gültig, daher keine Rückrechnung, sondern kleine Schritte.
- Keine automatische Änderung ohne Bestätigung; Untergrenze kcal = Grundumsatz (nie darunter vorschlagen).

## 4. Eiweißpulver
- Einstellungen: Name, g Pulver pro Portion, g Eiweiß pro Portion, kcal pro Portion (vom Etikett abschreiben;
  Vorgabe leer, nicht raten). Optional mehrere Pulver.
- Startseite Ernährung: großer Knopf "+1 Shake" (Zeitstempel heute). Langer Druck/Menü: ½ oder 2 Portionen,
  Rückgängig. Zählt voll zu Eiweiß und kcal. Milch als Flüssigkeit optional als eigener Favorit ("Shake mit Milch").

## 5. Essenserfassung – Stufen
| Stufe | Aufwand | Genauigkeit | V1? |
|---|---|---|---|
| A: nur Eiweiß + kcal grob eintippen (oder Schnellwahl S/M/L-Mahlzeit) | sehr gering | grob | **V1** |
| B: Handmaß (Handfläche Eiweiß, Faust Beilage, Daumen Fett) | gering | mittel | **V1** als Portionsgröße bei Listen-Lebensmitteln |
| C: Gramm wiegen | hoch | gut | später/optional (Feld existiert, nicht Pflicht) |
- Handmaß: Vermutung, nicht geprüft: Precision Nutrition "Hand Portion"-System; 1 Handfläche ≈ 20–30 g Eiweiß
  bei Männern. Nur als Schätzhilfe kennzeichnen.
- Weniger-Aufwand-Funktionen (alle V1, reine Lokaldaten): **Favoriten** (Stern), **"wie gestern"** (kopiert
  eine oder alle Mahlzeiten von gestern), **eigene Mahlzeit als Vorlage** (mehrere Zutaten → ein Eintrag),
  zuletzt verwendet oben. Tagesanzeige: zwei Balken Eiweiß/kcal mit "noch X g / Y kcal".

## 6. Nährwertdaten ohne eigenen Server
- **Open Food Facts (OFF)**
  - Lizenz: Datenbank ODbL, Einzelinhalte Database Contents License, Fotos CC BY-SA (wiki.openfoodfacts.org/ODBL_License,
    OFF-Seiten "data"/"legal"). Pflicht: Namensnennung "Daten: Open Food Facts, ODbL"; abgeleitete Datenbank
    teilen (Share-Alike) – für lokalen Zwischenspeicher einzelner Produkte unkritisch.
    Vermutung, nicht geprüft: Cache im Gerät gilt nicht als veröffentlichte abgeleitete Datenbank.
  - Barcode: `GET https://world.openfoodfacts.org/api/v2/product/{barcode}.json?fields=product_name,nutriments,serving_size`
    (API v2; v3 existiert ebenfalls). Suche nur über v2 `/api/v2/search` (offizielle Doku, Feature-Tabelle).
  - Grenzen: offiziell 100 Anfragen/min für Produktabfragen, bei Überschreitung HTTP 503; bei Apps zählen die
    Grenzen pro Nutzer. Suche: Vermutung, nicht geprüft: 10/min (nur Drittquellen). Eigener User-Agent
    verlangt (OFF-Support-FAQ) – im Browser kann man den User-Agent-Header aber nicht setzen.
    Vermutung, nicht geprüft: OFF akzeptiert dann den Parameter/Header `app_name` bzw. Browser-Aufrufe ohne UA.
  - CORS: **nicht geprüft** (Test aus dieser Sitzung blockiert). Vermutung, nicht geprüft: Lesezugriffe erlauben
    Browser-Aufrufe (es gibt ein offizielles JS-SDK openfoodfacts-js, das mit fetch arbeitet). Vor Bau prüfen.
  - Datenqualität DE: Vermutung, nicht geprüft: gut bei großen Marken/Discounter-Eigenmarken, Lücken bei
    regionalen Produkten; Nährwerte sind Nutzereingaben → Plausibilitätsprüfung (kcal ≈ 4·E + 4·KH + 9·F ±15 %).
  - Offline: nein (nur bereits abgefragte Produkte aus lokalem Speicher).
  - Barcode-Scan: Vermutung, nicht geprüft: Safari/iOS hat keine BarcodeDetector-API → Bibliothek (z. B. ZXing)
    nötig; daher V1 Barcode per Eintippen, Kamera später.
- **BLS 4.0 (Bundeslebensmittelschlüssel, Max Rubner-Institut)**: seit 16.12.2025 kostenfrei, ~7.140 Lebensmittel,
  bis 138 Nährstoffe (heise, ZHAW, agrolab-Meldungen). **Konkrete Lizenz (Weitergabe in eigener App erlaubt?)
  nicht gefunden** → vor Nutzung Nutzungsbedingungen auf blsdb.de/mri.bund.de prüfen. Falls Weitergabe erlaubt:
  bester Lieferant für die lokale Grundliste (deutsche, generische Lebensmittel, offline).
- **USDA FoodData Central**: API-Schlüssel nötig (kostenlos); 1.000 Anfragen/h; Schlüssel, die öffentlich
  (z. B. im GitHub-Repo) auftauchen, werden deaktiviert → bei reiner GitHub-Pages-App ungeeignet. Daten
  Vermutung, nicht geprüft: CC0 (nur Drittquelle). Englisch, US-Produkte → nur als Quelle für eine einmal
  erzeugte lokale Liste denkbar, nicht als Live-API.
- **Lokale Grundliste (V1)**: ~80–150 generische Lebensmittel als JSON in der App (Quark, Skyr, Hähnchen, Eier,
  Thunfisch, Linsen, Haferflocken, Reis, Brot …) mit kcal/Eiweiß pro 100 g und pro Handmaß-Portion. Offline,
  keine Rate-Limits, kein Lizenzrisiko, wenn Werte aus geprüfter Quelle (BLS nach Lizenzprüfung) mit Quellenfeld.

## 7. Mahlzeitvorschläge (regelbasiert, keine KI)
- Kuratierte Liste ~30–40 Alltagsgerichte/Snacks (z. B. Skyr mit Haferflocken, Rührei mit Brot, Thunfisch-Wrap,
  Linsen-Bowl), je mit kcal, Eiweiß, Zubereitungszeit, Tags.
- **Unverträglichkeiten als Auswahl-Tags** statt Freitext: laktosefrei, glutenfrei, ohne Nüsse, ohne Ei, ohne Fisch,
  ohne Soja, vegetarisch, vegan. Begründung: Freitext ist ohne KI nicht zuverlässig auswertbar. Freitext bleibt
  zusätzlich als Notiz (Körperdaten-Bereich), wirkt aber nicht auf den Filter.
  Vermutung, nicht geprüft: Tag-Auswahl orientiert an den 14 EU-Hauptallergenen (LMIV Anhang II).
- Regel: (1) alle Gerichte mit ausgeschlossenen Tags raus; (2) nur Gerichte mit kcal ≤ verbleibend + 10 %;
  (3) sortieren nach Eiweiß pro 100 kcal, wenn noch viel Eiweiß fehlt, sonst nach Passung zu kcal; (4) 3 Vorschläge.
- Vorschlag per Tipp als Mahlzeit übernehmen.

## 8. Umfang
**Version 1**
- Profilwerte → Grundumsatz, Alltagsfaktor, Ziel; Tagesziel kcal/Eiweiß mit Trainingstag-Zuschlag
  (Trainingstag = an dem Tag ein Training erfasst; Zuschlag erscheint automatisch).
- Shake-Knopf, Erfassung Stufe A + Grundliste mit Handmaß, Favoriten, "wie gestern", Vorlagen.
- Wochenmittel Gewicht + Anpassungsvorschlag (mit Bestätigung).
- 30–40 kuratierte Vorschläge mit Tag-Filter.
- Quellenangaben in einer "Wie wird gerechnet?"-Seite; Hinweis "keine medizinische Beratung".
**Später**
- Open Food Facts: Barcode eintippen/scannen, Ergebnis lokal speichern (nach CORS-Test).
- Gramm-genaue Erfassung, Fett/Kohlenhydrate, Mahlzeiten-Zeitpunkt/Eiweißverteilung über den Tag.
- BLS-basierte größere Offline-Liste (nach Lizenzprüfung).
- Eigene MET-Werte je Übung/Gerät, Schätzung aus Trainingsvolumen.

## Offene Prüfpunkte vor dem Bau
1. BLS-4.0-Nutzungsbedingungen (Weitergabe in App?). 2. OFF: CORS + Umgang mit User-Agent im Browser.
3. DGE-PAL-Stufen. 4. MET-Werte im Compendium. 5. Helms 2014 Volltext (Abnahmerate), ISSN 2017 Satz zu 2,3–3,1 g/kg.
