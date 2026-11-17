import table from './pvgis-table.json';

/** Produktion per installerad kWp, från PVGIS (EU-kommissionens soldatabas). */
export interface Yield {
  /** kWh per kWp och år */
  year: number;
  /** kWh per kWp för januari–december */
  months: number[];
  /** Sant när värdena kommer från den förberäknade tabellen i stället för ett anrop för just den här platsen. */
  approximate: boolean;
}

/** Sätts i byggen för statisk hosting (GitHub Pages), där det inte finns någon serverdel att fråga. */
const STATIC_HOSTING = import.meta.env.VITE_STATIC_HOSTING === '1';

export const TABLE_PLACE: string = table.place.name;

/**
 * Slår upp produktionen i den förberäknade tabellen (scripts/build-pvgis-table.mjs) och
 * interpolerar mellan närmaste lutningar och väderstreck.
 */
export function yieldFromTable(tilt: number, azimuth: number): Yield {
  const { tilts, azimuths } = table;
  const t = Math.min(tilts[tilts.length - 1], Math.max(tilts[0], tilt));
  const hi = Math.max(1, tilts.findIndex((v) => v >= t));
  const lo = hi - 1;
  const tiltShare = (t - tilts[lo]) / (tilts[hi] - tilts[lo]);

  const step = 360 / azimuths.length; // väderstrecken går varvet runt i jämna steg
  const turn = (((azimuth % 360) + 360) % 360) / step;
  const a0 = Math.floor(turn) % azimuths.length;
  const a1 = (a0 + 1) % azimuths.length;
  const azimuthShare = turn - Math.floor(turn);

  const mix = (a: number, b: number, share: number) => a + (b - a) * share;
  const months = Array.from({ length: 12 }, (_, m) =>
    mix(
      mix(table.months[lo][a0][m], table.months[lo][a1][m], azimuthShare),
      mix(table.months[hi][a0][m], table.months[hi][a1][m], azimuthShare),
      tiltShare,
    ),
  );
  return { year: months.reduce((sum, v) => sum + v, 0), months, approximate: true };
}

/**
 * Hämtar produktionen för platsen via serverdelen (server/pvgis.ts), eftersom PVGIS inte tillåter
 * anrop direkt från webbläsaren. Utan server, eller om anropet misslyckas, används tabellen.
 */
export async function fetchYield(lat: number, lng: number, tilt: number, azimuth: number): Promise<Yield> {
  if (STATIC_HOSTING) return yieldFromTable(tilt, azimuth);
  // PVGIS räknar väderstreck från söder: 0 = söder, 90 = väster, -90 = öster
  const aspect = ((((azimuth - 180) % 360) + 540) % 360) - 180;
  const params = new URLSearchParams({
    lat: lat.toFixed(5),
    lon: lng.toFixed(5),
    peakpower: '1',
    loss: '14',
    angle: String(Math.round(tilt)),
    aspect: String(Math.round(aspect)),
    outputformat: 'json',
  });
  try {
    const res = await fetch(`/api/pvgis?${params}`);
    if (!res.ok) throw new Error(`PVGIS svarade ${res.status}`);
    const data = await res.json();
    const months: number[] = data?.outputs?.monthly?.fixed?.map((m: { E_m: number }) => m.E_m);
    const year: number = data?.outputs?.totals?.fixed?.E_y;
    if (!year || months?.length !== 12) throw new Error('PVGIS gav ett oväntat svar');
    return { year, months, approximate: false };
  } catch (err) {
    console.warn('PVGIS gick inte att nå, använder förberäknade värden.', err);
    return yieldFromTable(tilt, azimuth);
  }
}
