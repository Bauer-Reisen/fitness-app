// „Mehr": Backup, Supplements, Wie wird gerechnet, Einstellungen, Hilfe, Weitergeben, Offline, Daten löschen.
import { kv, backupErstellen, backupLaden, backupPruefen, allesLoeschen } from './db.js?v=0.1.8';
import { VERSION, APP_NAME } from './config.js?v=0.1.8';
import { esc, dialog, toast, datum } from './ui.js?v=0.1.8';
import { shareCard, wireShare } from './teilen.js?v=0.1.8';
import { installCard } from './install.js?v=0.1.8';
import { runTour } from './tour.js?v=0.1.8';
import { NEWS, showNews } from './news.js?v=0.1.8';
import { refreshOffline } from './offline.js?v=0.1.8';
import { heuteIso } from './datum.js?v=0.1.8';

// Datei teilen (iPhone: Teilen-Menü → „In Dateien sichern“), sonst herunterladen (wie Bike-App)
async function dateiTeilen(text, name) {
  const file = new File([text], name, { type: 'application/json' });
  if (navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file], title: name }); return true; } catch (e) {
      if (e.name === 'AbortError') return false;
      if (e.name === 'NotAllowedError') {
        const r = await dialog({ title: 'Datei ist fertig', body: `<p>${esc(name)}</p>`, buttons: [{ label: 'Abbrechen', value: 'x' }, { label: 'Jetzt teilen / sichern', value: 'ok', primary: true }] });
        if (r?.value !== 'ok') return false;
        try { await navigator.share({ files: [file], title: name }); return true; } catch { return false; }
      }
    }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(file); a.download = name;
  document.body.append(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  return true;
}

