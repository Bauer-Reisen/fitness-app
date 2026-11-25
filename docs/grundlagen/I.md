# Agent I – Training bei Gelenkerkrankungen (Regeln für die App)

Recherche per Websuche (Zusammenfassungen und Abstracts, keine Volltexte gelesen). Die App urteilt nicht medizinisch. Sie markiert Übungen, begrenzt oder blendet sie aus und verweist auf ärztliche oder physiotherapeutische Vorgaben.

## 1. Hüftarthrose – Quellenlage
- **ACR/AF 2019** (Kolasinski et al., Arthritis Care Res/Arthritis Rheumatol 2020;72:220): Bewegungstraining wird bei Hüft-, Knie- und Handarthrose **stark empfohlen**. Welche Trainingsform besser ist, beruht „weitgehend auf Expertenmeinung“.
- **OARSI 2019** (Bannuru et al., Osteoarthritis Cartilage 27:1578): Zur Kernbehandlung der Hüftarthrose gehören strukturierte Übungsprogramme an Land. Wassertraining wird für die Hüfte *nicht* empfohlen.
- **EULAR 2018, körperliche Aktivität** (Rausch Osthoff et al., Ann Rheum Dis 77:1251): Körperliche Aktivität gehört zur Standardbehandlung. Vermutung, nicht geprüft: Die Empfehlungen enthalten auch Krafttraining nach den allgemeinen Empfehlungen für die Bevölkerung, angepasst an den Einzelnen. Wortlaut im Volltext nachsehen.
- **AWMF S2k Koxarthrose 033-001** (DGOOC, Stand 07/2019): gilt laut Register als **abgelaufen** und wird überarbeitet. Die Empfehlung zur Bewegungstherapie habe ich nicht im Wortlaut gelesen. Vor Zitat im PDF prüfen.
- **Schmerzregel, geprüft:** NEMEX-TJR (Ageberg, Link, Roos 2010, BMC Musculoskelet Disord 11:126; Grundlage von GLA:D). Schmerz nach dem Training auf einer Skala von 0–10: 0–2 „sicher“, über 2 bis 5 „akzeptabel“, über 5 „hohes Risiko“. Am Morgen danach soll der Schmerz wieder auf dem gewohnten Niveau sein und darf über die Zeit nicht zunehmen. In einem davon abgeleiteten Protokoll wird die Belastung gesenkt, wenn der Schmerz nicht abklingt. Roos (GLA:D) nennt außerdem einen anfänglichen Anstieg von etwa 10 % als normal.
- **Thomeé 1997** (Phys Ther 77:1690, Patellaschmerz): Dort wird ein „Schmerz-Monitoring-System“ als Wirkfaktor genannt. Die Schwelle 5/10 aus dieser Arbeit konnte ich **nicht geprüft** bestätigen. Thomeé nur als Ursprung nennen, die Zahlen nach Ageberg 2010 zitieren.

**Regeln für Hüftarthrose (V1):**
- H1: Übungen mit `stoss = hoch` werden ausgeblendet. Alternative: dasselbe Muster ohne Stoß. Vermutung, nicht geprüft: Das ist übliche Praxis, eine Leitlinie verbietet Laufen nicht ausdrücklich.
- H2: Übungen mit `hueftbeugung = tief` bekommen den Hinweis „Bewegungsumfang über Sitz/Anschlag begrenzen, nur schmerzarmer Bereich“. Ist `begrenzbar = nein`, rücken sie in der Prioritätsliste nach hinten.
- H3: Übungen mit `hueftrotation = ja` unter Last bekommen nur einen Hinweis, sie werden nicht ausgeschlossen.
- H4: Es gilt die Schmerzampel aus Abschnitt 5.

