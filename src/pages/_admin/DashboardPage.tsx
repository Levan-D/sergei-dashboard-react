import { useNavigate } from 'react-router-dom';
import { ROUTING } from '@/lib/routing';
import Avatar from '@/components/_admin/ui/Avatar';
import Badge from '@/components/_admin/ui/Badge';
import Button from '@/components/_admin/ui/Button';
import SectionCard from '@/components/_admin/ui/SectionCard';
import SectionHeader from '@/components/_admin/ui/SectionHeader';
import { StatCard } from '@/components/_admin/StatCard';
import { NotifyItem } from '@/components/_admin/NotifyItem';
import Table from '@/components/_admin/ui/Table';

const activity = [
  {
    initials: 'AK',
    bg: undefined,
    name: 'Anna K.',
    action: 'Edited description',
    badge: 'blue' as const,
    object: 'BMW M4',
    time: '2h ago',
  },
  {
    initials: 'MR',
    bg: 'var(--green)',
    name: 'Max R.',
    action: 'Uploaded hero image',
    badge: 'gray' as const,
    object: 'Hero Block',
    time: '5h ago',
  },
  {
    initials: 'YT',
    bg: '#8b5cf6',
    name: 'Yuki T.',
    action: 'Added generation',
    badge: 'blue' as const,
    object: 'BMW X5 G05',
    time: 'Yesterday',
  },
  {
    initials: 'AK',
    bg: undefined,
    name: 'Anna K.',
    action: 'Changed brand color',
    badge: 'gray' as const,
    object: 'Brand Style',
    time: '2 days ago',
  },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="mb-4 grid grid-cols-4 gap-2 md:mb-6 md:gap-3">
        <StatCard label="Models on Landing" value="47" sub="Across 8 series" />
        <StatCard label="Generations" value="134" sub="+3 this month" />
        <StatCard label="Community Logbooks" value="2,841" sub="BMW owners on Motority" />
        <StatCard
          label="Pending Notifications"
          value="3"
          sub="Require attention"
          valueStyle={{ color: 'var(--yellow)' }}
        />
      </div>

      <SectionCard>
        <SectionHeader
          title="Recent Activity"
          sub="Latest changes by editors"
          right={
            <Button variant="ghost" sm onClick={() => navigate(ROUTING.adminHistory)}>
              View All
            </Button>
          }
        />
        <Table>
          <thead>
            <tr>
              <th>Editor</th>
              <th>Action</th>
              <th>Object</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {activity.map((a, i) => (
              <tr key={i}>
                <td>
                  <div className="flex items-center gap-2">
                    <Avatar sm initials={a.initials} bg={a.bg} />
                    {a.name}
                  </div>
                </td>
                <td>{a.action}</td>
                <td>
                  <Badge color={a.badge}>{a.object}</Badge>
                </td>
                <td className="text-ink-3">{a.time}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </SectionCard>

      <SectionCard>
        <SectionHeader title="Notifications" right={<Badge color="yellow">3 new</Badge>} />
        <NotifyItem onClick={() => navigate(ROUTING.adminNotifications)} meta="2 hours ago · Cars Catalog">
          New model <strong>BMW M2 G87</strong> added by catalog team — review and add images
        </NotifyItem>
        <NotifyItem onClick={() => navigate(ROUTING.adminNotifications)} meta="1 day ago · Cars Catalog">
          New generation <strong>BMW 3 Series G20 LCI</strong> added — upload brand images
        </NotifyItem>
        <NotifyItem onClick={() => navigate(ROUTING.adminNotifications)} meta="3 days ago · Community">
          47 new community logbooks created this week for BMW models
        </NotifyItem>
      </SectionCard>
    </div>
  );
}
