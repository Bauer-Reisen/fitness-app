// Prüft die Rechenlogik mit erfundenen Beispielen (keine echten Daten).
// Aufruf: node scripts/check-logik.js
import { GERAETE, UEBUNGEN, HAUPTMUSTER } from '../docs/js/katalog.js';
import { stufenAusVorschlag, kombiniert } from '../docs/js/stufen.js';
import { planErstellen, vorgabeBerechnen, folgesatz, auswerten, neuerStand, paarId, nachbefragungAnwenden, mobilNeu, alternativen } from '../docs/js/vorschlag.js';
import { bewerte } from '../docs/js/gelenke.js';
import { mittel7, rechenGewicht } from '../docs/js/koerper.js';
import { tagesbedarf, grundumsatz } from '../docs/js/bedarf.js';
import { wiedervorlage, katerFaellig, neueAbfrage } from '../docs/js/gesundheit.js';
import { alterAm, plusTage } from '../docs/js/datum.js';

let fehler = 0, ok = 0;
const pruefe = (name, bedingung, info = '') => {
  if (bedingung) ok++;
  else { fehler++; console.error(`✗ ${name}${info ? ' – ' + info : ''}`); }
};

// ---------- Katalog ----------
const ids = new Set();
for (const u of UEBUNGEN) {
  pruefe(`Übung ${u.id} eindeutig`, !ids.has(u.id)); ids.add(u.id);
  pruefe(`Übung ${u.id} hat Gerät`, u.geraete.every(g => GERAETE.some(x => x.id === g)));
  const b = u.b || {};
  pruefe(`Übung ${u.id} hat alle Merkmale`, ['griff', 'hueftbeugung', 'begrenzbar', 'hueftrotation', 'adduktion', 'stoss'].every(k => k in b));
}
pruefe('keine freien Gewichte', !GERAETE.some(g => /hantel|langhantel|kurzhantel|kettlebell/i.test(g.name)));
for (const m of HAUPTMUSTER) {
  pruefe(`Muster ${m} hat Übung`, UEBUNGEN.some(u => u.muster === m));
  pruefe(`Muster ${m} hat Übung ohne starken Griff`, UEBUNGEN.some(u => u.muster === m && !['zug_stark', 'stuetz_flach'].includes(u.b.griff)));
  pruefe(`Muster ${m} hat Übung mit wenig oder begrenzbarer Hüftbeugung`, UEBUNGEN.some(u => u.muster === m && (u.b.hueftbeugung === 'gering' || u.b.begrenzbar)));
}
for (const z of ['abduktion', 'streckung', 'kontrolle']) pruefe(`Förderziel ${z}`, UEBUNGEN.some(u => u.foerder === z));

// ---------- Studio-Liste ----------
{
  const { STUDIO } = await import('../docs/js/studio.js');
  const ids = new Set();
  for (const d of STUDIO) {
    pruefe(`Studiogerät ${d.id} eindeutig`, !ids.has(d.id)); ids.add(d.id);
    pruefe(`Studiogerät ${d.id}: Vorlage ${d.typ} gibt es`, GERAETE.some((g) => g.id === d.typ));
    for (const u of d.uebungen || []) pruefe(`Studiogerät ${d.id}: Übung ${u} gibt es`, UEBUNGEN.some((x) => x.id === u));
  }
  pruefe('Studio: Nummern 1–33 vollständig', [...Array(33)].every((_, i) => STUDIO.some((d) => d.bereich === 'haupt' && d.nr === i + 1)));
}

