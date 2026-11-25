// Inhalte für Rundgang und „Was ist neu?" (ohne weitere Importe, damit der Wächter-Test sie lesen kann).
// Regel: Jeder „Was ist neu?"-Eintrag nennt die Rundgang-Karte, die die Neuerung erklärt (karte),
// oder ist ausdrücklich „klein". Die genannte Karte muss einen stand ≥ dieser Version haben.
// Geprüft vor jedem Hochladen von scripts/check-help.js.

export const STEPS = [
  {
    id: 'willkommen', stand: '0.1.0', icon: '💪', title: 'Dein Training, deine Regeln',
    text: 'Die App schlägt dir jedes Training vor – passend zu deinen Geräten, deinem Fortschritt und deinem Körper. Alles bleibt <strong>nur auf diesem Handy</strong>, ohne Konto.',
  },
  {
    id: 'feedback', stand: '0.1.2', icon: '👍', title: 'Ein Tipp pro Satz',
    text: 'Nach jedem Satz tippst du, wie es war: <strong>easy</strong>, <strong>passend</strong>, <strong>gerade so</strong> oder <strong>nicht geschafft</strong>. Das trägt den Satz ein und startet die Pause. Bei einer neuen Übung ist der <strong>erste Satz ein Test</strong> – an Geräten wählst du dabei das Startgewicht. Die App zeigt dir sofort, was sie daraus macht.',
  },
  {
    id: 'schmerz', stand: '0.1.0', icon: '🩹', title: 'Schmerz? Sag es der App',
    text: 'Meldet sich ein Gelenk, tippst du beim Satz auf <strong>Schmerz</strong>: „geht noch“ oder „zu viel“. Dann wird nichts gesteigert. Am Tag danach fragt die App kurz nach <strong>Muskelkater</strong> und wie es dem Gelenk geht. Die App ersetzt keine ärztliche Beratung.',
  },
  {
    id: 'gelenke', stand: '0.1.0', icon: '🦴', title: 'Rücksicht und Förderung',
    text: 'In der <strong>Gesundheitsabfrage</strong> trägst du Gelenke ein, die Rücksicht brauchen, und ärztliche Vorgaben. Die App wählt passende Übungen, blendet vorsorglich manches aus (wieder einblendbar) und plant <strong>gezielte Übungen</strong> für Hüfte und Hand ein.',
  },
  {
    id: 'geraete', stand: '0.1.0', icon: '🏋️', title: 'Deine Geräte',
    text: 'Unter <strong>Training → Meine Geräte</strong> hakst du ab, was dein Studio hat, und stellst die Gewichtsstufen ein. Pläne nutzen nur diese Geräte. Eigene Geräte legst du mit drei Angaben an.',
  },
  {
    id: 'essen', stand: '0.1.0', icon: '🥣', title: 'Essen in Sekunden',
    text: 'Unter <strong>Essen</strong> siehst du, wie viel Eiweiß und Kalorien heute noch fehlen – an Trainingstagen etwas mehr. Dein Eiweißshake ist <strong>ein Tipp</strong>. Dazu Vorschläge für einfache Mahlzeiten.',
  },
  {
    id: 'backup', stand: '0.1.0', icon: '💾', title: 'Backup nicht vergessen',
    text: 'Deine Daten liegen nur auf diesem Handy. Unter <strong>Mehr → Backup</strong> speicherst du sie als Datei, zum Beispiel in iCloud. Die App erinnert dich daran.',
  },
  {
    id: 'home', stand: '0.1.0', icon: '🏠', title: 'Auf den Home-Bildschirm',
    text: 'Wichtig am iPhone: Nur als App auf dem Home-Bildschirm bleiben deine Daten sicher gespeichert. In Safari auf das <strong>Teilen-Symbol</strong>, dann <strong>„Zum Home-Bildschirm"</strong>.',
  },
];

// Neueste zuerst. Nur sichtbare Neuerungen, keine Reparaturen.
export const NEWS = [
  {
    v: '0.1.2', karte: 'feedback', title: 'Erster Satz = Test',
    items: ['Bei einer neuen Übung mit Körpergewicht oder Haltezeit ist der <strong>erste Satz ein Test</strong>: so viele saubere Wiederholungen oder Sekunden wie gut gehen, 2–3 vor Schluss aufhören. Die App übernimmt das für die nächsten Sätze und Trainings.'],
  },
  {
    v: '0.1.1', karte: 'klein', title: 'Alle Umfänge',
    items: ['Unter <strong>Körper → Umfänge</strong> misst du jetzt Taille, Brust, Oberarm und Oberschenkel – jeweils mit Anleitung, Datum zum Nachtragen und der Veränderung seit der ersten Messung.'],
  },
];
