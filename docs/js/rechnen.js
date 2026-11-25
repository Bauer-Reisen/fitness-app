// „Wie wird gerechnet?“ – Formeln, Zahlen von heute und Quellen.
import { bedarfFuer } from './kontext.js?v=0.1.4';
import { ZIELE, MET_GERAETETRAINING } from './bedarf.js?v=0.1.4';
import { esc, zahl } from './ui.js?v=0.1.4';

export async function render(view) {
  const b = await bedarfFuer();
  view.innerHTML = `
    <section>
      <a class="back" href="#/mehr">← Mehr</a>
      <h1 class="title title-sm">Wie wird gerechnet?</h1>
      ${b ? `
        <div class="card">
          <h3>Heute</h3>
          <ul class="liste kompakt">
            <li>Gewicht (7-Tage-Mittel): ${zahl(b.kg, 1)} kg</li>
            <li>Grundumsatz: ${b.grundumsatz} kcal</li>
            <li>× Alltag = Pausentag: ${b.pausentag} kcal</li>
            <li>+ Training${b.minuten ? ` (${b.minuten} Min.)` : ''}: ${b.zuschlag} kcal</li>
            <li>Ziel: ${b.zielDelta >= 0 ? '+' : ''}${b.zielDelta} kcal</li>
            <li><strong>Tagesziel: ${b.kcal} kcal, ${b.eiweiss} g Eiweiß</strong> (gerundet)</li>
          </ul>
        </div>` : '<p>Für die Rechnung braucht die App dein Profil und ein Gewicht.</p>'}
      <div class="card">
        <h3>Grundumsatz</h3>
        <p>Formel nach Mifflin-St Jeor: 10 × kg + 6,25 × cm − 5 × Alter + 5 (Männer) bzw. − 161 (Frauen). Sie gilt als verlässlichste Standardformel, liegt im Einzelfall aber oft daneben – deshalb ist das Ergebnis ein Startwert.</p>
        <p class="hint">Mifflin et al. 1990, Am J Clin Nutr 51:241 · Frankenfield et al. 2005, J Am Diet Assoc</p>
      </div>
      <div class="card">
        <h3>Alltag und Training</h3>
        <p>Alltag ohne Sport nach den PAL-Stufen der DGE: 1,4 sitzend · 1,6 sitzend mit zeitweise Gehen/Stehen · 1,8 überwiegend gehend/stehend. Sport ist darin nicht enthalten.</p>
        <p>Trainingstag: + (MET − 1) × kg × Stunden. Gerätetraining ${zahl(MET_GERAETETRAINING, 1)} MET. Das „− 1“ verhindert, dass der Ruheumsatz doppelt zählt.</p>
        <p class="hint">DGE-Referenzwerte Energie · Compendium of Physical Activities 2024, Code 02054</p>
      </div>
      <div class="card">
        <h3>Ziele und Eiweiß</h3>
        <ul class="liste kompakt">${Object.values(ZIELE).map((z) => `<li>${esc(z.name)}: ${z.kcalFaktor ? `${z.kcalFaktor > 0 ? '+' : ''}${Math.round(z.kcalFaktor * 100)} %${z.maxMinus ? ` (höchstens −${z.maxMinus} kcal)` : ''}` : '± 0'} · ${zahl(z.eiweiss, 1)} g Eiweiß je kg</li>`).join('')}</ul>
        <p>Eiweiß ist an Trainings- und Pausentagen gleich; der Unterschied liegt bei den Kalorien. Untergrenze 0,8 g/kg (DGE). Die Prozentwerte für Kalorien sind übliche Praxis (nicht geprüft).</p>
        <p class="hint">ISSN Position Stand, Jäger et al. 2017 (1,4–2,0 g/kg) · Morton et al. 2018, Br J Sports Med</p>
      </div>
      <div class="card">
        <h3>Training</h3>
        <p>Steigerung: erst Wiederholungen (8–12), dann eine Gerätestufe, wenn zweimal in Folge alles geschafft war oder mindestens die Hälfte „easy“ war. Ist die nächste Stufe mehr als 10 % schwerer, erst bis 15 Wiederholungen. Schmerz bremst immer. Viele Schwellen sind übliche Faustregeln.</p>
        <p class="hint">ACSM Position Stand 2009 · Zourdos et al. 2016 · Helms et al. 2016 · Bosquet et al. 2013 · Ageberg et al. 2010</p>
      </div>
    </section>`;
}
