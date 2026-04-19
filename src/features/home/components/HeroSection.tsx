import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import img_hero from '@/assets/images/img_hero.webp'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white min-h-[85vh] flex items-center">
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left content */}
        <div className="max-w-xl lg:max-w-none">
          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-900 leading-[1.05] mb-6">
            Équipez vos chantiers avec{' '}
            <span className="text-[#e8541a]">QG Batimat</span>
          </h1>

          {/* Subtitle */}
          <p className="text-zinc-600 text-lg leading-relaxed mb-8 max-w-lg">
            Plus de 500 références de qualité professionnelle. Ciment, quincaillerie, outillage et matériaux sélectionnés pour vos projets de construction.
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

        {/* Right image */}
        <div className="relative lg:h-[600px] h-[400px] rounded-2xl overflow-hidden shadow-2xl">
          <img
            src={img_hero}
            alt="Construction et matériaux QG Batimat"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      </div>
    </section>
  )
}