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
  { id: '1b', note: 'Admin panel → Landing page → Hero block', location: 'Home hero — headline & lead' },
  { id: '2b', note: 'Admin panel → Landing page → Hero block', location: 'Home hero — Join the community button' },
  { id: '3b', note: 'Admin panel → Landing page → Second screen', location: 'Home — brand section (second screen)' },
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
