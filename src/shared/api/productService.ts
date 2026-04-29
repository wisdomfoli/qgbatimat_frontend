import api from '../api/api-client'
import type { Category, Product } from '../types'

export const productService = {
  async getProducts(params?: Record<string, any>): Promise<Product[]> {
    const response = await api.get('/products', { params })
    return response.data.data
  },

  async getProduct(id: string): Promise<Product> {
    const response = await api.get(`/products/${id}`)
    return response.data.data
  },

  async getCategories(params?: Record<string, any>): Promise<Category[]> {
    const response = await api.get('/categories', { params })
    return response.data.data
  },

  async addReview(productId: string | number, rating: number, comment: string): Promise<any> {
    const response = await api.post(`/products/${productId}/reviews`, { rating, comment })
    return response.data
  },
}
