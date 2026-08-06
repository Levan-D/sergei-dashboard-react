import { HeroBlock } from '@/features/landing/components/HeroBlock';
import { SecondScreen } from '@/features/landing/components/SecondScreen';
import { FiltersConfig } from '@/features/landing/components/FiltersConfig';
import { ModelsOnLanding } from '@/features/landing/components/ModelsOnLanding';
import { LivePreview } from '@/features/landing/components/LivePreview';

export default function LandingPage() {
  return (
    <div className="grid grid-cols-[1fr_320px] gap-4">
      <div>
        <HeroBlock />
        <SecondScreen />
        <FiltersConfig />
        <ModelsOnLanding />
      </div>
      <div>
        <LivePreview />
      </div>
    </div>
  );
}
