'use client';
import { CampaignShowcase, CollectionGallery, HeroSection, PhilosophySection, PromoBanner, SpotlightSection } from '@/components';

function Home() {
  return (
    <>
      <main className="w-full overflow-hidden">
        <HeroSection />
        <PhilosophySection />
        <CampaignShowcase />
        <SpotlightSection />
        <CollectionGallery />
        <PromoBanner />
      </main>

    </>
  );
}

export default Home;
