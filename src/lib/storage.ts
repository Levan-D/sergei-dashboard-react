/**
 * Browser storage helpers. Every call is guarded: cookies and web storage both
 * throw or silently fail in private mode, in sandboxed frames, and when a
 * quota is hit, and none of that should be able to crash a render.
 */

type CookieOptions = {
  /** Lifetime in seconds. Omit for a session cookie. */
  maxAge?: number;
  path?: string;
  sameSite?: 'Strict' | 'Lax' | 'None';
};

const DEFAULT_PATH = '/';

const isHttps = () => typeof location !== 'undefined' && location.protocol === 'https:';

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const prefix = `${encodeURIComponent(name)}=`;
  const hit = document.cookie.split('; ').find((row) => row.startsWith(prefix));
  if (!hit) return null;
  try {
    return decodeURIComponent(hit.slice(prefix.length));
  } catch {
    return null;
  }
}

export function setCookie(name: string, value: string, options: CookieOptions = {}) {
  if (typeof document === 'undefined') return;
  const { maxAge, path = DEFAULT_PATH, sameSite = 'Strict' } = options;
  const parts = [`${encodeURIComponent(name)}=${encodeURIComponent(value)}`, `path=${path}`, `SameSite=${sameSite}`];
  if (typeof maxAge === 'number') parts.push(`max-age=${Math.floor(maxAge)}`);
  // Secure is required for SameSite=None and pointless on plain http localhost.
  if (isHttps() || sameSite === 'None') parts.push('Secure');
  document.cookie = parts.join('; ');
}

export function deleteCookie(name: string, path: string = DEFAULT_PATH) {
  if (typeof document === 'undefined') return;
  // Same path as the write, otherwise the browser keeps the original cookie.
  document.cookie = `${encodeURIComponent(name)}=; path=${path}; max-age=0`;
}

export function readLocal(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeLocal(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* private mode or quota, not worth surfacing */
  }
}

export function removeLocal(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* nothing to do */
  }
}
