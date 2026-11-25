// Datumshilfen ohne Bildschirm-Code (auch in node nutzbar). Datumsangaben als 'JJJJ-MM-TT' in Ortszeit.

export function heuteIso(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
export function plusTage(iso, n) {
  const d = new Date(iso + 'T12:00:00');
  d.setDate(d.getDate() + n);
  return heuteIso(d);
}
// ganze Tage von a nach b (b − a)
export function tageZwischen(a, b) {
  const da = new Date(a + 'T12:00:00'), db = new Date(b + 'T12:00:00');
  return Math.round((db - da) / 86400000);
}
export const monatIso = iso => iso.slice(0, 7);
export function monateZwischen(monatA, monatB) {
  const [ja, ma] = monatA.split('-').map(Number);
  const [jb, mb] = monatB.split('-').map(Number);
  return (jb - ja) * 12 + (mb - ma);
}
export function alterAm(geburtsdatum, iso) {
  if (!geburtsdatum) return null;
  const [gj, gm, gt] = geburtsdatum.split('-').map(Number);
  const [j, mo, t] = iso.split('-').map(Number);
  let alter = j - gj;
  if (mo < gm || (mo === gm && t < (gt || 1))) alter--;
  return alter;
}
export const stundenZwischen = (msA, msB) => (msB - msA) / 3600000;

const WT = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
export function datumKurz(iso) {
  const d = new Date(iso + 'T12:00:00');
  return `${WT[d.getDay()]} ${d.getDate()}.${d.getMonth() + 1}.`;
}
export function datumLang(iso) {
  const d = new Date(iso + 'T12:00:00');
  return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
}
