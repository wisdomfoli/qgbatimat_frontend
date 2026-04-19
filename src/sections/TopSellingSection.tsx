import { Link } from 'react-router'
import { products } from '../data/products'
import ProductCard from '../components/ProductCard'

export default function TopSellingSection() {
  const topSelling = products.filter((p) => p.badge === 'bestseller').slice(0, 4)
  const bestsellers = [...topSelling, ...products.filter((p) => p.badge !== 'bestseller')].slice(0, 4)

  return (
    <section className="pb-6 md:pb-6 mb-6">
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
  )
}