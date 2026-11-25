// Laufendes Training: Aufwärmen → Mobilität → Übungen (Satz mit 1 Tipp, Pause) → Handprogramm → Abschluss.
// Jeder Satz wird sofort gespeichert. Nach Unterbrechung: „Fortsetzen“. Nach 4 h automatisch beendet.
import { alle, hole, speichere, kv, neueId, loesche } from './db.js?v=0.1.0';
import { ladeKontext } from './kontext.js?v=0.1.0';
import { planErstellen, folgesatz, auswerten, neuerStand, typVon, alternativen, mobilNeu, paarId, vorgabeBerechnen } from './vorschlag.js?v=0.1.0';
import { anzeige, kombiniert } from './stufen.js?v=0.1.0';
import { MOBILITAET, HANDPROGRAMM, MUSTER } from './katalog.js?v=0.1.0';
import { R } from './regeln.js?v=0.1.0';
import { esc, toast, dialog, undoBar } from './ui.js?v=0.1.0';
import { heuteIso, monatIso, monateZwischen } from './datum.js?v=0.1.0';
import { bewerte, mitUeberkreuzVorgabe, opHinweis, aktiv } from './gelenke.js?v=0.1.0';

const FEEDBACK = [
  ['easy', 'easy', 'noch 4+ Wdh. drin'],
  ['passend', 'passend', 'noch 2–3 drin'],
  ['geradeSo', 'gerade so', 'mehr ging nicht'],
  ['nichtGeschafft', 'nicht geschafft', 'Ziel verfehlt'],
];

let wakeLock = null;
async function wachHalten(an) {
  try {
    if (an && (await kv.get('wakeLock')) !== false && 'wakeLock' in navigator && document.visibilityState === 'visible') {
      wakeLock = await navigator.wakeLock.request('screen');
    } else if (!an && wakeLock) { await wakeLock.release(); wakeLock = null; }
  } catch { /* ohne geht es auch */ }
}
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && location.hash.startsWith('#/lauf')) wachHalten(true);
});

// ---------- Training anlegen ----------
export async function trainingStarten() {
  const ctx = await ladeKontext();
  if (ctx.laufend) return ctx.laufend;
  const plan = planErstellen(ctx);
  const jetzt = Date.now();
  const t = {
    id: neueId(), datum: heuteIso(), startMs: jetzt, status: 'laeuft', schritt: 0,
    schritte: plan.schritte, hinweise: plan.hinweise, aenderungen: [],
    zustand: {}, // je Übung: { stufenIndex, ziel, erhoeht, easyFolge, keineErhoehung, satzNr, fertig }
  };
  for (const s of t.schritte) if (s.typ === 'uebung') t.zustand[s.id] = { stufenIndex: s.vorgabe.stufenIndex, ziel: s.vorgabe.ziel, satzNr: 0 };
  await speichere('trainings', t);
  await kv.set('heuteTraining', t.datum);
  return t;
}

// Beim App-Start: altes, liegen gebliebenes Training automatisch abschließen
export async function laufendesAufraeumen() {
  const t = (await alle('trainings')).find((x) => x.status === 'laeuft');
  if (t && Date.now() - (t.letzteAktionMs || t.startMs) > R.trainingAutoEndeStunden * 3600000) await abschliessen(t, true);
}

// ---------- Abschluss: Stände aktualisieren ----------
export async function abschliessen(t, automatisch = false) {
  const ctx = await ladeKontext();
  const saetze = (await alle('saetze')).filter((s) => s.trainingId === t.id);
  const aenderungen = [];
  for (const s of t.schritte.filter((x) => x.typ === 'uebung')) {
    const eigene = saetze.filter((x) => x.paarId === s.id).sort((a, b) => a.nr - b.nr);
    if (!eigene.length) continue;
    const g = ctx.geraete[s.geraetId];
    const u = ctx.uebungen.find((x) => x.id === s.uebungId);
    if (!g || !u) continue;
    const stand = ctx.staende[s.id] || neuerStand(u, g, s.rolle, ctx);
    const r = auswerten(stand, s.vorgabe, eigene, g, ctx, s.rolle);
    await speichere('geraetUebung', r.stand);
    aenderungen.push({ name: u.name, text: r.text, richtung: r.richtung });
  }
  const endeMs = automatisch ? (t.letzteAktionMs || t.startMs) : Date.now();
  const fertig = { ...t, status: 'beendet', endeMs, aenderungen };
  await speichere('trainings', fertig);
  wachHalten(false);
  return fertig;
}

