import type { ComponentType } from 'react';
import { ROUTING } from '@/lib/routing';
import type { IconProps } from '@/components/icons';
import {
  IconDashboard,
  IconLanding,
  IconCatalog,
  IconImage,
  IconGlobe,
  IconCommunity,
  IconUser,
  IconBell,
  IconClock,
  IconSettings,
} from '@/components/icons';

export type NavEntry = {
  path: string;
  label: string;
  /** page title shown in the topbar (defaults to `label`) */
  title?: string;
  icon: ComponentType<IconProps>;
  badge?: string;
  section?: string;
};

export const navItems: NavEntry[] = [
  { path: ROUTING.admin, label: 'Dashboard', icon: IconDashboard },
  { path: ROUTING.adminLanding, label: 'Landing Page', title: 'Landing Page Editor', icon: IconLanding, section: 'Content' },
  { path: ROUTING.adminCatalog, label: 'Cars Catalog', icon: IconCatalog },
  { path: ROUTING.adminMedia, label: 'Media Library', icon: IconImage },
  { path: ROUTING.adminStyle, label: 'Brand Style', icon: IconGlobe, section: 'Brand' },
  { path: ROUTING.adminCommunity, label: 'Community', icon: IconCommunity },
  { path: ROUTING.adminUsers, label: 'Users & Roles', icon: IconUser, section: 'Admin' },
  { path: ROUTING.adminNotifications, label: 'Notifications', icon: IconBell, badge: '3' },
  { path: ROUTING.adminHistory, label: 'Version History', icon: IconClock },
  { path: ROUTING.adminSettings, label: 'Settings', icon: IconSettings },
];

/** Title for a given pathname (editor sub-pages resolved separately in the topbar). */
export const titleForPath = (pathname: string): string => {
  const exact = navItems.find((n) => n.path === pathname);
  if (exact) return exact.title ?? exact.label;
  return 'Cars Catalog';
};

/** Is `path` the active nav entry for the current location? */
export const isActivePath = (path: string, pathname: string): boolean =>
  path === ROUTING.admin ? pathname === ROUTING.admin : pathname.startsWith(path);
