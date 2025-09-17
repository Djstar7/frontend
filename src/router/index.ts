// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

// Pages Auth
import LoginPage from '@/pages/LoginPage.vue'
import ForgotPasswordForm from '@/pages/ForgotPasswordForm.vue'
import RegisterPage from '@/pages/RegisterPage.vue'

// Pages publiques
import HomePage from '@/pages/HomePage.vue'
import AboutPage from '@/pages/AboutPage.vue'
import ContactPage from '@/pages/ContactPage.vue'

// Layouts
import CustomLayout from '@/layouts/CustomLayout.vue'
// import AdminLayout from '@/layouts/AdminLayout.vue'

// Pages Custom
import DashboardCustom from '@/pages/Custom/DashboardCustom.vue'
import AppoitmentCustom from '@/pages/Custom/AppoitmentCustom.vue'
import ChatCustom from '@/pages/Custom/ChatCustom.vue'
import DocumentsCustom from '@/pages/Custom/DocumentsCustom.vue'
import NotificationCustom from '@/pages/Custom/NotificationCustom.vue'
import PaymentCustom from '@/pages/Custom/PaymentCustom.vue'
import ProfilCustom from '@/pages/Custom/ProfilCustom.vue'
import VisaRequestCustom from '@/pages/Custom/VisaRequestCustom.vue'

// Composants Custom
import UploadDocument from '@/components/UploadDocument.vue'
import ReceiptVisaRequest from '@/components/ReceiptVisaRequest.vue'
import ShowVisaRequest from '@/components/ShowVisaRequest.vue'
import VisaRequest from '@/components/VisaRequest.vue'
import CreateVisaRequest from '@/components/CreateVisaRequest.vue'
import ViewListDocument from '@/components/VisaRequest/ViewListDocument.vue'

// Pages Admin
import DashboardAdmin from '@/pages/Admin/DashboardAdmin.vue'
import VisaRequests from '@/pages/Admin/VisaRequestAdmin.vue'
import UsersListAdmin from '@/pages/Admin/UsersListAdmin.vue'
import DocumentsAdmin from '@/pages/Admin/DocumentsAdmin.vue'
import FAQAdmin from '@/pages/Admin/FAQAdmin.vue'
import PaymentAdmin from '@/pages/Admin/PaymentAdmin.vue'
import CountryAdmin from '@/pages/Admin/CountryAdmin.vue'
import VisaAdmin from '@/pages/Admin/VisaAdmin.vue'
import VisaTypeAdmin from '@/pages/Admin/VisaTypeAdmin.vue'
import NotificationAdmin from '@/pages/Admin/NotificationAdmin.vue'
import AppoitmentAdmin from '@/pages/Admin/AppoitmentAdmin.vue'
import ProfilAdmin from '@/pages/Admin/ProfilAdmin.vue'

