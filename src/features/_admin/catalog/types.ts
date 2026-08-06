import type { BadgeColor } from '@/components/_admin/ui/Badge';

export type ModelRow = {
  name: string;
  years: string;
  generations: number;
  logbooks: string;
  badge: BadgeColor;
  visible: boolean;
};

export type GenRow = {
  name: string;
  years: string;
  logbooks: number;
  badge: BadgeColor;
  visible: boolean;
};
