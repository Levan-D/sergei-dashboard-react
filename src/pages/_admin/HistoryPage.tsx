import { showToast } from '@/lib/toast';
import Avatar from '@/components/_admin/ui/Avatar';
import Badge from '@/components/_admin/ui/Badge';
import SectionCard from '@/components/_admin/ui/SectionCard';
import SectionHeader from '@/components/_admin/ui/SectionHeader';
import type { BadgeColor } from '@/components/_admin/ui/Badge';
import Table from '@/components/_admin/ui/Table';

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
  return (
    <SectionCard>
      <SectionHeader title="Version History" sub="All content changes" />
      <Table>
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
                  onClick={() => showToast('♻️ Restored to this version')}
                  className="cursor-pointer border-none bg-transparent font-sans text-xs font-semibold text-accent hover:underline"
                >
                  Restore
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </SectionCard>
  );
}