// ---------- Anzeige ----------
export async function render(view) {
  let t = (await alle('trainings')).find((x) => x.status === 'laeuft');
  if (!t) { location.hash = '#/training'; return; }
  const ctx = await ladeKontext();
  wachHalten(true);
  const zeichne = () => zeigeSchritt(view, t, ctx, async (neu) => { t = neu; t.letzteAktionMs = Date.now(); await speichere('trainings', t); zeichne(); });
  zeichne();
}

function kopf(t, titel) {
  const ue = t.schritte.filter((s) => s.typ === 'uebung');
  const idx = t.schritte[t.schritt]?.typ === 'uebung' ? ue.indexOf(t.schritte[t.schritt]) + 1 : null;
  return `
    <div class="lauf-kopf">
      <span>${idx ? `Übung ${idx}/${ue.length}` : esc(titel)}</span>
      <button type="button" class="link" data-act="menue" aria-label="Training: weitere Möglichkeiten">⋯</button>
    </div>`;
}

function zeigeSchritt(view, t, ctx, weiter) {
  const s = t.schritte[t.schritt];
  if (!s) return;
  const naechster = () => weiter({ ...t, schritt: Math.min(t.schritt + 1, t.schritte.length - 1) });
  if (s.typ === 'aufwaermen') return aufwaermen(view, t, s, ctx, naechster);
  if (s.typ === 'mobilitaet') return mobilitaet(view, t, ctx, 'mobilitaet', naechster, weiter);
  if (s.typ === 'hand') return mobilitaet(view, t, ctx, 'hand', naechster, weiter);
  if (s.typ === 'abschluss') return abschluss(view, t);
  return uebung(view, t, s, ctx, weiter);
}

function menue(view, t, ctx, weiter, s) {
  view.querySelector('[data-act=menue]')?.addEventListener('click', async () => {
    const knoepfe = [];
    if (s?.typ === 'uebung') {
      knoepfe.push({ label: 'Gerät besetzt – später', value: 'spaeter' });
      knoepfe.push({ label: 'Übung tauschen', value: 'tauschen' });
      knoepfe.push({ label: 'Übung überspringen', value: 'ueberspringen' });
    }
    knoepfe.push({ label: 'Training beenden', value: 'ende' });
    knoepfe.push({ label: 'Zurück', value: 'zurueck', primary: true });
    const r = await dialog({ title: 'Training', body: '<p>Was möchtest du tun?</p>', buttons: knoepfe });
    if (!r || r.value === 'zurueck') return;
    if (r.value === 'ende') {
      const ok = await dialog({ title: 'Training beenden?', body: '<p>Alle eingetragenen Sätze bleiben gespeichert und zählen für die Steigerung.</p>', buttons: [{ label: 'Weiter trainieren', value: 'nein' }, { label: 'Beenden', value: 'ja', primary: true }] });
      if (ok?.value === 'ja') weiter({ ...t, schritt: t.schritte.length - 1 });
      return;
    }
    if (r.value === 'spaeter') {
      const liste = [...t.schritte];
      const [x] = liste.splice(t.schritt, 1);
      const abschlussIdx = liste.findIndex((y) => y.typ === 'abschluss' || y.typ === 'hand');
      liste.splice(abschlussIdx, 0, x);
      return weiter({ ...t, schritte: liste });
    }
    if (r.value === 'ueberspringen') return weiter({ ...t, schritt: t.schritt + 1 });
    if (r.value === 'tauschen') return tauschen(t, s, ctx, weiter);
  });
}

