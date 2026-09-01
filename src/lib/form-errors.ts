import type { FieldErrors, FieldValues } from 'react-hook-form';

type ErrorLeaf = { message?: string };

/**
 * Spread into every `useForm`. Errors appear when the user hits save and are
 * re-checked only on the next save, never while they are still typing.
 */
export const VALIDATE_ON_SUBMIT = { mode: 'onSubmit', reValidateMode: 'onSubmit' } as const;

/** Deliberately loose: the server is the authority on what it will accept. */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Walks react-hook-form's nested error object in registration order and returns
 * every leaf with its field path. Array indices come out ascending, so the
 * first entry is the first offending field in the markup.
 */
function collectErrors(errors: FieldErrors, prefix = ''): { path: string; message?: string }[] {
  const found: { path: string; message?: string }[] = [];
  for (const key of Object.keys(errors)) {
    const node = errors[key as keyof typeof errors] as unknown;
    if (!node || typeof node !== 'object') continue;
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof (node as { type?: unknown }).type === 'string') {
      found.push({ path, message: (node as ErrorLeaf).message });
    } else {
      found.push(...collectErrors(node as FieldErrors, path));
    }
  }
  return found;
}

/**
 * The invalid half of `handleSubmit`. Save buttons sit in a card header or a
 * sidebar, so on a long form the field that failed is usually off screen and
 * the click looks like it did nothing. This brings the field to the user.
 *
 * Focusing before scrolling is deliberate: react-hook-form focuses the same
 * field twice more on its own, and a browser skips the focus steps for the
 * already-focused element, so our centred smooth scroll survives instead of
 * being cut short by its default focus scroll.
 *
 * `data-field` is the escape hatch for values with no input of their own, such
 * as a media picker: put it on the block that should come into view.
 */
export const scrollToFirstError = <T extends FieldValues>(errors: FieldErrors<T>) => {
  const [first] = collectErrors(errors);
  if (!first) return;
  const field = document.querySelector<HTMLElement>(`[name="${first.path}"], [data-field="${first.path}"]`);
  if (!field) return;
  field.focus({ preventScroll: true });
  field.scrollIntoView({ block: 'center', behavior: 'smooth' });
};

/**
 * One line for the card header, next to the button that appeared to do nothing.
 * One problem is worth naming; several would be a wall of text in a header, so
 * they collapse to a pointer and the fields themselves carry the detail.
 */
export const errorSummary = <T extends FieldValues>(errors: FieldErrors<T>): string | null => {
  const found = collectErrors(errors);
  if (found.length === 0) return null;
  const messages = new Set(found.map((e) => e.message).filter(Boolean));
  if (messages.size === 1) return [...messages][0] as string;
  return 'Some fields need attention';
};
