import type { CatalogLogoType } from '@/lib/redux/api/landing-api/catalog-api/catalog-api-slice';

type Size = 'small' | 'medium' | 'big';

export function mediaUrl(media: CatalogLogoType | undefined, size: Size = 'medium') {
  if (!media?.url_domain) return null;
  const path = media[`image_${size}`] ?? media.image_medium ?? media.url;
  return path ? media.url_domain + path : null;
}

export function coverStyle(media: CatalogLogoType | undefined, size: Size = 'medium') {
  const url = mediaUrl(media, size);
  return url ? `url("${url}") center / cover no-repeat` : null;
}
