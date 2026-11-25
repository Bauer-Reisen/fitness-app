// Gewichtsstufen eines Geräts. Ohne Bildschirm-Code.
// Intern rechnet die App nur in Stufen (Index in der sortierten Liste), nie in Prozent.

export function stufenAusVorschlag(vorschlag) {
  if (!vorschlag) return [];
  if (Array.isArray(vorschlag.liste)) return [...vorschlag.liste];
  const { start, schritt, max } = vorschlag;
  const out = [];
  for (let w = start; w <= max + 1e-9; w += schritt) out.push(Math.round(w * 100) / 100);
  return out;
}

// Alle Kombinationen Stufe + Zusatzgewicht, sortiert und ohne Doppelte
export function kombiniert(geraet) {
  const stufen = geraet?.stufen || [];
  const zusatz = geraet?.zusatz?.length ? geraet.zusatz : [0];
  const set = new Set();
  for (const s of stufen) for (const z of zusatz) set.add(Math.round((s + z) * 100) / 100);
  return [...set].sort((a, b) => a - b);
}

export function anzeige(geraet, index) {
  const liste = kombiniert(geraet);
  const w = liste[Math.max(0, Math.min(index, liste.length - 1))];
  if (w == null) return '';
  const zahl = String(w).replace('.', ',');
  if (geraet.art === 'ball') return `Ball ${zahl} kg`;
  return geraet.anzeige === 'stufe' ? `Stufe ${zahl}` : `${zahl} kg`;
}

// Sprung zur nächsten Stufe als Anteil (0,1 = 10 %)
export function sprung(geraet, index) {
  const l = kombiniert(geraet);
  if (index < 0 || index >= l.length - 1 || !l[index]) return 0;
  return (l[index + 1] - l[index]) / l[index];
}
