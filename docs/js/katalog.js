// Gerätekatalog: Vorlagen für Geräte und Übungen (keine freien Gewichte).
// Grundlage: docs/grundlagen/C.md (Geräte), docs/grundlagen/I.md (Belastungsmerkmale, Förderübungen).
// Winkel- und Griffangaben sind Schätzungen (ungeprüft) – im Studio prüfen.
//
// Muster: druecken, ziehen, beine, rumpf, foerderung (gezielte Hüftübungen), ausdauer (Aufwärmen)
// Belastungsart: kg (Steckgewicht), koerper (Wdh. mit Körpergewicht), zeit (Sekunden), ball (Ballgewicht), ausdauer
// Merkmale (belastung):
//   griff: keiner | leicht | druck | zug_mittel | zug_stark | stuetz_flach | ball
//   hueftbeugung: gering | mittel | tief, begrenzbar: true/false (Anschlag, Sitz, Tiefe einstellbar)
//   hueftrotation: nein | innen | aussen | beide
//   adduktion: nein | bis_mitte | ueber_mitte
//   stoss: kein | gering | hoch
// gruppe (für Muskelkater): brust_schulter | ruecken | arme | beine | rumpf

export const KATALOG_VERSION = 1;

export const MUSTER = {
  druecken: 'Drücken', ziehen: 'Ziehen', beine: 'Beine', rumpf: 'Rumpf',
  foerderung: 'Förderung Hüfte', ausdauer: 'Ausdauer (Aufwärmen)',
};
export const HAUPTMUSTER = ['druecken', 'ziehen', 'beine', 'rumpf'];

export const GRUPPEN = {
  brust_schulter: 'Brust/Schulter', ruecken: 'Rücken', arme: 'Arme', beine: 'Beine', rumpf: 'Rumpf',
};

export const BELASTUNGSART = {
  kg: 'Steckgewicht', koerper: 'Körpergewicht', zeit: 'Haltezeit', ball: 'Ball', ausdauer: 'Ausdauer',
};

// stufen: Vorschlag für die Gewichtsliste (start, schritt, max) – im Gerät änderbar
const kg = (start = 5, schritt = 5, max = 100) => ({ start, schritt, max });

