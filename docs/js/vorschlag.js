// Trainingsvorschlag und Steigerung (docs/ANFORDERUNGEN.md, Abschnitt 1a und 1c). Ohne Bildschirm-Code.
import { R } from './regeln.js?v=0.1.3';
import { HAUPTMUSTER, MUSTER } from './katalog.js?v=0.1.3';
import { bewerte, hueftEintraege, handEintraege } from './gelenke.js?v=0.1.3';
import { kombiniert, sprung, anzeige } from './stufen.js?v=0.1.3';
import { plusTage, tageZwischen, stundenZwischen } from './datum.js?v=0.1.3';

export const paarId = (geraetId, uebungId) => `${geraetId}:${uebungId}`;

export function typVon(uebung, geraet) {
  if (uebung.art) return uebung.art;
  return geraet?.art || 'koerper';
}

export function bereichVon(typ, rolle, stand = {}) {
  if (typ === 'zeit') return { min: R.zeit.min, max: R.zeit.max };
  if (typ === 'koerper') return { min: R.koerper.min, max: R.koerper.max };
  if (typ === 'ball' || rolle === 'foerder') return { min: R.foerder.min, max: R.foerder.max };
  return { min: stand.untergrenze ?? R.kg.min, max: stand.obergrenze ?? R.kg.max };
}

const hatStufen = typ => typ === 'kg' || typ === 'ball';

export function neuerStand(uebung, geraet, rolle, ctx) {
  const typ = typVon(uebung, geraet);
  const muster = uebung.muster === 'foerderung' ? 'beine' : uebung.muster;
  let erfahrung = ctx.profil?.erfahrung?.[muster] || 'neu';
  // Gelenkeinträge verlängern den Einstieg nicht – gebremst wird über das Feedback (Schmerz, Gelenk am Folgetag).
  const tage = R.einstiegTage[erfahrung] ?? R.einstiegTage.neu;
  const bereich = bereichVon(typ, rolle);
  let ziel = typ === 'zeit' ? R.zeit.start : typ === 'koerper' ? R.koerper.start : Math.min(bereich.max, Math.max(bereich.min, 10));
  return {
    id: paarId(geraet.id, uebung.id), geraetId: geraet.id, uebungId: uebung.id,
    stufenIndex: 0, ziel, einstiegBis: plusTage(ctx.heute, tage),
    erfuelltInFolge: 0, verfehltInFolge: 0, easyInFolge: 0, sperreTrainings: 0, gelenkSchlechterInFolge: 0,
    erstesTraining: true, letztesDatum: null, ausgeblendet: 'nein',
  };
}

// Alle Paare (Übung, Gerät) eines Musters, die nutzbar sind
export function paare(ctx, filter) {
  const out = [];
  for (const u of ctx.uebungen) {
    if (!filter(u)) continue;
    for (const gid of u.geraete) {
      const g = ctx.geraete[gid];
      if (!g || !g.vorhanden) continue;
      const st = ctx.staende[paarId(gid, u.id)];
      if (st && st.ausgeblendet && st.ausgeblendet !== 'nein') continue;
      if (u.ausgeblendet) continue;
      out.push({ uebung: u, geraet: g, id: paarId(gid, u.id) });
    }
  }
  return out;
}

// Auswahl je Muster: ausgeblendete raus → (markiert nach hinten, Hüfte: begrenzbar/gering zuerst, Priorität)
export function sortiere(liste, ctx, muster) {
  const huefte = hueftEintraege(ctx.einschraenkungen).length > 0;
  return liste
    .map(p => ({ ...p, bew: bewerte(p.uebung, ctx.einschraenkungen) }))
    .filter(p => p.bew.status !== 'aus')
    .map((p, i) => {
      const b = p.uebung.b || {};
      const hueftKey = huefte && muster === 'beine' ? (b.begrenzbar || b.hueftbeugung === 'gering' ? 0 : 1) : 0;
      return { ...p, key: [p.bew.status === 'hinten' ? 1 : 0, hueftKey, p.uebung.prio ?? 99, i] };
    })
    .sort((a, b) => { for (let k = 0; k < 4; k++) if (a.key[k] !== b.key[k]) return a.key[k] - b.key[k]; return 0; });
}

