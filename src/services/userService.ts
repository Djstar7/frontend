// src/services/userService.ts
import api from '@/services/api'
import type { Custom, UserRegister } from '@/types/user'

interface LoginData {
  email: string
  password: string
}

export interface AuthResponse {
  message: string
  user: UserRegister
  access_token: string
  token_type: string
}
export interface UserResponse {
  message: string
  user: Custom | UserRegister
}

const userService = {
  async register(data: UserRegister): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data)
    return response.data
  },
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data)
    return response.data
  },
  async logout(): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/auth/logout')
    return response.data
  },
  async getUsers(): Promise<UserResponse[]> {
    const response = await api.get<UserResponse[]>('/user')
    return response.data
  },
  async createUser(UserData: Custom): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/user/store', UserData)
    return response.data
  },
  async getUser(id: number): Promise<UserResponse> {
    const response = await api.get<UserResponse>(`/user/show/${id}`)
    return response.data
  },
  async editUser(id: number, UserData: Custom): Promise<UserResponse> {
    const response = await api.put<UserResponse>(`/user/update/${id}`, UserData)
    return response.data
  },

  async deleteUser(id: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/user/delete/${id}`)
    return response.data
  },
}

export default userService
