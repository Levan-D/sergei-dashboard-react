import { useAppDispatch } from '@/store';
import { showToast } from '@/store/uiSlice';
import { Avatar, Badge, SectionCard, SectionHeader } from '@/components/ui';
import type { BadgeColor } from '@/types';

const entries: {
  initials: string;
  bg?: string;
  name: string;
  object: string;
  change: string;
  badge: BadgeColor;
  time: string;
}[] = [
  { initials: 'AK', name: 'Anna K.', object: 'BMW M4 description', change: 'Edited', badge: 'blue', time: '2h ago' },
  {
    initials: 'MR',
    bg: 'var(--green)',
    name: 'Max R.',
    object: 'Hero Block',
    change: 'Style changed',
    badge: 'yellow',
    time: '5h ago',
  },
  {
    initials: 'YT',
    bg: '#8b5cf6',
    name: 'Yuki T.',
    object: 'BMW X5 G05 generation',
    change: 'Created',
    badge: 'green',
    time: 'Yesterday',
  },
  {
    initials: 'AK',
    name: 'Anna K.',
    object: 'Brand Primary Color',
    change: 'Style changed',
    badge: 'yellow',
    time: '2 days ago',
  },
  {
    initials: 'LP',
    bg: '#f59e0b',
    name: 'Luca P.',
    object: 'BMW iX visibility',
    change: 'Deleted',
    badge: 'red',
    time: '3 days ago',
  },
];

export default function HistoryPage() {
  const dispatch = useAppDispatch();
  return (
    <SectionCard>
      <SectionHeader title="Version History" sub="All content changes" />
      <table>
        <thead>
          <tr>
            <th>Editor</th>
            <th>Object</th>
            <th>Change Type</th>
            <th>Time</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e, i) => (
            <tr key={i}>
              <td>
                <div className="flex items-center gap-2">
                  <Avatar sm initials={e.initials} bg={e.bg} />
                  {e.name}
                </div>
              </td>
              <td>{e.object}</td>
              <td>
                <Badge color={e.badge}>{e.change}</Badge>
              </td>
              <td className="text-ink-3">{e.time}</td>
              <td>
                <button
                  onClick={() => dispatch(showToast('♻️ Restored to this version'))}
                  className="cursor-pointer border-none bg-transparent font-sans text-xs font-semibold text-accent hover:underline"
                >
                  Restore
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </SectionCard>
  );
}
