// Startseite „Heute“: was jetzt dran ist, Muskelkater-Abfrage, Wiedervorlage, Eiweiß heute, Backup-Erinnerung.
import { alle, kv, speichere, hole } from './db.js?v=0.1.5';
import { ladeKontext, bedarfFuer } from './kontext.js?v=0.1.5';
import { planErstellen, nachbefragungAnwenden } from './vorschlag.js?v=0.1.5';
import { katerFaellig, wiedervorlage, GRUND_TEXT } from './gesundheit.js?v=0.1.5';
import { GRUPPEN } from './katalog.js?v=0.1.5';
import { R } from './regeln.js?v=0.1.5';
import { esc, toast } from './ui.js?v=0.1.5';
import { installBanner, wireInstall } from './install.js?v=0.1.5';
import { offlineState } from './offline.js?v=0.1.5';
import { stundenZwischen, tageZwischen, heuteIso } from './datum.js?v=0.1.5';
import { trainingStarten } from './lauf.js?v=0.1.5';
import { shakeErfassen, tagesSumme } from './essen.js?v=0.1.5';

export async function render(view) {
  const ctx = await ladeKontext();
  const heute = ctx.heute;
  const [gesundheit, essen, letztesBackup, katerAn, offline] = await Promise.all([
    alle('gesundheit'), alle('essen'), kv.get('letztesBackup'), kv.get('katerFrage'), offlineState(),
  ]);
  const geraeteDa = Object.values(ctx.geraete).some((g) => g.vorhanden && g.id !== 'boden');
  const einrichten = [
    [!!ctx.profil, 'Profil anlegen', '#/profil'],
    [gesundheit.length > 0, 'Gesundheitsabfrage (2 Min.)', '#/gesundheit'],
    [geraeteDa, 'Geräte deines Studios abhaken', '#/geraete'],
  ];
  const offen = einrichten.filter(([ok]) => !ok);

  const lt = ctx.letztesTraining;
  const kater = katerFaellig(lt, ctx.jetzt, katerAn !== false);
  const zuViel = ctx.saetze.filter((s) => s.schmerz === 'zuViel').map((s) => ({ datum: s.zeit.slice(0, 10), id: s.paarId, muster: ctx.uebungen.find((u) => u.id === s.uebungId)?.muster }));
  const grund = gesundheit.length ? wiedervorlage({
    heute, gesundheit, einschraenkungen: ctx.alleEinschraenkungen, letztesTrainingDatum: lt?.datum, zuVielMeldungen: zuViel, katerHeute: kater,
  }) : null;

  const neueEintraege = ctx.trainings.some((t) => !letztesBackup || (t.geaendert || '') > letztesBackup) || essen.some((e) => !letztesBackup || (e.geaendert || '') > letztesBackup);
  const backupFaellig = ctx.trainings.length > 0 && neueEintraege && (!letztesBackup || tageZwischen(letztesBackup.slice(0, 10), heute) > R.backupErinnerungTage);

  let lage = '';
  let knopf = '';
  if (ctx.laufend) {
    const n = ctx.laufend.schritte.filter((s) => s.typ === 'uebung').length;
    lage = `<p class="lead">Dein Training von ${new Date(ctx.laufend.startMs).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} läuft noch (${n} Übungen).</p>`;
    knopf = '<a class="btn btn-primary btn-wide btn-big" href="#/lauf">Training fortsetzen</a>';
  } else if (!offen.length || ctx.profil) {
    const stunden = lt?.ende ? stundenZwischen(lt.ende, ctx.jetzt) : null;
    const plan = planErstellen(ctx);
    const n = plan.schritte.filter((s) => s.typ === 'uebung').length;
    const heuteSchon = ctx.trainings.some((t) => t.datum === heute && t.status === 'beendet');
    if (heuteSchon) lage = '<p class="lead">Heute schon trainiert ✓ – Erholung gehört dazu.</p>';
    else if (stunden != null && stunden < R.kurzerAbstandStunden) lage = `<p class="lead"><strong>Ruhetag empfohlen.</strong> Dein letztes Training ist erst ${Math.round(stunden)} Stunden her. Trainierst du trotzdem, steigert die App nichts.</p>`;
    else lage = `<p class="lead">Heute dran: <strong>${n} Übungen</strong>${plan.schritte.some((s) => s.rolle === 'foerder') ? ' mit Förderung' : ''}, ca. ${Math.round(10 + n * 7)} Minuten.</p>`;
    knopf = `<button type="button" class="btn btn-primary btn-wide btn-big" data-act="start">${heuteSchon ? 'Noch ein Training' : 'Training starten'}</button>`;
  }

  const b = await bedarfFuer(heute);
  const summe = tagesSumme(essen, heute);
  const gelenkEintrag = ctx.einschraenkungen.some((e) => ['huefte', 'daumen_hand', 'knie', 'schulter', 'ruecken'].includes(e.stelle));

  view.innerHTML = `
    <section>
      <p class="kicker">${new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      <h1 class="title">Heute</h1>
      ${installBanner()}
      ${offen.length ? `
        <div class="card einrichten">
          <h3>Einrichten</h3>
          <ol class="schritte">${einrichten.map(([ok, text, href]) => `<li class="${ok ? 'ok' : ''}">${ok ? '✓ ' : ''}<a href="${href}">${esc(text)}</a></li>`).join('')}</ol>
        </div>` : ''}
      ${kater ? katerKarte(gelenkEintrag) : ''}
      ${grund && !kater ? `<div class="card card-warn"><h3>Gesundheit</h3><p>${esc(GRUND_TEXT[grund])}</p><a class="btn" href="#/gesundheit">Jetzt ansehen</a></div>` : ''}
      ${lage}
      ${knopf}
      ${b ? `
        <div class="card essen-kurz">
          <div class="balken-zeile"><span>Eiweiß</span><strong>${Math.round(summe.eiweiss)} / ${b.eiweiss} g</strong></div>
          <div class="balken"><span style="width:${Math.min(100, (summe.eiweiss / b.eiweiss) * 100)}%"></span></div>
          <div class="balken-zeile"><span>Kalorien</span><strong>${summe.kcal} / ${b.kcal} kcal</strong></div>
          <div class="balken"><span style="width:${Math.min(100, (summe.kcal / b.kcal) * 100)}%"></span></div>
          <p class="hint">${b.trainingstag ? 'Trainingstag' : 'Pausentag'}${!b.trainingstag ? ' · <button type="button" class="link klein" data-act="geplant">Ich trainiere heute noch</button>' : ''}</p>
          <div class="zwei"><button type="button" class="btn btn-primary" data-act="shake">+ Shake</button><a class="btn" href="#/essen">Essen eintragen</a></div>
        </div>` : ''}
      ${backupFaellig ? '<div class="card card-soft"><h3>Backup machen</h3><p>Deine Daten liegen nur auf diesem Handy. Speichere sie ab und zu als Datei.</p><a class="btn" href="#/mehr">Zum Backup</a></div>' : ''}
      <p class="hint center">${offline === 'bereit' ? 'Offline bereit ✓' : offline === 'laedt' ? 'Wird für offline gespeichert …' : ''}</p>
    </section>`;

  wireInstall(view);
  view.querySelector('[data-act=start]')?.addEventListener('click', async () => {
    await trainingStarten();
    location.hash = '#/lauf';
  });
  view.querySelector('[data-act=shake]')?.addEventListener('click', async () => { if (await shakeErfassen()) render(view); });
  view.querySelector('[data-act=geplant]')?.addEventListener('click', async () => { await kv.set('heuteTraining', heuteIso()); render(view); });
  if (kater) wireKater(view, lt, ctx, gelenkEintrag, () => render(view));
}

