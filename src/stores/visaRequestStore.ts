import { visaRequestService } from '@/services/visaRequestService'
import type { VisaRequestPayload } from '@/types/visa'
import { toastInfo } from '@/utils/toastConfig'
import { defineStore } from 'pinia'
function safeParse(item: string | null) {
  if (!item || item === 'undefined' || item === 'null') return null
  try {
    return JSON.parse(item)
  } catch {
    return null
  }
}
export const useVisaRequestStore = defineStore('visarequest', {
  state: () => ({
    loading: false,
    error: null,
    visaRequestId: safeParse(localStorage.getItem('visarequestId')),
    user_id: safeParse(localStorage.getItem('user_id')),
  }),
  actions: {
    async getVisaRequest() {
      toastInfo('Chargement de la demande de visa en cours...')
      this.loading = true
      this.error = null
      try {
        return await visaRequestService.getVisaRequest()
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Echec du chargement'
        throw err
      } finally {
        this.loading = false
      }
    },
    async createVisaRequest(visaData: VisaRequestPayload) {
      toastInfo('Création de la demande de visa en cours...')
      this.loading = true
      this.error = null

      try {
        const response = await visaRequestService.createVisaRequest(visaData)
        localStorage.setItem('visarequestId', JSON.stringify(response.id))
        localStorage.setItem('user_id', JSON.stringify(response.user_id))
        console.log('Data recus du controller', response)
        this.user_id = response.user_id
        this.visaRequestId = response.id
        return response
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Échec lors de la création'
        localStorage.removeItem('visarequest')
        throw err
      } finally {
        this.loading = false
      }
    },
    async showVisaRequest(id: number) {
      toastInfo('Chargement de la demande de visa pour une demande en cours...')
      this.loading = true
      this.error = null
      try {
        return await visaRequestService.showVisaRequest(id)
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Echec du chargement'
        throw err
      } finally {
        this.loading = false
      }
    },
    async showVisaRequestByUser(id: number) {
      toastInfo('Chargement de la demande de visa pour une demande en cours...')
      this.loading = true
      this.error = null
      try {
        return await visaRequestService.showVisaRequestByUser(id)
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Echec du chargement'
        throw err
      } finally {
        this.loading = false
      }
    },
    async editVisaRequest(id: number, visaData: VisaRequestPayload) {
      toastInfo('Mise a jour de la demande de visa en cours...')
      this.loading = true
      this.error = null
      try {
        return await visaRequestService.editVisaRequest(id, visaData)
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Echec de la Mise a jour'
        throw err
      } finally {
        this.loading = false
      }
    },
    async deleteVisaRequest(id: number) {
      toastInfo('Mise a jour de la demande de visa en cours...')
      this.loading = true
      this.error = null
      try {
        this.visaRequestId = null
        localStorage.removeItem('visarequestId')
        return await visaRequestService.deleteVisaRequest(id)
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Echec de la Mise a jour'
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})