// ---------- Hilfen für Testfälle ----------
const HEUTE = '2026-12-01';
const jetzt = new Date(HEUTE + 'T18:00:00').getTime();
function geraeteAlle(vorhanden = true) {
  const g = {};
  for (const x of GERAETE) g[x.id] = { ...x, vorhanden, stufen: stufenAusVorschlag(x.stufen), zusatz: [0], anzeige: 'kg' };
  return g;
}
function ctxBasis(extra = {}) {
  return {
    heute: HEUTE, jetzt, profil: { erfahrung: { druecken: 'neu', ziehen: 'neu', beine: 'neu', rumpf: 'neu' } },
    einschraenkungen: [], geraete: geraeteAlle(), uebungen: UEBUNGEN, staende: {}, letztesTraining: null,
    schmerzLetztes: new Set(), foerderZaehler: 0, ersteFoerderAm: null, ...extra,
  };
}
const U = id => UEBUNGEN.find(u => u.id === id);
const satz = (stufenIndex, wdh, feedback, schmerz = null) => ({ stufenIndex, wdh, feedback, schmerz });

// ---------- Plan ----------
{
  const ctx = ctxBasis();
  const plan = planErstellen(ctx);
  const ue = plan.schritte.filter(s => s.typ === 'uebung');
  pruefe('Plan: 4 Hauptübungen ohne Einschränkungen', ue.length === 4, ue.map(s => s.uebungId).join(','));
  pruefe('Plan: keine Mobilität ohne Hüfteintrag', !plan.schritte.some(s => s.typ === 'mobilitaet'));
  pruefe('Plan: erste Drück-Übung Brustpresse', ue[0].uebungId === 'brustpresse');
  pruefe('Plan: Einstieg 2 Sätze', ue[0].vorgabe.saetze === 2);
}
{
  const ctx = ctxBasis({ einschraenkungen: [{ stelle: 'daumen_hand', art: 'arthrose', seite: 'beide', status: 'aktiv' }] });
  const ue = planErstellen(ctx).schritte.filter(s => s.typ === 'uebung');
  const ziehen = ue.find(s => U(s.uebungId).muster === 'ziehen');
  pruefe('Daumen: Ziehen ohne zug_stark', U(ziehen.uebungId).b.griff !== 'zug_stark', ziehen.uebungId);
  pruefe('Daumen: Handprogramm im Plan', planErstellen(ctx).schritte.some(s => s.typ === 'hand'));
  pruefe('Daumen: Klimmzug nach hinten', bewerte(U('klimmzug'), ctx.einschraenkungen).status === 'hinten');
}
{
  const es = [{ stelle: 'huefte', art: 'gelenkersatz', seite: 'links', status: 'aktiv', vorgaben: { beugung90: true } }];
  const bp = bewerte(U('beinpresse'), es);
  pruefe('TEP 90°: Beinpresse bleibt mit Pflichthinweis', bp.status === 'ok' && bp.hinweise.some(h => h.includes('90°')));
  pruefe('TEP 90°: Knieheben gestützt aus', bewerte(U('knieheben_gestuetzt'), es).status === 'aus');
  const wn = [{ stelle: 'huefte', art: 'gelenkersatz', seite: 'links', status: 'aktiv', vorgaben: { weissNicht: true } }];
  pruefe('TEP weiß nicht: Beinpresse vorsorglich aus', bewerte(U('beinpresse'), wn).status === 'aus');
  pruefe('TEP weiß nicht: Clamshell (Drehung) aus', bewerte(U('clamshell'), wn).status === 'aus');
  pruefe('TEP weiß nicht: Adduktoren aus', bewerte(U('adduktion'), wn).status === 'aus');
  const ar = [{ stelle: 'huefte', art: 'arthrose', seite: 'rechts', status: 'aktiv' }];
  pruefe('Arthrose: Ball-Slam aus (Stoß)', bewerte(U('ball_slam'), ar).status === 'aus');
  pruefe('Arthrose: Knieheben gestützt nach hinten', bewerte(U('knieheben_gestuetzt'), ar).status === 'hinten');
  const ctx = ctxBasis({ einschraenkungen: [...es, ...ar] });
  const plan = planErstellen(ctx);
  const foerder = plan.schritte.filter(s => s.rolle === 'foerder');
  pruefe('Hüfte beidseitig: 2 Förderübungen', foerder.length === 2, foerder.map(s => s.uebungId).join(','));
  pruefe('Hüfte: Förderung beginnt mit Abduktion', foerder[0]?.foerderZiel === 'abduktion');
  pruefe('Hüfte: Mobilität im Plan', plan.schritte.some(s => s.typ === 'mobilitaet'));
  const plan2 = planErstellen({ ...ctx, foerderZaehler: 1 });
  pruefe('Förderung wechselt (2. Training: Streckung)', plan2.schritte.find(s => s.rolle === 'foerder')?.foerderZiel === 'streckung');
  const ids2 = plan.schritte.filter(s => s.typ === 'uebung').map(s => s.uebungId);
  pruefe('keine Übung doppelt', new Set(ids2).size === ids2.length);
  // Gelenkeintrag verlängert den Einstieg nicht (Wunsch Nutzer: Feedback statt Vorsicht von vornherein)
  const st = neuerStand(U('beinpresse'), ctx.geraete.beinpresse, 'haupt', { ...ctx, profil: { erfahrung: { beine: 'aktuell' } } });
  pruefe('Gelenkeintrag: Einstieg nach Erfahrung (aktuell = keiner)', st.einstiegBis === HEUTE, st.einstiegBis);
}
{
  const ctx = ctxBasis({ profil: { erfahrung: { druecken: 'frueher' } } });
  pruefe('Erfahrung früher: Einstieg 7 Tage', neuerStand(U('brustpresse'), ctx.geraete.brustpresse, 'haupt', ctx).einstiegBis === plusTage(HEUTE, 7));
  pruefe('Erfahrung aktuell: kein Einstieg', neuerStand(U('brustpresse'), ctx.geraete.brustpresse, 'haupt', { ...ctx, profil: { erfahrung: { druecken: 'aktuell' } } }).einstiegBis === HEUTE);
}
{
  // Alles in einem Muster ausgeblendet → Muster entfällt mit Hinweis
  const g = geraeteAlle(false); g.boden.vorhanden = true;
  const ctx = ctxBasis({ geraete: g, einschraenkungen: [{ stelle: 'daumen_hand', art: 'arthrose', status: 'aktiv' }] });
  const staende = {}; staende[paarId('boden', 'liegestuetz')] = { ausgeblendet: 'nutzer' };
  const plan = planErstellen({ ...ctx, staende });
  pruefe('Muster entfällt mit Hinweis', plan.hinweise.some(h => h.startsWith('Drücken')), plan.hinweise.join(' | '));
}