// einfuegen: neue Übung hinter der aktuellen einfügen und dorthin springen (nach „zu viel“)
async function tauschen(t, s, ctx, weiter, grund = '', einfuegen = false) {
  const u = ctx.uebungen.find((x) => x.id === s.uebungId);
  const imPlan = new Set(t.schritte.filter((x) => x.typ === 'uebung').flatMap((x) => [x.id, x.uebungId]));
  const liste = alternativen(ctx, u.muster, imPlan, s.rolle === 'foerder' ? s.foerderZiel : null).slice(0, 4);
  if (!liste.length) { toast('Keine andere passende Übung im Katalog.'); return; }
  const r = await dialog({
    title: 'Andere Übung',
    body: `${grund ? `<p>${esc(grund)}</p>` : ''}<p>Gleiches Muster (${esc(MUSTER[u.muster] || '')}):</p>`,
    buttons: [...liste.map((p, i) => ({ label: `${p.uebung.name}`, value: String(i) })), { label: 'Abbrechen', value: 'x', primary: true }],
  });
  if (!r || r.value === 'x') { if (einfuegen) weiter({ ...t, schritt: t.schritt + 1, pauseEndeUm: null }); return; }
  const p = liste[Number(r.value)];
  const stand = ctx.staende[p.id] || neuerStand(p.uebung, p.geraet, s.rolle, ctx);
  const neu = { ...s, id: p.id, uebungId: p.uebung.id, geraetId: p.geraet.id, vorgabe: vorgabeBerechnen(stand, p.uebung, p.geraet, s.rolle, ctx), hinweise: p.bew?.hinweise || [], neu: !ctx.staende[p.id] };
  const schritte = [...t.schritte];
  if (einfuegen) schritte.splice(t.schritt + 1, 0, neu); else schritte[t.schritt] = neu;
  weiter({ ...t, schritte, schritt: einfuegen ? t.schritt + 1 : t.schritt, pauseEndeUm: null, zustand: { ...t.zustand, [neu.id]: { stufenIndex: neu.vorgabe.stufenIndex, ziel: neu.vorgabe.ziel, satzNr: 0 } } });
}

// ---------- Aufwärmen ----------
function aufwaermen(view, t, s, ctx, naechster) {
  const opt = s.optionen || [];
  let min = R.aufwaermenMinuten;
  const warn = opHinweis(ctx.einschraenkungen, monatIso(ctx.heute), monateZwischen)
    ? '<p class="card card-warn">Hüftprothese: Vorgaben bei Operateur oder Physiotherapie erfragen und unter Körper → Gesundheit eintragen.</p>' : '';
  const hinweise = (t.hinweise || []).map((h) => `<li>${esc(h)}</li>`).join('');
  const notizen = aktiv(ctx.alleEinschraenkungen).filter((e) => e.vorgabeText).map((e) => `<li>${esc(e.vorgabeText)}</li>`).join('');
  view.innerHTML = `
    <section class="lauf">
      ${kopf(t, 'Aufwärmen')}
      ${warn}
      <h1 class="title title-sm">Aufwärmen</h1>
      <p class="lead">5–8 Minuten locker – du kannst dabei noch sprechen. Die letzte Minute etwas zügiger.</p>
      ${opt.length ? `<div class="wahl" role="radiogroup">${opt.map((o, i) => `<button type="button" class="btn ${i === 0 ? 'on' : ''}" data-i="${i}">${esc(o.name)}</button>`).join('')}</div>` : '<p class="hint">Kein Ausdauergerät abgehakt – einfach 5 Minuten zügig gehen.</p>'}
      <div class="zahlzeile"><button type="button" class="rund" data-d="-1" aria-label="Eine Minute weniger">−</button><span class="gross" id="min">${min} Min.</span><button type="button" class="rund" data-d="1" aria-label="Eine Minute mehr">+</button></div>
      ${hinweise || notizen ? `<div class="card card-soft"><h3>Für heute</h3><ul class="hinweise">${hinweise}${notizen}</ul></div>` : ''}
      <p class="hint">Bei Schmerz, Schwindel oder Brustdruck: abbrechen.</p>
      <div class="unten"><button type="button" class="btn btn-primary btn-wide btn-big" data-act="fertig">Fertig aufgewärmt</button></div>
    </section>`;
  let wahl = 0;
  view.querySelectorAll('.wahl .btn').forEach((b) => b.addEventListener('click', () => {
    wahl = Number(b.dataset.i);
    view.querySelectorAll('.wahl .btn').forEach((x) => x.classList.toggle('on', x === b));
  }));
  view.querySelectorAll('[data-d]').forEach((b) => b.addEventListener('click', () => {
    min = Math.max(0, Math.min(30, min + Number(b.dataset.d)));
    view.querySelector('#min').textContent = `${min} Min.`;
  }));
  view.querySelector('[data-act=fertig]').addEventListener('click', () => {
    t.aufwaermen = { ...(opt[wahl] || {}), minuten: min };
    naechster();
  });
  view.querySelector('[data-act=menue]')?.addEventListener('click', async () => {
    const r = await dialog({ title: 'Training', body: '<p>Training jetzt beenden? Es wurde noch nichts eingetragen.</p>', buttons: [{ label: 'Weiter', value: 'nein', primary: true }, { label: 'Training verwerfen', value: 'weg' }] });
    if (r?.value === 'weg') { await loesche('trainings', t.id); wachHalten(false); location.hash = '#/'; }
  });
}

