/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_MAPS_API_KEY?: string;
  readonly VITE_QUOTE_EMAIL?: string;
  readonly VITE_STATIC_HOSTING?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
