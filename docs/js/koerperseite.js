// Reiter Körper: Gewicht (7-Tage-Mittel), Umfänge, Unverträglichkeiten, Links zu Profil und Gesundheit.
import { alle, speichere, loesche, neueId } from './db.js?v=0.1.0';
import { mittel7, letzteMessung, MESSARTEN, MIN_WIEGUNGEN } from './koerper.js?v=0.1.0';
import { aktiv, STELLEN, ARTEN } from './gelenke.js?v=0.1.0';
import { esc, toast, dialog, zahl, datum } from './ui.js?v=0.1.0';
import { heuteIso, alterAm, plusTage } from './datum.js?v=0.1.0';

export async function render(view) {
  const heute = heuteIso();
  const [profile, messungen, notizen, einschraenkungen] = await Promise.all([alle('profil'), alle('messungen'), alle('notizen'), alle('einschraenkungen')]);
  const p = profile[0];
  const m7 = mittel7(messungen, heute);
  const letztes = letzteMessung(messungen, 'gewicht');
  const gewichte = messungen.filter((m) => m.art === 'gewicht').sort((a, b) => (a.datum < b.datum ? -1 : 1));
  const taille = letzteMessung(messungen, 'taille');
  const unv = notizen.filter((n) => n.typ === 'unvertraeglichkeit');
  let wert = letztes?.wert ?? 80;

  // Verlauf: 7-Tage-Mittel je Woche der letzten 12 Wochen
  const punkte = [];
  for (let w = 11; w >= 0; w--) {
    const tag = plusTage(heute, -7 * w);
    const r = mittel7(messungen, tag);
    if (r.wert != null) punkte.push({ tag, wert: r.wert });
  }

  view.innerHTML = `
    <section>
      <h1 class="title title-sm">Körper</h1>
      <div class="card">
        <p class="kicker">Gewicht · 7-Tage-Mittel</p>
        <p class="gross-zahl">${m7.wert != null ? `${zahl(m7.wert, 1)} kg` : '–'}</p>
        <p class="hint">${m7.genug ? `aus ${m7.anzahl} Wiegungen` : `Erst ${m7.anzahl} von ${MIN_WIEGUNGEN} Wiegungen in 7 Tagen – das Mittel ist noch unsicher.`}</p>
        ${punkte.length > 1 ? kurve(punkte) : ''}
        <div class="zahlzeile">
          <button type="button" class="rund" data-d="-1" aria-label="1 kg weniger">−1</button>
          <button type="button" class="rund" data-d="-0.1" aria-label="0,1 kg weniger">−</button>
          <span class="gross" id="gw">${zahl(wert, 1)}</span>
          <button type="button" class="rund" data-d="0.1" aria-label="0,1 kg mehr">+</button>
          <button type="button" class="rund" data-d="1" aria-label="1 kg mehr">+1</button>
        </div>
        <button type="button" class="btn btn-primary btn-wide" data-act="wiegen">Gewicht von heute speichern</button>
        <details><summary class="hint">So wiegst du richtig</summary><p class="hint">Morgens nach dem Aufstehen und der Toilette, vor Essen und Trinken, immer dieselbe Waage am selben Platz. Am besten täglich oder mindestens 3× pro Woche. Einzelwerte schwanken um mehr als 1 kg – zählt nur das Mittel.</p></details>
      </div>

      ${p?.ziel === 'rekomposition' ? zielCheck(messungen, heute) : ''}
      <div class="card">
        <h3>Taille</h3>
        <p>${taille ? `${zahl(taille.wert, 1)} cm am ${datum(taille.datum)}` : 'Noch nicht gemessen.'}</p>
        <details><summary class="hint">So misst du richtig (WHO)</summary><p class="hint">Im Stehen, auf nackter Haut, Arme hängen lassen. Maßband waagerecht in der Mitte zwischen unterster Rippe und Oberkante des Beckenknochens, am Ende einer normalen Ausatmung. Alle 2–4 Wochen, morgens.</p></details>
        <button type="button" class="btn" data-act="umfang">Umfang eintragen</button>
        ${messungen.filter((x) => x.art !== 'gewicht').length ? `<ul class="liste kompakt">${messungen.filter((x) => x.art !== 'gewicht').sort((a, b) => (a.datum < b.datum ? 1 : -1)).slice(0, 8).map((x) => `<li><span>${esc(MESSARTEN[x.art]?.name || x.art)}: ${zahl(x.wert, 1)} cm · ${datum(x.datum)}</span><button type="button" class="link" data-weg="${x.id}" aria-label="Löschen">✕</button></li>`).join('')}</ul>` : ''}
      </div>

      <div class="card">
        <h3>Profil</h3>
        ${p ? `<p>${alterAm(p.geburtsdatum, heute)} Jahre · ${p.groesseCm} cm</p>` : '<p>Noch kein Profil.</p>'}
        <a class="btn" href="#/profil">${p ? 'Ändern' : 'Anlegen'}</a>
      </div>

      <div class="card">
        <h3>Gesundheit</h3>
        ${aktiv(einschraenkungen).length ? `<ul class="liste kompakt">${aktiv(einschraenkungen).map((e) => `<li>${esc(STELLEN[e.stelle] || e.stelle)}${e.seite ? ` ${esc(e.seite)}` : ''}: ${esc(ARTEN[e.art] || e.art)}</li>`).join('')}</ul>` : '<p>Keine Einschränkungen eingetragen.</p>'}
        <a class="btn" href="#/gesundheit">Gesundheitsabfrage</a>
      </div>

      <div class="card">
        <h3>Unverträglichkeiten</h3>
        ${unv.length ? `<ul class="liste kompakt">${unv.map((n) => `<li><span class="${n.status === 'erledigt' ? 'durch' : ''}">${esc(n.text)}</span><button type="button" class="link klein" data-erl="${n.id}">${n.status === 'erledigt' ? 'wieder aktiv' : 'erledigt'}</button></li>`).join('')}</ul>` : '<p class="hint">Keine eingetragen.</p>'}
        <button type="button" class="btn" data-act="unv">+ Eintragen</button>
      </div>

      <h2>Letzte Wiegungen</h2>
      <ul class="liste kompakt">${gewichte.slice(-10).reverse().map((g) => `<li><span>${datum(g.datum)}: ${zahl(g.wert, 1)} kg</span><button type="button" class="link" data-weg="${g.id}" aria-label="Löschen">✕</button></li>`).join('') || '<li class="hint">Noch keine.</li>'}</ul>
    </section>`;

  const neu = () => render(view);
  view.querySelectorAll('[data-d]').forEach((b) => b.addEventListener('click', () => {
    wert = Math.round((wert + Number(b.dataset.d)) * 10) / 10;
    view.querySelector('#gw').textContent = zahl(wert, 1);
  }));
  view.querySelector('[data-act=wiegen]').addEventListener('click', async () => {
    // je Tag ein Wert: heutigen ersetzen
    for (const g of gewichte.filter((x) => x.datum === heute)) await loesche('messungen', g.id);
    await speichere('messungen', { id: neueId(), datum: heute, zeit: new Date().toISOString(), art: 'gewicht', wert, einheit: 'kg' });
    toast('Gespeichert.');
    neu();
  });
  view.querySelector('[data-act=umfang]').addEventListener('click', async () => {
    const r = await dialog({
      title: 'Umfang',
      body: `<div class="form"><label for="ua">Was?</label><select id="ua" name="art">${Object.entries(MESSARTEN).filter(([k]) => k !== 'gewicht').map(([k, v]) => `<option value="${k}">${esc(v.name)}</option>`).join('')}</select>
        <label for="uw">cm</label><input id="uw" name="wert" type="number" inputmode="decimal" step="0.5"></div>
        <p class="hint">Brust, Oberarm und Oberschenkel sind nur für dich – sie fließen in keine Berechnung ein. Immer dieselbe Stelle und Seite messen.</p>`,
      buttons: [{ label: 'Abbrechen', value: 'x' }, { label: 'Speichern', value: 'ok', primary: true }],
      validate: (f) => (Number(String(f.wert).replace(',', '.')) > 0 ? '' : 'Bitte einen Wert eintragen.'),
    });
    if (r?.value !== 'ok') return;
    await speichere('messungen', { id: neueId(), datum: heute, zeit: new Date().toISOString(), art: r.fields.art, wert: Number(String(r.fields.wert).replace(',', '.')), einheit: 'cm' });
    neu();
  });
  view.querySelectorAll('[data-weg]').forEach((b) => b.addEventListener('click', async () => { await loesche('messungen', b.dataset.weg); neu(); }));
  view.querySelector('[data-act=unv]').addEventListener('click', async () => {
    const r = await dialog({
      title: 'Unverträglichkeit',
      body: '<div class="form"><label for="ut">Was verträgst du nicht?</label><input id="ut" name="text" type="text" placeholder="z. B. Laktose"></div>',
      buttons: [{ label: 'Abbrechen', value: 'x' }, { label: 'Speichern', value: 'ok', primary: true }],
      validate: (f) => (f.text.trim() ? '' : 'Bitte etwas eintragen.'),
    });
    if (r?.value !== 'ok') return;
    await speichere('notizen', { id: neueId(), typ: 'unvertraeglichkeit', text: r.fields.text.trim(), beginn: heute, status: 'aktiv' });
    neu();
  });
  view.querySelectorAll('[data-erl]').forEach((b) => b.addEventListener('click', async () => {
    const n = unv.find((x) => x.id === b.dataset.erl);
    await speichere('notizen', { ...n, status: n.status === 'erledigt' ? 'aktiv' : 'erledigt', erledigtAm: n.status === 'erledigt' ? null : heute });
    neu();
  }));
}