## 2. Hüft-TEP (länger als 12 Monate nach der OP)
- Die klassischen Vorsichtsregeln beim hinteren Zugang sind: keine Hüftbeugung über 90°, keine Adduktion über die Mittellinie, keine Innen- oder Außenrotation über 20°, meist mindestens 6 Wochen lang (Crompton et al. 2020, Acta Orthop, Übersicht über 7 Studien mit 6.900 Patienten; Keele CAT 2025).
- Dieselbe Übersicht fand **keinen Zusammenhang** zwischen diesen Regeln und der Zahl der Luxationen. Weitere Metaanalysen 2023/2024 kommen zum selben Ergebnis. Wie lange die Regeln gelten sollen, ist nicht untersucht. Die 6 Wochen sind Praxis, kein Studienergebnis.
- Etwa 70 % der Luxationen treten im ersten Jahr auf (StatPearls NBK537031). Späte Luxationen gibt es trotzdem: In einer Serie lagen 30 % nach dem ersten Jahr, ein schottisches Register fand nach 2 Jahren keinen weiteren Anstieg. Der hintere Zugang hat ein höheres Risiko als der anterolaterale oder laterale (norwegisches Register, HR 0,5–0,6).
- Beim vorderen Zugang sind die gefährdeten Bewegungen eher Streckung zusammen mit Außenrotation. Vermutung, nicht geprüft, Quelle fehlt.
- **AE (Deutsche Gesellschaft für Endoprothetik):** Eine eigene Sportleitlinie habe ich nicht gefunden. Es gibt eine AE-Umfrage unter Chirurgen: 81,9 % befürworten Sport nach Hüft-TEP, die Empfehlungen werden lockerer (Arch Orthop Trauma Surg 2020, PubMed 33258998). Fachartikel nennen Sportarten mit wenig Stoß nach 3–6 Monaten und raten von hohen Drehmomenten und Sturzrisiko ab. Die Evidenz ist dünn (Dtsch Z Sportmed 2017).

**App-Logik:** Bei „Hüft-TEP links/rechts/beide“ fragt die App: „Gibt es ärztliche Vorgaben zu Bewegungen?“ Antwortmöglichkeiten: *nein / ja, und zwar: [ ] nicht tief beugen (über 90°) [ ] nicht nach innen drehen [ ] Beine nicht überkreuzen [ ] nicht nach außen drehen [ ] kein Springen/Laufen [ ] weiß nicht*.
- T1: Jede angehakte Vorgabe schließt das passende Merkmal aus. Bei `begrenzbar = ja` wird die Übung nicht ausgeschlossen, sondern mit Pflichthinweis „Anschlag so einstellen, dass … “ angezeigt.
- T2: Bei „nein“ oder „weiß nicht“ wird nichts ausgeschlossen. Übungen mit tiefer Beugung, Adduktion oder Rotation bekommen den Hinweis „bei ärztlichen Vorgaben beachten“. Übungen mit `stoss = hoch` fallen über H1 trotzdem weg, wenn eine Arthrose angegeben ist.
- T3: Betroffen sind vor allem: Beinpresse (Schlittentiefe und Lehnenwinkel), Kniebeuge und Goblet-Kniebeuge (Tiefe), Ausfallschritt (einbeinig, Drehung), Adduktoren (Startweite, nicht über die Mitte), Knieheben, Russian Twist, Crunch-Maschine, Hyperextension 90° und Rudergerät (tiefe Beugung am Umkehrpunkt), Holzhacker (Drehung). Beinbeuger *liegend* belastet in Streckung und ist bei der Beugung unkritisch. Vermutung, nicht geprüft: Beinbeuger *sitzend* liegt um 90°.

