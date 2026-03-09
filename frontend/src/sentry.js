import * as Sentry from '@sentry/react'

export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN

  if (!dsn) return // Désactivé en local si VITE_SENTRY_DSN est vide

  Sentry.init({
    dsn,
    integrations: [
      Sentry.browserTracingIntegration(),
    ],
    tracesSampleRate: 0.2,
    environment: import.meta.env.MODE, // 'development' ou 'production'
  })
}
