import { useForm, Controller } from 'react-hook-form';
import Modal from '@/components/_admin/Modal';
import { showToast } from '@/lib/toast';
import { brand } from '@/lib/brand';
import { useInviteAdminStaffMutation } from '@/lib/redux/api/admin-api/staff/staff-api';
import type { AdminStaffRoleType } from '@/lib/redux/api/admin-api/admin-types';
import Button from '@/components/_admin/ui/Button';
import FormGroup from '@/components/_admin/forms/FormGroup';
import Select from '@/components/_admin/forms/Select';
import Input from '@/components/_admin/forms/Input';

const ROLE_BY_LABEL: Record<string, AdminStaffRoleType> = { Admin: 'admin', 'Super Admin': 'superadmin' };

type InviteFormValues = {
  name: string;
  email: string;
  role: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
};

export default function InviteUserModal({ open, onClose, onSaved }: Props) {
  const [inviteStaff] = useInviteAdminStaffMutation();
  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = useForm<InviteFormValues>({ defaultValues: { name: '', email: '', role: 'Admin' } });
  const email = watch('email');
  const name = watch('name');

  const close = () => {
    reset();
    onClose();
  };

  const onSubmit = async (values: InviteFormValues) => {
    try {
      await inviteStaff({
        subdomain: brand.makeSlug,
        fullName: values.name,
        email: values.email,
        role: ROLE_BY_LABEL[values.role] ?? 'admin',
      }).unwrap();
      showToast('📧 Invitation sent!');
      onSaved();
      close();
    } catch {
      showToast('⚠️ Could not send the invitation');
    }
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title="Invite User"
      width={420}
      footer={
        <>
          <Button variant="ghost" disabled={isSubmitting} onClick={close}>
            Cancel
          </Button>
          <Button loading={isSubmitting} disabled={!email.trim() || !name.trim()} onClick={handleSubmit(onSubmit)}>
            Send Invitation
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3 p-5 @mobile:gap-4">
        <FormGroup label="Full Name">
          <Input type="text" placeholder="e.g. John Smith" {...register('name')} />
        </FormGroup>
        <FormGroup label="Email Address">
          <Input type="email" placeholder="john@company.com" {...register('email')} />
        </FormGroup>
        <FormGroup label="Role">
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select options={Object.keys(ROLE_BY_LABEL)} value={field.value} onChange={field.onChange} />
            )}
          />
        </FormGroup>
        <p className="rounded-el bg-surface-2 p-2 text-xs text-ink-3 @mobile:p-3">
          A temporary password will be sent to this email. The user must change it on first login.
        </p>
      </div>
    </Modal>
  );
}
