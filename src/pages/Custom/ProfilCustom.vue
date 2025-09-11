<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Custom } from '@/types/user'
import { useUserStore } from '@/stores/userStore'
import { toastError, toastSuccess } from '@/utils/toastConfig'
import EditUser from '@/components/EditUser.vue'

const userStore = useUserStore()

// Références réactives
const user = ref<Custom | null>(null)
const isOpenModalEdit = ref(false)
const loading = ref(false)
const statusMap: Record<string, string> = {
  single: 'Célibataire',
  married: 'Marié(e)',
  divorced: 'Divorcé(e)',
  widowed: 'Veuf/Veuve',
}

const getStatus = (status: string | null) => {
  if (!status) return 'Non renseigné'
  return statusMap[status] || status
}

// Fonction pour récupérer l'utilisateur
const loadUser = async () => {
  loading.value = true
  try {
    // Si le store n'a pas encore l'utilisateur, charger depuis localStorage
    if (!userStore.user) userStore.loadUserFromLocalStorage()
    if (!userStore.user) throw new Error('Aucun utilisateur trouvé')

    const { id } = userStore.user

    // Appel à l'API pour récupérer les infos complètes
    const res = await userStore.showUser(id!)

    const { created_at, updated_at, ...cleanUser } = res?.user
    user.value = cleanUser

    toastSuccess(res.message || 'Profil chargé avec succès')
  } catch (err: any) {
    console.error(err)
    toastError(userStore.error || 'Erreur lors du chargement du profil')
  } finally {
    loading.value = false
  }
}

// Ouverture de la modal
const openEditModal = () => {
  if (!user.value) return toastError('Impossible de modifier : utilisateur introuvable')
  isOpenModalEdit.value = true
}

// Chargement initial
onMounted(loadUser)
</script>

<template>
  <section class="min-h-screen flex items-center justify-center px-6 py-20 w-full">
    <div
      class="w-full max-w-5xl bg-white/95 backdrop-blur-lg shadow-2xl rounded-3xl overflow-hidden border border-white"
    >
      <!-- Header du profil -->
      <div class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-10 text-center">
        <span
          class="flex items-center justify-center w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto border-4 border-white shadow-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-5xl font-bold tracking-widest"
        >
          {{ (user?.first_name?.charAt(0) || 'S') + (user?.last_name?.charAt(0) || 'D') }}
        </span>

        <h1 class="mt-6 text-3xl md:text-4xl font-extrabold text-white text-center">
          {{ user?.first_name }} {{ user?.last_name }}
          <span class="block text-gray-200 text-sm">@{{ user?.name }}</span>
        </h1>

        <p class="text-indigo-100 text-lg">Rôle : {{ user?.role }}</p>
      </div>

      <!-- Infos utilisateur -->
      <div class="p-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h2 class="text-2xl font-semibold text-gray-700 mb-4">Informations personnelles</h2>
          <ul class="space-y-3 text-gray-700 text-lg">
            <li><span class="font-semibold">Email :</span> {{ user?.email }}</li>
            <li><span class="font-semibold">Téléphone :</span> {{ user?.phone }}</li>
            <li>
              <span class="font-semibold">Genre :</span>
              {{ user?.gender == 'male' ? 'Homme' : 'Femme' }}
            </li>
            <li>
              <span class="font-semibold">Date de naissance :</span> {{ user?.date_of_birth }}
            </li>
          </ul>
        </div>

        <div>
          <h2 class="text-2xl font-semibold text-gray-700 mb-4">Détails supplémentaires</h2>
          <ul class="space-y-3 text-gray-700 text-lg">
            <li>
              <span class="font-semibold">Lieu de naissance :</span> {{ user?.place_of_birth }}
            </li>
            <li>
              <span class="font-semibold">Statut matrimonial :</span>
              {{ getStatus(user?.status_mat || null) }}
            </li>
            <li><span class="font-semibold">Pays :</span> {{ user?.nationality }}</li>
          </ul>
        </div>
      </div>

      <!-- Actions -->
      <div class="px-auto pb-12 flex flex-wrap justify-center gap-6">
        <button
          @click="openEditModal"
          class="px-8 py-3 text-lg rounded-2xl bg-indigo-500 text-white hover:bg-indigo-600 cursor-pointer transition shadow-md"
        >
          <i class="fas fa-user-edit"></i>
          Modifier
        </button>
      </div>
    </div>

    <!-- MODAL -->
    <div
      v-if="isOpenModalEdit"
      class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
    >
      <div class="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-8">
        <!-- Bouton fermer -->
        <button
          @click="isOpenModalEdit = false"
          class="absolute top-4 right-4 text-red-500 hover:text-red-600 cursor-pointer text-xl"
        >
          ✕
        </button>

        <!-- Contenu de l’édition -->
        <EditUser :form="user!" :id="user?.id" @updated="isOpenModalEdit = false" />
      </div>
    </div>
  </section>
</template>
