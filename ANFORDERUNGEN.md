# Fitness-App – Anforderungen

Stand: 23.11.2026. Planung, noch nichts gebaut.
Grundlage: Berichte der Agenten A–H in [`planung/grundlagen/`](planung/grundlagen/) (F = Kritik), Runde 2: I (Training bei Gelenkerkrankungen), J (Gesundheitsabfrage, Startprofil), F2 (Kritik). Bei Widersprüchen gilt die Auflösung von F bzw. F2, sofern unten nicht anders vermerkt.
Persönliche Gesundheitsangaben stehen nie im Repository, nur im Gerät.
Kennzeichnung: **(ungeprüft)** = Faustregel oder Fakt ohne geprüfte Quelle; vor dem Bau bzw. im Test bestätigen.

Rahmen: reine Web-App (HTML/CSS/JS) auf GitHub Pages, zum Home-Bildschirm hinzugefügt, ohne Server, ohne Anmeldung, ohne laufende Kosten, ohne KI-Schnittstellen. Alle Daten bleiben im iPhone. Training im Studio ohne freie Gewichte.

---

## 1. Funktionsliste

### Version 1

**Start „Heute“**
- Ein Satz zur Lage („Heute: Training – 5 Übungen, ca. 45 Min.“ oder „Ruhetag empfohlen“), ein großer Knopf „Training starten“ bzw. „Training fortsetzen“.
- Darunter: Eiweiß und kcal heute (Ist/Ziel), Knopf „+ Shake“.
- Karte „Wie geht's nach dem Training?“ (Muskelkater-Abfrage), wenn fällig.
- Banner „Backup machen“, wenn fällig.

**Training**
- Ganzkörperplan aus den 4 Mustern Drücken, Ziehen, Beine, Rumpf; nur Übungen an Geräten, die im eigenen Katalog als vorhanden markiert sind.
- Ablauf als feste Schrittfolge: Aufwärmen → Übung → Satz → Pause → … → Abschluss.
- Satz eintragen mit 1 Tipp: Gewicht und Wiederholungen sind vorbelegt; der Tipp auf eine der 4 Feedback-Stufen speichert den Satz und startet die Pause.
- Feedback-Stufen: **easy · passend · gerade so · nicht geschafft**. Abweichende Wiederholungen/Gewicht per Plus/Minus, „Rückgängig“ 5 s lang.
- Sichtbare Rückmeldung, was die App aus dem Feedback macht: in der Pause („Nächster Satz: 8 Wdh. statt 10“), nach der Übung („Nächstes Mal: 40 kg, +1 Stufe – weil 2× alles passend“), auf dem Abschluss-Bildschirm als Liste.
- Pausentimer über gespeicherte Endzeit (läuft auch nach Bildschirm aus richtig weiter), „+30 s“, „Überspringen“.
- Bildschirm wach halten (Wake Lock, ab iOS 18.4 in Home-Bildschirm-Apps), abschaltbar; fehlt die Funktion, wird still darauf verzichtet.
- Geräte-Einstellungen (Sitzhöhe, Lehne, Griff) beim Satz sichtbar, mit einem Tipp änderbar.
- Jeder Satz wird sofort gespeichert; „Training fortsetzen?“ nach Unterbrechung; nach 4 h automatisch beendet.
- Übung „später“ (Gerät besetzt).
- Knopf „Schmerz“ beim Satz (klein, neben den 4 Feedback-Knöpfen), danach Auswahl **„geht noch“** (bekanntes Gelenk; Satz zählt, keine Erhöhung) oder **„zu viel / neu“** (Übung beenden, Alternative oder kleinerer Bewegungsumfang). Ohne Tipp bleibt es bei 1 Tipp je Satz.
- **Nachträgliches Feedback:** beim ersten Öffnen 12–72 h nach einem Training eine Karte „kein · leicht · stark · überspringen“ (Muskelkater), bei leicht/stark optional Muskelgruppen antippen; zusätzlich „Gelenk schlechter als sonst“ (wenn ein Gelenk eingetragen ist) bzw. „Schmerz, nicht Muskelkater“. Ohne Tipp = wie sonst. Höchstens 1 Karte je Training, abschaltbar.
- **Förderblock** bei eingetragener Hüft- oder Daumen/Hand-Einschränkung: gezielte Übungen für Kraft, Beweglichkeit und Kontrolle (Abschnitt 1c), eigene Steigerung; dazu eine 5-Minuten-Mobilitätseinheit nach dem Aufwärmen und ein 3–4-Minuten-Handprogramm (als Text).
- Steigerung, Entlastung und Wiedereinstieg nach Pausen automatisch nach den Regeln in Abschnitt 1a; Gelenkregeln nach Abschnitt 1c.

