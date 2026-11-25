// Gesundheitsabfrage (ca. 2 Min.): Warnzeichen, Gelenke/Einschränkungen mit Vorgaben, Wiedervorlage.
// Die App urteilt nicht medizinisch: Warnzeichen führen nur zu einem Hinweis, nie zu einer Sperre.
import { alle, speichere, neueId } from './db.js?v=0.1.5';
import { WARNZEICHEN, letzteAbfrage, neueAbfrage, wiedervorlage, GRUND_TEXT } from './gesundheit.js?v=0.1.5';
import { STELLEN, ARTEN, VORGABEN } from './gelenke.js?v=0.1.5';
import { esc, dialog, toast, datum } from './ui.js?v=0.1.5';
import { heuteIso } from './datum.js?v=0.1.5';
import { ladeTrainings } from './kontext.js?v=0.1.5';

const SEITEN = { links: 'links', rechts: 'rechts', beide: 'beide' };
let entwurf = null; // Antworten bleiben erhalten, wenn die Seite nach „Körperstelle hinzufügen“ neu gezeichnet wird

export async function render(view) {
  const [gesundheit, einschraenkungen, trainings] = await Promise.all([alle('gesundheit'), alle('einschraenkungen'), ladeTrainings()]);
  const letzte = letzteAbfrage(gesundheit);
  const grund = wiedervorlage({ heute: heuteIso(), gesundheit, einschraenkungen, letztesTrainingDatum: trainings.filter((t) => t.status === 'beendet').pop()?.datum });
  const wz = entwurf || letzte?.warnzeichen || {};
  const beantwortet = !!(entwurf || letzte);
  const liste = [...einschraenkungen].sort((a, b) => (a.status === 'erledigt') - (b.status === 'erledigt'));

  view.innerHTML = `
    <section>
      <a class="back" href="#/koerper">← Körper</a>
      <h1 class="title title-sm">Gesundheit</h1>
      ${grund && grund !== 'erst' ? `<div class="card card-warn"><p>${esc(GRUND_TEXT[grund])}</p></div>` : ''}
      ${letzte ? `<p class="hint">Zuletzt geprüft am ${datum(letzte.datum)}.</p>` : '<p class="lead">Ein paar kurze Fragen, damit das Training zu dir passt. Die Antworten bleiben nur auf diesem Handy.</p>'}

      <div class="card">
        <h3>1. Warnzeichen</h3>
        <p class="hint">Angelehnt an anerkannte Vorab-Fragebögen (PAR-Q+, ACSM). Eigene Formulierung.</p>
        ${Object.entries(WARNZEICHEN).map(([k, frage]) => `
          <div class="frage"><p>${esc(frage)}</p>
            <div class="seg" data-wz="${k}"><button type="button" class="btn ${wz[k] === false || (beantwortet && wz[k] !== true && wz[k] !== null) ? 'on' : ''}" data-v="nein">Nein</button><button type="button" class="btn ${wz[k] ? 'on' : ''}" data-v="ja">Ja</button></div>
          </div>`).join('')}
        <div class="card card-warn" id="wz-hinweis" hidden>
          <p><strong>Bitte vor dem Training ärztlich abklären, ob und wie du trainieren darfst.</strong> Die App sperrt nichts – du entscheidest.</p>
        </div>
      </div>

      <div class="card">
        <h3>2. Gelenke und Einschränkungen</h3>
        <p class="hint">Was beim Training Rücksicht braucht. Daraus wählt die App Übungen, blendet vorsorglich manches aus und plant gezielte Übungen ein.</p>
        <ul class="liste">${liste.map((e) => `
          <li><span class="${e.status === 'erledigt' ? 'durch' : ''}"><strong>${esc(STELLEN[e.stelle] || e.stelle)}${e.seite ? ` ${esc(e.seite)}` : ''}</strong>: ${esc(ARTEN[e.art] || e.art)}${e.opMonat ? ` (${esc(e.opMonat.split('-').reverse().join('/'))})` : ''}
            ${e.vorgaben && Object.keys(VORGABEN).some((k) => e.vorgaben[k]) ? `<br><span class="hint">Vorgaben: ${Object.keys(VORGABEN).filter((k) => e.vorgaben[k]).map((k) => esc(VORGABEN[k])).join(', ')}</span>` : ''}
            ${e.vorgaben?.weissNicht ? '<br><span class="hint">Vorgaben unbekannt – die App blendet tiefe Beugung, Drehung und Bein zur Mitte vorsorglich aus.</span>' : ''}
            ${e.vorgabeText ? `<br><span class="hint">„${esc(e.vorgabeText)}“</span>` : ''}</span>
            <span class="knoepfe"><button type="button" class="btn klein" data-edit="${e.id}">Ändern</button></span></li>`).join('') || '<li class="hint">Nichts eingetragen.</li>'}</ul>
        <button type="button" class="btn" data-act="neu">+ Körperstelle hinzufügen</button>
      </div>

      <div class="card">
        <h3>3. Trainingserfahrung</h3>
        <p>Steht in deinem <a href="#/profil">Profil</a>.</p>
      </div>

      <button type="button" class="btn btn-primary btn-wide btn-big" data-act="fertig">${letzte ? 'Alles geprüft – speichern' : 'Fertig'}</button>
      <p class="hint">Die App ersetzt keine ärztliche Beratung. Bei Schmerz, Schwindel oder Brustdruck: Training abbrechen.</p>
    </section>`;

  const antworten = { ...Object.fromEntries(Object.keys(WARNZEICHEN).map((k) => [k, entwurf ? entwurf[k] : letzte ? !!wz[k] : null])) };
  entwurf = antworten;
  const hinweis = () => { view.querySelector('#wz-hinweis').hidden = !Object.values(antworten).some(Boolean); };
  hinweis();
  view.querySelectorAll('[data-wz]').forEach((seg) => seg.querySelectorAll('.btn').forEach((b) => b.addEventListener('click', () => {
    antworten[seg.dataset.wz] = b.dataset.v === 'ja';
    seg.querySelectorAll('.btn').forEach((x) => x.classList.toggle('on', x === b));
    hinweis();
  })));
  view.querySelector('[data-act=neu]').addEventListener('click', async () => { if (await bearbeiten()) render(view); });
  view.querySelectorAll('[data-edit]').forEach((b) => b.addEventListener('click', async () => {
    if (await bearbeiten(einschraenkungen.find((e) => e.id === b.dataset.edit))) render(view);
  }));
  view.querySelector('[data-act=fertig]').addEventListener('click', async () => {
    if (Object.values(antworten).some((v) => v === null)) { toast('Bitte alle 5 Fragen beantworten.'); return; }
    const a = neueAbfrage(grund || 'manuell', antworten);
    if (Object.values(antworten).some(Boolean)) {
      const r = await dialog({
        title: 'Ärztlich abklären',
        body: '<p>Du hast mindestens eine Frage mit Ja beantwortet. Bitte kläre vor dem Training ärztlich ab, ob und wie du trainieren darfst.</p>',
        buttons: [{ label: 'Trotzdem fortfahren', value: 'trotzdem' }, { label: 'Habe ich abgeklärt', value: 'ok', primary: true }],
      });
      if (!r) return;
      a[r.value === 'ok' ? 'abgeklaertAm' : 'trotzdemAm'] = heuteIso();
    }
    await speichere('gesundheit', { id: neueId(), ...a });
    entwurf = null;
    toast('Gesundheitsangaben gespeichert.');
    location.hash = '#/';
  });
}

