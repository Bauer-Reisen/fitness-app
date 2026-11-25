// Supplement-Prüfliste (ANFORDERUNGEN.md, Abschnitt 3). Die App schlägt nichts von sich aus vor.
// Aufnahme nur, wenn alle drei Bedingungen erfüllt sind: gute Studienlage, klar belegter Nutzen für Kraft/Muskelaufbau,
// geringes Risiko bei üblicher Dosis. Stand der Recherche: 23.11.2026 (Websuche, Volltexte nicht gelesen).

export const STAND = '23.11.2026';

export const PRUEFLISTE = [
  {
    id: 'kreatin', name: 'Kreatin-Monohydrat',
    nutzen: 'Mehr Kraft und mehr Muskelzuwachs bei Krafttraining, bei Einsteigern wie Trainierten.',
    dosis: '3–5 g täglich, Zeitpunkt egal. Eine Ladephase ist nicht nötig.',
    risiken: '1–2 kg mehr Gewicht durch Wasser in den Muskeln (Größenordnung ungeprüft) – das zeigt sich im Gewichtsverlauf. Magen-Darm-Beschwerden bei großen Einzeldosen. Nierenschaden bei Gesunden nicht belegt.',
    nichtWenn: 'Nierenerkrankung oder eingeschränkte Nierenfunktion: nur nach ärztlicher Rücksprache. Kreatin erhöht den Kreatinin-Blutwert – vor Blutuntersuchungen den Arzt informieren.',
    reinheit: 'Reines Monohydrat; Produkte mit Prüfung auf Dopingsubstanzen (Kölner Liste) bevorzugen – keine Garantie.',
    quellen: [
      { text: 'Kreider et al. 2017, ISSN Position Stand, J Int Soc Sports Nutr 14:18 (vom Industrieverband CRN beauftragt und mitfinanziert)', url: 'https://doi.org/10.1186/s12970-017-0173-z' },
      { text: 'Antonio et al. 2021, J Int Soc Sports Nutr 18:13', url: 'https://doi.org/10.1186/s12970-021-00412-w' },
      { text: 'IOC Consensus Statement, Maughan et al. 2018, Br J Sports Med 52:439', url: 'https://doi.org/10.1136/bjsports-2018-099027' },
      { text: 'EU-Gesundheitsangabe VO (EU) 2017/672 (Muskelkraft, Erwachsene über 55)', url: 'https://eur-lex.europa.eu/eli/reg_impl/2017/672/oj/eng' },
    ],
  },
];

export const NUR_BEI_MANGEL = {
  text: 'Ohne Blutwert ist kein Nutzen für Kraft oder Muskelaufbau belegt. Nur nach ärztlich festgestelltem Mangel.',
  liste: ['Vitamin D', 'Magnesium', 'Zink', 'Eisen', 'Vitamin B12 (bei veganer Ernährung)'],
  quelle: { text: 'Beaudart et al. 2014, J Clin Endocrinol Metab 99:4336 (Vitamin D: kleiner Effekt, vor allem bei Mangel)', url: 'https://doi.org/10.1210/jc.2014-1742' },
};

// [Name, verfehlte Bedingung, Begründung]
export const AUSSCHLUSS = [
  ['Koffein', 'Nutzen', 'Kleiner kurzfristiger Effekt auf Kraft (Grgic et al. 2018: SMD 0,20, Unterkörper nicht signifikant, 46 Personen), kein Muskelaufbau. Kaffee reicht; EFSA 2015: bis 200 mg je Einzeldosis und 400 mg/Tag unbedenklich, schon 100 mg können den Schlaf stören – bei Abendtraining beachten.'],
  ['Beta-Alanin', 'Nutzen', 'Nutzen nur bei Belastungen von 0,5–10 Minuten (Saunders et al. 2017).'],
  ['Natriumbicarbonat', 'Nutzen, Risiko', 'Nutzen bei intensiven Intervallen, nicht für Muskelaufbau; häufig Magen-Darm-Probleme.'],
  ['Nitrat / Rote Bete', 'Nutzen', 'Belege vor allem für Ausdauer (IOC 2018).'],
  ['HMB', 'Nutzen', 'Bei Trainierten kein relevanter Effekt (Rowlands & Thomson 2009).'],
  ['BCAA', 'Nutzen', 'Kein Nutzen für Muskelaufbau belegt (Wolfe 2017).'],
  ['EAA', 'Nutzen', 'Kein Zusatznutzen bei gedecktem Eiweißbedarf (Quelle ungeprüft).'],
  ['Citrullin / Arginin', 'Studienlage, Nutzen', 'Kleiner, uneinheitlicher Akuteffekt (Trexler et al. 2019).'],
  ['Omega-3', 'Nutzen', 'Kein klar belegter Kraft- oder Muskeleffekt bei Gesunden.'],
  ['Ashwagandha', 'Studienlage, Risiko', 'Wenige, uneinheitliche Studien; BfR-Mitteilung 39/2024 warnt vor Leberschäden bis Leberversagen.'],
  ['Tribulus / „Testosteron-Booster“', 'Nutzen, Risiko', 'Erhöht Testosteron nicht (Qureshi et al. 2014); Booster teils verunreinigt.'],
  ['Fatburner / Grüntee-Extrakt', 'Nutzen, Risiko', 'Kein Muskelaufbau; ab 800 mg EGCG/Tag Hinweise auf Leberschäden (EFSA 2018), EU-Beschränkung seit Dezember 2022 (VO (EU) 2022/2340).'],
  ['Glutamin, L-Carnitin, Kollagen, Multivitamin, CLA', 'Nutzen', 'Kein belegter Nutzen für Kraft/Muskelaufbau bei Gesunden (Quellen ungeprüft).'],
];

export const EIWEISSPULVER = {
  text: 'Zählt einfach zur Tages-Eiweißmenge. Der Nutzen flacht ab etwa 1,6 g Eiweiß je kg Körpergewicht und Tag ab (Gesamtzufuhr).',
  quelle: { text: 'Morton et al. 2018, Br J Sports Med 52:376', url: 'https://doi.org/10.1136/bjsports-2017-097608' },
};
