import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store';
import { showToast } from '@/store/uiSlice';
import { ROUTING } from '@/lib/routing';
import { Button, FormGroup, SectionCard, SectionHeader, Toggle } from '@/components/ui';

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [maint, setMaint] = useState(false);

  return (
    <SectionCard>
      <SectionHeader
        title="General Settings"
        right={
          <Button sm onClick={() => dispatch(showToast('✅ Settings saved'))}>
            Save Changes
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-4 p-5">
        <FormGroup label="Brand Name">
          <input type="text" defaultValue="BMW" />
        </FormGroup>
        <FormGroup label="Domain">
          <input type="text" defaultValue="bmw.motority.com" />
        </FormGroup>
        <FormGroup label="Contact Email">
          <input type="email" defaultValue="admin@bmw-motority.com" />
        </FormGroup>
        <FormGroup label="Default Language">
          <select>
            <option>English</option>
            <option>Deutsch</option>
            <option>Русский</option>
          </select>
        </FormGroup>
      </div>
      <div className="px-5 pb-5">
        <div className="rounded-card border border-line bg-surface-2 p-4">
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
                dispatch(showToast(next ? '⚠️ Maintenance mode enabled' : '✅ Maintenance mode disabled'));
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
        <div className="mb-3 text-xs font-bold tracking-[.06em] text-ink-2 uppercase">Backup &amp; Restore</div>
        <div className="flex gap-1.5">
          <Button variant="ghost" onClick={() => dispatch(showToast('💾 Manual backup created'))}>
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