// Pages Agent
import DocumentAgent from '@/pages/Agent/DocumentAgent.vue'
import VisaRequestAgent from '@/pages/Agent/VisaRequestAgent.vue'
import NotificationAgent from '@/pages/Agent/NotificationAgent.vue'
import AppoitmentAgent from '@/pages/Agent/AppoitmentAgent.vue'
import ChatAgent from '@/pages/Agent/ChatAgent.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/about', name: 'about', component: AboutPage },
    { path: '/contact', name: 'contact', component: ContactPage },
    {
      path: '/auth',
      children: [
        { path: 'login', name: 'auth.login', component: LoginPage },
        { path: 'register', name: 'auth.register', component: RegisterPage },
        { path: 'forgotpassword', name: 'auth.forgotpassword', component: ForgotPasswordForm },
      ],
    },
    {
      path: '/custom',
      meta: { requiresAuth: true, roles: ['custom'] },
      children: [
        { path: 'dashboard', name: 'custom.dashboard', component: DashboardCustom },
        { path: 'appoitment', name: 'custom.appoitment', component: AppoitmentCustom },
        { path: 'chat', name: 'custom.chat', component: ChatCustom },
        { path: 'documents', name: 'custom.documents', component: DocumentsCustom },
        { path: 'notification', name: 'custom.notification', component: NotificationCustom },
        { path: 'payment', name: 'custom.payment', component: PaymentCustom },
        { path: 'profil', name: 'custom.profil', component: ProfilCustom },
        {
          path: 'visarequest',
          children: [
            { path: '', component: VisaRequestCustom, name: 'custom.visarequest.get' },
            {
              path: 'create',
              children: [
                { path: '', component: CreateVisaRequest, name: 'custom.visarequest.create' },
                {
                  path: 'view',
                  component: ViewListDocument,
                  name: 'custom.visarequest.create.view',
                },
                {
                  path: 'upload/:id',
                  component: UploadDocument,
                  name: 'custom.visarequest.create.upload',
                },
              ],
            },
            {
              path: 'show',
              children: [
                // { path: '', component: ShowVisaRequest, name: 'custom.visarequest.show.get' },
                { path: ':id', component: ShowVisaRequest, name: 'custom.visarequest.show.get' },
                {
                  path: 'receipt',
                  component: ReceiptVisaRequest,
                  name: 'custom.visarequest.show.receipt',
                },
              ],
            },
          ],
        },
        { path: 'upload', name: 'custom.upload', component: UploadDocument },
        { path: 'receipt', name: 'custom.receipt', component: ReceiptVisaRequest },
        { path: 'showrequest', name: 'custom.showrequest', component: ShowVisaRequest },
        { path: 'visa', name: 'custom.visa', component: VisaRequest },
      ],
    },
    {
      path: '/admin',
      meta: { requiresAuth: true, roles: ['admin'] },
      children: [
        { path: 'dashboard', name: 'admin.dashboard', component: DashboardAdmin },
        { path: 'users', name: 'admin.users', component: UsersListAdmin },
        { path: 'documents', name: 'admin.documents', component: DocumentsAdmin },
        { path: 'payment', name: 'admin.payment', component: PaymentAdmin },
        { path: 'country', name: 'admin.country', component: CountryAdmin },
        { path: 'visa', name: 'admin.visa', component: VisaAdmin },
        { path: 'visarequest', name: 'admin.visarequest', component: VisaRequests },
        { path: 'visatype', name: 'admin.visatype', component: VisaTypeAdmin },
        { path: 'notification', name: 'admin.notification', component: NotificationAdmin },
        { path: 'faq', name: 'admin.faq', component: FAQAdmin },
        { path: 'appoitment', name: 'admin.appoitment', component: AppoitmentAdmin },
        { path: 'profil', name: 'admin.profil', component: ProfilAdmin },
      ],
    },
    {
      path: '/agent',
      meta: { requiresAuth: true, roles: ['agent'] },
      children: [
        { path: 'document', name: 'agent.document', component: DocumentAgent },
        { path: 'visarequest', name: 'agent.visarequest', component: VisaRequestAgent },
        { path: 'appoitment', name: 'agent.appoitment', component: AppoitmentAgent },
        { path: 'notification', name: 'agent.notification', component: NotificationAgent },
        { path: 'chat', name: 'agent.chat', component: ChatAgent },
      ],
    },
  ],
})

// Guard global
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  const getDashboardRoute = (role: string) => {
    switch (role) {
      case 'admin':
        return { name: 'admin.dashboard' }
      case 'agent':
        return { name: 'agent.visarequest' }
      case 'custom':
        return { name: 'custom.dashboard' }
      default:
        return { name: 'auth.login' }
    }
  }

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    if (to.name !== 'auth.login') return next({ name: 'auth.login' })
  }

  if ((to.name === 'auth.login' || to.name === 'auth.register') && userStore.isAuthenticated) {
    const dashboard = getDashboardRoute(userStore.role!)
    if (to.name !== dashboard.name) return next(dashboard)
  }

  if (to.meta.roles && userStore.isAuthenticated) {
    if (!to.meta.roles.includes(userStore.role)) {
      const dashboard = getDashboardRoute(userStore.role!)
      if (to.name !== dashboard.name) return next(dashboard)
    }
  }

  return next()
})

export default router
