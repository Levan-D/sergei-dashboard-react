import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import { showToast } from '@/lib/toast';
import { ROUTING } from '@/lib/routing';
import { toggleLandingModelVisible } from '../landingSlice';
import Badge from '@/components/_admin/ui/Badge';
import Button from '@/components/_admin/ui/Button';
import SectionCard from '@/components/_admin/ui/SectionCard';
import SectionHeader from '@/components/_admin/ui/SectionHeader';
import Toggle from '@/components/_admin/forms/Toggle';
import AddModelModal from './AddModelModal';
import Table from '@/components/_admin/ui/Table';

export function ModelsOnLanding() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const models = useAppSelector((s) => s.landing.models);
  const [addOpen, setAddOpen] = useState(false);
  return (
    <SectionCard>
      <SectionHeader
        title="Models on Landing"
        sub="47 models visible"
        right={
          <div className="flex gap-1.5">
            <Button variant="ghost" sm onClick={() => navigate(ROUTING.adminCatalog)}>
              Manage in Catalog
            </Button>
            <Button sm onClick={() => setAddOpen(true)}>
              + Add Model
            </Button>
          </div>
        }
      />
      <Table>
        <thead>
          <tr>
            <th>Model</th>
            <th>Generations</th>
            <th>Logbooks</th>
            <th>Visible</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {models.map((m) => (
            <tr key={m.name}>
              <td>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-10 shrink-0 items-center justify-center rounded-[5px] bg-surface-3 text-sm">
                    {m.emoji}
                  </div>
                  <div>
                    <div className="text-[13.5px] font-semibold text-ink">{m.name}</div>
                    <div className="text-[11px] text-ink-3">{m.meta}</div>
                  </div>
                </div>
              </td>
              <td>{m.generations}</td>
              <td>
                <Badge color={m.badge}>{m.logbooks}</Badge>
              </td>
              <td>
                <Toggle
                  on={m.visible}
                  onClick={() => {
                    dispatch(toggleLandingModelVisible(m.name));
                    showToast('👁️ Visibility updated');
                  }}
                />
              </td>
              <td>
                <div className="flex gap-1.5">
                  <Button variant="ghost" sm onClick={() => navigate(ROUTING.adminCatalog)}>
                    Edit
                  </Button>
                  <Button variant="danger" sm onClick={() => showToast('ℹ️ Hidden from landing')}>
                    Hide
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <AddModelModal open={addOpen} onClose={() => setAddOpen(false)} />
    </SectionCard>
  );
}
