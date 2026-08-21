export type AdminListResponseType<T> = {
  items: T[];
  count?: number;
  total?: number;
  current_page?: number;
  last_page?: number;
};

export type AdminStaffRoleType = 'admin' | 'superadmin';

export type AdminMediaKindType = 'image' | 'video' | 'logo';

export type AdminMediaType = {
  id: number | string;
  file_id?: number | string | null;
  kind?: AdminMediaKindType;
  name?: string | null;
  filetype?: string | null;
  size?: number | null;
  width?: number | null;
  height?: number | null;
  url?: string | null;
  url_domain?: string | null;
  image_small?: string | null;
  image_medium?: string | null;
  image_big?: string | null;
  created_at?: string | null;
};

export type AutobrandHeroKindType = 'image' | 'video' | 'carousel';

export type AutobrandCtaType = {
  text?: string | null;
  url?: string | null;
};

export type AutobrandHeroSlideType = {
  id?: number | string;
  media?: AdminMediaType | null;
};

export type AutobrandHeroType = {
  type?: AutobrandHeroKindType;
  headline?: string | null;
  subheadline?: string | null;
  cta_primary?: AutobrandCtaType | null;
  cta_secondary?: AutobrandCtaType | null;
  image?: AdminMediaType | null;
  video?: AdminMediaType | null;
  video_thumbnail?: AdminMediaType | null;
  slides?: AutobrandHeroSlideType[] | null;
  autoplay?: boolean | null;
  slide_duration_seconds?: number | null;
};

export type AutobrandFactType = {
  name: string;
  value: string;
};

export type AutobrandFilterChipType = {
  label: string;
  active?: boolean;
};

export type AutobrandFiltersType = {
  decades_enabled?: boolean | null;
  body_types?: AutobrandFilterChipType[] | null;
  power_types?: AutobrandFilterChipType[] | null;
};

export type AutobrandColorsType = {
  primary?: string | null;
  background?: string | null;
  text?: string | null;
  secondary?: string | null;
};

export type AutobrandBrandStyleType = {
  logo?: AdminMediaType | null;
  favicon?: AdminMediaType | null;
  colors?: AutobrandColorsType | null;
  font?: string | null;
};

export type AutobrandVendorChannelType = {
  id?: number | null;
  name?: string | null;
  slug?: string | null;
};

export type AutobrandCommunityType = {
  show_on_landing?: boolean | null;
  title?: string | null;
  subtitle?: string | null;
  max_logbooks?: number | null;
};

export type AutobrandMotorityStatsType = {
  total_logbooks?: number | null;
  active_owners?: number | null;
  new_this_month?: number | null;
  top_model?: string | null;
  models_count?: number | null;
  generations_count?: number | null;
};

export type AutobrandMakeType = {
  id?: number | null;
  name?: string | null;
  slug?: string | null;
  logo?: AdminMediaType | null;
};

export type AutobrandSettingsType = {
  brand_name?: string | null;
  contact_email?: string | null;
  default_locale?: string | null;
  maintenance?: boolean | null;
  enabled?: boolean | null;
};

export type AutobrandSiteType = {
  id?: number;
  subdomain: string;
  domain?: string | null;
  make?: AutobrandMakeType | null;
  hero?: AutobrandHeroType | null;
  about?: string | null;
  facts?: AutobrandFactType[] | null;
  filters?: AutobrandFiltersType | null;
  hidden_model_ids?: number[] | null;
  hidden_generation_ids?: number[] | null;
  community?: AutobrandCommunityType | null;
  brand_style?: AutobrandBrandStyleType | null;
  motority_stats?: AutobrandMotorityStatsType | null;
  vendor_channel?: AutobrandVendorChannelType | null;
} & AutobrandSettingsType;

export type AdminMeItemType = {
  subdomain: string;
  name?: string | null;
  domain?: string | null;
  role: AdminStaffRoleType;
};

export type AdminNotificationType = {
  id: number;
  title?: string | null;
  body?: string | null;
  read?: boolean | null;
  created_at?: string | null;
};

export type AdminHistoryAuthorType = {
  id?: number | null;
  name?: string | null;
};

export type AdminHistoryEntryType = {
  id: number;
  object?: string | null;
  change_type?: string | null;
  author?: AdminHistoryAuthorType | null;
  created_at?: string | null;
};

export type AdminCatalogModelType = {
  id: number;
  name: string;
  slug?: string | null;
  years?: string | null;
};

export type AdminCatalogGenerationType = {
  id: number;
  name: string;
  slug?: string | null;
  years?: string | null;
  model_id?: number | null;
};

export const adminMediaUrl = (media?: AdminMediaType | null, size: 'small' | 'medium' | 'big' = 'medium') => {
  if (!media) return null;
  const path = (size === 'small' ? media.image_small : size === 'big' ? media.image_big : media.image_medium) ?? media.url;
  if (!path) return null;
  return media.url_domain ? `${media.url_domain}${path}` : path;
};

export const unwrapData = <T>(response: { data: T } | T): T =>
  response && typeof response === 'object' && 'data' in response ? (response as { data: T }).data : (response as T);