async function bearbeiten(alt) {
  const e = alt || { stelle: 'huefte', seite: 'rechts', art: 'arthrose', vorgaben: {}, status: 'aktiv' };
  const opt = (werte, wert) => Object.entries(werte).map(([k, l]) => `<option value="${k}" ${k === wert ? 'selected' : ''}>${esc(l)}</option>`).join('');
  const r = await dialog({
    title: alt ? 'Ändern' : 'Körperstelle',
    body: `<div class="form">
      <label for="es">Stelle</label><select id="es" name="stelle">${opt(STELLEN, e.stelle)}</select>
      <label for="esi">Seite</label><select id="esi" name="seite">${opt(SEITEN, e.seite)}</select>
      <label for="ea">Art</label><select id="ea" name="art">${opt(ARTEN, e.art)}</select>
      <label for="eo">OP-Monat (bei Gelenkersatz oder geplanter OP)</label><input id="eo" name="opMonat" type="month" value="${esc(e.opMonat || '')}" max="2100-12">
      <fieldset class="vorgaben"><legend>Ärztliche oder physiotherapeutische Vorgaben (vor allem bei Hüftprothese)</legend>
        ${Object.entries(VORGABEN).map(([k, l]) => `<label class="check"><input type="checkbox" name="v_${k}" ${e.vorgaben?.[k] ? 'checked' : ''}> ${esc(l)}</label>`).join('')}
        <label class="check"><input type="checkbox" name="v_weissNicht" ${e.vorgaben?.weissNicht ? 'checked' : ''}> weiß nicht</label>
      </fieldset>
      <label for="et">Weitere Vorgaben oder Notiz (wird im Training angezeigt)</label><input id="et" name="vorgabeText" type="text" value="${esc(e.vorgabeText || '')}">
      ${alt ? `<label class="check"><input type="checkbox" name="erledigt" ${e.status === 'erledigt' ? 'checked' : ''}> erledigt (gilt nicht mehr)</label>` : ''}
    </div>`,
    buttons: [{ label: 'Abbrechen', value: 'x' }, { label: 'Speichern', value: 'ok', primary: true }],
    validate: (f) => ((f.art === 'gelenkersatz' || f.art === 'opGeplant') && !f.opMonat ? 'Bitte den OP-Monat angeben (ungefähr reicht).' : ''),
  });
  if (r?.value !== 'ok') return false;
  const f = r.fields;
  const vorgaben = Object.fromEntries([...Object.keys(VORGABEN), 'weissNicht'].map((k) => [k, f['v_' + k] === 'on']));
  const neu = {
    ...e, id: e.id || neueId(), stelle: f.stelle, seite: f.seite, art: f.art, opMonat: f.opMonat || null,
    vorgaben, vorgabeText: f.vorgabeText.trim(), beginn: e.beginn || heuteIso(),
    status: f.erledigt === 'on' ? 'erledigt' : 'aktiv', erledigtAm: f.erledigt === 'on' ? (e.erledigtAm || heuteIso()) : null,
  };
  await speichere('einschraenkungen', neu);
  if (f.art === 'gelenkersatz' && (!alt || alt.art !== 'gelenkersatz' || !Object.values(vorgaben).some(Boolean))) {
    await dialog({ title: 'Hinweis', body: '<p>Nach einer Gelenk-OP: Training erst mit ärztlicher oder physiotherapeutischer Freigabe beginnen. Frag dort nach Vorgaben zu Beugung, Drehung oder Überkreuzen und trag sie hier ein. Weißt du es nicht, hake „weiß nicht“ an – dann ist die App vorsichtiger. Eigene Fristen setzt die App nicht.</p>' });
  }
  return true;
}
