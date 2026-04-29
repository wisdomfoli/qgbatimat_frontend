import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { ChevronRight, CreditCard, Wallet, Truck, CheckCircle2, Tag, X } from 'lucide-react'
import { useCart } from '@/features/cart/useCart'
import api from '@/shared/api/api-client'
import Swal from 'sweetalert2'
import { authService } from '@/features/auth/services/auth-service'
import { profileService } from '@/features/profile/profileService'

interface CouponResult {
  code: string
  discount_type: 'fixed' | 'percentage'
  discount_value: number
  discount_amount: number
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [userProfile, setUserProfile] = useState<any>(null)
  const [coupon, setCoupon] = useState<CouponResult | null>(null)

  // Read coupon applied in CartPage from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem('applied_coupon')
    if (stored) {
      try {
        setCoupon(JSON.parse(stored))
      } catch {
        // ignore malformed data
      }
    }
  }, [])

  const discountAmount = coupon?.discount_amount ?? 0
  const isLome = userProfile?.city && userProfile.city.toLowerCase().replace('é', 'e').includes('lome')
  const deliveryFee = 0 // Aucun frais ajouté au total
  const total = totalPrice - discountAmount + deliveryFee

  useEffect(() => {
    if (items.length === 0) {
      navigate('/panier')
    }

    if (!authService.isAuthenticated()) {
      navigate('/login')
      return
    }

    const fetchProfile = async () => {
      try {
        const profile = await profileService.getProfile()
        setUserProfile(profile)
      } catch (err) {
        console.error('Failed to fetch profile', err)
      }
    }
    fetchProfile()
  }, [items, navigate])

  const handleRemoveCoupon = () => {
    setCoupon(null)
    sessionStorage.removeItem('applied_coupon')
  }

  const handleCheckout = async () => {
    try {
      setLoading(true)

      const orderItems = items.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }))

      const payload: Record<string, any> = {
        items: orderItems,
        payment_method: paymentMethod,
      }

      if (coupon) {
        payload.coupon_code = coupon.code
        payload.discount_amount = coupon.discount_amount
      }

      payload.shipping_fee = deliveryFee
      payload.shipping_city = userProfile?.city || ''

      await api.post('/orders', payload)

      clearCart()
      sessionStorage.removeItem('applied_coupon')

      Swal.fire({
        icon: 'success',
        title: 'Commande validée !',
        text: 'Votre commande a été enregistrée avec succès.',
        confirmButtonColor: '#e8541a',
      }).then(() => {
        navigate('/profile')
      })
    } catch (err) {
      console.error('Checkout error:', err)
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de valider la commande. Veuillez réessayer.',
        confirmButtonColor: '#e8541a',
      })
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) return null

  return (
    <main className="min-h-screen bg-zinc-50 pb-20">
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm text-zinc-400 mb-8">
          <Link to="/" className="hover:text-zinc-700 transition-colors">Accueil</Link>
          <ChevronRight size={14} />
          <Link to="/panier" className="hover:text-zinc-700 transition-colors">Panier</Link>
          <ChevronRight size={14} />
          <span className="text-zinc-800 font-medium">Paiement</span>
        </div>

        <h1 className="text-3xl font-black uppercase text-zinc-900 mb-8">Validation de la commande</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Forms */}
          <div className="space-y-6">

            {/* Delivery Address */}
            <section className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-[#e8541a]">
                  <Truck size={20} />
                </div>
                <h2 className="text-xl font-bold text-zinc-900">Adresse de livraison</h2>
              </div>

              {userProfile ? (
                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                  <p className="font-semibold text-zinc-900">{userProfile.name}</p>
                  <p className="text-zinc-600 mt-1">{userProfile.phone}</p>
                  <p className="text-zinc-600 mt-1">{userProfile.city ? `${userProfile.city}, ` : ''}{userProfile.address || 'Aucune adresse renseignée'}</p>

                  <Link to="/profile" className="text-sm font-semibold text-[#e8541a] mt-3 inline-block hover:underline">
                    Modifier mes informations
                  </Link>
                </div>
              ) : (
                <div className="animate-pulse flex flex-col gap-2">
                  <div className="h-4 bg-zinc-200 rounded w-1/2"></div>
                  <div className="h-4 bg-zinc-200 rounded w-3/4"></div>
                </div>
              )}
            </section>

            {/* Payment Method */}
            <section className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-700">
                  <CreditCard size={20} />
                </div>
                <h2 className="text-xl font-bold text-zinc-900">Mode de paiement</h2>
              </div>

              <div className="space-y-3">
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'cash' ? 'border-[#e8541a] bg-orange-50/50' : 'border-zinc-200 hover:border-zinc-300'}`}>
                  <input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4 text-[#e8541a] focus:ring-[#e8541a]" />
                  <div className="ml-3 flex items-center gap-2">
                    <Wallet size={18} className={paymentMethod === 'cash' ? 'text-[#e8541a]' : 'text-zinc-400'} />
                    <span className="font-medium text-zinc-900">Paiement à la livraison (Cash)</span>
                  </div>
                </label>

                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'flooz' ? 'border-[#e8541a] bg-orange-50/50' : 'border-zinc-200 hover:border-zinc-300'}`}>
                  <input type="radio" name="payment" value="flooz" checked={paymentMethod === 'flooz'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4 text-[#e8541a] focus:ring-[#e8541a]" />
                  <div className="ml-3 flex items-center gap-2">
                    <span className="font-medium text-zinc-900">Flooz / TMoney</span>
                  </div>
                </label>

                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-[#e8541a] bg-orange-50/50' : 'border-zinc-200 hover:border-zinc-300'}`}>
                  <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4 text-[#e8541a] focus:ring-[#e8541a]" />
                  <div className="ml-3 flex items-center gap-2">
                    <span className="font-medium text-zinc-900">Carte Bancaire (Visa/Mastercard)</span>
                  </div>
                </label>
              </div>
            </section>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 sticky top-24 shadow-sm">
              <h2 className="font-bold text-zinc-900 text-lg mb-5">Résumé de la commande</h2>

              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <img src={item.product.image} alt={item.product.name} className="w-16 h-16 rounded-lg object-cover bg-zinc-50 border border-zinc-100" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-zinc-900 line-clamp-2">{item.product.name}</p>
                      <p className="text-xs text-zinc-500 mt-1">Qté: {item.quantity}</p>
                      <p className="text-sm font-bold text-zinc-900 mt-0.5">{(item.product.price * item.quantity).toLocaleString('fr-TG')} FCFA</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-200 pt-5 space-y-3 text-sm">
                <div className="flex justify-between text-zinc-600">
                  <span>Sous-total ({items.length} articles)</span>
                  <span className="font-semibold text-zinc-900">{totalPrice.toLocaleString('fr-TG')} FCFA</span>
                </div>

                {/* Coupon applied */}
                {coupon && (
                  <div className="flex justify-between items-center text-zinc-600">
                    <div className="flex items-center gap-1.5">
                      <Tag size={13} className="text-green-600" />
                      <span className="text-green-700 font-medium">{coupon.code}</span>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-zinc-400 hover:text-red-500 transition-colors"
                        aria-label="Retirer le coupon"
                      >
                        <X size={13} />
                      </button>
                    </div>
                    <span className="font-semibold text-red-500">
                      -{discountAmount.toLocaleString('fr-TG')} FCFA
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-zinc-600">
                  <span>Frais de livraison</span>
                  {isLome ? (
                    <span className="font-semibold text-green-600">Gratuit</span>
                  ) : (
                    <span className="font-semibold text-orange-600">À payer au livreur</span>
                  )}
                </div>
              </div>

              <div className="border-t border-zinc-200 my-5 pt-5 flex justify-between items-center">
                <span className="font-bold text-zinc-900">Total à payer</span>
                <span className="text-2xl font-black text-[#e8541a]">
                  {total.toLocaleString('fr-TG')} <span className="text-sm font-semibold">FCFA</span>
                </span>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={loading || !userProfile?.address || !userProfile?.city}
                className="w-full flex items-center justify-center gap-2 bg-[#e8541a] hover:bg-[#cc4a17] text-white py-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-[0.98]"
              >
                {loading ? (
                  <span className="animate-pulse">Traitement en cours...</span>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    Confirmer et Payer
                  </>
                )}
              </button>

              {(!userProfile?.address || !userProfile?.city) && (
                <p className="text-xs text-red-500 text-center mt-3 font-medium">
                  Veuillez renseigner votre ville et adresse de livraison dans votre profil pour commander.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
