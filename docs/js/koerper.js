// Körperdaten: Mittelwerte und Verlauf. Ohne Bildschirm-Code.
import { plusTage } from './datum.js?v=0.1.0';

export const MESSARTEN = {
  gewicht: { name: 'Gewicht', einheit: 'kg', stellen: 1 },
  taille: { name: 'Taille', einheit: 'cm', stellen: 1 },
  brust: { name: 'Brust', einheit: 'cm', stellen: 1 },
  oberarm: { name: 'Oberarm', einheit: 'cm', stellen: 1 },
  oberschenkel: { name: 'Oberschenkel', einheit: 'cm', stellen: 1 },
};

export const MIN_WIEGUNGEN = 4;

// 7-Tage-Mittel des Gewichts bis einschließlich `heute`. Je Tag zählt der letzte Wert.
export function mittel7(messungen, heute) {
  const von = plusTage(heute, -6);
  const jeTag = new Map();
  for (const m of messungen) {
    if (m.art !== 'gewicht' || m.datum < von || m.datum > heute) continue;
    const alt = jeTag.get(m.datum);
    if (!alt || (m.zeit || '') >= (alt.zeit || '')) jeTag.set(m.datum, m);
  }
  const werte = [...jeTag.values()].map(m => m.wert);
  if (!werte.length) return { wert: null, anzahl: 0, genug: false };
  const wert = werte.reduce((a, b) => a + b, 0) / werte.length;
  return { wert: Math.round(wert * 10) / 10, anzahl: werte.length, genug: werte.length >= MIN_WIEGUNGEN };
}

export function letzteMessung(messungen, art) {
  let l = null;
  for (const m of messungen) if (m.art === art && (!l || m.datum > l.datum || (m.datum === l.datum && (m.zeit || '') > (l.zeit || '')))) l = m;
  return l;
}

// Gewicht für Berechnungen: 7-Tage-Mittel, sonst letzter Wert
export function rechenGewicht(messungen, heute) {
  const m = mittel7(messungen, heute);
  if (m.wert != null) return m.wert;
  return letzteMessung(messungen, 'gewicht')?.wert ?? null;
}
