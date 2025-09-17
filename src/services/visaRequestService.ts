import type { VisaRequestPayload } from '@/types/visa'
import api from './api'

export const visaRequestService = {
  async getVisaRequest() {
    const response = await api.get('/visarequest')
    return response.data
  },
  async createVisaRequest(visaRequestData: VisaRequestPayload) {
    const response = await api.post('/visarequest/store', visaRequestData)
    return response.data
  },
  async showVisaRequest(id: number) {
    const response = await api.get(`/visarequest/show/${id}`)
    return response.data
  },
  async showVisaRequestByUser(id: number) {
    const response = await api.get(`/visarequest/showbyuser/${id}`)
    return response.data
  },
  async editVisaRequest(id: number, visaRequestData: VisaRequestPayload) {
    const response = await api.put(`/visarequest/update/${id}`, visaRequestData)
    return response.data
  },
  async deleteVisaRequest(id: number) {
    const response = await api.delete(`/visarequest/delete/${id}`)
    return response.data
  },
}
