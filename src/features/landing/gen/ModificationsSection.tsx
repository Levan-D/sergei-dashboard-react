import Container from '@/components/landing/Container';
import SectionTitle from '@/components/landing/SectionTitle';
import Select from '@/components/_admin/forms/Select';
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

        <div className="flex w-full max-w-[320px] flex-col gap-1.5">
          <label className="t-stat-label text-ink-2 uppercase">Modifications</label>
          <Select options={['3.0 AT 510 hp – Competition', '3.0 AT 480 hp', '3.0 MT 480 hp']} />
        </div>

        <div className="flex flex-wrap">
          {highlights.map((h) => (
            <div
              key={h.label}
              className="flex w-full items-center gap-3 border-b border-line py-4 w960:w-1/2 w1440:w-1/3"
            >
              <h.icon size={24} className="shrink-0 text-ink-2" />
              <div className="flex flex-col gap-0.5">
                <p className="t-body text-ink-2">{h.label}</p>
                <p className="t-card-name uppercase">{h.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-10 w1440:flex-row">
          {modSpecColumns.map((column, ci) => (
            <div key={ci} className="flex min-w-0 flex-1 flex-col gap-8">
              {column.map((group) => (
                <div key={group.title} className="flex flex-col gap-2">
                  <p className="t-card-years text-accent uppercase">{group.title}</p>
                  <div className="flex flex-col">
                    {group.rows.map((r) => (
                      <div key={r.label} className="flex items-start justify-between gap-6 border-b border-line py-2">
                        <p className="t-body max-w-[55%] text-ink-2 uppercase">{r.label}</p>
                        <p className="t-body text-right font-medium">{r.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
