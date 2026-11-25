// Essen: Tagesziel, Shake mit 1 Tipp, Schnelleingabe, Zuletzt/Favoriten, Grundliste, Mahlzeitvorschläge.
import { alle, kv, speichere, loesche, neueId } from './db.js?v=0.1.1';
import { bedarfFuer } from './kontext.js?v=0.1.1';
import { LEBENSMITTEL, MAHLZEITEN, portionWerte, vorschlaege, QUELLE_HINWEIS } from './lebensmittel.js?v=0.1.1';
import { esc, toast, dialog, undoBar, zahl } from './ui.js?v=0.1.1';
import { heuteIso } from './datum.js?v=0.1.1';

export function tagesSumme(essen, datum) {
  const liste = essen.filter((e) => e.datum === datum);
  return {
    kcal: Math.round(liste.reduce((s, e) => s + (e.kcal || 0), 0)),
    eiweiss: Math.round(liste.reduce((s, e) => s + (e.eiweiss || 0), 0) * 10) / 10,
    liste,
  };
}

async function eintragen(e) {
  const eintrag = { id: neueId(), datum: heuteIso(), zeit: new Date().toISOString(), portion: 1, ...e };
  await speichere('essen', eintrag);
  return eintrag;
}

async function shakeEinstellen(alt) {
  const r = await dialog({
    title: 'Dein Eiweißshake',
    body: `
      <p>Einmal vom Etikett abschreiben – danach reicht ein Tipp.</p>
      <div class="form">
        <label for="sn">Name</label><input id="sn" name="name" type="text" value="${esc(alt?.name || 'Eiweißshake')}">
        <label for="se">Eiweiß je Portion (g)</label><input id="se" name="eiweiss" type="number" inputmode="decimal" value="${alt?.eiweiss ?? ''}">
        <label for="sk">Kalorien je Portion (kcal)</label><input id="sk" name="kcal" type="number" inputmode="numeric" value="${alt?.kcal ?? ''}">
        <p class="hint">Mit Milch angerührt? Dann die Milch dazurechnen (250 ml Milch 1,5 %: ca. 8 g Eiweiß, 120 kcal – Richtwert).</p>
      </div>`,
    buttons: [{ label: 'Abbrechen', value: 'x' }, { label: 'Speichern', value: 'ok', primary: true }],
    validate: (f) => (Number(String(f.eiweiss).replace(',', '.')) > 0 && Number(f.kcal) > 0 ? '' : 'Bitte Eiweiß und Kalorien eintragen.'),
  });
  if (r?.value !== 'ok') return null;
  const p = { name: r.fields.name || 'Eiweißshake', eiweiss: Number(String(r.fields.eiweiss).replace(',', '.')), kcal: Number(r.fields.kcal) };
  await kv.set('portionShake', p);
  return p;
}

// 1 Tipp: Shake eintragen. Liefert true, wenn eingetragen.
export async function shakeErfassen() {
  let p = await kv.get('portionShake');
  if (!p) p = await shakeEinstellen();
  if (!p) return false;
  const e = await eintragen({ name: p.name, kcal: p.kcal, eiweiss: p.eiweiss, quelle: 'shake' });
  undoBar(`${p.name}: +${zahl(p.eiweiss, 0)} g Eiweiß`, 5000, async () => { await loesche('essen', e.id); window.dispatchEvent(new Event('fitness:neu')); });
  return true;
}

