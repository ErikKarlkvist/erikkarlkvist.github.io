import type { Point } from '../components/MapView';
import { compass, type Estimate, type Rating } from './estimate';
import type { Yield } from './pvgis';

/* Antaganden när användaren ritar takytan själv */
export const PANEL_KW = 0.43;
/** Panelens mått i meter; panelerna läggs stående, med långsidan längs takfallet. */
export const PANEL_WIDTH_M = 1.134;
export const PANEL_HEIGHT_M = 1.722;
/** Fritt avstånd mellan panel och takytans kant. */
export const EDGE_MARGIN_M = 0.3;
const PANEL_GAP_M = 0.02;

export const TILTS = [
  { label: 'Flackt', deg: 15 },
  { label: 'Normalt', deg: 27 },
  { label: 'Brant', deg: 40 },
];

export interface ManualRoof {
  outline: Point[];
  groundM2: number;
  tilt: number;
  azimuth: number;
  yieldPerKwp: Yield;
  /** Panelernas hörn, i den ordning de fylls på (uppifrån nocken och ned). */
  panels: Point[][];
}

const norm = (deg: number) => ((deg % 360) + 360) % 360;

/** Ytan sedd rakt uppifrån, i m². Kräver att Googles geometry-bibliotek är laddat (görs av kartan). */
export const groundArea = (outline: Point[]) =>
  outline.length < 3 ? 0 : google.maps.geometry.spherical.computeArea(outline);

/** Takytan längs taket är större än ytan uppifrån. */
export const roofArea = (groundM2: number, tilt: number) => groundM2 / Math.cos((tilt * Math.PI) / 180);

type XY = { x: number; y: number };

function inside(p: XY, polygon: XY[]): boolean {
  let hit = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i];
    const b = polygon[j];
    if (a.y > p.y !== b.y > p.y && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) hit = !hit;
  }
  return hit;
}

/**
 * Lägger ut paneler i rader på den ritade ytan.
 * Räknar i ett plant koordinatsystem i meter med x längs takfoten och y nedför takfallet.
 * Sett uppifrån blir en panel kortare i fallriktningen ju brantare taket är.
 */
export function layoutPanels(outline: Point[], tilt: number, azimuth: number): Point[][] {
  if (outline.length < 3) return [];
  const { spherical } = google.maps.geometry;
  const center = centroid(outline);
  const rad = (azimuth * Math.PI) / 180;
  const down = { e: Math.sin(rad), n: Math.cos(rad) }; // nedför taket
  const along = { e: Math.cos(rad), n: -Math.sin(rad) }; // längs takfoten

  const polygon: XY[] = outline.map((p) => {
    const d = spherical.computeDistanceBetween(center, p);
    const h = (spherical.computeHeading(center, p) * Math.PI) / 180;
    const e = d * Math.sin(h);
    const n = d * Math.cos(h);
    return { x: e * along.e + n * along.n, y: e * down.e + n * down.n };
  });
  const toMap = ({ x, y }: XY): Point => {
    const e = x * along.e + y * down.e;
    const n = x * along.n + y * down.n;
    const at = spherical.computeOffset(center, Math.hypot(e, n), (Math.atan2(e, n) * 180) / Math.PI);
    return { lat: at.lat(), lng: at.lng() };
  };

  const w = PANEL_WIDTH_M;
  const h = PANEL_HEIGHT_M * Math.cos((tilt * Math.PI) / 180);
  const stepX = w + PANEL_GAP_M;
  const stepY = h + PANEL_GAP_M;
  const m = EDGE_MARGIN_M;
  const minX = Math.min(...polygon.map((p) => p.x));
  const maxX = Math.max(...polygon.map((p) => p.x));
  const minY = Math.min(...polygon.map((p) => p.y));
  const maxY = Math.max(...polygon.map((p) => p.y));

  // Prova några förskjutningar av rutnätet och behåll den som rymmer flest paneler
  let best: XY[] = [];
  const TRIES = 5;
  for (let ox = 0; ox < TRIES; ox++) {
    for (let oy = 0; oy < TRIES; oy++) {
      const found: XY[] = [];
      for (let y = minY + (oy / TRIES) * stepY; y + h <= maxY; y += stepY) {
        for (let x = minX + (ox / TRIES) * stepX; x + w <= maxX; x += stepX) {
          const fits = [
            { x: x - m, y: y - m },
            { x: x + w + m, y: y - m },
            { x: x + w + m, y: y + h + m },
            { x: x - m, y: y + h + m },
          ].every((corner) => inside(corner, polygon));
          if (fits) found.push({ x, y });
        }
      }
      if (found.length > best.length) best = found;
    }
  }
  return best.map(({ x, y }) =>
    [
      { x, y },
      { x: x + w, y },
      { x: x + w, y: y + h },
      { x, y: y + h },
    ].map(toMap),
  );
}

