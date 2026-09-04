export type Brand = {
  name: string;
  makeSlug: string;
};

const FALLBACK_SLUG: string = import.meta.env.VITE_BRAND_SLUG ?? 'bmw';

/**
 * Hosts where the first label is an account name rather than a brand. On
 * levan-d.github.io the shape is indistinguishable from bmw.motority.com, so
 * the host has to be named or every deploy asks the API for a brand called
 * after the GitHub account.
 */
const NON_BRAND_HOSTS = ['github.io'];

const isNonBrandHost = (hostname: string) =>
  NON_BRAND_HOSTS.some((host) => hostname === host || hostname.endsWith(`.${host}`));

/**
 * Brand comes from the page host — the piece before the first dot
 * (bmw.motority.com → bmw), per the backend's brand separation. On hosts
 * without a brand subdomain (localhost, bare domain, www, a preview host) it
 * falls back to VITE_BRAND_SLUG / bmw; `sub.localhost` works for local
 * multi-brand testing. `name` is a display placeholder — screens prefer the
 * payload's make.name.
 */
export function resolveBrand(): Brand {
  const hostname = window.location.hostname;
  const [subdomain, ...rest] = hostname.split('.');
  const hasSubdomain =
    !isNonBrandHost(hostname) &&
    !!subdomain &&
    subdomain !== 'www' &&
    (rest.length >= 2 || rest[rest.length - 1] === 'localhost');
  const makeSlug = hasSubdomain ? subdomain : FALLBACK_SLUG;
  return { name: makeSlug.toUpperCase(), makeSlug };
}

export const brand = resolveBrand();

export const brandCatalogUrl = (model?: string, gen?: string) =>
  ['https://motority.com/p/cars', brand.makeSlug, model, gen].filter(Boolean).join('/');

export const brandPostsUrl = (model?: string, gen?: string) => `${brandCatalogUrl(model, gen)}?panel=posts`;
