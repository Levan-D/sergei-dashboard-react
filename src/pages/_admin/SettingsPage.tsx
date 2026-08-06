import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '@/lib/toast';
import { ROUTING } from '@/lib/routing';
import Button from '@/components/_admin/ui/Button';
import SectionCard from '@/components/_admin/ui/SectionCard';
import SectionHeader from '@/components/_admin/ui/SectionHeader';
import FormGroup from '@/components/_admin/forms/FormGroup';
import Select from '@/components/_admin/forms/Select';
import Toggle from '@/components/_admin/forms/Toggle';
import Input from '@/components/_admin/forms/Input';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [maint, setMaint] = useState(false);

  return (
    <SectionCard>
      <SectionHeader
        title="General Settings"
        right={
          <Button sm onClick={() => showToast('✅ Settings saved')}>
            Save Changes
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-3 p-5 md:gap-4">
        <FormGroup label="Brand Name">
          <Input type="text" defaultValue="BMW" />
        </FormGroup>
        <FormGroup label="Domain">
          <Input type="text" defaultValue="bmw.motority.com" />
        </FormGroup>
        <FormGroup label="Contact Email">
          <Input type="email" defaultValue="admin@bmw-motority.com" />
        </FormGroup>
        <FormGroup label="Default Language">
          <Select options={['English', 'Deutsch', 'Русский']} />
        </FormGroup>
      </div>
      <div className="px-5 pb-5">
        <div className="rounded-card border border-line bg-surface-2 p-3 md:p-4">
          <div className="mb-2.5 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-ink">Maintenance Mode</div>
              <div className="mt-0.5 text-xs text-ink-3">Show placeholder page to visitors</div>
            </div>
            <Toggle
              on={maint}
              onClick={() => {
                const next = !maint;
                setMaint(next);
                showToast(next ? '⚠️ Maintenance mode enabled' : '✅ Maintenance mode disabled');
              }}
            />
          </div>
          {maint && (
            <div className="rounded-el bg-yellow-bg p-2.5 text-xs text-yellow">
              ⚠️ Maintenance mode is ON — visitors see a placeholder page
            </div>
          )}
        </div>
      </div>
      <div className="px-5 pb-5">
        <div className="mb-2 text-xs font-bold tracking-[.06em] text-ink-2 uppercase md:mb-3">Backup &amp; Restore</div>
        <div className="flex gap-1.5">
          <Button variant="ghost" onClick={() => showToast('💾 Manual backup created')}>
            Create Backup
          </Button>
          <Button variant="ghost" onClick={() => navigate(ROUTING.adminHistory)}>
            Restore from History
          </Button>
        </div>
      </div>
    </SectionCard>
  );
}
