import HeroSection from '../sections/HeroSection'
import NewArrivalsSection from '../sections/NewArrivalsSection'
import TopSellingSection from '../sections/TopSellingSection'
import BrowseByCategorySection from '../sections/BrowseByCategorySection'
import ShareForCuresSection from '../sections/ShareForCuresSection'
import TestimonialsSection from '../sections/TestimonialsSection'

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
