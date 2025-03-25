export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  endpoints: {
    auth: import.meta.env.VITE_AUTH_ENDPOINT || '/auth/login',
    clientStatus: import.meta.env.VITE_CLIENT_STATUS_ENDPOINT || '/client-status',
    client: import.meta.env.VITE_CLIENT_ENDPOINT || '/client'
  }
};