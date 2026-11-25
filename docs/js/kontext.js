// Lädt alles Nötige aus dem Speicher und baut daraus den „Kontext“ für Vorschlag und Bedarf.
import { alle, kv } from './db.js?v=0.1.2';
import { GERAETE, UEBUNGEN } from './katalog.js?v=0.1.2';
import { stufenAusVorschlag } from './stufen.js?v=0.1.2';
import { heuteIso, alterAm } from './datum.js?v=0.1.2';
import { rechenGewicht } from './koerper.js?v=0.1.2';
import { tagesbedarf, STANDARD_MINUTEN } from './bedarf.js?v=0.1.2';
import { aktiv } from './gelenke.js?v=0.1.2';

export async function ladeGeraete() {
  const gespeichert = await alle('geraete');
  const map = new Map(gespeichert.map((g) => [g.id, g]));
  const out = {};
  for (const v of GERAETE) {
    const s = map.get(v.id) || {};
    out[v.id] = {
      ...v, vorlage: true,
      vorhanden: s.vorhanden ?? !!v.standard,
      stufen: s.stufen ?? stufenAusVorschlag(v.stufen),
      zusatz: s.zusatz ?? [0],
      anzeige: s.anzeige ?? 'kg',
      werte: s.werte ?? {},
      notiz: s.notiz ?? '',
      uebungenExtra: s.uebungenExtra ?? [],
    };
  }
  for (const s of gespeichert) if (s.eigen) out[s.id] = { werte: {}, zusatz: [0], anzeige: 'kg', uebungenExtra: [], ...s };
  return out;
}

export async function ladeUebungen(geraete) {
  const eigene = await alle('uebungen');
  const liste = [...UEBUNGEN, ...eigene.map((u) => ({ ...u, eigen: true }))].map((u) => ({ ...u, geraete: [...u.geraete] }));
  // Übungen, die einem eigenen Gerät zugeordnet wurden
  for (const g of Object.values(geraete)) {
    for (const uid of g.uebungenExtra || []) {
      const u = liste.find((x) => x.id === uid);
      if (u && !u.geraete.includes(g.id)) u.geraete.push(g.id);
    }
  }
  return liste;
}

export async function ladeTrainings() {
  const t = await alle('trainings');
  return t.sort((a, b) => (a.start < b.start ? -1 : 1));
}

export async function ladeKontext() {
  const heute = heuteIso();
  const [profile, einschraenkungen, staendeListe, trainings, saetze] = await Promise.all([
    alle('profil'), alle('einschraenkungen'), alle('geraetUebung'), ladeTrainings(), alle('saetze'),
  ]);
  const geraete = await ladeGeraete();
  const uebungen = await ladeUebungen(geraete);
  const beendet = trainings.filter((t) => t.status === 'beendet');
  const letztes = beendet[beendet.length - 1] || null;
  const schmerzLetztes = new Set(letztes ? saetze.filter((s) => s.trainingId === letztes.id && s.schmerz).map((s) => s.paarId) : []);
  const mitFoerder = beendet.filter((t) => (t.schritte || []).some((s) => s.rolle === 'foerder'));
  return {
    heute, jetzt: Date.now(),
    profil: profile[0] || null,
    einschraenkungen: aktiv(einschraenkungen),
    alleEinschraenkungen: einschraenkungen,
    geraete, uebungen,
    staende: Object.fromEntries(staendeListe.map((s) => [s.id, s])),
    trainings, saetze,
    letztesTraining: letztes ? { ...letztes, ende: letztes.endeMs } : null,
    laufend: trainings.find((t) => t.status === 'laeuft') || null,
    schmerzLetztes,
    foerderZaehler: mitFoerder.length,
    ersteFoerderAm: mitFoerder[0]?.datum || null,
  };
}

// Tagesbedarf für ein Datum (Trainingstag, wenn ein Training gestartet wurde oder „heute trainiere ich noch“)
export async function bedarfFuer(datum = heuteIso()) {
  const [profile, messungen, trainings] = await Promise.all([alle('profil'), alle('messungen'), alle('trainings')]);
  const p = profile[0];
  if (!p) return null;
  const kg = rechenGewicht(messungen, datum);
  const tagesTrainings = trainings.filter((t) => t.datum === datum);
  const geplant = (await kv.get('heuteTraining')) === datum;
  let minuten = null;
  if (tagesTrainings.length) {
    minuten = tagesTrainings.reduce((s, t) => s + (t.endeMs && t.startMs ? Math.max(10, (t.endeMs - t.startMs) / 60000) : STANDARD_MINUTEN), 0);
    minuten = Math.round(Math.min(minuten, 120));
  } else if (geplant) minuten = STANDARD_MINUTEN;
  const b = tagesbedarf({
    kg, cm: p.groesseCm, alter: alterAm(p.geburtsdatum, datum), geschlecht: p.geschlecht,
    alltag: p.alltagsfaktor || 1.4, ziel: p.ziel || 'halten', trainingMinuten: minuten,
  });
  return b ? { ...b, kg, minuten, geplant } : null;
}
