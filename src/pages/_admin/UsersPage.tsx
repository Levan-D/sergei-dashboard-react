import { useState } from 'react';
import { showToast } from '@/lib/toast';
import { brand } from '@/lib/brand';
import { fmtRelativeTime } from '@/lib/time';
import { initialsOf } from '@/lib/initials';
import {
  useGetAdminStaffQuery,
  useDeactivateAdminStaffMutation,
  type AdminStaffType,
} from '@/lib/redux/api/admin-api/staff/staff-api';
import Avatar from '@/components/_admin/ui/Avatar';
import Badge from '@/components/_admin/ui/Badge';
import Button from '@/components/_admin/ui/Button';
import Spinner from '@/components/_admin/ui/Spinner';
import ErrorState from '@/components/_admin/ui/ErrorState';
import SectionCard from '@/components/_admin/ui/SectionCard';
import SectionHeader from '@/components/_admin/ui/SectionHeader';
import InviteUserModal from '@/features/_admin/users/InviteUserModal';
import EditRoleModal from '@/features/_admin/users/EditRoleModal';
import ConfirmModal from '@/components/_admin/ConfirmModal';
import Table from '@/components/_admin/ui/Table';
import { IdentityCell, MutedCell, ActionsCell } from '@/components/_admin/table-cells';

const ROLE_LABELS = { admin: 'Admin', superadmin: 'Super Admin' } as const;

type RowActionsProps = {
  member: AdminStaffType;
  canManage: boolean;
  onEditRole: (member: AdminStaffType) => void;
  onDeactivate: (member: AdminStaffType) => void;
};

function RowActions({ member, canManage, onEditRole, onDeactivate }: RowActionsProps) {
  if (member.you) return <span className="text-xs text-ink-3">You</span>;
  if (!member.active) return <Badge color="red">Inactive</Badge>;
  if (!canManage) return null;
  return (
    <>
      <Button variant="ghost" sm onClick={() => onEditRole(member)}>
        Edit Role
      </Button>
      <Button variant="danger" sm onClick={() => onDeactivate(member)}>
        Deactivate
      </Button>
    </>
  );
}

type Props = {
  staff: AdminStaffType[];
  count: number;
  onRefetch: () => void;
};

function UsersTable({ staff, count, onRefetch }: Props) {
  const [modal, setModal] = useState<'invite' | 'role' | 'deactivate' | null>(null);
  const [selected, setSelected] = useState<AdminStaffType | null>(null);
  const [deactivateStaff, { isLoading: isDeactivating }] = useDeactivateAdminStaffMutation();

  const me = staff.find((m) => m.you);
  const canManage = me?.role === 'superadmin';

  const onEditRole = (member: AdminStaffType) => {
    setSelected(member);
    setModal('role');
  };

  const onDeactivate = (member: AdminStaffType) => {
    setSelected(member);
    setModal('deactivate');
  };

  const closeModal = () => {
    setModal(null);
    setSelected(null);
  };

  const confirmDeactivate = async () => {
    if (!selected) return;
    try {
      await deactivateStaff({ subdomain: brand.makeSlug, id: selected.id }).unwrap();
      showToast(`⚠️ ${selected.name} deactivated`);
      onRefetch();
      closeModal();
    } catch {
      showToast('⚠️ Could not deactivate this user');
    }
  };

  return (
    <SectionCard>
      <SectionHeader
        title="Users & Roles"
        sub={`${count} user${count !== 1 ? 's' : ''}${me ? ` · You are ${ROLE_LABELS[me.role]}` : ''}`}
        right={
          canManage ? (
            <Button sm onClick={() => setModal('invite')}>
              + Invite User
            </Button>
          ) : null
        }
      />
      <Table className="@max-table:hidden">
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
          {staff.map((member) => (
            <tr key={member.id}>
              <IdentityCell sm={false} initials={initialsOf(member.name)} name={member.name} />
              <td className="text-ink-2">{member.email}</td>
              <td>
                <Badge color={member.role === 'superadmin' ? 'blue' : 'gray'}>{ROLE_LABELS[member.role]}</Badge>
              </td>
              <MutedCell>{fmtRelativeTime(member.last_login_at)}</MutedCell>
              <ActionsCell>
                <RowActions member={member} canManage={canManage} onEditRole={onEditRole} onDeactivate={onDeactivate} />
              </ActionsCell>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="hidden flex-col gap-2 p-3 @max-table:flex">
        {staff.map((member) => (
          <div key={member.id} className="w-full overflow-hidden rounded-el border border-line bg-surface-2">
            <div className="flex items-center gap-2.5 p-3">
              <Avatar initials={initialsOf(member.name)} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-semibold text-ink">{member.name}</p>
                <p className="truncate text-[11px] text-ink-3">{member.email}</p>
              </div>
              <Badge color={member.role === 'superadmin' ? 'blue' : 'gray'}>{ROLE_LABELS[member.role]}</Badge>
            </div>
            <div className="flex items-center gap-2 border-t border-line px-3 py-2.5">
              <p className="text-[11px] text-ink-3">{fmtRelativeTime(member.last_login_at)}</p>
              <div className="ml-auto flex gap-1.5">
                <RowActions member={member} canManage={canManage} onEditRole={onEditRole} onDeactivate={onDeactivate} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <InviteUserModal open={modal === 'invite'} onClose={closeModal} onSaved={onRefetch} />
      <EditRoleModal open={modal === 'role'} member={selected} onClose={closeModal} onSaved={onRefetch} />
      <ConfirmModal
        open={modal === 'deactivate'}
        title={`Deactivate ${selected?.name ?? ''}?`}
        description={['They will immediately lose access to this brand admin.']}
        actionLabel="Deactivate"
        loading={isDeactivating}
        onConfirm={confirmDeactivate}
        onClose={closeModal}
      />
    </SectionCard>
  );
}

export default function UsersPage() {
  const { data, isError, error, isFetching, refetch } = useGetAdminStaffQuery({ subdomain: brand.makeSlug });

  if (isError && !data) return <ErrorState error={error} isRetrying={isFetching} onRetry={refetch} />;
  if (!data) return <Spinner />;
  return <UsersTable staff={data.items} count={data.count ?? data.items.length} onRefetch={refetch} />;
}
