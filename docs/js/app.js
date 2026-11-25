// Einstieg der App: Seitenwechsel, Rundgang beim ersten Öffnen, „Was ist neu?“, Updates, Offline.
import { VERSION } from './config.js?v=0.1.7';
import { store } from './store.js?v=0.1.7';
import { toast } from './ui.js?v=0.1.7';
import { renderTabs } from './tabs.js?v=0.1.7';
import { runTour } from './tour.js?v=0.1.7';
import { unseen, showNews, NEWS } from './news.js?v=0.1.7';
import { registerSw } from './offline.js?v=0.1.7';
import { laufendesAufraeumen } from './lauf.js?v=0.1.7';
import { einstiegAnpassen } from './kontext.js?v=0.1.7';

const view = document.getElementById('view');
const scroller = document.getElementById('scroller'); // nur dieser Bereich scrollt (fester Rahmen)

// Jede Seite ist eine eigene Datei und wird erst beim Öffnen geladen.
const PAGES = {
  heute: () => import('./heute.js?v=0.1.7'),
  training: () => import('./training.js?v=0.1.7'),
  lauf: () => import('./lauf.js?v=0.1.7'),
  geraete: () => import('./geraete.js?v=0.1.7'),
  geraet: () => import('./geraete.js?v=0.1.7').then((m) => ({ render: m.renderGeraet })),
  essen: () => import('./essen.js?v=0.1.7'),
  koerper: () => import('./koerperseite.js?v=0.1.7'),
  gesundheit: () => import('./gesundheitseite.js?v=0.1.7'),
  profil: () => import('./profil.js?v=0.1.7'),
  mehr: () => import('./mehr.js?v=0.1.7'),
  supplemente: () => import('./supplementseite.js?v=0.1.7'),
  rechnen: () => import('./rechnen.js?v=0.1.7'),
};

export async function route() {
  const [, page = '', ...rest] = (location.hash || '#/').split('/');
  const name = PAGES[page] ? page : 'heute';
  renderTabs(page || '');
  // Jede Seite bekommt einen eigenen Rahmen. Lädt eine alte Seite noch nach, schreibt sie ins Leere.
  const box = document.createElement('div');
  box.className = 'seite';
  try {
    const mod = await PAGES[name]();
    view.replaceChildren(box);
    await mod.render(box, ...rest.map(decodeURIComponent));
  } catch (ex) {
    console.error(ex);
    if (!box.isConnected) view.replaceChildren(box);
    box.innerHTML = `
      <section class="center" style="margin-top:20vh">
        <h1 class="title title-sm">Das hat nicht geklappt</h1>
        <p class="lead">${String(ex?.message || ex).replace(/[<>&]/g, '')}</p>
        <button type="button" class="btn btn-primary" id="retry">Nochmal versuchen</button>
      </section>`;
    box.querySelector('#retry').addEventListener('click', route);
  }
}
window.addEventListener('fitness:neu', () => route());

addEventListener('hashchange', () => { scroller.scrollTo(0, 0); route(); });

// Rundgang, solange er nicht bis zum Ende angesehen oder bewusst übersprungen wurde.
async function helpOnStart() {
  if (!store.get('tourSeen')) {
    await runTour();
    store.set('tourSeen', '1');
    store.set('newsSeen', NEWS[0]?.v || VERSION);
    return;
  }
  const list = unseen(store.get('newsSeen'));
  if (list.length) {
    await showNews(list);
    store.set('newsSeen', NEWS[0].v);
  }
}

// ---------- Update-Prüfung (wie Film-, Sportplatz- und Sziget-App) ----------
async function checkForUpdate() {
  if (location.hostname === 'localhost') return;
  try {
    const res = await fetch(`version.json?t=${Date.now()}`, { cache: 'no-store' });
    const { version } = await res.json();
    if (!version || version === VERSION) return;
    const key = 'fitness.reloadedFor';
    if (sessionStorage.getItem(key) === version) return; // nie endlos neu laden
    sessionStorage.setItem(key, version);
    location.replace(`${location.pathname}?v=${version}${location.hash}`);
  } catch { /* offline – egal */ }
}
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') checkForUpdate();
});

registerSw();
checkForUpdate();
einstiegAnpassen()
  .then(laufendesAufraeumen)
  .then(route)
  .then(helpOnStart)
  .catch((ex) => { console.error(ex); toast('Da ist etwas schiefgelaufen.'); });
