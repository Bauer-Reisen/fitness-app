// „App weitergeben": QR-Code zum Abscannen und Teilen-Knopf. Weitergegeben wird nur der Link – keine Daten.
import { toast } from './ui.js?v=0.1.1';
import { APP_URL } from './config.js?v=0.1.1';

const TEXT = 'Meine Fitness-App fürs Studio – öffnen und zum Home-Bildschirm hinzufügen. Deine Daten bleiben nur auf deinem Handy:';

export function shareCard() {
  return `
    <div class="card share">
      <h3>App weitergeben</h3>
      <p>QR-Code mit der Handy-Kamera abscannen oder den Link schicken. Jeder hat dann seine eigenen Daten auf seinem Handy.</p>
      <img class="qr" src="icons/qr.svg" alt="QR-Code mit dem Link zur App" width="220" height="220">
      <button type="button" class="btn btn-primary btn-wide" data-act="share">Link teilen</button>
    </div>`;
}

export function wireShare(view) {
  view.querySelector('[data-act=share]')?.addEventListener('click', async () => {
    if (navigator.share) {
      try { await navigator.share({ title: 'Fitness', text: TEXT, url: APP_URL }); } catch { /* abgebrochen */ }
      return;
    }
    try {
      await navigator.clipboard.writeText(`${TEXT} ${APP_URL}`);
      toast('Link kopiert – jetzt z. B. in WhatsApp einfügen.');
    } catch {
      toast(APP_URL, 6000);
    }
  });
}