export async function render(view) {
  const heute = heuteIso();
  const [essen, favoriten, shake, b] = await Promise.all([alle('essen'), alle('favoriten'), kv.get('portionShake'), bedarfFuer(heute)]);
  const summe = tagesSumme(essen, heute);
  const rest = b ? { kcal: b.kcal - summe.kcal, eiweiss: b.eiweiss - summe.eiweiss } : { kcal: 0, eiweiss: 0 };
  // „Zuletzt“: verschiedene Namen der letzten Einträge (ohne Shake)
  const zuletzt = [];
  for (const e of [...essen].sort((a, c) => (a.zeit < c.zeit ? 1 : -1))) {
    if (e.quelle === 'shake' || !e.name || zuletzt.some((z) => z.name === e.name)) continue;
    zuletzt.push({ name: e.name, kcal: Math.round(e.kcal / (e.portion || 1)), eiweiss: Math.round((e.eiweiss / (e.portion || 1)) * 10) / 10 });
    if (zuletzt.length >= 8) break;
  }
  const vs = b ? vorschlaege(rest) : MAHLZEITEN.slice(0, 3);
  const favNamen = new Set(favoriten.map((f) => f.name));

  view.innerHTML = `
    <section>
      <h1 class="title title-sm">Essen</h1>
      ${b ? `
        <div class="card ziel">
          <p class="kicker">${b.trainingstag ? 'Trainingstag' : 'Pausentag'}</p>
          <div class="balken-zeile"><span>Eiweiß</span><strong>${zahl(summe.eiweiss, 0)} / ${b.eiweiss} g</strong></div>
          <div class="balken"><span style="width:${Math.min(100, (summe.eiweiss / b.eiweiss) * 100)}%"></span></div>
          <div class="balken-zeile"><span>Kalorien</span><strong>${summe.kcal} / ${b.kcal} kcal</strong></div>
          <div class="balken"><span style="width:${Math.min(100, (summe.kcal / b.kcal) * 100)}%"></span></div>
          <p class="hint">Noch ${Math.max(0, Math.round(rest.eiweiss))} g Eiweiß und ${Math.max(0, rest.kcal)} kcal. <a href="#/rechnen">Wie wird gerechnet?</a></p>
        </div>` : '<div class="card"><p>Für dein Tagesziel braucht die App dein <a href="#/profil">Profil</a> und ein Gewicht unter <a href="#/koerper">Körper</a>.</p></div>'}

      <div class="zwei">
        <button type="button" class="btn btn-primary btn-big" data-act="shake">+ ${esc(shake?.name || 'Shake')}</button>
        <button type="button" class="btn btn-big" data-act="frei">+ Eintragen</button>
      </div>
      ${shake ? `<p class="hint">${esc(shake.name)}: ${zahl(shake.eiweiss, 0)} g Eiweiß, ${shake.kcal} kcal · <button type="button" class="link klein" data-act="shake-einst">ändern</button></p>` : ''}

      <h2>Heute</h2>
      ${summe.liste.length ? `<ul class="liste">${summe.liste.sort((a, c) => (a.zeit < c.zeit ? -1 : 1)).map((e) => `
        <li><span><strong>${esc(e.name || 'Eintrag')}</strong>${e.portion && e.portion !== 1 ? ` (${zahl(e.portion, 1)}×)` : ''}<br><span class="hint">${zahl(e.eiweiss, 0)} g Eiweiß · ${Math.round(e.kcal)} kcal</span></span>
          <span class="knoepfe">${e.quelle !== 'shake' && e.name ? `<button type="button" class="link" data-fav="${esc(e.name)}" aria-label="Als Favorit merken">${favNamen.has(e.name) ? '★' : '☆'}</button>` : ''}<button type="button" class="link" data-weg="${e.id}" aria-label="Löschen">✕</button></span></li>`).join('')}</ul>` : '<p class="hint">Noch nichts eingetragen.</p>'}

      <h2>Schnell nochmal</h2>
      <div class="seg drei" role="radiogroup" aria-label="Portion">
        <button type="button" class="btn" data-f="0.5">½</button><button type="button" class="btn on" data-f="1">1 Portion</button><button type="button" class="btn" data-f="1.5">1½</button>
      </div>
      ${favoriten.length ? `<p class="hint">Favoriten</p><div class="chips">${favoriten.map((f) => `<button type="button" class="chip" data-add='${esc(JSON.stringify({ name: f.name, kcal: f.kcal, eiweiss: f.eiweiss }))}'>★ ${esc(f.name)}</button>`).join('')}</div>` : ''}
      ${zuletzt.length ? `<p class="hint">Zuletzt</p><div class="chips">${zuletzt.map((z) => `<button type="button" class="chip" data-add='${esc(JSON.stringify(z))}'>${esc(z.name)}</button>`).join('')}</div>` : ''}

      <h2>Vorschläge für jetzt</h2>
      <ul class="liste">${vs.map((m) => `<li><span><strong>${esc(m.name)}</strong><br><span class="hint">${m.eiweiss} g Eiweiß · ${m.kcal} kcal · ${m.min} Min.</span></span><button type="button" class="btn klein" data-add='${esc(JSON.stringify({ name: m.name, kcal: m.kcal, eiweiss: m.eiweiss }))}'>+</button></li>`).join('')}</ul>

      <details class="card aufklapp">
        <summary>Grundliste Lebensmittel</summary>
        <input type="search" id="suche" placeholder="Suchen, z. B. Quark" aria-label="Lebensmittel suchen">
        <ul class="liste" id="lml">${lmListe('')}</ul>
        <p class="hint">${esc(QUELLE_HINWEIS)}</p>
      </details>
    </section>`;

  let faktor = 1;
  const neu = () => render(view);
  view.querySelectorAll('[data-f]').forEach((b2) => b2.addEventListener('click', () => {
    faktor = Number(b2.dataset.f);
    view.querySelectorAll('[data-f]').forEach((x) => x.classList.toggle('on', x === b2));
  }));
  const hinzu = async (d) => {
    const e = await eintragen({ name: d.name, kcal: Math.round(d.kcal * faktor), eiweiss: Math.round(d.eiweiss * faktor * 10) / 10, portion: faktor, quelle: d.quelle || 'frei' });
    neu();
    undoBar(`${d.name} eingetragen`, 5000, async () => { await loesche('essen', e.id); neu(); });
  };
  view.onclick = async (ev) => {
    const add = ev.target.closest('[data-add]');
    if (add) { hinzu(JSON.parse(add.dataset.add)); return; }
    const weg = ev.target.closest('[data-weg]');
    if (weg) { await loesche('essen', weg.dataset.weg); neu(); return; }
    const fav = ev.target.closest('[data-fav]');
    if (fav) {
      const name = fav.dataset.fav;
      const vorhanden = favoriten.find((f) => f.name === name);
      if (vorhanden) await loesche('favoriten', vorhanden.id);
      else {
        const e = summe.liste.find((x) => x.name === name);
        await speichere('favoriten', { id: neueId(), name, kcal: Math.round(e.kcal / (e.portion || 1)), eiweiss: Math.round((e.eiweiss / (e.portion || 1)) * 10) / 10 });
      }
      neu();
    }
  };
  view.querySelector('[data-act=shake]').addEventListener('click', async () => { if (await shakeErfassen()) neu(); });
  view.querySelector('[data-act=shake-einst]')?.addEventListener('click', async () => { if (await shakeEinstellen(shake)) neu(); });
  view.querySelector('[data-act=frei]').addEventListener('click', async () => {
    const r = await dialog({
      title: 'Eintragen',
      body: `<div class="form">
        <label for="fn">Was? (freiwillig)</label><input id="fn" name="name" type="text" placeholder="z. B. Mittagessen Kantine">
        <label for="fe">Eiweiß (g)</label><input id="fe" name="eiweiss" type="number" inputmode="decimal">
        <label for="fk">Kalorien (kcal)</label><input id="fk" name="kcal" type="number" inputmode="numeric">
        <p class="hint">Grob geschätzt reicht. Auf der Packung steht es meist pro 100 g.</p></div>`,
      buttons: [{ label: 'Abbrechen', value: 'x' }, { label: 'Eintragen', value: 'ok', primary: true }],
      validate: (f) => (f.eiweiss || f.kcal ? '' : 'Bitte Eiweiß oder Kalorien eintragen.'),
    });
    if (r?.value !== 'ok') return;
    const z = (s) => Number(String(s || 0).replace(',', '.')) || 0;
    await eintragen({ name: r.fields.name || 'Eintrag', eiweiss: z(r.fields.eiweiss), kcal: Math.round(z(r.fields.kcal)), quelle: 'frei' });
    toast('Eingetragen.');
    neu();
  });
  view.querySelector('#suche').addEventListener('input', (e) => { view.querySelector('#lml').innerHTML = lmListe(e.target.value); });
}

function lmListe(q) {
  const s = q.trim().toLowerCase();
  return LEBENSMITTEL.filter((l) => !s || l.name.toLowerCase().includes(s)).map((l) => {
    const w = portionWerte(l);
    return `<li><span><strong>${esc(l.name)}</strong><br><span class="hint">1 ${esc(l.portion)} (${l.g} g): ${zahl(w.eiweiss, 0)} g Eiweiß · ${w.kcal} kcal</span></span><button type="button" class="btn klein" data-add='${esc(JSON.stringify({ name: `${l.name} (${l.portion})`, kcal: w.kcal, eiweiss: w.eiweiss, quelle: 'grundliste' }))}'>+</button></li>`;
  }).join('');
}
