import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'

const workStyles = [
  {
    title: 'Gros oeuvre',
    slug: 'gros-oeuvre',
    image: 'https://picsum.photos/seed/grosoeuvre1/700/420',
  },
  {
    title: 'Second oeuvre',
    slug: 'electricite',
    image: 'https://picsum.photos/seed/secondoeuvre1/700/420',
  },
  {
    title: 'Rénovation',
    slug: 'quincaillerie',
    image: 'https://picsum.photos/seed/renovation1/700/420',
  },
  { title: 'Finitions', slug: 'peinture', image: 'https://picsum.photos/seed/finitions1/700/420' },
]

export default function BrowseByCategorySection() {
  return (
    <section className="border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="bg-[#f2f0f1] rounded-4xl p-6 md:p-10">
          <h2 className="text-3xl md:text-4xl font-black uppercase text-center mb-8">
            Parcourir par type de travaux
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {workStyles.map((style) => (
              <Link
                key={style.title}
                to={`/produits?categorie=${style.slug}`}
                className="group relative rounded-2xl overflow-hidden h-40 md:h-52 block"
              >
                <img
                  src={style.image}
                  alt={style.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
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
  )
}