**Gesundheitsabfrage und Startprofil** (vor dem ersten Training, ca. 2 Min.)
- Teil A: 5 Ja/Nein-Fragen zu Warnzeichen (Herz/Blutdruck, Brustschmerz, Schwindel/Bewusstlosigkeit, Stoffwechsel-/Nierenerkrankung, Atemnot/Herzrasen), eigene Formulierung angelehnt an PAR-Q+ und das ACSM-Screening (Riebe et al. 2015). Ein „ja“ → Hinweis „vor dem Training ärztlich abklären“; Knöpfe „abgeklärt“ oder „trotzdem fortfahren“; keine Sperre, keine Auswertung.
- Teil B (Auswahl): Körperstelle (Hüfte, Daumen/Hand, Knie, Schulter, Rücken, sonstige) × Seite × Art (Arthrose · Gelenkersatz mit OP-Monat · OP geplant mit Monat · akut · sonstiges); „Gibt es ärztliche oder physiotherapeutische Vorgaben?“ mit Häkchen (Abschnitt 1c) und Freitext. Freitext wird nur angezeigt.
- Teil C: Erfahrung je Muster (Drücken, Ziehen, Beine, Rumpf): neu · früher regelmäßig · aktuell regelmäßig; Ausdauer locker am Stück (< 10 · 10–30 · 30–60 · > 60 Min.) als Info.
- Erneut fragen: Karte „Alles gleich?“ alle 3 Monate (eigene Wahl); außerdem wenn der angegebene OP-Monat erreicht ist („Ist die OP erfolgt?“), nach mehr als 28 Tagen Pause und nach 2× „zu viel“ an derselben Übung oder im selben Muster innerhalb von 14 Tagen. Nie am selben Tag wie die Muskelkater-Karte.
- Hinweis beim Backup: „Die Datei enthält Gesundheitsangaben.“ Knopf „Gesundheitsangaben löschen“.

**Gerätekatalog**
- 30 Vorlagen (Maschinen, Seilzug, Klimmzugstange, Dipstangen, Hyperextension-Bank, Boden, Medizin-/Gewichtsball, 5 Ausdauergeräte) mit Alternativnamen und zugeordneten Übungen (Tabelle in [`planung/grundlagen/C.md`](planung/grundlagen/C.md)). Abhaken „im Studio vorhanden“.
- Eigenes Gerät: Pflicht nur Name, Muster, Belastungsart; oder „wie Gerät X“ kopieren.
- Gewichtsstufen je Gerät als Liste (aus Start/Schritt/Max erzeugt oder frei eingegeben), Anzeige wie am Gerät („35 kg“ oder „Platte 7“).

**Körperdaten**
- Profil: Geburtsdatum, Geschlecht, Größe, Alltags-Aktivität (3 Stufen), Ziel (Aufbau/Halten/Abnehmen).
- Gewicht mit Verlauf; Hauptzahl ist der 7-Tage-Mittelwert (mind. 4 Wiegungen in 7 Tagen, sonst „zu wenig Daten“). Kurze Messanleitung (morgens, nach Toilette, vor Essen, gleiche Waage).
- Taillenumfang (Messstelle nach WHO: Mitte zwischen unterster Rippe und Beckenkamm, nach dem Ausatmen), Verlauf; Erinnerung alle 2–4 Wochen.
- Weitere Umfänge (Brust, Oberarm, Oberschenkel) als optionale Messarten im gleichen Verlauf, ohne Einfluss auf Berechnungen.
- Einschränkungen aus Teil B der Gesundheitsabfrage (aktiv/erledigt), im Training oben angezeigt; ausgewertet werden nur die Auswahlfelder (Abschnitt 1c), nicht der Freitext.
- Freitext „Unverträglichkeiten“ mit Datum und Status aktiv/erledigt.

**Ernährung**
- Tagesziel kcal und Eiweiß aus Profil, Gewicht (7-Tage-Mittel), Ziel und Training (Regeln in Abschnitt 1b); Trainingstag mit Zuschlag, Pausentag ohne.
- „+ Shake“: Eiweißpulver-Portion einmal einstellen (g Pulver, g Eiweiß, kcal vom Etikett), dann 1 Tipp.
- Schnelleingabe: Name (optional) + kcal + Eiweiß; Listen „Zuletzt“ und „Favoriten“ (1 Tipp fügt hinzu, Portion ½/1/1½).
- Lokale Grundliste mit ca. 80 generischen Lebensmitteln (kcal/Eiweiß je 100 g und je üblicher Portion), offline.
- Ca. 10–15 feste Mahlzeitvorschläge (alltagstauglich, mit kcal/Eiweiß), sortiert nach dem, was heute noch fehlt; per Tipp übernehmen.
- Seite „Wie wird gerechnet?“ mit Formeln und Quellen; Hinweis „keine medizinische Beratung“.

**Supplements**
- Statische Prüfliste (Abschnitt 3) mit Nutzen, Dosis, Risiken, Ausschlussgründen, Quellen, Stand-Datum; Ausschlussliste aufklappbar. Die App schlägt nichts von sich aus vor; der Nutzer kann einen Eintrag als „nehme ich“ markieren.

**Daten**
- Speicher IndexedDB; App nur vom Home-Bildschirm nutzen (dort keine 7-Tage-Löschung; Hinweis beim Einstieg).
- Backup: Export als JSON-Datei über das Teilen-Menü, Import ersetzt nach Rückfrage alle Daten; Formatnummer wird geprüft.
- Backup-Erinnerung: über 14 Tage seit dem letzten Backup und neue Einträge seitdem.
- Vollständig offline nutzbar.

