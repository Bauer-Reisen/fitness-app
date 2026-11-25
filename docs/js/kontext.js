// Lädt alles Nötige aus dem Speicher und baut daraus den „Kontext“ für Vorschlag und Bedarf.
import { alle, kv, speichere } from './db.js?v=0.1.9';
import { GERAETE, UEBUNGEN } from './katalog.js?v=0.1.9';
import { stufenAusVorschlag } from './stufen.js?v=0.1.9';
import { heuteIso, alterAm } from './datum.js?v=0.1.9';
import { rechenGewicht } from './koerper.js?v=0.1.9';
import { tagesbedarf, STANDARD_MINUTEN } from './bedarf.js?v=0.1.9';
import { aktiv } from './gelenke.js?v=0.1.9';
import { STUDIO, studioLabel } from './studio.js?v=0.1.9';

// Studio-Liste an (Standard) oder allgemeine Vorlagen
export const studioAn = async () => (await kv.get('studio')) !== 'aus';

export async function ladeGeraete() {
  const gespeichert = await alle('geraete');
  const map = new Map(gespeichert.map((g) => [g.id, g]));
  const out = {};
  const studio = await studioAn();
  for (const v of GERAETE) {
    const s = map.get(v.id) || {};
    const feld = studio ? 'vorhandenAllgemein' : 'vorhanden';
    out[v.id] = {
      ...v, vorlage: true, allgemein: true, vorhandenFeld: feld,
      vorhanden: studio ? (s.vorhandenAllgemein ?? false) : (s.vorhanden ?? !!v.standard),
      stufen: s.stufen ?? stufenAusVorschlag(v.stufen),
      zusatz: s.zusatz ?? [0],
      anzeige: s.anzeige ?? 'kg',
      werte: s.werte ?? {},
      notiz: s.notiz ?? '',
      uebungenExtra: s.uebungenExtra ?? [],
    };
  }
  if (studio) {
    for (const d of STUDIO) {
      const v = GERAETE.find((x) => x.id === d.typ);
      const s = map.get(d.id) || {};
      out[d.id] = {
        ...v, id: d.id, nr: d.nr, bereich: d.bereich, typ: d.typ, name: studioLabel(d), kurzname: d.name, aliase: v.aliase,
        studio: true, vorlage: true, vorhandenFeld: 'vorhanden', vorhanden: s.vorhanden ?? true,
        stufen: s.stufen ?? stufenAusVorschlag(d.stufen || v.stufen), stufenGeprueft: s.stufenGeprueft ?? false,
        zusatz: s.zusatz ?? [0], anzeige: s.anzeige ?? d.anzeige ?? 'kg', werte: s.werte ?? {}, notiz: s.notiz ?? '',
        uebungenExtra: [...new Set([...(d.uebungen || UEBUNGEN.filter((u) => u.geraete.includes(d.typ)).map((u) => u.id)), ...(s.uebungenExtra || [])])],
      };
    }
  }
  for (const s of gespeichert) if (s.eigen) out[s.id] = { werte: {}, zusatz: [0], anzeige: 'kg', uebungenExtra: [], vorhandenFeld: 'vorhanden', ...s };
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

// Einmalig (ab 0.1.3): Einstieg bestehender Übungen auf die Erfahrung im Profil kürzen –
// vorher hat ein Gelenkeintrag den Einstieg auf 14 Tage verlängert.
export async function einstiegAnpassen() {
  if (await kv.get('einstiegAngepasst')) return;
  const [profile, staende] = await Promise.all([alle('profil'), alle('geraetUebung')]);
  const erf = profile[0]?.erfahrung || {};
  const muster = Object.fromEntries(UEBUNGEN.map((u) => [u.id, u.muster === 'foerderung' ? 'beine' : u.muster]));
  const TAGE = { neu: 14, frueher: 7, aktuell: 0 };
  for (const s of staende) {
    if (!s.einstiegBis) continue;
    const tage = TAGE[erf[muster[s.uebungId]] || 'neu'];
    const start = s.letztesDatum || heuteIso();
    const d = new Date(start + 'T12:00:00'); d.setDate(d.getDate() + tage);
    const bis = heuteIso(d);
    if (bis < s.einstiegBis) await speichere('geraetUebung', { ...s, einstiegBis: bis });
  }
  await kv.set('einstiegAngepasst', true);
}
