import { Heart, ShoppingCart, Star, Zap } from 'lucide-react'
import { Link } from 'react-router'
import { useCart } from '@/features/cart/useCart'
import type { Product } from '@/shared/types'
import { useWishlist } from '@/features/profile/WishlistContext'

const BADGE_STYLES: Record<string, string> = {
  nouveau: 'bg-[#1e2a6e] text-white',
  promo: 'bg-[#e8541a] text-white',
  bestseller: 'bg-[#e8541a] text-white',
  limité: 'bg-violet-500 text-white',
}

const BADGE_LABELS: Record<string, string> = {
  nouveau: 'Nouveau',
  promo: 'Promo',
  bestseller: 'Best-seller',
  limité: 'Stock limité',
}

interface Props {
  product: Product
}


export default function ProductCard({ product }: Props) {
  const { addToCart } = useCart()
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  function formatPrice(p: number) {
    return `${p.toLocaleString('fr-TG')} FCFA`
  }

  const { isWishlisted, toggleWishlist } = useWishlist()

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault()
    toggleWishlist(Number(product.id))
  }

  return (
    <div className="group flex flex-col bg-white shadow-sm rounded-2xl overflow-hidden p-4">
      {/* ── Image zone ── */}
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-zinc-100 aspect-square">
        {/* Product image */}
        <Link to={`/produit/${product.slug}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Hover gradient overlay */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/55 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Quick-add button — slides up on hover */}
        <div className="absolute inset-x-3 bottom-3 flex justify-center">
          <button
            type="button"
            onClick={() => addToCart(product)}
            className="flex items-center justify-center gap-2 w-full bg-white text-zinc-900 font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-full shadow-md translate-y-5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out hover:bg-zinc-50 active:scale-95"
          >
            <ShoppingCart size={13} />
            Ajouter au panier
          </button>
        </div>

        {/* Badges — top left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none z-10">
          {product.badge && (
            <span
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold leading-none ${BADGE_STYLES[product.badge]}`}
            >
              {BADGE_LABELS[product.badge]}
            </span>
          )}
        </div>

        {/* Wishlist — top right, appears on hover */}
        <button
          type="button"
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110 active:scale-95"
          aria-label="Ajouter aux favoris"
        >
          <Heart size={14} className={isWishlisted(Number(product.id)) ? "fill-red-500 text-red-500" : "text-zinc-600"} />
        </button>

        {/* Low stock strip */}
        {product.stock <= 10 && product.stock > 0 && (
          <div className="absolute top-3 left-3 right-3 flex items-center justify-center gap-1 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-full pointer-events-none z-20">
            <Zap size={10} />
            Plus que {product.stock} en stock
          </div>
        )}
      </div>

      {/* ── Product info ── */}
      <div className="pt-3 px-0.5">
        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-1">
          {product.category}
        </p>
        <Link to={`/produit/${product.slug}`}>
          <h3 className="text-sm font-semibold text-zinc-900 leading-snug hover:text-zinc-500 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Stars */}
        <div className="flex items-center gap-1 mt-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={11}
              className={
                star <= Math.round(product.rating)
                  ? 'fill-[#e8541a] text-[#e8541a]'
                  : 'fill-zinc-200 text-zinc-200'
              }
            />
          ))}
          <span className="text-xs text-zinc-400 ml-0.5">({product.reviewCount})</span>
        </div>

        {/* Price row */}
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-sm font-black text-zinc-900">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-xs text-zinc-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          {discount && <span className="text-[11px] font-bold text-red-500">-{discount}%</span>}
        </div>
      </div>
    </div>
  )
}
