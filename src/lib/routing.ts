export const ROUTING = {
  home: '/',

  // admin
  admin: '/admin',
  adminLanding: '/admin/landing',
  adminCatalog: '/admin/catalog',
  adminCatalogModel: '/admin/catalog/model/',
  adminCatalogGen: '/admin/catalog/gen/',
  adminMedia: '/admin/media',
  adminStyle: '/admin/style',
  adminCommunity: '/admin/community',
  adminUsers: '/admin/users',
  adminNotifications: '/admin/notifications',
  adminHistory: '/admin/history',
  adminSettings: '/admin/settings',

  // dev
  devApi: '/dev/api',
} as const;

export const landingModelPath = (model: string) => `/${encodeURIComponent(model)}`;
export const landingGenPath = (model: string, gen: string) =>
  `/${encodeURIComponent(model)}/${encodeURIComponent(gen)}`;
