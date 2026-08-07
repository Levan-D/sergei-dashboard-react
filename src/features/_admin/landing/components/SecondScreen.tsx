import { showToast } from '@/lib/toast';
import { cn } from '@/lib/cn';
import Button from '@/components/_admin/ui/Button';
import SectionCard from '@/components/_admin/ui/SectionCard';
import SectionHeader from '@/components/_admin/ui/SectionHeader';
import FormGroup from '@/components/_admin/forms/FormGroup';
import Input from '@/components/_admin/forms/Input';
import Textarea from '@/components/_admin/forms/Textarea';

const facts = [
  { name: 'Founded', value: '1916' },
  { name: 'Headquarters', value: 'Munich, Germany' },
  { name: 'Models in lineup', value: '47 models' },
  { name: 'Global employees', value: '149,475' },
  { name: 'Annual production', value: '2.5M vehicles' },
  { name: 'Countries sold in', value: '140+ countries' },
];

const motorityStats = [
  { label: 'Total Logbooks', value: '2,841' },
  { label: 'Active Owners', value: '1,203' },
  { label: 'New This Month', value: '+47', color: 'var(--green)' },
  { label: 'Avg. Ownership', value: '3.2 yr' },
  { label: 'Top Model', value: 'BMW 3 Series', small: true },
  { label: 'Avg. Mileage', value: '48k km' },
];

export function SecondScreen() {
  return (
    <SectionCard>
      <SectionHeader
        title="Second Screen"
        sub={<>About, Facts &amp; Motority Stats block</>}
        right={
          <Button sm onClick={() => showToast('✅ Second screen saved')}>
            Save Changes
          </Button>
        }
      />
      <div className="border-b border-line p-5">
        <div className="mb-2 text-xs font-bold tracking-[.06em] text-ink-2 uppercase @mobile:mb-3">
          About{' '}
          <span className="text-[11px] font-normal tracking-normal text-ink-3 normal-case">
            — pulled from Motority, editable
          </span>
        </div>
        <FormGroup label="Brand Description">
          <Textarea
            rows={5}
            defaultValue="BMW is a German multinational manufacturer of luxury vehicles and motorcycles headquartered in Munich, Bavaria, Germany. The corporation was founded in 1916 and has established itself as one of the most recognisable automotive brands in the world, known for precision engineering and performance-oriented vehicles."
          />
        </FormGroup>
      </div>
      <div className="border-b border-line p-5">
        <div className="mb-2 text-xs font-bold tracking-[.06em] text-ink-2 uppercase @mobile:mb-3">
          Facts{' '}
          <span className="text-[11px] font-normal tracking-normal text-ink-3 normal-case">
            — pulled from Motority, editable
          </span>
        </div>
        <div className="flex flex-wrap gap-2 @mobile:gap-3">
          {facts.map((f, i) => (
            <div
              key={i}
              className="flex w-full flex-col gap-2 rounded-el border border-line bg-surface-2 p-3.5 @mobile:w-[calc(50%-6px)]"
            >
              <div className="text-[10px] font-bold tracking-[.06em] text-ink-3 uppercase">Fact {i + 1}</div>
              <Input type="text" placeholder="Fact name" defaultValue={f.name} />
              <Input type="text" placeholder="Fact value" defaultValue={f.value} />
            </div>
          ))}
        </div>
      </div>
      <div className="p-5">
        <div className="mb-2 flex items-center gap-2 @mobile:mb-3">
          <div className="text-xs font-bold tracking-[.06em] text-ink-2 uppercase">Motority Stats</div>
          <span className="rounded-[20px] border border-line bg-surface-3 px-2 py-0.5 text-[11px] text-ink-3">
            Read-only · auto-updated
          </span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {motorityStats.map((s) => (
            <div
              key={s.label}
              className="w-full rounded-el border border-line bg-surface-2 p-3.5 @sm:w-[calc(50%-5px)] @mobile:w-[calc((100%-20px)/3)]"
            >
              <div className="mb-1 text-[11px] text-ink-3">{s.label}</div>
              <div
                className={cn('font-mono font-bold', s.small ? 'text-[15px]' : 'text-[22px]')}
                style={{ color: s.color ?? 'var(--text)' }}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2.5 text-[11px] text-ink-3">
          Stats are pulled live from Motority and cannot be edited here.
        </div>
      </div>
    </SectionCard>
  );
}
