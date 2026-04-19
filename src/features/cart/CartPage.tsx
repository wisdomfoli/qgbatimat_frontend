import { Link } from 'react-router'
import { Trash2, Plus, Minus, ChevronRight, ShoppingCart, Tag } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/features/cart/useCart'

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart()
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)

  const discount = promoApplied ? Math.round(totalPrice * 0.2) : 0
  const deliveryFee = totalPrice > 50000 ? 0 : 3500
  const total = totalPrice - discount + deliveryFee

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
        <Link to="/produits" className="inline-flex items-center gap-2 bg-[#e8541a] hover:bg-[#cc4a17] text-white px-8 py-3.5 rounded-full font-semibold transition-colors text-sm">
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
          <Link to="/" className="hover:text-zinc-700 transition-colors">Accueil</Link>
          <ChevronRight size={14} />
          <span className="text-zinc-800 font-medium">Panier</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-black uppercase text-zinc-900 mb-8">Votre panier</h1>

        <div className="grid lg:grid-cols-[1fr_380px] gap-6">
          {/* Cart items */}
          <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
            {items.map(({ product, quantity }, idx) => {
              const discount = product.originalPrice
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
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
                        <p className="text-xs text-zinc-400 mt-1">Marque : <span className="text-zinc-600">{product.brand}</span></p>
                        <p className="text-xs text-zinc-400">Unite : <span className="text-zinc-600">{product.unit}</span></p>
                      </div>
                      <button
                        onClick={() => removeFromCart(product.id)}
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
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-zinc-50 transition-colors text-zinc-600"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-zinc-800">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-zinc-50 transition-colors text-zinc-600"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        {discount && (
                          <p className="text-xs text-zinc-400 line-through">
                            {(product.originalPrice! * quantity).toLocaleString('fr-TG')} FCFA
                          </p>
                        )}
                        <p className="text-base font-bold text-zinc-900">
                          {(product.price * quantity).toLocaleString('fr-TG')} FCFA
                        </p>
                        {discount && (
                          <span className="inline-block text-[11px] font-bold text-white bg-red-500 px-1.5 py-0.5 rounded-full mt-0.5">
                            -{discount}%
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
                  <span className="font-semibold text-zinc-900">{totalPrice.toLocaleString('fr-TG')} FCFA</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-zinc-600">
                    <span>Remise (-20%)</span>
                    <span className="font-semibold text-red-500">-{discount.toLocaleString('fr-TG')} FCFA</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-600">
                  <span>Frais de livraison</span>
                  {deliveryFee === 0
                    ? <span className="font-semibold text-green-600">Gratuit</span>
                    : <span className="font-semibold text-zinc-900">{deliveryFee.toLocaleString('fr-TG')} FCFA</span>
                  }
                </div>
              </div>

              <div className="border-t border-zinc-200 my-5 pt-5 flex justify-between items-center">
                <span className="font-bold text-zinc-900">Total</span>
                <span className="text-2xl font-black text-zinc-900">{total.toLocaleString('fr-TG')} <span className="text-sm font-semibold">FCFA</span></span>
              </div>

              {/* Promo code */}
              <div className="flex gap-2 mb-5">
                <div className="flex-1 flex items-center gap-2 border border-zinc-200 rounded-full px-4 py-2.5">
                  <Tag size={14} className="text-zinc-400 shrink-0" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Code promo"
                    className="flex-1 text-sm bg-transparent outline-none text-zinc-700 placeholder-zinc-400"
                  />
                </div>
                <button
                  onClick={() => { if (promoCode.trim()) setPromoApplied(true) }}
                  className="bg-[#e8541a] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#cc4a17] transition-colors shrink-0"
                >
                  Appliquer
                </button>
              </div>

              {/* CTA */}
              <button className="w-full flex items-center justify-center gap-2 bg-[#e8541a] hover:bg-[#cc4a17] text-white py-4 rounded-full font-semibold text-sm transition-colors">
                Passer la commande →
              </button>

              <Link to="/produits" className="block text-center text-sm text-zinc-500 hover:text-zinc-900 transition-colors mt-4">
                Continuer mes achats
              </Link>

              {deliveryFee > 0 && (
                <p className="text-xs text-zinc-400 text-center mt-3">
                  Livraison gratuite a partir de 50 000 FCFA
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
