import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import { showToast } from '@/lib/toast';
import { cn } from '@/lib/cn';
import { ROUTING } from '@/lib/routing';
import {
  setTab,
  setGenFilter,
  toggleModelVisible,
  toggleGenVisible,
  initModelEditor,
  initGenEditor,
} from '@/features/_admin/catalog/catalogSlice';
import Badge from '@/components/_admin/ui/Badge';
import Button from '@/components/_admin/ui/Button';
import SectionHeader from '@/components/_admin/ui/SectionHeader';
import Select from '@/components/_admin/forms/Select';
import Toggle from '@/components/_admin/forms/Toggle';
import Table from '@/components/_admin/ui/Table';

export default function CatalogPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { tab, genFilter, models, gens } = useAppSelector((s) => s.catalog);

  const openModel = (name: string | null) => {
    dispatch(initModelEditor(name));
    navigate(`${ROUTING.adminCatalogModel}${name ? encodeURIComponent(name) : 'new'}`);
  };
  const openGen = (name: string | null, model: string) => {
    dispatch(initGenEditor({ name, model }));
    navigate(`${ROUTING.adminCatalogGen}${name ? encodeURIComponent(name) : 'new'}`);
  };

  const filteredGens = genFilter ? (gens[genFilter] ?? []) : [];

  return (
    <div className="rounded-card border border-line bg-surface">
      <div className="flex gap-0.5 border-b border-line px-5 pt-3 md:pt-4">
        {(['models', 'gen'] as const).map((t) => (
          <div
            key={t}
            onClick={() => dispatch(setTab(t))}
            className={cn(
              'cursor-pointer border-b-2 px-3 py-2 text-[13px] font-semibold transition-all duration-150 md:px-4',
              tab === t ? 'border-accent text-accent-light' : 'border-transparent text-ink-3 hover:text-ink',
            )}
          >
            {t === 'models' ? 'Models' : 'Generations'}
          </div>
        ))}
      </div>

      {tab === 'models' && (
        <div>
          <SectionHeader
            title="BMW Models"
            sub="47 models · 134 generations total"
            right={
              <Button sm onClick={() => openModel(null)}>
                + Add Model
              </Button>
            }
          />
          <Table>
            <thead>
              <tr>
                <th>Model Name</th>
                <th>Years</th>
                <th>Generations</th>
                <th>Logbooks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {models.map((m) => (
                <tr key={m.name} className="cursor-pointer" onClick={() => openModel(m.name)}>
                  <td>
                    <div className="text-[13.5px] font-semibold text-ink">{m.name}</div>
                  </td>
                  <td className="text-ink-3">{m.years}</td>
                  <td>{m.generations}</td>
                  <td>
                    <Badge color={m.badge}>{m.logbooks}</Badge>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="ghost"
                        sm
                        onClick={(e) => {
                          e.stopPropagation();
                          openModel(m.name);
                        }}
                      >
                        Edit
                      </Button>
                      <Toggle
                        on={m.visible}
                        title="Toggle visibility"
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(toggleModelVisible(m.name));
                          showToast('👁️ Visibility updated');
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {tab === 'gen' && (
        <div>
          <div className="flex items-center gap-3 border-t border-b border-line bg-surface-2 px-5 py-3 md:gap-4 md:py-4">
            <label className="whitespace-nowrap">Model</label>
            <Select
              className="max-w-[280px]"
              placeholder="— Select a model —"
              value={genFilter}
              onChange={(v) => dispatch(setGenFilter(v))}
              options={models.map((m) => m.name)}
            />
            {genFilter && (
              <Badge color="gray">
                {filteredGens.length} generation{filteredGens.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>

          {!genFilter ? (
            <div className="px-5 py-12 text-center text-ink-3">
              <div className="mb-2 text-[32px] md:mb-3">📋</div>
              <div className="mb-1 text-sm font-semibold text-ink-2">Select a model</div>
              <div className="text-[13px]">Choose a model above to view and manage its generations</div>
            </div>
          ) : (
            <div>
              <SectionHeader
                title={`${genFilter} — Generations`}
                right={
                  <Button sm onClick={() => openGen(null, genFilter)}>
                    + Add Generation
                  </Button>
                }
              />
              <Table>
                <thead>
                  <tr>
                    <th>Generation</th>
                    <th>Years</th>
                    <th>Logbooks</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGens.map((g) => (
                    <tr key={g.name} className="cursor-pointer" onClick={() => openGen(g.name, genFilter)}>
                      <td>
                        <div className="text-[13.5px] font-semibold text-ink">{g.name}</div>
                      </td>
                      <td className="text-ink-3">{g.years}</td>
                      <td>
                        <Badge color={g.badge}>{g.logbooks}</Badge>
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="ghost"
                            sm
                            onClick={(e) => {
                              e.stopPropagation();
                              openGen(g.name, genFilter);
                            }}
                          >
                            Edit
                          </Button>
                          <Toggle
                            on={g.visible}
                            title="Toggle visibility"
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(toggleGenVisible({ model: genFilter, name: g.name }));
                              showToast('👁️ Visibility updated');
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
