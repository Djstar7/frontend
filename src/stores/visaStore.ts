import { visaService } from '@/services/visaService'
import type { Visa, VisaFetch } from '@/types/visa'
import { toastInfo } from '@/utils/toastConfig'
import { defineStore } from 'pinia'

export const useVisaStore = defineStore('visa', {
  state: () => ({
    loading: false,
    error: null,
    visa: null,
  }),
  actions: {
    async getVisa() {
      toastInfo('Chargement des documents requis en cours...')
      this.loading = true
      this.error = null
      try {
        return await visaService.getVisa()
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Echec du chargement'
        throw err
      } finally {
        this.loading = false
      }
    },
    async createVisa(visaData: VisaFetch) {
      toastInfo('Création des documents requis en cours...')
      this.loading = true
      this.error = null

      try {
        const response = await visaService.createVisa(visaData)
        this.visa = response
        localStorage.setItem('visa', JSON.stringify(response))
        return response
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Échec lors de la création'
        localStorage.removeItem('visa')
        throw err
      } finally {
        this.loading = false
      }
    },
    async createStoreVisa(visaData: Visa) {
      toastInfo('Création des documents requis en cours...')
      this.loading = true
      this.error = null

      try {
        const response = await visaService.createStoreVisa(visaData)
        this.visa = response
        localStorage.setItem('visa', JSON.stringify(response))
        return response
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Échec lors de la création'
        localStorage.removeItem('visa')
        throw err
      } finally {
        this.loading = false
      }
    },
    async showVisa(id: number) {
      toastInfo('Chargement des documents requis pour une demande en cours...')
      this.loading = true
      this.error = null
      try {
        return await visaService.showVisa(id)
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Echec du chargement'
        throw err
      } finally {
        this.loading = false
      }
    },
    async editVisa(id: number, visaData: Visa) {
      toastInfo('Mise a jour des documents requis en cours...')
      this.loading = true
      this.error = null
      try {
        return await visaService.editVisa(id, visaData)
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Echec de la Mise a jour'
        throw err
      } finally {
        this.loading = false
      }
    },
    async deleteVisa(id: number) {
      toastInfo('Mise a jour des documents requis en cours...')
      this.loading = true
      this.error = null
      try {
        return await visaService.deleteVisa(id)
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Echec de la Mise a jour'
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})
