import { useEffect } from 'react';

export interface MenuItem {
  label: string;
  onSelect: () => void;
  disabled?: boolean;
}

interface Props {
  /** Skärmposition där menyn öppnades. */
  x: number;
  y: number;
  items: MenuItem[];
  onClose: () => void;
}

const WIDTH = 220;
const ROW = 38;

/** Högerklicksmeny. Stängs vid val, klick utanför eller Esc. */
export function ContextMenu({ x, y, items, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onClose);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onClose);
    };
  }, [onClose]);

  // Håll menyn inom fönstret även nära kanterna
  const left = Math.max(8, Math.min(x, window.innerWidth - WIDTH - 8));
  const top = Math.max(8, Math.min(y, window.innerHeight - items.length * ROW - 16));

  return (
    <div
      className="menu-layer"
      onPointerDown={onClose}
      onContextMenu={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <ul className="menu" role="menu" style={{ left, top, width: WIDTH }} onPointerDown={(e) => e.stopPropagation()}>
        {items.map((item) => (
          <li key={item.label} role="none">
            <button
              role="menuitem"
              disabled={item.disabled}
              onClick={() => {
                item.onSelect();
                onClose();
              }}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