## 3. Rhizarthrose (Daumensattelgelenk)
- **EULAR 2018 Handarthrose** (Kloppenburg et al., Ann Rheum Dis 2019;78:16): Übungen für Funktion, Muskelkraft und Schmerz sollen bei allen Betroffenen erwogen werden (Evidenz 1a, Effekte klein). Bei Arthrose an der Daumenbasis sollen Orthesen erwogen werden, und zwar langfristig. Die Übungen soll man an den Einzelnen anpassen.
- **ACR 2019:** Bewegungstraining ist auch bei Handarthrose stark empfohlen.
- **AWMF:** Eine Leitlinie zur Rhizarthrose habe ich nicht gefunden. Ein Artikel berichtet, dass eine Leitlinie in Arbeit ist. Nicht geprüft.
- **Biomechanik:** Bei leichtem Spitzgriff (9,8 N) wirken im Leichenversuch 117,6 N am Sattelgelenk. Beim Schlüsselgriff ist die Gelenkkraft etwa 12-mal so groß wie die Kraft an der Daumenspitze. Kräftiges Umgreifen belastet das Gelenk laut Leichenstudien etwa 10-mal stärker als Spitzgriff (Übersichten in PMC5755865 und PMC3940744). Folgerung: **Fester Faustschluss um Stange oder Griff unter hoher Last ist der Hauptbelaster.** Spitzgriff kommt im Studio selten vor, etwa beim Steckbolzen.
- **Stark belastend:** Klimmzug, Chin-up, Hängen (Körpergewicht an den Händen), Latzug, Rudern an Maschine und Kabel, Gravitron, Dips (Faust um Holm), Knieheben hängend, Ball halten oder werfen. Dazu der flache Liegestütz (Daumen abgespreizt, Handgelenk gestreckt). Vermutung, nicht geprüft.
- **Alternativen ohne neue Geräte:**
  - Maschinen mit Polster: Butterfly mit Unterarmpolster, Seitheben-Maschine, Beinmaschinen (Haltegriffe loslassen).
  - Drücken mit offener Hand: Brustpresse und Schulterpresse mit der Handfläche gegen den Griff, Daumen liegt an.
  - Liegestütz auf Fäusten oder an Griffen bzw. der Dipstange (Handgelenk neutral). Vermutung, nicht geprüft, dass das den Daumen entlastet.
  - Griff ohne Daumen („Affengriff“, Daumen auf der Seite der Finger). **Achtung:** Der „Hakengriff“ aus dem Gewichtheben klemmt den Daumen unter den Fingern ein und ist hier ungeeignet. Vermutung, nicht geprüft.
  - Plank auf den Unterarmen, Knieheben gestützt mit Unterarmpolster.
- **Zughilfen** (Schlaufen oder Haken mit Handgelenkmanschette, ca. 10–25 €): Sie verlagern die Last vom Griff auf das Handgelenk. Als Option „habe ich“ im Profil anbieten. Vermutung, nicht geprüft: Das entlastet das Sattelgelenk deutlich.
- **App-Logik:** R1: Bei Rhizarthrose werden Übungen mit `griff = zug_stark` und `griff = stuetz_flach` nach hinten gestellt und markiert. Gibt es im selben Muster eine Alternative mit `griff ≤ leicht`, wird diese genommen. R2: Hat der Nutzer Zughilfen, wird `zug_stark` wie `zug_mittel` behandelt. R3: Wer „Orthese/Schiene vorhanden“ angibt, bekommt nur einen Hinweis „beim Training tragen, wenn ärztlich empfohlen“. R4: Kurzer Hinweis bei Gerätewechsel: „Steckbolzen mit ganzer Hand statt Spitzgriff“.

## 4. Datenmodell: Belastungsmerkmale je Übung
Neues Feld `belastung` in der Übungsvorlage (Daten-Datei, nicht in der IndexedDB):
- `griff`: `keiner` (Polster/Unterarm) · `leicht` (nur halten/führen, loslassen möglich) · `druck` (offene Hand möglich) · `zug_mittel` · `zug_stark` (Körpergewicht oder Last am Faustschluss) · `stuetz_flach` · `ball`
- `hueftbeugung`: `gering` (<60°) · `mittel` (60–90°) · `tief` (>90° möglich); dazu `begrenzbar`: ja/nein (Anschlag, Sitz, Tiefe wählbar)
- `hueftrotation`: ja/nein (Drehung im Hüftgelenk unter Last oder auf dem Standbein)
- `adduktion`: `nein` · `bis_mitte` · `ueber_mitte`
- `stoss`: `kein` · `gering` · `hoch` (Sprung, Laufen, Schlag)
- `einbeinig`: ja/nein (Stand oder Last auf einem Bein)

