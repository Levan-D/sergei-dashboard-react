import type { BadgeColor } from '@/types';

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
