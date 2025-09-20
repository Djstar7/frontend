import { documentService } from '@/services/documentService'
import { toastInfo } from '@/utils/toastConfig'
import { defineStore } from 'pinia'

export const useDocumentStore = defineStore('document', {
  state: () => ({
    loading: false,
    error: null,
    visa: null,
  }),
  actions: {
    async getDocument() {
      toastInfo('Chargement de la demande de visa en cours...')
      this.loading = true
      this.error = null
      try {
        return await documentService.getDocument()
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Echec du chargement'
        throw err
      } finally {
        this.loading = false
      }
    },
    // async createDocument(visaData: DocumentPayload) {
    //   toastInfo('Création de la demande de visa en cours...')
    //   this.loading = true
    //   this.error = null

    //   try {
    //     const response = await documentService.createDocument(visaData)
    //     this.visa = response
    //     return response
    //   } catch (err: any) {
    //     this.error = err.response?.data?.message || 'Échec lors de la création'
    //     throw err
    //   } finally {
    //     this.loading = false
    //   }
    // },
    async showDocument(id: number) {
      toastInfo('Chargement de la demande de visa pour une demande en cours...')
      this.loading = true
      this.error = null
      try {
        return await documentService.showDocument(id)
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Echec du chargement'
        throw err
      } finally {
        this.loading = false
      }
    },
    async showDocumentByCustom(id: number) {
      toastInfo('Chargement de la demande de visa pour une demande en cours...')
      this.loading = true
      this.error = null
      try {
        return await documentService.showDocumentByCustom(id)
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Echec du chargement'
        throw err
      } finally {
        this.loading = false
      }
    },
    async showDocumentByVisaRequest(id: number) {
      toastInfo('Chargement de la demande de visa pour une demande en cours...')
      this.loading = true
      this.error = null
      try {
        return await documentService.showDocumentByVisaRequest(id)
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Echec du chargement'
        throw err
      } finally {
        this.loading = false
      }
    },
    async editDocument(id: number, documentData) {
      toastInfo('Mise a jour de la demande de visa en cours...')
      this.loading = true
      this.error = null
      try {
        return await documentService.editDocument(id, documentData)
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Echec de la Mise a jour'
        throw err
      } finally {
        this.loading = false
      }
    },
    async deleteDocument(id: number) {
      toastInfo('Mise a jour de la demande de visa en cours...')
      this.loading = true
      this.error = null
      try {
        return await documentService.deleteDocument(id)
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Echec de la Mise a jour'
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})
