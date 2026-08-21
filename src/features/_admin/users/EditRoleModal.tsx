import { useEffect, useState } from 'react';
import Modal from '@/components/_admin/Modal';
import { showToast } from '@/lib/toast';
import { brand } from '@/lib/brand';
import {
  useUpdateAdminStaffMutation,
  type AdminStaffType,
} from '@/lib/redux/api/admin-api/staff/staff-api';
import type { AdminStaffRoleType } from '@/lib/redux/api/admin-api/admin-types';
import Button from '@/components/_admin/ui/Button';
import FormGroup from '@/components/_admin/forms/FormGroup';
import Select from '@/components/_admin/forms/Select';

const ROLE_LABELS: Record<AdminStaffRoleType, string> = { admin: 'Admin', superadmin: 'Super Admin' };
const ROLE_BY_LABEL: Record<string, AdminStaffRoleType> = { Admin: 'admin', 'Super Admin': 'superadmin' };

type Props = {
  open: boolean;
  member: AdminStaffType | null;
  onClose: () => void;
  onSaved: () => void;
};

export default function EditRoleModal({ open, member, onClose, onSaved }: Props) {
  const [updateStaff, { isLoading }] = useUpdateAdminStaffMutation();
  const [roleLabel, setRoleLabel] = useState('Admin');

  useEffect(() => {
    if (open && member) setRoleLabel(ROLE_LABELS[member.role]);
  }, [open, member]);

  const onSave = async () => {
    if (!member) return;
    try {
      await updateStaff({ subdomain: brand.makeSlug, id: member.id, role: ROLE_BY_LABEL[roleLabel] }).unwrap();
      showToast('✅ Role updated');
      onSaved();
      onClose();
    } catch {
      showToast('⚠️ Could not update role');
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Edit Role — ${member?.name ?? ''}`}
      width={360}
      footer={
        <>
          <Button variant="ghost" disabled={isLoading} onClick={onClose}>
            Cancel
          </Button>
          <Button loading={isLoading} disabled={!member || ROLE_LABELS[member.role] === roleLabel} onClick={onSave}>
            Save
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3 p-5 @mobile:gap-4">
        <FormGroup label="Role">
          <Select options={Object.values(ROLE_LABELS)} value={roleLabel} onChange={setRoleLabel} />
        </FormGroup>
      </div>
    </Modal>
  );
}
