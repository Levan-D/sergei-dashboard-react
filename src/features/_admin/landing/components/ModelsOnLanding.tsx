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
import Table from '@/components/_admin/ui/Table';
import { ActionsCell } from '@/components/_admin/table-cells';
import AddModelModal from './AddModelModal';

export function ModelsOnLanding() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const models = useAppSelector((s) => s.landing.models);
  const [addOpen, setAddOpen] = useState(false);

  const toggleVisible = (name: string) => {
    dispatch(toggleLandingModelVisible(name));
    showToast('👁️ Visibility updated');
  };

  const actions = (
    <>
      <Button variant="ghost" sm onClick={() => navigate(ROUTING.adminCatalog)}>
        Manage in Catalog
      </Button>
      <Button sm onClick={() => setAddOpen(true)}>
        + Add Model
      </Button>
    </>
  );

  return (
    <SectionCard>
      <SectionHeader
        title="Models on Landing"
        sub="47 models visible"
        right={<div className="flex gap-1.5 @max-mobile:hidden">{actions}</div>}
      />
      <div className="hidden flex-wrap gap-1.5 border-b border-line px-5 py-3 @max-mobile:flex">{actions}</div>

      <Table className="@max-mobile:hidden">
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
                    <p className="text-[13.5px] font-semibold text-ink">{m.name}</p>
                    <p className="text-[11px] text-ink-3">{m.meta}</p>
                  </div>
                </div>
              </td>
              <td>{m.generations}</td>
              <td>
                <Badge color={m.badge}>{m.logbooks}</Badge>
              </td>
              <td>
                <Toggle on={m.visible} onClick={() => toggleVisible(m.name)} />
              </td>
              <ActionsCell>
                <Button variant="ghost" sm onClick={() => navigate(ROUTING.adminCatalog)}>
                  Edit
                </Button>
                <Button variant="danger" sm onClick={() => showToast('ℹ️ Hidden from landing')}>
                  Hide
                </Button>
              </ActionsCell>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="hidden flex-col gap-2 p-3 @max-mobile:flex">
        {models.map((m) => (
          <div key={m.name} className="w-full overflow-hidden rounded-el border border-line bg-surface-2">
            <div className="flex items-center gap-2.5 p-3">
              <div className="flex h-7 w-10 shrink-0 items-center justify-center rounded-[5px] bg-surface-3 text-sm">
                {m.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-semibold text-ink">{m.name}</p>
                <p className="text-[11px] text-ink-3">{m.meta}</p>
              </div>
              <Toggle on={m.visible} title="Visible on landing" onClick={() => toggleVisible(m.name)} />
            </div>
            <div className="flex items-center gap-2 border-t border-line px-3 py-2.5">
              <p className="text-[12px] text-ink-3">{m.generations} gens</p>
              <Badge color={m.badge}>{m.logbooks}</Badge>
              <div className="ml-auto flex gap-1.5">
                <Button variant="ghost" sm onClick={() => navigate(ROUTING.adminCatalog)}>
                  Edit
                </Button>
                <Button variant="danger" sm onClick={() => showToast('ℹ️ Hidden from landing')}>
                  Hide
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <AddModelModal open={addOpen} onClose={() => setAddOpen(false)} />
    </SectionCard>
  );
}
