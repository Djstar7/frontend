import axios from 'axios'
import { useUserStore } from '@/stores/userStore'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Ton API Laravel
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Intercepteur de requête
api.interceptors.request.use(
  (config) => {
    const userStore = useUserStore() // récupère ton store Pinia
    const token = userStore.token || localStorage.getItem('access_token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default api
