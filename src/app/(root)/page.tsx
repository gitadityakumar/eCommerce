import CampaignShowcase from '@/components/CampaignShowcase';
import CollectionGallery from '@/components/CollectionGallery';
import HeroSection from '@/components/hero-section';
import PhilosophySection from '@/components/PhilosophySection';
import PromoBanner from '@/components/PromoBanner';
import SpotlightSection from '@/components/SpotlightSection';

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
