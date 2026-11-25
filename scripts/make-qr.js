// Erzeugt den QR-Code mit dem Link zur App (docs/icons/qr.svg). Aufruf: npm run qr (vorher einmal npm install)
import QRCode from 'qrcode';
import { writeFileSync } from 'node:fs';

const URL_APP = 'https://bauer-reisen.github.io/fitness-app/';
const svg = await QRCode.toString(URL_APP, { type: 'svg', errorCorrectionLevel: 'M', margin: 2, color: { dark: '#121722', light: '#ffffff' } });
writeFileSync(new URL('../docs/icons/qr.svg', import.meta.url), svg);
console.log('QR-Code erstellt:', URL_APP);
