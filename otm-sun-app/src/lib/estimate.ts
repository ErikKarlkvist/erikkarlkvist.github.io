import type { BuildingInsights } from './solar';

/** Förluster från likström på taket till växelström i huset (växelriktare, kablar, smuts). */
export const SYSTEM_EFFICIENCY = 0.85;

/**
 * Hur årsproduktionen fördelar sig över månaderna i södra Sverige.
 * Solar API ger bara årsvärden, så månadsstaplarna är en schablon.
 */
const MONTH_SHARE = [0.016, 0.039, 0.08, 0.117, 0.148, 0.153, 0.152, 0.125, 0.088, 0.053, 0.021, 0.008];

export const sv = (n: number, decimals = 0) =>
  n.toLocaleString('sv-SE', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

export type Rating = 'Bra' | 'Okej' | 'Svag';

export interface SegmentEstimate {
  index: number;
  areaM2: number;
  pitch: number;
  azimuth: number;
  direction: string;
  rating: Rating;
  panels: number;
}

export interface Estimate {
  /** Paneler som faktiskt räknas. */
  panels: number;
  /** Reglagets värde, innan bortklickade paneler dragits av. */
  requested: number;
  kwp: number;
  kwhPerYear: number;
  months: number[];
  segments: SegmentEstimate[];
  minPanels: number;
  maxPanels: number;
}

const DIRECTIONS = ['norr', 'nordost', 'öster', 'sydost', 'söder', 'sydväst', 'väster', 'nordväst'];
export const compass = (azimuth: number) => DIRECTIONS[Math.round((((azimuth % 360) + 360) % 360) / 45) % 8];

/** Startvärde: alla paneler som ger minst 70 % av den bästa panelen (skippar t.ex. norrsidan). */
export function sensiblePanelCount(insights: BuildingInsights): number {
  const { solarPanels } = insights.solarPotential;
  const best = solarPanels[0]?.yearlyEnergyDcKwh ?? 0;
  return Math.max(1, solarPanels.filter((p) => p.yearlyEnergyDcKwh >= best * 0.7).length);
}

/**
 * Räknar på Googles analys. Panelerna är sorterade med bäst läge först; `count` tar de första,
 * och `excluded` är paneler användaren klickat bort i kartan (index i samma ordning).
 */
export function estimate(insights: BuildingInsights, count: number, excluded: ReadonlySet<number> = new Set()): Estimate {
  const sp = insights.solarPotential;
  const requested = Math.min(sp.solarPanels.length, Math.max(1, count));
  const chosen = sp.solarPanels.slice(0, requested).filter((_, i) => !excluded.has(i));
  const dcKwh = chosen.reduce((sum, panel) => sum + panel.yearlyEnergyDcKwh, 0);
  const kwhPerYear = Math.round((dcKwh * SYSTEM_EFFICIENCY) / 10) * 10;
  const segments = sp.roofSegmentStats.map((seg, index): SegmentEstimate => {
    const q = seg.stats.sunshineQuantiles;
    const median = q[Math.floor(q.length / 2)] ?? 0;
    const relative = median / sp.maxSunshineHoursPerYear;
    return {
      index,
      areaM2: seg.stats.areaMeters2,
      pitch: seg.pitchDegrees,
      azimuth: seg.azimuthDegrees,
      // Platta tak har inget meningsfullt väderstreck
      direction: seg.pitchDegrees < 3 ? 'platt' : 'mot ' + compass(seg.azimuthDegrees),
      rating: relative > 0.8 ? 'Bra' : relative > 0.6 ? 'Okej' : 'Svag',
      panels: chosen.filter((panel) => panel.segmentIndex === index).length,
    };
  });
  return {
    panels: chosen.length,
    requested,
    kwp: (chosen.length * sp.panelCapacityWatts) / 1000,
    kwhPerYear,
    months: MONTH_SHARE.map((share) => Math.round(kwhPerYear * share)),
    segments: segments.sort((a, b) => b.panels - a.panels || b.areaM2 - a.areaM2),
    minPanels: 1,
    maxPanels: sp.solarPanels.length,
  };
}

export const RATING_COLOR: Record<Rating, string> = { Bra: '#eb8b1b', Okej: '#d9b36a', Svag: '#7d93a8' };
