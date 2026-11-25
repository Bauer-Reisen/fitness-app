// Alle Schwellenwerte der Trainingsregeln an einer Stelle (docs/ANFORDERUNGEN.md, Abschnitt 1a und 1c).
// Viele Werte sind praxisübliche Faustregeln (ungeprüft) – nach der Abnahme hier nachstellen.

export const R = {
  // Wiederholungsbereiche
  kg: { min: 8, max: 12, maxGrosserSprung: 15, zielNachGrossemSprung: 6 },
  foerder: { min: 10, max: 15 },          // Förderübungen und Ball
  koerper: { min: 1, max: 50, start: 8 },
  zeit: { min: 10, max: 60, start: 20, schritt: 10 },
  grosserSprung: 0.10,                     // nächste Stufe mehr als 10 % schwerer

  // Einstieg je Erfahrung im Muster (Tage)
  einstiegTage: { neu: 14, frueher: 7, aktuell: 0 },
  saetzeEinstieg: 2,
  saetze: 3,
  foerderEinstiegTage: 28,

  // Pausen (Tage seit dieser Übung)
  pauseNormalBis: 7,
  pauseOhneSteigerungBis: 14,
  pauseMinusEinsBis: 28,
  pauseNeuEinstiegTage: 7,

  kurzerAbstandStunden: 48,
  zielNachFehlschlag: 10,

  // Pausentimer (Sekunden)
  pauseSek: { haupt: 90, foerder: 60 },
  trainingAutoEndeStunden: 4,

  // Nachbefragung (Muskelkater) und Gesundheits-Wiedervorlage
  nachbefragungAbStunden: 12,
  nachbefragungBisStunden: 72,
  gesundheitTurnusTage: 90,
  gesundheitNachPauseTage: 28,
  zuVielFensterTage: 14,

  // Mobilität und Handprogramm
  mobilStart: 8,
  mobilMax: 12,

  aufwaermenMinuten: 6,
  backupErinnerungTage: 14,
};
