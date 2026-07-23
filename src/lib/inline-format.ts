/**
 * Inline formatting for CMS-authored news text:
 *   ***text*** → bold + italic
 *   **text**   → bold
 *   *text*     → italic
 *
 * Builds real DOM nodes instead of assigning innerHTML, so authored text can
 * never inject markup. The admin panel has a React twin of this parser in
 * `frontend/src/lib/inline-format.tsx` — keep the two in sync.
 */
const PATTERN = /\*\*\*([\s\S]+?)\*\*\*|\*\*([\s\S]+?)\*\*|\*([\s\S]+?)\*/g;

/** Append `text` to `target`, converting inline markers into <strong>/<em> elements. */
export function appendInline(target: Node, text: string): void {
  const re = new RegExp(PATTERN.source, 'g');
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      target.appendChild(document.createTextNode(text.slice(last, match.index)));
    }

    if (match[1] !== undefined) {
      const strong = document.createElement('strong');
      const em = document.createElement('em');
      appendInline(em, match[1]);
      strong.appendChild(em);
      target.appendChild(strong);
    } else if (match[2] !== undefined) {
      const strong = document.createElement('strong');
      appendInline(strong, match[2]);
      target.appendChild(strong);
    } else {
      const em = document.createElement('em');
      appendInline(em, match[3] ?? '');
      target.appendChild(em);
    }

    last = re.lastIndex;
  }

  if (last < text.length) {
    target.appendChild(document.createTextNode(text.slice(last)));
  }
}
