// Meine Geräte: Vorlagen abhaken, Gewichtsstufen und Einstellungen, eigene Geräte, Übungen aus-/einblenden.
import { alle, hole, speichere, loesche, neueId, kv } from './db.js?v=0.1.8';
import { ladeGeraete, ladeUebungen, studioAn } from './kontext.js?v=0.1.8';
import { BEREICHE, STUDIO_NAME } from './studio.js?v=0.1.8';
import { MUSTER, BELASTUNGSART, GERAETE } from './katalog.js?v=0.1.8';
import { stufenAusVorschlag, kombiniert, anzeige } from './stufen.js?v=0.1.8';
import { paarId } from './vorschlag.js?v=0.1.8';
import { esc, dialog, toast } from './ui.js?v=0.1.8';

const REIHE = ['druecken', 'ziehen', 'beine', 'rumpf', 'ausdauer'];

async function geraetSpeichern(g) {
  const alt = (await hole('geraete', g.id)) || {};
  const felder = { ...alt, id: g.id, [g.vorhandenFeld || 'vorhanden']: g.vorhanden, stufen: g.stufen, zusatz: g.zusatz, anzeige: g.anzeige, werte: g.werte, notiz: g.notiz, uebungenExtra: g.uebungenExtra, stufenGeprueft: !!g.stufenGeprueft };
  if (g.eigen) Object.assign(felder, { eigen: true, name: g.name, muster: g.muster, art: g.art, einstellungen: g.einstellungen, vorlageVon: g.vorlageVon || null });
  await speichere('geraete', felder);
}

export async function render(view) {
  const geraete = await ladeGeraete();
  const studio = await studioAn();
  const liste = Object.values(geraete);
  const anzahl = liste.filter((g) => g.vorhanden).length;
  const zeile = (g) => `
          <li>
            <label class="check zeile"><input type="checkbox" data-hab="${esc(g.id)}" ${g.vorhanden ? 'checked' : ''}>${g.studio && g.nr != null ? `<span class="nr ${g.bereich === 'rot' ? 'rot' : ''}">${g.nr}</span>` : ''}<span><strong>${esc(g.studio ? g.kurzname : g.name)}</strong>${!g.studio && g.aliase?.length ? `<br><span class="hint">${esc(g.aliase.join(', '))}</span>` : ''}${g.eigen ? ' <span class="tag">eigen</span>' : ''}${g.studio && (g.art === 'kg') && !g.stufenGeprueft && g.vorhanden ? '<br><span class="hint">Stufen noch prüfen</span>' : ''}</span></label>
            <a class="btn klein" href="#/geraet/${encodeURIComponent(g.id)}">Einstellen</a>
          </li>`;
  const nachMuster = (arr) => REIHE.map((m) => {
    const teil = arr.filter((g) => (g.muster === m) || (m === 'rumpf' && !REIHE.includes(g.muster)));
    return teil.length ? `<h2>${esc(MUSTER[m])}</h2><ul class="liste geraete">${teil.map(zeile).join('')}</ul>` : '';
  }).join('');
  const studioListe = Object.entries(BEREICHE).map(([b, titel]) => {
    const teil = liste.filter((g) => g.studio && g.bereich === b).sort((x, y) => (x.nr ?? 99) - (y.nr ?? 99));
    return teil.length ? `<h2>${esc(titel)}</h2><ul class="liste geraete">${teil.map(zeile).join('')}</ul>` : '';
  }).join('');
  const eigene = liste.filter((g) => g.eigen);
  view.innerHTML = `
    <section>
      <a class="back" href="#/training">← Training</a>
      <h1 class="title title-sm">Meine Geräte</h1>
      ${studio ? `
        <p class="lead">${esc(STUDIO_NAME)}: alle Geräte mit Nummer (${anzahl} aktiv). Was kaputt oder weg ist, abhaken. Antippen zum Einstellen von Gewichtsstufen und Sitzhöhe.</p>
        ${studioListe}
        ${eigene.length ? `<h2>Eigene Geräte</h2><ul class="liste geraete">${eigene.map(zeile).join('')}</ul>` : ''}
        <details class="card aufklapp"><summary>Allgemeine Vorlagen (zusätzlich)</summary>${nachMuster(liste.filter((g) => g.allgemein))}</details>`
      : `<p class="lead">Hake ab, was dein Studio hat (${anzahl} abgehakt). Antippen zum Einstellen von Gewichten und Sitzhöhe.</p>${nachMuster(liste.filter((g) => !g.studio))}`}
      <button type="button" class="btn btn-wide" data-act="neu">+ Eigenes Gerät anlegen</button>
      <button type="button" class="btn btn-quiet btn-wide" data-act="modus">${studio ? 'Allgemeine Liste statt Studio-Liste verwenden' : `Liste „${esc(STUDIO_NAME)}“ verwenden`}</button>
    </section>`;
  view.querySelector('[data-act=modus]').addEventListener('click', async () => {
    await kv.set('studio', studio ? 'aus' : 'an');
    render(view);
  });
  view.querySelectorAll('[data-hab]').forEach((c) => c.addEventListener('change', async () => {
    const g = geraete[c.dataset.hab];
    g.vorhanden = c.checked;
    await geraetSpeichern(g);
  }));
  view.querySelector('[data-act=neu]').addEventListener('click', () => neuesGeraet(geraete));
}