### Später
- Training: zwei Plan-Varianten im Wechsel (A/B), Oberkörper/Unterkörper-Split ab ca. 4 Trainings pro Woche, Klimmzug-/Dip-Leiter (Negative → volle Wdh.), automatisches Deload, Übungstausch bei Stagnation, Testsätze zum Finden des Startgewichts, Aufwärmsatz-Berechnung, Supersätze, Ausführungsbilder, Ton beim Pausenende, Händigkeit.
- Muskelkater 4 Stufen mit „Muster ersetzen“, Tagesform-Abfrage vor dem Training.
- Gelenke: Freitext-Stichwortsuche, die passende Einschränkungen zum Bestätigen vorschlägt (Liste in `planung/grundlagen/J.md`); schnellere Steigerung bei früherer Erfahrung bis zum früheren Niveau; Zughilfen und Orthese als „habe ich“ mit Wirkung; Schmerz 0–10 im Alltag mit Verlauf; Seitentrennung bei einbeinigen Übungen; gespeicherte Anschläge je Gerät („Beinpresse ab Loch 5“); Gummiband/Knetball als Hilfsmittel mit Stufen; Funktionstests als Verlauf (30-Sekunden-Aufstehen, Einbeinstand); Ausführungsbilder. Lokales Sprachmodell für Freitext: geprüft, nicht vorgesehen (Aufwand, iPhone-Speicher).
- Gerätekatalog als Datei an einen zweiten Nutzer weitergeben (ohne Gesundheits- und Trainingsdaten).
- Körper: Taille/Größe-Hinweis (NICE: ab 0,5 erhöht) und Taillen-Grenzwerte (WHO: Männer ab 94 / 102 cm) als neutraler Hinweis; Fotos.
- Ernährung: Kalorienziel am Gewichtstrend nachjustieren (Regel steht schon fest, Abschnitt 1b); Barcode-Scan mit Open Food Facts; größere Lebensmittelliste aus dem Bundeslebensmittelschlüssel (BLS 4.0, Lizenz klären); Unverträglichkeiten als Filter-Tags; Handmaß-Portionen; Mahlzeit-Vorlagen aus mehreren Zutaten; Fett/Kohlenhydrate.
- Daten: Zusammenführen beim Import, Schema-Migration (sobald es Version 2 gibt), mehrere Profile auf einem Gerät, Gerätekatalog an andere weitergeben, mehrere Studios.
- Supplements: Kreatin als tägliches Abhaken.

---

## 1a. Trainingsregeln Version 1

Quellen: ACSM Position Stand 2009 (Progression Models), WHO-Leitlinien 2020, Schoenfeld et al. 2016/2019 (Frequenz), Zourdos et al. 2016 und Helms et al. 2016 (Wiederholungen in Reserve), Bosquet et al. 2013 (Pausen), Cheung et al. 2003 (Muskelkater). Konkrete Schwellenwerte sind praxisübliche Faustregeln **(ungeprüft)**. Gewichte werden **nur in Gerätestufen** gerechnet, nie in Prozent. Bei Stufe + Zusatzgewicht bilden alle Kombinationen eine sortierte Liste; „+1 Stufe“ ist der nächste Eintrag.

