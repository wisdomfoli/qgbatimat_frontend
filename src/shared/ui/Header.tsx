import { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import qgLogo from '@/assets/icons/qg_batimat.png'
import { Link, useNavigate, useLocation } from 'react-router'
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  CircleUserRound,
  ChevronDown,
} from 'lucide-react'
import { useCart } from '@/features/cart/useCart'
import { categories } from '@/shared/data/categories'

export default function Header() {
  const { totalItems } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [catOpen, setCatOpen] = useState(false)
  const [announcementVisible, setAnnouncementVisible] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState(() => {
    const params = new URLSearchParams(location.search)
    return params.get('q') ?? ''
  })
  const catRef = useRef<HTMLDivElement>(null)

  // Live search: navigate on every keystroke
  function handleSearchChange(value: string) {
    setSearchQuery(value)
    if (value.trim()) {
      navigate(`/produits?q=${encodeURIComponent(value.trim())}`)
    } else if (location.pathname === '/produits') {
      navigate('/produits')
    }
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/produits?q=${encodeURIComponent(searchQuery.trim())}`)
      setMobileOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* Announcement bar */}
      {announcementVisible && (
        <div className="bg-[#e8541a] text-white text-xs">
          <div className="max-w-7xl mx-auto px-4 h-10 flex items-center justify-center relative">
            <p className="text-center">
              Livraison gratuite à Lomé dès 250 000 FCFA d'achat.{' '}
              <Link to="/produits" className="underline underline-offset-2 font-semibold hover:text-zinc-300">
                Commander maintenant
              </Link>
            </p>
            <button
              onClick={() => setAnnouncementVisible(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
              aria-label="Fermer"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Main header */}
      <div className="border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center gap-4 lg:gap-8">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-zinc-100 text-zinc-700 shrink-0"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <Link to="/" className="shrink-0">
            <img src={qgLogo} alt="QG Batimat" className="h-16 w-auto" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6 shrink-0 text-sm font-medium text-zinc-700">
            <div ref={catRef} className="relative">
              <button
                onClick={() => setCatOpen(!catOpen)}
                className="inline-flex items-center gap-1 hover:text-zinc-900 transition-colors py-1"
              >
                Boutique <ChevronDown size={14} className={`transition-transform duration-200 ${catOpen ? 'rotate-180' : ''}`} />
              </button>
              {catOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-zinc-200 rounded-2xl shadow-xl z-50 py-2 overflow-hidden">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/produits?categorie=${cat.slug}`}
                      onClick={() => setCatOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-50 text-sm text-zinc-700 transition-colors"
                    >
                      <span className="flex h-5 w-5 items-center justify-center text-sm text-black">
                        <FontAwesomeIcon icon={cat.icon} />
                      </span>
                      <span className="flex-1">{cat.name}</span>
                      <span className="text-xs text-zinc-400">{cat.count}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link to="/produits?badge=promo" className="hover:text-zinc-900 transition-colors py-1">
              Promotions
            </Link>
            <Link to="/produits?badge=nouveau" className="hover:text-zinc-900 transition-colors py-1">
              Nouveautés
            </Link>
            <Link to="/produits" className="hover:text-zinc-900 transition-colors py-1">
              Marques
            </Link>
          </nav>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:block flex-1 min-w-0 max-w-xl mx-auto">
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Rechercher des produits..."
                className="w-full h-10 rounded-full bg-zinc-100 border border-transparent pl-11 pr-4 text-sm text-zinc-700 placeholder-zinc-400 outline-none focus:border-[#e8541a] focus:bg-white transition-all"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0 ml-auto md:ml-0">
            <button
              className="hidden md:inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-zinc-100 text-zinc-700 transition-colors"
              aria-label="Compte"
              type="button"
            >
              <CircleUserRound size={20} />
            </button>
            <Link
              to="/panier"
              className="relative inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-zinc-100 text-zinc-700 transition-colors"
              aria-label="Panier"
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#e8541a] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/40" onClick={() => setMobileOpen(false)}>
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 h-16 border-b border-zinc-200">
              <Link to="/" onClick={() => setMobileOpen(false)}>
                <img src={qgLogo} alt="QG Batimat" className="h-14 w-auto" />
              </Link>
              <button onClick={() => setMobileOpen(false)} className="p-2 hover:bg-zinc-100 rounded-full"><X size={20} /></button>
            </div>
            <div className="px-5 py-4">
              <form onSubmit={handleSearch} className="mb-5">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Rechercher..."
                    className="w-full h-10 rounded-full bg-zinc-100 pl-10 pr-4 text-sm text-zinc-700 outline-none focus:bg-white border border-transparent focus:border-[#e8541a] transition-all"
                  />
                </div>
              </form>

              <nav className="grid gap-1">
                <Link to="/produits?badge=promo" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-zinc-700 hover:bg-zinc-100 font-medium">Promotions</Link>
                <Link to="/produits?badge=nouveau" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-zinc-700 hover:bg-zinc-100 font-medium">Nouveautés</Link>
                <Link to="/produits" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-zinc-700 hover:bg-zinc-100 font-medium">Marques</Link>
              </nav>

              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mt-5 mb-2">Catégories</p>
              <div className="grid gap-0.5">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/produits?categorie=${cat.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-100 text-sm text-zinc-700 transition-colors"
                  >
                    <span className="flex h-5 w-5 items-center justify-center text-sm text-[#1e2a6e]">
                      <FontAwesomeIcon icon={cat.icon} />
                    </span>
                    <span className="flex-1">{cat.name}</span>
                    <span className="text-xs text-zinc-400">{cat.count}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
