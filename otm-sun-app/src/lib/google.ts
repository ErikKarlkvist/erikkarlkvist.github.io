export const GOOGLE_KEY: string = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '';

declare global {
  interface Window {
    __gmapsReady?: () => void;
    gm_authFailure?: () => void;
  }
}

/** Avfyras om Google avvisar nyckeln, t.ex. för att sidans adress inte finns bland tillåtna webbplatser. */
export const authFailure = new EventTarget();

let loading: Promise<void> | null = null;

/** Laddar Maps JavaScript API en gång. Bibliotek hämtas sedan med google.maps.importLibrary. */
export function loadGoogleMaps(): Promise<void> {
  if (!GOOGLE_KEY) return Promise.reject(new Error('VITE_GOOGLE_MAPS_API_KEY saknas'));
  loading ??= new Promise<void>((resolve, reject) => {
    window.__gmapsReady = () => resolve();
    // Google anropar den här om nyckeln är ogiltig eller saknar rätt API/referrer.
    // Det sker efter att skriptet laddats, så felet går ut via authFailure i stället för reject.
    window.gm_authFailure = () => authFailure.dispatchEvent(new Event('fail'));
    const script = document.createElement('script');
    const params = new URLSearchParams({
      key: GOOGLE_KEY,
      v: 'weekly',
      loading: 'async',
      language: 'sv',
      region: 'SE',
      callback: '__gmapsReady',
    });
    script.src = `https://maps.googleapis.com/maps/api/js?${params}`;
    script.async = true;
    script.onerror = () => reject(new Error('Kunde inte ladda Google Maps.'));
    document.head.appendChild(script);
  });
  return loading;
}
