import { uploadFile } from './api'
import api from './api'

export const documentService = {
  async getDocument() {
    const response = await api.get('/document')
    return response.data
  },
  // async createDocument(documentData) {
  //   const response = await uploadFile('/document/store', documentData)
  //   return response.data
  // },
  async showDocument(id: number) {
    const response = await api.get(`/document/show/${id}`)
    return response.data
  },
  async showDocumentByCustom(id: number) {
    const response = await api.get(`/document/showbyuser/${id}`)
    return response.data
  },
  async showDocumentByVisaRequest(id: number) {
    const response = await api.get(`/document/showbyvisarequest/${id}`)
    return response.data
  },
  async editDocument(id: number, documentData) {
    const response = await api.put(`/document/update/${id}`, documentData)
    return response.data
  },
  async deleteDocument(id: number) {
    const response = await api.delete(`/document/delete/${id}`)
    return response.data
  },
}