| Thema | Regel |
|---|---|
| Plan | Ganzkörper: je 1 Übung Drücken, Ziehen, Beine, Rumpf, danach Förderblock (Abschnitt 1c) bzw. ohne Einschränkungen optional 1 Zusatzübung. Je Muster eine Prioritätsliste; Auswahl nach Abschnitt 1c (Filter), sonst erste Übung mit vorhandenem Gerät, mehrgelenkig vor eingelenkig. |
| Einstieg | Je Übung ein Einstieg (`einstiegBis`) nach Erfahrung im Muster: neu 14 Tage · früher 7 Tage · aktuell keiner. Im Einstieg 2 Sätze, Ziel 10–12 Wdh., bewusst leicht; danach 3 Sätze. Gelenkeinträge verlängern den Einstieg nicht; gebremst wird über das Feedback (Entscheidung des Nutzers, 25.11.2026). Eine Ersatzübung übernimmt den Einstieg des Musters. Startstufe gibt der Nutzer ein (Vorschlag: kleinste Stufe, bei „früher“/„aktuell“ frei); ab Satz 2 korrigiert die Feedback-Regel. Steigerung immer nach den Regeln unten (Wiedereinstieg geht schneller als Neuanfang: Bosquet et al. 2013, Blocquiaux et al. 2020 – das erledigt die Feedback-Schleife ohne Sonderregel). |
| Bereich | Maschinen 8–12 Wdh. Rumpf je Übung fest: Zeit 20–60 s (Steigerung +10 s) oder 10–15 Wdh. Körpergewicht: Steigerung über Wdh. |
| Feedback-Stufen | easy = ≥ 4 Wdh. wären noch gegangen · passend = 2–3 · gerade so = 0–1 · nicht geschafft = Ziel verfehlt. Satz ohne Feedback = „nicht bewertet“, zählt nicht für Steigerung. |
| Im selben Training (Folgesatz) | easy → +2 Wdh. (höchstens Obergrenze); 2. easy in Folge → +1 Stufe. passend → gleich. gerade so → Ziel −1 Wdh. nicht geschafft → −1 Stufe. Senken ist immer erlaubt, Erhöhen höchstens 1× je Übung und Training. |
| Nächstes Training | Ein Training gilt als „erfüllt“, wenn alle Sätze die Obergrenze erreichen und mindestens passend sind. 2 erfüllte Trainings in Folge → +1 Stufe, Ziel zurück auf 8. Mindestens die Hälfte der Sätze easy in 2 Trainings in Folge → +1 Stufe. Einzelnes easy → Ziel +1 Wdh., kein Gewichtssprung. |
| Fehlschlag | Ein Training gilt als „verfehlt“, wenn mindestens 1 Satz nicht geschafft ist. 1× verfehlt → gleiches Gewicht. 2× in Folge → −1 Stufe, Ziel 10. |
| Großer Sprung | Ist die nächste Stufe mehr als 10 % schwerer: Obergrenze 15 statt 12, nach dem Sprung Ziel und Untergrenze 6. |
| Pausen | Tage seit letztem Training: ≤ 7 normal · 8–14 keine Steigerung, Ziel −2 Wdh. · 15–28 −1 Stufe und 2 Sätze für ein Training · > 28 −2 Stufen und Einstieg (2 Sätze) für 7 Tage. Ab 8 Tagen Pause beginnt die Zählung „in Folge“ neu. |
| Kurzer Abstand | Weniger als 48 h seit dem letzten Training: „Ruhetag empfohlen“; wird trotzdem trainiert, keine Erhöhung und −1 Satz je Übung **(ungeprüft)**. |
| Muskelkater | Muskelgruppen: Brust/Schulter, Rücken, Arme, Beine, Rumpf. leicht → keine Wirkung. stark → Übungen dieser Gruppe ohne Erhöhung, −1 Satz. Muskelkater zählt nie als Fehlschlag. |
| Schmerz | Schmerzmeldungen senken oder halten nur, nie erhöhen (Einzelheiten Abschnitt 1c). Bei „zu viel / neu“ und „Schmerz, nicht Muskelkater“ zusätzlich Hinweis „ärztlich oder physiotherapeutisch abklären“. Feste Zeile: „Bei Schmerz, Schwindel, Brustdruck abbrechen.“ |
| Untergrenze | Abzüge stapeln sich höchstens bis 1 Satz je Übung. |
| Entlastung | Kein automatisches Deload. Nach 2 verfehlten Trainings in Folge mit mindestens 2 betroffenen Übungen bietet die App eine leichte Woche an (Sätze halbieren). |
| Aufwärmen | 5–8 Min. Laufband, Ergometer, Air Bike oder Rudergerät locker; Dauer optional erfassen. |
| Oberste Stufe erreicht | Hinweis „mehr Wdh. oder einarmig/einbeinig“. |

## 1b. Ernährungsregeln Version 1

- Grundumsatz Mifflin-St Jeor (Mifflin et al. 1990, Am J Clin Nutr 51:241), Mann: 10 × kg + 6,25 × cm − 5 × Alter + 5. Gewicht = 7-Tage-Mittel, Alter aus Geburtsdatum.
- Pausentag = Grundumsatz × Alltagsfaktor (sitzend 1,4 · teils gehend 1,6 · körperlich arbeitend 1,8; Sport nicht eingerechnet). Stufen an den PAL-Werten der DGE ausrichten **(ungeprüft)**.
- Trainingstag = Pausentag + (MET − 1) × kg × Stunden; Dauer aus dem erfassten Training, sonst 60 Min.; MET für Gerätetraining ca. 5 **(ungeprüft, im Compendium of Physical Activities nachsehen)**. Ein Tag gilt als Trainingstag, sobald ein Training gestartet ist oder der Nutzer „heute trainiere ich noch“ antippt.
- Ziele: **Fett ab, Muskeln auf (Rekomposition, Standard)** −10 % (höchstens −300 kcal), 2,0 g Eiweiß/kg – gleichzeitiger Fettabbau und Muskelaufbau ist auch bei Trainierten belegt (Barakat et al. 2020, Strength Cond J 42(5):7–21; die Prozentwerte sind übliche Praxis **(ungeprüft)**); Erfolg zeigt sich an etwa gleichem Gewicht und schmalerer Taille · Halten ±0 kcal, 1,6 g Eiweiß/kg · Aufbau +10 %, 1,8 g/kg · Abnehmen −20 % (höchstens −500 kcal), 2,0 g/kg. Eiweiß: ISSN Position Stand Jäger et al. 2017 (1,4–2,0 g/kg), Morton et al. 2018 (Nutzen flacht ab ca. 1,6 g/kg ab). Untergrenze DGE 0,8 g/kg. Die Prozentwerte für kcal sind übliche Praxis **(ungeprüft)**.
- Eiweiß an Trainings- und Pausentagen gleich; der Unterschied liegt bei den kcal.
- Rundung auf 50 kcal und 5 g Eiweiß. Untergrenze kcal = Grundumsatz.
- Später, Nachjustieren: erste Anpassung frühestens 21 Tage nach Start (und nach Beginn von Kreatin, wegen Wasser); dann Wochenmittel jetzt gegen vor 14 Tagen; Vorschlag ±150 kcal, nur mit Bestätigung, frühestens 14 Tage nach der letzten Änderung.

