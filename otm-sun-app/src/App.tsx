import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AddressSearch } from './components/AddressSearch';
import { Compass } from './components/Compass';
import { ContextMenu, type MenuItem } from './components/ContextMenu';
import { MapView, type MenuTarget, type PanelShape, type Point } from './components/MapView';
import { QuoteView } from './components/QuoteView';
import { ResultView } from './components/ResultView';
import { Shell } from './components/Shell';
import { compass, estimate, sensiblePanelCount, sv } from './lib/estimate';
import { GOOGLE_KEY } from './lib/google';
import {
  centroid,
  estimateManual,
  groundArea,
  guessAzimuth,
  insertCorner,
  layoutPanels,
  roofArea,
  rotateOutline,
  starterOutline,
  TILTS,
  type ManualRoof,
} from './lib/manual';
import { fetchYield } from './lib/pvgis';
import { decodeShare, encodeShare } from './lib/share';
import {
  demoInsights,
  fetchBuildingInsights,
  mainSegmentOutline,
  NoSolarDataError,
  panelOutlines,
  type BuildingInsights,
} from './lib/solar';

/** Vad sidopanelen visar i stället för inmatningen när en analys är öppen. */
type ModalView = 'closed' | 'result' | 'quote' | 'sent';

/** Så länge visas skannern minst, så att animationen hinner synas även när svaret kommer direkt. */
const MIN_SCAN_MS = 1400;
const pause = (ms: number) => new Promise((done) => setTimeout(done, ms));

const NO_OUTLINE: Point[] = [];

/** Kopierar analysens länk. Visar en bock en kort stund som kvitto. */
function ShareButton() {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Urklipp kan vara spärrat (t.ex. utan https): visa länken så att den går att kopiera för hand
      window.prompt('Kopiera länken:', location.href);
    }
  }
  return (
    <button className="icon wide" onClick={() => void copy()} title="Kopiera en länk till den här analysen">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        {copied ? (
          <path d="M20 6 9 17l-5-5" />
        ) : (
          <>
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </>
        )}
      </svg>
      {copied ? 'Kopierad' : 'Dela'}
    </button>
  );
}

/** Rubrik med knappar till höger: dela (i analysen) och börja om. */
function Title({ children, onRestart, share }: { children: string; onRestart: () => void; share?: boolean }) {
  return (
    <div className="title">
      <h1>{children}</h1>
      {share && <ShareButton />}
      <button className="icon" onClick={onRestart} aria-label="Börja om med ett annat tak" title="Börja om">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
      </button>
    </div>
  );
}

/**
 * Flödet: ett klick på taket hämtar Googles färdiga analys. Finns ingen (t.ex. i Vetlanda och Eksjö)
 * läggs en ruta på taket som användaren justerar, och produktionen räknas med PVGIS.
 */
