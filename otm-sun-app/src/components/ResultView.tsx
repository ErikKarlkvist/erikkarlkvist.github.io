import { RATING_COLOR, sv, type Estimate } from '../lib/estimate';
import { TABLE_PLACE } from '../lib/pvgis';

interface Props {
  estimate: Estimate;
  /** Varifrån soldatan kommer: egen ritning + PVGIS, Googles Solar API, eller exempeldata i demoläget. */
  source: 'drawn' | 'google' | 'demo';
  /** Solvärdena är förberäknade för regionen, inte hämtade för just den här platsen. */
  approximate?: boolean;
  price: number;
  onPrice: (kr: number) => void;
  onPanels: (count: number) => void;
  onClose: () => void;
  onQuote: () => void;
}

const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

export function ResultView({ estimate: e, source, approximate, price, onPrice, onPanels, onClose, onQuote }: Props) {
  const max = Math.max(...e.months);
  const roofs = e.segments.filter((s) => s.panels > 0 || s.areaM2 >= 8).slice(0, 5);
  return (
    <div className="result">
      <div>
        <div className="hero">
          <label>Uppskattad årsproduktion</label>
          <strong>
            {sv(e.kwhPerYear)} <span>kWh/år</span>
          </strong>
        </div>
        <div className="stats">
          <div>
            <b>{e.panels}</b>
            <span>paneler</span>
          </div>
          <div>
            <b>{sv(e.kwp, 1)}</b>
            <span>kWp effekt</span>
          </div>
          <div>
            <b>{e.kwp ? sv(e.kwhPerYear / e.kwp) : '–'}</b>
            <span>kWh per kWp</span>
          </div>
        </div>

        {e.maxPanels > e.minPanels && (
          <>
            <h2>Antal paneler</h2>
            <div className="slider">
              <span>{e.minPanels}</span>
              <input
                type="range"
                min={e.minPanels}
                max={e.maxPanels}
                value={e.requested}
                onChange={(ev) => onPanels(+ev.target.value)}
                aria-label="Antal paneler"
              />
              <span>{e.maxPanels}</span>
            </div>
            {source !== 'demo' && (
              <p className="note">
                {source === 'drawn'
                  ? 'Max är så många som får plats på den ritade ytan med 30 cm marginal mot kanterna.'
                  : 'De bästa lägena fylls först, så varje extra panel ger lite mindre.'}
              </p>
            )}
          </>
        )}

        <h2>Takytor</h2>
        {roofs.map((s) => (
          <div className="face" key={s.index}>
            <i style={{ background: RATING_COLOR[s.rating] }} />
            <div>
              Takyta {s.direction}
              <small>
                {sv(s.areaM2)} m² · {sv(s.pitch)}° lutning · {s.panels} paneler
              </small>
            </div>
            <em>{s.rating}</em>
          </div>
        ))}
      </div>

      <div>
        <h2>Produktion per månad</h2>
        <div className="bars">
          {e.months.map((v, i) => (
            <div key={i} style={{ height: `${(v / max) * 100}%` }} data-v={`${sv(v)} kWh`} />
          ))}
        </div>
        <div className="months">
          {MONTHS.map((m, i) => (
            <span key={i}>{m}</span>
          ))}
        </div>

        <h2>Värde</h2>
        <div className="slider">
          <span>Elpris</span>
          <input
            type="range"
            min={0.5}
            max={3}
            step={0.1}
            value={price}
            onChange={(ev) => onPrice(+ev.target.value)}
            aria-label="Elpris"
          />
          <output>{sv(price, 2)} kr/kWh</output>
        </div>
        <div className="saving">
          <span>Värde av elen</span>
          <b>{sv(Math.round((e.kwhPerYear * price) / 100) * 100)} kr/år</b>
        </div>

        <p className="note">
          {source === 'drawn'
            ? `Uppskattning från din ritade takyta och EU:s soldatabas PVGIS${approximate ? `, med förberäknade värden för ${TABLE_PLACE}-trakten` : ''}. Skuggning från träd och grannhus är inte medräknad.`
            : source === 'google'
              ? 'Uppskattning från Googles soldata för hela byggnaden. Fördelningen per månad är en schablon för södra Sverige.'
              : 'Exempeldata – inte en riktig analys.'}{' '}
          Stäm av med en installatör innan du bestämmer dig.
        </p>
        <div className="row">
          <button className="btn" onClick={onClose}>
            {source === 'drawn' ? 'Ändra ritning' : 'Stäng'}
          </button>
          <button className="btn primary" onClick={onQuote}>
            Be om offert
          </button>
        </div>
      </div>
    </div>
  );
}
