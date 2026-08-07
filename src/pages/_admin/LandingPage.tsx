import { HeroBlock } from '@/features/_admin/landing/components/HeroBlock';
import { SecondScreen } from '@/features/_admin/landing/components/SecondScreen';
import { FiltersConfig } from '@/features/_admin/landing/components/FiltersConfig';
import { ModelsOnLanding } from '@/features/_admin/landing/components/ModelsOnLanding';
import { LivePreview } from '@/features/_admin/landing/components/LivePreview';
//adasda
export default function LandingPage() {
  return (
    <div className="flex gap-3 @max-wide:flex-col @mobile:gap-4">
      <div className="min-w-0 flex-1">
        <HeroBlock />
        <SecondScreen />
        <FiltersConfig />
        <ModelsOnLanding />
      </div>
      <div className="w-[320px] shrink-0 @max-wide:order-first @max-wide:w-full">
        <LivePreview />
      </div>
    </div>
  );
}