## 1c. Gelenkregeln und Förderung Version 1

Grundsatz: Die App urteilt nicht medizinisch und setzt keine eigenen Fristen nach Operationen. Sie filtert und markiert Übungen nach den eigenen Angaben, schlägt gezielte Übungen vor und verweist auf ärztliche bzw. physiotherapeutische Vorgaben. Alles automatisch Ausgeblendete ist als „vorsorglich ausgeblendet“ gekennzeichnet und mit einem Tipp wieder einblendbar. Nicht verwendete Wörter: „sicher“, „gelenkschonend“, „geeignet bei Arthrose“, „Therapie“.

Quellen: Bewegungstraining bei Hüft- und Handarthrose stark empfohlen (ACR/AF 2019, Kolasinski et al. 2020; OARSI 2019, Bannuru et al.; EULAR 2018, Rausch Osthoff et al.; EULAR Handarthrose, Kloppenburg et al. 2019). Training senkt Hüftschmerz und verbessert die Funktion im Mittel wenig bis mäßig (Cochrane, Fransen et al. 2014); Gerätekrafttraining wirkt ähnlich wie neuromuskuläres Training (Ann Intern Med 2024). Übungen vor einer Hüft-OP verbessern Schmerz und Funktion klein bis mittel (Gill & McBurney 2013, Moyer et al. 2017). Schmerzgrenzen nach dem Modell aus NEMEX-TJR (Ageberg et al. 2010). Klassische Vorsichtsregeln nach Hüft-TEP zeigen keinen klaren Einfluss auf Luxationen (Crompton et al. 2020) – deshalb gelten nur die Vorgaben, die der Nutzer einträgt. Fester Faustschluss belastet das Daumensattelgelenk am stärksten (biomechanische Übersichten, `planung/grundlagen/I.md`).

**Belastungsmerkmale je Übung** (Daten-Datei; Tabelle für alle Vorlagen in `planung/grundlagen/I.md`, Winkel geschätzt **(ungeprüft)**, im Studio prüfen):
`griff` (keiner · leicht · druck · zug_mittel · zug_stark · stuetz_flach · ball) · `hueftbeugung` (gering · mittel · tief) + `begrenzbar` (ja/nein) · `hueftrotation` (nein · innen · aussen · beide) · `adduktion` (nein · bis_mitte · ueber_mitte) · `stoss` (kein · gering · hoch). Eigene Übungen: „unbekannt“ → Hinweis, wenn Einschränkungen aktiv sind.

**Welcher Eintrag welche Regel auslöst**

| Eintrag | Regel |
|---|---|
| Hüfte + Arthrose | `stoss = hoch` vorsorglich ausgeblendet. `hueftbeugung = tief`: mit `begrenzbar = ja` Hinweis „Bewegungsumfang über Sitz/Anschlag begrenzen, nur schmerzarmer Bereich“; mit `begrenzbar = nein` nach hinten. Rotation unter Last: Hinweis. |
| Hüfte + Gelenkersatz | Frage „Gibt es Vorgaben?“ mit Häkchen: nicht über 90° beugen · nicht nach innen drehen · nicht nach außen drehen · Beine nicht überkreuzen · kein Springen/Laufen · weiß nicht. Jedes Häkchen schließt das passende Merkmal aus (`tief`, `innen`/`beide`, `aussen`/`beide`, `ueber_mitte`, `stoss = hoch`); bei `begrenzbar = ja` statt Ausschluss Pflichthinweis „Anschlag laut Vorgabe einstellen“. „nein“ → nur Hinweise. „weiß nicht“ → Merkmale tief/Rotation/Adduktion vorsorglich ausgeblendet und Hinweis „Vorgaben bei Operateur oder Physiotherapie erfragen und eintragen“. Liegt die OP weniger als 12 Monate zurück, zusätzlich derselbe Hinweis bei jedem Trainingsstart. |
| Hüfte + OP geplant | wie Arthrose; Förderblock wird nie gekürzt; im OP-Monat Frage „Ist die OP erfolgt?“ → dann Eintrag Gelenkersatz mit Hinweis „Start erst mit ärztlicher oder physiotherapeutischer Freigabe; Vorgaben eintragen“. |
| Daumen/Hand + Arthrose | `griff = zug_stark` und `stuetz_flach` nach hinten und markiert; gibt es im Muster eine Übung mit höchstens `leicht`/`druck`, wird diese genommen. Hinweise: „Drücken mit offener Hand“, „Griff ohne Daumen“, „Steckbolzen mit ganzer Hand“. |
| Knie, Schulter, Rücken, sonstige | Nur Anzeige im Training, keine automatische Regel. |

