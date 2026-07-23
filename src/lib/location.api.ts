import { API_BASE } from './config';

export interface PublicSiteLocation {
  title: string;
  address: string;
  latitude: number;
  longitude: number;
  zoom: number;
  mapEmbedUrl: string | null;
}

/** Head office coordinates used until the CMS answers (and if it never does). */
export const DEFAULT_LOCATION = {
  latitude: 41.3423078,
  longitude: 69.3368951,
  zoom: 17,
} as const;

/** Yandex map widget URL — no API key required. */
export function buildMapUrl(latitude: number, longitude: number, zoom: number): string {
  const point = `${longitude.toFixed(6)},${latitude.toFixed(6)}`;
  return `https://yandex.uz/map-widget/v1/?ll=${point}&z=${zoom}&pt=${point},pm2rdm`;
}

/**
 * Fetch the office location from the backend. Best-effort with a short timeout —
 * returns undefined on failure so the page keeps its built-in defaults, and null
 * when an editor has switched the map off in the CMS.
 */
export async function fetchSiteLocation(lang: string): Promise<PublicSiteLocation | null | undefined> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);
  try {
    const res = await fetch(`${API_BASE}/api/public/location?lang=${lang}`, { signal: controller.signal });
    if (!res.ok) return undefined;
    return (await res.json()) as PublicSiteLocation | null;
  } catch {
    return undefined;
  } finally {
    clearTimeout(timeout);
  }
}
