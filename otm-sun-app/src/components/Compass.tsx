import { useRef, type KeyboardEvent, type PointerEvent } from 'react';

interface Props {
  /** Väderstreck i grader: 0 = norr, 90 = öster, 180 = söder, 270 = väster. */
  value: number;
  onChange: (degrees: number) => void;
}

const STEP = 5;
const norm = (deg: number) => ((deg % 360) + 360) % 360;
const LABELS = [
  { text: 'N', deg: 0 },
  { text: 'O', deg: 90 },
  { text: 'S', deg: 180 },
  { text: 'V', deg: 270 },
];

/** Kompass som vrids som ett hjul: dra runt pilen, eller använd piltangenterna. */
export function Compass({ value, onChange }: Props) {
  const svg = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);

  function turnTo(e: PointerEvent) {
    const box = svg.current!.getBoundingClientRect();
    const dx = e.clientX - (box.left + box.width / 2);
    const dy = e.clientY - (box.top + box.height / 2);
    if (Math.hypot(dx, dy) < 8) return; // mitt i hjulet finns ingen riktning
    const deg = (Math.atan2(dx, -dy) * 180) / Math.PI;
    onChange(norm(Math.round(deg / STEP) * STEP));
  }

  function onKey(e: KeyboardEvent) {
    const delta =
      e.key === 'ArrowRight' || e.key === 'ArrowUp' ? STEP : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -STEP : 0;
    if (!delta) return;
    e.preventDefault();
    onChange(norm(Math.round(value / STEP) * STEP + delta));
  }

  return (
    <svg
      ref={svg}
      className="compass-wheel"
      viewBox="-100 -100 200 200"
      role="slider"
      tabIndex={0}
      aria-label="Väderstreck som takytan lutar mot"
      aria-valuemin={0}
      aria-valuemax={355}
      aria-valuenow={Math.round(value)}
      onKeyDown={onKey}
      onPointerDown={(e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        turnTo(e);
      }}
      onPointerMove={(e) => dragging.current && turnTo(e)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <circle r="92" className="rim" />
      {Array.from({ length: 24 }, (_, i) => (
        <line key={i} y1={-92} y2={i % 6 === 0 ? -78 : i % 3 === 0 ? -82 : -86} transform={`rotate(${i * 15})`} className="tick" />
      ))}
      {LABELS.map((l) => (
        <text
          key={l.text}
          x={62 * Math.sin((l.deg * Math.PI) / 180)}
          y={-62 * Math.cos((l.deg * Math.PI) / 180)}
          className="label"
        >
          {l.text}
        </text>
      ))}
      <g transform={`rotate(${value})`}>
        <line y1={14} y2={-70} className="needle" />
        <path d="M0 -92 L-11 -66 L11 -66 Z" className="head" />
      </g>
      <circle r="5" className="hub" />
    </svg>
  );
}