Einschränkungen aus der Gesundheitsabfrage als Regelzeilen `{ wenn: 'rhizarthrose', merkmal: 'griff', werte: ['zug_stark','stuetz_flach'], aktion: 'nachHinten'|'ausblenden'|'hinweis', text }`. Die Filterreihenfolge: ausblenden → nach hinten → Hinweis. Ohne passende Übung im Muster wird die beste markierte Übung mit Hinweis genommen. Das Muster bleibt nie leer, außer der Nutzer blendet es aus.

| Übung | griff | Hüftb. (begr.) | Rot. | Add. | Stoß | 1-bein |
|---|---|---|---|---|---|---|
| Brustpresse / einarmig | druck | gering | n | n | kein | n |
| Butterfly | keiner* | gering | n | n | kein | n |
| Reverse Butterfly | zug_mittel | gering | n | n | kein | n |
| Schulterpresse | druck | gering | n | n | kein | n |
| Seitheben Maschine | keiner | gering | n | n | kein | n |
| Trizepsdrücken sitzend | druck | gering | n | n | kein | n |
| Latzug breit / eng / Untergriff | zug_stark | mittel | n | n | kein | n |
| Rudern eng / breit (Maschine) | zug_stark | mittel | n | n | kein | n |
| Rückenstrecken Maschine | leicht | tief (j) | n | n | kein | n |
| Crunch Maschine | leicht | tief (j) | n | n | kein | n |
| Rumpfdrehen sitzend (Maschine) | leicht | mittel | j** | n | kein | n |
| Bizepscurl Maschine | zug_mittel | mittel | n | n | kein | n |
| Beinpresse beidbeinig | leicht | tief (j) | n | n | kein | n |
| Beinpresse einbeinig | leicht | tief (j) | n | n | kein | j |
| Wadendrücken Beinpresse | leicht | mittel | n | n | kein | n |
| Beinstrecken / einbeinig | leicht | mittel | n | n | kein | n/j |
| Beinbeugen sitzend | leicht | mittel | n | n | kein | n |
| Beinbeugen liegend | leicht | gering | n | n | kein | n |
| Beine schließen (Adduktoren) | leicht | mittel | n | bis_mitte | kein | n |
| Beine öffnen (Abduktoren) | leicht | mittel | n | n | kein | n |
| Hüftstrecken Kickback | leicht | mittel | n | n | kein | j |
| Wadenheben | leicht | gering | n | n | kein | n |
| Kabelrudern | zug_stark | mittel | n | n | kein | n |
| Trizepsdrücken am Seil | zug_mittel | gering | n | n | kein | n |
| Face Pull | zug_mittel | gering | n | n | kein | n |
| Kabel-Holzhacker | zug_mittel | mittel | j | n | kein | n |
| Klimmzug unterstützt | zug_stark | mittel | n | n | kein | n |
| Dip unterstützt | zug_stark | gering | n | n | kein | n |
| Klimmzug / Chin-up / negativ / Hängen | zug_stark | gering | n | n | kein | n |
| Dips | zug_stark | gering | n | n | kein | n |
| Knieheben hängend | zug_stark | tief (n) | n | n | kein | n |
| Knieheben gestützt | keiner | tief (n) | n | n | kein | n |
| Rückenstrecken Bank | leicht | tief (j) | n | n | kein | n |
| Hüftstrecken Bank | leicht | tief (j) | n | n | kein | n |
| Liegestütze | stuetz_flach | gering | n | n | kein | n |
| Unterarmstütz (Plank) | keiner | gering | n | n | kein | n |
| Ausfallschritt | keiner | tief (j) | j | n | gering | j |
| Kniebeuge ohne Gewicht | keiner | tief (j) | n | n | kein | n |
| Rumpfdrehen mit Ball | ball | mittel | j | n | kein | n |
| Ball-Slam | ball | tief (j) | n | n | hoch | n |
| Goblet-Kniebeuge mit Ball | ball | tief (j) | n | n | kein | n |
| Russian Twist | ball | tief (n) | j | n | kein | n |
| Laufband Gehen / Steigung | keiner | gering | n | n | gering | n |
| Laufband Laufen | keiner | gering | n | n | hoch | n |
| Fahrradergometer | leicht | mittel*** | n | n | kein | n |
| Air Bike | zug_mittel | mittel*** | n | n | kein | n |
| Rudergerät | zug_mittel | tief (j) | n | n | kein | n |
| Crosstrainer | leicht | gering | n | n | gering | n |

