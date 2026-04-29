import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ChevronDown, ChevronRight, Loader2, SlidersHorizontal, Star, X } from 'lucide-react'
import { type Dispatch, type SetStateAction, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { productService } from '@/shared/api/productService'
import type { Category, Product } from '@/shared/types'
import ProductCard from '@/shared/ui/ProductCard'

type SortOption = 'pertinence' | 'prix-asc' | 'prix-desc' | 'note' | 'newest'

const SORT_LABELS: Record<SortOption, string> = {
  pertinence: 'Le plus populaire',
  'prix-asc': 'Prix croissant',
  'prix-desc': 'Prix decroissant',
  note: 'Mieux notes',
  newest: 'Nouveautes',
}

const PRICE_RANGES = [
  { label: 'Moins de 10 000 FCFA', min: 0, max: 10000 },
  { label: '10 000 – 50 000 FCFA', min: 10000, max: 50000 },
  { label: '50 000 – 100 000 FCFA', min: 50000, max: 100000 },
  { label: 'Plus de 100 000 FCFA', min: 100000, max: Infinity },
]

type FilterSectionsOpen = { categorie: boolean; prix: boolean; note: boolean }

interface ProductFiltersSidebarProps {
  categories: Category[]
  hasActiveFilters: boolean
  clearFilters: () => void
  toggleSection: (key: keyof FilterSectionsOpen) => void
  openSections: FilterSectionsOpen
  categorySlug: string
  onSelectCategory: (slug: string) => void
  priceRange: { min: number; max: number } | null
  setPriceRange: Dispatch<SetStateAction<{ min: number; max: number } | null>>
  minRating: number | null
  setMinRating: Dispatch<SetStateAction<number | null>>
  onApplyFilters: () => void
}

function ProductFiltersSidebar({
  categories,
  hasActiveFilters,
  clearFilters,
  toggleSection,
  openSections,
  categorySlug,
  onSelectCategory,
  priceRange,
  setPriceRange,
  minRating,
  setMinRating,
  onApplyFilters,
}: ProductFiltersSidebarProps) {
  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="flex items-center justify-between py-4 border-b border-zinc-200">
        <div className="flex items-center gap-2 font-semibold text-zinc-900">
          <SlidersHorizontal size={16} />
          Filtres
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs text-zinc-500 underline hover:text-zinc-900 transition-colors"
          >
            Tout effacer
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="py-4 border-b border-zinc-200">
        <button
          type="button"
          onClick={() => toggleSection('categorie')}
          className="w-full flex items-center justify-between text-sm font-semibold text-zinc-900 mb-0"
        >
          <span>Categorie</span>
          <ChevronDown
            size={16}
            className={`transition-transform ${openSections.categorie ? 'rotate-180' : ''}`}
          />
        </button>
        {openSections.categorie && (
          <div className="mt-3 space-y-1">
            {categories.map((cat) => (
              <button
                type="button"
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className="w-full text-left text-sm px-0 py-1.5 flex items-center justify-between group"
              >
                <span
                  className={`transition-colors ${categorySlug === cat.slug ? 'text-zinc-900 font-semibold' : 'text-zinc-500 hover:text-zinc-900'}`}
                >
                  {cat.name}
                </span>
                <ChevronRight
                  size={14}
                  className="text-zinc-300 group-hover:text-zinc-500 transition-colors"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price */}
      <div className="py-4 border-b border-zinc-200">
        <button
          type="button"
          onClick={() => toggleSection('prix')}
          className="w-full flex items-center justify-between text-sm font-semibold text-zinc-900"
        >
          <span>Prix</span>
          <ChevronDown
            size={16}
            className={`transition-transform ${openSections.prix ? 'rotate-180' : ''}`}
          />
        </button>
        {openSections.prix && (
          <div className="mt-3 space-y-2">
            {PRICE_RANGES.map((range) => {
              const active = priceRange?.min === range.min && priceRange?.max === range.max
              return (
                <button
                  type="button"
                  key={range.label}
                  onClick={() => setPriceRange(active ? null : { min: range.min, max: range.max })}
                  className={`w-full text-left text-sm py-1 transition-colors ${active ? 'text-zinc-900 font-semibold' : 'text-zinc-500 hover:text-zinc-900'}`}
                >
                  {range.label}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="py-4 border-b border-zinc-200">
        <button
          type="button"
          onClick={() => toggleSection('note')}
          className="w-full flex items-center justify-between text-sm font-semibold text-zinc-900"
        >
          <span>Note minimum</span>
          <ChevronDown
            size={16}
            className={`transition-transform ${openSections.note ? 'rotate-180' : ''}`}
          />
        </button>
        {openSections.note && (
          <div className="mt-3 space-y-2">
            {[4, 3, 2].map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => setMinRating(minRating === r ? null : r)}
                className={`w-full text-left text-sm py-1 flex items-center gap-2 transition-colors ${minRating === r ? 'text-zinc-900 font-semibold' : 'text-zinc-500 hover:text-zinc-900'}`}
              >
                <span className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={13}
                      className={
                        s <= r ? 'fill-[#e8541a] text-[#e8541a]' : 'fill-zinc-200 text-zinc-200'
                      }
                    />
                  ))}
                </span>
                <span>{r}+</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Apply */}
      <div className="pt-4">
        <button
          type="button"
          onClick={onApplyFilters}
          className="w-full bg-[#e8541a] text-white py-3.5 rounded-full text-sm font-semibold hover:bg-[#cc4a17] transition-colors"
        >
          Appliquer le filtre
        </button>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  const [params, setParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [sort, setSort] = useState<SortOption>('pertinence')
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null)
  const [minRating, setMinRating] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 9

  const [openSections, setOpenSections] = useState<FilterSectionsOpen>({
    categorie: true,
    prix: true,
    note: false,
  })

  const searchQuery = params.get('q') ?? ''
  const categorySlug = params.get('categorie') ?? ''
  const badgeFilter = params.get('badge') ?? ''

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await productService.getCategories()
        setCategories(data)
      } catch (err) {
        console.error('Failed to fetch categories:', err)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const queryParams: Record<string, string> = {}
        if (searchQuery) queryParams.q = searchQuery
        if (categorySlug) queryParams.category = categorySlug
        if (badgeFilter) queryParams.badge = badgeFilter

        const productsData = await productService.getProducts(queryParams)
        setProducts(productsData)
      } catch (err) {
        console.error('Failed to fetch products:', err)
        setError('Impossible de charger les produits. Veuillez réessayer plus tard.')
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [searchQuery, categorySlug, badgeFilter])

  const currentCategory = categories.find((c) => c.slug === categorySlug)

  const filtered = useMemo(() => {
    let list = [...products]
    if (priceRange)
      list = list.filter((p) => p.price >= priceRange.min && p.price <= priceRange.max)
    if (minRating) list = list.filter((p) => p.rating >= minRating)
    if (sort === 'prix-asc') list.sort((a, b) => a.price - b.price)
    else if (sort === 'prix-desc') list.sort((a, b) => b.price - a.price)
    else if (sort === 'note') list.sort((a, b) => b.rating - a.rating)
    else if (sort === 'newest')
      list = list
        .filter((p) => p.badge === 'nouveau')
        .concat(list.filter((p) => p.badge !== 'nouveau'))
    return list
  }, [products, priceRange, minRating, sort])

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, categorySlug, badgeFilter, priceRange, minRating, sort])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filtered.slice(start, start + ITEMS_PER_PAGE)
  }, [filtered, currentPage])

  function clearFilters() {
    setPriceRange(null)
    setMinRating(null)
    setParams({})
  }

  const hasActiveFilters = searchQuery || categorySlug || badgeFilter || priceRange || minRating

  function toggleSection(key: keyof FilterSectionsOpen) {
    setOpenSections((s) => ({ ...s, [key]: !s[key] }))
  }

  const sidebarProps: ProductFiltersSidebarProps = {
    categories,
    hasActiveFilters: Boolean(hasActiveFilters),
    clearFilters,
    toggleSection,
    openSections,
    categorySlug,
    onSelectCategory: (slug) => setParams({ categorie: slug }),
    priceRange,
    setPriceRange,
    minRating,
    setMinRating,
    onApplyFilters: () => setFiltersOpen(false),
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#e8541a] animate-spin" />
          <p className="text-zinc-500 font-medium">Chargement des produits...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-500 font-semibold mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-black text-white px-6 py-2 rounded-full font-medium"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 pt-5 pb-2">
        <div className="flex items-center gap-1.5 text-sm text-zinc-400">
          <Link to="/" className="hover:text-zinc-700 transition-colors">
            Accueil
          </Link>
          <ChevronRight size={14} />
          <span className="text-zinc-800">
            {currentCategory
              ? currentCategory.name
              : badgeFilter === 'bestseller'
                ? 'Top Ventes'
                : badgeFilter === 'nouveau'
                  ? 'Nouveautés'
                  : badgeFilter === 'promo'
                    ? 'Promotions'
                    : searchQuery
                      ? `"${searchQuery}"`
                      : 'Tous les produits'}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 flex gap-8">
        {/* Sidebar desktop */}
        <aside className="w-56 shrink-0 hidden lg:block">
          <ProductFiltersSidebar {...sidebarProps} />
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Title + toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <h1 className="text-2xl font-black text-zinc-900">
                {currentCategory
                  ? currentCategory.name
                  : badgeFilter === 'bestseller'
                    ? 'Top Ventes'
                    : badgeFilter === 'nouveau'
                      ? 'Nouveautés'
                      : badgeFilter === 'promo'
                        ? 'Promotions'
                        : searchQuery
                          ? `Recherche : "${searchQuery}"`
                          : 'Tous les produits'}
              </h1>
              <p className="text-sm text-zinc-400 mt-0.5">
                Affichage {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filtered.length)}-
                {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} sur {filtered.length} produits
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Mobile filters btn */}
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-zinc-200 rounded-full text-sm text-zinc-700 hover:border-zinc-900 transition-colors"
              >
                <SlidersHorizontal size={14} />
                Filtres
                {hasActiveFilters && <span className="w-2 h-2 bg-black rounded-full" />}
              </button>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="appearance-none bg-white border border-zinc-200 rounded-full text-sm text-zinc-700 pl-4 pr-8 py-2.5 outline-none focus:border-zinc-900 cursor-pointer"
                >
                  <option value="" disabled>
                    Trier par
                  </option>
                  {Object.entries(SORT_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Active chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-5">
              {categorySlug && (
                <span className="inline-flex items-center gap-1.5 bg-zinc-100 text-zinc-700 text-xs font-medium px-3 py-1.5 rounded-full">
                  {currentCategory?.name}
                  <button
                    type="button"
                    onClick={() => {
                      const p = new URLSearchParams(params)
                      p.delete('categorie')
                      setParams(p)
                    }}
                  >
                    <X size={11} />
                  </button>
                </span>
              )}
              {badgeFilter && (
                <span className="inline-flex items-center gap-1.5 bg-zinc-100 text-zinc-700 text-xs font-medium px-3 py-1.5 rounded-full">
                  {badgeFilter === 'bestseller'
                    ? 'Top Ventes'
                    : badgeFilter === 'nouveau'
                      ? 'Nouveautés'
                      : 'Promotions'}
                  <button
                    type="button"
                    onClick={() => {
                      const p = new URLSearchParams(params)
                      p.delete('badge')
                      setParams(p)
                    }}
                  >
                    <X size={11} />
                  </button>
                </span>
              )}
              {priceRange && (
                <span className="inline-flex items-center gap-1.5 bg-zinc-100 text-zinc-700 text-xs font-medium px-3 py-1.5 rounded-full">
                  Prix filtre
                  <button type="button" onClick={() => setPriceRange(null)}>
                    <X size={11} />
                  </button>
                </span>
              )}
              {minRating && (
                <span className="inline-flex items-center gap-1.5 bg-zinc-100 text-zinc-700 text-xs font-medium px-3 py-1.5 rounded-full">
                  {minRating}+ etoiles
                  <button type="button" onClick={() => setMinRating(null)}>
                    <X size={11} />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Products grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-5xl mb-4 text-zinc-400" />
              <h3 className="text-xl font-bold text-zinc-800 mb-2">Aucun produit trouve</h3>
              <p className="text-zinc-500 mb-6">Modifiez vos filtres ou votre recherche.</p>
              <button
                type="button"
                onClick={clearFilters}
                className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-zinc-800 transition-colors"
              >
                Effacer les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-10 pt-5 border-t border-zinc-200">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((p) => Math.max(1, p - 1))
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  currentPage === 1
                    ? 'text-zinc-300 cursor-not-allowed'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                ← Precedent
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    // Show current page, first, last, and neighbors
                    return (
                      p === 1 ||
                      p === totalPages ||
                      Math.abs(p - currentPage) <= 1
                    )
                  })
                  .map((p, i, arr) => (
                    <div key={p} className="flex items-center gap-1">
                      {i > 0 && arr[i - 1] !== p - 1 && (
                        <span className="px-1 text-zinc-400">...</span>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentPage(p)
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}
                        className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
                          p === currentPage
                            ? 'bg-black text-white'
                            : 'text-zinc-600 hover:bg-zinc-100'
                        }`}
                      >
                        {p}
                      </button>
                    </div>
                  ))}
              </div>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  currentPage === totalPages
                    ? 'text-zinc-300 cursor-not-allowed'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Suivant →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 h-full w-full cursor-default border-0 bg-black/40 p-0"
            aria-label="Fermer les filtres"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 z-10 w-80 bg-white shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between px-5 h-16 border-b border-zinc-200">
              <h2 className="font-bold text-zinc-900">Filtres</h2>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="p-2 hover:bg-zinc-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            <div className="px-5 py-4">
              <ProductFiltersSidebar {...sidebarProps} />
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
