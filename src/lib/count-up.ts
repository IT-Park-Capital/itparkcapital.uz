/**
 * Animate an element's text from 0 up to `finalText`, preserving any non-numeric
 * prefix/suffix (e.g. "$42M+", "2 500+"). Mirrors the counter in Base.astro.
 */
export function countUp(el: HTMLElement, finalText: string, duration = 1100): void {
  const match = finalText.match(/[\d\s]+([.,]\d+)?/);
  if (!match) {
    el.textContent = finalText;
    return;
  }
  const numStr = match[0].replace(/\s/g, '').replace(',', '.');
  const target = parseFloat(numStr);
  if (isNaN(target)) {
    el.textContent = finalText;
    return;
  }
  const isInteger = !numStr.includes('.');
  const prefix = finalText.slice(0, match.index || 0);
  const suffix = finalText.slice((match.index || 0) + match[0].length);
  const fmt = (v: number) =>
    isInteger ? Math.round(v).toLocaleString('en-US').replace(/,/g, ' ') : v.toFixed(1);

  const start = performance.now();
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = prefix + fmt(target * eased) + suffix;
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = finalText;
  };
  requestAnimationFrame(tick);
}

/** Run countUp once the element scrolls into view (or immediately if no IO support). */
export function observeCount(el: HTMLElement, finalText: string): void {
  if (!('IntersectionObserver' in window)) {
    el.textContent = finalText;
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      io.unobserve(entry.target);
      countUp(entry.target as HTMLElement, finalText);
    });
  }, { threshold: 0.4 });
  io.observe(el);
}
