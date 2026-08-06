import Modal from '@/components/_admin/Modal';
import { showToast } from '@/lib/toast';
import Button from '@/components/_admin/ui/Button';
import FormGroup from '@/components/_admin/forms/FormGroup';
import Select from '@/components/_admin/forms/Select';
import UploadZone from '@/components/_admin/forms/UploadZone';
import Input from '@/components/_admin/forms/Input';
import Textarea from '@/components/_admin/forms/Textarea';

type Props = { open: boolean; onClose: () => void };

export default function AddModelModal({ open, onClose }: Props) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Model"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onClose();
              showToast('✅ Model saved successfully');
            }}
          >
            Save Model
          </Button>
        </>
      }
    >
      <div className="flex flex-wrap gap-3 p-5 md:gap-4">
        <FormGroup half label="Model Name">
          <Input type="text" placeholder="e.g. BMW M5" />
        </FormGroup>
        <FormGroup half label="Production Years">
          <Input type="text" placeholder="e.g. 2021 – Present" />
        </FormGroup>
        <FormGroup label="Description" full>
          <Textarea rows={3} placeholder="Model description..." />
        </FormGroup>
        <FormGroup half label="Body Type">
          <Select options={['Sedan', 'Coupe', 'SAV', 'Convertible', 'Touring']} />
        </FormGroup>
        <FormGroup half label="Power Type">
          <Select options={['Combustion', 'Electric', 'Hybrid']} />
        </FormGroup>
        <FormGroup label="Main Image" full>
          <UploadZone
            icon="🖼️"
            text="Upload model image"
            hint="JPG, WebP · max 5MB"
            onClick={() => showToast('📁 File picker opened')}
          />
        </FormGroup>
        <FormGroup label="External Links" full>
          <div className="flex flex-col gap-2">
            <Input type="url" placeholder="Buy car link" />
            <Input type="url" placeholder="Official site link" />
            <Input type="url" placeholder="Configurator link" />
          </div>
        </FormGroup>
      </div>
    </Modal>
  );
}
