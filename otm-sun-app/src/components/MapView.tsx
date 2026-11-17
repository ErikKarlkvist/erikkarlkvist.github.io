import { useEffect, useRef, useState } from 'react';
import { authFailure, loadGoogleMaps } from '../lib/google';

export interface Point {
  lat: number;
  lng: number;
}

/** Var en högerklicksmeny ska öppnas, och på vad. */
export interface MenuTarget {
  /** Hörnets index om klicket var på ett hörn. */
  corner?: number;
  point: Point;
  x: number;
  y: number;
}

/** Skärmposition för ett kartklick, oavsett om det kom från mus eller pekskärm. */
function target(e: google.maps.MapMouseEvent, corner?: number): MenuTarget | null {
  if (!e.latLng) return null;
  const dom = e.domEvent as MouseEvent | TouchEvent;
  const at = 'changedTouches' in dom ? dom.changedTouches[0] : dom;
  return { corner, point: { lat: e.latLng.lat(), lng: e.latLng.lng() }, x: at.clientX, y: at.clientY };
}

export interface PanelShape {
  path: Point[];
  /** Bortvald av användaren: ritas bara som kontur. */
  off?: boolean;
}

interface Props {
  /** Takytans hörn. */
  outline: Point[];
  /** Ritläge: klick lägger till hörn och hörnen går att dra. Annars visas ytan bara. */
  editable: boolean;
  /** Ändras när kartan ska flyga till en ny plats, t.ex. efter adressök. */
  flyTo?: Point | null;
  /** Riktning som ytan lutar mot; ritas som en pil på ytan. */
  slopeAzimuth?: number | null;
  /** Område som skannas medan analysen pågår: en ram med en svepande linje. */
  scan?: { center: Point; meters: number } | null;
  /** Paneler utlagda på taket. */
  panels: PanelShape[];
  /** Sätts när paneler ska gå att klicka bort och tillbaka. */
  onPanelClick?: (index: number) => void;
  onAddPoint?: (p: Point) => void;
  onMovePoint?: (index: number, p: Point) => void;
  /** Högerklick i ritläget – på ett hörn (även dubbelklick, för pekskärmar), på ytan eller i kartan. */
  onMenu?: (target: MenuTarget) => void;
  /** Sätts när hela ytan ska gå att dra till en ny plats. */
  onMoveAll?: (outline: Point[]) => void;
  /** Anropas när Googles bibliotek är laddade och geometri går att räkna på. */
  onReady?: () => void;
  onError: (message: string) => void;
}

// Eksjö – startläge tills användaren sökt en adress
const START: Point = { lat: 57.6664, lng: 14.9721 };
const ORANGE = '#eb8b1b';

const middle = (points: Point[]): Point => ({
  lat: points.reduce((s, p) => s + p.lat, 0) / points.length,
  lng: points.reduce((s, p) => s + p.lng, 0) / points.length,
});

