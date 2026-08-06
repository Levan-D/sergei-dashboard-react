import { useState } from 'react';
import { useAppDispatch } from '@/store';
import { showToast } from '@/store/uiSlice';
import { Avatar, Button, FormGroup, SectionCard, SectionHeader, Toggle } from '@/components/ui';
import { StatCard } from '@/components/StatCard';

const logbooks = [
  {
    initials: 'SV',
    bg: undefined,
    name: 'Sergei V.',
    car: 'BMW M4 Competition G82',
    mileage: '20,500 km',
    owned: '2 years',
    date: 'Apr 5',
  },
  {
    initials: 'MK',
    bg: '#8b5cf6',
    name: 'Maria K.',
    car: 'BMW X5 G05',
    mileage: '34,200 km',
    owned: '3 years',
    date: 'Apr 3',
  },
  {
    initials: 'JP',
    bg: 'var(--green)',
    name: 'James P.',
    car: 'BMW M3 G80',
    mileage: '8,100 km',
    owned: '1 year',
    date: 'Apr 1',
  },
];

export default function CommunityPage() {
  const dispatch = useAppDispatch();
  const [showBlock, setShowBlock] = useState(true);

  return (
    <div>
      <div className="mb-6 grid grid-cols-3 gap-3">
        <StatCard label="Total Logbooks" value="2,841" />
        <StatCard label="Active Owners" value="1,203" />
        <StatCard label="New This Month" value="+47" valueStyle={{ color: 'var(--green)' }} />
      </div>

      <SectionCard>
        <SectionHeader
          title="Community Block Settings"
          right={
            <Button sm onClick={() => dispatch(showToast('✅ Community settings saved'))}>
              Save
            </Button>
          }
        />
        <div className="flex flex-col gap-4 p-5">
          <div className="flex items-center gap-2.5">
            <Toggle on={showBlock} onClick={() => setShowBlock(!showBlock)} />
            <label>Show Community block on landing</label>
          </div>
          <FormGroup label="Section Title">
            <input type="text" defaultValue="Real Owners" />
          </FormGroup>
          <FormGroup label="Section Subtitle">
            <input type="text" defaultValue="BMW owners documenting their journeys on Motority" />
          </FormGroup>
          <FormGroup label="Max logbooks to show">
            <select defaultValue="4">
              <option>4</option>
              <option>6</option>
              <option>8</option>
              <option>12</option>
            </select>
          </FormGroup>
        </div>
      </SectionCard>

      <SectionCard>
        <SectionHeader title="Recent Logbooks" sub="Latest from BMW owners" />
        <table>
          <thead>
            <tr>
              <th>Owner</th>
              <th>Car</th>
              <th>Mileage</th>
              <th>Owned</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {logbooks.map((l) => (
              <tr key={l.name}>
                <td>
                  <div className="flex items-center gap-2">
                    <Avatar sm initials={l.initials} bg={l.bg} />
                    {l.name}
                  </div>
                </td>
                <td>{l.car}</td>
                <td>{l.mileage}</td>
                <td>{l.owned}</td>
                <td className="text-ink-3">{l.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </div>
  );
}
