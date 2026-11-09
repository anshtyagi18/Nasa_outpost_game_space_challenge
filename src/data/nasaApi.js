/**
 * NASA API configuration constants.
 *
 * Uses the DEMO_KEY for development. Replace with a registered API key
 * from https://api.nasa.gov for production use.
 *
 * Endpoints modeled after:
 *   - DONKI (Space Weather Database Of Notifications, Knowledge, Information)
 *   - APOD  (Astronomy Picture of the Day)
 *   - Mars Weather (InSight)
 */

/** Base URL for all NASA Open API endpoints. */
export const NASA_API_BASE = 'https://api.nasa.gov'

/** Demo key — rate-limited to 30 req/hr, 50 req/day. */
export const NASA_API_KEY = 'DEMO_KEY'

/** Endpoint catalogue used by the game's telemetry system. */
export const ENDPOINTS = {
  /** Space weather notifications (solar flares, CMEs, etc.) */
  donkiNotifications: `${NASA_API_BASE}/DONKI/notifications`,

  /** Coronal Mass Ejection events */
  donkiCME: `${NASA_API_BASE}/DONKI/CME`,

  /** Solar flare events */
  donkiFlare: `${NASA_API_BASE}/DONKI/FLR`,

  /** Geomagnetic storm events */
  donkiGST: `${NASA_API_BASE}/DONKI/GST`,

  /** Astronomy Picture of the Day */
  apod: `${NASA_API_BASE}/planetary/apod`,
}

