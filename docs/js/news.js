// „Was ist neu?" – nach einem Update einmal, nur für alle, die den Rundgang schon kennen.
import { dialog } from './ui.js?v=0.1.0';
import { NEWS } from './hilfe.js?v=0.1.0';

export { NEWS };

const num = (v) => (v || '0').split('.').map(Number);
export const newer = (a, b) => { const x = num(a); const y = num(b); for (let i = 0; i < 3; i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0); return false; };

export const unseen = (seen) => NEWS.filter((n) => !seen || newer(n.v, seen));

export async function showNews(list) {
  await dialog({
    title: 'Was ist neu?',
    body: `<div class="news">${list.map((n) => `<h3>${n.title}</h3><ul>${n.items.map((t) => `<li>${t}</li>`).join('')}</ul>`).join('')}</div>`,
    buttons: [{ label: 'Alles klar', value: true, primary: true }],
  });
}
