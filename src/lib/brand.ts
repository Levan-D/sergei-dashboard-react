export type Brand = {
  name: string;
  makeSlug: string;
};

const PLACEHOLDER: Brand = {
  name: 'BMW',
  makeSlug: 'bmw',
};

export function resolveBrand(): Brand {
  return PLACEHOLDER;
}

export const brand = resolveBrand();

export const brandCatalogUrl = (model?: string, gen?: string) =>
  ['https://motority.com/p/cars', brand.makeSlug, model, gen].filter(Boolean).join('/');

export const brandPostsUrl = (model?: string, gen?: string) => `${brandCatalogUrl(model, gen)}?panel=posts`;
