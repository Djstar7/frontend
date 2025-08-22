// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import type { ToastActions } from 'vue3-toastify'

// import { useUserStore } from './stores/userStore' // Importez le store utilisateur

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(Vue3Toastify, {
  autoClose: 5000, // Durée avant disparition
  pauseOnHover: true,
  hideProgressBar: false,
  draggable: true,
  position: 'top-center',
})

app.mount('#app')

// Après avoir monté l'application et Pinia, initialisez l'état d'authentification
// router.isReady().then(() => {
//   const userStore = useUserStore()
//   userStore.initializeAuth()
//   app.mount('#app')
// })