// ---------- Steigerung (Brustpresse, 5er-Stufen ab 5 kg) ----------
const g = geraeteAlle();
const bp = U('brustpresse'), gbp = g.brustpresse;
function standMit(extra) { return { ...neuerStand(bp, gbp, 'haupt', ctxBasis()), erstesTraining: false, einstiegBis: HEUTE, letztesDatum: plusTage(HEUTE, -3), ...extra }; }
const vg = (stand, ctx = ctxBasis()) => vorgabeBerechnen(stand, bp, gbp, 'haupt', ctx);
{
  let st = standMit({ stufenIndex: 9, ziel: 12 }); // 50 kg, nächste Stufe +10 % (kein großer Sprung)
  let v = vg(st);
  pruefe('3 Sätze nach Einstieg', v.saetze === 3);
  let r = auswerten(st, v, [satz(9, 12, 'passend'), satz(9, 12, 'passend'), satz(9, 12, 'passend')], gbp, ctxBasis());
  pruefe('1× erfüllt → noch keine Stufe', r.stand.stufenIndex === 9, r.text);
  r = auswerten(r.stand, vg(r.stand), [satz(9, 12, 'passend'), satz(9, 12, 'easy'), satz(9, 12, 'passend')], gbp, ctxBasis());
  pruefe('2× erfüllt → +1 Stufe', r.stand.stufenIndex === 10 && r.stand.ziel === 8, `${r.text} ${r.stand.stufenIndex}/${r.stand.ziel}`);
}
{
  const st = standMit({ stufenIndex: 6, ziel: 9 });
  const r = auswerten(st, vg(st), [satz(6, 9, 'easy'), satz(6, 9, 'passend'), satz(6, 9, 'passend')], gbp, ctxBasis());
  pruefe('1× easy → kein Sprung, +1 Wdh.', r.stand.stufenIndex === 6 && r.stand.ziel === 10, r.text);
  const st9 = standMit({ stufenIndex: 9, ziel: 9, easyInFolge: 1 });
  const r2 = auswerten(st9, vg(st9), [satz(9, 9, 'easy'), satz(9, 9, 'easy'), satz(9, 9, 'passend')], gbp, ctxBasis());
  pruefe('2× halb easy in Folge → +1 Stufe', r2.stand.stufenIndex === 10, r2.text);
  const r3 = auswerten({ ...st, easyInFolge: 1 }, vg(st), [satz(6, 9, 'easy'), satz(6, 9, 'easy'), satz(6, 9, 'passend')], gbp, ctxBasis());
  pruefe('35 → 40 kg ist großer Sprung (+14 %) → erst bis 15', r3.stand.stufenIndex === 6 && r3.stand.obergrenze === 15, r3.text);
}
{
  const st = standMit({ stufenIndex: 6, ziel: 10 });
  const r1 = auswerten(st, vg(st), [satz(6, 10, 'passend'), satz(6, 7, 'nichtGeschafft')], gbp, ctxBasis());
  pruefe('1× verfehlt → gleiches Gewicht', r1.stand.stufenIndex === 6 && r1.stand.verfehltInFolge === 1, r1.text);
  const r2 = auswerten(r1.stand, vg(r1.stand), [satz(6, 8, 'nichtGeschafft')], gbp, ctxBasis());
  pruefe('2× verfehlt → −1 Stufe, Ziel 10', r2.stand.stufenIndex === 5 && r2.stand.ziel === 10, r2.text);
}
{
  // großer Sprung: Stufen 20 → 25 (25 %)
  const g2 = { ...gbp, stufen: [10, 15, 20, 25, 30] };
  const st = { ...standMit({ stufenIndex: 2, ziel: 12 }), erfuelltInFolge: 1 };
  const v = vorgabeBerechnen(st, bp, g2, 'haupt', ctxBasis());
  const r = auswerten(st, v, [satz(2, 12, 'passend'), satz(2, 12, 'passend'), satz(2, 12, 'passend')], g2, ctxBasis());
  pruefe('großer Sprung → erst Obergrenze 15', r.stand.stufenIndex === 2 && r.stand.obergrenze === 15, r.text);
  const st3 = { ...r.stand, ziel: 15, erfuelltInFolge: 1 };
  const v3 = vorgabeBerechnen(st3, bp, g2, 'haupt', ctxBasis());
  const r3 = auswerten(st3, v3, [satz(2, 15, 'passend'), satz(2, 15, 'passend'), satz(2, 15, 'passend')], g2, ctxBasis());
  pruefe('nach 15 → Sprung, Ziel 6', r3.stand.stufenIndex === 3 && r3.stand.ziel === 6 && r3.stand.untergrenze === 6, `${r3.text} ${JSON.stringify(r3.stand)}`);
}
{
  // Pausen
  const st = (tage) => standMit({ stufenIndex: 6, ziel: 10, letztesDatum: plusTage(HEUTE, -tage) });
  pruefe('Pause 7 Tage normal', vg(st(7)).stufenIndex === 6 && !vg(st(7)).keineErhoehung);
  const v8 = vg(st(8));
  pruefe('Pause 8 Tage: keine Steigerung, Ziel −2', v8.keineErhoehung && v8.ziel === 8 && v8.resetZaehler);
  const v15 = vg(st(15));
  pruefe('Pause 15 Tage: −1 Stufe, 2 Sätze', v15.stufenIndex === 5 && v15.saetze === 2);
  const v29 = vg(st(29));
  pruefe('Pause 29 Tage: −2 Stufen, neuer Einstieg', v29.stufenIndex === 4 && v29.standAenderung.einstiegBis === plusTage(HEUTE, 7));
}
{
  // Muskelkater, kurzer Abstand, Untergrenze 1 Satz
  const lt = { ende: jetzt - 20 * 3600000, nachbefragung: { stufe: 'stark', gruppen: ['brust_schulter'] } };
  const v = vg(standMit({ stufenIndex: 6, ziel: 10, einstiegBis: plusTage(HEUTE, 3) }), ctxBasis({ letztesTraining: lt }));
  pruefe('Kater stark + <48 h + Einstieg → 1 Satz, keine Erhöhung', v.saetze === 1 && v.keineErhoehung, `${v.saetze}`);
  const v2 = vorgabeBerechnen(standMit({}), U('latzug'), g.latzug, 'haupt', ctxBasis({ letztesTraining: { ende: jetzt - 60 * 3600000, nachbefragung: { stufe: 'stark', gruppen: ['brust_schulter'] } } }));
  pruefe('Kater in anderer Gruppe wirkt nicht', !v2.keineErhoehung);
}
{
  // Schmerz
  const st = standMit({ stufenIndex: 6, ziel: 12, erfuelltInFolge: 1 });
  const r = auswerten(st, vg(st), [satz(6, 12, 'passend', 'gehtNoch'), satz(6, 12, 'passend'), satz(6, 12, 'passend')], gbp, ctxBasis());
  pruefe('„geht noch“ → keine Erhöhung', r.stand.stufenIndex === 6 && r.stand.sperreTrainings === 1, r.text);
  const v = vg(r.stand);
  pruefe('„geht noch“ → auch nächstes Training gesperrt', v.keineErhoehung);
  const r2 = auswerten(r.stand, v, [satz(6, 12, 'passend'), satz(6, 12, 'passend'), satz(6, 12, 'passend')], gbp, ctxBasis());
  pruefe('danach Sperre vorbei', r2.stand.sperreTrainings === 0);
  let s1 = nachbefragungAnwenden(st, true);
  pruefe('Gelenk schlechter 1× → noch sichtbar', s1.ausgeblendet !== 'vorsorglich');
  s1 = nachbefragungAnwenden(s1, true);
  pruefe('Gelenk schlechter 2× → vorsorglich ausgeblendet', s1.ausgeblendet === 'vorsorglich');
  const ctx = ctxBasis({ letztesTraining: { ende: jetzt - 60 * 3600000, nachbefragung: { stufe: 'kein', gelenkSchlechter: true } }, schmerzLetztes: new Set([st.id]) });
  pruefe('Gelenk schlechter → −1 Satz', vg(st, ctx).saetze === 2 && vg(st, ctx).keineErhoehung);
}
{
  // „nicht bewertet“ zählt nicht
  const st = standMit({ stufenIndex: 6, ziel: 12, erfuelltInFolge: 1 });
  const r = auswerten(st, vg(st), [satz(6, 12, 'nichtBewertet'), satz(6, 12, 'nichtBewertet')], gbp, ctxBasis());
  pruefe('nicht bewertet → keine Änderung', r.stand.stufenIndex === 6 && r.stand.erfuelltInFolge === 1, r.text);
}
{
  // Erstes Training: Startgewicht wird gemerkt
  const st = neuerStand(bp, gbp, 'haupt', ctxBasis());
  const v = vg(st);
  const r = auswerten(st, v, [satz(4, 10, 'passend'), satz(4, 10, 'passend')], gbp, ctxBasis());
  pruefe('Startgewicht gemerkt', r.stand.stufenIndex === 4 && !r.stand.erstesTraining, r.text);
}
{
  // Folgesatz
  const st = standMit({ stufenIndex: 6, ziel: 10 });
  const v = vg(st);
  let z = { stufenIndex: 6, ziel: 10 };
  let f = folgesatz(z, satz(6, 10, 'easy'), v, gbp);
  pruefe('Folgesatz easy → +2 Wdh.', f.zustand.ziel === 12 && f.zustand.stufenIndex === 6, f.text);
  f = folgesatz(f.zustand, satz(6, 12, 'easy'), v, gbp);
  pruefe('Folgesatz 2× easy → +1 Stufe', f.zustand.stufenIndex === 7 && f.zustand.erhoeht, f.text);
  f = folgesatz(f.zustand, satz(7, 12, 'easy'), v, gbp);
  f = folgesatz(f.zustand, satz(7, 12, 'easy'), v, gbp);
  pruefe('Erhöhen höchstens 1× je Training', f.zustand.stufenIndex === 7, f.text);
  f = folgesatz(f.zustand, satz(7, 6, 'nichtGeschafft'), v, gbp);
  pruefe('Senken immer erlaubt', f.zustand.stufenIndex === 6, f.text);
  const g1 = folgesatz({ stufenIndex: 6, ziel: 10 }, satz(6, 10, 'geradeSo'), v, gbp);
  pruefe('gerade so → −1 Wdh.', g1.zustand.ziel === 9);
  const s1 = folgesatz({ stufenIndex: 6, ziel: 10 }, satz(6, 10, 'easy', 'gehtNoch'), v, gbp);
  const s2 = folgesatz(s1.zustand, satz(6, 12, 'easy'), v, gbp);
  pruefe('Schmerz geht noch → keine Erhöhung im Training', s2.zustand.stufenIndex === 6, s2.text);
}
{
  // Zeitübung (Plank)
  const pl = U('plank');
  const st = { ...neuerStand(pl, g.boden, 'haupt', ctxBasis()), erstesTraining: false };
  const v = vorgabeBerechnen(st, pl, g.boden, 'haupt', ctxBasis());
  pruefe('Plank startet bei 20 s', v.ziel === 20 && v.typ === 'zeit');
  let r = auswerten(st, v, [{ sekunden: 20, feedback: 'passend' }, { sekunden: 20, feedback: 'passend' }], g.boden, ctxBasis());
  r = auswerten(r.stand, vorgabeBerechnen(r.stand, pl, g.boden, 'haupt', ctxBasis()), [{ sekunden: 20, feedback: 'passend' }], g.boden, ctxBasis());
  pruefe('Plank 2× geschafft → +10 s', r.stand.ziel === 30, r.text);
}
{
  // Mobilität
  let m = mobilNeu(undefined, 'gut'); m = mobilNeu(m, 'gut');
  pruefe('Mobilität 2× gut → 9 Wdh.', m.wdh === 9);
  m = mobilNeu(m, 'schmerz');
  pruefe('Mobilität Schmerz → bleibt', m.wdh === 9 && m.okInFolge === 0);
}
{
  // Alternative
  const ctx = ctxBasis();
  const alt = alternativen(ctx, 'druecken', new Set(['brustpresse']));
  pruefe('Alternative ohne die Übung selbst', alt.length && alt[0].uebung.id !== 'brustpresse');
}

