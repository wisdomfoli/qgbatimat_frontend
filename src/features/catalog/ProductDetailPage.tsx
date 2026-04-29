import { faCircleCheck, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ChevronRight, Loader2, Minus, Plus, ShoppingCart, Star, Heart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { useCart } from '@/features/cart/useCart'
import { productService } from '@/shared/api/productService'
import type { Product } from '@/shared/types'
import ProductCard from '@/shared/ui/ProductCard'
import { useWishlist } from '@/features/profile/WishlistContext'
import { authService } from '@/features/auth/services/auth-service'
import Swal from 'sweetalert2'

type TabType = 'details' | 'avis' | 'faq'


export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<TabType>('avis')
  const [selectedImage, setSelectedImage] = useState(0)
  const [added, setAdded] = useState(false)
  
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewError, setReviewError] = useState<string | null>(null)
  
  const { isWishlisted, toggleWishlist } = useWishlist()

  const handleWishlistClick = () => {
    if (!product) return
    toggleWishlist(Number(product.id))
  }

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return
      try {
        setLoading(true)
        const data = await productService.getProduct(slug)
        setProduct(data)
        
        // Fetch all products to filter related (simplified for now)
        const allProducts = await productService.getProducts()
        const relatedProducts = allProducts
          .filter((p) => p.categorySlug === data.categorySlug && p.id !== data.id)
          .slice(0, 4)
        setRelated(relatedProducts)
      } catch (err) {
        console.error('Failed to fetch product:', err)
        setError('Produit introuvable.')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#e8541a] animate-spin" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="text-6xl text-zinc-400" />
        <h1 className="text-2xl font-bold text-zinc-800">Produit introuvable</h1>
        <button
          type="button"
          onClick={() => navigate('/produits')}
          className="bg-[#e8541a] text-white px-6 py-3 rounded-full font-medium hover:bg-[#cc4a17] transition-colors"
        >
          Voir tous les produits
        </button>
      </div>
    )
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.image, product.image, product.image]

  function handleAddToCart() {
    if (product) addToCart(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  async function submitReview(e: React.FormEvent) {
    e.preventDefault()
    if (!product) return
    
    try {
      setSubmittingReview(true)
      setReviewError(null)
      const res = await productService.addReview(product.id, reviewRating, reviewComment)
      
      // Si la modération est active, res.product n'est pas renvoyé car la note n'a pas encore changé
      setProduct({
        ...product,
        rating: res.product?.rating ?? product.rating,
        reviewCount: res.product?.reviewCount ?? product.reviewCount,
        // On n'ajoute pas l'avis à la liste tout de suite s'il doit être modéré
        // Sauf si on veut l'afficher comme "en attente" pour l'utilisateur actuel
      })

      Swal.fire({
        icon: 'success',
        title: 'Merci !',
        text: res.message || 'Votre avis a été soumis pour modération.',
        confirmButtonColor: '#e8541a',
      });
      setShowReviewForm(false)
      setReviewComment('')
      setReviewRating(5)
    } catch (err: any) {
      console.error(err)
      setReviewError(err.response?.data?.message || 'Une erreur est survenue.')
    } finally {
      setSubmittingReview(false)
    }
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-1.5 text-sm text-zinc-400">
          <Link to="/" className="hover:text-zinc-700 transition-colors">
            Accueil
          </Link>
          <ChevronRight size={14} />
          <Link to="/produits" className="hover:text-zinc-700 transition-colors">
            Boutique
          </Link>
          <ChevronRight size={14} />
          <Link
            to={`/produits?categorie=${product.categorySlug}`}
            className="hover:text-zinc-700 transition-colors"
          >
            {product.category}
          </Link>
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
                  type="button"
                  key={`${product.slug}-thumb-${img}`}
                  onClick={() => setSelectedImage(i)}
                  className={`shrink-0 rounded-xl overflow-hidden w-16 h-16 md:w-20 md:h-20 border-2 transition-colors ${selectedImage === i ? 'border-[#e8541a]' : 'border-zinc-200 hover:border-zinc-400'}`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    className="w-full h-full object-cover bg-zinc-50"
                  />
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
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={16}
                    className={
                      s <= Math.round(product.rating)
                        ? 'fill-[#e8541a] text-[#e8541a]'
                        : 'fill-zinc-200 text-zinc-200'
                    }
                  />
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
              <span
                className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full ${product.stock > 10 ? 'bg-green-50 text-green-700' : product.stock > 0 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`}
                />
                {product.stock > 10
                  ? 'En stock'
                  : product.stock > 0
                    ? `Plus que ${product.stock} en stock`
                    : 'Rupture de stock'}
              </span>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-5">
              <div className="flex items-center border border-zinc-200 rounded-full overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-zinc-50 transition-colors text-zinc-600"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-sm font-semibold text-zinc-800">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-zinc-50 transition-colors text-zinc-600"
                >
                  <Plus size={14} />
                </button>
              </div>
              {/* Add to cart */}
              <button
                type="button"
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
              
              <button
                type="button"
                onClick={handleWishlistClick}
                className="w-12 h-12 flex items-center justify-center rounded-full border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors"
                aria-label="Ajouter aux favoris"
              >
                <Heart size={20} className={product && isWishlisted(Number(product.id)) ? "fill-red-500 text-red-500" : ""} />
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              Unite : {product.unit} · Marque : {product.brand}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-14 border-t border-zinc-200">
          <div className="flex gap-0 border-b border-zinc-200">
            {(
              [
                { id: 'details', label: 'Details du produit' },
                { id: 'avis', label: `Avis & Notes` },
                { id: 'faq', label: 'FAQ' },
              ] as { id: TabType; label: string }[]
            ).map((tab) => (
              <button
                type="button"
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
                          <td className="px-4 py-3 text-sm font-medium text-zinc-700 w-1/3 rounded-l-lg">
                            {key}
                          </td>
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
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
                        />
                      </svg>
                      Dernier en date
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (authService.isAuthenticated()) {
                          setShowReviewForm(!showReviewForm)
                        } else {
                          navigate('/login')
                        }
                      }}
                      className="bg-[#e8541a] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#cc4a17] transition-colors"
                    >
                      Ecrire un avis
                    </button>
                  </div>
                </div>

                {showReviewForm && (
                  <form onSubmit={submitReview} className="mb-8 p-6 bg-zinc-50 border border-zinc-200 rounded-2xl">
                    <h3 className="font-bold text-lg mb-4">Laisser votre avis</h3>
                    {reviewError && <div className="mb-4 text-red-500 text-sm">{reviewError}</div>}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Note (sur 5)</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setReviewRating(star)}
                            className="focus:outline-none hover:scale-110 transition-transform"
                          >
                            <Star
                              size={24}
                              className={star <= reviewRating ? 'fill-[#e8541a] text-[#e8541a]' : 'fill-zinc-200 text-zinc-200'}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Votre commentaire</label>
                      <textarea
                        required
                        rows={4}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="w-full rounded-xl border border-zinc-300 bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e8541a] focus:border-transparent"
                        placeholder="Qu'avez-vous pensé de ce produit ?"
                      />
                    </div>
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="px-5 py-2.5 rounded-full text-sm font-semibold text-zinc-600 bg-white border border-zinc-200 hover:bg-zinc-50 transition-colors"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-[#e8541a] hover:bg-[#cc4a17] disabled:opacity-50 transition-colors"
                      >
                        {submittingReview ? 'Envoi...' : 'Envoyer mon avis'}
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((review) => (
                      <div key={review.id} className="border border-zinc-200 rounded-2xl p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                size={15}
                                className={
                                  s <= review.rating
                                    ? 'fill-[#e8541a] text-[#e8541a]'
                                    : 'fill-zinc-200 text-zinc-200'
                                }
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-bold text-sm text-zinc-900">{review.name}</p>
                          {review.verified && (
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
                          )}
                        </div>
                        <p className="text-sm text-zinc-600 leading-relaxed mb-3">"{review.text}"</p>
                        <p className="text-xs text-zinc-400">Publie le {review.date}</p>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-10 text-center">
                      <p className="text-zinc-400">Aucun avis pour ce produit pour le moment.</p>
                    </div>
                  )}
                </div>

                {product.reviews && product.reviews.length > 6 && (
                  <div className="flex justify-center mt-8">
                    <button
                      type="button"
                      className="px-8 py-3 rounded-full border border-zinc-300 text-sm font-medium text-zinc-700 hover:border-[#e8541a] hover:text-[#e8541a] transition-colors"
                    >
                      Charger plus d'avis
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'faq' && (
              <div className="max-w-2xl space-y-4">
                {[
                  {
                    q: 'Quelle est la garantie sur ce produit ?',
                    a: "Ce produit beneficie d'une garantie fabricant de 12 mois. En cas de defaut, contactez notre service client.",
                  },
                  {
                    q: 'Quels sont les delais de livraison ?',
                    a: "Nous livrons sous 24h a 48h a Lome. Pour les villes de l'interieur, comptez 2 a 5 jours ouvrables.",
                  },
                  {
                    q: 'Puis-je retourner un produit ?',
                    a: "Oui, vous avez 7 jours apres reception pour retourner un produit non utilise dans son emballage d'origine.",
                  },
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
            <h2 className="text-2xl md:text-3xl font-black uppercase text-center mb-8">
              Vous pourriez aussi aimer
            </h2>
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
