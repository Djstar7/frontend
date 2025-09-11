<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSpinner, faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'
import type { VisaType } from '@/types/visa'
import { useVisaTypeStore } from '@/stores/visaTypeStore'
import 'vue3-toastify/dist/index.css'
import { toastError, toastInfo, toastSuccess } from '@/utils/toastConfig'

// Ajout des icônes
library.add(faSpinner, faEdit, faTrash, faPlus)

const visaTypes = ref<VisaType[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

const visaTypeStore = useVisaTypeStore()

// ✅ Fetch visa types avec gestion loading, erreur et toast
const fetchVisaTypes = async () => {
  isLoading.value = true
  error.value = null

  try {
    const res = await visaTypeStore.getVisaType()
    visaTypes.value = res?.visatypes ?? []
    toastSuccess(res?.message || 'Types de visa chargés avec succès')
  } catch (err: any) {
    console.error('Erreur lors du chargement des types de visa:', err)
    error.value = 'Impossible de charger les types de visa. Veuillez réessayer plus tard.'
    toastError(err.response?.data?.message || error.value)
  } finally {
    isLoading.value = false
  }
}

// Actions pour l'interface
const addVisaType = () => {
  toastInfo('Ajouter un nouveau type de visa (fonction à implémenter)')
}
const editVisaType = (visaType: VisaType) => {
  toastInfo(`Éditer le type de visa ${visaType.name} (fonction à implémenter)`)
}
const deleteVisaType = async (id: number) => {
  try {
    const res = await visaTypeStore.deleteVisaType(id)
    visaTypes.value = visaTypes.value.filter((v) => v.id !== id)
    toastSuccess(res?.message || 'Type de visa supprimé avec succès')
  } catch (err: any) {
    console.error('Erreur lors de la suppression du type de visa:', err)
    toastError(err.response?.data?.message || 'Impossible de supprimer ce type de visa')
  }
}

onMounted(fetchVisaTypes)
</script>

<template>
  <div class="p-6 w-full bg-gray-50 min-h-screen">
    <!-- Header + bouton ajouter -->
    <div class="flex flex-col gap-6 mb-6">
      <h1 class="text-4xl font-bold text-orange-400 text-center">Liste des types de visa</h1>
      <div class="flex justify-start">
        <button
          @click="addVisaType"
          class="flex items-center gap-2 bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-lg"
        >
          <font-awesome-icon icon="plus" />
          Ajouter un type de visa
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center py-10 text-orange-400">
      <font-awesome-icon icon="spinner" class="animate-spin text-4xl mr-3" />
      <p class="text-xl">Chargement des types de visa...</p>
    </div>

    <!-- Erreur -->
    <div
      v-else-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
    >
      <strong>Erreur :</strong> {{ error }}
    </div>

    <!-- Tableau des types de visa -->
    <div v-else class="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Nom du type
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Description
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="visaType in visaTypes" :key="visaType.id">
            <td class="px-6 py-4 text-sm text-gray-900">{{ visaType.name }}</td>
            <td class="px-6 py-4 text-sm text-gray-500">{{ visaType.description || 'N/A' }}</td>
            <td class="px-6 py-4 flex gap-2">
              <button
                @click="editVisaType(visaType)"
                class="text-yellow-500 hover:text-yellow-700 text-2xl"
              >
                <font-awesome-icon icon="edit" />
              </button>
              <button
                @click="deleteVisaType(visaType.id!)"
                class="text-red-500 hover:text-red-700 text-2xl"
              >
                <font-awesome-icon icon="trash" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-if="visaTypes.length === 0" class="text-center text-gray-500 py-8">
        Aucun type de visa trouvé.
      </p>
    </div>
  </div>
</template>