{
  // Test-Satz bei Körpergewicht: Liegestütze, 20 geschafft, passend → Vorgabe 20
  const ls = U('liegestuetz');
  const st = neuerStand(ls, g.boden, 'haupt', ctxBasis());
  const v = vorgabeBerechnen(st, ls, g.boden, 'haupt', ctxBasis());
  pruefe('Erstes Mal = Test', v.test === true);
  const f = folgesatz({ stufenIndex: 0, ziel: v.ziel }, { nr: 1, wert: 20, wdh: 20, feedback: 'passend' }, v, g.boden);
  pruefe('Test 20 passend → Folgesätze 20', f.zustand.ziel === 20, f.text);
  const f2 = folgesatz({ stufenIndex: 0, ziel: v.ziel }, { nr: 1, wert: 20, wdh: 20, feedback: 'easy' }, v, g.boden);
  pruefe('Test 20 easy → 22', f2.zustand.ziel === 22);
  const r = auswerten(st, v, [{ nr: 1, wdh: 20, feedback: 'passend' }, { nr: 2, wdh: 20, feedback: 'passend' }], g.boden, ctxBasis());
  pruefe('Startwert aus Test gemerkt', r.stand.ziel === 20 && !r.stand.erstesTraining, r.text);
  const pl = U('plank');
  const vp = vorgabeBerechnen(neuerStand(pl, g.boden, 'haupt', ctxBasis()), pl, g.boden, 'haupt', ctxBasis());
  const fp = folgesatz({ stufenIndex: 0, ziel: vp.ziel }, { nr: 1, wert: 45, sekunden: 45, feedback: 'passend' }, vp, g.boden);
  pruefe('Plank-Test 45 s → 45 s', fp.zustand.ziel === 45, fp.text);
  const v2 = vorgabeBerechnen(r.stand, ls, g.boden, 'haupt', ctxBasis());
  pruefe('zweites Training kein Test mehr', !v2.test && v2.ziel === 20);
}

