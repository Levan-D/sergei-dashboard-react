import Modal from '@/components/_admin/Modal';
import { showToast } from '@/lib/toast';
import Button from '@/components/_admin/ui/Button';
import FormGroup from '@/components/_admin/forms/FormGroup';
import Select from '@/components/_admin/forms/Select';

type Props = { open: boolean; onClose: () => void };

export default function EditRoleModal({ open, onClose }: Props) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit Role — Max Richter"
      width={360}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onClose();
              showToast('✅ Role updated');
            }}
          >
            Save
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3 p-5 md:gap-4">
        <FormGroup label="Role">
          <Select options={['Admin', 'Super Admin']} />
        </FormGroup>
      </div>
    </Modal>
  );
}
