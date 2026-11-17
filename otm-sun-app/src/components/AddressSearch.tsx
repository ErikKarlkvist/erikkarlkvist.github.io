import { useEffect, useRef, useState } from 'react';
import { loadGoogleMaps } from '../lib/google';
import type { Point } from './MapView';

interface Props {
  onLocate: (point: Point, address: string) => void;
}

interface Suggestion {
  label: string;
  prediction: google.maps.places.PlacePrediction;
}

export function AddressSearch({ onLocate }: Props) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [error, setError] = useState('');
  // En session = ett sök från första tecknet till valt förslag; Google debiterar per session.
  const session = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const skip = useRef(false);

  useEffect(() => {
    if (skip.current) {
      skip.current = false;
      return;
    }
    const input = query.trim();
    if (input.length < 3) {
      setSuggestions([]);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        await loadGoogleMaps();
        const { AutocompleteSuggestion, AutocompleteSessionToken } = (await google.maps.importLibrary(
          'places',
        )) as google.maps.PlacesLibrary;
        session.current ??= new AutocompleteSessionToken();
        const { suggestions: found } = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input,
          sessionToken: session.current,
          includedRegionCodes: ['se'],
          language: 'sv',
        });
        if (cancelled) return;
        setError('');
        setSuggestions(
          found.flatMap((s) =>
            s.placePrediction ? [{ label: s.placePrediction.text.text, prediction: s.placePrediction }] : [],
          ),
        );
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Adressöket fungerade inte.');
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  async function choose(s: Suggestion) {
    skip.current = true;
    setQuery(s.label);
    setSuggestions([]);
    try {
      const place = s.prediction.toPlace();
      await place.fetchFields({ fields: ['location', 'formattedAddress'] });
      session.current = null;
      if (!place.location) throw new Error('Adressen saknar position.');
      onLocate({ lat: place.location.lat(), lng: place.location.lng() }, place.formattedAddress ?? s.label);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte hämta adressen.');
    }
  }

  return (
    <div className="search">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && suggestions[0]) void choose(suggestions[0]);
        }}
        placeholder="Sök adress, t.ex. Storgatan 1, Eksjö"
        aria-label="Sök adress"
        autoComplete="off"
      />
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((s) => (
            <li key={s.prediction.placeId}>
              <button type="button" onClick={() => void choose(s)}>
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
