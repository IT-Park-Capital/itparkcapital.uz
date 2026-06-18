// Public corporate site → backend API base URL.
// Override per-environment with the PUBLIC_API_BASE_URL env var (Netlify build settings).
export const API_BASE: string =
  (import.meta.env.PUBLIC_API_BASE_URL as string | undefined) ?? 'https://my.itparkcapital.uz';

/** Prefix a relative API media path with the API base (absolute URLs pass through). */
export const mediaUrl = (url: string | null | undefined): string =>
  !url ? '' : url.startsWith('http') ? url : `${API_BASE}${url}`;
