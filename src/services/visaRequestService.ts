import type { VisaRequest } from '@/types/visa'
import api from './api'

export const visaRequestService = {
  async getVisaRequest() {
    const response = await api.get('/visa')
    return response.data
  },
  async createVisaRequest(visaRequestData: VisaRequest) {
    const response = await api.post('/visa/store', visaRequestData)
    return response.data
  },
  async showVisaRequest(id: number) {
    const response = await api.get(`/visa/show/${id}`)
    return response.data
  },
  async editVisaRequest(id: number, visaRequestData: VisaRequest) {
    const response = await api.put(`/visa/update/${id}`, visaRequestData)
    return response.data
  },
  async deleteVisaRequest(id: number) {
    const response = await api.delete(`/visa/delete/${id}`)
    return response.data
  },
}
