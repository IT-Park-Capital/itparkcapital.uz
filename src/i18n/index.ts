import uz from './uz.json';
import ru from './ru.json';
import en from './en.json';

export const dictionaries = { uz, ru, en } as const;

export type Locale = keyof typeof dictionaries;
export const locales: readonly Locale[] = ['uz', 'ru', 'en'] as const;
export const defaultLocale: Locale = 'uz';

export type Dict = typeof uz;

export function getDict(locale: Locale): Dict {
  return dictionaries[locale];
}

export function isLocale(value: string | undefined): value is Locale {
  return value === 'uz' || value === 'ru' || value === 'en';
}

const localeFromPath = (pathname: string): Locale => {
  const seg = pathname.replace(/^\/+/, '').split('/')[0];
  return isLocale(seg) ? seg : defaultLocale;
};

export function getLocaleFromUrl(url: URL): Locale {
  return localeFromPath(url.pathname);
}

export function localePath(locale: Locale, path = ''): string {
  const clean = path.replace(/^\/+/, '');
  if (locale === defaultLocale) {
    return clean ? `/${clean}` : '/';
  }
  return clean ? `/${locale}/${clean}` : `/${locale}`;
}

export function alternates(currentPath: string): Record<Locale, string> {
  const stripped = currentPath.replace(/^\/(uz|ru|en)(\/|$)/, '/').replace(/\/$/, '') || '/';
  const path = stripped === '/' ? '' : stripped.replace(/^\//, '');
  return {
    uz: localePath('uz', path),
    ru: localePath('ru', path),
    en: localePath('en', path),
  };
}

export const HREFLANG_MAP: Record<Locale, string> = {
  uz: 'uz-UZ',
  ru: 'ru-RU',
  en: 'en-US',
};
