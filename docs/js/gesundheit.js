// Gesundheitsabfrage: Wiedervorlage und Muskelkater-Karte. Ohne Bildschirm-Code.
import { R } from './regeln.js?v=0.1.6';
import { tageZwischen, plusTage, monatIso, stundenZwischen, heuteIso } from './datum.js?v=0.1.6';

export const WARNZEICHEN = {
  herz: 'Hat dir ein Arzt eine Herzerkrankung oder Bluthochdruck festgestellt?',
  brust: 'Hast du Schmerzen oder Druck in der Brust – in Ruhe, im Alltag oder bei Belastung?',
  schwindel: 'Wird dir so schwindlig, dass du das Gleichgewicht verlierst, oder warst du in den letzten 12 Monaten bewusstlos?',
  stoffwechsel: 'Hast du eine bekannte Stoffwechsel- oder Nierenerkrankung (z. B. Diabetes)?',
  atemnot: 'Hast du ungewöhnliche Atemnot, Herzrasen oder Herzstolpern oder geschwollene Knöchel?',
};

export const letzteAbfrage = liste => [...(liste || [])].sort((a, b) => (a.datum < b.datum ? 1 : -1))[0] || null;

// Ist die Muskelkater-Karte fällig? (12–72 h nach dem letzten beendeten Training, noch nicht beantwortet)
export function katerFaellig(letztesTraining, jetzt, eingeschaltet = true) {
  if (!eingeschaltet || !letztesTraining?.ende || letztesTraining.nachbefragung) return false;
  const h = stundenZwischen(letztesTraining.ende, jetzt);
  return h >= R.nachbefragungAbStunden && h <= R.nachbefragungBisStunden;
}

// Grund für eine erneute Gesundheitsabfrage oder null.
// ctx: { heute, gesundheit[], einschraenkungen[], letztesTrainingDatum, zuVielMeldungen: [{datum, id, muster}], katerHeute }
export function wiedervorlage(ctx) {
  const letzte = letzteAbfrage(ctx.gesundheit);
  if (!letzte) return 'erst';
  if (ctx.katerHeute) return null; // nie am selben Tag wie die Muskelkater-Karte
  const heute = ctx.heute;
  const seit = letzte.datum;

  for (const e of ctx.einschraenkungen || []) {
    if (e.status === 'erledigt' || e.art !== 'opGeplant' || !e.opMonat) continue;
    if (monatIso(heute) >= e.opMonat && seit < e.opMonat + '-01') return 'op';
  }
  if (ctx.letztesTrainingDatum && tageZwischen(ctx.letztesTrainingDatum, heute) > R.gesundheitNachPauseTage && seit <= ctx.letztesTrainingDatum) return 'pause';
  const fenster = plusTage(heute, -R.zuVielFensterTage);
  const zaehler = new Map();
  for (const z of ctx.zuVielMeldungen || []) {
    if (z.datum < fenster || z.datum <= seit) continue;
    for (const k of [z.id, 'muster:' + z.muster]) zaehler.set(k, (zaehler.get(k) || 0) + 1);
  }
  if ([...zaehler.values()].some(n => n >= 2)) return 'schmerz';
  if (heute >= (letzte.naechstePruefung || plusTage(seit, R.gesundheitTurnusTage))) return 'turnus';
  return null;
}

export const GRUND_TEXT = {
  erst: 'Kurze Gesundheitsabfrage vor dem ersten Training (ca. 2 Minuten).',
  turnus: 'Drei Monate vorbei: Ist gesundheitlich alles gleich?',
  op: 'Der angegebene OP-Monat ist erreicht: Ist die OP erfolgt?',
  pause: 'Nach der längeren Pause: Ist gesundheitlich alles gleich?',
  schmerz: 'Zweimal „zu viel“ in kurzer Zeit: Bitte Angaben prüfen und ärztlich oder physiotherapeutisch abklären.',
};

export function neueAbfrage(anlass, warnzeichen, heute = heuteIso()) {
  return { datum: heute, anlass, warnzeichen, naechstePruefung: plusTage(heute, R.gesundheitTurnusTage) };
}
