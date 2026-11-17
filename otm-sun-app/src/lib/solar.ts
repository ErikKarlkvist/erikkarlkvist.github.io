import type { Point } from '../components/MapView';
import { GOOGLE_KEY } from './google';

/* Delmängd av svaret från Solar API buildingInsights:findClosest som appen använder. */
export interface LatLng {
  latitude: number;
  longitude: number;
}
export interface RoofSegment {
  pitchDegrees: number;
  azimuthDegrees: number;
  stats: { areaMeters2: number; sunshineQuantiles: number[] };
  center: LatLng;
}
export interface SolarPanel {
  center: LatLng;
  orientation: 'LANDSCAPE' | 'PORTRAIT';
  yearlyEnergyDcKwh: number;
  segmentIndex: number;
}
export interface PanelConfig {
  panelsCount: number;
  yearlyEnergyDcKwh: number;
  roofSegmentSummaries: { segmentIndex: number; panelsCount: number; yearlyEnergyDcKwh: number }[];
}
export interface BuildingInsights {
  name: string;
  center: LatLng;
  boundingBox: { sw: LatLng; ne: LatLng };
  imageryDate?: { year: number; month: number; day: number };
  imageryQuality?: 'HIGH' | 'MEDIUM' | 'BASE';
  solarPotential: {
    maxArrayPanelsCount: number;
    maxArrayAreaMeters2: number;
    maxSunshineHoursPerYear: number;
    panelCapacityWatts: number;
    panelHeightMeters: number;
    panelWidthMeters: number;
    wholeRoofStats: { areaMeters2: number };
    roofSegmentStats: RoofSegment[];
    solarPanels: SolarPanel[];
    solarPanelConfigs: PanelConfig[];
  };
}

export class NoSolarDataError extends Error {}

export async function fetchBuildingInsights(lat: number, lng: number): Promise<BuildingInsights> {
  const params = new URLSearchParams({
    'location.latitude': lat.toFixed(6),
    'location.longitude': lng.toFixed(6),
    requiredQuality: 'BASE', // sämsta godtagbara kvalitet; bättre data returneras om den finns
    key: GOOGLE_KEY,
  });
  const res = await fetch(`https://solar.googleapis.com/v1/buildingInsights:findClosest?${params}`);
  if (res.status === 404) {
    throw new NoSolarDataError('Google har ingen soldata för den här platsen ännu.');
  }
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message ?? `Solar API svarade ${res.status}`);
  }
  const data = (await res.json()) as BuildingInsights;
  if (!data.solarPotential?.solarPanelConfigs?.length) {
    throw new NoSolarDataError('Google hittade byggnaden men kunde inte placera några paneler på taket.');
  }
  return data;
}

/** Googles panelplacering som hörnpunkter, i den ordning panelerna fylls på (bäst läge först). */
export function panelOutlines(insights: BuildingInsights): Point[][] {
  const sp = insights.solarPotential;
  const { spherical } = google.maps.geometry;
  const w = sp.panelWidthMeters / 2;
  const h = sp.panelHeightMeters / 2;
  const corners = [
    { x: +w, y: +h },
    { x: +w, y: -h },
    { x: -w, y: -h },
    { x: -w, y: +h },
  ];
  return sp.solarPanels.map((panel) => {
    const turn = panel.orientation === 'PORTRAIT' ? 90 : 0;
    const azimuth = sp.roofSegmentStats[panel.segmentIndex]?.azimuthDegrees ?? 0;
    const center = { lat: panel.center.latitude, lng: panel.center.longitude };
    return corners.map(({ x, y }) => {
      const at = spherical.computeOffset(center, Math.hypot(x, y), (Math.atan2(y, x) * 180) / Math.PI + turn + azimuth);
      return { lat: at.lat(), lng: at.lng() };
    });
  });
}

/**
 * Googles bästa takyta som en ritbar ruta: den yta som fått flest paneler, med uppmätt lutning och väderstreck.
 * Rutan är den minsta som rymmer ytans paneler, lagd längs takfoten.
 */
