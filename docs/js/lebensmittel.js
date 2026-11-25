// Lokale Grundliste: generische Lebensmittel und Mahlzeitvorschläge (offline, ohne Datenbank im Netz).
// Werte sind gerundete Richtwerte je 100 g bzw. 100 ml (ungeprüft) – die Angabe auf der Packung hat Vorrang.
// p = übliche Portion in g/ml mit Name.

export const QUELLE_HINWEIS = 'Richtwerte (gerundet, nicht geprüft). Steht etwas auf der Packung, gilt die Packung.';

// [id, Name, kcal/100, Eiweiß g/100, Portion g, Portionsname]
const L = [
  ['magerquark', 'Magerquark', 67, 12, 250, 'Becher'],
  ['skyr', 'Skyr natur', 63, 11, 150, 'Schale'],
  ['joghurt', 'Naturjoghurt 1,5 %', 47, 3.5, 150, 'Schale'],
  ['huettenkaese', 'Hüttenkäse', 100, 12, 200, 'Becher'],
  ['milch', 'Milch 1,5 %', 47, 3.4, 250, 'Glas'],
  ['gouda', 'Gouda', 360, 25, 30, 'Scheibe'],
  ['ei', 'Ei', 155, 13, 60, 'Ei'],
  ['haehnchen', 'Hähnchenbrust (gegart)', 150, 30, 150, 'Stück'],
  ['putenbrust', 'Putenbrust-Aufschnitt', 105, 21, 20, 'Scheibe'],
  ['rinderhack', 'Rinderhack', 220, 20, 125, 'Portion'],
  ['lachs', 'Lachs (gegart)', 200, 22, 125, 'Filet'],
  ['thunfisch', 'Thunfisch im eigenen Saft', 110, 25, 130, 'Dose (abgetropft)'],
  ['tofu', 'Tofu natur', 120, 13, 100, 'Portion'],
  ['linsen', 'Linsen (gekocht)', 115, 9, 200, 'Portion'],
  ['kichererbsen', 'Kichererbsen (gekocht)', 160, 9, 150, 'Portion'],
  ['bohnen', 'Kidneybohnen (Dose)', 90, 7, 150, 'Portion'],
  ['haferflocken', 'Haferflocken', 370, 13, 50, 'Portion'],
  ['vollkornbrot', 'Vollkornbrot', 220, 8, 50, 'Scheibe'],
  ['broetchen', 'Brötchen', 270, 9, 50, 'Stück'],
  ['reis', 'Reis (gekocht)', 130, 2.7, 200, 'Portion'],
  ['nudeln', 'Nudeln (gekocht)', 150, 5, 250, 'Portion'],
  ['kartoffeln', 'Kartoffeln (gekocht)', 75, 2, 250, 'Portion'],
  ['banane', 'Banane', 90, 1.1, 120, 'Stück'],
  ['apfel', 'Apfel', 54, 0.3, 150, 'Stück'],
  ['beeren', 'Beeren (TK)', 45, 1, 100, 'Handvoll'],
  ['gemuese', 'Gemüse gemischt', 30, 2, 200, 'Portion'],
  ['salat', 'Salat', 15, 1.2, 100, 'Schale'],
  ['nuesse', 'Nüsse (Mandeln)', 600, 21, 30, 'Handvoll'],
  ['erdnussbutter', 'Erdnussbutter', 600, 25, 15, 'Esslöffel'],
  ['oel', 'Öl', 880, 0, 10, 'Esslöffel'],
  ['butter', 'Butter', 740, 0.7, 10, 'Portion'],
  ['pizza', 'Pizza', 250, 10, 350, 'Pizza'],
  ['doener', 'Döner', 220, 12, 350, 'Stück'],
  ['bier', 'Bier', 43, 0.5, 500, 'Flasche 0,5 l'],
  ['saftschorle', 'Saftschorle', 25, 0, 500, 'Flasche 0,5 l'],
];

export const LEBENSMITTEL = L.map(([id, name, kcal, eiweiss, g, portion]) => ({ id, name, kcal, eiweiss, g, portion }));

export function portionWerte(lm, faktor = 1) {
  const f = (lm.g / 100) * faktor;
  return { kcal: Math.round(lm.kcal * f), eiweiss: Math.round(lm.eiweiss * f * 10) / 10 };
}

// Alltagstaugliche Mahlzeiten, Richtwerte je Portion (aus den Werten oben grob zusammengerechnet)
export const MAHLZEITEN = [
  { id: 'quark_beeren', name: 'Magerquark mit Beeren und Haferflocken', kcal: 380, eiweiss: 37, min: 3 },
  { id: 'skyr_banane', name: 'Skyr mit Banane', kcal: 205, eiweiss: 18, min: 2 },
  { id: 'ruehrei_brot', name: 'Rührei (3 Eier) mit Vollkornbrot', kcal: 500, eiweiss: 31, min: 8 },
  { id: 'thunfisch_brot', name: 'Thunfisch-Brot mit Salat', kcal: 340, eiweiss: 33, min: 5 },
  { id: 'huettenkaese_brot', name: 'Hüttenkäse auf 2 Scheiben Vollkornbrot', kcal: 420, eiweiss: 32, min: 3 },
  { id: 'haehnchen_reis', name: 'Hähnchen mit Reis und Gemüse', kcal: 560, eiweiss: 40, min: 20 },
  { id: 'linsen_bowl', name: 'Linsen-Bowl mit Gemüse und Ei', kcal: 400, eiweiss: 27, min: 15 },
  { id: 'lachs_kartoffeln', name: 'Lachs mit Kartoffeln und Gemüse', kcal: 500, eiweiss: 34, min: 25 },
  { id: 'nudeln_hack', name: 'Nudeln mit Hackfleisch-Tomatensoße', kcal: 680, eiweiss: 36, min: 25 },
  { id: 'tofu_pfanne', name: 'Tofu-Gemüse-Pfanne mit Reis', kcal: 460, eiweiss: 21, min: 20 },
  { id: 'chili', name: 'Chili mit Bohnen und Hack', kcal: 520, eiweiss: 38, min: 30 },
  { id: 'putenbrot', name: '2 Brötchen mit Putenbrust und Gouda', kcal: 560, eiweiss: 35, min: 3 },
  { id: 'quark_nuss', name: 'Quark mit Erdnussbutter (Snack)', kcal: 260, eiweiss: 34, min: 2 },
];

// 3 Vorschläge passend zum Rest des Tages
export function vorschlaege(rest) {
  let liste = [...MAHLZEITEN];
  if (rest.kcal > 0) {
    const passend = liste.filter((m) => m.kcal <= rest.kcal * 1.1);
    if (passend.length) liste = passend;
  }
  if (rest.eiweiss > 15) liste.sort((a, b) => b.eiweiss / b.kcal - a.eiweiss / a.kcal);
  else liste.sort((a, b) => Math.abs(a.kcal - rest.kcal) - Math.abs(b.kcal - rest.kcal));
  return liste.slice(0, 3);
}