{
  // Stufen-Anzeige (Rasten): kein „großer Sprung“, obwohl 1 → 2 rechnerisch +100 % ist
  const gs = { ...gbp, anzeige: 'stufe', stufen: [1, 2, 3, 4, 5, 6] };
  const st = { ...standMit({ stufenIndex: 1, ziel: 12 }), erfuelltInFolge: 1 };
  const v = vorgabeBerechnen(st, bp, gs, 'haupt', ctxBasis());
  const r = auswerten(st, v, [satz(1, 12, 'passend'), satz(1, 12, 'passend'), satz(1, 12, 'passend')], gs, ctxBasis());
  pruefe('Raste: 2× erfüllt → nächste Raste, Ziel 8', r.stand.stufenIndex === 2 && r.stand.ziel === 8, r.text);
}

{
  // Unterstützung: mehr Gewicht = leichter, Steigerung = weniger Hilfe
  const gr = { ...geraeteAlle().gravitron };
  const l = kombiniert(gr);
  pruefe('Unterstützung: Liste absteigend', l[0] > l[1]);
  const kz = U('klimmzug_unterstuetzt');
  const st = { ...neuerStand(kz, gr, 'haupt', ctxBasis()), erstesTraining: false, einstiegBis: HEUTE, stufenIndex: 3, ziel: 12, erfuelltInFolge: 1, letztesDatum: plusTage(HEUTE, -3) };
  const v = vorgabeBerechnen(st, kz, gr, 'haupt', ctxBasis());
  const r = auswerten(st, v, [satz(3, 12, 'passend'), satz(3, 12, 'passend'), satz(3, 12, 'passend')], gr, ctxBasis());
  pruefe('Unterstützung: Steigerung = weniger Hilfe', r.stand.stufenIndex === 4 && l[4] < l[3], r.text);
}

