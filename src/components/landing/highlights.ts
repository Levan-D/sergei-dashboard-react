import { useSyncExternalStore } from 'react';

export type HighlightKind = 'question' | 'admin';

export type HighlightEntry = {
  id: string;
  note: string;
  location: string;
};

export const HIGHLIGHTS = [
  { id: '1r', note: 'Destination unknown — route not defined', location: 'Navbar — Configurator' },
  { id: '2r', note: 'Destination unknown — route not defined', location: 'Navbar — Find a dealer' },
  {
    id: '3r',
    note: 'Explore has no endpoint for this: models are only listed per make, with no body/series/decade filtering and no model images. We need a dedicated endpoint for this section + its filters.',
    location: 'Home — models grid (cards)',
  },
  {
    id: '4r',
    note: 'Both pagination and a “See more” button are here — which one do we keep? They do the same job.',
    location: 'Home — models section (See more + pagination)',
  },
  { id: '1b', note: 'Admin panel → Landing page → Hero block', location: 'Home hero — headline & lead' },
  { id: '2b', note: 'Admin panel → Landing page → Hero block', location: 'Home hero — Join the community button' },
  { id: '3b', note: 'Admin panel → Landing page → Second screen', location: 'Home — brand section (second screen)' },
  { id: '4b', note: 'Admin panel → Landing page → Filter configuration', location: 'Home — models filter block' },
  {
    id: '5r',
    note: 'Partly missing from API: generations count and logbook totals are derivable, but “Country of assembly” and “Countries” have no data source.',
    location: 'Model page — stats strip',
  },
  {
    id: '6r',
    note: 'We don’t know what this button does.',
    location: 'Model page — generations sort icon button',
  },
  {
    id: '7r',
    note: 'No API supports sorting or body-type filtering of generations — the catalog endpoint returns the plain list only.',
    location: 'Model page — generations Sort by / Body type dropdowns',
  },
  {
    id: '6b',
    note: 'Admin panel → Catalog → Model editor (name, years, description)',
    location: 'Model hero — eyebrow, title, lead',
  },
  {
    id: '5b',
    note: 'Admin panel → Community → Community Block Settings (block on/off, title, subtitle). “Max logbooks to show” also controls how many cards render here — not wired up yet.',
    location: 'Real owners — section header',
  },
] as const satisfies readonly HighlightEntry[];

export type HighlightId = (typeof HIGHLIGHTS)[number]['id'];

const kindOf = (id: HighlightId): HighlightKind => (id.endsWith('b') ? 'admin' : 'question');

export type ResolvedHighlight = {
  kind: HighlightKind;
  tag: string;
  note: string;
  location: string;
  label: string;
};

export function resolveHighlight(id: HighlightId): ResolvedHighlight {
  const entry = HIGHLIGHTS.find((h) => h.id === id)!;
  return {
    kind: kindOf(id),
    tag: id,
    note: entry.note,
    location: entry.location,
    label: `${id}) ${entry.note}`,
  };
}

export function numberedHighlights() {
  return HIGHLIGHTS.map((h) => ({ tag: h.id, kind: kindOf(h.id), ...h }));
}

let highlightsEnabled = true;
const listeners = new Set<() => void>();

export const highlightsToggle = {
  get: () => highlightsEnabled,
  toggle: () => {
    highlightsEnabled = !highlightsEnabled;
    listeners.forEach((l) => l());
  },
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};

export function useHighlightsEnabled() {
  return useSyncExternalStore(highlightsToggle.subscribe, highlightsToggle.get, highlightsToggle.get);
}

export function reportHighlights() {
  const section = (kind: HighlightKind, title: string) => {
    const rows = HIGHLIGHTS.filter((h) => kindOf(h.id) === kind);
    return [title, '', ...rows.map((h) => `${h.id}) ${h.note} — ${h.location}`)];
  };

  const text = [
    ...section('question', 'QUESTIONS FOR PM (red)'),
    '',
    ...section('admin', 'ADMIN-CONFIGURED CONTENT (blue)'),
  ].join('\n');

  console.log(`%c[Highlights] Paste-ready list for PM\n\n${text}`, 'font-weight:bold');
  console.log('[Highlights] JSON', numberedHighlights());
}
