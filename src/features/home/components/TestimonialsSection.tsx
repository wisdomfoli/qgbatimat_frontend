import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { useState } from 'react'

const testimonials = [
  {
    name: 'M. Kossi A.',
    rating: 5,
    text: 'Prix clairs, stock réel et livraison rapide. On gagne du temps sur chaque projet. Je recommande vivement QG Batimat à tous mes collègues.',
    date: 'Lomé, Août 2024',
  },
  {
    name: 'A. Mensah',
    rating: 5,
    text: "Le service client comprend bien nos contraintes terrain. Le matériel est fiable. C'est devenu mon fournisseur principal pour tous mes chantiers.",
    date: 'Kara, Septembre 2024',
  },
  {
    name: 'S. Afi K.',
    rating: 4,
    text: 'Bon choix en quincaillerie et finitions. Les conseils techniques sont très utiles pour nos chantiers. Livraison dans les délais annoncés.',
    date: 'Tsévié, Octobre 2024',
  },
]

export default function TestimonialsSection() {
  const [testimonialIndex, setTestimonialIndex] = useState(0)

  return (
    <section className="border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-black uppercase leading-tight">
            Nos clients
            <br className="hidden sm:block" /> satisfaits
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                setTestimonialIndex((i) => (i === 0 ? testimonials.length - 1 : i - 1))
              }
              className="w-10 h-10 rounded-full border border-zinc-300 flex items-center justify-center hover:border-zinc-900 transition-colors"
              aria-label="Precedent"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() =>
                setTestimonialIndex((i) => (i === testimonials.length - 1 ? 0 : i + 1))
              }
              className="w-10 h-10 rounded-full border border-zinc-300 flex items-center justify-center hover:border-zinc-900 transition-colors"
              aria-label="Suivant"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`border rounded-2xl p-6 transition-all duration-300 ${i === testimonialIndex ? 'border-zinc-900 bg-white shadow-md' : 'border-zinc-200 bg-white'}`}
            >
              <div className="flex gap-0.5 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={16}
                    className={
                      s <= t.rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-zinc-200 text-zinc-200'
                    }
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 mb-3">
                <p className="font-bold text-sm">{t.name}</p>
                <svg
                  className="w-4 h-4 text-green-500 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-label="Avis verifie"
                  role="img"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-sm text-zinc-600 leading-relaxed mb-3">"{t.text}"</p>
              <p className="text-xs text-zinc-400">Publie le {t.date}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
