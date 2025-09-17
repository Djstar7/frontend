import axios from 'axios'
import { useUserStore } from '@/stores/userStore'

// 🔗 Config principale Axios
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Ton backend Laravel
  headers: {
    Accept: 'application/json',
  },
})

// 🚨 Intercepteur pour ajouter le token automatiquement
api.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    const token = userStore.token || localStorage.getItem('access_token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error),
)

// 📂 Helper pour upload de fichiers
export const uploadFile = async (url: string, formData: FormData) => {
  return api.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export default api
