import type { Country } from '@/types/country'
import api from './api'

export const countryService = {
  async getCountry() {
    const response = await api.get('/country')
    return response.data
  },
  async createCountry(userData: Country) {
    const response = await api.post('/country/store', userData)
    return response.data
  },
  async editCountry(id: number, userData: Country) {
    const response = await api.put(`/country/update/${id}`, userData)
    return response.data
  },
  async deleteCountry(id: number) {
    const response = await api.delete(`/country/delete/${id}`)
    return response.data
  },
}
