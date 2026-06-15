/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_NHOST_SUBDOMAIN: string;
  readonly VITE_NHOST_REGION: string;
  readonly VITE_DEEPGRAM_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
