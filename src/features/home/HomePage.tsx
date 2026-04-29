import BrowseByCategorySection from '@/features/home/components/BrowseByCategorySection'
import HeroSection from '@/features/home/components/HeroSection'
import NewArrivalsSection from '@/features/home/components/NewArrivalsSection'
import ShareForCuresSection from '@/features/home/components/ShareForCuresSection'
import TopSellingSection from '@/features/home/components/TopSellingSection'
import TestimonialsSection from './components/TestimonialsSection'

export default function HomePage() {
  return (
    <main className="bg-white text-zinc-900">
      <HeroSection />
      <BrowseByCategorySection />
      <NewArrivalsSection />
      <TopSellingSection />
      <ShareForCuresSection />
      <TestimonialsSection />
    </main>
  )
}
