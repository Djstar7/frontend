<script setup lang="ts">
import { ref } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useUserStore } from '@/stores/userStore'
import {
  faTachometerAlt,
  faFileAlt,
  faCreditCard,
  faGlobe,
  faPlane,
  faBell,
  faCalendarCheck,
  faUser,
  faSignOutAlt,
  faComments,
} from '@fortawesome/free-solid-svg-icons'
import type { Custom } from '@/types/user'

library.add(
  faTachometerAlt,
  faFileAlt,
  faCreditCard,
  faGlobe,
  faPlane,
  faBell,
  faCalendarCheck,
  faUser,
  faSignOutAlt,
  faComments,
)

const user = ref<Custom | null>(null)
const storedUser = localStorage.getItem('user')
if (storedUser) user.value = JSON.parse(storedUser) as Custom

const userStore = useUserStore()

const userLinks = ref([
  { label: 'Dashboard', name: 'admin.dashboard', icon: 'tachometer-alt' },
  { label: 'Utilisateurs', name: 'admin.users', icon: 'user' },
  { label: 'Documents', name: 'admin.documents', icon: 'file-alt' },
  { label: 'Paiement', name: 'admin.payment', icon: 'credit-card' },
  { label: 'Pays', name: 'admin.country', icon: 'globe' },
])

const visaLinks = ref([
  { label: 'Visa', name: 'admin.visa', icon: 'plane' },
  { label: 'Demandes Visa', name: 'admin.visarequest', icon: 'plane' },
  { label: 'Types de Visa', name: 'admin.visatype', icon: 'plane' },
])

const commLinks = ref([
  { label: 'Notifications', name: 'admin.notification', icon: 'bell' },
  { label: 'Questions FAQ', name: 'admin.faq', icon: 'comments' },
  { label: 'Rendez-vous', name: 'admin.appoitment', icon: 'calendar-check' },
])

const logout = async () => {
  userStore.logout()
}
</script>
<template>
  <nav
    class="bg-gray-50 fixed md:w-50 w-20 flex flex-col justify-between border-r border-gray-200 h-full shadow-lg"
  >
    <!-- Contenu principal (menu + profil) -->
    <div class="flex flex-col justify-between">
      <!-- Menu principal -->
      <ul class="space-y-3 p-2">
        <!-- Section Gestion Utilisateurs -->
        <li class="text-gray-500 hidden md:block uppercase text-xs font-bold px-3">
          Utilisateurs & Documents
        </li>
        <li v-for="link in userLinks" :key="link.name" class="group">
          <router-link
            :to="{ name: link.name }"
            class="flex items-center p-2.5 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 font-medium"
            active-class="bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
          >
            <font-awesome-icon :icon="link.icon" class="mr-3 text-lg" />
            <span class="hidden md:block">{{ link.label }}</span>
          </router-link>
        </li>

        <!-- Section Visa -->
        <li class="text-gray-500 hidden md:block uppercase text-xs font-bold px-3 mt-4">
          Visa & Demandes
        </li>
        <li v-for="link in visaLinks" :key="link.name" class="group">
          <router-link
            :to="{ name: link.name }"
            class="flex items-center p-2.5 rounded-xl text-gray-700 hover:bg-orange-50 hover:text-orange-400 transition-colors duration-200 font-medium"
            active-class="bg-orange-400 text-white hover:bg-orange-400 hover:text-white"
          >
            <font-awesome-icon :icon="link.icon" class="mr-3 text-lg" />
            <span class="hidden md:block">{{ link.label }}</span>
          </router-link>
        </li>

        <!-- Section Notifications & Messages -->
        <li class="text-gray-500 hidden md:block uppercase text-xs font-bold px-3 mt-4">
          Communication
        </li>
        <li v-for="link in commLinks" :key="link.name" class="group">
          <router-link
            :to="{ name: link.name }"
            class="flex items-center p-2.5 rounded-xl text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200 font-medium"
            active-class="bg-purple-600 text-white hover:bg-purple-600 hover:text-white"
          >
            <font-awesome-icon :icon="link.icon" class="mr-3 text-lg" />
            <span class="hidden md:block">{{ link.label }}</span>
          </router-link>
        </li>

        <!-- Déconnexion -->
        <li>
          <button
            @click="logout"
            class="w-full flex items-center p-3 cursor-pointer rounded-xl font-medium text-red-500 hover:bg-red-100 transition-colors duration-200"
          >
            <font-awesome-icon icon="sign-out-alt" class="mr-3 text-lg" />
            <span class="hidden md:block">Déconnexion</span>
          </button>
        </li>
      </ul>

      <!-- Profil utilisateur -->
      <div
        class="relative text-gray-600 mb-20 group bg-orange-100 w-full divide-gray-500 divide-solid"
      >
        <router-link
          :to="{ name: 'custom.profil' }"
          class="flex items-center p-3 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors duration-200 shadow-sm group"
          active-class="bg-orange-100 text-orange-500 hover:bg-orange-100 hover:text-orange-500"
        >
          <font-awesome-icon
            icon="user"
            class="mr-3 text-xl text-orange-400 group-hover:text-orange-600 transition-colors duration-200"
          />
          <div class="flex flex-col">
            <span class="font-semibold text-gray-600">{{ user?.name || 'Utilisateur' }}</span>
            <span class="text-sm group-hover:text-orange-600 transition-colors duration-200">
              Voir profil
            </span>
          </div>
        </router-link>
      </div>
    </div>
  </nav>
</template>
