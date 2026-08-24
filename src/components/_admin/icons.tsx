import type { ComponentType } from 'react';
import {
  FiGrid,
  FiLayout,
  FiLayers,
  FiImage,
  FiGlobe,
  FiUsers,
  FiUser,
  FiBell,
  FiClock,
  FiSettings,
  FiMoon,
  FiSun,
  FiArrowLeft,
  FiExternalLink,
  FiVideo,
  FiFilm,
  FiX,
  FiPlus,
  FiDownload,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiMenu,
  FiTrash2,
} from 'react-icons/fi';
import { RxDragHandleDots2 } from 'react-icons/rx';
import type { IconType } from 'react-icons';

export type IconProps = {
  size?: number;
  /** stroke width — forwarded to the underlying SVG (Feather icons honor it) */
  sw?: number;
  className?: string;
  [key: string]: unknown;
};

/** Wrap a react-icons icon so it keeps our `size` / `sw` (stroke-width) API. */
const wrap = (Cmp: IconType): ComponentType<IconProps> => {
  return ({ size = 16, sw, className, ...rest }: IconProps) => (
    <Cmp size={size} className={className} {...(sw != null ? { strokeWidth: sw } : {})} {...rest} />
  );
};

export const IconDashboard = wrap(FiGrid);
export const IconLanding = wrap(FiLayout);
export const IconCatalog = wrap(FiLayers);
export const IconImage = wrap(FiImage);
export const IconGlobe = wrap(FiGlobe);
export const IconCommunity = wrap(FiUsers);
export const IconUser = wrap(FiUser);
export const IconBell = wrap(FiBell);
export const IconClock = wrap(FiClock);
export const IconSettings = wrap(FiSettings);
export const IconMoon = wrap(FiMoon);
export const IconSun = wrap(FiSun);
export const IconArrowLeft = wrap(FiArrowLeft);
export const IconExternal = wrap(FiExternalLink);
export const IconVideo = wrap(FiVideo);
export const IconCarousel = wrap(FiFilm);
export const IconX = wrap(FiX);
export const IconPlus = wrap(FiPlus);
export const IconDownload = wrap(FiDownload);
export const IconDrag6 = wrap(RxDragHandleDots2);
export const IconDrag4 = wrap(RxDragHandleDots2);
export const IconChevronDown = wrap(FiChevronDown);
export const IconChevronLeft = wrap(FiChevronLeft);
export const IconChevronRight = wrap(FiChevronRight);
export const IconMenu = wrap(FiMenu);
export const IconTrash = wrap(FiTrash2);
