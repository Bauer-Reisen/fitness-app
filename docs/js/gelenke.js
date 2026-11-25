// Gelenkregeln (docs/ANFORDERUNGEN.md, Abschnitt 1c). Ohne Bildschirm-Code.
// Die App urteilt nicht medizinisch: Sie blendet vorsorglich aus, stellt nach hinten oder zeigt Hinweise –
// alles nach den eigenen Angaben und Vorgaben des Nutzers.

export const STELLEN = {
  huefte: 'Hüfte', daumen_hand: 'Daumen/Hand', knie: 'Knie', schulter: 'Schulter',
  ruecken: 'Rücken', sonstige: 'Sonstige',
};
export const ARTEN = {
  arthrose: 'Arthrose', gelenkersatz: 'Gelenkersatz (Prothese)', opGeplant: 'OP geplant',
  akut: 'akute Beschwerde/Verletzung', sonstiges: 'sonstiges',
};
export const VORGABEN = {
  beugung90: 'nicht über 90° beugen',
  innen: 'nicht nach innen drehen',
  aussen: 'nicht nach außen drehen',
  ueberkreuzen: 'Beine nicht überkreuzen',
  stoss: 'kein Springen/Laufen',
};

// Welche Stelle welches Muster betrifft (für den vorsichtigen Einstieg)
export const STELLE_MUSTER = {
  huefte: ['beine', 'foerderung'],
  daumen_hand: ['druecken', 'ziehen'],
  knie: ['beine'],
  schulter: ['druecken', 'ziehen'],
  ruecken: ['rumpf'],
  sonstige: [],
};

export const aktiv = einschraenkungen => (einschraenkungen || []).filter(e => e.status !== 'erledigt');
export const hueftEintraege = es => aktiv(es).filter(e => e.stelle === 'huefte' && ['arthrose', 'gelenkersatz', 'opGeplant'].includes(e.art));
export const handEintraege = es => aktiv(es).filter(e => e.stelle === 'daumen_hand' && e.art !== 'akut');

const RANG = { ok: 0, hinten: 1, aus: 2 };

// Bewertet eine Übung gegen alle aktiven Einschränkungen.
// Ergebnis: { status: 'ok'|'hinten'|'aus', hinweise: [], gruende: [] }
export function bewerte(uebung, einschraenkungen) {
  const b = uebung.b;
  let status = 'ok';
  const hinweise = new Set();
  const gruende = new Set();
  const setze = (s, grund) => { if (RANG[s] > RANG[status]) status = s; if (grund) gruende.add(grund); };
  const liste = aktiv(einschraenkungen);

  if (!b) {
    if (liste.some(e => ['huefte', 'daumen_hand'].includes(e.stelle))) hinweise.add('Belastung dieser eigenen Übung ist nicht erfasst – vorsichtig testen.');
    return { status, hinweise: [...hinweise], gruende: [] };
  }

  for (const e of liste) {
    if (e.stelle === 'huefte' && (e.art === 'arthrose' || e.art === 'opGeplant')) {
      if (b.stoss === 'hoch') setze('aus', 'Stoß/Sprung bei Hüftarthrose');
      if (b.hueftbeugung === 'tief') {
        if (b.begrenzbar) hinweise.add('Bewegungsumfang über Sitz/Anschlag begrenzen, nur im schmerzarmen Bereich.');
        else setze('hinten', 'tiefe Hüftbeugung, nicht begrenzbar');
      }
      if (b.hueftrotation !== 'nein') hinweise.add('Drehung in der Hüfte: nur im schmerzarmen Bereich.');
    }

    if (e.stelle === 'huefte' && e.art === 'gelenkersatz') {
      const v = e.vorgaben || {};
      if (v.weissNicht) {
        if (b.hueftbeugung === 'tief') setze('aus', 'tiefe Hüftbeugung – Vorgaben zur Prothese unbekannt');
        if (b.hueftrotation !== 'nein') setze('aus', 'Drehung in der Hüfte – Vorgaben zur Prothese unbekannt');
        if (b.adduktion !== 'nein') setze('aus', 'Bein zur Mitte – Vorgaben zur Prothese unbekannt');
      } else {
        const keine = !Object.keys(VORGABEN).some(k => v[k]);
        if (v.beugung90 && b.hueftbeugung === 'tief') {
          if (b.begrenzbar) hinweise.add('Pflicht laut deiner Vorgabe: Anschlag so einstellen, dass die Hüfte höchstens 90° gebeugt wird.');
          else setze('aus', 'Vorgabe: nicht über 90° beugen');
        }
        if (v.innen && ['innen', 'beide'].includes(b.hueftrotation)) setze('aus', 'Vorgabe: nicht nach innen drehen');
        if (v.aussen && ['aussen', 'beide'].includes(b.hueftrotation)) setze('aus', 'Vorgabe: nicht nach außen drehen');
        if (v.ueberkreuzen) {
          if (b.adduktion === 'ueber_mitte') setze('aus', 'Vorgabe: Beine nicht überkreuzen');
          if (b.adduktion === 'bis_mitte') hinweise.add('Laut deiner Vorgabe: Bein nicht über die Mitte führen.');
        }
        if (v.stoss && b.stoss === 'hoch') setze('aus', 'Vorgabe: kein Springen/Laufen');
        if (keine && (b.hueftbeugung === 'tief' || b.hueftrotation !== 'nein' || b.adduktion !== 'nein')) {
          hinweise.add('Hüftprothese: ärztliche Vorgaben zu Beugung, Drehung und Überkreuzen beachten.');
        }
      }
    }

    if (e.stelle === 'daumen_hand' && e.art !== 'akut') {
      if (b.griff === 'zug_stark' || b.griff === 'stuetz_flach') {
        setze('hinten', 'starker Griff belastet das Daumensattelgelenk');
        hinweise.add(b.griff === 'stuetz_flach'
          ? 'Daumen: auf Fäusten oder an Griffen stützen statt flacher Hand.'
          : 'Daumen: Griff ohne Daumen (Daumen auf der Seite der Finger) oder Zughilfen.');
      }
      if (b.griff === 'druck') hinweise.add('Mit offener Hand drücken, Daumen anlegen.');
      if (b.griff === 'ball') hinweise.add('Ball mit flachen Händen halten, nicht fest greifen.');
    }
  }
  return { status, hinweise: [...hinweise], gruende: [...gruende] };
}

// Vorsorglich ausgeblendet durch die Regeln? (vom Nutzer wieder einblendbar)
export const istAus = (uebung, es) => bewerte(uebung, es).status === 'aus';

// Seitlich pendeln: Text nach Vorgabe
export function mitUeberkreuzVorgabe(es) {
  return aktiv(es).some(e => e.stelle === 'huefte' && e.art === 'gelenkersatz' && (e.vorgaben?.ueberkreuzen || e.vorgaben?.weissNicht));
}

// Gelenkersatz mit OP vor weniger als 12 Monaten oder unbekannten Vorgaben → Hinweis bei jedem Trainingsstart
export function opHinweis(es, monatHeute, monateZwischen) {
  return aktiv(es).some(e => e.art === 'gelenkersatz' && (
    e.vorgaben?.weissNicht || (e.opMonat && monateZwischen(e.opMonat, monatHeute) < 12)));
}
