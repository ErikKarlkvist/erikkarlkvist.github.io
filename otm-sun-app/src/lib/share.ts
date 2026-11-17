import type { Point } from '../components/MapView';

/**
 * Det som behövs för att återskapa en analys, sparat som query-parametrar i adressen.
 * Den som öppnar länken får samma tak och samma analys.
 */
export type Shared =
  | { kind: 'drawn'; outline: Point[]; tilt: number; azimuth: number; address: string; panels?: number }
  | { kind: 'google'; point: Point; address: string; panels?: number; excluded: number[] };

const coords = (p: Point) => `${p.lat.toFixed(6)},${p.lng.toFixed(6)}`;
const parsePoint = (pair: string): Point | null => {
  const [lat, lng] = pair.split(',').map(Number);
  return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
};
const whole = (value: string | null) => (value !== null && /^\d+$/.test(value) ? Number(value) : undefined);

export function encodeShare(share: Shared): string {
  const params = new URLSearchParams();
  if (share.kind === 'drawn') {
    params.set('p', share.outline.map(coords).join(';')); // ritade hörn
    params.set('t', String(Math.round(share.tilt)));
    params.set('a', String(Math.round(share.azimuth)));
  } else {
    params.set('g', coords(share.point)); // punkten som Googles analys hämtas för
    if (share.excluded.length) params.set('x', [...share.excluded].sort((a, b) => a - b).join('.'));
  }
  if (share.panels) params.set('n', String(share.panels));
  if (share.address) params.set('adr', share.address);
  return params.toString();
}

export function decodeShare(search: string): Shared | null {
  const params = new URLSearchParams(search);
  const address = params.get('adr') ?? '';
  const panels = whole(params.get('n'));

  const point = parsePoint(params.get('g') ?? '');
  if (point) {
    const excluded = (params.get('x') ?? '').split('.').map(Number).filter(Number.isInteger);
    return { kind: 'google', point, address, panels, excluded: params.get('x') ? excluded : [] };
  }

  const outline = (params.get('p') ?? '')
    .split(';')
    .map(parsePoint)
    .filter((p): p is Point => p !== null);
  const tilt = Number(params.get('t'));
  const azimuth = Number(params.get('a'));
  if (outline.length < 3 || !params.has('t') || !Number.isFinite(tilt) || !Number.isFinite(azimuth)) return null;
  return { kind: 'drawn', outline, tilt, azimuth, address, panels };
}
