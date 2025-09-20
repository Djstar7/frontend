import api from '@/services/api'
import type { Custom, Profil, UserRegister } from '@/types/user'

interface LoginData {
  email: string
  password: string
}

export interface AuthResponse {
  message: string
  user: UserRegister
  profil?: Profil
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
  async getUser(): Promise<UserResponse[]> {
    const response = await api.get<UserResponse[]>('/user')
    return response.data
  },
  async getCustom(): Promise<UserResponse[]> {
    const response = await api.get<UserResponse[]>('/usercustom')
    return response.data
  },
  // async createProfil(id: number, UserData: Profil): Promise<{ message: string; profil: Profil }> {
  //   const response = await api.put<{ message: string; profil: Profil }>(
  //     `/user/storeprofil${id}`,
  //     UserData,
  //   )
  //   return response.data
  // },
  async editProfil(id: number, UserData: Profil): Promise<{ message: string; profil: Profil }> {
    const response = await api.put<{ message: string; profil: Profil }>(
      `/user/updateprofil/${id}`,
      UserData,
    )
    return response.data
  },
  async createCustom(userData: Custom): Promise<{ message: string; user: Custom }> {
    const response = await api.post<{ message: string; user: Custom }>(
      '/user/storecustombyadmin',
      userData,
    )
    return response.data
  },
  async editCustom(id: number, userData: Custom): Promise<{ message: string; user: Custom }> {
    const response = await api.put<{ message: string; user: Custom }>(
      `/user/updatecustombyadmin/${id}`,
      userData,
    )
    return response.data
  },
  async showUser(id: number): Promise<UserResponse> {
    const response = await api.get<UserResponse>(`/user/show/${id}`)
    return response.data
  },
  async createUser(UserData: UserRegister): Promise<{ message: string; user: UserRegister }> {
    const response = await api.post<{ message: string; user: UserRegister }>(
      '/user/store',
      UserData,
    )
    return response.data
  },
  async editUser(
    id: number,
    UserData: UserRegister,
  ): Promise<{ message: string; user: UserRegister }> {
    const response = await api.put<{ message: string; user: UserRegister }>(
      `/user/update/${id}`,
      UserData,
    )
    return response.data
  },

  async deleteUser(id: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/user/delete/${id}`)
    return response.data
  },
}

export default userService
