import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import img_hero from '@/assets/images/hero.jpg'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white h-[calc(100vh-121px)] flex items-center">
      <img
        src={img_hero}
        alt="Construction et matériaux QG Batimat"
        className="w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/20" />

      <div className="max-w-xl absolute left-15 bottom-5 z-10">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] mb-6">
          Équipez vos chantiers avec <span className="text-[#e8541a]">QG Batimat</span>
        </h1>

        {/* Subtitle */}
        <p className="text-white text-lg leading-relaxed mb-8 max-w-lg">
          Plus de 500 références de qualité professionnelle. Ciment, quincaillerie, outillage et
          matériaux sélectionnés pour vos projets de construction.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Link
            to="/produits"
            className="inline-flex items-center justify-center gap-2 bg-[#e8541a] hover:bg-[#d14b18] text-white font-bold text-base px-8 py-4 rounded-full transition-all transform shadow-lg"
          >
            Explorer le catalogue <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}
