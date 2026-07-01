export const APP_CONFIG = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  appName: 'Denso Family Gathering 2026',
  appDescription: 'Enterprise Event Registration & Ticketing Platform',
  version: '1.0.0',
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },
  debounce: {
    search: 300,
    autoSave: 1000,
  },
  rateLimits: {
    registration: 5, // per minute
    general: 60, // per minute
  },
  qr: {
    size: 256,
    errorCorrection: 'M' as const,
  },
} as const;
