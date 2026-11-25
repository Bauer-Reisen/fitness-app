# Agent E – Bedienung im Studio

Grundsatz: eine Hand, verschwitzte Finger, kurze Blicke. Wie in der Bike-App: große Knöpfe (dort `.knopf` 60 px hoch,
Leiste unten 72 px), helle/dunkle Farben über CSS-Variablen, Leiste unten mit safe-area-inset.

## Quellen-Kurzbefund (geprüft per Websuche, 23.11.2026)
- Apple: Bedienelemente mind. 44 × 44 pt (developer.apple.com/design/tips). In der Web-App 1 pt ≈ 1 CSS-px. Wir nehmen mehr: 56–64 px.
- Vibration (`navigator.vibrate`): in Safari auf iOS nicht vorhanden, WebKit lehnt sie ab (caniuse.com/vibration; W3C-Implementierungsbericht w3c.github.io/vibration/reports/implementation.html). → Nicht einplanen.
- Bildschirm-wach-halten (Screen Wake Lock): in Safari seit iOS 16.4; in Home-Bildschirm-Web-Apps erst seit iOS 18.4 repariert
  (Safari-18.4-Versionshinweise "Fixed Wake Lock API for Home Screen Web Apps"; WebKit-Bug 254545). Nach App-Wechsel geht die Sperre
  verloren und muss bei `visibilitychange` neu angefordert werden (WebKit-Bug 255363 – ob ganz behoben: nicht geprüft).
- Hintergrund: Background Sync/Fetch auf iOS nicht unterstützt (firt.dev/notes/pwa-ios). Web-Push gibt es seit iOS 16.4 nur für
  installierte Web-Apps (webkit.org/blog/13878) – braucht aber einen Server zum Senden → für uns (kein Server) nicht nutzbar.
- Vermutung, nicht geprüft: JS-Timer (setTimeout) werden bei gesperrtem Bildschirm/Hintergrund angehalten; ein Ton beim Pausenende
  kommt dann nicht. Darum nie auf laufende Timer verlassen.

## Version 1
1. **Startbildschirm "Heute"**: oben ein Satz ("Heute: Training B – 6 Übungen, ca. 45 Min." oder "Pausentag empfohlen"),
   darunter EIN großer Knopf unten "Training starten". Darunter klein: Eiweiß heute (z. B. 80/140 g) + Knopf "+ Shake".
   Läuft ein Training noch → statt dessen "Training fortsetzen (Übung 3/6)". Grund: sofort klar, was zu tun ist, kein Suchen.
2. **Ablauf als feste Schrittfolge**, je ein Bildschirm, "Weiter" immer an derselben Stelle unten:
   Start → Aufwärmen (Gerät wählen: Laufband/Ergometer/Air Bike/Rudergerät; Vorschlag 5–10 Min., Knopf "Fertig") →
   Übung (Name, Gerät, Einstellungen, Vorschlag "3 × 10 × 35 kg") → Satz → Pause → nächster Satz/Übung → Abschluss.
   Oben schmale Fortschrittsanzeige "Übung 2/6 · Satz 1/3". Grund: keine Navigation während des Trainings nötig.
3. **Satz eintragen = Feedback geben, 1 Tipp im Normalfall** – Details siehe Abschnitt "Feedback-Eingabe".
   Keine Tastatur (verdeckt halben Bildschirm, kleine Tasten); nur Plus/Minus.
4. **Feedback-Stufen** (Wortlaut mit Agent A abstimmen): "nicht geschafft" / "gerade so" / "passend" / "easy".

## Feedback-Eingabe (Kern der App)
- **Feedback-Knopf = Satz bestätigen.** Gewicht/Wdh. sind mit dem Vorschlag vorbefüllt (groß: "10 × 35 kg"). Darunter
  4 Knöpfe übereinander bzw. 2×2 in der Daumenzone, je volle halbe Breite, ≥ 64 px hoch: "easy" · "passend" · "gerade so" ·
  "nicht geschafft". Ein Tipp speichert Satz + Feedback und startet die Pause. → Normalfall genau 1 Tipp pro Satz.
  "passend" am größten/hervorgehoben und an der Stelle, wo der Daumen ruht (unten rechts bei Rechtshändern;
  Vermutung, nicht geprüft: Händigkeit als Einstellung sinnvoll).
- **Abweichung korrigieren (2–4 Tipps)**: "nicht geschafft" öffnet sofort die Wdh.-Zeile mit −/+ (vorbelegt: Vorschlag −2),
  "Speichern" darunter. Bei allen anderen Stufen: Tipp auf die große Zahl "10 × 35 kg" klappt −/+ für Wdh. (±1) und Gewicht
  (± Gerätestufe, z. B. 2,5/5 kg, pro Gerät hinterlegt) auf, Feedback-Knöpfe bleiben darunter. Reihenfolge also:
  erst korrigieren, dann Feedback tippen – oder Feedback zuerst und danach in der Pause korrigieren (Satz bleibt antippbar).
