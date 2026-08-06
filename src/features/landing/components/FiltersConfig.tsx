import { useAppDispatch, useAppSelector } from '@/store';
import { showToast } from '@/store/uiSlice';
import { toggleDecadesFilter, toggleBodyType, togglePowerType } from '../landingSlice';
import { Button, Chip, SectionCard, SectionHeader, Toggle } from '@/components/ui';

export function FiltersConfig() {
  const dispatch = useAppDispatch();
  const { decadesFilter, bodyTypes, powerTypes } = useAppSelector((s) => s.landing);
  return (
    <SectionCard>
      <SectionHeader
        title="Filters Configuration"
        sub="Visible filters on the models section"
        right={
          <Button sm onClick={() => dispatch(showToast('✅ Filters saved'))}>
            Save
          </Button>
        }
      />
      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-center gap-2.5">
          <Toggle on={decadesFilter} onClick={() => dispatch(toggleDecadesFilter())} />
          <label>Decades filter (1960s, 1970s … 2020s)</label>
        </div>
        <div>
          <label className="mb-2 block">Body Types</label>
          <div className="flex flex-wrap gap-2">
            {bodyTypes.map((c) => (
              <Chip
                key={c.label}
                label={c.label}
                active={c.active}
                withX
                onClick={() => dispatch(toggleBodyType(c.label))}
              />
            ))}
          </div>
        </div>
        <div>
          <label className="mb-2 block">Power Types</label>
          <div className="flex flex-wrap gap-2">
            {powerTypes.map((c) => (
              <Chip
                key={c.label}
                label={c.label}
                active={c.active}
                withX
                onClick={() => dispatch(togglePowerType(c.label))}
              />
            ))}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