\* je nach Modell Griffe statt Polster; im eigenen Gerät änderbar. \*\* Vermutung, nicht geprüft: Je nach Modell dreht der Oberkörper bei fixiertem Becken oder die Beine drehen mit. \*\*\* Bei niedrigem Sattel ist tiefe Beugung möglich, über die Sitzhöhe begrenzbar. Alle Winkelangaben sind Schätzungen. Vermutung, nicht geprüft: Am Gerät mit einer Physiotherapeutin bestätigen. Eigene Geräte und Übungen bekommen dieselben Felder mit Standard „unbekannt“, das bei aktiven Einschränkungen einen Hinweis auslöst.

## 5. Schmerzrückmeldung in der Satz-Schleife
Ziel: Die 1-Tipp-Bedienung bleibt erhalten. Wer nichts meldet, hat keinen Mehraufwand.
- **Im Satz:** Neben den 4 Feedback-Knöpfen ein kleiner Schalter „Gelenk“. Er erscheint nur, wenn eine Gelenkerkrankung angegeben ist. Erst Schalter, dann wie gewohnt die Feedback-Stufe tippen. Danach im Pausenbildschirm eine Zeile: „Wie stark? leicht (bis 5) · stark (über 5)“. Ohne Antwort zählt „leicht“. Neues Feld `saetze.gelenk`: `null` | `leicht` | `stark`.
- **Regeln im selben Training:** `leicht` → keine Erhöhung bei dieser Übung, Anzeige „Gelenk gemeldet – Gewicht bleibt“. `stark` → Übung beenden. Angeboten werden „Alternative mit gleichem Muster“ (unter Beachtung der Merkmalsfilter) und „Bewegungsumfang verkleinern“. Grundlage: Ampel 0–2 / 2–5 / über 5 (Ageberg 2010). Die Kategorie „leicht = akzeptabel“ ist eine Vereinfachung. Vermutung, nicht geprüft: Für Laien mit 2 Stufen ausreichend.
- **Am nächsten Morgen:** Die bestehende Nachbefragung (12–72 h) bekommt eine Zusatzfrage, aber nur wenn im Training `gelenk` gemeldet wurde: „Gelenk heute wie sonst?“ ja · schlechter. Das ist dieselbe Karte, also höchstens 1 Frage je Training, und erfüllt die Regel „zurück auf das gewohnte Niveau am Morgen danach“ aus NEMEX-TJR.
  - `schlechter` 1× → nächstes Training bei den betroffenen Übungen: keine Erhöhung, −1 Satz.
  - `schlechter` 2× in Folge an derselben Übung → Übung wird ausgeblendet. Angeboten wird eine Alternative mit dem Hinweis „ärztlich/physiotherapeutisch abklären“. Die bestehende Regel aus Abschnitt 1a gilt weiter.
  - `wie sonst` → normale Steigerung, „leicht“ zählt nicht gegen den Fortschritt.
- **Abgrenzung:** „tut weh“ (Übung ausblenden) bleibt für akuten, unklaren Schmerz. „Gelenk“ ist für bekannte Arthrose-Beschwerden gedacht. Feste Zeile bleibt: „Bei Schmerz, Schwindel, Brustdruck abbrechen.“ Steigt der Schmerz über mehrere Wochen, zeigt die App nur einen Hinweis. Vermutung, nicht geprüft: Ein Zähler „3 von 5 Trainings mit Gelenk-Meldung“ reicht als Auslöser.

