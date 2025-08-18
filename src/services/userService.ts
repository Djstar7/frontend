import axios from 'axios'
import type { UserRegister, UserLogin, Custom } from '@/types/user'
import { API_URL } from './api'

export interface UpdatePasswordData {
  currentPassword: string
  newPassword: string
}

export const userService = {
  // LOGIN → USER
  async login(credentials: UserLogin): Promise<{ token: string; user: UserRegister }> {
    const { data } = await axios.post(`${API_URL}/auth/login`, credentials)

    const userRegisterData: UserRegister = {
      name: data.user.name,
      email: data.user.email,
      phone: data.user.phone ?? '',
      password: '', // mot de passe jamais renvoyé
      role: data.user.role,
    }

    return { token: data.token, user: userRegisterData }
  },

  // REGISTER → USER
  async register(userData: UserRegister): Promise<{ message: string }> {
    try {
      const { data } = await axios.post(`${API_URL}/auth/register`, userData)
      // Laravel renvoie généralement { message: "..." }
      return { message: data.message || 'Inscription réussie' }
    } catch (error: any) {
      if (error.response) {
        return {
          message: error.response.data.message || 'Erreur de validation',
        }
      }
      return { message: 'Erreur réseau' }
    }
  },

  // GET → PROFILE
  async getProfile(token: string): Promise<Custom> {
    const { data } = await axios.get(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    return <Custom>{
      name: data.name,
      email: data.email,
      phone: data.phone ?? '',
      password: '', // mot de passe jamais renvoyé
      role: data.role,
      first_name: data.first_name,
      last_name: data.last_name,
      gender: data.gender,
      date_of_birth: data.date_of_birth,
      place_of_birth: data.place_of_birth,
      status_mat: data.status_mat,
      country_name: data.country_name,
    }
  },

  // UPDATE → PROFILE
  async updateProfile(token: string, updatedData: Custom): Promise<{ message: string }> {
    try {
      const { data } = await axios.put(`${API_URL}/users/me`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      return { message: data.message || 'Profil mis à jour' }
    } catch (error: any) {
      if (error.response) {
        return {
          message: error.response.data.message || 'Erreur de validation',
        }
      }
      return { message: 'Erreur réseau' }
    }
  },

  async changePassword(token: string, passwords: UpdatePasswordData): Promise<{ message: string }> {
    const { data } = await axios.put(`${API_URL}/users/change-password`, passwords, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return data
  },

  // LOGOUT → USER
  async logout(token?: string, id?: number): Promise<{ message: string }> {
    try {
      const { data } = await axios.post(`${API_URL}/auth/logout/${id}`, null, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      return { message: data.message || 'Déconnexion réussie' }
    } catch (error: any) {
      if (error.response) {
        return {
          message: error.response.data.message || 'Erreur de déconnexion',
        }
      }
      return { message: 'Erreur réseau' }
    }
  },
}
