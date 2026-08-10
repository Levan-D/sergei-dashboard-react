import Modal from '@/components/_admin/Modal';
import { showToast } from '@/lib/toast';
import Button from '@/components/_admin/ui/Button';
import FormGroup from '@/components/_admin/forms/FormGroup';
import Select from '@/components/_admin/forms/Select';
import Input from '@/components/_admin/forms/Input';

type Props = { open: boolean; onClose: () => void };

export default function InviteUserModal({ open, onClose }: Props) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Invite User"
      width={420}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onClose();
              showToast('📧 Invitation sent!');
            }}
          >
            Send Invitation
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3 p-5 @mobile:gap-4">
        <FormGroup label="Full Name">
          <Input type="text" placeholder="e.g. John Smith" />
        </FormGroup>
        <FormGroup label="Email Address">
          <Input type="email" placeholder="john@company.com" />
        </FormGroup>
        <FormGroup label="Role">
          <Select options={['Admin', 'Super Admin']} />
        </FormGroup>
        <p className="rounded-el bg-surface-2 p-2 text-xs text-ink-3 @mobile:p-3">
          A temporary password will be sent to this email. The user must change it on first login.
        </p>
      </div>
    </Modal>
  );
}