## 6. Gezielte Förderung (vorschlagen, nicht nur schonen)
**Belege Hüfte:**
- **Cochrane, Fransen 2014** (CD007912, 9 RCTs, 549 Personen): Training senkt den Schmerz um etwa 8 von 100 Punkten und verbessert die Funktion um etwa 7 Punkte. Der Effekt hält 3–6 Monate nach Ende an. Nebenwirkungen sind selten und bestehen nur aus mehr Schmerz.
- **Krafttraining gegen neuromuskuläres Training (NEMEX)** (Ann Intern Med 2024, NCT04714047, 160 Personen, 12 Wochen): Krafttraining war nicht überlegen, beide wirken ähnlich. → Maschinen-Krafttraining ist eine gleichwertige Wahl, und Vorliebe darf entscheiden.
- **Bennell 2014** (JAMA 311:1987): Ein Physiotherapie-Paket aus manueller Therapie, Heimübungen und Aufklärung war **nicht besser als eine Scheinbehandlung** und hatte mehr Nebenwirkungen (41 % gegenüber 14 %). → Realistische Erwartung in der App: kleine Effekte, Schmerz ernst nehmen.
- **GLA:D/NEMEX:** neuromuskuläres Programm mit 3 Steigerungsstufen. Enthalten sind unter anderem Hüft-Abduktion und -Adduktion (Sekundärquelle). Vermutung, nicht im Volltext geprüft: Die vier Bausteine bei Ageberg 2010 sind Rumpf und Haltung, Beinachse, Beinkraft und Alltagsübungen (Aufstehen, Treppe).
- **Vor einer OP (Prähabilitation):** Gill & McBurney 2013 (Arch Phys Med Rehabil 94:164) fanden vor einer Hüft-TEP mittelgroße Verbesserungen bei Schmerz und Funktion, vor einer Knie-TEP keine. Moyer 2017 (JBJS Rev, PubMed 29232265) fand bei Hüft-TEP bessere Werte für Schmerz, Funktion und Liegedauer, mit kleinen bis mittleren Effekten. Eine Übersicht von 2016 (PMC4746481) hält die Effekte für klein und kurz. → Die Förderung gilt auch für die Seite, die operiert werden soll.

**Förderübungen Hüfte** (nur vorhandene Geräte, Merkmale nach Abschnitt 4 in der Reihenfolge griff / Hüftbeugung / Rotation / Adduktion / Stoß / einbeinig):
| Übung | Ziel | Merkmale | Steigerung | Hinweis |
|---|---|---|---|---|
| Beine öffnen (Abduktoren-Maschine) | Kraft seitl. Gesäß | leicht/mittel/n/n/kein/n | Stufen | Startweite schmerzarm einstellen |
| Hüftstrecken an der Gesäßmaschine | Kraft Hüftstrecker | leicht/mittel/n/n/kein/j | Stufen | beide Seiten; Standbein-Seite trägt mit |
| Seilzug Abduktion stehend (Fußschlaufe) | Kraft + Standbein-Kontrolle | leicht/gering/n/n/kein/j | Stufen | festhalten; Vermutung, nicht geprüft: Fußschlaufe meist vorhanden |
| Seilzug Hüftstreckung stehend | Kraft | leicht/gering/n/n/kein/j | Stufen | nur bis leicht hinter den Körper |
| Brücke (Boden), später einbeinig | Kraft Gesäß | keiner/gering/n/n/kein/n→j | Wdh 10→15, Halten 3→10 s, dann einbeinig | Hände nur ablegen |
| Seitlage-Abduktion | Kraft | keiner/gering/n/n/kein/n | Wdh, Halten oben | oberes Bein leicht hinter der Körperlinie |
| Clamshell (Seitlage, Knie öffnen) | Kraft Außenrotatoren | keiner/mittel/**j**/n/kein/n | Wdh, Halten | nur ohne Vorgabe „nicht nach außen drehen“ |
| Hüftstrecken Hyperextension-Bank | Kraft | leicht/tief(j)/n/n/kein/n | Wdh, dann Ball | Polster hoch, nur Teilbewegung bei Vorgabe |
| Beinpresse mit Anschlag | Kraft Beine | leicht/tief(j)/n/n/kein/n | Stufen | Schlittenanschlag laut Vorgabe |
| Aufstehen vom Sitz (Bank oder Gerätesitz) | Funktion | keiner/mittel(j)/n/n/kein/n | Wdh → niedrigerer Sitz → Ball vor der Brust | ohne Hände; GLA:D-nah (Vermutung) |
| Einbeinstand neben Stütze | Kontrolle | keiner/gering/n/n/kein/j | 20→60 s, dann Kopf drehen | Hand an der Stütze bereit |
| Ergometer locker, Sattel hoch | Beweglichkeit | leicht/mittel(j)/n/n/kein/n | Minuten | als Aufwärmen gerechnet |

