/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_AUTH_ENDPOINT: string
  readonly VITE_CLIENT_STATUS_ENDPOINT: string
  readonly VITE_CLIENT_ENDPOINT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}