// ---------- Mobilität / Handprogramm ----------
async function mobilitaet(view, t, ctx, art, naechster, weiter) {
  const key = art === 'hand' ? 'handStand' : 'mobilStand';
  const stand = (await kv.get(key)) || { wdh: R.mobilStart, okInFolge: 0 };
  const ueberkreuz = mitUeberkreuzVorgabe(ctx.einschraenkungen);
  const liste = art === 'hand'
    ? HANDPROGRAMM.map((h) => `<li><strong>${esc(h.text)}</strong><span>${esc(h.dosis)}</span></li>`)
    : MOBILITAET.map((m) => `<li><strong>${esc(ueberkreuz && m.textUeberkreuzen ? m.textUeberkreuzen : m.text)}</strong><span>${stand.wdh}×${m.beidseitig ? ' je Seite' : ''}</span></li>`);
  view.innerHTML = `
    <section class="lauf">
      ${kopf(t, art === 'hand' ? 'Hand' : 'Mobilität')}
      <h1 class="title title-sm">${art === 'hand' ? 'Handprogramm' : 'Beweglichkeit Hüfte'}</h1>
      <p class="lead">${art === 'hand' ? '3–4 Minuten, ohne Druck und nur schmerzarm. Geht auch zu Hause.' : 'Ca. 5 Minuten, langsam und nur im schmerzarmen Bereich.'}</p>
      <ul class="programm">${liste.join('')}</ul>
      ${stand.weiterBewegen && art !== 'hand' ? '<p class="card card-soft">Lief zuletzt gut: etwas weiter bewegen, solange es sich gut anfühlt.</p>' : ''}
      <p class="hint">Übungen helfen im Mittel wenig bis mäßig und ersetzen keine Behandlung.</p>
      <div class="unten zwei">
        <button type="button" class="btn btn-big" data-fb="schmerz">Schmerz</button>
        <button type="button" class="btn btn-primary btn-big" data-fb="gut">Gut</button>
      </div>
      <button type="button" class="link center-block" data-fb="skip">Heute überspringen</button>
    </section>`;
  view.querySelectorAll('[data-fb]').forEach((b) => b.addEventListener('click', async () => {
    const fb = b.dataset.fb;
    if (fb !== 'skip') {
      const neu = mobilNeu(stand, fb);
      await kv.set(key, neu);
      t[art] = fb;
      if (neu.wdh > stand.wdh) toast(`Nächstes Mal ${neu.wdh} Wiederholungen.`);
    }
    naechster();
  }));
  menue(view, t, ctx, weiter, null);
}