export const GERAETE = [
  { id: 'brustpresse', name: 'Brustpresse', aliase: ['Chest Press', 'Brustdrücken-Maschine'], muster: 'druecken', art: 'kg', stufen: kg(), einstellungen: ['Sitzhöhe', 'Rückenlehne', 'Griff'] },
  { id: 'butterfly', name: 'Butterfly / Reverse Butterfly', aliase: ['Pec Deck', 'Fly-Maschine', 'Rear Delt'], muster: 'druecken', art: 'kg', stufen: kg(), einstellungen: ['Sitzhöhe', 'Armanschlag'] },
  { id: 'schulterpresse', name: 'Schulterpresse', aliase: ['Shoulder Press'], muster: 'druecken', art: 'kg', stufen: kg(), einstellungen: ['Sitzhöhe', 'Rückenlehne'] },
  { id: 'seitheben', name: 'Seitheben-Maschine', aliase: ['Lateral Raise'], muster: 'druecken', art: 'kg', stufen: kg(2.5, 2.5, 50), einstellungen: ['Sitzhöhe'] },
  { id: 'trizepsmaschine', name: 'Trizepsmaschine', aliase: ['Trizepsdrücken sitzend'], muster: 'druecken', art: 'kg', stufen: kg(), einstellungen: ['Sitzhöhe'] },
  { id: 'latzug', name: 'Latzug', aliase: ['Lat Pulldown', 'Latissimus-Zug'], muster: 'ziehen', art: 'kg', stufen: kg(), einstellungen: ['Kniepolster', 'Griff'] },
  { id: 'rudermaschine', name: 'Rudermaschine sitzend (Kraftgerät)', aliase: ['Seated Row'], muster: 'ziehen', art: 'kg', stufen: kg(), einstellungen: ['Sitzhöhe', 'Brustpolster', 'Griff'] },
  { id: 'bizepsmaschine', name: 'Bizepsmaschine', aliase: ['Arm Curl'], muster: 'ziehen', art: 'kg', stufen: kg(2.5, 2.5, 50), einstellungen: ['Sitzhöhe'] },
  { id: 'rueckenstrecker', name: 'Rückenstrecker-Maschine', aliase: ['Lower Back', 'Back Extension'], muster: 'rumpf', art: 'kg', stufen: kg(), einstellungen: ['Sitzhöhe', 'Rückenpolster', 'Startwinkel'] },
  { id: 'bauchmaschine', name: 'Bauchmaschine', aliase: ['Crunch-Maschine', 'Abdominal'], muster: 'rumpf', art: 'kg', stufen: kg(), einstellungen: ['Sitzhöhe'] },
  { id: 'rotationsmaschine', name: 'Rotationsmaschine', aliase: ['Torso Rotation'], muster: 'rumpf', art: 'kg', stufen: kg(), einstellungen: ['Sitzhöhe', 'Anschlag'] },
  { id: 'beinpresse', name: 'Beinpresse', aliase: ['Leg Press'], muster: 'beine', art: 'kg', stufen: kg(10, 10, 250), einstellungen: ['Rückenlehne', 'Schlittenanschlag', 'Fußposition'] },
  { id: 'beinstrecker', name: 'Beinstrecker', aliase: ['Leg Extension', 'Quadrizepsmaschine'], muster: 'beine', art: 'kg', stufen: kg(), einstellungen: ['Rückenlehne', 'Fußpolster', 'Startwinkel'] },
  { id: 'beinbeuger', name: 'Beinbeuger', aliase: ['Leg Curl'], muster: 'beine', art: 'kg', stufen: kg(), einstellungen: ['Rückenlehne', 'Polster', 'Startwinkel'] },
  { id: 'adabduktor', name: 'Adduktoren/Abduktoren', aliase: ['Hip Ad/Ab', 'Abduktion', 'Adduktion'], muster: 'beine', art: 'kg', stufen: kg(), einstellungen: ['Startweite', 'Rückenlehne'] },
  { id: 'gesaessmaschine', name: 'Gesäßmaschine', aliase: ['Glute Kickback', 'Multi-Hip'], muster: 'beine', art: 'kg', stufen: kg(), einstellungen: ['Polsterhöhe'] },
  { id: 'wadenmaschine', name: 'Wadenmaschine', aliase: ['Calf Raise'], muster: 'beine', art: 'kg', stufen: kg(10, 10, 150), einstellungen: ['Polsterhöhe'] },
  { id: 'kabelzug', name: 'Seilzug', aliase: ['Kabelzug', 'Kabelturm', 'Cable Crossover'], muster: 'ziehen', art: 'kg', stufen: kg(2.5, 2.5, 60), einstellungen: ['Rollenhöhe', 'Griff'] },
  { id: 'gravitron', name: 'Klimmzug-/Dip-Maschine mit Unterstützung', aliase: ['Gravitron', 'Assisted Chin/Dip'], muster: 'ziehen', art: 'kg', umgekehrt: true, stufen: kg(5, 5, 80), einstellungen: ['Griff'] },
  { id: 'klimmzugstange', name: 'Klimmzugstange', aliase: ['Reckstange', 'Pull-up-Stange'], muster: 'ziehen', art: 'koerper', einstellungen: ['Griffbreite'] },
  { id: 'dipstangen', name: 'Dipstangen', aliase: ['Barren', 'Dip-Station'], muster: 'druecken', art: 'koerper', einstellungen: [] },
  { id: 'hyperextension', name: 'Hyperextension-Bank', aliase: ['Römischer Stuhl', 'Rückenstrecker-Bank'], muster: 'rumpf', art: 'koerper', einstellungen: ['Hüftpolster-Höhe'] },
  { id: 'boden', name: 'Boden / Matte', aliase: ['Bodenübungen'], muster: 'rumpf', art: 'koerper', einstellungen: [], standard: true },
  { id: 'medizinball', name: 'Medizinball / Gewichtsball', aliase: ['Slam Ball', 'Wall Ball'], muster: 'rumpf', art: 'ball', stufen: { liste: [2, 3, 5] }, einstellungen: [] },
  { id: 'laufband', name: 'Laufband', aliase: ['Treadmill'], muster: 'ausdauer', art: 'ausdauer', einstellungen: [] },
  { id: 'ergometer', name: 'Fahrradergometer', aliase: ['Ergometer', 'Heimtrainer'], muster: 'ausdauer', art: 'ausdauer', einstellungen: ['Sitzhöhe'] },
  { id: 'airbike', name: 'Air Bike (Windrad)', aliase: ['Assault Bike', 'Fan Bike'], muster: 'ausdauer', art: 'ausdauer', einstellungen: ['Sitzhöhe'] },
  { id: 'rudergeraet', name: 'Rudergerät (Luftwiderstand)', aliase: ['Ruderergometer', 'Concept2'], muster: 'ausdauer', art: 'ausdauer', einstellungen: ['Klappe 1–10'] },
  { id: 'crosstrainer', name: 'Crosstrainer', aliase: ['Ellipsentrainer'], muster: 'ausdauer', art: 'ausdauer', einstellungen: [] },
];

