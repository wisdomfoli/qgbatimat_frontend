import HeroSection from '@/features/home/components/HeroSection'
import NewArrivalsSection from '@/features/home/components/NewArrivalsSection'
import TopSellingSection from '@/features/home/components/TopSellingSection'
import BrowseByCategorySection from '@/features/home/components/BrowseByCategorySection'
import ShareForCuresSection from '@/features/home/components/ShareForCuresSection'

export default function HomePage() {
  return (
    <main className="bg-white text-zinc-900">
      <HeroSection />
      <NewArrivalsSection />
      <TopSellingSection />
      <BrowseByCategorySection />
      <ShareForCuresSection />
      {/* <TestimonialsSection /> */}
    </main>
  )
}
