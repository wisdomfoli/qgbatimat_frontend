import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { productService } from '@/shared/api/productService'
import type { Product } from '@/shared/types'
import ProductCard from '@/shared/ui/ProductCard'
import { Loader2 } from 'lucide-react'

export default function NewArrivalsSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getProducts({ new_arrivals: 1, limit: 4 })
        setProducts(data)
      } catch (err) {
        console.error('Failed to fetch new arrivals:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const arrivals = products

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#e8541a] animate-spin" />
      </div>
    )
  }

  return (
    <section className="py-6 md:py-6 mb-6">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-black uppercase text-center mb-2">
          Nouveaux arrivages
        </h2>
        <p className="text-sm text-zinc-500 text-center mb-8">
          Découvrez nos dernières références disponibles en stock
        </p>
        
        {arrivals.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 md:gap-6">
              {arrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="flex justify-center mt-10">
              <Link
                to="/produits?badge=nouveau"
                className="px-9 py-3 rounded-full border-2 border-[#e8541a] text-[#e8541a] text-sm font-semibold hover:bg-[#e8541a] hover:text-white transition-colors"
              >
                Voir tout
              </Link>
            </div>
          </>
        ) : (
          <div className="py-12 border-2 border-dashed border-zinc-100 rounded-3xl flex flex-col items-center justify-center text-center">
            <p className="text-zinc-400 font-medium italic">Pas encore de nouveaux arrivages disponibles.</p>
          </div>
        )}
      </div>
    </section>
  )
}