async function neuesGeraet(geraete) {
  const vorlagen = GERAETE.filter((g) => g.art !== 'ausdauer');
  const r = await dialog({
    title: 'Eigenes Gerät',
    body: `<div class="form">
      <label for="gn">Name</label><input id="gn" name="name" type="text" placeholder="z. B. Brustpresse 2 (blau)">
      <label for="gv">Wie Gerät … (kopiert Muster, Gewichte, Übungen)</label>
      <select id="gv" name="vorlage"><option value="">– nichts kopieren –</option>${vorlagen.map((g) => `<option value="${g.id}">${esc(g.name)}</option>`).join('')}</select>
      <label for="gm">Muster</label>
      <select id="gm" name="muster">${['druecken', 'ziehen', 'beine', 'rumpf'].map((m) => `<option value="${m}">${esc(MUSTER[m])}</option>`).join('')}</select>
      <label for="ga">Belastung</label>
      <select id="ga" name="art">${['kg', 'koerper', 'zeit'].map((a) => `<option value="${a}">${esc(BELASTUNGSART[a])}</option>`).join('')}</select>
    </div>`,
    buttons: [{ label: 'Abbrechen', value: 'x' }, { label: 'Anlegen', value: 'ok', primary: true }],
    validate: (f) => (f.name.trim() ? '' : 'Bitte einen Namen eingeben.'),
  });
  if (r?.value !== 'ok') return;
  const f = r.fields;
  const v = GERAETE.find((g) => g.id === f.vorlage);
  const vg = v ? geraete[v.id] : null;
  const g = {
    id: 'eigen-' + neueId(), eigen: true, vorhanden: true, name: f.name.trim(),
    muster: v ? v.muster : f.muster, art: v ? v.art : f.art,
    stufen: vg ? [...vg.stufen] : (f.art === 'kg' ? stufenAusVorschlag({ start: 5, schritt: 5, max: 100 }) : []),
    zusatz: [0], anzeige: vg?.anzeige || 'kg', werte: {}, einstellungen: v ? [...v.einstellungen] : ['Sitzhöhe'],
    uebungenExtra: [], vorlageVon: v?.id || null,
  };
  if (v) {
    const uebungen = await ladeUebungen(geraete);
    g.uebungenExtra = uebungen.filter((u) => u.geraete.includes(v.id)).map((u) => u.id);
  }
  await geraetSpeichern(g);
  location.hash = `#/geraet/${encodeURIComponent(g.id)}`;
}

