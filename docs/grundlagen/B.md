# Agent B – Körperdaten / Messwerte

## Version 1 – Pflichtwerte (einmalig bzw. selten)
- Geburtsdatum (nicht Alter): die App rechnet das Alter für jedes Datum selbst aus, und es veraltet nie. Geburtsjahr allein reicht für die Formel, kann aber bis zu 1 Jahr danebenliegen. Empfehlung: Datum speichern, nur das Jahr ist Pflicht. (Vermutung, nicht geprüft: ±1 Jahr ändert den Grundumsatz nur um ca. 5 kcal.)
- Geschlecht: Pflicht für Mifflin-St Jeor. Die Formel kennt nur „männlich“ und „weiblich“. Als Feld vorsehen, damit spätere Nutzer es eintragen können.
- Größe (cm): einmal eintragen, danach nur bei Bedarf ändern. Wird für Formel, BMI und Taille/Größe gebraucht.
- Gewicht (kg, eine Nachkommastelle): der zentrale Verlaufswert.
- Begründung: Mifflin-St Jeor braucht genau Gewicht, Größe, Alter und Geschlecht. Laut einer Übersichtsarbeit ist sie die verlässlichste Standardformel: Sie lag am häufigsten innerhalb von ±10 % des gemessenen Grundumsatzes. Im Einzelfall sind die Fehler aber deutlich. Quelle: Frankenfield et al. 2005, J Am Diet Assoc (PubMed 15883556). Für Sportler ist sie nur mittelmäßig genau (O'Neill et al. 2023, Sports Med, PubMed 37632665). Folge: Die App zeigt den Bedarf als Startwert an und passt ihn am Gewichtstrend nach (Abstimmung mit Agent Ernährung).

## Version 1 – Gewicht: Glättung statt Einzelwert
- Messanleitung: morgens nach dem Aufstehen, nach dem Toilettengang, vor dem Essen und Trinken, mit wenig oder gleicher Kleidung, immer dieselbe Waage am selben Platz. Quelle: das Prinzip „gleiche Bedingungen“ ist breit empfohlen. Eine Studie, die morgens und abends direkt vergleicht, gibt es nicht (Noom-Übersicht, Sekundärquelle).
- Häufigkeit: täglich bis mind. 3x pro Woche. Mehr Messungen ergeben einen ruhigeren Mittelwert.
- Anzeige und Rechnung: als Hauptzahl den 7-Tage-Mittelwert (oder Wochenmittel) zeigen, Einzelwerte nur blass im Diagramm.
  - Begründung 1: Das Gewicht schwankt im Wochenrhythmus. Es steigt ab Samstag und sinkt ab Dienstag, über 80 Personen mit 4.657 Messungen. Quelle: Orsama et al. 2014, Obesity Facts 7:36–47. Ein 7-Tage-Fenster gleicht genau diesen Zyklus aus.
  - Begründung 2: Wasser und Glykogen (z. B. nach kohlenhydratreichem Essen, Salz oder Training) verändern das Gewicht in kurzer Zeit um mehr als 1 kg. Quelle: nur Sekundärquellen (Sigma Nutrition, InBody). Vermutung, nicht geprüft: genaue Größenordnung.
  - Bei Wiedereinstieg ins Krafttraining lagert der Muskel anfangs Wasser und Glykogen ein. Vermutung, nicht geprüft: Das kann in den ersten 1–2 Wochen eine scheinbare Zunahme ergeben. Die App sollte dann keine Warnung zeigen.
- Steuerung: Kalorien frühestens nach 2–3 Wochen Trend anpassen und nie wegen eines einzelnen Werts. Mindestens 4 Messungen pro 7-Tage-Fenster, sonst „zu wenig Daten“ anzeigen. Vermutung, nicht geprüft: die Schwellenwerte sind Erfahrungswerte, keine Studie. Ein Patent zur Gewichtstrendanzeige wartet ebenfalls ca. 3 Wochen (US 11633160, schwache Quelle).
- Technik: einfacher 7-Tage-Mittelwert (leicht zu erklären) oder exponentiell geglättet (reagiert gleichmäßiger, kommt mit Lücken besser zurecht). Für V1 reicht der einfache Mittelwert über die vorhandenen Messungen der letzten 7 Tage.

## Version 1 – Umfänge (optional, aber empfohlen: nur Taille)
- Taille: der wichtigste Umfang. Er zeigt, ob Bauchfett ab- oder zunimmt, auch wenn das Gewicht gleich bleibt (Muskelaufbau). Das hilft bei der Trainings- und Ernährungsbewertung.
  - Messstelle (WHO STEPS): auf halber Höhe zwischen der untersten tastbaren Rippe und der Oberkante des Beckenknochens. Gemessen wird am Ende einer normalen Ausatmung, mit hängenden Armen, im Stehen und auf nackter Haut. Quelle: WHO-STEPS-Protokoll laut Eurac-Protokoll und ClinicalTrials-Studienprotokoll, PhenX Toolkit. Die WHO-Originalanleitung habe ich nicht selbst geöffnet.
  - Maßband: nicht dehnbar, waagerecht, anliegend ohne einzuschneiden, auf 0,5 cm genau ablesen. 2x messen und den Mittelwert nehmen; liegen die beiden Werte mehr als 1 cm auseinander, ein drittes Mal messen. Vermutung, nicht geprüft: die 1-cm-Regel ist üblich, aber nicht belegt.
  - Wichtig: immer dieselbe Messstelle. Über dem Beckenkamm (US-Protokoll NHLBI/NHANES) liegt der Wert einige cm höher; beide Werte sind nicht vergleichbar (PhenX, Statistics Canada 2012).
  - Die Messstelle sollte in der App kurz als Text und Skizze erklärt werden.
- Häufigkeit: alle 2–4 Wochen, morgens nüchtern wie beim Wiegen. Vermutung, nicht geprüft: Kleinere Änderungen liegen innerhalb der Messungenauigkeit beim Selbstmessen.

## Später (optional)
- Hüfte (an der breitesten Stelle des Gesäßes): nur für das Taille-Hüft-Verhältnis. Die WHO-Expertenrunde 2008 (Bericht 2011) nennt Grenzwerte dafür. Vermutung, nicht geprüft: Für Männer gilt ≥ 0,90 als erhöht; den Bericht selbst habe ich nicht gelesen. Taille/Größe sagt für den Alltag genug, daher nicht V1.
- Brust, Oberarm (angespannt oder entspannt festlegen), Oberschenkel: rein motivierend („Muskelaufbau sichtbar“). Sie haben keinen Einfluss auf Formel oder Trainingssteuerung. Selbst gemessen schwanken sie stark, weil die Messstelle schwer gleich zu treffen ist (Vermutung, nicht geprüft). Messpunkte, falls gewünscht: Oberarm an der dicksten Stelle, Oberschenkel 15 cm über der Kniescheibe, beides immer dieselbe Seite. Vermutung, nicht geprüft: diese Punkte sind gängige Praxis, keine Norm.
- Fotos: Vermutung, nicht geprüft: Für die Optik aussagekräftiger als Arm- oder Brustumfang. Speicherplatz in IndexedDB beachten, nicht ins Backup zwingen.
- Ruhepuls, Schlaf: frühestens später, nur wenn die Trainingssteuerung sie wirklich nutzt.

## Überflüssig oder zu ungenau
- Körperfett per Haushaltswaage (Bioimpedanz): Der Wert hängt stark vom Wasserhaushalt ab. Für Gruppen ist er brauchbar, für den Einzelwert nicht. Quelle: Übersichten und Validierungsstudien (z. B. PMC10404482, PMC6452160; Houston Methodist). Herstellerstudien mit r = 0,99 (Withings) sind vom Hersteller finanziert. Höchstens später als optionales Feld mit dem Hinweis „nur Trend“, nicht in Formeln verwenden.
- Hautfalten: Vermutung, nicht geprüft: Sie brauchen einen geschulten Messer und einen Zangen-Messschieber und lassen sich allein kaum wiederholbar messen. Daher weglassen.
- BMI: nur anzeigen und als Plausibilitätsprüfung verwenden, nicht zur Steuerung. NICE NG246: Bei viel Muskelmasse ist der BMI mit Vorsicht zu deuten; für einige Herkunftsgruppen gelten niedrigere Grenzwerte. Er wird automatisch aus Gewicht und Größe berechnet, eine eigene Eingabe ist nicht nötig.
- Alter als Zahl speichern: veraltet, siehe Geburtsdatum.

## Gesundheitsbezogene Grenzwerte (nur als neutraler Hinweis, keine Diagnose)
- Taille/Größe-Verhältnis (NICE NG246, 2022 bzw. 2025): 0,4–0,49 gesund, 0,5–0,59 erhöhtes Risiko, ab 0,6 stark erhöhtes Risiko. Faustregel: Taille unter der halben Körpergröße. Gedacht für BMI < 35. Empfehlung für V1: anzeigen, denn es braucht nur Taille und Größe. Die NICE-Seite selbst sollte vor der Umsetzung noch einmal auf die aktuelle Fassung der Bänder geprüft werden.
- Taillenumfang Männer, europäischer Herkunft: ab 94 cm erhöhtes, ab 102 cm deutlich erhöhtes Risiko. Für asiatische Männer gilt 90 cm. Quelle: WHO Expert Consultation 2008, Bericht 2011 (who.int 9789241501491), Ursprung Lean et al. 1995, BMJ 311:158. Den Bericht selbst nicht geöffnet; die Werte stammen aus zitierenden Tabellen (PMC7231748).
- Darstellung: Ampel nur mit dem Text „Hinweis, keine Diagnose, bei Fragen Arzt“. Nie die Ernährung automatisch daraus verschärfen.

## Freitext Beschwerden / Unverträglichkeiten – Struktur (V1)
Ein Eintrag besteht aus:
- Typ: Beschwerde/Einschränkung | Unverträglichkeit/Allergie
- Text: Freitext
- Beginn: Datum, Pflicht
- Status: aktiv | erledigt, mit Datum der Erledigung
- Körperregion, nur bei Beschwerden, feste Liste plus „sonstige“: Schulter, Ellbogen, Handgelenk, Nacken, oberer Rücken, unterer Rücken, Hüfte, Knie, Sprunggelenk, sonstige. Dazu die Seite: links | rechts | beide.
- Stärke: leicht | mittel | stark
- Später: Lebensmittel-Stichwort bei Unverträglichkeiten (z. B. Laktose, Gluten, Nüsse) als feste Auswahl, damit Mahlzeitvorschläge filtern können.
- Begründung: Mit Region und Status kann die Trainingssteuerung Übungen für diese Region markieren oder ausblenden. Das Ausblenden schlägt die App nur vor; der Nutzer entscheidet. Freitext allein ist für die App nicht auswertbar. Vermutung, nicht geprüft: Die Regionsliste deckt die häufigsten Studio-Beschwerden ab.
- Verlauf: Einträge nie überschreiben, nur den Status ändern. So bleibt die Vorgeschichte erhalten.

## Datenmodell-Hinweis (V1)
- Jede Messung ist ein eigener Datensatz: Datum, Uhrzeit, Typ (gewicht | taille | …), Wert, Einheit, optional eine Notiz (z. B. „nach Feier“, „krank“). So bleibt alles erweiterbar, ohne das Schema zu ändern.