function katerKarte(gelenk) {
  return `
    <div class="card kater">
      <h3>Wie geht's nach dem letzten Training?</h3>
      <p class="hint">Muskelkater</p>
      <div class="wahl vier">
        <button type="button" class="btn" data-k="kein">kein</button>
        <button type="button" class="btn" data-k="leicht">leicht</button>
        <button type="button" class="btn" data-k="stark">stark</button>
        <button type="button" class="btn btn-quiet" data-k="skip">überspringen</button>
      </div>
      <div class="gruppen" hidden>
        <p class="hint">Wo? (freiwillig)</p>
        <div class="chips">${Object.entries(GRUPPEN).map(([k, n]) => `<button type="button" class="chip" data-g="${k}">${esc(n)}</button>`).join('')}</div>
      </div>
      ${gelenk ? '<label class="check"><input type="checkbox" id="gelenkSchlechter"> Gelenk schlechter als sonst</label>' : '<p><a class="link klein" href="#/gesundheit">Schmerz, nicht Muskelkater?</a></p>'}
      <button type="button" class="btn btn-primary btn-wide" data-act="kater-fertig" hidden>Fertig</button>
    </div>`;
}

function wireKater(view, lt, ctx, gelenk, neu) {
  let stufe = null;
  const gruppen = new Set();
  const fertigBtn = view.querySelector('[data-act=kater-fertig]');
  const speichern = async () => {
    const t = await hole('trainings', lt.id);
    const gelenkSchlechter = gelenk ? !!view.querySelector('#gelenkSchlechter')?.checked : false;
    t.nachbefragung = { stufe: stufe || 'keineAngabe', gruppen: [...gruppen], gelenkSchlechter, am: new Date().toISOString() };
    await speichere('trainings', t);
    if (gelenk) {
      for (const id of ctx.schmerzLetztes) {
        const st = ctx.staende[id];
        if (!st) continue;
        const n = nachbefragungAnwenden(st, gelenkSchlechter);
        await speichere('geraetUebung', n);
        if (n.ausgeblendet === 'vorsorglich' && st.ausgeblendet !== 'vorsorglich') toast('Eine Übung wurde vorsorglich ausgeblendet. Bitte ärztlich oder physiotherapeutisch abklären. Einblenden unter Training → Meine Geräte.', 6000);
      }
    }
    toast('Danke – das nächste Training passt sich an.');
    neu();
  };
  view.querySelectorAll('[data-k]').forEach((b) => b.addEventListener('click', () => {
    stufe = b.dataset.k === 'skip' ? 'keineAngabe' : b.dataset.k;
    view.querySelectorAll('[data-k]').forEach((x) => x.classList.toggle('on', x === b));
    const mitGruppen = stufe === 'leicht' || stufe === 'stark';
    view.querySelector('.gruppen').hidden = !mitGruppen;
    if (!mitGruppen && !gelenk) { speichern(); return; }
    fertigBtn.hidden = false;
  }));
  view.querySelectorAll('[data-g]').forEach((b) => b.addEventListener('click', () => {
    const g = b.dataset.g;
    if (gruppen.has(g)) gruppen.delete(g); else gruppen.add(g);
    b.classList.toggle('on', gruppen.has(g));
  }));
  view.querySelector('#gelenkSchlechter')?.addEventListener('change', () => { fertigBtn.hidden = false; });
  fertigBtn.addEventListener('click', speichern);
}
