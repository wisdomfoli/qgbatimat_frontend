import { Routes, Route, useLocation } from 'react-router'
import { useEffect } from 'react'
import { CartProvider } from '@/features/cart/CartProvider'
import Header from '@/shared/ui/Header'
import Footer from '@/shared/ui/Footer'
import HomePage from '@/features/home/HomePage'
import ProductsPage from '@/features/catalog/ProductsPage'
import ProductDetailPage from '@/features/catalog/ProductDetailPage'
import CartPage from '@/features/cart/CartPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
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
