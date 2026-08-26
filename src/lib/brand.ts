export type Brand = {
  name: string;
  makeSlug: string;
};

const FALLBACK_SLUG: string = import.meta.env.VITE_BRAND_SLUG ?? 'bmw';

/**
 * Brand comes from the page host — the piece before the first dot
 * (bmw.motority.com → bmw), per the backend's brand separation. On hosts
 * without a brand subdomain (localhost, bare domain, www) it falls back to
 * VITE_BRAND_SLUG / bmw; `sub.localhost` works for local multi-brand testing.
 * `name` is a display placeholder — screens prefer the payload's make.name.
 */
export function resolveBrand(): Brand {
  const [subdomain, ...rest] = window.location.hostname.split('.');
  const hasSubdomain =
    !!subdomain && subdomain !== 'www' && (rest.length >= 2 || rest[rest.length - 1] === 'localhost');
  const makeSlug = hasSubdomain ? subdomain : FALLBACK_SLUG;
  return { name: makeSlug.toUpperCase(), makeSlug };
}

export const brand = resolveBrand();

export const brandCatalogUrl = (model?: string, gen?: string) =>
  ['https://motority.com/p/cars', brand.makeSlug, model, gen].filter(Boolean).join('/');

export const brandPostsUrl = (model?: string, gen?: string) => `${brandCatalogUrl(model, gen)}?panel=posts`;
