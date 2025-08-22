// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import LoginPage from '@/pages/LoginPage.vue'
import RegisterPage from '@/pages/RegisterPage.vue'
import HomePage from '@/pages/HomePage.vue'
import ForgotPasswordForm from '@/pages/ForgotPasswordForm.vue'
import AboutPage from '@/pages/AboutPage.vue'
import ContactPage from '@/pages/ContactPage.vue'
import DashboardCustom from '@/pages/Custom/DashboardCustom.vue'
import AppoitmentCustom from '@/pages/Custom/AppoitmentCustom.vue'
import ChatCustom from '@/pages/Custom/ChatCustom.vue'
import DocumentsCustom from '@/pages/Custom/DocumentsCustom.vue'
import NotificationCustom from '@/pages/Custom/NotificationCustom.vue'
import PaymentCustom from '@/pages/Custom/PaymentCustom.vue'
import ProfilCustom from '@/pages/Custom/ProfilCustom.vue'
import RequestVisaCustom from '@/pages/Custom/RequestVisaCustom.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutPage,
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactPage,
    },
    {
      path: '/auth',
      name: 'auth',
      children: [
        {
          path: 'login',
          name: 'auth.login',
          component: LoginPage,
        },
        {
          path: 'register',
          name: 'auth.register',
          component: RegisterPage,
        },
        {
          path: 'forgotpassword',
          name: 'auth.forgotpassword',
          component: ForgotPasswordForm,
        },
      ],
    },
    {
      path: '/custom',
      name: 'custom',
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'custom.dashboard',
          component: DashboardCustom,
        },
        {
          path: 'appoitment',
          name: 'custom.appoitment',
          component: AppoitmentCustom,
        },
        {
          path: 'chat',
          name: 'custom.chat',
          component: ChatCustom,
        },
        {
          path: 'documents',
          name: 'custom.documents',
          component: DocumentsCustom,
        },
        {
          path: 'notification',
          name: 'custom.notification',
          component: NotificationCustom,
        },
        {
          path: 'payment',
          name: 'custom.payment',
          component: PaymentCustom,
        },
        {
          path: 'profil',
          name: 'custom.profil',
          component: ProfilCustom,
        },
        {
          path: 'resquestvisa',
          name: 'custom.resquestvisa',
          component: RequestVisaCustom,
        },
      ],
    },

    // {
    //   path: '/dashboard',
    //   name: 'dashboard',
    //   component: () => import('@/views/DashboardView.vue'),
    //   meta: { requiresAuth: true },
    // },
    // Ajoutez d'autres routes protégées ici
  ],
})

// Guard de navigation global
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // Initialise l'état de l'authentification (tente de récupérer l'utilisateur si un token existe)
  // if (!userStore.user && userStore.token) {
  //   await userStore.fetchCurrentUser()
  // }

  // Vérifie si la route nécessite une authentification
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
    next({ name: 'auth.login' })
  } else if (
    (to.name === 'auth.login' || to.name === 'auth.register') &&
    userStore.isAuthenticated
  ) {
    // Si l'utilisateur est déjà authentifié et essaie d'accéder aux pages de login/register, rediriger vers le tableau de bord
    next({ name: 'custom.dashboard' })
  } else {
    // Continuer la navigation
    next()
  }
})

export default router
