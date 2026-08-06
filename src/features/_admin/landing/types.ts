import type { BadgeColor } from '@/components/_admin/ui/Badge';

export type HeroType = 'image' | 'video' | 'carousel';

export type LandingModel = {
  name: string;
  meta: string;
  emoji: string;
  generations: number;
  logbooks: string;
  badge: BadgeColor;
  visible: boolean;
};
