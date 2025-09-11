import type { VisaType } from '@/types/visa'
import api from './api'

export const visaTypeService = {
  async getVisatype() {
    const response = await api.get('/visatype')
    return response.data
  },
  async createVisatype(userData: VisaType) {
    const response = await api.post('/visatype/store', userData)
    return response.data
  },
  async showVisatype(id: number) {
    const response = await api.get(`/visatype/show${id}`)
    return response.data
  },
  async editVisatype(id: number, userData: VisaType) {
    const response = await api.put(`/visatype/update/${id}`, userData)
    return response.data
  },
  async deleteVisatype(id: number) {
    const response = await api.delete(`/visatype/delete${id}`)
    return response.data
  },
}
