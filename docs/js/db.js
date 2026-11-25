// Speicher im Gerät (IndexedDB, wie Bike-App). Nichts davon verlässt das Handy,
// außer du speicherst selbst ein Backup. Name „fitness-app“: alle Apps auf bauer-reisen.github.io
// teilen sich denselben Browser-Speicher, deshalb ein eigener Name.

const DB_NAME = 'fitness-app';
const DB_VERSION = 1;
export const FORMAT = 1; // Version der Backup-Datei
export const STORES = ['kv', 'profil', 'messungen', 'notizen', 'gesundheit', 'einschraenkungen',
  'geraete', 'uebungen', 'geraetUebung', 'trainings', 'saetze', 'essen', 'favoriten'];

let dbPromise = null;

function open() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      for (const name of STORES) {
        if (!db.objectStoreNames.contains(name)) db.createObjectStore(name, name === 'kv' ? undefined : { keyPath: 'id' });
      }
    };
    req.onsuccess = () => {
      const db = req.result;
      // iPhone: nach langer Zeit im Hintergrund kann die Verbindung weg sein – dann neu öffnen
      db.onclose = () => { dbPromise = null; };
      db.onversionchange = () => { db.close(); dbPromise = null; };
      resolve(db);
    };
    req.onerror = () => { dbPromise = null; reject(req.error); };
  });
  return dbPromise;
}

function run(store, mode, fn, nochmal = true) {
  return open().then((db) => new Promise((resolve, reject) => {
    let tx;
    try { tx = db.transaction(store, mode); } catch (e) {
      if (nochmal && e.name === 'InvalidStateError') { dbPromise = null; resolve(run(store, mode, fn, false)); return; }
      reject(e); return;
    }
    const os = tx.objectStore(store);
    let result;
    const req = fn(os);
    if (req) req.onsuccess = () => { result = req.result; };
    tx.oncomplete = () => resolve(result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  }));
}

export const kv = {
  get: (key) => run('kv', 'readonly', (os) => os.get(key)),
  set: (key, value) => run('kv', 'readwrite', (os) => os.put(value, key)),
  del: (key) => run('kv', 'readwrite', (os) => os.delete(key)),
};

export const alle = (store) => run(store, 'readonly', (os) => os.getAll());
export const hole = (store, id) => run(store, 'readonly', (os) => os.get(id));
export const speichere = (store, obj) => run(store, 'readwrite', (os) => os.put({ ...obj, geaendert: new Date().toISOString() }));
export const loesche = (store, id) => run(store, 'readwrite', (os) => os.delete(id));
export const leere = (store) => run(store, 'readwrite', (os) => os.clear());

export function neueId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ---------- Backup ----------
async function kvEintraege() {
  const db = await open();
  return new Promise((resolve, reject) => {
    const out = [];
    const req = db.transaction('kv').objectStore('kv').openCursor();
    req.onsuccess = () => {
      const c = req.result;
      if (!c) return resolve(out);
      out.push([c.key, c.value]);
      c.continue();
    };
    req.onerror = () => reject(req.error);
  });
}

export async function backupErstellen() {
  const daten = {};
  for (const name of STORES) daten[name] = name === 'kv' ? await kvEintraege() : await alle(name);
  return { app: 'fitness-app', format: FORMAT, schema: DB_VERSION, erstellt: new Date().toISOString(), daten };
}

export function backupPruefen(json) {
  if (!json || json.app !== 'fitness-app' || !json.daten) throw new Error('Das ist keine Backup-Datei dieser App.');
  if ((json.format || 0) > FORMAT) throw new Error('Die Datei ist von einer neueren App-Version. Bitte zuerst die App aktualisieren.');
}

// Ersetzt alle Daten durch das Backup
export async function backupLaden(json) {
  backupPruefen(json);
  let anzahl = 0;
  for (const name of STORES) {
    const liste = json.daten[name];
    if (!Array.isArray(liste)) continue;
    await leere(name);
    for (const e of liste) {
      if (name === 'kv') { if (Array.isArray(e)) { await kv.set(e[0], e[1]); anzahl++; } }
      else if (e && e.id) { await run(name, 'readwrite', (os) => os.put(e)); anzahl++; }
    }
  }
  return anzahl;
}

export async function allesLoeschen(namen = STORES) {
  for (const n of namen) await leere(n);
}
