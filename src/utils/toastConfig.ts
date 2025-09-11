// toastConfig.ts
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css' // Assure-toi d'importer le style de base

// Redéfinition des types
type ToastType = 'info' | 'success' | 'error' | 'warning' | 'loading' | 'default'
type ToastPosition =
  | 'top-left'
  | 'top-right'
  | 'top-center'
  | 'bottom-left'
  | 'bottom-right'
  | 'bottom-center'
type ToastTheme = 'auto' | 'light' | 'dark' | 'colored'

// Couleurs principales
const colors = {
  info: 'bg-blue-500 text-white',
  success: 'bg-orange-400 text-white',
  warning: 'bg-purple-600 text-white',
  error: 'bg-red-500 text-white',
}

// Fonction pour afficher un toast stylé
export function showToast(
  message: string,
  type: ToastType = 'info',
  position: ToastPosition = 'top-right',
  autoClose = 4000,
) {
  toast(message, {
    type,
    position,
    autoClose,
    hideProgressBar: false,
    pauseOnHover: true,
    closeOnClick: true,
    theme: 'colored' as ToastTheme,
    toastClassName: `${colors[type]} rounded-lg shadow-lg px-4 py-2 text-sm font-medium`,
    bodyClassName: 'flex items-center',
    progressClassName: 'bg-white/50',
  })
}

// Toaster rapide pour chaque type
export const toastInfo = (msg: string, pos: ToastPosition = 'top-right') =>
  showToast(msg, 'info', pos)

export const toastSuccess = (msg: string, pos: ToastPosition = 'top-right') =>
  showToast(msg, 'success', pos)

export const toastWarning = (msg: string, pos: ToastPosition = 'top-right') =>
  showToast(msg, 'warning', pos)

export const toastError = (msg: string, pos: ToastPosition = 'top-right') =>
  showToast(msg, 'error', pos)
export const toastLoading = (msg: string, pos: ToastPosition = 'top-center') =>
  showToast(msg, 'loading', pos)
