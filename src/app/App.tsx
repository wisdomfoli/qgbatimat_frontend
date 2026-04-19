import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import CartPage from '@/features/cart/CartPage'
import { CartProvider } from '@/features/cart/CartProvider'
import ProductDetailPage from '@/features/catalog/ProductDetailPage'
import ProductsPage from '@/features/catalog/ProductsPage'
import HomePage from '@/features/home/HomePage'
import Footer from '@/shared/ui/Footer'
import Header from '@/shared/ui/Header'

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
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <ScrollToTop />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/produits" element={<ProductsPage />} />
            <Route path="/produit/:slug" element={<ProductDetailPage />} />
            <Route path="/panier" element={<CartPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </CartProvider>
  )
}

export default App
