<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSpinner, faUser, faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'
import type { Custom } from '@/types/user'
import { useUserStore } from '@/stores/userStore'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { toastError, toastInfo, toastSuccess, toastWarning } from '@/utils/toastConfig'

// Ajout des icônes
library.add(faSpinner, faUser, faEdit, faTrash, faPlus)

const users = ref<Custom[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)
const message = ref<string | null>(null)

const userStore = useUserStore()

// ✅ Fetch users avec gestion loading, erreur et toast
const fetchUsers = async () => {
  isLoading.value = true
  error.value = null
  message.value = null

  try {
    const res = await userStore.getUser()
    users.value = res?.users ?? []
    userStore.notifySuccess('Les utilisateurs ont été chargés avec succès')
  } catch (err: any) {
    console.error('Erreur lors du chargement des utilisateurs:', err)
    error.value = 'Impossible de charger les utilisateurs. Veuillez réessayer plus tard.'
    userStore.notifyError(error.value)
  } finally {
    isLoading.value = false
  }
}

// Actions pour l'interface
const addUser = () => {
  toastInfo('Ajouter un nouvel utilisateur (fonction à implémenter)')
}
const editUser = (user: Custom) => {
  toastInfo(`Éditer l'utilisateur ${user.name} (fonction à implémenter)`)
}
const deleteUser = async (id: number) => {
  try {
    const res = await userStore.delete(id)
    users.value = users.value.filter((u) => u.id !== id)
    toastSuccess(res?.message || 'Utilisateur supprimé avec succès')
    toastError('Impossible de supprimer cet utilisateur')
    toastWarning('Impossible de supprimer cet utilisateur')
  } catch (err: any) {
    console.error("Erreur lors de la suppression de l'utilisateur:", err)
    toastError(err.response?.data?.message || 'Impossible de supprimer cet utilisateur')
  }
}

onMounted(fetchUsers)
</script>

<template>
  <div class="p-6 w-full bg-gray-50 min-h-screen">
    <!-- Header + bouton ajouter -->
    <div class="flex flex-col gap-6 mb-6">
      <h1 class="text-4xl font-bold text-purple-600 text-center">Liste des utilisateurs</h1>
      <div class="flex justify-start">
        <button
          @click="addUser"
          class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <font-awesome-icon icon="plus" />
          Ajouter un utilisateur
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center py-10 text-blue-500">
      <font-awesome-icon icon="spinner" class="animate-spin text-4xl mr-3" />
      <p class="text-xl">Chargement des utilisateurs...</p>
    </div>

    <!-- Erreur -->
    <div
      v-else-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
    >
      <strong>Erreur :</strong> {{ error }}
    </div>

    <!-- Tableau des utilisateurs -->
    <div v-else class="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Nom complet
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Email
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Téléphone
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Rôle
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Genre
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Statut matrimonial
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Pays
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in users" :key="user.id">
            <td class="px-6 py-4 whitespace-nowrap flex items-center">
              <font-awesome-icon :icon="'user'" class="h-10 w-10 text-gray-400 rounded-full mr-4" />
              <div>
                <div class="text-sm font-medium text-gray-900">
                  {{ user.first_name }} {{ user.last_name }}
                </div>
                <div class="text-sm text-gray-500">{{ user.name }}</div>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">{{ user.email }}</td>
            <td class="px-6 py-4 text-sm text-gray-500">{{ user.phone || 'N/A' }}</td>
            <td class="px-6 py-4">
              <span
                :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize',
                  { 'bg-blue-100 text-blue-800': user.role === 'custom' },
                  { 'bg-purple-100 text-purple-800': user.role === 'agent' },
                  { 'bg-orange-100 text-orange-800': user.role === 'admin' },
                ]"
              >
                {{ user.role }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500 capitalize">{{ user.gender || 'N/A' }}</td>
            <td class="px-6 py-4 text-sm text-gray-500 capitalize">
              {{ user.status_mat || 'N/A' }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-500 capitalize">
              {{ user.country_name || 'N/A' }}
            </td>
            <td class="px-6 py-4 flex gap-2">
              <button
                @click="editUser(user)"
                class="text-yellow-500 hover:text-yellow-700 text-2xl"
              >
                <font-awesome-icon icon="edit" />
              </button>
              <button @click="deleteUser(user.id)" class="text-red-500 hover:text-red-700 text-2xl">
                <font-awesome-icon icon="trash" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-if="users.length === 0" class="text-center text-gray-500 py-8">
        Aucun utilisateur trouvé.
      </p>
    </div>
  </div>
</template>
