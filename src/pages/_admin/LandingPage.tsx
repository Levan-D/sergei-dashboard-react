import { HeroBlock } from '@/features/_admin/landing/components/HeroBlock';
import { SecondScreen } from '@/features/_admin/landing/components/SecondScreen';
import { FiltersConfig } from '@/features/_admin/landing/components/FiltersConfig';
import { ModelsOnLanding } from '@/features/_admin/landing/components/ModelsOnLanding';
import { LivePreview } from '@/features/_admin/landing/components/LivePreview';

export default function LandingPage() {
  return (
    <div className="flex gap-3 md:gap-4">
      <div className="min-w-0 flex-1">
        <HeroBlock />
        <SecondScreen />
        <FiltersConfig />
        <ModelsOnLanding />
      </div>
      <div className="w-[320px] shrink-0">
        <LivePreview />
      </div>
    </div>
  );
}
