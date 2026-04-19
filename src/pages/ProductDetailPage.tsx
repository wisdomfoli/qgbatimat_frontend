import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import { ShoppingCart, Star, ChevronRight, Minus, Plus } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { products } from '../data/products'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'

const MOCK_REVIEWS = [
  { name: 'Samantha D.', verified: true, rating: 5, text: "Excellent produit ! La qualite est au rendez-vous et la livraison a ete rapide. Je suis tres satisfait de mon achat chez QG Batimat.", date: '14 Aout 2024' },
  { name: 'Alex M.', verified: true, rating: 5, text: "Le produit a depasse mes attentes. La qualite est irrepro chable et le rapport qualite-prix est excellent. Je recommande vivement.", date: '15 Aout 2024' },
  { name: 'Ethan R.', verified: true, rating: 4, text: "Tres bon produit pour le chantier. Solide et facile a utiliser. Le design est pratique et bien pense pour une utilisation professionnelle.", date: '16 Aout 2024' },
  { name: 'Olivia P.', verified: true, rating: 4, text: "Bonne qualite generale. Le produit correspond bien a la description. La livraison a ete rapide et l'emballage etait soigne.", date: '17 Aout 2024' },
  { name: 'Liam K.', verified: true, rating: 5, text: "Parfait pour mon projet de renovation. Tres bonne finition et materiau de qualite. Je n'hesiterai pas a recommander QG Batimat.", date: '18 Aout 2024' },
  { name: 'Ava H.', verified: true, rating: 4, text: "Produit conforme a mes attentes. La solidite est au rendez-vous et la prise en main est facile. Bon choix pour les professionnels.", date: '19 Aout 2024' },
]