**Mobilitäts-Einheit (ca. 5 Min. nach dem Aufwärmen, bei Hüft-Einschränkung fest im Plan):**
- 4 Bewegungen, je 8–10 langsame Wiederholungen im schmerzarmen Bereich:
  - Bein vor und zurück pendeln (im Stand, mit Stütze)
  - Bein seitlich pendeln, bei Vorgabe „nicht überkreuzen“ nur nach außen
  - Hüftstreckung im Schrittstand
  - Becken kippen in Rückenlage
- Vorgaben werden über dieselben Merkmale gefiltert. Hüftstreckung im Schrittstand bekommt einen Hinweis für Nutzer mit Vorgabe „nicht nach außen drehen“. Vermutung, nicht geprüft: relevant beim vorderen Zugang.
- **Feedback mit 1 Tipp für die ganze Einheit:** „gut“ · „Gelenk gemeldet“.
- **Steigerung:** Wdh 8 → 12. Danach erscheint der Hinweis „etwas weiter bewegen, solange es sich gut anfühlt“, aber nur wenn in den letzten 2 Einheiten kein „Gelenk gemeldet“ kam. Bei „Gelenk gemeldet“ bleibt alles gleich, und die Morgenfrage aus Abschnitt 5 greift.
- Die Dosis der Mobilitäts-Einheit ist Praxis. Vermutung, nicht geprüft: Eine Studie zur genauen Dosis habe ich nicht gesucht.

**Daumen und Hand:**
- **Belege:**
  - EULAR 2018: Übungen sollen erwogen werden (Evidenz 1a, kleine Effekte).
  - Eine Übersicht mit Metaanalyse von 2024 (Healthcare 12:823) fand Übungen bei Rhizarthrose kurzfristig besser als keine Behandlung (niedrige bis mittlere Sicherheit).
  - Im Leichenmodell vermindert Zug des Opponens und des ersten dorsalen Interosseus (FDI) die Subluxation. Der FDI gilt als Stabilisator, der kurze Daumenabspreizer als Destabilisator (Sekundärquelle).
  - Adams et al.: gezielte Kräftigung einschließlich Opponens, schmerzfreie isometrische Übungen, Gelenkschutz.
  - Valdes & von der Heyde 2012 (J Hand Ther 25:251) ist ein Übungsprogramm auf biomechanischer Grundlage, keine Übersichtsarbeit. Den Inhalt habe ich nicht gelesen.
  - THETA-Studie (2025): Orthese plus Übungen wurde gegenüber Orthese allein bevorzugt.
- **Kurzprogramm (3–4 Min.), z. B. in der Pause zwischen den Beinsätzen oder zu Hause:**
  1. Daumen zu jeder Fingerspitze führen, dabei ein rundes „O“ formen, kein Druck (Beweglichkeit), 10×.
  2. Zeigefinger seitlich gegen die andere Hand abspreizen, 5×5 s isometrisch (FDI). Später mit Gummiband 10–15 Wdh.
  3. Daumen in „C-Form“ gegen die andere Handfläche drücken, 5×5 s (Opponens). Vermutung, nicht geprüft, wie genau das dem Programm von Valdes entspricht.
  4. Handflächen flach auf den Medizinball legen und ihn auf dem Boden rollen (Handgelenk, ohne Greifen).
- **Knetball (weich):** Ganzhand-Drücken nur als Option und nur schmerzarm, weil Ganzhandgriff das Gelenk stark belastet (Abschnitt 3).
- **Billige Hilfsmittel:** Gummiband und Knetball, je etwa 5 €. Vermutung, nicht geprüft beim Preis.
- **Steigerung:** Wdh → Haltezeit → stärkeres Band. Feedback mit 1 Tipp: „gut“ · „Gelenk gemeldet“, mit denselben Regeln wie die Mobilitäts-Einheit.