// ---------- Körper ----------
{
  const m = [['2026-11-25', 80], ['2026-11-26', 81], ['2026-11-28', 80.5], ['2026-11-30', 79.5], ['2026-12-01', 80]].map(([datum, wert]) => ({ art: 'gewicht', datum, wert }));
  const r = mittel7(m, HEUTE);
  pruefe('7-Tage-Mittel', r.wert === 80.2 && r.anzahl === 5 && r.genug, JSON.stringify(r));
  pruefe('zu wenig Daten unter 4', !mittel7(m.slice(3), HEUTE).genug);
  pruefe('Rechengewicht ohne Werte im Fenster: letzter Wert', rechenGewicht([{ art: 'gewicht', datum: '2026-10-01', wert: 90 }], HEUTE) === 90);
  pruefe('Alter am Geburtstag', alterAm('1980-12-01', '2026-12-01') === 46 && alterAm('1980-12-02', '2026-12-01') === 45);
}

// ---------- Bedarf ----------
{
  pruefe('Grundumsatz Mifflin Mann', grundumsatz({ kg: 80, cm: 180, alter: 40, geschlecht: 'm' }) === 1730);
  const p = tagesbedarf({ kg: 80, cm: 180, alter: 40, geschlecht: 'm', alltag: 1.4, ziel: 'halten' });
  const t = tagesbedarf({ kg: 80, cm: 180, alter: 40, geschlecht: 'm', alltag: 1.4, ziel: 'halten', trainingMinuten: 60 });
  pruefe('Pausentag 2422 → 2400', p.kcal === 2400, String(p.kcal));
  pruefe('Trainingstag = +200 kcal (2,5 MET × 80 kg × 1 h)', t.zuschlag === 200 && t.kcal === 2600, String(t.kcal));
  pruefe('Eiweiß gleich an beiden Tagen', p.eiweiss === t.eiweiss && p.eiweiss === 130);
  const ab = tagesbedarf({ kg: 80, cm: 180, alter: 40, geschlecht: 'm', alltag: 1.8, ziel: 'abnehmen' });
  pruefe('Abnehmen höchstens −500', ab.zielDelta === -500);
  const rk = tagesbedarf({ kg: 90, cm: 180, alter: 45, geschlecht: 'm', alltag: 1.4, ziel: 'rekomposition' });
  pruefe('Rekomposition: kleines Defizit, höchstens −300', rk.zielDelta < 0 && rk.zielDelta >= -300, String(rk.zielDelta));
  pruefe('Rekomposition: 2,0 g Eiweiß je kg', rk.eiweiss === 180);
  const klein = tagesbedarf({ kg: 50, cm: 160, alter: 80, geschlecht: 'w', alltag: 1.4, ziel: 'abnehmen' });
  pruefe('nie unter Grundumsatz', klein.kcal >= Math.round(klein.grundumsatz / 50) * 50 - 25);
}

