/**
 * Append an <img> to `host` that fades in once it has loaded. While loading,
 * `host` carries the `news-skeleton` class (a shimmer placeholder). On error the
 * skeleton is cleared and the optional `onError` callback runs (e.g. remove host).
 */
export function loadImage(
  host: HTMLElement,
  imgClass: string,
  src: string,
  alt: string,
  onError?: () => void,
): HTMLImageElement {
  host.classList.add('news-skeleton');

  const img = document.createElement('img');
  img.className = imgClass;
  img.alt = alt;
  img.loading = 'lazy';
  img.decoding = 'async';

  const reveal = () => {
    img.classList.add('is-loaded');
    host.classList.remove('news-skeleton');
  };

  img.addEventListener('load', reveal);
  img.addEventListener('error', () => {
    host.classList.remove('news-skeleton');
    onError?.();
  });

  img.src = src;
  // Already cached → the load event may not fire, so reveal immediately.
  if (img.complete && img.naturalWidth > 0) reveal();

  host.appendChild(img);
  return img;
}
