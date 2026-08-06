import { useAppDispatch } from '@/store';
import { openModal, showToast } from '@/store/uiSlice';
import { Avatar, Badge, Button, SectionCard, SectionHeader } from '@/components/ui';

const users = [
  {
    initials: 'AK',
    bg: undefined,
    name: 'Anna Kowalski',
    email: 'anna@bmw-motority.com',
    role: 'Super Admin',
    roleBadge: 'blue' as const,
    login: 'Just now',
    you: true,
  },
  {
    initials: 'MR',
    bg: 'var(--green)',
    name: 'Max Richter',
    email: 'max.r@bmw-motority.com',
    role: 'Admin',
    roleBadge: 'gray' as const,
    login: '3h ago',
  },
  {
    initials: 'YT',
    bg: '#8b5cf6',
    name: 'Yuki Tanaka',
    email: 'yuki@bmw-motority.com',
    role: 'Admin',
    roleBadge: 'gray' as const,
    login: 'Yesterday',
  },
  {
    initials: 'LP',
    bg: '#f59e0b',
    name: 'Luca Parisi',
    email: 'luca@bmw-motority.com',
    role: 'Admin',
    roleBadge: 'gray' as const,
    login: '3 days ago',
  },
];

export default function UsersPage() {
  const dispatch = useAppDispatch();
  return (
    <SectionCard>
      <SectionHeader
        title="Users & Roles"
        sub="4 of 10 users · You are Super Admin"
        right={
          <Button sm onClick={() => dispatch(openModal('invite-user'))}>
            + Invite User
          </Button>
        }
      />
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Last Login</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.name}>
              <td>
                <div className="flex items-center gap-2.5">
                  <Avatar initials={u.initials} bg={u.bg} />
                  <div className="text-[13.5px] font-semibold text-ink">{u.name}</div>
                </div>
              </td>
              <td className="text-ink-2">{u.email}</td>
              <td>
                <Badge color={u.roleBadge}>{u.role}</Badge>
              </td>
              <td className="text-ink-3">{u.login}</td>
              <td>
                {u.you ? (
                  <span className="text-xs text-ink-3">You</span>
                ) : (
                  <div className="flex gap-1.5">
                    <Button variant="ghost" sm onClick={() => dispatch(openModal('edit-role'))}>
                      Edit Role
                    </Button>
                    <Button variant="danger" sm onClick={() => dispatch(showToast(`⚠️ ${u.name} deactivated`))}>
                      Deactivate
                    </Button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </SectionCard>
  );
}
