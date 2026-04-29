import api from '@/shared/api/api-client'

export const profileService = {
  getProfile: async () => {
    const { data } = await api.get('/user')
    return data
  },

  getOrders: async () => {
    const response = await api.get('/orders')
    return response.data.data
  },
  
  getWishlist: async () => {
    const response = await api.get('/wishlist')
    return response.data.data
  },

  toggleWishlist: async (productId: number) => {
    const { data } = await api.post(`/wishlist/toggle/${productId}`)
    return data
  },

  updateProfile: async (profileData: { name: string; phone?: string; address?: string }) => {
    const { data } = await api.put('/user/profile', profileData)
    return data
  },

  updatePassword: async (passwordData: any) => {
    const { data } = await api.put('/user/password', passwordData)
    return data
  }
}