// Alternative im selben Muster (z. B. nach „zu viel“ oder Gerät besetzt)
export function alternativen(ctx, muster, ausschluss = new Set(), foerderZiel = null) {
  const liste = paare(ctx, u => foerderZiel ? u.foerder === foerderZiel : u.muster === muster);
  return sortiere(liste.filter(p => !ausschluss.has(p.id) && !ausschluss.has(p.uebung.id)), ctx, muster);
}

const FOERDER_REIHE = ['abduktion', 'streckung', 'kontrolle'];

export function vorgabeBerechnen(stand, uebung, geraet, rolle, ctx) {
  const typ = typVon(uebung, geraet);
  const bereich = bereichVon(typ, rolle, stand);
  const gruende = [];
  let stufenIndex = stand.stufenIndex;
  let ziel = stand.ziel;
  let keineErhoehung = false, resetZaehler = false;
  const standAenderung = {};
  const n = kombiniert(geraet).length;

  let saetze;
  if (rolle === 'foerder') {
    const ab = ctx.ersteFoerderAm;
    saetze = !ab || tageZwischen(ab, ctx.heute) < R.foerderEinstiegTage ? R.saetzeEinstieg : R.saetze;
  } else {
    saetze = stand.einstiegBis && ctx.heute < stand.einstiegBis ? R.saetzeEinstieg : R.saetze;
    if (saetze === R.saetzeEinstieg) gruende.push('Einstieg: 2 Sätze, bewusst leicht');
  }

  // Pause seit dieser Übung
  if (stand.letztesDatum) {
    const d = tageZwischen(stand.letztesDatum, ctx.heute);
    if (d > R.pauseMinusEinsBis) {
      if (hatStufen(typ)) stufenIndex = Math.max(0, stufenIndex - 2);
      else ziel = Math.max(bereich.min, Math.round(ziel * 0.7));
      standAenderung.einstiegBis = plusTage(ctx.heute, R.pauseNeuEinstiegTage);
      saetze = R.saetzeEinstieg; resetZaehler = true;
      gruende.push(`${d} Tage Pause: leichter wieder einsteigen`);
    } else if (d > R.pauseOhneSteigerungBis) {
      if (hatStufen(typ)) stufenIndex = Math.max(0, stufenIndex - 1);
      else ziel = Math.max(bereich.min, ziel - 2);
      saetze = R.saetzeEinstieg; resetZaehler = true;
      gruende.push(`${d} Tage Pause: eine Stufe leichter`);
    } else if (d > R.pauseNormalBis) {
      keineErhoehung = true; resetZaehler = true;
      ziel = Math.max(typ === 'zeit' ? R.zeit.min : 1, ziel - (typ === 'zeit' ? 10 : 2));
      gruende.push(`${d} Tage Pause: heute ohne Steigerung`);
    }
  }

  // Kurzer Abstand zum letzten Training
  const lt = ctx.letztesTraining;
  if (lt?.ende && stundenZwischen(lt.ende, ctx.jetzt) < R.kurzerAbstandStunden) {
    keineErhoehung = true; saetze -= 1;
    gruende.push('weniger als 48 h seit dem letzten Training');
  }
  // Muskelkater stark in dieser Gruppe
  const nb = lt?.nachbefragung;
  if (nb?.stufe === 'stark' && (!nb.gruppen?.length || nb.gruppen.includes(uebung.gruppe))) {
    keineErhoehung = true; saetze -= 1;
    gruende.push('starker Muskelkater gemeldet');
  }
  // Gelenk schlechter als sonst nach Schmerzmeldung an dieser Übung
  if (nb?.gelenkSchlechter && ctx.schmerzLetztes?.has(stand.id)) {
    keineErhoehung = true; saetze -= 1;
    gruende.push('Gelenk war danach schlechter als sonst');
  }
  if ((stand.sperreTrainings || 0) > 0) {
    keineErhoehung = true;
    gruende.push('letztes Mal Schmerz gemeldet: Gewicht bleibt');
  }
  const test = !!stand.erstesTraining;

  saetze = Math.max(1, saetze);
  stufenIndex = Math.max(0, Math.min(stufenIndex, Math.max(0, n - 1)));
  return { typ, bereich, stufenIndex, ziel, saetze, keineErhoehung, resetZaehler, gruende, standAenderung, test };
}