// m(griff, hueftbeugung, begrenzbar, hueftrotation, adduktion, stoss)
const m = (griff, hueftbeugung = 'gering', begrenzbar = false, hueftrotation = 'nein', adduktion = 'nein', stoss = 'kein') =>
  ({ griff, hueftbeugung, begrenzbar, hueftrotation, adduktion, stoss });

// prio: kleiner = zuerst gewählt (mehrgelenkig vor eingelenkig ist darin enthalten)
export const UEBUNGEN = [
  // ---- Drücken ----
  { id: 'brustpresse', name: 'Brustpresse', geraete: ['brustpresse'], muster: 'druecken', gruppe: 'brust_schulter', prio: 1, b: m('druck'), hinweis: 'Griffe auf Brusthöhe. Mit offener Hand drücken geht auch.' },
  { id: 'schulterpresse', name: 'Schulterpresse', geraete: ['schulterpresse'], muster: 'druecken', gruppe: 'brust_schulter', prio: 2, b: m('druck'), hinweis: 'Rücken an der Lehne, nicht ins Hohlkreuz.' },
  { id: 'liegestuetz', name: 'Liegestütze', geraete: ['boden'], muster: 'druecken', gruppe: 'brust_schulter', prio: 3, b: m('stuetz_flach'), hinweis: 'Körper gerade. Leichter: Hände erhöht.' },
  { id: 'dips', name: 'Dips', geraete: ['dipstangen'], muster: 'druecken', gruppe: 'brust_schulter', prio: 4, b: m('zug_stark'), hinweis: 'Nur so tief, wie die Schulter es angenehm zulässt.' },
  { id: 'butterfly', name: 'Butterfly', geraete: ['butterfly'], muster: 'druecken', gruppe: 'brust_schulter', prio: 5, b: m('keiner'), hinweis: 'Mit Unterarmpolster ohne Greifen möglich (je nach Modell).' },
  { id: 'seitheben', name: 'Seitheben an der Maschine', geraete: ['seitheben'], muster: 'druecken', gruppe: 'brust_schulter', prio: 6, b: m('keiner'), hinweis: 'Schulter auf Höhe der Drehachse.' },
  { id: 'trizeps_maschine', name: 'Trizepsdrücken sitzend', geraete: ['trizepsmaschine'], muster: 'druecken', gruppe: 'arme', prio: 7, b: m('druck'), hinweis: 'Ellbogen auf der Drehachse.' },
  { id: 'crossover_maschine', name: 'Crossover (Brust)', geraete: [], muster: 'druecken', gruppe: 'brust_schulter', prio: 6, b: m('zug_mittel'), hinweis: 'Arme leicht gebeugt vor dem Körper zusammenführen.' },
  { id: 'dips_maschine', name: 'Dips an der Maschine', geraete: [], muster: 'druecken', gruppe: 'brust_schulter', prio: 4, b: m('druck'), hinweis: 'Schultern unten lassen, nur so weit wie angenehm.' },
  { id: 'trizeps_seil', name: 'Trizepsdrücken am Seil', geraete: ['kabelzug'], muster: 'druecken', gruppe: 'arme', prio: 8, b: m('zug_mittel'), hinweis: 'Rolle oben, Ellbogen am Körper.' },
  // ---- Ziehen ----
  { id: 'latzug', name: 'Latzug', geraete: ['latzug'], muster: 'ziehen', gruppe: 'ruecken', prio: 1, b: m('zug_stark', 'mittel'), hinweis: 'Zur oberen Brust ziehen, Schultern unten.' },
  { id: 'rudern_maschine', name: 'Rudern an der Maschine', geraete: ['rudermaschine'], muster: 'ziehen', gruppe: 'ruecken', prio: 2, b: m('zug_stark', 'mittel'), hinweis: 'Brust am Polster, Schulterblätter zusammen.' },
  { id: 'kabelrudern', name: 'Rudern am Seilzug', geraete: ['kabelzug'], muster: 'ziehen', gruppe: 'ruecken', prio: 3, b: m('zug_stark', 'mittel'), hinweis: 'Rolle auf Brusthöhe, aufrecht bleiben.' },
  { id: 'klimmzug', name: 'Klimmzug', geraete: ['klimmzugstange'], muster: 'ziehen', gruppe: 'ruecken', prio: 4, b: m('zug_stark'), hinweis: 'Leichter: nur langsam ablassen (negativ).' },
  { id: 'klimmzug_unterstuetzt', name: 'Klimmzug mit Unterstützung', geraete: ['gravitron'], muster: 'ziehen', gruppe: 'ruecken', prio: 4, b: m('zug_stark'), hinweis: 'Knie auf das Polster. Mehr Gewicht = mehr Hilfe = leichter.' },
  { id: 'dips_unterstuetzt', name: 'Dips mit Unterstützung', geraete: ['gravitron'], muster: 'druecken', gruppe: 'brust_schulter', prio: 4, b: m('zug_stark'), hinweis: 'Knie auf das Polster, nur so tief wie angenehm. Mehr Gewicht = leichter.' },
  { id: 'reverse_butterfly', name: 'Reverse Butterfly', geraete: ['butterfly'], muster: 'ziehen', gruppe: 'ruecken', prio: 5, b: m('zug_mittel'), hinweis: 'Brust zum Polster, Arme leicht gebeugt.' },
  { id: 'face_pull', name: 'Face Pull am Seil', geraete: ['kabelzug'], muster: 'ziehen', gruppe: 'ruecken', prio: 6, b: m('zug_mittel'), hinweis: 'Rolle auf Kopfhöhe, zum Gesicht ziehen.' },
  { id: 'bizeps_maschine', name: 'Bizepscurl an der Maschine', geraete: ['bizepsmaschine'], muster: 'ziehen', gruppe: 'arme', prio: 7, b: m('zug_mittel', 'mittel'), hinweis: 'Ellbogen auf der Drehachse.' },
  // ---- Beine ----
  { id: 'beinpresse', name: 'Beinpresse', geraete: ['beinpresse'], muster: 'beine', gruppe: 'beine', prio: 1, b: m('leicht', 'tief', true), hinweis: 'Tiefe über Schlittenanschlag begrenzen, Knie nicht ganz durchstrecken.' },
  { id: 'beinstrecker', name: 'Beinstrecker', geraete: ['beinstrecker'], muster: 'beine', gruppe: 'beine', prio: 3, b: m('leicht', 'mittel'), hinweis: 'Knie auf der Drehachse.' },
  { id: 'beinbeuger_sitzend', name: 'Beinbeuger sitzend', geraete: ['beinbeuger'], muster: 'beine', gruppe: 'beine', prio: 4, b: m('leicht', 'mittel'), hinweis: 'Knie auf der Drehachse.' },
  { id: 'beinbeuger_liegend', name: 'Beinbeuger liegend', geraete: ['beinbeuger'], muster: 'beine', gruppe: 'beine', prio: 5, b: m('leicht', 'gering'), hinweis: 'Becken bleibt auf dem Polster.' },
  { id: 'abduktion', name: 'Beine öffnen (Abduktoren)', geraete: ['adabduktor'], muster: 'beine', gruppe: 'beine', prio: 6, foerder: 'abduktion', b: m('leicht', 'mittel'), hinweis: 'Startweite schmerzarm einstellen.' },
  { id: 'gesaess_kickback', name: 'Hüftstrecken an der Gesäßmaschine', geraete: ['gesaessmaschine'], muster: 'beine', gruppe: 'beine', prio: 7, foerder: 'streckung', einbeinig: true, b: m('leicht', 'mittel'), hinweis: 'Beide Seiten; mit der leichteren Seite beginnen.' },
  { id: 'kniebeuge', name: 'Kniebeuge ohne Gewicht', geraete: ['boden'], muster: 'beine', gruppe: 'beine', prio: 8, b: m('keiner', 'tief', true), hinweis: 'Nur so tief wie angenehm, z. B. bis auf eine Bank.' },
  { id: 'goblet_ball', name: 'Kniebeuge mit Ball vor der Brust', geraete: ['medizinball'], muster: 'beine', gruppe: 'beine', prio: 9, b: m('ball', 'tief', true), hinweis: 'Tiefe begrenzen, Ball nah am Körper.' },
  { id: 'ausfallschritt', name: 'Ausfallschritt', geraete: ['boden'], muster: 'beine', gruppe: 'beine', prio: 10, einbeinig: true, b: m('keiner', 'tief', true, 'beide', 'nein', 'gering'), hinweis: 'Kurzer Schritt, Knie über dem Fuß.' },
  { id: 'adduktion', name: 'Beine schließen (Adduktoren)', geraete: ['adabduktor'], muster: 'beine', gruppe: 'beine', prio: 11, b: m('leicht', 'mittel', false, 'nein', 'bis_mitte'), hinweis: 'Nicht über die Mitte.' },
  { id: 'wadenheben', name: 'Wadenheben', geraete: ['wadenmaschine'], muster: 'beine', gruppe: 'beine', prio: 12, b: m('leicht'), hinweis: 'Langsam ganz hoch und tief.' },
  // ---- Rumpf ----
  { id: 'plank', name: 'Unterarmstütz (Plank)', geraete: ['boden'], muster: 'rumpf', gruppe: 'rumpf', prio: 1, art: 'zeit', b: m('keiner'), hinweis: 'Körper gerade, ruhig atmen.' },
  { id: 'pallof', name: 'Pallof-Press am Seilzug', geraete: ['kabelzug'], muster: 'rumpf', gruppe: 'rumpf', prio: 2, b: m('zug_mittel'), hinweis: 'Seitlich zum Turm, Griff vor der Brust nach vorn drücken, nicht mitdrehen.' },
  { id: 'seitstuetz', name: 'Seitstütz', geraete: ['boden'], muster: 'rumpf', gruppe: 'rumpf', prio: 3, art: 'zeit', b: m('keiner'), hinweis: 'Auf dem Unterarm, leichter mit Knien am Boden.' },
  { id: 'crunch_maschine', name: 'Crunch an der Maschine', geraete: ['bauchmaschine'], muster: 'rumpf', gruppe: 'rumpf', prio: 4, b: m('leicht', 'tief', true), hinweis: 'Bewegungsumfang klein halten.' },
  { id: 'rueckenstrecken_maschine', name: 'Rückenstrecken an der Maschine', geraete: ['rueckenstrecker'], muster: 'rumpf', gruppe: 'rumpf', prio: 5, b: m('leicht', 'tief', true), hinweis: 'Langsam, ohne Schwung.' },
  { id: 'hyperextension_ruecken', name: 'Rückenstrecken an der Bank', geraete: ['hyperextension'], muster: 'rumpf', gruppe: 'rumpf', prio: 6, b: m('leicht', 'tief', true), hinweis: 'Polster hoch einstellen, nur Teilbewegung möglich.' },
  { id: 'rumpfdrehen_maschine', name: 'Rumpfdrehen sitzend', geraete: ['rotationsmaschine'], muster: 'rumpf', gruppe: 'rumpf', prio: 7, b: m('leicht', 'mittel', false, 'beide'), hinweis: 'Kleiner Bewegungsumfang.' },
  { id: 'knieheben_gestuetzt', name: 'Knieheben gestützt', geraete: ['dipstangen'], muster: 'rumpf', gruppe: 'rumpf', prio: 8, b: m('keiner', 'tief', false), hinweis: 'Unterarme auf den Polstern.' },
  { id: 'holzhacker', name: 'Holzhacker am Seilzug', geraete: ['kabelzug'], muster: 'rumpf', gruppe: 'rumpf', prio: 9, b: m('zug_mittel', 'mittel', false, 'beide'), hinweis: 'Aus dem Oberkörper drehen.' },
  { id: 'knieheben_haengend', name: 'Knieheben hängend', geraete: ['klimmzugstange'], muster: 'rumpf', gruppe: 'rumpf', prio: 10, b: m('zug_stark', 'tief', false), hinweis: 'Ohne Schwung.' },
  { id: 'russian_twist', name: 'Russian Twist mit Ball', geraete: ['medizinball'], muster: 'rumpf', gruppe: 'rumpf', prio: 11, b: m('ball', 'tief', false, 'beide'), hinweis: 'Füße am Boden lassen.' },
  { id: 'ball_slam', name: 'Ball-Slam', geraete: ['medizinball'], muster: 'rumpf', gruppe: 'rumpf', prio: 12, b: m('ball', 'tief', true, 'nein', 'nein', 'hoch'), hinweis: 'Nur mit Slam Ball, der nicht springt.' },
  // ---- Förderung Hüfte (Abduktion · Streckung · Kontrolle) ----
  { id: 'seilzug_abduktion', name: 'Bein seitlich abspreizen am Seilzug', geraete: ['kabelzug'], muster: 'foerderung', gruppe: 'beine', prio: 1, foerder: 'abduktion', einbeinig: true, b: m('leicht'), hinweis: 'Fußschlaufe, seitlich zum Turm, festhalten. Beide Seiten.' },
  { id: 'seitlage_abduktion', name: 'Seitlage: Bein abspreizen', geraete: ['boden'], muster: 'foerderung', gruppe: 'beine', prio: 2, foerder: 'abduktion', b: m('keiner'), hinweis: 'Oberes Bein leicht hinter der Körperlinie, langsam.' },
  { id: 'clamshell', name: 'Seitlage: Knie öffnen (Clamshell)', geraete: ['boden'], muster: 'foerderung', gruppe: 'beine', prio: 3, foerder: 'abduktion', b: m('keiner', 'mittel', false, 'aussen'), hinweis: 'Füße zusammen, oberes Knie öffnen.' },
  { id: 'seilzug_hueftstreckung', name: 'Bein nach hinten führen am Seilzug', geraete: ['kabelzug'], muster: 'foerderung', gruppe: 'beine', prio: 1, foerder: 'streckung', einbeinig: true, b: m('leicht'), hinweis: 'Nur bis leicht hinter den Körper, aufrecht bleiben.' },
  { id: 'bruecke', name: 'Brücke (Becken heben)', geraete: ['boden'], muster: 'foerderung', gruppe: 'beine', prio: 2, foerder: 'streckung', b: m('keiner'), hinweis: 'Rückenlage, Füße aufgestellt, Becken heben, oben kurz halten.' },
  { id: 'hyperextension_huefte', name: 'Hüftstrecken an der Bank', geraete: ['hyperextension'], muster: 'foerderung', gruppe: 'beine', prio: 3, foerder: 'streckung', b: m('leicht', 'tief', true), hinweis: 'Polster hoch, nur Teilbewegung bei Vorgabe.' },
  { id: 'aufstehen', name: 'Aufstehen vom Sitz ohne Hände', geraete: ['boden'], muster: 'foerderung', gruppe: 'beine', prio: 1, foerder: 'kontrolle', b: m('keiner', 'mittel', true), hinweis: 'Von Bank oder Gerätesitz; Sitzhöhe so, dass es angenehm ist.' },
  { id: 'einbeinstand', name: 'Einbeinstand neben Stütze', geraete: ['boden'], muster: 'foerderung', gruppe: 'beine', prio: 2, foerder: 'kontrolle', art: 'zeit', einbeinig: true, b: m('keiner'), hinweis: 'Hand an der Stütze bereit, beide Seiten.' },
  // ---- Aufwärmen ----
  { id: 'laufband_gehen', name: 'Laufband: zügig gehen', geraete: ['laufband'], muster: 'ausdauer', prio: 1, b: m('keiner', 'gering', false, 'nein', 'nein', 'gering'), hinweis: '' },
  { id: 'ergometer_locker', name: 'Ergometer locker', geraete: ['ergometer'], muster: 'ausdauer', prio: 2, b: m('leicht', 'mittel', true), hinweis: 'Sattel eher hoch.' },
  { id: 'crosstrainer_locker', name: 'Crosstrainer locker', geraete: ['crosstrainer'], muster: 'ausdauer', prio: 3, b: m('leicht', 'gering', false, 'nein', 'nein', 'gering'), hinweis: '' },
  { id: 'airbike_locker', name: 'Air Bike locker', geraete: ['airbike'], muster: 'ausdauer', prio: 4, b: m('zug_mittel', 'mittel', true), hinweis: '' },
  { id: 'rudern_locker', name: 'Rudergerät locker', geraete: ['rudergeraet'], muster: 'ausdauer', prio: 5, b: m('zug_mittel', 'tief', true), hinweis: '' },
];