export async function render(view) {
  const [letztesBackup, wake, kater] = await Promise.all([kv.get('letztesBackup'), kv.get('wakeLock'), kv.get('katerFrage')]);
  view.innerHTML = `
    <section>
      <h1 class="title title-sm">Mehr</h1>
      <div class="card">
        <h3>Backup</h3>
        <p>Deine Daten liegen nur auf diesem Handy. ${letztesBackup ? `Letztes Backup: ${datum(letztesBackup.slice(0, 10))}.` : 'Noch kein Backup.'}</p>
        <p class="hint">Die Datei enthält auch deine Gesundheitsangaben. Nur an einem sicheren Ort speichern (z. B. eigene iCloud/Dateien) und nicht weitergeben.</p>
        <button type="button" class="btn btn-primary btn-wide" data-act="export">Backup speichern</button>
        <label class="btn btn-wide datei">Backup laden<input type="file" accept=".json,application/json" data-act="import" hidden></label>
      </div>
      <a class="btn btn-wide" href="#/supplemente">Supplement-Prüfliste</a>
      <a class="btn btn-wide" href="#/rechnen">Wie wird gerechnet?</a>
      <div class="card">
        <h3>Einstellungen</h3>
        <label class="check"><input type="checkbox" data-set="wakeLock" ${wake !== false ? 'checked' : ''}> Bildschirm im Training anlassen</label>
        <label class="check"><input type="checkbox" data-set="katerFrage" ${kater !== false ? 'checked' : ''}> Nach dem Training nach Muskelkater fragen</label>
      </div>
      ${shareCard()}
      ${installCard()}
      <div class="card">
        <h3>Hilfe</h3>
        <button type="button" class="btn" data-act="tour">Rundgang ansehen</button>
        ${NEWS.length ? '<button type="button" class="btn" data-act="news">Was ist neu?</button>' : ''}
      </div>
      <div class="card">
        <h3>Ohne Netz</h3>
        <p>Die App speichert sich von selbst. Klappt etwas nicht, hier alles noch einmal speichern (dafür braucht es Netz).</p>
        <button type="button" class="btn" data-act="offline">Alles neu speichern</button>
      </div>
      <div class="card card-soft">
        <h3>Deine Daten</h3>
        <ul class="small daten">
          <li><strong>Kein Konto, kein Server.</strong> Alles bleibt in diesem Handy, bis du selbst ein Backup speicherst.</li>
          <li>Die App fragt nichts im Netz ab außer der eigenen Update-Prüfung.</li>
          <li>Die App ersetzt keine ärztliche Beratung.</li>
        </ul>
        <button type="button" class="btn btn-quiet" data-act="gesundheit-weg">Gesundheitsangaben löschen</button>
        <button type="button" class="btn btn-quiet" data-act="alles-weg">Alle Daten löschen</button>
      </div>
      <p class="hint center">${APP_NAME} · Version ${VERSION}</p>
    </section>`;

  wireShare(view);
  view.querySelector('[data-act=tour]').addEventListener('click', () => runTour());
  view.querySelector('[data-act=news]')?.addEventListener('click', () => showNews(NEWS));
  view.querySelectorAll('[data-set]').forEach((c) => c.addEventListener('change', () => kv.set(c.dataset.set, c.checked)));
  view.querySelector('[data-act=export]').addEventListener('click', async () => {
    const daten = await backupErstellen();
    const ok = await dateiTeilen(JSON.stringify(daten), `fitness-backup-${heuteIso()}.json`);
    if (ok) { await kv.set('letztesBackup', new Date().toISOString()); toast('Backup gespeichert.'); render(view); }
  });
  view.querySelector('[data-act=import]').addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const json = JSON.parse(await file.text());
      backupPruefen(json);
      const r = await dialog({
        title: 'Backup laden?',
        body: `<p>Backup vom ${esc(datum((json.erstellt || '').slice(0, 10)))}. <strong>Alle Daten auf diesem Handy werden durch das Backup ersetzt.</strong></p>`,
        buttons: [{ label: 'Abbrechen', value: 'x' }, { label: 'Ersetzen', value: 'ok', primary: true }],
      });
      if (r?.value !== 'ok') return;
      const n = await backupLaden(json);
      toast(`${n} Einträge geladen.`);
      location.hash = '#/';
    } catch (ex) {
      toast(ex.message || 'Die Datei ließ sich nicht lesen.', 5000);
    } finally { e.target.value = ''; }
  });
  view.querySelector('[data-act=offline]').addEventListener('click', async (e) => {
    e.target.disabled = true;
    try {
      const ok = await refreshOffline();
      toast(ok ? 'Wird neu gespeichert – auf „Heute“ siehst du, wann es fertig ist.' : 'Hier am PC ist der Offline-Speicher aus.');
    } catch { toast('Das hat nicht geklappt. Ist Netz da?'); }
    e.target.disabled = false;
  });
  view.querySelector('[data-act=gesundheit-weg]').addEventListener('click', async () => {
    const r = await dialog({ title: 'Gesundheitsangaben löschen?', body: '<p>Warnzeichen-Antworten und alle Einschränkungen werden gelöscht. Training und Essen bleiben.</p>', buttons: [{ label: 'Abbrechen', value: 'x' }, { label: 'Löschen', value: 'ok', primary: true }] });
    if (r?.value !== 'ok') return;
    await allesLoeschen(['gesundheit', 'einschraenkungen']);
    toast('Gelöscht.');
  });
  view.querySelector('[data-act=alles-weg]').addEventListener('click', async () => {
    const r = await dialog({ title: 'Alle Daten löschen?', body: '<p>Training, Essen, Körperdaten, Geräte und Gesundheitsangaben werden von diesem Handy gelöscht. Das lässt sich nur mit einem Backup rückgängig machen.</p>', buttons: [{ label: 'Abbrechen', value: 'x' }, { label: 'Alles löschen', value: 'ok', primary: true }] });
    if (r?.value !== 'ok') return;
    await allesLoeschen();
    toast('Alles gelöscht.');
    location.hash = '#/';
  });
}
