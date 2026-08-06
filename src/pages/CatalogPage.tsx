import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import { showToast } from '@/store/uiSlice';
import { cn } from '@/lib/cn';
import { ROUTING } from '@/lib/routing';
import {
  setTab,
  setGenFilter,
  toggleModelVisible,
  toggleGenVisible,
  initModelEditor,
  initGenEditor,
} from '@/features/catalog/catalogSlice';
import { Badge, Button, SectionHeader, Toggle } from '@/components/ui';

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
      <div className="flex gap-0.5 border-b border-line px-5 pt-4">
        {(['models', 'gen'] as const).map((t) => (
          <div
            key={t}
            onClick={() => dispatch(setTab(t))}
            className={cn(
              'cursor-pointer border-b-2 px-4 py-2 text-[13px] font-semibold transition-all duration-150',
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
          <table>
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
                          dispatch(showToast('👁️ Visibility updated'));
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'gen' && (
        <div>
          <div className="flex items-center gap-4 border-t border-b border-line bg-surface-2 px-5 py-4">
            <label className="whitespace-nowrap">Model</label>
            <select
              className="max-w-[280px]"
              value={genFilter}
              onChange={(e) => dispatch(setGenFilter(e.target.value))}
            >
              <option value="">— Select a model —</option>
              {models.map((m) => (
                <option key={m.name} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
            {genFilter && (
              <Badge color="gray">
                {filteredGens.length} generation{filteredGens.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>

          {!genFilter ? (
            <div className="px-5 py-12 text-center text-ink-3">
              <div className="mb-3 text-[32px]">📋</div>
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
              <table>
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
                              dispatch(showToast('👁️ Visibility updated'));
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