// Mobilitätseinheit Hüfte (ca. 5 Min. nach dem Aufwärmen), je 8–12 langsame Wdh. im schmerzarmen Bereich
export const MOBILITAET = [
  { id: 'pendeln_vor', text: 'Bein vor und zurück pendeln (im Stand, mit Stütze)', beidseitig: true },
  { id: 'pendeln_seit', text: 'Bein seitlich pendeln', textUeberkreuzen: 'Bein seitlich nach außen pendeln (nicht über die Mitte)', beidseitig: true },
  { id: 'schrittstand', text: 'Hüftstreckung im Schrittstand (Becken sanft nach vorn)', beidseitig: true },
  { id: 'becken_kippen', text: 'Becken kippen in Rückenlage', beidseitig: false },
];

// Handprogramm (3–4 Min.), nur schmerzarm
export const HANDPROGRAMM = [
  { id: 'o_form', text: 'Daumen zu jeder Fingerspitze führen, rundes „O“ ohne Druck', dosis: '10×' },
  { id: 'zeigefinger', text: 'Zeigefinger seitlich gegen die andere Hand abspreizen und halten', dosis: '5 × 5 s' },
  { id: 'c_form', text: 'Daumen in C-Form gegen die andere Handfläche drücken und halten', dosis: '5 × 5 s' },
  { id: 'ball_rollen', text: 'Handflächen flach auf den Medizinball legen und rollen', dosis: '30 s' },
];
