// Kleine Merkzettel im Gerät (Rundgang gesehen, Hinweis ausgeblendet …), localStorage.
// Alle Apps auf bauer-reisen.github.io teilen sich diesen Speicher – deshalb das Präfix.
// Die eigentlichen Daten (Training, Essen, Körper) liegen in IndexedDB (db.js).
const KEY = 'fitness.';

export const store = {
  get: (k) => { try { return localStorage.getItem(KEY + k); } catch { return null; } },
  set: (k, v) => { try { v == null ? localStorage.removeItem(KEY + k) : localStorage.setItem(KEY + k, v); } catch { /* voll/privat */ } },
};
