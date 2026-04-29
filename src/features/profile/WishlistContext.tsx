import React, { createContext, useContext, useEffect, useState } from 'react'
import { profileService } from './profileService'
import { useNavigate } from 'react-router'
import Swal from 'sweetalert2'

interface WishlistContextType {
  wishlistIds: Set<number>
  toggleWishlist: (productId: number) => Promise<void>
  isWishlisted: (productId: number) => boolean
  refreshWishlist: () => Promise<void>
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3500,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<Set<number>>(new Set())
  const navigate = useNavigate()

  const refreshWishlist = async () => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      setWishlistIds(new Set())
      return
    }
    try {
      const data = await profileService.getWishlist()
      const ids = new Set(data.map((item: any) => item.product_id))
      setWishlistIds(ids as Set<number>)
    } catch (err) {
      console.error('Failed to fetch wishlist context', err)
    }
  }

  useEffect(() => {
    refreshWishlist()
  }, [])

  const isWishlisted = (productId: number) => wishlistIds.has(productId)

  const toggleWishlist = async (productId: number) => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      const result = await Swal.fire({
        icon: 'info',
        title: 'Connexion requise',
        text: 'Vous devez être connecté pour ajouter ce produit à vos favoris.',
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

    try {
      const res = await profileService.toggleWishlist(productId)
      setWishlistIds((prev) => {
        const next = new Set(prev)
        if (res.is_in_wishlist) {
          next.add(productId)
        } else {
          next.delete(productId)
        }
        return next
      })
    } catch (err) {
      console.error(err)
      Toast.fire({
        icon: 'error',
        title: "Erreur lors de l'ajout aux favoris"
      })
    }
  }

  return (
    <WishlistContext.Provider value={{ wishlistIds, toggleWishlist, isWishlisted, refreshWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
