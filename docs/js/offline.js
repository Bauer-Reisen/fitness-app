// Offline: Service Worker anmelden und anzeigen, ob alles auf dem Handy gespeichert ist.
import { VERSION } from './config.js?v=0.1.5';
import { store } from './store.js?v=0.1.5';

const LOCAL = ['localhost', '127.0.0.1'].includes(location.hostname);
// Am PC normalerweise aus (sonst sieht man Änderungen nicht). Zum Testen: Adresse mit ?sw=1 öffnen.
if (new URLSearchParams(location.search).get('sw') === '1') store.set('swTest', '1');
const enabled = 'serviceWorker' in navigator && (!LOCAL || store.get('swTest'));

export function registerSw() {
  if (!enabled) return;
  navigator.serviceWorker.register('sw.js').catch(() => { /* ohne geht es auch */ });
  // Handy bitten, den Speicher nicht aufzuräumen (klappt vor allem als Home-Bildschirm-App)
  navigator.storage?.persist?.().catch(() => {});
}

// 'bereit' | 'laedt' | 'aus'
export async function offlineState() {
  if (!enabled || !('caches' in window)) return 'aus';
  try {
    const hit = await caches.match('bereit', { cacheName: 'fitness-' + VERSION });
    return hit ? 'bereit' : 'laedt';
  } catch { return 'laedt'; }
}

// Alles neu speichern (Knopf unter „Mehr")
export async function refreshOffline() {
  if (!enabled) return false;
  // Alten Speicher weg, Service Worker neu anmelden → er speichert alles noch einmal
  const reg = await navigator.serviceWorker.getRegistration();
  await caches.delete('fitness-' + VERSION);
  await reg?.unregister();
  await navigator.serviceWorker.register('sw.js');
  return true;
}

export const online = () => navigator.onLine !== false;
