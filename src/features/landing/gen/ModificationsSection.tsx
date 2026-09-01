import Container from '@/components/landing/Container';
import SectionTitle from '@/components/landing/SectionTitle';
import SelectField from '@/components/landing/SelectField';
import { modSpecColumns } from '@/features/landing/data';
import {
  IconEngine,
  IconVolume,
  IconPower,
  IconTransmission,
  IconDrivetrain,
  IconCountry,
  IconAcceleration,
  IconTopSpeed,
  IconFuel,
  type IconProps,
} from '@/components/landing/icons';
import type { ComponentType } from 'react';

const highlights: { icon: ComponentType<IconProps>; label: string; value: string }[] = [
  { icon: IconEngine, label: 'Engine type', value: 'GASOLINE' },
  { icon: IconVolume, label: 'Volume', value: '1998 SM3' },
  { icon: IconPower, label: 'Power', value: '190 H.P.' },
  { icon: IconTransmission, label: 'Transmission', value: 'AUTOMATIC' },
  { icon: IconDrivetrain, label: 'Drivetrain', value: 'REAR-WHEEL DRIVE' },
  { icon: IconCountry, label: 'Brand country', value: 'GERMANY' },
  { icon: IconAcceleration, label: '0-100 acceleration', value: '8.2 SEC' },
  { icon: IconTopSpeed, label: 'Top speed', value: '225 KM/H' },
  { icon: IconFuel, label: 'Fuel', value: 'RON-95' },
];

export function ModificationsSection() {
  return (
    <section className="bg-bg">
      <Container className="flex flex-col gap-10">
        <SectionTitle>Modifications</SectionTitle>

        <SelectField
          label="Modification"
          options={['3.0 AT 510 hp – Competition', '3.0 AT 480 hp', '3.0 MT 480 hp', '3.0 AT 550 hp – CSL']}
          className="w-full self-start w640:w-[340px] w1280:w-[464px]"
        />

        <div className="flex flex-wrap gap-y-4 w1280:gap-y-6">
          {highlights.map((h) => (
            <div key={h.label} className="flex w-full items-center gap-3 w640:w-1/2 w960:w-1/3">
              <h.icon size={24} className="shrink-0 text-ink-2 w1280:h-10 w1280:w-10" />
              <div className="flex min-w-0 flex-col gap-0.5 w1280:gap-2">
                <p className="t-body text-ink/80">{h.label}</p>
                <p className="t-card-name uppercase">{h.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="h-px bg-ink/20" />

        <div className="columns-1 gap-6 w960:columns-2 w1280:columns-3">
          {modSpecColumns.flat().map((group) => (
            <div key={group.title} className="mb-6 flex break-inside-avoid flex-col gap-3">
              <p className="t-block-title text-accent">{group.title}</p>
              <div className="flex flex-col gap-2">
                {group.rows.map((r) => (
                  <div key={r.label} className="flex items-start gap-2">
                    <p className="t-spec-label w-[160px] shrink-0 text-ink/80 uppercase">{r.label}</p>
                    <p className="t-spec-value min-w-0 flex-1 uppercase">{r.value}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
