import { useEffect, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { profileService } from './profileService'

export function SettingsTab() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  // Form states
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Passwords
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwdMsg, setPwdMsg] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await profileService.getProfile()
        setUser(userData)
        setName(userData.name || '')
        setPhone(userData.phone || '')
        setAddress(userData.address || '')
        setCity(userData.city || '')
        // Mettre à jour le localStorage pour garder les infos synchronisées
        localStorage.setItem('user', JSON.stringify(userData))
      } catch (err) {
        console.error('Erreur lors du chargement du profil', err)
        // Fallback au localStorage
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
          const parsed = JSON.parse(savedUser)
          setUser(parsed)
          setName(parsed.name || '')
          setPhone(parsed.phone || '')
          setAddress(parsed.address || '')
          setCity(parsed.city || '')
        }
      } finally {
        setLoading(false)
      }
    }
    
    fetchUser()
  }, [])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMsg('')
    try {
      const res = await profileService.updateProfile({ name, phone, address, city })
      localStorage.setItem('user', JSON.stringify(res.user))
      setSuccessMsg('Profil mis à jour avec succès.')
    } catch (err) {
      console.error(err)
      setSuccessMsg('Erreur lors de la mise à jour.')
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwdMsg('')
    try {
      await profileService.updatePassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword
      })
      setPwdMsg('Mot de passe mis à jour avec succès.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      console.error(err)
      setPwdMsg(err.response?.data?.message || 'Erreur lors de la mise à jour du mot de passe.')
    }
  }

  if (loading) return <div>Chargement...</div>

  return (
    <div className="space-y-10">
      {/* Profil Info */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Informations personnelles</h2>
        {successMsg && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">{successMsg}</div>
        )}
        <form onSubmit={handleUpdateProfile} className="space-y-5 max-w-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#FF6B00] focus:border-[#FF6B00]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email (non modifiable)</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#FF6B00] focus:border-[#FF6B00]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ex: Lomé"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#FF6B00] focus:border-[#FF6B00]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse de livraison par défaut</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#FF6B00] focus:border-[#FF6B00]"
            ></textarea>
          </div>
          <button type="submit" className="px-6 py-2 bg-[#FF6B00] text-white rounded-lg hover:bg-orange-600 transition-colors font-medium">
            Sauvegarder les modifications
          </button>
        </form>
      </section>

      <hr className="border-gray-200" />

      {/* Mot de passe */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Changer le mot de passe</h2>
        {pwdMsg && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${pwdMsg.includes('succès') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {pwdMsg}
          </div>
        )}
        <form onSubmit={handleUpdatePassword} className="space-y-5 max-w-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel</label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-[#FF6B00] focus:border-[#FF6B00]"
                required
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600">
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-[#FF6B00] focus:border-[#FF6B00]"
                required
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600">
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le nouveau mot de passe</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-[#FF6B00] focus:border-[#FF6B00]"
                required
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600">
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">
            Mettre à jour le mot de passe
          </button>
        </form>
      </section>
    </div>
  )
}
