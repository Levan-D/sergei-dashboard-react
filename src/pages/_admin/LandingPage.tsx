import { HeroBlock } from '@/features/_admin/landing/components/HeroBlock';
import { SecondScreen } from '@/features/_admin/landing/components/SecondScreen';
import { FiltersConfig } from '@/features/_admin/landing/components/FiltersConfig';
import { ModelsOnLanding } from '@/features/_admin/landing/components/ModelsOnLanding';
import { LivePreview } from '@/features/_admin/landing/components/LivePreview';

export default function LandingPage() {
  return (
    <div className="grid grid-cols-[1fr_320px] gap-3 md:gap-4">
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
