import { defineStore } from 'pinia'
import type { UserRegister, UserLogin, Role, Custom } from '@/types/user'
import { userService } from '@/services/userService'
import type { UpdatePasswordData } from '@/services/userService'

interface UserState {
  profile: UserRegister | null
  token: string | null
  isAuthenticated: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    profile: null,
    token: null,
    isAuthenticated: false,
  }),

  getters: {
    name: (state) => state.profile?.name || '',
    email: (state) => state.profile?.email || '',
    hasRole: (state) => (role: Role) => state.profile?.role === role,
  },

  actions: {
    // Charger depuis localStorage
    loadFromStorage() {
      const storedProfile = localStorage.getItem('userProfile')
      const storedToken = localStorage.getItem('userToken')
      if (storedProfile && storedToken) {
        this.profile = JSON.parse(storedProfile) as UserRegister
        this.token = storedToken
        this.isAuthenticated = true
      }
    },

    async login(credentials: UserLogin) {
      const { token, user } = await userService.login(credentials)
      this.setUser(user, token) // user doit être de type UserRegister
    },

    async register(userData: UserRegister) {
      const result = await userService.register(userData)
      return result // Contient { message }
    },

    async fetchProfile() {
      if (!this.token) return
      const profile = await userService.getProfile(this.token)

      // Conversion Profil → UserRegister si nécessaire
      const userRegisterData: UserRegister = {
        name: profile.name,
        email: profile.email,
        phone: '', // selon API Laravel
        password: '', // jamais renvoyé par API
        role: profile.role,
      }

      this.profile = userRegisterData
      localStorage.setItem('userProfile', JSON.stringify(userRegisterData))
    },

    async updateProfile(updatedData: Custom) {
      if (!this.token || !this.profile) return
      const updatedProfile = { ...this.profile, ...updatedData }
      this.profile = updatedProfile
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile))

      // Appel API si nécessaire
      await userService.updateProfile(this.token, updatedProfile)
    },

    async changePassword(passwords: UpdatePasswordData) {
      if (!this.token) throw new Error('Pas de token disponible')
      return await userService.changePassword(this.token, passwords)
    },

    async logout() {
      if (this.token) await userService.logout()
      this.profile = null
      this.token = null
      this.isAuthenticated = false
      localStorage.removeItem('userProfile')
      localStorage.removeItem('userToken')
    },

    setUser(profile: UserRegister, token: string) {
      this.profile = profile
      this.token = token || null
      this.isAuthenticated = true
      localStorage.setItem('userProfile', JSON.stringify(profile))
      localStorage.setItem('userToken', token)
    },
  },
})