type TabType = 'details' | 'avis' | 'faq'

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<TabType>('avis')
  const [selectedImage, setSelectedImage] = useState(0)
  const [added, setAdded] = useState(false)

  const product = products.find((p) => p.slug === slug)
  const related = products.filter((p) => p.categorySlug === product?.categorySlug && p.id !== product?.id).slice(0, 4)

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="text-6xl text-zinc-400" />
        <h1 className="text-2xl font-bold text-zinc-800">Produit introuvable</h1>
        <button onClick={() => navigate('/produits')} className="bg-[#e8541a] text-white px-6 py-3 rounded-full font-medium hover:bg-[#cc4a17] transition-colors">
          Voir tous les produits
        </button>
      </div>
    )
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  const images = product.images && product.images.length > 0
    ? product.images
    : [product.image, product.image, product.image]

  function handleAddToCart() {
    if (product) addToCart(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-1.5 text-sm text-zinc-400">
          <Link to="/" className="hover:text-zinc-700 transition-colors">Accueil</Link>
          <ChevronRight size={14} />
          <Link to="/produits" className="hover:text-zinc-700 transition-colors">Boutique</Link>
          <ChevronRight size={14} />
          <Link to={`/produits?categorie=${product.categorySlug}`} className="hover:text-zinc-700 transition-colors">{product.category}</Link>
          <ChevronRight size={14} />
          <span className="text-zinc-800 truncate max-w-45 font-medium">{product.name}</span>
        </div>
      </div>

      {/* Product block */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">

          {/* Left: images */}
          <div className="flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`shrink-0 rounded-xl overflow-hidden w-16 h-16 md:w-20 md:h-20 border-2 transition-colors ${selectedImage === i ? 'border-[#e8541a]' : 'border-zinc-200 hover:border-zinc-400'}`}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover bg-zinc-50" />
                </button>
              ))}
            </div>
            {/* Main image */}
            <div className="flex-1 aspect-square rounded-2xl overflow-hidden bg-zinc-100">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right: details */}
          <div>
            <h1 className="text-2xl md:text-3xl font-black uppercase text-zinc-900 leading-tight mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} size={16} className={s <= Math.round(product.rating) ? 'fill-[#e8541a] text-[#e8541a]' : 'fill-zinc-200 text-zinc-200'} />
                ))}
              </div>
              <span className="text-sm text-zinc-500">{product.rating}/5</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-black text-zinc-900">
                {product.price.toLocaleString('fr-TG')} FCFA
              </span>
              {product.originalPrice && (
                <span className="text-xl text-zinc-400 line-through font-semibold">
                  {product.originalPrice.toLocaleString('fr-TG')} FCFA
                </span>
              )}
              {discount && (
                <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  -{discount}%
                </span>
              )}
            </div>

            <p className="text-sm text-zinc-500 leading-relaxed mb-6">{product.description}</p>

            <div className="border-t border-zinc-200 my-5" />

            {/* Stock info */}
            <div className="mb-5">
              <span className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full ${product.stock > 10 ? 'bg-green-50 text-green-700' : product.stock > 0 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>
                <span className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
                {product.stock > 10 ? 'En stock' : product.stock > 0 ? `Plus que ${product.stock} en stock` : 'Rupture de stock'}
              </span>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-5">
              <div className="flex items-center border border-zinc-200 rounded-full overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-zinc-50 transition-colors text-zinc-600"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-sm font-semibold text-zinc-800">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-zinc-50 transition-colors text-zinc-600"
                >
                  <Plus size={14} />
                </button>
              </div>
              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-semibold text-sm transition-all ${added ? 'bg-green-600 text-white' : 'bg-[#e8541a] hover:bg-[#cc4a17] text-white'} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {added ? (
                  <>
                    <FontAwesomeIcon icon={faCircleCheck} />
                    Ajoute au panier !
                  </>
                ) : (
                  <>
                    <ShoppingCart size={16} />
                    Ajouter au panier
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-zinc-400">Unite : {product.unit} · Marque : {product.brand}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-14 border-t border-zinc-200">
          <div className="flex gap-0 border-b border-zinc-200">
            {([
              { id: 'details', label: 'Details du produit' },
              { id: 'avis', label: `Avis & Notes` },
              { id: 'faq', label: 'FAQ' },
            ] as { id: TabType; label: string }[]).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 -mb-px ${activeTab === tab.id ? 'text-[#e8541a] border-[#e8541a]' : 'text-zinc-400 border-transparent hover:text-zinc-700'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === 'details' && (
              <div className="prose prose-zinc max-w-none">
                <p className="text-zinc-600 leading-relaxed">{product.description}</p>
                {product.specifications && (
                  <table className="w-full mt-6 border-collapse">
                    <tbody>
                      {Object.entries(product.specifications).map(([key, val], i) => (
                        <tr key={key} className={i % 2 === 0 ? 'bg-zinc-50' : 'bg-white'}>
                          <td className="px-4 py-3 text-sm font-medium text-zinc-700 w-1/3 rounded-l-lg">{key}</td>
                          <td className="px-4 py-3 text-sm text-zinc-600 rounded-r-lg">{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === 'avis' && (
              <div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-zinc-900">Tous les avis</h2>
                    <span className="text-sm text-zinc-400">({product.reviewCount})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 border border-zinc-200 rounded-full px-4 py-2 text-sm text-zinc-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" /></svg>
                      Dernier en date
                    </div>
                    <button className="bg-[#e8541a] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#cc4a17] transition-colors">
                      Ecrire un avis
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {MOCK_REVIEWS.map((review) => (
                    <div key={review.name} className="border border-zinc-200 rounded-2xl p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map((s) => (
                            <Star key={s} size={15} className={s <= review.rating ? 'fill-[#e8541a] text-[#e8541a]' : 'fill-zinc-200 text-zinc-200'} />
                          ))}
                        </div>
                        <button className="text-zinc-300 hover:text-zinc-500">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 6a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4zm-2 6a2 2 0 104 0 2 2 0 00-4 0z" /></svg>
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-bold text-sm text-zinc-900">{review.name}</p>
                        {review.verified && (
                          <svg className="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <p className="text-sm text-zinc-600 leading-relaxed mb-3">"{review.text}"</p>
                      <p className="text-xs text-zinc-400">Publie le {review.date}</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center mt-8">
                  <button className="px-8 py-3 rounded-full border border-zinc-300 text-sm font-medium text-zinc-700 hover:border-[#e8541a] hover:text-[#e8541a] transition-colors">
                    Charger plus d'avis
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'faq' && (
              <div className="max-w-2xl space-y-4">
                {[
                  { q: 'Quelle est la garantie sur ce produit ?', a: 'Ce produit beneficie d\'une garantie fabricant de 12 mois. En cas de defaut, contactez notre service client.' },
                  { q: 'Quels sont les delais de livraison ?', a: 'Nous livrons sous 24h a 48h a Lome. Pour les villes de l\'interieur, comptez 2 a 5 jours ouvrables.' },
                  { q: 'Puis-je retourner un produit ?', a: 'Oui, vous avez 7 jours apres reception pour retourner un produit non utilise dans son emballage d\'origine.' },
                ].map((item) => (
                  <div key={item.q} className="border border-zinc-200 rounded-2xl p-5">
                    <h3 className="font-semibold text-zinc-900 mb-2">{item.q}</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="border-t border-zinc-200 pt-12">
            <h2 className="text-2xl md:text-3xl font-black uppercase text-center mb-8">Vous pourriez aussi aimer</h2>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
