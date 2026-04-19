import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { ChevronLeft, ChevronRight, Star, Search, ArrowRight, Truck, Shield, Headphones } from 'lucide-react'
import { products } from '../data/products'
import ProductCard from '../components/ProductCard'
import img_hero from '../assets/images/img_hero.jpg'
import ShareForCuresSection from '../sections/ShareForCuresSection'

const newArrivals = products.filter((p) => p.badge === 'nouveau').slice(0, 4)
const topSelling = products.filter((p) => p.badge === 'bestseller').slice(0, 4)

const stats = [
  { value: '500+', label: 'références en stock' },
  { value: '2 000+', label: 'artisans équipés' },
  { value: '30 000+', label: 'livraisons réalisées' },
]

const supplierBrands = ['CIMTOGO', 'SACIAF', 'LEGRAND', 'MAKITA', 'WÜRTH']

const workStyles = [
  { title: 'Gros oeuvre', slug: 'gros-oeuvre', image: 'https://picsum.photos/seed/grosoeuvre1/700/420' },
  { title: 'Second oeuvre', slug: 'electricite', image: 'https://picsum.photos/seed/secondoeuvre1/700/420' },
  { title: 'Rénovation', slug: 'quincaillerie', image: 'https://picsum.photos/seed/renovation1/700/420' },
  { title: 'Finitions', slug: 'peinture', image: 'https://picsum.photos/seed/finitions1/700/420' },
]

const testimonials = [
  { name: 'M. Kossi A.', rating: 5, text: 'Prix clairs, stock réel et livraison rapide. On gagne du temps sur chaque projet. Je recommande vivement QG Batimat à tous mes collègues.', date: 'Lomé, Août 2024' },
  { name: 'A. Mensah', rating: 5, text: 'Le service client comprend bien nos contraintes terrain. Le matériel est fiable. C\'est devenu mon fournisseur principal pour tous mes chantiers.', date: 'Kara, Septembre 2024' },
  { name: 'S. Afi K.', rating: 4, text: 'Bon choix en quincaillerie et finitions. Les conseils techniques sont très utiles pour nos chantiers. Livraison dans les délais annoncés.', date: 'Tsévié, Octobre 2024' },
]

export default function HomePage() {
  const navigate = useNavigate()
  const [testimonialIndex, setTestimonialIndex] = useState(0)
  const [heroSearch, setHeroSearch] = useState('')
  const arrivals = [...newArrivals, ...products.filter((p) => p.badge !== 'nouveau')].slice(0, 4)
  const bestsellers = [...topSelling, ...products.filter((p) => p.badge !== 'bestseller')].slice(0, 4)

  return (
    <main className="bg-white text-zinc-900">

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-r from-zinc-50 to-zinc-100 min-h-[85vh] flex items-center">
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

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-200">
              {[
                { icon: <Truck size={20} />, label: 'Livraison rapide', desc: 'Dans tout le Togo' },
                { icon: <Shield size={20} />, label: 'Qualité garantie', desc: 'Produits certifiés' },
                { icon: <Headphones size={20} />, label: 'Support expert', desc: '24h/7j' },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 text-amber-600 rounded-full mb-2">
                    {item.icon}
                  </div>
                  <p className="text-sm font-semibold text-zinc-900">{item.label}</p>
                  <p className="text-xs text-zinc-500">{item.desc}</p>
                </div>
              ))}
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
            
            {/* Floating stats on image */}
            {/* <div className="absolute bottom-6 left-6 right-6">
              <div className="grid grid-cols-3 gap-3">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="bg-white/95 backdrop-blur-sm border border-white/50 rounded-xl px-4 py-3 text-center"
                  >
                    <p className="text-lg font-black text-zinc-900">{s.value}</p>
                    <p className="text-xs text-zinc-600 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {/* BRANDS */}
      {/* <section className="border-y border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between gap-4 overflow-x-auto">
          {supplierBrands.map((brand) => (
            <p key={brand} className="text-lg md:text-xl font-black tracking-tight text-zinc-800 whitespace-nowrap flex-1 text-center">
              {brand}
            </p>
          ))}
        </div>
      </section> */}

      {/* NEW ARRIVALS */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-black uppercase text-center mb-2">Nouveaux arrivages</h2>
          <p className="text-sm text-zinc-500 text-center mb-8">Découvrez nos dernières références disponibles en stock</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 md:gap-6">
            {arrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <Link to="/produits?badge=nouveau" className="px-9 py-3 rounded-full border-2 border-[#e8541a] text-[#e8541a] text-sm font-semibold hover:bg-[#e8541a] hover:text-white transition-colors">
              Voir tout
            </Link>
          </div>
        </div>
      </section>

      {/* TOP SELLING */}
      <section className="border-t border-zinc-100 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-black uppercase text-center mb-2">Top ventes</h2>
          <p className="text-sm text-zinc-500 text-center mb-8">Les produits les plus commandés par les professionnels du bâtiment</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 md:gap-6">
            {bestsellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <Link to="/produits?badge=bestseller" className="px-9 py-3 rounded-full border-2 border-[#e8541a] text-[#e8541a] text-sm font-semibold hover:bg-[#e8541a] hover:text-white transition-colors">
              Voir tout
            </Link>
          </div>
        </div>
      </section>

      {/* BROWSE BY CATEGORY */}
      <section className="border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="bg-[#f2f0f1] rounded-4xl p-6 md:p-10">
            <h2 className="text-3xl md:text-4xl font-black uppercase text-center mb-8">Parcourir par type de travaux</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {workStyles.map((style) => (
                <Link
                  key={style.title}
                  to={`/produits?categorie=${style.slug}`}
                  className="group relative rounded-2xl overflow-hidden h-40 md:h-52 block"
                >
                  <img src={style.image} alt={style.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-linear-to-r from-black/50 to-black/20" />
                  <div className="absolute inset-0 p-5 flex items-start justify-between text-white">
                    <p className="text-xl md:text-2xl font-bold">{style.title}</p>
                    <ChevronRight size={20} className="mt-1 shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ShareForCuresSection />

      {/* TESTIMONIALS */}
      {/* <section className="border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-black uppercase leading-tight">Nos clients<br className="hidden sm:block" /> satisfaits</h2>
            <div className="flex gap-2">
              <button onClick={() => setTestimonialIndex((i) => (i === 0 ? testimonials.length - 1 : i - 1))} className="w-10 h-10 rounded-full border border-zinc-300 flex items-center justify-center hover:border-zinc-900 transition-colors" aria-label="Precedent">
                <ChevronLeft size={18} />
              </button>
              <button onClick={() => setTestimonialIndex((i) => (i === testimonials.length - 1 ? 0 : i + 1))} className="w-10 h-10 rounded-full border border-zinc-300 flex items-center justify-center hover:border-zinc-900 transition-colors" aria-label="Suivant">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <div key={t.name} className={`border rounded-2xl p-6 transition-all duration-300 ${i === testimonialIndex ? 'border-zinc-900 bg-white shadow-md' : 'border-zinc-200 bg-white'}`}>
                <div className="flex gap-0.5 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={16} className={s <= t.rating ? 'fill-amber-400 text-amber-400' : 'fill-zinc-200 text-zinc-200'} />
                  ))}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <p className="font-bold text-sm">{t.name}</p>
                  <svg className="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm text-zinc-600 leading-relaxed mb-3">"{t.text}"</p>
                <p className="text-xs text-zinc-400">Publie le {t.date}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}
    </main>
  )
}
