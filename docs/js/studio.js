// Geräte meines Studios, Nummern wie an den Geräten und auf der Geräteliste des Studios.
// typ = passende allgemeine Vorlage (katalog.js): daraus kommen Belastungsart, Einstellungen und Übungen.
// uebungen = nur diese Übungen (sonst alle Übungen der Vorlage).
// Gewichtsstufen sind noch nicht geprüft – die App fragt beim ersten Mal am Gerät danach.

export const STUDIO_NAME = 'Mein Studio';

export const BEREICHE = { haupt: 'Hauptbereich', rot: 'Gerätepark rot', ohne: 'Ohne Nummer' };

// [Nr, Name laut Liste, Vorlage, Übungen (optional)]
const HAUPT = [
  [1, 'Beinpresse', 'beinpresse'],
  [2, 'Beinbeuger', 'beinbeuger', ['beinbeuger_liegend']],
  [3, 'Gluteusmaschine', 'gesaessmaschine'],
  [4, 'Beinstrecker', 'beinstrecker'],
  [5, 'Bizepsmaschine', 'bizepsmaschine'],
  [6, 'Adduktoren', 'adabduktor', ['adduktion']],
  [7, 'Abduktoren', 'adabduktor', ['abduktion']],
  [8, 'Brustpresse', 'brustpresse'],
  [9, 'Butterfly eng', 'butterfly', ['butterfly']],
  [10, 'Latzug', 'latzug'],
  [11, 'Ruderzug', 'rudermaschine'],
  [12, 'Schulterpresse', 'schulterpresse'],
  [13, 'Seitheben', 'seitheben'],
  [14, 'Rückenstrecker', 'rueckenstrecker'],
  [15, 'Klimmzug/Dips', 'klimmzugstange', ['klimmzug', 'dips']],
  [16, 'Beinheben', 'dipstangen', ['knieheben_gestuetzt']],
  [17, 'Beinheben', 'dipstangen', ['knieheben_gestuetzt']],
  [18, 'Rumpfrotation', 'rotationsmaschine'],
  [19, 'Beinbeuger sitzend', 'beinbeuger', ['beinbeuger_sitzend']],
  [20, 'Wadenheben', 'wadenmaschine'],
  [21, 'Klimmzug/Dips', 'klimmzugstange', ['klimmzug', 'dips']],
  [22, 'Schulterpresse', 'schulterpresse'],
  [23, 'Trizepsmaschine', 'trizepsmaschine'],
  [24, 'Crossover', 'butterfly', ['crossover_maschine']],
  [25, 'Butterfly weit', 'butterfly', ['butterfly']],
  [26, 'Reverse Fly', 'butterfly', ['reverse_butterfly']],
  [27, 'Latzug', 'latzug'],
  [28, 'Beinheben', 'dipstangen', ['knieheben_gestuetzt']],
  [29, 'Hyperextension', 'hyperextension'],
  [30, 'Bauchmaschine', 'bauchmaschine'],
  [31, 'freier Ruderzug', 'kabelzug', ['kabelrudern']],
  [32, 'Crossover Seilzug', 'kabelzug'],
  [33, 'Duplex Seilzug', 'kabelzug'],
];
const ROT = [
  [1, 'Beinpresse', 'beinpresse'],
  [2, 'Brustpresse', 'brustpresse'],
  [3, 'Schulterpresse', 'schulterpresse'],
  [4, 'Ruderzug', 'rudermaschine'],
  [5, 'Dipsmaschine', 'trizepsmaschine', ['dips_maschine']],
  [6, 'Bizepsmaschine', 'bizepsmaschine'],
  [7, 'Latzug', 'latzug'],
];
const OHNE = [
  ['laufband', 'Laufband'], ['ergometer', 'Fahrradergometer'], ['airbike', 'Air Bike'],
  ['rudergeraet', 'Rudergerät'], ['crosstrainer', 'Crosstrainer'],
  ['boden', 'Matten / Boden'], ['medizinball', 'Medizinbälle'], ['klimmzugstange', 'Klimmzugstange an der Wand', ['klimmzug']],
];

export const STUDIO = [
  ...HAUPT.map(([nr, name, typ, uebungen]) => ({ id: `st-${nr}`, nr, bereich: 'haupt', name, typ, uebungen })),
  ...ROT.map(([nr, name, typ, uebungen]) => ({ id: `st-rot-${nr}`, nr, bereich: 'rot', name, typ, uebungen })),
  ...OHNE.map(([typ, name, uebungen]) => ({ id: `st-${typ}`, nr: null, bereich: 'ohne', name, typ, uebungen })),
];

export const studioLabel = (d) => (d.nr == null ? d.name : `${d.bereich === 'rot' ? 'Rot ' : ''}${d.nr} · ${d.name}`);
