import type { GenRow, ModelRow } from './types';

export const catalogModels: ModelRow[] = [
  { name: 'BMW M4', years: '2014 – Present', generations: 3, logbooks: '284', badge: 'green', visible: true },
  { name: 'BMW M3', years: '1986 – Present', generations: 6, logbooks: '412', badge: 'green', visible: true },
  { name: 'BMW X5', years: '1999 – Present', generations: 4, logbooks: '634', badge: 'green', visible: true },
  { name: 'BMW 3 Series', years: '1975 – Present', generations: 8, logbooks: '1,204', badge: 'green', visible: true },
  { name: 'BMW iX', years: '2021 – Present', generations: 1, logbooks: '47', badge: 'yellow', visible: true },
];

export const genData: Record<string, GenRow[]> = {
  'BMW M4': [
    { name: 'BMW M4 G82', years: '2020 – Present', logbooks: 147, badge: 'green', visible: true },
    { name: 'BMW M4 F82', years: '2014 – 2020', logbooks: 98, badge: 'green', visible: true },
    { name: 'BMW M4 CS (G82)', years: '2022 – Present', logbooks: 39, badge: 'yellow', visible: true },
  ],
  'BMW M3': [
    { name: 'BMW M3 G80', years: '2020 – Present', logbooks: 203, badge: 'green', visible: true },
    { name: 'BMW M3 F80', years: '2014 – 2020', logbooks: 189, badge: 'green', visible: true },
    { name: 'BMW M3 E92', years: '2007 – 2013', logbooks: 97, badge: 'green', visible: true },
    { name: 'BMW M3 E46', years: '2000 – 2006', logbooks: 74, badge: 'yellow', visible: true },
    { name: 'BMW M3 E36', years: '1992 – 1999', logbooks: 38, badge: 'yellow', visible: true },
    { name: 'BMW M3 E30', years: '1986 – 1991', logbooks: 21, badge: 'gray', visible: true },
  ],
  'BMW X5': [
    { name: 'BMW X5 G05', years: '2018 – Present', logbooks: 312, badge: 'green', visible: true },
    { name: 'BMW X5 F15', years: '2013 – 2018', logbooks: 187, badge: 'green', visible: true },
    { name: 'BMW X5 E70', years: '2006 – 2013', logbooks: 96, badge: 'yellow', visible: true },
    { name: 'BMW X5 E53', years: '1999 – 2006', logbooks: 39, badge: 'yellow', visible: true },
  ],
  'BMW 3 Series': [
    { name: 'BMW 3 Series G20', years: '2018 – Present', logbooks: 487, badge: 'green', visible: true },
    { name: 'BMW 3 Series G20 LCI', years: '2022 – Present', logbooks: 214, badge: 'green', visible: true },
    { name: 'BMW 3 Series F30', years: '2011 – 2018', logbooks: 321, badge: 'green', visible: true },
    { name: 'BMW 3 Series E90', years: '2005 – 2011', logbooks: 156, badge: 'yellow', visible: true },
    { name: 'BMW 3 Series E46', years: '1998 – 2006', logbooks: 98, badge: 'yellow', visible: true },
    { name: 'BMW 3 Series E36', years: '1990 – 1998', logbooks: 47, badge: 'gray', visible: true },
    { name: 'BMW 3 Series E30', years: '1982 – 1994', logbooks: 28, badge: 'gray', visible: true },
    { name: 'BMW 3 Series E21', years: '1975 – 1983', logbooks: 12, badge: 'gray', visible: true },
  ],
  'BMW iX': [{ name: 'BMW iX i20', years: '2021 – Present', logbooks: 47, badge: 'yellow', visible: true }],
};

export const modelDetails: Record<string, { years: string; desc: string }> = {
  'BMW M4': {
    years: '2014 – Present',
    desc: 'The BMW M4 is a high-performance derivative of the 4 Series. Powered by the S58 turbocharged inline-six in its current G82 form.',
  },
  'BMW M3': {
    years: '1986 – Present',
    desc: 'The BMW M3 is the performance version of the 3 Series — one of the most celebrated sports sedans in automotive history.',
  },
  'BMW X5': {
    years: '1999 – Present',
    desc: 'The BMW X5 pioneered the Sports Activity Vehicle segment. Now in its fourth generation (G05).',
  },
  'BMW 3 Series': {
    years: '1975 – Present',
    desc: 'The backbone of the BMW lineup. Eight generations have defined what a compact executive car should drive like.',
  },
  'BMW iX': {
    years: '2021 – Present',
    desc: 'The BMW iX is a fully electric flagship SAV built on a dedicated EV platform.',
  },
};

export const genYears = (genName: string): string =>
  genName === 'BMW M4 G82' ? '2020 – Present' : genName === 'BMW M4 F82' ? '2014 – 2020' : '2022 – Present';