- **Gewicht am Gerät anders eingestellt** (Stufe belegt, Stift falsch): gleiches −/+; der neue Wert gilt automatisch für
  die Folgesätze dieser Übung. Grund: sonst muss man jeden Satz einzeln korrigieren.
- **Rückgängig**: nach jedem Tipp 5 s Balken "Rückgängig" (kein Bestätigungsdialog).
- **Sichtbare Rückmeldung, was die App daraus macht** (Regeln von Agent A, Text von der App):
  - sofort in der Pause, eine Zeile: "Nächster Satz: 35 kg bleibt" / "Nächster Satz: 8 Wdh. statt 10".
  - nach der Übung (letzter Satz): "Nächstes Mal: 40 kg (+5 kg) – alle Sätze passend/easy".
  - auf dem Abschluss-Bildschirm Liste aller Änderungen: "↑ Beinpresse 40 kg · = Latzug 45 kg · ↓ Dips 8 Wdh."
  - Kurzbegründung immer dabei ("weil 2× gerade so"). Knopf "Nicht anpassen" pro Übung, falls Ausreißer (schlechter Tag).
  Grund: Vertrauen – der Nutzer sieht, dass sein Tipp etwas bewirkt, und kann widersprechen.
- **Ohne Feedback** (z. B. App weggewischt): Satz zählt als "passend" mit Vorschlagswerten? → Vermutung, nicht geprüft:
  sicherer ist "nicht bewertet" speichern und für die Steigerung nicht verwenden (Agent A entscheidet).

## Nachträgliches Feedback (Muskelkater) – V1, ohne Push
- **Wann**: beim ersten Öffnen der App frühestens ca. 12 h und bis 72 h nach einem Training, das noch nicht nachbewertet ist.
  Nur 1 Frage pro Öffnen, nur für das letzte Training; danach nie wieder für dieses Training. Grund: Muskelkater kommt
  meist am Folgetag (Vermutung, nicht geprüft – Agent A/B bitte mit Quelle belegen).
- **Wie**: Karte oben auf "Heute" (kein Popup, blockiert nichts): "Wie geht's nach dem Training von gestern?"
  Knöpfe: "kein" · "leicht" · "stark" · "Überspringen". Bei "leicht/stark" optional eine Zeile antippbarer Regionen
  (Beine · Po · Rücken · Brust · Schultern · Arme · Bauch; Mehrfachauswahl, kein Muss) + "Fertig". Normalfall 1 Tipp.
  Wer nichts tippt und die Karte ignoriert: verschwindet nach 72 h, gespeichert als "keine Angabe".
  Ergänzung "Schmerz (nicht Muskelkater)?" → führt zum Freitext Beschwerden (Körperdaten), keine Trainingsautomatik.
