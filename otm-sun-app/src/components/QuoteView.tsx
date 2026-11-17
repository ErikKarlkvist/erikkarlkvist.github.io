import type { FormEvent } from 'react';
import { sv, type Estimate } from '../lib/estimate';

/** Mottagare av offertförfrågningar. Tom = användaren fyller själv i mottagaren i sitt mejlprogram. */
const QUOTE_EMAIL: string = import.meta.env.VITE_QUOTE_EMAIL ?? '';

interface Props {
  estimate: Estimate;
  /** Underlaget för analysen; följer med i mejlet. */
  source: 'google' | 'drawn' | 'demo';
  address: string;
  /** Länk som öppnar samma tak och analys igen. */
  link: string;
  onBack: () => void;
  onSent: () => void;
}

const SOURCES = {
  google: 'Googles takanalys (hela byggnaden)',
  drawn: 'Egen ritning av takytan',
  demo: 'Exempeldata',
};

/**
 * Offertförfrågan som ett färdigskrivet mejl i användarens eget mejlprogram (mailto).
 * Ingen server behövs; analysen följer med som text och som länk.
 */
export function QuoteView({ estimate: e, source, address, link, onBack, onSent }: Props) {
  const summary = `${e.panels} paneler · ${sv(e.kwp, 1)} kWp · ${sv(e.kwhPerYear)} kWh/år`;

  function submit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const form = new FormData(ev.currentTarget);
    const field = (name: string) => String(form.get(name) ?? '').trim();
    const roofs = e.segments
      .filter((s) => s.panels > 0)
      .slice(0, 6)
      .map((s) => `- Takyta ${s.direction}: ${sv(s.areaM2)} m², ${sv(s.pitch)}° lutning, ${s.panels} paneler`);
    const body = [
      'Hej!',
      '',
      `Jag vill ha en offert på solceller${address ? ` till ${address}` : ''}.`,
      field('message') && `\n${field('message')}`,
      '',
      'Min takanalys från solkalkylen:',
      `- Årsproduktion: ${sv(e.kwhPerYear)} kWh`,
      `- Paneler: ${e.panels} st, ${sv(e.kwp, 1)} kWp`,
      ...roofs,
      `- Underlag: ${SOURCES[source]}`,
      '',
      `Öppna analysen: ${link}`,
      '',
      'Vänliga hälsningar',
      field('name'),
      field('phone') && `Telefon: ${field('phone')}`,
    ]
      .filter((line) => typeof line === 'string')
      .join('\n');
    const subject = `Offertförfrågan solceller${address ? ` – ${address}` : ''}`;
    location.href = `mailto:${QUOTE_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    onSent();
  }

  return (
    <>
      <h1>Be om offert</h1>
      <p>Vi förbereder ett mejl till OTM med din takanalys. Du skickar det själv från ditt mejlprogram.</p>
      <div className="attach">
        <div>
          <b>Takanalys{address ? ` – ${address}` : ''}</b>
          <small>{summary}</small>
          <small>Siffrorna och en länk till analysen</small>
        </div>
        <span>Följer med</span>
      </div>
      <form onSubmit={submit}>
        <label className="field">
          Namn
          <input name="name" type="text" autoComplete="name" required maxLength={120} />
        </label>
        <label className="field">
          Telefon <i>(valfritt)</i>
          <input name="phone" type="tel" autoComplete="tel" maxLength={40} />
        </label>
        <label className="field">
          Meddelande <i>(valfritt)</i>
          <textarea name="message" rows={3} maxLength={1000} placeholder="T.ex. önskemål om batteri eller laddbox" />
        </label>
        <div className="row">
          <button className="btn" type="button" onClick={onBack}>
            Tillbaka
          </button>
          <button className="btn primary" type="submit">
            Öppna mejl
          </button>
        </div>
      </form>
    </>
  );
}