/**
 * Gissar åt vilket håll taket lutar: vinkelrätt mot ytans längsta kant (takfot/nock),
 * åt det håll som pekar mest mot söder. Användaren kan ändra.
 */
export function guessAzimuth(outline: Point[]): number {
  let longest = 0;
  let heading = 90;
  outline.forEach((a, i) => {
    const b = outline[(i + 1) % outline.length];
    const length = google.maps.geometry.spherical.computeDistanceBetween(a, b);
    if (length > longest) {
      longest = length;
      heading = google.maps.geometry.spherical.computeHeading(a, b);
    }
  });
  const [a, b] = [norm(heading + 90), norm(heading - 90)];
  return Math.abs(a - 180) <= Math.abs(b - 180) ? a : b;
}

/** Färdig ruta runt en klickad punkt, som användaren sedan drar i. Mått i meter, sett uppifrån. */
export function starterOutline(center: Point, azimuth = 180, width = 9, depth = 5): Point[] {
  const { spherical } = google.maps.geometry;
  const corner = (side: number, fall: number): Point => {
    const along = spherical.computeOffset(center, (side * width) / 2, azimuth + 90);
    const at = spherical.computeOffset(along, (fall * depth) / 2, azimuth);
    return { lat: at.lat(), lng: at.lng() };
  };
  return [corner(-1, -1), corner(1, -1), corner(1, 1), corner(-1, 1)];
}

/** Lägger in ett nytt hörn på den kant som ligger närmast punkten, så att ytan behåller sin form. */
export function insertCorner(outline: Point[], p: Point): Point[] {
  const squeeze = Math.cos((p.lat * Math.PI) / 180); // en longitudgrad är kortare än en latitudgrad
  const xy = (q: Point) => ({ x: (q.lng - p.lng) * squeeze, y: q.lat - p.lat });
  let nearest = 0;
  let shortest = Infinity;
  outline.forEach((corner, i) => {
    const a = xy(corner);
    const b = xy(outline[(i + 1) % outline.length]);
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const t = Math.max(0, Math.min(1, -(a.x * dx + a.y * dy) / (dx * dx + dy * dy || 1)));
    const distance = Math.hypot(a.x + t * dx, a.y + t * dy);
    if (distance < shortest) {
      shortest = distance;
      nearest = i;
    }
  });
  return [...outline.slice(0, nearest + 1), p, ...outline.slice(nearest + 1)];
}

/** Vrider hela ytan runt sin mittpunkt. */
export function rotateOutline(outline: Point[], degrees: number): Point[] {
  const { spherical } = google.maps.geometry;
  const center = centroid(outline);
  return outline.map((p) => {
    const at = spherical.computeOffset(
      center,
      spherical.computeDistanceBetween(center, p),
      spherical.computeHeading(center, p) + degrees,
    );
    return { lat: at.lat(), lng: at.lng() };
  });
}

export const centroid = (outline: Point[]): Point => ({
  lat: outline.reduce((s, p) => s + p.lat, 0) / outline.length,
  lng: outline.reduce((s, p) => s + p.lng, 0) / outline.length,
});

export function estimateManual(roof: ManualRoof, panels: number): Estimate {
  const max = roof.panels.length;
  const count = Math.min(max, Math.max(1, panels));
  const kwp = count * PANEL_KW;
  const y = roof.yieldPerKwp;
  const rating: Rating = y.year >= 850 ? 'Bra' : y.year >= 650 ? 'Okej' : 'Svag';
  return {
    panels: count,
    requested: count,
    kwp,
    kwhPerYear: Math.round((kwp * y.year) / 10) * 10,
    months: y.months.map((m) => Math.round(kwp * m)),
    segments: [
      {
        index: 0,
        areaM2: roofArea(roof.groundM2, roof.tilt),
        pitch: roof.tilt,
        azimuth: roof.azimuth,
        direction: 'mot ' + compass(roof.azimuth),
        rating,
        panels: count,
      },
    ],
    minPanels: 1,
    maxPanels: max,
  };
}
