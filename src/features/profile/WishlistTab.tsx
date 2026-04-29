import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { profileService } from './profileService'
import { useWishlist } from './WishlistContext'

export function WishlistTab() {
  const [wishlist, setWishlist] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toggleWishlist } = useWishlist()

  const fetchWishlist = async () => {
    try {
      const data = await profileService.getWishlist()
      setWishlist(data)
    } catch (err) {
      console.error('Failed to fetch wishlist', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWishlist()
  }, [])

  const handleRemove = async (productId: number) => {
    try {
      await toggleWishlist(productId)
      setWishlist(wishlist.filter(w => w.product_id !== productId))
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div className="p-8 text-center">Chargement...</div>

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium text-gray-800 mb-2">Votre liste de souhaits est vide</h2>
        <p className="text-gray-500 mb-6">Trouvez des articles que vous aimez et ajoutez-les ici !</p>
        <Link to="/produits" className="px-6 py-3 bg-[#FF6B00] text-white rounded-lg font-medium hover:bg-orange-600 transition-colors">
          Parcourir les produits
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Ma Liste de Souhaits</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((item) => {
          const product = item.product
          return (
            <div key={item.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow relative group">
              <button
                onClick={() => handleRemove(product.id)}
                className="absolute top-3 right-3 bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm text-red-500 hover:bg-red-50 z-10"
                title="Retirer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <Link to={`/produit/${product.slug}`} className="block aspect-square bg-gray-50 overflow-hidden relative">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Sans image
                  </div>
                )}
              </Link>
              
              <div className="p-4">
                <Link to={`/produit/${product.slug}`}>
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 hover:text-[#FF6B00] transition-colors">{product.name}</h3>
                </Link>
                <div className="text-[#FF6B00] font-bold text-lg mt-2">
                  {Number(product.price).toLocaleString()} FCFA
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