export function MapView({ outline, editable, flyTo, slopeAzimuth, scan, panels, onPanelClick, onAddPoint, onMovePoint, onMenu, onMoveAll, onReady, onError }: Props) {
  const el = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const shape = useRef<google.maps.Polygon | null>(null);
  const corners = useRef<google.maps.Marker[]>([]);
  // Senaste värden, så att kartans lyssnare (som skapas en gång) alltid ser aktuella props
  const latest = useRef({ editable, onAddPoint, onMovePoint, onMenu, onMoveAll, onPanelClick });
  latest.current = { editable, onAddPoint, onMovePoint, onMenu, onMoveAll, onPanelClick };
  const openMenu = (e: google.maps.MapMouseEvent, corner?: number) => {
    const at = latest.current.editable ? target(e, corner) : null;
    if (at) latest.current.onMenu?.(at);
  };
  const initialOutline = useRef(outline);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await loadGoogleMaps();
      const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;
      await google.maps.importLibrary('geometry');
      await google.maps.importLibrary('marker');
      if (cancelled || !el.current) return;
      const start = initialOutline.current;
      const m = new Map(el.current, {
        center: start.length ? middle(start) : START,
        zoom: start.length ? 20 : 18,
        mapTypeId: 'satellite',
        tilt: 0, // rakt uppifrån, inte 45°-bilder
        disableDefaultUI: true,
        zoomControl: true,
        clickableIcons: false,
        disableDoubleClickZoom: true, // snabba klick ska bli hörn, inte zoom
        gestureHandling: 'greedy',
      });
      m.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (!latest.current.editable || !e.latLng) return;
        latest.current.onAddPoint?.({ lat: e.latLng.lat(), lng: e.latLng.lng() });
      });
      m.addListener('rightclick', (e: google.maps.MapMouseEvent) => openMenu(e));
      if (start.length >= 3) {
        const bounds = new google.maps.LatLngBounds();
        start.forEach((p) => bounds.extend(p));
        m.fitBounds(bounds, 80);
      }
      setMap(m);
      onReady?.();
    })().catch((err: Error) => onError(err.message));
    const rejected = () =>
      onError(
        `Google avvisade API-nyckeln. Kontrollera att ${location.origin}/* finns bland nyckelns tillåtna webbplatser.`,
      );
    authFailure.addEventListener('fail', rejected);
    return () => {
      cancelled = true;
      authFailure.removeEventListener('fail', rejected);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    map?.setOptions({ draggableCursor: editable ? 'crosshair' : undefined });
  }, [map, editable]);

  useEffect(() => {
    if (!map || !flyTo) return;
    map.setCenter(flyTo);
    map.setZoom(20);
  }, [map, flyTo]);

  // Takytan och dess hörn. Formerna lever kvar mellan uppdateringar, annars avbryts ett pågående drag.
  useEffect(() => {
    if (!map) return;
    if (!shape.current) {
      const polygon = new google.maps.Polygon({
        map,
        strokeColor: ORANGE,
        strokeWeight: 3,
        fillColor: ORANGE,
        fillOpacity: 0.3,
        zIndex: 1,
      });
      const dragged = () =>
        latest.current.onMoveAll?.(
          polygon
            .getPath()
            .getArray()
            .map((at) => ({ lat: at.lat(), lng: at.lng() })),
        );
      polygon.addListener('drag', dragged);
      polygon.addListener('dragend', dragged);
      polygon.addListener('rightclick', (e: google.maps.MapMouseEvent) => openMenu(e));
      shape.current = polygon;
    }
    const movable = editable && !!onMoveAll;
    shape.current.setOptions({ draggable: movable, clickable: movable });
    // Skriv inte över ytan med samma värden – det skulle avbryta ett pågående drag
    const path = shape.current.getPath().getArray();
    const same = path.length === outline.length && path.every((at, i) => at.lat() === outline[i].lat && at.lng() === outline[i].lng);
    if (!same) shape.current.setPath(outline);

    while (corners.current.length > outline.length) corners.current.pop()!.setMap(null);
    while (corners.current.length < outline.length) {
      const index = corners.current.length;
      const marker = new google.maps.Marker({
        map,
        position: outline[index],
        cursor: 'move',
        zIndex: 4,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 7,
          fillColor: '#ffffff',
          fillOpacity: 1,
          strokeColor: ORANGE,
          strokeWeight: 3,
        },
      });
      const moved = (e: google.maps.MapMouseEvent) => {
        if (e.latLng) latest.current.onMovePoint?.(index, { lat: e.latLng.lat(), lng: e.latLng.lng() });
      };
      marker.addListener('drag', moved);
      marker.addListener('dragend', moved);
      const menu = (e: google.maps.MapMouseEvent) => openMenu(e, index);
      marker.addListener('rightclick', menu);
      marker.addListener('dblclick', menu); // pekskärmar har inget högerklick
      corners.current.push(marker);
    }
    corners.current.forEach((marker, i) => {
      const at = marker.getPosition();
      // Rör inte ett hörn som redan står rätt – det är det som dras just nu
      if (!at || at.lat() !== outline[i].lat || at.lng() !== outline[i].lng) marker.setPosition(outline[i]);
      marker.setDraggable(editable);
      marker.setVisible(editable);
    });
  }, [map, outline, editable, !!onMoveAll]);

  useEffect(
    () => () => {
      shape.current?.setMap(null);
      corners.current.forEach((marker) => marker.setMap(null));
    },
    [],
  );

  // Paneler på taket
  const panelsClickable = !!onPanelClick;
  useEffect(() => {
    if (!map || panels.length === 0) return;
    const shapes = panels.map((panel, index) => {
      const polygon = new google.maps.Polygon({
        map,
        clickable: panelsClickable,
        paths: panel.path,
        fillColor: '#14213d',
        fillOpacity: panel.off ? 0.08 : 0.9,
        strokeColor: ORANGE,
        strokeOpacity: panel.off ? 0.7 : 1,
        strokeWeight: 1,
        zIndex: 2,
      });
      if (panelsClickable) {
        polygon.addListener('click', () => latest.current.editable && latest.current.onPanelClick?.(index));
      }
      return polygon;
    });
    return () => shapes.forEach((polygon) => polygon.setMap(null));
  }, [map, panels, panelsClickable]);

  // Skanner: en ram runt området och en linje som sveper upp och ned tills analysen är klar
  useEffect(() => {
    if (!map || !scan) return;
    const { spherical } = google.maps.geometry;
    const half = scan.meters / 2;
    const north = spherical.computeOffset(scan.center, half, 0).lat();
    const south = spherical.computeOffset(scan.center, half, 180).lat();
    const east = spherical.computeOffset(scan.center, half, 90).lng();
    const west = spherical.computeOffset(scan.center, half, 270).lng();
    const frame = new google.maps.Rectangle({
      map,
      clickable: false,
      bounds: { north, south, east, west },
      strokeColor: '#ffffff',
      strokeWeight: 2,
      fillColor: ORANGE,
      fillOpacity: 0.1,
      zIndex: 5,
    });
    const line = new google.maps.Polyline({ map, clickable: false, strokeColor: ORANGE, strokeWeight: 4, zIndex: 6 });
    const started = performance.now();
    let frameId = 0;
    const sweep = (now: number) => {
      const phase = ((now - started) / 1100) % 2;
      const eased = (1 - Math.cos((phase < 1 ? phase : 2 - phase) * Math.PI)) / 2;
      const lat = north + (south - north) * eased;
      line.setPath([
        { lat, lng: west },
        { lat, lng: east },
      ]);
      frameId = requestAnimationFrame(sweep);
    };
    frameId = requestAnimationFrame(sweep);
    return () => {
      cancelAnimationFrame(frameId);
      frame.setMap(null);
      line.setMap(null);
    };
  }, [map, scan]);

  // Pil som visar åt vilket håll ytan lutar
  useEffect(() => {
    if (!map || slopeAzimuth == null || outline.length < 3) return;
    const { spherical } = google.maps.geometry;
    const center = middle(outline);
    const length = Math.max(2, Math.sqrt(spherical.computeArea(outline)) / 3);
    const arrow = new google.maps.Polyline({
      map,
      clickable: false,
      path: [
        spherical.computeOffset(center, length, slopeAzimuth + 180),
        spherical.computeOffset(center, length, slopeAzimuth),
      ],
      strokeColor: '#ffffff',
      strokeWeight: 3,
      zIndex: 3,
      icons: [
        {
          icon: { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW, scale: 4, fillColor: '#ffffff', fillOpacity: 1 },
          offset: '100%',
        },
      ],
    });
    return () => arrow.setMap(null);
  }, [map, outline, slopeAzimuth]);

  // Webbläsarens egen högerklicksmeny ska inte dyka upp över kartan
  return <div ref={el} className="map" onContextMenu={(e) => e.preventDefault()} />;
}