// Plan für heute
export function planErstellen(ctx) {
  const schritte = [];
  const hinweise = [];
  const gewaehlt = new Set();
  const huefte = hueftEintraege(ctx.einschraenkungen);
  const hand = handEintraege(ctx.einschraenkungen);

  schritte.push({ typ: 'aufwaermen', optionen: alternativen(ctx, 'ausdauer').map(p => ({ id: p.id, name: p.uebung.name, geraetId: p.geraet.id })) });
  if (huefte.length) schritte.push({ typ: 'mobilitaet' });

  const uebungSchritt = (p, rolle) => {
    const stand = ctx.staende[p.id] || neuerStand(p.uebung, p.geraet, rolle, ctx);
    gewaehlt.add(p.id); gewaehlt.add(p.uebung.id);
    return {
      typ: 'uebung', id: p.id, uebungId: p.uebung.id, geraetId: p.geraet.id, rolle,
      vorgabe: vorgabeBerechnen(stand, p.uebung, p.geraet, rolle, ctx),
      hinweise: p.bew?.hinweise || [], neu: !ctx.staende[p.id],
    };
  };

  for (const muster of HAUPTMUSTER) {
    const liste = alternativen(ctx, muster, gewaehlt);
    if (!liste.length) { hinweise.push(`${MUSTER[muster]} entfällt heute: keine passende Übung (Gerät abhaken oder Übung einblenden).`); continue; }
    schritte.push(uebungSchritt(liste[0], 'haupt'));
  }

  const anzahl = Math.min(2, huefte.length);
  const start = (ctx.foerderZaehler || 0) % FOERDER_REIHE.length;
  for (let k = 0, versuch = 0; k < anzahl && versuch < FOERDER_REIHE.length; versuch++) {
    const ziel = FOERDER_REIHE[(start + versuch) % FOERDER_REIHE.length];
    const liste = alternativen(ctx, 'foerderung', gewaehlt, ziel);
    if (liste.length) { schritte.push({ ...uebungSchritt(liste[0], 'foerder'), foerderZiel: ziel }); k++; }
  }
  if (hand.length) schritte.push({ typ: 'hand' });
  schritte.push({ typ: 'abschluss' });
  return { schritte, hinweise };
}

