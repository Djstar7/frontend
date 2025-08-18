import { createRouter, createWebHistory } from 'vue-router'

import LoginPage from '@/pages/LoginPage.vue'

const routes = [
  {
    path: '/auth',
    name: 'auth',
    children: [
      {
        path: 'login',
        name: 'login',
        component: LoginPage,
      },
    ],
  },
  {
    path: '/agent',
    name: 'agent',
    children: [],
  },
  {
    path: '/admin',
    name: 'admin',
    children: [],
  },
  {
    path: '/admin',
    name: 'admin',
    children: [],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

export default router
