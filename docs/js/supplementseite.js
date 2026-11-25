// Supplement-Prüfliste: nur ansehen und selbst entscheiden. Die App schlägt nichts von sich aus vor.
import { kv } from './db.js?v=0.1.6';
import { PRUEFLISTE, NUR_BEI_MANGEL, AUSSCHLUSS, EIWEISSPULVER, STAND } from './supplemente.js?v=0.1.6';
import { esc } from './ui.js?v=0.1.6';

const link = (q) => `<a href="${esc(q.url)}" target="_blank" rel="noopener">${esc(q.text)}</a>`;

export async function render(view) {
  const markiert = new Set((await kv.get('supplementeMarkiert')) || []);
  view.innerHTML = `
    <section>
      <a class="back" href="#/mehr">← Mehr</a>
      <h1 class="title title-sm">Supplements</h1>
      <p class="lead">Aufgenommen ist nur, was drei Bedingungen erfüllt: gute Studienlage, klar belegter Nutzen für Kraft und Muskelaufbau, geringes Risiko bei üblicher Dosis. Du entscheidest selbst.</p>
      <div class="card card-soft"><h3>Eiweißpulver</h3><p>${esc(EIWEISSPULVER.text)}</p><p class="hint">${link(EIWEISSPULVER.quelle)}</p></div>
      ${PRUEFLISTE.map((s) => `
        <div class="card">
          <h3>${esc(s.name)}</h3>
          <dl class="steckbrief">
            <dt>Nutzen</dt><dd>${esc(s.nutzen)}</dd>
            <dt>Dosis</dt><dd>${esc(s.dosis)}</dd>
            <dt>Risiken</dt><dd>${esc(s.risiken)}</dd>
            <dt>Nicht nehmen, wenn</dt><dd>${esc(s.nichtWenn)}</dd>
            <dt>Reinheit</dt><dd>${esc(s.reinheit)}</dd>
            <dt>Quellen</dt><dd><ul>${s.quellen.map((q) => `<li>${link(q)}</li>`).join('')}</ul></dd>
          </dl>
          <label class="check"><input type="checkbox" data-mark="${s.id}" ${markiert.has(s.id) ? 'checked' : ''}> nehme ich</label>
        </div>`).join('')}
      <div class="card">
        <h3>Nur bei ärztlich festgestelltem Mangel</h3>
        <p>${esc(NUR_BEI_MANGEL.text)}</p>
        <p>${NUR_BEI_MANGEL.liste.map(esc).join(' · ')}</p>
        <p class="hint">${link(NUR_BEI_MANGEL.quelle)}</p>
      </div>
      <details class="card aufklapp">
        <summary>Ausschlussliste (${AUSSCHLUSS.length})</summary>
        <ul class="liste">${AUSSCHLUSS.map(([n, bed, text]) => `<li><span><strong>${esc(n)}</strong> <span class="tag">verfehlt: ${esc(bed)}</span><br><span class="hint">${esc(text)}</span></span></li>`).join('')}</ul>
      </details>
      <p class="hint">Stand der Recherche: ${esc(STAND)}. Keine ärztliche Beratung – bei Erkrankungen oder Medikamenten vorher ärztlich fragen.</p>
    </section>`;
  view.querySelectorAll('[data-mark]').forEach((c) => c.addEventListener('change', async () => {
    if (c.checked) markiert.add(c.dataset.mark); else markiert.delete(c.dataset.mark);
    await kv.set('supplementeMarkiert', [...markiert]);
  }));
}
