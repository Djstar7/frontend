import { visaTypeService } from '@/services/visaTypeService'
import type { VisaType } from '@/types/visa'
import { toastInfo } from '@/utils/toastConfig'
import { defineStore } from 'pinia'

export const useVisaTypeStore = defineStore('VisaType', {
  state: () => ({
    loading: false,
    error: null,
  }),
  actions: {
    async getVisaType() {
      toastInfo('Chargement des types de visa en cours...')
      this.loading = true
      this.error = null
      try {
        return await visaTypeService.getVisatype()
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Echec du chargement'
        throw err
      } finally {
        this.loading = false
      }
    },
    async createVisaType(visaTypeData: VisaType) {
      toastInfo('Creation des types de visa en cours...')
      this.loading = true
      this.error = null
      try {
        return await visaTypeService.createVisatype(visaTypeData)
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Echec lors de la creation'
        throw err
      } finally {
        this.loading = false
      }
    },
    async showVisaType(id: number) {
      toastInfo('Chargement des types de visa pour une demande en cours...')
      this.loading = true
      this.error = null
      try {
        return await visaTypeService.showVisatype(id)
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Echec du chargement'
        throw err
      } finally {
        this.loading = false
      }
    },
    async editVisaType(id: number, visaTypeData: VisaType) {
      toastInfo('Mise a jour des types de visa en cours...')
      this.loading = true
      this.error = null
      try {
        return await visaTypeService.editVisatype(id, visaTypeData)
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Echec de la Mise a jour'
        throw err
      } finally {
        this.loading = false
      }
    },
    async deleteVisaType(id: number) {
      toastInfo('Mise a jour des types de visa en cours...')
      this.loading = true
      this.error = null
      try {
        return await visaTypeService.deleteVisatype(id)
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Echec de la Mise a jour'
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})