// ---------- Übung mit Sätzen ----------
async function uebung(view, t, s, ctx, weiter) {
  const u = ctx.uebungen.find((x) => x.id === s.uebungId);
  const g = ctx.geraete[s.geraetId];
  if (!u || !g) { weiter({ ...t, schritt: t.schritt + 1 }); return; }
  const v = s.vorgabe;
  const typ = v.typ;
  const z = t.zustand[s.id] || { stufenIndex: v.stufenIndex, ziel: v.ziel, satzNr: 0 };
  const saetze = (await alle('saetze')).filter((x) => x.trainingId === t.id && x.paarId === s.id).sort((a, b) => a.nr - b.nr);
  const nr = saetze.length + 1;
  const fertig = nr > v.saetze;
  const stufen = kombiniert(g);
  let stufe = z.stufenIndex;
  let wert = z.ziel;
  let schmerz = null;
  const bew = bewerte(u, ctx.einschraenkungen);
  const einstellungen = (g.einstellungen || []).map((n) => `${esc(n)}: <strong>${esc(g.werte?.[n] || '–')}</strong>`).join(' · ');
  const einheit = typ === 'zeit' ? 's' : 'Wdh.';
  const gewichtText = () => (typ === 'kg' || typ === 'ball' ? anzeige(g, stufe) : typ === 'koerper' ? 'Körpergewicht' : '');

  if (fertig) {
    const r = auswerten(ctx.staende[s.id] || neuerStand(u, g, s.rolle, ctx), v, saetze, g, ctx, s.rolle);
    view.innerHTML = `
      <section class="lauf">
        ${kopf(t)}
        <h1 class="title title-sm">${esc(u.name)} ✓</h1>
        <div class="card ergebnis ${r.richtung}"><p class="kicker">Nächstes Mal</p><p class="gross-text">${esc(r.text)}</p></div>
        <ul class="satzliste">${saetze.map((x) => `<li>Satz ${x.nr}: ${typ === 'zeit' ? `${x.sekunden} s` : `${x.wdh} Wdh.`}${typ === 'kg' || typ === 'ball' ? ` · ${esc(anzeige(g, x.stufenIndex))}` : ''} · ${esc(FEEDBACK.find((f) => f[0] === x.feedback)?.[1] || 'nicht bewertet')}${x.schmerz ? ' · Schmerz' : ''}</li>`).join('')}</ul>
        <div class="unten"><button type="button" class="btn btn-primary btn-wide btn-big" data-act="weiter">Weiter</button></div>
      </section>`;
    view.querySelector('[data-act=weiter]').addEventListener('click', () => weiter({ ...t, schritt: t.schritt + 1 }));
    menue(view, t, ctx, weiter, s);
    return;
  }

  // Pause läuft?
  if (t.pauseEndeUm && t.pauseFuer === s.id && Date.now() < t.pauseEndeUm) return pause(view, t, s, u, weiter, ctx);

  view.innerHTML = `
    <section class="lauf">
      ${kopf(t)}
      <h1 class="title title-sm">${esc(u.name)}</h1>
      <p class="geraet">${g.name !== u.name ? esc(g.name) : ''}${s.rolle === 'foerder' ? ' · <span class="tag">Förderung</span>' : ''}</p>
      ${einstellungen ? `<p class="einst">${einstellungen} <a class="link klein" href="#/geraet/${encodeURIComponent(g.id)}">ändern</a></p>` : ''}
      ${[...bew.hinweise, ...(s.hinweise || [])].filter((x, i, a) => a.indexOf(x) === i).map((h) => `<p class="hinweis">${esc(h)}</p>`).join('')}
      ${u.hinweis ? `<p class="hint">${esc(u.hinweis)}</p>` : ''}
      ${v.gruende?.length && nr === 1 ? `<p class="hint">${v.gruende.map(esc).join(' · ')}</p>` : ''}
      <p class="satz-nr">Satz ${nr} von ${v.saetze}</p>
      <button type="button" class="vorgabe" data-act="aufklappen" aria-expanded="false">
        <span class="gross" id="wert">${wert} ${einheit}</span>
        <span class="mittel" id="gew">${esc(gewichtText())}</span>
        <span class="hint">antippen zum Ändern</span>
      </button>
      <div class="aendern" hidden>
        <div class="zahlzeile"><button type="button" class="rund" data-w="-1" aria-label="weniger">−</button><span>${typ === 'zeit' ? 'Sekunden' : 'Wiederholungen'}</span><button type="button" class="rund" data-w="1" aria-label="mehr">+</button></div>
        ${typ === 'kg' || typ === 'ball' ? '<div class="zahlzeile"><button type="button" class="rund" data-s="-1" aria-label="leichter">−</button><span>Gewicht</span><button type="button" class="rund" data-s="1" aria-label="schwerer">+</button></div>' : ''}
      </div>
      <div class="schmerzzeile">
        <button type="button" class="btn btn-quiet klein" data-act="schmerz" aria-pressed="false">Schmerz?</button>
        <div class="schmerzwahl" hidden>
          <button type="button" class="btn klein" data-sch="gehtNoch">geht noch</button>
          <button type="button" class="btn klein warn-btn" data-sch="zuViel">zu viel / neu</button>
        </div>
      </div>
      <div class="fb-grid">
        ${FEEDBACK.map(([k, l, sub]) => `<button type="button" class="fb fb-${k}" data-fb="${k}"><strong>${l}</strong><span>${sub}</span></button>`).join('')}
      </div>
    </section>`;

  const zeige = () => {
    view.querySelector('#wert').textContent = `${wert} ${einheit}`;
    view.querySelector('#gew').textContent = gewichtText();
  };
  view.querySelector('[data-act=aufklappen]').addEventListener('click', (e) => {
    const box = view.querySelector('.aendern');
    box.hidden = !box.hidden;
    e.currentTarget.setAttribute('aria-expanded', String(!box.hidden));
  });
  view.querySelectorAll('[data-w]').forEach((b) => b.addEventListener('click', () => {
    const schritt = typ === 'zeit' ? 5 : 1;
    wert = Math.max(0, wert + Number(b.dataset.w) * schritt); zeige();
  }));
  view.querySelectorAll('[data-s]').forEach((b) => b.addEventListener('click', () => {
    stufe = Math.max(0, Math.min(stufen.length - 1, stufe + Number(b.dataset.s))); zeige();
  }));
  view.querySelector('[data-act=schmerz]').addEventListener('click', (e) => {
    const w = view.querySelector('.schmerzwahl');
    w.hidden = !w.hidden;
    e.currentTarget.setAttribute('aria-pressed', String(!w.hidden));
  });
  view.querySelectorAll('[data-sch]').forEach((b) => b.addEventListener('click', async () => {
    schmerz = b.dataset.sch;
    view.querySelectorAll('[data-sch]').forEach((x) => x.classList.toggle('on', x === b));
    if (schmerz === 'zuViel') {
      await satzSpeichern('nichtBewertet');
      const r = await dialog({
        title: 'Übung beenden',
        body: '<p>Bei Schmerz, der zu viel oder neu ist: diese Übung für heute beenden. Hält er an, ärztlich oder physiotherapeutisch abklären.</p><p>Möchtest du eine andere Übung mit gleichem Muster?</p>',
        buttons: [{ label: 'Nächste Übung', value: 'weiter' }, { label: 'Andere Übung', value: 'tauschen', primary: true }],
      });
      if (r?.value === 'tauschen') return tauschen(t, s, ctx, weiter, 'Statt dieser Übung:', true);
      return weiter({ ...t, schritt: t.schritt + 1, pauseEndeUm: null });
    }
    toast('Schmerz „geht noch“ gemerkt: keine Erhöhung bei dieser Übung.');
  }));

  async function satzSpeichern(feedback) {
    const satz = {
      id: neueId(), trainingId: t.id, paarId: s.id, uebungId: u.id, geraetId: g.id, nr, zeit: new Date().toISOString(),
      stufenIndex: stufe, feedback, schmerz,
      ...(typ === 'zeit' ? { sekunden: wert } : { wdh: wert }),
      kg: typ === 'kg' || typ === 'ball' ? stufen[stufe] : null,
    };
    await speichere('saetze', satz);
    return satz;
  }

  view.querySelectorAll('[data-fb]').forEach((b) => b.addEventListener('click', async () => {
    view.querySelectorAll('[data-fb]').forEach((x) => { x.disabled = true; });
    const satz = await satzSpeichern(b.dataset.fb);
    const f = folgesatz({ ...z, stufenIndex: stufe }, { ...satz, wert }, v, g);
    const pauseSek = s.rolle === 'foerder' ? R.pauseSek.foerder : R.pauseSek.haupt;
    const neu = {
      ...t,
      zustand: { ...t.zustand, [s.id]: { ...f.zustand, satzNr: nr } },
      pauseEndeUm: nr < v.saetze ? Date.now() + pauseSek * 1000 : null,
      pauseFuer: s.id,
      pauseText: f.text,
    };
    weiter(neu);
    undoBar('Satz gespeichert', 5000, async () => {
      await loesche('saetze', satz.id);
      weiter({ ...neu, zustand: { ...neu.zustand, [s.id]: z }, pauseEndeUm: null });
    });
  }));
  menue(view, t, ctx, weiter, s);
}

