<script setup lang="ts">
import { computed, ref } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useUserStore } from '@/stores/userStore'
import {
  faTachometerAlt,
  faFileAlt,
  faCreditCard,
  faPlane,
  faBell,
  faCalendarCheck,
  faUser,
  faSignOutAlt,
  faMessage,
} from '@fortawesome/free-solid-svg-icons'

// Enregistrement des icônes dans la bibliothèque
library.add(
  faTachometerAlt,
  faFileAlt,
  faCreditCard,
  faPlane,
  faBell,
  faCalendarCheck,
  faUser,
  faSignOutAlt,
  faMessage,
)
// const user = ref<Custom | null>(null)

const userStore = useUserStore()
if (!userStore.user) userStore.loadUserFromLocalStorage()
if (!userStore.user) throw new Error('Aucun utilisateur trouvé')

const user = computed(() => {
  if (!userStore.user) return 'Invité'
  return userStore.user
})
// Utilisation du routeur
// Définition de la liste des liens de menu
const menuLinks = ref([
  { label: 'Dashboard', name: 'custom.dashboard', icon: 'tachometer-alt' },
  { label: 'Documents', name: 'custom.documents', icon: 'file-alt' },
  { label: 'Paiement', name: 'custom.payment', icon: 'credit-card' },
  { label: 'Demande Visa', name: 'custom.visarequest.get', icon: 'plane' },
  { label: 'Notifications', name: 'custom.notification', icon: 'bell' },
  { label: 'Message', name: 'custom.chat', icon: 'message' },
  { label: 'Rendez-vous', name: 'custom.appoitment', icon: 'calendar-check' },
])

// Fonction de déconnexion
const logout = async () => {
  userStore.logout()
}
</script>
<template>
  <nav
    class="bg-gray-100 fixed md:w-50 w-20 flex justify-between flex-col border-r border-gray-200 min-h-screen"
  >
    <ul class="space-y-2 relative p-4">
      <li class="group" v-for="link in menuLinks" :key="link.name">
        <router-link
          :to="{ name: link.name }"
          class="flex items-center p-3 text-gray-700 font-medium rounded-lg transition-colors duration-200 hover:bg-gray-200"
          active-class="bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
        >
          <font-awesome-icon
            :icon="link.icon"
            class="mr-3 text-lg group-hover:text-blue-600 group-[.router-link-exact-active]:text-white roup-[.router-link-exact-active]:bg-blue-600"
          />
          <span class="hidden md:block">{{ link.label }}</span>
        </router-link>
      </li>
      <li>
        <button
          @click="logout"
          class="w-full flex items-center p-3 text-red-500 font-medium rounded-lg transition-colors duration-200 hover:bg-red-100 cursor-pointer"
        >
          <font-awesome-icon icon="sign-out-alt" class="mr-3 text-lg" />
          <span class="hidden md:block">Déconnexion</span>
        </button>
      </li>
    </ul>
    <div class="relative text-gray-600 mb-20 group bg-blue-100 w-full divide-gray-500 divide-solid">
      <router-link
        :to="{ name: 'custom.profil' }"
        class="flex items-center p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors duration-200 shadow-sm group"
        active-class="bg-blue-100 text-blue-500 hover:bg-blue-100 hover:text-blue-500"
      >
        <font-awesome-icon
          icon="user"
          class="mr-3 text-xl text-blue-500 group-hover:text-blue-600 transition-colors duration-200"
        />
        <div class="flex flex-col">
          <span class="font-semibold text-gray-600">{{ user.name || 'Utilisateur' }}</span>
          <span class="text-sm group-hover:text-blue-600 transition-colors duration-200">
            Voir profil
          </span>
        </div>
      </router-link>
    </div>
  </nav>
</template>

<style scoped>
/* Le style n'a pas besoin d'être modifié, car il est géré par Tailwind CSS */
</style>
