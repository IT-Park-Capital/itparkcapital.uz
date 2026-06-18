import { API_BASE } from './config';

export interface PublicSiteStat {
  key: string;
  label: string;
  value: string;
}

/**
 * Fetch homepage statistics from the backend. Best-effort with a short timeout —
 * returns [] on any failure so the site falls back to its built-in default values.
 */
export async function fetchSiteStats(lang: string): Promise<PublicSiteStat[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);
  try {
    const res = await fetch(`${API_BASE}/api/public/stats?lang=${lang}`, { signal: controller.signal });
    if (!res.ok) return [];
    return (await res.json()) as PublicSiteStat[];
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}