function pause(view, t, s, u, weiter, ctx) {
  view.innerHTML = `
    <section class="lauf">
      ${kopf(t)}
      <h1 class="title title-sm">Pause</h1>
      <p class="geraet">${esc(u.name)}</p>
      <div class="timer" id="timer" aria-live="off"></div>
      <p class="card folgetext">${esc(t.pauseText || '')}</p>
      <div class="unten zwei">
        <button type="button" class="btn btn-big" data-act="mehr">+30 s</button>
        <button type="button" class="btn btn-primary btn-big" data-act="los">Nächster Satz</button>
      </div>
    </section>`;
  const el = view.querySelector('#timer');
  let ende = t.pauseEndeUm;
  let tonGespielt = false;
  const tick = () => {
    if (!el.isConnected) { clearInterval(iv); return; }
    const rest = Math.round((ende - Date.now()) / 1000);
    if (rest > 0) { el.textContent = `${Math.floor(rest / 60)}:${String(rest % 60).padStart(2, '0')}`; el.classList.remove('los'); }
    else {
      el.textContent = `Los! +${Math.floor(-rest / 60)}:${String(-rest % 60).padStart(2, '0')}`;
      el.classList.add('los');
      if (!tonGespielt) { tonGespielt = true; ton(); }
    }
  };
  const iv = setInterval(tick, 500);
  tick();
  view.querySelector('[data-act=mehr]').addEventListener('click', async () => {
    ende += 30000; t.pauseEndeUm = ende; tonGespielt = false;
    await speichere('trainings', t); tick();
  });
  view.querySelector('[data-act=los]').addEventListener('click', () => { clearInterval(iv); weiter({ ...t, pauseEndeUm: null }); });
  menue(view, t, ctx, weiter, s);
}

