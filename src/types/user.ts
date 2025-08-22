type Role = 'admin' | 'custom' | 'agent'
type Gender = 'male' | 'female'
type StatusMat = 'single' | 'married' | 'divorced' | 'widowed'

interface UserRegister {
  name: string
  email: string
  password?: string
  role?: Role
}
interface UserLogin {
  email: string
  password: string
}
interface UserForgotPassword {
  email: string
}

interface Profil {
  first_name: string
  last_name: string
  phone: string
  gender: Gender
  date_of_birth: string
  place_of_birth: string
  status_mat: StatusMat
  country_name: string
}

interface Custom {
  id: number
  name: string
  email: string
  phone: string
  password: string
  role?: Role
  first_name: string
  last_name: string
  gender: Gender
  date_of_birth: string
  place_of_birth: string
  status_mat: StatusMat
  country_name: string
}

interface UserState {
  user: UserRegister | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}
export type { UserRegister, UserLogin, Profil, UserState, UserForgotPassword, Role, Custom }
