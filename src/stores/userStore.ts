// src/stores/useUserStore.ts
import { defineStore } from 'pinia'
import userService from '@/services/userService'
import router from '@/router'
import type { UserLogin, UserState, UserRegister, Custom, Profil } from '@/types/user'
import { toastInfo, toastError } from '@/utils/toastConfig'

function safeParse(item: string | null) {
  if (!item || item === 'undefined' || item === 'null') return null
  try {
    return JSON.parse(item)
  } catch {
    return null
  }
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: safeParse(localStorage.getItem('user')),
    profil: safeParse(localStorage.getItem('profil')),
    custom: safeParse(localStorage.getItem('custom')),
    token: localStorage.getItem('access_token'),
    isAuthenticated: !!localStorage.getItem('access_token'),
    loading: false,
    error: null,
  }),
  getters: {
    role: (state) => state.user?.role,
  },
  actions: {
    async register(data: UserRegister) {
      toastInfo('Enregistrement en cours...')
      this.loading = true
      this.error = null
      try {
        const response = await userService.register(data)
        this.setAuth(response.user, response.access_token)
        await this.redirectDashboard()
        return response
      } catch (err: any) {
        this.handleError(err, "Échec de l'enregistrement")
        throw err
      } finally {
        this.loading = false
      }
    },

    async login(credentials: UserLogin) {
      toastInfo('Connexion en cours...')
      this.loading = true
      this.error = null
      try {
        const response = await userService.login(credentials)
        this.setAuth(response.user, response.access_token)
        await this.redirectDashboard()
        return response
      } catch (err: any) {
        this.handleError(err, 'Échec de la connexion. Vérifiez vos identifiants.')
        throw err
      } finally {
        this.loading = false
      }
    },

    async logout() {
      toastInfo('Déconnexion en cours...')
      this.loading = true
      this.error = null
      try {
        // Optionnel côté serveur : await userService.logout()
      } catch (err: any) {
        this.handleError(err, 'Erreur lors de la déconnexion')
      } finally {
        this.resetAuth()
        await router.push({ name: 'auth.login' })
        this.loading = false
      }
    },

    async getUser() {
      toastInfo('Chargement des utilisateurs...')
      this.loading = true
      this.error = null
      try {
        return await userService.getUser()
      } catch (err: any) {
        this.handleError(err, 'Erreur lors de la récupération des utilisateurs')
        throw err
      } finally {
        this.loading = false
      }
    },

    async createProfil(id: number, data: Profil) {
      toastInfo("Création de l'utilisateur...")
      this.loading = true
      this.error = null
      try {
        const response = await userService.createProfil(id, data)
        this.profil = response.profil
        localStorage.setItem('profil', JSON.stringify(this.profil))
        return response
      } catch (err: any) {
        this.handleError(err, "Erreur lors de la création de l'utilisateur")
        throw err
      } finally {
        this.loading = false
      }
    },
    async editProfil(id: number, data: Profil) {
      toastInfo("Création de l'utilisateur...")
      this.loading = true
      this.error = null
      try {
        const response = await userService.editProfil(id, data)
        this.profil = response.profil
        localStorage.setItem('profil', JSON.stringify(this.profil))
        return response
      } catch (err: any) {
        this.handleError(err, "Erreur lors de la création de l'utilisateur")
        throw err
      } finally {
        this.loading = false
      }
    },

    async createCustom(userData: Custom) {
      toastInfo("Creation  d'un nouveau client...")
      this.loading = true
      this.error = null
      try {
        return await userService.createCustom(userData)
      } catch (err: any) {
        this.handleError(err, "Erreur lors de la creation de l'utilisateur")
        throw err
      } finally {
        this.loading = false
      }
    },
    async showUser(id: number) {
      toastInfo("Chargement de l'utilisateur...")
      this.loading = true
      this.error = null
      try {
        return await userService.showUser(id)
      } catch (err: any) {
        this.handleError(err, "Erreur lors de la récupération de l'utilisateur")
        throw err
      } finally {
        this.loading = false
      }
    },
    async createUser(data: UserRegister) {
      toastInfo("Creation de l'utilisateur...")
      this.loading = true
      this.error = null
      try {
        const response = await userService.createUser(data)
        return response
      } catch (err: any) {
        this.handleError(err, 'Erreur lors de la creation')
        throw err
      } finally {
        this.loading = false
      }
    },
    async editUser(id: number, data: UserRegister) {
      toastInfo("Mise a jour de l'utilisateur...")
      this.loading = true
      this.error = null
      try {
        const response = await userService.editUser(id, data)
        if (this.user?.id === id) {
          this.user = response.user
          this.isAuthenticated = true
          localStorage.setItem('user', JSON.stringify(this.user))
        }
        return response
      } catch (err: any) {
        this.handleError(err, 'Erreur lors de la mise à jour')
        throw err
      } finally {
        this.loading = false
      }
    },

    async editCustom(id: number, data: Custom) {
      toastInfo('Mise à jour du client...')
      this.loading = true
      this.error = null
      try {
        const response = await userService.editCustom(id, data)
        return response
      } catch (err: any) {
        this.handleError(err, 'Erreur lors de la mise à jour')
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteUser(id: number) {
      toastInfo("Suppression de l'utilisateur...")
      this.loading = true
      this.error = null
      try {
        return await userService.deleteUser(id)
      } catch (err: any) {
        this.handleError(err, 'Erreur lors de la suppression')
        throw err
      } finally {
        this.loading = false
      }
    },

    // Utils internes
    setAuth(user: UserRegister, token: string) {
      this.user = user
      this.token = token
      this.isAuthenticated = true
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('access_token', token)
    },

    resetAuth() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      localStorage.removeItem('user')
      localStorage.removeItem('access_token')
    },

    handleError(err: any, defaultMessage: string) {
      this.error = err.response?.data?.message || defaultMessage
      toastError(this.error!)
    },
    loadUserFromLocalStorage() {
      const stored = localStorage.getItem('user')
      if (stored) this.user = JSON.parse(stored)
      toastInfo("Chargement de l'utilisateur depuis le localStorage")
    },

    async redirectDashboard() {
      if (!this.user?.role) return
      switch (this.user.role) {
        case 'admin':
          await router.push({ name: 'admin.dashboard' })
          break
        case 'custom':
          await router.push({ name: 'custom.dashboard' })
          break
        case 'agent':
          await router.push({ name: 'agent.visarequest' })
          break
        default:
          await router.push({ name: 'auth.login' })
      }
    },
  },
})
