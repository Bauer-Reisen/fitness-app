// Profil: Werte für Bedarf und Startprofil (Erfahrung je Muster).
import { alle, speichere, neueId } from './db.js?v=0.1.3';
import { ALLTAG, ZIELE } from './bedarf.js?v=0.1.3';
import { MUSTER } from './katalog.js?v=0.1.3';
import { esc, toast } from './ui.js?v=0.1.3';
import { heuteIso } from './datum.js?v=0.1.3';

const ERFAHRUNG = { neu: 'neu', frueher: 'früher regelmäßig', aktuell: 'aktuell regelmäßig' };
const AUSDAUER = { 5: 'unter 10 Min.', 20: '10–30 Min.', 45: '30–60 Min.', 90: 'über 60 Min.' };

export async function render(view) {
  const [profile, messungen, gesundheit] = await Promise.all([alle('profil'), alle('messungen'), alle('gesundheit')]);
  const p = profile[0] || { id: 'ich', geschlecht: 'm', alltagsfaktor: 1.4, ziel: 'rekomposition', erfahrung: {} };
  const ersteinrichtung = !profile.length;
  const hatGewicht = messungen.some((m) => m.art === 'gewicht');
  const radio = (name, werte, aktiv) => `<div class="seg ${Object.keys(werte).length > 2 ? 'drei' : ''}" data-name="${name}">${Object.entries(werte).map(([k, l]) => `<button type="button" class="btn ${String(aktiv) === String(k) ? 'on' : ''}" data-v="${esc(k)}">${esc(l)}</button>`).join('')}</div>`;

  view.innerHTML = `
    <section>
      <a class="back" href="#/koerper">← Körper</a>
      <h1 class="title title-sm">${ersteinrichtung ? 'Dein Profil' : 'Profil ändern'}</h1>
      <p class="lead">Daraus rechnet die App deinen Bedarf und wie vorsichtig sie einsteigt.</p>
      <form class="form" id="f" novalidate>
        <label for="gd">Geburtsdatum</label><input type="date" id="gd" value="${esc(p.geburtsdatum || '')}" required>
        <span class="label">Geschlecht (für die Bedarfsformel)</span>${radio('geschlecht', { m: 'männlich', w: 'weiblich' }, p.geschlecht)}
        <label for="gr">Größe (cm)</label><input type="number" inputmode="numeric" id="gr" value="${esc(p.groesseCm || '')}" required>
        ${hatGewicht ? '' : '<label for="gw">Gewicht heute (kg)</label><input type="number" inputmode="decimal" step="0.1" id="gw" required>'}
        <span class="label">Alltag (ohne Sport)</span>${radio('alltagsfaktor', ALLTAG, p.alltagsfaktor)}
        <span class="label">Ziel</span>${radio('ziel', Object.fromEntries(Object.entries(ZIELE).map(([k, z]) => [k, z.name])), p.ziel)}
        <p class="hint"><strong>Fett ab, Muskeln auf:</strong> nur wenig unter dem Bedarf essen und viel Eiweiß – das Gewicht bleibt etwa gleich, die Taille wird schmaler. Fett wird dabei nicht zu Muskel, aber beides passiert gleichzeitig.</p>
        <h2>Trainingserfahrung</h2>
        <p class="hint">Bestimmt, wie lange der vorsichtige Einstieg dauert (neu 14 Tage, früher 7 Tage, aktuell keiner). Gelenke bremsen nicht von vornherein – das macht dein Feedback (Schmerz, Gelenk am Tag danach).</p>
        ${['druecken', 'ziehen', 'beine', 'rumpf'].map((m) => `<span class="label">${esc(MUSTER[m])}</span>${radio('erf-' + m, ERFAHRUNG, p.erfahrung?.[m] || 'neu')}`).join('')}
        <span class="label">Wie lange schaffst du locker Rad oder Laufband am Stück?</span>${radio('ausdauerMinuten', AUSDAUER, p.ausdauerMinuten || 5)}
        <p class="error" role="alert"></p>
        <button class="btn btn-primary btn-wide btn-big" type="submit">Speichern</button>
      </form>
    </section>`;

  const wahl = {};
  view.querySelectorAll('.seg[data-name]').forEach((seg) => {
    wahl[seg.dataset.name] = seg.querySelector('.on')?.dataset.v;
    seg.querySelectorAll('.btn').forEach((b) => b.addEventListener('click', () => {
      wahl[seg.dataset.name] = b.dataset.v;
      seg.querySelectorAll('.btn').forEach((x) => x.classList.toggle('on', x === b));
    }));
  });
  view.querySelector('#f').addEventListener('submit', async (e) => {
    e.preventDefault();
    const err = view.querySelector('.error');
    const gd = view.querySelector('#gd').value;
    const gr = Number(view.querySelector('#gr').value);
    const gw = view.querySelector('#gw') ? Number(String(view.querySelector('#gw').value).replace(',', '.')) : null;
    if (!gd || gd > heuteIso()) { err.textContent = 'Bitte dein Geburtsdatum eintragen.'; return; }
    if (!(gr >= 120 && gr <= 230)) { err.textContent = 'Bitte die Größe in cm eintragen (z. B. 180).'; return; }
    if (gw !== null && !(gw >= 30 && gw <= 300)) { err.textContent = 'Bitte dein Gewicht in kg eintragen.'; return; }
    const neu = {
      ...p, geburtsdatum: gd, groesseCm: gr, geschlecht: wahl.geschlecht || 'm',
      alltagsfaktor: Number(wahl.alltagsfaktor || 1.4), ziel: wahl.ziel || 'halten',
      erfahrung: Object.fromEntries(['druecken', 'ziehen', 'beine', 'rumpf'].map((m) => [m, wahl['erf-' + m] || 'neu'])),
      ausdauerMinuten: Number(wahl.ausdauerMinuten || 5), startDatum: p.startDatum || heuteIso(),
    };
    await speichere('profil', neu);
    if (gw) await speichere('messungen', { id: neueId(), datum: heuteIso(), zeit: new Date().toISOString(), art: 'gewicht', wert: gw, einheit: 'kg' });
    toast('Profil gespeichert.');
    location.hash = ersteinrichtung && !gesundheit.length ? '#/gesundheit' : '#/koerper';
  });
}