// Folgesatz im selben Training. zustand: { stufenIndex, ziel, erhoeht, easyFolge, keineErhoehung }
export function folgesatz(zustand, satz, vorgabe, geraet) {
  const z = { ...zustand };
  const typ = vorgabe.typ;
  const n = kombiniert(geraet).length;
  let text = '';
  if (satz.schmerz === 'gehtNoch') z.keineErhoehung = true;
  const f = satz.feedback;
  if (f === 'nichtBewertet') return { zustand: z, text: 'Satz nicht bewertet – Vorgabe bleibt.' };

  // Erster Satz einer neuen Übung ohne Gewichtsstufen = Test: das Ergebnis wird die Vorgabe
  if (vorgabe.test && satz.nr === 1 && !hatStufen(typ)) {
    z.ziel = testZiel(satz.wert, f, typ, vorgabe.bereich);
    const einheit = typ === 'zeit' ? ' s' : ' Wdh.';
    return { zustand: z, text: `Test gemerkt: nächste Sätze ${z.ziel}${einheit}`.replace(/\.\.$/, '.') };
  }

  if (hatStufen(typ)) {
    z.stufenIndex = satz.stufenIndex; // tatsächlich genutzte Stufe gilt weiter
    if (f === 'easy') {
      z.easyFolge = (z.easyFolge || 0) + 1;
      if (z.easyFolge >= 2 && !z.erhoeht && !z.keineErhoehung && z.stufenIndex < n - 1) {
        z.stufenIndex++; z.erhoeht = true; z.easyFolge = 0;
        text = `Nächster Satz: ${anzeige(geraet, z.stufenIndex)} (+1 Stufe, weil 2× easy).`;
      } else if (z.ziel < vorgabe.bereich.max) {
        z.ziel = Math.min(vorgabe.bereich.max, z.ziel + 2);
        text = `Nächster Satz: ${z.ziel} Wdh. (+2, weil easy).`;
      } else text = 'Nächster Satz: gleich.';
    } else if (f === 'passend') {
      z.easyFolge = 0; text = 'Nächster Satz: gleich.';
    } else if (f === 'geradeSo') {
      z.easyFolge = 0; z.ziel = Math.max(1, z.ziel - 1);
      text = `Nächster Satz: ${z.ziel} Wdh. (−1, weil gerade so).`;
    } else if (f === 'nichtGeschafft') {
      z.easyFolge = 0;
      if (z.stufenIndex > 0) { z.stufenIndex--; text = `Nächster Satz: ${anzeige(geraet, z.stufenIndex)} (−1 Stufe).`; }
      else { z.ziel = Math.max(1, z.ziel - 2); text = `Nächster Satz: ${z.ziel} Wdh.`; }
    }
  } else {
    const schritt = typ === 'zeit' ? R.zeit.schritt : 2;
    const einheit = typ === 'zeit' ? 's' : ' Wdh.';
    if (f === 'easy') { z.ziel = Math.min(vorgabe.bereich.max, z.ziel + schritt); text = `Nächster Satz: ${z.ziel}${einheit}.`; }
    else if (f === 'geradeSo') { z.ziel = Math.max(vorgabe.bereich.min, z.ziel - (typ === 'zeit' ? 5 : 1)); text = `Nächster Satz: ${z.ziel}${einheit}.`; }
    else if (f === 'nichtGeschafft') { z.ziel = Math.max(vorgabe.bereich.min, Math.min(z.ziel - schritt, satz.wert ?? z.ziel)); text = `Nächster Satz: ${z.ziel}${einheit}.`; }
    else text = 'Nächster Satz: gleich.';
  }
  if (z.keineErhoehung && satz.schmerz === 'gehtNoch') text += ' Schmerz gemeldet: keine Erhöhung.';
  return { zustand: z, text };
}

const OK = ['passend', 'easy'];

// Aus dem Test-Satz die Vorgabe ableiten (Reserve von 2–3 Wdh. ist im Test schon drin)
export function testZiel(wert, feedback, typ, bereich) {
  const schritt = typ === 'zeit' ? R.zeit.schritt : 2;
  let z = wert ?? 0;
  if (feedback === 'easy') z += schritt;
  else if (feedback === 'geradeSo') z -= typ === 'zeit' ? 5 : 1;
  else if (feedback === 'nichtGeschafft') z -= schritt;
  return Math.max(bereich.min, Math.min(bereich.max, Math.round(z)));
}