**Auswahl je Muster:** ausgeblendete Übungen raus → nach (markiert/nach hinten, dann Priorität) stabil sortieren → erste nehmen. Sind alle Übungen eines Musters ausgeblendet, entfällt das Muster in diesem Training mit Hinweis.

**Schmerz im Training**
- „geht noch“ → bei dieser Übung keine Erhöhung in diesem und im nächsten Training. „zu viel / neu“ → Übung beenden, Alternative mit gleichem Muster oder kleinerer Bewegungsumfang anbieten.
- Muskelkater-Karte mit „Gelenk schlechter als sonst“: 1× → im nächsten Training alle Übungen mit Schmerzmeldung ohne Erhöhung und −1 Satz; 2× in Folge an derselben Übung → vorsorglich ausgeblendet, Alternative, Hinweis auf Abklärung.
- In der App keine Ampelwörter; intern entspricht „geht noch“ etwa Schmerz bis 5 von 10, „zu viel“ darüber (Ageberg 2010).

**Förderblock** (nach den Hauptmustern, ersetzt die Zusatzübung)
- 1 Übung je aktiver Hüft- bzw. Daumen/Hand-Einschränkung, höchstens 2 je Training.
- Hüfte, im Wechsel je Training: Abduktion (Abduktoren-Maschine „Beine öffnen“, Seilzug-Abduktion mit Fußschlaufe, Seitlage-Abduktion) → Streckung (Gesäßmaschine, Seilzug-Hüftstreckung, Brücke, Hyperextension-Bank) → Kontrolle/Funktion (Aufstehen vom Sitz ohne Hände, Einbeinstand neben Stütze). Clamshell nur ohne Vorgabe zur Drehung. Alle Förderübungen laufen durch dieselben Filter.
- Bereich 10–15 Wdh. bzw. Haltezeit; in den ersten 4 Wochen 2 Sätze, danach 3. Erhöhung nur ohne Schmerzmeldung in den letzten 2 Trainings, sonst Regeln aus 1a. Einbeinige Übungen beidseitig, mit der leichteren Seite beginnen.
- Muster Beine bei Hüfteintrag: zuerst Übungen mit `begrenzbar = ja` oder geringer Beugung.
- **Mobilitätseinheit** (ca. 5 Min. nach dem Aufwärmen, bei Hüfteintrag fest): Bein vor/zurück pendeln, Bein seitlich pendeln (bei „nicht überkreuzen“ nur nach außen), Hüftstreckung im Schrittstand, Becken kippen in Rückenlage; je 8–10 langsame Wdh. im schmerzarmen Bereich. 1 Tipp: „gut“ · „Schmerz“. Steigerung 8 → 12 Wdh., danach Hinweis „etwas weiter bewegen, solange es sich gut anfühlt“, nur ohne Schmerzmeldung in den letzten 2 Einheiten. Dosis ist Praxis **(ungeprüft)**.
- **Handprogramm** (3–4 Min., in einer Pause oder zu Hause): Daumen zu jeder Fingerspitze als rundes „O“ ohne Druck, 10× · Zeigefinger seitlich gegen die andere Hand abspreizen, 5 × 5 s · Daumen in C-Form gegen die andere Handfläche drücken, 5 × 5 s · Handflächen flach auf den Medizinball legen und rollen. Nur schmerzarm; Feedback und Steigerung wie Mobilitätseinheit. Inhalt angelehnt an EULAR 2019 und Valdes & von der Heyde 2012 **(Programm im Volltext ungeprüft)**.
- Fester Hinweis: „Übungen helfen im Mittel wenig bis mäßig und ersetzen keine Behandlung.“

---

## 2. Datenmodell

IndexedDB, Datenbankname `fitness-app`. Jeder Eintrag: `id` (zufällig), `geaendert` (ISO-Zeit). Mitgelieferte Vorlagen (Geräte, Übungen, Lebensmittel, Mahlzeitvorschläge, Supplements) liegen als Daten-Dateien in der App, nicht in der Datenbank und nicht im Backup.

