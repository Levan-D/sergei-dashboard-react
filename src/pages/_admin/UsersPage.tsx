import { useState } from 'react';
import { showToast } from '@/lib/toast';
import Avatar from '@/components/_admin/ui/Avatar';
import Badge from '@/components/_admin/ui/Badge';
import Button from '@/components/_admin/ui/Button';
import SectionCard from '@/components/_admin/ui/SectionCard';
import SectionHeader from '@/components/_admin/ui/SectionHeader';
import InviteUserModal from '@/features/_admin/users/InviteUserModal';
import EditRoleModal from '@/features/_admin/users/EditRoleModal';
import Table from '@/components/_admin/ui/Table';
import { IdentityCell, MutedCell, ActionsCell } from '@/components/_admin/table-cells';

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
  const [modal, setModal] = useState<'invite' | 'role' | null>(null);
  return (
    <SectionCard>
      <SectionHeader
        title="Users & Roles"
        sub="4 of 10 users · You are Super Admin"
        right={
          <Button sm onClick={() => setModal('invite')}>
            + Invite User
          </Button>
        }
      />
      <Table className="@max-mobile:hidden">
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
              <IdentityCell sm={false} initials={u.initials} bg={u.bg} name={u.name} />
              <td className="text-ink-2">{u.email}</td>
              <td>
                <Badge color={u.roleBadge}>{u.role}</Badge>
              </td>
              <MutedCell>{u.login}</MutedCell>
              {u.you ? (
                <td>
                  <span className="text-xs text-ink-3">You</span>
                </td>
              ) : (
                <ActionsCell>
                  <Button variant="ghost" sm onClick={() => setModal('role')}>
                    Edit Role
                  </Button>
                  <Button variant="danger" sm onClick={() => showToast(`⚠️ ${u.name} deactivated`)}>
                    Deactivate
                  </Button>
                </ActionsCell>
              )}
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="hidden flex-col gap-2 p-3 @max-mobile:flex">
        {users.map((u) => (
          <div key={u.name} className="w-full overflow-hidden rounded-el border border-line bg-surface-2">
            <div className="flex items-center gap-2.5 p-3">
              <Avatar initials={u.initials} bg={u.bg} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-semibold text-ink">{u.name}</p>
                <p className="truncate text-[11px] text-ink-3">{u.email}</p>
              </div>
              <Badge color={u.roleBadge}>{u.role}</Badge>
            </div>
            <div className="flex items-center gap-2 border-t border-line px-3 py-2.5">
              <p className="text-[11px] text-ink-3">{u.login}</p>
              {u.you ? (
                <p className="ml-auto text-xs text-ink-3">You</p>
              ) : (
                <div className="ml-auto flex gap-1.5">
                  <Button variant="ghost" sm onClick={() => setModal('role')}>
                    Edit Role
                  </Button>
                  <Button variant="danger" sm onClick={() => showToast(`⚠️ ${u.name} deactivated`)}>
                    Deactivate
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <InviteUserModal open={modal === 'invite'} onClose={() => setModal(null)} />
      <EditRoleModal open={modal === 'role'} onClose={() => setModal(null)} />
    </SectionCard>
  );
}
