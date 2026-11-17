import { useEffect, useRef, type ReactNode } from 'react';

const STEPS = ['Välj tak', 'Justera', 'Analys'];

interface Props {
  step: number;
  /** Ändras när panelens innehåll byts, så att den börjar om från toppen. */
  viewKey: string;
  children: ReactNode;
  map: ReactNode;
}

/** Sidans ram: panel till vänster, karta till höger med stegraden svävande överst. */
export function Shell({ step, viewKey, children, map }: Props) {
  const aside = useRef<HTMLElement>(null);
  // På mobil scrollar hela panelen, på desktop bara vyn
  useEffect(() => {
    aside.current?.scrollTo(0, 0);
    aside.current?.querySelector('.view')?.scrollTo(0, 0);
  }, [viewKey]);

  const steps = (place: 'on-map' | 'in-panel') => (
    <ol className={`steps ${place}`}>
      {STEPS.map((label, i) => (
        <li key={label} className={i < step ? 'done' : i === step ? 'on' : ''}>
          <b>{i + 1}</b>
          {label}
        </li>
      ))}
    </ol>
  );

  // Stegen visas på ett ställe i taget: över kartan på desktop, överst i panelen på mobil (styrs i CSS)
  return (
    <>
      <aside ref={aside}>
        <section className="view">
          {steps('in-panel')}
          {children}
        </section>
      </aside>
      <main>
        {map}
        {steps('on-map')}
      </main>
    </>
  );
}