export function App() {
  const demo = !GOOGLE_KEY;
  // En delad länk bär taket i sina query-parametrar och öppnar samma analys igen
  const shared = useRef(decodeShare(location.search)).current;
  const sharedDrawing = shared?.kind === 'drawn' ? shared : null;

  const [clicked, setClicked] = useState<Point | null>(null);
  const [address, setAddress] = useState(shared?.address ?? '');
  const [flyTo, setFlyTo] = useState<Point | null>(shared?.kind === 'google' ? shared.point : null);
  const [ready, setReady] = useState(false); // Googles geometri är laddad
  const [mapError, setMapError] = useState('');

  /* Googles analys */
  const [insights, setInsights] = useState<BuildingInsights | null>(null);
  // Paneler i Googles förslag som användaren klickat bort i kartan
  const [excluded, setExcluded] = useState<ReadonlySet<number>>(new Set());

  /* Egen ritning */
  const [outline, setOutline] = useState<Point[]>(sharedDrawing?.outline ?? []);
  const [tilt, setTilt] = useState(sharedDrawing?.tilt ?? 27);
  const [azimuthChoice, setAzimuthChoice] = useState<number | null>(sharedDrawing?.azimuth ?? null);
  const [untouched, setUntouched] = useState(false); // rutan är ännu inte ändrad för hand
  const [notice, setNotice] = useState('');
  const [roof, setRoof] = useState<ManualRoof | null>(null);

  const [menu, setMenu] = useState<MenuTarget | null>(null);
  // Området som skannas i kartan medan en analys pågår
  const [scan, setScan] = useState<{ center: Point; meters: number } | null>(null);

  /* Analysrutan */
  const [modal, setModal] = useState<ModalView>('closed');
  const [panelCount, setPanelCount] = useState(0);
  const [price, setPrice] = useState(1.5);
  const [error, setError] = useState('');

  const drawing = outline.length > 0;
  const drawn = ready && outline.length >= 3;
  const ground = useMemo(() => (drawn ? groundArea(outline) : 0), [drawn, outline]);
  const azimuth = azimuthChoice ?? (drawn ? guessAzimuth(outline) : 180);
  // Panelplaceringen räknas om direkt när ritning, lutning eller väderstreck ändras
  const layout = useMemo(() => (drawn ? layoutPanels(outline, tilt, azimuth) : []), [drawn, outline, tilt, azimuth]);
  const googlePanels = useMemo(() => (insights && ready ? panelOutlines(insights) : []), [insights, ready]);

  const demoResult = useMemo(() => {
    if (!demo) return null;
    const example = demoInsights();
    return estimate(example, panelCount || example.solarPotential.maxArrayPanelsCount);
  }, [demo, panelCount]);
  const result = insights ? estimate(insights, panelCount, excluded) : roof ? estimateManual(roof, panelCount) : demoResult;

  // Efter en analys visas bara så många paneler som reglaget anger
  const shownCount = insights || roof ? (result?.requested ?? 0) : layout.length;
  const shownPanels = useMemo(
    (): PanelShape[] =>
      (insights ? googlePanels : layout)
        .slice(0, shownCount)
        .map((path, i) => ({ path, off: !!insights && excluded.has(i) })),
    [insights, googlePanels, layout, shownCount, excluded],
  );

  function togglePanel(index: number) {
    const next = new Set(excluded);
    if (!next.delete(index)) next.add(index);
    setExcluded(next);
  }

  /** Varje ändring av ritningen gör den gamla beräkningen inaktuell. */
  function edit(change: () => void) {
    change();
    setRoof(null);
    setError('');
  }

  /** Öppnar ritläget med en ruta på taket – Googles takyta om den finns, annars en standardruta. */
  function startDrawing(at: Point, why: string, seed?: { outline: Point[]; tilt: number; azimuth: number } | null) {
    setInsights(null);
    setNotice(why);
    edit(() => {
      setOutline(seed?.outline ?? starterOutline(at));
      setAzimuthChoice(seed?.azimuth ?? null);
      if (seed) setTilt(seed.tilt);
      setUntouched(true);
    });
    setFlyTo({ ...at }); // zooma in så att hörnen går att träffa
    setModal('closed');
  }

  /** Ett klick på ett tak: försök med Googles färdiga analys, annars får användaren rita. */
  async function analyse(at: Point, restore?: { panels?: number; excluded: number[] }) {
    setClicked(at);
    setInsights(null);
    setExcluded(new Set());
    setModal('closed');
    setScan({ center: at, meters: 30 });
    const shown = pause(MIN_SCAN_MS);
    try {
      const found = await fetchBuildingInsights(at.lat, at.lng);
      await shown;
      setInsights(found);
      setPanelCount(restore?.panels ?? sensiblePanelCount(found));
      setExcluded(new Set(restore?.excluded ?? []));
      setModal('result');
    } catch (err) {
      await shown;
      startDrawing(
        at,
        err instanceof NoSolarDataError
          ? 'Vi har ingen färdig takanalys för den här adressen. Vi har lagt en ruta på taket – justera den så räknar vi ändå.'
          : 'Den färdiga takanalysen gick inte att hämta just nu. Vi har lagt en ruta på taket – justera den så räknar vi ändå.',
      );
    } finally {
      setScan(null);
    }
  }

  async function calculate(restorePanels?: number) {
    setError('');
    const center = centroid(outline);
    setScan({ center, meters: Math.max(16, Math.sqrt(ground) * 2) });
    const shown = pause(MIN_SCAN_MS);
    try {
      const yieldPerKwp = await fetchYield(center.lat, center.lng, tilt, azimuth);
      await shown;
      setRoof({ outline, groundM2: ground, tilt, azimuth, yieldPerKwp, panels: layout });
      setPanelCount(restorePanels ?? layout.length);
      setModal('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Något gick fel.');
    } finally {
      setScan(null);
    }
  }

  // Öppnad via delad länk: återskapa analysen när kartan är redo
  const opened = useRef(false);
  useEffect(() => {
    if (!shared || opened.current || !ready) return;
    if (shared.kind === 'google') {
      opened.current = true;
      void analyse(shared.point, shared);
    } else if (drawn && layout.length > 0) {
      opened.current = true;
      void calculate(shared.panels);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, drawn, layout]);

  // Adressfältet följer analysen, så att sidan alltid går att dela eller ladda om
  const shareQuery = roof
    ? encodeShare({ kind: 'drawn', outline: roof.outline, tilt: roof.tilt, azimuth: roof.azimuth, address, panels: panelCount })
    : insights && clicked
      ? encodeShare({ kind: 'google', point: clicked, address, panels: panelCount, excluded: [...excluded] })
      : '';
  useEffect(() => {
    if (shared && !opened.current) return; // en delad länk som ännu inte hunnit öppnas ska stå kvar
    history.replaceState(null, '', shareQuery ? `?${shareQuery}` : location.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shareQuery]);

  const close = useCallback(() => setModal('closed'), []);

  function click(p: Point) {
    if (drawing) {
      // I ritläget blir ett klick ett nytt hörn
      edit(() => {
        setOutline(insertCorner(outline, p));
        setUntouched(false);
      });
    } else {
      void analyse(p);
    }
  }

  function removeCorner(index: number) {
    if (outline.length <= 3) return; // en yta behöver minst tre hörn
    edit(() => {
      setOutline(outline.filter((_, i) => i !== index));
      setUntouched(false);
    });
  }

  /** Nytt hörn mitt emellan ett hörn och nästa. */
  function addCornerAfter(index: number) {
    const a = outline[index];
    const b = outline[(index + 1) % outline.length];
    edit(() => {
      setOutline([
        ...outline.slice(0, index + 1),
        { lat: (a.lat + b.lat) / 2, lng: (a.lng + b.lng) / 2 },
        ...outline.slice(index + 1),
      ]);
      setUntouched(false);
    });
  }

  /** Flyttar hela ytan så att dess mitt hamnar på punkten. */
  function moveTo(p: Point) {
    const from = centroid(outline);
    edit(() => setOutline(outline.map((q) => ({ lat: q.lat + p.lat - from.lat, lng: q.lng + p.lng - from.lng }))));
  }

  /** Innehållet i högerklicksmenyn beror på vad man klickade på. */
  function menuItems(at: MenuTarget): MenuItem[] {
    if (at.corner !== undefined) {
      const corner = at.corner;
      return [
        { label: 'Ta bort hörn', onSelect: () => removeCorner(corner), disabled: outline.length <= 3 },
        { label: 'Lägg till hörn efter', onSelect: () => addCornerAfter(corner) },
      ];
    }
    return [
      { label: 'Lägg till hörn här', onSelect: () => click(at.point) },
      { label: 'Flytta ytan hit', onSelect: () => moveTo(at.point) },
      { label: 'Börja om med ett annat tak', onSelect: restart },
    ];
  }

  function turn(degrees: number) {
    edit(() => {
      // En orörd ruta vrids med kompassen; en egen ritning behåller sin form
      if (untouched) setOutline(rotateOutline(outline, degrees - azimuth));
      setAzimuthChoice(degrees);
    });
  }

  /** Lämnar Googles analys och öppnar ritläget med Googles bästa takyta som utgångspunkt. */
  function drawInstead() {
    if (!clicked || !insights) return;
    startDrawing(
      clicked,
      'Rutan utgår från takytan med flest paneler, med uppmätt lutning och riktning. Justera den som du vill.',
      mainSegmentOutline(insights),
    );
  }

  function restart() {
    setModal('closed');
    edit(() => {
      setOutline([]);
      setAzimuthChoice(null);
      setUntouched(false);
    });
    setInsights(null);
    setClicked(null);
    setNotice('');
  }

  const step = modal !== 'closed' || insights ? 2 : drawing ? 1 : 0;
  // Kort hjälp i kartans hörn: vad som går att göra just nu, som [handling, resultat]
  const controls: [string, string][] = scan
    ? [['Analyserar', 'taket …']]
    : drawing
      ? [
          ['Dra', 'flytta hörn eller hela ytan'],
          ['Klick', 'nytt hörn'],
          ['Högerklick', 'fler val'],
        ]
      : insights
        ? [
            ['Klick på panel', 'ta bort eller lägg tillbaka'],
            ['Klick på annat tak', 'ny analys'],
          ]
        : [['Klick', 'välj ditt tak']];

  return (
    <>
      <Shell
        step={step}
        viewKey={modal !== 'closed' ? modal : drawing ? 'draw' : insights ? 'google' : 'pick'}
        map={
          demo || mapError ? (
            <div className="map placeholder">
              <p>{mapError || 'Kartan visas när en Google-nyckel är inlagd.'}</p>
            </div>
          ) : (
            <>
              <MapView
                outline={insights ? NO_OUTLINE : outline}
                // Googles paneler går att klicka bort även medan analysen visas; ritningen ändras först när den stängts
                editable={!scan && (modal === 'closed' || !!insights)}
                scan={scan}
                flyTo={flyTo}
                slopeAzimuth={drawn && !roof ? azimuth : null}
                panels={shownPanels}
                onPanelClick={insights ? togglePanel : undefined}
                onAddPoint={click}
                onMovePoint={(i, p) =>
                  edit(() => {
                    setOutline((points) => points.map((old, n) => (n === i ? p : old)));
                    setUntouched(false);
                  })
                }
                onMenu={(at) => drawing && setMenu(at)}
                onMoveAll={(points) => edit(() => setOutline(points))}
                onReady={() => setReady(true)}
                onError={setMapError}
              />
              <ul className="controls">
                {controls.map(([action, effect]) => (
                  <li key={action}>
                    <b>{action}</b> {effect}
                  </li>
                ))}
              </ul>
            </>
          )
        }
      >
        {modal !== 'closed' ? (
          <>
            {modal === 'result' && result && (
              <>
                <Title onRestart={restart} share>
                  Analys
                </Title>
                {insights ? (
                  <button className="link top" onClick={drawInstead}>
                    Rita takytan manuellt i stället
                  </button>
                ) : (
                  roof && (
                    <button className="link top" onClick={close}>
                      Ändra ritningen
                    </button>
                  )
                )}
                <ResultView
                estimate={result}
                source={insights ? 'google' : roof ? 'drawn' : 'demo'}
                approximate={roof?.yieldPerKwp.approximate}
                price={price}
                onPrice={setPrice}
                onPanels={setPanelCount}
                onClose={close}
                onQuote={() => setModal('quote')}
                />
              </>
            )}
            {modal === 'quote' && result && (
              <>
                <QuoteView
                  estimate={result}
                  source={insights ? 'google' : roof ? 'drawn' : 'demo'}
                  address={address}
                  link={location.href}
                  onBack={() => setModal('result')}
                  onSent={() => setModal('sent')}
                />
              </>
            )}
            {modal === 'sent' && (
              <>
                <h1>Mejlet är förberett</h1>
                <p>
                  Ditt mejlprogram ska ha öppnats med förfrågan ifylld. Skicka mejlet därifrån, så hör OTM av sig med
                  en offert.
                </p>
                <p className="note">
                  Hände inget? Då saknas ett mejlprogram på den här enheten. Kopiera länken till analysen med
                  Dela-knappen och skicka den själv.
                </p>
                <button className="btn block" onClick={() => setModal('result')}>
                  Tillbaka till analysen
                </button>
                <p />
                <button className="btn block" onClick={close}>
                  Stäng
                </button>
              </>
            )}
          </>
        ) : demo ? (
          <>
            <h1>Hur mycket sol får ditt tak?</h1>
            <div className="hint">
              <span>!</span>
              <div>
                <b>Ingen Google-nyckel inlagd</b>
                Kopiera <code>.env.example</code> till <code>.env.local</code>, fyll i{' '}
                <code>VITE_GOOGLE_MAPS_API_KEY</code> och starta om.
              </div>
            </div>
            <p />
            <button className="btn primary block" onClick={() => setModal('result')}>
              Visa med exempeldata
            </button>
          </>
        ) : drawing ? (
          <>
            <Title onRestart={restart}>Justera takytan</Title>
            {notice && (
              <div className="hint">
                <span>!</span>
                <div>{notice}</div>
              </div>
            )}
            <p className={notice ? 'spaced' : ''}>
              Dra i hörnen så att rutan täcker takytan där panelerna ska sitta. Hela rutan går att dra till en annan
              plats. Klicka i kartan för ett nytt hörn, och högerklicka för fler val.
            </p>

            {drawn && (
              <>
                <dl className="meta">
                  <dt>Takyta</dt>
                  <dd>{sv(roofArea(ground, tilt))} m²</dd>
                  <dt>Plats för</dt>
                  <dd>{layout.length} paneler</dd>
                </dl>

                <h2>Hur brant är taket?</h2>
                <div className="seg">
                  {TILTS.map((t) => (
                    <button key={t.deg} className={tilt === t.deg ? 'on' : ''} onClick={() => edit(() => setTilt(t.deg))}>
                      {t.label}
                      <small>ca {t.deg}°</small>
                    </button>
                  ))}
                </div>

                {!TILTS.some((t) => t.deg === tilt) && (
                  <p className="note">Uppmätt lutning {tilt}° används. Välj ovan för att ändra.</p>
                )}

                <h2>Åt vilket håll lutar ytan?</h2>
                <Compass value={azimuth} onChange={turn} />
                <p className="compass-value">
                  {compass(azimuth)} · {Math.round(azimuth)}°
                </p>
                <p className="note">
                  {untouched
                    ? 'Dra i pilen så att den pekar nedför taket. Rutan i kartan vrids med.'
                    : 'Dra i pilen så att den pekar nedför taket, som pilen i kartan.'}
                </p>

                {error && <p className="error">{error}</p>}
                {layout.length === 0 && <p className="error">Ytan är för liten för en panel.</p>}
                <button
                  className="btn primary block"
                  disabled={layout.length === 0 || !!scan}
                  onClick={() => (roof ? setModal('result') : void calculate())}
                >
                  {roof ? 'Visa analysen' : 'Beräkna'}
                </button>
              </>
            )}
          </>
        ) : insights ? (
          <>
            <Title onRestart={restart}>Analysen är klar</Title>
            <p>
              Panelerna i kartan visar den föreslagna placeringen på hela taket. Klicka på en panel för att ta bort
              den, och en gång till för att lägga tillbaka den.
            </p>
            {excluded.size > 0 && (
              <p className="note">
                {excluded.size} {excluded.size === 1 ? 'panel' : 'paneler'} bortvalda.{' '}
                <button className="link inline" onClick={() => setExcluded(new Set())}>
                  Återställ
                </button>
              </p>
            )}
            <button className="btn primary block" onClick={() => setModal('result')}>
              Visa analysen
            </button>
            <button
              className="link"
              onClick={drawInstead}
            >
              Justera takytan själv i stället
            </button>
          </>
        ) : (
          <>
            <h1>Hur mycket sol får ditt tak?</h1>
            <p>Sök upp din adress och klicka på taket i kartan, så räknar vi ut hur mycket el det kan ge.</p>
            <AddressSearch
              onLocate={(point, found) => {
                setFlyTo(point);
                setAddress(found);
              }}
            />
            <div className="hint">
              <span>☝️</span>
              <div>
                <b>Klicka på ditt tak i kartan</b>
                Analysen startar direkt. Zooma in så att du träffar rätt byggnad.
              </div>
            </div>
          </>
        )}
      </Shell>

      {menu && <ContextMenu x={menu.x} y={menu.y} items={menuItems(menu)} onClose={() => setMenu(null)} />}

    </>
  );
}