- **Wirkung sichtbar**: z. B. "Beine stark → heute Oberkörper vorgeschlagen / Beine leichter" (Regel von Agent A).
- **Einstellung**: "Nach Muskelkater fragen: an/aus". Grund: nicht nerven.
- **Push geprüft**: Web-Push gibt es seit iOS 16.4 nur für Home-Bildschirm-Web-Apps (webkit.org/blog/13878), und Apple setzt
  einen eigenen Server mit VAPID-Schlüsseln voraus (developer.apple.com, "Sending web push notifications in web apps and
  browsers"). Ohne Server ginge es nur über Fremddienste (z. B. OneSignal) – Kosten, Datenweitergabe, Konto nötig;
  Vermutung, nicht geprüft: Gratis-Stufen solcher Dienste sind möglich, widersprechen aber "kein Server/keine Anmeldung".
  Lokale geplante Benachrichtigungen ohne Server bietet Safari nicht (Vermutung, nicht geprüft). → V1: nur Abfrage beim Öffnen.
- Später: iOS-Kurzbefehl/Erinnerungen-App als vom Nutzer selbst gestellter Wecker ("Morgen 9 Uhr: Fitness-App öffnen").
5. **Geräte-Einstellungen beim Satz** gut sichtbar über dem Knopf: "Sitz 4 · Lehne 2 · Griff unten" (Freitext/Felder je Gerät,
   beim ersten Mal abgefragt, danach nur anzeigen; Stift-Symbol zum Ändern). Grund: man vergisst die Sitzhöhe zwischen Besuchen.
6. **Daumenzone**: alle häufigen Knöpfe im unteren Drittel, Hauptknopf volle Breite, mind. 60 px hoch (über Apples 44 pt),
   Abstand ≥ 8 px. Plus/Minus mind. 56 × 56 px. Selten Gebrauchtes (Abbrechen, Übung tauschen, Notiz) oben bzw. hinter "⋯".
   Schrift groß (Gewicht/Wdh. ~ 32–40 px). Untere Tab-Leiste während des Trainings ausblenden (Fehltipps vermeiden).
7. **Pausentimer**: beim Satzende Endzeit (Uhrzeit) in IndexedDB speichern, Anzeige rechnet immer "Endzeit − jetzt" neu
   (auch bei `visibilitychange`/`pageshow`). Großer Countdown, Knöpfe "+30 s" und "Überspringen". Nach Ablauf: Anzeige wird
   farbig ("Los!") und zählt Überzeit hoch. Pausenlänge kommt aus dem Plan (Agent A/B).
   Ton: kurzer Ton per Web Audio nur, wenn App im Vordergrund ist; erst nach einem Tipp freigeschaltet (Vermutung, nicht geprüft:
   iOS erlaubt Ton erst nach Nutzeraktion; Stummschalter kann ihn unterdrücken). Kein Vibrieren (iOS kann es nicht).
8. **Bildschirm wach halten**: Wake Lock beim Trainingsstart anfordern, bei Rückkehr neu anfordern; Schalter "Bildschirm
   anlassen" (Akku). Fehlt die Funktion (iOS < 18.4 als Home-App) → still ignorieren, Timer funktioniert trotzdem über Endzeit.
   Hinweis an Nutzer: Ton kommt nur bei offenem Bildschirm.
9. **Unterbrechung/abgestürzt**: jeder Satz wird sofort gespeichert (kein "Speichern am Ende"). Laufendes Training =
   Datensatz mit Status "läuft". Beim Öffnen: "Training von 18:40 fortsetzen?" [Fortsetzen] [Beenden & speichern].
   Älter als ca. 4 h → automatisch als beendet speichern (nur mit geschafften Sätzen). "Abbrechen" fragt nach
   ("Bisherige 8 Sätze behalten?"). Grund: App wird im Studio oft weggewischt/vergessen.
10. **Übung überspringen/tauschen**: Gerät besetzt → "Später" (ans Ende) oder "Tauschen" (Alternative aus Katalog, gleiche Muskelgruppe).
    Grund: Studioalltag; ohne das bricht der Ablauf.
11. **Abschluss**: kurze Übersicht (Dauer, Sätze, "3 Übungen gesteigert"), optional Notiz/Beschwerde (Freitext, verknüpft mit
    Körperdaten-Freitext), Knopf "Fertig". Hinweis "Heute Trainingstag: Eiweißziel 140 g". 
12. **Ernährung schnell**: Knopf "+ Shake" (Portion einmal festlegen, z. B. 30 g Pulver = 24 g Eiweiß, 1 Tipp, mit "Rückgängig"
    5 s lang). Erfassen: Liste "Zuletzt" und "Häufig" (je 1 Tipp fügt hinzu), Portion über Plus/Minus (½, 1, 1½).
    Eigene Mahlzeit einmal anlegen (Name, kcal, Eiweiß), danach wiederverwendbar. Grund: Erfassung muss < 10 s dauern, sonst wird sie aufgegeben.
13. **Rückgängig statt Nachfragen**: nach "Geschafft"/"+ Shake" kurzer Balken "Rückgängig". Grund: weniger Dialoge, Fehltipps korrigierbar.

## Später
- Aufwärmen mit eigenem Timer und Werten (Watt/Distanz vom Ergometer abtippen).
- Ton/Erinnerung bei gesperrtem Bildschirm – mit unseren Mitteln (kein Server) nicht verlässlich; nicht versprechen.
- Supersätze/Zirkel, Übungsreihenfolge per Ziehen ändern.
- Kurzanleitung je Übung (Bild/Text) – Inhalte von Agent B/Katalog.
- Barcode-Scan für Lebensmittel (Kamera + freie Datenbank wie Open Food Facts – Kosten/Offline prüfen).
- Bedienung mit Sprachansage (Vermutung, nicht geprüft: Web Speech Synthese in iOS-Home-Apps nutzbar).
- Querformat/Apple Watch: nicht nötig für V1.

## Offene Punkte für andere Agenten
- A: Steigerungsregel nutzt "leicht/passend/schwer" + geschaffte Wdh.; Default "passend" ohne Antwort ok?
- C (Katalog): Feld "Gewichtsstufe" und "Einstellungen" pro Gerät nötig. Bodenübungen/Klimmzug: Wdh. statt kg (ggf. Zusatzgewicht/Hilfe).
- Wake Lock auf echtem iPhone (iOS-Version des Nutzers!) testen, bevor der Hinweistext festgelegt wird.
