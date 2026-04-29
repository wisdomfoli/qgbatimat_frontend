import { ChevronRight, Minus, Plus, ShoppingCart, Tag, Trash2, X, CheckCircle2, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { useCart } from '@/features/cart/useCart'
import api from '@/shared/api/api-client'
import { authService } from '@/features/auth/services/auth-service'
import { profileService } from '@/features/profile/profileService'
import Swal from 'sweetalert2'

interface CouponResult {
  code: string
  discount_type: 'fixed' | 'percentage'
  discount_value: number
  discount_amount: number
}

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart()
  const [promoCode, setPromoCode] = useState('')
  const [coupon, setCoupon] = useState<CouponResult | null>(null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState<string | null>(null)

  const [userProfile, setUserProfile] = useState<any>(null)

  useEffect(() => {
    if (authService.isAuthenticated()) {
      profileService.getProfile().then(setUserProfile).catch(() => {})
    }
  }, [])

  const discountAmount = coupon?.discount_amount ?? 0
  const isLome = userProfile?.city && userProfile.city.toLowerCase().replace('é', 'e').includes('lome')
  const deliveryFee = 0 // Aucun frais ajouté au total dans tous les cas
  const total = totalPrice - discountAmount + deliveryFee
  const navigate = useNavigate()

  const handleApplyCoupon = async () => {
    const code = promoCode.trim()
    if (!code) return
    setCouponLoading(true)
    setCouponError(null)
    setCoupon(null)
    try {
      const { data } = await api.post('/coupons/apply', {
        code,
        subtotal: totalPrice,
      })
      setCoupon(data)
      setPromoCode('')
      // Persist coupon for CheckoutPage
      sessionStorage.setItem('applied_coupon', JSON.stringify(data))
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Code promo invalide.'
      setCouponError(msg)
      sessionStorage.removeItem('applied_coupon')
    } finally {
      setCouponLoading(false)
    }
  }

  const handleRemoveCoupon = () => {
    setCoupon(null)
    setCouponError(null)
    setPromoCode('')
    sessionStorage.removeItem('applied_coupon')
  }

  const handleCheckoutClick = async () => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      const result = await Swal.fire({
        icon: 'info',
        title: 'Connexion requise',
        text: 'Vous devez être connecté pour passer une commande.',
        confirmButtonText: 'Se connecter',
        cancelButtonText: 'Annuler',
        showCancelButton: true,
        confirmButtonColor: '#e8541a',
        cancelButtonColor: '#6b7280',
      })
      if (result.isConfirmed) {
        navigate('/login')
      }
      return
    }
    navigate('/checkout')
  }

  if (items.length === 0) {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-white">
        <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingCart size={36} className="text-zinc-400" />
        </div>
        <h1 className="text-2xl font-black uppercase text-zinc-900 mb-2">Votre panier est vide</h1>
        <p className="text-zinc-500 mb-8 max-w-sm text-sm">
          Parcourez notre catalogue et ajoutez des produits pour commencer.
        </p>
        <Link
          to="/produits"
          className="inline-flex items-center gap-2 bg-[#e8541a] hover:bg-[#cc4a17] text-white px-8 py-3.5 rounded-full font-semibold transition-colors text-sm"
        >
          Continuer mes achats
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm text-zinc-400 mb-6">
          <Link to="/" className="hover:text-zinc-700 transition-colors">
            Accueil
          </Link>
          <ChevronRight size={14} />
          <span className="text-zinc-800 font-medium">Panier</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-black uppercase text-zinc-900 mb-8">
          Votre panier
        </h1>

        <div className="grid lg:grid-cols-[1fr_380px] gap-6">
          {/* Cart items */}
          <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
            {items.map(({ product, quantity }, idx) => {
              const itemDiscount = product.originalPrice
                ? Math.round(
                    ((product.originalPrice - product.price) / product.originalPrice) * 100,
                  )
                : null
              return (
                <div
                  key={product.id}
                  className={`flex gap-4 p-5 ${idx < items.length - 1 ? 'border-b border-zinc-100' : ''}`}
                >
                  {/* Image */}
                  <Link to={`/produit/${product.slug}`} className="shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl bg-zinc-50"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link to={`/produit/${product.slug}`}>
                          <h3 className="text-sm md:text-base font-semibold text-zinc-900 hover:text-zinc-600 transition-colors leading-tight line-clamp-2">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-zinc-400 mt-1">
                          Marque : <span className="text-zinc-600">{product.brand}</span>
                        </p>
                        <p className="text-xs text-zinc-400">
                          Unite : <span className="text-zinc-600">{product.unit}</span>
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(String(product.id))}
                        className="shrink-0 text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Qty stepper */}
                      <div className="flex items-center border border-zinc-200 rounded-full overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateQuantity(String(product.id), quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-zinc-50 transition-colors text-zinc-600"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-zinc-800">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(String(product.id), quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-zinc-50 transition-colors text-zinc-600"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        {itemDiscount && (
                          <p className="text-xs text-zinc-400 line-through">
                            {((product.originalPrice ?? 0) * quantity).toLocaleString('fr-TG')} FCFA
                          </p>
                        )}
                        <p className="text-base font-bold text-zinc-900">
                          {(product.price * quantity).toLocaleString('fr-TG')} FCFA
                        </p>
                        {itemDiscount && (
                          <span className="inline-block text-[11px] font-bold text-white bg-red-500 px-1.5 py-0.5 rounded-full mt-0.5">
                            -{itemDiscount}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Order summary */}
          <div>
            <div className="bg-white border border-zinc-200 rounded-2xl p-6">
              <h2 className="font-bold text-zinc-900 text-lg mb-5">Recapitulatif</h2>

              <div className="space-y-3.5 text-sm">
                <div className="flex justify-between text-zinc-600">
                  <span>Sous-total</span>
                  <span className="font-semibold text-zinc-900">
                    {totalPrice.toLocaleString('fr-TG')} FCFA
                  </span>
                </div>

                {coupon && (
                  <div className="flex justify-between text-zinc-600">
                    <span>
                      Remise{' '}
                      <span className="text-green-600 font-semibold">
                        ({coupon.discount_type === 'percentage'
                          ? `-${coupon.discount_value}%`
                          : `${coupon.discount_value.toLocaleString('fr-TG')} FCFA`})
                      </span>
                    </span>
                    <span className="font-semibold text-red-500">
                      -{discountAmount.toLocaleString('fr-TG')} FCFA
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-zinc-600">
                  <span>Frais de livraison</span>
                  {!authService.isAuthenticated() || !userProfile ? (
                    <span className="font-semibold text-zinc-500">À calculer</span>
                  ) : isLome ? (
                    <span className="font-semibold text-green-600">Gratuit</span>
                  ) : (
                    <span className="font-semibold text-orange-600">À payer au livreur</span>
                  )}
                </div>
              </div>

              <div className="border-t border-zinc-200 my-5 pt-5 flex justify-between items-center">
                <span className="font-bold text-zinc-900">Total</span>
                <span className="text-2xl font-black text-zinc-900">
                  {total.toLocaleString('fr-TG')}{' '}
                  <span className="text-sm font-semibold">FCFA</span>
                </span>
              </div>

              {/* Promo code */}
              {coupon ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-full px-4 py-2.5 mb-5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-600 shrink-0" />
                    <span className="text-sm font-semibold text-green-700">
                      {coupon.code} appliqué
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-green-600 hover:text-red-500 transition-colors"
                    aria-label="Retirer le coupon"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2 mb-2">
                    <div className="flex-1 flex items-center gap-2 border border-zinc-200 rounded-full px-4 py-2.5 focus-within:border-[#e8541a] transition-colors">
                      <Tag size={14} className="text-zinc-400 shrink-0" />
                      <input
                        id="promo-code-input"
                        type="text"
                        value={promoCode}
                        onChange={(e) => {
                          setPromoCode(e.target.value.toUpperCase())
                          setCouponError(null)
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                        placeholder="Code promo"
                        className="flex-1 text-sm bg-transparent outline-none text-zinc-700 placeholder-zinc-400 uppercase"
                      />
                    </div>
                    <button
                      id="apply-coupon-btn"
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !promoCode.trim()}
                      className="bg-[#e8541a] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#cc4a17] transition-colors shrink-0 disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {couponLoading ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        'Appliquer'
                      )}
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-xs text-red-500 font-medium mb-3 px-1">{couponError}</p>
                  )}
                </>
              )}

              {/* CTA */}
              <button
                type="button"
                onClick={handleCheckoutClick}
                className="w-full flex items-center justify-center gap-2 bg-[#e8541a] hover:bg-[#cc4a17] text-white py-4 rounded-full font-semibold text-sm transition-colors"
              >
                Passer la commande →
              </button>

              <Link
                to="/produits"
                className="block text-center text-sm text-zinc-500 hover:text-zinc-900 transition-colors mt-4"
              >
                Continuer mes achats
              </Link>

              {!authService.isAuthenticated() && (
                <p className="text-xs text-zinc-400 text-center mt-3">
                  Les frais de livraison seront calculés à la prochaine étape.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