export async function renderGeraet(view, id) {
  const geraete = await ladeGeraete();
  const g = geraete[id];
  if (!g) { location.hash = '#/geraete'; return; }
  const uebungen = (await ladeUebungen(geraete)).filter((u) => u.geraete.includes(g.id));
  const staende = Object.fromEntries((await alle('geraetUebung')).map((s) => [s.id, s]));
  const hatStufen = g.art === 'kg' || g.art === 'ball';
  const stufen = [...kombiniert(g)].sort((a, b) => a - b); // Eingabefelder immer aufsteigend (auch bei Unterstützung)

  view.innerHTML = `
    <section>
      <a class="back" href="#/geraete">← Meine Geräte</a>
      <h1 class="title title-sm">${esc(g.name)}</h1>
      <label class="check zeile"><input type="checkbox" id="hab" ${g.vorhanden ? 'checked' : ''}><span>Gibt es in meinem Studio</span></label>

      ${hatStufen ? `
        <div class="card">
          <h3>Gewichtsstufen</h3>
          <p class="hint">So wie am Gerät angezeigt. Die App steigert immer um eine Stufe.</p>
          <div class="seg"><button type="button" class="btn ${g.anzeige !== 'stufe' ? 'on' : ''}" data-anz="kg">in kg</button><button type="button" class="btn ${g.anzeige === 'stufe' ? 'on' : ''}" data-anz="stufe">als Stufe/Platte</button></div>
          <div class="form drei-spalten">
            <label>Kleinste<input type="number" inputmode="decimal" id="st-start" value="${stufen[0] ?? ''}"></label>
            <label>Schritt<input type="number" inputmode="decimal" id="st-schritt" value="${stufen.length > 1 ? Math.round((stufen[1] - stufen[0]) * 100) / 100 : ''}"></label>
            <label>Größte<input type="number" inputmode="decimal" id="st-max" value="${stufen[stufen.length - 1] ?? ''}"></label>
          </div>
          <label class="form">Oder frei, mit Leerzeichen getrennt (z. B. 5 10 15 22,5)<input type="text" id="st-frei" value="${esc((g.stufen || []).join(' ').replace(/\./g, ','))}"></label>
          <label class="form">Zusatzgewicht zum Aufstecken (z. B. 2,5) – leer lassen, wenn es keins gibt<input type="text" id="st-zusatz" value="${esc((g.zusatz || []).filter((z) => z).join(' ').replace(/\./g, ','))}"></label>
          <p class="hint" id="st-vorschau">${g.umgekehrt ? 'Mehr Gewicht = mehr Hilfe = leichter. ' : ''}${stufen.length} Stufen: ${esc(kombiniert(g).slice(0, 8).map((_, i) => anzeige(g, i)).join(', '))}${stufen.length > 8 ? ' …' : ''}</p>
          <button type="button" class="btn btn-primary" data-act="stufen">Stufen speichern</button>
        </div>` : ''}

      ${(g.einstellungen || []).length ? `
        <div class="card form">
          <h3>Meine Einstellungen</h3>
          <p class="hint">Werden beim Training angezeigt.</p>
          ${(g.einstellungen || []).map((n, i) => `<label for="e${i}">${esc(n)}</label><input type="text" id="e${i}" data-einst="${esc(n)}" value="${esc(g.werte?.[n] || '')}">`).join('')}
          <button type="button" class="btn btn-primary" data-act="einst">Speichern</button>
        </div>` : ''}

      <div class="card">
        <h3>Übungen an diesem Gerät</h3>
        <ul class="liste">${uebungen.map((u) => {
          const st = staende[paarId(g.id, u.id)];
          const aus = st && st.ausgeblendet && st.ausgeblendet !== 'nein';
          return `<li><span><strong>${esc(u.name)}</strong><br><span class="hint">${esc(MUSTER[u.muster] || '')}${aus ? ` · ${st.ausgeblendet === 'vorsorglich' ? 'vorsorglich ausgeblendet' : 'ausgeblendet'}` : ''}</span></span><button type="button" class="btn klein" data-aus="${esc(u.id)}">${aus ? 'Einblenden' : 'Ausblenden'}</button></li>`;
        }).join('') || '<li class="hint">Keine Übung zugeordnet.</li>'}</ul>
        ${g.eigen ? '<button type="button" class="btn" data-act="uebung">+ Übung zuordnen</button>' : ''}
      </div>
      ${g.eigen ? '<button type="button" class="btn btn-quiet" data-act="loeschen">Gerät löschen</button>' : ''}
    </section>`;

  const neu = () => renderGeraet(view, id);
  view.querySelector('#hab').addEventListener('change', async (e) => { g.vorhanden = e.target.checked; await geraetSpeichern(g); });
  view.querySelectorAll('[data-anz]').forEach((b) => b.addEventListener('click', async () => { g.anzeige = b.dataset.anz; await geraetSpeichern(g); neu(); }));
  const zahlen = (s) => String(s || '').split(/[;\s]+/).map((x) => Number(x.replace(',', '.'))).filter((x) => Number.isFinite(x) && x > 0);
  view.querySelector('[data-act=stufen]')?.addEventListener('click', async () => {
    const frei = zahlen(view.querySelector('#st-frei').value);
    const start = Number(view.querySelector('#st-start').value), schritt = Number(view.querySelector('#st-schritt').value), max = Number(view.querySelector('#st-max').value);
    const neuStufen = frei.length >= 2 && frei.join() !== (g.stufen || []).join() ? [...new Set(frei)].sort((a, b) => a - b)
      : start > 0 && schritt > 0 && max >= start ? stufenAusVorschlag({ start, schritt, max }) : null;
    if (!neuStufen || neuStufen.length > 200) { toast('Bitte kleinste, Schritt und größte Stufe angeben.'); return; }
    g.stufen = neuStufen;
    g.zusatz = [0, ...zahlen(view.querySelector('#st-zusatz').value)];
    g.stufenGeprueft = true;
    await geraetSpeichern(g);
    toast('Stufen gespeichert. Bereits gemerkte Gewichte bleiben auf ihrer Stufennummer – bitte beim nächsten Satz prüfen.', 5000);
    neu();
  });
  view.querySelector('[data-act=einst]')?.addEventListener('click', async () => {
    g.werte = Object.fromEntries([...view.querySelectorAll('[data-einst]')].map((i) => [i.dataset.einst, i.value.trim()]));
    await geraetSpeichern(g);
    toast('Gespeichert.');
  });
  view.querySelectorAll('[data-aus]').forEach((b) => b.addEventListener('click', async () => {
    const pid = paarId(g.id, b.dataset.aus);
    const st = staende[pid] || (await hole('geraetUebung', pid));
    const aus = st && st.ausgeblendet && st.ausgeblendet !== 'nein';
    await speichere('geraetUebung', { ...(st || { id: pid, geraetId: g.id, uebungId: b.dataset.aus, stufenIndex: 0, ziel: 10, erstesTraining: true }), ausgeblendet: aus ? 'nein' : 'nutzer', gelenkSchlechterInFolge: 0 });
    neu();
  }));
  view.querySelector('[data-act=uebung]')?.addEventListener('click', async () => {
    const alleU = (await ladeUebungen(geraete)).filter((u) => u.muster === g.muster && !u.geraete.includes(g.id));
    const r = await dialog({
      title: 'Übung zuordnen',
      body: `<div class="form"><label for="uw">Vorhandene Übung</label><select id="uw" name="uebung"><option value="">– neue Übung –</option>${alleU.map((u) => `<option value="${u.id}">${esc(u.name)}</option>`).join('')}</select>
        <label for="un">oder neue Übung (Name)</label><input id="un" name="name" type="text"></div>`,
      buttons: [{ label: 'Abbrechen', value: 'x' }, { label: 'Zuordnen', value: 'ok', primary: true }],
      validate: (f) => (f.uebung || f.name.trim() ? '' : 'Bitte eine Übung wählen oder einen Namen eingeben.'),
    });
    if (r?.value !== 'ok') return;
    let uid = r.fields.uebung;
    if (!uid) {
      uid = 'eigen-' + neueId();
      await speichere('uebungen', { id: uid, name: r.fields.name.trim(), geraete: [g.id], muster: g.muster, gruppe: { druecken: 'brust_schulter', ziehen: 'ruecken', beine: 'beine', rumpf: 'rumpf' }[g.muster], prio: 50, art: g.art === 'zeit' ? 'zeit' : undefined });
    } else g.uebungenExtra = [...(g.uebungenExtra || []), uid];
    await geraetSpeichern(g);
    neu();
  });
  view.querySelector('[data-act=loeschen]')?.addEventListener('click', async () => {
    const r = await dialog({ title: 'Gerät löschen?', body: '<p>Der Verlauf der Sätze bleibt erhalten.</p>', buttons: [{ label: 'Abbrechen', value: 'x' }, { label: 'Löschen', value: 'ok', primary: true }] });
    if (r?.value !== 'ok') return;
    await loesche('geraete', g.id);
    location.hash = '#/geraete';
  });
}
