// src/stores/useUserStore.ts
import { defineStore } from 'pinia'
import userService from '@/services/userService'
import router from '@/router'
import { toast } from 'vue3-toastify'
import type { UserLogin, UserState, UserRegister, Custom } from '@/types/user'

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('access_token'),
    isAuthenticated: !!localStorage.getItem('access_token'),
    loading: false,
    error: null,
  }),

  actions: {
    notifySuccess(msg: string) {
      toast.success(msg)
    },

    notifyError(msg: string) {
      toast.error(msg)
    },
    notifyLoading(msg: string) {
      toast.loading(msg)
    },
    async register(data: UserRegister) {
      this.loading = true
      this.error = null
      try {
        const response = await userService.register(data)
        this.token = response.access_token
        this.user = response.user
        this.isAuthenticated = true

        // Sauvegarder dans le localStorage
        localStorage.setItem('access_token', this.token)
        localStorage.setItem('user', JSON.stringify(this.user))

        await router.push({ name: 'custom.dashboard' })
      } catch (err: any) {
        this.error = err.response?.data?.message || "Échec de l'enregistrement."
        this.resetAuth()
        throw err
      } finally {
        this.loading = false
      }
    },

    async login(credentials: UserLogin) {
      this.loading = true
      this.error = null
      try {
        const response = await userService.login(credentials)
        this.token = response.access_token
        this.user = response.user
        this.isAuthenticated = true

        // Sauvegarder dans le localStorage
        localStorage.setItem('access_token', this.token)
        localStorage.setItem('user', JSON.stringify(this.user))

        await router.push({ name: 'custom.dashboard' })
      } catch (err: any) {
        this.error =
          err.response?.data?.message || 'Échec de la connexion. Vérifiez vos identifiants.'
        this.resetAuth()
        throw err
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.loading = true
      this.error = null
      try {
        // await userService.logout() // optionnel côté serveur
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Erreur lors de la déconnexion.'
      } finally {
        this.resetAuth()
        await router.push({ name: 'auth.login' })
        this.loading = false
      }
    },
    async getUsers() {
      try {
        return await userService.getUsers()
      } catch (e: any) {
        console.error(
          e.response?.data?.message || 'Erreur lors de la récupération des utilisateurs',
        )
      }
    },
    async createUser(UserData: Custom) {
      try {
        return await userService.createUser(UserData)
      } catch (e: any) {
        console.error(
          e.response?.data?.message || 'Erreur lors de la récupération des utilisateurs',
        )
      }
    },

    async getUser(id: number) {
      try {
        return await userService.getUser(id)
      } catch (e: any) {
        console.error(
          e.response?.data?.message || 'Erreur lors de la récupération des utilisateurs',
        )
      }
    },
    async editUser(id: number, UserData: Custom) {
      try {
        const response = await userService.editUser(id, UserData)
        this.user = response.user
        this.isAuthenticated = true

        localStorage.setItem('user', JSON.stringify(this.user))
        await router.push({ name: 'custom.profil' })
      } catch (e: any) {
        console.error(
          e.response?.data?.message || 'Erreur lors de la récupération des utilisateurs',
        )
      }
    },

    async deleteUser(id: number) {
      this.loading = true
      this.error = null
      try {
        await userService.deleteUser(id)
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Erreur lors de la déconnexion.'
      } finally {
        await router.push({ name: 'custom.profil' })
        this.loading = false
      }
    },

    async fetchCurrentUser() {
      if (!this.token) return

      this.loading = true
      this.error = null
      try {
        const response = await userService.fetchUser()
        this.user = response.user
        this.isAuthenticated = true

        // Sauvegarder dans le localStorage
        localStorage.setItem('user', JSON.stringify(this.user))
      } catch (err: any) {
        console.error("Erreur lors de la récupération de l'utilisateur :", err)
        this.resetAuth()

        // Si l'erreur est 401 (Unauthorized), rediriger vers login
        if (err.response && err.response.status === 401) {
          await router.push({ name: 'auth.login' })
        }
      } finally {
        this.loading = false
      }
    },

    async initializeAuth() {
      if (this.token && !this.user) {
        await this.fetchCurrentUser()
      }
    },

    resetAuth() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
    },
  },
})
