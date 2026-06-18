import { API_BASE, mediaUrl } from './config';

export interface PublicNewsListItem {
  slug: string;
  title: string;
  subtitle: string;
  categorySlug: string | null;
  categoryName: string | null;
  categoryColor: string | null;
  publishedAt: string;
  mainImageUrl: string | null;
}

export interface PublicNewsDetail {
  slug: string;
  title: string;
  subtitle: string;
  quote: string;
  body: string;
  categorySlug: string | null;
  categoryName: string | null;
  categoryColor: string | null;
  publishedAt: string;
  mainImageUrl: string | null;
  images: string[];
}

export interface PublicNewsCategory {
  slug: string;
  name: string;
  color: string | null;
}

export async function fetchNews(lang: string, pageSize = 100): Promise<PublicNewsListItem[]> {
  const res = await fetch(`${API_BASE}/api/public/news?lang=${lang}&pageSize=${pageSize}`);
  if (!res.ok) throw new Error('Failed to load news');
  const items = (await res.json()) as PublicNewsListItem[];
  return items.map(i => ({ ...i, mainImageUrl: i.mainImageUrl ? mediaUrl(i.mainImageUrl) : null }));
}

export async function fetchNewsDetail(slug: string, lang: string): Promise<PublicNewsDetail | null> {
  const res = await fetch(`${API_BASE}/api/public/news/${encodeURIComponent(slug)}?lang=${lang}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to load news item');
  const d = (await res.json()) as PublicNewsDetail;
  return {
    ...d,
    mainImageUrl: d.mainImageUrl ? mediaUrl(d.mainImageUrl) : null,
    images: (d.images ?? []).map(mediaUrl),
  };
}

export async function fetchCategories(lang: string): Promise<PublicNewsCategory[]> {
  try {
    const res = await fetch(`${API_BASE}/api/public/news-categories?lang=${lang}`);
    if (!res.ok) return [];
    return (await res.json()) as PublicNewsCategory[];
  } catch {
    return [];
  }
}