| Speicher | Felder | Hinweis |
|---|---|---|
| `kv` | Einstellungen: `portionShake`, `wakeLock`, `katerFrage`, `letztesBackup`, `heuteTraining` (Datum), `supplementeMarkiert[]` | Schlüssel/Wert |
| `profil` | `geburtsdatum`, `geschlecht`, `groesseCm`, `alltagsfaktor`, `ziel`, `startDatum`, `erfahrung` {`druecken`, `ziehen`, `beine`, `rumpf`: `neu`/`frueher`/`aktuell`}, `ausdauerMinuten` | genau 1 Eintrag; `id` bereitet spätere Profile vor |
| `gesundheit` | `datum`, `anlass` (`erst`/`turnus`/`op`/`pause`/`schmerz`/`manuell`), `warnzeichen` {`herz`, `brust`, `schwindel`, `stoffwechsel`, `atemnot`}, `abgeklaertAm`, `trotzdemAm`, `naechstePruefung` | eine Zeile je Abfrage, nie überschreiben |
| `einschraenkungen` | `stelle`, `seite` (`links`/`rechts`/`beide`), `art` (`arthrose`/`gelenkersatz`/`opGeplant`/`akut`/`sonstiges`), `opMonat` (JJJJ-MM), `vorgaben` {`beugung90`, `innen`, `aussen`, `ueberkreuzen`, `stoss`, `weissNicht`}, `vorgabeText`, `status` (`aktiv`/`erledigt`), `beginn`, `erledigtAm` | wird von den Regeln in 1c gelesen |
| `messungen` | `datum`, `art` (`gewicht`, `taille`, `brust`, `oberarm`, `oberschenkel`), `wert`, `einheit`, `notiz` | eine Zeile je Messung; neue Arten ohne Schemaänderung |
| `notizen` | `typ` (`unvertraeglichkeit`), `text`, `beginn`, `status` (`aktiv`/`erledigt`), `erledigtAm` | nie überschreiben, nur Status ändern |
| `geraete` | `vorlageId` oder eigene Felder (`name`, `muster`, `belastungsart`: `kg`/`koerper`/`zeit`/`ausdauer`/`ball`), `vorhanden`, `stufen[]`, `zusatz[]`, `anzeige` (`kg`/`stufe`), `einstellungen[{name, wert}]`, `notiz` | Vorlage wird nur referenziert, Nutzerwerte überschreibt kein Update |
| `uebungen` | eigene Übungen: `name`, `muster` (inkl. `foerderung`, `mobilitaet`, `hand`), `muskelgruppe`, `belastungsart`, `belastung` {`griff`, `hueftbeugung`, `begrenzbar`, `hueftrotation`, `adduktion`, `stoss`}, `hinweis` | Vorlagen-Übungen aus der Daten-Datei mit denselben Feldern |
| `geraetUebung` | `geraetId`, `uebungId`, `ausgeblendet` (`nein`/`nutzer`/`vorsorglich`), `stand` {`stufenIndex`, `zielWdh`, `saetze`, `einstiegBis`, `erfuelltInFolge`, `verfehltInFolge`, `easyInFolge`, `schmerzSperreBis`, `gelenkSchlechterInFolge`} | hieran hängen Fortschritt und Steigerung |
| `trainings` | `start`, `ende`, `status` (`laeuft`/`beendet`), `aufwaermen` {`geraetId`, `minuten`}, `uebungen[]` (Reihenfolge, Vorgaben), `aenderungen[]` (Text für Abschluss), `nachbefragung` {`stufe`: kein/leicht/stark/schmerz/keine Angabe, `gruppen[]`, `gelenkSchlechter`, `am`}, `pauseEndeUm` | `pauseEndeUm` für den Timer |
| `saetze` | `trainingId`, `geraetUebungId`, `nr`, `stufenIndex`, `zusatz`, `wdh`, `sekunden`, `feedback` (`easy`/`passend`/`geradeSo`/`nichtGeschafft`/`nichtBewertet`), `schmerz` (`null`/`gehtNoch`/`zuViel`), `zeit` | sofort beim Tipp gespeichert |
| `essen` | `datum`, `zeit`, `name`, `kcal`, `eiweiss`, `portion`, `quelle` (`shake`/`grundliste`/`vorschlag`/`frei`), `vorlageId` | |
| `favoriten` | `name`, `kcal`, `eiweiss`, `portion` | eigene Lebensmittel/Mahlzeiten |

Backup-Datei: `{ app: "fitness-app", format: 1, schema: 1, erstellt, daten: { <speicher>: [...] } }`.

---

## 3. Supplements

Bedingungen: (a) gute Studienlage (Übersichtsarbeiten oder Positionspapiere anerkannter Fachgesellschaften), (b) klar belegter Nutzen für Kraft/Muskelaufbau, (c) geringes Risiko bei üblicher Dosis. Recherche H, Stichproben geprüft durch F (Websuche, Volltexte nicht gelesen). Bei Koffein weiche ich von H ab: Es erfüllt (b) nicht (siehe Ausschlussliste), genauso wie Beta-Alanin aus diesem Grund ausgeschlossen ist.

### Eiweißpulver (bereits genommen, kein Prüfgegenstand)
Zählt zur Tages-Eiweißmenge. Morton et al. 2018, Br J Sports Med 52:376, doi 10.1136/bjsports-2017-097608.

### Prüfliste

