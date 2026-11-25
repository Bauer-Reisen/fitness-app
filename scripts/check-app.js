// Prüft vor dem Hochladen: Versionen überall gleich, alle Importe mit Version, sw.js kennt alle Dateien,
// Rundgang und „Was ist neu?“ passen zusammen, Supplement-Prüfliste vollständig.
import { readFileSync, readdirSync, existsSync } from 'node:fs';

const read = (f) => readFileSync(f, 'utf8');
const errs = [];
const v = read('docs/js/config.js').match(/VERSION = '([^']+)'/)[1];
const vs = {
  'docs/sw.js': read('docs/sw.js').match(/VERSION = '([^']+)'/)[1],
  'docs/version.json': JSON.parse(read('docs/version.json')).version,
  'package.json': JSON.parse(read('package.json')).version,
};
for (const [f, x] of Object.entries(vs)) if (x !== v) errs.push(`${f} hat Version ${x}, config.js hat ${v}`);
for (const m of read('docs/index.html').matchAll(/\?v=([\d.]+)/g)) if (m[1] !== v) errs.push(`index.html: ?v=${m[1]} statt ${v}`);

const sw = read('docs/sw.js');
const js = readdirSync('docs/js').filter((f) => f.endsWith('.js'));
for (const f of js) {
  if (!sw.includes(`'js/${f}'`)) errs.push(`sw.js: js/${f} fehlt im Offline-Speicher`);
  for (const m of read(`docs/js/${f}`).matchAll(/(?:from |import\()'(\.\/[^']+)'/g)) {
    if (!m[1].endsWith(`?v=${v}`)) errs.push(`docs/js/${f}: Import ${m[1]} ohne Version ${v}`);
    const datei = m[1].replace(/\?.*$/, '');
    if (!existsSync(`docs/js/${datei}`)) errs.push(`docs/js/${f}: ${datei} gibt es nicht`);
  }
}
for (const m of sw.matchAll(/'([\w./-]+\.(?:js|css|png|svg|json|html|webmanifest))'/g)) if (!existsSync(`docs/${m[1]}`)) errs.push(`sw.js: docs/${m[1]} gibt es nicht`);

// Hilfe: jeder „Was ist neu?“-Eintrag nennt eine Karte mit passendem Stand (oder 'klein')
const num = (x) => x.split('.').map(Number);
const geq = (a, b) => { const x = num(a); const y = num(b); for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] > y[i]; return true; };
const { STEPS, NEWS } = await import('../docs/js/hilfe.js');
for (const s of STEPS) if (!s.id || !s.stand) errs.push(`Rundgang: Karte ohne id/stand (${s.title})`);
for (const n of NEWS) {
  if (!n.karte) { errs.push(`„Was ist neu?“ ${n.v}: karte fehlt`); continue; }
  if (n.karte === 'klein') continue;
  const s = STEPS.find((x) => x.id === n.karte);
  if (!s) errs.push(`„Was ist neu?“ ${n.v}: Karte „${n.karte}“ gibt es nicht`);
  else if (!geq(s.stand, n.v)) errs.push(`Rundgang-Karte „${s.id}“ hat Stand ${s.stand}, muss mindestens ${n.v} sein`);
}
const [ma, mi] = num(v);
if (mi > 1 || ma > 0) {
  const minor = `${ma}.${mi}.0`;
  if (!NEWS.some((n) => n.v.startsWith(`${ma}.${mi}.`)) && !read('docs/js/hilfe.js').includes(`OHNE_EINTRAG`)) errs.push(`Version ${minor}: kein „Was ist neu?“-Eintrag`);
}

// Supplemente: jeder Eintrag vollständig mit Quelle
const { PRUEFLISTE, AUSSCHLUSS } = await import('../docs/js/supplemente.js');
for (const s of PRUEFLISTE) {
  for (const k of ['nutzen', 'dosis', 'risiken', 'nichtWenn']) if (!s[k]) errs.push(`Supplement ${s.name}: ${k} fehlt`);
  if (!s.quellen?.length || s.quellen.some((q) => !/^https:\/\//.test(q.url))) errs.push(`Supplement ${s.name}: Quelle mit Link fehlt`);
}
for (const a of AUSSCHLUSS) if (!a[2]) errs.push(`Ausschluss ${a[0]}: Begründung fehlt`);

if (errs.length) { console.error('\n✋ App nicht in Ordnung:\n   ' + errs.join('\n   ') + '\n'); process.exit(1); }
console.log(`✓ Version ${v}, ${js.length} Module, Offline-Liste, Hilfe (${STEPS.length} Karten) und Supplemente passen.`);
