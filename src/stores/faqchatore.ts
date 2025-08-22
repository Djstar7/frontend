import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
import type { FaqChat } from '@/types/faqchat'

export const useApiStore = defineStore('api', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const data = ref<FaqChat[]>([])
  async function index(url: string) {
    loading.value = true
    error.value = null

    try {
      const response = await api.get(url)
      data.value = response.data.faqchats
      return data.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur inconnue'
      throw error.value
    } finally {
      loading.value = false
    }
  }
  return {
    loading,
    error,
    data,
    index,
  }
})