**Kreatin-Monohydrat** – erfüllt alle drei Bedingungen
- Nutzen: mehr Kraft und mehr Muskelzuwachs bei Krafttraining, bei Einsteigern wie Trainierten.
- Studienlage: Kreider et al. 2017, ISSN Position Stand, J Int Soc Sports Nutr 14:18, doi 10.1186/s12970-017-0173-z (vom Industrieverband Council for Responsible Nutrition beauftragt und mitfinanziert); Antonio et al. 2021, J Int Soc Sports Nutr 18:13, doi 10.1186/s12970-021-00412-w; IOC Consensus Statement Maughan et al. 2018, Br J Sports Med 52:439, doi 10.1136/bjsports-2018-099027. EU-Gesundheitsangabe VO (EU) 2017/672 (Wirkung von Krafttraining auf Muskelkraft, gilt für Erwachsene über 55).
- Dosis: 3–5 g täglich, Zeitpunkt egal, Ladephase nicht nötig (Antonio 2021).
- Risiken: 1–2 kg mehr Gewicht durch Wasser in den Muskeln **(Größenordnung ungeprüft)** – die App erklärt das im Gewichtsverlauf; Magen-Darm-Beschwerden bei großen Einzeldosen. Nierenschaden bei Gesunden nicht belegt (Kreider 2017, Antonio 2021).
- Nicht nehmen bzw. nur nach ärztlicher Rücksprache: Nierenerkrankung oder eingeschränkte Nierenfunktion. Kreatin erhöht den Kreatinin-Blutwert → vor Blutuntersuchungen Arzt informieren.
- Reinheit: reines Monohydrat; Produkte mit Prüfung auf Dopingsubstanzen (Kölner Liste) bevorzugen – keine Garantie.

**Nur bei ärztlich festgestelltem Mangel** (ohne Blutwert kein Nutzen für das Ziel belegt): Vitamin D (Beaudart et al. 2014, J Clin Endocrinol Metab 99:4336), Magnesium, Zink, Eisen, Vitamin B12 bei veganer Ernährung.

### Ausschlussliste

| Präparat | verfehlt | Begründung |
|---|---|---|
| Koffein | b | Kleiner kurzfristiger Effekt auf Kraft (Grgic et al. 2018, J Int Soc Sports Nutr 15:11: SMD 0,20, Unterkörper nicht signifikant, 46 Personen), kein Muskelaufbau. Vermerk: Kaffee reicht; EFSA 2015 hält 200 mg je Einzeldosis und 400 mg/Tag für unbedenklich, schon 100 mg können den Schlaf stören – bei Abendtraining beachten. |
| Beta-Alanin | b | Nutzen nur bei Belastungen von 0,5–10 Min. (Saunders et al. 2017, Br J Sports Med 51:658). |
| Natriumbicarbonat | b, c | Nutzen bei intensiven Intervallen, nicht Muskelaufbau; häufig Magen-Darm-Probleme (Grgic et al. 2021, ISSN). |
| Nitrat / Rote Bete | b | Belege vor allem für Ausdauer (IOC 2018). |
| HMB | b | Bei Trainierten kein relevanter Effekt (Rowlands & Thomson 2009). |
| BCAA | b | Kein Nutzen für Muskelaufbau belegt (Wolfe 2017, J Int Soc Sports Nutr 14:30). |
| EAA | b | Kein Zusatznutzen bei gedecktem Eiweißbedarf **(ungeprüft)**. |
| Citrullin / Arginin | a, b | Kleiner, uneinheitlicher Akuteffekt (Trexler et al. 2019, Sports Med 49:707). |
| Omega-3 | b | Kein klar belegter Kraft-/Muskeleffekt bei Gesunden. |
| Ashwagandha | a, c | Wenige, uneinheitliche Studien; BfR-Mitteilung 39/2024 warnt vor Leberschäden bis Leberversagen, keine sichere Menge ableitbar. |
| Tribulus / „Testosteron-Booster“ | b, c | Erhöht Testosteron nicht (Qureshi et al. 2014); Booster teils verunreinigt. |
| Fatburner / Grüntee-Extrakt | b, c | Kein Muskelaufbau; ab 800 mg EGCG/Tag Hinweise auf Leberschäden (EFSA 2018), EU-Beschränkung seit Dezember 2022 (VO (EU) 2022/2340). |
| Glutamin, L-Carnitin, Kollagen, Multivitamin, CLA | b | Kein belegter Nutzen für Kraft/Muskelaufbau bei Gesunden **(Quellen ungeprüft)**. |

Vollständige Quellen mit Links: [`planung/grundlagen/H.md`](planung/grundlagen/H.md), Prüfung: [`planung/grundlagen/F.md`](planung/grundlagen/F.md).

---

## 4. Vor dem Bau am Gerät bzw. Original prüfen

1. Speicher der Home-Bildschirm-App getrennt vom Safari-Tab? (bestimmt den Einstiegshinweis)
2. Wake Lock in der Home-Bildschirm-App am eigenen iPhone; braucht iOS 18.4 oder neuer.
3. Vor „Barcode später“: Darf der Browser Open Food Facts direkt abfragen (CORS)? Aus der Planungsumgebung nicht testbar.
4. DGE-PAL-Stufen und MET-Wert Gerätetraining (Abschnitt 1b).
5. Lizenz BLS 4.0, falls die Grundliste daraus kommen soll; sonst Werte aus Packungsangaben/eigener Quelle mit Quellenfeld.
6. Belastungsmerkmale (Winkel, Griff) im Studio an den echten Geräten prüfen, am besten mit Physiotherapie; die eigenen ärztlichen Vorgaben zur Hüftprothese erfragen.
7. PAR-Q+ aktuelle Fassung (eparmedx.com) lesen; eigene Formulierungen verwenden (Urheberrecht des Bogens).
