// Rundgang beim allerersten Öffnen (wie in der Film-App): Punkte oben antippbar,
// ab Karte 2 „← Zurück" plus kleiner Link „Rundgang überspringen". Unter „Mehr" wieder aufrufbar.
import { dialog, esc } from './ui.js?v=0.1.4';
import { STEPS } from './hilfe.js?v=0.1.4';

export async function runTour(name = '') {
  const steps = STEPS;
  let i = 0;
  while (i < steps.length) {
    const s = steps[i];
    const last = i === steps.length - 1;
    const offen = dialog({
      title: i === 0 && name ? `Hallo ${name}!` : s.title,
      body: `
        <div class="tour">
          <div class="tour-icon" aria-hidden="true">${s.icon}</div>
          ${i === 0 && name ? `<h3>${esc(s.title)}</h3>` : ''}
          <p>${s.text}</p>
          <p class="tour-dots" aria-label="Schritt ${i + 1} von ${steps.length}">${steps.map((_, j) => `<button type="button" class="${j === i ? 'on' : ''}" data-schritt="${j}" aria-label="Zu Schritt ${j + 1}"><span></span></button>`).join('')}</p>
          ${i > 0 ? '<button type="button" class="tour-skip" data-schritt="ende">Rundgang überspringen</button>' : ''}
        </div>`,
      buttons: [
        i === 0 ? { label: 'Überspringen', value: 'skip' } : { label: '← Zurück', value: 'back' },
        { label: last ? 'Los geht’s' : 'Weiter', value: 'next', primary: true },
      ],
    });
    // Punkte oben antippen = zu dieser Karte springen; „Rundgang überspringen" = beenden.
    // Erst merken, wohin es geht, dann diesen Dialog schließen (ohne Ergebnis).
    let sprung = null;
    const dlg = [...document.querySelectorAll('dialog.dlg')].pop();
    dlg?.querySelectorAll('[data-schritt]').forEach((b) => b.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      sprung = b.dataset.schritt;
      dlg.dispatchEvent(new Event('cancel', { cancelable: true }));
    }));
    const res = await offen;
    if (sprung === 'ende') return;
    if (sprung !== null) { i = Number(sprung); continue; }
    if (!res) return;
    if (res.value === 'next') i++;
    else if (res.value === 'back') i = Math.max(0, i - 1);
    else return;
  }
}