// Kurzer Ton am Pausenende (nur bei offener App; am iPhone kann der Stummschalter ihn unterdrücken)
function ton() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ac = ton.ac || (ton.ac = new AC());
    const o = ac.createOscillator(); const gn = ac.createGain();
    o.frequency.value = 880; gn.gain.value = 0.15;
    o.connect(gn).connect(ac.destination);
    o.start(); o.stop(ac.currentTime + 0.25);
  } catch { /* egal */ }
}

// ---------- Abschluss ----------
async function abschluss(view, t) {
  const fertig = await abschliessen(t);
  const saetze = (await alle('saetze')).filter((x) => x.trainingId === t.id);
  const min = Math.max(1, Math.round((fertig.endeMs - fertig.startMs) / 60000));
  const pfeil = { hoch: '↑', runter: '↓', gleich: '=' };
  view.innerHTML = `
    <section class="lauf">
      <h1 class="title title-sm">Geschafft! 💪</h1>
      <p class="lead">${min} ${min === 1 ? 'Minute' : 'Minuten'} · ${saetze.length} Sätze</p>
      <div class="card">
        <h3>Nächstes Mal</h3>
        ${fertig.aenderungen.length ? `<ul class="aenderungen">${fertig.aenderungen.map((a) => `<li class="${a.richtung}"><span class="pfeil">${pfeil[a.richtung] || '='}</span><span><strong>${esc(a.name)}</strong><br>${esc(a.text)}</span></li>`).join('')}</ul>` : '<p>Keine Sätze eingetragen.</p>'}
      </div>
      <p class="hint">Heute ist Trainingstag: Unter Essen siehst du deinen Bedarf. Morgen fragt die App kurz nach Muskelkater.</p>
      <div class="unten"><a class="btn btn-primary btn-wide btn-big" href="#/">Fertig</a></div>
    </section>`;
}