**Einbau in den Plan:**
- **Förderblock:** 1 Übung je aktiver Einschränkung, höchstens 2 je Training. Er ersetzt die optionale Zusatzübung und kommt nach den Hauptmustern. Die Mobilitäts-Einheit und das Hand-Kurzprogramm zählen nicht als Übung.
- **Rotation:** Die Hüft-Förderung wechselt je Training durch die Liste: Abduktion → Streckung → Kontrolle/Funktion. So ist jede Woche alles einmal dran.
- **Muster Beine:** Bei Hüft-Einschränkung wird zuerst eine Übung mit `begrenzbar = ja` oder mit geringer Beugung gewählt.
- **Eigene Steigerung:**
  - Bereich 10–15 Wdh.
  - In den ersten 4 Wochen 2 Sätze, danach 3.
  - Erhöht wird nur, wenn in den letzten 2 Trainings kein „Gelenk“ gemeldet wurde, sonst gelten die Feedback-Regeln aus 1a.
  - Volumen: 2–3 Mal je Woche je Förderziel. Vermutung, nicht geprüft: Das entspricht der Häufigkeit in GLA:D (2×/Woche betreut) bzw. NEMEX.
- **Seiten:** Einbeinige Übungen immer auf beiden Seiten. Die Förderung gilt für die Arthrose-Seite, die TEP-Seite und eine Seite mit geplanter OP (Prähabilitation). Frage in der Gesundheitsabfrage: „OP an dieser Seite geplant?“ Bei „ja“ wird der Förderblock nie gekürzt, auch nicht bei Zeitmangel. Eine Seite kann ich nicht automatisch unterscheiden: Die App zeigt nur „beide Seiten gleich, mit der leichteren Seite anfangen“. Vermutung, nicht geprüft.
- **Ehrlicher Hinweis in der App:** „Übungen helfen im Mittel wenig bis mäßig; sie ersetzen keine Behandlung.“ Grundlage: Fransen 2014 und Bennell 2014.

## V1 / später
- **V1:** Merkmalsfelder und Tabelle, Regeln H1–H4, T1–T3, R1–R2, Schalter „Gelenk“ und die Morgenfrage, TEP-Frage „Gibt es ärztliche Vorgaben?“, Förderblock (Hüfte 12 Übungen, Hand 4 Übungen als Text) mit Rotation, Mobilitäts-Einheit mit 1-Tipp-Feedback, Frage „OP geplant?“.
- **Später (Förderung):** Ausführungsbilder, Gummiband und Knetball als „habe ich“ mit eigener Stufenliste, Hand-Programm als tägliche Erinnerung, Seitentrennung bei einbeinigen Übungen (Sätze getrennt erfassen), funktionelle Tests als Verlauf (30-Sekunden-Aufsteh-Test, Einbeinstand-Zeit).
- **Später:** Seite (links/rechts) je Merkmal (z. B. einbeinig nur auf der gesunden Seite), Winkel-Anschläge je Gerät gespeichert („Beinpresse: Schlitten ab Loch 5“), Zughilfen als Gerät mit Wirkung, Schmerzverlauf als Diagramm, Freitext-Stichwörter („Prothese“, „TEP“, „Daumen“) → Vorschlag der passenden Einschränkung zum Bestätigen.

## Quellen (Auswahl, über Websuche gefunden)
Kolasinski 2020 (ACR/AF 2019) · Bannuru 2019 (OARSI, wrap.warwick.ac.uk/125416) · Rausch Osthoff 2018 (ARD 77:1251) · AWMF 033-001 (register.awmf.org, abgelaufen) · Ageberg 2010 (BMC Musculoskelet Disord 11:126) · Thomeé 1997 (PubMed 9413448) · Crompton 2020 (Acta Orthop, PMC8023879) · StatPearls NBK537031 · Kloppenburg 2019 (EULAR Hand, PubMed 30154087) · Biomechanik Daumen PMC5755865, PMC3940744 · AE-Umfrage PubMed 33258998.
