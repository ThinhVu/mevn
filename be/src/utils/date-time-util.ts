import _ from 'lodash'

export function ms2hms(milliseconds: number) {
  const seconds = Math.floor((milliseconds / 1000) % 60);
  const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
  const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);

  const formattedSeconds = seconds.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedHours = hours.toString().padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

export async function delay(ms: number) {
  return new Promise(rs => setTimeout(rs, ms))
}

export const h2ms = h => (+h) * 3600000;
export const m2ms = m => (+m) * 60000;
export const s2ms = s => (+s) * 1000;
export const ms2h = ms => _.round((+ms) / 3600000, 1);