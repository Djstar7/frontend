import { countryService } from '@/services/countryService'
import type { Country } from '@/types/country'
import { toastInfo } from '@/utils/toastConfig'
import { defineStore } from 'pinia'

export const useCountryStore = defineStore('Country', {
  state: () => ({
    loading: false,
    error: null,
  }),
  actions: {
    async getCountry() {
      toastInfo('Chargement des pays en cours...')
      this.loading = true
      this.error = null
      try {
        return await countryService.getCountry()
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Echec du chargement'
        throw err
      } finally {
        this.loading = false
      }
    },
    async createCountry(userData: Country) {
      toastInfo('Creation des pays en cours...')
      this.loading = true
      this.error = null
      try {
        return await countryService.createCountry(userData)
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Echec lors de la creation'
        throw err
      } finally {
        this.loading = false
      }
    },
    async editCountry(id: number, userData: Country) {
      toastInfo('Mise a jour des pays en cours...')
      this.loading = true
      this.error = null
      try {
        return await countryService.editCountry(id, userData)
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Echec de la Mise a jour'
        throw err
      } finally {
        this.loading = false
      }
    },
    async deleteCountry(id: number) {
      toastInfo('Mise a jour des pays en cours...')
      this.loading = true
      this.error = null
      try {
        return await countryService.deleteCountry(id)
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Echec de la Mise a jour'
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})
