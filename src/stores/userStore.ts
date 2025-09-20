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
      this.profil = null
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

        if (response.profil) {
          this.profil = response.profil
          localStorage.setItem('profil', JSON.stringify(this.profil))
        }

        console.log('Profil connecté : ', this.profil)
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
        // Côté serveur si nécessaire : await userService.logout()
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
    async getCustom() {
      toastInfo('Chargement des utilisateurs...')
      this.loading = true
      this.error = null
      try {
        return await userService.getCustom()
      } catch (err: any) {
        this.handleError(err, 'Erreur lors de la récupération des utilisateurs')
        throw err
      } finally {
        this.loading = false
      }
    },

    async editProfil(id: number, data: Profil) {
      toastInfo('Mise à jour du profil...')
      this.loading = true
      this.error = null
      try {
        const response = await userService.editProfil(id, data)
        this.profil = response.profil
        if (this.profil) {
          localStorage.setItem('profil', JSON.stringify(this.profil))
        }
        console.log('Profil mis à jour : ', this.profil)
        return response
      } catch (err: any) {
        this.handleError(err, 'Erreur lors de la mise à jour du profil')
        throw err
      } finally {
        this.loading = false
      }
    },

    async createCustom(userData: Custom) {
      toastInfo("Création d'un nouveau client...")
      this.loading = true
      this.error = null
      try {
        const response = await userService.createCustom(userData)
        this.custom = response.custom ?? null
        if (this.custom) {
          localStorage.setItem('custom', JSON.stringify(this.custom))
        }
        return response
      } catch (err: any) {
        this.handleError(err, 'Erreur lors de la création du client')
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
      toastInfo("Création de l'utilisateur...")
      this.loading = true
      this.error = null
      try {
        return await userService.createUser(data)
      } catch (err: any) {
        this.handleError(err, 'Erreur lors de la création')
        throw err
      } finally {
        this.loading = false
      }
    },

    async editUser(id: number, data: UserRegister) {
      toastInfo("Mise à jour de l'utilisateur...")
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
        this.custom = response.custom ?? this.custom
        if (this.custom) {
          localStorage.setItem('custom', JSON.stringify(this.custom))
        }
        return response
      } catch (err: any) {
        this.handleError(err, 'Erreur lors de la mise à jour du client')
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
      this.profil = null
      this.custom = null
      this.isAuthenticated = false
      localStorage.removeItem('user')
      localStorage.removeItem('profil')
      localStorage.removeItem('custom')
      localStorage.removeItem('access_token')
    },

    handleError(err: any, defaultMessage: string) {
      this.error = err.response?.data?.message || defaultMessage
      toastError(this.error!)
    },

    loadUserFromLocalStorage() {
      this.user = safeParse(localStorage.getItem('user'))
      this.profil = safeParse(localStorage.getItem('profil'))
      this.custom = safeParse(localStorage.getItem('custom'))
      this.token = localStorage.getItem('access_token')
      this.isAuthenticated = !!this.token
      toastInfo('Chargement des données utilisateur depuis le localStorage')
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
