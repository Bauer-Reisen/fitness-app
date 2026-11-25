// Körperdaten: Mittelwerte und Verlauf. Ohne Bildschirm-Code.
import { plusTage } from './datum.js?v=0.1.3';

// anleitung: Taille nach WHO-STEPS; die übrigen Messpunkte sind übliche Praxis, keine Norm (ungeprüft).
export const MESSARTEN = {
  gewicht: { name: 'Gewicht', einheit: 'kg', stellen: 1 },
  taille: { name: 'Taille', einheit: 'cm', stellen: 1, ziel: 'kleiner', anleitung: 'Im Stehen, auf nackter Haut, Arme hängen lassen. Maßband waagerecht in der Mitte zwischen unterster Rippe und Oberkante des Beckenknochens, am Ende einer normalen Ausatmung (WHO).' },
  brust: { name: 'Brust', einheit: 'cm', stellen: 1, ziel: 'groesser', anleitung: 'Im Stehen, Arme hängen lassen, Maßband waagerecht auf Höhe der Brustwarzen, am Ende einer normalen Ausatmung.' },
  oberarm: { name: 'Oberarm', einheit: 'cm', stellen: 1, ziel: 'groesser', anleitung: 'Arm locker hängen lassen (nicht anspannen), an der dicksten Stelle messen. Immer dieselbe Seite.' },
  oberschenkel: { name: 'Oberschenkel', einheit: 'cm', stellen: 1, ziel: 'groesser', anleitung: 'Im Stehen, Gewicht auf beiden Beinen, 15 cm über der Kniescheibe messen. Immer dieselbe Seite.' },
};
export const UMFAENGE = ['taille', 'brust', 'oberarm', 'oberschenkel'];

// Erster und letzter Wert einer Messart (für die Veränderung)
export function verlauf(messungen, art) {
  const l = messungen.filter((m) => m.art === art).sort((a, b) => (a.datum < b.datum ? -1 : a.datum > b.datum ? 1 : (a.zeit || '') < (b.zeit || '') ? -1 : 1));
  return { erster: l[0] || null, letzter: l[l.length - 1] || null, anzahl: l.length, liste: l };
}

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
