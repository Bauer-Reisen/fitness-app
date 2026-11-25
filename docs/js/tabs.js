// Reiterleiste unten: Heute · Training · Essen · Körper · Mehr
import { esc } from './ui.js?v=0.1.1';

const ICON = {
  heute: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M2.5 12H5M19 12h2.5M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8"/>',
  training: '<path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11"/>',
  essen: '<path d="M7 3v8a2 2 0 0 0 2 2v8M7 3v5M11 3v5a2 2 0 0 1-2 2M17 3c-2 2-2.5 5-2.5 8h2.5v10"/>',
  koerper: '<circle cx="12" cy="5" r="2.2"/><path d="M5 9h14M12 9v6M12 15l-3.5 6M12 15l3.5 6"/>',
  mehr: '<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
};
// Unterseiten gehören zu diesem Reiter
const TAB_OF = {
  '': 'heute', heute: 'heute', training: 'training', lauf: 'training', geraete: 'training', geraet: 'training', verlauf: 'training',
  essen: 'essen', koerper: 'koerper', gesundheit: 'koerper', profil: 'koerper', mehr: 'mehr', supplemente: 'mehr', rechnen: 'mehr',
};

export function renderTabs(page) {
  const nav = document.getElementById('tabs');
  if (!nav) return;
  const active = TAB_OF[page] || 'heute';
  const tabs = [
    ['heute', 'Heute', '#/'],
    ['training', 'Training', '#/training'],
    ['essen', 'Essen', '#/essen'],
    ['koerper', 'Körper', '#/koerper'],
    ['mehr', 'Mehr', '#/mehr'],
  ];
  nav.innerHTML = tabs.map(([id, label, href]) => `
    <a href="${esc(href)}" ${id === active ? 'aria-current="page"' : ''}>
      <svg viewBox="0 0 24 24" aria-hidden="true">${ICON[id]}</svg>
      <span>${label}</span>
    </a>`).join('');
  nav.hidden = false;
  document.body.classList.add('has-tabs');
}

export function hideTabs() {
  const nav = document.getElementById('tabs');
  if (nav) nav.hidden = true;
  document.body.classList.remove('has-tabs');
}
