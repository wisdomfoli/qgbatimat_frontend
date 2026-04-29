import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import LoginPage from '@/features/auth/LoginPage'
import RegisterPage from '@/features/auth/RegisterPage'
import CartPage from '@/features/cart/CartPage'
import CheckoutPage from '@/features/cart/CheckoutPage'
import { CartProvider } from '@/features/cart/CartProvider'
import { WishlistProvider } from '@/features/profile/WishlistContext'
import ProductDetailPage from '@/features/catalog/ProductDetailPage'
import ProductsPage from '@/features/catalog/ProductsPage'
import HomePage from '@/features/home/HomePage'
import ProfilePage from '@/features/profile/ProfilePage'
import Footer from '@/shared/ui/Footer'
import Header from '@/shared/ui/Header'

import { authService } from '@/features/auth/services/auth-service'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    // Reference `pathname` so the effect re-runs on client-side navigation (Biome exhaustive-deps).
    if (pathname) {
      window.scrollTo(0, 0)
    }
  }, [pathname])
  return null
}

function App() {
  useEffect(() => {
    authService.checkSessionTimeout();
  }, []);

  return (
    <CartProvider>
      <WishlistProvider>
        <div className="min-h-screen flex flex-col bg-white">
          <Header />
          <ScrollToTop />
          <div className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/produits" element={<ProductsPage />} />
            <Route path="/produit/:slug" element={<ProductDetailPage />} />
            <Route path="/panier" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </div>
        <Footer />
      </div>
      </WishlistProvider>
    </CartProvider>
  )
}

export default App