// Ziel „Fett ab, Muskeln auf“: Gewicht etwa gleich, Taille sinkt. Vergleich mit vor 4 Wochen.
function zielCheck(messungen, heute) {
  const jetzt = mittel7(messungen, heute).wert;
  const vorher = mittel7(messungen, plusTage(heute, -28)).wert;
  const t = messungen.filter((m) => m.art === 'taille').sort((a, b) => (a.datum < b.datum ? -1 : 1));
  const tNeu = t[t.length - 1];
  const tAlt = [...t].reverse().find((m) => m.datum <= plusTage(heute, -21));
  const zeilen = [];
  if (jetzt != null && vorher != null) zeilen.push(`Gewicht in 4 Wochen: ${jetzt - vorher >= 0 ? '+' : ''}${zahl(jetzt - vorher, 1)} kg`);
  if (tNeu && tAlt) zeilen.push(`Taille seit ${datum(tAlt.datum)}: ${tNeu.wert - tAlt.wert >= 0 ? '+' : ''}${zahl(tNeu.wert - tAlt.wert, 1)} cm`);
  return `<div class="card card-soft"><h3>Ziel: Fett ab, Muskeln auf</h3>
    <p>Läuft gut, wenn das Gewicht etwa gleich bleibt und die Taille langsam schmaler wird.</p>
    ${zeilen.length ? `<ul class="liste kompakt">${zeilen.map((z) => `<li>${esc(z)}</li>`).join('')}</ul>` : '<p class="hint">Für den Vergleich braucht es Wiegungen über 4 Wochen und zwei Taillenmessungen mit 3 Wochen Abstand.</p>'}
  </div>`;
}

function kurve(punkte) {
  const w = 300, h = 80, pad = 6;
  const min = Math.min(...punkte.map((p) => p.wert)) - 0.5;
  const max = Math.max(...punkte.map((p) => p.wert)) + 0.5;
  const x = (i) => pad + (i * (w - 2 * pad)) / (punkte.length - 1);
  const y = (v) => h - pad - ((v - min) * (h - 2 * pad)) / (max - min);
  const d = punkte.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.wert).toFixed(1)}`).join(' ');
  return `<svg class="kurve" viewBox="0 0 ${w} ${h}" role="img" aria-label="Gewichtsverlauf der letzten Wochen (Wochenmittel)"><path d="${d}"/>${punkte.map((p, i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(p.wert).toFixed(1)}" r="3"/>`).join('')}</svg>
    <p class="hint">Wochenmittel: ${zahl(punkte[0].wert, 1)} → ${zahl(punkte[punkte.length - 1].wert, 1)} kg</p>`;
}
