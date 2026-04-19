import BrowseByCategorySection from '@/features/home/components/BrowseByCategorySection'
import HeroSection from '@/features/home/components/HeroSection'
import NewArrivalsSection from '@/features/home/components/NewArrivalsSection'
import ShareForCuresSection from '@/features/home/components/ShareForCuresSection'
import TopSellingSection from '@/features/home/components/TopSellingSection'

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