export function mainSegmentOutline(insights: BuildingInsights): { outline: Point[]; tilt: number; azimuth: number } | null {
  const sp = insights.solarPotential;
  const counts = new Map<number, number>();
  sp.solarPanels.forEach((panel) => counts.set(panel.segmentIndex, (counts.get(panel.segmentIndex) ?? 0) + 1));
  const [index] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0] ?? [];
  const segment = index === undefined ? undefined : sp.roofSegmentStats[index];
  if (!segment) return null;

  const { spherical } = google.maps.geometry;
  const corners = panelOutlines(insights)
    .filter((_, i) => sp.solarPanels[i].segmentIndex === index)
    .flat();
  const center = {
    lat: corners.reduce((sum, p) => sum + p.lat, 0) / corners.length,
    lng: corners.reduce((sum, p) => sum + p.lng, 0) / corners.length,
  };
  const azimuth = segment.azimuthDegrees;
  // x längs takfoten, y nedför takfallet
  const local = corners.map((p) => {
    const d = spherical.computeDistanceBetween(center, p);
    const angle = ((spherical.computeHeading(center, p) - azimuth) * Math.PI) / 180;
    return { x: d * Math.sin(angle), y: d * Math.cos(angle) };
  });
  const margin = 0.35; // lite luft, så att samma paneler får plats när ytan läggs ut på nytt
  const minX = Math.min(...local.map((p) => p.x)) - margin;
  const maxX = Math.max(...local.map((p) => p.x)) + margin;
  const minY = Math.min(...local.map((p) => p.y)) - margin;
  const maxY = Math.max(...local.map((p) => p.y)) + margin;
  const outline = [
    { x: minX, y: minY },
    { x: maxX, y: minY },
    { x: maxX, y: maxY },
    { x: minX, y: maxY },
  ].map(({ x, y }) => {
    const at = spherical.computeOffset(center, Math.hypot(x, y), azimuth + (Math.atan2(x, y) * 180) / Math.PI);
    return { lat: at.lat(), lng: at.lng() };
  });
  return { outline, tilt: Math.round(segment.pitchDegrees), azimuth };
}

/** Exempelbyggnad för demoläget (ingen API-nyckel). Siffrorna är påhittade men rimliga för Småland. */
export function demoInsights(): BuildingInsights {
  const center = { latitude: 57.6664, longitude: 14.9721 };
  const perPanel = [372, 371, 370, 369, 368, 366, 365, 363, 361, 359, 357, 355, 352, 349, 346, 343, 339, 335, 331, 326];
  const north = [208, 206, 204, 201];
  const energies = [...perPanel, ...north];
  const solarPanels: SolarPanel[] = energies.map((e, i) => ({
    center,
    orientation: 'PORTRAIT',
    yearlyEnergyDcKwh: e,
    segmentIndex: i < perPanel.length ? 0 : 1,
  }));
  const solarPanelConfigs: PanelConfig[] = [];
  for (let n = 4; n <= energies.length; n++) {
    const a = Math.min(n, perPanel.length);
    const sum = (xs: number[]) => xs.reduce((s, x) => s + x, 0);
    const south = sum(energies.slice(0, a));
    const rest = sum(energies.slice(a, n));
    solarPanelConfigs.push({
      panelsCount: n,
      yearlyEnergyDcKwh: south + rest,
      roofSegmentSummaries: [
        { segmentIndex: 0, panelsCount: a, yearlyEnergyDcKwh: south },
        ...(n > a ? [{ segmentIndex: 1, panelsCount: n - a, yearlyEnergyDcKwh: rest }] : []),
      ],
    });
  }
  return {
    name: 'demo',
    center,
    boundingBox: {
      sw: { latitude: 57.66634, longitude: 14.97198 },
      ne: { latitude: 57.66646, longitude: 14.97222 },
    },
    imageryDate: { year: 2024, month: 6, day: 12 },
    imageryQuality: 'MEDIUM',
    solarPotential: {
      maxArrayPanelsCount: energies.length,
      maxArrayAreaMeters2: energies.length * 1.96,
      maxSunshineHoursPerYear: 1040,
      panelCapacityWatts: 400,
      panelHeightMeters: 1.879,
      panelWidthMeters: 1.045,
      wholeRoofStats: { areaMeters2: 112 },
      roofSegmentStats: [
        { pitchDegrees: 27, azimuthDegrees: 184, center, stats: { areaMeters2: 56, sunshineQuantiles: [610, 820, 900, 940, 960, 975, 990, 1005, 1020, 1030, 1040] } },
        { pitchDegrees: 27, azimuthDegrees: 4, center, stats: { areaMeters2: 56, sunshineQuantiles: [380, 480, 520, 545, 560, 572, 585, 598, 610, 622, 640] } },
      ],
      solarPanels,
      solarPanelConfigs,
    },
  };
}
