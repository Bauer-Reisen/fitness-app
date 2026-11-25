// Reiter Training: heutiger Vorschlag, Start/Fortsetzen, Verlauf, ausgeblendete Übungen, Link zu den Geräten.
import { speichere } from './db.js?v=0.1.2';
import { ladeKontext } from './kontext.js?v=0.1.2';
import { planErstellen } from './vorschlag.js?v=0.1.2';
import { anzeige } from './stufen.js?v=0.1.2';
import { esc } from './ui.js?v=0.1.2';
import { datumKurz } from './datum.js?v=0.1.2';
import { trainingStarten } from './lauf.js?v=0.1.2';
import { bewerte } from './gelenke.js?v=0.1.2';

export async function render(view) {
  const ctx = await ladeKontext();
  const plan = planErstellen(ctx);
  const ue = plan.schritte.filter((s) => s.typ === 'uebung');
  const name = (id) => ctx.uebungen.find((u) => u.id === id)?.name || id;
  const vorgabeText = (s) => {
    const g = ctx.geraete[s.geraetId];
    const v = s.vorgabe;
    const last = v.typ === 'kg' || v.typ === 'ball' ? ` · ${s.neu ? 'Startgewicht wählen' : anzeige(g, v.stufenIndex)}` : '';
    if (s.neu && v.typ !== 'kg' && v.typ !== 'ball') return `${v.saetze} Sätze · 1. Satz ist ein Test: so viele wie sauber gehen`;
    return `${v.saetze} × ${v.ziel}${v.typ === 'zeit' ? ' s' : ''}${last}`;
  };
  const beendet = ctx.trainings.filter((t) => t.status === 'beendet').reverse().slice(0, 10);
  const ausgeblendet = Object.values(ctx.staende).filter((s) => s.ausgeblendet && s.ausgeblendet !== 'nein');
  const regelAus = ctx.uebungen.filter((u) => u.muster !== 'ausdauer' && u.geraete.some((g) => ctx.geraete[g]?.vorhanden) && bewerte(u, ctx.einschraenkungen).status === 'aus');

  view.innerHTML = `
    <section>
      <h1 class="title title-sm">Training</h1>
      ${ctx.laufend ? '<a class="btn btn-primary btn-wide btn-big" href="#/lauf">Training fortsetzen</a>' : `
        <div class="card">
          <h3>Vorschlag für heute</h3>
          ${plan.schritte.some((s) => s.typ === 'mobilitaet') ? '<p class="hint">Aufwärmen · Beweglichkeit Hüfte</p>' : '<p class="hint">Aufwärmen</p>'}
          <ul class="liste kompakt">${ue.map((s) => `<li><span><strong>${esc(name(s.uebungId))}</strong>${s.rolle === 'foerder' ? ' <span class="tag">Förderung</span>' : ''}<br><span class="hint">${esc(vorgabeText(s))}</span></span></li>`).join('')}</ul>
          ${plan.schritte.some((s) => s.typ === 'hand') ? '<p class="hint">Zum Schluss: Handprogramm</p>' : ''}
          ${plan.hinweise.map((h) => `<p class="hinweis">${esc(h)}</p>`).join('')}
          <button type="button" class="btn btn-primary btn-wide btn-big" data-act="start">Training starten</button>
        </div>`}
      <a class="btn btn-wide" href="#/geraete">Meine Geräte</a>

      ${ausgeblendet.length || regelAus.length ? `
        <h2>Ausgeblendet</h2>
        <ul class="liste">
          ${ausgeblendet.map((s) => `<li><span><strong>${esc(name(s.uebungId))}</strong><br><span class="hint">${s.ausgeblendet === 'vorsorglich' ? 'vorsorglich ausgeblendet (Gelenk 2× schlechter)' : 'von dir ausgeblendet'}</span></span><button type="button" class="btn klein" data-ein="${esc(s.id)}">Einblenden</button></li>`).join('')}
          ${regelAus.map((u) => `<li><span><strong>${esc(u.name)}</strong><br><span class="hint">vorsorglich: ${esc(bewerte(u, ctx.einschraenkungen).gruende.join(', '))}</span></span><a class="btn klein" href="#/gesundheit">Angaben</a></li>`).join('')}
        </ul>
        ${regelAus.length ? '<p class="hint">Diese Übungen blendet die App nach deinen Gesundheitsangaben aus. Ändern sich die Angaben oder Vorgaben, sind sie wieder da.</p>' : ''}` : ''}

      <h2>Verlauf</h2>
      ${beendet.length ? `<ul class="liste">${beendet.map((t) => `
        <li><details><summary><strong>${esc(datumKurz(t.datum))}</strong> · ${Math.max(1, Math.round((t.endeMs - t.startMs) / 60000))} Min.${t.nachbefragung?.stufe && t.nachbefragung.stufe !== 'keineAngabe' ? ` · Muskelkater ${esc(t.nachbefragung.stufe)}` : ''}</summary>
          <ul class="aenderungen klein">${(t.aenderungen || []).map((a) => `<li class="${a.richtung}"><span><strong>${esc(a.name)}</strong>: ${esc(a.text)}</span></li>`).join('') || '<li>keine Sätze</li>'}</ul>
        </details></li>`).join('')}</ul>` : '<p class="hint">Noch kein Training.</p>'}
    </section>`;

  view.querySelector('[data-act=start]')?.addEventListener('click', async () => { await trainingStarten(); location.hash = '#/lauf'; });
  view.querySelectorAll('[data-ein]').forEach((b) => b.addEventListener('click', async () => {
    const st = ctx.staende[b.dataset.ein];
    await speichere('geraetUebung', { ...st, ausgeblendet: 'nein', gelenkSchlechterInFolge: 0 });
    render(view);
  }));
}