// ---------- Gesundheit ----------
{
  pruefe('erste Abfrage', wiedervorlage({ heute: HEUTE, gesundheit: [] }) === 'erst');
  const g0 = [neueAbfrage('erst', {}, '2026-09-01')];
  pruefe('Turnus 90 Tage', wiedervorlage({ heute: HEUTE, gesundheit: g0 }) === 'turnus');
  pruefe('nicht am selben Tag wie Kater', wiedervorlage({ heute: HEUTE, gesundheit: g0, katerHeute: true }) === null);
  const g1 = [neueAbfrage('erst', {}, '2026-11-20')];
  pruefe('kein Grund kurz nach Abfrage', wiedervorlage({ heute: HEUTE, gesundheit: g1 }) === null);
  pruefe('OP-Monat erreicht', wiedervorlage({ heute: HEUTE, gesundheit: g1, einschraenkungen: [{ art: 'opGeplant', opMonat: '2026-12', status: 'aktiv' }] }) === 'op');
  pruefe('Pause > 28 Tage', wiedervorlage({ heute: '2026-12-25', gesundheit: g1, letztesTrainingDatum: '2026-11-21' }) === 'pause');
  const zv = [{ datum: '2026-11-25', id: 'a', muster: 'beine' }, { datum: '2026-11-29', id: 'b', muster: 'beine' }];
  pruefe('2× zu viel im Muster', wiedervorlage({ heute: HEUTE, gesundheit: g1, zuVielMeldungen: zv }) === 'schmerz');
  const lt = { ende: jetzt - 13 * 3600000 };
  pruefe('Kater-Karte bei 13 h', katerFaellig(lt, jetzt));
  pruefe('keine Kater-Karte bei 11 h', !katerFaellig({ ende: jetzt - 11 * 3600000 }, jetzt));
  pruefe('keine Kater-Karte bei 73 h', !katerFaellig({ ende: jetzt - 73 * 3600000 }, jetzt));
  pruefe('keine Kater-Karte wenn beantwortet', !katerFaellig({ ...lt, nachbefragung: { stufe: 'kein' } }, jetzt));
}

// ---------- Stufen ----------
pruefe('Stufen mit Zusatz kombiniert', kombiniert({ stufen: [5, 10, 15], zusatz: [0, 2.5] }).join() === '5,7.5,10,12.5,15,17.5');

if (fehler) { console.error(`\n✋ Logik: ${fehler} Prüfung(en) fehlgeschlagen, ${ok} in Ordnung.\n`); process.exit(1); }
console.log(`✓ Logik: alle ${ok} Prüfungen in Ordnung.`);
