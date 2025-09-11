import type { Visa, VisaFetch } from '@/types/visa'
import api from './api'

export const visaService = {
  async getVisa() {
    const response = await api.get('/visa')
    return response.data
  },
  async createVisa(visaData: VisaFetch) {
    const response = await api.post('/visa/store', visaData)
    return response.data
  },
  async createStoreVisa(visaData: Visa) {
    const response = await api.post('/visa/storestore', visaData)
    return response.data
  },
  async showVisa(id: number) {
    const response = await api.get(`/visa/show/${id}`)
    return response.data
  },
  async editVisa(id: number, visaData: Visa) {
    const response = await api.put(`/visa/update/${id}`, visaData)
    return response.data
  },
  async deleteVisa(id: number) {
    const response = await api.delete(`/visa/delete/${id}`)
    return response.data
  },
}
