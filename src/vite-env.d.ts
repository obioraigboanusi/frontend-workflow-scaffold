/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the backend API. Leave empty to use same-origin (and the MSW mocks in dev/tests). */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