// Auswertung nach dem Training → neuer Stand und Text für „Nächstes Mal“
export function auswerten(stand, vorgabe, saetze, geraet, ctx, rolle = 'haupt') {
  const typ = vorgabe.typ;
  const neu = { ...stand, ...vorgabe.standAenderung, letztesDatum: ctx.heute };
  const bewertet = saetze.filter(s => s.feedback && s.feedback !== 'nichtBewertet');
  const zuViel = saetze.some(s => s.schmerz === 'zuViel');
  const gehtNoch = saetze.some(s => s.schmerz === 'gehtNoch');
  const sperre = vorgabe.keineErhoehung || zuViel || gehtNoch;
  neu.sperreTrainings = zuViel || gehtNoch ? 1 : Math.max(0, (stand.sperreTrainings || 0) - 1);
  if (vorgabe.resetZaehler) Object.assign(neu, { erfuelltInFolge: 0, verfehltInFolge: 0, easyInFolge: 0 });
  const n = kombiniert(geraet).length;
  const wert = s => (typ === 'zeit' ? s.sekunden : s.wdh) ?? 0;
  const zeige = i => anzeige(geraet, i);
  let text = 'bleibt gleich';
  let richtung = 'gleich';

  if (!bewertet.length) {
    neu.stufenIndex = vorgabe.stufenIndex; neu.ziel = vorgabe.ziel;
    if (stand.erstesTraining && saetze.length && hatStufen(typ)) { neu.stufenIndex = saetze[saetze.length - 1].stufenIndex; neu.erstesTraining = false; }
    return { stand: neu, text: zuViel ? 'Schmerz „zu viel“: nächstes Mal keine Erhöhung' : 'nicht bewertet – bleibt gleich', richtung };
  }
  const letzter = bewertet[bewertet.length - 1];

  if (stand.erstesTraining) {
    neu.erstesTraining = false;
    if (hatStufen(typ)) neu.stufenIndex = letzter.stufenIndex;
    neu.ziel = vorgabe.ziel;
    if (!hatStufen(typ)) {
      // Startwert aus dem Test-Satz (erster bewerteter Satz)
      neu.ziel = testZiel(wert(bewertet[0]), bewertet[0].feedback, typ, bereichVon(typ, rolle, stand));
      const einheit = typ === 'zeit' ? ' s' : ' Wdh.';
      return { stand: neu, text: `Startwert gemerkt: ${neu.ziel}${einheit}`, richtung };
    }
    const aufwand = bewertet.every(s => s.feedback === 'easy') && !sperre;
    if (aufwand && hatStufen(typ) && neu.stufenIndex < n - 1) { neu.stufenIndex++; text = `Startgewicht war leicht: nächstes Mal ${zeige(neu.stufenIndex)}`; richtung = 'hoch'; }
    else text = hatStufen(typ) ? `Startgewicht gemerkt: ${zeige(neu.stufenIndex)}` : 'Startwert gemerkt';
    return { stand: neu, text, richtung };
  }

  const verfehlt = bewertet.some(s => s.feedback === 'nichtGeschafft');
  const zielErreicht = bewertet.every(s => wert(s) >= vorgabe.ziel && OK.includes(s.feedback));
  const halbEasy = bewertet.filter(s => s.feedback === 'easy').length * 2 >= bewertet.length;
  const bereich = bereichVon(typ, rolle, stand);

  if (verfehlt) {
    neu.verfehltInFolge = (neu.verfehltInFolge || 0) + 1;
    neu.erfuelltInFolge = 0; neu.easyInFolge = 0;
    neu.stufenIndex = vorgabe.stufenIndex; neu.ziel = vorgabe.ziel;
    if (neu.verfehltInFolge >= 2) {
      neu.verfehltInFolge = 0; richtung = 'runter';
      if (hatStufen(typ) && neu.stufenIndex > 0) {
        neu.stufenIndex--; neu.ziel = Math.min(bereich.max, Math.max(bereich.min, R.zielNachFehlschlag));
        text = `${zeige(neu.stufenIndex)} (−1 Stufe, weil 2× in Folge nicht geschafft)`;
      } else {
        neu.ziel = Math.max(bereich.min, neu.ziel - (typ === 'zeit' ? R.zeit.schritt : 2));
        text = `${neu.ziel}${typ === 'zeit' ? ' s' : ' Wdh.'} (weniger, weil 2× in Folge nicht geschafft)`;
      }
    } else text = 'gleiches Gewicht (einmal nicht geschafft)';
    return { stand: neu, text, richtung };
  }

  neu.verfehltInFolge = 0;
  if (!hatStufen(typ)) {
    neu.ziel = vorgabe.ziel;
    neu.erfuelltInFolge = zielErreicht ? (neu.erfuelltInFolge || 0) + 1 : 0;
    const schritt = typ === 'zeit' ? R.zeit.schritt : 1;
    const noetig = typ === 'zeit' ? 2 : 1;
    if (!sperre && zielErreicht && neu.erfuelltInFolge >= noetig && neu.ziel < bereich.max) {
      neu.ziel = Math.min(bereich.max, neu.ziel + schritt); neu.erfuelltInFolge = 0; richtung = 'hoch';
      text = `${neu.ziel}${typ === 'zeit' ? ' s' : ' Wdh.'} (+${schritt})`;
    } else if (zielErreicht && neu.ziel >= bereich.max) text = 'Obergrenze erreicht – schwerere Variante wählen';
    else if (sperre) text = 'bleibt (keine Erhöhung heute)';
    return { stand: neu, text, richtung };
  }

  // Stufen (kg, Ball)
  let base = letzter.stufenIndex;
  if (base > vorgabe.stufenIndex) {
    // im Training schon gesteigert und geschafft
    neu.stufenIndex = base; neu.ziel = bereich.min;
    Object.assign(neu, { erfuelltInFolge: 0, easyInFolge: 0 });
    return { stand: neu, text: `${zeige(base)} (im Training gesteigert)`, richtung: 'hoch' };
  }
  base = vorgabe.stufenIndex;
  neu.stufenIndex = base; neu.ziel = vorgabe.ziel;
  neu.easyInFolge = halbEasy ? (neu.easyInFolge || 0) + 1 : 0;
  const erfuellt = zielErreicht && vorgabe.ziel >= bereich.max;
  neu.erfuelltInFolge = erfuellt ? (neu.erfuelltInFolge || 0) + 1 : 0;

  if (!sperre && (neu.erfuelltInFolge >= 2 || neu.easyInFolge >= 2)) {
    if (base >= n - 1) return { stand: neu, text: 'oberste Stufe erreicht – mehr Wdh. oder einarmig/einbeinig', richtung };
    const sp = sprung(geraet, base);
    const grosserSprung = typ === 'kg' && rolle === 'haupt' && sp > R.grosserSprung;
    if (grosserSprung && (stand.obergrenze ?? R.kg.max) < R.kg.maxGrosserSprung) {
      neu.obergrenze = R.kg.maxGrosserSprung;
      neu.ziel = Math.min(R.kg.maxGrosserSprung, neu.ziel + 1);
      Object.assign(neu, { erfuelltInFolge: 0, easyInFolge: 0 });
      return { stand: neu, text: `nächste Stufe ist ein großer Sprung (+${Math.round(sp * 100)} %) – erst bis ${R.kg.maxGrosserSprung} Wdh.`, richtung: 'hoch' };
    }
    neu.stufenIndex = base + 1;
    Object.assign(neu, { erfuelltInFolge: 0, easyInFolge: 0 });
    if (grosserSprung) { neu.untergrenze = R.kg.zielNachGrossemSprung; neu.ziel = R.kg.zielNachGrossemSprung; }
    else { delete neu.untergrenze; neu.ziel = rolle === 'foerder' || typ === 'ball' ? R.foerder.min : R.kg.min; }
    delete neu.obergrenze;
    return { stand: neu, text: `${zeige(neu.stufenIndex)} (+1 Stufe, weil 2× ${erfuellt ? 'alles geschafft' : 'easy'})`, richtung: 'hoch' };
  }
  if (!sperre && zielErreicht && neu.ziel < bereich.max) {
    neu.ziel += 1;
    return { stand: neu, text: `${zeige(base)} × ${neu.ziel} Wdh. (+1 Wdh.)`, richtung: 'hoch' };
  }
  if (sperre) text = 'Gewicht bleibt (keine Erhöhung heute)';
  else if (erfuellt) text = 'Obergrenze geschafft – noch einmal bestätigen, dann +1 Stufe';
  return { stand: neu, text, richtung };
}

// Nachbefragung „Gelenk schlechter als sonst“ auf eine Übung mit Schmerzmeldung anwenden
export function nachbefragungAnwenden(stand, gelenkSchlechter) {
  const neu = { ...stand };
  if (gelenkSchlechter) {
    neu.gelenkSchlechterInFolge = (neu.gelenkSchlechterInFolge || 0) + 1;
    if (neu.gelenkSchlechterInFolge >= 2) neu.ausgeblendet = 'vorsorglich';
  } else neu.gelenkSchlechterInFolge = 0;
  return neu;
}

// Mobilitätseinheit / Handprogramm: { wdh, okInFolge }
export function mobilNeu(stand, feedback) {
  const s = { wdh: R.mobilStart, okInFolge: 0, ...stand };
  if (feedback === 'gut') {
    s.okInFolge++;
    if (s.okInFolge >= 2 && s.wdh < R.mobilMax) { s.wdh++; s.okInFolge = 0; }
  } else if (feedback === 'schmerz') s.okInFolge = 0;
  s.weiterBewegen = s.wdh >= R.mobilMax && s.okInFolge >= 2;
  return s;
}
