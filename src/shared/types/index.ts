import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'

export interface Category {
  id: string | number
  name: string
  slug: string
  icon?: IconDefinition
  image?: string
  count: number
  color: string
  bgColor: string
}

export interface Review {
  id: string | number
  name: string
  verified: boolean
  rating: number
  text: string
  date: string
}

export interface Product {
  id: string | number
  name: string
  slug: string
  price: number
  originalPrice?: number
  image: string
  category: string
  categorySlug: string
  rating: number
  reviewCount: number
  badge?: 'nouveau' | 'promo' | 'bestseller' | 'limité'
  stock: number
  description: string
  unit: string
  brand: string
  specifications?: Record<string, string>
  images?: string[]
  reviews?: Review[]
}

export interface CartItem {
  product: Product
  quantity: number
}
