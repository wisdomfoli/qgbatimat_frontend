import { useState } from 'react'
import { useNavigate } from 'react-router'
import { OrdersTab } from './OrdersTab'
import { SettingsTab } from './SettingsTab'
import { WishlistTab } from './WishlistTab'

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'settings' | 'orders' | 'wishlist'>('settings')
  const navigate = useNavigate()
  
  const token = localStorage.getItem('auth_token')
  if (!token) {
    navigate('/login')
    return null
  }

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    navigate('/login')
    window.location.reload()
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Mon Compte</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white p-4 rounded-xl shadow-sm space-y-2">
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-[#FF6B00] text-white font-medium' : 'hover:bg-gray-100 text-gray-700'}`}
              >
                Paramètres du Profil
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-[#FF6B00] text-white font-medium' : 'hover:bg-gray-100 text-gray-700'}`}
              >
                Mes Commandes
              </button>
              <button
                onClick={() => setActiveTab('wishlist')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'wishlist' ? 'bg-[#FF6B00] text-white font-medium' : 'hover:bg-gray-100 text-gray-700'}`}
              >
                Liste de Souhaits
              </button>
              <hr className="my-2 border-gray-200" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 rounded-lg transition-colors text-red-600 hover:bg-red-50"
              >
                Déconnexion
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm p-6 min-h-[400px]">
              {activeTab === 'orders' && <OrdersTab />}
              {activeTab === 'settings' && <SettingsTab />}
              {activeTab === 'wishlist' && <WishlistTab />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
