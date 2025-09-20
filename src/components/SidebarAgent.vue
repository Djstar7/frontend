<script setup lang="ts">
import { computed, ref } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faFileAlt,
  faClipboardCheck,
  faCalendarCheck,
  faComments,
  faBell,
  faSignOutAlt,
  faUserShield,
} from '@fortawesome/free-solid-svg-icons'
import { useUserStore } from '@/stores/userStore'
import type { Custom } from '@/types/user'

// Ajout des icônes
library.add(
  faFileAlt,
  faClipboardCheck,
  faCalendarCheck,
  faComments,
  faBell,
  faSignOutAlt,
  faUserShield,
)

// Récupération utilisateur stocké
const agent = ref<Custom | null>(null)
const storedUser = localStorage.getItem('user')
if (storedUser) {
  agent.value = JSON.parse(storedUser) as Custom
}

const userStore = useUserStore()

// Charger user si pas encore défini
if (!userStore.user) {
  userStore.loadUserFromLocalStorage()
}
if (!userStore.user) {
  throw new Error('Aucun utilisateur trouvé')
}

// Déconnexion
const logout = () => {
  userStore.logout()
}

// Nom utilisateur
const userName = computed(() => {
  return userStore.user?.name || 'Invité'
})
</script>

<template>
  <nav
    class="bg-gray-50 fixed md:w-50 w-20 flex flex-col justify-between border-r border-gray-200 min-h-screen shadow-lg"
  >
    <!-- Menu principal -->
    <ul class="space-y-3 p-4 relative">
      <!-- Section Documents -->
      <li class="text-gray-500 hidden md:block uppercase text-xs font-bold px-3">Vérifications</li>
      <li>
        <router-link
          :to="{ name: 'agent.document' }"
          class="flex items-center p-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 font-medium"
          active-class="bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
        >
          <font-awesome-icon icon="file-alt" class="mr-3 text-lg" />
          <span class="hidden md:block">Documents</span>
        </router-link>
      </li>
      <li>
        <router-link
          :to="{ name: 'agent.visarequest' }"
          class="flex items-center p-3 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200 font-medium"
          active-class="bg-indigo-600 text-white hover:bg-indigo-700 hover:text-white"
        >
          <font-awesome-icon icon="clipboard-check" class="mr-3 text-lg" />
          <span class="hidden md:block">Demande Visa</span>
        </router-link>
      </li>

      <!-- Section Rendez-vous -->
      <li class="text-gray-500 hidden md:block uppercase text-xs font-bold px-3 mt-4">
        Rendez-vous
      </li>
      <li>
        <router-link
          :to="{ name: 'agent.appoitment' }"
          class="flex items-center p-3 rounded-xl text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200 font-medium"
          active-class="bg-green-600 text-white hover:bg-green-700 hover:text-white"
        >
          <font-awesome-icon icon="calendar-check" class="mr-3 text-lg" />
          <span class="hidden md:block">Rendez-vous</span>
        </router-link>
      </li>

      <!-- Section Communication -->
      <li class="text-gray-500 hidden md:block uppercase text-xs font-bold px-3 mt-4">
        Communication
      </li>
      <li>
        <router-link
          :to="{ name: 'agent.chat' }"
          class="flex items-center p-3 rounded-xl text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200 font-medium"
          active-class="bg-purple-600 text-white hover:bg-purple-700 hover:text-white"
        >
          <font-awesome-icon icon="comments" class="mr-3 text-lg" />
          <span class="hidden md:block">Chat Clients</span>
        </router-link>
      </li>
      <li>
        <router-link
          :to="{ name: 'agent.notification' }"
          class="flex items-center p-3 rounded-xl text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors duration-200 font-medium"
          active-class="bg-orange-500 text-white hover:bg-orange-600 hover:text-white"
        >
          <font-awesome-icon icon="bell" class="mr-3 text-lg" />
          <span class="hidden md:block">Notifications</span>
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

    <!-- Profil Agent -->
    <div
      class="relative text-gray-600 mb-20 group bg-purple-100 w-full divide-gray-500 divide-solid"
    >
      <router-link
        :to="{ name: 'custom.profil' }"
        class="flex items-center p-3 rounded-lg bg-purple-100 hover:bg-purple-200 transition-colors duration-200 shadow-sm group"
        active-class="bg-purple-100 text-purple-500 hover:bg-purple-100 hover:text-purple-500"
      >
        <font-awesome-icon
          icon="user-shield"
          class="mr-3 text-xl text-purple-600 group-hover:text-purple-800 transition-colors duration-200"
        />
        <div class="flex flex-col">
          <span class="font-semibold text-gray-600">{{ userName }}</span>
          <span class="text-sm group-hover:text-purple-600 transition-colors duration-200">
            Voir profil
          </span>
        </div>
      </router-link>
    </div>
  </nav>
</template>
