import { useSyncExternalStore } from 'react';

const PHONE_COUNT = 4;

const STEPS = [
  { query: '(min-width: 1280px)', count: 12 },
  { query: '(min-width: 800px)', count: 9 },
  { query: '(min-width: 450px)', count: 6 },
];

const readCount = () => STEPS.find((step) => window.matchMedia(step.query).matches)?.count ?? PHONE_COUNT;

const subscribe = (notify: () => void) => {
  const lists = STEPS.map((step) => window.matchMedia(step.query));
  lists.forEach((list) => list.addEventListener('change', notify));
  return () => lists.forEach((list) => list.removeEventListener('change', notify));
};

export default function useModelsPerPage() {
  return useSyncExternalStore(subscribe, readCount, () => PHONE_COUNT);
}
