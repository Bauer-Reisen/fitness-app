// Tagesbedarf kcal und Eiweiß (docs/ANFORDERUNGEN.md, Abschnitt 1b). Ohne Bildschirm-Code.
// Quellen: Mifflin et al. 1990 (Am J Clin Nutr 51:241); PAL-Stufen nach DGE (1,4 sitzend · 1,6 sitzend mit
// zeitweise Gehen/Stehen · 1,8 überwiegend gehend/stehend); Gerätetraining 3,5 MET (Compendium 2024, Code 02054);
// Eiweiß: ISSN Position Stand Jäger et al. 2017 (1,4–2,0 g/kg), Morton et al. 2018; DGE 0,8 g/kg als Untergrenze.

export const ALLTAG = {
  1.4: 'überwiegend sitzend (z. B. Büro)',
  1.6: 'sitzend, zeitweise gehend oder stehend',
  1.8: 'überwiegend gehend oder stehend',
};
// Rekomposition = Fett ab und Muskeln auf zugleich: nur kleines Defizit, viel Eiweiß
// (Barakat et al. 2020, Strength Cond J 42(5):7–21; −10 % / höchstens −300 kcal ist übliche Praxis, ungeprüft).
export const ZIELE = {
  rekomposition: { name: 'Fett ab, Muskeln auf', kcalFaktor: -0.10, eiweiss: 2.0, maxMinus: 300 },
  halten: { name: 'Halten', kcalFaktor: 0, eiweiss: 1.6 },
  aufbau: { name: 'Aufbau', kcalFaktor: 0.10, eiweiss: 1.8 },
  abnehmen: { name: 'Abnehmen', kcalFaktor: -0.20, eiweiss: 2.0, maxMinus: 500 },
};
export const MET_GERAETETRAINING = 3.5;
export const EIWEISS_MIN = 0.8;
export const STANDARD_MINUTEN = 60;

export function grundumsatz({ kg, cm, alter, geschlecht }) {
  const basis = 10 * kg + 6.25 * cm - 5 * alter;
  return geschlecht === 'w' ? basis - 161 : basis + 5;
}

const runde = (x, auf) => Math.round(x / auf) * auf;

// trainingMinuten: null = Pausentag
export function tagesbedarf({ kg, cm, alter, geschlecht, alltag = 1.4, ziel = 'halten', trainingMinuten = null, met = MET_GERAETETRAINING }) {
  if (!kg || !cm || alter == null) return null;
  const gu = grundumsatz({ kg, cm, alter, geschlecht });
  const pausentag = gu * alltag;
  const zuschlag = trainingMinuten != null ? (met - 1) * kg * (trainingMinuten / 60) : 0;
  const tag = pausentag + zuschlag;
  const z = ZIELE[ziel] || ZIELE.halten;
  let delta = tag * z.kcalFaktor;
  if (z.maxMinus && delta < -z.maxMinus) delta = -z.maxMinus;
  const kcal = Math.max(gu, tag + delta);
  const eiweiss = Math.max(EIWEISS_MIN, z.eiweiss) * kg;
  return {
    kcal: runde(kcal, 50), eiweiss: runde(eiweiss, 5),
    grundumsatz: Math.round(gu), pausentag: Math.round(pausentag), zuschlag: Math.round(zuschlag),
    zielDelta: Math.round(delta), trainingstag: trainingMinuten != null,
  };
}
